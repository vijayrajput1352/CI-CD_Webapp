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
 * @classdesc The Plant.Works Web Application Boards Main middleware - manages CRUD for boards/panels.
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

					'panels': function() {
						return this.hasMany(self.$TenantPanelModel, 'tenant_folder_id');
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
						return this.hasMany(self.$TenantPanelAggregateModel, 'attribute_set_property_id');
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

			Object.defineProperty(this, '$TenantPanelModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_panels',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'folder': function() {
						return this.belongsTo(self.$TenantFolderModel, 'tenant_folder_id');
					},

					'templates': function() {
						return this.hasMany(self.$PanelTemplateModel, 'tenant_panel_id');
					},

					'subcomponents': function() {
						return this.hasMany(self.$PanelSubcomponentModel, 'tenant_panel_id');
					},

					'processors': function() {
						return this.hasMany(self.$PanelProcessorModel, 'tenant_panel_id');
					},

					'requestFormatters': function() {
						return this.hasMany(self.$PanelRequestFormatterModel, 'tenant_panel_id');
					},

					'executors': function() {
						return this.hasMany(self.$PanelExecutorModel, 'tenant_panel_id');
					},

					'responseFormatters': function() {
						return this.hasMany(self.$PanelResponseFormatterModel, 'tenant_panel_id');
					},

					'attributeSets': function() {
						return this.hasMany(self.$PanelAttributeSetModel, 'tenant_panel_id');
					},

					'constituents': function() {
						return this.hasMany(self.$PanelConstituentModel, 'tenant_panel_id');
					},

					'watchers': function() {
						return this.hasMany(self.$PanelWatcherModel, 'tenant_panel_id');
					},

					'dataPointAggregations': function() {
						return this.hasMany(self.$PanelAggregateModel, 'tenant_panel_id');
					}
				}, {
					'jsonColumns': ['attribute_set_metadata']
				})
			});

			Object.defineProperty(this, '$PanelAttributeSetModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_panels_attribute_sets',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantAttributeSet': function() {
						return this.belongsTo(self.$TenantAttributeSetModel, 'tenant_attribute_set_id');
					},

					'tenantPanel': function() {
						return this.belongsTo(self.$TenantPanelModel, 'tenant_panel_id');
					}
				})
			});

			Object.defineProperty(this, '$PanelTemplateModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_panel_templates',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPanel': function() {
						return this.belongsTo(self.$TenantPanelModel, 'tenant_panel_id');
					}
				}, {
					'jsonColumns': ['component_observers', 'component_tasks']
				})
			});

			Object.defineProperty(this, '$PanelSubcomponentModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_panel_subcomponents',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPanel': function() {
						return this.belongsTo(self.$TenantPanelModel, 'tenant_panel_id');
					}
				}, {
					'jsonColumns': ['component_observers', 'component_tasks']
				})
			});

			Object.defineProperty(this, '$PanelProcessorModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_panel_processors',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPanel': function() {
						return this.belongsTo(self.$TenantPanelModel, 'tenant_panel_id');
					}
				})
			});

			Object.defineProperty(this, '$PanelRequestFormatterModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_panel_request_formatters',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPanel': function() {
						return this.belongsTo(self.$TenantPanelModel, 'tenant_panel_id');
					}
				})
			});

			Object.defineProperty(this, '$PanelExecutorModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_panel_executors',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPanel': function() {
						return this.belongsTo(self.$TenantPanelModel, 'tenant_panel_id');
					}
				})
			});

			Object.defineProperty(this, '$PanelResponseFormatterModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_panel_response_formatters',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPanel': function() {
						return this.belongsTo(self.$TenantPanelModel, 'tenant_panel_id');
					}
				})
			});

			Object.defineProperty(this, '$PanelConstituentModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_panel_constituents',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPanel': function() {
						return this.belongsTo(self.$TenantPanelModel, 'tenant_panel_id');
					}
				})
			});

			Object.defineProperty(this, '$PanelWatcherModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_panels_users',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPanel': function() {
						return this.belongsTo(self.$TenantPanelModel, 'tenant_panel_id');
					},

					'tenantUser': function() {
						return this.belongsTo(self.$TenantUserModel, 'tenant_user_id');
					}
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

			Object.defineProperty(this, '$PanelAggregateModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_panel_aggregates',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPanel': function() {
						return this.belongsTo(self.$TenantPanelModel, 'tenant_panel_id');
					},

					'evaluationExpression': function() {
						return this.belongsTo(self.$TenantAttributeSetPropertyModel, 'evaluation_expression');
					}
				}, {
					'jsonColumns': ['config', 'filters']
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
		delete this.$PanelAggregateModel;
		delete this.$TenantUserModel;
		delete this.$PanelWatcherModel;
		delete this.$PanelConstituentModel;
		delete this.$PanelResponseFormatterModel;
		delete this.$PanelExecutorModel;
		delete this.$PanelRequestFormatterModel;
		delete this.$PanelProcessorModel;

		delete this.$PanelSubcomponentModel;
		delete this.$PanelTemplateModel;
		delete this.$PanelAttributeSetModel;
		delete this.$TenantPanelModel;

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

			await ApiService.add(`${this.name}::getTenantPanel`, this._getTenantPanel.bind(this));
			await ApiService.add(`${this.name}::getAllTenantPanels`, this._getAllTenantPanels.bind(this));
			await ApiService.add(`${this.name}::addTenantPanel`, this._addTenantPanel.bind(this));
			await ApiService.add(`${this.name}::updateTenantPanel`, this._updateTenantPanel.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPanel`, this._deleteTenantPanel.bind(this));

			await ApiService.add(`${this.name}::getTenantPanelTemplate`, this._getTenantPanelTemplate.bind(this));
			await ApiService.add(`${this.name}::addTenantPanelTemplate`, this._addTenantPanelTemplate.bind(this));
			await ApiService.add(`${this.name}::updateTenantPanelTemplate`, this._updateTenantPanelTemplate.bind(this));

			await ApiService.add(`${this.name}::getTenantPanelSubcomponent`, this._getTenantPanelSubcomponent.bind(this));
			await ApiService.add(`${this.name}::addTenantPanelSubcomponent`, this._addTenantPanelSubcomponent.bind(this));
			await ApiService.add(`${this.name}::updateTenantPanelSubcomponent`, this._updateTenantPanelSubcomponent.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPanelSubcomponent`, this._deleteTenantPanelSubcomponent.bind(this));

			await ApiService.add(`${this.name}::getTenantPanelProcessor`, this._getTenantPanelProcessor.bind(this));
			await ApiService.add(`${this.name}::addTenantPanelProcessor`, this._addTenantPanelProcessor.bind(this));
			await ApiService.add(`${this.name}::updateTenantPanelProcessor`, this._updateTenantPanelProcessor.bind(this));

			await ApiService.add(`${this.name}::getTenantPanelRequestFormatter`, this._getTenantPanelRequestFormatter.bind(this));
			await ApiService.add(`${this.name}::addTenantPanelRequestFormatter`, this._addTenantPanelRequestFormatter.bind(this));
			await ApiService.add(`${this.name}::updateTenantPanelRequestFormatter`, this._updateTenantPanelRequestFormatter.bind(this));

			await ApiService.add(`${this.name}::getTenantPanelExecutor`, this._getTenantPanelExecutor.bind(this));
			await ApiService.add(`${this.name}::addTenantPanelExecutor`, this._addTenantPanelExecutor.bind(this));
			await ApiService.add(`${this.name}::updateTenantPanelExecutor`, this._updateTenantPanelExecutor.bind(this));

			await ApiService.add(`${this.name}::getTenantPanelResponseFormatter`, this._getTenantPanelResponseFormatter.bind(this));
			await ApiService.add(`${this.name}::addTenantPanelResponseFormatter`, this._addTenantPanelResponseFormatter.bind(this));
			await ApiService.add(`${this.name}::updateTenantPanelResponseFormatter`, this._updateTenantPanelResponseFormatter.bind(this));

			await ApiService.add(`${this.name}::getTenantPanelAttributeSet`, this._getTenantPanelAttributeSet.bind(this));
			await ApiService.add(`${this.name}::addTenantPanelAttributeSet`, this._addTenantPanelAttributeSet.bind(this));
			await ApiService.add(`${this.name}::updateTenantPanelAttributeSet`, this._updateTenantPanelAttributeSet.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPanelAttributeSet`, this._deleteTenantPanelAttributeSet.bind(this));

			await ApiService.add(`${this.name}::getTenantPanelConstituent`, this._getTenantPanelConstituent.bind(this));
			await ApiService.add(`${this.name}::addTenantPanelConstituent`, this._addTenantPanelConstituent.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPanelConstituent`, this._deleteTenantPanelConstituent.bind(this));

			await ApiService.add(`${this.name}::getTenantPanelWatcher`, this._getTenantPanelWatcher.bind(this));
			await ApiService.add(`${this.name}::addTenantPanelWatcher`, this._addTenantPanelWatcher.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPanelWatcher`, this._deleteTenantPanelWatcher.bind(this));

			await ApiService.add(`${this.name}::possibleTenantUsersList`, this._getPossibleTenantUsersList.bind(this));

			await ApiService.add(`${this.name}::getTenantPanelAggregate`, this._getTenantPanelAggregate.bind(this));
			await ApiService.add(`${this.name}::addTenantPanelAggregate`, this._addTenantPanelAggregate.bind(this));
			await ApiService.add(`${this.name}::updateTenantPanelAggregate`, this._updateTenantPanelAggregate.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPanelAggregate`, this._deleteTenantPanelAggregate.bind(this));

			await ApiService.add(`${this.name}::historicalData`, this._getHistoricalData.bind(this));
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
			await ApiService.remove(`${this.name}::historicalData`, this._getHistoricalData.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPanelAggregate`, this._deleteTenantPanelAggregate.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPanelAggregate`, this._updateTenantPanelAggregate.bind(this));
			await ApiService.remove(`${this.name}::addTenantPanelAggregate`, this._addTenantPanelAggregate.bind(this));
			await ApiService.remove(`${this.name}::getTenantPanelAggregate`, this._getTenantPanelAggregate.bind(this));

			await ApiService.remove(`${this.name}::possibleTenantUsersList`, this._getPossibleTenantUsersList.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPanelWatcher`, this._deleteTenantPanelWatcher.bind(this));
			await ApiService.remove(`${this.name}::addTenantPanelWatcher`, this._addTenantPanelWatcher.bind(this));
			await ApiService.remove(`${this.name}::getTenantPanelWatcher`, this._getTenantPanelWatcher.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPanelConstituent`, this._deleteTenantPanelConstituent.bind(this));
			await ApiService.remove(`${this.name}::addTenantPanelConstituent`, this._addTenantPanelConstituent.bind(this));
			await ApiService.remove(`${this.name}::getTenantPanelConstituent`, this._getTenantPanelConstituent.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPanelAttributeSet`, this._deleteTenantPanelAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPanelAttributeSet`, this._updateTenantPanelAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::addTenantPanelAttributeSet`, this._addTenantPanelAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::getTenantPanelAttributeSet`, this._getTenantPanelAttributeSet.bind(this));

			await ApiService.remove(`${this.name}::updateTenantPanelResponseFormatter`, this._updateTenantPanelResponseFormatter.bind(this));
			await ApiService.remove(`${this.name}::addTenantPanelResponseFormatter`, this._addTenantPanelResponseFormatter.bind(this));
			await ApiService.remove(`${this.name}::getTenantPanelResponseFormatter`, this._getTenantPanelResponseFormatter.bind(this));

			await ApiService.remove(`${this.name}::updateTenantPanelExecutor`, this._updateTenantPanelExecutor.bind(this));
			await ApiService.remove(`${this.name}::addTenantPanelExecutor`, this._addTenantPanelExecutor.bind(this));
			await ApiService.remove(`${this.name}::getTenantPanelExecutor`, this._getTenantPanelExecutor.bind(this));

			await ApiService.remove(`${this.name}::updateTenantPanelRequestFormatter`, this._updateTenantPanelRequestFormatter.bind(this));
			await ApiService.remove(`${this.name}::addTenantPanelRequestFormatter`, this._addTenantPanelRequestFormatter.bind(this));
			await ApiService.remove(`${this.name}::getTenantPanelRequestFormatter`, this._getTenantPanelRequestFormatter.bind(this));

			await ApiService.remove(`${this.name}::updateTenantPanelProcessor`, this._updateTenantPanelProcessor.bind(this));
			await ApiService.remove(`${this.name}::addTenantPanelProcessor`, this._addTenantPanelProcessor.bind(this));
			await ApiService.remove(`${this.name}::getTenantPanelProcessor`, this._getTenantPanelProcessor.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPanelSubcomponent`, this._deleteTenantPanelSubcomponent.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPanelSubcomponent`, this._updateTenantPanelSubcomponent.bind(this));
			await ApiService.remove(`${this.name}::addTenantPanelSubcomponent`, this._addTenantPanelSubcomponent.bind(this));
			await ApiService.remove(`${this.name}::getTenantPanelSubcomponent`, this._getTenantPanelSubcomponent.bind(this));

			await ApiService.remove(`${this.name}::updateTenantPanelTemplate`, this._updateTenantPanelTemplate.bind(this));
			await ApiService.remove(`${this.name}::addTenantPanelTemplate`, this._addTenantPanelTemplate.bind(this));
			await ApiService.remove(`${this.name}::getTenantPanelTemplate`, this._getTenantPanelTemplate.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPanel`, this._deleteTenantPanel.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPanel`, this._updateTenantPanel.bind(this));
			await ApiService.remove(`${this.name}::addTenantPanel`, this._addTenantPanel.bind(this));
			await ApiService.remove(`${this.name}::getAllTenantPanels`, this._getAllTenantPanels.bind(this));
			await ApiService.remove(`${this.name}::getTenantPanel`, this._getTenantPanel.bind(this));

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
							'configsRoute': 'configure.board',
							'dataUrl': '/board/config-tree-nodes',
							'intl': true,
							'type': folder.name === 'board_feature.folder_names.attribute_sets.name' ? 'attribute-folder' : 'panel-folder'
						}
					};
				});

				return tenantFolders;
			}

			if(['attribute-folder', 'panel-folder'].includes(ctxt.query.node_type)) {
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
							'configsRoute': 'configure.board',
							'dataUrl': '/board/config-tree-nodes',
							'intl': false,
							'type': ctxt.query.node_type
						}
					};
				});

				// Get the panels in this folder
				let tenantPanels = await dbSrvc.knex.raw(`SELECT id, tenant_folder_id AS parent_id, name FROM tenant_panels WHERE tenant_folder_id  = ?`, [ctxt.query.node_id]);
				tenantPanels = tenantPanels.rows.map((panel) => {
					return {
						'id': panel.id,
						'parent': panel.parent_id,
						'text': panel.name,
						'children': false,

						'li_attr': {
							'title': panel.name
						},

						'data': {
							'configsRoute': 'configure.board',
							'dataUrl': '/board/config-tree-nodes',
							'type': 'panel'
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
							'configsRoute': 'configure.board',
							'dataUrl': '/board/config-tree-nodes',
							'type': 'attribute-set'
						}
					};
				});

				return [...tenantFolders, ...tenantPanels, ...tenantAttributeSets];
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
							'devenvRoute': 'devenv.board',
							'dataUrl': '/board/devenv-tree-nodes',
							'intl': true,
							'type': folder.name === 'board_feature.folder_names.attribute_sets.name' ? 'attribute-folder' : 'panel-folder'
						}
					};
				});

				return tenantFolders;
			}

			if(['attribute-folder', 'panel-folder'].includes(ctxt.query.node_type)) {
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
							'devenvRoute': 'devenv.board',
							'dataUrl': '/board/devenv-tree-nodes',
							'intl': false,
							'type': ctxt.query.node_type
						}
					};
				});

				// Get the panels in this folder
				let tenantPanels = await dbSrvc.knex.raw(`SELECT id, tenant_folder_id AS parent_id, name FROM tenant_panels WHERE tenant_folder_id  = ?`, [ctxt.query.node_id]);
				tenantPanels = tenantPanels.rows.map((panel) => {
					return {
						'id': panel.id,
						'parent': panel.parent_id,
						'text': panel.name,
						'children': false,

						'li_attr': {
							'title': panel.name
						},

						'data': {
							'devenvRoute': 'devenv.board',
							'dataUrl': '/board/devenv-tree-nodes',
							'type': 'panel'
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
							'devenvRoute': 'devenv.board',
							'dataUrl': '/board/devenv-tree-nodes',
							'type': 'attribute-set'
						}
					};
				});

				return [...tenantFolders, ...tenantPanels, ...tenantAttributeSets];
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
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'parent', 'folders', 'panels', 'attributeSets']
			});

			folderData = this._convertToJsonApiFormat(folderData, 'board/folder', {
				'tenant': 'settings/account/basics/tenant',
				'parent': 'board/folder',
				'folders': 'board/folder',
				'panels': 'board/panel',
				'attributeSets': 'board/attribute-set'
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

			// determine if attrset folder or panel folder
			const attrSetsRootFolderName = 'board_feature.folder_names.attribute_sets.name';

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
				// update db and cached rendered processor of panel which using folder attr sets
				const folderAttrSets = await dbSrvc.knex.raw(`SELECT id FROM tenant_attribute_sets WHERE tenant_folder_id IN (${folderDescendants.rows.map(() => { return '?'; }).join(',')})`, folderDescendants.rows.map((f) => { return f['id']; }));
				const folderAttrSetsPanels = await dbSrvc.knex.raw(`SELECT tenant_panel_id AS id FROM tenant_panels_attribute_sets WHERE tenant_attribute_set_id IN (SELECT id FROM tenant_attribute_sets WHERE tenant_folder_id IN (${folderDescendants.rows.map(() => { return '?'; }).join(',')}))`, folderDescendants.rows.map((f) => { return f['id']; }));

				await tenantFolder.destroy();

				for(let idx = 0; idx < folderAttrSets.rows.length; idx++) {
					const folderAttrSet = folderAttrSets.rows[idx];
					const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderAttrSet.id, 'attrSet']);
					cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());
				}

				for(let idx = 0; idx < folderAttrSetsPanels.rows.length; idx++) {
					const folderAttrSetPanel = folderAttrSetsPanels.rows[idx];
					await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [folderAttrSetPanel.id, 'panel', ctxt.state.tenant['tenant_id']]);
					const panelArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderAttrSetPanel.id, 'panel']);
					cachedArtifacts = cachedArtifacts.concat(panelArtifacts.shift());
				}
			}
			else {
				// delete cached rendered processor of panels within folder panels
				// update rendered processor of deleted panel constituents except constituents which are deleted
				const folderPanels = await dbSrvc.knex.raw(`SELECT id FROM tenant_panels WHERE tenant_folder_id IN (${folderDescendants.rows.map(() => { return '?'; }).join(',')});`, folderDescendants.rows.map((f) => { return f['id']; }));
				const folderPanelConstituents = await dbSrvc.knex.raw(`SELECT id, type FROM tenant_panel_constituents WHERE tenant_panel_id IN (${folderPanels.rows.map(() => { return '?'; }).join(',')});`, folderPanels.rows.map((f) => { return f['id']; }));

				const folderPanelIdsSet = new Set(folderPanels.map((p) => { return p['id']; }));
				// remove panels which are in the current folder
				folderPanelConstituents.rows = folderPanelConstituents.rows.filter((panelConstituent) => {
					if(panelConstituent.type !== 'panel')
						return true;

					if(!folderPanelIdsSet.has(panelConstituent.id))
						return true;

					return false;
				});

				await tenantFolder.destroy();

				for(let idx = 0; idx < folderPanels.rows.length; idx++) {
					const folderPanel = folderPanels.rows[idx];
					const panelArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderPanel.id, 'panel']);
					cachedArtifacts = cachedArtifacts.concat(panelArtifacts.shift());
				}

				for(let idx = 0; idx < folderPanelConstituents.rows.length; idx++) {
					const folderPanelConstituent = folderPanelConstituents.rows[idx];
					const constituentArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderPanelConstituent.id, folderPanelConstituent.type]);
					cachedArtifacts = cachedArtifacts.concat(constituentArtifacts.shift());
					await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [folderPanelConstituent.id, folderPanelConstituent.type, ctxt.state.tenant['tenant_id']]);
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
			let parentFolderId = await dbSrvc.knex.raw(`SELECT id FROM tenant_folders WHERE tenant_id = ? AND name = 'board_feature.folder_names.attribute_sets.name'`, [ctxt.state.tenant.tenant_id]);
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

			attributeSetData = this._convertToJsonApiFormat(attributeSetData, 'board/attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'board/folder',
				'properties': 'board/attribute-set-property',
				'functions': 'board/attribute-set-function'
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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'board/attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'board/folder',
				'properties': 'board/attribute-set-property',
				'functions': 'board/attribute-set-function'
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

			let tenantModuleId = await dbSrvc.knex.raw(`SELECT id FROM tenants_modules WHERE tenant_id = ? AND module_id = (SELECT id FROM modules  WHERE name = ? AND type = ? )`, [ctxt.state.tenant.tenant_id, 'Board', 'feature']);
			if(!tenantModuleId.rows.length) throw new Error('Board feature not enabled for this tenant');
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
			const attrSetPanels = await dbSrvc.knex.raw(`SELECT tenant_panel_id AS id FROM tenant_panels_attribute_sets WHERE tenant_attribute_set_id = ?`, [ctxt.params['attribute_set_id']]);

			await tenantAttributeSet.destroy();

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [ctxt.params.attribute_set_id, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetPanels.rows.length; idx++) {
				const attrSetPanel = attrSetPanels.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetPanel.id, 'panel', ctxt.state.tenant['tenant_id']]);
				const panelArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetPanel.id, 'panel']);
				cachedArtifacts = cachedArtifacts.concat(panelArtifacts.shift());
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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'board/attribute-set-property', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'board/attribute-set'
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
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantAttributeSetPropertyModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const attrSetPanels = await dbSrvc.knex.raw(`SELECT tenant_panel_id AS id FROM tenant_panels_attribute_sets WHERE tenant_attribute_set_id = ?`, [jsonDeserializedData.attribute_set_id]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData.attribute_set_id, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetPanels.rows.length; idx++) {
				const attrSetPanel = attrSetPanels.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetPanel.id, 'panel', ctxt.state.tenant['tenant_id']]);
				const panelArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetPanel.id, 'panel']);
				cachedArtifacts = cachedArtifacts.concat(panelArtifacts.shift());
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
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantAttributeSetPropertyModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			const attrSetPanels = await dbSrvc.knex.raw(`SELECT tenant_panel_id AS id FROM tenant_panels_attribute_sets WHERE tenant_attribute_set_id = ?`, [jsonDeserializedData.attribute_set_id]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData.attribute_set_id, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetPanels.rows.length; idx++) {
				const attrSetPanel = attrSetPanels.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetPanel.id, 'panel', ctxt.state.tenant['tenant_id']]);
				const panelArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetPanel.id, 'panel']);
				cachedArtifacts = cachedArtifacts.concat(panelArtifacts.shift());
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
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

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

			const attrSetPanels = await dbSrvc.knex.raw(`SELECT tenant_panel_id AS id FROM tenant_panels_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetPanels.rows.length; idx++) {
				const attrSetPanel = attrSetPanels.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetPanel.id, 'panel', ctxt.state.tenant['tenant_id']]);
				const panelArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetPanel.id, 'panel']);
				cachedArtifacts = cachedArtifacts.concat(panelArtifacts.shift());
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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'board/attribute-set-function', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'board/attribute-set',
				'observedProperties': 'board/attribute-set-function-observed-property'
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
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantAttributeSetFunctionModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const attributeSetId = jsonDeserializedData['attribute_set_id'];

			const attrSetPanels = await dbSrvc.knex.raw(`SELECT tenant_panel_id AS id FROM tenant_panels_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetPanels.rows.length; idx++) {
				const attrSetPanel = attrSetPanels.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetPanel.id, 'panel', ctxt.state.tenant['tenant_id']]);
				const panelArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetPanel.id, 'panel']);
				cachedArtifacts = cachedArtifacts.concat(panelArtifacts.shift());
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
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantAttributeSetFunctionModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			const attributeSetId = jsonDeserializedData['attribute_set_id'];

			const attrSetPanels = await dbSrvc.knex.raw(`SELECT tenant_panel_id AS id FROM tenant_panels_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetPanels.rows.length; idx++) {
				const attrSetPanel = attrSetPanels.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetPanel.id, 'panel', ctxt.state.tenant['tenant_id']]);
				const panelArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetPanel.id, 'panel']);
				cachedArtifacts = cachedArtifacts.concat(panelArtifacts.shift());
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
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

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

			const attrSetPanels = await dbSrvc.knex.raw(`SELECT tenant_panel_id AS id FROM tenant_panels_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetPanels.rows.length; idx++) {
				const attrSetPanel = attrSetPanels.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetPanel.id, 'panel', ctxt.state.tenant['tenant_id']]);
				const panelArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetPanel.id, 'panel']);
				cachedArtifacts = cachedArtifacts.concat(panelArtifacts.shift());
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

			attrSetObservedPropertyData = this._convertToJsonApiFormat(attrSetObservedPropertyData, 'board/attribute-set-function-observed-property', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'board/attribute-set',
				'attributeSetFunction': 'board/attribute-set-function',
				'attributeSetProperty': 'board/attribute-set-property'
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

			const attributeSetId = jsonDeserializedData['attribute_set_id'];
			const attrSetPanels = await dbSrvc.knex.raw(`SELECT tenant_panel_id AS id FROM tenant_panels_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetPanels.rows.length; idx++) {
				const attrSetPanel = attrSetPanels.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetPanel.id, 'panel', ctxt.state.tenant['tenant_id']]);
				const panelArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetPanel.id, 'panel']);
				cachedArtifacts = cachedArtifacts.concat(panelArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

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

			const attrSetPanels = await dbSrvc.knex.raw(`SELECT tenant_panel_id AS id FROM tenant_panels_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetPanels.rows.length; idx++) {
				const attrSetPanel = attrSetPanels.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetPanel.id, 'panel', ctxt.state.tenant['tenant_id']]);
				const panelArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetPanel.id, 'panel']);
				cachedArtifacts = cachedArtifacts.concat(panelArtifacts.shift());
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

	async _getTenantPanel(ctxt) {
		try {
			let panelData = await this.$TenantPanelModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.panel_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'templates', 'subcomponents', 'processors', 'requestFormatters', 'executors', 'responseFormatters', 'attributeSets', 'constituents', 'watchers', 'dataPointAggregations']
			});

			panelData = this._convertToJsonApiFormat(panelData, 'board/panel', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'board/folder',
				'templates': 'board/panel-template',
				'subcomponents': 'board/panel-subcomponent',
				'processors': 'board/panel-processor',
				'requestFormatters': 'board/panel-request-formatter',
				'executors': 'board/panel-executor',
				'responseFormatters': 'board/panel-response-formatter',
				'constituents': 'board/panel-constituent',
				'attributeSets': 'board/panel-attribute-set',
				'watchers': 'board/panel-watcher',
				'dataPointAggregations': 'board/panel-aggregate'
			}, {
				'deleteInclude': false
			});

			panelData.included = panelData.included.filter((include) => {
				return include['type'] === 'board/panel-subcomponent';
			});

			return panelData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPanel`, err);
		}
	}

	async _getAllTenantPanels(ctxt) {
		let hasBoardReadPermissions = false;
		try {
			const rbacChecker = this._rbac('board-read');
			await rbacChecker(ctxt);

			hasBoardReadPermissions = true;
		}
		catch(err) {
			hasBoardReadPermissions = false;
		}

		try {
			let panelData = null;

			if(hasBoardReadPermissions) { // eslint-disable-line curly
				panelData = await this.$TenantPanelModel
				.query(function(qb) {
					qb.where({ 'tenant_id': ctxt.state.tenant.tenant_id });
				})
				.fetchAll({
					'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'templates', 'processors', 'attributeSets', 'constituents', 'watchers', 'dataPointAggregations']
				});
			}
			else { // eslint-disable-line curly
				panelData = await this.$TenantPanelModel
				.query(function(qb) {
					qb
					.whereRaw(`id IN (SELECT tenant_panel_id FROM tenant_panels_users WHERE tenant_user_id IN (SELECT id FROM tenants_users WHERE user_id = ?))`, [ctxt.state.user.user_id])
					.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id })
					.orderBy('name');
				})
				.fetchAll({
					'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'templates', 'processors', 'attributeSets', 'constituents', 'watchers', 'dataPointAggregations']
				});
			}

			panelData = this._convertToJsonApiFormat(panelData, 'board/panel', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'board/folder',
				'templates': 'board/panel-template',
				'processors': 'board/panel-processor',
				'constituents': 'board/panel-constituent',
				'attributeSets': 'board/panel-attribute-set',
				'watchers': 'board/panel-watcher',
				'dataPointAggregations': 'board/panel-aggregate'
			});

			return panelData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllTenantPanels`, err);
		}
	}

	async _addTenantPanel(ctxt) {
		try {
			const pubsubService = this.$dependencies.PubsubService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const savedRecord = await this.$TenantPanelModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const schemaChangePayload = JSON.stringify({
				'id': savedRecord.get('id'),
				'sub_domain': ctxt.state.tenant['sub_domain'],
				'tenant_id': ctxt.state.tenant['tenant_id'],
				'type': 'panel'
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPanel`, err);
		}
	}

	async _updateTenantPanel(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const savedRecord = await this.$TenantPanelModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			const cachedPanelArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['id'], 'panel']);

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [savedRecord.get('id'), 'panel', ctxt.state.tenant['tenant_id']]);

			cachedPanelArtifacts.shift().forEach((cachedArtifact) => {
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPanel`, err);
		}
	}

	async _deleteTenantPanel(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const tenantPanel = await this.$TenantPanelModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.panel_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantPanel) throw new Error('Unknown Tenant Panel');

			const cachedPanelArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [ctxt.params['panel_id'], 'panel']);
			let cachedArtifacts = cachedPanelArtifacts.shift();

			const panelConstituents = await dbSrvc.knex.raw(`SELECT tenant_panel_constituent_id AS id, tenant_panel_constituent_type As type FROM tenant_panel_constituents WHERE tenant_panel_id = ?`, [ctxt.params.panel_id]);

			await tenantPanel.destroy();

			for(let idx = 0; idx < panelConstituents.rows.length; idx++) {
				const constituent = panelConstituents.rows[idx];
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
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPanel`, err);
		}
	}

	async _getTenantPanelTemplate(ctxt) {
		try {
			let panelTemplateData = await this.$PanelTemplateModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.panel_template_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPanel']
			});

			panelTemplateData = this._convertToJsonApiFormat(panelTemplateData, 'board/panel-template', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPanel': 'board/panel'
			});

			return panelTemplateData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPanelTemplate`, err);
		}
	}

	async _addTenantPanelTemplate(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$PanelTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPanelTemplate`, err);
		}
	}

	async _updateTenantPanelTemplate(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$PanelTemplateModel
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
				await dbSrvc.knex.raw('UPDATE tenant_panel_templates SET effectivity_end = ? WHERE tenant_id = ? AND tenant_panel_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_panel_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$PanelTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPanelTemplate`, err);
		}
	}

	async _getTenantPanelSubcomponent(ctxt) {
		try {
			let panelSubcomponentData = await this.$PanelSubcomponentModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.panel_subcomponent_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPanel']
			});

			panelSubcomponentData = this._convertToJsonApiFormat(panelSubcomponentData, 'board/panel-subcomponent', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPanel': 'board/panel'
			});

			return panelSubcomponentData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPanelSubcomponent`, err);
		}
	}

	async _addTenantPanelSubcomponent(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$PanelSubcomponentModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPanelSubcomponent`, err);
		}
	}

	async _updateTenantPanelSubcomponent(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$PanelSubcomponentModel
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
				await dbSrvc.knex.raw('UPDATE tenant_panel_subcomponents SET effectivity_end = ? WHERE tenant_id = ? AND tenant_panel_id = ? AND component_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_panel_id, jsonDeserializedData.component_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$PanelSubcomponentModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPanelSubcomponent`, err);
		}
	}

	async _deleteTenantPanelSubcomponent(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const tenantPanelSubcomponent = await this.$PanelSubcomponentModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.panel_subcomponent_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantPanelSubcomponent) throw new Error('Unknown Tenant Panel Subcomponent');

			const tenantPanelSubcomponentComponentId = tenantPanelSubcomponent['attributes']['component_id'];

			await tenantPanelSubcomponent.destroy();
			await dbSrvc.knex.raw('DELETE FROM tenant_panel_subcomponents WHERE component_id = ?', [tenantPanelSubcomponentComponentId]);

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPanel`, err);
		}
	}

	async _getTenantPanelProcessor(ctxt) {
		try {
			let panelProcessorData = await this.$PanelProcessorModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.panel_processor_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPanel']
			});

			panelProcessorData = this._convertToJsonApiFormat(panelProcessorData, 'board/panel-processor', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPanel': 'board/panel'
			});

			return panelProcessorData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPanelProcessor`, err);
		}
	}

	async _addTenantPanelProcessor(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(!jsonDeserializedData['processor']) jsonDeserializedData['processor'] = '';

			const savedRecord = await this.$PanelProcessorModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPanelProcessor`, err);
		}
	}

	async _updateTenantPanelProcessor(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;

			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$PanelProcessorModel
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
				updateEffectivity = await dbSrvc.knex.raw('UPDATE tenant_panel_processors SET effectivity_end = ? WHERE tenant_id = ? AND tenant_panel_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL AND publish_status = ? RETURNING id,publish_status', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_panel_id, true]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$PanelProcessorModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			// 3. Update Rendered Processor
			const evaluatorFactory = require('evaluator-factory');

			// 4. On Publishing a New processor, generate and store rendered processor and delete cached artifacts
			if(!oldPublishStatus && newPublishStatus) {
				try {
					const renderedEvaluator = await evaluatorFactory.renderEvaluatorString({
						'id': savedRecord.get('tenant_panel_id'),
						'type': 'panel',
						'database': dbSrvc
					});

					await dbSrvc.knex.raw(`UPDATE tenant_panel_processors SET processor = ? WHERE id = ?`, [renderedEvaluator, savedRecord.get('id')]);
				}
				catch(err) {
					jsonDeserializedData['publish_status'] = false;
					await this.$PanelProcessorModel
						.forge()
						.save(jsonDeserializedData, {
							'method': 'update',
							'patch': true
						});

					await dbSrvc.knex.raw('UPDATE tenant_panel_processors SET effectivity_end = null WHERE id = ?', [updateEffectivity.rows[0]['id']]);

					throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPanelProcessor`, err);
				}

				const cachedPanelArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [savedRecord.get('tenant_panel_id'), 'panel']);

				cachedPanelArtifacts.shift().forEach((cachedArtifact) => {
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPanelProcessor`, err);
		}
	}

	async _getTenantPanelRequestFormatter(ctxt) {
		try {
			let panelRequestFormatterData = await this.$PanelRequestFormatterModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.panel_request_formatter_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPanel']
			});

			panelRequestFormatterData = this._convertToJsonApiFormat(panelRequestFormatterData, 'board/panel-request-formatter', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPanel': 'board/panel'
			});

			return panelRequestFormatterData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPanelRequestFormatter`, err);
		}
	}

	async _addTenantPanelRequestFormatter(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$PanelRequestFormatterModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPanelRequestFormatter`, err);
		}
	}

	async _updateTenantPanelRequestFormatter(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$PanelRequestFormatterModel
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
				await dbSrvc.knex.raw('UPDATE tenant_panel_request_formatters SET effectivity_end = ? WHERE tenant_id = ? AND tenant_panel_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_panel_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$PanelRequestFormatterModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPanelRequestFormatter`, err);
		}
	}

	async _getTenantPanelExecutor(ctxt) {
		try {
			let panelExecutorData = await this.$PanelExecutorModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.panel_executor_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPanel']
			});

			panelExecutorData = this._convertToJsonApiFormat(panelExecutorData, 'board/panel-executor', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPanel': 'board/panel'
			});

			return panelExecutorData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPanelExecutor`, err);
		}
	}

	async _addTenantPanelExecutor(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$PanelExecutorModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPanelExecutor`, err);
		}
	}

	async _updateTenantPanelExecutor(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$PanelExecutorModel
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
				await dbSrvc.knex.raw('UPDATE tenant_panel_executors SET effectivity_end = ? WHERE tenant_id = ? AND tenant_panel_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_panel_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$PanelExecutorModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPanelExecutor`, err);
		}
	}

	async _getTenantPanelResponseFormatter(ctxt) {
		try {
			let panelResponseFormatterData = await this.$PanelResponseFormatterModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.panel_response_formatter_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPanel']
			});

			panelResponseFormatterData = this._convertToJsonApiFormat(panelResponseFormatterData, 'board/panel-response-formatter', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPanel': 'board/panel'
			});

			return panelResponseFormatterData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPanelResponseFormatter`, err);
		}
	}

	async _addTenantPanelResponseFormatter(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$PanelResponseFormatterModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPanelResponseFormatter`, err);
		}
	}

	async _updateTenantPanelResponseFormatter(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$PanelResponseFormatterModel
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
				await dbSrvc.knex.raw('UPDATE tenant_panel_response_formatters SET effectivity_end = ? WHERE tenant_id = ? AND tenant_panel_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_panel_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$PanelResponseFormatterModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPanelResponseFormatter`, err);
		}
	}

	async _getTenantPanelAttributeSet(ctxt) {
		try {
			let panelAttributeSetData = await this.$PanelAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.panel_attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantAttributeSet', 'tenantPanel']
			});

			panelAttributeSetData = this._convertToJsonApiFormat(panelAttributeSetData, 'board/panel-attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'tenantAttributeSet': 'board/attribute-set',
				'tenantPanel': 'board/panel'
			});

			return panelAttributeSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPanelAttributeSet`, err);
		}
	}

	async _addTenantPanelAttributeSet(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$PanelAttributeSetModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const cachedPanelArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_panel_id'], 'panel']);

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_panel_id'], 'panel', jsonDeserializedData['tenant_id']]);

			cachedPanelArtifacts.shift().forEach((cachedArtifact) => {
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPanelAttributeSet`, err);
		}
	}

	async _updateTenantPanelAttributeSet(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$PanelAttributeSetModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			const cachedPanelArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_panel_id'], 'panel']);

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_panel_id'], 'panel', jsonDeserializedData['tenant_id']]);

			cachedPanelArtifacts.shift().forEach((cachedArtifact) => {
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPanelAttributeSet`, err);
		}
	}

	async _deleteTenantPanelAttributeSet(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;

			const panelAttributeSet = await this.$PanelAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.panel_attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!panelAttributeSet) throw new Error('Unknown Tenant Panel Attribute Set');

			const panelId = panelAttributeSet.get('tenant_panel_id');

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedPanelArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [panelId, 'panel']);

			await panelAttributeSet.destroy();

			cachedPanelArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [panelId, 'panel', ctxt.state.tenant['tenant_id']]);

			await cacheMulti.execAsync();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPanelAttributeSet`, err);
		}
	}

	async _getTenantPanelConstituent(ctxt) {
		try {
			let panelConstituentData = await this.$PanelConstituentModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.panel_constituent_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPanel']
			});

			panelConstituentData = this._convertToJsonApiFormat(panelConstituentData, 'board/panel-constituent', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPanel': 'board/panel'
			});

			return panelConstituentData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPanelConstituent`, err);
		}
	}

	async _addTenantPanelConstituent(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$PanelConstituentModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const cachedPanelArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_panel_id'], 'panel']);
			let cachedArtifacts = cachedPanelArtifacts.shift();

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_panel_id'], 'panel', jsonDeserializedData['tenant_id']]);

			const cachedPanelConstituentArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_panel_constituent_id'], jsonDeserializedData['tenant_panel_constituent_type']]);
			cachedArtifacts = cachedArtifacts.concat(cachedPanelConstituentArtifacts.shift());

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_panel_constituent_id'], jsonDeserializedData['tenant_panel_constituent_type'], jsonDeserializedData['tenant_id']]);

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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPanelConstituent`, err);
		}
	}

	async _deleteTenantPanelConstituent(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const panelConstituent = await this.$PanelConstituentModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.panel_constituent_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!panelConstituent) throw new Error('Unknown Panel constituent mapping');

			const cachedPanelArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [panelConstituent.get('tenant_panel_id'), 'panel']);
			let cachedArtifacts = cachedPanelArtifacts.shift();

			const panelArtifactId = panelConstituent.get('tenant_panel_constituent_id');
			const panelArtifactType = panelConstituent.get('tenant_panel_constituent_type');
			const panelId = panelConstituent.get('tenant_panel_id');

			const cachedPanelConstituentArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [panelArtifactId, panelArtifactType]);
			cachedArtifacts = cachedArtifacts.concat(cachedPanelConstituentArtifacts.shift());

			await panelConstituent.destroy();

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [panelId, 'panel', ctxt.state.tenant['tenant_id']]);
			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [panelArtifactId, panelArtifactType, ctxt.state.tenant['tenant_id']]);

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPanelConstituent`, err);
		}
	}

	async _getTenantPanelWatcher(ctxt) {
		try {
			let panelWatcherData = await this.$PanelWatcherModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.panel_watcher_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPanel', 'tenantUser']
			});

			panelWatcherData = this._convertToJsonApiFormat(panelWatcherData, 'board/panel-watcher', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPanel': 'board/panel',
				'tenantUser': 'pug/user-manager/tenant-user'
			});

			return panelWatcherData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPanelWatcher`, err);
		}
	}

	async _addTenantPanelWatcher(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$PanelWatcherModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPanelWatcher`, err);
		}
	}

	async _deleteTenantPanelWatcher(ctxt) {
		try {
			const panelWatcher = await this.$PanelWatcherModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.panel_watcher_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!panelWatcher) throw new Error('Unknown Panel User mapping');

			await panelWatcher.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPanelWatcher`, err);
		}
	}

	async _getPossibleTenantUsersList(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const possibleTenantUsers = await dbSrvc.knex.raw(`SELECT A.id, B.first_name AS "firstName", B.middle_names AS "middleNames", B.last_name AS "lastName", B.email FROM tenants_users A INNER JOIN users B ON (A.user_id = B.id) WHERE A.tenant_id = ? AND A.access_status = 'authorized' AND A.id NOT IN (SELECT tenant_user_id FROM tenant_panels_users WHERE tenant_panel_id = ?)`, [ctxt.state.tenant.tenant_id, ctxt.query.panel]);
			return possibleTenantUsers.rows;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getPossibleTenantUsersList`, err);
		}
	}

	async _getTenantPanelAggregate(ctxt) {
		try {
			let panelAggregateData = await this.$PanelAggregateModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.panel_aggregate_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPanel', 'evaluationExpression']
			});

			panelAggregateData = this._convertToJsonApiFormat(panelAggregateData, 'board/panel-aggregate', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPanel': 'board/panel',
				'evaluationExpression': 'board/attribute-set-property'
			});

			return panelAggregateData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPanelAggregate`, err);
		}
	}

	async _addTenantPanelAggregate(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');
			if(jsonDeserializedData.internal_tag !== undefined && jsonDeserializedData.internal_tag !== null && jsonDeserializedData.internal_tag.trim() === '') throw new Error('Tag cannot be empty');
			if(!jsonDeserializedData.evaluation_expression_id) throw new Error('Expression cannot be empty');

			jsonDeserializedData['evaluation_expression'] = jsonDeserializedData.evaluation_expression_id;
			delete jsonDeserializedData.evaluation_expression_id;

			const savedRecord = await this.$PanelAggregateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPanelAggregate`, err);
		}
	}

	async _updateTenantPanelAggregate(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');
			if(jsonDeserializedData.internal_tag !== undefined && jsonDeserializedData.internal_tag !== null && jsonDeserializedData.internal_tag.trim() === '') throw new Error('Tag cannot be empty');
			if(!jsonDeserializedData.evaluation_expression_id) throw new Error('Expression cannot be empty');

			jsonDeserializedData['evaluation_expression'] = jsonDeserializedData.evaluation_expression_id;
			delete jsonDeserializedData.evaluation_expression_id;

			const savedRecord = await this.$PanelAggregateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPanelAggregate`, err);
		}
	}

	async _deleteTenantPanelAggregate(ctxt) {
		try {

			const panelAggregate = await this.$PanelAggregateModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.panel_aggregate_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!panelAggregate) throw new Error('Unknown Tenant Panel Aggregate');


			await panelAggregate.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPanelAggregate`, err);
		}
	}

	async _getHistoricalData(ctxt) {
		try {
			const timescale = this.$dependencies.TimescaleService;

			const requestedData = ctxt.request.body;
			const requestedDataPoints = Object.keys(requestedData);

			const currentTime = moment();
			currentTime.set({ 'seconds': 0, 'milliseconds': 0 });

			let diffFromFifteenMinuteBoundary = currentTime.minute() % 15;
			if(diffFromFifteenMinuteBoundary >= 8) {
				diffFromFifteenMinuteBoundary = (15 - diffFromFifteenMinuteBoundary);
				currentTime.minute(currentTime.minute() + diffFromFifteenMinuteBoundary);
			}
			else {
				currentTime.minute(currentTime.minute() - diffFromFifteenMinuteBoundary);
			}

			const historicalData = {};
			for(let idx = 0; idx < requestedDataPoints.length; idx++) {
				const dataPoint = requestedDataPoints[idx];
				const dataPointPeriod = requestedData[dataPoint];
				const dataPointTime = currentTime.clone();

				switch (dataPointPeriod) {
					case 'last_one_hour':
						dataPointTime.subtract(1, 'hour');
						break;

					case 'last_two_hours':
						dataPointTime.subtract(2, 'hour');
						break;

					case 'last_four_hours':
						dataPointTime.subtract(4, 'hour');
						break;

					case 'last_eight_hours':
						dataPointTime.subtract(8, 'hour');
						break;

					case 'last_twelve_hours':
						dataPointTime.subtract(12, 'hour');
						break;

					case 'last_twenty_four_hours':
						dataPointTime.subtract(24, 'hour');
						break;

					case 'current_shift':
						// TODO: Once Rahul Khunt's API come online
						break;

					case 'current_day':
						dataPointTime.set({
							'hour': 0,
							'minute': 0,
							'second': 0,
							'millisecond': 0
						});
						break;

					default:
						dataPointTime.subtract(1, 'hour');
						break;
				}

				const dataPointSelectQeury = `SELECT generated_at AS timestamp, ? AS internal_tag, values ->> ? AS value FROM ${ctxt.state.tenant.sub_domain}.panel_${ctxt.params.panel_id.replace(/-/g, '_')} WHERE values \\? ? AND generated_at >= ? ORDER BY generated_at ASC`;
				const dataPointTempData = await timescale.knex.raw(dataPointSelectQeury, [dataPoint, dataPoint, dataPoint, dataPointTime.format()]);

				const dataPointData = [];

				// eslint-disable-next-line curly
				for await (const row of dataPointTempData.rows) {
					dataPointData.push(row);
				}

				if(!historicalData[dataPointPeriod]) historicalData[dataPointPeriod] = {};
				historicalData[dataPointPeriod][dataPoint] = dataPointData.map((data) => {
					return {
						'timestamp': moment(data.timestamp).format(),
						'value': data.value
					};
				});
			}


			return historicalData;
		}
		catch(err) {
			console.error(err);
			throw new PlantWorksMiddlewareError(`${this.name}::_getHistoricalData`, err);
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

exports.middleware = Main;
