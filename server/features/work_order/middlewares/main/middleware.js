/* eslint-disable security/detect-object-injection */
/* eslint-disable curly */

'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules.
 *
 * @ignore
 */
const safeJsonStringify = require('safe-json-stringify'); // eslint-disable-line no-unused-vars
const XLSX = require('xlsx');
const fs = require('fs');
// eslint-disable-next-line node/no-extraneous-require
const moment = require('moment-timezone');


/**
 * Module dependencies, required for this module.
 *
 * @ignore
 */
const PlantWorksBaseMiddleware = require('plantworks-base-middleware').PlantWorksBaseMiddleware;
const PlantWorksMiddlewareError = require('plantworks-middleware-error').PlantWorksMiddlewareError;


/**
 * @class   Main
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Server Tenant Administration Feature Main middleware - manages CRUD for account data.
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

					'workOrderFolders': function() {
						return this.hasMany(self.$TenantFolderModel, 'tenant_id');
					},

					'workOrderFormats': function() {
						return this.hasMany(self.$TenantFormatModel, 'tenant_id');
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

					'workOrderFormats': function() {
						return this.hasMany(self.$TenantFormatModel, 'tenant_folder_id');
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
					},

					'workOrderFormats': function() {
						return this.hasMany(self.$TenantFormatAttributeSetModel, 'tenant_attribute_set_id');
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

			Object.defineProperty(this, '$TenantFormatModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_work_order_formats',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'folder': function() {
						return this.belongsTo(self.$TenantFolderModel, 'tenant_folder_id');
					},

					'attributeSets': function() {
						return this.hasMany(self.$TenantFormatAttributeSetModel, 'tenant_work_order_format_id');
					},

					'tenantPlantUnitLines': function() {
						return this.hasMany(self.$TenantPlantUnitLineModel, 'work_order_format_id');
					},

					'watchers': function() {
						return this.hasMany(self.$WofUserModel, 'tenant_wof_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantFormatAttributeSetModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_work_order_format_attribute_sets',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'workOrderFormat': function() {
						return this.belongsTo(self.$TenantFormatModel, 'tenant_work_order_format_id');
					},

					'tenantAttributeSet': function() {
						return this.belongsTo(self.$TenantAttributeSetModel, 'tenant_attribute_set_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantPlantUnitLineModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_lines',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'workOrderFormat': function() {
						return this.belongsTo(self.$TenantFormatModel, 'work_order_format_id');
					}
				}, {
					'jsonColumns': ['attribute_set_metadata', 'supervisor_list_filters', 'work_order_filters']
				})
			});

			Object.defineProperty(this, '$WofUserModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_wof_users',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantWof': function() {
						return this.belongsTo(self.$TenantFormatModel, 'tenant_wof_id');
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
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
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
		delete this.$TenantFormatModel;
		delete this.$TenantAttributeSetFunctionObservedPropertyModel;
		delete this.$TenantAttributeSetFunctionModel;
		delete this.$TenantAttributeSetPropertyModel;
		delete this.$TenantAttributeSetModel;

		delete this.$TenantFolderModel;
		delete this.$TenantModel;

		delete this.$TenantUserModel;
		delete this.$WofUserModel;

		await super._teardown();
		return null;
	}
	// #endregion

	// #region Protected methods
	async _registerApis() {
		try {
			const ApiService = this.$dependencies.ApiService;
			await ApiService.add(`${this.name}::getTreeNodes`, this._getTreeNodes.bind(this));

			await ApiService.add(`${this.name}::getTenantFolder`, this._getTenantFolder.bind(this));
			await ApiService.add(`${this.name}::addTenantFolder`, this._addTenantFolder.bind(this));
			await ApiService.add(`${this.name}::updateTenantFolder`, this._updateTenantFolder.bind(this));
			await ApiService.add(`${this.name}::deleteTenantFolder`, this._deleteTenantFolder.bind(this));

			await ApiService.add(`${this.name}::getTenantAllAttributeSet`, this._getTenantAllAttributeSet.bind(this));
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

			await ApiService.add(`${this.name}::getAllTenantFormats`, this._getAllTenantFormats.bind(this));
			await ApiService.add(`${this.name}::getTenantFormat`, this._getTenantFormat.bind(this));
			await ApiService.add(`${this.name}::addTenantFormat`, this._addTenantFormat.bind(this));
			await ApiService.add(`${this.name}::updateTenantFormat`, this._updateTenantFormat.bind(this));
			await ApiService.add(`${this.name}::deleteTenantFormat`, this._deleteTenantFormat.bind(this));

			await ApiService.add(`${this.name}::getTenantFormatAttributeSet`, this._getTenantFormatAttributeSet.bind(this));
			await ApiService.add(`${this.name}::addTenantFormatAttributeSet`, this._addTenantFormatAttributeSet.bind(this));
			await ApiService.add(`${this.name}::updateTenantFormatAttributeSet`, this._updateTenantFormatAttributeSet.bind(this));
			await ApiService.add(`${this.name}::deleteTenantFormatAttributeSet`, this._deleteTenantFormatAttributeSet.bind(this));

			await ApiService.add(`${this.name}::getFormatFeatures`, this._getFormatFeatures.bind(this));
			await ApiService.add(`${this.name}::parseWorkOrderUpload`, this._parseWorkOrderUpload.bind(this));
			await ApiService.add(`${this.name}::approveUpload`, this._approveUpload.bind(this));
			await ApiService.add(`${this.name}::downloadWorkOrder`, this._downloadWorkOrder.bind(this));
			await ApiService.add(`${this.name}::changeWorkOrderStatus`, this._changeWorkOrderStatus.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantWofWatcher`, this._getTenantPlantWofWatcher.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantWofWatcher`, this._addTenantPlantWofWatcher.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantWofWatcher`, this._deleteTenantPlantWofWatcher.bind(this));

			await ApiService.add(`${this.name}::possibleWofTenantUsersList`, this._getPossibleWofTenantUsersList.bind(this));

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

			await ApiService.remove(`${this.name}::changeWorkOrderStatus`, this._changeWorkOrderStatus.bind(this));
			await ApiService.remove(`${this.name}::downloadWorkOrder`, this._downloadWorkOrder.bind(this));
			await ApiService.remove(`${this.name}::approveUpload`, this._approveUpload.bind(this));
			await ApiService.remove(`${this.name}::parseWorkOrderUpload`, this._parseWorkOrderUpload.bind(this));
			await ApiService.remove(`${this.name}::getFormatFeatures`, this._getFormatFeatures.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantFormatAttributeSet`, this._deleteTenantFormatAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::updateTenantFormatAttributeSet`, this._updateTenantFormatAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::addTenantFormatAttributeSet`, this._addTenantFormatAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::getTenantFormatAttributeSet`, this._getTenantFormatAttributeSet.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantFormat`, this._deleteTenantFormat.bind(this));
			await ApiService.remove(`${this.name}::updateTenantFormat`, this._updateTenantFormat.bind(this));
			await ApiService.remove(`${this.name}::addTenantFormat`, this._addTenantFormat.bind(this));
			await ApiService.remove(`${this.name}::getTenantFormat`, this._getTenantFormat.bind(this));
			await ApiService.remove(`${this.name}::getAllTenantFormats`, this._getAllTenantFormats.bind(this));

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
			await ApiService.remove(`${this.name}::getTenantAllAttributeSet`, this._getTenantAllAttributeSet.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantFolder`, this._deleteTenantFolder.bind(this));
			await ApiService.remove(`${this.name}::updateTenantFolder`, this._updateTenantFolder.bind(this));
			await ApiService.remove(`${this.name}::addTenantFolder`, this._addTenantFolder.bind(this));
			await ApiService.remove(`${this.name}::getTenantFolder`, this._getTenantFolder.bind(this));

			await ApiService.remove(`${this.name}::getTreeNodes`, this._getTreeNodes.bind(this));


			await ApiService.remove(`${this.name}::possibleWofTenantUsersList`, this._getPossibleWofTenantUsersList.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantWofWatcher`, this._deleteTenantPlantWofWatcher.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantWofWatcher`, this._addTenantPlantWofWatcher.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantWofWatcher`, this._getTenantPlantWofWatcher.bind(this));
			await super._deregisterApis();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getTreeNodes(ctxt) {
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
							'configsRoute': 'configure.work-order',
							'dataUrl': '/work-order/tree-nodes',
							'intl': true,
							'type': folder.name === 'work_order_feature.folder_names.attribute_sets.name' ? 'attribute-folder' : 'format-folder'
						}
					};
				});

				return tenantFolders;
			}

			if(['attribute-folder', 'format-folder'].includes(ctxt.query.node_type)) {
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
							'configsRoute': 'configure.work-order',
							'dataUrl': '/work-order/tree-nodes',
							'intl': false,
							'type': ctxt.query.node_type
						}
					};
				});

				// Get the formats in this folder
				let tenantFormats = await dbSrvc.knex.raw(`SELECT id, tenant_folder_id AS parent_id, name FROM tenant_work_order_formats WHERE tenant_folder_id  = ?`, [ctxt.query.node_id]);
				tenantFormats = tenantFormats.rows.map((format) => {
					return {
						'id': format.id,
						'parent': format.parent_id,
						'text': format.name,
						'children': true,

						'li_attr': {
							'title': format.name
						},

						'data': {
							'configsRoute': 'configure.work-order',
							'dataUrl': '/work-order/tree-nodes',
							'type': 'format'
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
						'children': true,

						'li_attr': {
							'title': attrSet.name
						},

						'data': {
							'configsRoute': 'configure.work-order',
							'dataUrl': '/work-order/tree-nodes',
							'type': 'attribute-set'
						}
					};
				});

				return [...tenantFolders, ...tenantFormats, ...tenantAttributeSets];
			}
			return [];
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTreeNodes`, err);
		}
	}

	async _getTenantFolder(ctxt) {
		const dbSrvc = this.$dependencies.DatabaseService;
		try {
			let folderData = await this.$TenantFolderModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.folder_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'parent', 'folders', 'attributeSets', 'workOrderFormats']
			});

			folderData = this._convertToJsonApiFormat(folderData, 'work-order/folder', {
				'tenant': 'settings/account/basics/tenant',
				'parent': 'work-order/folder',
				'folders': 'work-order/folder',
				'workOrderFormats': 'work-order/work-order-format',
				'attributeSets': 'work-order/attribute-set'
			});

			const filterWof = [];
			for(let idx = 0; idx < folderData.data.relationships.work_order_formats.data.length; idx++) {
				const wof = folderData.data.relationships.work_order_formats.data[idx].id;
				const checkwof = await dbSrvc.knex.raw(`SELECT * from tenant_wof_users  where tenant_wof_id = ? and tenant_user_id in(
					select id from tenants_users where tenant_id = ? and user_id = ? )`, [wof, ctxt.state.tenant.tenant_id, ctxt.state.user.user_id]);
				if(checkwof.rows.length > 0) filterWof.push(folderData.data.relationships.work_order_formats.data[idx]);
			}

			folderData.data.relationships.work_order_formats['data'] = filterWof;

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
				.where({ 'id': ctxt.params.folder_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'work-order/attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'work-order/folder',
				'properties': 'work-order/attribute-set-property',
				'functions': 'work-order/attribute-set-function'
			});

			delete attrSetData.included;
			return attrSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAttributeSet`, err);
		}
	}

	async _getTenantAllAttributeSet(ctxt) {
		try {
            let attrSetData = await this.$TenantAttributeSetModel
            .query(function(qb) {
				qb.where({ 'tenant_id': ctxt.state.tenant.tenant_id });
                qb.whereRaw(`tenant_folder_id IN (SELECT id FROM fn_get_folder_descendants((SELECT id FROM tenant_folders WHERE name = 'work_order_feature.folder_names.attribute_sets.name' and tenant_id  = ?)))`, [ctxt.state.tenant.tenant_id]);
            })
            .fetchAll({
                'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'properties', 'functions', 'workOrderFormats']
            });

            attrSetData = this.$jsonApiMapper.map(attrSetData, 'work-order/attribute-set', {
                'typeForModel': {
                    'tenant': 'settings/account/basics/tenant',
                    'folder': 'work-order/folder',
                    'properties': 'work-order/attribute-set-property',
					'functions': 'work-order/attribute-set-function',
					'workOrderFormats': 'work-order/format-attribute-set'
                },

                'enableLinks': false
            });

            delete attrSetData.included;
            return attrSetData;
        }
        catch(err) {
            throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAllAttributeSet`, err);
        }
	}

	async _addTenantAttributeSet(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const dbSrvc = this.$dependencies.DatabaseService;

			let tenantModuleId = await dbSrvc.knex.raw(`SELECT id FROM tenants_modules WHERE tenant_id = ? AND module_id = (SELECT id FROM modules  WHERE name = ? AND type = 'feature')`, [ctxt.state.tenant.tenant_id, 'WorkOrder']);
			if(!tenantModuleId.rows.length) throw new Error('Work order feature not enabled for this tenant');
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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'work-order/attribute-set-property', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'work-order/attribute-set'
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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'work-order/attribute-set-function', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'work-order/attribute-set',
				'observedProperties': 'work-order/attribute-set-function-observed-property'
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

			attrSetObservedPropertyData = this._convertToJsonApiFormat(attrSetObservedPropertyData, 'work-order/attribute-set-function-observed-property', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'work-order/attribute-set',
				'attributeSetFunction': 'work-order/attribute-set-function',
				'attributeSetProperty': 'work-order/attribute-set-property'
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

	async _getAllTenantFormats(ctxt) {
		try {
			let formatData = await this.$TenantFormatModel
			.query(function(qb) {
				qb
				.where({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetchAll({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'attributeSets', 'watchers']
			});

			formatData = this._convertToJsonApiFormat(formatData, 'work-order/work-order-format', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'work-order/folder',
				'attributeSets': 'work-order/format-attribute-set',
				'watchers': 'work-order/wof-watcher'
			});

			return formatData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllTenantFormats`, err);
		}
	}

	async _getTenantFormat(ctxt) {
		try {
			let formatData = await this.$TenantFormatModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.format_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'attributeSets', 'watchers']
			});

			formatData = this._convertToJsonApiFormat(formatData, 'work-order/work-order-format', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'work-order/folder',
				'attributeSets': 'work-order/format-attribute-set',
				'watchers': 'work-order/wof-watcher'
			});

			return formatData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantFormat`, err);
		}
	}

	async _addTenantFormat(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');
			jsonDeserializedData['attribute_set_metadata'] = safeJsonStringify(jsonDeserializedData['attribute_set_metadata']);

			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const savedRecord = await this.$TenantFormatModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantFormat`, err);
		}
	}

	async _updateTenantFormat(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			if(jsonDeserializedData['attribute_set_metadata'] !== undefined) { // eslint-disable-line curly
				jsonDeserializedData['attribute_set_metadata'] = safeJsonStringify(jsonDeserializedData['attribute_set_metadata']);
			}

			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const savedRecord = await this.$TenantFormatModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantFormat`, err);
		}
	}

	async _deleteTenantFormat(ctxt) {
		try {
			const tenantFormat = await this.$TenantFormatModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.format_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantFormat) throw new Error('Unknown Tenant Plant');
			await tenantFormat.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantFormat`, err);
		}
	}

	async _addTenantFormatAttributeSet(ctxt) {
		try {
			const tenantFormatAttributeSet = ctxt.request.body;
			const jsonDeserializedData = await this.$jsonApiDeserializer.deserializeAsync(tenantFormatAttributeSet);

			delete jsonDeserializedData.created_at;
			delete jsonDeserializedData.updated_at;

			Object.keys(tenantFormatAttributeSet.data.relationships || {}).forEach((relationshipName) => {
				if(!tenantFormatAttributeSet.data.relationships[relationshipName].data) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				if(!tenantFormatAttributeSet.data.relationships[relationshipName].data.id) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				jsonDeserializedData[`${relationshipName}_id`] = tenantFormatAttributeSet.data.relationships[relationshipName].data.id;
			});

			jsonDeserializedData['tenant_work_order_format_id'] = jsonDeserializedData['work_order_format_id'];

			delete jsonDeserializedData.work_order_format_id;
			delete jsonDeserializedData.attribute_set_id;

			const savedRecord = await this.$TenantFormatAttributeSetModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			return {
				'data': {
					'type': tenantFormatAttributeSet.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantFormatAttributeSet`, err);
		}
	}

	async _getTenantFormatAttributeSet(ctxt) {
		try {
			let tenantFormatAttributeSetData = await this.$TenantFormatAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.format_attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'workOrderFormat', 'tenantAttributeSet']
			});

			tenantFormatAttributeSetData = this.$jsonApiMapper.map(tenantFormatAttributeSetData, 'work-order/format-attribute-set', {
				'typeForModel': {
					'tenant': 'settings/account/basics/tenant',
					'workOrderFormat': 'work-order/work-order-format',
					'tenantAttributeSet': 'work-order/attribute-set'
				},

				'enableLinks': false
			});

			delete tenantFormatAttributeSetData.included;
			return tenantFormatAttributeSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantFormatAttributeSet`, err);
		}
	}

	async _updateTenantFormatAttributeSet(ctxt) {
		try {
			const tenantFormatAttributeSet = ctxt.request.body;
			const jsonDeserializedData = await this.$jsonApiDeserializer.deserializeAsync(tenantFormatAttributeSet);

			delete jsonDeserializedData.created_at;
			delete jsonDeserializedData.updated_at;

			Object.keys(tenantFormatAttributeSet.data.relationships || {}).forEach((relationshipName) => {
				if(!tenantFormatAttributeSet.data.relationships[relationshipName].data) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				if(!tenantFormatAttributeSet.data.relationships[relationshipName].data.id) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				jsonDeserializedData[`${relationshipName}_id`] = tenantFormatAttributeSet.data.relationships[relationshipName].data.id;
			});

			jsonDeserializedData['tenant_work_order_format_id'] = jsonDeserializedData['work_order_format_id'];

			delete jsonDeserializedData.emd_configuration_id;
			delete jsonDeserializedData.attribute_set_id;
			delete jsonDeserializedData.work_order_format_id;

			const savedRecord = await this.$TenantFormatAttributeSetModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			return {
				'data': {
					'type': tenantFormatAttributeSet.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantFormatAttributeSet`, err);
		}
	}

	async _deleteTenantFormatAttributeSet(ctxt) {
		try {
			const tenantFormatAttributeSet = await this.$TenantFormatAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.format_attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantFormatAttributeSet) throw new Error('Unknown Tenant work order Attribute Set');
			await tenantFormatAttributeSet.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantFormatAttributeSet`, err);
		}
	}

	async _getFormatFeatures(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const formatRootFolderName = 'work_order_feature.folder_names.format.name';

			let formatFolders = await dbSrvc.knex.raw(`SELECT id, COALESCE(CAST(parent_id AS text), '#') AS parent_id, name FROM tenant_folders WHERE tenant_id = ? AND id IN (SELECT id FROM fn_get_folder_descendants((SELECT id from tenant_folders WHERE name = ? AND tenant_id = ?)) ORDER BY LEVEL ASC);`, [ctxt.state.tenant.tenant_id, formatRootFolderName, ctxt.state.tenant.tenant_id]);

			formatFolders = formatFolders.rows.map((folder) => {
				return {
					'id': folder.id,
					'parent': folder.name === formatRootFolderName ? '#' : folder.parent_id,
					'text': folder.name === formatRootFolderName ? 'Work Order Formats' : folder.name,
					'li_attr': {
						'title': folder.name === formatRootFolderName ? 'Work Order Formats' : folder.name
					},

					'data': {
						'intl': false,
						'type': 'format-folder'
					}
				};
			});

			let formats = await dbSrvc.knex.raw(`SELECT id, COALESCE(CAST(tenant_folder_id AS text), '#') AS tenant_folder_id, name FROM tenant_work_order_formats WHERE tenant_id = ? AND tenant_folder_id IN (SELECT id FROM tenant_folders WHERE tenant_id = ? AND id IN (SELECT id FROM fn_get_folder_descendants((SELECT id from tenant_folders WHERE name = ? AND tenant_id = ?))));`, [ctxt.state.tenant.tenant_id, ctxt.state.tenant.tenant_id, formatRootFolderName, ctxt.state.tenant.tenant_id]);

			formats = formats.rows.map((format) => {
				return {
					'id': format.id,
					'parent': format.tenant_folder_id,
					'text': format.name,

					'data': {
						'intl': false,
						'type': 'format'
					}
				};
			});

			const filterWof = [];
			for(let idx = 0; idx < formats.length; idx++) {
				const wof = formats[idx].id;
				const checkwof = await dbSrvc.knex.raw(`SELECT * from tenant_wof_users  where tenant_wof_id = ? and tenant_user_id in(
					select id from tenants_users where tenant_id = ? and user_id = ? )`, [wof, ctxt.state.tenant.tenant_id, ctxt.state.user.user_id]);
				if(checkwof.rows.length > 0) filterWof.push(formats[idx]);
			}

			return formatFolders.concat(filterWof);
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getFormatFeatures`, err);
		}
	}

	async _parseWorkOrderUpload(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const filePath = ctxt.request.files['files[]'].path;
			let formattedRows = [];
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			const workBook = XLSX.readFile(filePath, {'cellDates': true});
			const columnHeaders = [];

			const plantTimezone	 = await dbSrvc.knex.raw(`SELECT timezone_id FROM tenant_locations WHERE tenant_id = ?`, [ctxt.state.tenant['tenant_id']]);

			const properties = await dbSrvc.knex.raw(`SELECT id, internal_tag, source, datatype AS data_type FROM tenant_attribute_set_properties WHERE attribute_set_id IN (SELECT tenant_attribute_set_id FROM tenant_work_order_format_attribute_sets WHERE tenant_work_order_format_id = ?)`, [ctxt.params.id]);

			const attributeSetMap = {};

			properties.rows.forEach((attr) => {
				if(attr.source === 'input')
					attributeSetMap[attr.internal_tag] = {'id': attr.id, 'data_type': attr.data_type};
			});

			const parsedSheets = workBook.SheetNames.map((sheetName) => {
				// find out column header
				if(!workBook.Sheets[sheetName]['!ref'])
					return null;

				const range = XLSX.utils.decode_range(workBook.Sheets[sheetName]['!ref']);
				let C;
				const R = range.s.r;
				let hdr = '';
				for(C = range.s.c; C <= range.e.c; ++C) {
					const cell = workBook.Sheets[sheetName][XLSX.utils.encode_cell({'c': C, 'r': R})];

					if(cell) {
						if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);
						columnHeaders.push(hdr);
					}
				}
				return XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]).map((row) => {
					const mappedRow = {};
					Object.keys(row).forEach((col) => {
						if(attributeSetMap[col.toUpperCase()].data_type === 'date') {
							const serverTimeOffset = moment().utcOffset(moment().format())._offset;
							const plantTimeOffset = moment().utcOffset(moment().tz(plantTimezone.rows[0].timezone_id).format())._offset;
							const dffTimeOffset = plantTimeOffset - serverTimeOffset;
							const time = moment(row[col], 'DD/MM/YYYY HH:mm');
							mappedRow[col.toUpperCase()] = time.subtract(dffTimeOffset, 'minutes').format();
						}
						else {
							mappedRow[col.toUpperCase()] = row[col];
						}
					});
					return mappedRow;
				});
			}).filter((sheetData) => {
				return !!sheetData;
			});

			parsedSheets.forEach((sheetData) => {
				formattedRows = formattedRows.concat(sheetData);
			});

			return {
				'rows': formattedRows,
				'columnHeaders': columnHeaders
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_parseWorkOrderUpload`, err);
		}
	}

	async _approveUpload(ctxt) {
		try {
			const approvedData = ctxt.request.body;
			const currentTime = moment().format();
			const propTypeObj = {};
			const dbSrvc = this.$dependencies.DatabaseService;

			const allowedStatusTypes = await this.getWorkOrderStatusTypes();
			if(!allowedStatusTypes.includes('not_started')) throw new Error('status value not_started is not allowed');

			const properties = await dbSrvc.knex.raw(`select internal_tag, datatype data_type from tenant_attribute_set_properties where attribute_set_id in (select tenant_attribute_set_id from tenant_work_order_format_attribute_sets where tenant_work_order_format_id = ?)`, [ctxt.params.id]);

			properties.rows.forEach(row=>{
				propTypeObj[row.internal_tag] = row.data_type;
			});

            const uniqueAttribute = await this.getUniqueAttribute(ctxt.params.id);

            // check unique attribute
			if(!uniqueAttribute.id) throw new Error('no unique attribute found');

			const dataRows = approvedData.rows.map((row) => {
				const plannedStartTime = row['PLANNED_START_TIME'];
				const plannedStopTime = row['PLANNED_STOP_TIME'];
				const workOrderId = row[uniqueAttribute.tag];
				const status = row['status'];

				delete row['status'];

				delete row.notes;
				delete row.date;

				return {
					'data': {
						'tenant_id': ctxt.state.tenant['tenant_id'],
						'tenant_work_order_format_id': ctxt.params.id,
						'work_order_id': workOrderId,
						'planned_start_time': plannedStartTime,
						'planned_stop_time': plannedStopTime,
						'values': safeJsonStringify(row),
						'data_types': safeJsonStringify(propTypeObj),
						'inserted_at': currentTime,
						'current_status': 'not_started'
					},

					'status': status
				};
			});

			await dbSrvc.knex.transaction(async function(trx) {
				try {
					for(let i = 0; i < dataRows.length; i++) {
						const currentDataRow = dataRows[i];

						if(currentDataRow.status === 'NEW') {
							await dbSrvc.knex('tenant_work_orders').transacting(trx).insert(currentDataRow.data);
							await dbSrvc.knex('tenant_work_order_status').transacting(trx).insert({
								'tenant_id': currentDataRow.data.tenant_id,
								'tenant_work_order_format_id': currentDataRow.data.tenant_work_order_format_id,
								'work_order_id': currentDataRow.data.work_order_id,
								'status': 'not_started',
								'created_at': currentDataRow.data.inserted_at
							});
						}
						if(currentDataRow.status === 'UPDATED') {
							const updatedId = await dbSrvc.knex('tenant_work_orders').transacting(trx).update({
								'values': currentDataRow.data.values,
								'data_types': currentDataRow.data.data_types,
								'planned_start_time': currentDataRow.data.planned_start_time,
								'planned_stop_time': currentDataRow.data.planned_stop_time
							}).where({
								'work_order_id': currentDataRow.data.work_order_id,
								'tenant_id': currentDataRow.data.tenant_id
							}).returning('work_order_id');

							if(!updatedId || !updatedId.length)
								throw new Error(`Cannot update work order: ${currentDataRow.data.work_order_id}. Work Order Does not exist`);
						}
					}

					await trx.commit();
				}
				catch(err) {
					await trx.rollback(err);
				}
			});

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_approveUpload`, err);
		}
	}

	async _downloadWorkOrder(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			// Get timezone
			let plantTimezone	 = await dbSrvc.knex.raw(`SELECT timezone_id FROM tenant_locations WHERE tenant_id = ?`, [ctxt.state.tenant['tenant_id']]);
			plantTimezone = plantTimezone.rows.shift();
			if(!plantTimezone) throw new Error('no plant time zone found');

			// get internal tag data types
			const properties = await dbSrvc.knex.raw(`SELECT id, internal_tag, source, datatype data_type FROM tenant_attribute_set_properties WHERE attribute_set_id IN (SELECT tenant_attribute_set_id FROM tenant_work_order_format_attribute_sets WHERE tenant_work_order_format_id = ?)`, [ctxt.params.id]);

			const attributeSetMap = {};
			properties.rows.forEach((attr) => {
				if(attr.source === 'input') {
					attributeSetMap[attr.internal_tag] = {'id': attr.id, 'data_type': attr.data_type};
				}
			});

			// get work orders
			let woData = await dbSrvc.knex.raw(`SELECT * FROM tenant_work_orders WHERE tenant_id = ? AND tenant_work_order_format_id = ? AND current_status NOT IN (?, ?)`, [
				ctxt.state.tenant['tenant_id'],
				ctxt.params.id,
				'completed',
				'canceled'
			]);

			woData = woData.rows;

			// format date values
			const plantTimeOffset = moment().utcOffset(moment().tz(plantTimezone.timezone_id).format())._offset;

			woData = woData.map((row) => {
				Object.keys(attributeSetMap).forEach((internalTag) => {
					if(attributeSetMap[internalTag]['data_type'] === 'date' && Object.hasOwnProperty.call(row.values, internalTag))
						row.values[internalTag] = moment(row.values[internalTag]).add(plantTimeOffset, 'minutes').format('DD/MM/YYYY HH:mm');
				});

				return row.values;
			});

			woData.forEach((row) => {
				Object.keys(row).forEach((key) => {
					if(Object.keys(attributeSetMap).indexOf(key) < 0) delete row[key];
				});
			});

			// if no work orders are present, just return empty sheet with just headers
			if(!woData.length) {
				const headerRow = {};
				Object.keys(attributeSetMap).forEach((header)=>{
					headerRow[header] = '';
				});
				woData.push(headerRow);
			}

			// create spreadsheet
			const wb = XLSX.utils.book_new();
			const ws = XLSX.utils.json_to_sheet(woData);

			XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			XLSX.writeFile(wb, `work_orders/${ctxt.params.id.replace(/-/g, '_')}.xlsx`);

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_downloadWorkOrder`, err);
		}
	}

	async _changeWorkOrderStatus(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const pubsubService = this.$dependencies.PubsubService;

			const keyspace = ctxt.state.tenant['sub_domain'];
			const workOrderId = ctxt.request.body['workOrderId'];
			const newStatus = ctxt.request.body['status'];
			const tenantPlantUnitStationObservedLineId = ctxt.request.body['tenantPlantUnitStationObservedLineId'];
			let updatedAt = ctxt.request.body['updatedAt'];
			const now = moment();

			if(now.diff(moment(updatedAt), 'seconds') > 300)
				throw new Error('event timestamp older than 5 minutes');

			if(moment(updatedAt).diff(now, 'seconds') > 300)
				throw new Error('event timestamp cannot be in the future');

			if(moment(updatedAt).isAfter(now))
				updatedAt = now.format();

			let eventType = await dbSrvc.knex.raw('SELECT * FROM event_types WHERE tag = ?', ['work_order_status_change']);

			if(!eventType || !eventType.rows || !eventType.rows.length)
				throw new Error('No event type found');

			eventType = eventType.rows.shift();

			let tenantPlantUnitStationObservedLine = await dbSrvc.knex.raw('SELECT * FROM tenant_plant_unit_stations_observed_lines WHERE id = ?', [tenantPlantUnitStationObservedLineId]);
			tenantPlantUnitStationObservedLine = tenantPlantUnitStationObservedLine.rows.shift();

			if(!tenantPlantUnitStationObservedLine)
				throw new Error('Invalid Station Observed line id');

			if(!tenantPlantUnitStationObservedLine['work_order_operations_enabled'])
				throw new Error('Work Order Operations not enabled on this station observed line');

			const allowedStatusTypes = await this._getWorkOrderStatusTypes();
			if(!allowedStatusTypes.includes(newStatus))
				throw new Error('Invalid work order status');


			const eventMessage = {
				'type': eventType['tag'],
				'data': {
					'keyspace': keyspace,
					'newStatus': newStatus,
					'eventType': eventType,
					'workOrderId': workOrderId,
					'updatedAt': updatedAt,
					'tenantId': ctxt.state.tenant['tenant_id'],
					'tenantPlantUnitStationObservedLineId': tenantPlantUnitStationObservedLineId,
					'tenantPlantUnitStationId': tenantPlantUnitStationObservedLine['tenant_plant_unit_station_id'],
					'tenantPlantUnitLineId': tenantPlantUnitStationObservedLine['tenant_plant_unit_line_id']
				}
			};

			// validtion
			const validationData = await this._validateWorkOrderStatusChange(eventMessage.data);
			if(!validationData.isValid)
				throw new Error(`Validation Failed ${validationData.message}`);

			await pubsubService.publish('plantworks-data-stream', 'EVENT.STREAM', safeJsonStringify(eventMessage));
			return {'msg': 'update Success'};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_changeWorkOrderStatus`, err);
		}
	}

	async _validateWorkOrderStatusChange(eventData) {
		let currentWorkOrderStatus = await this.$dependencies.DatabaseService.knex.raw('SELECT current_status FROM tenant_work_orders WHERE tenant_id = ? AND work_order_id = ?', [
			eventData.tenantId,
			eventData.workOrderId
		]);

		if(!currentWorkOrderStatus || !currentWorkOrderStatus.rows || !currentWorkOrderStatus.rows.length)
			return {
				'isValid': false,
				'message': 'Work Order Not Found'
			};

		currentWorkOrderStatus = currentWorkOrderStatus.rows.shift()['current_status'];

		if(eventData.newStatus === 'canceled') {
			if(!['not_started', 'discontinued'].includes(currentWorkOrderStatus)) {
				return {
					'isValid': false,
					'message': `Work Order cannot be cancelled. Current Status ${currentWorkOrderStatus}`
				};
			}
		}

		if(eventData.newStatus === 'in_progress') {
			if(!['not_started', 'discontinued'].includes(currentWorkOrderStatus)) {
				return {
					'isValid': false,
					'message': `Work Order cannot be started. Current Status ${currentWorkOrderStatus}`
				};
			}

			let lineWorkOrders = await this.$dependencies.DatabaseService.knex.raw(`SELECT DISTINCT ON (A.work_order_id) A.values->'MATERIAL' as material FROM tenant_work_orders A INNER JOIN tenant_work_order_status B on (A.work_order_id = B.work_order_id AND A.tenant_id = B.tenant_id) WHERE A.tenant_id = ? AND A.current_status != ? AND A.current_status != ? AND A.current_status != ? AND B.tenant_plant_unit_line_id = ? AND A.values->'MATERIAL' = (SELECT values->'MATERIAL' FROM tenant_work_orders WHERE work_order_id = ? AND tenant_id = ?) ORDER BY A.work_order_id, B.created_at DESC`, [
				eventData.tenantId,
				'completed',
				'discontinued',
				'canceled',
				eventData.tenantPlantUnitLineId,
				eventData.workOrderId,
				eventData.tenantId
			]);

			lineWorkOrders = lineWorkOrders.rows;
			if(lineWorkOrders.length) {
				return {
					'isValid': false,
					'message': `Another work order of same material is already running on this line`
				};
			}
		}

		if(eventData.newStatus === 'completed' || eventData.newStatus === 'discontinued') {
			if(['not_started', 'canceled', 'completed', 'discontinued'].includes(currentWorkOrderStatus)) {
				return {
					'isValid': false,
					'message': `Work Order cannot be ${eventData.newStatus}. Current Status: ${currentWorkOrderStatus}`
				};
			}

			let currentWorkOrderLine = await this.$dependencies.DatabaseService.knex.raw('SELECT tenant_plant_unit_line_id FROM tenant_work_order_status WHERE tenant_id = ? AND work_order_id = ? ORDER BY created_at DESC LIMIT 1', [eventData.tenantId, eventData.workOrderId]);

			if(!currentWorkOrderLine || !currentWorkOrderLine.rows || !currentWorkOrderLine.rows.length) {
				return {
					'isValid': false,
					'message': 'Work Order Line id not found'
				};
			}

			currentWorkOrderLine = currentWorkOrderLine.rows[0];

			if(currentWorkOrderLine['tenant_plant_unit_line_id'] !== eventData['tenantPlantUnitLineId']) {
				return {
					'isValid': false,
					'message': 'Work Order is running on a different line'
				};
			}
		}

		return {
			'isValid': true
		};
	}

	async filterMasterData(finalMasterArr, finalFilterArr, dataTypeMap) {
		const promises = require('bluebird');
		const path = require('path');
		const ejs = promises.promisifyAll(require('ejs'));
		const requireFromString = require('require-from-string');

		const tmplPath = path.join(__dirname, './templates/evaluate_expression.ejs');

		const filteredMasterArr = [];
		for(let i = 0; i < finalMasterArr.length; i++) {
			const masterItem = finalMasterArr[i];
			let flg = true;
			for(let j = 0; j < finalFilterArr.length; j++) {
				const filter = finalFilterArr[j];
				let tagValue = masterItem[filter['parameter_name']];
				let filterFlg = false;
				const dataType = dataTypeMap[filter['parameter_name']];
				let exp = '';
				if(!tagValue || !filter['value'] || !dataType) {
					flg = false;
					break;
				}
				if(dataType === 'string') {
					exp = `'${tagValue.toString().toLowerCase()}' ${filter['comparison_operator'] === '=' ? '===' : filter['comparison_operator']}  '${filter['value'].toString().toLowerCase()}'`;
				}
				if(dataType === 'number' || dataType === 'boolean') {
					exp = `${tagValue} ${filter['comparison_operator'] === '=' ? '===' : filter['comparison_operator']}  ${filter['value']}`;
				}
				if(dataType === 'date') {
					filter['value'] = moment(filter['value']).unix();
					tagValue = moment(tagValue).unix();
					exp = `${tagValue} ${filter['comparison_operator'] === '=' ? '===' : filter['comparison_operator']}  ${filter['value']}`;
				}
				if(dataType === 'object') {
					filter['value'] = (typeof filter['value'] === 'string') ? filter['value'] : JSON.stringify(filter['value']);
					tagValue = (typeof tagValue === 'string') ? tagValue : JSON.stringify(tagValue);
					exp = `${tagValue} ${filter['comparison_operator'] === '=' ? '===' : filter['comparison_operator']}  ${filter['value']}`;
				}

				const evaluator = await ejs.renderFileAsync(tmplPath, {
					'expression': exp
				});

				const moduleExports = requireFromString(evaluator);
				filterFlg = moduleExports.evaluate_expression();

				flg = flg && filterFlg;
			}
			if(flg)filteredMasterArr.push(masterItem);
		}

		return filteredMasterArr;
	}

	async getUniqueAttribute(formatId) {
		const dbSrvc = this.$dependencies.DatabaseService;
		const uniqueAttribute = {'id': null, 'tag': null};

		const formatMetaData = await dbSrvc.knex.raw(`SELECT attribute_set_metadata FROM tenant_work_order_formats WHERE id = ?`, [formatId]);
		const metaDataArr = formatMetaData.rows[0]['attribute_set_metadata'];
		for(let i = 0; i < metaDataArr.length; i++)
			if(metaDataArr[i].is_unique_id) {
				uniqueAttribute['id'] = metaDataArr[i].parameter_id;
				break;
			}
		const uniqueTagData = await dbSrvc.knex.raw(`SELECT internal_tag FROM tenant_attribute_set_properties WHERE id = ?`, [uniqueAttribute.id]);

		if(uniqueTagData.rows.length > 0)
		uniqueAttribute.tag = uniqueTagData.rows[0].internal_tag;

		return uniqueAttribute;
	}

	async readFile(path) {
		return new Promise((resolve, reject) => {
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			fs.readFile(path, function (err, data) {
				if(err)reject(err);
				resolve(data);
			});
		});
	}

	async getWorkOrderStatusTypes() {
		const dbSrvc = this.$dependencies.DatabaseService;
		const statusTypes = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::work_order_status_type)) AS work_order_status_type');

		const result = [];
		statusTypes.rows.forEach((statusTypeData) => {
			result.push(statusTypeData.work_order_status_type);
		});

		return result;
	}

	async combineAttributeSets(attributeSetIds) {
		const dbSrvc = this.$dependencies.DatabaseService;
		// Step 1: Get each attribute set from the database - assumption is that they are already ordered by evaluation order
		const attributeSets = [];
		for(let idx = 0; idx < attributeSetIds.length; idx++) {
			const attributeSetId = attributeSetIds[idx];

			// Step 1.1: The basics
			const attributeSet = {
				'id': attributeSetId,
				'evaluationOrder': idx,
				'attributes': []
			};

			// Step 1.2: The properties
			const properties = await dbSrvc.knex.raw(`SELECT id, internal_tag, source AS parameter_type, datatype AS data_type, evaluation_expression, units FROM tenant_attribute_set_properties WHERE attribute_set_id = ?`, [attributeSetId]);
			attributeSet.attributes = attributeSet.attributes.concat(properties.rows);

			// Step 1.3: Push for merging...
			attributeSets.push(attributeSet);
		}

		// Step 2: The merged set skeleton...
		const consolidatedAttributeSet = {
			'attributes': {}
		};

		// Step 3: Overwrite properties with equivalents from succeeding attribute sets
		for(let idx = 0; idx < attributeSets.length; idx++) {
			const attributeSet = attributeSets[idx];

			attributeSet.attributes.forEach((attribute) => {
				consolidatedAttributeSet['attributes'][attribute.internal_tag] = attribute;
			});
		}

		consolidatedAttributeSet['attributes'] = Object.keys(consolidatedAttributeSet['attributes']).map((attributeName) => {
			return consolidatedAttributeSet['attributes'][attributeName];
		});

		// Finally, return...
		return consolidatedAttributeSet;
	}

	async _getWorkOrderStatusTypes() {
		const dbSrvc = this.$dependencies.DatabaseService;
		const statusTypes = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::work_order_status_type)) AS work_order_status_type');

		const result = [];
		statusTypes.rows.forEach((statusTypeData) => {
			result.push(statusTypeData.work_order_status_type);
		});

		return result;
	}

	async _getTenantPlantWofWatcher(ctxt) {
		try {
			let wofWatcherData = await this.$WofUserModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_wof_watcher_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantWof', 'tenantUser']
			});

			wofWatcherData = this._convertToJsonApiFormat(wofWatcherData, 'work-order/wof-watcher', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantWof': 'wof/wof',
				'tenantUser': 'pug/user-manager/tenant-user'
			});

			return wofWatcherData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantWofWatcher`, err);
		}
	}

	async _addTenantPlantWofWatcher(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$WofUserModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantWofWatcher`, err);
		}
	}

	async _deleteTenantPlantWofWatcher(ctxt) {
		try {
			const wofWatcher = await this.$WofUserModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_wof_watcher_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!wofWatcher) throw new Error('Unknown Wof User mapping');

			await wofWatcher.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantWofWatcher`, err);
		}
	}

	async _getPossibleWofTenantUsersList(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const possibleTenantUsers = await dbSrvc.knex.raw(`SELECT A.id, B.first_name AS "firstName", B.middle_names AS "middleNames", B.last_name AS "lastName", B.email FROM tenants_users A INNER JOIN users B ON (A.user_id = B.id) WHERE A.tenant_id = ? AND A.access_status = 'authorized' AND A.id NOT IN (SELECT tenant_user_id FROM tenant_wof_users WHERE tenant_wof_id = ?)`, [ctxt.state.tenant.tenant_id, ctxt.query.wof]);
			return possibleTenantUsers.rows;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getPossibleWofTenantUsersList`, err);
		}
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */

	get dependencies() {
		return ['PubsubService'].concat(super.dependencies);
	}
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.middleware = Main;
