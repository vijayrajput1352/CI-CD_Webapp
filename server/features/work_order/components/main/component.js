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
			this.$router.get('/tree-nodes', this.$parent._rbac('work-order-read'), this._getTreeNodes.bind(this));

			this.$router.get('/folders/:folder_id', this.$parent._rbac('work-order-read'), this._getTenantFolder.bind(this));
			this.$router.post('/folders', this.$parent._rbac('work-order-create'), this._addTenantFolder.bind(this));
			this.$router.patch('/folders/:folder_id', this.$parent._rbac('work-order-update'), this._updateTenantFolder.bind(this));
			this.$router.delete('/folders/:folder_id', this.$parent._rbac('work-order-delete'), this._deleteTenantFolder.bind(this));

			this.$router.get('/attribute-sets', this.$parent._rbac('work-order-read'), this._getTenantAllAttributeSet.bind(this));
			this.$router.get('/attribute-sets/:attribute_set_id', this.$parent._rbac('work-order-read'), this._getTenantAttributeSet.bind(this));
			this.$router.post('/attribute-sets', this.$parent._rbac('work-order-create'), this._addTenantAttributeSet.bind(this));
			this.$router.patch('/attribute-sets/:attribute_set_id', this.$parent._rbac('work-order-update'), this._updateTenantAttributeSet.bind(this));
			this.$router.delete('/attribute-sets/:attribute_set_id', this.$parent._rbac('work-order-delete'), this._deleteTenantAttributeSet.bind(this));

			this.$router.get('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('work-order-read'), this._getTenantAttributeSetProperty.bind(this));
			this.$router.post('/attribute-set-properties', this.$parent._rbac('work-order-create'), this._addTenantAttributeSetProperty.bind(this));
			this.$router.patch('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('work-order-update'), this._updateTenantAttributeSetProperty.bind(this));
			this.$router.delete('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('work-order-delete'), this._deleteTenantAttributeSetProperty.bind(this));

			this.$router.get('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('work-order-read'), this._getTenantAttributeSetFunction.bind(this));
			this.$router.post('/attribute-set-functions', this.$parent._rbac('work-order-create'), this._addTenantAttributeSetFunction.bind(this));
			this.$router.patch('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('work-order-update'), this._updateTenantAttributeSetFunction.bind(this));
			this.$router.delete('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('work-order-delete'), this._deleteTenantAttributeSetFunction.bind(this));

			this.$router.get('/attribute-set-function-observed-properties/:attribute_set_function_observed_property_id', this.$parent._rbac('work-order-read'), this._getTenantAttributeSetFunctionObservedProperty.bind(this));
			this.$router.post('/attribute-set-function-observed-properties', this.$parent._rbac('work-order-create'), this._addTenantAttributeSetFunctionObservedProperty.bind(this));
			this.$router.delete('/attribute-set-function-observed-properties/:attribute_set_function_observed_property_id', this.$parent._rbac('work-order-delete'), this._deleteTenantAttributeSetFunctionObservedProperty.bind(this));

			this.$router.get('/work-order-formats/', this.$parent._rbac('work-order-read'), this._getAllTenantFormats.bind(this));
			this.$router.get('/work-order-formats/:format_id', this.$parent._rbac('work-order-read'), this._getTenantFormat.bind(this));
			this.$router.post('/work-order-formats', this.$parent._rbac('work-order-create'), this._addTenantFormat.bind(this));
			this.$router.patch('/work-order-formats/:format_id', this.$parent._rbac('work-order-update'), this._updateTenantFormat.bind(this));
			this.$router.delete('/work-order-formats/:format_id', this.$parent._rbac('work-order-delete'), this._deleteTenantFormat.bind(this));

			this.$router.get('/format-attribute-sets/:format_attribute_set_id', this.$parent._rbac('work-order-read'), this._getTenantFormatAttributeSet.bind(this));
			this.$router.post('/format-attribute-sets/', this.$parent._rbac('work-order-create'), this._addTenantFormatAttributeSet.bind(this));
			this.$router.patch('/format-attribute-sets/:format_attribute_set_id', this.$parent._rbac('work-order-update'), this._updateTenantFormatAttributeSet.bind(this));
			this.$router.delete('/format-attribute-sets/:format_attribute_set_id', this.$parent._rbac('work-order-delete'), this._deleteTenantFormatAttributeSet.bind(this));

			this.$router.get('/node', this.$parent._rbac('work-order-read'), this._getFormatFeatures.bind(this));
			this.$router.post('/upload-work-order/:id', this.$parent._rbac('work-order-read'), this._uploadWorkOrder.bind(this));
			this.$router.post('/approve-upload/:id', this.$parent._rbac('work-order-update'), this._approveUpload.bind(this));
			this.$router.get('/download-work-order/:id', this.$parent._rbac('work-order-update'), this._downloadWorkOrder.bind(this));
			this.$router.post('/change-work-order-status/:format_id', this.$parent._rbac('work-order-update'), this._changeWorkOrderStatus.bind(this));

			this.$router.get('/wof-watchers/:plant_wof_watcher_id', this.$parent._rbac('work-order-read'), this._getTenantPlantWofWatcher.bind(this));
			this.$router.post('/wof-watchers', this.$parent._rbac('work-order-create'), this._addTenantPlantWofWatcher.bind(this));
			this.$router.delete('/wof-watchers/:plant_wof_watcher_id', this.$parent._rbac('work-order-delete'), this._deleteTenantPlantWofWatcher.bind(this));

			this.$router.get('/possibleTenantUsersList', this.$parent._rbac('work-order-read'), this._getTenantPlantWofPossibleWatchers.bind(this));

			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _getTreeNodes(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const treeNodeData = await apiSrvc.execute('Main::getTreeNodes', ctxt);

			ctxt.status = 200;
			ctxt.body = treeNodeData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving work order tree nodes`, err);
		}
	}

	async _getTenantFolder(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const folderData = await apiSrvc.execute('Main::getTenantFolder', ctxt);

			ctxt.status = 200;
			ctxt.body = folderData.shift();
			// ctxt.body = {};

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving work order folder`, err);
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
			throw new PlantWorksComponentError(`Error retrieving work order attribute set`, err);
		}
	}

	async _getTenantAllAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const attrSetData = await apiSrvc.execute('Main::getTenantAllAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = attrSetData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving all attribute sets`, err);
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
			throw new PlantWorksComponentError(`Error adding work order attribute set`, err);
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
			throw new PlantWorksComponentError(`Error updating work order attribute set`, err);
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
			throw new PlantWorksComponentError(`Error deleting work order attribute set`, err);
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
			throw new PlantWorksComponentError(`Error retrieving work order attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error adding work order attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error updating work order attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error deleting work order attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error retrieving work order attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error adding work order attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error updating work order attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error deleting work order attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error retrieving work order attribute set function observed property`, err);
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
			throw new PlantWorksComponentError(`Error adding work order attribute set function observed property`, err);
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
			throw new PlantWorksComponentError(`Error deleting work order attribute set function observed property`, err);
		}
	}

	async _getAllTenantFormats(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const formatData = await apiSrvc.execute('Main::getAllTenantFormats', ctxt);

			ctxt.status = 200;
			ctxt.body = formatData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving all work order formats`, err);
		}
	}

	async _getTenantFormat(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const formatData = await apiSrvc.execute('Main::getTenantFormat', ctxt);

			ctxt.status = 200;
			ctxt.body = formatData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving work order format`, err);
		}
	}

	async _addTenantFormat(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantFormat = await apiSrvc.execute('Main::addTenantFormat', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantFormat.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant format`, err);
		}
	}

	async _updateTenantFormat(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantFormat = await apiSrvc.execute('Main::updateTenantFormat', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantFormat.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant format`, err);
		}
	}

	async _deleteTenantFormat(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantFormat', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant format`, err);
		}
	}

	async _addTenantFormatAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantFormatAttributeSetData = await apiSrvc.execute('Main::addTenantFormatAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantFormatAttributeSetData.shift();
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error creating work order attribute set`, err);
		}
	}

	async _getTenantFormatAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantFormatAttributeSetData = await apiSrvc.execute('Main::getTenantFormatAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantFormatAttributeSetData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error getting work order format attribute set`, err);
		}
	}

	async _updateTenantFormatAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantFormatAttributeSetData = await apiSrvc.execute('Main::updateTenantFormatAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantFormatAttributeSetData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant work order attribute set`, err);
		}
	}

	async _deleteTenantFormatAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantFormatAttributeSet', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting work order attribute set`, err);
		}
	}

	async _getFormatFeatures(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantFormatFeatureData = await apiSrvc.execute('Main::getFormatFeatures', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantFormatFeatureData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error getting work order format attribute set`, err);
		}
	}

	async _uploadWorkOrder(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			let uploadResult = await apiSrvc.execute('Main::parseWorkOrderUpload', ctxt);
			uploadResult = uploadResult.shift();
			// eslint-disable-next-line no-unused-vars
			let workOrderEvaluator = await apiSrvc.execute('WorkOrderProcessorFactory::evaluator', {
				'id': ctxt.params.id,
				'type': 'work-order'
			});

			// evaluate all excel rows
			workOrderEvaluator = workOrderEvaluator.shift();

			const evaluatedRows = [];

			const woIdMap = {};
			let uniqueAttribute = null;
			for(let i = 0; i < uploadResult.rows.length; i++) {
				// eslint-disable-next-line security/detect-object-injection
				const data = await workOrderEvaluator.evaluate(uploadResult.rows[i]);
				if(!uniqueAttribute) uniqueAttribute = data.uniqueIdParameter;

				evaluatedRows.push({
					'attributes': data.attributes,
					'status': data.status,
					'notes': data.notes,
					'date': data.date,
					'finalColumn': data.finalColumn
				});
			}

			// check repeated work order rows
			evaluatedRows.forEach(data => {
				// eslint-disable-next-line security/detect-object-injection
				const workOrderId = data.attributes[uniqueAttribute];
				// eslint-disable-next-line security/detect-object-injection
				if(!woIdMap[workOrderId]) {
					// eslint-disable-next-line security/detect-object-injection
					woIdMap[workOrderId] = true;
				}
				else {
					data.status = 'REJECTED';
					data.notes = [`${uniqueAttribute} should be unique`];
				}
			});

			const attributes = evaluatedRows[0].finalColumn.concat('status');

			const rows = evaluatedRows.map(data => {
				const obj = data.attributes;
				obj['status'] = data.status;
				obj['notes'] = data.notes;
				obj['date'] = data.date;
				return obj;
			});

			const finalResult = {
				'attributes': attributes,
				'rows': rows
			};

			if(finalResult.attributes.length - 1 !== uploadResult.columnHeaders.length)
				finalResult.rows[0].column = true;

			ctxt.status = 200;
			ctxt.body = finalResult;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error getting work order format attribute set`, err);
		}
	}

	async _approveUpload(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const uploadResult = await apiSrvc.execute('Main::approveUpload', ctxt);

			ctxt.status = 200;
			ctxt.body = uploadResult.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error getting work order format attribute set`, err);
		}
	}

	async _downloadWorkOrder(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::downloadWorkOrder', ctxt);

			const send = require('koa-send');

			await send(ctxt, `work_orders/${ctxt.params.id.replace(/-/g, '_')}.xlsx`);

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error download work order format`, err);
		}
	}

	async _changeWorkOrderStatus(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const changeResult = await apiSrvc.execute('Main::changeWorkOrderStatus', ctxt);

			ctxt.status = 200;
			ctxt.body = changeResult.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error Changing Work Order Status`, err);
		}
	}

	async _getTenantPlantWofWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const lineWatcherData = await apiSrvc.execute('Main::getTenantPlantWofWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = lineWatcherData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving wof watcher`, err);
		}
	}

	async _addTenantPlantWofWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantLineWatcher = await apiSrvc.execute('Main::addTenantPlantWofWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantLineWatcher.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant wof watcher`, err);
		}
	}

	async _deleteTenantPlantWofWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantWofWatcher', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant wof watcher`, err);
		}
	}

	async _getTenantPlantWofPossibleWatchers(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const possibleTenantUsers = await apiSrvc.execute('Main::possibleWofTenantUsersList', ctxt);

			ctxt.status = 200;
			ctxt.body = possibleTenantUsers.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving possible watchers for the wof`, err);
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
