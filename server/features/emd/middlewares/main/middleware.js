/* eslint-disable security/detect-object-injection */

'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules.
 *
 * @ignore
 */
const safeJsonStringify = require('safe-json-stringify'); // eslint-disable-line no-unused-vars
const XLSX = require('xlsx');
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

					'emdFolders': function() {
						return this.hasMany(self.$TenantFolderModel, 'tenant_id');
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

					'attributeSets': function() {
						return this.hasMany(self.$TenantAttributeSetModel, 'tenant_folder_id');
					},

					'configurations': function() {
						return this.hasMany(self.$TenantEmdConfigurationModel, 'tenant_folder_id');
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

					'configurations': function() {
						return this.hasMany(self.$TenantEmdConfigurationAttributeSetModel, 'tenant_attribute_set_id');
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

			Object.defineProperty(this, '$TenantEmdConfigurationModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_emd_configurations',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'folder': function() {
						return this.belongsTo(self.$TenantFolderModel, 'tenant_folder_id');
					},

					'attributeSets': function() {
						return this.hasMany(self.$TenantEmdConfigurationAttributeSetModel, 'tenant_emd_configuration_id');
					},

					'watchers': function() {
						return this.hasMany(self.$EmdUserModel, 'tenant_emd_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantEmdConfigurationAttributeSetModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_emd_configuration_attribute_sets',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantAttributeSet': function() {
						return this.belongsTo(self.$TenantAttributeSetModel, 'tenant_attribute_set_id');
					},

					'tenantEmdConfiguration': function() {
						return this.belongsTo(self.$TenantEmdConfigurationModel, 'tenant_emd_configuration_id');
					}
				})
			});

			Object.defineProperty(this, '$EmdUserModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_emd_users',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantEmd': function() {
						return this.belongsTo(self.$TenantEmdConfigurationModel, 'tenant_emd_id');
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
		delete this.$TenantEmdConfigurationAttributeSetModel;
		delete this.$TenantEmdConfiguration;
		delete this.$TenantAttributeSetFunctionObservedPropertyModel;
		delete this.$TenantAttributeSetFunctionModel;
		delete this.$TenantAttributeSetPropertyModel;
		delete this.$TenantAttributeSetModel;

		delete this.$TenantFolderModel;
		delete this.$TenantModel;
		delete this.$TenantUserModel;
		delete this.$EmdUserModel;

		await super._teardown();
		return null;
	}
	// #endregion

	// #region Protected methods
	async _registerApis() {
		try {
			const ApiService = this.$dependencies.ApiService;
			await ApiService.add(`${this.name}::getApplicationTree`, this._getApplicationTree.bind(this));
			await ApiService.add(`${this.name}::parseXlsx`, this._parseXlsx.bind(this));
			await ApiService.add(`${this.name}::commitData`, this._commitData.bind(this));
			await ApiService.add(`${this.name}::retrieveDowntimeReasons`, this._retrieveDowntimeReasons.bind(this));
			await ApiService.add(`${this.name}::retrieveEmdExcel`, this._retrieveEmdExcel.bind(this));

			await ApiService.add(`${this.name}::getTreeNodes`, this._getTreeNodes.bind(this));

			await ApiService.add(`${this.name}::getTenantFolder`, this._getTenantFolder.bind(this));
			await ApiService.add(`${this.name}::addTenantFolder`, this._addTenantFolder.bind(this));
			await ApiService.add(`${this.name}::updateTenantFolder`, this._updateTenantFolder.bind(this));
			await ApiService.add(`${this.name}::deleteTenantFolder`, this._deleteTenantFolder.bind(this));

			await ApiService.add(`${this.name}::getTenantAttributeSets`, this._getTenantAttributeSets.bind(this));
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

			await ApiService.add(`${this.name}::getTenantEmdConfigurations`, this._getTenantEmdConfigurations.bind(this));
			await ApiService.add(`${this.name}::getTenantEmdConfiguration`, this._getTenantEmdConfiguration.bind(this));
			await ApiService.add(`${this.name}::addTenantEmdConfiguration`, this._addTenantEmdConfiguration.bind(this));
			await ApiService.add(`${this.name}::updateTenantEmdConfiguration`, this._updateTenantEmdConfiguration.bind(this));
			await ApiService.add(`${this.name}::deleteTenantEmdConfiguration`, this._deleteTenantEmdConfiguration.bind(this));

			await ApiService.add(`${this.name}::getTenantEmdConfigurationAttributeSet`, this._getTenantEmdConfigurationAttributeSet.bind(this));
			await ApiService.add(`${this.name}::addTenantEmdConfigurationAttributeSet`, this._addTenantEmdConfigurationAttributeSet.bind(this));
			await ApiService.add(`${this.name}::updateTenantEmdConfigurationAttributeSet`, this._updateTenantEmdConfigurationAttributeSet.bind(this));
			await ApiService.add(`${this.name}::deleteTenantEmdConfigurationAttributeSet`, this._deleteTenantEmdConfigurationAttributeSet.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantEmdWatcher`, this._getTenantPlantEmdWatcher.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantEmdWatcher`, this._addTenantPlantEmdWatcher.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantEmdWatcher`, this._deleteTenantPlantEmdWatcher.bind(this));

			await ApiService.add(`${this.name}::possibleEmdTenantUsersList`, this._getPossibleEmdTenantUsersList.bind(this));

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

			await ApiService.remove(`${this.name}::possibleEmdTenantUsersList`, this._getPossibleEmdTenantUsersList.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantEmdWatcher`, this._deleteTenantPlantEmdWatcher.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantEmdWatcher`, this._addTenantPlantEmdWatcher.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantEmdWatcher`, this._getTenantPlantEmdWatcher.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantEmdConfigurationAttributeSet`, this._deleteTenantEmdConfigurationAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::updateTenantEmdConfigurationAttributeSet`, this._updateTenantEmdConfigurationAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::addTenantEmdConfigurationAttributeSet`, this._addTenantEmdConfigurationAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::getTenantEmdConfigurationAttributeSet`, this._getTenantEmdConfigurationAttributeSet.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantEmdConfiguration`, this._deleteTenantEmdConfiguration.bind(this));
			await ApiService.remove(`${this.name}::updateTenantEmdConfiguration`, this._updateTenantEmdConfiguration.bind(this));
			await ApiService.remove(`${this.name}::addTenantEmdConfiguration`, this._addTenantEmdConfiguration.bind(this));
			await ApiService.remove(`${this.name}::getTenantEmdConfiguration`, this._getTenantEmdConfiguration.bind(this));
			await ApiService.remove(`${this.name}::getTenantEmdConfigurations`, this._getTenantEmdConfigurations.bind(this));

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
			await ApiService.remove(`${this.name}::getTenantAttributeSets`, this._getTenantAttributeSets.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantFolder`, this._deleteTenantFolder.bind(this));
			await ApiService.remove(`${this.name}::updateTenantFolder`, this._updateTenantFolder.bind(this));
			await ApiService.remove(`${this.name}::addTenantFolder`, this._addTenantFolder.bind(this));
			await ApiService.remove(`${this.name}::getTenantFolder`, this._getTenantFolder.bind(this));

			await ApiService.remove(`${this.name}::getTreeNodes`, this._getTreeNodes.bind(this));

			await ApiService.remove(`${this.name}::retrieveEmdExcel`, this._retrieveEmdExcel.bind(this));
			await ApiService.remove(`${this.name}::retrieveDowntimeReasons`, this._retrieveDowntimeReasons.bind(this));
			await ApiService.remove(`${this.name}::commitData`, this._commitData.bind(this));
			await ApiService.remove(`${this.name}::uploadData`, this._parseXlsx.bind(this));
			await ApiService.remove(`${this.name}::getApplicationTree`, this._getApplicationTree.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getApplicationTree(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const emdConfRootFolderName = 'emd_feature.folder_names.emd_configurations.name';

			let emdConfigsFolders = await dbSrvc.knex.raw(`SELECT id, COALESCE(CAST(parent_id AS text), '#') AS parent_id, name FROM tenant_folders WHERE tenant_id = ? AND id IN (SELECT id FROM fn_get_folder_descendants((SELECT id from tenant_folders WHERE name = ? AND tenant_id = ?)) ORDER BY LEVEL ASC);`, [ctxt.state.tenant.tenant_id, emdConfRootFolderName, ctxt.state.tenant.tenant_id]);

			emdConfigsFolders = emdConfigsFolders.rows.map((folder) => {
				return {
					'id': folder.id,
					'parent': folder.name === emdConfRootFolderName ? '#' : folder.parent_id,
					'text': folder.name,
					'li_attr': {
						'title': folder.name
					},

					'data': {
						'intl': (folder.name === emdConfRootFolderName),
						'type': 'emd/folder'
					}
				};
			});

			let emdConfigurations = await dbSrvc.knex.raw(`SELECT id, COALESCE(CAST(tenant_folder_id AS text), '#') AS tenant_folder_id, name FROM tenant_emd_configurations WHERE tenant_id = ? AND tenant_folder_id IN (SELECT id FROM tenant_folders WHERE tenant_id = ? AND id IN (SELECT id FROM fn_get_folder_descendants((SELECT id from tenant_folders WHERE name = ? AND tenant_id = ?))));`, [ctxt.state.tenant.tenant_id, ctxt.state.tenant.tenant_id, emdConfRootFolderName, ctxt.state.tenant.tenant_id]);

			emdConfigurations = emdConfigurations.rows.map((emdConfiguration) => {
				return {
					'id': emdConfiguration.id,
					'parent': emdConfiguration.tenant_folder_id,
					'text': emdConfiguration.name,

					'data': {
						'intl': false,
						'type': 'emd/configuration'
					}
				};
			});

			const filterEmd = [];
			for(let idx = 0; idx < emdConfigurations.length; idx++) {
				const emd = emdConfigurations[idx].id;
				const checkemd = await dbSrvc.knex.raw(`SELECT * from tenant_emd_users  where tenant_emd_id = ? and tenant_user_id in(
					select id from tenants_users where tenant_id = ? and user_id = ? )`, [emd, ctxt.state.tenant.tenant_id, ctxt.state.user.user_id]);
				if(checkemd.rows.length > 0) filterEmd.push(emdConfigurations[idx]);
			}

			return emdConfigsFolders.concat(filterEmd);
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getApplicationTree`, err);
		}
	}

	async _parseXlsx(ctxt) {
		try {
			const dataFilePath = ctxt.request.files.emdFile.path;
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			const workBook = XLSX.readFile(dataFilePath, { 'cellDates': true});
			let columnHeaders = [];

			const parsedSheet = workBook.SheetNames.map((sheetName) => {
				// find out column header
				if(XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]).length !== 0) {
					const range = XLSX.utils.decode_range(workBook.Sheets[sheetName]['!ref']);
					let C;
					const R = range.s.r;
					let hdr = '';
					columnHeaders = [];
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
							mappedRow[col.toUpperCase()] = row[col];
						});

						return mappedRow;
					});
				}

				return null;
			})
			.filter(sheet => sheet !== null);

			parsedSheet.columns = columnHeaders;

			let values = parsedSheet[0];
			if(values[0] && values[0].DATE)
			{
				values.forEach((value)=>{
					value.DATE = moment(value.DATE, 'DD/MM/YYYY');
				})
				parsedSheet[0] = values;
			}

			return parsedSheet;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_parseXlsx`, err);
		}
	}

	async _commitData(ctxt) {
		try {
			const dataToCommit = ctxt.request.body.rows;
			const dbSrvc = this.$dependencies.DatabaseService;

			await dbSrvc.knex.transaction(async function(trx) {
				try {
					const now = moment().format();
					// if operation metadata is Overwrite, deactivate all active rows not present in the current uploaded file
					if(dataToCommit[0].operationMetadata === 'Overwrite')
						await trx.raw(`UPDATE tenant_emd_data SET active = ?, rejected_at = ? WHERE tenant_id = ? AND tenant_emd_configuration_id = ? AND active = ? AND masterdata_id NOT IN (${dataToCommit.map(() => { return '?'; }).join(',')})`, [false, now, ctxt.state.tenant['tenant_id'], ctxt.params.emd_configuration_id, true, ...dataToCommit.map((r) => { return r.attributes[r.uniqueIdParameter]; })]);

					for(let idx = 0; idx < dataToCommit.length; idx++) {
						const row = dataToCommit[idx];
						const masterdataId = row.attributes[row.uniqueIdParameter];

						if(!row.update && !row.new)
							continue;

						// deactive old row
						if(row.update)
							await dbSrvc.knex('tenant_emd_data').transacting(trx).update({
								'active': false,
								'rejected_at': now
							})
							.where({
								'tenant_id': ctxt.state.tenant['tenant_id'],
								'tenant_emd_configuration_id': ctxt.params.emd_configuration_id,
								'masterdata_id': masterdataId,
								'active': true
							});

						const dataToInsert = {
							'masterdata_id': masterdataId,
							'tenant_id': ctxt.state.tenant['tenant_id'],
							'tenant_emd_configuration_id': ctxt.params.emd_configuration_id,
							'values': safeJsonStringify(row.attributes),
							'data_types': safeJsonStringify(row.tagTypeMap),
							'inserted_at': now,
							'active': true
						};

						await dbSrvc.knex('tenant_emd_data').transacting(trx).insert(dataToInsert);
					}

					await trx.commit();
				}
				catch(err) {
					await trx.rollback(err);
				}
			});

			return [ctxt.params.emd_configuration_id];
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_commitData`, err);
		}
	}

	async _retrieveEmdExcel(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const emdData = await dbSrvc.knex.raw(`SELECT values FROM tenant_emd_data WHERE tenant_id = ? AND tenant_emd_configuration_id = ? AND active = ?`, [
				ctxt.state.tenant['tenant_id'],
				ctxt.params.emd_configuration_id,
				true
			]);

			if(emdData.rows) {
				emdData.rows.forEach(data => {
					if(data.values.DATE) {
						data.values.DATE = moment(data.values.DATE).format('DD/MM/YYYY')
					}
				});
			}
			let compositeAttributeSetIds = await dbSrvc.knex.raw('SELECT tenant_attribute_set_id FROM tenant_emd_configuration_attribute_sets WHERE tenant_emd_configuration_id = ?', [ctxt.params.emd_configuration_id]);
			compositeAttributeSetIds = compositeAttributeSetIds.rows.map((row) => row['tenant_attribute_set_id']);
			const combinedAttributeSet = await this.combineAttributeSets(compositeAttributeSetIds);

			const notInputparam = combinedAttributeSet.attributes.filter((attr) => {
				return attr.parameter_type !== 'input';
			})
			.map((attr) => {
				return attr.internal_tag;
			});

			const masterDataArr = emdData.rows.map((r) => {
				return r.values;
			});

			masterDataArr.forEach((row)=>{
				notInputparam.forEach((parm)=>{
					delete row[parm];
				});
			});

			const wb = XLSX.utils.book_new();
			const ws = XLSX.utils.json_to_sheet(masterDataArr);

			XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			XLSX.writeFile(wb, `emd/${ctxt.params.emd_configuration_id.replace(/-/g, '_')}.xlsx`);

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_retrieveEmdExcel`, err);
		}
	}

	// Use this method to retrieve Downtime External Master Data
	async _retrieveDowntimeReasons(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			// eslint-disable-next-line node/no-extraneous-require

			const emdData = await dbSrvc.knex.raw(`SELECT * FROM tenant_emd_data WHERE tenant_id = ? AND tenant_emd_configuration_id = ? AND active = ?`, [
				ctxt.state.tenant['tenant_id'],
				ctxt.params.emd_configuration_id,
				true
			]);

			const metaData = await dbSrvc.knex.raw(`SELECT attribute_set_metadata FROM tenant_emd_configurations WHERE id = ?`, [ctxt.params.emd_configuration_id]);

			let compositeAttributeSetIds = await dbSrvc.knex.raw('SELECT tenant_attribute_set_id FROM tenant_emd_configuration_attribute_sets WHERE tenant_emd_configuration_id = ?', [ctxt.params.emd_configuration_id]);

			compositeAttributeSetIds = compositeAttributeSetIds.rows.map((row) => row['tenant_attribute_set_id']);

			const combinedAttributeSet = await this.combineAttributeSets(compositeAttributeSetIds);

			const attributeSetMap = {};
			combinedAttributeSet.attributes.forEach((attr) => {
				attributeSetMap[attr.internal_tag] = attr.id;
			});

			// choose filter category
			let filterColumnName = 'downtime_list_filters';
			if(ctxt.params.filter_type === 'setuptime') filterColumnName = 'setuptime_list_filters';
			else if(ctxt.params.filter_type === 'idletime') filterColumnName = 'idletime_list_filters';
			else if(ctxt.params.filter_type === 'speed_deviation') filterColumnName = 'speed_deviations_list_filters';

			// get the filters
			let filters = await dbSrvc.knex.raw(`SELECT ${filterColumnName} FROM tenant_plant_unit_machines where id = ?`, [ctxt.params.machine_id]);
			filters = filters.rows[0][filterColumnName].map((filter) => {
				let filterParameter = combinedAttributeSet['attributes'].filter((param) => {
					return param['id'] === filter['parameter_id'];
				});

				if(!filterParameter.length)
					return null;

				filterParameter = filterParameter.shift();
				filter['internal_tag'] = filterParameter['internal_tag'];
				filter['data_type'] = filterParameter['data_type'];

				return filter;
			}).filter((filter) => {
				return filter !== null;
			});

			let uniqueParamId;
			let displayParamId;
			metaData.rows[0].attribute_set_metadata.forEach((row) => {
				if(row.is_unique_id === true)
					uniqueParamId = row.parameter_id;

				if(row.show_in_dropdown === true)
					displayParamId = row.parameter_id;
			});

			// if no display param Id is found then consider unique param as display param
			displayParamId = displayParamId ? displayParamId : uniqueParamId;

			const downtimeReasonsList = emdData.rows.map((row) => {
				const emdValues = {};
				emdValues['masterdata_id'] = row.masterdata_id;
				Object.keys(row.values).forEach((internalTag) => {
					emdValues[internalTag] = row.values[internalTag];

					if(attributeSetMap[internalTag] === displayParamId)
						emdValues['displayValue'] = row.values[internalTag];
				});

				return emdValues;
			});


			const filteredDowntimeReasonsList = await this._filterMasterData(downtimeReasonsList, filters);

			if(filterColumnName === 'speed_deviations_list_filters') return filteredDowntimeReasonsList;

			const machineId = ctxt.params.machine_id;

			let plantUnitId = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_id FROM tenant_plant_unit_machines WHERE id = ?`, [machineId]);
			plantUnitId = plantUnitId.rows.length ? plantUnitId.rows.shift() : null;
			plantUnitId = plantUnitId.tenant_plant_unit_id;
			if(!plantUnitId) throw new PlantWorksMiddlewareError(`${this.name}::_retrieveDowntimeReasons`, 'Plant Unit Does not Exist');

			let plantId = await dbSrvc.knex.raw(`SELECT tenant_plant_id FROM tenant_plant_units WHERE id = ?`, [plantUnitId]);
			plantId = plantId.rows.length ? plantId.rows.shift() : null;
			plantId = plantId.tenant_plant_id;
			if(!plantId) throw new PlantWorksMiddlewareError(`${this.name}::_retrieveDowntimeReasons`, 'Plant Does not Exist');

			let plantHolidays = await dbSrvc.knex.raw(`SELECT * FROM tenant_plant_schedules WHERE tenant_plant_id = ? AND type = 'holiday'`, [plantId]);
			plantHolidays = plantHolidays.rows.filter((holiday) => {
				return moment(holiday.start_date).isBefore(moment());
			});

			let plantUnitHolidays = await dbSrvc.knex.raw(`SELECT * FROM tenant_plant_unit_schedules WHERE tenant_plant_unit_id = ? AND type = 'holiday'`, [plantUnitId]);
			plantUnitHolidays = plantUnitHolidays.rows.filter((holiday) => {
				return moment(holiday.start_date).isBefore(moment());
			});

			let plantUnitPlannedDowntimes = await dbSrvc.knex.raw(`SELECT * FROM tenant_plant_unit_schedules WHERE tenant_plant_unit_id = ? AND type = 'planned_downtime'`, [plantUnitId]);
			plantUnitPlannedDowntimes = plantUnitPlannedDowntimes.rows.length ? plantUnitPlannedDowntimes.rows : [];

			let plantUnitScheduledDowntimes = await dbSrvc.knex.raw(`SELECT * FROM tenant_plant_unit_schedules WHERE tenant_plant_unit_id = ? AND type = 'scheduled_downtime'`, [plantUnitId]);
			plantUnitScheduledDowntimes = plantUnitScheduledDowntimes.rows.filter((scheduledt) => {
				return moment(scheduledt.start_date).isBefore(moment());
			});

			let machinePlannedDowntimes = await dbSrvc.knex.raw(`select * from tenant_plant_unit_machine_schedules where type = 'planned_downtime' and tenant_plant_unit_machine_id = ?`, [machineId]);
			machinePlannedDowntimes = machinePlannedDowntimes.rows.length ? machinePlannedDowntimes.rows : [];

			let machineScheduledDowntimes = await dbSrvc.knex.raw(`SELECT * FROM tenant_plant_unit_machine_schedules WHERE tenant_plant_unit_machine_id = ? AND type = 'scheduled_downtime'`, [machineId]);
			machineScheduledDowntimes = machineScheduledDowntimes.rows.filter((scheduledt) => {
				return moment(scheduledt.start_date).isBefore(moment());
			});

			let machineMaintenance = await dbSrvc.knex.raw(`SELECT * FROM tenant_plant_unit_machine_schedules WHERE tenant_plant_unit_machine_id = ? AND type = 'maintenance'`, [machineId]);
			machineMaintenance = machineMaintenance.rows.filter((maintenance) => {
				return moment(maintenance.start_date).isBefore(moment());
			});

			if(filterColumnName === 'idletime_list_filters') {
				plantHolidays.forEach((dt) => {
					filteredDowntimeReasonsList.push({'masterdata_id': dt.id, 'displayValue': dt.description});
				});

				plantUnitHolidays.forEach((dt) => {
					filteredDowntimeReasonsList.push({'masterdata_id': dt.id, 'displayValue': dt.description});
				});

				plantUnitScheduledDowntimes.forEach((dt) => {
					filteredDowntimeReasonsList.push({'masterdata_id': dt.id, 'displayValue': dt.description});
				});

				machineScheduledDowntimes.forEach((dt) => {
					filteredDowntimeReasonsList.push({'masterdata_id': dt.id, 'displayValue': dt.description});
				});

				machineMaintenance.forEach((dt) => {
					filteredDowntimeReasonsList.push({'masterdata_id': dt.id, 'displayValue': dt.description});
				});
			}
			else if(filterColumnName === 'downtime_list_filters') {
				plantUnitPlannedDowntimes.forEach((dt) => {
					filteredDowntimeReasonsList.push({'masterdata_id': dt.id, 'displayValue': dt.description});
				});

				machinePlannedDowntimes.forEach((dt) => {
					filteredDowntimeReasonsList.push({'masterdata_id': dt.id, 'displayValue': dt.description});
				});
			}

			return filteredDowntimeReasonsList;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_retrieveDowntimeReasons`, err);
		}
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

	async _filterMasterData(finalMasterArr, finalFilterArr) {
		const promises = require('bluebird');
		const path = require('path');
		const ejs = promises.promisifyAll(require('ejs'));
		const requireFromString = require('require-from-string');

		const tmplPath = path.join(__dirname, './templates/evaluate_expression.ejs');

		if(!Array.isArray(finalMasterArr))
			finalMasterArr = [finalMasterArr];

		const filteredMasterArr = [];
		for(let i = 0; i < finalMasterArr.length; i++) {
			const masterItem = finalMasterArr[i];
			let flg = true;
			for(let j = 0; j < finalFilterArr.length; j++) {
				const filter = finalFilterArr[j];
				let tagValue = masterItem[filter['internal_tag']];
				let filterFlg = false;
				const dataType = filter['data_type'];
				let exp = '';

				if(!tagValue || !filter['value'] || !dataType) {
					flg = false;
					break;
				}

				if(dataType === 'string')
					exp = `'${tagValue.toString().toLowerCase()}' ${filter['comparison_operator'] === '=' ? '===' : filter['comparison_operator']}  '${filter['value'].toString().toLowerCase()}'`;

				if(dataType === 'number' || dataType === 'boolean')
					exp = `${tagValue} ${filter['comparison_operator'] === '=' ? '===' : filter['comparison_operator']}  ${filter['value']}`;

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
							'configsRoute': 'configure.emd',
							'dataUrl': '/emd/tree-nodes',
							'intl': true,
							'type': folder.name === 'emd_feature.folder_names.attribute_sets.name' ? 'attribute-folder' : 'emd-config-folder'
						}
					};
				});

				return tenantFolders;
			}

			if(['attribute-folder', 'emd-config-folder'].includes(ctxt.query.node_type)) {
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
							'configsRoute': 'configure.emd',
							'dataUrl': '/emd/tree-nodes',
							'intl': false,
							'type': ctxt.query.node_type
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
							'configsRoute': 'configure.emd',
							'dataUrl': '/emd/tree-nodes',
							'type': 'attribute-set'
						}
					};
				});

				// Get emd upload configurations in this folder
				let tenantEmdConfigs = await dbSrvc.knex.raw(`SELECT id, tenant_folder_id AS parent_id, name FROM tenant_emd_configurations WHERE tenant_folder_id  = ?`, [ctxt.query.node_id]);
				tenantEmdConfigs = tenantEmdConfigs.rows.map((emdConfig) => {
					return {
						'id': emdConfig.id,
						'parent': emdConfig.parent_id,
						'text': emdConfig.name,
						'children': true,

						'li_attr': {
							'title': emdConfig.name
						},

						'data': {
							'configsRoute': 'configure.emd',
							'dataUrl': '/emd/tree-nodes',
							'type': 'emd-configuration'
						}
					};
				});
				return [...tenantFolders, ...tenantAttributeSets, ...tenantEmdConfigs];
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
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'parent', 'folders', 'attributeSets', 'configurations']
			});

			folderData = this._convertToJsonApiFormat(folderData, 'emd/folder', {
				'tenant': 'settings/account/basics/tenant',
				'parent': 'emd/folder',
				'folders': 'emd/folder',
				'attributeSets': 'emd/attribute-set',
				'configurations': 'emd/configuration'
			});


			const filterEmd = [];
			for(let idx = 0; idx < folderData.data.relationships.configurations.data.length; idx++) {
				const emd = folderData.data.relationships.configurations.data[idx].id;
				const checkemd = await dbSrvc.knex.raw(`SELECT * from tenant_emd_users  where tenant_emd_id = ? and tenant_user_id in(
					select id from tenants_users where tenant_id = ? and user_id = ? )`, [emd, ctxt.state.tenant.tenant_id, ctxt.state.user.user_id]);
				if(checkemd.rows.length > 0) filterEmd.push(folderData.data.relationships.configurations.data[idx]);
			}

			folderData.data.relationships.configurations['data'] = filterEmd;
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

	async _getTenantAttributeSets(ctxt) {
		try {
			let attrSetData = await this.$TenantAttributeSetModel
			.query(function(qb) {
				qb.where({ 'tenant_id': ctxt.state.tenant.tenant_id });
				qb.whereRaw(`tenant_folder_id IN (SELECT id FROM fn_get_folder_descendants((SELECT id FROM tenant_folders WHERE name = 'emd_feature.folder_names.attribute_sets.name' AND tenant_id = ?)))`, [ctxt.state.tenant.tenant_id]);
			})
			.fetchAll({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'properties', 'functions', 'configurations']
			});

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'emd/attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'emd/folder',
				'properties': 'emd/attribute-set-property',
				'functions': 'emd/attribute-set-function',
				'configurations': 'emd/configuration-attribute-set'
			});

			return attrSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAttributeSets`, err);
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
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'properties', 'functions', 'configurations']
			});

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'emd/attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'emd/folder',
				'properties': 'emd/attribute-set-property',
				'functions': 'emd/attribute-set-function',
				'configurations': 'emd/configuration-attribute-set'
			});

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

			let tenantModuleId = await dbSrvc.knex.raw(`SELECT id FROM tenants_modules WHERE tenant_id = ? AND module_id = (SELECT id FROM modules  WHERE name = ? AND type = 'feature')`, [ctxt.state.tenant.tenant_id, 'Emd']);
			if(!tenantModuleId.rows.length) throw new Error('Emd feature not enabled for this tenant');
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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'emd/attribute-set-property', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'emd/attribute-set'
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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'emd/attribute-set-function', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'emd/attribute-set',
				'observedProperties': 'emd/attribute-set-function-observed-property'
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

			attrSetObservedPropertyData = this._convertToJsonApiFormat(attrSetObservedPropertyData, 'emd/attribute-set-function-observed-property', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'emd/attribute-set',
				'attributeSetFunction': 'emd/attribute-set-function',
				'attributeSetProperty': 'emd/attribute-set-property'
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

	async _getTenantEmdConfigurations(ctxt) {
		try {
			let emdConfigurationData = await this.$TenantEmdConfigurationModel
			.query(function(qb) {
				qb
				.where({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetchAll({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'attributeSets', 'watchers']
			});

			emdConfigurationData = this._convertToJsonApiFormat(emdConfigurationData, 'emd/configuration', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'emd/folder',
				'attributeSets': 'emd/configuration-attribute-set',
				'watchers': 'emd/emd-watcher'
			});

			return emdConfigurationData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantEmdConfiguration`, err);
		}
	}

	async _getTenantEmdConfiguration(ctxt) {
		try {
			let emdConfigurationData = await this.$TenantEmdConfigurationModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.emd_configuration_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'attributeSets', 'watchers']
			});

			emdConfigurationData = this._convertToJsonApiFormat(emdConfigurationData, 'emd/configuration', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'emd/folder',
				'attributeSets': 'emd/configuration-attribute-set',
				'watchers': 'emd/emd-watcher'
			});

			return emdConfigurationData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantEmdConfiguration`, err);
		}
	}

	async _addTenantEmdConfiguration(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');
			jsonDeserializedData['attribute_set_metadata'] = safeJsonStringify(jsonDeserializedData['attribute_set_metadata']);

			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const savedRecord = await this.$TenantEmdConfigurationModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantEmdConfiguration`, err);
		}
	}

	async _updateTenantEmdConfiguration(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');
			if(jsonDeserializedData['attribute_set_metadata'] !== undefined) { // eslint-disable-line curly
				jsonDeserializedData['attribute_set_metadata'] = safeJsonStringify(jsonDeserializedData['attribute_set_metadata']);
			}

			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const savedRecord = await this.$TenantEmdConfigurationModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantEmdConfiguration`, err);
		}
	}

	async _deleteTenantEmdConfiguration(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const tenantEmdConfiguration = await this.$TenantEmdConfigurationModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.emd_configuration_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantEmdConfiguration) throw new Error('Unknown Tenant Emd Configuration');
			await dbSrvc.knex.raw('UPDATE tenant_plant_unit_lines SET supervisor_list_id = NULL,supervisor_list_filters = ? WHERE tenant_id = ? AND supervisor_list_id = ?', ['[]', ctxt.state.tenant.tenant_id, ctxt.params.emd_configuration_id]);
			await tenantEmdConfiguration.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantEmdConfiguration`, err);
		}
	}

	async _getTenantEmdConfigurationAttributeSet(ctxt) {
		try {
			let emdConfigurationAttributeSetData = await this.$TenantEmdConfigurationAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.emd_configuration_attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantEmdConfiguration', 'tenantAttributeSet']
			});

			emdConfigurationAttributeSetData = this._convertToJsonApiFormat(emdConfigurationAttributeSetData, 'emd/configuration-attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'tenantEmdConfiguration': 'emd/configuration',
				'tenantAttributeSet': 'emd/attribute-set'
			});

			return emdConfigurationAttributeSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantEmdConfigurationAttributeSet`, err);
		}
	}

	async _addTenantEmdConfigurationAttributeSet(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$TenantEmdConfigurationAttributeSetModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantEmdConfigurationAttributeSet`, err);
		}
	}

	async _updateTenantEmdConfigurationAttributeSet(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$TenantEmdConfigurationAttributeSetModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantEmdConfigurationAttributeSet`, err);
		}
	}

	async _deleteTenantEmdConfigurationAttributeSet(ctxt) {
		try {
			const tenantEmdConfigurationAttributeSet = await this.$TenantEmdConfigurationAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.emd_configuration_attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantEmdConfigurationAttributeSet) throw new Error('Unknown Tenant Emd Configuration Attribute Set');
			await tenantEmdConfigurationAttributeSet.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantEmdConfigurationAttributeSet`, err);
		}
	}

	async _getTenantPlantEmdWatcher(ctxt) {
		try {
			let emdWatcherData = await this.$EmdUserModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_emd_watcher_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantEmd', 'tenantUser']
			});

			emdWatcherData = this._convertToJsonApiFormat(emdWatcherData, 'emd/emd-watcher', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantEmd': 'emd/emd',
				'tenantUser': 'pug/user-manager/tenant-user'
			});

			return emdWatcherData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantEmdWatcher`, err);
		}
	}

	async _addTenantPlantEmdWatcher(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$EmdUserModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantEmdWatcher`, err);
		}
	}

	async _deleteTenantPlantEmdWatcher(ctxt) {
		try {
			const emdWatcher = await this.$EmdUserModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_emd_watcher_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!emdWatcher) throw new Error('Unknown Emd User mapping');

			await emdWatcher.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantEmdWatcher`, err);
		}
	}

	async _getPossibleEmdTenantUsersList(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const possibleTenantUsers = await dbSrvc.knex.raw(`SELECT A.id, B.first_name AS "firstName", B.middle_names AS "middleNames", B.last_name AS "lastName", B.email FROM tenants_users A INNER JOIN users B ON (A.user_id = B.id) WHERE A.tenant_id = ? AND A.access_status = 'authorized' AND A.id NOT IN (SELECT tenant_user_id FROM tenant_emd_users WHERE tenant_emd_id = ?)`, [ctxt.state.tenant.tenant_id, ctxt.query.emd]);
			return possibleTenantUsers.rows;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getPossibleEmdTenantUsersList`, err);
		}
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
		return super.dependencies;
	}
	// #endregion
}

exports.middleware = Main;
