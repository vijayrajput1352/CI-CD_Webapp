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
 * @classdesc The Main component of the Report Feature - manages CRUD for report/report.
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
			this.$router.get('/config-tree-nodes', this.$parent._rbac('report-read OR report-watch'), this._getConfigTreeNodes.bind(this));
			this.$router.get('/devenv-tree-nodes', this.$parent._rbac('report-read OR report-watch'), this._getDevEnvTreeNodes.bind(this));

			this.$router.get('/folders/:folder_id', this.$parent._rbac('report-read OR report-watch'), this._getTenantFolder.bind(this));
			this.$router.post('/folders', this.$parent._rbac('report-create'), this._addTenantFolder.bind(this));
			this.$router.patch('/folders/:folder_id', this.$parent._rbac('report-update'), this._updateTenantFolder.bind(this));
			this.$router.delete('/folders/:folder_id', this.$parent._rbac('report-delete'), this._deleteTenantFolder.bind(this));

			this.$router.get('/attribute-sets/:attribute_set_id', this.$parent._rbac('report-read OR report-watch'), this._getTenantAttributeSet.bind(this));
			this.$router.post('/attribute-sets', this.$parent._rbac('report-create'), this._addTenantAttributeSet.bind(this));
			this.$router.patch('/attribute-sets/:attribute_set_id', this.$parent._rbac('report-update'), this._updateTenantAttributeSet.bind(this));
			this.$router.delete('/attribute-sets/:attribute_set_id', this.$parent._rbac('report-delete'), this._deleteTenantAttributeSet.bind(this));
			this.$router.get('/attribute-sets', this.$parent._rbac('report-read OR report-watch'), this._getAllTenantAttributeSets.bind(this));

			this.$router.get('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('report-read OR report-watch'), this._getTenantAttributeSetProperty.bind(this));
			this.$router.post('/attribute-set-properties', this.$parent._rbac('report-create'), this._addTenantAttributeSetProperty.bind(this));
			this.$router.patch('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('report-update'), this._updateTenantAttributeSetProperty.bind(this));
			this.$router.delete('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('report-delete'), this._deleteTenantAttributeSetProperty.bind(this));

			this.$router.get('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('report-read OR report-watch'), this._getTenantAttributeSetFunction.bind(this));
			this.$router.post('/attribute-set-functions', this.$parent._rbac('report-create'), this._addTenantAttributeSetFunction.bind(this));
			this.$router.patch('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('report-update'), this._updateTenantAttributeSetFunction.bind(this));
			this.$router.delete('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('report-delete'), this._deleteTenantAttributeSetFunction.bind(this));

			this.$router.get('/attribute-set-function-observed-properties/:attribute_set_function_observed_property_id', this.$parent._rbac('report-read OR report-watch'), this._getTenantAttributeSetFunctionObservedProperty.bind(this));
			this.$router.post('/attribute-set-function-observed-properties', this.$parent._rbac('report-create'), this._addTenantAttributeSetFunctionObservedProperty.bind(this));
			this.$router.delete('/attribute-set-function-observed-properties/:attribute_set_function_observed_property_id', this.$parent._rbac('report-delete'), this._deleteTenantAttributeSetFunctionObservedProperty.bind(this));

			this.$router.get('/reports/:report_id', this.$parent._rbac('report-read OR report-watch'), this._getTenantReport.bind(this));
			this.$router.post('/reports', this.$parent._rbac('report-create'), this._addTenantReport.bind(this));
			this.$router.patch('/reports/:report_id', this.$parent._rbac('report-update'), this._updateTenantReport.bind(this));
			this.$router.delete('/reports/:report_id', this.$parent._rbac('report-delete'), this._deleteTenantReport.bind(this));
			this.$router.get('/reports', this.$parent._rbac('report-read OR report-watch'), this._getAllTenantReports.bind(this));

			this.$router.get('/report-attribute-sets/:report_attribute_set_id', this.$parent._rbac('report-read OR report-watch'), this._getTenantReportAttributeSet.bind(this));
			this.$router.post('/report-attribute-sets', this.$parent._rbac('report-create'), this._addTenantReportAttributeSet.bind(this));
			this.$router.patch('/report-attribute-sets/:report_attribute_set_id', this.$parent._rbac('report-update'), this._updateTenantReportAttributeSet.bind(this));
			this.$router.delete('/report-attribute-sets/:report_attribute_set_id', this.$parent._rbac('report-delete'), this._deleteTenantReportAttributeSet.bind(this));

			this.$router.get('/report-constituents/:report_constituent_id', this.$parent._rbac('report-read OR report-watch'), this._getTenantReportConstituent.bind(this));
			this.$router.post('/report-constituents', this.$parent._rbac('report-create'), this._addTenantReportConstituent.bind(this));
			this.$router.delete('/report-constituents/:report_constituent_id', this.$parent._rbac('report-delete'), this._deleteTenantReportConstituent.bind(this));

			this.$router.get('/report-processors/:report_processor_id', this.$parent._rbac('report-read OR report-watch'), this._getTenantReportProcessor.bind(this));
			this.$router.post('/report-processors', this.$parent._rbac('report-create'), this._addTenantReportProcessor.bind(this));
			this.$router.patch('/report-processors/:report_processor_id', this.$parent._rbac('report-update'), this._updateTenantReportProcessor.bind(this));

			this.$router.get('/report-request-formatters/:report_request_formatter_id', this.$parent._rbac('report-read OR report-watch'), this._getTenantReportRequestFormatter.bind(this));
			this.$router.post('/report-request-formatters', this.$parent._rbac('report-create'), this._addTenantReportRequestFormatter.bind(this));
			this.$router.patch('/report-request-formatters/:report_request_formatter_id', this.$parent._rbac('report-update'), this._updateTenantReportRequestFormatter.bind(this));

			this.$router.get('/report-executors/:report_executor_id', this.$parent._rbac('report-read OR report-watch'), this._getTenantReportExecutor.bind(this));
			this.$router.post('/report-executors', this.$parent._rbac('report-create'), this._addTenantReportExecutor.bind(this));
			this.$router.patch('/report-executors/:report_executor_id', this.$parent._rbac('report-update'), this._updateTenantReportExecutor.bind(this));

			this.$router.get('/report-response-formatters/:report_response_formatter_id', this.$parent._rbac('report-read OR report-watch'), this._getTenantReportResponseFormatter.bind(this));
			this.$router.post('/report-response-formatters', this.$parent._rbac('report-create'), this._addTenantReportResponseFormatter.bind(this));
			this.$router.patch('/report-response-formatters/:report_response_formatter_id', this.$parent._rbac('report-update'), this._updateTenantReportResponseFormatter.bind(this));

			this.$router.get('/report-input-templates/:report_input_template_id', this.$parent._rbac('report-read OR report-watch'), this._getTenantReportInputTemplate.bind(this));
			this.$router.post('/report-input-templates', this.$parent._rbac('report-create'), this._addTenantReportInputTemplate.bind(this));
			this.$router.patch('/report-input-templates/:report_input_template_id', this.$parent._rbac('report-update'), this._updateTenantReportInputTemplate.bind(this));

			this.$router.get('/report-result-templates/:report_result_template_id', this.$parent._rbac('report-read OR report-watch'), this._getTenantReportResultTemplate.bind(this));
			this.$router.post('/report-result-templates', this.$parent._rbac('report-create'), this._addTenantReportResultTemplate.bind(this));
			this.$router.patch('/report-result-templates/:report_result_template_id', this.$parent._rbac('report-update'), this._updateTenantReportResultTemplate.bind(this));

			this.$router.get('/report-watchers/:report_watcher_id', this.$parent._rbac('report-read OR report-watch'), this._getTenantReportWatcher.bind(this));
			this.$router.post('/report-watchers', this.$parent._rbac('report-create'), this._addTenantReportWatcher.bind(this));
			this.$router.patch('/report-watchers/:report_watcher_id', this.$parent._rbac('report-update'), this._updateTenantReportWatcher.bind(this));
			this.$router.delete('/report-watchers/:report_watcher_id', this.$parent._rbac('report-delete'), this._deleteTenantReportWatcher.bind(this));

			this.$router.get('/possibleTenantUsersList', this.$parent._rbac('report-read OR report-watch'), this._getPossibleTenantUsersList.bind(this));

			this.$router.get('/report-aggregates/:report_aggregate_id', this.$parent._rbac('report-read OR report-watch'), this._getTenantReportAggregate.bind(this));
			this.$router.post('/report-aggregates', this.$parent._rbac('report-create'), this._addTenantReportAggregate.bind(this));
			this.$router.patch('/report-aggregates/:report_aggregate_id', this.$parent._rbac('report-update'), this._updateTenantReportAggregate.bind(this));
			this.$router.delete('/report-aggregates/:report_aggregate_id', this.$parent._rbac('report-delete'), this._deleteTenantReportAggregate.bind(this));

			this.$router.get('/report-schedules/:report_schedule_id', this.$parent._rbac('report-read OR report-watch'), this._getTenantReportSchedule.bind(this));
			this.$router.post('/report-schedules', this.$parent._rbac('report-create'), this._addTenantReportSchedule.bind(this));
			this.$router.patch('/report-schedules/:report_schedule_id', this.$parent._rbac('report-update'), this._updateTenantReportSchedule.bind(this));
			this.$router.delete('/report-schedules/:report_schedule_id', this.$parent._rbac('report-delete'), this._deleteTenantReportSchedule.bind(this));

			this.$router.post('/execute', this.$parent._rbac('report-read OR report-watch'), this._executeReport.bind(this));

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
			throw new PlantWorksComponentError(`Error retrieving report development environment tree nodes`, err);
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
			throw new PlantWorksComponentError(`Error retrieving report folder`, err);
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
			throw new PlantWorksComponentError(`Error retrieving report attribute set`, err);
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
			throw new PlantWorksComponentError(`Error adding report attribute set`, err);
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
			throw new PlantWorksComponentError(`Error updating report attribute set`, err);
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
			throw new PlantWorksComponentError(`Error deleting report attribute set`, err);
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
			throw new PlantWorksComponentError(`Error retrieving all report attribute sets`, err);
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
			throw new PlantWorksComponentError(`Error retrieving report attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error adding report attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error updating report attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error deleting report attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error retrieving report attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error adding report attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error updating report attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error deleting report attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error retrieving report attribute set function observed property`, err);
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
			throw new PlantWorksComponentError(`Error adding report attribute set function observed property`, err);
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
			throw new PlantWorksComponentError(`Error deleting report attribute set function observed property`, err);
		}
	}

	async _getTenantReport(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const reportData = await apiSrvc.execute('Main::getTenantReport', ctxt);

			ctxt.status = 200;
			ctxt.body = reportData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving report`, err);
		}
	}

	async _getAllTenantReports(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const reportData = await apiSrvc.execute('Main::getAllTenantReports', ctxt);

			ctxt.status = 200;
			ctxt.body = reportData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving all reports`, err);
		}
	}

	async _addTenantReport(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReport = await apiSrvc.execute('Main::addTenantReport', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReport.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant report`, err);
		}
	}

	async _updateTenantReport(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReport = await apiSrvc.execute('Main::updateTenantReport', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReport.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant report`, err);
		}
	}

	async _deleteTenantReport(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantReport', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant report`, err);
		}
	}

	async _getTenantReportAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const reportAttributeSetData = await apiSrvc.execute('Main::getTenantReportAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = reportAttributeSetData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving report attribute set`, err);
		}
	}

	async _addTenantReportAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportAttributeSet = await apiSrvc.execute('Main::addTenantReportAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportAttributeSet.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant report attribute set`, err);
		}
	}

	async _updateTenantReportAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportAttributeSet = await apiSrvc.execute('Main::updateTenantReportAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportAttributeSet.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant report attribute set`, err);
		}
	}

	async _deleteTenantReportAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantReportAttributeSet', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant report attribute set`, err);
		}
	}

	async _getTenantReportConstituent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const reportConstituentData = await apiSrvc.execute('Main::getTenantReportConstituent', ctxt);

			ctxt.status = 200;
			ctxt.body = reportConstituentData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving report constituent`, err);
		}
	}

	async _addTenantReportConstituent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportConstituent = await apiSrvc.execute('Main::addTenantReportConstituent', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportConstituent.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant report constituent`, err);
		}
	}

	async _deleteTenantReportConstituent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantReportConstituent', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant report constituent`, err);
		}
	}

	async _getTenantReportProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const reportProcessorData = await apiSrvc.execute('Main::getTenantReportProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = reportProcessorData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving report processor`, err);
		}
	}

	async _addTenantReportProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportProcessor = await apiSrvc.execute('Main::addTenantReportProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportProcessor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant report processor`, err);
		}
	}

	async _updateTenantReportProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportProcessor = await apiSrvc.execute('Main::updateTenantReportProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportProcessor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant report processor`, err);
		}
	}

	async _getTenantReportRequestFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const reportRequestFormatterData = await apiSrvc.execute('Main::getTenantReportRequestFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = reportRequestFormatterData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving report request formatter`, err);
		}
	}

	async _addTenantReportRequestFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportRequestFormatter = await apiSrvc.execute('Main::addTenantReportRequestFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportRequestFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant report request formatter`, err);
		}
	}

	async _updateTenantReportRequestFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportRequestFormatter = await apiSrvc.execute('Main::updateTenantReportRequestFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportRequestFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant report request formatter`, err);
		}
	}

	async _getTenantReportExecutor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const reportExecutorData = await apiSrvc.execute('Main::getTenantReportExecutor', ctxt);

			ctxt.status = 200;
			ctxt.body = reportExecutorData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving report executor`, err);
		}
	}

	async _addTenantReportExecutor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportExecutor = await apiSrvc.execute('Main::addTenantReportExecutor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportExecutor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant report executor`, err);
		}
	}

	async _updateTenantReportExecutor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportExecutor = await apiSrvc.execute('Main::updateTenantReportExecutor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportExecutor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant report executor`, err);
		}
	}

	async _getTenantReportResponseFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const reportResponseFormatterData = await apiSrvc.execute('Main::getTenantReportResponseFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = reportResponseFormatterData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving report response formatter`, err);
		}
	}

	async _addTenantReportResponseFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportResponseFormatter = await apiSrvc.execute('Main::addTenantReportResponseFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportResponseFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant report response formatter`, err);
		}
	}

	async _updateTenantReportResponseFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportResponseFormatter = await apiSrvc.execute('Main::updateTenantReportResponseFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportResponseFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant report response formatter`, err);
		}
	}

	async _getTenantReportInputTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const reportInputTemplateData = await apiSrvc.execute('Main::getTenantReportInputTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = reportInputTemplateData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving report input template`, err);
		}
	}

	async _addTenantReportInputTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportInputTemplate = await apiSrvc.execute('Main::addTenantReportInputTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportInputTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant report input template`, err);
		}
	}

	async _updateTenantReportInputTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportInputTemplate = await apiSrvc.execute('Main::updateTenantReportInputTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportInputTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant report input template`, err);
		}
	}

	async _getTenantReportResultTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const reportResultTemplateData = await apiSrvc.execute('Main::getTenantReportResultTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = reportResultTemplateData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving report result template`, err);
		}
	}

	async _addTenantReportResultTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportResultTemplate = await apiSrvc.execute('Main::addTenantReportResultTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportResultTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant report input template`, err);
		}
	}

	async _updateTenantReportResultTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportResultTemplate = await apiSrvc.execute('Main::updateTenantReportResultTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportResultTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant report input template`, err);
		}
	}

	async _getTenantReportWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const reportWatcherData = await apiSrvc.execute('Main::getTenantReportWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = reportWatcherData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving report watcher`, err);
		}
	}

	async _addTenantReportWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportWatcher = await apiSrvc.execute('Main::addTenantReportWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportWatcher.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant report watcher`, err);
		}
	}

	async _updateTenantReportWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportWatcher = await apiSrvc.execute('Main::updateTenantReportWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportWatcher.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant tenant report watcher`, err);
		}
	}

	async _deleteTenantReportWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantReportWatcher', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant report watcher`, err);
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
			throw new PlantWorksComponentError(`Error retrieving possible watchers for the report`, err);
		}
	}

	async _getTenantReportAggregate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const reportAggregateData = await apiSrvc.execute('Main::getTenantReportAggregate', ctxt);

			ctxt.status = 200;
			ctxt.body = reportAggregateData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving tenant report aggregate`, err);
		}
	}

	async _addTenantReportAggregate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportAggregate = await apiSrvc.execute('Main::addTenantReportAggregate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportAggregate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant tenant report aggregate`, err);
		}
	}

	async _updateTenantReportAggregate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportAggregate = await apiSrvc.execute('Main::updateTenantReportAggregate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportAggregate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant tenant report aggregate`, err);
		}
	}

	async _deleteTenantReportAggregate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantReportAggregate', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant tenant report aggregate`, err);
		}
	}

	async _getTenantReportSchedule(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const reportScheduleData = await apiSrvc.execute('Main::getTenantReportSchedule', ctxt);

			ctxt.status = 200;
			ctxt.body = reportScheduleData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving tenant report schedule`, err);
		}
	}

	async _addTenantReportSchedule(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportSchedule = await apiSrvc.execute('Main::addTenantReportSchedule', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportSchedule.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant tenant report schedule`, err);
		}
	}

	async _updateTenantReportSchedule(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantReportSchedule = await apiSrvc.execute('Main::updateTenantReportSchedule', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantReportSchedule.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant tenant report Schedule`, err);
		}
	}

	async _deleteTenantReportSchedule(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantReportSchedule', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant tenant report schedule`, err);
		}
	}

	async _executeReport(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const resultData = await apiSrvc.execute('RequestProcessor::execute', ctxt);

			ctxt.status = 200;
			ctxt.body = resultData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error executing report`, err);
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
