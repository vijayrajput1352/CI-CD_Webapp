'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseTemplate = require('plantworks-base-template').PlantWorksBaseTemplate;
// const PlantWorksTmplError = require('plantworks-template-error').PlantWorksTemplateError;

/**
 * @class   BhairaviTemplate
 * @extends {PlantWorksBaseTemplate}
 * @classdesc The Plant.Works Web Application Server Default Template class.
 *
 * @description
 * Renders the index file of the tenant's default template.
 *
 */
class BhairaviTemplate extends PlantWorksBaseTemplate {
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
	 * @memberof BhairaviTemplate
	 * @name     _addRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds routes to the Koa Router.
	 */
	async _addRoutes() {
		await super._addRoutes();

		const path = require('path');
		const serveStatic = require('koa-static');

		const dirPath = path.join(path.dirname(path.dirname(require.main.filename)), 'node_modules/ember-source/dist');
		this.$router.use(serveStatic(dirPath, {
			'maxAge': 86400000
		}));

		if(!this.$staticServers) { // eslint-disable-line curly
			this.$staticServers = {};
		}

		this.$router.get('*', async (ctxt, next) => {
			let staticServer = null;
			try {
				const tenantTemplatePath = path.dirname(path.join(ctxt.state.tenant['template']['tenant_domain'], ctxt.state.tenant['template']['tmpl_name'], ctxt.state.tenant['template']['path_to_index']));
				const tmplStaticAssetPath = path.join(path.dirname(path.dirname(require.main.filename)), 'tenant_templates', tenantTemplatePath);

				// eslint-disable-next-line security/detect-object-injection
				if(this.$staticServers[tmplStaticAssetPath]) {
					// eslint-disable-next-line security/detect-object-injection
					staticServer = this.$staticServers[tmplStaticAssetPath];
				}
				else {
					staticServer = serveStatic(tmplStaticAssetPath, {
						'maxAge': 86400000
					});

					// eslint-disable-next-line security/detect-object-injection
					this.$staticServers[tmplStaticAssetPath] = staticServer;
				}
			}
			catch(err) {
				console.error(`${err.message}\n${err.stack}`);
				await next();
				return;
			}

			await staticServer(ctxt, next);
		});

		// If it gets till here... must be a SPA asking for a client-side defined route
		// Let the client-side router handle the transition. We'll treat it as if 'GET /'
		// was requested
		this.$router.get('*', async (ctxt, next) => {
			try {
				await this._serveTenantTemplate(ctxt, next);
			}
			catch(err) {
				console.error(`${err.message}\n${err.stack}`);
				throw err;
			}
		});

		return null;
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

exports.template = BhairaviTemplate;
