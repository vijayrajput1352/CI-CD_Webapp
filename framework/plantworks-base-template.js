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
const PlantWorksTmplError = require('plantworks-template-error').PlantWorksTemplateError;

/**
 * @class   PlantWorksBaseTemplate
 * @extends {PlantWorksBaseModule}
 * @classdesc The Plant.Works Web Application Server Base Class for all Templates.
 *
 * @param   {PlantWorksBaseModule} [parent] - The parent module, if any.
 * @param   {PlantWorksModuleLoader} [loader] - The loader to be used for managing modules' lifecycle, if any.
 *
 * @description
 * Serves as the "base class" for all other services in the Plant.Works Web Application Server.
 *
 */
class PlantWorksBaseTemplate extends PlantWorksBaseModule {
	// #region Constructor
	constructor(parent, loader) {
		super(parent, null);

		const PlantWorksTmplLoader = require('./plantworks-template-loader').PlantWorksTemplateLoader;
		this.$loader = (loader instanceof PlantWorksTmplLoader) ? loader : new PlantWorksTmplLoader(this);

		const Router = require('koa-router');
		this.$router = new Router();
	}
	// #endregion

	// #region Lifecycle hooks
	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof PlantWorksBaseTemplate
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
			throw new PlantWorksTmplError(`${this.name}::_setup error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof PlantWorksBaseTemplate
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
			throw new PlantWorksTmplError(`${this.name}::_teardown error`, err);
		}
	}
	// #endregion

	// #region Protected methods - need to be overriden by derived classes
	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof PlantWorksBaseTemplate
	 * @name     _addRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds routes to the Koa Router.
	 */
	async _addRoutes() {
		return null;
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof PlantWorksBaseTemplate
	 * @name     _deleteRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Removes all the routes from the Koa Router.
	 */
	async _deleteRoutes() {
		// NOTICE: Undocumented koa-router data structure.
		// Be careful upgrading :-)
		if(this.$router) this.$router.stack.length = 0;
		return null;
	}
	// #endregion

	// #region The main render method
	async _serveTenantTemplate(ctxt, next) {
		if(ctxt.state.tenant['template']['base_template'] !== this.name) {
			await next();
			return;
		}

		try {
			const cacheSrvc = this.$dependencies.CacheService;
			let indexHTML = await cacheSrvc.getAsync(`plantworks!webapp!user!${ctxt.state.user ? ctxt.state.user.user_id : 'public'}!${ctxt.state.tenant.tenant_id}!tmpl`);

			if(!indexHTML) {
				// const clientsideAssets = await this._getClientsideAssets(ctxt);

				const renderConfig = Object.assign({}, ctxt.state.tenant['template']['base_template_configuration'], ctxt.state.tenant['template']['configuration']);
				renderConfig['developmentMode'] = (plantworksEnv === 'development') || (plantworksEnv === 'test');

				const ejs = require('ejs');
				const path = require('path');

				const tmplPath = path.join(path.dirname(__dirname), 'tenant_templates', ctxt.state.tenant['template']['tenant_domain'], ctxt.state.tenant['template']['tmpl_name'], ctxt.state.tenant['template']['path_to_index']);
				indexHTML = await ejs.renderFile(tmplPath, renderConfig, { 'async': true });

				await cacheSrvc.setAsync(`plantworks!webapp!user!${ctxt.state.user ? ctxt.state.user.user_id : 'public'}!${ctxt.state.tenant.tenant_id}!tmpl`, indexHTML);
				if(plantworksEnv === 'development') await cacheSrvc.expireAsync(`plantworks!webapp!user!${ctxt.state.user ? ctxt.state.user.user_id : 'public'}!${ctxt.state.tenant.tenant_id}!tmpl`, 30);
			}

			ctxt.status = 200;
			ctxt.type = 'text/html';
			ctxt.body = indexHTML;
		}
		catch(err) {
			const error = new PlantWorksTmplError(`${this.name}::_serveTenantTemplate error`, err);
			throw error;
		}
	}
	// #endregion

	// #region Properties
	/**
	 * @member   {object} Router
	 * @override
	 * @instance
	 * @memberof PlantWorksBaseTemplate
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
		return ['CacheService', 'ConfigurationService', 'LoggerService', 'WebserverService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.PlantWorksBaseTemplate = PlantWorksBaseTemplate;
