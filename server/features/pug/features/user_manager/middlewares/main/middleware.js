/* eslint-disable security/detect-object-injection */

'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */
const safeJsonStringify = require('safe-json-stringify'); // eslint-disable-line no-unused-vars

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseMiddleware = require('plantworks-base-middleware').PlantWorksBaseMiddleware;
const PlantWorksMiddlewareError = require('plantworks-middleware-error').PlantWorksMiddlewareError;

/**
 * @class   Main
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Server Tenant Administration Feature Main middleware - manages CRUD for account data.
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

					'users': function() {
						return this.hasMany(self.$TenantUserModel, 'tenant_id');
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
					},

					'contacts': function() {
						return this.hasMany(self.$UserContactModel, 'user_id');
					}
				})
			});

			Object.defineProperty(this, '$UserContactModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'user_contacts',
					'hasTimestamps': true,

					'user': function() {
						return this.belongsTo(self.$UserModel, 'user_id');
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

			await ApiService.add(`${this.name}::searchUsers`, this._searchUsers.bind(this));
			await ApiService.add(`${this.name}::resetUserPassword`, this._resetUserPassword.bind(this));
			await ApiService.add(`${this.name}::cloneAccount`, this._cloneAccount.bind(this));
			await ApiService.add(`${this.name}::getAllTenantUsers`, this._getAllTenantUsers.bind(this));

			await ApiService.add(`${this.name}::getTenantUser`, this._getTenantUser.bind(this));
			await ApiService.add(`${this.name}::createTenantUser`, this._createTenantUser.bind(this));
			await ApiService.add(`${this.name}::updateTenantUser`, this._updateTenantUser.bind(this));
			await ApiService.add(`${this.name}::deleteTenantUser`, this._deleteTenantUser.bind(this));

			await ApiService.add(`${this.name}::getUserFromTenantUser`, this._getUserFromTenantUser.bind(this));
			await ApiService.add(`${this.name}::getUser`, this._getUser.bind(this));
			await ApiService.add(`${this.name}::createUser`, this._createUser.bind(this));
			await ApiService.add(`${this.name}::updateUser`, this._updateUser.bind(this));
			await ApiService.add(`${this.name}::deleteUser`, this._deleteUser.bind(this));

			await ApiService.add(`${this.name}::getAllTenantPanels`, this._getAllTenantPanels.bind(this));
			await ApiService.add(`${this.name}::updateTenantPanelsWatcher`, this._updateTenantPanelsWatcher.bind(this));

			await ApiService.add(`${this.name}::getAllTenantReports`, this._getAllTenantReports.bind(this));
			await ApiService.add(`${this.name}::updateTenantReportsAccess`, this._updateTenantReportsAccess.bind(this));

			await ApiService.add(`${this.name}::getAllTenantHdashboards`, this._getAllTenantHdashboards.bind(this));
			await ApiService.add(`${this.name}::updateTenantHdashboardsAccess`, this._updateTenantHdashboardsAccess.bind(this));

			await ApiService.add(`${this.name}::getAllTenantLines`, this._getAllTenantLines.bind(this));
			await ApiService.add(`${this.name}::updateTenantLinesAccess`, this._updateTenantLinesAccess.bind(this));

			await ApiService.add(`${this.name}::getAllTenantStations`, this._getAllTenantStations.bind(this));
			await ApiService.add(`${this.name}::updateTenantStationsAccess`, this._updateTenantStationsAccess.bind(this));

			await ApiService.add(`${this.name}::getAllTenantEmd`, this._getAllTenantEmd.bind(this));
			await ApiService.add(`${this.name}::updateTenantEmdAccess`, this._updateTenantEmdAccess.bind(this));

			await ApiService.add(`${this.name}::getAllTenantWof`, this._getAllTenantWof.bind(this));
			await ApiService.add(`${this.name}::updateTenantWofAccess`, this._updateTenantWofAccess.bind(this));

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

			await ApiService.remove(`${this.name}::updateTenantLinesAccess`, this._updateTenantLinesAccess.bind(this));
			await ApiService.remove(`${this.name}::getAllTenantLines`, this._getAllTenantLines.bind(this));

			await ApiService.remove(`${this.name}::updateTenantLinesAccess`, this._updateTenantLinesAccess.bind(this));
			await ApiService.remove(`${this.name}::getAllTenantLines`, this._getAllTenantLines.bind(this));

			await ApiService.remove(`${this.name}::updateTenantHdashboardsAccess`, this._updateTenantHdashboardsAccess.bind(this))
			await ApiService.remove(`${this.name}::getAllTenantHdashboards`, this._getAllTenantHdashboards.bind(this));

			await ApiService.remove(`${this.name}::updateTenantReportsAccess`, this._updateTenantReportsAccess.bind(this));
			await ApiService.remove(`${this.name}::getAllTenantReports`, this._getAllTenantReports.bind(this));

			await ApiService.remove(`${this.name}::updateTenantPanelsWatcher`, this._updateTenantPanelsWatcher.bind(this));
			await ApiService.remove(`${this.name}::getAllTenantPanels`, this._getAllTenantPanels.bind(this));

			await ApiService.remove(`${this.name}::deleteUser`, this._deleteUser.bind(this));
			await ApiService.remove(`${this.name}::updateUser`, this._updateUser.bind(this));
			await ApiService.remove(`${this.name}::createUser`, this._createUser.bind(this));
			await ApiService.remove(`${this.name}::getUser`, this._getUser.bind(this));
			await ApiService.remove(`${this.name}::getUserFromTenantUser`, this._getUser.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantUser`, this._deleteTenantUser.bind(this));
			await ApiService.remove(`${this.name}::updateTenantUser`, this._updateTenantUser.bind(this));
			await ApiService.remove(`${this.name}::createTenantUser`, this._createTenantUser.bind(this));
			await ApiService.remove(`${this.name}::getTenantUser`, this._getTenantUser.bind(this));

			await ApiService.remove(`${this.name}::getAllTenantUsers`, this._getAllTenantUsers.bind(this));
			await ApiService.remove(`${this.name}::cloneAccount`, this._cloneAccount.bind(this));
			await ApiService.remove(`${this.name}::resetUserPassword`, this._resetUserPassword.bind(this));
			await ApiService.remove(`${this.name}::searchUsers`, this._searchUsers.bind(this));

			await ApiService.remove(`${this.name}::updateTenantEmdAccess`, this._updateTenantEmdAccess.bind(this));
			await ApiService.remove(`${this.name}::getAllTenantEmd`, this._getAllTenantEmd.bind(this));

			await ApiService.remove(`${this.name}::updateTenantWofAccess`, this._updateTenantWofAccess.bind(this));
			await ApiService.remove(`${this.name}::getAllTenantWof`, this._getAllTenantWof.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _searchUsers(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const userList = await dbSrvc.knex.raw(`SELECT id, email, first_name, last_name FROM users WHERE id NOT IN (SELECT user_id FROM tenants_users WHERE tenant_id = ?) AND email ILIKE ?`, [ctxt.state.tenant.tenant_id, `%${ctxt.query.email}%`]);

			return userList.rows;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_searchUsers`, err);
		}
	}

	async _resetUserPassword(ctxt) {
		const dbSrvc = this.$dependencies.DatabaseService;

		const userEmail = await dbSrvc.knex.raw(`SELECT email FROM users WHERE id = ?`, [ctxt.request.body.user]);
		if(!userEmail.rows.length) throw new PlantWorksMiddlewareError(`Invalid User: ${ctxt.request.body.user}`);
		if(ctxt.request.body.password.trim() === '') throw new Error('Password cannot be empty');

		const uuid = require('uuid/v4');
		const upash = require('upash');

		if(ctxt.request.body.generate === 'true') { // eslint-disable-line curly
			try {
				const passwordGenerator = require('generate-password');
				const randomPassword = passwordGenerator.generate(this.$config.passwordFormat);

				ctxt.request.body.password = randomPassword;
			}
			catch(err) {
				console.error(err.message);
				ctxt.request.body.password = uuid().toString().replace(/-/g, '');
			}
		}

		const hashedPassword = await upash.hash(ctxt.request.body.password);
		await dbSrvc.knex.raw(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, ctxt.request.body.user]);

		const messageOptions = JSON.parse(safeJsonStringify(this.$config.resetPasswordMail));
		messageOptions['text'] = `Your new password on Plant.Works is ${ctxt.request.body.password}`;

		const notificationPayload = {
			'type': 'email',
			'users': [userEmail.rows[0].email],
			'data': messageOptions
		};

		//await this.$dependencies.PubsubService.publish('plantworks-data-stream', 'NOTIFICATIONS', safeJsonStringify(notificationPayload));

		return { 'status': true };
	}

	async _cloneAccount(ctxt) {
		try {
			const eventParams = {
				'tenantId': ctxt.state.tenant['tenant_id'],
				'originalUserId': ctxt.request.body.originalTenantUserId,
				'clonedUserId': ctxt.request.body.clonedTenantUserId
			};

			let serverModule = this.$parent;
			while(serverModule.$parent) serverModule = serverModule.$parent;

			serverModule.emit('clone-tenant-user', eventParams);
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_cloneAccount`, err);
		}
	}

	async _getAllTenantUsers(ctxt) {
		try {
			let tenantUserData = await this.$TenantUserModel
			.query(function(qb) {
				qb.where({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetchAll({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'user', 'user.contacts']
			});

			tenantUserData = this._convertToJsonApiFormat(tenantUserData, 'pug/user-manager/tenant-user', {
				'tenant': 'settings/account/basics/tenant',
				'user': 'pug/user-manager/user',
				'contacts': 'pug/user-manager/user-contact'
			}, {
				'deleteIncluded': false
			});

			tenantUserData.included.forEach((user) => {
				delete user.attributes.password;
			});

			return tenantUserData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllTenantUsers`, err);
		}
	}

	async _getTenantUser(ctxt) {
		try {
			let tenantUserData = await this.$TenantUserModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.tenantUserId })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'user', 'user.contacts']
			});

			tenantUserData = this._convertToJsonApiFormat(tenantUserData, 'pug/user-manager/tenant-user', {
				'tenant': 'settings/account/basics/tenant',
				'user': 'pug/user-manager/user',
				'contacts': 'pug/user-manager/user-contact'
			}, {
				'deleteIncluded': false
			});

			return tenantUserData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantUser`, err);
		}
	}

	async _createTenantUser(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$TenantUserModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_createTenantUser`, err);
		}
	}

	async _updateTenantUser(ctxt) {
		try {
			const TenantUserRecord = new this.$TenantUserModel({
				'id': ctxt.params.tenantUserId
			});

			const tenantUserData = await TenantUserRecord
			.query(function(qb) {
				qb.where({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantUserData) throw new Error(`Invalid record id`);

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await tenantUserData
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantUser`, err);
		}
	}

	async _deleteTenantUser(ctxt) {
		try {
			const tenantUserData = await this.$TenantUserModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.tenantUserId })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantUserData) throw new Error(`Invalid record id`);

			await tenantUserData.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteUser`, err);
		}
	}

	async _getUserFromTenantUser(ctxt) {
		try {
			const TenantUserRecord = new this.$TenantUserModel({
				'id': ctxt.params.tenantUserId
			});

			const tenantUserData = await TenantUserRecord
			.query(function(qb) {
				qb.where({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			const UserRecord = new this.$UserModel({
				'id': tenantUserData.get('user_id')
			});

			let userData = await UserRecord.fetch();
			userData = this._convertToJsonApiFormat(userData, 'pug/user-manager/users', null, {
				'deleteIncluded': false
			});

			delete userData.data.attributes.password;
			userData.data.attributes['middle_names'] = userData.data.attributes['middle_names'] || '';

			return userData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getUserFromTenantUser`, err);
		}
	}

	async _getUser(ctxt) {
		try {
			const UserRecord = new this.$UserModel({
				'id': ctxt.params.userId
			});

			let userData = await UserRecord.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['contacts']
			});

			userData = this._convertToJsonApiFormat(userData, 'pug/user-manager/users', {
				'contacts': 'pug/user-manager/user-contact'
			}, {
				'deleteIncluded': false
			});

			delete userData.data.attributes.password;
			userData.data.attributes['middle_names'] = userData.data.attributes['middle_names'] || '';

			return userData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getUser`, err);
		}
	}

	async _createUser(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const uuid = require('uuid/v4');
			const upash = require('upash');

			if(jsonDeserializedData.first_name !== undefined && jsonDeserializedData.first_name !== null && jsonDeserializedData.first_name.trim() === '') throw new Error('First Name cannot be empty');
			if(jsonDeserializedData.last_name !== undefined && jsonDeserializedData.last_name !== null && jsonDeserializedData.last_name.trim() === '') throw new Error('First Name cannot be empty');
			if(jsonDeserializedData.email !== undefined && jsonDeserializedData.email !== null && jsonDeserializedData.email.trim() === '') throw new Error('First Name cannot be empty');

			if(!jsonDeserializedData['password'].trim()) { // eslint-disable-line curly
				try {
					const passwordGenerator = require('generate-password');
					const randomPassword = passwordGenerator.generate(this.$config.passwordFormat);

					jsonDeserializedData['password'] = randomPassword;
				}
				catch(err) {
					console.error(err.message);
					jsonDeserializedData['password'] = uuid().toString().replace(/-/g, '');
				}
			}

			const clearTextPassword = jsonDeserializedData['password'];
			const hashedPassword = await upash.hash(jsonDeserializedData['password']);

			jsonDeserializedData['password'] = hashedPassword;

			const savedRecord = await this.$UserModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const messageOptions = JSON.parse(safeJsonStringify(this.$config.resetPasswordMail));
			messageOptions['text'] = `Your new password on Plant.Works is ${clearTextPassword}`;

			const notificationPayload = {
				'type': 'email',
				'users': [jsonDeserializedData.email],
				'data': messageOptions
			};

			//await this.$dependencies.PubsubService.publish('plantworks-data-stream', 'NOTIFICATIONS', safeJsonStringify(notificationPayload));

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_createUser`, err);
		}
	}

	async _updateUser(ctxt) {
		try {
			const user = ctxt.request.body;

			delete user.data.relationships;
			delete user.included;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(user);
			if(jsonDeserializedData.first_name !== undefined && jsonDeserializedData.first_name !== null && jsonDeserializedData.first_name.trim() === '') throw new Error('First Name cannot be empty');
			if(jsonDeserializedData.last_name !== undefined && jsonDeserializedData.last_name !== null && jsonDeserializedData.last_name.trim() === '') throw new Error('First Name cannot be empty');

			delete jsonDeserializedData.email;
			delete jsonDeserializedData.password;

			const savedRecord = await this.$UserModel
				.forge()
				// .where(jsonDeserializedData.id === 'id')
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			const cacheSrvc = this.$dependencies['CacheService'];
			await cacheSrvc.delAsync(`plantworks!webapp!user!${jsonDeserializedData['id']}!basics`);

			return {
				'data': {
					'type': user.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateUser`, err);
		}
	}

	async _deleteUser(ctxt) {
		try {
			const user = await new this.$UserModel({
				'id': ctxt.params['userId']
			})
			.fetch();

			if(!user) throw new Error('Unknown User');

			/* TODO: Add business logic checking to ensure that the User belongs to this Tenant, and belongs only to this tenant */
			await user.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteUser`, err);
		}
	}

	async _getAllTenantPanels(ctxt) {
		try {
			return this.getAllPanels(ctxt.state.tenant.tenant_id, ctxt.query.user_id);
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllTenantPanels`, err);
		}
	}

	async getAllPanels(tenant_id, user_id) {
		const dbSrvc = this.$dependencies.DatabaseService
		const panelList = await dbSrvc.knex.raw('SELECT id, tenant_folder_id, name FROM tenant_panels WHERE tenant_id = ?', [tenant_id]);

		const accessiblePanels = await dbSrvc.knex.raw(`SELECT tenant_panel_id FROM tenant_panels_users WHERE tenant_user_id = ? AND tenant_id = ?`, [user_id, tenant_id]);
		const accessiblePanelsId = [];
		accessiblePanels.rows.forEach((panel) => {
			accessiblePanelsId.push(panel.tenant_panel_id);
		});

		for (let index = 0; index < panelList.rows.length; index++) {
			const panel = panelList.rows[index];
			const folderNames = await dbSrvc.knex.raw(`select * FROM fn_get_folder_ancestors(?) ORDER BY level DESC`, [panel.tenant_folder_id]);
			const path = [];
			folderNames.rows.forEach(folderName => {
				path.push(folderName.name);
			});
			path.push(panel.name);
			panel['path'] = path;

			panel['currentAccess'] = accessiblePanelsId.includes(panel.id);
			panel['newAccess'] = panel['currentAccess'];
		}

		return panelList.rows;
	}

	async _updateTenantPanelsWatcher(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const data = ctxt.request.body;
			const allTenantPanels = JSON.parse(data['tenantPanels']);

			const tenantPanelsToUpdate = allTenantPanels.filter((panel) => {
				return panel.currentAccess != panel.newAccess
			})

			for (let i = 0; i < tenantPanelsToUpdate.length; i++) {
				if (tenantPanelsToUpdate[i].newAccess) {
					await dbSrvc.knex.raw(`INSERT INTO tenant_panels_users(tenant_id, tenant_panel_id, tenant_user_id) VALUES (?, ?, ?)`, [ctxt.state.tenant.tenant_id, tenantPanelsToUpdate[i].id, data.tenant_user_id]);
				}
				else {
					let userPanel = await dbSrvc.knex.raw(`SELECT * from tenant_panels_users WHERE tenant_id = ? and tenant_panel_id = ? and tenant_user_id = ?`, [ctxt.state.tenant.tenant_id, tenantPanelsToUpdate[i].id, data.tenant_user_id]);

					if (!userPanel.rows.length) {
						throw new Error('Unknown User Tenant Panel');
					}

					await dbSrvc.knex.raw(`DELETE FROM tenant_panels_users WHERE tenant_id = ? and tenant_panel_id = ? and tenant_user_id = ?`, [ctxt.state.tenant.tenant_id, tenantPanelsToUpdate[i].id, data.tenant_user_id]);
				}
			}

			return this.getAllPanels(ctxt.state.tenant.tenant_id, data.tenant_user_id);
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPanelsWatcher`, err);
		}
	}

	async _getAllTenantReports(ctxt) {
		try {
			return this.getAllReports(ctxt.state.tenant.tenant_id, ctxt.query.user_id);
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllTenantReports`, err);
		}
	}

	async getAllReports(tenant_id, user_id) {
		const dbSrvc = this.$dependencies.DatabaseService
		const reportList = await dbSrvc.knex.raw('SELECT id, tenant_folder_id, name FROM tenant_reports WHERE tenant_id = ?', [tenant_id]);

		const accessibleReports = await dbSrvc.knex.raw(`SELECT tenant_report_id FROM tenant_reports_users WHERE tenant_user_id = ? AND tenant_id = ?`, [user_id, tenant_id]);
		const accessibleReportsId = [];
		accessibleReports.rows.forEach((report) => {
			accessibleReportsId.push(report.tenant_report_id);
		});

		for (let index = 0; index < reportList.rows.length; index++) {
			const report = reportList.rows[index];
			const folderNames = await dbSrvc.knex.raw(`select * FROM fn_get_folder_ancestors(?) ORDER BY level DESC`, [report.tenant_folder_id]);
			const path = [];
			folderNames.rows.forEach(folderName => {
				path.push(folderName.name);
			});
			path.push(report.name);
			report['path'] = path;

			report['currentAccess'] = accessibleReportsId.includes(report.id);
			report['newAccess'] = report['currentAccess'];
		}

		return reportList.rows;
	}

	async _updateTenantReportsAccess(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const data = ctxt.request.body;
			const allTenantReports = JSON.parse(data['tenantReports']);

			const tenantReportsToUpdate = allTenantReports.filter((report) => {
				return report.currentAccess != report.newAccess
			})

			for (let i = 0; i < tenantReportsToUpdate.length; i++) {
				if (tenantReportsToUpdate[i].newAccess) {
					await dbSrvc.knex.raw(`INSERT INTO tenant_reports_users(tenant_id, tenant_report_id, tenant_user_id) VALUES (?, ?, ?)`, [ctxt.state.tenant.tenant_id, tenantReportsToUpdate[i].id, data.tenant_user_id]);
				}
				else {
					let tenantReport = await dbSrvc.knex.raw(`SELECT * FROM tenant_reports_users WHERE tenant_id = ? and tenant_report_id = ? AND tenant_user_id = ?`, [ctxt.state.tenant.tenant_id, tenantReportsToUpdate[i].id, data.tenant_user_id]);

					if (!tenantReport.rows.length) {
						throw new Error('Unknown User Tenant Report');
					}

					await dbSrvc.knex.raw(`DELETE FROM tenant_reports_users WHERE tenant_id = ? and tenant_report_id = ? AND tenant_user_id = ?`, [ctxt.state.tenant.tenant_id, tenantReportsToUpdate[i].id, data.tenant_user_id]);
				}
			}

			return this.getAllReports(ctxt.state.tenant.tenant_id, data.tenant_user_id);
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantReportsWatcher`, err);
		}
	}

	async _getAllTenantHdashboards(ctxt) {
		try {
			return this.getAllHdashboards(ctxt.state.tenant.tenant_id, ctxt.query.user_id);
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllTenantHdashboards`, err);
		}
	}

	async getAllHdashboards(tenant_id, user_id) {
		const dbSrvc = this.$dependencies.DatabaseService
		const hdashboardList = await dbSrvc.knex.raw('SELECT id, tenant_folder_id, name FROM tenant_historical_dashboards WHERE tenant_id = ?', [tenant_id]);

		const accessibleHdashboards = await dbSrvc.knex.raw(`SELECT tenant_historical_dashboard_id FROM tenant_historical_dashboards_users WHERE tenant_user_id = ? AND tenant_id = ?`, [user_id, tenant_id]);
		const accessibleHdashboardsId = [];
		accessibleHdashboards.rows.forEach((dashboard) => {
			accessibleHdashboardsId.push(dashboard.tenant_historical_dashboard_id);
		});

		for (let index = 0; index < hdashboardList.rows.length; index++) {
			const dashboard = hdashboardList.rows[index];
			const folderNames = await dbSrvc.knex.raw(`select * FROM fn_get_folder_ancestors(?) ORDER BY level DESC`, [dashboard.tenant_folder_id]);
			const path = [];
			folderNames.rows.forEach(folderName => {
				path.push(folderName.name);
			});
			path.push(dashboard.name);
			dashboard['path'] = path;

			dashboard['currentAccess'] = accessibleHdashboardsId.includes(dashboard.id);
			dashboard['newAccess'] = dashboard['currentAccess'];
		}

		return hdashboardList.rows;
	}

	async _updateTenantHdashboardsAccess(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const data = ctxt.request.body;
			const allTenantHdashboards = JSON.parse(data['tenantHdashboards']);

			const tenantHdashboardsToUpdate = allTenantHdashboards.filter((dashboard) => {
				return dashboard.currentAccess != dashboard.newAccess
			})

			for (let i = 0; i < tenantHdashboardsToUpdate.length; i++) {
				if (tenantHdashboardsToUpdate[i].newAccess) {
					await dbSrvc.knex.raw(`INSERT INTO tenant_historical_dashboards_users(tenant_id, tenant_historical_dashboard_id, tenant_user_id) VALUES (?, ?, ?)`, [ctxt.state.tenant.tenant_id, tenantHdashboardsToUpdate[i].id, data.tenant_user_id]);
				}
				else {
					let tenantHdashboard = await dbSrvc.knex.raw(`SELECT * FROM tenant_historical_dashboards_users WHERE tenant_id = ? and tenant_historical_dashboard_id = ? AND tenant_user_id = ?`, [ctxt.state.tenant.tenant_id, tenantHdashboardsToUpdate[i].id, data.tenant_user_id]);

					if (!tenantHdashboard.rows.length) {
						throw new Error('Unknown User Tenant Historical Dashboard');
					}

					await dbSrvc.knex.raw(`DELETE FROM tenant_historical_dashboards_users WHERE tenant_id = ? and tenant_historical_dashboard_id = ? AND tenant_user_id = ?`, [ctxt.state.tenant.tenant_id, tenantHdashboardsToUpdate[i].id, data.tenant_user_id]);
				}
			}

			return this.getAllHdashboards(ctxt.state.tenant.tenant_id, data.tenant_user_id);
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantHdashboardsAccess`, err);
		}
	}

	async _getAllTenantLines(ctxt) {
		try {
			return this.getAllLines(ctxt.state.tenant.tenant_id, ctxt.query.user_id);
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllTenantLines`, err);
		}
	}

	async getAllLines(tenant_id, user_id) {
		const dbSrvc = this.$dependencies.DatabaseService
		const linesList = await dbSrvc.knex.raw('SELECT id, tenant_plant_unit_id, name FROM tenant_plant_unit_lines WHERE tenant_id = ?', [tenant_id]);

		for (let index = 0; index < linesList.rows.length; index++) {
			const line = linesList.rows[index];

			const linePlantUnit = await dbSrvc.knex.raw('SELECT id, tenant_plant_id, name FROM tenant_plant_units WHERE id = ?', [line.tenant_plant_unit_id]);
			line['plant_unit_name'] = linePlantUnit.rows[0].name;

			const linePlant = await dbSrvc.knex.raw('SELECT id, tenant_folder_id, name FROM tenant_plants WHERE id = ?', [linePlantUnit.rows[0].tenant_plant_id]);
			line['tenant_folder_id'] = linePlant.rows[0].tenant_folder_id;
			line['plant_name'] = linePlant.rows[0].name;
		}

		const accessibleLines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_line_id FROM tenant_plant_unit_lines_users WHERE tenant_user_id = ? AND tenant_id = ?`, [user_id, tenant_id]);
		const accessibleLinesIds = [];
		accessibleLines.rows.forEach((line) => {
			accessibleLinesIds.push(line.tenant_plant_unit_line_id);
		});

		for (let index = 0; index < linesList.rows.length; index++) {
			const line = linesList.rows[index];
			const folderNames = await dbSrvc.knex.raw(`select * FROM fn_get_folder_ancestors(?) ORDER BY level DESC`, [line.tenant_folder_id]);
			const path = [];
			folderNames.rows.forEach(folderName => {
				path.push(folderName.name);
			});
			path.push(line.plant_name);
			path.push(line.plant_unit_name);
			path.push(line.name);
			line['path'] = path;

			line['currentAccess'] = accessibleLinesIds.includes(line.id);
			line['newAccess'] = line['currentAccess'];
		}

		return linesList.rows;
	}

	async _updateTenantLinesAccess(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const data = ctxt.request.body;
			const tenantLines = JSON.parse(data['tenantLines']);

			const tenantLinesToUpdate = tenantLines.filter((line) => {
				return line.currentAccess != line.newAccess
			})

			for (let i = 0; i < tenantLinesToUpdate.length; i++) {
				if (tenantLinesToUpdate[i].newAccess) {
					await dbSrvc.knex.raw(`INSERT INTO tenant_plant_unit_lines_users(tenant_id, tenant_plant_unit_line_id, tenant_user_id) VALUES (?, ?, ?)`, [ctxt.state.tenant.tenant_id, tenantLinesToUpdate[i].id, data.tenant_user_id]);
				}
				else {
					let tenantLine = await dbSrvc.knex.raw(`SELECT * FROM tenant_plant_unit_lines_users WHERE tenant_id = ? and tenant_plant_unit_line_id = ? AND tenant_user_id = ?`, [ctxt.state.tenant.tenant_id, tenantLinesToUpdate[i].id, data.tenant_user_id]);

					if (!tenantLine.rows.length) {
						throw new Error('Unknown User Tenant Line');
					}

					await dbSrvc.knex.raw(`DELETE FROM tenant_plant_unit_lines_users WHERE tenant_id = ? and tenant_plant_unit_line_id = ? AND tenant_user_id = ?`, [ctxt.state.tenant.tenant_id, tenantLinesToUpdate[i].id, data.tenant_user_id]);
				}
			}

			return this.getAllLines(ctxt.state.tenant.tenant_id, data.tenant_user_id);
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantLinesAccess`, err);
		}
	}

	async _getAllTenantStations(ctxt) {
		try {
			return this.getAllStations(ctxt.state.tenant.tenant_id, ctxt.query.user_id);
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllTenantStations`, err);
		}
	}

	async getAllStations(tenant_id, user_id) {
		const dbSrvc = this.$dependencies.DatabaseService
		const stationsList = await dbSrvc.knex.raw('SELECT id, tenant_plant_unit_id, name FROM tenant_plant_unit_stations WHERE tenant_id = ?', [tenant_id]);

		for (let index = 0; index < stationsList.rows.length; index++) {
			const station = stationsList.rows[index];

			const stationPlantUnit = await dbSrvc.knex.raw('SELECT id, tenant_plant_id, name FROM tenant_plant_units WHERE id = ?', [station.tenant_plant_unit_id]);
			station['plant_unit_name'] = stationPlantUnit.rows[0].name;

			const stationPlant = await dbSrvc.knex.raw('SELECT id, tenant_folder_id, name FROM tenant_plants WHERE id = ?', [stationPlantUnit.rows[0].tenant_plant_id]);
			station['tenant_folder_id'] = stationPlant.rows[0].tenant_folder_id;
			station['plant_name'] = stationPlant.rows[0].name;
		}

		const accessibleStations = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_station_id FROM tenant_plant_unit_stations_users WHERE tenant_user_id = ? AND tenant_id = ?`, [user_id, tenant_id]);
		const accessibleStationsIds = [];
		accessibleStations.rows.forEach((station) => {
			accessibleStationsIds.push(station.tenant_plant_unit_station_id);
		});

		for (let index = 0; index < stationsList.rows.length; index++) {
			const station = stationsList.rows[index];
			const folderNames = await dbSrvc.knex.raw(`select * FROM fn_get_folder_ancestors(?) ORDER BY level DESC`, [station.tenant_folder_id]);
			const path = [];
			folderNames.rows.forEach(folderName => {
				path.push(folderName.name);
			});
			path.push(station.plant_name);
			path.push(station.plant_unit_name);
			path.push(station.name);
			station['path'] = path;

			station['currentAccess'] = accessibleStationsIds.includes(station.id);
			station['newAccess'] = station['currentAccess'];
		}

		return stationsList.rows;
	}

	async _updateTenantStationsAccess(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const data = ctxt.request.body;
			const tenantStations = JSON.parse(data['tenantStations']);

			const tenantStationsToUpdate = tenantStations.filter((station) => {
				return station.currentAccess != station.newAccess
			})

			for (let i = 0; i < tenantStationsToUpdate.length; i++) {
				if (tenantStationsToUpdate[i].newAccess) {
					await dbSrvc.knex.raw(`INSERT INTO tenant_plant_unit_stations_users(tenant_id, tenant_plant_unit_station_id, tenant_user_id) VALUES (?, ?, ?)`, [ctxt.state.tenant.tenant_id, tenantStationsToUpdate[i].id, data.tenant_user_id]);
				}
				else {
					let tenantStation = await dbSrvc.knex.raw(`SELECT * FROM tenant_plant_unit_stations_users WHERE tenant_id = ? and tenant_plant_unit_station_id = ? AND tenant_user_id = ?`, [ctxt.state.tenant.tenant_id, tenantStationsToUpdate[i].id, data.tenant_user_id]);

					if (!tenantStation.rows.length) {
						throw new Error('Unknown User Tenant Station');
					}

					await dbSrvc.knex.raw(`DELETE FROM tenant_plant_unit_stations_users WHERE tenant_id = ? and tenant_plant_unit_station_id = ? AND tenant_user_id = ?`, [ctxt.state.tenant.tenant_id, tenantStationsToUpdate[i].id, data.tenant_user_id]);
				}
			}

			return this.getAllStations(ctxt.state.tenant.tenant_id, data.tenant_user_id);
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantStationsAccess`, err);
		}
	}

	async _getAllTenantEmd(ctxt) {
		try {
			return this.getAllEmd(ctxt.state.tenant.tenant_id, ctxt.query.user_id);
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllTenantEmd`, err);
		}
	}

	async getAllEmd(tenant_id, user_id) {
		const dbSrvc = this.$dependencies.DatabaseService;
		const emdList = await dbSrvc.knex.raw('SELECT id, tenant_folder_id, name FROM tenant_emd_configurations WHERE tenant_id = ?', [tenant_id]);

		const accessibleEmd = await dbSrvc.knex.raw(`SELECT tenant_emd_id FROM tenant_emd_users WHERE tenant_user_id = ? AND tenant_id = ?`, [user_id, tenant_id]);
		const accessibleEmdId = [];
		accessibleEmd.rows.forEach((emd) => {
			accessibleEmdId.push(emd.tenant_emd_id);
		});

		for(let index = 0; index < emdList.rows.length; index++) {
			const emd = emdList.rows[index];
			const folderNames = await dbSrvc.knex.raw(`select * FROM fn_get_folder_ancestors(?) ORDER BY level DESC`, [emd.tenant_folder_id]);
			const path = [];
			folderNames.rows.forEach(folderName => {
				path.push(folderName.name);
			});
			path.push(emd.name);
			emd['path'] = path;

			emd['currentAccess'] = accessibleEmdId.includes(emd.id);
			emd['newAccess'] = emd['currentAccess'];
		}

		return emdList.rows;
	}

	async _updateTenantEmdAccess(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const data = ctxt.request.body;
			const allTenantEmd = JSON.parse(data['tenantEmds']);

			const tenantEmdToUpdate = allTenantEmd.filter((emd) => {
				return emd.currentAccess != emd.newAccess;
			});

			for(let i = 0; i < tenantEmdToUpdate.length; i++) {
				if(tenantEmdToUpdate[i].newAccess) {
					await dbSrvc.knex.raw(`INSERT INTO tenant_emd_users(tenant_id, tenant_emd_id, tenant_user_id) VALUES (?, ?, ?)`, [ctxt.state.tenant.tenant_id, tenantEmdToUpdate[i].id, data.tenant_user_id]);
				}
				else {
					let userEmd = await dbSrvc.knex.raw(`SELECT * from tenant_emd_users WHERE tenant_id = ? and tenant_emd_id = ? and tenant_user_id = ?`, [ctxt.state.tenant.tenant_id, tenantEmdToUpdate[i].id, data.tenant_user_id]);

					if(!userEmd.rows.length) {
						throw new Error('Unknown User Tenant Emd');
					}

					await dbSrvc.knex.raw(`DELETE FROM tenant_emd_users WHERE tenant_id = ? and tenant_emd_id = ? and tenant_user_id = ?`, [ctxt.state.tenant.tenant_id, tenantEmdToUpdate[i].id, data.tenant_user_id]);
				}
			}

			return this.getAllEmd(ctxt.state.tenant.tenant_id, data.tenant_user_id);
			}
			catch(err) {
				throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantEmdWatcher`, err);
			}
		}

		async _getAllTenantWof(ctxt) {
			try {
				return this.getAllWof(ctxt.state.tenant.tenant_id, ctxt.query.user_id);
			}
			catch(err) {
				throw new PlantWorksMiddlewareError(`${this.name}::_getAllTenantWof`, err);
			}
		}

		async getAllWof(tenant_id, user_id) {
			const dbSrvc = this.$dependencies.DatabaseService;
			const wofList = await dbSrvc.knex.raw('SELECT id, tenant_folder_id, name FROM tenant_work_order_formats WHERE tenant_id = ?', [tenant_id]);

			const accessibleWof = await dbSrvc.knex.raw(`SELECT tenant_wof_id FROM tenant_wof_users WHERE tenant_user_id = ? AND tenant_id = ?`, [user_id, tenant_id]);
			const accessibleWofId = [];
			accessibleWof.rows.forEach((wof) => {
				accessibleWofId.push(wof.tenant_wof_id);
			});

			for(let index = 0; index < wofList.rows.length; index++) {
				const wof = wofList.rows[index];
				const folderNames = await dbSrvc.knex.raw(`select * FROM fn_get_folder_ancestors(?) ORDER BY level DESC`, [wof.tenant_folder_id]);
				const path = [];
				folderNames.rows.forEach(folderName => {
					path.push(folderName.name);
				});
				path.push(wof.name);
				wof['path'] = path;

				wof['currentAccess'] = accessibleWofId.includes(wof.id);
				wof['newAccess'] = wof['currentAccess'];
			}

			return wofList.rows;
		}

		async _updateTenantWofAccess(ctxt) {
			try {
				const dbSrvc = this.$dependencies.DatabaseService;
				const data = ctxt.request.body;
				const allTenantWof = JSON.parse(data['tenantWofs']);

				const tenantWofToUpdate = allTenantWof.filter((wof) => {
					return wof.currentAccess != wof.newAccess;
				});

				for(let i = 0; i < tenantWofToUpdate.length; i++) {
					if(tenantWofToUpdate[i].newAccess) {
						await dbSrvc.knex.raw(`INSERT INTO tenant_wof_users(tenant_id, tenant_wof_id, tenant_user_id) VALUES (?, ?, ?)`, [ctxt.state.tenant.tenant_id, tenantWofToUpdate[i].id, data.tenant_user_id]);
					}
					else {
						let userWof = await dbSrvc.knex.raw(`SELECT * from tenant_wof_users WHERE tenant_id = ? and tenant_wof_id = ? and tenant_user_id = ?`, [ctxt.state.tenant.tenant_id, tenantWofToUpdate[i].id, data.tenant_user_id]);

						if(!userWof.rows.length) {
							throw new Error('Unknown User Tenant Wof');
						}

						await dbSrvc.knex.raw(`DELETE FROM tenant_wof_users WHERE tenant_id = ? and tenant_wof_id = ? and tenant_user_id = ?`, [ctxt.state.tenant.tenant_id, tenantWofToUpdate[i].id, data.tenant_user_id]);
					}
				}

				return this.getAllWof(ctxt.state.tenant.tenant_id, data.tenant_user_id);
				}
			catch(err) {
				throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantWofWatcher`, err);
				}
			}

	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get dependencies() {
		return ['PubsubService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.middleware = Main;
