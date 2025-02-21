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
 * @class   Main
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Server Tenant Administration Groups Main middleware - manages CRUD for tenant groups.
 *
 *
 */
class Main extends PlantWorksBaseMiddleware {
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

					'tenantUsers': function() {
						return this.hasMany(self.$TenantUserModel, 'tenant_id');
					},

					'tenantGroups': function() {
						return this.hasMany(self.$TenantGroupModel, 'tenant_id');
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

			Object.defineProperty(this, '$TenantGroupModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_groups',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'parent': function() {
						return this.belongsTo(self.$TenantGroupModel, 'parent_id');
					},

					'groups': function() {
						return this.hasMany(self.$TenantGroupModel, 'parent_id');
					},

					'tenantUserGroups': function() {
						return this.hasMany(self.$TenantUserGroupModel, 'tenant_group_id');
					},

					'permissions': function() {
						return this.hasMany(self.$TenantGroupPermissionModel, 'tenant_group_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantGroupPermissionModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_group_permissions',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantGroup': function() {
						return this.belongsTo(self.$TenantGroupModel, 'tenant_group_id');
					},

					'feature': function() {
						return this.belongsTo(self.$FeatureModel, 'module_id');
					},

					'featurePermission': function() {
						return this.belongsTo(self.$FeaturePermissionModel, 'module_permission_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantUserGroupModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenants_users_groups',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantGroup': function() {
						return this.belongsTo(self.$TenantGroupModel, 'tenant_group_id');
					},

					'tenantUser': function() {
						return this.belongsTo(self.$TenantUserModel, 'tenant_user_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantUserModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenants_users',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'user': function() {
						return this.belongsTo(self.$UserModel, 'user_id');
					},

					'tenantUserGroups': function() {
						this.hasMany(self.$TenantUserGroupModel, 'tenant_user_id');
					}
				})
			});

			Object.defineProperty(this, '$UserModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'users',
					'hasTimestamps': true,

					'tenantUsers': function() {
						return this.hasMany(self.$TenantUserModel, 'user_id');
					}
				})
			});

			Object.defineProperty(this, '$FeaturePermissionModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'module_permissions',
					'hasTimestamps': true,

					'feature': function() {
						return this.belongsTo(self.$FeatureModel, 'module_id');
					},

					'tenantGroupPermissions': function() {
						return this.hasMany(self.$TenantGroupPermissionModel, 'module_permission_id');
					}
				})
			});

			Object.defineProperty(this, '$FeatureModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'modules',
					'hasTimestamps': true,

					'parent': function() {
						return this.belongsTo(self.$FeatureModel, 'parent_id');
					},

					'modules': function() {
						return this.hasMany(self.$FeatureModel, 'parent_id');
					},

					'permissions': function() {
						return this.hasMany(self.$FeaturePermissionModel, 'module_id');
					},

					'tenant_features': function() {
						return this.hasMany(self.$TenantFeatureModel, 'module_id');
					}
				})
			});

			let serverModule = this.$parent;
			while(serverModule.$parent) serverModule = serverModule.$parent;

			serverModule.on('clone-tenant-user', this._cloneTenantUser.bind(this));
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
			let serverModule = this.$parent;
			while(serverModule.$parent) serverModule = serverModule.$parent;

			serverModule.off('clone-tenant-user', this._cloneTenantUser.bind(this));

			delete this.$FeatureModel;
			delete this.$FeaturePermissionModel;
			delete this.$UserModel;
			delete this.$TenantUserModel;
			delete this.$TenantUserGroupModel;
			delete this.$TenantGroupPermissionModel;
			delete this.$TenantGroupModel;
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

			await ApiService.add(`${this.name}::getTenantGroupTree`, this._getTenantGroupTree.bind(this));
			await ApiService.add(`${this.name}::possibleTenantUsersList`, this._getPossibleTenantUsersList.bind(this));

			await ApiService.add(`${this.name}::getTenantGroup`, this._getTenantGroup.bind(this));
			await ApiService.add(`${this.name}::addTenantGroup`, this._addTenantGroup.bind(this));
			await ApiService.add(`${this.name}::updateTenantGroup`, this._updateTenantGroup.bind(this));
			await ApiService.add(`${this.name}::deleteTenantGroup`, this._deleteTenantGroup.bind(this));

			await ApiService.add(`${this.name}::getTenantUserGroup`, this._getTenantUserGroup.bind(this));
			await ApiService.add(`${this.name}::addTenantUserGroup`, this._addTenantUserGroup.bind(this));
			await ApiService.add(`${this.name}::deleteTenantUserGroup`, this._deleteTenantUserGroup.bind(this));

			await ApiService.add(`${this.name}::getTenantGroupPermission`, this._getTenantGroupPermission.bind(this));
			await ApiService.add(`${this.name}::addTenantGroupPermission`, this._addTenantGroupPermission.bind(this));
			await ApiService.add(`${this.name}::deleteTenantGroupPermission`, this._deleteTenantGroupPermission.bind(this));

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

			await ApiService.remove(`${this.name}::deleteTenantGroupPermission`, this._deleteTenantGroupPermission.bind(this));
			await ApiService.remove(`${this.name}::addTenantGroupPermission`, this._addTenantGroupPermission.bind(this));
			await ApiService.remove(`${this.name}::getTenantGroupPermission`, this._getTenantGroupPermission.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantUserGroup`, this._deleteTenantUserGroup.bind(this));
			await ApiService.remove(`${this.name}::addTenantUserGroup`, this._addTenantUserGroup.bind(this));
			await ApiService.remove(`${this.name}::getTenantUserGroup`, this._getTenantUserGroup.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantGroup`, this._deleteTenantGroup.bind(this));
			await ApiService.remove(`${this.name}::updateTenantGroup`, this._updateTenantGroup.bind(this));
			await ApiService.remove(`${this.name}::addTenantGroup`, this._addTenantGroup.bind(this));
			await ApiService.remove(`${this.name}::getTenantGroup`, this._getTenantGroup.bind(this));

			await ApiService.remove(`${this.name}::possibleTenantUsersList`, this._getPossibleTenantUsersList.bind(this));
			await ApiService.remove(`${this.name}::getTenantGroupTree`, this._getTenantGroupTree.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getTenantGroupTree(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			let tenantGroups = null;
			if(ctxt.query.id === '#')
				tenantGroups = await dbSrvc.knex.raw(`SELECT id, COALESCE(CAST(parent_id AS text), '#') AS parent, display_name AS text FROM tenant_groups WHERE tenant_id = ?`, [ctxt.state.tenant.tenant_id]);
			else
				tenantGroups = await dbSrvc.knex.raw(`SELECT id, COALESCE(CAST(parent_id AS text), '#') AS parent, display_name AS text FROM tenant_groups WHERE tenant_id = ? AND id IN (SELECT id FROM fn_get_group_descendants(?) WHERE level >= 2)`, [ctxt.state.tenant.tenant_id, ctxt.query.id]);

			return tenantGroups.rows;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantGroupTree`, err);
		}
	}

	async _getPossibleTenantUsersList(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const possibleTenantUsers = await dbSrvc.knex.raw(`SELECT A.id, B.first_name AS "firstName", B.middle_names AS "middleNames", B.last_name AS "lastName", B.email FROM tenants_users A INNER JOIN users B ON (A.user_id = B.id) WHERE A.tenant_id = ? AND A.access_status = 'authorized' AND A.id NOT IN (SELECT tenant_user_id FROM tenants_users_groups WHERE tenant_group_id IN (SELECT id FROM fn_get_group_ancestors(?)))`, [ctxt.state.tenant.tenant_id, ctxt.query.group]);
			return possibleTenantUsers.rows;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getPossibleTenantUsersList`, err);
		}
	}

	async _getTenantGroup(ctxt) {
		try {
			const TenantGroupRecord = new this.$TenantGroupModel({
				'id': ctxt.params['tenant_group_id'],
				'tenant_id': ctxt.state.tenant['tenant_id']
			});

			let tenantGroupData = await TenantGroupRecord.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((incl) => { return incl.trim(); }) : ['tenant', 'parent', 'groups', 'permissions', 'tenantUserGroups', 'permissions.tenant', 'permissions.tenantGroup', 'permissions.feature', 'permissions.featurePermission']
			});

			tenantGroupData = this._convertToJsonApiFormat(tenantGroupData, 'pug/group-manager/tenant-group', {
				'tenant': 'settings/account/basics/tenant',
				'parent': 'pug/group-manager/tenant-group',
				'groups': 'pug/group-manager/tenant-group',
				'permissions': 'pug/group-manager/tenant-group-permission',
				'feature': 'server-administration/feature',
				'featurePermission': 'server-administration/feature-permission',
				'tenantGroup': 'pug/group-manager/tenant-group',
				'tenantUserGroups': 'pug/group-manager/tenant-user-group'
			}, {
				'deleteIncluded': false
			});

			tenantGroupData.included = tenantGroupData.included.filter((inclRsrc) => {
				return inclRsrc.type === 'pug/group-manager/tenant-group-permission';
			});

			return tenantGroupData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantGroup`, err);
		}
	}

	async _addTenantGroup(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.display_name !== undefined && jsonDeserializedData.display_name !== null && jsonDeserializedData.display_name.trim() === '') throw new Error('Name field cannot be empty');

			const savedRecord = await this.$TenantGroupModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantGroup`, err);
		}
	}

	async _updateTenantGroup(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.display_name !== undefined && jsonDeserializedData.display_name !== null && jsonDeserializedData.display_name.trim() === '') throw new Error('Name field cannot be empty');

			const savedRecord = await this.$TenantGroupModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantGroup`, err);
		}
	}

	async _deleteTenantGroup(ctxt) {
		try {
			const tenantGroup = await this.$TenantGroupModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.tenant_group_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantGroup) throw new Error('Unknown Tenant Group');
			if(tenantGroup.get('default_for_new_user')) throw new Error('Cannot delete default group');

			await tenantGroup.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantGroup`, err);
		}
	}

	async _getTenantUserGroup(ctxt) {
		try {
			const TenantUserGroupRecord = new this.$TenantUserGroupModel({
				'id': ctxt.params['tenant_user_group_id'],
				'tenant_id': ctxt.state.tenant['tenant_id']
			});

			// const self = this; // eslint-disable-line consistent-this
			let tenantUserGroupData = await TenantUserGroupRecord.fetch({
				'withRelated': [
					'tenant',
					{
						'tenantUser': function(qb) {
							qb.where('tenant_id', '=', ctxt.state.tenant.tenant_id);
						},
						'tenantGroup': function(qb) {
							qb.where('tenant_id', '=', ctxt.state.tenant.tenant_id);
						}
					}
				]
			});

			tenantUserGroupData = this._convertToJsonApiFormat(tenantUserGroupData, 'pug/group-manager/tenant-user-group', {
				'tenant': 'settings/account/basics/tenant',
				'tenantUser': 'pug/user-manager/tenant-user',
				'tenantGroup': 'pug/group-manager/tenant-group'
			});

			return tenantUserGroupData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantUserGroup`, err);
		}
	}

	async _addTenantUserGroup(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const tenantUser = await new this.$TenantUserModel({
				'id': jsonDeserializedData['tenant_user_id'],
				'tenant_id': ctxt.state.tenant['tenant_id']
			}).fetch();

			if(!tenantUser) throw new Error(`Invalid Tenant User`);

			jsonDeserializedData['tenant_id'] = ctxt.state.tenant.tenant_id;
			jsonDeserializedData['tenant_user_id'] = tenantUser.get('id');

			const savedRecord = await this.$TenantUserGroupModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantUserGroup`, err);
		}
	}

	async _deleteTenantUserGroup(ctxt) {
		try {
			const tenantUserGroup = await this.$TenantUserGroupModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.tenant_user_group_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantUserGroup) throw new Error('Unknown Tenant User to Group mapping');

			await tenantUserGroup.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantUserGroup`, err);
		}
	}

	async _getTenantGroupPermission(ctxt) {
		try {
			const TenantGroupPermissionRecord = new this.$TenantGroupPermissionModel({
				'id': ctxt.params['tenant_group_permission_id'],
				'tenant_id': ctxt.state.tenant['tenant_id']
			});

			// const self = this; // eslint-disable-line consistent-this
			let tenantGroupPermissionData = await TenantGroupPermissionRecord.fetch({
				'withRelated': [
					'tenant', 'feature', 'featurePermission',
					{
						'tenantGroup': function(qb) {
							qb.where('tenant_id', '=', ctxt.state.tenant.tenant_id);
						}
					}
				]
			});

			tenantGroupPermissionData = this._convertToJsonApiFormat(tenantGroupPermissionData, 'pug/group-manager/tenant-group-permission', {
				'tenant': 'settings/account/basics/tenant',
				'tenantGroup': 'pug/group-manager/tenant-group',
				'feature': 'server-administration/feature',
				'featurePermission': 'server-administration/feature-permission'
			});

			return tenantGroupPermissionData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantGroupPermission`, err);
		}
	}

	async _addTenantGroupPermission(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			jsonDeserializedData['tenant_id'] = ctxt.state.tenant.tenant_id;
			jsonDeserializedData['module_id'] = jsonDeserializedData['feature_id'];
			jsonDeserializedData['module_permission_id'] = jsonDeserializedData['feature_permission_id'];

			delete jsonDeserializedData.feature_id;
			delete jsonDeserializedData.feature_permission_id;

			const savedRecord = await this.$TenantGroupPermissionModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantGroupPermission`, err);
		}
	}

	async _deleteTenantGroupPermission(ctxt) {
		try {
			const tenantGroupPermission = await this.$TenantGroupPermissionModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.tenant_group_permission_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantGroupPermission) throw new Error('Unknown Permission to Group mapping');

			await tenantGroupPermission.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantGroupPermission`, err);
		}
	}
	// #endregion

	// #region Private Methods
	_cloneTenantUser(eventData) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const tenantId = eventData.tenantId;
			const originalUserId = eventData.originalTenantUserId;
			const clonedUserId = eventData.clonedTenantUserId;

			dbSrvc.knex.raw(`INSERT INTO tenants_users_groups (tenant_id, tenant_user_id, tenant_group_id) SELECT ?, ?, tenant_group_id FROM tenants_users_groups WHERE tenant_id = ? AND tenant_user_id = ?`, [tenantId, clonedUserId, tenantId, originalUserId])
			.catch((err) => {
				console.error(err);
			});
		}
		catch(err) {
			const logSrvc = this.$dependencies.LoggerService;
			const error = new PlantWorksMiddlewareError(`${this.name}::_cloneTenantUser`, err);

			logSrvc.error(error.toString());
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

exports.middleware = Main;
