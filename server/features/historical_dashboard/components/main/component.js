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
 * @classdesc The Main component of the Historical Dashboard Feature - manages CRUD for the dashboards .
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
			this.$router.get('/config-tree-nodes', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getConfigTreeNodes.bind(this));
			this.$router.get('/devenv-tree-nodes', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getDevEnvTreeNodes.bind(this));

			this.$router.get('/folders/:folder_id', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getTenantFolder.bind(this));
			this.$router.post('/folders', this.$parent._rbac('historical-dashboard-create'), this._addTenantFolder.bind(this));
			this.$router.patch('/folders/:folder_id', this.$parent._rbac('historical-dashboard-update'), this._updateTenantFolder.bind(this));
			this.$router.delete('/folders/:folder_id', this.$parent._rbac('historical-dashboard-delete'), this._deleteTenantFolder.bind(this));

			this.$router.get('/attribute-sets/:attribute_set_id', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getTenantAttributeSet.bind(this));
			this.$router.post('/attribute-sets', this.$parent._rbac('historical-dashboard-create'), this._addTenantAttributeSet.bind(this));
			this.$router.patch('/attribute-sets/:attribute_set_id', this.$parent._rbac('historical-dashboard-update'), this._updateTenantAttributeSet.bind(this));
			this.$router.delete('/attribute-sets/:attribute_set_id', this.$parent._rbac('historical-dashboard-delete'), this._deleteTenantAttributeSet.bind(this));
			this.$router.get('/attribute-sets', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getAllTenantAttributeSets.bind(this));

			this.$router.get('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getTenantAttributeSetProperty.bind(this));
			this.$router.post('/attribute-set-properties', this.$parent._rbac('historical-dashboard-create'), this._addTenantAttributeSetProperty.bind(this));
			this.$router.patch('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('historical-dashboard-update'), this._updateTenantAttributeSetProperty.bind(this));
			this.$router.delete('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('historical-dashboard-delete'), this._deleteTenantAttributeSetProperty.bind(this));

			this.$router.get('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getTenantAttributeSetFunction.bind(this));
			this.$router.post('/attribute-set-functions', this.$parent._rbac('historical-dashboard-create'), this._addTenantAttributeSetFunction.bind(this));
			this.$router.patch('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('historical-dashboard-update'), this._updateTenantAttributeSetFunction.bind(this));
			this.$router.delete('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('historical-dashboard-delete'), this._deleteTenantAttributeSetFunction.bind(this));

			this.$router.get('/attribute-set-function-observed-properties/:attribute_set_function_observed_property_id', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getTenantAttributeSetFunctionObservedProperty.bind(this));
			this.$router.post('/attribute-set-function-observed-properties', this.$parent._rbac('historical-dashboard-create'), this._addTenantAttributeSetFunctionObservedProperty.bind(this));
			this.$router.delete('/attribute-set-function-observed-properties/:attribute_set_function_observed_property_id', this.$parent._rbac('historical-dashboard-delete'), this._deleteTenantAttributeSetFunctionObservedProperty.bind(this));

			this.$router.get('/historical-dashboards/:historical_dashboard_id', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getTenantHistoricalDashboard.bind(this));
			this.$router.post('/historical-dashboards', this.$parent._rbac('historical-dashboard-create'), this._addTenantHistoricalDashboard.bind(this));
			this.$router.patch('/historical-dashboards/:historical_dashboard_id', this.$parent._rbac('historical-dashboard-update'), this._updateTenantHistoricalDashboard.bind(this));
			this.$router.delete('/historical-dashboards/:historical_dashboard_id', this.$parent._rbac('historical-dashboard-delete'), this._deleteTenantHistoricalDashboard.bind(this));
			this.$router.get('/historical-dashboards', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getAllTenantHistoricalDashboards.bind(this));

			this.$router.get('/historical-dashboard-attribute-sets/:historical_dashboard_attribute_set_id', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getTenantHistoricalDashboardAttributeSet.bind(this));
			this.$router.post('/historical-dashboard-attribute-sets', this.$parent._rbac('historical-dashboard-create'), this._addTenantHistoricalDashboardAttributeSet.bind(this));
			this.$router.patch('/historical-dashboard-attribute-sets/:historical_dashboard_attribute_set_id', this.$parent._rbac('historical-dashboard-update'), this._updateTenantHistoricalDashboardAttributeSet.bind(this));
			this.$router.delete('/historical-dashboard-attribute-sets/:historical_dashboard_attribute_set_id', this.$parent._rbac('historical-dashboard-delete'), this._deleteTenantHistoricalDashboardAttributeSet.bind(this));

			this.$router.get('/historical-dashboard-constituents/:historical_dashboard_constituent_id', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getTenantHistoricalDashboardConstituent.bind(this));
			this.$router.post('/historical-dashboard-constituents', this.$parent._rbac('historical-dashboard-create'), this._addTenantHistoricalDashboardConstituent.bind(this));
			this.$router.delete('/historical-dashboard-constituents/:historical_dashboard_constituent_id', this.$parent._rbac('historical-dashboard-delete'), this._deleteTenantHistoricalDashboardConstituent.bind(this));

			this.$router.get('/historical-dashboard-processors/:historical_dashboard_processor_id', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getTenantHistoricalDashboardProcessor.bind(this));
			this.$router.post('/historical-dashboard-processors', this.$parent._rbac('historical-dashboard-create'), this._addTenantHistoricalDashboardProcessor.bind(this));
			this.$router.patch('/historical-dashboard-processors/:historical_dashboard_processor_id', this.$parent._rbac('historical-dashboard-update'), this._updateTenantHistoricalDashboardProcessor.bind(this));

			this.$router.get('/historical-dashboard-request-formatters/:historical_dashboard_request_formatter_id', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getTenantHistoricalDashboardRequestFormatter.bind(this));
			this.$router.post('/historical-dashboard-request-formatters', this.$parent._rbac('historical-dashboard-create'), this._addTenantHistoricalDashboardRequestFormatter.bind(this));
			this.$router.patch('/historical-dashboard-request-formatters/:historical_dashboard_request_formatter_id', this.$parent._rbac('historical-dashboard-update'), this._updateTenantHistoricalDashboardRequestFormatter.bind(this));

			this.$router.get('/historical-dashboard-executors/:historical_dashboard_executor_id', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getTenantHistoricalDashboardExecutor.bind(this));
			this.$router.post('/historical-dashboard-executors', this.$parent._rbac('historical-dashboard-create'), this._addTenantHistoricalDashboardExecutor.bind(this));
			this.$router.patch('/historical-dashboard-executors/:historical_dashboard_executor_id', this.$parent._rbac('historical-dashboard-update'), this._updateTenantHistoricalDashboardExecutor.bind(this));

			this.$router.get('/historical-dashboard-response-formatters/:historical_dashboard_response_formatter_id', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getTenantHistoricalDashboardResponseFormatter.bind(this));
			this.$router.post('/historical-dashboard-response-formatters', this.$parent._rbac('historical-dashboard-create'), this._addTenantHistoricalDashboardResponseFormatter.bind(this));
			this.$router.patch('/historical-dashboard-response-formatters/:historical_dashboard_response_formatter_id', this.$parent._rbac('historical-dashboard-update'), this._updateTenantHistoricalDashboardResponseFormatter.bind(this));

			this.$router.get('/historical-dashboard-input-templates/:historical_dashboard_input_template_id', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getTenantHistoricalDashboardInputTemplate.bind(this));
			this.$router.post('/historical-dashboard-input-templates', this.$parent._rbac('historical-dashboard-create'), this._addTenantHistoricalDashboardInputTemplate.bind(this));
			this.$router.patch('/historical-dashboard-input-templates/:historical_dashboard_input_template_id', this.$parent._rbac('historical-dashboard-update'), this._updateTenantHistoricalDashboardInputTemplate.bind(this));

			this.$router.get('/historical-dashboard-result-templates/:historical_dashboard_result_template_id', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getTenantHistoricalDashboardResultTemplate.bind(this));
			this.$router.post('/historical-dashboard-result-templates', this.$parent._rbac('historical-dashboard-create'), this._addTenantHistoricalDashboardResultTemplate.bind(this));
			this.$router.patch('/historical-dashboard-result-templates/:historical_dashboard_result_template_id', this.$parent._rbac('historical-dashboard-update'), this._updateTenantHistoricalDashboardResultTemplate.bind(this));

			this.$router.get('/historical-dashboard-watchers/:historical_dashboard_watcher_id', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getTenantHistoricalDashboardWatcher.bind(this));
			this.$router.post('/historical-dashboard-watchers', this.$parent._rbac('historical-dashboard-create'), this._addTenantHistoricalDashboardWatcher.bind(this));
			this.$router.delete('/historical-dashboard-watchers/:historical_dashboard_watcher_id', this.$parent._rbac('historical-dashboard-delete'), this._deleteTenantHistoricalDashboardWatcher.bind(this));

			this.$router.get('/possibleTenantUsersList', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getPossibleTenantUsersList.bind(this));

			this.$router.get('/historical-dashboard-aggregates/:historical_dashboard_aggregate_id', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._getTenantHistoricalDashboardAggregate.bind(this));
			this.$router.post('/historical-dashboard-aggregates', this.$parent._rbac('historical-dashboard-create'), this._addTenantHistoricalDashboardAggregate.bind(this));
			this.$router.patch('/historical-dashboard-aggregates/:historical_dashboard_aggregate_id', this.$parent._rbac('historical-dashboard-update'), this._updateTenantHistoricalDashboardAggregate.bind(this));
			this.$router.delete('/historical-dashboard-aggregates/:historical_dashboard_aggregate_id', this.$parent._rbac('historical-dashboard-delete'), this._deleteTenantHistoricalDashboardAggregate.bind(this));

			this.$router.post('/execute', this.$parent._rbac('historical-dashboard-read OR historical-dashboard-watch'), this._executeHistoricalDashboard.bind(this));

			this.$router.get('/historical-dashboard-subcomponents/:historical_dashboard_subcomponent_id', this.$parent._rbac('board-read OR board-watch'), this._getTenantHistoricalDashboardSubcomponent.bind(this));
			this.$router.post('/historical-dashboard-subcomponents', this.$parent._rbac('board-create'), this._addTenantHistoricalDashboardSubcomponent.bind(this));
			this.$router.patch('/historical-dashboard-subcomponents/:historical_dashboard_subcomponent_id', this.$parent._rbac('board-update'), this._updateTenantHistoricalDashboardSubcomponent.bind(this));
			this.$router.delete('/historical-dashboard-subcomponents/:historical_dashboard_subcomponent_id', this.$parent._rbac('board-delete'), this._deleteTenantHistoricalDashboardSubcomponent.bind(this));

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
			throw new PlantWorksComponentError(`Error retrieving manufacturing configuration tree nodes`, err);
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
			throw new PlantWorksComponentError(`Error retrieving historical dashboard development environment tree nodes`, err);
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
			throw new PlantWorksComponentError(`Error retrieving historical dashboard folder`, err);
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

	async _getTenantAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const attrSetData = await apiSrvc.execute('Main::getTenantAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = attrSetData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving historical dashboard attribute set`, err);
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
			throw new PlantWorksComponentError(`Error adding historical dashboard attribute set`, err);
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
			throw new PlantWorksComponentError(`Error updating historical dashboard attribute set`, err);
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
			throw new PlantWorksComponentError(`Error deleting historical dashboard attribute set`, err);
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
			throw new PlantWorksComponentError(`Error retrieving all historical dashboard attribute sets`, err);
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
			throw new PlantWorksComponentError(`Error retrieving historical dashboard attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error adding historical dashboard attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error updating historical dashboard attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error deleting historical dashboard attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error retrieving historical dashboard attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error adding historical dashboard attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error updating historical dashboard attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error deleting historical dashboard attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error retrieving historical dashboard attribute set function observed property`, err);
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
			throw new PlantWorksComponentError(`Error adding historical dashboard attribute set function observed property`, err);
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
			throw new PlantWorksComponentError(`Error deleting historical dashboard attribute set function observed property`, err);
		}
	}

	async _getTenantHistoricalDashboard(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const historicalDashboardData = await apiSrvc.execute('Main::getTenantHistoricalDashboard', ctxt);

			ctxt.status = 200;
			ctxt.body = historicalDashboardData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving historical dashboard`, err);
		}
	}

	async _getAllTenantHistoricalDashboards(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const historicalDashboardData = await apiSrvc.execute('Main::getAllTenantHistoricalDashboards', ctxt);

			ctxt.status = 200;
			ctxt.body = historicalDashboardData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving all historical dashboards`, err);
		}
	}

	async _addTenantHistoricalDashboard(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboard = await apiSrvc.execute('Main::addTenantHistoricalDashboard', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboard.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant historical dashboard`, err);
		}
	}

	async _updateTenantHistoricalDashboard(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboard = await apiSrvc.execute('Main::updateTenantHistoricalDashboard', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboard.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant historical dashboard`, err);
		}
	}

	async _deleteTenantHistoricalDashboard(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantHistoricalDashboard', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant historical dashboard`, err);
		}
	}

	async _getTenantHistoricalDashboardAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const historicalDashboardAttributeSetData = await apiSrvc.execute('Main::getTenantHistoricalDashboardAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = historicalDashboardAttributeSetData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving historical dashboard attribute set`, err);
		}
	}

	async _addTenantHistoricalDashboardAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboardAttributeSet = await apiSrvc.execute('Main::addTenantHistoricalDashboardAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboardAttributeSet.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant historical dashboard attribute set`, err);
		}
	}

	async _updateTenantHistoricalDashboardAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboardAttributeSet = await apiSrvc.execute('Main::updateTenantHistoricalDashboardAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboardAttributeSet.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant historical dashboard attribute set`, err);
		}
	}

	async _deleteTenantHistoricalDashboardAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantHistoricalDashboardAttributeSet', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant historical dashboard attribute set`, err);
		}
	}

	async _getTenantHistoricalDashboardConstituent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const historicalDashboardConstituentData = await apiSrvc.execute('Main::getTenantHistoricalDashboardConstituent', ctxt);

			ctxt.status = 200;
			ctxt.body = historicalDashboardConstituentData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving historical dashboard constituent`, err);
		}
	}

	async _addTenantHistoricalDashboardConstituent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboardConstituent = await apiSrvc.execute('Main::addTenantHistoricalDashboardConstituent', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboardConstituent.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant historical dashboard constituent`, err);
		}
	}

	async _deleteTenantHistoricalDashboardConstituent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantHistoricalDashboardConstituent', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant historical dashboard constituent`, err);
		}
	}

	async _getTenantHistoricalDashboardProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const historicalDashboardProcessorData = await apiSrvc.execute('Main::getTenantHistoricalDashboardProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = historicalDashboardProcessorData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving historical dashboard processor`, err);
		}
	}

	async _addTenantHistoricalDashboardProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboardProcessor = await apiSrvc.execute('Main::addTenantHistoricalDashboardProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboardProcessor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant historical dashboard processor`, err);
		}
	}

	async _updateTenantHistoricalDashboardProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboardProcessor = await apiSrvc.execute('Main::updateTenantHistoricalDashboardProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboardProcessor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant historical dashboard processor`, err);
		}
	}

	async _getTenantHistoricalDashboardRequestFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const historicalDashboardRequestFormatterData = await apiSrvc.execute('Main::getTenantHistoricalDashboardRequestFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = historicalDashboardRequestFormatterData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving historical dashboard request formatter`, err);
		}
	}

	async _addTenantHistoricalDashboardRequestFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboardRequestFormatter = await apiSrvc.execute('Main::addTenantHistoricalDashboardRequestFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboardRequestFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant historical dashboard request formatter`, err);
		}
	}

	async _updateTenantHistoricalDashboardRequestFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboardRequestFormatter = await apiSrvc.execute('Main::updateTenantHistoricalDashboardRequestFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboardRequestFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant historical dashboard request formatter`, err);
		}
	}

	async _getTenantHistoricalDashboardExecutor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const historicalDashboardExecutorData = await apiSrvc.execute('Main::getTenantHistoricalDashboardExecutor', ctxt);

			ctxt.status = 200;
			ctxt.body = historicalDashboardExecutorData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving historical dashboard executor`, err);
		}
	}

	async _addTenantHistoricalDashboardExecutor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboardExecutor = await apiSrvc.execute('Main::addTenantHistoricalDashboardExecutor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboardExecutor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant historical dashboard executor`, err);
		}
	}

	async _updateTenantHistoricalDashboardExecutor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboardExecutor = await apiSrvc.execute('Main::updateTenantHistoricalDashboardExecutor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboardExecutor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant historical dashboard executor`, err);
		}
	}

	async _getTenantHistoricalDashboardResponseFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const historicalDashboardResponseFormatterData = await apiSrvc.execute('Main::getTenantHistoricalDashboardResponseFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = historicalDashboardResponseFormatterData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving historical dashboard response formatter`, err);
		}
	}

	async _addTenantHistoricalDashboardResponseFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboardResponseFormatter = await apiSrvc.execute('Main::addTenantHistoricalDashboardResponseFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboardResponseFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant historical dashboard response formatter`, err);
		}
	}

	async _updateTenantHistoricalDashboardResponseFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboardResponseFormatter = await apiSrvc.execute('Main::updateTenantHistoricalDashboardResponseFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboardResponseFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant historical dashboard response formatter`, err);
		}
	}

	async _getTenantHistoricalDashboardInputTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const historicalDashboardInputTemplateData = await apiSrvc.execute('Main::getTenantHistoricalDashboardInputTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = historicalDashboardInputTemplateData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving historical dashboard input template`, err);
		}
	}

	async _addTenantHistoricalDashboardInputTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboardInputTemplate = await apiSrvc.execute('Main::addTenantHistoricalDashboardInputTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboardInputTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant historical dashboard input template`, err);
		}
	}

	async _updateTenantHistoricalDashboardInputTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboardInputTemplate = await apiSrvc.execute('Main::updateTenantHistoricalDashboardInputTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboardInputTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant historical dashboard input template`, err);
		}
	}

	async _getTenantHistoricalDashboardResultTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const historicalDashboardResultTemplateData = await apiSrvc.execute('Main::getTenantHistoricalDashboardResultTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = historicalDashboardResultTemplateData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving historical dashboard result template`, err);
		}
	}

	async _addTenantHistoricalDashboardResultTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboardResultTemplate = await apiSrvc.execute('Main::addTenantHistoricalDashboardResultTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboardResultTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant historical dashboard input template`, err);
		}
	}

	async _updateTenantHistoricalDashboardResultTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboardResultTemplate = await apiSrvc.execute('Main::updateTenantHistoricalDashboardResultTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboardResultTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant historical dashboard input template`, err);
		}
	}

	async _getTenantHistoricalDashboardWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const historicalDashboardWatcherData = await apiSrvc.execute('Main::getTenantHistoricalDashboardWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = historicalDashboardWatcherData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving historical dashboard watcher`, err);
		}
	}

	async _addTenantHistoricalDashboardWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboardWatcher = await apiSrvc.execute('Main::addTenantHistoricalDashboardWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboardWatcher.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant historical dashboard watcher`, err);
		}
	}

	async _deleteTenantHistoricalDashboardWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantHistoricalDashboardWatcher', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant historical dashboard watcher`, err);
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
			throw new PlantWorksComponentError(`Error retrieving possible watchers for the historical dashboard`, err);
		}
	}

	async _getTenantHistoricalDashboardAggregate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const historicalDashboardAggregateData = await apiSrvc.execute('Main::getTenantHistoricalDashboardAggregate', ctxt);

			ctxt.status = 200;
			ctxt.body = historicalDashboardAggregateData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving historical-dashboard aggregate`, err);
		}
	}

	async _addTenantHistoricalDashboardAggregate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboardAggregate = await apiSrvc.execute('Main::addTenantHistoricalDashboardAggregate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboardAggregate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant historical-dashboard aggregate`, err);
		}
	}

	async _updateTenantHistoricalDashboardAggregate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantHistoricalDashboardAggregate = await apiSrvc.execute('Main::updateTenantHistoricalDashboardAggregate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantHistoricalDashboardAggregate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant historical-dashboard aggregate`, err);
		}
	}

	async _deleteTenantHistoricalDashboardAggregate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantHistoricalDashboardAggregate', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant historical-dashboard aggregate`, err);
		}
	}

	async _executeHistoricalDashboard(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const resultData = await apiSrvc.execute('RequestProcessor::execute', ctxt);

			ctxt.status = 200;
			ctxt.body = resultData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error executing historical dashboard`, err);
		}
	}

	async _getTenantHistoricalDashboardSubcomponent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const historicalDashboardSubcomponentData = await apiSrvc.execute('Main::getTenantHistoricalDashboardSubcomponent', ctxt);

			ctxt.status = 200;
			ctxt.body = historicalDashboardSubcomponentData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving historical dashboard subcomponent`, err);
		}
	}

	async _addTenantHistoricalDashboardSubcomponent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const historicalDashboardPanelSubcomponent = await apiSrvc.execute('Main::addTenantHistoricalDashboardSubcomponent', ctxt);

			ctxt.status = 200;
			ctxt.body = historicalDashboardPanelSubcomponent.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant historical dashboard subcomponent`, err);
		}
	}

	async _updateTenantHistoricalDashboardSubcomponent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const historicalDashboardPanelSubcomponent = await apiSrvc.execute('Main::updateTenantHistoricalDashboardSubcomponent', ctxt);

			ctxt.status = 200;
			ctxt.body = historicalDashboardPanelSubcomponent.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant historical dashboard subcomponent`, err);
		}
	}

	async _deleteTenantHistoricalDashboardSubcomponent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantHistoricalDashboardSubcomponent', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant historical dashboard subcomponent`, err);
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
