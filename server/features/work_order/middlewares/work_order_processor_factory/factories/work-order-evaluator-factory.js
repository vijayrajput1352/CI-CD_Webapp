/* eslint-disable complexity */
/* eslint-disable curly */
/* eslint-disable security/detect-object-injection */

'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */
const promises = require('bluebird');
const safeJsonStringify = require('safe-json-stringify');

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksMiddlewareError = require('plantworks-middleware-error').PlantWorksMiddlewareError;


/**
 * @class   WorkOrderEvaluatorFactory
 *
 * @param   {object} [options] - Option to pass in the Logger, Cache and Database interfaces
 *
 * @classdesc The Plant.Works WorkOrder Evaluator Application Class.
 *
 * @description
 * The main class for this npm module.
 */
class WorkOrderEvaluatorFactory {
	// #region Constructor
	constructor(options) {
		options = options || {};

		Object.defineProperty(this, '$cache', {
			'__proto__': null,
			'value': options.cache || null
		});

		Object.defineProperty(this, '$database', {
			'__proto__': null,
			'value': options.database || null
		});

		Object.defineProperty(this, '$logger', {
			'__proto__': null,
			'value': options.logger || console
		});

		Object.defineProperty(this, '$pubsub', {
			'__proto__': null,
			'value': options.pubsub || null
		});

		Object.defineProperty(this, '$memoryCache', {
			'__proto__': null,
			'value': options.memoryCache || require('memory-cache')
		});
	}
	// #endregion

	// #region Factory Pattern Methods
	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof WorkOrderEvaluatorFactory
	 * @name     getEvaluator
	 *
	 * @param    {object} options - Options for creation - mostly used for current timestamp at this point.
	 *
	 * @returns  {undefined} The workOrder Evaluator as a class.
	 *
	 * @summary  Retrieves cached template if present, else creates the string, renders it, and returns the instantiated class.
	 */
	async getEvaluator(options) {
		try {
			options = options || {};
			options.checkInCache = (options.checkInCache !== false);
			options.setInCache = (options.setInCache !== false);

			// Step 1: Create / Get the string
			const existingEvaluator = await this._createWorkOrderEvaluatorString(options);
			if(!existingEvaluator) throw new PlantWorksMiddlewareError(`Work Order Data Processor cannot be stringified: ${options.id}`);

			if((plantworksEnv === 'development') || (plantworksEnv === 'test')) {
				const fs = require('fs');
				const path = require('path');

				const rootPath = path.dirname(path.dirname(require.main.filename));
				const generatedCachePath = path.join(rootPath, `generated/wo_format_${options.id.replace(/-/g, '_')}_evaluator.js`);

				// eslint-disable-next-line security/detect-non-literal-fs-filename
				fs.writeFileSync(generatedCachePath, existingEvaluator); // eslint-disable-line no-sync
			}

			// Step 2: Create the processor class in memory...
			const path = require('path');
			const requireFromString = require('require-from-string');

			const moduleExports = requireFromString(existingEvaluator, path.join(__dirname, `work_order/${options.id}.js`));
			if(!moduleExports.DataProcessor) throw new PlantWorksMiddlewareError(`Work Order Data Processor cannot be rendered: ${options.id}`);

			// Step 3: Instantiate the processor object...
			const moment = require('moment');
			const DataProcessor = moduleExports.DataProcessor;

			const evaluator = new DataProcessor({
				'cache': this.$cache,
				'database': this.$database,
				'logger': this.$logger,
				'pubsub': this.$pubsub,
				'currentTimestamp': moment(options.currentTimestamp).format(),
				'moment': moment
			});

			// Finally, delete the processor class from memory, and return the object
			delete require.cache[path.join(__dirname, `work_order/${options.id}.js`)];
			return evaluator;
		}
		catch(err) {
			console.error(`Work Order Data Processor Instantiation Error:\n`, err.stack);
			throw new PlantWorksMiddlewareError(`Work Order Data Processor Instantiation Error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof WorkOrderEvaluatorFactory
	 * @name     getEvaluatorString
	 *
	 * @param    {object} options - Options for creation - mostly used for current timestamp at this point.
	 *
	 * @returns  {undefined} The workOrder Data Evaluator as a class.
	 *
	 * @summary  Retrieves cached template if present, else creates it and sends it back as a string.
	 */
	async getEvaluatorString(options) {
		try {
			options = options || {};
			options.checkInCache = (options.checkInCache !== false);
			options.setInCache = (options.setInCache !== false);

			// Create / Get the string
			const existingEvaluator = await this._createWorkOrderEvaluatorString(options);
			if(!existingEvaluator) throw new PlantWorksMiddlewareError(`Machine Data Processor cannot be stringified: ${options.id}`);

			return existingEvaluator;
		}
		catch(err) {
			console.error(`Work Order Data Processor Stringification Error:\n`, err.stack);
			throw new PlantWorksMiddlewareError(`Work Order Data Processor Stringification Error`, err);
		}
	}

	async clearInMemoryCache() {
		this.$memoryCache.clear();
	}
	// #endregion

	// #region Private API
	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof WorkOrderEvaluatorFactory
	 * @name     _createWorkOrderEvaluatorString
	 *
	 * @param    {object} options - Options for creation - mostly used for current timestamp at this point.
	 *
	 * @returns  {string} An workOrder Processor rendered as a Class.
	 *
	 * @summary  Renders the workOrder Processor using an EJS Template and returns the rendered string.
	 */
	async _createWorkOrderEvaluatorString(options) {
		try {
			let inMemoryCache = true;
			let inCache = true;

			let existingEvaluator = null;

			// Step 1: First things first... see if we already have it in the in-memory cache.
			if(options.checkInCache && !options.currentTimestamp) {
				existingEvaluator = this.$memoryCache.get(options.id);
				if(!existingEvaluator) inMemoryCache = false;
			}

			// Step 2: Get the rendered stuff from the cache, if possible
			if(options.checkInCache && !options.currentTimestamp && !existingEvaluator && this.$cache && this.$cache.getAsync && (typeof this.$cache.getAsync === 'function')) {
				existingEvaluator = await this.$cache.getAsync(`plantworks!workOrder!rendered!${options.id}`);
				if(!existingEvaluator) inCache = false;
			}

			/*
			// Step 3: Get the rendered stuff from the database, if possible
			if(options.checkInCache && !existingEvaluator && this.$database && this.$database.raw && (typeof this.$database.raw === 'function')) {
				if(!options.currentTimestamp) {
					existingEvaluator = await this.$database.raw(`SELECT processor FROM tenant_plant_unit_machine_processor WHERE tenant_plant_unit_machine_id = ? AND effectivity_end IS NULL`, [options.id]);
				}
				else {
					existingEvaluator = await this.$database.raw(`SELECT processor FROM tenant_plant_unit_machine_processor WHERE tenant_plant_unit_machine_id = ? AND effectivity_start <= ? AND COALESCE(effectivity_end, CURRENT_TIMESTAMP) >= ?`, [options.id, options.currentTimestamp, options.currentTimestamp]);
					if(existingEvaluator) options.setInCache = false;
				}
				existingEvaluator = existingEvaluator.rows[0]['processor'];
			}
			*/

			// Step 4: Not in the cache or database, so create the rendering
			if(!existingEvaluator) {
				existingEvaluator = await this._renderWorkOrderEvaluator(options);
			}

			// Step 5: Not in the cache or database, and cannot be rendered - throw up
			if(!existingEvaluator) throw new PlantWorksMiddlewareError(`work order cannot be rendered: ${options.id}`);
			// Step 6: Store it in-memory, and push to the cache
			// Note that database inserts are the responsibility of the webapp-server
			if(options.setInCache && !inMemoryCache) {
				this.$memoryCache.put(options.id, existingEvaluator, ((plantworksEnv === 'development') || (plantworksEnv === 'test')) ? 100 : 300000);
			}

			if(options.setInCache && !inCache && this.$cache && this.$cache.setexAsync && (typeof this.$cache.setexAsync === 'function')) {
				await this.$cache.setexAsync(`plantworks!workOrder!rendered!${options.id}`, 1800, existingEvaluator);
			}

			return existingEvaluator;
		}
		catch(err) {
			console.error(`_createWorkOrderEvaluatorString: work order create string error:\n`, err.stack);
			throw new PlantWorksMiddlewareError(`work order create string error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof WorkOrderEvaluatorFactory
	 * @name     _renderWorkOrderEvaluator
	 *
	 * @param    {object} options - Options for creation - mostly used for current timestamp at this point.
	 *
	 * @returns  {string} An workOrder evaluator rendered as a Class.
	 *
	 * @summary  Renders the Machine using an EJS Template and returns the rendered string.
	 */
	async _renderWorkOrderEvaluator(options) {
		try {
			const dbSrvc = this.$database;
			if(!dbSrvc) throw new Error('Database connection unavailable');

			// Step 1: Fetch the workOrder configuration data
			let workOrderFormat = await dbSrvc.knex.raw(`
SELECT
	id,
	tenant_id,
	raw_data_transform_code AS "rawDataTransform",
	processed_data_transform_code AS "processedDataTransform",
	attribute_set_metadata AS "attributeSetMetadata"
FROM
	tenant_work_order_formats
WHERE
	id = ?`, [options.id]);

			workOrderFormat = workOrderFormat.rows[0];
			if(!workOrderFormat) throw new Error(`Invalid workOrderFormat id: ${options.id}`);

			if(!workOrderFormat['rawDataTransform'] || (workOrderFormat['rawDataTransform'].trim() === '')) {
				workOrderFormat['rawDataTransform'] = 'return currentData;';
			}

			if(!workOrderFormat['processedDataTransform'] || (workOrderFormat['processedDataTransform'].trim() === '')) {
				workOrderFormat['processedDataTransform'] = 'return evaluatedAttributes;';
			}
			// Step 2: Fetch workOrderFormat attribute data
			let attributeSetIds = await dbSrvc.knex.raw(`SELECT tenant_attribute_set_id FROM tenant_work_order_format_attribute_sets WHERE tenant_work_order_format_id = ? ORDER BY evaluation_order ASC`, [workOrderFormat.id]);
			attributeSetIds = attributeSetIds.rows.map((attributeSetId) => {
				return attributeSetId['tenant_attribute_set_id'];
			});

			let attributeSetClass = '';
			const parameterTypeMappings = {};
			const typeMappings = {};

			if(attributeSetIds.length) {
				// Step 2.1: Fetch the evaluator as a string
				const compositeAttributeSet = await this._combineAttributeSets(attributeSetIds);
				compositeAttributeSet.id = workOrderFormat.id;

				const attributeSetFactory = require('attribute-set-evaluator')({ 'logger': this.$logger });
				attributeSetClass = await attributeSetFactory.getEvaluatorString(compositeAttributeSet, {
					'checkInCache': false,
					'setInCache': false,
					'exportFromModule': false
				});

				if(typeof workOrderFormat.attributeSetMetadata === 'string') workOrderFormat.attributeSetMetadata = JSON.parse(workOrderFormat.attributeSetMetadata);

				// Step 2.2: Figure out if there is a master data unique parameter, and map it
				workOrderFormat.attributeSetMetadata.forEach((parameterMetadata) => {
					if(!parameterMetadata['is_unique_id']) return;
					const uniqueIdParameter = compositeAttributeSet['attributes'].filter((compAttribute) => {
						return compAttribute['id'] === parameterMetadata['parameter_id'];
					})[0];

					workOrderFormat['uniqueId'] = uniqueIdParameter ? uniqueIdParameter['internal_tag'] : 'NONE';
				});

				workOrderFormat['notNullIds'] = [];

				workOrderFormat.attributeSetMetadata.forEach((parameterMetadata) => {
					if(!parameterMetadata['is_null']) return;
					const nullIdParameter = compositeAttributeSet['attributes'].filter((compAttribute) => {
						return compAttribute['id'] === parameterMetadata['parameter_id'];
					})[0];

					const notNullId = nullIdParameter ? nullIdParameter['internal_tag'] : 'NONE';
					workOrderFormat['notNullIds'].push(notNullId);
				});
				// Step 2.3: Create the parameterTypeMappings
				compositeAttributeSet.attributes.forEach((workOrderFormatAttribute) => {
					parameterTypeMappings[workOrderFormatAttribute.internal_tag] = workOrderFormatAttribute['data_type'];
					typeMappings[workOrderFormatAttribute.internal_tag] = workOrderFormatAttribute['parameter_type'];
				});
			}

			// Step 3: Get the persistence keyspace
			let keySpace = await dbSrvc.knex.raw(`SELECT sub_domain FROM tenants WHERE id = ?`, [workOrderFormat.tenant_id]);
			keySpace = keySpace.rows[0]['sub_domain'];

			// Step 4: Use EJS to render the actual evaluator...
			const ejs = promises.promisifyAll(require('ejs'));
			const path = require('path');

			const tmplPath = path.join(__dirname, '../templates/work_order_data_processor.ejs');
			let renderedEvaluator = await ejs.renderFileAsync(tmplPath, {
				'attributeSetClass': attributeSetClass,
				'workOrderFormat': workOrderFormat,
				'parameterTypeMappings': safeJsonStringify(parameterTypeMappings, null, '\t'),
				'typeMappings': safeJsonStringify(typeMappings, null, '\t'),
				'persistenceKeySpace': keySpace
			}, {
				'cache': false,
				'strict': false
			});

			// Step 6: Prettification...
			const prettier = require('prettier');
			renderedEvaluator = await prettier.format(renderedEvaluator, {
				'arrowParens': 'always',
				'bracketSpacing': true,
				'parser': 'babel',
				'printWidth': 2048,
				'quoteProps': 'preserve',
				'singleQuote': true,
				'tabWidth': 4,
				'useTabs': true
			});

			// Finally, return...
			return renderedEvaluator;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`Machine rendering error`, err);
		}
	}


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
		const dbSrvc = this.$database;
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
}

module.exports = function(options) {
	const workOrderEvaluatorFactory = new WorkOrderEvaluatorFactory(options);
	return workOrderEvaluatorFactory;
};
