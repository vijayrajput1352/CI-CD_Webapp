/* eslint-disable security/detect-object-injection */

'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules.
 *
 * @ignore
 */
const safeJsonStringify = require('safe-json-stringify'); // eslint-disable-line no-unused-vars

/**
 * Module dependencies, required for this module.
 *
 * @ignore
 */
const PlantWorksBaseMiddleware = require('plantworks-base-middleware').PlantWorksBaseMiddleware;
const PlantWorksMiddlewareError = require('plantworks-middleware-error').PlantWorksMiddlewareError;
const moment = require('moment');

/**
 * @class   Main
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Historical Dashboards Main middleware - manages CRUD for historicalDashboards/historicalDashboards.
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

			Object.defineProperty(this, '$TenantModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenants',
					'hasTimestamps': true,

					'manufacturingFolders': function() {
						return this.hasMany(self.$TenantFolderModel, 'tenant_id');
					},

					'tenantPlants': function() {
						return this.hasMany(self.$TenantPlantModel, 'tenant_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantFolderModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_folders',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'parent': function() {
						return this.belongsTo(self.$TenantFolderModel, 'parent_id');
					},

					'folders': function() {
						return this.hasMany(self.$TenantFolderModel, 'parent_id');
					},

					'historicalDashboards': function() {
						return this.hasMany(self.$TenantHistoricalDashboardModel, 'tenant_folder_id');
					},

					'attributeSets': function() {
						return this.hasMany(self.$TenantAttributeSetModel, 'tenant_folder_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantLocationModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_locations',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantAttributeSetModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_attribute_sets',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'folder': function() {
						return this.belongsTo(self.$TenantFolderModel, 'tenant_folder_id');
					},

					'properties': function() {
						return this.hasMany(self.$TenantAttributeSetPropertyModel, 'attribute_set_id');
					},

					'functions': function() {
						return this.hasMany(self.$TenantAttributeSetFunctionModel, 'attribute_set_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantAttributeSetPropertyModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_attribute_set_properties',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'attributeSet': function() {
						return this.belongsTo(self.$TenantAttributeSetModel, 'attribute_set_id');
					},

					'dataPointExpression': function() {
						return this.hasMany(self.$TenantHistoricalDashboardAggregateModel, 'attribute_set_property_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantAttributeSetFunctionModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_attribute_set_functions',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'attributeSet': function() {
						return this.belongsTo(self.$TenantAttributeSetModel, 'attribute_set_id');
					},

					'observedProperties': function() {
						return this.hasMany(self.$TenantAttributeSetFunctionObservedPropertyModel, 'attribute_set_function_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantAttributeSetFunctionObservedPropertyModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_attribute_set_function_observed_properties',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'attributeSet': function() {
						return this.belongsTo(self.$TenantAttributeSetModel, 'attribute_set_id');
					},

					'attributeSetFunction': function() {
						return this.belongsTo(self.$TenantAttributeSetFunctionModel, 'attribute_set_function_id');
					},

					'attributeSetProperty': function() {
						return this.belongsTo(self.$TenantAttributeSetPropertyModel, 'attribute_set_property_id');
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

					'folder': function() {
						return this.belongsTo(self.$TenantFolderModel, 'tenant_folder_id');
					},

					'attributeSets': function() {
						return this.hasMany(self.$HistoricalDashboardAttributeSetModel, 'tenant_historical_dashboard_id');
					},

					'constituents': function() {
						return this.hasMany(self.$HistoricalDashboardConstituentModel, 'tenant_historical_dashboard_id');
					},

					'processors': function() {
						return this.hasMany(self.$HistoricalDashboardProcessorModel, 'tenant_historical_dashboard_id');
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
					},

					'dataPointAggregations': function() {
						return this.hasMany(self.$HistoricalDashboardAggregateModel, 'tenant_historical_dashboard_id');
					},

					'subcomponents': function() {
						return this.hasMany(self.$HistoricalDashboardSubcomponentModel, 'tenant_historical_dashboard_id');
					}
				}, {
					'jsonColumns': ['attribute_set_metadata']
				})
			});

			Object.defineProperty(this, '$HistoricalDashboardAttributeSetModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_historical_dashboards_attribute_sets',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantAttributeSet': function() {
						return this.belongsTo(self.$TenantAttributeSetModel, 'tenant_attribute_set_id');
					},

					'tenantHistoricalDashboard': function() {
						return this.belongsTo(self.$TenantHistoricalDashboardModel, 'tenant_historical_dashboard_id');
					}
				})
			});

			Object.defineProperty(this, '$HistoricalDashboardConstituentModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_historical_dashboard_constituents',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantHistoricalDashboard': function() {
						return this.belongsTo(self.$TenantHistoricalDashboardModel, 'tenant_historical_dashboard_id');
					}
				})
			});

			Object.defineProperty(this, '$HistoricalDashboardProcessorModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_historical_dashboard_processors',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantHistoricalDashboard': function() {
						return this.belongsTo(self.$TenantHistoricalDashboardModel, 'tenant_historical_dashboard_id');
					}
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

			Object.defineProperty(this, '$HistoricalDashboardAggregateModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_historical_dashboard_aggregates',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantHistoricalDashboard': function() {
						return this.belongsTo(self.$TenantHistoricalDashboardModel, 'tenant_historical_dashboard_id');
					},

					'evaluationExpression': function() {
						return this.belongsTo(self.$TenantAttributeSetPropertyModel, 'evaluation_expression');
					}
				}, {
					'jsonColumns': ['config', 'filters']
				})
			});

			Object.defineProperty(this, '$TenantUserModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenants_users',
					'hasTimestamps': true
				})
			});

			Object.defineProperty(this, '$HistoricalDashboardSubcomponentModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_historical_dashboard_subcomponents',
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
		delete this.$HistoricalDashboardSubcomponentModel;
		delete this.$TenantUserModel;
		delete this.$HistoricalDashboardAggregateModel;
		delete this.$HistoricalDashboardWatcherModel;
		delete this.$HistoricalDashboardResultTemplateModel;
		delete this.$HistoricalDashboardInputTemplateModel;
		delete this.$HistoricalDashboardResponseFormatterModel;
		delete this.$HistoricalDashboardExecutorModel;
		delete this.$HistoricalDashboardRequestFormatterModel;
		delete this.$HistoricalDashboardProcessorModel;
		delete this.$HistoricalDashboardConstituentModel;
		delete this.$HistoricalDashboardAttributeSetModel;
		delete this.$TenantHistoricalDashboardModel;

		delete this.$TenantAttributeSetFunctionObservedPropertyModel;
		delete this.$TenantAttributeSetFunctionModel;
		delete this.$TenantAttributeSetPropertyModel;
		delete this.$TenantAttributeSetModel;

		delete this.$TenantLocationModel;
		delete this.$TenantFolderModel;
		delete this.$TenantModel;

		await super._teardown();
		return null;
	}
	// #endregion

	// #region Protected methods
	async _registerApis() {
		try {
			const ApiService = this.$dependencies.ApiService;
			await ApiService.add(`${this.name}::getConfigTreeNodes`, this._getConfigTreeNodes.bind(this));
			await ApiService.add(`${this.name}::getDevEnvTreeNodes`, this._getDevEnvTreeNodes.bind(this));

			await ApiService.add(`${this.name}::getTenantFolder`, this._getTenantFolder.bind(this));
			await ApiService.add(`${this.name}::addTenantFolder`, this._addTenantFolder.bind(this));
			await ApiService.add(`${this.name}::updateTenantFolder`, this._updateTenantFolder.bind(this));
			await ApiService.add(`${this.name}::deleteTenantFolder`, this._deleteTenantFolder.bind(this));

			await ApiService.add(`${this.name}::getAllTenantAttributeSets`, this._getAllTenantAttributeSets.bind(this));
			await ApiService.add(`${this.name}::getTenantAttributeSet`, this._getTenantAttributeSet.bind(this));
			await ApiService.add(`${this.name}::addTenantAttributeSet`, this._addTenantAttributeSet.bind(this));
			await ApiService.add(`${this.name}::updateTenantAttributeSet`, this._updateTenantAttributeSet.bind(this));
			await ApiService.add(`${this.name}::deleteTenantAttributeSet`, this._deleteTenantAttributeSet.bind(this));

			await ApiService.add(`${this.name}::getTenantAttributeSetProperty`, this._getTenantAttributeSetProperty.bind(this));
			await ApiService.add(`${this.name}::addTenantAttributeSetProperty`, this._addTenantAttributeSetProperty.bind(this));
			await ApiService.add(`${this.name}::updateTenantAttributeSetProperty`, this._updateTenantAttributeSetProperty.bind(this));
			await ApiService.add(`${this.name}::deleteTenantAttributeSetProperty`, this._deleteTenantAttributeSetProperty.bind(this));

			await ApiService.add(`${this.name}::getTenantAttributeSetFunction`, this._getTenantAttributeSetFunction.bind(this));
			await ApiService.add(`${this.name}::addTenantAttributeSetFunction`, this._addTenantAttributeSetFunction.bind(this));
			await ApiService.add(`${this.name}::updateTenantAttributeSetFunction`, this._updateTenantAttributeSetFunction.bind(this));
			await ApiService.add(`${this.name}::deleteTenantAttributeSetFunction`, this._deleteTenantAttributeSetFunction.bind(this));

			await ApiService.add(`${this.name}::getTenantAttributeSetFunctionObservedProperty`, this._getTenantAttributeSetFunctionObservedProperty.bind(this));
			await ApiService.add(`${this.name}::addTenantAttributeSetFunctionObservedProperty`, this._addTenantAttributeSetFunctionObservedProperty.bind(this));
			await ApiService.add(`${this.name}::deleteTenantAttributeSetFunctionObservedProperty`, this._deleteTenantAttributeSetFunctionObservedProperty.bind(this));

			await ApiService.add(`${this.name}::getTenantHistoricalDashboard`, this._getTenantHistoricalDashboard.bind(this));
			await ApiService.add(`${this.name}::getAllTenantHistoricalDashboards`, this._getAllTenantHistoricalDashboards.bind(this));
			await ApiService.add(`${this.name}::addTenantHistoricalDashboard`, this._addTenantHistoricalDashboard.bind(this));
			await ApiService.add(`${this.name}::updateTenantHistoricalDashboard`, this._updateTenantHistoricalDashboard.bind(this));
			await ApiService.add(`${this.name}::deleteTenantHistoricalDashboard`, this._deleteTenantHistoricalDashboard.bind(this));

			await ApiService.add(`${this.name}::getTenantHistoricalDashboardAttributeSet`, this._getTenantHistoricalDashboardAttributeSet.bind(this));
			await ApiService.add(`${this.name}::addTenantHistoricalDashboardAttributeSet`, this._addTenantHistoricalDashboardAttributeSet.bind(this));
			await ApiService.add(`${this.name}::updateTenantHistoricalDashboardAttributeSet`, this._updateTenantHistoricalDashboardAttributeSet.bind(this));
			await ApiService.add(`${this.name}::deleteTenantHistoricalDashboardAttributeSet`, this._deleteTenantHistoricalDashboardAttributeSet.bind(this));

			await ApiService.add(`${this.name}::getTenantHistoricalDashboardConstituent`, this._getTenantHistoricalDashboardConstituent.bind(this));
			await ApiService.add(`${this.name}::addTenantHistoricalDashboardConstituent`, this._addTenantHistoricalDashboardConstituent.bind(this));
			await ApiService.add(`${this.name}::deleteTenantHistoricalDashboardConstituent`, this._deleteTenantHistoricalDashboardConstituent.bind(this));

			await ApiService.add(`${this.name}::getTenantHistoricalDashboardProcessor`, this._getTenantHistoricalDashboardProcessor.bind(this));
			await ApiService.add(`${this.name}::addTenantHistoricalDashboardProcessor`, this._addTenantHistoricalDashboardProcessor.bind(this));
			await ApiService.add(`${this.name}::updateTenantHistoricalDashboardProcessor`, this._updateTenantHistoricalDashboardProcessor.bind(this));

			await ApiService.add(`${this.name}::getTenantHistoricalDashboardRequestFormatter`, this._getTenantHistoricalDashboardRequestFormatter.bind(this));
			await ApiService.add(`${this.name}::addTenantHistoricalDashboardRequestFormatter`, this._addTenantHistoricalDashboardRequestFormatter.bind(this));
			await ApiService.add(`${this.name}::updateTenantHistoricalDashboardRequestFormatter`, this._updateTenantHistoricalDashboardRequestFormatter.bind(this));

			await ApiService.add(`${this.name}::getTenantHistoricalDashboardExecutor`, this._getTenantHistoricalDashboardExecutor.bind(this));
			await ApiService.add(`${this.name}::addTenantHistoricalDashboardExecutor`, this._addTenantHistoricalDashboardExecutor.bind(this));
			await ApiService.add(`${this.name}::updateTenantHistoricalDashboardExecutor`, this._updateTenantHistoricalDashboardExecutor.bind(this));

			await ApiService.add(`${this.name}::getTenantHistoricalDashboardResponseFormatter`, this._getTenantHistoricalDashboardResponseFormatter.bind(this));
			await ApiService.add(`${this.name}::addTenantHistoricalDashboardResponseFormatter`, this._addTenantHistoricalDashboardResponseFormatter.bind(this));
			await ApiService.add(`${this.name}::updateTenantHistoricalDashboardResponseFormatter`, this._updateTenantHistoricalDashboardResponseFormatter.bind(this));

			await ApiService.add(`${this.name}::getTenantHistoricalDashboardInputTemplate`, this._getTenantHistoricalDashboardInputTemplate.bind(this));
			await ApiService.add(`${this.name}::addTenantHistoricalDashboardInputTemplate`, this._addTenantHistoricalDashboardInputTemplate.bind(this));
			await ApiService.add(`${this.name}::updateTenantHistoricalDashboardInputTemplate`, this._updateTenantHistoricalDashboardInputTemplate.bind(this));

			await ApiService.add(`${this.name}::getTenantHistoricalDashboardResultTemplate`, this._getTenantHistoricalDashboardResultTemplate.bind(this));
			await ApiService.add(`${this.name}::addTenantHistoricalDashboardResultTemplate`, this._addTenantHistoricalDashboardResultTemplate.bind(this));
			await ApiService.add(`${this.name}::updateTenantHistoricalDashboardResultTemplate`, this._updateTenantHistoricalDashboardResultTemplate.bind(this));

			await ApiService.add(`${this.name}::getTenantHistoricalDashboardWatcher`, this._getTenantHistoricalDashboardWatcher.bind(this));
			await ApiService.add(`${this.name}::addTenantHistoricalDashboardWatcher`, this._addTenantHistoricalDashboardWatcher.bind(this));
			await ApiService.add(`${this.name}::deleteTenantHistoricalDashboardWatcher`, this._deleteTenantHistoricalDashboardWatcher.bind(this));

			await ApiService.add(`${this.name}::possibleTenantUsersList`, this._getPossibleTenantUsersList.bind(this));

			await ApiService.add(`${this.name}::getTenantHistoricalDashboardAggregate`, this._getTenantHistoricalDashboardAggregate.bind(this));
			await ApiService.add(`${this.name}::addTenantHistoricalDashboardAggregate`, this._addTenantHistoricalDashboardAggregate.bind(this));
			await ApiService.add(`${this.name}::updateTenantHistoricalDashboardAggregate`, this._updateTenantHistoricalDashboardAggregate.bind(this));
			await ApiService.add(`${this.name}::deleteTenantHistoricalDashboardAggregate`, this._deleteTenantHistoricalDashboardAggregate.bind(this));

			await ApiService.add(`${this.name}::getTenantHistoricalDashboardSubcomponent`, this._getTenantHistoricalDashboardSubcomponent.bind(this));
			await ApiService.add(`${this.name}::addTenantHistoricalDashboardSubcomponent`, this._addTenantHistoricalDashboardSubcomponent.bind(this));
			await ApiService.add(`${this.name}::updateTenantHistoricalDashboardSubcomponent`, this._updateTenantHistoricalDashboardSubcomponent.bind(this));
			await ApiService.add(`${this.name}::deleteTenantHistoricalDashboardSubcomponent`, this._deleteTenantHistoricalDashboardSubcomponent.bind(this));
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
			await ApiService.remove(`${this.name}::deleteTenantHistoricalDashboardSubcomponent`, this._deleteTenantHistoricalDashboardSubcomponent.bind(this));
			await ApiService.remove(`${this.name}::updateTenantHistoricalDashboardSubcomponent`, this._updateTenantHistoricalDashboardSubcomponent.bind(this));
			await ApiService.remove(`${this.name}::addTenantHistoricalDashboardSubcomponent`, this._addTenantHistoricalDashboardSubcomponent.bind(this));
			await ApiService.remove(`${this.name}::getTenantHistoricalDashboardSubcomponent`, this._getTenantHistoricalDashboardSubcomponent.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantHistoricalDashboardAggregate`, this._deleteTenantHistoricalDashboardAggregate.bind(this));
			await ApiService.remove(`${this.name}::updateTenantHistoricalDashboardAggregate`, this._updateTenantHistoricalDashboardAggregate.bind(this));
			await ApiService.remove(`${this.name}::addTenantHistoricalDashboardAggregate`, this._addTenantHistoricalDashboardAggregate.bind(this));
			await ApiService.remove(`${this.name}::getTenantHistoricalDashboardAggregate`, this._getTenantHistoricalDashboardAggregate.bind(this));

			await ApiService.remove(`${this.name}::possibleTenantUsersList`, this._getPossibleTenantUsersList.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantHistoricalDashboardWatcher`, this._deleteTenantHistoricalDashboardWatcher.bind(this));
			await ApiService.remove(`${this.name}::addTenantHistoricalDashboardWatcher`, this._addTenantHistoricalDashboardWatcher.bind(this));
			await ApiService.remove(`${this.name}::getTenantHistoricalDashboardWatcher`, this._getTenantHistoricalDashboardWatcher.bind(this));

			await ApiService.remove(`${this.name}::updateTenantHistoricalDashboardResultTemplate`, this._updateTenantHistoricalDashboardResultTemplate.bind(this));
			await ApiService.remove(`${this.name}::addTenantHistoricalDashboardResultTemplate`, this._addTenantHistoricalDashboardResultTemplate.bind(this));
			await ApiService.remove(`${this.name}::getTenantHistoricalDashboardResultTemplate`, this._getTenantHistoricalDashboardResultTemplate.bind(this));

			await ApiService.remove(`${this.name}::updateTenantHistoricalDashboardInputTemplate`, this._updateTenantHistoricalDashboardInputTemplate.bind(this));
			await ApiService.remove(`${this.name}::addTenantHistoricalDashboardInputTemplate`, this._addTenantHistoricalDashboardInputTemplate.bind(this));
			await ApiService.remove(`${this.name}::getTenantHistoricalDashboardInputTemplate`, this._getTenantHistoricalDashboardInputTemplate.bind(this));

			await ApiService.remove(`${this.name}::updateTenantHistoricalDashboardResponseFormatter`, this._updateTenantHistoricalDashboardResponseFormatter.bind(this));
			await ApiService.remove(`${this.name}::addTenantHistoricalDashboardResponseFormatter`, this._addTenantHistoricalDashboardResponseFormatter.bind(this));
			await ApiService.remove(`${this.name}::getTenantHistoricalDashboardResponseFormatter`, this._getTenantHistoricalDashboardResponseFormatter.bind(this));

			await ApiService.remove(`${this.name}::updateTenantHistoricalDashboardExecutor`, this._updateTenantHistoricalDashboardExecutor.bind(this));
			await ApiService.remove(`${this.name}::addTenantHistoricalDashboardExecutor`, this._addTenantHistoricalDashboardExecutor.bind(this));
			await ApiService.remove(`${this.name}::getTenantHistoricalDashboardExecutor`, this._getTenantHistoricalDashboardExecutor.bind(this));

			await ApiService.remove(`${this.name}::updateTenantHistoricalDashboardRequestFormatter`, this._updateTenantHistoricalDashboardRequestFormatter.bind(this));
			await ApiService.remove(`${this.name}::addTenantHistoricalDashboardRequestFormatter`, this._addTenantHistoricalDashboardRequestFormatter.bind(this));
			await ApiService.remove(`${this.name}::getTenantHistoricalDashboardRequestFormatter`, this._getTenantHistoricalDashboardRequestFormatter.bind(this));

			await ApiService.remove(`${this.name}::updateTenantHistoricalDashboardProcessor`, this._updateTenantHistoricalDashboardProcessor.bind(this));
			await ApiService.remove(`${this.name}::addTenantHistoricalDashboardProcessor`, this._addTenantHistoricalDashboardProcessor.bind(this));
			await ApiService.remove(`${this.name}::getTenantHistoricalDashboardProcessor`, this._getTenantHistoricalDashboardProcessor.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantHistoricalDashboardConstituent`, this._deleteTenantHistoricalDashboardConstituent.bind(this));
			await ApiService.remove(`${this.name}::addTenantHistoricalDashboardConstituent`, this._addTenantHistoricalDashboardConstituent.bind(this));
			await ApiService.remove(`${this.name}::getTenantHistoricalDashboardConstituent`, this._getTenantHistoricalDashboardConstituent.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantHistoricalDashboardAttributeSet`, this._deleteTenantHistoricalDashboardAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::updateTenantHistoricalDashboardAttributeSet`, this._updateTenantHistoricalDashboardAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::addTenantHistoricalDashboardAttributeSet`, this._addTenantHistoricalDashboardAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::getTenantHistoricalDashboardAttributeSet`, this._getTenantHistoricalDashboardAttributeSet.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantHistoricalDashboard`, this._deleteTenantHistoricalDashboard.bind(this));
			await ApiService.remove(`${this.name}::updateTenantHistoricalDashboard`, this._updateTenantHistoricalDashboard.bind(this));
			await ApiService.remove(`${this.name}::addTenantHistoricalDashboard`, this._addTenantHistoricalDashboard.bind(this));
			await ApiService.remove(`${this.name}::getAllTenantHistoricalDashboards`, this._getAllTenantHistoricalDashboards.bind(this));
			await ApiService.remove(`${this.name}::getTenantHistoricalDashboard`, this._getTenantHistoricalDashboard.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantAttributeSetFunctionObservedProperty`, this._deleteTenantAttributeSetFunctionObservedProperty.bind(this));
			await ApiService.remove(`${this.name}::addTenantAttributeSetFunctionObservedProperty`, this._addTenantAttributeSetFunctionObservedProperty.bind(this));
			await ApiService.remove(`${this.name}::getTenantAttributeSetFunctionObservedProperty`, this._getTenantAttributeSetFunctionObservedProperty.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantAttributeSetFunction`, this._deleteTenantAttributeSetFunction.bind(this));
			await ApiService.remove(`${this.name}::updateTenantAttributeSetFunction`, this._updateTenantAttributeSetFunction.bind(this));
			await ApiService.remove(`${this.name}::addTenantAttributeSetFunction`, this._addTenantAttributeSetFunction.bind(this));
			await ApiService.remove(`${this.name}::getTenantAttributeSetFunction`, this._getTenantAttributeSetFunction.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantAttributeSetProperty`, this._deleteTenantAttributeSetProperty.bind(this));
			await ApiService.remove(`${this.name}::updateTenantAttributeSetProperty`, this._updateTenantAttributeSetProperty.bind(this));
			await ApiService.remove(`${this.name}::addTenantAttributeSetProperty`, this._addTenantAttributeSetProperty.bind(this));
			await ApiService.remove(`${this.name}::getTenantAttributeSetProperty`, this._getTenantAttributeSetProperty.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantAttributeSet`, this._deleteTenantAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::updateTenantAttributeSet`, this._updateTenantAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::addTenantAttributeSet`, this._addTenantAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::getTenantAttributeSet`, this._getTenantAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::getAllTenantAttributeSets`, this._getAllTenantAttributeSets.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantFolder`, this._deleteTenantFolder.bind(this));
			await ApiService.remove(`${this.name}::updateTenantFolder`, this._updateTenantFolder.bind(this));
			await ApiService.remove(`${this.name}::addTenantFolder`, this._addTenantFolder.bind(this));
			await ApiService.remove(`${this.name}::getTenantFolder`, this._getTenantFolder.bind(this));

			await ApiService.remove(`${this.name}::getDevEnvTreeNodes`, this._getDevEnvTreeNodes.bind(this));
			await ApiService.remove(`${this.name}::getconfigTreeNodes`, this._getConfigTreeNodes.bind(this));
			await super._deregisterApis();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getConfigTreeNodes(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			if(ctxt.query.node_type === 'root-folder') {
				let tenantFolders = null;

				// Get the sub-folders
				tenantFolders = await dbSrvc.knex.raw(`SELECT * FROM fn_get_folder_descendants(?) WHERE level = 2`, [ctxt.query.node_id]);
				tenantFolders = tenantFolders.rows.map((folder) => {
					return {
						'id': folder.id,
						'parent': folder.parent_id,
						'text': folder.name,
						'children': true,

						'li_attr': {
							'title': folder.name
						},

						'data': {
							'configsRoute': 'configure.historical-dashboard',
							'dataUrl': '/historical-dashboard/config-tree-nodes',
							'intl': true,
							'type': folder.name === 'historical_dashboard_feature.folder_names.attribute_sets.name' ? 'attribute-folder' : 'historical-dashboard-folder'
						}
					};
				});

				return tenantFolders;
			}

			if(['attribute-folder', 'historical-dashboard-folder'].includes(ctxt.query.node_type)) {
				// Get the sub-folders
				let tenantFolders = await dbSrvc.knex.raw(`SELECT * FROM fn_get_folder_descendants(?) WHERE level = 2`, [ctxt.query.node_id]);
				tenantFolders = tenantFolders.rows.map((folder) => {
					return {
						'id': folder.id,
						'parent': folder.parent_id,
						'text': folder.name,
						'children': true,

						'li_attr': {
							'title': folder.name
						},

						'data': {
							'configsRoute': 'configure.historical-dashboard',
							'dataUrl': '/historical-dashboard/config-tree-nodes',
							'intl': false,
							'type': ctxt.query.node_type
						}
					};
				});

				// Get the historical-dashboards in this folder
				let tenantHistoricalDashboards = await dbSrvc.knex.raw(`SELECT id, tenant_folder_id AS parent_id, name FROM tenant_historical_dashboards WHERE tenant_folder_id  = ?`, [ctxt.query.node_id]);
				tenantHistoricalDashboards = tenantHistoricalDashboards.rows.map((historicalDashboard) => {
					return {
						'id': historicalDashboard.id,
						'parent': historicalDashboard.parent_id,
						'text': historicalDashboard.name,
						'children': false,

						'li_attr': {
							'title': historicalDashboard.name
						},

						'data': {
							'configsRoute': 'configure.historical-dashboard',
							'dataUrl': '/historical-dashboard/config-tree-nodes',
							'type': 'historical-dashboard'
						}
					};
				});

				// Get the attribute sets in this folder
				let tenantAttributeSets = await dbSrvc.knex.raw(`SELECT id, tenant_folder_id AS parent_id, name FROM tenant_attribute_sets WHERE tenant_folder_id  = ?`, [ctxt.query.node_id]);
				tenantAttributeSets = tenantAttributeSets.rows.map((attrSet) => {
					return {
						'id': attrSet.id,
						'parent': attrSet.parent_id,
						'text': attrSet.name,
						'children': false,

						'li_attr': {
							'title': attrSet.name
						},

						'data': {
							'configsRoute': 'configure.historical-dashboard',
							'dataUrl': '/historical-dashboard/config-tree-nodes',
							'type': 'attribute-set'
						}
					};
				});

				return [...tenantFolders, ...tenantHistoricalDashboards, ...tenantAttributeSets];
			}

			return [];
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getConfigTreeNodes`, err);
		}
	}

	async _getDevEnvTreeNodes(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			if(ctxt.query.node_type === 'root-folder') {
				let tenantFolders = null;

				// Get the sub-folders
				tenantFolders = await dbSrvc.knex.raw(`SELECT * FROM fn_get_folder_descendants(?) WHERE level = 2`, [ctxt.query.node_id]);
				tenantFolders = tenantFolders.rows.map((folder) => {
					return {
						'id': folder.id,
						'parent': folder.parent_id,
						'text': folder.name,
						'children': true,

						'li_attr': {
							'title': folder.name
						},

						'data': {
							'devenvRoute': 'devenv.historical-dashboard',
							'dataUrl': '/historical-dashboard/devenv-tree-nodes',
							'intl': true,
							'type': folder.name === 'historical_dashboard_feature.folder_names.attribute_sets.name' ? 'attribute-folder' : 'historical-dashboard-folder'
						}
					};
				});

				return tenantFolders;
			}

			if(['attribute-folder', 'historical-dashboard-folder'].includes(ctxt.query.node_type)) {
				// Get the sub-folders
				let tenantFolders = await dbSrvc.knex.raw(`SELECT * FROM fn_get_folder_descendants(?) WHERE level = 2`, [ctxt.query.node_id]);
				tenantFolders = tenantFolders.rows.map((folder) => {
					return {
						'id': folder.id,
						'parent': folder.parent_id,
						'text': folder.name,
						'children': true,

						'li_attr': {
							'title': folder.name
						},

						'data': {
							'devenvRoute': 'devenv.historical-dashboard',
							'dataUrl': '/historical-dashboard/devenv-tree-nodes',
							'intl': false,
							'type': ctxt.query.node_type
						}
					};
				});

				// Get the historical-dashboards in this folder
				let tenantHistoricalDashboards = await dbSrvc.knex.raw(`SELECT id, tenant_folder_id AS parent_id, name FROM tenant_historical_dashboards WHERE tenant_folder_id  = ?`, [ctxt.query.node_id]);
				tenantHistoricalDashboards = tenantHistoricalDashboards.rows.map((historicalDashboard) => {
					return {
						'id': historicalDashboard.id,
						'parent': historicalDashboard.parent_id,
						'text': historicalDashboard.name,
						'children': false,

						'li_attr': {
							'title': historicalDashboard.name
						},

						'data': {
							'devenvRoute': 'devenv.historical-dashboard',
							'dataUrl': '/historical-dashboard/devenv-tree-nodes',
							'type': 'historical-dashboard'
						}
					};
				});

				// Get the attribute sets in this folder
				let tenantAttributeSets = await dbSrvc.knex.raw(`SELECT id, tenant_folder_id AS parent_id, name FROM tenant_attribute_sets WHERE tenant_folder_id  = ?`, [ctxt.query.node_id]);
				tenantAttributeSets = tenantAttributeSets.rows.map((attrSet) => {
					return {
						'id': attrSet.id,
						'parent': attrSet.parent_id,
						'text': attrSet.name,
						'children': false,

						'li_attr': {
							'title': attrSet.name
						},

						'data': {
							'devenvRoute': 'devenv.historical-dashboard',
							'dataUrl': '/historical-dashboard/devenv-tree-nodes',
							'type': 'attribute-set'
						}
					};
				});

				return [...tenantFolders, ...tenantHistoricalDashboards, ...tenantAttributeSets];
			}

			return [];
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getDevEnvTreeNodes`, err);
		}
	}

	async _getTenantFolder(ctxt) {
		try {
			let folderData = await this.$TenantFolderModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.folder_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'parent', 'folders', 'historicalDashboards', 'attributeSets']
			});

			folderData = this._convertToJsonApiFormat(folderData, 'historical-dashboard/folder', {
				'tenant': 'settings/account/basics/tenant',
				'parent': 'historical-dashboard/folder',
				'folders': 'historical-dashboard/folder',
				'historicalDashboards': 'historical-dashboard/historical-dashboard',
				'attributeSets': 'historical-dashboard/attribute-set'
			});

			return folderData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantFolder`, err);
		}
	}

	async _addTenantFolder(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantFolderModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantFolder`, err);
		}
	}

	async _updateTenantFolder(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantFolderModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantFolder`, err);
		}
	}

	async _deleteTenantFolder(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const tenantFolder = await this.$TenantFolderModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params['folder_id'] })
				.andWhere({ 'tenant_id': ctxt.state.tenant['tenant_id'] });
			})
			.fetch();

			if(!tenantFolder) throw new Error('Unknown Tenant Folder');
			// determine if attrset folder or hdash folder
			const attrSetsRootFolderName = 'historical_dashboard_feature.folder_names.attribute_sets.name';

			let isAttrSetsFolder = await dbSrvc.knex.raw(`SELECT count(id) FROM fn_get_folder_descendants((SELECT id FROM tenant_folders WHERE tenant_id = ? and name = ?)) WHERE id = ?`, [
				ctxt.state.tenant.tenant_id,
				attrSetsRootFolderName,
				ctxt.params.folder_id
			]);

			isAttrSetsFolder = isAttrSetsFolder.rows && isAttrSetsFolder.rows.length && !!isAttrSetsFolder.rows[0]['count'];

			const folderDescendants = await dbSrvc.knex.raw(`SELECT * FROM fn_get_folder_descendants(?)`, [ctxt.params.folder_id]);
			let cachedArtifacts = [];
			if(isAttrSetsFolder) {
				// delete cached processor of attr sets within folder
				// update db and cached rendered processor of hdash which using folder attr sets
				const folderAttrSets = await dbSrvc.knex.raw(`SELECT id FROM tenant_attribute_sets WHERE tenant_folder_id IN (${folderDescendants.rows.map(() => { return '?'; }).join(',')})`, folderDescendants.rows.map((f) => { return f['id']; }));
				const folderAttrSetsHistoricalDashboards = await dbSrvc.knex.raw(`SELECT tenant_historical_dashboard_id AS id FROM tenant_historical_dashboards_attribute_sets WHERE tenant_attribute_set_id IN (SELECT id FROM tenant_attribute_sets WHERE tenant_folder_id IN (${folderDescendants.rows.map(() => { return '?'; }).join(',')}))`, folderDescendants.rows.map((f) => { return f['id']; }));

				await tenantFolder.destroy();

				for(let idx = 0; idx < folderAttrSets.rows.length; idx++) {
					const folderAttrSet = folderAttrSets.rows[idx];
					const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderAttrSet.id, 'attrSet']);
					cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());
				}

				for(let idx = 0; idx < folderAttrSetsHistoricalDashboards.rows.length; idx++) {
					const folderAttrSetsHistoricalDashboard = folderAttrSetsHistoricalDashboards.rows[idx];
					await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [folderAttrSetsHistoricalDashboard.id, 'hdash', ctxt.state.tenant['tenant_id']]);
					const historicalDashboardArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderAttrSetsHistoricalDashboard.id, 'hdash']);
					cachedArtifacts = cachedArtifacts.concat(historicalDashboardArtifacts.shift());
				}
			}
			else {
				// delete cached rendered processor of historical dashboard within folder
				// update rendered processor of deleted historical dashboard constituents
				const folderHistoricalDashboards = await dbSrvc.knex.raw(`SELECT id FROM tenant_historical_dashboards WHERE tenant_folder_id IN (${folderDescendants.rows.map(() => { return '?'; }).join(',')});`, folderDescendants.rows.map((f) => { return f['id']; }));
				const folderHistoricalDashboardConstituents = await dbSrvc.knex.raw(`SELECT id, type FROM tenant_historical_dashboard_constituents WHERE tenant_historical_dashboard_id IN (${folderHistoricalDashboards.rows.map(() => { return '?'; }).join(',')});`, folderHistoricalDashboards.rows.map((f) => { return f['id']; }));

				await tenantFolder.destroy();

				for(let idx = 0; idx < folderHistoricalDashboards.rows.length; idx++) {
					const folderHistoricalDashboard = folderHistoricalDashboards.rows[idx];
					const historicalDashboardArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderHistoricalDashboard.id, 'hdash']);
					cachedArtifacts = cachedArtifacts.concat(historicalDashboardArtifacts.shift());
				}

				for(let idx = 0; idx < folderHistoricalDashboardConstituents.rows.length; idx++) {
					const folderHistoricalDashboardConstituent = folderHistoricalDashboardConstituents.rows[idx];
					const constituentArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderHistoricalDashboardConstituent.id, folderHistoricalDashboardConstituent.type]);
					cachedArtifacts = cachedArtifacts.concat(constituentArtifacts.shift());
					await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [folderHistoricalDashboardConstituent.id, folderHistoricalDashboardConstituent.type, ctxt.state.tenant['tenant_id']]);
				}
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantFolder`, err);
		}
	}

	async _getAllTenantAttributeSets(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			let parentFolderId = await dbSrvc.knex.raw(`SELECT id FROM tenant_folders WHERE tenant_id = ? AND name = 'historical_dashboard_feature.folder_names.attribute_sets.name'`, [ctxt.state.tenant.tenant_id]);
			parentFolderId = parentFolderId.rows[0]['id'];

			let subFolders = await dbSrvc.knex.raw(`SELECT id FROM fn_get_folder_descendants(?)`, [parentFolderId]);
			subFolders = subFolders.rows.map((subFolder) => {
				return subFolder['id'];
			});

			let attributeSetData = await this.$TenantAttributeSetModel
			.query(function(qb) {
				qb.whereIn('tenant_folder_id', subFolders);
			})
			.fetchAll({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'properties', 'functions']
			});

			attributeSetData = this._convertToJsonApiFormat(attributeSetData, 'historical-dashboard/attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'historical-dashboard/folder',
				'properties': 'historical-dashboard/attribute-set-property',
				'functions': 'historical-dashboard/attribute-set-function'
			});

			delete attributeSetData.included;
			return attributeSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAttributeSet`, err);
		}
	}

	async _getTenantAttributeSet(ctxt) {
		try {
			let attrSetData = await this.$TenantAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'properties', 'functions']
			});

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'historical-dashboard/attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'historical-dashboard/folder',
				'properties': 'historical-dashboard/attribute-set-property',
				'functions': 'historical-dashboard/attribute-set-function'
			});

			delete attrSetData.included;
			return attrSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAttributeSet`, err);
		}
	}

	async _addTenantAttributeSet(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const dbSrvc = this.$dependencies.DatabaseService;

			let tenantModuleId = await dbSrvc.knex.raw(`SELECT id FROM tenants_modules WHERE tenant_id = ? AND module_id = (SELECT id FROM modules  WHERE name = ? AND type = 'feature')`, [ctxt.state.tenant.tenant_id, 'HistoricalDashboard']);
			if(!tenantModuleId.rows.length) throw new Error('HistoricalDashboard feature not enabled for this tenant');
			tenantModuleId = tenantModuleId.rows[0].id;

			jsonDeserializedData['tenant_module_id'] = tenantModuleId;
			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const savedRecord = await this.$TenantAttributeSetModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantAttributeSet`, err);
		}
	}

	async _updateTenantAttributeSet(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const savedRecord = await this.$TenantAttributeSetModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantAttributeSet`, err);
		}
	}

	async _deleteTenantAttributeSet(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const tenantAttributeSet = await this.$TenantAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantAttributeSet) throw new Error('Unknown Tenant Attribute Set');
			const attrSetHistoricalDashboards = await dbSrvc.knex.raw(`SELECT tenant_historical_dashboard_id AS id FROM tenant_historical_dashboards_attribute_sets WHERE tenant_attribute_set_id = ?`, [ctxt.params['attribute_set_id']]);

			await tenantAttributeSet.destroy();

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [ctxt.params.attribute_set_id, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetHistoricalDashboards.rows.length; idx++) {
				const attrSetHistoricalDashboard = attrSetHistoricalDashboards.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetHistoricalDashboard.id, 'hdash', ctxt.state.tenant['tenant_id']]);
				const historicalDashboardArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetHistoricalDashboard.id, 'hdash']);
				cachedArtifacts = cachedArtifacts.concat(historicalDashboardArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantAttributeSet`, err);
		}
	}

	async _getTenantAttributeSetProperty(ctxt) {
		try {
			let attrSetData = await this.$TenantAttributeSetPropertyModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.attribute_set_property_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'attributeSet']
			});

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'historical-dashboard/attribute-set-property', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'historical-dashboard/attribute-set'
			});

			return attrSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAttributeSetProperty`, err);
		}
	}

	async _addTenantAttributeSetProperty(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantAttributeSetPropertyModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const attrSetHistoricalDashboards = await dbSrvc.knex.raw(`SELECT tenant_historical_dashboard_id AS id FROM tenant_historical_dashboards_attribute_sets WHERE tenant_attribute_set_id = ?`, [jsonDeserializedData.attribute_set_id]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData.attribute_set_id, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetHistoricalDashboards.rows.length; idx++) {
				const attrSetHistoricalDashboard = attrSetHistoricalDashboards.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetHistoricalDashboard.id, 'hdash', ctxt.state.tenant['tenant_id']]);
				const historicalDashboardArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetHistoricalDashboard.id, 'hdash']);
				cachedArtifacts = cachedArtifacts.concat(historicalDashboardArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantAttributeSetProperty`, err);
		}
	}

	async _updateTenantAttributeSetProperty(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantAttributeSetPropertyModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			const attrSetHistoricalDashboards = await dbSrvc.knex.raw(`SELECT tenant_historical_dashboard_id AS id FROM tenant_historical_dashboards_attribute_sets WHERE tenant_attribute_set_id = ?`, [jsonDeserializedData.attribute_set_id]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData.attribute_set_id, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetHistoricalDashboards.rows.length; idx++) {
				const attrSetHistoricalDashboard = attrSetHistoricalDashboards.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetHistoricalDashboard.id, 'hdash', ctxt.state.tenant['tenant_id']]);
				const historicalDashboardArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetHistoricalDashboard.id, 'hdash']);
				cachedArtifacts = cachedArtifacts.concat(historicalDashboardArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantAttributeSetProperty`, err);
		}
	}

	async _deleteTenantAttributeSetProperty(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();
			const dbSrvc = this.$dependencies.DatabaseService;

			const tenantAttributeSetProperty = await this.$TenantAttributeSetPropertyModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.attribute_set_property_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantAttributeSetProperty) throw new Error('Unknown Tenant Attribute Set Property');

			const attributeSetId = tenantAttributeSetProperty.get('attribute_set_id');
			await tenantAttributeSetProperty.destroy();

			const attrSetHistoricalDashboards = await dbSrvc.knex.raw(`SELECT tenant_historical_dashboard_id AS id FROM tenant_historical_dashboards_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetHistoricalDashboards.rows.length; idx++) {
				const attrSetHistoricalDashboard = attrSetHistoricalDashboards.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetHistoricalDashboard.id, 'hdash', ctxt.state.tenant['tenant_id']]);
				const historicalDashboardArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetHistoricalDashboard.id, 'hdash']);
				cachedArtifacts = cachedArtifacts.concat(historicalDashboardArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantAttributeSetProperty`, err);
		}
	}

	async _getTenantAttributeSetFunction(ctxt) {
		try {
			let attrSetData = await this.$TenantAttributeSetFunctionModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.attribute_set_function_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'attributeSet', 'observedProperties']
			});

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'historical-dashboard/attribute-set-function', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'historical-dashboard/attribute-set',
				'observedProperties': 'historical-dashboard/attribute-set-function-observed-property'
			});

			return attrSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAttributeSetFunction`, err);
		}
	}

	async _addTenantAttributeSetFunction(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantAttributeSetFunctionModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const attributeSetId = jsonDeserializedData['attribute_set_id'];

			const attrSetHistoricalDashboards = await dbSrvc.knex.raw(`SELECT tenant_historical_dashboard_id AS id FROM tenant_historical_dashboards_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetHistoricalDashboards.rows.length; idx++) {
				const attrSetHistoricalDashboard = attrSetHistoricalDashboards.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetHistoricalDashboard.id, 'hdash', ctxt.state.tenant['tenant_id']]);
				const historicalDashboardArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetHistoricalDashboard.id, 'hdash']);
				cachedArtifacts = cachedArtifacts.concat(historicalDashboardArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantAttributeSetFunction`, err);
		}
	}

	async _updateTenantAttributeSetFunction(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantAttributeSetFunctionModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			const attributeSetId = jsonDeserializedData['attribute_set_id'];

			const attrSetHistoricalDashboards = await dbSrvc.knex.raw(`SELECT tenant_historical_dashboard_id AS id FROM tenant_historical_dashboards_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetHistoricalDashboards.rows.length; idx++) {
				const attrSetHistoricalDashboard = attrSetHistoricalDashboards.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetHistoricalDashboard.id, 'hdash', ctxt.state.tenant['tenant_id']]);
				const historicalDashboardArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetHistoricalDashboard.id, 'hdash']);
				cachedArtifacts = cachedArtifacts.concat(historicalDashboardArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantAttributeSetFunction`, err);
		}
	}

	async _deleteTenantAttributeSetFunction(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();
			const dbSrvc = this.$dependencies.DatabaseService;

			const tenantAttributeSetFunction = await this.$TenantAttributeSetFunctionModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.attribute_set_function_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantAttributeSetFunction) throw new Error('Unknown Tenant Attribute Set Function');

			const attributeSetId = tenantAttributeSetFunction.get('attribute_set_id');

			await tenantAttributeSetFunction.destroy();

			const attrSetHistoricalDashboards = await dbSrvc.knex.raw(`SELECT tenant_historical_dashboard_id AS id FROM tenant_historical_dashboards_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetHistoricalDashboards.rows.length; idx++) {
				const attrSetHistoricalDashboard = attrSetHistoricalDashboards.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetHistoricalDashboard.id, 'hdash', ctxt.state.tenant['tenant_id']]);
				const historicalDashboardArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetHistoricalDashboard.id, 'hdash']);
				cachedArtifacts = cachedArtifacts.concat(historicalDashboardArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantAttributeSetFunction`, err);
		}
	}

	async _getTenantAttributeSetFunctionObservedProperty(ctxt) {
		try {
			let attrSetObservedPropertyData = await this.$TenantAttributeSetFunctionObservedPropertyModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.attribute_set_function_observed_property_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'attributeSet', 'attributeSetFunction', 'attributeSetProperty']
			});

			attrSetObservedPropertyData = this._convertToJsonApiFormat(attrSetObservedPropertyData, 'historical-dashboard/attribute-set-function-observed-property', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'historical-dashboard/attribute-set',
				'attributeSetFunction': 'historical-dashboard/attribute-set-function',
				'attributeSetProperty': 'historical-dashboard/attribute-set-property'
			});

			return attrSetObservedPropertyData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAttributeSetFunctionObservedProperty`, err);
		}
	}

	async _addTenantAttributeSetFunctionObservedProperty(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$TenantAttributeSetFunctionObservedPropertyModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const attributeSetId = savedRecord.get('attribute_set_id');
			const attrSetHistoricalDashboards = await dbSrvc.knex.raw(`SELECT tenant_historical_dashboard_id AS id FROM tenant_historical_dashboards_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetHistoricalDashboards.rows.length; idx++) {
				const attrSetHistoricalDashboard = attrSetHistoricalDashboards.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetHistoricalDashboard.id, 'hdash', ctxt.state.tenant['tenant_id']]);
				const historicalDashboardArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetHistoricalDashboard.id, 'hdash']);
				cachedArtifacts = cachedArtifacts.concat(historicalDashboardArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantAttributeSetFunctionObservedProperty`, err);
		}
	}

	async _deleteTenantAttributeSetFunctionObservedProperty(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();
			const dbSrvc = this.$dependencies.DatabaseService;

			const tenantAttributeSetFunctionObservedProperty = await this.$TenantAttributeSetFunctionObservedPropertyModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.attribute_set_function_observed_property_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantAttributeSetFunctionObservedProperty) throw new Error('Unknown Tenant Attribute Set Function Observed Property');

			const attributeSetId = tenantAttributeSetFunctionObservedProperty.get('attribute_set_id');

			await tenantAttributeSetFunctionObservedProperty.destroy();

			const attrSetHistoricalDashboards = await dbSrvc.knex.raw(`SELECT tenant_historical_dashboard_id AS id FROM tenant_historical_dashboards_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetHistoricalDashboards.rows.length; idx++) {
				const attrSetHistoricalDashboard = attrSetHistoricalDashboards.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetHistoricalDashboard.id, 'hdash', ctxt.state.tenant['tenant_id']]);
				const historicalDashboardArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetHistoricalDashboard.id, 'hdash']);
				cachedArtifacts = cachedArtifacts.concat(historicalDashboardArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantAttributeSetFunctionObservedProperty`, err);
		}
	}

	async _getTenantHistoricalDashboard(ctxt) {
		try {
			let historicalDashboardData = await this.$TenantHistoricalDashboardModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.historical_dashboard_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'attributeSets', 'constituents', 'processors', 'requestFormatters', 'executors', 'responseFormatters', 'inputTemplates', 'resultTemplates', 'watchers', 'dataPointAggregations', 'subcomponents']
			});

			historicalDashboardData = this._convertToJsonApiFormat(historicalDashboardData, 'historical-dashboard/historical-dashboard', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'historical-dashboard/folder',
				'attributeSets': 'historical-dashboard/historical-dashboard-attribute-set',
				'constituents': 'historical-dashboard/historical-dashboard-constituent',
				'processors': 'historical-dashboard/historical-dashboard-processor',
				'requestFormatters': 'historical-dashboard/historical-dashboard-request-formatter',
				'executors': 'historical-dashboard/historical-dashboard-executor',
				'responseFormatters': 'historical-dashboard/historical-dashboard-response-formatter',
				'inputTemplates': 'historical-dashboard/historical-dashboard-input-template',
				'resultTemplates': 'historical-dashboard/historical-dashboard-result-template',
				'watchers': 'historical-dashboard/historical-dashboard-watcher',
				'dataPointAggregations': 'historical-dashboard/historical-dashboard-aggregate',
				'subcomponents': 'historical-dashboard/historical-dashboard-subcomponent'
			}, {
				'deleteInclude': false
			});

			historicalDashboardData.included = historicalDashboardData.included.filter((include) => {
				return include['type'] === 'historical-dashboard/historical-dashboard-subcomponent';
			});

			return historicalDashboardData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantHistoricalDashboard`, err);
		}
	}

	async _getAllTenantHistoricalDashboards(ctxt) {
		let hasHistoricalDashboardReadPermissions = false;
		try {
			const rbacChecker = this._rbac('historical-dashboard-read');
			await rbacChecker(ctxt);

			hasHistoricalDashboardReadPermissions = true;
		}
		catch(err) {
			hasHistoricalDashboardReadPermissions = false;
		}

		try {
			let historicalDashboardData = null;

			if(hasHistoricalDashboardReadPermissions) { // eslint-disable-line curly
				historicalDashboardData = await this.$TenantHistoricalDashboardModel
				.query(function(qb) {
					qb.where({ 'tenant_id': ctxt.state.tenant.tenant_id });
				})
				.fetchAll({
					'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'attributeSets', 'constituents', 'processors', 'requestFormatters', 'executors', 'responseFormatters', 'inputTemplates', 'resultTemplates', 'watchers', 'dataPointAggregations']
				});
			}
			else { // eslint-disable-line curly
				historicalDashboardData = await this.$TenantHistoricalDashboardModel
				.query(function(qb) {
					qb
					.whereRaw(`id IN (SELECT tenant_historical_dashboard_id FROM tenant_historical_dashboards_users WHERE tenant_user_id IN (SELECT id FROM tenants_users WHERE user_id = ?))`, [ctxt.state.user.user_id])
					.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id })
					.orderBy('name');
				})
				.fetchAll({
					'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'attributeSets', 'constituents', 'processors', 'requestFormatters', 'executors', 'responseFormatters', 'inputTemplates', 'resultTemplates', 'watchers', 'dataPointAggregations']
				});
			}

			historicalDashboardData = this._convertToJsonApiFormat(historicalDashboardData, 'historical-dashboard/historical-dashboard', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'historical-dashboard/folder',
				'attributeSets': 'historical-dashboard/historical-dashboard-attribute-set',
				'constituents': 'historical-dashboard/historical-dashboard-constituent',
				'processors': 'historical-dashboard/historical-dashboard-processor',
				'requestFormatters': 'historical-dashboard/historical-dashboard-request-formatter',
				'executors': 'historical-dashboard/historical-dashboard-executor',
				'responseFormatters': 'historical-dashboard/historical-dashboard-response-formatter',
				'inputTemplates': 'historical-dashboard/historical-dashboard-input-template',
				'resultTemplates': 'historical-dashboard/historical-dashboard-result-template',
				'watchers': 'historical-dashboard/historical-dashboard-watcher',
				'dataPointAggregations': 'historical-dashboard/historical-dashboard-aggregate'
			});

			return historicalDashboardData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllTenantHistoricalDashboards`, err);
		}
	}

	async _addTenantHistoricalDashboard(ctxt) {
		try {
			const pubsubService = this.$dependencies.PubsubService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const savedRecord = await this.$TenantHistoricalDashboardModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const schemaChangePayload = JSON.stringify({
				'id': savedRecord.get('id'),
				'sub_domain': ctxt.state.tenant['sub_domain'],
				'tenant_id': ctxt.state.tenant['tenant_id'],
				'type': 'hdash'
			});

			await pubsubService.publish('plantworks-data-stream', 'SCHEMA.UPDATE', schemaChangePayload);
			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantHistoricalDashboard`, err);
		}
	}

	async _updateTenantHistoricalDashboard(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedHistoricalDashboardArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['id'], 'hdash']);

			const savedRecord = await this.$TenantHistoricalDashboardModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [savedRecord.get('id'), 'hdash', ctxt.state.tenant['tenant_id']]);

			cachedHistoricalDashboardArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantHistoricalDashboard`, err);
		}
	}

	async _deleteTenantHistoricalDashboard(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const dbSrvc = this.$dependencies.DatabaseService;

			const tenantHistoricalDashboard = await this.$TenantHistoricalDashboardModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.historical_dashboard_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantHistoricalDashboard) throw new Error('Unknown Tenant HistoricalDashboard');

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedHistoricalDashboardArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [ctxt.params['historical_dashboard_id'], 'hdash']);
			let cachedArtifacts = cachedHistoricalDashboardArtifacts.shift();

			const historicalDashboardConstituents = await dbSrvc.knex.raw(`SELECT tenant_historical_dashboard_constituent_id AS id, tenant_historical_dashboard_constituent_type As type FROM tenant_historical_dashboard_constituents WHERE tenant_historical_dashboard_id = ?`, [ctxt.params.historical_dashboard_id]);

			await tenantHistoricalDashboard.destroy();

			for(let idx = 0; idx < historicalDashboardConstituents.rows.length; idx++) {
				const constituent = historicalDashboardConstituents.rows[idx];
				const constituentArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [constituent.id, constituent.type]);
				cachedArtifacts = cachedArtifacts.concat(constituentArtifacts.shift());
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [constituent.id, constituent.type, ctxt.state.tenant['tenant_id']]);
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantHistoricalDashboard`, err);
		}
	}

	async _getTenantHistoricalDashboardAttributeSet(ctxt) {
		try {
			let historicalDashboardAttributeSetData = await this.$HistoricalDashboardAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.historical_dashboard_attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantAttributeSet', 'tenantHistoricalDashboard']
			});

			historicalDashboardAttributeSetData = this._convertToJsonApiFormat(historicalDashboardAttributeSetData, 'historical-dashboard/historical-dashboard-attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'tenantAttributeSet': 'historical-dashboard/attribute-set',
				'tenantHistoricalDashboard': 'historical-dashboard/historical-dashboard'
			});

			return historicalDashboardAttributeSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantHistoricalDashboardAttributeSet`, err);
		}
	}

	async _addTenantHistoricalDashboardAttributeSet(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedHistoricalDashboardArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_historical_dashboard_id'], 'hdash']);

			const savedRecord = await this.$HistoricalDashboardAttributeSetModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			cachedHistoricalDashboardArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_historical_dashboard_id'], 'hdash', jsonDeserializedData['tenant_id']]);

			await cacheMulti.execAsync();

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantHistoricalDashboardAttributeSet`, err);
		}
	}

	async _updateTenantHistoricalDashboardAttributeSet(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedHistoricalDashboardArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_historical_dashboard_id'], 'hdash']);

			const savedRecord = await this.$HistoricalDashboardAttributeSetModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			cachedHistoricalDashboardArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_historical_dashboard_id'], 'hdash', jsonDeserializedData['tenant_id']]);

			await cacheMulti.execAsync();

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantHistoricalDashboardAttributeSet`, err);
		}
	}

	async _deleteTenantHistoricalDashboardAttributeSet(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;

			const historicalDashboardAttributeSet = await this.$HistoricalDashboardAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.historical_dashboard_attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!historicalDashboardAttributeSet) throw new Error('Unknown Tenant HistoricalDashboard Attribute Set');

			const historicalDashboardId = historicalDashboardAttributeSet.get('tenant_historical_dashboard_id');

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedHistoricalDashboardArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [historicalDashboardId, 'hdash']);

			await historicalDashboardAttributeSet.destroy();

			cachedHistoricalDashboardArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [historicalDashboardId, 'hdash', ctxt.state.tenant['tenant_id']]);

			await cacheMulti.execAsync();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantHistoricalDashboardAttributeSet`, err);
		}
	}

	async _getTenantHistoricalDashboardConstituent(ctxt) {
		try {
			let historicalDashboardConstituentData = await this.$HistoricalDashboardConstituentModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.historical_dashboard_constituent_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantHistoricalDashboard']
			});

			historicalDashboardConstituentData = this._convertToJsonApiFormat(historicalDashboardConstituentData, 'historical-dashboard/historical-dashboard-constituent', {
				'tenant': 'settings/account/basics/tenant',
				'tenantHistoricalDashboard': 'historical-dashboard/historical-dashboard'
			});

			return historicalDashboardConstituentData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantHistoricalDashboardConstituent`, err);
		}
	}

	async _addTenantHistoricalDashboardConstituent(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$HistoricalDashboardConstituentModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const cachedHistoricalDashboardArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_historical_dashboard_id'], 'hdash']);
			let cachedArtifacts = cachedHistoricalDashboardArtifacts.shift();

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_historical_dashboard_id'], 'hdash', jsonDeserializedData['tenant_id']]);

			const cachedHistoricalDashboardConstituentArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_historical_dashboard_constituent_id'], jsonDeserializedData['tenant_historical_dashboard_constituent_type']]);
			cachedArtifacts = cachedArtifacts.concat(cachedHistoricalDashboardConstituentArtifacts.shift());

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_historical_dashboard_constituent_id'], jsonDeserializedData['tenant_historical_dashboard_constituent_type'], jsonDeserializedData['tenant_id']]);

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantHistoricalDashboardConstituent`, err);
		}
	}

	async _deleteTenantHistoricalDashboardConstituent(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const historicalDashboardConstituent = await this.$HistoricalDashboardConstituentModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.historical_dashboard_constituent_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!historicalDashboardConstituent) throw new Error('Unknown HistoricalDashboard constituent mapping');

			const historicalDashboardArtifactId = historicalDashboardConstituent.get('tenant_historical_dashboard_constituent_id');
			const historicalDashboardArtifactType = historicalDashboardConstituent.get('tenant_historical_dashboard_constituent_type');
			const historicalDashboardId = historicalDashboardConstituent.get('tenant_historical_dashboard_id');

			await historicalDashboardConstituent.destroy();

			const cachedHistoricalDashboardArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [historicalDashboardId, 'hdash']);
			let cachedArtifacts = cachedHistoricalDashboardArtifacts.shift();

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [historicalDashboardId, 'hdash', ctxt.state.tenant.tenant_id]);

			const cachedHistoricalDashboardConstituentArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [historicalDashboardArtifactId, historicalDashboardArtifactType]);
			cachedArtifacts = cachedArtifacts.concat(cachedHistoricalDashboardConstituentArtifacts.shift());

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [historicalDashboardArtifactId, historicalDashboardArtifactType, ctxt.state.tenant.tenant_id]);

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantHistoricalDashboardConstituent`, err);
		}
	}

	async _getTenantHistoricalDashboardProcessor(ctxt) {
		try {
			let historicalDashboardProcessorData = await this.$HistoricalDashboardProcessorModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.historical_dashboard_processor_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantHistoricalDashboard']
			});

			historicalDashboardProcessorData = this._convertToJsonApiFormat(historicalDashboardProcessorData, 'historical-dashboard/historical-dashboard-processor', {
				'tenant': 'settings/account/basics/tenant',
				'tenantHistoricalDashboard': 'historical-dashboard/historical-dashboard'
			});

			return historicalDashboardProcessorData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantHistoricalDashboardProcessor`, err);
		}
	}

	async _addTenantHistoricalDashboardProcessor(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(!jsonDeserializedData['processor']) jsonDeserializedData['processor'] = '';

			const savedRecord = await this.$HistoricalDashboardProcessorModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantHistoricalDashboardProcessor`, err);
		}
	}

	async _updateTenantHistoricalDashboardProcessor(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;

			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$HistoricalDashboardProcessorModel
			.query(function(qb) {
				qb.where({'id': jsonDeserializedData.id});
			}).fetch();

			const oldPublishStatus = oldRecord['attributes']['publish_status'];

			// eslint-disable-next-line curly
			if(oldPublishStatus && !newPublishStatus) {
				throw new Error('Published Processor Record cannot be unpublished');
			}

			// 1. update effectivity stop of the current effective processor
			// 2. set effectivity start of the newly published processor

			// if a previously unpublished processor is being published:
			let updateEffectivity;

			if(!oldPublishStatus && newPublishStatus) {
				const now = moment();
				updateEffectivity = await dbSrvc.knex.raw('UPDATE tenant_historical_dashboard_processors SET effectivity_end = ? WHERE tenant_id = ? AND tenant_historical_dashboard_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL AND publish_status = ? RETURNING id,publish_status', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_historical_dashboard_id, true]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$HistoricalDashboardProcessorModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			// 3. Update Rendered Processor
			const evaluatorFactory = require('evaluator-factory');

			// 4. On Publishing a New processor, generate and store rendered processor and delete cached artifacts
			if(!oldPublishStatus && newPublishStatus) {
				try{
					const renderedEvaluator = await evaluatorFactory.renderEvaluatorString({
						'id': savedRecord.get('tenant_historical_dashboard_id'),
						'type': 'hdash',
						'database': dbSrvc
					});

					await dbSrvc.knex.raw(`UPDATE tenant_historical_dashboard_processors SET processor = ? WHERE id = ?`, [renderedEvaluator, savedRecord.get('id')]);
				}
				catch(err){

					jsonDeserializedData['publish_status'] = false;
					await this.$HistoricalDashboardProcessorModel
					.forge()
					.save(jsonDeserializedData, {
						'method': 'update',
						'patch': true
					});

					await dbSrvc.knex.raw('UPDATE tenant_historical_dashboard_processors SET effectivity_end = null WHERE id = ?', [updateEffectivity.rows[0]['id']]);

					throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantHistoricalDashboardProcessor`, err);
				}

				const cachedHistoricalDashboardArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [savedRecord.get('tenant_historical_dashboard_id'), 'hdash']);

				cachedHistoricalDashboardArtifacts.shift().forEach((cachedArtifact) => {
					cacheMulti.delAsync(cachedArtifact);
				});

				await cacheMulti.execAsync();
			}

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantHistoricalDashboardProcessor`, err);
		}
	}

	async _getTenantHistoricalDashboardRequestFormatter(ctxt) {
		try {
			let historicalDashboardRequestFormatterData = await this.$HistoricalDashboardRequestFormatterModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.historical_dashboard_request_formatter_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantHistoricalDashboard']
			});

			historicalDashboardRequestFormatterData = this._convertToJsonApiFormat(historicalDashboardRequestFormatterData, 'historical-dashboard/historical-dashboard-request-formatter', {
				'tenant': 'settings/account/basics/tenant',
				'tenantHistoricalDashboard': 'historical-dashboard/historical-dashboard'
			});

			return historicalDashboardRequestFormatterData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantHistoricalDashboardRequestFormatter`, err);
		}
	}

	async _addTenantHistoricalDashboardRequestFormatter(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$HistoricalDashboardRequestFormatterModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantHistoricalDashboardRequestFormatter`, err);
		}
	}

	async _updateTenantHistoricalDashboardRequestFormatter(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$HistoricalDashboardRequestFormatterModel
			.query(function(qb) {
				qb.where({'id': jsonDeserializedData.id});
			}).fetch();

			const oldPublishStatus = oldRecord['attributes']['publish_status'];

			// eslint-disable-next-line curly
			if(oldPublishStatus && !newPublishStatus) {
				throw new Error('Published Request Formatter Record cannot be unpublished');
			}

			// if a previously unpublished request formatter is being published:
			// 1. update effectivity stop of the current effective formatter
			// 2. set effectivity start of the newly published formatter

			if(!oldPublishStatus && newPublishStatus) {
				const now = moment();
				await dbSrvc.knex.raw('UPDATE tenant_historical_dashboard_request_formatters SET effectivity_end = ? WHERE tenant_id = ? AND tenant_historical_dashboard_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_historical_dashboard_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$HistoricalDashboardRequestFormatterModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantHistoricalDashboardRequestFormatter`, err);
		}
	}

	async _getTenantHistoricalDashboardExecutor(ctxt) {
		try {
			let historicalDashboardExecutorData = await this.$HistoricalDashboardExecutorModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.historical_dashboard_executor_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantHistoricalDashboard']
			});

			historicalDashboardExecutorData = this._convertToJsonApiFormat(historicalDashboardExecutorData, 'historical-dashboard/historical-dashboard-executor', {
				'tenant': 'settings/account/basics/tenant',
				'tenantHistoricalDashboard': 'historical-dashboard/historical-dashboard'
			});

			return historicalDashboardExecutorData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantHistoricalDashboardExecutor`, err);
		}
	}

	async _addTenantHistoricalDashboardExecutor(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$HistoricalDashboardExecutorModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantHistoricalDashboardExecutor`, err);
		}
	}

	async _updateTenantHistoricalDashboardExecutor(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$HistoricalDashboardExecutorModel
			.query(function(qb) {
				qb.where({'id': jsonDeserializedData.id});
			}).fetch();

			const oldPublishStatus = oldRecord['attributes']['publish_status'];

			// eslint-disable-next-line curly
			if(oldPublishStatus && !newPublishStatus) {
				throw new Error('Published Executor Record cannot be unpublished');
			}

			// if a previously unpublished request formatter is being published:
			// 1. update effectivity stop of the current effective formatter
			// 2. set effectivity start of the newly published formatter

			if(!oldPublishStatus && newPublishStatus) {
				const now = moment();
				await dbSrvc.knex.raw('UPDATE tenant_historical_dashboard_executors SET effectivity_end = ? WHERE tenant_id = ? AND tenant_historical_dashboard_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_historical_dashboard_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$HistoricalDashboardExecutorModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantHistoricalDashboardExecutor`, err);
		}
	}

	async _getTenantHistoricalDashboardResponseFormatter(ctxt) {
		try {
			let historicalDashboardResponseFormatterData = await this.$HistoricalDashboardResponseFormatterModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.historical_dashboard_response_formatter_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantHistoricalDashboard']
			});

			historicalDashboardResponseFormatterData = this._convertToJsonApiFormat(historicalDashboardResponseFormatterData, 'historical-dashboard/historical-dashboard-response-formatter', {
				'tenant': 'settings/account/basics/tenant',
				'tenantHistoricalDashboard': 'historical-dashboard/historical-dashboard'
			});

			return historicalDashboardResponseFormatterData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantHistoricalDashboardResponseFormatter`, err);
		}
	}

	async _addTenantHistoricalDashboardResponseFormatter(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$HistoricalDashboardResponseFormatterModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantHistoricalDashboardResponseFormatter`, err);
		}
	}

	async _updateTenantHistoricalDashboardResponseFormatter(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$HistoricalDashboardResponseFormatterModel
			.query(function(qb) {
				qb.where({'id': jsonDeserializedData.id});
			}).fetch();

			const oldPublishStatus = oldRecord['attributes']['publish_status'];

			// eslint-disable-next-line curly
			if(oldPublishStatus && !newPublishStatus) {
				throw new Error('Published Response Formatter Record cannot be unpublished');
			}

			// if a previously unpublished response formatter is being published:
			// 1. update effectivity stop of the current effective formatter
			// 2. set effectivity start of the newly published formatter

			if(!oldPublishStatus && newPublishStatus) {
				const now = moment();
				await dbSrvc.knex.raw('UPDATE tenant_historical_dashboard_response_formatters SET effectivity_end = ? WHERE tenant_id = ? AND tenant_historical_dashboard_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_historical_dashboard_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$HistoricalDashboardResponseFormatterModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantHistoricalDashboardResponseFormatter`, err);
		}
	}

	async _getTenantHistoricalDashboardInputTemplate(ctxt) {
		try {
			let historicalDashboardTemplateData = await this.$HistoricalDashboardInputTemplateModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.historical_dashboard_input_template_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantHistoricalDashboard']
			});

			historicalDashboardTemplateData = this._convertToJsonApiFormat(historicalDashboardTemplateData, 'historical-dashboard/historical-dashboard-input-template', {
				'tenant': 'settings/account/basics/tenant',
				'tenantHistoricalDashboard': 'historical-dashboard/historical-dashboard'
			});

			return historicalDashboardTemplateData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantHistoricalDashboardInputTemplate`, err);
		}
	}

	async _addTenantHistoricalDashboardInputTemplate(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$HistoricalDashboardInputTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantHistoricalDashboardInputTemplate`, err);
		}
	}

	async _updateTenantHistoricalDashboardInputTemplate(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$HistoricalDashboardInputTemplateModel
			.query(function(qb) {
				qb.where({'id': jsonDeserializedData.id});
			}).fetch();

			const oldPublishStatus = oldRecord['attributes']['publish_status'];

			// eslint-disable-next-line curly
			if(oldPublishStatus && !newPublishStatus) {
				throw new Error('Published Input Template Record cannot be unpublished');
			}

			// if a previously unpublished template is being published:
			// 1. update effectivity stop of the current effective template
			// 2. set effectivity start of the newly published template

			if(!oldPublishStatus && newPublishStatus) {
				const now = moment();
				await dbSrvc.knex.raw('UPDATE tenant_historical_dashboard_input_templates SET effectivity_end = ? WHERE tenant_id = ? AND tenant_historical_dashboard_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_historical_dashboard_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$HistoricalDashboardInputTemplateModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantHistoricalDashboardInputTemplate`, err);
		}
	}

	async _getTenantHistoricalDashboardResultTemplate(ctxt) {
		try {
			let historicalDashboardTemplateData = await this.$HistoricalDashboardResultTemplateModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.historical_dashboard_result_template_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantHistoricalDashboard']
			});

			historicalDashboardTemplateData = this._convertToJsonApiFormat(historicalDashboardTemplateData, 'historical-dashboard/historical-dashboard-result-template', {
				'tenant': 'settings/account/basics/tenant',
				'tenantHistoricalDashboard': 'historical-dashboard/historical-dashboard'
			});

			return historicalDashboardTemplateData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantHistoricalDashboardResultTemplate`, err);
		}
	}

	async _addTenantHistoricalDashboardResultTemplate(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$HistoricalDashboardResultTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantHistoricalDashboardResultTemplate`, err);
		}
	}

	async _updateTenantHistoricalDashboardResultTemplate(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$HistoricalDashboardResultTemplateModel
			.query(function(qb) {
				qb.where({'id': jsonDeserializedData.id});
			}).fetch();

			const oldPublishStatus = oldRecord['attributes']['publish_status'];

			// eslint-disable-next-line curly
			if(oldPublishStatus && !newPublishStatus) {
				throw new Error('Published Template Record cannot be unpublished');
			}

			// if a previously unpublished template is being published:
			// 1. update effectivity stop of the current effective template
			// 2. set effectivity start of the newly published template

			if(!oldPublishStatus && newPublishStatus) {
				const now = moment();
				await dbSrvc.knex.raw('UPDATE tenant_historical_dashboard_result_templates SET effectivity_end = ? WHERE tenant_id = ? AND tenant_historical_dashboard_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_historical_dashboard_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$HistoricalDashboardResultTemplateModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantHistoricalDashboardResultTemplate`, err);
		}
	}

	async _getTenantHistoricalDashboardWatcher(ctxt) {
		try {
			let historicalDashboardWatcherData = await this.$HistoricalDashboardWatcherModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.historical_dashboard_watcher_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantHistoricalDashboard', 'tenantUser']
			});

			historicalDashboardWatcherData = this._convertToJsonApiFormat(historicalDashboardWatcherData, 'historical-dashboard/historical-dashboard-watcher', {
				'tenant': 'settings/account/basics/tenant',
				'tenantHistoricalDashboard': 'historical-dashboard/historical-dashboard',
				'tenantUser': 'pug/user-manager/tenant-user'
			});

			return historicalDashboardWatcherData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantHistoricalDashboardWatcher`, err);
		}
	}

	async _addTenantHistoricalDashboardWatcher(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$HistoricalDashboardWatcherModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantHistoricalDashboardWatcher`, err);
		}
	}

	async _deleteTenantHistoricalDashboardWatcher(ctxt) {
		try {
			const historicalDashboardWatcher = await this.$HistoricalDashboardWatcherModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.historical_dashboard_watcher_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!historicalDashboardWatcher) throw new Error('Unknown HistoricalDashboard User mapping');

			await historicalDashboardWatcher.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantHistoricalDashboardWatcher`, err);
		}
	}

	async _getPossibleTenantUsersList(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const possibleTenantUsers = await dbSrvc.knex.raw(`SELECT A.id, B.first_name AS "firstName", B.middle_names AS "middleNames", B.last_name AS "lastName", B.email FROM tenants_users A INNER JOIN users B ON (A.user_id = B.id) WHERE A.tenant_id = ? AND A.access_status = 'authorized' AND A.id NOT IN (SELECT tenant_user_id FROM tenant_historical_dashboards_users WHERE tenant_historical_dashboard_id = ?)`, [ctxt.state.tenant.tenant_id, ctxt.query.historicalDashboard]);
			return possibleTenantUsers.rows;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getPossibleTenantUsersList`, err);
		}
	}

	async _getTenantHistoricalDashboardAggregate(ctxt) {
		try {
			let historicalDashboardAggregateData = await this.$HistoricalDashboardAggregateModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.historical_dashboard_aggregate_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantHistoricalDashboard', 'evaluationExpression']
			});

			historicalDashboardAggregateData = this._convertToJsonApiFormat(historicalDashboardAggregateData, 'historical-dashboard/historical-dashboard-aggregate', {
				'tenant': 'settings/account/basics/tenant',
				'tenantHistoricalDashboard': 'historical-dashboard/historical-dashboard',
				'evaluationExpression': 'historical-dashboard/attribute-set-property'
			});

			return historicalDashboardAggregateData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantHistoricalDashboardAggregate`, err);
		}
	}

	async _addTenantHistoricalDashboardAggregate(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');
			if(jsonDeserializedData.internal_tag !== undefined && jsonDeserializedData.internal_tag !== null && jsonDeserializedData.internal_tag.trim() === '') throw new Error('Tag cannot be empty');
			if(!jsonDeserializedData.evaluation_expression_id) throw new Error('Expression cannot be empty');

			jsonDeserializedData['evaluation_expression'] = jsonDeserializedData.evaluation_expression_id;
			delete jsonDeserializedData.evaluation_expression_id;

			const savedRecord = await this.$HistoricalDashboardAggregateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantHistoricalDashboardAggregate`, err);
		}
	}

	async _updateTenantHistoricalDashboardAggregate(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');
			if(jsonDeserializedData.internal_tag !== undefined && jsonDeserializedData.internal_tag !== null && jsonDeserializedData.internal_tag.trim() === '') throw new Error('Tag cannot be empty');
			if(!jsonDeserializedData.evaluation_expression_id) throw new Error('Expression cannot be empty');

			jsonDeserializedData['evaluation_expression'] = jsonDeserializedData.evaluation_expression_id;
			delete jsonDeserializedData.evaluation_expression_id;

			const savedRecord = await this.$HistoricalDashboardAggregateModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantHistoricalDashboardAggregate`, err);
		}
	}

	async _deleteTenantHistoricalDashboardAggregate(ctxt) {
		try {

			const historicalDashboardAggregate = await this.$HistoricalDashboardAggregateModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.historical_dashboard_aggregate_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!historicalDashboardAggregate) throw new Error('Unknown Tenant HistoricalDashboard Aggregate');


			await historicalDashboardAggregate.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantHistoricalDashboardAggregate`, err);
		}
	}

	async _getTenantHistoricalDashboardSubcomponent(ctxt) {
		try {
			let historicalDashboardSubcomponentData = await this.$HistoricalDashboardSubcomponentModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.historical_dashboard_subcomponent_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantHistoricalDashboard']
			});

			historicalDashboardSubcomponentData = this._convertToJsonApiFormat(historicalDashboardSubcomponentData, 'historical-dashboard/historical-dashboard-subcomponent', {
				'tenant': 'settings/account/basics/tenant',
				'tenantHistoricalDashboard': 'historical-dashboard/historical-dashboard'
			});

			return historicalDashboardSubcomponentData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantHistoricalDashboardSubcomponent`, err);
		}
	}

	async _addTenantHistoricalDashboardSubcomponent(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$HistoricalDashboardSubcomponentModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantHistoricalDashboardSubcomponent`, err);
		}
	}

	async _updateTenantHistoricalDashboardSubcomponent(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$HistoricalDashboardSubcomponentModel
			.query(function(qb) {
				qb.where({'id': jsonDeserializedData.id});
			}).fetch();

			const oldPublishStatus = oldRecord['attributes']['publish_status'];

			// eslint-disable-next-line curly
			if(oldPublishStatus && !newPublishStatus) {
				throw new Error('Published Subcomponent Record cannot be unpublished');
			}

			// if a previously unpublished Subcomponent is being published:
			// 1. update effectivity stop of the current effective Subcomponent
			// 2. set effectivity start of the newly published Subcomponent

			if(!oldPublishStatus && newPublishStatus) {
				const now = moment();
				await dbSrvc.knex.raw('UPDATE tenant_historical_dashboard_subcomponents SET effectivity_end = ? WHERE tenant_id = ? AND tenant_historical_dashboard_id = ? AND component_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_historical_dashboard_id, jsonDeserializedData.component_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$HistoricalDashboardSubcomponentModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantHistoricalDashboardSubcomponent`, err);
		}
	}

	async _deleteTenantHistoricalDashboardSubcomponent(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const tenantHistoricalDashboardSubcomponent = await this.$HistoricalDashboardSubcomponentModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.historical_dashboard_subcomponent_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantHistoricalDashboardSubcomponent) throw new Error('Unknown Tenant Historical Dashboard Subcomponent');

			const tenantHistoricalDashboardSubcomponentComponentId = tenantHistoricalDashboardSubcomponent['attributes']['component_id'];

			await tenantHistoricalDashboardSubcomponent.destroy();
			await dbSrvc.knex.raw('DELETE FROM tenant_historical_dashboard_subcomponents WHERE component_id = ?', [tenantHistoricalDashboardSubcomponentComponentId]);

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantHistoricalDashboardSubcomponent`, err);
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
		return ['PubsubService'].concat(super.dependencies);
	}
	// #endregion
}

exports.middleware = Main;
