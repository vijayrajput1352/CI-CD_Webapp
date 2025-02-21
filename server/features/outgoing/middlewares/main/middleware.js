/* eslint-disable security/detect-object-injection */

'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseMiddleware = require('plantworks-base-middleware').PlantWorksBaseMiddleware;
const PlantWorksMiddlewareError = require('plantworks-middleware-error').PlantWorksMiddlewareError;

/**
 * @class   Main
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Server Outgoing Feature Main middleware - manages streaming data to browsers, etc..
 *
 *
 */
class Main extends PlantWorksBaseMiddleware {
	// #region Constructor
	constructor(parent, loader) {
		super(parent, loader);
	}
	// #endregion

	// #region Lifecycle hooks
	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof Main
	 * @name     _setup
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Registers the API with the ApiService.
	 */
	async _setup() {
		try {
			await super._setup();

			const websocketSrvc = this.$dependencies.WebsocketService;
			websocketSrvc.on('websocket-connect', this._listenToSpark.bind(this));

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_setup error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof Main
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  De-registers the API with the ApiService.
	 */
	async _teardown() {
		try {
			const websocketSrvc = this.$dependencies.WebsocketService;
			websocketSrvc.off('websocket-connect', this._listenToSpark.bind(this));

			await super._teardown();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_teardown error`, err);
		}
	}
	// #endregion

	// #region Protected methods
	async _registerApis() {
		try {
			const ApiService = this.$dependencies.ApiService;

			await ApiService.add(`${this.name}::getTree`, this._getTree.bind(this));
			await super._registerApis();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_registerApis`, err);
		}
	}

	async _deregisterApis() {
		try {
			const ApiService = this.$dependencies.ApiService;

			await ApiService.remove(`${this.name}::getTree`, this._getTree.bind(this));
			await super._deregisterApis();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getTree(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			let treeNodes = [];

			if(ctxt.query.id !== '#')
				return treeNodes;


			let plants = await dbSrvc.knex.raw(`SELECT id, name FROM tenant_plants WHERE tenant_id = ?`, [ctxt.state.tenant.tenant_id]);
			plants = plants.rows.map((plant) => {
				return {
					'id': plant.id,
					'parent': ctxt.query.id,
					'text': plant.name,

					'li_attr': {
						'title': plant.name
					},

					'data': {
						'type': 'plant'
					}
				};
			});

			treeNodes = treeNodes.concat(plants);
			for(let idx = 0; idx < plants.length; idx++) { // eslint-disable-line curly
				await this._getPlantUnits(plants[idx]['id'], treeNodes);
			}

			return treeNodes;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTree`, err);
		}
	}
	// #endregion

	// #region Private Methods
	async _getPlantUnits(plantId, treeNodes) {
		const dbSrvc = this.$dependencies.DatabaseService;

		const plantUnits = await dbSrvc.knex.raw(`SELECT id, name FROM tenant_plant_units WHERE (tenant_plant_id = ? OR parent_id = ?)`, [plantId, plantId]);
		for(let idx = 0; idx < plantUnits.rows.length; idx++) {
			const plantUnit = plantUnits.rows[idx];
			treeNodes.push({
				'id': plantUnit.id,
				'parent': plantId,
				'text': plantUnit.name,

				'li_attr': {
					'title': plantUnit.name
				},

				'data': {
					'type': 'plant-unit'
				}
			});

			treeNodes.push({
				'id': `${plantUnit.id}-machines`,
				'parent': plantUnit.id,
				'text': 'Machines',

				'li_attr': {
					'title': `Machine`
				},

				'data': {
					'type': 'plant-unit-machine-folder'
				}
			});

			treeNodes.push({
				'id': `${plantUnit.id}-lines`,
				'parent': plantUnit.id,
				'text': 'Processes',

				'li_attr': {
					'title': 'Process'
				},

				'data': {
					'type': 'plant-unit-line-folder'
				}
			});
		}

		for(let idx = 0; idx < plantUnits.rows.length; idx++) {
			const plantUnit = plantUnits.rows[idx];
			await this._getPlantUnits(plantUnit.id, treeNodes);
			await this._getPlantUnitMachines(plantUnit.id, treeNodes);
			await this._getPlantUnitLines(plantUnit.id, treeNodes);
		}
	}

	async _getPlantUnitMachines(plantUnitId, treeNodes) {
		const dbSrvc = this.$dependencies.DatabaseService;

		const plantUnitMachines = await dbSrvc.knex.raw(`SELECT id, name FROM tenant_plant_unit_machines WHERE tenant_plant_unit_id = ?`, [plantUnitId]);
		for(let idx = 0; idx < plantUnitMachines.rows.length; idx++) {
			const plantUnitMachine = plantUnitMachines.rows[idx];
			treeNodes.push({
				'id': plantUnitMachine.id,
				'parent': `${plantUnitId}-machines`,
				'text': plantUnitMachine.name,

				'li_attr': {
					'title': plantUnitMachine.name
				},

				'data': {
					'type': 'machine'
				}
			});
		}
	}

	async _getPlantUnitLines(plantUnitId, treeNodes) {
		const dbSrvc = this.$dependencies.DatabaseService;

		const plantUnitLines = await dbSrvc.knex.raw(`SELECT id, name FROM tenant_plant_unit_Lines WHERE tenant_plant_unit_id = ?`, [plantUnitId]);
		for(let idx = 0; idx < plantUnitLines.rows.length; idx++) {
			const plantUnitLine = plantUnitLines.rows[idx];
			treeNodes.push({
				'id': plantUnitLine.id,
				'parent': `${plantUnitId}-lines`,
				'text': plantUnitLine.name,

				'li_attr': {
					'title': plantUnitLine.name
				},

				'data': {
					'type': 'line'
				}
			});
		}
	}

	async _listenToSpark(spark) {
		spark.on('data', this._processSparkMessage.bind(this, spark));
	}

	async _processSparkMessage(spark, data) {
		const cacheSrvc = this.$dependencies.CacheService;
		const pubsubSrvc = this.$dependencies.PubsubService;
		const websocketSrvc = this.$dependencies.WebsocketService;

		let latestData = null;

		switch (data.action) {
			case 'subscribe':
				latestData = await cacheSrvc.getAsync(`${data.type}!current!state!${data.id}`);

				if(websocketSrvc.room(`outgoing!${data.type}!data!${data.id}`).clients().length === 0) { // eslint-disable-line curly
					await pubsubSrvc.subscribe('plantworks-realtime-push', `REALTIME.PUSH.${data.id}`, this._pushDataToSpark.bind(this));
				}

				spark.join(`outgoing!${data.type}!data!${data.id}`);
				spark.write({
					'channel': 'streaming-data',
					'data': JSON.parse(latestData)
				});
				break;

			case 'unsubscribe':
				spark.leave(`outgoing!${data.type}!data!${data.id}`);
				if(websocketSrvc.room(`outgoing!${data.type}!data!${data.id}`).clients().length === 0) { // eslint-disable-line curly
					await pubsubSrvc.unsubscribe('plantworks-realtime-push', `REALTIME.PUSH.${data.id}`, this._pushDataToSpark.bind(this));
				}
				break;

			default:
				break;
		}
	}

	async _pushDataToSpark(channel, message) {
		message = JSON.parse(message);
		channel = channel.replace('REALTIME.PUSH.', `outgoing!${message.type}!data!`);

		const websocketSrvc = this.$dependencies.WebsocketService;
		websocketSrvc.room(channel).write({
			'channel': 'streaming-data',
			'data': message.data
		});
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get dependencies() {
		return ['PubsubService', 'WebsocketService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.middleware = Main;
