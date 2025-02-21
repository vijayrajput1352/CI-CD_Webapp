/* eslint-disable security/detect-object-injection */

'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules.
 *
 * @ignore
 */
const promises = require('bluebird');
const safeJsonStringify = require('safe-json-stringify'); // eslint-disable-line no-unused-vars

/**
 * Module dependencies, required for this module.
 *
 * @ignore
 */
const PlantWorksBaseMiddleware = require('plantworks-base-middleware').PlantWorksBaseMiddleware;
const PlantWorksMiddlewareError = require('plantworks-middleware-error').PlantWorksMiddlewareError;

/**
 * @class   RequestProcessor
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Panel Request Processor middleware - manages Panel execution.
 *
 *
 */
class RequestProcessor extends PlantWorksBaseMiddleware {
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
	 * @memberof RequestProcessor
	 * @name     _setup
	 *
	 * @returns  {null} Nothing.
	 *
	 * @summary  Sets up bookshelf models
	 */
	async _setup() {
		try {
			await super._setup();
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
	 * @summary  Deletes bookshelf models
	 */
	async _teardown() {
		await super._teardown();
		return null;
	}
	// #endregion

	// #region Protected methods
	async _registerApis() {
		try {
			const ApiService = this.$dependencies.ApiService;
			await ApiService.add(`${this.name}::execute`, this._executePanel.bind(this));

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
			await ApiService.remove(`${this.name}::execute`, this._executePanel.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _executePanel(ctxt) {
		const ejs = promises.promisifyAll(require('ejs'));
		const path = require('path');

		try {
			const dbSrvc = this.$dependencies.DatabaseService.knex;

			// Step 1: Get the correct request, execute, response processors
			let requestProcessor = null;
			let executor = null;
			let responseProcessor = null;

			if(ctxt.request.body.panelMode === 'development') {
				requestProcessor = await dbSrvc.raw(`SELECT formatter_code FROM tenant_panel_request_formatters WHERE tenant_id = ? AND tenant_panel_id = ? ORDER BY created_at DESC LIMIT 1`, [ctxt.state.tenant.tenant_id, ctxt.request.body.panelId]);
				requestProcessor = requestProcessor.rows[0]['formatter_code'].trim();

				executor = await dbSrvc.raw(`SELECT executor_code FROM tenant_panel_executors WHERE tenant_id = ? AND tenant_panel_id = ? ORDER BY created_at DESC LIMIT 1`, [ctxt.state.tenant.tenant_id, ctxt.request.body.panelId]);
				executor = executor.rows[0]['executor_code'].trim();

				responseProcessor = await dbSrvc.raw(`SELECT formatter_code FROM tenant_panel_response_formatters WHERE tenant_id = ? AND tenant_panel_id = ? ORDER BY created_at DESC LIMIT 1`, [ctxt.state.tenant.tenant_id, ctxt.request.body.panelId]);
				responseProcessor = responseProcessor.rows[0]['formatter_code'].trim();
			}
			else {
				requestProcessor = await dbSrvc.raw(`SELECT formatter_code FROM tenant_panel_request_formatters WHERE tenant_id = ? AND tenant_panel_id = ? AND publish_status = ? ORDER BY created_at DESC LIMIT 1`, [ctxt.state.tenant.tenant_id, ctxt.request.body.panelId, true]);
				requestProcessor = requestProcessor.rows[0]['formatter_code'].trim();

				executor = await dbSrvc.raw(`SELECT executor_code FROM tenant_panel_executors WHERE tenant_id = ? AND tenant_panel_id = ? AND publish_status = ? ORDER BY created_at DESC LIMIT 1`, [ctxt.state.tenant.tenant_id, ctxt.request.body.panelId, true]);
				executor = executor.rows[0]['executor_code'].trim();

				responseProcessor = await dbSrvc.raw(`SELECT formatter_code FROM tenant_panel_response_formatters WHERE tenant_id = ? AND tenant_panel_id = ? AND publish_status = ? ORDER BY created_at DESC LIMIT 1`, [ctxt.state.tenant.tenant_id, ctxt.request.body.panelId, true]);
				responseProcessor = responseProcessor.rows[0]['formatter_code'].trim();
			}

			if(!requestProcessor || (requestProcessor === '')) throw new Error(`No defined request processors!`);
			if(!executor || (executor === '')) throw new Error(`No defined executors!`);
			if(!responseProcessor || (responseProcessor === '')) throw new Error(`No defined response processors!`);

			// Step 2: Render the evaluator
			const renderData = {
				'panel': {
					'id': ctxt.request.body.panelId,
					'requestProcessor': requestProcessor,
					'executor': executor,
					'responseProcessor': responseProcessor
				}
			};

			const tmplPath = path.join(__dirname, './panel_request_processor.ejs');
			const renderedEvaluator = await ejs.renderFileAsync(tmplPath, renderData, {
				'async': true,
				'cache': false,
				'debug': false,
				'rmWhitespace': false,
				'strict': false
			});

			// Step 3: Instantiate the evaluator
			const requireFromString = require('require-from-string');
			const moduleExports = requireFromString(renderedEvaluator, path.join(__dirname, `panel_executors/${ctxt.request.body.panelId}.js`));

			if(!moduleExports.RequestProcessor) throw new Error(`Request Processor cannot be rendered: ${ctxt.request.body.panelId}`);

			const RequestProcessorClass = moduleExports.RequestProcessor;
			const requestProcessorInstance = new RequestProcessorClass({
				'cache': this.$dependencies.CacheService,
				'database': this.$dependencies.DatabaseService,
				'logger': this.$dependencies.LoggerService,
				'pubsub': this.$dependencies.PubsubService,
				'timescale': this.$dependencies.TimescaleService
			});

			// Finally, execute and return the result
			const outputData = await requestProcessorInstance.execute(ctxt.request.body);
			return outputData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_executePanel`, err);
		}
		finally {
			delete require.cache[path.join(__dirname, `panel_executors/${ctxt.request.body.panelId}.js`)];
		}
	}
	// #endregion

	// #region Private Methods
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
		return ['PubsubService', 'TimescaleService'].concat(super.dependencies);
	}
	// #endregion
}

exports.middleware = RequestProcessor;
