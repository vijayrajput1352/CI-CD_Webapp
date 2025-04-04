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
 * @classdesc The Plant.Works Web Application Server Profile Feature Main middleware - manages CRUD for profile data.
 *
 *
 */
class Main extends PlantWorksBaseMiddleware {
	// #region Constructor
	constructor(parent, loader) {
		super(parent, loader);
	}
	// #endregion

	// #region Protected methods
	async _registerApis() {
		try {
			const ApiService = this.$dependencies.ApiService;

			await ApiService.add(`${this.name}::getFeatures`, this._getFeatures.bind(this));
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

			await ApiService.remove(`${this.name}::getFeatures`, this._getFeatures.bind(this));
			await super._deregisterApis();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getFeatures(ctxt) {
		try {
			let serverModule = this.$parent;
			while(serverModule.$parent) serverModule = serverModule.$parent;

			const serverFeatureNames = Object.keys(serverModule.$features || {});
			const validFeatures = [];

			for(let idx = 0; idx < serverFeatureNames.length; idx++) {
				const featureModule = serverModule.$features[(serverFeatureNames[idx])];

				const dashboardDisplayDetails = await featureModule.getDashboardDisplayDetails(ctxt);
				if(!dashboardDisplayDetails) continue;

				if(!Array.isArray(dashboardDisplayDetails))
					validFeatures.push(dashboardDisplayDetails);
				else
					dashboardDisplayDetails.forEach((singleDetail) => { validFeatures.push(singleDetail); });
			}

			validFeatures.sort((left, right) => {
				if((left.attributes['display_order'] === 'first') && (right.attributes['display_order'] !== 'first'))
					return -1;

				if((left.attributes['display_order'] === 'last') && (right.attributes['display_order'] !== 'last'))
					return 1;

				if(((left.attributes['display_order'] === 'first') || (left.attributes['display_order'] === 'last')) && (left.attributes['display_order'] === right.attributes['display_order'])) {
					if(left.attributes['name'] < right.attributes['name']) return -1;
					if(left.attributes['name'] > right.attributes['name']) return 1;

					return 0;
				}

				if(!isNaN(left.attributes['display_order']) && !isNaN(right.attributes['display_order'])) { // eslint-disable-line curly
					return (Number(left.attributes['display_order']) - Number(right.attributes['display_order']));
				}

				return -1;
			});

			return { 'data': validFeatures };
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getFeatures`, err);
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

exports.middleware = Main;
