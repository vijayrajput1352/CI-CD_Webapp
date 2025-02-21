'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseComponent = require('plantworks-base-component').PlantWorksBaseComponent;
const PlantWorksComponentError = require('plantworks-component-error').PlantWorksComponentError;

/**
 * @class   Main
 * @extends {PlantWorksBaseComponent}
 * @classdesc The Main component of the Tenant Administration Feature - manages CRUD for the account.
 *
 *
 */
class Main extends PlantWorksBaseComponent {
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
	 * @memberof Main
	 * @name     _addRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds routes to the Koa Router.
	 */
	async _addRoutes() {
		try {
			this.$router.get('/features/tree', this.$parent._rbac('registered'), this._getFeatureTree.bind(this));
			this.$router.get('/features/:feature_id', this.$parent._rbac('registered'), this._getFeature.bind(this));
			this.$router.get('/feature-permissions/:feature_permission_id', this.$parent._rbac('registered'), this._getFeaturePermission.bind(this));

			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _getFeatureTree(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const featureData = await apiSrvc.execute('Main::getModuleTree', ctxt);

			ctxt.status = 200;
			ctxt.body = featureData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving feature data`, err);
		}
	}

	async _getFeature(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const featureData = await apiSrvc.execute('Main::getModule', ctxt);

			ctxt.status = 200;
			ctxt.body = featureData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving feature data`, err);
		}
	}

	async _getFeaturePermission(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const featureData = await apiSrvc.execute('Main::getModulePermission', ctxt);

			ctxt.status = 200;
			ctxt.body = featureData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving feature permission data`, err);
		}
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get dependencies() {
		return ['ApiService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.component = Main;
