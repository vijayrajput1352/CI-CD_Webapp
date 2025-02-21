/* eslint-disable security/detect-object-injection */

'use strict';

/**
 * Module dependencies, required for ALL Plant.Works modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseModule = require('./plantworks-base-module').PlantWorksBaseModule;
const PlantWorksCompError = require('./plantworks-component-error').PlantWorksComponentError;

/**
 * @class   PlantWorksBaseComponent
 * @extends {PlantWorksBaseModule}
 * @classdesc The Plant.Works Web Application Server Base Class for all Components.
 *
 * @param   {PlantWorksBaseModule} [parent] - The parent module, if any.
 * @param   {PlantWorksModuleLoader} [loader] - The loader to be used for managing modules' lifecycle, if any.
 *
 * @description
 * Serves as the "base class" for all other components in the Plant.Works Web Application Server.
 *
 */
class PlantWorksBaseComponent extends PlantWorksBaseModule {
	// #region Constructor
	constructor(parent, loader) {
		super(parent, null);

		const PlantWorksCompLoader = require('./plantworks-component-loader').PlantWorksComponentLoader;
		const actualLoader = (loader instanceof PlantWorksCompLoader) ? loader : new PlantWorksCompLoader(this);

		this.$loader = actualLoader;

		const inflection = require('inflection');
		const Router = require('koa-router');

		const parentType = Object.getPrototypeOf(Object.getPrototypeOf(this.$parent)).name;
		let inflectedName = inflection.transform(this.name, ['foreign_key', 'dasherize']).replace('-id', '');

		if((inflectedName === 'main') && (parentType === 'PlantWorksBaseFeature')) inflectedName = '';
		this.$router = (inflectedName !== '') ? new Router({ 'prefix': `/${inflectedName}` }) : new Router();
	}
	// #endregion

	// #region Lifecycle hooks
	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof PlantWorksBaseComponent
	 * @name     _setup
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds the Koa Router routes.
	 */
	async _setup() {
		try {
			await super._setup();
			await this._addRoutes();

			return null;
		}
		catch(err) {
			throw new PlantWorksCompError(`${this.name}::_setup error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof PlantWorksBaseComponent
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Destroys the Koa Router routes.
	 */
	async _teardown() {
		try {
			await this._deleteRoutes();
			await super._teardown();

			return null;
		}
		catch(err) {
			throw new PlantWorksCompError(`${this.name}::_teardown error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof PlantWorksBaseComponent
	 * @name     _subModuleReconfigure
	 *
	 * @param    {PlantWorksBaseModule} subModule - The sub-module that changed configuration.
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Lets the module know that one of its subModules changed configuration.
	 */
	async _subModuleReconfigure(subModule) {
		await super._subModuleReconfigure(subModule);

		await this._deleteRoutes();
		await this._addRoutes();

		await this.$parent._subModuleReconfigure(this);
		return null;
	}
	// #endregion

	// #region Protected methods - need to be overriden by derived classes
	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof PlantWorksBaseComponent
	 * @name     _addRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds routes to the Koa Router.
	 */
	async _addRoutes() {
		if(plantworksEnv === 'development' || plantworksEnv === 'test') console.log(`${this.name}::_addRoutes`);

		// Add in the sub-components routes
		Object.keys(this.$components || {}).forEach((componentName) => {
			const componentRouter = this.$components[componentName].Router;
			this.$router.use(componentRouter.routes());
		});

		return null;
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof PlantWorksBaseComponent
	 * @name     _deleteRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Removes all the routes from the Koa Router.
	 */
	async _deleteRoutes() {
		if(plantworksEnv === 'development' || plantworksEnv === 'test') console.log(`${this.name}::_deleteRoutes`);

		// NOTICE: Undocumented koa-router data structure.
		// Be careful upgrading :-)
		if(this.$router) this.$router.stack.length = 0;
		return null;
	}
	// #endregion

	// #region Properties
	/**
	 * @member   {object} Router
	 * @override
	 * @instance
	 * @memberof PlantWorksBaseComponent
	 *
	 * @readonly
	 */
	get Router() {
		return this.$router;
	}

	/**
	 * @override
	 */
	get dependencies() {
		return ['ApiService', 'CacheService', 'ConfigurationService', 'LoggerService', 'WebserverService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.PlantWorksBaseComponent = PlantWorksBaseComponent;
