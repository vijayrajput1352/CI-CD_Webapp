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
 * @class   Manufacturing
 * @extends {PlantWorksBaseFeature}
 * @classdesc The Plant.Works Web Application Server Manufacturing feature - manages configurtion/development for the manufacturing floor.
 *
 *
 */
class Manufacturing extends PlantWorksBaseFeature {
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
	 * @memberof Manufacturing
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
			// Step 1: The basics...
			const rbacChecker = this._rbac('manufacturing-read');
			await rbacChecker(ctxt);

			const settingsDisplay = await super.getDashboardDisplayDetails(ctxt);
			if(!settingsDisplay) return null;

			const mainDisplay = JSON.parse(safeJsonStringify(settingsDisplay));

			mainDisplay['attributes']['name'] = 'Stations';
			mainDisplay['attributes']['route'] = 'manufacturing.watch';
			mainDisplay['attributes']['dashboard_category'] = ctxt.state.device.is('desktop') ? 'manufacturing_stations' : 'applications';
			mainDisplay['attributes']['icon_type'] = 'md';
			mainDisplay['attributes']['icon_path'] = 'event_seat';
			mainDisplay['attributes']['display_order'] = '0';

			// Step 2: Get all the stations this user has access to
			const dbSrvc = this.$dependencies.DatabaseService;
			const userStationList = await dbSrvc.knex.raw(`SELECT id, name FROM tenant_plant_unit_stations WHERE tenant_id = ? AND id IN (SELECT tenant_plant_unit_station_id FROM tenant_plant_unit_stations_users WHERE tenant_user_id IN (SELECT id FROM tenants_users WHERE user_id = ?)) ORDER BY name ASC`, [ctxt.state.tenant.tenant_id, ctxt.state.user.user_id]);
			const stationDisplay = userStationList.rows.map((userStation, idx) => {
				const thisStationDisplay = JSON.parse(safeJsonStringify(mainDisplay));

				thisStationDisplay['id'] = `${userStation.id}-dashboard`;
				thisStationDisplay['attributes']['name'] = userStation.name;
				thisStationDisplay['attributes']['route_params'] = userStation.id;
				thisStationDisplay['attributes']['display_order'] = idx;

				return thisStationDisplay;
			});

			return stationDisplay;
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
	 * @memberof Manufacturing
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
	 * @memberof Manufacturing
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

			const rbacChecker = this._rbac('manufacturing-read');
			await rbacChecker(ctxt);

			let mainConfig = await super.getConfigDisplayDetails(ctxt);
			mainConfig = mainConfig ? JSON.parse(safeJsonStringify(mainConfig)) : null;

			if(!mainConfig) { // eslint-disable-line curly
				return null;
			}

			mainConfig['attributes']['name'] = 'Manufacturing';
			mainConfig['attributes']['route'] = 'manufacturing';
			mainConfig['attributes']['data_url'] = '/manufacturing/config-tree-nodes';
			mainConfig['attributes']['icon_type'] = 'mdi';
			mainConfig['attributes']['icon_path'] = 'pac-man';
			mainConfig['attributes']['node_type'] = 'root-folder';

			const dbSrvc = this.$dependencies.DatabaseService;
			let parentFolderId = await dbSrvc.knex.raw(`SELECT id FROM tenant_folders WHERE tenant_id = ? AND name = 'manufacturing_feature.folder_names.root.name'`, [ctxt.state.tenant.tenant_id]);
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
	 * @memberof Manufacturing
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

			const rbacChecker = this._rbac('manufacturing-read');
			await rbacChecker(ctxt);

			let mainConfig = await super.getDevEnvDisplayDetails(ctxt);
			mainConfig = mainConfig ? JSON.parse(safeJsonStringify(mainConfig)) : null;

			if(!mainConfig) { // eslint-disable-line curly
				return null;
			}

			mainConfig['attributes']['name'] = 'Manufacturing';
			mainConfig['attributes']['route'] = 'manufacturing';
			mainConfig['attributes']['data_url'] = '/manufacturing/devenv-tree-nodes';
			mainConfig['attributes']['icon_type'] = 'mdi';
			mainConfig['attributes']['icon_path'] = 'pac-man';
			mainConfig['attributes']['node_type'] = 'root-folder';

			const dbSrvc = this.$dependencies.DatabaseService;
			let parentFolderId = await dbSrvc.knex.raw(`SELECT id FROM tenant_folders WHERE tenant_id = ? AND name = 'manufacturing_feature.folder_names.root.name'`, [ctxt.state.tenant.tenant_id]);
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
	 * @memberof Manufacturing
	 * @name     getScheduleDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Schedule display stuff for this Feature.
	 *
	 * @summary  No display in the schedule itself.
	 */
	async getScheduleDisplayDetails(ctxt) {
		try {
			if(!ctxt.state.device.is('desktop'))
				return null;

			const rbacChecker = this._rbac('manufacturing-read');
			await rbacChecker(ctxt);

			let mainConfig = await super.getScheduleDisplayDetails(ctxt);
			mainConfig = mainConfig ? JSON.parse(safeJsonStringify(mainConfig)) : null;

			if(!mainConfig) { // eslint-disable-line curly
				return null;
			}

			mainConfig['attributes']['name'] = 'Manufacturing';
			mainConfig['attributes']['route'] = 'manufacturing';
			mainConfig['attributes']['data_url'] = '/manufacturing/schedule-tree-nodes';
			mainConfig['attributes']['icon_type'] = 'mdi';
			mainConfig['attributes']['icon_path'] = 'pac-man';
			mainConfig['attributes']['node_type'] = 'root-folder';

			const dbSrvc = this.$dependencies.DatabaseService;
			let parentFolderId = await dbSrvc.knex.raw(`SELECT id FROM tenant_folders WHERE tenant_id = ? AND name = 'manufacturing_feature.folder_names.root.name'`, [ctxt.state.tenant.tenant_id]);
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
	 * @instance
	 * @memberof Manufacturing
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
			const rbacChecker = this._rbac('manufacturing-read');
			await rbacChecker(ctxt);

			let mainConfig = await super.getUserApplications(ctxt);
			mainConfig = mainConfig ? JSON.parse(safeJsonStringify(mainConfig)) : null;

			if(!mainConfig) { // eslint-disable-line curly
				return null;
			}

			const id = await this.$dependencies.ConfigurationService.getModuleID(this);

			// Step 2: Get all the stations this user has access to
			const dbSrvc = this.$dependencies.DatabaseService;
			const userStationList = await dbSrvc.knex.raw(`SELECT name, id FROM tenant_plant_unit_stations WHERE tenant_id = ? AND id IN (SELECT tenant_plant_unit_station_id FROM tenant_plant_unit_stations_users WHERE tenant_user_id IN (SELECT id FROM tenants_users WHERE user_id = ?)) ORDER BY name ASC`, [ctxt.state.tenant.tenant_id, ctxt.state.user.user_id]);

			// eslint-disable-next-line curly
			if(!userStationList.rows.length) {
				return null;
			}

			mainConfig['name'] = this.name;
			mainConfig['feature_id'] = id;
			mainConfig['route'] = 'manufacturing.watch';

			userStationList.rows.forEach(element => {
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
	// #endregion
}

exports.feature = Manufacturing;
