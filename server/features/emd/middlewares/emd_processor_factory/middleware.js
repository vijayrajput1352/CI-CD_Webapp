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
 * @class   EmdProcessorFactory
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Webapp Server Emd Processor Factory middleware - manager parsing and evalution of external master data files.
 *
 *
 */
class EmdProcessorFactory extends PlantWorksBaseMiddleware {
	constructor(module) {
		super(module);
	}

	// #region Lifecycle hooks
	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof EmdProcessorFactory
	 * @name     _setup
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  create in memory cache to store emd file processors.
	 */
	async _setup() {
		try {
			await super._setup();

			Object.defineProperty(this, '$memoryCache', {
				'__proto__': null,
				'configurable': true,
				'value': {}
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
	 * @memberof EmdProcessorFactory
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Deletes In-memory cache.
	 */
	async _teardown() {
		try {
			await super._teardown();

			Object.keys(this.$memoryCache).forEach((evaluatorFactory) => {
				// eslint-disable-next-line security/detect-object-injection
				this.$memoryCache[evaluatorFactory].clearInMemoryCache();
			});

			delete this.$memoryCache;
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

			await super._registerApis();
			await ApiService.add(`${this.name}::evaluator`, this._generateEvaluator.bind(this));

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_registerApis`, err);
		}
	}

	async _deregisterApis() {
		try {
			const ApiService = this.$dependencies.ApiService;

			await ApiService.remove(`${this.name}::evaluator`, this._generateEvaluator.bind(this));
			await super._deregisterApis();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _generateEvaluator(options) {
		try {
			if(!options.id) throw new Error('Id not provided');
			if(!options.type) throw new Error('Evaluator Type not provided');

			let EvaluatorFactory = null;

			if(this.$memoryCache[`${options.type.toLowerCase()}-evaluator-factory`]) {
				EvaluatorFactory = this.$memoryCache[`${options.type.toLowerCase()}-evaluator-factory`];
			}
			else {
				const path = require('path');
				const evaluatorFactoryPath = path.join(this.basePath, `factories/${options.type.toLowerCase()}-evaluator-factory.js`);

				// eslint-disable-next-line security/detect-non-literal-require
				EvaluatorFactory = require(evaluatorFactoryPath)({
					'cache': this.$dependencies.CacheService,
					'database': this.$dependencies.DatabaseService,
					'logger': this.$dependencies.LoggerService,
					'pubsub': this.$dependencies.PubsubService
				});

				this.$memoryCache[`${options.type.toLowerCase()}-evaluator-factory`] = EvaluatorFactory;
			}

			const evaluator = await EvaluatorFactory.getEvaluator({
				'id': options.id,
				'checkInCache': false,
				'setInCache': false
			});

			return evaluator;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_generateEvaluator`, err);
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

	/**
	 * @override
	 */
	get dependencies() {
		return ['PubsubService'].concat(super.dependencies);
	}
	// #endregion
}

exports.middleware = EmdProcessorFactory;
