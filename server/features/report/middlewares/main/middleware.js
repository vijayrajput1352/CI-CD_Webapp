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
 * @classdesc The Plant.Works Web Application Reports Main middleware - manages CRUD for reports/reports.
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

					'reports': function() {
						return this.hasMany(self.$TenantReportModel, 'tenant_folder_id');
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
						return this.hasMany(self.$TenantReportAggregateModel, 'attribute_set_property_id');
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

			Object.defineProperty(this, '$TenantReportModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_reports',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'folder': function() {
						return this.belongsTo(self.$TenantFolderModel, 'tenant_folder_id');
					},

					'attributeSets': function() {
						return this.hasMany(self.$ReportAttributeSetModel, 'tenant_report_id');
					},

					'constituents': function() {
						return this.hasMany(self.$ReportConstituentModel, 'tenant_report_id');
					},

					'processors': function() {
						return this.hasMany(self.$ReportProcessorModel, 'tenant_report_id');
					},

					'requestFormatters': function() {
						return this.hasMany(self.$ReportRequestFormatterModel, 'tenant_report_id');
					},

					'executors': function() {
						return this.hasMany(self.$ReportExecutorModel, 'tenant_report_id');
					},

					'responseFormatters': function() {
						return this.hasMany(self.$ReportResponseFormatterModel, 'tenant_report_id');
					},

					'inputTemplates': function() {
						return this.hasMany(self.$ReportInputTemplateModel, 'tenant_report_id');
					},

					'resultTemplates': function() {
						return this.hasMany(self.$ReportResultTemplateModel, 'tenant_report_id');
					},

					'watchers': function() {
						return this.hasMany(self.$ReportWatcherModel, 'tenant_report_id');
					},

					'dataPointAggregations': function() {
						return this.hasMany(self.$ReportAggregateModel, 'tenant_report_id');
					},

					'schedules': function() {
						return this.hasMany(self.$ReportScheduleModel, 'tenant_report_id');
					}
				}, {
					'jsonColumns': ['attribute_set_metadata']
				})
			});

			Object.defineProperty(this, '$ReportAttributeSetModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_reports_attribute_sets',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantAttributeSet': function() {
						return this.belongsTo(self.$TenantAttributeSetModel, 'tenant_attribute_set_id');
					},

					'tenantReport': function() {
						return this.belongsTo(self.$TenantReportModel, 'tenant_report_id');
					}
				})
			});

			Object.defineProperty(this, '$ReportConstituentModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_report_constituents',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantReport': function() {
						return this.belongsTo(self.$TenantReportModel, 'tenant_report_id');
					}
				})
			});

			Object.defineProperty(this, '$ReportProcessorModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_report_processors',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantReport': function() {
						return this.belongsTo(self.$TenantReportModel, 'tenant_report_id');
					}
				})
			});

			Object.defineProperty(this, '$ReportRequestFormatterModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_report_request_formatters',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantReport': function() {
						return this.belongsTo(self.$TenantReportModel, 'tenant_report_id');
					}
				})
			});

			Object.defineProperty(this, '$ReportExecutorModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_report_executors',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantReport': function() {
						return this.belongsTo(self.$TenantReportModel, 'tenant_report_id');
					}
				})
			});

			Object.defineProperty(this, '$ReportResponseFormatterModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_report_response_formatters',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantReport': function() {
						return this.belongsTo(self.$TenantReportModel, 'tenant_report_id');
					}
				})
			});

			Object.defineProperty(this, '$ReportInputTemplateModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_report_input_templates',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantReport': function() {
						return this.belongsTo(self.$TenantReportModel, 'tenant_report_id');
					}
				}, {
					'jsonColumns': ['component_observers', 'component_tasks']
				})
			});

			Object.defineProperty(this, '$ReportResultTemplateModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_report_result_templates',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantReport': function() {
						return this.belongsTo(self.$TenantReportModel, 'tenant_report_id');
					}
				}, {
					'jsonColumns': ['component_observers', 'component_tasks']
				})
			});

			Object.defineProperty(this, '$ReportWatcherModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_reports_users',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantReport': function() {
						return this.belongsTo(self.$TenantReportModel, 'tenant_report_id');
					},

					'tenantUser': function() {
						return this.belongsTo(self.$TenantUserModel, 'tenant_user_id');
					}
				})
			});

			Object.defineProperty(this, '$ReportAggregateModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_report_aggregates',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantReport': function() {
						return this.belongsTo(self.$TenantReportModel, 'tenant_report_id');
					},

					'evaluationExpression': function() {
						return this.belongsTo(self.$TenantAttributeSetPropertyModel, 'evaluation_expression');
					}
				}, {
					'jsonColumns': ['config', 'filters']
				})
			});

			Object.defineProperty(this, '$ReportScheduleModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_report_schedules',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantReport': function() {
						return this.belongsTo(self.$TenantReportModel, 'tenant_report_id');
					}
				}, {
					'jsonColumns': ['scheduled_output_types']
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
		delete this.$TenantUserModel;
		delete this.$ReportScheduleModel;
		delete this.$ReportAggregateModel;
		delete this.$ReportWatcherModel;
		delete this.$ReportResultTemplateModel;
		delete this.$ReportInputTemplateModel;
		delete this.$ReportResponseFormatterModel;
		delete this.$ReportExecutorModel;
		delete this.$ReportRequestFormatterModel;
		delete this.$ReportProcessorModel;
		delete this.$ReportConstituentModel;
		delete this.$ReportAttributeSetModel;
		delete this.$TenantReportModel;

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

			await ApiService.add(`${this.name}::getTenantReport`, this._getTenantReport.bind(this));
			await ApiService.add(`${this.name}::getAllTenantReports`, this._getAllTenantReports.bind(this));
			await ApiService.add(`${this.name}::addTenantReport`, this._addTenantReport.bind(this));
			await ApiService.add(`${this.name}::updateTenantReport`, this._updateTenantReport.bind(this));
			await ApiService.add(`${this.name}::deleteTenantReport`, this._deleteTenantReport.bind(this));

			await ApiService.add(`${this.name}::getTenantReportAttributeSet`, this._getTenantReportAttributeSet.bind(this));
			await ApiService.add(`${this.name}::addTenantReportAttributeSet`, this._addTenantReportAttributeSet.bind(this));
			await ApiService.add(`${this.name}::updateTenantReportAttributeSet`, this._updateTenantReportAttributeSet.bind(this));
			await ApiService.add(`${this.name}::deleteTenantReportAttributeSet`, this._deleteTenantReportAttributeSet.bind(this));

			await ApiService.add(`${this.name}::getTenantReportConstituent`, this._getTenantReportConstituent.bind(this));
			await ApiService.add(`${this.name}::addTenantReportConstituent`, this._addTenantReportConstituent.bind(this));
			await ApiService.add(`${this.name}::deleteTenantReportConstituent`, this._deleteTenantReportConstituent.bind(this));

			await ApiService.add(`${this.name}::getTenantReportProcessor`, this._getTenantReportProcessor.bind(this));
			await ApiService.add(`${this.name}::addTenantReportProcessor`, this._addTenantReportProcessor.bind(this));
			await ApiService.add(`${this.name}::updateTenantReportProcessor`, this._updateTenantReportProcessor.bind(this));

			await ApiService.add(`${this.name}::getTenantReportRequestFormatter`, this._getTenantReportRequestFormatter.bind(this));
			await ApiService.add(`${this.name}::addTenantReportRequestFormatter`, this._addTenantReportRequestFormatter.bind(this));
			await ApiService.add(`${this.name}::updateTenantReportRequestFormatter`, this._updateTenantReportRequestFormatter.bind(this));

			await ApiService.add(`${this.name}::getTenantReportExecutor`, this._getTenantReportExecutor.bind(this));
			await ApiService.add(`${this.name}::addTenantReportExecutor`, this._addTenantReportExecutor.bind(this));
			await ApiService.add(`${this.name}::updateTenantReportExecutor`, this._updateTenantReportExecutor.bind(this));

			await ApiService.add(`${this.name}::getTenantReportResponseFormatter`, this._getTenantReportResponseFormatter.bind(this));
			await ApiService.add(`${this.name}::addTenantReportResponseFormatter`, this._addTenantReportResponseFormatter.bind(this));
			await ApiService.add(`${this.name}::updateTenantReportResponseFormatter`, this._updateTenantReportResponseFormatter.bind(this));

			await ApiService.add(`${this.name}::getTenantReportInputTemplate`, this._getTenantReportInputTemplate.bind(this));
			await ApiService.add(`${this.name}::addTenantReportInputTemplate`, this._addTenantReportInputTemplate.bind(this));
			await ApiService.add(`${this.name}::updateTenantReportInputTemplate`, this._updateTenantReportInputTemplate.bind(this));

			await ApiService.add(`${this.name}::getTenantReportResultTemplate`, this._getTenantReportResultTemplate.bind(this));
			await ApiService.add(`${this.name}::addTenantReportResultTemplate`, this._addTenantReportResultTemplate.bind(this));
			await ApiService.add(`${this.name}::updateTenantReportResultTemplate`, this._updateTenantReportResultTemplate.bind(this));

			await ApiService.add(`${this.name}::getTenantReportWatcher`, this._getTenantReportWatcher.bind(this));
			await ApiService.add(`${this.name}::addTenantReportWatcher`, this._addTenantReportWatcher.bind(this));
			await ApiService.add(`${this.name}::updateTenantReportWatcher`, this._updateTenantReportWatcher.bind(this));
			await ApiService.add(`${this.name}::deleteTenantReportWatcher`, this._deleteTenantReportWatcher.bind(this));

			await ApiService.add(`${this.name}::possibleTenantUsersList`, this._getPossibleTenantUsersList.bind(this));

			await ApiService.add(`${this.name}::getTenantReportAggregate`, this._getTenantReportAggregate.bind(this));
			await ApiService.add(`${this.name}::addTenantReportAggregate`, this._addTenantReportAggregate.bind(this));
			await ApiService.add(`${this.name}::updateTenantReportAggregate`, this._updateTenantReportAggregate.bind(this));
			await ApiService.add(`${this.name}::deleteTenantReportAggregate`, this._deleteTenantReportAggregate.bind(this));

			await ApiService.add(`${this.name}::getTenantReportSchedule`, this._getTenantReportSchedule.bind(this));
			await ApiService.add(`${this.name}::addTenantReportSchedule`, this._addTenantReportSchedule.bind(this));
			await ApiService.add(`${this.name}::updateTenantReportSchedule`, this._updateTenantReportSchedule.bind(this));
			await ApiService.add(`${this.name}::deleteTenantReportSchedule`, this._deleteTenantReportSchedule.bind(this));

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

			await ApiService.remove(`${this.name}::deleteTenantReportSchedule`, this._deleteTenantReportSchedule.bind(this));
			await ApiService.remove(`${this.name}::updateTenantReportSchedule`, this._updateTenantReportSchedule.bind(this));
			await ApiService.remove(`${this.name}::addTenantReportSchedule`, this._addTenantReportSchedule.bind(this));
			await ApiService.remove(`${this.name}::getTenantReportSchedule`, this._getTenantReportSchedule.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantReportAggregate`, this._deleteTenantReportAggregate.bind(this));
			await ApiService.remove(`${this.name}::updateTenantReportAggregate`, this._updateTenantReportAggregate.bind(this));
			await ApiService.remove(`${this.name}::addTenantReportAggregate`, this._addTenantReportAggregate.bind(this));
			await ApiService.remove(`${this.name}::getTenantReportAggregate`, this._getTenantReportAggregate.bind(this));

			await ApiService.remove(`${this.name}::possibleTenantUsersList`, this._getPossibleTenantUsersList.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantReportWatcher`, this._deleteTenantReportWatcher.bind(this));
			await ApiService.remove(`${this.name}::updateTenantReportWatcher`, this._updateTenantReportWatcher.bind(this));
			await ApiService.remove(`${this.name}::addTenantReportWatcher`, this._addTenantReportWatcher.bind(this));
			await ApiService.remove(`${this.name}::getTenantReportWatcher`, this._getTenantReportWatcher.bind(this));

			await ApiService.remove(`${this.name}::updateTenantReportResultTemplate`, this._updateTenantReportResultTemplate.bind(this));
			await ApiService.remove(`${this.name}::addTenantReportResultTemplate`, this._addTenantReportResultTemplate.bind(this));
			await ApiService.remove(`${this.name}::getTenantReportResultTemplate`, this._getTenantReportResultTemplate.bind(this));

			await ApiService.remove(`${this.name}::updateTenantReportInputTemplate`, this._updateTenantReportInputTemplate.bind(this));
			await ApiService.remove(`${this.name}::addTenantReportInputTemplate`, this._addTenantReportInputTemplate.bind(this));
			await ApiService.remove(`${this.name}::getTenantReportInputTemplate`, this._getTenantReportInputTemplate.bind(this));

			await ApiService.remove(`${this.name}::updateTenantReportResponseFormatter`, this._updateTenantReportResponseFormatter.bind(this));
			await ApiService.remove(`${this.name}::addTenantReportResponseFormatter`, this._addTenantReportResponseFormatter.bind(this));
			await ApiService.remove(`${this.name}::getTenantReportResponseFormatter`, this._getTenantReportResponseFormatter.bind(this));

			await ApiService.remove(`${this.name}::updateTenantReportExecutor`, this._updateTenantReportExecutor.bind(this));
			await ApiService.remove(`${this.name}::addTenantReportExecutor`, this._addTenantReportExecutor.bind(this));
			await ApiService.remove(`${this.name}::getTenantReportExecutor`, this._getTenantReportExecutor.bind(this));

			await ApiService.remove(`${this.name}::updateTenantReportRequestFormatter`, this._updateTenantReportRequestFormatter.bind(this));
			await ApiService.remove(`${this.name}::addTenantReportRequestFormatter`, this._addTenantReportRequestFormatter.bind(this));
			await ApiService.remove(`${this.name}::getTenantReportRequestFormatter`, this._getTenantReportRequestFormatter.bind(this));

			await ApiService.remove(`${this.name}::updateTenantReportProcessor`, this._updateTenantReportProcessor.bind(this));
			await ApiService.remove(`${this.name}::addTenantReportProcessor`, this._addTenantReportProcessor.bind(this));
			await ApiService.remove(`${this.name}::getTenantReportProcessor`, this._getTenantReportProcessor.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantReportConstituent`, this._deleteTenantReportConstituent.bind(this));
			await ApiService.remove(`${this.name}::addTenantReportConstituent`, this._addTenantReportConstituent.bind(this));
			await ApiService.remove(`${this.name}::getTenantReportConstituent`, this._getTenantReportConstituent.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantReportAttributeSet`, this._deleteTenantReportAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::updateTenantReportAttributeSet`, this._updateTenantReportAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::addTenantReportAttributeSet`, this._addTenantReportAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::getTenantReportAttributeSet`, this._getTenantReportAttributeSet.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantReport`, this._deleteTenantReport.bind(this));
			await ApiService.remove(`${this.name}::updateTenantReport`, this._updateTenantReport.bind(this));
			await ApiService.remove(`${this.name}::addTenantReport`, this._addTenantReport.bind(this));
			await ApiService.remove(`${this.name}::getAllTenantReports`, this._getAllTenantReports.bind(this));
			await ApiService.remove(`${this.name}::getTenantReport`, this._getTenantReport.bind(this));

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
							'configsRoute': 'configure.report',
							'dataUrl': '/report/config-tree-nodes',
							'intl': true,
							'type': folder.name === 'report_feature.folder_names.attribute_sets.name' ? 'attribute-folder' : 'report-folder'
						}
					};
				});

				return tenantFolders;
			}

			if(['attribute-folder', 'report-folder'].includes(ctxt.query.node_type)) {
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
							'configsRoute': 'configure.report',
							'dataUrl': '/report/config-tree-nodes',
							'intl': false,
							'type': ctxt.query.node_type
						}
					};
				});

				// Get the reports in this folder
				let tenantReports = await dbSrvc.knex.raw(`SELECT id, tenant_folder_id AS parent_id, name FROM tenant_reports WHERE tenant_folder_id  = ?`, [ctxt.query.node_id]);
				tenantReports = tenantReports.rows.map((report) => {
					return {
						'id': report.id,
						'parent': report.parent_id,
						'text': report.name,
						'children': false,

						'li_attr': {
							'title': report.name
						},

						'data': {
							'configsRoute': 'configure.report',
							'dataUrl': '/report/config-tree-nodes',
							'type': 'report'
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
							'configsRoute': 'configure.report',
							'dataUrl': '/report/config-tree-nodes',
							'type': 'attribute-set'
						}
					};
				});

				return [...tenantFolders, ...tenantReports, ...tenantAttributeSets];
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
							'devenvRoute': 'devenv.report',
							'dataUrl': '/report/devenv-tree-nodes',
							'intl': true,
							'type': folder.name === 'report_feature.folder_names.attribute_sets.name' ? 'attribute-folder' : 'report-folder'
						}
					};
				});

				return tenantFolders;
			}

			if(['attribute-folder', 'report-folder'].includes(ctxt.query.node_type)) {
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
							'devenvRoute': 'devenv.report',
							'dataUrl': '/report/devenv-tree-nodes',
							'intl': false,
							'type': ctxt.query.node_type
						}
					};
				});

				// Get the reports in this folder
				let tenantReports = await dbSrvc.knex.raw(`SELECT id, tenant_folder_id AS parent_id, name FROM tenant_reports WHERE tenant_folder_id  = ?`, [ctxt.query.node_id]);
				tenantReports = tenantReports.rows.map((report) => {
					return {
						'id': report.id,
						'parent': report.parent_id,
						'text': report.name,
						'children': false,

						'li_attr': {
							'title': report.name
						},

						'data': {
							'devenvRoute': 'devenv.report',
							'dataUrl': '/report/devenv-tree-nodes',
							'type': 'report'
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
							'devenvRoute': 'devenv.report',
							'dataUrl': '/report/devenv-tree-nodes',
							'type': 'attribute-set'
						}
					};
				});

				return [...tenantFolders, ...tenantReports, ...tenantAttributeSets];
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
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'parent', 'folders', 'reports', 'attributeSets']
			});

			folderData = this._convertToJsonApiFormat(folderData, 'report/folder', {
				'tenant': 'settings/account/basics/tenant',
				'parent': 'report/folder',
				'folders': 'report/folder',
				'reports': 'report/report',
				'attributeSets': 'report/attribute-set'
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

			// determine if attrset folder or report folder
			const attrSetsRootFolderName = 'report_feature.folder_names.attribute_sets.name';

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
				// update db and cached rendered processor of reports which using folder attr sets
				const folderAttrSets = await dbSrvc.knex.raw(`SELECT id FROM tenant_attribute_sets WHERE tenant_folder_id IN (${folderDescendants.rows.map(() => { return '?'; }).join(',')})`, folderDescendants.rows.map((f) => { return f['id']; }));
				const folderAttrSetsReports = await dbSrvc.knex.raw(`SELECT tenant_report_id AS id FROM tenant_reports_attribute_sets WHERE tenant_attribute_set_id IN (SELECT id FROM tenant_attribute_sets WHERE tenant_folder_id IN (${folderDescendants.rows.map(() => { return '?'; }).join(',')}))`, folderDescendants.rows.map((f) => { return f['id']; }));

				await tenantFolder.destroy();

				for(let idx = 0; idx < folderAttrSets.rows.length; idx++) {
					const folderAttrSet = folderAttrSets.rows[idx];
					const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderAttrSet.id, 'attrSet']);
					cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());
				}

				for(let idx = 0; idx < folderAttrSetsReports.rows.length; idx++) {
					const folderAttrSetsReport = folderAttrSetsReports.rows[idx];
					await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [folderAttrSetsReport.id, 'report', ctxt.state.tenant['tenant_id']]);
					const reportArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderAttrSetsReport.id, 'report']);
					cachedArtifacts = cachedArtifacts.concat(reportArtifacts.shift());
				}
			}
			else {
				// delete cached rendered processor of report within folder
				// update rendered processor of deleted report constituents
				const folderReports = await dbSrvc.knex.raw(`SELECT id FROM tenant_reports WHERE tenant_folder_id IN (${folderDescendants.rows.map(() => { return '?'; }).join(',')});`, folderDescendants.rows.map((f) => { return f['id']; }));
				const folderReportConstituents = await dbSrvc.knex.raw(`SELECT id, type FROM tenant_report_constituents WHERE tenant_report_id IN (${folderReports.rows.map(() => { return '?'; }).join(',')});`, folderReports.rows.map((f) => { return f['id']; }));

				await tenantFolder.destroy();

				for(let idx = 0; idx < folderReports.rows.length; idx++) {
					const folderReport = folderReports.rows[idx];
					const reportArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderReport.id, 'report']);
					cachedArtifacts = cachedArtifacts.concat(reportArtifacts.shift());
				}

				for(let idx = 0; idx < folderReportConstituents.rows.length; idx++) {
					const folderReportConstituent = folderReportConstituents.rows[idx];
					const constituentArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderReportConstituent.id, folderReportConstituent.type]);
					cachedArtifacts = cachedArtifacts.concat(constituentArtifacts.shift());
					await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [folderReportConstituent.id, folderReportConstituent.type, ctxt.state.tenant['tenant_id']]);
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
			let parentFolderId = await dbSrvc.knex.raw(`SELECT id FROM tenant_folders WHERE tenant_id = ? AND name = 'report_feature.folder_names.attribute_sets.name'`, [ctxt.state.tenant.tenant_id]);
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

			attributeSetData = this._convertToJsonApiFormat(attributeSetData, 'report/attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'report/folder',
				'properties': 'report/attribute-set-property',
				'functions': 'report/attribute-set-function'
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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'report/attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'report/folder',
				'properties': 'report/attribute-set-property',
				'functions': 'report/attribute-set-function'
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

			let tenantModuleId = await dbSrvc.knex.raw(`SELECT id FROM tenants_modules WHERE tenant_id = ? AND module_id = (SELECT id FROM modules  WHERE name = ? AND type = 'feature')`, [ctxt.state.tenant.tenant_id, 'Report']);
			if(!tenantModuleId.rows.length) throw new Error('Report feature not enabled for this tenant');
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
			const attrSetReports = await dbSrvc.knex.raw(`SELECT tenant_report_id AS id FROM tenant_reports_attribute_sets WHERE tenant_attribute_set_id = ?`, [ctxt.params['attribute_set_id']]);

			await tenantAttributeSet.destroy();

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [ctxt.params.attribute_set_id, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetReports.rows.length; idx++) {
				const attrSetReport = attrSetReports.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetReport.id, 'report', ctxt.state.tenant['tenant_id']]);
				const reportArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetReport.id, 'report']);
				cachedArtifacts = cachedArtifacts.concat(reportArtifacts.shift());
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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'report/attribute-set-property', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'report/attribute-set'
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


			const attrSetReports = await dbSrvc.knex.raw(`SELECT tenant_report_id AS id FROM tenant_reports_attribute_sets WHERE tenant_attribute_set_id = ?`, [jsonDeserializedData.attribute_set_id]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData.attribute_set_id, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetReports.rows.length; idx++) {
				const attrSetReport = attrSetReports.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetReport.id, 'report', ctxt.state.tenant['tenant_id']]);
				const reportArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetReport.id, 'report']);
				cachedArtifacts = cachedArtifacts.concat(reportArtifacts.shift());
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

			const attrSetReports = await dbSrvc.knex.raw(`SELECT tenant_report_id AS id FROM tenant_reports_attribute_sets WHERE tenant_attribute_set_id = ?`, [jsonDeserializedData.attribute_set_id]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData.attribute_set_id, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetReports.rows.length; idx++) {
				const attrSetReport = attrSetReports.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetReport.id, 'report', ctxt.state.tenant['tenant_id']]);
				const reportArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetReport.id, 'report']);
				cachedArtifacts = cachedArtifacts.concat(reportArtifacts.shift());
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
			const attrSetReports = await dbSrvc.knex.raw(`SELECT tenant_report_id AS id FROM tenant_reports_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetReports.rows.length; idx++) {
				const attrSetReport = attrSetReports.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetReport.id, 'report', ctxt.state.tenant['tenant_id']]);
				const reportArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetReport.id, 'report']);
				cachedArtifacts = cachedArtifacts.concat(reportArtifacts.shift());
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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'report/attribute-set-function', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'report/attribute-set',
				'observedProperties': 'report/attribute-set-function-observed-property'
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
			const attrSetReports = await dbSrvc.knex.raw(`SELECT tenant_report_id AS id FROM tenant_reports_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetReports.rows.length; idx++) {
				const attrSetReport = attrSetReports.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetReport.id, 'report', ctxt.state.tenant['tenant_id']]);
				const reportArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetReport.id, 'report']);
				cachedArtifacts = cachedArtifacts.concat(reportArtifacts.shift());
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
			const attrSetReports = await dbSrvc.knex.raw(`SELECT tenant_report_id AS id FROM tenant_reports_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetReports.rows.length; idx++) {
				const attrSetReport = attrSetReports.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetReport.id, 'report', ctxt.state.tenant['tenant_id']]);
				const reportArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetReport.id, 'report']);
				cachedArtifacts = cachedArtifacts.concat(reportArtifacts.shift());
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
			const attrSetReports = await dbSrvc.knex.raw(`SELECT tenant_report_id AS id FROM tenant_reports_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetReports.rows.length; idx++) {
				const attrSetReport = attrSetReports.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetReport.id, 'report', ctxt.state.tenant['tenant_id']]);
				const reportArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetReport.id, 'report']);
				cachedArtifacts = cachedArtifacts.concat(reportArtifacts.shift());
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

			attrSetObservedPropertyData = this._convertToJsonApiFormat(attrSetObservedPropertyData, 'report/attribute-set-function-observed-property', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'report/attribute-set',
				'attributeSetFunction': 'report/attribute-set-function',
				'attributeSetProperty': 'report/attribute-set-property'
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
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$TenantAttributeSetFunctionObservedPropertyModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const attributeSetId = savedRecord.get('attribute_set_id');
			const attrSetReports = await dbSrvc.knex.raw(`SELECT tenant_report_id AS id FROM tenant_reports_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetReports.rows.length; idx++) {
				const attrSetReport = attrSetReports.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetReport.id, 'report', ctxt.state.tenant['tenant_id']]);
				const reportArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetReport.id, 'report']);
				cachedArtifacts = cachedArtifacts.concat(reportArtifacts.shift());
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
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

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

			const attrSetReports = await dbSrvc.knex.raw(`SELECT tenant_report_id AS id FROM tenant_reports_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetReports.rows.length; idx++) {
				const attrSetReport = attrSetReports.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetReport.id, 'report', ctxt.state.tenant['tenant_id']]);
				const reportArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetReport.id, 'report']);
				cachedArtifacts = cachedArtifacts.concat(reportArtifacts.shift());
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

	async _getTenantReport(ctxt) {
		try {
			let reportData = await this.$TenantReportModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.report_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'attributeSets', 'constituents', 'processors', 'requestFormatters', 'executors', 'responseFormatters', 'inputTemplates', 'resultTemplates', 'watchers', 'dataPointAggregations', 'schedules']
			});

			reportData = this._convertToJsonApiFormat(reportData, 'report/report', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'report/folder',
				'attributeSets': 'report/report-attribute-set',
				'constituents': 'report/report-constituent',
				'processors': 'report/report-processor',
				'requestFormatters': 'report/report-request-formatter',
				'executors': 'report/report-executor',
				'responseFormatters': 'report/report-response-formatter',
				'inputTemplates': 'report/report-input-template',
				'resultTemplates': 'report/report-result-template',
				'watchers': 'report/report-watcher',
				'dataPointAggregations': 'report/report-aggregate',
				'schedules': 'report/report-schedule'
			});

			return reportData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantReport`, err);
		}
	}

	async _getAllTenantReports(ctxt) {
		let hasReportReadPermissions = false;
		try {
			const rbacChecker = this._rbac('report-read');
			await rbacChecker(ctxt);

			hasReportReadPermissions = true;
		}
		catch(err) {
			hasReportReadPermissions = false;
		}

		try {
			let reportData = null;

			if(hasReportReadPermissions) { // eslint-disable-line curly
				reportData = await this.$TenantReportModel
				.query(function(qb) {
					qb.where({ 'tenant_id': ctxt.state.tenant.tenant_id });
				})
				.fetchAll({
					'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'attributeSets', 'constituents', 'processors', 'requestFormatters', 'executors', 'responseFormatters', 'inputTemplates', 'resultTemplates', 'watchers', 'dataPointAggregations']
				});
			}
			else { // eslint-disable-line curly
				reportData = await this.$TenantReportModel
				.query(function(qb) {
					qb
					.whereRaw(`id IN (SELECT tenant_report_id FROM tenant_reports_users WHERE tenant_user_id IN (SELECT id FROM tenants_users WHERE user_id = ?))`, [ctxt.state.user.user_id])
					.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id })
					.orderBy('name');
				})
				.fetchAll({
					'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'attributeSets', 'constituents', 'processors', 'requestFormatters', 'executors', 'responseFormatters', 'inputTemplates', 'resultTemplates', 'watchers', 'dataPointAggregations']
				});
			}

			reportData = this._convertToJsonApiFormat(reportData, 'report/report', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'report/folder',
				'attributeSets': 'report/report-attribute-set',
				'constituents': 'report/report-constituent',
				'processors': 'report/report-processor',
				'requestFormatters': 'report/report-request-formatter',
				'executors': 'report/report-executor',
				'responseFormatters': 'report/report-response-formatter',
				'inputTemplates': 'report/report-input-template',
				'resultTemplates': 'report/report-result-template',
				'watchers': 'report/report-watcher',
				'dataPointAggregations': 'report/report-aggregate'
			});

			return reportData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllTenantReports`, err);
		}
	}

	async _addTenantReport(ctxt) {
		try {
			const pubsubService = this.$dependencies.PubsubService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const savedRecord = await this.$TenantReportModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const schemaChangePayload = JSON.stringify({
				'id': savedRecord.get('id'),
				'sub_domain': ctxt.state.tenant['sub_domain'],
				'tenant_id': ctxt.state.tenant['tenant_id'],
				'type': 'report'
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantReport`, err);
		}
	}

	async _updateTenantReport(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedReportArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['id'], 'report']);

			const savedRecord = await this.$TenantReportModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [savedRecord.get('id'), 'report', ctxt.state.tenant['tenant_id']]);

			cachedReportArtifacts.shift().forEach((cachedArtifact) => {
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantReport`, err);
		}
	}

	async _deleteTenantReport(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const tenantReport = await this.$TenantReportModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.report_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantReport) throw new Error('Unknown Tenant Report');

			const cachedReportArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [ctxt.params['report_id'], 'report']);
			let cachedArtifacts = cachedReportArtifacts.shift();

			const reportConstituents = await dbSrvc.knex.raw(`SELECT tenant_report_constituent_id AS id, tenant_report_constituent_type As type FROM tenant_report_constituents WHERE tenant_report_id = ?`, [ctxt.params.report_id]);

			await tenantReport.destroy();

			for(let idx = 0; idx < reportConstituents.rows.length; idx++) {
				const constituent = reportConstituents.rows[idx];
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
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantReport`, err);
		}
	}

	async _getTenantReportAttributeSet(ctxt) {
		try {
			let reportAttributeSetData = await this.$ReportAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.report_attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantAttributeSet', 'tenantReport']
			});

			reportAttributeSetData = this._convertToJsonApiFormat(reportAttributeSetData, 'report/report-attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'tenantAttributeSet': 'report/attribute-set',
				'tenantReport': 'report/report'
			});

			return reportAttributeSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantReportAttributeSet`, err);
		}
	}

	async _addTenantReportAttributeSet(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedReportArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_report_id'], 'report']);

			const savedRecord = await this.$ReportAttributeSetModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			cachedReportArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_report_id'], 'report', jsonDeserializedData['tenant_id']]);

			await cacheMulti.execAsync();
			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantReportAttributeSet`, err);
		}
	}

	async _updateTenantReportAttributeSet(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedReportArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_report_id'], 'report']);

			const savedRecord = await this.$ReportAttributeSetModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			cachedReportArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_report_id'], 'report', jsonDeserializedData['tenant_id']]);

			await cacheMulti.execAsync();
			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantReportAttributeSet`, err);
		}
	}

	async _deleteTenantReportAttributeSet(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;

			const reportAttributeSet = await this.$ReportAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.report_attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!reportAttributeSet) throw new Error('Unknown Tenant Report Attribute Set');

			const reportId = reportAttributeSet.get('tenant_report_id');

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedReportArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [reportId, 'report']);

			await reportAttributeSet.destroy();

			cachedReportArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [reportId, 'report', ctxt.state.tenant['tenant_id']]);

			await cacheMulti.execAsync();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantReportAttributeSet`, err);
		}
	}

	async _getTenantReportConstituent(ctxt) {
		try {
			let reportConstituentData = await this.$ReportConstituentModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.report_constituent_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantReport']
			});

			reportConstituentData = this._convertToJsonApiFormat(reportConstituentData, 'report/report-constituent', {
				'tenant': 'settings/account/basics/tenant',
				'tenantReport': 'report/report'
			});

			return reportConstituentData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantReportConstituent`, err);
		}
	}

	async _addTenantReportConstituent(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$ReportConstituentModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const cachedReportArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_report_id'], 'report']);
			let cachedArtifacts = cachedReportArtifacts.shift();
			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_report_id'], 'report', jsonDeserializedData['tenant_id']]);

			const cachedReportConstituentArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_report_constituent_id'], jsonDeserializedData['tenant_report_constituent_type']]);
			cachedArtifacts = cachedArtifacts.concat(cachedReportConstituentArtifacts.shift());
			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_report_constituent_id'], jsonDeserializedData['tenant_report_constituent_type'], jsonDeserializedData['tenant_id']]);

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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantReportConstituent`, err);
		}
	}

	async _deleteTenantReportConstituent(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const reportConstituent = await this.$ReportConstituentModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.report_constituent_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!reportConstituent) throw new Error('Unknown Report constituent mapping');

			const reportArtifactId = reportConstituent.get('tenant_report_constituent_id');
			const reportArtifactType = reportConstituent.get('tenant_report_constituent_type');
			const reportId = reportConstituent.get('tenant_report_id');

			await reportConstituent.destroy();

			const cachedReportArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [reportId, 'report']);
			let cachedArtifacts = cachedReportArtifacts.shift();

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [reportId, 'report', ctxt.state.tenant.tenant_id]);

			const cachedReportConstituentArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [reportArtifactId, reportArtifactType]);
			cachedArtifacts = cachedArtifacts.concat(cachedReportConstituentArtifacts.shift());

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [reportArtifactId, reportArtifactType, ctxt.state.tenant['tenant_id']]);

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantReportConstituent`, err);
		}
	}

	async _getTenantReportProcessor(ctxt) {
		try {
			let reportProcessorData = await this.$ReportProcessorModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.report_processor_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantReport']
			});

			reportProcessorData = this._convertToJsonApiFormat(reportProcessorData, 'report/report-processor', {
				'tenant': 'settings/account/basics/tenant',
				'tenantReport': 'report/report'
			});

			return reportProcessorData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantReportProcessor`, err);
		}
	}

	async _addTenantReportProcessor(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(!jsonDeserializedData['processor']) jsonDeserializedData['processor'] = '';

			const savedRecord = await this.$ReportProcessorModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantReportProcessor`, err);
		}
	}

	async _updateTenantReportProcessor(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;

			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$ReportProcessorModel
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
				updateEffectivity = await dbSrvc.knex.raw('UPDATE tenant_report_processors SET effectivity_end = ? WHERE tenant_id = ? AND tenant_report_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL AND publish_status = ? RETURNING id,publish_status', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_report_id, true]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$ReportProcessorModel
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
						'id': savedRecord.get('tenant_report_id'),
						'type': 'report',
						'database': dbSrvc
					});

					await dbSrvc.knex.raw(`UPDATE tenant_report_processors SET processor = ? WHERE id = ?`, [renderedEvaluator, savedRecord.get('id')]);
				}
				catch(err) {
					jsonDeserializedData['publish_status'] = false;
					await this.$ReportProcessorModel
						.forge()
						.save(jsonDeserializedData, {
							'method': 'update',
							'patch': true
						});

					await dbSrvc.knex.raw('UPDATE tenant_report_processors SET effectivity_end = null WHERE id = ?', [updateEffectivity.rows[0]['id']]);

					throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantReportProcessor`, err);
				}


				const cachedReportArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [savedRecord.get('tenant_report_id'), 'report']);

				cachedReportArtifacts.shift().forEach((cachedArtifact) => {
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantReportProcessor`, err);
		}
	}

	async _getTenantReportRequestFormatter(ctxt) {
		try {
			let reportRequestFormatterData = await this.$ReportRequestFormatterModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.report_request_formatter_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantReport']
			});

			reportRequestFormatterData = this._convertToJsonApiFormat(reportRequestFormatterData, 'report/report-request-formatter', {
				'tenant': 'settings/account/basics/tenant',
				'tenantReport': 'report/report'
			});

			return reportRequestFormatterData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantReportRequestFormatter`, err);
		}
	}

	async _addTenantReportRequestFormatter(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$ReportRequestFormatterModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantReportRequestFormatter`, err);
		}
	}

	async _updateTenantReportRequestFormatter(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$ReportRequestFormatterModel
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
				await dbSrvc.knex.raw('UPDATE tenant_report_request_formatters SET effectivity_end = ? WHERE tenant_id = ? AND tenant_report_id = ? AND request_type = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_report_id, jsonDeserializedData.request_type]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$ReportRequestFormatterModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantReportRequestFormatter`, err);
		}
	}

	async _getTenantReportExecutor(ctxt) {
		try {
			let reportExecutorData = await this.$ReportExecutorModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.report_executor_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantReport']
			});

			reportExecutorData = this._convertToJsonApiFormat(reportExecutorData, 'report/report-executor', {
				'tenant': 'settings/account/basics/tenant',
				'tenantReport': 'report/report'
			});

			return reportExecutorData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantReportExecutor`, err);
		}
	}

	async _addTenantReportExecutor(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$ReportExecutorModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantReportExecutor`, err);
		}
	}

	async _updateTenantReportExecutor(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$ReportExecutorModel
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
				await dbSrvc.knex.raw('UPDATE tenant_report_executors SET effectivity_end = ? WHERE tenant_id = ? AND tenant_report_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_report_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$ReportExecutorModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantReportExecutor`, err);
		}
	}

	async _getTenantReportResponseFormatter(ctxt) {
		try {
			let reportResponseFormatterData = await this.$ReportResponseFormatterModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.report_response_formatter_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantReport']
			});

			reportResponseFormatterData = this._convertToJsonApiFormat(reportResponseFormatterData, 'report/report-response-formatter', {
				'tenant': 'settings/account/basics/tenant',
				'tenantReport': 'report/report'
			});

			return reportResponseFormatterData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantReportResponseFormatter`, err);
		}
	}

	async _addTenantReportResponseFormatter(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$ReportResponseFormatterModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantReportResponseFormatter`, err);
		}
	}

	async _updateTenantReportResponseFormatter(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$ReportResponseFormatterModel
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
				await dbSrvc.knex.raw('UPDATE tenant_report_response_formatters SET effectivity_end = ? WHERE tenant_id = ? AND tenant_report_id = ? AND response_type = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_report_id, jsonDeserializedData.response_type]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$ReportResponseFormatterModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantReportResponseFormatter`, err);
		}
	}

	async _getTenantReportInputTemplate(ctxt) {
		try {
			let reportTemplateData = await this.$ReportInputTemplateModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.report_input_template_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantReport']
			});

			reportTemplateData = this._convertToJsonApiFormat(reportTemplateData, 'report/report-input-template', {
				'tenant': 'settings/account/basics/tenant',
				'tenantReport': 'report/report'
			});

			return reportTemplateData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantReportInputTemplate`, err);
		}
	}

	async _addTenantReportInputTemplate(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$ReportInputTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantReportInputTemplate`, err);
		}
	}

	async _updateTenantReportInputTemplate(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$ReportInputTemplateModel
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
				await dbSrvc.knex.raw('UPDATE tenant_report_input_templates SET effectivity_end = ? WHERE tenant_id = ? AND tenant_report_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_report_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$ReportInputTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantReportInputTemplate`, err);
		}
	}

	async _getTenantReportResultTemplate(ctxt) {
		try {
			let reportTemplateData = await this.$ReportResultTemplateModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.report_result_template_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantReport']
			});

			reportTemplateData = this._convertToJsonApiFormat(reportTemplateData, 'report/report-result-template', {
				'tenant': 'settings/account/basics/tenant',
				'tenantReport': 'report/report'
			});

			return reportTemplateData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantReportResultTemplate`, err);
		}
	}

	async _addTenantReportResultTemplate(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$ReportResultTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantReportResultTemplate`, err);
		}
	}

	async _updateTenantReportResultTemplate(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$ReportResultTemplateModel
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
				await dbSrvc.knex.raw('UPDATE tenant_report_result_templates SET effectivity_end = ? WHERE tenant_id = ? AND tenant_report_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_report_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$ReportResultTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantReportResultTemplate`, err);
		}
	}

	async _getTenantReportWatcher(ctxt) {
		try {
			let reportWatcherData = await this.$ReportWatcherModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.report_watcher_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantReport', 'tenantUser']
			});

			reportWatcherData = this._convertToJsonApiFormat(reportWatcherData, 'report/report-watcher', {
				'tenant': 'settings/account/basics/tenant',
				'tenantReport': 'report/report',
				'tenantUser': 'pug/user-manager/tenant-user'
			});

			return reportWatcherData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantReportWatcher`, err);
		}
	}

	async _addTenantReportWatcher(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$ReportWatcherModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantReportWatcher`, err);
		}
	}

	async _updateTenantReportWatcher(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$ReportWatcherModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantReportWatcher`, err);
		}
	}

	async _deleteTenantReportWatcher(ctxt) {
		try {
			const reportWatcher = await this.$ReportWatcherModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.report_watcher_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!reportWatcher) throw new Error('Unknown Report User mapping');

			await reportWatcher.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantReportWatcher`, err);
		}
	}

	async _getPossibleTenantUsersList(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const possibleTenantUsers = await dbSrvc.knex.raw(`SELECT A.id, B.first_name AS "firstName", B.middle_names AS "middleNames", B.last_name AS "lastName", B.email FROM tenants_users A INNER JOIN users B ON (A.user_id = B.id) WHERE A.tenant_id = ? AND A.access_status = 'authorized' AND A.id NOT IN (SELECT tenant_user_id FROM tenant_reports_users WHERE tenant_report_id = ?)`, [ctxt.state.tenant.tenant_id, ctxt.query.report]);
			return possibleTenantUsers.rows;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getPossibleTenantUsersList`, err);
		}
	}

	async _getTenantReportAggregate(ctxt) {
		try {
			let reportAggregateData = await this.$ReportAggregateModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.report_aggregate_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantReport', 'evaluationExpression']
			});

			reportAggregateData = this._convertToJsonApiFormat(reportAggregateData, 'report/report-aggregate', {
				'tenant': 'settings/account/basics/tenant',
				'tenantReport': 'report/report',
				'evaluationExpression': 'report/attribute-set-property'
			});

			return reportAggregateData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantReportAggregate`, err);
		}
	}

	async _addTenantReportAggregate(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');
			if(jsonDeserializedData.internal_tag !== undefined && jsonDeserializedData.internal_tag !== null && jsonDeserializedData.internal_tag.trim() === '') throw new Error('Tag cannot be empty');
			if(!jsonDeserializedData.evaluation_expression_id) throw new Error('Expression cannot be empty');

			jsonDeserializedData['evaluation_expression'] = jsonDeserializedData.evaluation_expression_id;
			delete jsonDeserializedData.evaluation_expression_id;

			const savedRecord = await this.$ReportAggregateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantReportAggregate`, err);
		}
	}

	async _updateTenantReportAggregate(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');
			if(jsonDeserializedData.internal_tag !== undefined && jsonDeserializedData.internal_tag !== null && jsonDeserializedData.internal_tag.trim() === '') throw new Error('Tag cannot be empty');
			if(!jsonDeserializedData.evaluation_expression_id) throw new Error('Expression cannot be empty');

			jsonDeserializedData['evaluation_expression'] = jsonDeserializedData.evaluation_expression_id;
			delete jsonDeserializedData.evaluation_expression_id;

			const savedRecord = await this.$ReportAggregateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantReportAggregate`, err);
		}
	}

	async _deleteTenantReportAggregate(ctxt) {
		try {

			const reportAggregate = await this.$ReportAggregateModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.report_aggregate_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!reportAggregate) throw new Error('Unknown Tenant Report Aggregate');


			await reportAggregate.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantReportAggregate`, err);
		}
	}

	async _getTenantReportSchedule(ctxt) {
		try {
			let reportScheduleData = await this.$ReportScheduleModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.report_schedule_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantReport']
			});

			reportScheduleData = this._convertToJsonApiFormat(reportScheduleData, 'report/report-schedule', {
				'tenant': 'settings/account/basics/tenant',
				'tenantReport': 'report/report'
			});

			return reportScheduleData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantReportSchedule`, err);
		}
	}

	async _addTenantReportSchedule(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$ReportScheduleModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			this.$dependencies.PubsubService.publish('plantworks-realtime-push', 'SCHEDULE.UPDATE', safeJsonStringify({
				'action': 'create'
			}));

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantReportSchedule`, err);
		}
	}

	async _updateTenantReportSchedule(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$ReportScheduleModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			this.$dependencies.PubsubService.publish('plantworks-realtime-push', 'SCHEDULE.UPDATE', safeJsonStringify({
				'action': 'update'
			}));

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantReportSchedule`, err);
		}
	}

	async _deleteTenantReportSchedule(ctxt) {
		try {
			const reportSchedule = await this.$ReportScheduleModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.report_schedule_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!reportSchedule) throw new Error('Unknown Tenant Report Schedule');

			await reportSchedule.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantReportSchedule`, err);
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
