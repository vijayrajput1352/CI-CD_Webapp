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
 * @classdesc The Main component of the Profile Feature - manages CRUD for the User's profile.
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
			this.$router.get('/users/:user_id', this.$parent._rbac('registered'), this._getProfile.bind(this));
			this.$router.get('/default-app-option-list', this.$parent._rbac('registered'), this._defaultAppOptionList.bind(this));

			this.$router.patch('/users/:user_id', this.$parent._rbac('registered'), this._updateProfile.bind(this));
			this.$router.del('/users/:user_id', this.$parent._rbac('registered'), this._deleteProfile.bind(this));

			this.$router.get('/get-image', this.$parent._rbac('registered'), this._getProfileImage.bind(this));
			this.$router.post('/upload-image', this.$parent._rbac('registered'), this._updateProfileImage.bind(this));

			this.$router.post('/changePassword', this.$parent._rbac('registered'), this._changePassword.bind(this));

			this.$router.post('/user-contacts', this.$parent._rbac('registered'), this._addContact.bind(this));
			this.$router.del('/user-contacts/:user_contact_id', this.$parent._rbac('registered'), this._deleteContact.bind(this));

			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _defaultAppOptionList(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const userData = await apiSrvc.execute('Main::defaultAppOptionList', ctxt);

			ctxt.status = 200;
			ctxt.body = userData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving features data`, err);
		}
	}

	async _getProfile(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const userData = await apiSrvc.execute('Main::getProfile', ctxt);

			ctxt.status = 200;
			ctxt.body = userData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving profile data`, err);
		}
	}

	async _updateProfile(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const userData = await apiSrvc.execute('Main::updateProfile', ctxt);

			ctxt.status = 200;
			ctxt.body = userData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating profile data`, err);
		}
	}

	async _deleteProfile(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteProfile', ctxt);

			const cacheSrvc = this.$dependencies['CacheService'];
			const cachedKeys = await cacheSrvc.keysAsync(`plantworks!webapp!user!${ctxt.state.user.user_id}!*`);

			const cacheMulti = cacheSrvc.multi();
			cachedKeys.forEach((cachedKey) => {
				cacheMulti.delAsync(cachedKey);
			});

			await cacheMulti.execAsync();
			await ctxt.logout();

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting profile`, err);
		}
	}

	async _getProfileImage(ctxt) {
		try {
			const path = require('path');
			const send = require('koa-send');

			const apiSrvc = this.$dependencies.ApiService;

			let userData = await apiSrvc.execute('Main::getProfile', ctxt);
			userData = userData.shift();

			const profileImageFolder = this.$parent.$config.profileImagePath;
			// if(!path.isAbsolute(profileImageFolder)) {
			// 	const rootPath = path.dirname(path.dirname(require.main.filename));
			// 	profileImageFolder = path.join(rootPath, profileImageFolder);
			// }

			const profileImagePath = path.join(profileImageFolder, `${userData.data.attributes.profile_image}.png`);
			let profileImageExists = false;

			try {
				profileImageExists = await this._exists(profileImagePath);
			}
			catch(err) {
				// Do nothing...
			}

			if(profileImageExists)
				await send(ctxt, profileImagePath);
			else
				await send(ctxt, path.join(profileImageFolder, 'anonymous.jpg'));

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving profile image`, err);
		}
	}

	async _updateProfileImage(ctxt) {
		try {
			const fs = require('fs');
			const path = require('path');
			const promises = require('bluebird');
			const uuid = require('uuid/v4');

			const filesystem = promises.promisifyAll(fs);

			const apiSrvc = this.$dependencies.ApiService;

			let userData = await apiSrvc.execute('Main::getProfile', ctxt);
			userData = userData.shift();

			const currentImageId = userData.data.attributes.profile_image,
				image = ctxt.request.body.image.replace(/' '/g, '+').replace('data:image/png;base64,', ''),
				imageId = uuid().toString();

			let profileImageFolder = this.$parent.$config.profileImagePath;
			if(!path.isAbsolute(profileImageFolder)) {
				const rootPath = path.dirname(path.dirname(require.main.filename));
				profileImageFolder = path.join(rootPath, profileImageFolder);
			}

			const profileImagePath = path.join(profileImageFolder, `${imageId}.png`);
			await filesystem.writeFileAsync(profileImagePath, Buffer.from(image, 'base64'));

			ctxt.request.body = {
				'data': {
					'id': ctxt.state.user.user_id,
					'type': 'profile/users',
					'attributes': {
						'profile_image': imageId,
						'profile_image_metadata': ctxt.request.body.metadata
					}
				}
			};

			await apiSrvc.execute('Main::updateProfile', ctxt);

			ctxt.status = 200;
			ctxt.body = {
				'status': true,
				'responseText': 'Profile Image Updated succesfully'
			};

			if(!currentImageId) return null;
			if(currentImageId === 'f8a9da32-26c5-495a-be9a-42f2eb8e4ed1') return null;

			const currentImageExists = await this._exists(path.join(profileImageFolder, `${currentImageId}.png`));
			if(currentImageExists) await filesystem.unlinkAsync(path.join(profileImageFolder, `${currentImageId}.png`));

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating profile image`, err);
		}
	}

	async _changePassword(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const status = await apiSrvc.execute('Main::changePassword', ctxt);

			ctxt.status = 200;
			ctxt.body = status.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating password`, err);
		}
	}

	async _addContact(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const status = await apiSrvc.execute('Main::addContact', ctxt);

			ctxt.status = 200;
			ctxt.body = status.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding contact`, err);
		}
	}

	async _deleteContact(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteContact', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting contact`, err);
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
