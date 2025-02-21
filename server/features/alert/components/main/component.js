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
			this.$router.get('/config-tree-nodes', this.$parent._rbac('alert-read OR alert-watch'), this._getConfigTreeNodes.bind(this));
			this.$router.get('/devenv-tree-nodes', this.$parent._rbac('alert-read OR alert-watch'), this._getDevEnvTreeNodes.bind(this));

			this.$router.get('/folders/:folder_id', this.$parent._rbac('alert-read OR alert-watch'), this._getTenantFolder.bind(this));
			this.$router.post('/folders', this.$parent._rbac('alert-create'), this._addTenantFolder.bind(this));
			this.$router.patch('/folders/:folder_id', this.$parent._rbac('alert-update'), this._updateTenantFolder.bind(this));
			this.$router.delete('/folders/:folder_id', this.$parent._rbac('alert-delete'), this._deleteTenantFolder.bind(this));

			this.$router.get('/attribute-sets/:attribute_set_id', this.$parent._rbac('alert-read OR alert-watch'), this._getTenantAttributeSet.bind(this));
			this.$router.post('/attribute-sets', this.$parent._rbac('alert-create'), this._addTenantAttributeSet.bind(this));
			this.$router.patch('/attribute-sets/:attribute_set_id', this.$parent._rbac('alert-update'), this._updateTenantAttributeSet.bind(this));
			this.$router.delete('/attribute-sets/:attribute_set_id', this.$parent._rbac('alert-delete'), this._deleteTenantAttributeSet.bind(this));
			this.$router.get('/attribute-sets', this.$parent._rbac('alert-read OR alert-watch'), this._getAllTenantAttributeSets.bind(this));

			this.$router.get('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('alert-read OR alert-watch'), this._getTenantAttributeSetProperty.bind(this));
			this.$router.post('/attribute-set-properties', this.$parent._rbac('alert-create'), this._addTenantAttributeSetProperty.bind(this));
			this.$router.patch('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('alert-update'), this._updateTenantAttributeSetProperty.bind(this));
			this.$router.delete('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('alert-delete'), this._deleteTenantAttributeSetProperty.bind(this));

			this.$router.get('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('alert-read OR alert-watch'), this._getTenantAttributeSetFunction.bind(this));
			this.$router.post('/attribute-set-functions', this.$parent._rbac('alert-create'), this._addTenantAttributeSetFunction.bind(this));
			this.$router.patch('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('alert-update'), this._updateTenantAttributeSetFunction.bind(this));
			this.$router.delete('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('alert-delete'), this._deleteTenantAttributeSetFunction.bind(this));

			this.$router.get('/attribute-set-function-observed-properties/:attribute_set_function_observed_property_id', this.$parent._rbac('alert-read OR alert-watch'), this._getTenantAttributeSetFunctionObservedProperty.bind(this));
			this.$router.post('/attribute-set-function-observed-properties', this.$parent._rbac('alert-create'), this._addTenantAttributeSetFunctionObservedProperty.bind(this));
			this.$router.delete('/attribute-set-function-observed-properties/:attribute_set_function_observed_property_id', this.$parent._rbac('alert-delete'), this._deleteTenantAttributeSetFunctionObservedProperty.bind(this));

			this.$router.get('/alerts/:alert_id', this.$parent._rbac('alert-read OR alert-watch'), this._getTenantAlert.bind(this));
			this.$router.post('/alerts', this.$parent._rbac('alert-create'), this._addTenantAlert.bind(this));
			this.$router.patch('/alerts/:alert_id', this.$parent._rbac('alert-update'), this._updateTenantAlert.bind(this));
			this.$router.delete('/alerts/:alert_id', this.$parent._rbac('alert-delete'), this._deleteTenantAlert.bind(this));
			this.$router.get('/alerts', this.$parent._rbac('alert-read OR alert-watch'), this._getAllTenantAlert.bind(this));

			this.$router.get('/alert-processors/:alert_processor_id', this.$parent._rbac('alert-read OR alert-watch'), this._getTenantAlertProcessor.bind(this));
			this.$router.post('/alert-processors', this.$parent._rbac('alert-create'), this._addTenantAlertProcessor.bind(this));
			this.$router.patch('/alert-processors/:alert_processor_id', this.$parent._rbac('alert-update'), this._updateTenantAlertProcessor.bind(this));

			this.$router.get('/alert-response-formatters/:alert_response_formatter_id', this.$parent._rbac('alert-read OR alert-watch'), this._getTenantAlertResponseFormatter.bind(this));
			this.$router.post('/alert-response-formatters', this.$parent._rbac('alert-create'), this._addTenantAlertResponseFormatter.bind(this));
			this.$router.patch('/alert-response-formatters/:alert_response_formatter_id', this.$parent._rbac('alert-update'), this._updateTenantAlertResponseFormatter.bind(this));

			this.$router.get('/alert-attribute-sets/:alert_attribute_set_id', this.$parent._rbac('alert-read OR alert-watch'), this._getTenantAlertAttributeSet.bind(this));
			this.$router.post('/alert-attribute-sets', this.$parent._rbac('alert-create'), this._addTenantAlertAttributeSet.bind(this));
			this.$router.patch('/alert-attribute-sets/:alert_attribute_set_id', this.$parent._rbac('alert-update'), this._updateTenantAlertAttributeSet.bind(this));
			this.$router.delete('/alert-attribute-sets/:alert_attribute_set_id', this.$parent._rbac('alert-delete'), this._deleteTenantAlertAttributeSet.bind(this));

			this.$router.get('/alert-constituents/:alert_constituent_id', this.$parent._rbac('alert-read OR alert-watch'), this._getTenantAlertConstituent.bind(this));
			this.$router.post('/alert-constituents', this.$parent._rbac('alert-create'), this._addTenantAlertConstituent.bind(this));
			this.$router.delete('/alert-constituents/:alert_constituent_id', this.$parent._rbac('alert-delete'), this._deleteTenantAlertConstituent.bind(this));

			this.$router.get('/alert-watchers/:alert_watcher_id', this.$parent._rbac('alert-read OR alert-watch'), this._getTenantAlertWatcher.bind(this));
			this.$router.post('/alert-watchers', this.$parent._rbac('alert-create'), this._addTenantAlertWatcher.bind(this));
			this.$router.patch('/alert-watchers/:alert_watcher_id', this.$parent._rbac('alert-update'), this._updateTenantAlertWatcher.bind(this));
			this.$router.delete('/alert-watchers/:alert_watcher_id', this.$parent._rbac('alert-delete'), this._deleteTenantAlertWatcher.bind(this));

			this.$router.get('/possibleTenantUsersList', this.$parent._rbac('alert-read OR alert-watch'), this._getPossibleTenantUsersList.bind(this));
			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _getConfigTreeNodes(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const treeNodeData = await apiSrvc.execute('Main::getConfigTreeNodes', ctxt);

			ctxt.status = 200;
			ctxt.body = treeNodeData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving alert configuration tree nodes`, err);
		}
	}

	async _getDevEnvTreeNodes(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const treeNodeData = await apiSrvc.execute('Main::getDevEnvTreeNodes', ctxt);

			ctxt.status = 200;
			ctxt.body = treeNodeData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving alert development environment tree nodes`, err);
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
			throw new PlantWorksComponentError(`Error retrieving alert folder`, err);
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
			throw new PlantWorksComponentError(`Error adding alert folder`, err);
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
			throw new PlantWorksComponentError(`Error updating tenant alert folder`, err);
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

	async _getTenantAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const attrSetData = await apiSrvc.execute('Main::getTenantAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = attrSetData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving alert attribute set`, err);
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
			throw new PlantWorksComponentError(`Error adding alert attribute set`, err);
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
			throw new PlantWorksComponentError(`Error updating alert attribute set`, err);
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
			throw new PlantWorksComponentError(`Error deleting alert attribute set`, err);
		}
	}

	async _getAllTenantAttributeSets(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const attrSetData = await apiSrvc.execute('Main::getAllTenantAttributeSets', ctxt);

			ctxt.status = 200;
			ctxt.body = attrSetData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving all alert attribute sets`, err);
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
			throw new PlantWorksComponentError(`Error retrieving alert attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error adding alert attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error updating alert attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error deleting alert attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error retrieving alert attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error adding alert attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error updating alert attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error deleting alert attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error retrieving alert attribute set function observed property`, err);
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
			throw new PlantWorksComponentError(`Error adding alert attribute set function observed property`, err);
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
			throw new PlantWorksComponentError(`Error deleting alert attribute set function observed property`, err);
		}
	}

	async _getTenantAlert(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const alertData = await apiSrvc.execute('Main::getTenantAlert', ctxt);

			ctxt.status = 200;
			ctxt.body = alertData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving alert`, err);
		}
	}

	async _getAllTenantAlert(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const alertData = await apiSrvc.execute('Main::getAllTenantAlerts', ctxt);

			ctxt.status = 200;
			ctxt.body = alertData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving all alerts`, err);
		}
	}

	async _addTenantAlert(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantAlert = await apiSrvc.execute('Main::addTenantAlert', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantAlert.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant alert`, err);
		}
	}

	async _updateTenantAlert(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantAlert = await apiSrvc.execute('Main::updateTenantAlert', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantAlert.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant alert`, err);
		}
	}

	async _deleteTenantAlert(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantAlert', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant alert`, err);
		}
	}

	async _getTenantAlertProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const alertProcessorData = await apiSrvc.execute('Main::getTenantAlertProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = alertProcessorData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving alert processor`, err);
		}
	}

	async _addTenantAlertProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantAlertProcessor = await apiSrvc.execute('Main::addTenantAlertProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantAlertProcessor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant alert processor`, err);
		}
	}

	async _updateTenantAlertProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantAlertProcessor = await apiSrvc.execute('Main::updateTenantAlertProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantAlertProcessor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant alert processor`, err);
		}
	}

	async _getTenantAlertResponseFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const alertResponseFormatterData = await apiSrvc.execute('Main::getTenantAlertResponseFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = alertResponseFormatterData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving alert response formatter`, err);
		}
	}

	async _addTenantAlertResponseFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantAlertResponseFormatter = await apiSrvc.execute('Main::addTenantAlertResponseFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantAlertResponseFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant alert response formatter`, err);
		}
	}

	async _updateTenantAlertResponseFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantAlertResponseFormatter = await apiSrvc.execute('Main::updateTenantAlertResponseFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantAlertResponseFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant alert response formatter`, err);
		}
	}

	async _getTenantAlertAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const alertAttributeSetData = await apiSrvc.execute('Main::getTenantAlertAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = alertAttributeSetData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving alert attribute set`, err);
		}
	}

	async _addTenantAlertAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantAlertAttributeSet = await apiSrvc.execute('Main::addTenantAlertAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantAlertAttributeSet.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant alert attribute set`, err);
		}
	}

	async _updateTenantAlertAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantAlertAttributeSet = await apiSrvc.execute('Main::updateTenantAlertAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantAlertAttributeSet.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant alert attribute set`, err);
		}
	}

	async _deleteTenantAlertAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantAlertAttributeSet', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant alert attribute set`, err);
		}
	}

	async _getTenantAlertConstituent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const alertConstituentData = await apiSrvc.execute('Main::getTenantAlertConstituent', ctxt);

			ctxt.status = 200;
			ctxt.body = alertConstituentData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving alert constituent`, err);
		}
	}

	async _addTenantAlertConstituent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantAlertConstituent = await apiSrvc.execute('Main::addTenantAlertConstituent', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantAlertConstituent.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant alert constituent`, err);
		}
	}

	async _deleteTenantAlertConstituent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantAlertConstituent', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant alert constituent`, err);
		}
	}

	async _getTenantAlertWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const alertWatcherData = await apiSrvc.execute('Main::getTenantAlertWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = alertWatcherData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving alert watcher`, err);
		}
	}

	async _addTenantAlertWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantAlertWatcher = await apiSrvc.execute('Main::addTenantAlertWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantAlertWatcher.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant alert watcher`, err);
		}
	}

	async _updateTenantAlertWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const alertWatcherData = await apiSrvc.execute('Main::updateTenantAlertWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = alertWatcherData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating alert watcher`, err);
		}
	}

	async _deleteTenantAlertWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantAlertWatcher', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant alert watcher`, err);
		}
	}

	async _getPossibleTenantUsersList(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const possibleTenantUsers = await apiSrvc.execute('Main::possibleTenantUsersList', ctxt);

			ctxt.status = 200;
			ctxt.body = possibleTenantUsers.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving possible watchers for the alert`, err);
		}
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get dependencies() {
		return ['ApiService'].concat(super.dependencies);
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
