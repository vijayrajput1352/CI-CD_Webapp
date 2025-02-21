/* eslint-disable security/detect-object-injection */

'use strict';

/**
 * Module dependencies, required for ALL Plant.Works modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseModule = require('./plantworks-base-module').PlantWorksBaseModule;
const PlantWorksFeatureError = require('./plantworks-feature-error').PlantWorksFeatureError;

/**
 * @class   PlantWorksBaseFeature
 * @extends {PlantWorksBaseModule}
 * @classdesc The Plant.Works Web Application Server Base Class for all Features.
 *
 * @param   {PlantWorksBaseModule} [parent] - The parent module, if any.
 * @param   {PlantWorksModuleLoader} [loader] - The loader to be used for managing modules' lifecycle, if any.
 *
 * @description
 * Serves as the "base class" for all other features in the Plant.Works Web Application Server.
 *
 */
class PlantWorksBaseFeature extends PlantWorksBaseModule {
	// #region Constructor
	constructor(parent, loader) {
		super(parent, null);

		const PlantWorksFeatureLoader = require('./plantworks-feature-loader').PlantWorksFeatureLoader;
		const actualLoader = (loader instanceof PlantWorksFeatureLoader) ? loader : new PlantWorksFeatureLoader(this);

		this.$loader = actualLoader;

		const inflection = require('inflection');
		const Router = require('koa-router');

		const inflectedName = inflection.transform(this.name, ['foreign_key', 'dasherize']).replace('-id', '');
		this.$router = new Router({ 'prefix': `/${inflectedName}` });

		// The RBAC Koa middleware
		// this.$router.use(this._doesUserHavePermission.bind(this));

		// The ABAC Koa middleware
		// this.$router.use(this._canUserAccessThisResource.bind(this));
	}
	// #endregion

	// #region Lifecycle hooks
	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof PlantWorksBaseFeature
	 * @name     _setup
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds the Koa Router routes.
	 */
	async _setup() {
		try {
			await super._setup();
			await this._addRoutes();

			return null;
		}
		catch(err) {
			throw new PlantWorksFeatureError(`${this.name}::_setup error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof PlantWorksBaseFeature
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Destroys the Koa Router routes.
	 */
	async _teardown() {
		try {
			await this._deleteRoutes();
			await super._teardown();

			return null;
		}
		catch(err) {
			throw new PlantWorksFeatureError(`${this.name}::_teardown error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof PlantWorksBaseFeature
	 * @name     _subModuleReconfigure
	 *
	 * @param    {PlantWorksBaseModule} subModule - The sub-module that changed configuration.
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Lets the module know that one of its subModules changed configuration.
	 */
	async _subModuleReconfigure(subModule) {
		await super._subModuleReconfigure(subModule);

		const subModuleType = Object.getPrototypeOf(Object.getPrototypeOf(subModule)).name;
		if((subModuleType !== 'PlantWorksBaseComponent') && (subModuleType !== 'PlantWorksBaseFeature'))
			return null;

		await this._deleteRoutes();
		await this._addRoutes();

		await this.$parent._subModuleReconfigure(this);
		return null;
	}
	// #endregion

	// #region Protected methods - need to be overriden by derived classes
	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof PlantWorksBaseFeature
	 * @name     getDashboardDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Dashboard display stuff for this Feature.
	 *
	 * @summary  Derived classes should return details, or null - depending on whether the user has the required permission(s).
	 */
	async getDashboardDisplayDetails(ctxt) { // eslint-disable-line no-unused-vars
		const inflection = require('inflection');

		const id = await this.$dependencies.ConfigurationService.getModuleID(this);
		const inflectedFeatureName = inflection.transform(this.name, ['foreign_key', 'dasherize']).replace('-id', '');

		return {
			'id': `${id}-dashboard`,
			'type': 'dashboard/feature',

			'attributes': {
				'name': inflection.transform(this.name, ['tableize', 'singularize', 'titleize']),
				'module_type': 'feature',
				'dashboard_category': 'administration',
				'route': inflectedFeatureName,
				'route_params': null,
				'display_order': 'last',

				// eslint-disable-next-line no-inline-comments
				'icon_type': 'fa', // Other choices are md, mdi, img, custom
				'icon_path': 'laptop-code'
			}
		};
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof PlantWorksBaseFeature
	 * @name     getSettingsDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Settings display stuff for this Feature.
	 *
	 * @summary  Derived classes should return details, or null - depending on whether the user has the required permission(s).
	 */
	async getSettingsDisplayDetails(ctxt) { // eslint-disable-line no-unused-vars
		try {
			const rbacChecker = this._rbac('settings-access');
			await rbacChecker(ctxt);

			const inflection = require('inflection');

			const id = await this.$dependencies.ConfigurationService.getModuleID(this);
			const inflectedFeatureName = inflection.transform(this.name, ['foreign_key', 'dasherize']).replace('-id', '');

			return {
				'id': `${id}-settings`,
				'type': 'settings/node',

				'attributes': {
					'module_type': 'feature',
					'node_type': 'leaf',
					'route': inflectedFeatureName,
					'route_params': null,
					'display_order': 'last'
				}
			};
		}
		catch(err) {
			return null;
		}
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof PlantWorksBaseFeature
	 * @name     getConfigDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Config display stuff for this Feature.
	 *
	 * @summary  Derived classes should return details, or null - depending on whether the user has the required permission(s).
	 */
	async getConfigDisplayDetails(ctxt) {
		try {
			const rbacChecker = this._rbac('config-access');
			await rbacChecker(ctxt);

			const inflection = require('inflection');

			const id = await this.$dependencies.ConfigurationService.getModuleID(this);
			const inflectedFeatureName = inflection.transform(this.name, ['foreign_key', 'dasherize']).replace('-id', '');

			return {
				'id': `${id}-config`,
				'type': 'configure/node',

				'attributes': {
					'module_type': 'feature',
					'node_type': 'leaf',
					'route': inflectedFeatureName,
					'route_params': null,
					'data_url': '/'
				}
			};
		}
		catch(err) {
			return null;
		}
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof PlantWorksBaseFeature
	 * @name     getDevEnvDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Development Environment display stuff for this Feature.
	 *
	 * @summary  Derived classes should return details, or null - depending on whether the user has the required permission(s).
	 */
	async getDevEnvDisplayDetails(ctxt) {
		try {
			const rbacChecker = this._rbac('devenv-access');
			await rbacChecker(ctxt);

			const inflection = require('inflection');

			const id = await this.$dependencies.ConfigurationService.getModuleID(this);
			const inflectedFeatureName = inflection.transform(this.name, ['foreign_key', 'dasherize']).replace('-id', '');

			return {
				'id': `${id}-devenv`,
				'type': 'devenv/node',

				'attributes': {
					'module_type': 'feature',
					'node_type': 'leaf',
					'route': inflectedFeatureName,
					'route_params': null,
					'data_url': '/'
				}
			};
		}
		catch(err) {
			return null;
		}
	}

		/**
	 * @async
	 * @function
	 * @instance
	 * @memberof PlantWorksBaseFeature
	 * @name     getScheduleDisplayDetails
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Schedule display stuff for this Feature.
	 *
	 * @summary  Derived classes should return details, or null - depending on whether the user has the required permission(s).
	 */
	async getScheduleDisplayDetails(ctxt) {
		try {
			const rbacChecker = this._rbac('schedule-access');
			await rbacChecker(ctxt);

			const inflection = require('inflection');

			const id = await this.$dependencies.ConfigurationService.getModuleID(this);
			const inflectedFeatureName = inflection.transform(this.name, ['foreign_key', 'dasherize']).replace('-id', '');

			return {
				'id': `${id}-schedule`,
				'type': 'schedule/node',

				'attributes': {
					'module_type': 'feature',
					'node_type': 'leaf',
					'route': inflectedFeatureName,
					'route_params': null,
					'data_url': '/'
				}
			};
		}
		catch(err) {
			return null;
		}
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof PlantWorksBaseFeature
	 * @name     getUserApplications
	 *
	 * @param    {object} ctxt - Koa context.
	 *
	 * @returns  {object} Availible Apps for this Feature.
	 *
	 * @summary  Derived classes should return details, or null - depending on whether the user has the required permission(s).
	 */
	// eslint-disable-next-line no-unused-vars
	async getUserApplications(ctxt) {
		const rbacChecker = this._rbac('registered');
		await rbacChecker(ctxt);

		return {
			'name': null,
			'feature_id': null,
			'attributes': []
		};
	}

	/**
	 * @function
	 * @instance
	 * @memberof PlantWorksBaseFeature
	 * @name     _rbac
	 *
	 * @param    {string} permission - The permission to check for.
	 *
	 * @returns  {undefined} Koa middleware that can be injected into a route.
	 *
	 * @summary  Derived classes should call next, or throw a {PlantWorksFeatureError} - depending on whether the user has the required permission(s).
	 */
	_rbac(permission) {
		const permParser = require('boolean-parser');

		let parsedPermissions = permParser.parseBooleanQuery(permission);
		if((parsedPermissions.length === 1) && (parsedPermissions[0].length === 1))
			parsedPermissions = permission;

		return async function(ctxt, next) {
			if(ctxt.state.user && ctxt.state.user.permissions) {
				if(parsedPermissions === 'registered') {
					if(next) await next();
					return;
				}

				const userPermissionNames = ctxt.state.user.permissions.map((userPermission) => {
					return userPermission.name;
				});

				if(!Array.isArray(parsedPermissions)) {
					const doesUserHavePermission = userPermissionNames.includes(permission);
					if(doesUserHavePermission) {
						if(next) await next();
						return;
					}

					throw new PlantWorksFeatureError('User doesn\'t have the required permissions');
				}

				let doesUserHavePermission = false;
				const memoizedPermissions = [];

				for(let permIdx = 0; permIdx < parsedPermissions.length; permIdx++) {
					if(doesUserHavePermission) break;

					const permissionSet = parsedPermissions[permIdx];

					if(permissionSet.length === 1) {
						if(memoizedPermissions[(permissionSet[0])] === undefined) memoizedPermissions[(permissionSet[0])] = userPermissionNames.includes(permissionSet[0]);
						doesUserHavePermission = doesUserHavePermission || memoizedPermissions[(permissionSet[0])];
						continue;
					}

					let isPermissionSetActive = true;
					for(let permSetIdx = 0; permSetIdx < permissionSet.length; permSetIdx++) {
						if(!isPermissionSetActive) break;

						if(memoizedPermissions[(permissionSet[permSetIdx])] === undefined) memoizedPermissions[(permissionSet[permSetIdx])] = userPermissionNames.includes(permissionSet[permSetIdx]);
						isPermissionSetActive = isPermissionSetActive && memoizedPermissions[(permissionSet[permSetIdx])];
					}

					doesUserHavePermission = doesUserHavePermission || isPermissionSetActive;
				}

				if(doesUserHavePermission) {
					if(next) await next();
					return;
				}

				throw new PlantWorksFeatureError('User doesn\'t have the required permissions');
			}

			throw new PlantWorksFeatureError('User doesn\'t have the required permissions');
		};
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof PlantWorksBaseFeature
	 * @name     _abac
	 *
	 * @param    {object} ctxt - Koa context.
	 * @param    {callback} next - Callback to pass the request on to the next route in the chain.
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Derived classes should call next, or throw a {PlantWorksFeatureError} - depending on whether the user can access this particular resource.
	 */
	async _abac(ctxt, next) {
		await next();
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof PlantWorksBaseFeature
	 * @name     _addRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds routes to the Koa Router.
	 */
	async _addRoutes() {
		if(plantworksEnv === 'development' || plantworksEnv === 'test') console.log(`${this.name}::_addRoutes`);

		// Add in the sub-components routes
		Object.keys(this.$components || {}).forEach((componentName) => {
			const componentRouter = this.$components[componentName].Router;
			this.$router.use(componentRouter.routes());
		});

		// Add in the sub-features routes
		Object.keys(this.$features || {}).forEach((featureName) => {
			const featureRouter = this.$features[featureName].Router;
			this.$router.use(featureRouter.routes());
		});

		return null;
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof PlantWorksBaseFeature
	 * @name     _deleteRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Removes all the routes from the Koa Router.
	 */
	async _deleteRoutes() {
		if(plantworksEnv === 'development' || plantworksEnv === 'test') console.log(`${this.name}::_deleteRoutes`);

		// NOTICE: Undocumented koa-router data structure.
		// Be careful upgrading :-)
		if(this.$router) this.$router.stack.length = 0;
		return null;
	}
	// #endregion

	// #region Properties
	/**
	 * @member   {object} Router
	 * @instance
	 * @memberof PlantWorksBaseFeature
	 *
	 * @readonly
	 */
	get Router() {
		return this.$router;
	}

	/**
	 * @override
	 */
	get dependencies() {
		return ['*'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.PlantWorksBaseFeature = PlantWorksBaseFeature;
