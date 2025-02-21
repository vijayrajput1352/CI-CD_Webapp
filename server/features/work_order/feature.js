'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */
const safeJsonStringify = require('safe-json-stringify'); // eslint-disable-line no-unused-vars

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseFeature = require('plantworks-base-feature').PlantWorksBaseFeature;
// const PlantWorksFeatureError = require('plantworks-feature-error').PlantWorksFeatureError;

/**
 * @class   WorkOrder
 * @extends {PlantWorksBaseFeature}
 * @classdesc The Plant.Works Web Application Server WorkOrder feature - manages configurtion/development for the WorkOrder floor.
 *
 *
 */
class WorkOrder extends PlantWorksBaseFeature {
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
	 * @memberof WorkOrder
	 * @name     getDashboardDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Dashboard display stuff for this Feature.
	 *
	 * @summary  Everyone logged-in gets access.
	 */
	async getDashboardDisplayDetails(ctxt) { // eslint-disable-line no-unused-vars
		try {
			if(!ctxt.state.device.is('desktop'))
				return null;

			const rbacChecker = this._rbac('work-order-read');
			await rbacChecker(ctxt);

			const settingsDisplay = await super.getDashboardDisplayDetails(ctxt);
			if(!settingsDisplay) return null;

			const mainDisplay = JSON.parse(safeJsonStringify(settingsDisplay));

			mainDisplay['attributes']['dashboard_category'] = 'applications';
			mainDisplay['attributes']['name'] = 'work order';
			mainDisplay['attributes']['route'] = 'work-order-app';
			mainDisplay['attributes']['icon_type'] = 'mdi';
			mainDisplay['attributes']['icon_path'] = 'floor-plan';
			mainDisplay['attributes']['display_order'] = '0';

			return mainDisplay;
		}
		catch(err) {
			return null;
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof WorkOrder
	 * @name     getSettingsDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Settings display stuff for this Feature.
	 *
	 * @summary  No display in the settings itself.
	 */
	async getSettingsDisplayDetails(ctxt) { // eslint-disable-line no-unused-vars
		return null;
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof WorkOrder
	 * @name     getConfigDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Config display stuff for this Feature.
	 *
	 * @summary  Plant / Unit -> Machine/Station configuration.
	 */
	async getConfigDisplayDetails(ctxt) {
		try {
			if(!ctxt.state.device.is('desktop'))
				return null;

			const rbacChecker = this._rbac('work-order-read');
			await rbacChecker(ctxt);

			let mainConfig = await super.getConfigDisplayDetails(ctxt);
			mainConfig = mainConfig ? JSON.parse(safeJsonStringify(mainConfig)) : null;

			if(!mainConfig) { // eslint-disable-line curly
				return null;
			}

			mainConfig['attributes']['name'] = 'work-order';
			mainConfig['attributes']['route'] = 'work-order';
			mainConfig['attributes']['data_url'] = '/work-order/tree-nodes';
			mainConfig['attributes']['icon_type'] = 'mdi';
			mainConfig['attributes']['icon_path'] = 'floor-plan';
			mainConfig['attributes']['node_type'] = 'root-folder';

			const dbSrvc = this.$dependencies.DatabaseService;
			let parentFolderId = await dbSrvc.knex.raw(`SELECT id FROM tenant_folders WHERE tenant_id = ? AND name = 'work_order_feature.folder_names.root.name'`, [ctxt.state.tenant.tenant_id]);
			parentFolderId = parentFolderId.rows[0]['id'];

			if(parentFolderId) { // eslint-disable-line curly
				mainConfig['id'] = parentFolderId;
			}

			return mainConfig;
		}
		catch(err) {
			return null;
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof WorkOrder
	 * @name     getDevEnvDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Config display stuff for this Feature.
	 *
	 * @summary  No display in the config itself.
	 */
	async getDevEnvDisplayDetails(ctxt) { // eslint-disable-line no-unused-vars
		try {
			if(!ctxt.state.device.is('desktop'))
				return null;

			const rbacChecker = this._rbac('work-order-read');
			await rbacChecker(ctxt);

			let mainConfig = await super.getDevEnvDisplayDetails(ctxt);
			mainConfig = mainConfig ? JSON.parse(safeJsonStringify(mainConfig)) : null;

			if(!mainConfig) { // eslint-disable-line curly
				return null;
			}

			mainConfig['attributes']['name'] = 'work-order';
			mainConfig['attributes']['route'] = 'work-order';
			mainConfig['attributes']['data_url'] = '/work-order/tree-nodes';
			mainConfig['attributes']['icon_type'] = 'mdi';
			mainConfig['attributes']['icon_path'] = 'floor-plan';
			mainConfig['attributes']['node_type'] = 'root-folder';

			const dbSrvc = this.$dependencies.DatabaseService;
			let parentFolderId = await dbSrvc.knex.raw(`SELECT id FROM tenant_folders WHERE tenant_id = ? AND name = 'work_order_feature.folder_names.root.name'`, [ctxt.state.tenant.tenant_id]);
			parentFolderId = parentFolderId.rows[0]['id'];

			if(parentFolderId) { // eslint-disable-line curly
				mainConfig['id'] = parentFolderId;
			}

			return mainConfig;
		}
		catch(err) {
			return null;
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof WorkOrder
	 * @name     getScheduleDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Schedule display stuff for this Feature.
	 *
	 * @summary  No display in the schedule itself.
	 */
	async getScheduleDisplayDetails(ctxt) { // eslint-disable-line no-unused-vars
		return null;
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof WorkOrder
	 * @name     getUserApplications
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Availible Apps for this Feature.
	 *
	 * @summary  Derived classes should return details, or null - depending on availible apps for each feature.
	 */
	// eslint-disable-next-line no-unused-vars
	async getUserApplications(ctxt) {
		try {
			const rbacChecker = this._rbac('work-order-read');
			await rbacChecker(ctxt);

			let mainConfig = await super.getUserApplications(ctxt);
			mainConfig = mainConfig ? JSON.parse(safeJsonStringify(mainConfig)) : null;

			if(!mainConfig) { // eslint-disable-line curly
				return null;
			}

			const id = await this.$dependencies.ConfigurationService.getModuleID(this);

			mainConfig['name'] = this.name;
			mainConfig['feature_id'] = id;
			mainConfig.attributes.push({
				'name': 'default',
				'id': id
			});

			return mainConfig;
		}
		catch(err) {
			return null;
		}
	}

	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.feature = WorkOrder;
