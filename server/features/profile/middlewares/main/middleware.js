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
 * @classdesc The Plant.Works Web Application Server Profile Feature Main middleware - manages CRUD for profile data.
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

			Object.defineProperty(this, '$UserModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'users',
					'hasTimestamps': true,

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
			delete this.$UserContactModel;
			delete this.$UserModel;

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

			await ApiService.add(`${this.name}::getProfile`, this._getProfile.bind(this));
			await ApiService.add(`${this.name}::defaultAppOptionList`, this._defaultAppOptionList.bind(this));
			await ApiService.add(`${this.name}::updateProfile`, this._updateProfile.bind(this));
			await ApiService.add(`${this.name}::deleteProfile`, this._deleteProfile.bind(this));

			await ApiService.add(`${this.name}::changePassword`, this._changePassword.bind(this));

			await ApiService.add(`${this.name}::addContact`, this._addContact.bind(this));
			await ApiService.add(`${this.name}::deleteContact`, this._deleteContact.bind(this));

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

			await ApiService.remove(`${this.name}::deleteContact`, this._deleteContact.bind(this));
			await ApiService.remove(`${this.name}::addContact`, this._addContact.bind(this));

			await ApiService.remove(`${this.name}::changePassword`, this._changePassword.bind(this));

			await ApiService.remove(`${this.name}::deleteProfile`, this._deleteProfile.bind(this));
			await ApiService.remove(`${this.name}::updateProfile`, this._updateProfile.bind(this));
			await ApiService.remove(`${this.name}::defaultAppOptionList`, this._defaultAppOptionList.bind(this));
			await ApiService.remove(`${this.name}::getProfile`, this._getProfile.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API

	async _defaultAppOptionList(ctxt) {
		try {
			let serverModule = this.$parent;
			while(serverModule.$parent) serverModule = serverModule.$parent;

			const serverFeatureNames = Object.keys(serverModule.$features || {});
			const data = {};

			for(let idx = 0; idx < serverFeatureNames.length; idx++) {
				const featureModule = serverModule.$features[(serverFeatureNames[idx])];

				const userApplications = await featureModule.getUserApplications(ctxt);
				if(!userApplications) continue;

				data[`${userApplications.name}`] = userApplications;
			}
			return data;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_defaultAppOptionList`, err);
		}
	}

	async _getProfile(ctxt) {
		try {
			// const data = {};
			const UserRecord = new this.$UserModel({
				'id': ctxt.state.user.user_id
			});

			let profileData = await UserRecord.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['contacts']
			});

			profileData = this._convertToJsonApiFormat(profileData, 'profile/users', {
				'contacts': 'profile/user_contacts'
			}, {
				'deleteIncluded': false
			});

			let defaultApplication = await this.$dependencies.DatabaseService.knex.raw(`select name,id from modules where id in (SELECT default_application FROM tenants_users WHERE user_id = ? AND tenant_id = ?)`, ([profileData.data.id, ctxt.state.tenant.tenant_id]));
			const defaultAppParameters = await this.$dependencies.DatabaseService.knex.raw(`SELECT default_application_parameters FROM tenants_users WHERE user_id = ? AND tenant_id = ?`, ([profileData.data.id, ctxt.state.tenant.tenant_id]));

			if(!defaultApplication.rows.length) defaultApplication = await this.$dependencies.DatabaseService.knex.raw(`select name,id from modules where name = 'Dashboard'`);

			delete profileData.data.attributes.password;
			profileData.data.attributes['middle_names'] = profileData.data.attributes['middle_names'] || '';

			const defaultApp = defaultApplication.rows[0];
			const defaultAppParams = defaultAppParameters.rows[0];

			profileData.data.attributes['default_application'] = defaultApp;
			profileData.data.attributes['default_application_parameters'] = defaultAppParams.default_application_parameters;

			return profileData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getProfile`, err);
		}
	}

	async _updateProfile(ctxt) {
		try {
			const user = ctxt.request.body;
			delete user.data.relationships;
			delete user.included;

			const defaultApplication = user.data.attributes.default_application;
			const defaultApplicationParams = user.data.attributes.default_application_parameters;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(user);
			if(jsonDeserializedData.first_name !== undefined && jsonDeserializedData.first_name !== null && jsonDeserializedData.first_name.trim() === '') throw new Error('First Name cannot be empty');
			if(jsonDeserializedData.last_name !== undefined && jsonDeserializedData.last_name !== null && jsonDeserializedData.last_name.trim() === '') throw new Error('Last Name cannot be empty');


			delete jsonDeserializedData.email;
			delete jsonDeserializedData.created_at;
			delete jsonDeserializedData.updated_at;
			delete jsonDeserializedData.default_application;
			delete jsonDeserializedData.default_application_parameters;

			const savedRecord = await this.$UserModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			await this.$dependencies.DatabaseService.knex.raw('UPDATE tenants_users SET default_application = ?, default_application_parameters = ? WHERE user_id = ? AND tenant_id = ?', ([defaultApplication.id, defaultApplicationParams, ctxt.state.user.user_id, ctxt.state.tenant.tenant_id]));

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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateProfile`, err);
		}
	}

	async _deleteProfile(ctxt) {
		try {
			const UserRecord = new this.$UserModel({
				'id': ctxt.state.user.user_id
			});

			const profileData = await UserRecord.fetch();

			const isUserSuper = ctxt.state.user.permissions.filter((permission) => {
				return permission.name === 'super-administrator';
			}).length;

			if(!isUserSuper) {
				await profileData.destroy();
				return null;
			}

			const superPermId = ctxt.state.user.permissions.filter((permission) => {
				return permission.name === 'super-administrator';
			})[0]['permission_id'];

			const otherSupers = await this.$dependencies.DatabaseService.knex.raw(`SELECT tenant_user_id FROM tenants_users_groups WHERE tenant_id = ? AND tenant_group_id IN (SELECT tenant_group_id FROM tenant_group_permissions WHERE module_permission_id = ?) AND tenant_user_id <> (SELECT id FROM tenants_users WHERE tenant_id = ? AND user_id = ?)`, [
				ctxt.state.tenant.tenant_id,
				superPermId,
				ctxt.state.tenant.tenant_id,
				ctxt.state.user.user_id
			]);

			if(otherSupers.rows.length) {
				await profileData.destroy();
				return null;
			}

			throw new Error(`Cannot delete the only Super Administrator for the Tenant`);
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteProfile`, err);
		}
	}

	async _changePassword(ctxt) {
		try {
			const upash = require('upash');
			const passwordData = ctxt.request.body;

			if(passwordData.currentPassword.trim() === '') throw new Error(`Current Password cannot be empty`);
			if(passwordData.newPassword1 === '') throw new Error(`New Password cannot be empty`);
			if(passwordData.newPassword1 !== passwordData.newPassword2) throw new Error(`New Password is not repeated correctly`);

			const UserRecord = new this.$UserModel({
				'id': ctxt.state.user.user_id
			});

			const profileData = await UserRecord.fetch();
			const credentialMatch = await upash.verify(profileData.get('password'), passwordData.currentPassword);
			if(!credentialMatch) throw new PlantWorksMiddlewareError('Invalid Credentials - please try again');

			const hashedNewPassword = await upash.hash(passwordData.newPassword1);
			profileData.set('password', hashedNewPassword);

			await profileData.save();

			return { 'status': 200, 'message': 'Password updated successfully' };
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_changePassword`, err);
		}
	}

	async _addContact(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$UserContactModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addContact`, err);
		}
	}

	async _deleteContact(ctxt) {
		try {
			const userContact = await new this.$UserContactModel({
				'id': ctxt.params['user_contact_id']
			})
			.fetch();

			if(userContact.get('user_id') !== ctxt.state.user['user_id'])
				throw new Error(`Contact does not belong to the logged in User`);

			await userContact.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteContact`, err);
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
