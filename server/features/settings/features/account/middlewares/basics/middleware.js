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
 * @class   Basics
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Server Settings / Account Basics middleware - manages CRUD for account data.
 *
 *
 */
class Basics extends PlantWorksBaseMiddleware {
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

					'tenantLocations': function() {
						return this.hasMany(self.$TenantLocationModel, 'tenant_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantLocationModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_locations',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					}
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

			await ApiService.add(`${this.name}::getTenant`, this._getTenant.bind(this));
			await ApiService.add(`${this.name}::updateTenant`, this._updateTenant.bind(this));
			await ApiService.add(`${this.name}::deleteTenant`, this._deleteTenant.bind(this));

			await ApiService.add(`${this.name}::getLocation`, this._getLocation.bind(this));
			await ApiService.add(`${this.name}::addLocation`, this._addLocation.bind(this));
			await ApiService.add(`${this.name}::deleteLocation`, this._deleteLocation.bind(this));

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

			await ApiService.remove(`${this.name}::deleteLocation`, this._deleteLocation.bind(this));
			await ApiService.remove(`${this.name}::addLocation`, this._addLocation.bind(this));
			await ApiService.remove(`${this.name}::getLocation`, this._getLocation.bind(this));

			await ApiService.remove(`${this.name}::deleteTenant`, this._deleteTenant.bind(this));
			await ApiService.remove(`${this.name}::updateTenant`, this._updateTenant.bind(this));
			await ApiService.remove(`${this.name}::getTenant`, this._getTenant.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getTenant(ctxt) {
		try {
			const TenantRecord = new this.$TenantModel({
				'id': ctxt.state.tenant.tenant_id
			});

			let tenantData = await TenantRecord.fetch({
				'withRelated': ctxt.query.include ? ctxt.query.include.split(',').map((inclRsrc) => { return inclRsrc.trim(); }) : ['tenantLocations']
			});

			tenantData = this._convertToJsonApiFormat(tenantData, 'settings/account/basics/tenant', {
				'tenantLocations': 'settings/account/basics/tenant-location'
			}, {
				'deleteIncluded': false
			});

			return tenantData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenant`, err);
		}
	}

	async _updateTenant(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Organaization Name cannot be empty');
			if(jsonDeserializedData.sub_domain !== undefined && jsonDeserializedData.sub_domain !== null && jsonDeserializedData.sub_domain.trim() === '') throw new Error('Sub-domain cannot be empty');
			const savedRecord = await this.$TenantModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenant`, err);
		}
	}

	async _deleteTenant(ctxt) {
		try {
			if(ctxt.state.tenant['sub_domain'] === 'www') { // eslint-disable-line curly
				throw new Error(`WWW tenant cannot be deleted`);
			}

			await new this.$TenantModel({
				'id': ctxt.state.tenant.tenant_id
			}).destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenant`, err);
		}
	}

	async _getLocation(ctxt) {
		try {
			const TenantLocationRecord = new this.$TenantLocationModel({
				'id': ctxt.params['tenant_location_id']
			});

			let tenantLocationData = await TenantLocationRecord.fetch({
				'withRelated': ctxt.query.include ? ctxt.query.include.split(',').map((inclRsrc) => { return inclRsrc.trim(); }) : ['tenant']
			});

			tenantLocationData = this._convertToJsonApiFormat(tenantLocationData, 'settings/account/basics/tenant-location', {
				'tenant': 'settings/account/basics/tenant'
			}, {
				'deleteIncluded': false
			});

			return tenantLocationData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getLocation`, err);
		}
	}

	async _addLocation(ctxt, insert) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name field cannot be empty');
			if(jsonDeserializedData.line1 !== undefined && jsonDeserializedData.line1 !== null && jsonDeserializedData.line1.trim() === '') throw new Error('Line1 cannot be empty');
			const savedRecord = await this.$TenantLocationModel
				.forge()
				.save(jsonDeserializedData, {
					'method': insert ? 'insert' : 'update',
					'patch': !insert
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addLocation`, err);
		}
	}

	async _deleteLocation(ctxt) {
		try {
			await this.$TenantLocationModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.tenant_location_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteLocation`, err);
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
	// #endregion
}

exports.middleware = Basics;
