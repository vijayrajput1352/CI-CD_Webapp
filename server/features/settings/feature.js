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
 * @class   Settings
 * @extends {PlantWorksBaseFeature}
 * @classdesc The Plant.Works Web Application Server Settings feature - single-point access for all feature settings the Tenant/User combination has access to.
 *
 *
 */
class Settings extends PlantWorksBaseFeature {
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
	 * @memberof Settings
	 * @name     getDashboardDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Dashboard display stuff for this Feature.
	 *
	 * @summary  Everyone with the setting-access permission gets to see this icon.
	 */
	async getDashboardDisplayDetails(ctxt) { // eslint-disable-line no-unused-vars
		try {
			if(!ctxt.state.device.is('desktop'))
				return null;

			const rbacChecker = this._rbac('settings-access');
			await rbacChecker(ctxt);

			const settingsDisplay = await super.getDashboardDisplayDetails(ctxt);
			if(!settingsDisplay) return null;

			const mainDisplay = JSON.parse(safeJsonStringify(settingsDisplay));

			mainDisplay['attributes']['name'] = 'Settings';
			mainDisplay['attributes']['route'] = 'settings';
			mainDisplay['attributes']['icon_type'] = 'md';
			mainDisplay['attributes']['icon_path'] = 'settings';
			mainDisplay['attributes']['display_order'] = 'last';

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
	 * @memberof Settings
	 * @name     getSettingsDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Settings display stuff for this Feature.
	 *
	 * @summary  Access for Tenant Administrators, only.
	 */
	async getSettingsDisplayDetails(ctxt) {
		if(!ctxt.state.device.is('desktop'))
			return null;

		const settingsItems = [];
		try {
			const rbacChecker = this._rbac('settings-account-features-read');
			await rbacChecker(ctxt);

			const settingsDisplay = await super.getSettingsDisplayDetails(ctxt);
			if(!settingsDisplay) return null;

			const basicsDisplay = JSON.parse(safeJsonStringify(settingsDisplay));

			basicsDisplay['id'] += '-1';
			basicsDisplay['attributes']['route'] = 'account.basics';
			basicsDisplay['attributes']['icon_type'] = 'md';
			basicsDisplay['attributes']['icon_path'] = 'account_circle';
			basicsDisplay['attributes']['display_order'] = 'first';

			settingsItems.push(basicsDisplay);
		}
		catch(err) {
			// Do nothing;
		}

		try {
			const rbacChecker = this._rbac('settings-account-features-read');
			await rbacChecker(ctxt);

			const settingsDisplay = await super.getSettingsDisplayDetails(ctxt);
			if(!settingsDisplay) return null;

			const featuresDisplay = JSON.parse(safeJsonStringify(settingsDisplay));

			featuresDisplay['id'] += '-2';
			featuresDisplay['attributes']['route'] = 'account.features';
			featuresDisplay['attributes']['icon_type'] = 'mdi';
			featuresDisplay['attributes']['icon_path'] = 'alpha-f';
			featuresDisplay['attributes']['display_order'] = '0';

			settingsItems.push(featuresDisplay);
		}
		catch(err) {
			// Do nothing;
		}

		try {
			const rbacChecker = this._rbac('settings-account-features-read');
			await rbacChecker(ctxt);

			const settingsDisplay = await super.getSettingsDisplayDetails(ctxt);
			if(!settingsDisplay) return null;

			const basicsDisplay = JSON.parse(safeJsonStringify(settingsDisplay));

			basicsDisplay['id'] += '-3';
			basicsDisplay['attributes']['route'] = 'account.work-orders';
			basicsDisplay['attributes']['icon_type'] = 'md';
			basicsDisplay['attributes']['icon_path'] = 'account_circle';
			basicsDisplay['attributes']['display_order'] = '0';

			settingsItems.push(basicsDisplay);
		}
		catch(err) {
			// Do nothing;
		}

		try {
			const rbacChecker = this._rbac('settings-account-webhooks-read');
			await rbacChecker(ctxt);

			const settingsDisplay = await super.getSettingsDisplayDetails(ctxt);
			if(!settingsDisplay) return null;

			const webhookDisplay = JSON.parse(safeJsonStringify(settingsDisplay));

			webhookDisplay['id'] += '-4';
			webhookDisplay['attributes']['route'] = 'account.webhooks';
			webhookDisplay['attributes']['icon_type'] = 'md';
			webhookDisplay['attributes']['icon_path'] = 'web';
			webhookDisplay['attributes']['display_order'] = '0';

			settingsItems.push(webhookDisplay);
		}
		catch(err) {
			// Do nothing;
		}

		return settingsItems;
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof Settings
	 * @name     getConfigDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Config display stuff for this Feature.
	 *
	 * @summary  No display in the config itself.
	 */
	async getConfigDisplayDetails(ctxt) { // eslint-disable-line no-unused-vars
		return null;
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof Settings
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
	 * @memberof Common
	 * @name     getScheduleDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Config display stuff for this Feature.
	 *
	 * @summary  No display in the config itself.
	 */
	async getScheduleDisplayDetails(ctxt) { // eslint-disable-line no-unused-vars
		return null;
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof Settings
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
			const rbacChecker = this._rbac('settings-access');
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

exports.feature = Settings;
