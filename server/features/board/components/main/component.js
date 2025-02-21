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
			this.$router.get('/config-tree-nodes', this.$parent._rbac('board-read OR board-watch'), this._getConfigTreeNodes.bind(this));
			this.$router.get('/devenv-tree-nodes', this.$parent._rbac('board-read OR board-watch'), this._getDevEnvTreeNodes.bind(this));

			this.$router.get('/folders/:folder_id', this.$parent._rbac('board-read OR board-watch'), this._getTenantFolder.bind(this));
			this.$router.post('/folders', this.$parent._rbac('board-create'), this._addTenantFolder.bind(this));
			this.$router.patch('/folders/:folder_id', this.$parent._rbac('board-update'), this._updateTenantFolder.bind(this));
			this.$router.delete('/folders/:folder_id', this.$parent._rbac('board-delete'), this._deleteTenantFolder.bind(this));

			this.$router.get('/attribute-sets/:attribute_set_id', this.$parent._rbac('board-read OR board-watch'), this._getTenantAttributeSet.bind(this));
			this.$router.post('/attribute-sets', this.$parent._rbac('board-create'), this._addTenantAttributeSet.bind(this));
			this.$router.patch('/attribute-sets/:attribute_set_id', this.$parent._rbac('board-update'), this._updateTenantAttributeSet.bind(this));
			this.$router.delete('/attribute-sets/:attribute_set_id', this.$parent._rbac('board-delete'), this._deleteTenantAttributeSet.bind(this));
			this.$router.get('/attribute-sets', this.$parent._rbac('board-read OR board-watch'), this._getAllTenantAttributeSets.bind(this));

			this.$router.get('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('board-read OR board-watch'), this._getTenantAttributeSetProperty.bind(this));
			this.$router.post('/attribute-set-properties', this.$parent._rbac('board-create'), this._addTenantAttributeSetProperty.bind(this));
			this.$router.patch('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('board-update'), this._updateTenantAttributeSetProperty.bind(this));
			this.$router.delete('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('board-delete'), this._deleteTenantAttributeSetProperty.bind(this));

			this.$router.get('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('board-read OR board-watch'), this._getTenantAttributeSetFunction.bind(this));
			this.$router.post('/attribute-set-functions', this.$parent._rbac('board-create'), this._addTenantAttributeSetFunction.bind(this));
			this.$router.patch('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('board-update'), this._updateTenantAttributeSetFunction.bind(this));
			this.$router.delete('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('board-delete'), this._deleteTenantAttributeSetFunction.bind(this));

			this.$router.get('/attribute-set-function-observed-properties/:attribute_set_function_observed_property_id', this.$parent._rbac('board-read OR board-watch'), this._getTenantAttributeSetFunctionObservedProperty.bind(this));
			this.$router.post('/attribute-set-function-observed-properties', this.$parent._rbac('board-create'), this._addTenantAttributeSetFunctionObservedProperty.bind(this));
			this.$router.delete('/attribute-set-function-observed-properties/:attribute_set_function_observed_property_id', this.$parent._rbac('board-delete'), this._deleteTenantAttributeSetFunctionObservedProperty.bind(this));

			this.$router.get('/panels/:panel_id', this.$parent._rbac('board-read OR board-watch'), this._getTenantPanel.bind(this));
			this.$router.post('/panels', this.$parent._rbac('board-create'), this._addTenantPanel.bind(this));
			this.$router.patch('/panels/:panel_id', this.$parent._rbac('board-update'), this._updateTenantPanel.bind(this));
			this.$router.delete('/panels/:panel_id', this.$parent._rbac('board-delete'), this._deleteTenantPanel.bind(this));
			this.$router.get('/panels', this.$parent._rbac('board-read OR board-watch'), this._getAllTenantPanels.bind(this));

			this.$router.get('/panel-templates/:panel_template_id', this.$parent._rbac('board-read OR board-watch'), this._getTenantPanelTemplate.bind(this));
			this.$router.post('/panel-templates', this.$parent._rbac('board-create'), this._addTenantPanelTemplate.bind(this));
			this.$router.patch('/panel-templates/:panel_template_id', this.$parent._rbac('board-update'), this._updateTenantPanelTemplate.bind(this));

			this.$router.get('/panel-subcomponents/:panel_subcomponent_id', this.$parent._rbac('board-read OR board-watch'), this._getTenantPanelSubcomponent.bind(this));
			this.$router.post('/panel-subcomponents', this.$parent._rbac('board-create'), this._addTenantPanelSubcomponent.bind(this));
			this.$router.patch('/panel-subcomponents/:panel_subcomponent_id', this.$parent._rbac('board-update'), this._updateTenantPanelSubcomponent.bind(this));
			this.$router.delete('/panel-subcomponents/:panel_subcomponent_id', this.$parent._rbac('board-delete'), this._deleteTenantPanelSubcomponent.bind(this));

			this.$router.get('/panel-processors/:panel_processor_id', this.$parent._rbac('board-read OR board-watch'), this._getTenantPanelProcessor.bind(this));
			this.$router.post('/panel-processors', this.$parent._rbac('board-create'), this._addTenantPanelProcessor.bind(this));
			this.$router.patch('/panel-processors/:panel_processor_id', this.$parent._rbac('board-update'), this._updateTenantPanelProcessor.bind(this));

			this.$router.get('/panel-request-formatters/:panel_request_formatter_id', this.$parent._rbac('board-read OR board-watch'), this._getTenantPanelRequestFormatter.bind(this));
			this.$router.post('/panel-request-formatters', this.$parent._rbac('board-create'), this._addTenantPanelRequestFormatter.bind(this));
			this.$router.patch('/panel-request-formatters/:panel_request_formatter_id', this.$parent._rbac('board-update'), this._updateTenantPanelRequestFormatter.bind(this));

			this.$router.get('/panel-executors/:panel_executor_id', this.$parent._rbac('board-read OR board-watch'), this._getTenantPanelExecutor.bind(this));
			this.$router.post('/panel-executors', this.$parent._rbac('board-create'), this._addTenantPanelExecutor.bind(this));
			this.$router.patch('/panel-executors/:panel_executor_id', this.$parent._rbac('board-update'), this._updateTenantPanelExecutor.bind(this));

			this.$router.get('/panel-response-formatters/:panel_response_formatter_id', this.$parent._rbac('board-read OR board-watch'), this._getTenantPanelResponseFormatter.bind(this));
			this.$router.post('/panel-response-formatters', this.$parent._rbac('board-create'), this._addTenantPanelResponseFormatter.bind(this));
			this.$router.patch('/panel-response-formatters/:panel_response_formatter_id', this.$parent._rbac('board-update'), this._updateTenantPanelResponseFormatter.bind(this));

			this.$router.get('/panel-attribute-sets/:panel_attribute_set_id', this.$parent._rbac('board-read OR board-watch'), this._getTenantPanelAttributeSet.bind(this));
			this.$router.post('/panel-attribute-sets', this.$parent._rbac('board-create'), this._addTenantPanelAttributeSet.bind(this));
			this.$router.patch('/panel-attribute-sets/:panel_attribute_set_id', this.$parent._rbac('board-update'), this._updateTenantPanelAttributeSet.bind(this));
			this.$router.delete('/panel-attribute-sets/:panel_attribute_set_id', this.$parent._rbac('board-delete'), this._deleteTenantPanelAttributeSet.bind(this));

			this.$router.get('/panel-constituents/:panel_constituent_id', this.$parent._rbac('board-read OR board-watch'), this._getTenantPanelConstituent.bind(this));
			this.$router.post('/panel-constituents', this.$parent._rbac('board-create'), this._addTenantPanelConstituent.bind(this));
			this.$router.delete('/panel-constituents/:panel_constituent_id', this.$parent._rbac('board-delete'), this._deleteTenantPanelConstituent.bind(this));

			this.$router.get('/panel-watchers/:panel_watcher_id', this.$parent._rbac('board-read OR board-watch'), this._getTenantPanelWatcher.bind(this));
			this.$router.post('/panel-watchers', this.$parent._rbac('board-create'), this._addTenantPanelWatcher.bind(this));
			this.$router.delete('/panel-watchers/:panel_watcher_id', this.$parent._rbac('board-delete'), this._deleteTenantPanelWatcher.bind(this));

			this.$router.get('/possibleTenantUsersList', this.$parent._rbac('board-read OR board-watch'), this._getPossibleTenantUsersList.bind(this));

			this.$router.get('/panel-aggregates/:panel_aggregate_id', this.$parent._rbac('board-read OR board-watch'), this._getTenantPanelAggregate.bind(this));
			this.$router.post('/panel-aggregates', this.$parent._rbac('board-create'), this._addTenantPanelAggregate.bind(this));
			this.$router.patch('/panel-aggregates/:panel_aggregate_id', this.$parent._rbac('board-update'), this._updateTenantPanelAggregate.bind(this));
			this.$router.delete('/panel-aggregates/:panel_aggregate_id', this.$parent._rbac('board-delete'), this._deleteTenantPanelAggregate.bind(this));

			this.$router.post('/historicalData/:panel_id', this.$parent._rbac('board-read OR board-watch'), this._getHistoricalData.bind(this));
			this.$router.post('/execute', this.$parent._rbac('board-read OR board-watch'), this._executePanel.bind(this));

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
			throw new PlantWorksComponentError(`Error retrieving panel development environment tree nodes`, err);
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
			throw new PlantWorksComponentError(`Error retrieving panel folder`, err);
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
			throw new PlantWorksComponentError(`Error retrieving panel attribute set`, err);
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
			throw new PlantWorksComponentError(`Error adding panel attribute set`, err);
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
			throw new PlantWorksComponentError(`Error updating panel attribute set`, err);
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
			throw new PlantWorksComponentError(`Error deleting panel attribute set`, err);
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
			throw new PlantWorksComponentError(`Error retrieving all panel attribute sets`, err);
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
			throw new PlantWorksComponentError(`Error retrieving panel attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error adding panel attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error updating panel attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error deleting panel attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error retrieving panel attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error adding panel attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error updating panel attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error deleting panel attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error retrieving panel attribute set function observed property`, err);
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
			throw new PlantWorksComponentError(`Error adding panel attribute set function observed property`, err);
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
			throw new PlantWorksComponentError(`Error deleting panel attribute set function observed property`, err);
		}
	}

	async _getTenantPanel(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const panelData = await apiSrvc.execute('Main::getTenantPanel', ctxt);

			ctxt.status = 200;
			ctxt.body = panelData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving panel`, err);
		}
	}

	async _getAllTenantPanels(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const panelData = await apiSrvc.execute('Main::getAllTenantPanels', ctxt);

			ctxt.status = 200;
			ctxt.body = panelData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving all panels`, err);
		}
	}

	async _addTenantPanel(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanel = await apiSrvc.execute('Main::addTenantPanel', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanel.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant panel`, err);
		}
	}

	async _updateTenantPanel(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanel = await apiSrvc.execute('Main::updateTenantPanel', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanel.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant panel`, err);
		}
	}

	async _deleteTenantPanel(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPanel', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant panel`, err);
		}
	}

	async _getTenantPanelTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const panelTemplateData = await apiSrvc.execute('Main::getTenantPanelTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = panelTemplateData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving panel template`, err);
		}
	}

	async _addTenantPanelTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanelTemplate = await apiSrvc.execute('Main::addTenantPanelTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanelTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant panel template`, err);
		}
	}

	async _updateTenantPanelTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanelTemplate = await apiSrvc.execute('Main::updateTenantPanelTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanelTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant panel template`, err);
		}
	}

	async _getTenantPanelSubcomponent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const panelSubcomponentData = await apiSrvc.execute('Main::getTenantPanelSubcomponent', ctxt);

			ctxt.status = 200;
			ctxt.body = panelSubcomponentData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving panel subcomponent`, err);
		}
	}

	async _addTenantPanelSubcomponent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanelSubcomponent = await apiSrvc.execute('Main::addTenantPanelSubcomponent', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanelSubcomponent.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant panel subcomponent`, err);
		}
	}

	async _updateTenantPanelSubcomponent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanelSubcomponent = await apiSrvc.execute('Main::updateTenantPanelSubcomponent', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanelSubcomponent.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant panel subcomponent`, err);
		}
	}

	async _deleteTenantPanelSubcomponent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPanelSubcomponent', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant panel subcomponent`, err);
		}
	}

	async _getTenantPanelProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const panelProcessorData = await apiSrvc.execute('Main::getTenantPanelProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = panelProcessorData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving panel processor`, err);
		}
	}

	async _addTenantPanelProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanelProcessor = await apiSrvc.execute('Main::addTenantPanelProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanelProcessor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant panel processor`, err);
		}
	}

	async _updateTenantPanelProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanelProcessor = await apiSrvc.execute('Main::updateTenantPanelProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanelProcessor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant panel processor`, err);
		}
	}
	async _getTenantPanelRequestFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const PanelRequestFormatterData = await apiSrvc.execute('Main::getTenantPanelRequestFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = PanelRequestFormatterData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving panel request formatter`, err);
		}
	}

	async _addTenantPanelRequestFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanelRequestFormatter = await apiSrvc.execute('Main::addTenantPanelRequestFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanelRequestFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant panel request formatter`, err);
		}
	}

	async _updateTenantPanelRequestFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanelRequestFormatter = await apiSrvc.execute('Main::updateTenantPanelRequestFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanelRequestFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant panel request formatter`, err);
		}
	}

	async _getTenantPanelExecutor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const PanelExecutorData = await apiSrvc.execute('Main::getTenantPanelExecutor', ctxt);

			ctxt.status = 200;
			ctxt.body = PanelExecutorData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving panel executor`, err);
		}
	}

	async _addTenantPanelExecutor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanelExecutor = await apiSrvc.execute('Main::addTenantPanelExecutor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanelExecutor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant panel executor`, err);
		}
	}

	async _updateTenantPanelExecutor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanelExecutor = await apiSrvc.execute('Main::updateTenantPanelExecutor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanelExecutor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant panel executor`, err);
		}
	}

	async _getTenantPanelResponseFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const PanelResponseFormatterData = await apiSrvc.execute('Main::getTenantPanelResponseFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = PanelResponseFormatterData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving panel response formatter`, err);
		}
	}

	async _addTenantPanelResponseFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanelResponseFormatter = await apiSrvc.execute('Main::addTenantPanelResponseFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanelResponseFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant panel response formatter`, err);
		}
	}

	async _updateTenantPanelResponseFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanelResponseFormatter = await apiSrvc.execute('Main::updateTenantPanelResponseFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanelResponseFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant panel response formatter`, err);
		}
	}

	async _getTenantPanelAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const panelAttributeSetData = await apiSrvc.execute('Main::getTenantPanelAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = panelAttributeSetData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving panel attribute set`, err);
		}
	}

	async _addTenantPanelAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanelAttributeSet = await apiSrvc.execute('Main::addTenantPanelAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanelAttributeSet.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant panel attribute set`, err);
		}
	}

	async _updateTenantPanelAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanelAttributeSet = await apiSrvc.execute('Main::updateTenantPanelAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanelAttributeSet.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant panel attribute set`, err);
		}
	}

	async _deleteTenantPanelAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPanelAttributeSet', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant panel attribute set`, err);
		}
	}

	async _getTenantPanelConstituent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const panelConstituentData = await apiSrvc.execute('Main::getTenantPanelConstituent', ctxt);

			ctxt.status = 200;
			ctxt.body = panelConstituentData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving panel constituent`, err);
		}
	}

	async _addTenantPanelConstituent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanelConstituent = await apiSrvc.execute('Main::addTenantPanelConstituent', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanelConstituent.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant panel constituent`, err);
		}
	}

	async _deleteTenantPanelConstituent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPanelConstituent', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant panel constituent`, err);
		}
	}

	async _getTenantPanelWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const panelWatcherData = await apiSrvc.execute('Main::getTenantPanelWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = panelWatcherData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving panel watcher`, err);
		}
	}

	async _addTenantPanelWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanelWatcher = await apiSrvc.execute('Main::addTenantPanelWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanelWatcher.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant panel watcher`, err);
		}
	}

	async _deleteTenantPanelWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPanelWatcher', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant panel watcher`, err);
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
			throw new PlantWorksComponentError(`Error retrieving possible watchers for the panel`, err);
		}
	}

	async _getTenantPanelAggregate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const panelAggregateData = await apiSrvc.execute('Main::getTenantPanelAggregate', ctxt);

			ctxt.status = 200;
			ctxt.body = panelAggregateData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving panel attribute set`, err);
		}
	}

	async _addTenantPanelAggregate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanelAggregate = await apiSrvc.execute('Main::addTenantPanelAggregate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanelAggregate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant panel attribute set`, err);
		}
	}

	async _updateTenantPanelAggregate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPanelAggregate = await apiSrvc.execute('Main::updateTenantPanelAggregate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPanelAggregate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant panel attribute set`, err);
		}
	}

	async _deleteTenantPanelAggregate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPanelAggregate', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant panel attribute set`, err);
		}
	}


	async _getHistoricalData(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const possibleTenantUsers = await apiSrvc.execute('Main::historicalData', ctxt);

			ctxt.status = 200;
			ctxt.body = possibleTenantUsers.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving historical data for the panel`, err);
		}
	}

	async _executePanel(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const resultData = await apiSrvc.execute('RequestProcessor::execute', ctxt);

			ctxt.status = 200;
			ctxt.body = resultData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError('Error executing panel', err);
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
