'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */
const safeJsonStringify = require('safe-json-stringify'); // eslint-disable-line no-unused-vars
const moment = require('moment');
// In minutes
const backlogThreshold = 15;

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseComponent = require('plantworks-base-component').PlantWorksBaseComponent;
const PlantWorksCompError = require('plantworks-component-error').PlantWorksComponentError;
const path = require('path');

/**
 * @class   Incoming
 * @extends {PlantWorksBaseComponent}
 * @classdesc The Plant.Works Web Application Server Incoming component - exposes a read-only view of the master data in Plant.Works.
 *
 *
 */
class Incoming extends PlantWorksBaseComponent {
	// #region Constructor
	constructor(parent, loader) {
		super(parent, loader);
	}
	// #endregion

	// #region Protected methods - need to be overriden by derived classes
	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof Incoming
	 * @name     _addRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds routes to the Koa Router.
	 */
	async _addRoutes() {
		try {
			this.$router.post('/bulkdata', this._processIncomingBulkData.bind(this));
			this.$router.post('/data/:machine_id', this._processIncomingMachineData.bind(this));

			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksCompError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _processIncomingBulkData(ctxt) {
		try {
			const now = moment();
			const cacheSrvc = this.$dependencies.CacheService;
			const dbSrvc = this.$dependencies.DatabaseService;
			const pubsubSrvc = this.$dependencies.PubsubService;

			const incomingData = ctxt.request.body.split('\n\t\n');

			const machineData = incomingData.map((incomingDatum) => {
				let machineId = null;
				const dataPoints = incomingDatum
					.split(',')
					.filter((dataPoint) => {
						if(dataPoint.indexOf('MACHINE_ID') < 0)
							return true;

						machineId = dataPoint.split(':')[1];
						return false;
					})
					.join(',');

				return {
					'id': machineId,
					'type': 'machine',
					'data': dataPoints
				};
			})
			.filter((machineDatum) => {
				return !!machineDatum.id;
			});

			for(let idx = 0; idx < machineData.length; idx++) {
				const machineDatum = machineData[idx]; // eslint-disable-line security/detect-object-injection

				let isValidMachine = await cacheSrvc.getAsync(`plantworks!machine!rendered!${machineDatum.id}`);
				if(!isValidMachine) {
					isValidMachine = await dbSrvc.knex.raw('SELECT name FROM tenant_plant_unit_machines WHERE id = ?', [machineDatum.id]);
					isValidMachine = isValidMachine.rows.length && !!isValidMachine.rows[0]['name'];
				}
				if(!isValidMachine) continue;

				const machineTimestamp = await this._determineMachineTimestamp(machineDatum);
				// If data is older than backlogThreshold, send it to backlog queue
				const queueName = now.diff(machineTimestamp, 'minutes') >= backlogThreshold ? 'DATA.BACKLOG' : 'DATA.STREAM';

				machineDatum['currentTimestamp'] = moment(machineTimestamp).valueOf();

				const publishData = safeJsonStringify(machineDatum);
				await pubsubSrvc.publish('plantworks-data-stream', queueName, publishData);

				const rerouteMachinesMap = this.$config.rerouteMachinesMap || {};
				const machineIdArr = rerouteMachinesMap[machineDatum.id];

				if(machineIdArr)
					for(let i = 0; i < machineIdArr.length; i++) {
						// eslint-disable-next-line security/detect-object-injection
						machineDatum.id = machineIdArr[i];
						const additionalData = safeJsonStringify(machineDatum);
						await pubsubSrvc.publish('plantworks-data-stream', queueName, additionalData);
					}
			}

			ctxt.status = 200;
			ctxt.body = {'status': 200};
		}
		catch(err) {
			throw new PlantWorksCompError(`${this.name}::_processIncomingBulkData error`, err);
		}
	}

	async _processIncomingMachineData(ctxt) {
		try {
			const cacheSrvc = this.$dependencies.CacheService;
			const pubsubSrvc = this.$dependencies.PubsubService;

			let isValidMachine = await cacheSrvc.getAsync(`plantworks!machine!rendered!${ctxt.params['machine_id']}`);

			if(!isValidMachine) {
				const dbSrvc = this.$dependencies.DatabaseService;
				isValidMachine = await dbSrvc.knex.raw('SELECT name FROM tenant_plant_unit_machines WHERE id = ?', [ctxt.params.machine_id]);
				isValidMachine = isValidMachine.rows.length && !!isValidMachine.rows[0]['name'];
			}

			if(!isValidMachine) { // eslint-disable-line curly
				throw new Error(`Invalid Machine: ${ctxt.params['machine_id']}`);
			}

			const machineData = {
				'id': ctxt.params['machine_id'],
				'type': 'machine',
				'data': ctxt.request.body
			};

			const machineTimestamp = await this._determineMachineTimestamp(machineData);
			const sendToBacklog = moment().diff(machineTimestamp, 'minutes') >= backlogThreshold;
			// If data is older than backlogThreshold, send it to backlog queue
			const queueName = sendToBacklog ? 'DATA.BACKLOG' : 'DATA.STREAM';

			machineData['currentTimestamp'] = moment(machineTimestamp).valueOf();
			try {
				await pubsubSrvc.publish('plantworks-data-stream', queueName, safeJsonStringify(machineData));
				this._publishToAudit(machineData, machineTimestamp, null);
			}
			catch(err) {
				this._publishToAudit(machineData, machineTimestamp, err.toString());
				throw err;
			}

			const rerouteMachinesMap = this.$config.rerouteMachinesMap || {};
			const machineIdArr = rerouteMachinesMap[ctxt.params['machine_id']];

			if(machineIdArr)
				for(let i = 0; i < machineIdArr.length; i++) {
					// eslint-disable-next-line security/detect-object-injection
					const machineId = machineIdArr[i];
					const additionalData = safeJsonStringify({
						'id': machineId,
						'type': 'machine',
						'data': ctxt.request.body,
						'currentTimestamp': moment(machineTimestamp).valueOf()
					});

					try {
						await pubsubSrvc.publish('plantworks-data-stream', queueName, additionalData);
						this._publishToAudit(additionalData, machineTimestamp, null);
					}
					catch(err) {
						this._publishToAudit(machineData, machineTimestamp, err.toString());
						throw err;
					}
				}

			ctxt.status = 200;
			ctxt.body = {'status': 200};

		}
		catch(err) {
			throw new PlantWorksCompError(`${this.name}::_processIncomingMachineData error`, err);
		}
	}
	// #endregion

	// #region Private Methods
	async _publishToAudit(machineData, timestamp, errorString) {
		try {
			if(!timestamp)
				throw new Error('Timestamp not found');

			const payload = {
				'currentTimestamp': timestamp,
				'errorState': errorString,
				'id': machineData['id'],
				'type': 'machine'
			};

			const publishTopic = errorString ? 'WEBSERVER.INCOMING.AUDIT.ERROR' : 'WEBSERVER.INCOMING.AUDIT.LOG';
			await this.$dependencies.PubsubService.publish('plantworks-audit', publishTopic, safeJsonStringify(payload));
		}
		catch(err) {
			const error = new PlantWorksCompError(`${this.name}::_publishToAudit error`, err);
			this.$dependencies.LoggerService.debug(error.toString());
		}
	}

	async _determineMachineTimestamp(machineData) {
		try {
			const requireFromString = require('require-from-string');
			const cacheKey = `plantworks!machine!timeextractorfuction!${machineData.id}`;
			// Determine timeestamp
			let timeExtractor = await this.$dependencies.CacheService.getAsync(cacheKey);
			if(!timeExtractor) {
				timeExtractor = await this._generateTimeExtractor(machineData['id']);
				await this.$dependencies.CacheService.setAsync(cacheKey, timeExtractor);
			}

			timeExtractor = requireFromString(timeExtractor);

			const timestamp = await timeExtractor(machineData.data);
			return timestamp;
		}
		catch(err) {
			throw new PlantWorksCompError(`${this.name}::_publishToAudit error`, err);
		}
	}

	async _generateTimeExtractor(machineId) {
		try {
			const defaultFunction = `
				module.exports = async () => {return null;};
			`;

			// Step 1: get attribute set metadata
			let attributeSetMetadata = await this.$dependencies.DatabaseService.knex.raw(`SELECT attribute_set_metadata FROM tenant_plant_unit_machines WHERE id = ?`, [machineId]);

			if(!attributeSetMetadata || !attributeSetMetadata.rows || !attributeSetMetadata.rows.length)
				return defaultFunction;

			attributeSetMetadata = attributeSetMetadata.rows[0]['attribute_set_metadata'];

			let timestampParameterMetadata = attributeSetMetadata.filter((paramMetadata) => {
				return paramMetadata['is_timestamp'] && paramMetadata['parameter_id'];
			});

			if(!timestampParameterMetadata || !timestampParameterMetadata.length)
				return defaultFunction;

			timestampParameterMetadata = timestampParameterMetadata.shift();

			// Step 2: get timestamp parameter
			const timestampProperty = await this.$dependencies.DatabaseService.knex.raw(`SELECT internal_tag, timestamp_format FROM tenant_attribute_set_properties WHERE id = ?`, timestampParameterMetadata['parameter_id']);

			if(!timestampProperty || !timestampProperty.rows || !timestampProperty.rows.length)
				return defaultFunction;

			const timestampTag = timestampProperty.rows[0]['internal_tag'];
			const timestampFormat = timestampProperty.rows[0]['timestamp_format'];

			// Step 3: get latest raw data transformer
			let rawDataTransformCode = await this.$dependencies.DatabaseService.knex.raw(`SELECT raw_data_transform_code FROM tenant_plant_unit_machine_processors WHERE tenant_plant_unit_machine_id = ? AND publish_status = ? AND effectivity_end IS NULL`, [
				machineId,
				true
			]);

			if(rawDataTransformCode && rawDataTransformCode.rows && rawDataTransformCode.rows.length)
				rawDataTransformCode = rawDataTransformCode.rows[0]['raw_data_transform_code'];
			else
				rawDataTransformCode = null;

			if(!rawDataTransformCode || (typeof rawDataTransformCode !== 'string') || rawDataTransformCode.trim() === '')
				rawDataTransformCode = `
				const dict = {};

				currentData.split(',').forEach((keyValPair) => {
				keyValPair = keyValPair.trim();
				if(keyValPair === '') return;

				const keyVal = keyValPair.split(':');
				if(keyVal.length !== 2) return;
				if(keyVal[0].trim() === '') return;

				dict[keyVal[0].trim()] = keyVal[1].trim();
				});

				return dict;
				`;


			// Step 4: render extractor
			const promises = require('bluebird');
			const ejs = promises.promisifyAll(require('ejs'));
			const tmplPath = path.join(__dirname, './templates/time_extractor.ejs');

			const timeExtractor = await ejs.renderFileAsync(tmplPath, {
				'rawDataTransform': rawDataTransformCode,
				'timestampTag': timestampTag,
				'timestampFormat': timestampFormat
			}, {
				'cache': false,
				'strict': false
			});

			return timeExtractor;
		}
		catch(err) {
			throw new PlantWorksCompError(`${this.name}::_generateTimeExtractor error`, err);
		}
	}

	// #endregion
	// #region Properties
	/**
	 * @override
	 */
	get dependencies() {
		return ['DatabaseService', 'PubsubService', 'LoggerService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.component = Incoming;
