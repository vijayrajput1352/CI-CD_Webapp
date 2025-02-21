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
const PlantWorksCompError = require('plantworks-component-error').PlantWorksComponentError;

/**
 * @class   Session
 * @extends {PlantWorksBaseComponent}
 * @classdesc The Plant.Works Web Application Server Session component - manages login/logout and related API.
 *
 *
 */
class Session extends PlantWorksBaseComponent {
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
	 * @memberof Session
	 * @name     _addRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds routes to the Koa Router.
	 */
	async _addRoutes() {
		try {
			this.$router.get('/user', this._getUser.bind(this));

			this.$router.post('/login', this._login.bind(this));
			this.$router.get('/logout', this._logout.bind(this));

			this.$router.post('/reset-password', this._resetPassword.bind(this));
			this.$router.get('/getSystemTime', this._getSystemTime.bind(this));

			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksCompError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	async  _getSystemTime(ctxt){
        ctxt.status = 200;
        ctxt.body = { pcTime: new Date().toLocaleTimeString() };
    }

	// #region Route Handlers
	async _getUser(ctxt) {
		ctxt.status = 200;
		ctxt.body = {
			'user_id': ctxt.state.user ? ctxt.state.user.user_id : 'ffffffff-ffff-4fff-ffff-ffffffffffff',
			'tenant_id': ctxt.state.user ? ctxt.state.tenant.tenant_id : 'ffffffff-ffff-4fff-ffff-ffffffffffff',
			'name': ctxt.state.user ? `${ctxt.state.user.first_name} ${ctxt.state.user.last_name}` : 'Public',
			'email': ctxt.state.user ? ctxt.state.user.email : 'public@visitor.com',
			'loggedIn': ctxt.isAuthenticated(),
			'permissions': (ctxt.state.user ? ctxt.state.user.permissions.map((permission) => { return permission.name; }) : ['public']),
			'designation': ctxt.state.user ? ctxt.state.user.tenantAttributes.designation : '',
			'defaultApplication': ctxt.state.user ? ctxt.state.user.tenantAttributes.default_route : '',
			'defaultApplicationParameters': ctxt.state.user ? ctxt.state.user.tenantAttributes.default_application_parameters : '',
			'otherTenants': ctxt.state.user ? ctxt.state.user.tenantAttributes.allowed_tenants : [],
			'image': ctxt.state.user ? ctxt.state.user.profile_image : '',
			'imageMetadata': ctxt.state.user ? ctxt.state.user.profile_image_metadata : {}
		};

		if(ctxt.state.user && !ctxt.body.permissions.includes('registered'))
			ctxt.body.permissions.push('registered');

		return null;
	}

	async _login(ctxt) {
		if(ctxt.isAuthenticated()) throw new PlantWorksCompError(`Already logged in`);

		return this.$dependencies.AuthService.authenticate('plantworks-local', async (err, user, info, status) => {
			if(err) throw new PlantWorksCompError(`Login Error: `, err);
			if(!user) throw new PlantWorksCompError(`User: ${ctxt.request.body.username} not found`);

			await ctxt.login(user);

			ctxt.status = 200;
			ctxt.body = { 'status': status || 200, 'info': info || { 'message': `Login for ${user.first_name} ${user.last_name} successful` } };

			const dbSrvc = this.$dependencies.DatabaseService;
			const allowedTenants = await dbSrvc.knex.raw(`SELECT * FROM tenants WHERE id IN (SELECT tenant_id FROM tenants_users WHERE user_id = ? AND access_status = 'authorized') AND enabled = true`, [user.id]);

			const allowedTenantIds = allowedTenants.rows.map((allowedTenant) => {
				return allowedTenant['id'];
			});

			if(allowedTenantIds.includes(ctxt.state.tenant.tenant_id)) {
				ctxt.body.nextAction = 'proceed';
				return;
			}

			// await ctxt.logout();

			if(allowedTenantIds.length === 0) {
				ctxt.body.nextAction = 'redirect';
				ctxt.body.redirectDomain = 'www';

				return;
			}

			if(allowedTenantIds.length === 1) {
				ctxt.body.nextAction = 'redirect';
				ctxt.body.redirectDomain = allowedTenants.rows[0].sub_domain;

				return;
			}

			if(allowedTenantIds.length > 1) {
				ctxt.body.nextAction = 'choose';
				return;
			}
		})(ctxt);
	}

	async _logout(ctxt) {
		if(!ctxt.isAuthenticated()) throw new PlantWorksCompError(`No active session`);

		const cacheSrvc = this.$dependencies['CacheService'];
		const cachedKeys = await cacheSrvc.keysAsync(`plantworks!webapp!user!${ctxt.state.user.user_id}!*`);

		const cacheMulti = cacheSrvc.multi();
		cachedKeys.forEach((cachedKey) => {
			cacheMulti.delAsync(cachedKey);
		});

		await cacheMulti.execAsync();
		await ctxt.logout();

		ctxt.status = 200;
		ctxt.body = { 'status': 200, 'info': { 'message': `Logout successful` } };
	}

	async _resetPassword(ctxt) {
		await this.$dependencies.ApiService.execute('Session::resetPassword', ctxt);

		ctxt.status = 200;
		ctxt.body = { 'status': 200, 'message': `Password reset successful. Please check your email for the new password` };

		return;
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get dependencies() {
		return ['AuthService', 'DatabaseService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.component = Session;
