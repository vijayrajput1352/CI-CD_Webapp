/* eslint-disable security/detect-object-injection */
/* eslint-disable curly */
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
 * @classdesc The Plant.Works Web Application Operator Form Request Processor middleware - manages operator form execution.
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

			Object.defineProperty(this, '$TenantOperatorFormModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_operator_forms',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'requestFormatters': function() {
						return this.hasMany(self.$OperatorFormRequestFormatterModel, 'tenant_operator_form_id');
					},

					'executors': function() {
						return this.hasMany(self.$OperatorFormExecutorModel, 'tenant_operator_form_id');
					},

					'responseFormatters': function() {
						return this.hasMany(self.$OperatorFormResponseFormatterModel, 'tenant_operator_form_id');
					},

					'inputTemplates': function() {
						return this.hasMany(self.$OperatorFormInputTemplateModel, 'tenant_operator_form_id');
					},

					'resultTemplates': function() {
						return this.hasMany(self.$OperatorFormResultTemplateModel, 'tenant_operator_form_id');
					}
				}, {
					'jsonColumns': ['attribute_set_metadata']
				})
			});

			Object.defineProperty(this, '$OperatorFormRequestFormatterModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_operator_form_request_formatters',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantOperatorForm': function() {
						return this.belongsTo(self.$TenantOperatorFormModel, 'tenant_operator_form_id');
					}
				})
			});

			Object.defineProperty(this, '$OperatorFormExecutorModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_operator_form_executors',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantOperatorForm': function() {
						return this.belongsTo(self.$TenantOperatorFormModel, 'tenant_operator_form_id');
					}
				})
			});

			Object.defineProperty(this, '$OperatorFormResponseFormatterModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_operator_form_response_formatters',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantOperatorForm': function() {
						return this.belongsTo(self.$TenantOperatorFormModel, 'tenant_operator_form_id');
					}
				})
			});

			Object.defineProperty(this, '$OperatorFormInputTemplateModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_operator_form_input_templates',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantOperatorForm': function() {
						return this.belongsTo(self.$TenantOperatorFormModel, 'tenant_operator_form_id');
					}
				}, {
					'jsonColumns': ['component_observers', 'component_tasks']
				})
			});

			Object.defineProperty(this, '$OperatorFormResultTemplateModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_operator_form_result_templates',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantOperatorForm': function() {
						return this.belongsTo(self.$TenantOperatorFormModel, 'tenant_operator_form_id');
					}
				}, {
					'jsonColumns': ['component_observers', 'component_tasks']
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
		delete this.$OperatorFormResultTemplateModel;
		delete this.$OperatorFormInputTemplateModel;
		delete this.$OperatorFormResponseFormatterModel;
		delete this.$OperatorFormExecutorModel;
		delete this.$OperatorFormRequestFormatterModel;
		delete this.$TenantOperatorFormModel;

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
			await ApiService.add(`${this.name}::execute`, this._executeOperatorForm.bind(this));

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
			await ApiService.remove(`${this.name}::execute`, this._executeOperatorForm.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _executeOperatorForm(ctxt) {
		const ejs = promises.promisifyAll(require('ejs'));
		const path = require('path');

		try {
			const dbSrvc = this.$dependencies.DatabaseService.knex;

			let requestProcessor = null;
			let executor = null;
			let responseProcessor = null;

			// Step 1: Get the correct request, execute, response processors
			if(ctxt.request.body.operatorFormMode === 'development') {
				requestProcessor = await dbSrvc.raw(`SELECT formatter_code FROM tenant_operator_form_request_formatters WHERE tenant_id = ? AND tenant_operator_form_id = ? ORDER BY created_at DESC LIMIT 1`, [ctxt.state.tenant.tenant_id, ctxt.request.body.operatorFormId]);
				requestProcessor = requestProcessor.rows[0]['formatter_code'].trim();

				executor = await dbSrvc.raw(`SELECT executor_code FROM tenant_operator_form_executors WHERE tenant_id = ? AND tenant_operator_form_id = ? ORDER BY created_at DESC LIMIT 1`, [ctxt.state.tenant.tenant_id, ctxt.request.body.operatorFormId]);
				executor = executor.rows[0]['executor_code'].trim();

				responseProcessor = await dbSrvc.raw(`SELECT formatter_code FROM tenant_operator_form_response_formatters WHERE tenant_id = ? AND tenant_operator_form_id = ? ORDER BY created_at DESC LIMIT 1`, [ctxt.state.tenant.tenant_id, ctxt.request.body.operatorFormId]);
				responseProcessor = responseProcessor.rows[0]['formatter_code'].trim();
			}
			else {
				requestProcessor = await dbSrvc.raw(`SELECT formatter_code FROM tenant_operator_form_request_formatters WHERE tenant_id = ? AND tenant_operator_form_id = ? AND publish_status = ? ORDER BY created_at DESC LIMIT 1`, [ctxt.state.tenant.tenant_id, ctxt.request.body.operatorFormId, true]);
				requestProcessor = requestProcessor.rows[0]['formatter_code'].trim();

				executor = await dbSrvc.raw(`SELECT executor_code FROM tenant_operator_form_executors WHERE tenant_id = ? AND tenant_operator_form_id = ? AND publish_status = ? ORDER BY created_at DESC LIMIT 1`, [ctxt.state.tenant.tenant_id, ctxt.request.body.operatorFormId, true]);
				executor = executor.rows[0]['executor_code'].trim();

				responseProcessor = await dbSrvc.raw(`SELECT formatter_code FROM tenant_operator_form_response_formatters WHERE tenant_id = ? AND tenant_operator_form_id = ? AND publish_status = ? ORDER BY created_at DESC LIMIT 1`, [ctxt.state.tenant.tenant_id, ctxt.request.body.operatorFormId, true]);
				responseProcessor = responseProcessor.rows[0]['formatter_code'].trim();
			}

			if(!requestProcessor || (requestProcessor === '')) throw new Error(`No defined request processors!`);
			if(!executor || (executor === '')) throw new Error(`No defined executors!`);
			if(!responseProcessor || (responseProcessor === '')) throw new Error(`No defined response processors!`);


			// Step 2: Fetch operator form attribute data
			let attributeSetIds = await dbSrvc.raw(`SELECT tenant_attribute_set_id FROM tenant_operator_forms_attribute_sets WHERE tenant_operator_form_id = ? ORDER BY evaluation_order ASC`, [ctxt.request.body.operatorFormId]);
			attributeSetIds = attributeSetIds.rows.map((attributeSetId) => {
				return attributeSetId['tenant_attribute_set_id'];
			});

			let attributeSetClass = '';
			const parameterTypeMappings = {};

			if(attributeSetIds.length) {
				// Step 2.1: Fetch the evaluator as a string
				const compositeAttributeSet = await this._combineAttributeSets(attributeSetIds);
				compositeAttributeSet.id = ctxt.request.body.operatorFormId;

				const attributeSetFactory = require('attribute-set-evaluator')({ 'logger': this.$logger });
				attributeSetClass = await attributeSetFactory.getEvaluatorString(compositeAttributeSet, {
					'checkInCache': false,
					'setInCache': false,
					'exportFromModule': false
				});

				// Step 2.3: Create the parameterTypeMappings
				compositeAttributeSet.attributes.forEach((operatorFormAttribute) => {
					parameterTypeMappings[operatorFormAttribute.internal_tag] = operatorFormAttribute['data_type'];
				});
			}

			// Step 3: Get the persistence keyspace
			let keySpace = await dbSrvc.raw(`SELECT sub_domain FROM tenants WHERE id = ?`, [ctxt.state.tenant.tenant_id]);
			keySpace = keySpace.rows[0]['sub_domain'];


			// Step 2: Render the evaluator
			const renderData = {
				'attributeSetClass': attributeSetClass,
				'operatorForm': {
					'id': ctxt.request.body.operatorFormId,
					'requestProcessor': requestProcessor,
					'executor': executor,
					'responseProcessor': responseProcessor
				},
				'parameterTypeMappings': safeJsonStringify(parameterTypeMappings, null, '\t'),
				'persistenceKeySpace': keySpace
			};

			const tmplPath = path.join(__dirname, './operator_form_request_processor.ejs');
			const renderedEvaluator = await ejs.renderFileAsync(tmplPath, renderData, {
				'async': true,
				'cache': false,
				'debug': false,
				'rmWhitespace': false,
				'strict': false
			});

			// Step 3: Instantiate the evaluator
			const requireFromString = require('require-from-string');
			const moduleExports = requireFromString(renderedEvaluator, path.join(__dirname, `operator_form_executors/${ctxt.request.body.operatorFormId}.js`));

			if(!moduleExports.RequestProcessor) throw new Error(`Request Processor cannot be rendered: ${ctxt.request.body.operatorFormId}`);

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
			throw new PlantWorksMiddlewareError(`${this.name}::_executeOperatorForm`, err);
		}
		finally {
			delete require.cache[path.join(__dirname, `operator_form_executors/${ctxt.request.body.operatorFormId}.js`)];
		}
	}
	// #endregion

	// #region Private Methods
		/**
	 * @async
	 * @function
	 * @instance
	 * @memberof WorkOrderEvaluatorFactory
	 * @name     _combineAttributeSets
	 *
	 * @param    {object} attributeSetIds - Array if Attribute Set Ids that will be fetched from the database and combined to form a composite set.
	 *
	 * @returns  {string} A composite attribute set definition.
	 *
	 * @summary  Renders the Machine using an EJS Template and returns the rendered string.
	 */
	async _combineAttributeSets(attributeSetIds) {
		const dbSrvc = this.$dependencies.DatabaseService;
		if(!dbSrvc) throw new Error('Database connection unavailable');

		// Step 1: Get each attribute set from the database - assumption is that they are already ordered by evaluation order
		const attributeSets = [];
		for(let idx = 0; idx < attributeSetIds.length; idx++) {
			const attributeSetId = attributeSetIds[idx];

			// Step 1.1: The basics
			const attributeSet = {
				'id': attributeSetId,
				'evaluationOrder': idx,
				'preFuncs': [],
				'observerFuncs': [],
				'postFuncs': [],
				'attributes': []
			};

			// Step 1.2: The properties
			const properties = await dbSrvc.knex.raw(`SELECT id, internal_tag, source AS parameter_type, datatype AS data_type, evaluation_expression, units FROM tenant_attribute_set_properties WHERE attribute_set_id = ?`, [attributeSetId]);
			attributeSet.attributes = attributeSet.attributes.concat(properties.rows);

			// Step 1.3: The functions
			const functions = await dbSrvc.knex.raw(`SELECT id, name, type, execution_order, code FROM tenant_attribute_set_functions WHERE attribute_set_id = ? ORDER BY execution_order`, [attributeSetId]);

			// Step 1.4: Filtering the functions by type
			attributeSet.preFuncs = attributeSet.preFuncs.concat(functions.rows.filter((func) => { return func.type === 'pre'; }));
			attributeSet.postFuncs = attributeSet.postFuncs.concat(functions.rows.filter((func) => { return func.type === 'post'; }));
			attributeSet.observerFuncs = attributeSet.observerFuncs.concat(functions.rows.filter((func) => { return func.type === 'observer'; }));

			// Step 1.5: Observed Properties for the observer...
			for(let jdx = 0; jdx < attributeSet.observerFuncs.length; jdx++) {
				const observerFunc = attributeSet.observerFuncs[jdx];

				let observedProperties = await dbSrvc.knex.raw(`SELECT attribute_set_property_id FROM tenant_attribute_set_function_observed_properties WHERE attribute_set_function_id = ?`, [observerFunc.id]);
				observedProperties = observedProperties.rows.map((observedProperty) => {
					return attributeSet.attributes.filter((property) => {
						return property.id === observedProperty['attribute_set_property_id'];
					})[0];
				})
				.map((observedProperty) => {
					return observedProperty['internal_tag'];
				});

				observerFunc['observed_properties'] = observedProperties;
			}

			// Step 1.6: Push for merging...
			attributeSets.push(attributeSet);
		}

		// Step 2: The merged set skeleton...
		const consolidatedAttributeSet = {
			'preFuncs': {},
			'observerFuncs': {},
			'postFuncs': {},
			'attributes': {}
		};

		// Step 3: Overwrite pre-funcs, postfuncs, properties, etc. with equivalents from succeeding attribute sets
		for(let idx = 0; idx < attributeSets.length; idx++) {
			const attributeSet = attributeSets[idx];

			attributeSet.preFuncs.forEach((preFunc) => {
				consolidatedAttributeSet['preFuncs'][preFunc.name] = preFunc;
			});

			attributeSet.postFuncs.forEach((postFunc) => {
				consolidatedAttributeSet['postFuncs'][postFunc.name] = postFunc;
			});

			attributeSet.observerFuncs.forEach((observerFunc) => {
				consolidatedAttributeSet['observerFuncs'][`${observerFunc.name}-${observerFunc['observed_properties'].join(', ')}`] = observerFunc;
			});

			attributeSet.attributes.forEach((attribute) => {
				consolidatedAttributeSet['attributes'][attribute.internal_tag] = attribute;
			});
		}

		// Step 4: Convert them all back to arrays for sorting / evaluation
		consolidatedAttributeSet['preFuncs'] = Object.keys(consolidatedAttributeSet['preFuncs']).map((preFuncName) => {
			return consolidatedAttributeSet['preFuncs'][preFuncName];
		})
		.sort((left, right) => {
			if(left['execution_order'] !== right['execution_order']) {
				return (left['execution_order'] - right['execution_order']);
			}

			if(left.name < right.name)
				return -1;

			if(left.name > right.name)
				return 1;

			return 0;
		});

		consolidatedAttributeSet['postFuncs'] = Object.keys(consolidatedAttributeSet['postFuncs']).map((postFuncName) => {
			return consolidatedAttributeSet['postFuncs'][postFuncName];
		})
		.sort((left, right) => {
			if(left['execution_order'] !== right['execution_order']) {
				return (left['execution_order'] - right['execution_order']);
			}

			if(left.name < right.name)
				return -1;

			if(left.name > right.name)
				return 1;

			return 0;
		});

		consolidatedAttributeSet['observerFuncs'] = Object.keys(consolidatedAttributeSet['observerFuncs']).map((observerFuncName) => {
			return consolidatedAttributeSet['observerFuncs'][observerFuncName];
		});

		consolidatedAttributeSet['attributes'] = Object.keys(consolidatedAttributeSet['attributes']).map((attributeName) => {
			return consolidatedAttributeSet['attributes'][attributeName];
		});

		// Step 5: Add a default_value attribute to the attributes
		const moment = require('moment');
		consolidatedAttributeSet['attributes'].forEach((attribute) => {
			if(attribute['data_type'] === 'boolean') {
				if(attribute['parameter_type'] === 'static')
					attribute['default_value'] = !!attribute['evaluation_expression'];
				else
					attribute['default_value'] = false;
			}

			if(attribute['data_type'] === 'date') {
				if(attribute['parameter_type'] === 'static')
					attribute['default_value'] = moment(attribute['evaluation_expression']).format();
				else
					attribute['default_value'] = moment().format();
			}

			if(attribute['data_type'] === 'object') {
				if(attribute['parameter_type'] === 'static')
					attribute['default_value'] = attribute['evaluation_expression'];
				else
					attribute['default_value'] = '{}';
			}

			if(attribute['data_type'] === 'number') {
				if(attribute['parameter_type'] === 'static')
					attribute['default_value'] = Number(attribute['evaluation_expression']);
				else
					attribute['default_value'] = 0;
			}

			if(attribute['data_type'] === 'string') {
				if(attribute['parameter_type'] === 'static')
					attribute['default_value'] = attribute['evaluation_expression'] ? attribute['evaluation_expression'].toString() : attribute['evaluation_expression'];
				else
					attribute['default_value'] = '';
			}

			if(attribute['parameter_type'] !== 'computed')
				delete attribute['evaluation_expression'];
		});

		// Finally, return...
		return consolidatedAttributeSet;
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
		return ['PubsubService', 'TimescaleService'].concat(super.dependencies);
	}
	// #endregion
}

exports.middleware = RequestProcessor;
