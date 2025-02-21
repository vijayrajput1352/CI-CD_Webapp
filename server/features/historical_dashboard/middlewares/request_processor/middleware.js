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
 * @classdesc The Plant.Works Web Application Historical Dashboards Request Processor middleware - manages historical dashboard execution.
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
					'hasTimestamps': true
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
					}
				})
			});

			Object.defineProperty(this, '$TenantHistoricalDashboardModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_historical_dashboards',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'requestFormatters': function() {
						return this.hasMany(self.$HistoricalDashboardRequestFormatterModel, 'tenant_historical_dashboard_id');
					},

					'executors': function() {
						return this.hasMany(self.$HistoricalDashboardExecutorModel, 'tenant_historical_dashboard_id');
					},

					'responseFormatters': function() {
						return this.hasMany(self.$HistoricalDashboardResponseFormatterModel, 'tenant_historical_dashboard_id');
					},

					'inputTemplates': function() {
						return this.hasMany(self.$HistoricalDashboardInputTemplateModel, 'tenant_historical_dashboard_id');
					},

					'resultTemplates': function() {
						return this.hasMany(self.$HistoricalDashboardResultTemplateModel, 'tenant_historical_dashboard_id');
					},

					'watchers': function() {
						return this.hasMany(self.$HistoricalDashboardWatcherModel, 'tenant_historical_dashboard_id');
					}
				}, {
					'jsonColumns': ['attribute_set_metadata']
				})
			});

			Object.defineProperty(this, '$HistoricalDashboardRequestFormatterModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_historical_dashboard_request_formatters',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantHistoricalDashboard': function() {
						return this.belongsTo(self.$TenantHistoricalDashboardModel, 'tenant_historical_dashboard_id');
					}
				})
			});

			Object.defineProperty(this, '$HistoricalDashboardExecutorModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_historical_dashboard_executors',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantHistoricalDashboard': function() {
						return this.belongsTo(self.$TenantHistoricalDashboardModel, 'tenant_historical_dashboard_id');
					}
				})
			});

			Object.defineProperty(this, '$HistoricalDashboardResponseFormatterModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_historical_dashboard_response_formatters',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantHistoricalDashboard': function() {
						return this.belongsTo(self.$TenantHistoricalDashboardModel, 'tenant_historical_dashboard_id');
					}
				})
			});

			Object.defineProperty(this, '$HistoricalDashboardInputTemplateModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_historical_dashboard_input_templates',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantHistoricalDashboard': function() {
						return this.belongsTo(self.$TenantHistoricalDashboardModel, 'tenant_historical_dashboard_id');
					}
				}, {
					'jsonColumns': ['component_observers', 'component_tasks']
				})
			});

			Object.defineProperty(this, '$HistoricalDashboardResultTemplateModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_historical_dashboard_result_templates',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantHistoricalDashboard': function() {
						return this.belongsTo(self.$TenantHistoricalDashboardModel, 'tenant_historical_dashboard_id');
					}
				}, {
					'jsonColumns': ['component_observers', 'component_tasks']
				})
			});

			Object.defineProperty(this, '$HistoricalDashboardWatcherModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_historical_dashboards_users',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantHistoricalDashboard': function() {
						return this.belongsTo(self.$TenantHistoricalDashboardModel, 'tenant_historical_dashboard_id');
					},

					'tenantUser': function() {
						return this.belongsTo(self.$TenantUserModel, 'tenant_user_id');
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
		delete this.$HistoricalDashboardWatcherModel;
		delete this.$HistoricalDashboardResultTemplateModel;
		delete this.$HistoricalDashboardInputTemplateModel;
		delete this.$HistoricalDashboardResponseFormatterModel;
		delete this.$HistoricalDashboardExecutorModel;
		delete this.$HistoricalDashboardRequestFormatterModel;
		delete this.$TenantHistoricalDashboardModel;

		delete this.$TenantUserModel;
		delete this.$TenantModel;

		await super._teardown();
		return null;
	}
	// #endregion

	// #region Protected methods
	async _registerApis() {
		try {
			const ApiService = this.$dependencies.ApiService;
			await ApiService.add(`${this.name}::execute`, this._executeHistoricalDashboard.bind(this));

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
			await ApiService.remove(`${this.name}::execute`, this._executeHistoricalDashboard.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _executeHistoricalDashboard(ctxt) {
		const ejs = promises.promisifyAll(require('ejs'));
		const path = require('path');

		try {
			const dbSrvc = this.$dependencies.DatabaseService.knex;

			// Step 1: Get the correct request, execute, response processors
			let requestProcessor = null;
			let executor = null;
			let responseProcessor = null;

			if(ctxt.request.body.historicalDashboardMode === 'development') {
				requestProcessor = await dbSrvc.raw(`SELECT formatter_code FROM tenant_historical_dashboard_request_formatters WHERE tenant_id = ? AND tenant_historical_dashboard_id = ? ORDER BY created_at DESC LIMIT 1`, [ctxt.state.tenant.tenant_id, ctxt.request.body.historicalDashboardId]);
				requestProcessor = requestProcessor.rows[0]['formatter_code'].trim();

				executor = await dbSrvc.raw(`SELECT executor_code FROM tenant_historical_dashboard_executors WHERE tenant_id = ? AND tenant_historical_dashboard_id = ? ORDER BY created_at DESC LIMIT 1`, [ctxt.state.tenant.tenant_id, ctxt.request.body.historicalDashboardId]);
				executor = executor.rows[0]['executor_code'].trim();

				responseProcessor = await dbSrvc.raw(`SELECT formatter_code FROM tenant_historical_dashboard_response_formatters WHERE tenant_id = ? AND tenant_historical_dashboard_id = ? ORDER BY created_at DESC LIMIT 1`, [ctxt.state.tenant.tenant_id, ctxt.request.body.historicalDashboardId]);
				responseProcessor = responseProcessor.rows[0]['formatter_code'].trim();
			}
			else {
				requestProcessor = await dbSrvc.raw(`SELECT formatter_code FROM tenant_historical_dashboard_request_formatters WHERE tenant_id = ? AND tenant_historical_dashboard_id = ? AND publish_status = ? ORDER BY created_at DESC LIMIT 1`, [ctxt.state.tenant.tenant_id, ctxt.request.body.historicalDashboardId, true]);
				requestProcessor = requestProcessor.rows[0]['formatter_code'].trim();

				executor = await dbSrvc.raw(`SELECT executor_code FROM tenant_historical_dashboard_executors WHERE tenant_id = ? AND tenant_historical_dashboard_id = ? AND publish_status = ? ORDER BY created_at DESC LIMIT 1`, [ctxt.state.tenant.tenant_id, ctxt.request.body.historicalDashboardId, true]);
				executor = executor.rows[0]['executor_code'].trim();

				responseProcessor = await dbSrvc.raw(`SELECT formatter_code FROM tenant_historical_dashboard_response_formatters WHERE tenant_id = ? AND tenant_historical_dashboard_id = ? AND publish_status = ? ORDER BY created_at DESC LIMIT 1`, [ctxt.state.tenant.tenant_id, ctxt.request.body.historicalDashboardId, true]);
				responseProcessor = responseProcessor.rows[0]['formatter_code'].trim();
			}

			if(!requestProcessor || (requestProcessor === '')) throw new Error(`No defined request processors!`);
			if(!executor || (executor === '')) throw new Error(`No defined executors!`);
			if(!responseProcessor || (responseProcessor === '')) throw new Error(`No defined response processors!`);

			// Step 2: Render the evaluator
			const renderData = {
				'historicalDashboard': {
					'id': ctxt.request.body.historicalDashboardId,
					'requestProcessor': requestProcessor,
					'executor': executor,
					'responseProcessor': responseProcessor
				}
			};

			const tmplPath = path.join(__dirname, './historical_dashboard_request_processor.ejs');
			const renderedEvaluator = await ejs.renderFileAsync(tmplPath, renderData, {
				'async': true,
				'cache': false,
				'debug': false,
				'rmWhitespace': false,
				'strict': false
			});

			// Step 3: Instantiate the evaluator
			const requireFromString = require('require-from-string');
			const moduleExports = requireFromString(renderedEvaluator, path.join(__dirname, `historical_dashboard_executors/${ctxt.request.body.historicalDashboardId}.js`));

			if(!moduleExports.RequestProcessor) throw new Error(`Request Processor cannot be rendered: ${ctxt.request.body.historicalDashboardId}`);

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
			throw new PlantWorksMiddlewareError(`${this.name}::_executeHistoricalDashboard`, err);
		}
		finally {
			delete require.cache[path.join(__dirname, `historical_dashboard_executors/${ctxt.request.body.historicalDashboardId}.js`)];
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
