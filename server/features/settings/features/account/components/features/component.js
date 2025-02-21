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
 * @class   Features
 * @extends {PlantWorksBaseComponent}
 * @classdesc The Features component of the Settings / Account / Feature Management Feature - manages CRUD for tenant features.
 *
 *
 */
class Features extends PlantWorksBaseComponent {
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
	 * @memberof Features
	 * @name     _addRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds routes to the Koa Router.
	 */
	async _addRoutes() {
		try {
			this.$router.get('/tree', this.$parent._rbac('settings-account-features-read'), this._getTenantFeatureTree.bind(this));
			this.$router.get('/tenant-features', this.$parent._rbac('settings-account-features-read'), this._getTenantFeatures.bind(this));

			this.$router.get('/tenant-features/:tenant_feature_id', this.$parent._rbac('settings-account-features-read'), this._getTenantFeature.bind(this));
			this.$router.post('/tenant-features', this.$parent._rbac('settings-account-features-update'), this._addTenantFeature.bind(this));
			this.$router.del('/tenant-features/:tenant_feature_id', this.$parent._rbac('settings-account-features-update'), this._deleteTenantFeature.bind(this));

			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _getTenantFeatureTree(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantFeatureTree = await apiSrvc.execute('Features::getTenantFeatureTree', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantFeatureTree.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving tenant feature tree`, err);
		}
	}

	async _getTenantFeatures(ctxt, next) {
		if(ctxt.params['tenant_feature_id']) {
			await next();
			return null;
		}

		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantFeatures = await apiSrvc.execute('Features::getAllTenantFeatures', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantFeatures.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving all tenant feature`, err);
		}
	}

	async _getTenantFeature(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantFeature = await apiSrvc.execute('Features::getTenantFeature', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantFeature.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving tenant feature`, err);
		}
	}

	async _addTenantFeature(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantFeature = await apiSrvc.execute('Features::addTenantFeature', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantFeature.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant feature`, err);
		}
	}

	async _deleteTenantFeature(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Features::deleteTenantFeature', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant feature`, err);
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

exports.component = Features;
