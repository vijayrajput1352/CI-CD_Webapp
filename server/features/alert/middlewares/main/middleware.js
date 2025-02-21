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
 * @classdesc The Plant.Works Web Application Alerts Main middleware - manages CRUD for alerts.
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

					'alerts': function() {
						return this.hasMany(self.$TenantAlertModel, 'tenant_folder_id');
					},

					'attributeSets': function() {
						return this.hasMany(self.$TenantAttributeSetModel, 'tenant_folder_id');
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

			Object.defineProperty(this, '$TenantAlertModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_alerts',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'folder': function() {
						return this.belongsTo(self.$TenantFolderModel, 'tenant_folder_id');
					},

					'processors': function() {
						return this.hasMany(self.$AlertProcessorModel, 'tenant_alert_id');
					},

					'responseFormatters': function() {
						return this.hasMany(self.$AlertResponseFormatterModel, 'tenant_alert_id');
					},

					'attributeSets': function() {
						return this.hasMany(self.$AlertAttributeSetModel, 'tenant_alert_id');
					},

					'constituents': function() {
						return this.hasMany(self.$AlertConstituentModel, 'tenant_alert_id');
					},

					'watchers': function() {
						return this.hasMany(self.$AlertWatcherModel, 'tenant_alert_id');
					}
				}, {
					'jsonColumns': ['attribute_set_metadata', 'escalation_levels', 'response_types']
				})
			});

			Object.defineProperty(this, '$AlertAttributeSetModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_alerts_attribute_sets',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantAttributeSet': function() {
						return this.belongsTo(self.$TenantAttributeSetModel, 'tenant_attribute_set_id');
					},

					'tenantAlert': function() {
						return this.belongsTo(self.$TenantAlertModel, 'tenant_alert_id');
					}
				})
			});

			Object.defineProperty(this, '$AlertProcessorModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_alert_processors',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantAlert': function() {
						return this.belongsTo(self.$TenantAlertModel, 'tenant_alert_id');
					}
				})
			});

			Object.defineProperty(this, '$AlertResponseFormatterModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_alert_response_formatters',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantAlert': function() {
						return this.belongsTo(self.$TenantAlertModel, 'tenant_alert_id');
					}
				})
			});

			Object.defineProperty(this, '$AlertConstituentModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_alert_constituents',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantAlert': function() {
						return this.belongsTo(self.$TenantAlertModel, 'tenant_alert_id');
					}
				})
			});

			Object.defineProperty(this, '$AlertWatcherModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_alerts_users',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantAlert': function() {
						return this.belongsTo(self.$TenantAlertModel, 'tenant_alert_id');
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
		delete this.$AlertWatcherModel;
		delete this.$AlertConstituentModel;
		delete this.$AlertProcessorModel;

		delete this.$AlertAttributeSetModel;
		delete this.$TenantAlertModel;

		delete this.$TenantAttributeSetFunctionObservedPropertyModel;
		delete this.$TenantAttributeSetFunctionModel;
		delete this.$TenantAttributeSetPropertyModel;
		delete this.$TenantAttributeSetModel;

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

			await ApiService.add(`${this.name}::getTenantAlert`, this._getTenantAlert.bind(this));
			await ApiService.add(`${this.name}::getAllTenantAlerts`, this._getAllTenantAlerts.bind(this));
			await ApiService.add(`${this.name}::addTenantAlert`, this._addTenantAlert.bind(this));
			await ApiService.add(`${this.name}::updateTenantAlert`, this._updateTenantAlert.bind(this));
			await ApiService.add(`${this.name}::deleteTenantAlert`, this._deleteTenantAlert.bind(this));

			await ApiService.add(`${this.name}::getTenantAlertProcessor`, this._getTenantAlertProcessor.bind(this));
			await ApiService.add(`${this.name}::addTenantAlertProcessor`, this._addTenantAlertProcessor.bind(this));
			await ApiService.add(`${this.name}::updateTenantAlertProcessor`, this._updateTenantAlertProcessor.bind(this));

			await ApiService.add(`${this.name}::getTenantAlertResponseFormatter`, this._getTenantAlertResponseFormatter.bind(this));
			await ApiService.add(`${this.name}::addTenantAlertResponseFormatter`, this._addTenantAlertResponseFormatter.bind(this));
			await ApiService.add(`${this.name}::updateTenantAlertResponseFormatter`, this._updateTenantAlertResponseFormatter.bind(this));

			await ApiService.add(`${this.name}::getTenantAlertAttributeSet`, this._getTenantAlertAttributeSet.bind(this));
			await ApiService.add(`${this.name}::addTenantAlertAttributeSet`, this._addTenantAlertAttributeSet.bind(this));
			await ApiService.add(`${this.name}::updateTenantAlertAttributeSet`, this._updateTenantAlertAttributeSet.bind(this));
			await ApiService.add(`${this.name}::deleteTenantAlertAttributeSet`, this._deleteTenantAlertAttributeSet.bind(this));

			await ApiService.add(`${this.name}::getTenantAlertConstituent`, this._getTenantAlertConstituent.bind(this));
			await ApiService.add(`${this.name}::addTenantAlertConstituent`, this._addTenantAlertConstituent.bind(this));
			await ApiService.add(`${this.name}::deleteTenantAlertConstituent`, this._deleteTenantAlertConstituent.bind(this));

			await ApiService.add(`${this.name}::getTenantAlertWatcher`, this._getTenantAlertWatcher.bind(this));
			await ApiService.add(`${this.name}::addTenantAlertWatcher`, this._addTenantAlertWatcher.bind(this));
			await ApiService.add(`${this.name}::updateTenantAlertWatcher`, this._updateTenantAlertWatcher.bind(this));
			await ApiService.add(`${this.name}::deleteTenantAlertWatcher`, this._deleteTenantAlertWatcher.bind(this));

			await ApiService.add(`${this.name}::possibleTenantUsersList`, this._getPossibleTenantUsersList.bind(this));
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
			await ApiService.remove(`${this.name}::possibleTenantUsersList`, this._getPossibleTenantUsersList.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantAlertWatcher`, this._deleteTenantAlertWatcher.bind(this));
			await ApiService.remove(`${this.name}::updateTenantAlertWatcher`, this._updateTenantAlertWatcher.bind(this));
			await ApiService.remove(`${this.name}::addTenantAlertWatcher`, this._addTenantAlertWatcher.bind(this));
			await ApiService.remove(`${this.name}::getTenantAlertWatcher`, this._getTenantAlertWatcher.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantAlertConstituent`, this._deleteTenantAlertConstituent.bind(this));
			await ApiService.remove(`${this.name}::addTenantAlertConstituent`, this._addTenantAlertConstituent.bind(this));
			await ApiService.remove(`${this.name}::getTenantAlertConstituent`, this._getTenantAlertConstituent.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantAlertAttributeSet`, this._deleteTenantAlertAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::updateTenantAlertAttributeSet`, this._updateTenantAlertAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::addTenantAlertAttributeSet`, this._addTenantAlertAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::getTenantAlertAttributeSet`, this._getTenantAlertAttributeSet.bind(this));

			await ApiService.remove(`${this.name}::updateTenantAlertResponseFormatter`, this._updateTenantAlertResponseFormatter.bind(this));
			await ApiService.remove(`${this.name}::addTenantAlertResponseFormatter`, this._addTenantAlertResponseFormatter.bind(this));
			await ApiService.remove(`${this.name}::getTenantAlertResponseFormatter`, this._getTenantAlertResponseFormatter.bind(this));

			await ApiService.remove(`${this.name}::updateTenantAlertProcessor`, this._updateTenantAlertProcessor.bind(this));
			await ApiService.remove(`${this.name}::addTenantAlertProcessor`, this._addTenantAlertProcessor.bind(this));
			await ApiService.remove(`${this.name}::getTenantAlertProcessor`, this._getTenantAlertProcessor.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantAlert`, this._deleteTenantAlert.bind(this));
			await ApiService.remove(`${this.name}::updateTenantAlert`, this._updateTenantAlert.bind(this));
			await ApiService.remove(`${this.name}::addTenantAlert`, this._addTenantAlert.bind(this));
			await ApiService.remove(`${this.name}::getAllTenantAlerts`, this._getAllTenantAlerts.bind(this));
			await ApiService.remove(`${this.name}::getTenantAlert`, this._getTenantAlert.bind(this));

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
							'configsRoute': 'configure.alert',
							'dataUrl': '/alert/config-tree-nodes',
							'intl': true,
							'type': folder.name === 'alert_feature.folder_names.attribute_sets.name' ? 'attribute-folder' : 'alert-folder'
						}
					};
				});

				return tenantFolders;
			}

			if(['attribute-folder', 'alert-folder'].includes(ctxt.query.node_type)) {
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
							'configsRoute': 'configure.alert',
							'dataUrl': '/alert/config-tree-nodes',
							'intl': false,
							'type': ctxt.query.node_type
						}
					};
				});

				// Get the alerts in this folder
				let tenantAlerts = await dbSrvc.knex.raw(`SELECT id, tenant_folder_id AS parent_id, name FROM tenant_alerts WHERE tenant_folder_id  = ?`, [ctxt.query.node_id]);
				tenantAlerts = tenantAlerts.rows.map((alert) => {
					return {
						'id': alert.id,
						'parent': alert.parent_id,
						'text': alert.name,
						'children': false,

						'li_attr': {
							'title': alert.name
						},

						'data': {
							'configsRoute': 'configure.alert',
							'dataUrl': '/alert/config-tree-nodes',
							'type': 'alert'
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
							'configsRoute': 'configure.alert',
							'dataUrl': '/alert/config-tree-nodes',
							'type': 'attribute-set'
						}
					};
				});

				return [...tenantFolders, ...tenantAlerts, ...tenantAttributeSets];
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
							'devenvRoute': 'devenv.alert',
							'dataUrl': '/alert/devenv-tree-nodes',
							'intl': true,
							'type': folder.name === 'alert_feature.folder_names.attribute_sets.name' ? 'attribute-folder' : 'alert-folder'
						}
					};
				});

				return tenantFolders;
			}

			if(['attribute-folder', 'alert-folder'].includes(ctxt.query.node_type)) {
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
							'devenvRoute': 'devenv.alert',
							'dataUrl': '/alert/devenv-tree-nodes',
							'intl': false,
							'type': ctxt.query.node_type
						}
					};
				});

				// Get the alerts in this folder
				let tenantAlerts = await dbSrvc.knex.raw(`SELECT id, tenant_folder_id AS parent_id, name FROM tenant_alerts WHERE tenant_folder_id  = ?`, [ctxt.query.node_id]);
				tenantAlerts = tenantAlerts.rows.map((alert) => {
					return {
						'id': alert.id,
						'parent': alert.parent_id,
						'text': alert.name,
						'children': false,

						'li_attr': {
							'title': alert.name
						},

						'data': {
							'devenvRoute': 'devenv.alert',
							'dataUrl': '/alert/devenv-tree-nodes',
							'type': 'alert'
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
							'devenvRoute': 'devenv.alert',
							'dataUrl': '/alert/devenv-tree-nodes',
							'type': 'attribute-set'
						}
					};
				});

				return [...tenantFolders, ...tenantAlerts, ...tenantAttributeSets];
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
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'parent', 'folders', 'alerts', 'attributeSets']
			});

			folderData = this._convertToJsonApiFormat(folderData, 'alert/folder', {
				'tenant': 'settings/account/basics/tenant',
				'parent': 'alert/folder',
				'folders': 'alert/folder',
				'alerts': 'alert/alert',
				'attributeSets': 'alert/attribute-set'
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

			// determine if attrset folder or alerts folder
			const attrSetsRootFolderName = 'alert_feature.folder_names.attribute_sets.name';

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
				// update db and cached rendered processor of alerts which using folder attr sets
				const folderAttrSets = await dbSrvc.knex.raw(`SELECT id FROM tenant_attribute_sets WHERE tenant_folder_id IN (${folderDescendants.rows.map(() => { return '?'; }).join(',')})`, folderDescendants.rows.map((f) => { return f['id']; }));
				const folderAttrSetsAlerts = await dbSrvc.knex.raw(`SELECT tenant_alert_id AS id FROM tenant_alerts_attribute_sets WHERE tenant_attribute_set_id IN (SELECT id FROM tenant_attribute_sets WHERE tenant_folder_id IN (${folderDescendants.rows.map(() => { return '?'; }).join(',')}))`, folderDescendants.rows.map((f) => { return f['id']; }));

				await tenantFolder.destroy();

				for(let idx = 0; idx < folderAttrSets.rows.length; idx++) {
					const folderAttrSet = folderAttrSets.rows[idx];
					const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderAttrSet.id, 'attrSet']);
					cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());
				}

				for(let idx = 0; idx < folderAttrSetsAlerts.rows.length; idx++) {
					const folderAttrSetsAlert = folderAttrSetsAlerts.rows[idx];
					await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [folderAttrSetsAlert.id, 'alert', ctxt.state.tenant['tenant_id']]);
					const alertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderAttrSetsAlert.id, 'alert']);
					cachedArtifacts = cachedArtifacts.concat(alertArtifacts.shift());
				}
			}
			else {
				// delete cached rendered processor of alert within folder
				// update rendered processor of deleted alert constituents
				const folderAlerts = await dbSrvc.knex.raw(`SELECT id FROM tenant_alerts WHERE tenant_folder_id IN (${folderDescendants.rows.map(() => { return '?'; }).join(',')});`, folderDescendants.rows.map((f) => { return f['id']; }));
				const folderAlertConstituents = await dbSrvc.knex.raw(`SELECT id, type FROM tenant_alert_constituents WHERE tenant_alert_id IN (${folderAlerts.rows.map(() => { return '?'; }).join(',')});`, folderAlerts.rows.map((f) => { return f['id']; }));

				await tenantFolder.destroy();

				for(let idx = 0; idx < folderAlerts.rows.length; idx++) {
					const folderAlert = folderAlerts.rows[idx];
					const alertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderAlert.id, 'alert']);
					cachedArtifacts = cachedArtifacts.concat(alertArtifacts.shift());
				}

				for(let idx = 0; idx < folderAlertConstituents.rows.length; idx++) {
					const folderAlertConstituent = folderAlertConstituents.rows[idx];
					const constituentArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderAlertConstituent.id, folderAlertConstituent.type]);
					cachedArtifacts = cachedArtifacts.concat(constituentArtifacts.shift());
					await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [folderAlertConstituent.id, folderAlertConstituent.type, ctxt.state.tenant['tenant_id']]);
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
			let parentFolderId = await dbSrvc.knex.raw(`SELECT id FROM tenant_folders WHERE tenant_id = ? AND name = 'alert_feature.folder_names.attribute_sets.name'`, [ctxt.state.tenant.tenant_id]);
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

			attributeSetData = this._convertToJsonApiFormat(attributeSetData, 'alert/attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'alert/folder',
				'properties': 'alert/attribute-set-property',
				'functions': 'alert/attribute-set-function'
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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'alert/attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'alert/folder',
				'properties': 'alert/attribute-set-property',
				'functions': 'alert/attribute-set-function'
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

			let tenantModuleId = await dbSrvc.knex.raw(`SELECT id FROM tenants_modules WHERE tenant_id = ? AND module_id = (SELECT id FROM modules WHERE name = ? AND type = 'feature')`, [ctxt.state.tenant.tenant_id, 'Alert']);
			if(!tenantModuleId.rows.length) throw new Error('Alert feature not enabled for this tenant');
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

			const attrSetAlerts = await dbSrvc.knex.raw(`SELECT tenant_alert_id AS id FROM tenant_alerts_attribute_sets WHERE tenant_attribute_set_id = ?`, [ctxt.params['attribute_set_id']]);

			await tenantAttributeSet.destroy();

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [ctxt.params.attribute_set_id, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetAlerts.rows.length; idx++) {
				const attrSetAlert = attrSetAlerts.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetAlert.id, 'alert', ctxt.state.tenant['tenant_id']]);
				const alertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetAlert.id, 'alert']);
				cachedArtifacts = cachedArtifacts.concat(alertArtifacts.shift());
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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'alert/attribute-set-property', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'alert/attribute-set'
			});

			return attrSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAttributeSetProperty`, err);
		}
	}

	async _addTenantAttributeSetProperty(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantAttributeSetPropertyModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const attributeSetId = savedRecord.get('attribute_set_id');
			const attrSetAlerts = await dbSrvc.knex.raw(`SELECT tenant_alert_id AS id FROM tenant_alerts_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetAlerts.rows.length; idx++) {
				const attrSetAlert = attrSetAlerts.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetAlert.id, 'alert', ctxt.state.tenant['tenant_id']]);
				const alertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetAlert.id, 'alert']);
				cachedArtifacts = cachedArtifacts.concat(alertArtifacts.shift());
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
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantAttributeSetPropertyModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			const attributeSetId = savedRecord.get('attribute_set_id');
			const attrSetAlerts = await dbSrvc.knex.raw(`SELECT tenant_alert_id AS id FROM tenant_alerts_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetAlerts.rows.length; idx++) {
				const attrSetAlert = attrSetAlerts.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetAlert.id, 'alert', ctxt.state.tenant['tenant_id']]);
				const alertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetAlert.id, 'alert']);
				cachedArtifacts = cachedArtifacts.concat(alertArtifacts.shift());
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
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;
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

			const attrSetAlerts = await dbSrvc.knex.raw(`SELECT tenant_alert_id AS id FROM tenant_alerts_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];

			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetAlerts.rows.length; idx++) {
				const attrSetAlert = attrSetAlerts.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetAlert.id, 'alert', ctxt.state.tenant['tenant_id']]);
				const alertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetAlert.id, 'alert']);
				cachedArtifacts = cachedArtifacts.concat(alertArtifacts.shift());
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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'alert/attribute-set-function', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'alert/attribute-set',
				'observedProperties': 'alert/attribute-set-function-observed-property'
			});

			return attrSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAttributeSetFunction`, err);
		}
	}

	async _addTenantAttributeSetFunction(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;
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
			const attrSetAlerts = await dbSrvc.knex.raw(`SELECT tenant_alert_id AS id FROM tenant_alerts_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];

			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetAlerts.rows.length; idx++) {
				const attrSetAlert = attrSetAlerts.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetAlert.id, 'alert', ctxt.state.tenant['tenant_id']]);
				const alertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetAlert.id, 'alert']);
				cachedArtifacts = cachedArtifacts.concat(alertArtifacts.shift());
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
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;
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
			const attrSetAlerts = await dbSrvc.knex.raw(`SELECT tenant_alert_id AS id FROM tenant_alerts_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];

			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetAlerts.rows.length; idx++) {
				const attrSetAlert = attrSetAlerts.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetAlert.id, 'alert', ctxt.state.tenant['tenant_id']]);
				const alertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetAlert.id, 'alert']);
				cachedArtifacts = cachedArtifacts.concat(alertArtifacts.shift());
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
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;
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

			const attrSetAlerts = await dbSrvc.knex.raw(`SELECT tenant_alert_id AS id FROM tenant_alerts_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];

			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetAlerts.rows.length; idx++) {
				const attrSetAlert = attrSetAlerts.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetAlert.id, 'alert', ctxt.state.tenant['tenant_id']]);
				const alertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetAlert.id, 'alert']);
				cachedArtifacts = cachedArtifacts.concat(alertArtifacts.shift());
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

			attrSetObservedPropertyData = this._convertToJsonApiFormat(attrSetObservedPropertyData, 'alert/attribute-set-function-observed-property', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'alert/attribute-set',
				'attributeSetFunction': 'alert/attribute-set-function',
				'attributeSetProperty': 'alert/attribute-set-property'
			});

			return attrSetObservedPropertyData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAttributeSetFunctionObservedProperty`, err);
		}
	}

	async _addTenantAttributeSetFunctionObservedProperty(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$TenantAttributeSetFunctionObservedPropertyModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const attributeSetId = savedRecord.get('attribute_set_id');

			const attrSetAlerts = await dbSrvc.knex.raw(`SELECT tenant_alert_id AS id FROM tenant_alerts_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];

			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetAlerts.rows.length; idx++) {
				const attrSetAlert = attrSetAlerts.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetAlert.id, 'alert', ctxt.state.tenant['tenant_id']]);
				const alertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetAlert.id, 'alert']);
				cachedArtifacts = cachedArtifacts.concat(alertArtifacts.shift());
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
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;
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

			const attrSetAlerts = await dbSrvc.knex.raw(`SELECT tenant_alert_id AS id FROM tenant_alerts_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];

			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetAlerts.rows.length; idx++) {
				const attrSetAlert = attrSetAlerts.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetAlert.id, 'alert', ctxt.state.tenant['tenant_id']]);
				const alertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetAlert.id, 'alert']);
				cachedArtifacts = cachedArtifacts.concat(alertArtifacts.shift());
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

	async _getTenantAlert(ctxt) {
		try {
			let alertData = await this.$TenantAlertModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.alert_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'processors', 'responseFormatters', 'attributeSets', 'constituents', 'watchers']
			});

			alertData = this._convertToJsonApiFormat(alertData, 'alert/alert', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'alert/folder',
				'processors': 'alert/alert-processor',
				'responseFormatters': 'alert/alert-response-formatter',
				'constituents': 'alert/alert-constituent',
				'attributeSets': 'alert/alert-attribute-set',
				'watchers': 'alert/alert-watcher'
			});

			return alertData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAlert`, err);
		}
	}

	async _getAllTenantAlerts(ctxt) {
		let hasAlertReadPermissions = false;
		try {
			const rbacChecker = this._rbac('alert-read');
			await rbacChecker(ctxt);

			hasAlertReadPermissions = true;
		}
		catch(err) {
			hasAlertReadPermissions = false;
		}

		try {
			let alertData = null;

			if(hasAlertReadPermissions) { // eslint-disable-line curly
				alertData = await this.$TenantAlertModel
				.query(function(qb) {
					qb.where({ 'tenant_id': ctxt.state.tenant.tenant_id });
				})
				.fetchAll({
					'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'processors', 'attributeSets', 'constituents', 'watchers']
				});
			}
			else { // eslint-disable-line curly
				alertData = await this.$TenantAlertModel
				.query(function(qb) {
					qb
					.whereRaw(`id IN (SELECT tenant_alert_id FROM tenant_alerts_users WHERE tenant_user_id IN (SELECT id FROM tenants_users WHERE user_id = ?))`, [ctxt.state.user.user_id])
					.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id })
					.orderBy('name');
				})
				.fetchAll({
					'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'processors', 'attributeSets', 'constituents', 'watchers']
				});
			}

			alertData = this._convertToJsonApiFormat(alertData, 'alert/alert', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'alert/folder',
				'processors': 'alert/alert-processor',
				'constituents': 'alert/alert-constituent',
				'attributeSets': 'alert/alert-attribute-set',
				'watchers': 'alert/alert-watcher'
			});

			return alertData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllTenantAlerts`, err);
		}
	}

	async _addTenantAlert(ctxt) {
		try {
			const pubsubService = this.$dependencies.PubsubService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const savedRecord = await this.$TenantAlertModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const schemaChangePayload = JSON.stringify({
				'id': savedRecord.get('id'),
				'sub_domain': ctxt.state.tenant['sub_domain'],
				'tenant_id': ctxt.state.tenant['tenant_id'],
				'type': 'alert'
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantAlert`, err);
		}
	}

	async _updateTenantAlert(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedAlertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['id'], 'alert']);

			const savedRecord = await this.$TenantAlertModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			cachedAlertArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [savedRecord.get('id'), 'alert', ctxt.state.tenant['tenant_id']]);

			await cacheMulti.execAsync();
			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantAlert`, err);
		}
	}

	async _deleteTenantAlert(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const dbSrvc = this.$dependencies.DatabaseService;

			const tenantAlert = await this.$TenantAlertModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.alert_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantAlert) throw new Error('Unknown Tenant Alert');

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedAlertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [ctxt.params['alert_id'], 'alert']);
			let cachedArtifacts = cachedAlertArtifacts.shift();

			const alertConstituents = await dbSrvc.knex.raw(`SELECT tenant_alert_constituent_id AS id, tenant_alert_constituent_type As type FROM tenant_alert_constituents WHERE tenant_alert_id = ?`, [ctxt.params.alert_id]);

			await tenantAlert.destroy();

			for(let idx = 0; idx < alertConstituents.rows.length; idx++) {
				const constituent = alertConstituents.rows[idx];
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
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantAlert`, err);
		}
	}

	async _getTenantAlertProcessor(ctxt) {
		try {
			let alertProcessorData = await this.$AlertProcessorModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.alert_processor_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantAlert']
			});

			alertProcessorData = this._convertToJsonApiFormat(alertProcessorData, 'alert/alert-processor', {
				'tenant': 'settings/account/basics/tenant',
				'tenantAlert': 'alert/alert'
			});

			return alertProcessorData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAlertProcessor`, err);
		}
	}

	async _addTenantAlertProcessor(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(!jsonDeserializedData['processor']) jsonDeserializedData['processor'] = '';

			const savedRecord = await this.$AlertProcessorModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantAlertProcessor`, err);
		}
	}

	async _updateTenantAlertProcessor(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;

			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$AlertProcessorModel
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
				updateEffectivity = await dbSrvc.knex.raw('UPDATE tenant_alert_processors SET effectivity_end = ? WHERE tenant_id = ? AND tenant_alert_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL AND publish_status = ? RETURNING id,publish_status', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_alert_id, true]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$AlertProcessorModel
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
						'id': savedRecord.get('tenant_alert_id'),
						'type': 'alert',
						'database': dbSrvc
					});

					await dbSrvc.knex.raw(`UPDATE tenant_alert_processors SET processor = ? WHERE id = ?`, [renderedEvaluator, savedRecord.get('id')]);
				}
				catch(err) {
					// if dont get render evaluator then update the status to false
					jsonDeserializedData['publish_status'] = false;
						await this.$AlertProcessorModel
						.forge()
						.save(jsonDeserializedData, {
							'method': 'update',
							'patch': true
						});

					await dbSrvc.knex.raw('UPDATE tenant_alert_processors SET effectivity_end = null WHERE id = ?', [updateEffectivity.rows[0]['id']]);

					throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantAlertProcessor`, err);
				}
				const cachedAlertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [savedRecord.get('tenant_alert_id'), 'alert']);

				cachedAlertArtifacts.shift().forEach((cachedArtifact) => {
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantAlertProcessor`, err);
		}
	}

	async _getTenantAlertResponseFormatter(ctxt) {
		try {
			let alertResponseFormatterData = await this.$AlertResponseFormatterModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.alert_response_formatter_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantAlert']
			});

			alertResponseFormatterData = this._convertToJsonApiFormat(alertResponseFormatterData, 'alert/alert-response-formatter', {
				'tenant': 'settings/account/basics/tenant',
				'tenantAlert': 'alert/alert'
			});

			return alertResponseFormatterData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAlertResponseFormatter`, err);
		}
	}

	async _addTenantAlertResponseFormatter(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$AlertResponseFormatterModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantAlertResponseFormatter`, err);
		}
	}

	async _updateTenantAlertResponseFormatter(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const newPublishStatus = jsonDeserializedData.publish_status;
			const cachedAlertArtifacts = await this.$dependencies.ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_alert_id'], 'alert']);
			const cacheMulti = this.$dependencies.CacheService.multi();

			const oldRecord = await this.$AlertResponseFormatterModel
			.query(function(qb) {
				qb.where({'id': jsonDeserializedData.id});
			}).fetch();

			const oldPublishStatus = oldRecord['attributes']['publish_status'];
			// eslint-disable-next-line curly
			if(oldPublishStatus && !newPublishStatus) {
				throw new Error('Published Response Formatter Record cannot be unpublished');
			}

			// 1. update effectivity stop of the current effective processor
			// 2. set effectivity start of the newly published processor

			let updateEffectivity;

			if(!oldPublishStatus && newPublishStatus) {
				const now = moment();
				updateEffectivity = await dbSrvc.knex.raw('UPDATE tenant_alert_response_formatters SET effectivity_end = ? WHERE tenant_id = ? AND tenant_alert_id = ? AND type = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL AND publish_status = ? RETURNING id,publish_status', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_alert_id, jsonDeserializedData.type, true]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$AlertResponseFormatterModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			cachedAlertArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			if(!oldPublishStatus && newPublishStatus) {
				try {
					await this.$dependencies.ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_alert_id'], 'alert', jsonDeserializedData['tenant_id']]);
				}
				catch(err) {
					// if dont get render evaluator then update the status to false
					jsonDeserializedData['publish_status'] = false;
					await this.$AlertResponseFormatterModel
						.forge()
						.save(jsonDeserializedData, {
							'method': 'update',
							'patch': true
						});

					await dbSrvc.knex.raw('UPDATE tenant_alert_response_formatters SET effectivity_end = null WHERE id = ?', [updateEffectivity.rows[0]['id']]);

					throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantAlertResponseFormatter`, err);
				}
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantAlertResponseFormatter`, err);
		}
	}

	async _getTenantAlertAttributeSet(ctxt) {
		try {
			let alertAttributeSetData = await this.$AlertAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.alert_attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantAttributeSet', 'tenantAlert']
			});

			alertAttributeSetData = this._convertToJsonApiFormat(alertAttributeSetData, 'alert/alert-attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'tenantAttributeSet': 'alert/attribute-set',
				'tenantAlert': 'alert/alert'
			});

			return alertAttributeSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAlertAttributeSet`, err);
		}
	}

	async _addTenantAlertAttributeSet(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedAlertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_alert_id'], 'alert']);

			const savedRecord = await this.$AlertAttributeSetModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			cachedAlertArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_alert_id'], 'alert', jsonDeserializedData['tenant_id']]);

			await cacheMulti.execAsync();
			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantAlertAttributeSet`, err);
		}
	}

	async _updateTenantAlertAttributeSet(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedAlertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_alert_id'], 'alert']);

			const savedRecord = await this.$AlertAttributeSetModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			cachedAlertArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_alert_id'], 'alert', jsonDeserializedData['tenant_id']]);

			await cacheMulti.execAsync();
			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantAlertAttributeSet`, err);
		}
	}

	async _deleteTenantAlertAttributeSet(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;

			const alertAttributeSet = await this.$AlertAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.alert_attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!alertAttributeSet) throw new Error('Unknown Tenant Alert Attribute Set');

			const alertId = alertAttributeSet.get('tenant_alert_id');

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedAlertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [alertId, 'alert']);

			await alertAttributeSet.destroy();

			cachedAlertArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [alertId, 'alert', ctxt.state.tenant['tenant_id']]);

			await cacheMulti.execAsync();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantAlertAttributeSet`, err);
		}
	}

	async _getTenantAlertConstituent(ctxt) {
		try {
			let alertConstituentData = await this.$AlertConstituentModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.alert_constituent_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantAlert']
			});

			alertConstituentData = this._convertToJsonApiFormat(alertConstituentData, 'alert/alert-constituent', {
				'tenant': 'settings/account/basics/tenant',
				'tenantAlert': 'alert/alert'
			});

			return alertConstituentData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAlertConstituent`, err);
		}
	}

	async _addTenantAlertConstituent(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$AlertConstituentModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const cachedAlertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_alert_id'], 'alert']);
			let cachedArtifacts = cachedAlertArtifacts.shift();

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_alert_id'], 'alert', jsonDeserializedData['tenant_id']]);

			const cachedAlertConstituentArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_alert_constituent_id'], jsonDeserializedData['tenant_alert_constituent_type']]);
			cachedArtifacts = cachedArtifacts.concat(cachedAlertConstituentArtifacts.shift());

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_alert_constituent_id'], jsonDeserializedData['tenant_alert_constituent_type'], jsonDeserializedData['tenant_id']]);

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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantAlertConstituent`, err);
		}
	}

	async _deleteTenantAlertConstituent(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const alertConstituent = await this.$AlertConstituentModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.alert_constituent_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!alertConstituent) throw new Error('Unknown Alert constituent mapping');

			const alertArtifactId = alertConstituent.get('tenant_alert_constituent_id');
			const alertArtifactType = alertConstituent.get('tenant_alert_constituent_type');
			const alertId = alertConstituent.get('tenant_alert_id');
			await alertConstituent.destroy();

			const cachedAlertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [alertId, 'alert']);
			let cachedArtifacts = cachedAlertArtifacts.shift();

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [alertId, 'alert', ctxt.state.tenant['tenant_id']]);

			const cachedAlertConstituentArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [alertArtifactId, alertArtifactType]);
			cachedArtifacts = cachedArtifacts.concat(cachedAlertConstituentArtifacts.shift());

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [alertArtifactId, alertArtifactType, ctxt.state.tenant['tenant_id']]);

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantAlertConstituent`, err);
		}
	}

	async _getTenantAlertWatcher(ctxt) {
		try {
			let alertWatcherData = await this.$AlertWatcherModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.alert_watcher_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantAlert', 'tenantUser']
			});

			alertWatcherData = this._convertToJsonApiFormat(alertWatcherData, 'alert/alert-watcher', {
				'tenant': 'settings/account/basics/tenant',
				'tenantAlert': 'alert/alert',
				'tenantUser': 'pug/user-manager/tenant-user'
			});

			return alertWatcherData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAlertWatcher`, err);
		}
	}

	async _addTenantAlertWatcher(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$AlertWatcherModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantAlertWatcher`, err);
		}
	}

	async _updateTenantAlertWatcher(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$AlertWatcherModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantAlertWatcher`, err);
		}
	}

	async _deleteTenantAlertWatcher(ctxt) {
		try {
			const alertWatcher = await this.$AlertWatcherModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.alert_watcher_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!alertWatcher) throw new Error('Unknown Alert User mapping');

			await alertWatcher.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantAlertWatcher`, err);
		}
	}

	async _getPossibleTenantUsersList(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const possibleTenantUsers = await dbSrvc.knex.raw(`SELECT A.id, B.first_name AS "firstName", B.middle_names AS "middleNames", B.last_name AS "lastName", B.email FROM tenants_users A INNER JOIN users B ON (A.user_id = B.id) WHERE A.tenant_id = ? AND A.access_status = 'authorized' AND A.id NOT IN (SELECT tenant_user_id FROM tenant_alerts_users WHERE tenant_alert_id = ?)`, [ctxt.state.tenant.tenant_id, ctxt.query.alert]);
			return possibleTenantUsers.rows;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getPossibleTenantUsersList`, err);
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
