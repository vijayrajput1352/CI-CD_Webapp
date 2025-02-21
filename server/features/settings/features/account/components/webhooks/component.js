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
const axios = require('axios');
const safeJsonStringify = require('safe-json-stringify'); // eslint-disable-line no-unused-vars

/**
 * @class   Webhooks
 * @extends {PlantWorksBaseComponent}
 * @classdesc The Webhooks component of the Settings / Webhooks Feature - manages CRUD for the webhooks.
 *
 *
 */
class Webhooks extends PlantWorksBaseComponent {
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
	 * @memberof Webhooks
	 * @name     _addRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds routes to the Koa Router.
	 */
	async _addRoutes() {
		try {
			this.$router.get('/tenant-webhooks/:webhook_id', this.$parent._rbac('settings-account-webhooks-read'), this._getTenantWebhook.bind(this));
			this.$router.get('/tenant-webhooks/', this.$parent._rbac('settings-account-webhooks-read'), this._getAllTenantWebhooks.bind(this));
			this.$router.post('/test-webhook/', this.$parent._rbac('settings-account-webhooks-read'), this._testTenantWebhook.bind(this));
			this.$router.post('/tenant-webhooks/', this.$parent._rbac('settings-account-webhooks-create'), this._addTenantWebhook.bind(this));
			this.$router.patch('/tenant-webhooks/:webhook_id', this.$parent._rbac('settings-account-webhooks-update'), this._updateTenantWebhook.bind(this));
			this.$router.delete('/tenant-webhooks/:webhook_id', this.$parent._rbac('settings-account-webhooks-delete'), this._deleteTenantWebhook.bind(this));

			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _getTenantWebhook(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const webhookData = await apiSrvc.execute('Webhooks::getTenantWebhook', ctxt);

			ctxt.status = 200;
			ctxt.body = webhookData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving webhook data`, err);
		}
	}

	async _getAllTenantWebhooks(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const webhookData = await apiSrvc.execute('Webhooks::getAllTenantWebhooks', ctxt);

			ctxt.status = 200;
			ctxt.body = webhookData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving webhook data`, err);
		}
	}

	async _testTenantWebhook(ctxt) {
		try {
			const axiosData = JSON.parse(safeJsonStringify(ctxt.request.body.requestData));
			console.log(axiosData);

			const response = await axios(axiosData);

			ctxt.status = response.status;
			ctxt.body = response.statusText;

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error testing webhook`, err);
		}
	}

	async _addTenantWebhook(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const webhookData = await apiSrvc.execute('Webhooks::addTenantWebhook', ctxt);

			ctxt.status = 200;
			ctxt.body = webhookData.shift();
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error creating webhook`, err);
		}
	}

	async _updateTenantWebhook(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const webhookData = await apiSrvc.execute('Webhooks::updateTenantWebhook', ctxt);

			ctxt.status = 200;
			ctxt.body = webhookData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating webhook`, err);
		}
	}

	async _deleteTenantWebhook(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Webhooks::deleteTenantWebhook', [ctxt, true]);

			ctxt.status = 204;

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting webhook`, err);
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

exports.component = Webhooks;
