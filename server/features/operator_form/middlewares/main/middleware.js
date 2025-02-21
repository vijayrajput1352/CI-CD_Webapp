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
 * @classdesc The Plant.Works Web Application Operator Forms Main middleware - manages CRUD for operatorForms/operatorForms.
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

					'operatorForms': function() {
						return this.hasMany(self.$TenantOperatorFormModel, 'tenant_folder_id');
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

			Object.defineProperty(this, '$TenantOperatorFormModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_operator_forms',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'folder': function() {
						return this.belongsTo(self.$TenantFolderModel, 'tenant_folder_id');
					},

					'attributeSets': function() {
						return this.hasMany(self.$OperatorFormAttributeSetModel, 'tenant_operator_form_id');
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

			Object.defineProperty(this, '$OperatorFormAttributeSetModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_operator_forms_attribute_sets',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantAttributeSet': function() {
						return this.belongsTo(self.$TenantAttributeSetModel, 'tenant_attribute_set_id');
					},

					'tenantOperatorForm': function() {
						return this.belongsTo(self.$TenantOperatorFormModel, 'tenant_operator_form_id');
					}
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
		delete this.$OperatorFormAttributeSetModel;
		delete this.$TenantOperatorFormModel;

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

			await ApiService.add(`${this.name}::getTenantOperatorForm`, this._getTenantOperatorForm.bind(this));
			await ApiService.add(`${this.name}::getAllTenantOperatorForms`, this._getAllTenantOperatorForms.bind(this));
			await ApiService.add(`${this.name}::addTenantOperatorForm`, this._addTenantOperatorForm.bind(this));
			await ApiService.add(`${this.name}::updateTenantOperatorForm`, this._updateTenantOperatorForm.bind(this));
			await ApiService.add(`${this.name}::deleteTenantOperatorForm`, this._deleteTenantOperatorForm.bind(this));

			await ApiService.add(`${this.name}::getTenantOperatorFormAttributeSet`, this._getTenantOperatorFormAttributeSet.bind(this));
			await ApiService.add(`${this.name}::addTenantOperatorFormAttributeSet`, this._addTenantOperatorFormAttributeSet.bind(this));
			await ApiService.add(`${this.name}::updateTenantOperatorFormAttributeSet`, this._updateTenantOperatorFormAttributeSet.bind(this));
			await ApiService.add(`${this.name}::deleteTenantOperatorFormAttributeSet`, this._deleteTenantOperatorFormAttributeSet.bind(this));

			await ApiService.add(`${this.name}::getTenantOperatorFormRequestFormatter`, this._getTenantOperatorFormRequestFormatter.bind(this));
			await ApiService.add(`${this.name}::addTenantOperatorFormRequestFormatter`, this._addTenantOperatorFormRequestFormatter.bind(this));
			await ApiService.add(`${this.name}::updateTenantOperatorFormRequestFormatter`, this._updateTenantOperatorFormRequestFormatter.bind(this));

			await ApiService.add(`${this.name}::getTenantOperatorFormExecutor`, this._getTenantOperatorFormExecutor.bind(this));
			await ApiService.add(`${this.name}::addTenantOperatorFormExecutor`, this._addTenantOperatorFormExecutor.bind(this));
			await ApiService.add(`${this.name}::updateTenantOperatorFormExecutor`, this._updateTenantOperatorFormExecutor.bind(this));

			await ApiService.add(`${this.name}::getTenantOperatorFormResponseFormatter`, this._getTenantOperatorFormResponseFormatter.bind(this));
			await ApiService.add(`${this.name}::addTenantOperatorFormResponseFormatter`, this._addTenantOperatorFormResponseFormatter.bind(this));
			await ApiService.add(`${this.name}::updateTenantOperatorFormResponseFormatter`, this._updateTenantOperatorFormResponseFormatter.bind(this));

			await ApiService.add(`${this.name}::getTenantOperatorFormInputTemplate`, this._getTenantOperatorFormInputTemplate.bind(this));
			await ApiService.add(`${this.name}::addTenantOperatorFormInputTemplate`, this._addTenantOperatorFormInputTemplate.bind(this));
			await ApiService.add(`${this.name}::updateTenantOperatorFormInputTemplate`, this._updateTenantOperatorFormInputTemplate.bind(this));

			await ApiService.add(`${this.name}::getTenantOperatorFormResultTemplate`, this._getTenantOperatorFormResultTemplate.bind(this));
			await ApiService.add(`${this.name}::addTenantOperatorFormResultTemplate`, this._addTenantOperatorFormResultTemplate.bind(this));
			await ApiService.add(`${this.name}::updateTenantOperatorFormResultTemplate`, this._updateTenantOperatorFormResultTemplate.bind(this));

			await ApiService.add(`${this.name}::getWorkOrderOperatorFormDetails`, this._getWorkOrderOperatorFormDetails.bind(this));

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

			await ApiService.remove(`${this.name}::getWorkOrderOperatorFormDetails`, this._getWorkOrderOperatorFormDetails.bind(this));

			await ApiService.remove(`${this.name}::updateTenantOperatorFormResultTemplate`, this._updateTenantOperatorFormResultTemplate.bind(this));
			await ApiService.remove(`${this.name}::addTenantOperatorFormResultTemplate`, this._addTenantOperatorFormResultTemplate.bind(this));
			await ApiService.remove(`${this.name}::getTenantOperatorFormResultTemplate`, this._getTenantOperatorFormResultTemplate.bind(this));

			await ApiService.remove(`${this.name}::updateTenantOperatorFormInputTemplate`, this._updateTenantOperatorFormInputTemplate.bind(this));
			await ApiService.remove(`${this.name}::addTenantOperatorFormInputTemplate`, this._addTenantOperatorFormInputTemplate.bind(this));
			await ApiService.remove(`${this.name}::getTenantOperatorFormInputTemplate`, this._getTenantOperatorFormInputTemplate.bind(this));

			await ApiService.remove(`${this.name}::updateTenantOperatorFormResponseFormatter`, this._updateTenantOperatorFormResponseFormatter.bind(this));
			await ApiService.remove(`${this.name}::addTenantOperatorFormResponseFormatter`, this._addTenantOperatorFormResponseFormatter.bind(this));
			await ApiService.remove(`${this.name}::getTenantOperatorFormResponseFormatter`, this._getTenantOperatorFormResponseFormatter.bind(this));

			await ApiService.remove(`${this.name}::updateTenantOperatorFormExecutor`, this._updateTenantOperatorFormExecutor.bind(this));
			await ApiService.remove(`${this.name}::addTenantOperatorFormExecutor`, this._addTenantOperatorFormExecutor.bind(this));
			await ApiService.remove(`${this.name}::getTenantOperatorFormExecutor`, this._getTenantOperatorFormExecutor.bind(this));

			await ApiService.remove(`${this.name}::updateTenantOperatorFormRequestFormatter`, this._updateTenantOperatorFormRequestFormatter.bind(this));
			await ApiService.remove(`${this.name}::addTenantOperatorFormRequestFormatter`, this._addTenantOperatorFormRequestFormatter.bind(this));
			await ApiService.remove(`${this.name}::getTenantOperatorFormRequestFormatter`, this._getTenantOperatorFormRequestFormatter.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantOperatorFormAttributeSet`, this._deleteTenantOperatorFormAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::updateTenantOperatorFormAttributeSet`, this._updateTenantOperatorFormAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::addTenantOperatorFormAttributeSet`, this._addTenantOperatorFormAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::getTenantOperatorFormAttributeSet`, this._getTenantOperatorFormAttributeSet.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantOperatorForm`, this._deleteTenantOperatorForm.bind(this));
			await ApiService.remove(`${this.name}::updateTenantOperatorForm`, this._updateTenantOperatorForm.bind(this));
			await ApiService.remove(`${this.name}::addTenantOperatorForm`, this._addTenantOperatorForm.bind(this));
			await ApiService.remove(`${this.name}::getAllTenantOperatorForms`, this._getAllTenantOperatorForms.bind(this));
			await ApiService.remove(`${this.name}::getTenantOperatorForm`, this._getTenantOperatorForm.bind(this));

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
							'configsRoute': 'configure.operator-form',
							'dataUrl': '/operator-form/config-tree-nodes',
							'intl': true,
							'type': folder.name === 'operator_form_feature.folder_names.attribute_sets.name' ? 'attribute-folder' : 'operator-form-folder'
						}
					};
				});

				return tenantFolders;
			}

			if(['attribute-folder', 'operator-form-folder'].includes(ctxt.query.node_type)) {
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
							'configsRoute': 'configure.operator-form',
							'dataUrl': '/operator-form/config-tree-nodes',
							'intl': false,
							'type': ctxt.query.node_type
						}
					};
				});

				// Get the operator-forms in this folder
				let tenantOperatorForms = await dbSrvc.knex.raw(`SELECT id, tenant_folder_id AS parent_id, name FROM tenant_operator_forms WHERE tenant_folder_id  = ?`, [ctxt.query.node_id]);
				tenantOperatorForms = tenantOperatorForms.rows.map((operatorForm) => {
					return {
						'id': operatorForm.id,
						'parent': operatorForm.parent_id,
						'text': operatorForm.name,
						'children': false,

						'li_attr': {
							'title': operatorForm.name
						},

						'data': {
							'configsRoute': 'configure.operator-form',
							'dataUrl': '/operator-form/config-tree-nodes',
							'type': 'operator-form'
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
							'configsRoute': 'configure.operator-form',
							'dataUrl': '/operator-form/config-tree-nodes',
							'type': 'attribute-set'
						}
					};
				});

				return [...tenantFolders, ...tenantOperatorForms, ...tenantAttributeSets];
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
							'devenvRoute': 'devenv.operator-form',
							'dataUrl': '/operator-form/devenv-tree-nodes',
							'intl': true,
							'type': folder.name === 'operator_form_feature.folder_names.attribute_sets.name' ? 'attribute-folder' : 'operator-form-folder'
						}
					};
				});

				return tenantFolders;
			}

			if(['attribute-folder', 'operator-form-folder'].includes(ctxt.query.node_type)) {
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
							'devenvRoute': 'devenv.operator-form',
							'dataUrl': '/operator-form/devenv-tree-nodes',
							'intl': false,
							'type': ctxt.query.node_type
						}
					};
				});

				// Get the operator-forms in this folder
				let tenantOperatorForms = await dbSrvc.knex.raw(`SELECT id, tenant_folder_id AS parent_id, name FROM tenant_operator_forms WHERE tenant_folder_id  = ?`, [ctxt.query.node_id]);
				tenantOperatorForms = tenantOperatorForms.rows.map((operatorForm) => {
					return {
						'id': operatorForm.id,
						'parent': operatorForm.parent_id,
						'text': operatorForm.name,
						'children': false,

						'li_attr': {
							'title': operatorForm.name
						},

						'data': {
							'devenvRoute': 'devenv.operator-form',
							'dataUrl': '/operator-form/devenv-tree-nodes',
							'type': 'operator-form'
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
							'devenvRoute': 'devenv.operator-form',
							'dataUrl': '/operator-form/devenv-tree-nodes',
							'type': 'attribute-set'
						}
					};
				});

				return [...tenantFolders, ...tenantOperatorForms, ...tenantAttributeSets];
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
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'parent', 'folders', 'operatorForms', 'attributeSets']
			});

			folderData = this._convertToJsonApiFormat(folderData, 'operator-form/folder', {
				'tenant': 'settings/account/basics/tenant',
				'parent': 'operator-form/folder',
				'folders': 'operator-form/folder',
				'operatorForms': 'operator-form/operator-form',
				'attributeSets': 'operator-form/attribute-set'
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
			const tenantFolder = await this.$TenantFolderModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params['folder_id'] })
				.andWhere({ 'tenant_id': ctxt.state.tenant['tenant_id'] });
			})
			.fetch();

			if(!tenantFolder) throw new Error('Unknown Tenant Folder');

			await tenantFolder.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantFolder`, err);
		}
	}

	async _getAllTenantAttributeSets(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			let parentFolderId = await dbSrvc.knex.raw(`SELECT id FROM tenant_folders WHERE tenant_id = ? AND name = 'operator_form_feature.folder_names.attribute_sets.name'`, [ctxt.state.tenant.tenant_id]);
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

			attributeSetData = this._convertToJsonApiFormat(attributeSetData, 'operator-form/attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'operator-form/folder',
				'properties': 'operator-form/attribute-set-property',
				'functions': 'operator-form/attribute-set-function'
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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'operator-form/attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'operator-form/folder',
				'properties': 'operator-form/attribute-set-property',
				'functions': 'operator-form/attribute-set-function'
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

			let tenantModuleId = await dbSrvc.knex.raw(`SELECT id FROM tenants_modules WHERE tenant_id = ? AND module_id = (SELECT id FROM modules  WHERE name = ? AND type = 'feature')`, [ctxt.state.tenant.tenant_id, 'OperatorForm']);
			if(!tenantModuleId.rows.length) throw new Error('OperatorForm feature not enabled for this tenant');
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
			const tenantAttributeSet = await this.$TenantAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantAttributeSet) throw new Error('Unknown Tenant Attribute Set');

			await tenantAttributeSet.destroy();
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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'operator-form/attribute-set-property', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'operator-form/attribute-set'
			});

			return attrSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAttributeSetProperty`, err);
		}
	}

	async _addTenantAttributeSetProperty(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantAttributeSetPropertyModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantAttributeSetProperty`, err);
		}
	}

	async _updateTenantAttributeSetProperty(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantAttributeSetPropertyModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantAttributeSetProperty`, err);
		}
	}

	async _deleteTenantAttributeSetProperty(ctxt) {
		try {
			const tenantAttributeSetProperty = await this.$TenantAttributeSetPropertyModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.attribute_set_property_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantAttributeSetProperty) throw new Error('Unknown Tenant Attribute Set Property');


			await tenantAttributeSetProperty.destroy();
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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'operator-form/attribute-set-function', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'operator-form/attribute-set',
				'observedProperties': 'operator-form/attribute-set-function-observed-property'
			});

			return attrSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAttributeSetFunction`, err);
		}
	}

	async _addTenantAttributeSetFunction(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantAttributeSetFunctionModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantAttributeSetFunction`, err);
		}
	}

	async _updateTenantAttributeSetFunction(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantAttributeSetFunctionModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantAttributeSetFunction`, err);
		}
	}

	async _deleteTenantAttributeSetFunction(ctxt) {
		try {
			const tenantAttributeSetFunction = await this.$TenantAttributeSetFunctionModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.attribute_set_function_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantAttributeSetFunction) throw new Error('Unknown Tenant Attribute Set Function');

			await tenantAttributeSetFunction.destroy();
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

			attrSetObservedPropertyData = this._convertToJsonApiFormat(attrSetObservedPropertyData, 'operator-form/attribute-set-function-observed-property', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'operator-form/attribute-set',
				'attributeSetFunction': 'operator-form/attribute-set-function',
				'attributeSetProperty': 'operator-form/attribute-set-property'
			});

			return attrSetObservedPropertyData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAttributeSetFunctionObservedProperty`, err);
		}
	}

	async _addTenantAttributeSetFunctionObservedProperty(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$TenantAttributeSetFunctionObservedPropertyModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantAttributeSetFunctionObservedProperty`, err);
		}
	}

	async _deleteTenantAttributeSetFunctionObservedProperty(ctxt) {
		try {
			const tenantAttributeSetFunctionObservedProperty = await this.$TenantAttributeSetFunctionObservedPropertyModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.attribute_set_function_observed_property_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantAttributeSetFunctionObservedProperty) throw new Error('Unknown Tenant Attribute Set Function Observed Property');

			await tenantAttributeSetFunctionObservedProperty.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantAttributeSetFunctionObservedProperty`, err);
		}
	}

	async _getTenantOperatorForm(ctxt) {
		try {
			let operatorFormData = await this.$TenantOperatorFormModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.operator_form_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'attributeSets', 'requestFormatters', 'executors', 'responseFormatters', 'inputTemplates', 'resultTemplates']
			});

			operatorFormData = this._convertToJsonApiFormat(operatorFormData, 'operator-form/operator-form', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'operator-form/folder',
				'attributeSets': 'operator-form/operator-form-attribute-set',
				'requestFormatters': 'operator-form/operator-form-request-formatter',
				'executors': 'operator-form/operator-form-executor',
				'responseFormatters': 'operator-form/operator-form-response-formatter',
				'inputTemplates': 'operator-form/operator-form-input-template',
				'resultTemplates': 'operator-form/operator-form-result-template'
			});

			return operatorFormData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantOperatorForm`, err);
		}
	}

	async _getAllTenantOperatorForms(ctxt) {
		try {
			let operatorFormData = await this.$TenantOperatorFormModel
			.query(function(qb) {
				qb.where({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetchAll({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'attributeSets', 'requestFormatters', 'executors', 'responseFormatters', 'inputTemplates', 'resultTemplates']
			});

			operatorFormData = this._convertToJsonApiFormat(operatorFormData, 'operator-form/operator-form', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'operator-form/folder',
				'attributeSets': 'operator-form/operator-form-attribute-set',
				'requestFormatters': 'operator-form/operator-form-request-formatter',
				'executors': 'operator-form/operator-form-executor',
				'responseFormatters': 'operator-form/operator-form-response-formatter',
				'inputTemplates': 'operator-form/operator-form-input-template',
				'resultTemplates': 'operator-form/operator-form-result-template'
			});

			return operatorFormData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllTenantOperatorForms`, err);
		}
	}

	async _addTenantOperatorForm(ctxt) {
		try {
			const pubsubService = this.$dependencies.PubsubService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const savedRecord = await this.$TenantOperatorFormModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const schemaChangePayload = JSON.stringify({
				'id': savedRecord.get('id'),
				'sub_domain': ctxt.state.tenant['sub_domain'],
				'tenant_id': ctxt.state.tenant['tenant_id'],
				'type': 'opform'
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantOperatorForm`, err);
		}
	}

	async _updateTenantOperatorForm(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const savedRecord = await this.$TenantOperatorFormModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantOperatorForm`, err);
		}
	}

	async _deleteTenantOperatorForm(ctxt) {
		try {
			const tenantOperatorForm = await this.$TenantOperatorFormModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.operator_form_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantOperatorForm) throw new Error('Unknown Tenant OperatorForm');

			await tenantOperatorForm.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantOperatorForm`, err);
		}
	}

	async _getTenantOperatorFormAttributeSet(ctxt) {
		try {
			let operatorFormAttributeSetData = await this.$OperatorFormAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.operator_form_attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantAttributeSet', 'tenantOperatorForm']
			});

			operatorFormAttributeSetData = this._convertToJsonApiFormat(operatorFormAttributeSetData, 'operator-form/operator-form-attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'tenantAttributeSet': 'operator-form/attribute-set',
				'tenantOperatorForm': 'operator-form/operator-form'
			});

			return operatorFormAttributeSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantOperatorFormAttributeSet`, err);
		}
	}

	async _addTenantOperatorFormAttributeSet(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$OperatorFormAttributeSetModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantOperatorFormAttributeSet`, err);
		}
	}

	async _updateTenantOperatorFormAttributeSet(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$OperatorFormAttributeSetModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantOperatorFormAttributeSet`, err);
		}
	}

	async _deleteTenantOperatorFormAttributeSet(ctxt) {
		try {
			const operatorFormAttributeSet = await this.$OperatorFormAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.operator_form_attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!operatorFormAttributeSet) throw new Error('Unknown Tenant OperatorForm Attribute Set');

			await operatorFormAttributeSet.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantOperatorFormAttributeSet`, err);
		}
	}

	async _getTenantOperatorFormRequestFormatter(ctxt) {
		try {
			let operatorFormRequestFormatterData = await this.$OperatorFormRequestFormatterModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.operator_form_request_formatter_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantOperatorForm']
			});

			operatorFormRequestFormatterData = this._convertToJsonApiFormat(operatorFormRequestFormatterData, 'operator-form/operator-form-request-formatter', {
				'tenant': 'settings/account/basics/tenant',
				'tenantOperatorForm': 'operator-form/operator-form'
			});

			return operatorFormRequestFormatterData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantOperatorFormRequestFormatter`, err);
		}
	}

	async _addTenantOperatorFormRequestFormatter(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$OperatorFormRequestFormatterModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantOperatorFormRequestFormatter`, err);
		}
	}

	async _updateTenantOperatorFormRequestFormatter(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$OperatorFormRequestFormatterModel
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
				await dbSrvc.knex.raw('UPDATE tenant_operator_form_request_formatters SET effectivity_end = ? WHERE tenant_id = ? AND tenant_operator_form_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_operator_form_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$OperatorFormRequestFormatterModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantOperatorFormRequestFormatter`, err);
		}
	}

	async _getTenantOperatorFormExecutor(ctxt) {
		try {
			let operatorFormExecutorData = await this.$OperatorFormExecutorModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.operator_form_executor_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantOperatorForm']
			});

			operatorFormExecutorData = this._convertToJsonApiFormat(operatorFormExecutorData, 'operator-form/operator-form-executor', {
				'tenant': 'settings/account/basics/tenant',
				'tenantOperatorForm': 'operator-form/operator-form'
			});

			return operatorFormExecutorData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantOperatorFormExecutor`, err);
		}
	}

	async _addTenantOperatorFormExecutor(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$OperatorFormExecutorModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantOperatorFormExecutor`, err);
		}
	}

	async _updateTenantOperatorFormExecutor(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$OperatorFormExecutorModel
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
				await dbSrvc.knex.raw('UPDATE tenant_operator_form_executors SET effectivity_end = ? WHERE tenant_id = ? AND tenant_operator_form_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_operator_form_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$OperatorFormExecutorModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantOperatorFormExecutor`, err);
		}
	}

	async _getTenantOperatorFormResponseFormatter(ctxt) {
		try {
			let operatorFormResponseFormatterData = await this.$OperatorFormResponseFormatterModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.operator_form_response_formatter_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantOperatorForm']
			});

			operatorFormResponseFormatterData = this._convertToJsonApiFormat(operatorFormResponseFormatterData, 'operator-form/operator-form-response-formatter', {
				'tenant': 'settings/account/basics/tenant',
				'tenantOperatorForm': 'operator-form/operator-form'
			});

			return operatorFormResponseFormatterData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantOperatorFormResponseFormatter`, err);
		}
	}

	async _addTenantOperatorFormResponseFormatter(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$OperatorFormResponseFormatterModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantOperatorFormResponseFormatter`, err);
		}
	}

	async _updateTenantOperatorFormResponseFormatter(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$OperatorFormResponseFormatterModel
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
				await dbSrvc.knex.raw('UPDATE tenant_operator_form_response_formatters SET effectivity_end = ? WHERE tenant_id = ? AND tenant_operator_form_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_operator_form_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$OperatorFormResponseFormatterModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantOperatorFormResponseFormatter`, err);
		}
	}

	async _getTenantOperatorFormInputTemplate(ctxt) {
		try {
			let operatorFormTemplateData = await this.$OperatorFormInputTemplateModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.operator_form_input_template_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantOperatorForm']
			});

			operatorFormTemplateData = this._convertToJsonApiFormat(operatorFormTemplateData, 'operator-form/operator-form-input-template', {
				'tenant': 'settings/account/basics/tenant',
				'tenantOperatorForm': 'operator-form/operator-form'
			});

			return operatorFormTemplateData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantOperatorFormInputTemplate`, err);
		}
	}

	async _addTenantOperatorFormInputTemplate(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$OperatorFormInputTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantOperatorFormInputTemplate`, err);
		}
	}

	async _updateTenantOperatorFormInputTemplate(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$OperatorFormInputTemplateModel
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
				await dbSrvc.knex.raw('UPDATE tenant_operator_form_input_templates SET effectivity_end = ? WHERE tenant_id = ? AND tenant_operator_form_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_operator_form_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$OperatorFormInputTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantOperatorFormInputTemplate`, err);
		}
	}

	async _getTenantOperatorFormResultTemplate(ctxt) {
		try {
			let operatorFormTemplateData = await this.$OperatorFormResultTemplateModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.operator_form_result_template_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantOperatorForm']
			});

			operatorFormTemplateData = this._convertToJsonApiFormat(operatorFormTemplateData, 'operator-form/operator-form-result-template', {
				'tenant': 'settings/account/basics/tenant',
				'tenantOperatorForm': 'operator-form/operator-form'
			});

			return operatorFormTemplateData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantOperatorFormResultTemplate`, err);
		}
	}

	async _addTenantOperatorFormResultTemplate(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$OperatorFormResultTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantOperatorFormResultTemplate`, err);
		}
	}

	async _updateTenantOperatorFormResultTemplate(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$OperatorFormResultTemplateModel
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
				await dbSrvc.knex.raw('UPDATE tenant_operator_form_result_templates SET effectivity_end = ? WHERE tenant_id = ? AND tenant_operator_form_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_operator_form_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$OperatorFormResultTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantOperatorFormResultTemplate`, err);
		}
	}

	async _getWorkOrderOperatorFormDetails(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const timescale = this.$dependencies.TimescaleService;

			if(!ctxt.query.operatorFormId)
				throw new Error('null/undefined operator form id');

			if(!ctxt.query.machineId)
				throw new Error('null/undefined machine id');

			let lastEventTimestamp = await dbSrvc.knex.raw('SELECT event_timestamp FROM tenant_plant_unit_line_events WHERE tenant_plant_unit_line_id IN (SELECT tenant_plant_unit_line_id FROM tenant_plant_unit_line_constituents WHERE tenant_plant_unit_line_constituent_id = ? AND tenant_id = ?) ORDER BY event_timestamp DESC LIMIT 1 ', [ctxt.query.machineId, ctxt.state.tenant.tenant_id]);

			if(!lastEventTimestamp || !lastEventTimestamp.rows || !lastEventTimestamp.rows.length)
				return [];

			lastEventTimestamp = moment(lastEventTimestamp.rows[0].event_timestamp).format();

			const formData = await timescale.knex.raw(`SELECT inserted_at, values FROM ${ctxt.state.tenant['sub_domain']}.opform_${ctxt.query.operatorFormId.replace(/-/g, '_')} WHERE inserted_at >= ? AND values @> ? ORDER BY inserted_at`, [
				lastEventTimestamp,
				safeJsonStringify({
					'MACHINE_ID': ctxt.query.machineId
				})
			]);

			const values = formData.rows.map((row) => {
				row.values['inserted_at'] = row['inserted_at'];
				return row.values;
			});

			return values;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getWorkOrderOperatorFormDetails`, err);
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
		return ['DatabaseService', 'PubsubService'].concat(super.dependencies);
	}
	// #endregion
}

exports.middleware = Main;
