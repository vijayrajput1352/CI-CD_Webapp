/* eslint-disable security/detect-object-injection */

'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseMiddleware = require('plantworks-base-middleware').PlantWorksBaseMiddleware;
const PlantWorksMiddlewareError = require('plantworks-middleware-error').PlantWorksMiddlewareError;

/**
 * @class   Webhooks
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Server Settings / Account Webhooks middleware - manages CRUD for webhooks data.
 *
 *
 */
class Webhooks extends PlantWorksBaseMiddleware {
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
	 * @memberof ApiService
	 * @name     _setup
	 *
	 * @returns  {null} Nothing.
	 *
	 * @summary  Sets up the broker to manage API exposed by other modules.
	 */
	async _setup() {
		try {
			await super._setup();

			const dbSrvc = this.$dependencies.DatabaseService;
			const self = this; // eslint-disable-line consistent-this

			Object.defineProperty(this, '$TenantModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenants',
					'hasTimestamps': true,
				})
			});

			Object.defineProperty(this, '$EventTypesModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'event_types',
					'hasTimestamps': true,
				})
			});

			Object.defineProperty(this, '$TenantWebhookModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_webhooks',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					}
				},{
					'jsonColumns': ['events', 'headers']
				})
			});

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_setup error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof ApiService
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Deletes the broker that manages API.
	 */
	async _teardown() {
		try {
			delete this.$TenantLocationModel;
			delete this.$TenantModel;

			await super._teardown();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_teardown error`, err);
		}
	}
	// #endregion

	// #region Protected methods
	async _registerApis() {
		try {
			const ApiService = this.$dependencies.ApiService;

			await ApiService.add(`${this.name}::getTenantWebhook`, this._getTenantWebhook.bind(this));
			await ApiService.add(`${this.name}::getAllTenantWebhooks`, this._getAllTenantWebhooks.bind(this));
			await ApiService.add(`${this.name}::addTenantWebhook`, this._addTenantWebhook.bind(this));
			await ApiService.add(`${this.name}::updateTenantWebhook`, this._updateTenantWebhook.bind(this));
			await ApiService.add(`${this.name}::deleteTenantWebhook`, this._deleteTenantWebhook.bind(this));

			await super._registerApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_registerApis`, err);
		}
	}

	async _deregisterApis() {
		try {
			const ApiService = this.$dependencies.ApiService;

			await ApiService.remove(`${this.name}::getTenantWebhook`, this._getTenantWebhook.bind(this));
			await ApiService.remove(`${this.name}::getAllTenantWebhooks`, this._getAllTenantWebhooks.bind(this));
			await ApiService.remove(`${this.name}::addTenantWebhook`, this._addTenantWebhook.bind(this));
			await ApiService.remove(`${this.name}::updateTenantWebhook`, this._updateTenantWebhook.bind(this));
			await ApiService.remove(`${this.name}::deleteTenantWebhook`, this._deleteTenantWebhook.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getTenantWebhook(ctxt) {
		try {
			let webhookData = await this.$TenantWebhookModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.webhook_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant']
			});

			webhookData = this._convertToJsonApiFormat(webhookData, 'settings/account/webhooks/tenant-webhook', {
				'tenant': 'settings/account/basics/tenant'
			});

			return webhookData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantWebhook`, err);
		}
	}

	async _getAllTenantWebhooks(ctxt) {
		try {
			let webhookData = await this.$TenantWebhookModel
			.query(function(qb) {
				qb.where({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetchAll({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant']
			});

			webhookData = this._convertToJsonApiFormat(webhookData, 'settings/account/webhooks/tenant-webhook', {
				'tenant': 'settings/account/basics/tenant'
			});

			return webhookData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllTenantWebhooks`, err);
		}
	}

	async _addTenantWebhook(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$TenantWebhookModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantWebhook`, err);
		}
	}

	async _updateTenantWebhook(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');
			if(jsonDeserializedData.event !== undefined && jsonDeserializedData.event !== null && jsonDeserializedData.event.tag.trim() === '') throw new Error('No event defined');

			const savedRecord = await this.$TenantWebhookModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantWebhook`, err);
		}
	}

	async _deleteTenantWebhook(ctxt, insert) {
		try {
			const tenantWebhook = await this.$TenantWebhookModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.webhook_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantWebhook) throw new Error('Unknown Tenant Webhook');

			await tenantWebhook.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantWebhook`, err);
		}
	}

	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}

	/**
	 * @override
	 */
	get dependencies() {
		return [].concat(super.dependencies);
	}
	// #endregion
}

exports.middleware = Webhooks;
