'use strict';

/* eslint-disable security/detect-object-injection */

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseService = require('plantworks-base-service').PlantWorksBaseService;

const PlantWorksBaseError = require('plantworks-base-error').PlantWorksBaseError;
const PlantWorksSrvcError = require('plantworks-service-error').PlantWorksServiceError;

/**
 * @class   FeatureApiService
 * @extends {PlantWorksBaseService}
 * @classdesc The Plant.Works Web Application Server API Service.
 *
 * @description
 * Allows the modules in a single feature to communicate with each other by allowing registration / invocation of API.
 * If the requested for API cannot be found, it bubbles up to the next level, till it gets to the server
 *
 */
class FeatureApiService extends PlantWorksBaseService {
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
	 * @memberof FeatureApiService
	 * @name     _setup
	 *
	 * @returns  {null} Nothing.
	 *
	 * @summary  Sets up the broker to manage API exposed by other modules.
	 */
	async _setup() {
		try {
			await super._setup();

			const customMatch = function(pattern, data) {
				const items = this.find(pattern, true) || [];
				items.push(data);

				return {
					'find': function() {
						return items.length ? items : [];
					},

					'remove': function(search, api) {
						const apiIdx = items.indexOf(api);
						if(apiIdx < 0) return false;

						items.splice(apiIdx, 1);
						return true;
					}
				};
			};

			this.$patrun = require('patrun')(customMatch);
			return null;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::_setup error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof FeatureApiService
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Deletes the broker that manages API.
	 */
	async _teardown() {
		try {
			if(this.$patrun) delete this.$patrun;

			await super._teardown();
			return null;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::_teardown error`, err);
		}
	}
	// #endregion

	// #region API
	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof FeatureApiService
	 * @name     add
	 *
	 * @param    {string} pattern - The pattern to which this api will respond.
	 * @param    {Function} api - The api to be invoked against the pattern.
	 *
	 * @returns  {boolean} Boolean true/false - depending on whether the registration succeeded.
	 *
	 * @summary  Registers the api function as a handler for the pattern.
	 */
	async add(pattern, api) {
		try {
			// eslint-disable-next-line curly
			if(typeof api !== 'function') {
				throw new Error(`${this.name}::add expects a function for the pattern: ${pattern}`);
			}

			pattern = pattern.split('::').reduce((obj, value) => {
				obj[value] = value;
				return obj;
			}, {});

			this.$patrun.add(pattern, api);
			return true;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::add error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof FeatureApiService
	 * @name     execute
	 *
	 * @param    {string} pattern - The pattern to be executed.
	 * @param    {object} data - The data to be passed in as arguments to each of the api registered against the pattern.
	 *
	 * @returns  {Array} The results of the execution.
	 *
	 * @summary  Executes all the apis registered as handlers for the pattern.
	 */
	async execute(pattern, data) {
		let _featureApiSrvcError = true;

		try {
			const patrunPattern = pattern.split('::').reduce((obj, value) => {
				obj[value] = value;
				return obj;
			}, {});

			if(!Array.isArray(data))
				data = [data];

			const apis = this.$patrun.find(patrunPattern);
			if(!apis || !apis.length) {
				let parentModule = this.$parent;
				let parentApiService = parentModule.$dependencies['ApiService'];

				while(!parentApiService) {
					parentApiService = parentModule.$dependencies['ApiService'];
					if(!parentApiService) parentModule = parentModule.$parent;
					if(!parentModule) throw new PlantWorksSrvcError(`No API Service found to execute request`);
				}

				_featureApiSrvcError = false;
				const parentResults = await parentApiService.execute(pattern, data);
				_featureApiSrvcError = true;

				return parentResults;
			}

			_featureApiSrvcError = false;

			const results = [];
			let errors = null;

			for(const api of apis) { // eslint-disable-line curly
				try {
					const result = await api(...data);
					results.push(result);
				}
				catch(execErr) {
					if(!errors)
						errors = new PlantWorksSrvcError(execErr);
					else
						errors = new PlantWorksSrvcError(execErr, errors);
				}
			}

			if(!errors)
				return results;
			else
				throw errors;
		}
		catch(err) {
			let error = err;

			if(!error) { // eslint-disable-line curly
				error = new PlantWorksSrvcError(`${this.name}::execute: Unknown Error`);
				throw error;
			}

			if(_featureApiSrvcError) { // eslint-disable-line curly
				error = new PlantWorksSrvcError(`${this.name}::execute`, error);
				throw error;
			}

			if(!(error instanceof PlantWorksBaseError)) { // eslint-disable-line curly
				error = new PlantWorksSrvcError(`${this.name}::execute::Error: `, err);
				throw error;
			}

			throw error;
		}
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof FeatureApiService
	 * @name     remove
	 *
	 * @param    {string} pattern - The pattern to which this api will respond.
	 * @param    {Function} api - The api to be de-registered against the pattern.
	 *
	 * @returns  {boolean} Boolean true/false - depending on whether the de-registration succeeded.
	 *
	 * @summary  De-registers the api function as a handler for the pattern.
	 */
	async remove(pattern, api) {
		try {
			// eslint-disable-next-line curly
			if(typeof api !== 'function') {
				throw new Error(`${this.name}::remove expects a function for the pattern: ${pattern}`);
			}

			pattern = pattern.split('::').reduce((obj, value) => {
				obj[value] = value;
				return obj;
			}, {});

			this.$patrun.remove(pattern, api);
			return true;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::remove error`, err);
		}
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get Interface() {
		return {
			'add': this.add.bind(this),
			'execute': this.execute.bind(this),
			'remove': this.remove.bind(this)
		};
	}

	/**
	 * @override
	 */
	get dependencies() {
		return ['ConfigurationService', 'LoggerService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.service = FeatureApiService;
