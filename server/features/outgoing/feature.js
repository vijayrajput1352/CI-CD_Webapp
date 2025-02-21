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
 * @class   Outgoing
 * @extends {PlantWorksBaseFeature}
 * @classdesc The Plant.Works Web Application Server Outgoing feature - single-point access for all features the Tenant/User combination has access to.
 *
 *
 */
class Outgoing extends PlantWorksBaseFeature {
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
	 * @memberof Outgoing
	 * @name     getDashboardDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Dashboard display stuff for this Feature.
	 *
	 * @summary  Everyone with the realtime-data-access permission gets to see this icon.
	 */
	async getDashboardDisplayDetails(ctxt) { // eslint-disable-line no-unused-vars
		try {
			const rbacChecker = this._rbac('realtime-data-access');
			await rbacChecker(ctxt);

			const settingsDisplay = await super.getDashboardDisplayDetails(ctxt);
			if(!settingsDisplay) return null;

			const mainDisplay = JSON.parse(safeJsonStringify(settingsDisplay));

			mainDisplay['attributes']['name'] = 'Outgoing';
			mainDisplay['attributes']['route'] = 'outgoing';
			mainDisplay['attributes']['dashboard_category'] = 'applications';
			mainDisplay['attributes']['icon_type'] = 'md';
			mainDisplay['attributes']['icon_path'] = 'timelapse';
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
	 * @memberof Outgoing
	 * @name     getSettingsDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Settings display stuff for this Feature.
	 *
	 * @summary  No display in the settings.
	 */
	async getSettingsDisplayDetails(ctxt) { // eslint-disable-line no-unused-vars
		return null;
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof Outgoing
	 * @name     getConfigDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Config display stuff for this Feature.
	 *
	 * @summary  No display in the config.
	 */
	async getConfigDisplayDetails(ctxt) { // eslint-disable-line no-unused-vars
		return null;
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof Outgoing
	 * @name     getDevEnvDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Config display stuff for this Feature.
	 *
	 * @summary  No display in the config itself.
	 */
	async getDevEnvDisplayDetails(ctxt) { // eslint-disable-line no-unused-vars
		return null;
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof Outgoing
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
	 * @memberof Outgoing
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
			const rbacChecker = this._rbac('realtime-data-access');
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

exports.feature = Outgoing;
