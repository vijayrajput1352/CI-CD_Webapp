'use strict';

/**
 * Module dependencies, required for ALL Plant.Works modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksModuleLoader = require('./plantworks-module-loader').PlantWorksModuleLoader,
	PlantWorksTemplateError = require('./plantworks-template-error').PlantWorksTemplateError;

/**
 * @class   PlantWorksTemplateLoader
 * @extends {PlantWorksModuleLoader}
 * @classdesc The Plant.Works Server Base Class for all Template Loaders.
 *
 * @param   {PlantWorksBaseModule} [plantworksModule] - The parent module, if any.
 *
 * @description
 * Serves as the "base class" for all other template loaders in the Plant.Works Web Application Server.
 *
 * Responsible for invoking the standard "lifecycle" hooks on sub-modules of this module, if any - see {@link PlantWorksBaseModule#load},
 * {@link PlantWorksBaseModule#initialize}, {@link PlantWorksBaseModule#start}, {@link PlantWorksBaseModule#stop}, {@link PlantWorksBaseModule#uninitialize},
 * and {@link PlantWorksBaseModule#unload}.
 *
 */
class PlantWorksTemplateLoader extends PlantWorksModuleLoader {
	// #region Constructor
	constructor(plantworksModule) {
		super(plantworksModule);
	}
	// #endregion

	// #region Lifecycle hooks
	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof PlantWorksTemplateLoader
	 * @name     load
	 *
	 * @param    {ConfigurationService} configSrvc - Instance of the {@link ConfigurationService} that supplies configuration.
	 *
	 * @returns  {object} - The load status of $plantworksModule's sub-modules.
	 *
	 * @summary  Loads sub-modules.
	 */
	async load(configSrvc) {
		try {
			const allStatuses = [];
			let lifecycleStatuses = null;

			lifecycleStatuses = await this._loadUtilities(configSrvc);
			if(lifecycleStatuses && lifecycleStatuses.status && (lifecycleStatuses.status instanceof Error))
				throw lifecycleStatuses.status;

			allStatuses.push(lifecycleStatuses);
			return this._filterStatus(allStatuses);
		}
		catch(err) {
			throw new PlantWorksTemplateError(`${this.$plantworksModule.name}::loader::load error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof PlantWorksTemplateLoader
	 * @name     initialize
	 *
	 * @returns  {object} - The initialization status of $plantworksModule's sub-modules.
	 *
	 * @summary  Initializes sub-modules.
	 */
	async initialize() {
		try {
			const allStatuses = [];
			return this._filterStatus(allStatuses);
		}
		catch(err) {
			throw new PlantWorksTemplateError(`${this.$plantworksModule.name}::loader::initialize error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof PlantWorksTemplateLoader
	 * @name     start
	 *
	 * @returns  {object} - The start status of $plantworksModule's sub-modules.
	 *
	 * @summary  Starts sub-modules.
	 */
	async start() {
		try {
			const allStatuses = [];
			return this._filterStatus(allStatuses);
		}
		catch(err) {
			throw new PlantWorksTemplateError(`${this.$plantworksModule.name}::loader::start error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof PlantWorksTemplateLoader
	 * @name     stop
	 *
	 * @returns  {object} - The stop status of $plantworksModule's sub-modules.
	 *
	 * @summary  Stops sub-modules.
	 */
	async stop() {
		try {
			const allStatuses = [];
			return this._filterStatus(allStatuses);
		}
		catch(err) {
			throw new PlantWorksTemplateError(`${this.$plantworksModule.name}::loader::stop error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof PlantWorksTemplateLoader
	 * @name     uninitialize
	 *
	 * @returns  {object} - The uninitialization status of $plantworksModule's sub-modules.
	 *
	 * @summary  Un-initializes sub-modules.
	 */
	async uninitialize() {
		try {
			const allStatuses = [];
			return this._filterStatus(allStatuses);
		}
		catch(err) {
			throw new PlantWorksTemplateError(`${this.$plantworksModule.name}::loader::uninitialize error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof PlantWorksTemplateLoader
	 * @name     unload
	 *
	 * @returns  {object} - The unloading status of $plantworksModule's sub-modules.
	 *
	 * @summary  Unloads sub-modules.
	 */
	async unload() {
		try {
			const allStatuses = [];
			let lifecycleStatuses = null;

			lifecycleStatuses = await this._unloadUtilities();
			if(lifecycleStatuses && lifecycleStatuses.status && (lifecycleStatuses.status instanceof Error))
				throw lifecycleStatuses.status;

			allStatuses.push(lifecycleStatuses);
			return this._filterStatus(allStatuses);
		}
		catch(err) {
			throw new PlantWorksTemplateError(`${this.$plantworksModule.name}::loader::unload error`, err);
		}
	}
	// #endregion
}

exports.PlantWorksTemplateLoader = PlantWorksTemplateLoader;
