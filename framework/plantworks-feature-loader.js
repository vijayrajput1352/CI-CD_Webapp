'use strict';

/**
 * Module dependencies, required for ALL Plant.Works modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksModuleLoader = require('./plantworks-module-loader').PlantWorksModuleLoader;
const PlantWorksFeatureError = require('./plantworks-feature-error').PlantWorksFeatureError;

const PlantWorksBaseService = require('./plantworks-base-service').PlantWorksBaseService;

/**
 * @class   PlantWorksFeatureLoader
 * @extends {PlantWorksModuleLoader}
 * @classdesc The Plant.Works Server Base Class for all Feature Loaders.
 *
 * @param   {PlantWorksBaseModule} [plantworksModule] - The parent module, if any.
 *
 * @description
 * Serves as the "base class" for all other feature loaders in the Plant.Works Web Application Server.
 *
 * Responsible for invoking the standard "lifecycle" hooks on sub-modules of this module, if any - see {@link PlantWorksBaseModule#load},
 * {@link PlantWorksBaseModule#initialize}, {@link PlantWorksBaseModule#start}, {@link PlantWorksBaseModule#stop}, {@link PlantWorksBaseModule#uninitialize},
 * and {@link PlantWorksBaseModule#unload}.
 *
 */
class PlantWorksFeatureLoader extends PlantWorksModuleLoader {
	// #region Constructor
	constructor(plantworksModule) {
		super(plantworksModule);
	}
	// #endregion

	// #region Service Lifecycle Hooks
	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof PlantWorksFeatureLoader
	 * @name     _loadServices
	 *
	 * @param    {ConfigurationService} configSrvc - Instance of the {@link ConfigurationService} that supplies configuration.
	 *
	 * @returns  {object} Object containing the load status of each of the $plantworksModule services.
	 *
	 * @summary  Load services defined as part of this {@link PlantWorksBaseModule}.
	 *
	 * @description
	 * Special processing:
	 * If the configSrvc parameter is undefined, load the {@link ConfigurationService} first, if any found.
	 *
	 * Since the {@link ConfigurationServiceLoader} calls load / initialize / start in one shot, the other sub-modules get, basically,
	 * a fully functional configuration service by the time they load, allowing them to use their configurations from the get-go.
	 */
	async _loadServices(configSrvc) {
		if(!this.$plantworksModule.$services) this.$plantworksModule.$services = {};

		// Check validity of the definition...
		const Service = require('./plantworks-feature-api-service').service;
		if(!Service) throw new PlantWorksFeatureError(`Cannot find PlantWorksFeatureApiService`);

		// Construct the service
		const serviceInstance = new Service(this.$plantworksModule);
		serviceInstance.$dependants = [];

		// eslint-disable-next-line curly
		if(!(serviceInstance instanceof PlantWorksBaseService)) {
			throw new PlantWorksFeatureError(`PlantWorksFeatureApiService does not contain a valid PlantWorksBaseService definition`);
		}

		await serviceInstance.load(configSrvc);
		this.$plantworksModule.$services['ApiService'] = serviceInstance;

		const loadStatus = await super._loadServices(configSrvc);
		return loadStatus;
	}
	// #endregion
}

exports.PlantWorksFeatureLoader = PlantWorksFeatureLoader;
