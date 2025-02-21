'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseFeature = require('plantworks-base-feature').PlantWorksBaseFeature;
const safeJsonStringify = require('safe-json-stringify'); // eslint-disable-line no-unused-vars
// const PlantWorksFeatureError = require('plantworks-feature-error').PlantWorksFeatureError;

/**
 * @class   Dashboard
 * @extends {PlantWorksBaseFeature}
 * @classdesc The Plant.Works Web Application Server Dashboard feature - single-point access for all features the Tenant/User combination has access to.
 *
 *
 */
class Dashboard extends PlantWorksBaseFeature {
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
	 * @memberof Dashboard
	 * @name     getDashboardDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Dashboard display stuff for this Feature.
	 *
	 * @summary  No display in the dashboard itself.
	 */
	async getDashboardDisplayDetails(ctxt) { // eslint-disable-line no-unused-vars
		return null;
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof Dashboard
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
	 * @memberof Dashboard
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
	 * @memberof Dashboard
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
	 * @memberof Dashboard
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
	 * @memberof Dashboard
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

			const rbacChecker = this._rbac('registered');
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

exports.feature = Dashboard;
