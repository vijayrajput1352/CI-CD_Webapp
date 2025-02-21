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
 * @classdesc The Main component of the Operator Form Feature - manages CRUD for the forms.
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
			this.$router.get('/config-tree-nodes', this.$parent._rbac('operator-form-read OR operator-form-watch'), this._getConfigTreeNodes.bind(this));
			this.$router.get('/devenv-tree-nodes', this.$parent._rbac('operator-form-read OR operator-form-watch'), this._getDevEnvTreeNodes.bind(this));

			this.$router.get('/folders/:folder_id', this.$parent._rbac('operator-form-read OR operator-form-watch'), this._getTenantFolder.bind(this));
			this.$router.post('/folders', this.$parent._rbac('operator-form-create'), this._addTenantFolder.bind(this));
			this.$router.patch('/folders/:folder_id', this.$parent._rbac('operator-form-update'), this._updateTenantFolder.bind(this));
			this.$router.delete('/folders/:folder_id', this.$parent._rbac('operator-form-delete'), this._deleteTenantFolder.bind(this));

			this.$router.get('/attribute-sets/:attribute_set_id', this.$parent._rbac('operator-form-read OR operator-form-watch'), this._getTenantAttributeSet.bind(this));
			this.$router.post('/attribute-sets', this.$parent._rbac('operator-form-create'), this._addTenantAttributeSet.bind(this));
			this.$router.patch('/attribute-sets/:attribute_set_id', this.$parent._rbac('operator-form-update'), this._updateTenantAttributeSet.bind(this));
			this.$router.delete('/attribute-sets/:attribute_set_id', this.$parent._rbac('operator-form-delete'), this._deleteTenantAttributeSet.bind(this));
			this.$router.get('/attribute-sets', this.$parent._rbac('operator-form-read OR operator-form-watch'), this._getAllTenantAttributeSets.bind(this));

			this.$router.get('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('operator-form-read OR operator-form-watch'), this._getTenantAttributeSetProperty.bind(this));
			this.$router.post('/attribute-set-properties', this.$parent._rbac('operator-form-create'), this._addTenantAttributeSetProperty.bind(this));
			this.$router.patch('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('operator-form-update'), this._updateTenantAttributeSetProperty.bind(this));
			this.$router.delete('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('operator-form-delete'), this._deleteTenantAttributeSetProperty.bind(this));

			this.$router.get('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('operator-form-read OR operator-form-watch'), this._getTenantAttributeSetFunction.bind(this));
			this.$router.post('/attribute-set-functions', this.$parent._rbac('operator-form-create'), this._addTenantAttributeSetFunction.bind(this));
			this.$router.patch('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('operator-form-update'), this._updateTenantAttributeSetFunction.bind(this));
			this.$router.delete('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('operator-form-delete'), this._deleteTenantAttributeSetFunction.bind(this));

			this.$router.get('/attribute-set-function-observed-properties/:attribute_set_function_observed_property_id', this.$parent._rbac('operator-form-read OR operator-form-watch'), this._getTenantAttributeSetFunctionObservedProperty.bind(this));
			this.$router.post('/attribute-set-function-observed-properties', this.$parent._rbac('operator-form-create'), this._addTenantAttributeSetFunctionObservedProperty.bind(this));
			this.$router.delete('/attribute-set-function-observed-properties/:attribute_set_function_observed_property_id', this.$parent._rbac('operator-form-delete'), this._deleteTenantAttributeSetFunctionObservedProperty.bind(this));

			this.$router.get('/operator-forms/:operator_form_id', this.$parent._rbac('operator-form-read OR operator-form-watch'), this._getTenantOperatorForm.bind(this));
			this.$router.post('/operator-forms', this.$parent._rbac('operator-form-create'), this._addTenantOperatorForm.bind(this));
			this.$router.patch('/operator-forms/:operator_form_id', this.$parent._rbac('operator-form-update'), this._updateTenantOperatorForm.bind(this));
			this.$router.delete('/operator-forms/:operator_form_id', this.$parent._rbac('operator-form-delete'), this._deleteTenantOperatorForm.bind(this));
			this.$router.get('/operator-forms', this.$parent._rbac('operator-form-read OR operator-form-watch'), this._getAllTenantOperatorForms.bind(this));

			this.$router.get('/operator-form-attribute-sets/:operator_form_attribute_set_id', this.$parent._rbac('operator-form-read OR operator-form-watch'), this._getTenantOperatorFormAttributeSet.bind(this));
			this.$router.post('/operator-form-attribute-sets', this.$parent._rbac('operator-form-create'), this._addTenantOperatorFormAttributeSet.bind(this));
			this.$router.patch('/operator-form-attribute-sets/:operator_form_attribute_set_id', this.$parent._rbac('operator-form-update'), this._updateTenantOperatorFormAttributeSet.bind(this));
			this.$router.delete('/operator-form-attribute-sets/:operator_form_attribute_set_id', this.$parent._rbac('operator-form-delete'), this._deleteTenantOperatorFormAttributeSet.bind(this));

			this.$router.get('/operator-form-request-formatters/:operator_form_request_formatter_id', this.$parent._rbac('operator-form-read OR operator-form-watch'), this._getTenantOperatorFormRequestFormatter.bind(this));
			this.$router.post('/operator-form-request-formatters', this.$parent._rbac('operator-form-create'), this._addTenantOperatorFormRequestFormatter.bind(this));
			this.$router.patch('/operator-form-request-formatters/:operator_form_request_formatter_id', this.$parent._rbac('operator-form-update'), this._updateTenantOperatorFormRequestFormatter.bind(this));

			this.$router.get('/operator-form-executors/:operator_form_executor_id', this.$parent._rbac('operator-form-read OR operator-form-watch'), this._getTenantOperatorFormExecutor.bind(this));
			this.$router.post('/operator-form-executors', this.$parent._rbac('operator-form-create'), this._addTenantOperatorFormExecutor.bind(this));
			this.$router.patch('/operator-form-executors/:operator_form_executor_id', this.$parent._rbac('operator-form-update'), this._updateTenantOperatorFormExecutor.bind(this));

			this.$router.get('/operator-form-response-formatters/:operator_form_response_formatter_id', this.$parent._rbac('operator-form-read OR operator-form-watch'), this._getTenantOperatorFormResponseFormatter.bind(this));
			this.$router.post('/operator-form-response-formatters', this.$parent._rbac('operator-form-create'), this._addTenantOperatorFormResponseFormatter.bind(this));
			this.$router.patch('/operator-form-response-formatters/:operator_form_response_formatter_id', this.$parent._rbac('operator-form-update'), this._updateTenantOperatorFormResponseFormatter.bind(this));

			this.$router.get('/operator-form-input-templates/:operator_form_input_template_id', this.$parent._rbac('operator-form-read OR operator-form-watch'), this._getTenantOperatorFormInputTemplate.bind(this));
			this.$router.post('/operator-form-input-templates', this.$parent._rbac('operator-form-create'), this._addTenantOperatorFormInputTemplate.bind(this));
			this.$router.patch('/operator-form-input-templates/:operator_form_input_template_id', this.$parent._rbac('operator-form-update'), this._updateTenantOperatorFormInputTemplate.bind(this));

			this.$router.get('/operator-form-result-templates/:operator_form_result_template_id', this.$parent._rbac('operator-form-read OR operator-form-watch'), this._getTenantOperatorFormResultTemplate.bind(this));
			this.$router.post('/operator-form-result-templates', this.$parent._rbac('operator-form-create'), this._addTenantOperatorFormResultTemplate.bind(this));
			this.$router.patch('/operator-form-result-templates/:operator_form_result_template_id', this.$parent._rbac('operator-form-update'), this._updateTenantOperatorFormResultTemplate.bind(this));

			this.$router.post('/execute', this.$parent._rbac('operator-form-read OR operator-form-watch'), this._executeOperatorForm.bind(this));

			this.$router.get('/operator-form-details', this.$parent._rbac('operator-form-read OR operator-form-watch'), this._getWorkOrderOperatorFormDetails.bind(this));

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
			throw new PlantWorksComponentError(`Error retrieving operator form development environment tree nodes`, err);
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
			throw new PlantWorksComponentError(`Error retrieving operator form folder`, err);
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
			throw new PlantWorksComponentError(`Error retrieving operator form attribute set`, err);
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
			throw new PlantWorksComponentError(`Error adding operator form attribute set`, err);
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
			throw new PlantWorksComponentError(`Error updating operator form attribute set`, err);
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
			throw new PlantWorksComponentError(`Error deleting operator form attribute set`, err);
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
			throw new PlantWorksComponentError(`Error retrieving all operator form attribute sets`, err);
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
			throw new PlantWorksComponentError(`Error retrieving operator form attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error adding operator form attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error updating operator form attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error deleting operator form attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error retrieving operator form attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error adding operator form attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error updating operator form attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error deleting operator form attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error retrieving operator form attribute set function observed property`, err);
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
			throw new PlantWorksComponentError(`Error adding operator form attribute set function observed property`, err);
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
			throw new PlantWorksComponentError(`Error deleting operator form attribute set function observed property`, err);
		}
	}

	async _getTenantOperatorForm(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const operatorFormData = await apiSrvc.execute('Main::getTenantOperatorForm', ctxt);

			ctxt.status = 200;
			ctxt.body = operatorFormData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving operator form`, err);
		}
	}

	async _getAllTenantOperatorForms(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const operatorFormData = await apiSrvc.execute('Main::getAllTenantOperatorForms', ctxt);

			ctxt.status = 200;
			ctxt.body = operatorFormData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving all operator forms`, err);
		}
	}

	async _addTenantOperatorForm(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantOperatorForm = await apiSrvc.execute('Main::addTenantOperatorForm', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantOperatorForm.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant operator form`, err);
		}
	}

	async _updateTenantOperatorForm(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantOperatorForm = await apiSrvc.execute('Main::updateTenantOperatorForm', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantOperatorForm.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant operator form`, err);
		}
	}

	async _deleteTenantOperatorForm(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantOperatorForm', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant operator form`, err);
		}
	}

	async _getTenantOperatorFormAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const operatorFormAttributeSetData = await apiSrvc.execute('Main::getTenantOperatorFormAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = operatorFormAttributeSetData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving operator form attribute set`, err);
		}
	}

	async _addTenantOperatorFormAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantOperatorFormAttributeSet = await apiSrvc.execute('Main::addTenantOperatorFormAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantOperatorFormAttributeSet.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant operator form attribute set`, err);
		}
	}

	async _updateTenantOperatorFormAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantOperatorFormAttributeSet = await apiSrvc.execute('Main::updateTenantOperatorFormAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantOperatorFormAttributeSet.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant operator form attribute set`, err);
		}
	}

	async _deleteTenantOperatorFormAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantOperatorFormAttributeSet', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant operator form attribute set`, err);
		}
	}

	async _getTenantOperatorFormRequestFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const operatorFormRequestFormatterData = await apiSrvc.execute('Main::getTenantOperatorFormRequestFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = operatorFormRequestFormatterData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving operator form request formatter`, err);
		}
	}

	async _addTenantOperatorFormRequestFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantOperatorFormRequestFormatter = await apiSrvc.execute('Main::addTenantOperatorFormRequestFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantOperatorFormRequestFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant operator form request formatter`, err);
		}
	}

	async _updateTenantOperatorFormRequestFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantOperatorFormRequestFormatter = await apiSrvc.execute('Main::updateTenantOperatorFormRequestFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantOperatorFormRequestFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant operator form request formatter`, err);
		}
	}

	async _getTenantOperatorFormExecutor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const operatorFormExecutorData = await apiSrvc.execute('Main::getTenantOperatorFormExecutor', ctxt);

			ctxt.status = 200;
			ctxt.body = operatorFormExecutorData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving operator form executor`, err);
		}
	}

	async _addTenantOperatorFormExecutor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantOperatorFormExecutor = await apiSrvc.execute('Main::addTenantOperatorFormExecutor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantOperatorFormExecutor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant operator form executor`, err);
		}
	}

	async _updateTenantOperatorFormExecutor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantOperatorFormExecutor = await apiSrvc.execute('Main::updateTenantOperatorFormExecutor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantOperatorFormExecutor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant operator form executor`, err);
		}
	}

	async _getTenantOperatorFormResponseFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const operatorFormResponseFormatterData = await apiSrvc.execute('Main::getTenantOperatorFormResponseFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = operatorFormResponseFormatterData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving operator form response formatter`, err);
		}
	}

	async _addTenantOperatorFormResponseFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantOperatorFormResponseFormatter = await apiSrvc.execute('Main::addTenantOperatorFormResponseFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantOperatorFormResponseFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant operator form response formatter`, err);
		}
	}

	async _updateTenantOperatorFormResponseFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantOperatorFormResponseFormatter = await apiSrvc.execute('Main::updateTenantOperatorFormResponseFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantOperatorFormResponseFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant operator form response formatter`, err);
		}
	}

	async _getTenantOperatorFormInputTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const operatorFormInputTemplateData = await apiSrvc.execute('Main::getTenantOperatorFormInputTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = operatorFormInputTemplateData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving operator form input template`, err);
		}
	}

	async _addTenantOperatorFormInputTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantOperatorFormInputTemplate = await apiSrvc.execute('Main::addTenantOperatorFormInputTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantOperatorFormInputTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant operator form input template`, err);
		}
	}

	async _updateTenantOperatorFormInputTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantOperatorFormInputTemplate = await apiSrvc.execute('Main::updateTenantOperatorFormInputTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantOperatorFormInputTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant operator form input template`, err);
		}
	}

	async _getTenantOperatorFormResultTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const operatorFormResultTemplateData = await apiSrvc.execute('Main::getTenantOperatorFormResultTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = operatorFormResultTemplateData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving operator form result template`, err);
		}
	}

	async _addTenantOperatorFormResultTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantOperatorFormResultTemplate = await apiSrvc.execute('Main::addTenantOperatorFormResultTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantOperatorFormResultTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant operator form input template`, err);
		}
	}

	async _updateTenantOperatorFormResultTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantOperatorFormResultTemplate = await apiSrvc.execute('Main::updateTenantOperatorFormResultTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantOperatorFormResultTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant operator form input template`, err);
		}
	}

	async _executeOperatorForm(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const resultData = await apiSrvc.execute('RequestProcessor::execute', ctxt);

			ctxt.status = 200;
			ctxt.body = resultData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error executing operator form`, err);
		}
	}

	async _getWorkOrderOperatorFormDetails(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const resultData = await apiSrvc.execute('Main::getWorkOrderOperatorFormDetails', ctxt);

			ctxt.status = 200;
			ctxt.body = resultData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error getting work order operator form details`, err);
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
