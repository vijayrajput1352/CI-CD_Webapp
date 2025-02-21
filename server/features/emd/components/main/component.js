'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules.
 *
 * @ignore
 */

/**
 * Module dependencies, required for this module.
 *
 * @ignore
 */
const PlantWorksBaseComponent = require('plantworks-base-component').PlantWorksBaseComponent;
const PlantWorksComponentError = require('plantworks-component-error').PlantWorksComponentError;

/**
 * @class   Main
 * @extends {PlantWorksBaseComponent}
 * @classdesc The Main component of the Tenant Administration Feature - manages CRUD for the account.
 *
 *
 */
class Main extends PlantWorksBaseComponent {
	// #region Constructor
	constructor(parent, loader) {
		super(parent, loader);
	}
	// #endregion

	// #region Protected methods - need to be overriden by derived classes
	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof Main
	 * @name     _addRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds routes to the Koa Router.
	 */
	async _addRoutes() {
		try {
			this.$router.get('/tree', this.$parent._rbac('emd-read'), this._getApplicationTree.bind(this));
			this.$router.get('/retrieveDowntimeReasons/:emd_configuration_id/:machine_id/:filter_type', this.$parent._rbac('emd-read'), this._retrieveDowntimeReasons.bind(this));
			this.$router.get('/retrieveEmdExcel/:emd_configuration_id/', this.$parent._rbac('emd-read'), this._retrieveEmdExcel.bind(this));
			this.$router.post('/uploadData/:emd_configuration_id', this.$parent._rbac('emd-read'), this._uploadData.bind(this));
			this.$router.post('/commitData/:emd_configuration_id', this.$parent._rbac('emd-create'), this._commitData.bind(this));

			this.$router.get('/tree-nodes', this.$parent._rbac('emd-read'), this._getTreeNodes.bind(this));

			this.$router.get('/folders/:folder_id', this.$parent._rbac('emd-read'), this._getTenantFolder.bind(this));
			this.$router.post('/folders', this.$parent._rbac('emd-create'), this._addTenantFolder.bind(this));
			this.$router.patch('/folders/:folder_id', this.$parent._rbac('emd-update'), this._updateTenantFolder.bind(this));
			this.$router.delete('/folders/:folder_id', this.$parent._rbac('emd-delete'), this._deleteTenantFolder.bind(this));

			this.$router.get('/attribute-sets/', this.$parent._rbac('emd-read'), this._getTenantAttributeSets.bind(this));
			this.$router.get('/attribute-sets/:attribute_set_id', this.$parent._rbac('emd-read'), this._getTenantAttributeSet.bind(this));
			this.$router.post('/attribute-sets', this.$parent._rbac('emd-create'), this._addTenantAttributeSet.bind(this));
			this.$router.patch('/attribute-sets/:attribute_set_id', this.$parent._rbac('emd-update'), this._updateTenantAttributeSet.bind(this));
			this.$router.delete('/attribute-sets/:attribute_set_id', this.$parent._rbac('emd-delete'), this._deleteTenantAttributeSet.bind(this));

			this.$router.get('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('emd-read'), this._getTenantAttributeSetProperty.bind(this));
			this.$router.post('/attribute-set-properties', this.$parent._rbac('emd-create'), this._addTenantAttributeSetProperty.bind(this));
			this.$router.patch('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('emd-update'), this._updateTenantAttributeSetProperty.bind(this));
			this.$router.delete('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('emd-delete'), this._deleteTenantAttributeSetProperty.bind(this));

			this.$router.get('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('emd-read'), this._getTenantAttributeSetFunction.bind(this));
			this.$router.post('/attribute-set-functions', this.$parent._rbac('emd-create'), this._addTenantAttributeSetFunction.bind(this));
			this.$router.patch('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('emd-update'), this._updateTenantAttributeSetFunction.bind(this));
			this.$router.delete('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('emd-delete'), this._deleteTenantAttributeSetFunction.bind(this));

			this.$router.get('/attribute-set-function-observed-properties/:attribute_set_function_observed_property_id', this.$parent._rbac('emd-read'), this._getTenantAttributeSetFunctionObservedProperty.bind(this));
			this.$router.post('/attribute-set-function-observed-properties', this.$parent._rbac('emd-create'), this._addTenantAttributeSetFunctionObservedProperty.bind(this));
			this.$router.delete('/attribute-set-function-observed-properties/:attribute_set_function_observed_property_id', this.$parent._rbac('emd-delete'), this._deleteTenantAttributeSetFunctionObservedProperty.bind(this));

			this.$router.get('/configurations/', this.$parent._rbac('emd-read'), this._getTenantEmdConfigurations.bind(this));
			this.$router.get('/configurations/:emd_configuration_id', this.$parent._rbac('emd-read'), this._getTenantEmdConfiguration.bind(this));
			this.$router.post('/configurations', this.$parent._rbac('emd-create'), this._addTenantEmdConfiguration.bind(this));
			this.$router.patch('/configurations/:emd_configuration_id', this.$parent._rbac('emd-update'), this._updateTenantEmdConfiguration.bind(this));
			this.$router.delete('/configurations/:emd_configuration_id', this.$parent._rbac('emd-delete'), this._deleteTenantEmdConfiguration.bind(this));

			this.$router.get('/configuration-attribute-sets/:emd_configuration_attribute_set_id', this.$parent._rbac('emd-read'), this._getTenantEmdConfigurationAttributeSet.bind(this));
			this.$router.post('/configuration-attribute-sets/', this.$parent._rbac('emd-create'), this._addTenantEmdConfigurationAttributeSet.bind(this));
			this.$router.patch('/configuration-attribute-sets/:emd_configuration_attribute_set_id', this.$parent._rbac('emd-update'), this._updateTenantEmdConfigurationAttributeSet.bind(this));
			this.$router.delete('/configuration-attribute-sets/:emd_configuration_attribute_set_id', this.$parent._rbac('emd-delete'), this._deleteTenantEmdConfigurationAttributeSet.bind(this));

			this.$router.get('/emd-watchers/:plant_emd_watcher_id', this.$parent._rbac('emd-read'), this._getTenantPlantEmdWatcher.bind(this));
			this.$router.post('/emd-watchers', this.$parent._rbac('emd-create'), this._addTenantPlantEmdWatcher.bind(this));
			this.$router.delete('/emd-watchers/:plant_emd_watcher_id', this.$parent._rbac('emd-delete'), this._deleteTenantPlantEmdWatcher.bind(this));

			this.$router.get('/possibleTenantUsersList', this.$parent._rbac('emd-read'), this._getTenantPlantEmdPossibleWatchers.bind(this));

			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _getApplicationTree(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const applicationTreeData = await apiSrvc.execute('Main::getApplicationTree', ctxt);

			ctxt.status = 200;
			ctxt.body = applicationTreeData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving emd tree nodes`, err);
		}
	}

	async _retrieveEmdExcel(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::retrieveEmdExcel', ctxt);

			const send = require('koa-send');

			await send(ctxt, `emd/${ctxt.params.emd_configuration_id.replace(/-/g, '_')}.xlsx`);

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving emd excel file`, err);
		}
	}

	async _retrieveDowntimeReasons(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const masterData = await apiSrvc.execute('Main::retrieveDowntimeReasons', ctxt);

			ctxt.status = 200;
			ctxt.body = masterData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving emd data`, err);
		}
	}

	async _uploadData(ctxt) {
		try {
			ctxt.socket.setTimeout(600000);
			const apiSrvc = this.$dependencies.ApiService;
			let parsedSheets = await apiSrvc.execute('Main::parseXlsx', ctxt);

			parsedSheets = parsedSheets.shift();

			const parsedData = [];
			let emdEvaluator = await apiSrvc.execute('EmdProcessorFactory::evaluator', {
				'id': ctxt.params.emd_configuration_id,
				'type': 'emd'
			});
			emdEvaluator = emdEvaluator.shift();

			for(let idx = 0; idx < parsedSheets.length; idx++) {
				// eslint-disable-next-line security/detect-object-injection
				const sheet = parsedSheets[idx];
				const parsedRow = [];

				for(let idy = 0; idy < sheet.length; idy++) {
					// eslint-disable-next-line security/detect-object-injection
					const row = sheet[idy];

					const evaluatedRow = await emdEvaluator.evaluate(row);
					parsedRow.push(evaluatedRow);
				}

				parsedData.push(parsedRow);
			}

			if(parsedData.length !== 0) {
				if(parsedSheets.columns.length !== parsedData[0][0].inputParams.length) parsedData[0][0].columnMismatch = true;

				const uniqueId = parsedData[0][0].uniqueIdParameter;
				const uniqueMap = {};
				parsedData.forEach((sheet)=>{
					sheet.forEach((row)=>{
						// eslint-disable-next-line security/detect-object-injection
						const uniqueAttribute = row.attributes[uniqueId];

						// eslint-disable-next-line security/detect-object-injection
						if(!uniqueMap[uniqueAttribute]) {
							// eslint-disable-next-line security/detect-object-injection
							uniqueMap[uniqueAttribute] = true;
						}
						else {
							row.isDuplicate = true;
							row.rejected = true;
						}
					});
				});
			}

			if(parsedData[0][0].operationMetadata === 'Overwrite') {
				const uploadedMasterdataIds = [];
				parsedData.forEach((sheet) => {
					sheet.forEach((row) => {
						uploadedMasterdataIds.push(row.attributes[row.uniqueIdParameter]);
					});
				});

				const deactivatedRows = await this.$dependencies.DatabaseService.knex.raw(`SELECT values FROM tenant_emd_data WHERE tenant_id = ? AND tenant_emd_configuration_id = ? AND active = ? AND masterdata_id NOT IN (${uploadedMasterdataIds.map(() => { return '?'; }).join(',')})`, [
					ctxt.state.tenant['tenant_id'],
					ctxt.params.emd_configuration_id,
					true,
					...uploadedMasterdataIds
				]);

				deactivatedRows.rows.forEach((row) => {
					parsedData[0].push({
						'attributes': row['values'],
						'deactivate': true
					});
				});
			}

			ctxt.status = 200;
			ctxt.body = parsedData;

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error parsing uploaded Data`, err);
		}
	}

	async _commitData(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const emdData = await apiSrvc.execute('Main::commitData', ctxt);

			ctxt.status = 200;
			ctxt.body = emdData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error parsing uploaded Data`, err);
		}
	}

	async _getTreeNodes(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const treeNodeData = await apiSrvc.execute('Main::getTreeNodes', ctxt);

			ctxt.status = 200;
			ctxt.body = treeNodeData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving emd tree nodes`, err);
		}
	}

	async _getTenantFolder(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const folderData = await apiSrvc.execute('Main::getTenantFolder', ctxt);

			ctxt.status = 200;
			ctxt.body = folderData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving emd folder`, err);
		}
	}

	async _addTenantFolder(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantFolder = await apiSrvc.execute('Main::addTenantFolder', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantFolder.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant folder`, err);
		}
	}

	async _updateTenantFolder(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantFolder = await apiSrvc.execute('Main::updateTenantFolder', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantFolder.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant folder`, err);
		}
	}

	async _deleteTenantFolder(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantFolder', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant folder`, err);
		}
	}

	async _getTenantAttributeSets(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const attrSetData = await apiSrvc.execute('Main::getTenantAttributeSets', ctxt);

			ctxt.status = 200;
			ctxt.body = attrSetData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving emd attribute sets`, err);
		}
	}

	async _getTenantAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const attrSetData = await apiSrvc.execute('Main::getTenantAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = attrSetData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving emd attribute set`, err);
		}
	}

	async _addTenantAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantAttrSet = await apiSrvc.execute('Main::addTenantAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantAttrSet.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding emd attribute set`, err);
		}
	}

	async _updateTenantAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantAttrSet = await apiSrvc.execute('Main::updateTenantAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantAttrSet.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating emd attribute set`, err);
		}
	}

	async _deleteTenantAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantAttributeSet', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting emd attribute set`, err);
		}
	}

	async _getTenantAttributeSetProperty(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const attrSetPropertyData = await apiSrvc.execute('Main::getTenantAttributeSetProperty', ctxt);

			ctxt.status = 200;
			ctxt.body = attrSetPropertyData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving emd attribute set property`, err);
		}
	}

	async _addTenantAttributeSetProperty(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantAttrSetProperty = await apiSrvc.execute('Main::addTenantAttributeSetProperty', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantAttrSetProperty.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding emd attribute set property`, err);
		}
	}

	async _updateTenantAttributeSetProperty(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantAttrSetProperty = await apiSrvc.execute('Main::updateTenantAttributeSetProperty', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantAttrSetProperty.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating emd attribute set property`, err);
		}
	}

	async _deleteTenantAttributeSetProperty(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantAttributeSetProperty', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting emd attribute set property`, err);
		}
	}

	async _getTenantAttributeSetFunction(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const attrSetFunctionData = await apiSrvc.execute('Main::getTenantAttributeSetFunction', ctxt);

			ctxt.status = 200;
			ctxt.body = attrSetFunctionData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving emd attribute set function`, err);
		}
	}

	async _addTenantAttributeSetFunction(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantAttrSetFunction = await apiSrvc.execute('Main::addTenantAttributeSetFunction', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantAttrSetFunction.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding emd attribute set function`, err);
		}
	}

	async _updateTenantAttributeSetFunction(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantAttrSetFunction = await apiSrvc.execute('Main::updateTenantAttributeSetFunction', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantAttrSetFunction.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating emd attribute set function`, err);
		}
	}

	async _deleteTenantAttributeSetFunction(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantAttributeSetFunction', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting emd attribute set function`, err);
		}
	}

	async _getTenantAttributeSetFunctionObservedProperty(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const attrSetFunctionObservedPropertyData = await apiSrvc.execute('Main::getTenantAttributeSetFunctionObservedProperty', ctxt);

			ctxt.status = 200;
			ctxt.body = attrSetFunctionObservedPropertyData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving emd attribute set function observed property`, err);
		}
	}

	async _addTenantAttributeSetFunctionObservedProperty(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantAttrSetFunctionObservedProperty = await apiSrvc.execute('Main::addTenantAttributeSetFunctionObservedProperty', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantAttrSetFunctionObservedProperty.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding emd attribute set function observed property`, err);
		}
	}

	async _deleteTenantAttributeSetFunctionObservedProperty(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantAttributeSetFunctionObservedProperty', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting emd attribute set function observed property`, err);
		}
	}

	async _getTenantEmdConfigurations(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantEmdConfigurationData = await apiSrvc.execute('Main::getTenantEmdConfigurations', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantEmdConfigurationData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error getting tenant emd configurations`, err);
		}
	}

	async _getTenantEmdConfiguration(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantEmdConfigurationData = await apiSrvc.execute('Main::getTenantEmdConfiguration', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantEmdConfigurationData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error getting tenant emd configuration`, err);
		}
	}

	async _addTenantEmdConfiguration(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantEmdConfiguration = await apiSrvc.execute('Main::addTenantEmdConfiguration', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantEmdConfiguration.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant emd configuration`, err);
		}
	}

	async _updateTenantEmdConfiguration(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantEmdConfiguration = await apiSrvc.execute('Main::updateTenantEmdConfiguration', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantEmdConfiguration.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant emd configuration`, err);
		}
	}

	async _deleteTenantEmdConfiguration(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantEmdConfiguration', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant emd configuration`, err);
		}
	}

	async _getTenantEmdConfigurationAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantEmdConfigurationAttributeSetData = await apiSrvc.execute('Main::getTenantEmdConfigurationAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantEmdConfigurationAttributeSetData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error getting emd configuration attribute set`, err);
		}
	}

	async _addTenantEmdConfigurationAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantEmdConfigurationAttributeSetData = await apiSrvc.execute('Main::addTenantEmdConfigurationAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantEmdConfigurationAttributeSetData.shift();
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error creating emd configuration attribute set`, err);
		}
	}

	async _updateTenantEmdConfigurationAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantEmdConfigurationAttributeSetData = await apiSrvc.execute('Main::updateTenantEmdConfigurationAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantEmdConfigurationAttributeSetData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant emd configuration attribute set`, err);
		}
	}

	async _deleteTenantEmdConfigurationAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantEmdConfigurationAttributeSet', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting emd configuration attribute set`, err);
		}
	}

	async _getTenantPlantEmdWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const lineWatcherData = await apiSrvc.execute('Main::getTenantPlantEmdWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = lineWatcherData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving emd watcher`, err);
		}
	}

	async _addTenantPlantEmdWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantLineWatcher = await apiSrvc.execute('Main::addTenantPlantEmdWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantLineWatcher.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant emd watcher`, err);
		}
	}

	async _deleteTenantPlantEmdWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantEmdWatcher', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant emd watcher`, err);
		}
	}

	async _getTenantPlantEmdPossibleWatchers(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const possibleTenantUsers = await apiSrvc.execute('Main::possibleEmdTenantUsersList', ctxt);

			ctxt.status = 200;
			ctxt.body = possibleTenantUsers.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving possible watchers for the emd`, err);
		}
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get dependencies() {
		return ['ApiService', 'DatabaseService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.component = Main;
