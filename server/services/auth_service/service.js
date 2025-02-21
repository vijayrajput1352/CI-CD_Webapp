'use strict';

/* eslint-disable security/detect-non-literal-require */

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseService = require('plantworks-base-service').PlantWorksBaseService;
const PlantWorksSrvcError = require('plantworks-service-error').PlantWorksServiceError;

/**
 * @class   AuthService
 * @extends {PlantWorksBaseService}
 * @classdesc The Plant.Works Web Application Server Authentication/Authorization Service.
 *
 * @description
 * Allows the rest of the Plant.Works Modules to check if the request is authenticated / authorized.
 *
 */
class AuthService extends PlantWorksBaseService {
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
	 * @memberof AuthService
	 * @name     _setup
	 *
	 * @returns  {null} Nothing.
	 *
	 * @summary  Sets up the passport module for authentication/authorization.
	 */
	async _setup() {
		try {
			await super._setup();

			const fs = require('fs');
			const path = require('path');
			const promises = require('bluebird');

			this.$passport = promises.promisifyAll(require('koa-passport'));

			const filesystem = promises.promisifyAll(fs);
			const authStrategyPath = path.resolve(path.join(this.basePath, 'strategies'));

			const availableStrategies = await filesystem.readdirAsync(authStrategyPath);
			availableStrategies.forEach((thisStrategyFile) => {
				const thisStrategy = require(path.join(authStrategyPath, thisStrategyFile)).strategy;
				if(thisStrategy) thisStrategy.bind(this)();
			});

			return null;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::_setup error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof AuthService
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Quits the connection to the Auth SDK.
	 */
	async _teardown() {
		try {
			if(this.$passport) delete this.$passport;

			await super._teardown();
			return null;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::_teardown error`, err);
		}
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get Interface() {
		return this.$passport;
	}

	/**
	 * @override
	 */
	get dependencies() {
		return ['ConfigurationService', 'CacheService', 'DatabaseService', 'LoggerService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.service = AuthService;
