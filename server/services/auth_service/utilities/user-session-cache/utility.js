'use strict';

/* eslint-disable security/detect-object-injection */

/**
 * Module dependencies, required for ALL Plant.Works modules
 * @ignore
 */
const safeJsonStringify = require('safe-json-stringify'); // eslint-disable-line no-unused-vars
/**
 * Module dependencies, required for this module
 * @ignore
 */

const getUserDetails = async function(tenantId, userId) {
	const cacheSrvc = this.$dependencies.CacheService,
		databaseSrvc = this.$dependencies.DatabaseService,
		loggerSrvc = this.$dependencies.LoggerService;

	try {
		let cachedUser = await cacheSrvc.getAsync(`plantworks!webapp!user!${userId}!basics`);
		if(cachedUser) {
			cachedUser = JSON.parse(cachedUser);
			return cachedUser;
		}


		// Setup the models...
		const User = databaseSrvc.Model.extend({
			'tableName': 'users',

			'social': function() {
				// eslint-disable-next-line no-use-before-define
				return this.hasMany(UserSocialLogins, 'user_id');
			}
		});

		const UserSocialLogins = databaseSrvc.Model.extend({
			'tableName': 'user_social_logins',

			'user': function() {
				return this.belongsTo(User, 'user_id');
			}
		});

		let databaseUser = await User.forge({ 'id': userId }).fetch({ 'withRelated': ['social'] });
		if(!databaseUser) throw new Error(`User Not Found: ${userId}`);

		databaseUser = databaseUser.toJSON();
		databaseUser['user_id'] = databaseUser.id;

		delete databaseUser.id;
		delete databaseUser.password;

		databaseUser.social.forEach((social) => {
			delete social.social_data;
		});

		await cacheSrvc.setAsync(`plantworks!webapp!user!${userId}!basics`, safeJsonStringify(databaseUser));
		return databaseUser;
	}
	catch(err) {
		loggerSrvc.error(`userSessionCache::getUserDetails Error:\nUser Id: ${userId}\nTenant Id: ${tenantId}\nError: `, err);
		throw (err);
	}
};

const getTenantUserPermissions = async function(tenantId, userId) {
	const cacheSrvc = this.$dependencies.CacheService,
		databaseSrvc = this.$dependencies.DatabaseService,
		loggerSrvc = this.$dependencies.LoggerService;

	const addImpliedPermissions = function(tenantUserPermissions, allPermissions, impliedPermission) {
		const hasImpliedPermissionAlreadyAdded = tenantUserPermissions.filter((tuperm) => {
			return tuperm.name === impliedPermission;
		}).length;

		if(hasImpliedPermissionAlreadyAdded)
			return;

		const serverPermission = allPermissions.filter((perm) => {
			return perm.name === impliedPermission;
		}).shift();

		tenantUserPermissions.push({
			'permission_id': serverPermission.permission,
			'name': serverPermission.name
		});

		if(!serverPermission['implies_permissions'].length)
			return;

		serverPermission['implies_permissions'].forEach((impliedPerm) => {
			addImpliedPermissions(tenantUserPermissions, allPermissions, impliedPerm);
		});
	};

	try {
		let cachedTenantUserPermissions = await cacheSrvc.getAsync(`plantworks!webapp!user!${userId}!${tenantId}!permissions`);
		if(cachedTenantUserPermissions) {
			cachedTenantUserPermissions = JSON.parse(cachedTenantUserPermissions);
			return cachedTenantUserPermissions;
		}

		let serverModule = this.$parent;
		while(serverModule.$parent) serverModule = serverModule.$parent;

		const serverModuleId = await this.$dependencies.ConfigurationService.getModuleID(serverModule);
		const allServerPermissions = (await databaseSrvc.knex.raw(`SELECT id AS permission, name, implies_permissions FROM module_permissions WHERE module_id IN (SELECT id FROM fn_get_module_descendants(?))`, [serverModuleId])).rows;

		const publicPermission = (await databaseSrvc.knex.raw(`SELECT id AS permission, name, implies_permissions FROM module_permissions WHERE name = ?`, ['public'])).rows;
		const userPermissions = (await databaseSrvc.knex.raw('SELECT * FROM fn_get_user_permissions(?, ?)', [tenantId, userId])).rows;
		const defaultPermissions = (userId === 'ffffffff-ffff-4fff-ffff-ffffffffffff') ? [] : (await databaseSrvc.knex.raw('SELECT Z.id AS permission, Z.name, Z.implies_permissions FROM module_permissions Z WHERE Z.id IN (SELECT DISTINCT module_permission_id FROM tenant_group_permissions WHERE tenant_group_id = (SELECT id FROM tenant_groups WHERE tenant_id = ? AND default_for_new_user = true))', [tenantId])).rows;

		const combinedPermissions = {
			[publicPermission[0].name]: publicPermission[0]
		};

		while(userPermissions.length) {
			const currPerm = userPermissions.shift();
			combinedPermissions[currPerm.name] = currPerm;
		}

		while(defaultPermissions.length) {
			const defPerm = defaultPermissions.shift();
			combinedPermissions[defPerm.name] = defPerm;
		}

		const tenantUserPermissions = [];

		const permissionNames = Object.keys(combinedPermissions);
		permissionNames.forEach((permissionName) => {
			const hasAlreadyBeenAdded = tenantUserPermissions.filter((tuperm) => {
				return tuperm.name === permissionName;
			}).length;

			if(hasAlreadyBeenAdded) return;

			tenantUserPermissions.push({
				'permission_id': combinedPermissions[permissionName].permission,
				'name': permissionName
			});

			const impliedPermissions = combinedPermissions[permissionName]['implies_permissions'];
			if(!impliedPermissions.length) return;

			impliedPermissions.forEach((impliedPerm) => {
				addImpliedPermissions(tenantUserPermissions, allServerPermissions, impliedPerm);
			});
		});

		await cacheSrvc.setAsync(`plantworks!webapp!user!${userId}!${tenantId}!permissions`, safeJsonStringify(tenantUserPermissions));
		return tenantUserPermissions;
	}
	catch(err) {
		loggerSrvc.error(`userSessionCache::getTenantUserPermissions Error:\nUser Id: ${userId}\nTenant Id: ${tenantId}\nError: `, err);
		throw (err);
	}
};


const getTenantUserAttributes = async function(tenantId, userId) {
	const inflection = require('inflection');

	const cacheSrvc = this.$dependencies.CacheService,
		databaseSrvc = this.$dependencies.DatabaseService,
		loggerSrvc = this.$dependencies.LoggerService;

	try {
		let cachedTenantUserAttributes = await cacheSrvc.getAsync(`plantworks!webapp!user!${userId}!${tenantId}!attributes`);
		if(cachedTenantUserAttributes) {
			cachedTenantUserAttributes = JSON.parse(cachedTenantUserAttributes);
			return cachedTenantUserAttributes;
		}

		// Setup the models...
		const databaseTenantUser = await databaseSrvc.knex.raw(`SELECT A.id, A.name, A.sub_domain, B.designation, B.default_application, B.default_application_parameters FROM tenants A INNER JOIN tenants_users B ON (A.id = B.tenant_id) WHERE B.user_id = ? AND B.access_status = 'authorized' AND A.enabled = true`, [userId]);

		const tenantUserAttributes = {
			'designation': '',
			'default_application': '',
			'default_application_parameters': '',
			'default_route': '',
			'allowed_tenants': []
		};

		databaseTenantUser.rows.forEach((tenantUserRecord) => {
			if(tenantUserRecord['id'] === tenantId) {
				tenantUserAttributes['designation'] = tenantUserRecord['designation'];
				tenantUserAttributes['default_application'] = tenantUserRecord['default_application'];
				tenantUserAttributes['default_application_parameters'] = tenantUserRecord['default_application_parameters'];
			}

			tenantUserAttributes['allowed_tenants'].push({
				'tenant_id': tenantUserRecord['id'],
				'name': tenantUserRecord['name'],
				'sub_domain': tenantUserRecord['sub_domain']
			});
		});

		if(tenantUserAttributes.default_application && (tenantUserAttributes.default_application !== '')) {
			let defaultAppAncestors = await databaseSrvc.knex.raw(`SELECT name FROM fn_get_module_ancestors(?) ORDER BY level DESC OFFSET 1`, [tenantUserAttributes.default_application]);
			defaultAppAncestors = defaultAppAncestors.rows.map((defaultAppAncestor) => { return inflection.transform(defaultAppAncestor.name, ['foreign_key', 'dasherize']).replace('-id', ''); });
			defaultAppAncestors = defaultAppAncestors.join('.');

			if(tenantUserAttributes.default_application_parameters.name && (tenantUserAttributes.default_application_parameters.name !== 'default')) {
				tenantUserAttributes['default_route'] = tenantUserAttributes.default_application_parameters.route;
			}

			else {
				tenantUserAttributes['default_route'] = defaultAppAncestors;
				tenantUserAttributes['default_application_parameters'] = undefined;
			}
		}

		await cacheSrvc.setAsync(`plantworks!webapp!user!${userId}!${tenantId}!attributes`, safeJsonStringify(tenantUserAttributes));
		return tenantUserAttributes;
	}
	catch(err) {
		loggerSrvc.error(`userSessionCache::getTenantUserAttributes Error:\nUser Id: ${userId}\nTenant Id: ${tenantId}\nError: `, err);
		throw (err);
	}
};


exports.utility = {
	'name': 'userSessionCache',
	'isAsync': true,
	'method': async function(tenantId, userId) {
		const cacheSrvc = this.$dependencies.CacheService,
			loggerSrvc = this.$dependencies.LoggerService;

		try {
			if(!tenantId) throw (new Error('No tenant id found in the request!'));
			if(!userId) throw (new Error('No user id found in the request!'));

			const getTenantAttributes = getTenantUserAttributes.bind(this);
			const getPermissions = getTenantUserPermissions.bind(this);
			const getDetails = getUserDetails.bind(this);

			const deserializedUser = await getDetails(tenantId, userId);
			const tenantUserPermissions = await getPermissions(tenantId, userId);
			const tenantUserAttributes = await getTenantAttributes(tenantId, userId);

			deserializedUser.tenantId = tenantId;
			deserializedUser.permissions = tenantUserPermissions;
			deserializedUser.tenantAttributes = tenantUserAttributes;

			if(plantworksEnv === 'development') {
				const cachedKeys = await cacheSrvc.keysAsync(`plantworks!webapp!user!${userId}*`);

				const cacheMulti = cacheSrvc.multi();
				cachedKeys.forEach((cachedKey) => {
					cacheMulti.expireAsync(cachedKey, 300);
				});

				await cacheMulti.execAsync();
			}

			return deserializedUser;
		}
		catch(err) {
			loggerSrvc.error('userSessionCache Error:\nUser Id: ', userId, 'Error: ', err);
			throw err;
		}
	}
};
