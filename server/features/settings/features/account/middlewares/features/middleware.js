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
 * @class   Features
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Server Settings / Account / Feature middleware - manages CRUD for tenant feature data.
 *
 *
 */
class Features extends PlantWorksBaseMiddleware {
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

					'features': function() {
						return this.hasMany(self.$TenantFeatureModel, 'tenant_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantFeatureModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenants_modules',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'feature': function() {
						return this.belongsTo(self.$FeatureModel, 'module_id');
					}
				})
			});

			Object.defineProperty(this, '$FeatureModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'modules',
					'hasTimestamps': true
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
			delete this.$FeatureModel;
			delete this.$TenantFeatureModel;
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

			await ApiService.add(`${this.name}::getTenantFeatureTree`, this._getTenantFeatureTree.bind(this));
			await ApiService.add(`${this.name}::getAllTenantFeatures`, this._getAllTenantFeatures.bind(this));

			await ApiService.add(`${this.name}::getTenantFeature`, this._getTenantFeature.bind(this));
			await ApiService.add(`${this.name}::addTenantFeature`, this._addTenantFeature.bind(this));
			await ApiService.add(`${this.name}::deleteTenantFeature`, this._deleteTenantFeature.bind(this));

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

			await ApiService.remove(`${this.name}::deleteTenantFeature`, this._deleteTenantFeature.bind(this));
			await ApiService.remove(`${this.name}::addTenantFeature`, this._addTenantFeature.bind(this));
			await ApiService.remove(`${this.name}::getTenantFeature`, this._getTenantFeature.bind(this));

			await ApiService.remove(`${this.name}::getAllTenantFeatures`, this._getAllTenantFeatures.bind(this));
			await ApiService.remove(`${this.name}::getTenantFeatureTree`, this._getTenantFeatureTree.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getTenantFeatureTree(ctxt) {
		try {
			let serverModule = this.$parent;
			while(serverModule.$parent) serverModule = serverModule.$parent;

			const configSrvc = this.$dependencies.ConfigurationService;
			const serverModuleId = await configSrvc.getModuleID(serverModule);

			const dbSrvc = this.$dependencies.DatabaseService;
			const tenantFeatures = await dbSrvc.knex.raw(`SELECT id, COALESCE(CAST(parent_id AS text), '#') AS parent, name AS text FROM modules WHERE id IN (SELECT id FROM fn_get_module_descendants(?) WHERE (type = 'server' OR type = 'feature') AND id IN (SELECT module_id FROM tenants_modules WHERE tenant_id = ?))`, [serverModuleId, ctxt.state.tenant.tenant_id]);

			return tenantFeatures.rows;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantFeatureTree`, err);
		}
	}

	async _getAllTenantFeatures(ctxt) {
		try {
			let tenantFeatureData = await this.$TenantFeatureModel
			.query(function(qb) {
				qb.where({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetchAll({
				'withRelated': ['tenant', 'feature']
			});

			tenantFeatureData = this._convertToJsonApiFormat(tenantFeatureData, 'settings/account/features/tenant-feature', {
				'tenant': 'settings/account/basics/tenant',
				'feature': 'server-administration/feature'
			});

			return tenantFeatureData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllTenantFeatures`, err);
		}
	}

	async _getTenantFeature(ctxt) {
		try {
			const TenantFeatureRecord = new this.$TenantFeatureModel({
				'id': ctxt.params['tenant_feature_id'],
				'tenant_id': ctxt.state.tenant['tenant_id']
			});

			let tenantFeatureData = await TenantFeatureRecord.fetch({
				'withRelated': ['tenant', 'feature']
			});

			tenantFeatureData = this._convertToJsonApiFormat(tenantFeatureData, 'settings/account/features/tenant-feature', {
				'tenant': 'settings/account/basics/tenant',
				'feature': 'server-administration/feature'
			});

			return tenantFeatureData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantFeature`, err);
		}
	}

	async _addTenantFeature(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			jsonDeserializedData['module_id'] = jsonDeserializedData['feature_id'];
			delete jsonDeserializedData['feature_id'];

			const savedRecord = await this.$TenantFeatureModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const cacheSrvc = this.$dependencies['CacheService'];
			const cachedKeys = await cacheSrvc.keysAsync(`plantworks!webapp!user!${ctxt.state.user.user_id}!*`);

			const cacheMulti = cacheSrvc.multi();
			cachedKeys.forEach((cachedKey) => {
				cacheMulti.delAsync(cachedKey);
			});

			await cacheMulti.execAsync();

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantFeature`, err);
		}
	}

	async _deleteTenantFeature(ctxt) {
		try {
			await new this.$TenantFeatureModel({
				'id': ctxt.params['tenant_feature_id']
			})
			.destroy({
				'require': false
			});

			const cacheSrvc = this.$dependencies['CacheService'];
			const cachedKeys = await cacheSrvc.keysAsync(`plantworks!webapp!user!${ctxt.state.user.user_id}!*`);

			const cacheMulti = cacheSrvc.multi();
			cachedKeys.forEach((cachedKey) => {
				cacheMulti.delAsync(cachedKey);
			});

			await cacheMulti.execAsync();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantFeature`, err);
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

exports.middleware = Features;
