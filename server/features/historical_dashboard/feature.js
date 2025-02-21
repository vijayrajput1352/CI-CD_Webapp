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
 * @class   HistoricalDashboard
 * @extends {PlantWorksBaseFeature}
 * @classdesc The Plant.Works Web Application Server HistoricalDashboard feature - manages configuration/development for the HistoricalDashboards.
 *
 *
 */
class HistoricalDashboard extends PlantWorksBaseFeature {
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
	 * @memberof HistoricalDashboard
	 * @name     getDashboardDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Dashboard display stuff for this Feature.
	 *
	 * @summary  Everyone logged-in gets access.
	 */
	async getDashboardDisplayDetails(ctxt) {
		try {
			/* if(!ctxt.state.device.is('desktop'))
				return null;
			*/

			// Step 1: The basics...
			const rbacChecker = this._rbac('historical-dashboard-watch');
			await rbacChecker(ctxt);

			const settingsDisplay = await super.getDashboardDisplayDetails(ctxt);
			if(!settingsDisplay) return null;

			const mainDisplay = JSON.parse(safeJsonStringify(settingsDisplay));

			mainDisplay['attributes']['name'] = 'HistoricalDashboards';
			mainDisplay['attributes']['route'] = 'historical-dashboard.execute';
			mainDisplay['attributes']['dashboard_category'] = 'historical_dashboards';
			mainDisplay['attributes']['icon_type'] = 'mdi';
			mainDisplay['attributes']['icon_path'] = 'file-chart';
			mainDisplay['attributes']['display_order'] = '1';

			// Step 2: Get all the historical dashboards this user has access to
			const dbSrvc = this.$dependencies.DatabaseService;
			const userHistoricalDashboardList = await dbSrvc.knex.raw(`SELECT id, name FROM tenant_historical_dashboards WHERE tenant_id = ? AND id IN (SELECT tenant_historical_dashboard_id FROM tenant_historical_dashboards_users WHERE tenant_user_id IN (SELECT id FROM tenants_users WHERE user_id = ?)) ORDER BY name ASC`, [ctxt.state.tenant.tenant_id, ctxt.state.user.user_id]);
			const dashDisplay = userHistoricalDashboardList.rows.map((userHistoricalDashboard, idx) => {
				const thisDashDisplay = JSON.parse(safeJsonStringify(mainDisplay));

				thisDashDisplay['id'] = `${userHistoricalDashboard.id}-historical-dashboard`;
				thisDashDisplay['attributes']['name'] = userHistoricalDashboard.name;
				thisDashDisplay['attributes']['route_params'] = userHistoricalDashboard.id;
				thisDashDisplay['attributes']['display_order'] = idx;

				return thisDashDisplay;
			});

			return dashDisplay;
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
	 * @memberof HistoricalDashboard
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
	 * @memberof HistoricalDashboard
	 * @name     getConfigDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Config display stuff for this Feature.
	 *
	 * @summary  Plant / Unit -> Machine/Station configuration.
	 */
	async getConfigDisplayDetails(ctxt) { // eslint-disable-line no-unused-vars
		try {
			if(!ctxt.state.device.is('desktop'))
				return null;

			const rbacChecker = this._rbac('historical-dashboard-read');
			await rbacChecker(ctxt);

			let mainConfig = await super.getConfigDisplayDetails(ctxt);
			mainConfig = mainConfig ? JSON.parse(safeJsonStringify(mainConfig)) : null;

			if(!mainConfig) { // eslint-disable-line curly
				return null;
			}

			mainConfig['attributes']['name'] = 'HistoricalDashboard';
			mainConfig['attributes']['route'] = 'historical-dashboard';
			mainConfig['attributes']['data_url'] = '/historical-dashboard/config-tree-nodes';
			mainConfig['attributes']['icon_type'] = 'mdi';
			mainConfig['attributes']['icon_path'] = 'file-chart';
			mainConfig['attributes']['node_type'] = 'root-folder';

			const dbSrvc = this.$dependencies.DatabaseService;
			let parentFolderId = await dbSrvc.knex.raw(`SELECT id FROM tenant_folders WHERE tenant_id = ? AND name = 'historical_dashboard_feature.folder_names.root.name'`, [ctxt.state.tenant.tenant_id]);
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
	 * @memberof HistoricalDashboard
	 * @name     getDevEnvDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Config display stuff for this Feature.
	 *
	 * @summary  No display in the config itself.
	 */
	async getDevEnvDisplayDetails(ctxt) {
		try {
			if(!ctxt.state.device.is('desktop'))
				return null;

			const rbacChecker = this._rbac('historical-dashboard-read');
			await rbacChecker(ctxt);

			let mainConfig = await super.getDevEnvDisplayDetails(ctxt);
			mainConfig = mainConfig ? JSON.parse(safeJsonStringify(mainConfig)) : null;

			if(!mainConfig) { // eslint-disable-line curly
				return null;
			}

			mainConfig['attributes']['name'] = 'HistoricalDashboard';
			mainConfig['attributes']['route'] = 'historical-dashboard';
			mainConfig['attributes']['data_url'] = '/historical-dashboard/devenv-tree-nodes';
			mainConfig['attributes']['icon_type'] = 'mdi';
			mainConfig['attributes']['icon_path'] = 'file-chart';
			mainConfig['attributes']['node_type'] = 'root-folder';

			const dbSrvc = this.$dependencies.DatabaseService;
			let parentFolderId = await dbSrvc.knex.raw(`SELECT id FROM tenant_folders WHERE tenant_id = ? AND name = 'historical_dashboard_feature.folder_names.root.name'`, [ctxt.state.tenant.tenant_id]);
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
	 * @memberof HistoricalDashboard
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
	 * @memberof HistoricalDashboard
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
			const rbacChecker = this._rbac('historical-dashboard-watch');
			await rbacChecker(ctxt);

			let mainConfig = await super.getUserApplications(ctxt);
			mainConfig = mainConfig ? JSON.parse(safeJsonStringify(mainConfig)) : null;

			if(!mainConfig) { // eslint-disable-line curly
				return null;
			}

			const id = await this.$dependencies.ConfigurationService.getModuleID(this);

			// Step 2: Get all the historical dashboards this user has access to
			const dbSrvc = this.$dependencies.DatabaseService;
			const userHistoricalDashboardList = await dbSrvc.knex.raw(`SELECT name, id FROM tenant_historical_dashboards WHERE tenant_id = ? AND id IN (SELECT tenant_historical_dashboard_id FROM tenant_historical_dashboards_users WHERE tenant_user_id IN (SELECT id FROM tenants_users WHERE user_id = ?)) ORDER BY name ASC`, [ctxt.state.tenant.tenant_id, ctxt.state.user.user_id]);
			// eslint-disable-next-line curly
			if(!userHistoricalDashboardList.rows.length) {
				return null;
			}

			mainConfig['name'] = this.name;
			mainConfig['feature_id'] = id;
			mainConfig['route'] = 'historical-dashboard.execute';

			userHistoricalDashboardList.rows.forEach(element => {
				mainConfig.attributes.push(element);
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

	/**
	 * @override
	 */
	get dashboardRoute() {
		const route = 'historical-dashboard.execute';
		return route;
	}
	// #endregion
}

exports.feature = HistoricalDashboard;
