/* eslint-disable security/detect-object-injection */

'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */
const safeJsonStringify = require('safe-json-stringify'); // eslint-disable-line no-unused-vars
const moment = require('moment');
/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseMiddleware = require('plantworks-base-middleware').PlantWorksBaseMiddleware;
const PlantWorksMiddlewareError = require('plantworks-middleware-error').PlantWorksMiddlewareError;

/**
 * @class   DataProcessorManager
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Server DataProcessorManager middleware - updates processor instances in the processor tables and the cache.
 *
 *
 */
class DataProcessorManager extends PlantWorksBaseMiddleware {
	// #region Constructor
	constructor(parent, loader) {
		super(parent, loader);
	}
	// #endregion

	// #region startup/teardown code
	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof DataProcessorManager
	 * @name     _setup
	 *
	 * @returns  {null} Nothing.
	 *
	 * @summary  Sets up the broker to manage API exposed by other modules.
	 */
	async _setup() {
		try {
			await super._setup();
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
	 * @memberof ApiService
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Deletes the broker that manages API.
	 */
	async _teardown() {
		await super._teardown();
		return null;
	}
	// #endregion

	// #region Protected methods
	async _registerApis() {
		try {
			const ApiService = this.$dependencies.ApiService;
			await super._registerApis();

			await ApiService.add(`${this.name}::_getCachedArtifacts`, this._getCachedArtifacts.bind(this));
			await ApiService.add(`${this.name}::_updateRenderedProcessor`, this._updateRenderedProcessor.bind(this));

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_registerApis`, err);
		}
	}

	async _deregisterApis() {
		try {
			const ApiService = this.$dependencies.ApiService;

			await ApiService.remove(`${this.name}::_updateRenderedProcessor`, this._updateRenderedProcessor.bind(this));
			await ApiService.remove(`${this.name}::_getCachedArtifacts`, this._getCachedArtifacts.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
		/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof DataProcessorManager
	 * @name     _getCachedArtifacts
	 *
	 * @returns  {Array} cached artifacts dependent of the given entity.
	 *
	 * @summary  fetches cached artifacts dependent of the given entity.
	 */
	async _getCachedArtifacts(id, type) {

		if(!['machine', 'line', 'panel', 'hdash', 'report', 'alert', 'attrSet', 'ealert'].includes(type))
			throw new Error(`Unknow Type ${type}`);

		if(type === 'attrSet')
			return [`plantworks!attribute!set!rendered!${id}`];

		const dependantArtifacts = [`plantworks!${type}!rendered!${id}`];

		if(type === 'machine')
			dependantArtifacts.push(`plantworks!machine!timeextractorfuction!${id}`);
		return dependantArtifacts;
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof DataProcessorManager
	 * @name     _updateRenderedProcessor
	 *
	 * @returns  {undefined} Nothing
	 *
	 * @summary  generates new processor and inserts in processor table of the given entity.
	 */
	async _updateRenderedProcessor(id, type, tenantId) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const evaluatorFactory = require('evaluator-factory');
			let processorTable;
			let idColumn;
			let hooks = [];
			let entityTable;

			if(type === 'machine') {
				entityTable = `tenant_plant_unit_${type}s`;
				processorTable = `tenant_plant_unit_${type}_processors`;
				idColumn = `tenant_plant_unit_${type}_id`;
				hooks = [
					'raw_data_transform_code',
					'processed_data_transform_code',
					'pre_realtime_push_transform_code',
					'availability_calculation_code',
					'performance_calculation_code',
					'quality_calculation_code',
					'is_custom_oee_calculation',
					'custom_oee_calculation_code'
				];
			}

			if(type === 'line') {
				entityTable = `tenant_plant_unit_${type}s`;
				processorTable = `tenant_plant_unit_${type}_processors`;
				idColumn = `tenant_plant_unit_${type}_id`;
				hooks = [
					'processed_data_transform_code',
					'pre_realtime_push_transform_code',
					'availability_calculation_code',
					'performance_calculation_code',
					'quality_calculation_code',
					'is_custom_oee_calculation',
					'custom_oee_calculation_code'
				];
			}

			if(type === 'panel') {
				entityTable = `tenant_${type}s`;
				processorTable = 'tenant_panel_processors';
				idColumn = 'tenant_panel_id';
				hooks = [
					'processed_data_transform_code',
					'pre_realtime_push_transform_code'
				];
			}

			if(type === 'hdash') {
				entityTable = `tenant_historical_dashboards`;
				processorTable = `tenant_historical_dashboard_processors`;
				idColumn = 'tenant_historical_dashboard_id';
				hooks = [
					'processed_data_transform_code'
				];
			}

			if(type === 'report') {
				entityTable = `tenant_${type}s`;
				processorTable = 'tenant_report_processors';
				idColumn = 'tenant_report_id';
				hooks = [
					'processed_data_transform_code'
				];
			}

			if(type === 'alert') {
				entityTable = `tenant_${type}s`;
				processorTable = 'tenant_alert_processors';
				idColumn = 'tenant_alert_id';
				hooks = [
					'processed_data_transform_code',
					'on_data_code',
					'on_event_code'
				];
			}

			if(type === 'ealert') {
				entityTable = `tenant_event_alerts`;
				processorTable = 'tenant_event_alert_processors';
				idColumn = 'tenant_event_alert_id';
				hooks = [
					'processed_data_transform_code',
					'on_event_code'
				];
			}

			if(!entityTable)
				throw new Error(`Unknown Entity Type ${type}`);

			const renderedEvaluator = await evaluatorFactory.renderEvaluatorString({
				'id': id,
				'type': type,
				'database': this.$dependencies.DatabaseService
			});
			const entity = await dbSrvc.knex.raw(`SELECT id FROM ${entityTable} WHERE id = ? AND tenant_id = ?`, [id, tenantId]);

			if(!entity || !entity.rows || !entity.rows.length) {
				this.$dependencies.LoggerService.debug(`${this.name}::_updateRenderedProcessor ${type}:${id} does not exists`);
				return;
			}

			const now = moment().format();
			await dbSrvc.knex.transaction(async function(trx) {
				try {
					let previousRecordId = await trx.raw(`UPDATE ${processorTable} SET effectivity_end = ? WHERE ${idColumn} = ? AND tenant_id = ? AND effectivity_end IS NULL AND effectivity_start IS NOT NULL RETURNING id`, [now, id, tenantId]);
					previousRecordId = previousRecordId.rows.shift();
					if(!previousRecordId) {
						await trx.raw(`INSERT INTO ${processorTable} (tenant_id, ${idColumn}, processor, effectivity_start, effectivity_end, publish_status) VALUES (?, ?, ?, ?, NULL, ?)`, [tenantId, id, renderedEvaluator, now, true]);
					}
					else {
						previousRecordId = previousRecordId['id'];
						await trx.raw(
`INSERT INTO ${processorTable} (
tenant_id,
${idColumn},
processor,
effectivity_start,
effectivity_end,
publish_status,
${hooks.join(',')}
)
SELECT
?,
?,
?,
?,
NULL,
?,
${hooks.join(',')}
FROM
${processorTable}
WHERE id = ?
;
						`, [tenantId, id, renderedEvaluator, now, true, previousRecordId]);
					}

					await trx.commit();
					this.$dependencies.LoggerService.debug(`${this.name}::_updateRenderedProcessor updated ${type}:${id}`);
				}
				catch(err) {
					await trx.rollback(err);
				}
			});
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateRenderedProcessor`, err);
		}
	}
	// #endregion

	// #region Properties
		/**
	 * @override
	 */
	get dependencies() {
		return ['LoggerService'].concat(super.dependencies);
	}
	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.middleware = DataProcessorManager;
