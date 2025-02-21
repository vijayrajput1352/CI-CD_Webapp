/* eslint-disable security/detect-object-injection */

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
const upash = require('upash');
upash.install('pbkdf2', require('@phc/pbkdf2'));

const PlantWorksBaseModule = require('plantworks-base-module').PlantWorksBaseModule;
const PlantWorksBaseError = require('plantworks-base-error').PlantWorksBaseError;

/**
 * @class   PlantWorksApplication
 * @extends {PlantWorksBaseModule}
 *
 * @param   {PlantWorksBaseModule} [parent] - The parent module, if any. In this case, it's always null
 * @param   {PlantWorksModuleLoader} [loader] - The loader to be used for managing modules' lifecycle, if any.
 *
 * @classdesc The Plant.Works Server Application Class.
 *
 * @description
 * The Application Class for this server.
 *
 * This class has two major functionalities:
 * 1. Provide an environment for the rest of the server modules to reside in
 * +  Load / Unload the server modules and control the Startup / Shutdown sequences
 */
class PlantWorksApplication extends PlantWorksBaseModule {
	// #region Constructor
	constructor(application, parent, loader) {
		super(parent, loader);

		this.$application = application;
		this.$uuid = require('uuid/v4')();
	}
	// #endregion

	// #region Startup / Shutdown
	/**
	 * @function
	 * @instance
	 * @memberof PlantWorksApplication
	 * @name     bootupServer
	 *
	 * @returns  {Array} - The aggregated status returned by sub-modules (if any).
	 *
	 * @summary  Loads / Initializes / Starts-up sub-modules.
	 */
	async bootupServer() {
		if(plantworksEnv === 'development' || plantworksEnv === 'test') console.log(`${this.name}::bootupServer`);

		const allStatuses = [];
		let bootupError = null;

		try {
			const osLocale = require('os-locale');
			const serverLocale = await osLocale();

			Object.defineProperties(this, {
				'$locale': {
					'value': serverLocale
				}
			});

			let lifecycleStatuses = null;

			this.emit('server-loading');
			lifecycleStatuses = await this.load();
			allStatuses.push(`${process.title} load status: ${lifecycleStatuses ? safeJsonStringify(lifecycleStatuses, null, 2) : true}\n`);
			this.emit('server-loaded');

			this.emit('server-initializing');
			lifecycleStatuses = await this.initialize();
			allStatuses.push(`${process.title} initialize status: ${lifecycleStatuses ? safeJsonStringify(lifecycleStatuses, null, 2) : true}\n`);
			this.emit('server-initialized');

			this.emit('server-starting');
			lifecycleStatuses = await this.start();
			allStatuses.push(`${process.title} start status: ${lifecycleStatuses ? safeJsonStringify(lifecycleStatuses, null, 2) : true}\n`);
			this.emit('server-started');

			await this._setupWebserverRoutes();
			this.emit('server-online');
		}
		catch(err) {
			bootupError = (err instanceof PlantWorksBaseError) ? err : new PlantWorksBaseError(`Bootup Error`, err);
			allStatuses.push(`Bootup error: ${bootupError.toString()}`);
		}

		if(!bootupError && ((plantworksEnv === 'development') || (plantworksEnv === 'test')))
			console.info(`\n\n${allStatuses.join('\n')}\n\n`);

		if(bootupError) {
			console.error(`\n\n${allStatuses.join('\n')}\n\n`);
			throw bootupError;
		}

		return null;
	}

	/**
	 * @function
	 * @instance
	 * @memberof PlantWorksApplication
	 * @name     shutdownServer
	 *
	 * @returns  {Array} - The aggregated status returned by sub-modules (if any).
	 *
	 * @summary  Shuts-down / Un-initializes / Un-loads sub-modules.
	 */
	async shutdownServer() {
		if(plantworksEnv === 'development' || plantworksEnv === 'test') console.log(`${this.name}::shutdownServer`);

		const allStatuses = [];
		let shutdownError = null;

		try {
			this.emit('server-offline');
			let lifecycleStatuses = null;

			this.emit('server-stopping');
			lifecycleStatuses = await this.stop();
			allStatuses.push(`${process.title} stop status: ${lifecycleStatuses ? safeJsonStringify(lifecycleStatuses, null, 2) : true}\n`);
			this.emit('server-stopped');

			this.emit('server-uninitializing');
			lifecycleStatuses = await this.uninitialize();
			allStatuses.push(`${process.title} uninitialize status: ${lifecycleStatuses ? safeJsonStringify(lifecycleStatuses, null, 2) : true}\n`);
			this.emit('server-uninitialized');

			this.emit('server-unloading');
			lifecycleStatuses = await this.unload();
			allStatuses.push(`${process.title} unload status: ${lifecycleStatuses ? safeJsonStringify(lifecycleStatuses, null, 2) : true}\n`);
			this.emit('server-unloaded');
		}
		catch(err) {
			shutdownError = (err instanceof PlantWorksBaseError) ? err : new PlantWorksBaseError(`Shutdown Error`, err);
			allStatuses.push(`Shutdown error: ${shutdownError.toString()}`);
		}

		if(!shutdownError && ((plantworksEnv === 'development') || (plantworksEnv === 'test')))
			console.info(`\n\n${allStatuses.join('\n')}\n\n`);

		if(shutdownError) {
			console.error(`\n\n${allStatuses.join('\n')}\n\n`);
			throw shutdownError;
		}

		return null;
	}
	// #endregion

	// #region Re-configuration
	async _subModuleReconfigure(subModule) {
		await super._subModuleReconfigure(subModule);
		if(subModule.name === 'WebserverService') {
			await this._setupWebserverRoutes();
			return;
		}

		const subModuleType = Object.getPrototypeOf(Object.getPrototypeOf(subModule)).name;
		if((subModuleType !== 'PlantWorksBaseComponent') && (subModuleType !== 'PlantWorksBaseFeature'))
			return;

		const configService = this.$services.ConfigurationService;
		const webserverService = this.$services.WebserverService;

		const webserverConfig = await configService.loadConfiguration(webserverService);
		await webserverService._reconfigure(webserverConfig.configuration);
	}
	// #endregion

	// #region Private Methods
	async _setupWebserverRoutes() {
		const appRouter = this.$services.WebserverService.Interface.Router;

		// Browser Error Data via the Beacon API / XHR Post
		appRouter.post('/collectClientErrorData', (ctxt) => {
			const query = ctxt.query;
			const beaconData = Object.assign({}, query, ctxt.request.body);

			ctxt.status = 200;
			ctxt.body = { 'status': true };

			if(beaconData.error === 'TransitionAborted')
				return;

			// TODO: Do something more sophisticated - like storing it into Cassandra, and running analysis
			console.error(`Client Error Data: ${safeJsonStringify(beaconData, null, '\t')}`);
		});

		// Add in the components
		Object.keys(this.$components || {}).forEach((componentName) => {
			const componentRouter = this.$components[componentName].Router;
			appRouter.use(componentRouter.routes());
		});

		// Add in the features
		Object.keys(this.$features || {}).forEach((featureName) => {
			const featureRouter = this.$features[featureName].Router;
			appRouter.use(featureRouter.routes());
		});

		// Add in the templates at the end...
		Object.keys(this.$templates).forEach((tmplName) => {
			const tmplRouter = this.$templates[tmplName].Router;
			appRouter.get('*', tmplRouter.routes());
		});

		// console.log(`All Routes: ${safeJsonStringify(appRouter.stack.map((route) => { return `${safeJsonStringify(route.methods)} ${route.path}`; }), null, '\t')}`);
		return;
	}
	// #endregion

	// #region Properties
	/**
	 * @member   {string} name
	 * @instance
	 * @override
	 * @memberof PlantWorksApplication
	 *
	 * @readonly
	 */
	get name() {
		return this.$application || this.constructor.name;
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.PlantWorksApplication = PlantWorksApplication;
