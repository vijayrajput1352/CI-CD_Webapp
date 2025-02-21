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
			this.$router.get('/config-tree-nodes', this.$parent._rbac('manufacturing-read'), this._getConfigTreeNodes.bind(this));
			this.$router.get('/devenv-tree-nodes', this.$parent._rbac('manufacturing-read'), this._getDevEnvTreeNodes.bind(this));
			this.$router.get('/schedule-tree-nodes', this.$parent._rbac('manufacturing-read'), this._getScheduleTreeNodes.bind(this));

			this.$router.get('/folders/:folder_id', this.$parent._rbac('manufacturing-read'), this._getTenantFolder.bind(this));
			this.$router.post('/folders', this.$parent._rbac('manufacturing-create'), this._addTenantFolder.bind(this));
			this.$router.patch('/folders/:folder_id', this.$parent._rbac('manufacturing-update'), this._updateTenantFolder.bind(this));
			this.$router.delete('/folders/:folder_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantFolder.bind(this));

			this.$router.get('/attribute-sets/:attribute_set_id', this.$parent._rbac('manufacturing-read'), this._getTenantAttributeSet.bind(this));
			this.$router.post('/attribute-sets', this.$parent._rbac('manufacturing-create'), this._addTenantAttributeSet.bind(this));
			this.$router.patch('/attribute-sets/:attribute_set_id', this.$parent._rbac('manufacturing-update'), this._updateTenantAttributeSet.bind(this));
			this.$router.delete('/attribute-sets/:attribute_set_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantAttributeSet.bind(this));
			this.$router.get('/attribute-sets', this.$parent._rbac('manufacturing-read'), this._getAllTenantAttributeSets.bind(this));

			this.$router.get('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('manufacturing-read'), this._getTenantAttributeSetProperty.bind(this));
			this.$router.post('/attribute-set-properties', this.$parent._rbac('manufacturing-create'), this._addTenantAttributeSetProperty.bind(this));
			this.$router.patch('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('manufacturing-update'), this._updateTenantAttributeSetProperty.bind(this));
			this.$router.delete('/attribute-set-properties/:attribute_set_property_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantAttributeSetProperty.bind(this));

			this.$router.get('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('manufacturing-read'), this._getTenantAttributeSetFunction.bind(this));
			this.$router.post('/attribute-set-functions', this.$parent._rbac('manufacturing-create'), this._addTenantAttributeSetFunction.bind(this));
			this.$router.patch('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('manufacturing-update'), this._updateTenantAttributeSetFunction.bind(this));
			this.$router.delete('/attribute-set-functions/:attribute_set_function_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantAttributeSetFunction.bind(this));

			this.$router.get('/attribute-set-function-observed-properties/:attribute_set_function_observed_property_id', this.$parent._rbac('manufacturing-read'), this._getTenantAttributeSetFunctionObservedProperty.bind(this));
			this.$router.post('/attribute-set-function-observed-properties', this.$parent._rbac('manufacturing-create'), this._addTenantAttributeSetFunctionObservedProperty.bind(this));
			this.$router.delete('/attribute-set-function-observed-properties/:attribute_set_function_observed_property_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantAttributeSetFunctionObservedProperty.bind(this));

			this.$router.get('/plants/:plant_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlant.bind(this));
			this.$router.post('/plants', this.$parent._rbac('manufacturing-create'), this._addTenantPlant.bind(this));
			this.$router.patch('/plants/:plant_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlant.bind(this));
			this.$router.delete('/plants/:plant_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlant.bind(this));
			this.$router.get('/plants', this.$parent._rbac('manufacturing-read'), this._getAllTenantPlants.bind(this));

			this.$router.get('/plant-schedules/:plant_schedule_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantSchedule.bind(this));
			this.$router.post('/plant-schedules', this.$parent._rbac('manufacturing-create'), this._addTenantPlantSchedule.bind(this));
			this.$router.patch('/plant-schedules/:plant_schedule_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantSchedule.bind(this));
			this.$router.delete('/plant-schedules/:plant_schedule_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantSchedule.bind(this));

			this.$router.get('/plant-units/:plant_unit_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnit.bind(this));
			this.$router.post('/plant-units', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnit.bind(this));
			this.$router.patch('/plant-units/:plant_unit_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnit.bind(this));
			this.$router.delete('/plant-units/:plant_unit_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnit.bind(this));

			this.$router.get('/plant-unit-schedules/:plant_unit_schedule_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitSchedule.bind(this));
			this.$router.post('/plant-unit-schedules', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitSchedule.bind(this));
			this.$router.patch('/plant-unit-schedules/:plant_unit_schedule_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitSchedule.bind(this));
			this.$router.delete('/plant-unit-schedules/:plant_unit_schedule_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitSchedule.bind(this));

			this.$router.get('/plant-unit-schedule-extensions/:plant_unit_schedule_extension_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitScheduleExtension.bind(this));
			this.$router.post('/plant-unit-schedule-extensions', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitScheduleExtension.bind(this));
			this.$router.patch('/plant-unit-schedule-extensions/:plant_unit_schedule_extension_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitScheduleExtension.bind(this));
			this.$router.delete('/plant-unit-schedule-extensions/:plant_unit_schedule_extension_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitScheduleExtension.bind(this));

			this.$router.get('/plant-unit-drivers/:plant_unit_driver_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitDriver.bind(this));
			this.$router.post('/plant-unit-drivers', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitDriver.bind(this));
			this.$router.patch('/plant-unit-drivers/:plant_unit_driver_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitDriver.bind(this));
			this.$router.delete('/plant-unit-drivers/:plant_unit_driver_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitDriver.bind(this));

			this.$router.get('/plant-unit-machines/:plant_unit_machine_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitMachine.bind(this));
			this.$router.post('/plant-unit-machines', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitMachine.bind(this));
			this.$router.patch('/plant-unit-machines/:plant_unit_machine_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitMachine.bind(this));
			this.$router.delete('/plant-unit-machines/:plant_unit_machine_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitMachine.bind(this));

			this.$router.get('/plant-unit-machine-attribute-sets/:plant_unit_machine_attribute_set_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitMachineAttributeSet.bind(this));
			this.$router.post('/plant-unit-machine-attribute-sets', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitMachineAttributeSet.bind(this));
			this.$router.patch('/plant-unit-machine-attribute-sets/:plant_unit_machine_attribute_set_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitMachineAttributeSet.bind(this));
			this.$router.delete('/plant-unit-machine-attribute-sets/:plant_unit_machine_attribute_set_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitMachineAttributeSet.bind(this));

			this.$router.get('/plant-unit-machine-templates/:plant_unit_machine_template_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitMachineTemplate.bind(this));
			this.$router.post('/plant-unit-machine-templates', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitMachineTemplate.bind(this));
			this.$router.patch('/plant-unit-machine-templates/:plant_unit_machine_template_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitMachineTemplate.bind(this));

			this.$router.get('/plant-unit-machine-processors/:plant_unit_machine_processor_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitMachineProcessor.bind(this));
			this.$router.post('/plant-unit-machine-processors', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitMachineProcessor.bind(this));
			this.$router.patch('/plant-unit-machine-processors/:plant_unit_machine_processor_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitMachineProcessor.bind(this));

			this.$router.get('/plant-unit-machine-downtimes/:plant_unit_machine_downtime_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitMachineDowntime.bind(this));
			this.$router.get('/plant-unit-machine-connection-details/:plant_unit_machine_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitMachineConnectionDetails.bind(this));

			this.$router.get('/plant-unit-machine-downtime-reasons/:plant_unit_machine_downtime_reason_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitMachineDowntimeReason.bind(this));
			this.$router.post('/plant-unit-machine-downtime-reasons', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitMachineDowntimeReason.bind(this));
			this.$router.patch('/plant-unit-machine-downtime-reasons/:plant_unit_machine_downtime_reason_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitMachineDowntimeReason.bind(this));
			this.$router.delete('/plant-unit-machine-downtime-reasons/:plant_unit_machine_downtime_reason_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitMachineDowntimeReason.bind(this));

			this.$router.get('/plant-unit-machine-approved-downtimes/:plant_unit_machine_downtime_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitMachineApprovedDowntime.bind(this));

			this.$router.get('/plant-unit-machine-approved-downtime-reasons/:plant_unit_machine_downtime_reason_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitMachineApprovedDowntimeReason.bind(this));
			this.$router.post('/plant-unit-machine-approved-downtime-reasons', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitMachineApprovedDowntimeReason.bind(this));
			this.$router.patch('/plant-unit-machine-approved-downtime-reasons/:plant_unit_machine_downtime_reason_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitMachineApprovedDowntimeReason.bind(this));
			this.$router.delete('/plant-unit-machine-approved-downtime-reasons/:plant_unit_machine_downtime_reason_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitMachineApprovedDowntimeReason.bind(this));

			this.$router.get('/plant-unit-machine-setuptimes/:plant_unit_machine_setuptime_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitMachineSetuptime.bind(this));

			this.$router.get('/plant-unit-machine-setuptime-reasons/:plant_unit_machine_setuptime_reason_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitMachineSetuptimeReason.bind(this));
			this.$router.post('/plant-unit-machine-setuptime-reasons', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitMachineSetuptimeReason.bind(this));
			this.$router.patch('/plant-unit-machine-setuptime-reasons/:plant_unit_machine_setuptime_reason_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitMachineSetuptimeReason.bind(this));
			this.$router.delete('/plant-unit-machine-setuptime-reasons/:plant_unit_machine_setuptime_reason_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitMachineSetuptimeReason.bind(this));

			this.$router.get('/plant-unit-machine-idletimes/:plant_unit_machine_idletime_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitMachineIdletime.bind(this));

			this.$router.get('/plant-unit-machine-idletime-reasons/:plant_unit_machine_idletime_reason_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitMachineIdletimeReason.bind(this));
			this.$router.post('/plant-unit-machine-idletime-reasons', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitMachineIdletimeReason.bind(this));
			this.$router.patch('/plant-unit-machine-idletime-reasons/:plant_unit_machine_idletime_reason_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitMachineIdletimeReason.bind(this));
			this.$router.delete('/plant-unit-machine-idletime-reasons/:plant_unit_machine_idletime_reason_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitMachineIdletimeReason.bind(this));

			this.$router.get('/plant-unit-machine-schedules/:plant_unit_machine_schedule_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitMachineSchedule.bind(this));
			this.$router.post('/plant-unit-machine-schedules', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitMachineSchedule.bind(this));
			this.$router.post('/plant-unit-machine-schedules/upload', this.$parent._rbac('manufacturing-create'), this._uploadTenantPlantUnitMachineSchedules.bind(this));
			this.$router.post('/plant-unit-machine-schedules/approve-upload', this.$parent._rbac('manufacturing-create'), this._approveTenantPlantUnitMachineSchedules.bind(this));
			this.$router.patch('/plant-unit-machine-schedules/:plant_unit_machine_schedule_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitMachineSchedule.bind(this));
			this.$router.delete('/plant-unit-machine-schedules/:plant_unit_machine_schedule_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitMachineSchedule.bind(this));

			this.$router.get('/plant-unit-machine-attached-forms/:plant_unit_machine_attached_form_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitMachineAttachedForm.bind(this));
			this.$router.post('/plant-unit-machine-attached-forms', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitMachineAttachedForm.bind(this));
			this.$router.delete('/plant-unit-machine-attached-forms/:plant_unit_machine_attached_form_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitMachineAttachedForm.bind(this));

			this.$router.get('/plant-unit-machine-operators/:plant_unit_machine_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitMachineOperators.bind(this));

			this.$router.get('/plant-unit-machine-aggregates/:plant_unit_machine_aggregate_id', this.$parent._rbac('manufacturing-read OR manufacturing-watch'), this._getTenantPlantUnitMachineAggregate.bind(this));
			this.$router.post('/plant-unit-machine-aggregates', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitMachineAggregate.bind(this));
			this.$router.patch('/plant-unit-machine-aggregates/:plant_unit_machine_aggregate_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitMachineAggregate.bind(this));
			this.$router.delete('/plant-unit-machine-aggregates/:plant_unit_machine_aggregate_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitMachineAggregate.bind(this));

			this.$router.get('/plant-unit-machine-events/:plant_unit_machine_event_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitMachineEvent.bind(this));
			this.$router.post('/plant-unit-machine-events', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitMachineEvent.bind(this));

			this.$router.get('/plant-unit-lines/:plant_unit_line_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitLine.bind(this));
			this.$router.post('/plant-unit-lines', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitLine.bind(this));
			this.$router.patch('/plant-unit-lines/:plant_unit_line_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitLine.bind(this));
			this.$router.delete('/plant-unit-lines/:plant_unit_line_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitLine.bind(this));
			this.$router.get('/plant-unit-lines', this.$parent._rbac('manufacturing-read'), this._getAllTenantPlantUnitLines.bind(this));

			this.$router.get('/plant-unit-line-attribute-sets/:plant_unit_line_attribute_set_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitLineAttributeSet.bind(this));
			this.$router.post('/plant-unit-line-attribute-sets', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitLineAttributeSet.bind(this));
			this.$router.patch('/plant-unit-line-attribute-sets/:plant_unit_line_attribute_set_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitLineAttributeSet.bind(this));
			this.$router.delete('/plant-unit-line-attribute-sets/:plant_unit_line_attribute_set_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitLineAttributeSet.bind(this));

			this.$router.get('/plant-unit-line-constituents/:plant_unit_line_constituent_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitLineConstituent.bind(this));
			this.$router.post('/plant-unit-line-constituents', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitLineConstituent.bind(this));
			this.$router.patch('/plant-unit-line-constituents/:plant_unit_line_constituent_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitLineConstituent.bind(this));
			this.$router.delete('/plant-unit-line-constituents/:plant_unit_line_constituent_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitLineConstituent.bind(this));

			this.$router.get('/plant-unit-line-block-entities', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitLineBlockEntities.bind(this));
			this.$router.post('/plant-unit-line-block-entities', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitLineBlockEntities.bind(this));
			this.$router.delete('/plant-unit-line-block-entities/:block_entity_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitLineBlockEntities.bind(this));

			this.$router.get('/plant-unit-line-templates/:plant_unit_line_template_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitLineTemplate.bind(this));
			this.$router.post('/plant-unit-line-templates', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitLineTemplate.bind(this));
			this.$router.patch('/plant-unit-line-templates/:plant_unit_line_template_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitLineTemplate.bind(this));

			this.$router.get('/plant-unit-line-processors/:plant_unit_line_processor_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitLineProcessor.bind(this));
			this.$router.post('/plant-unit-line-processors', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitLineProcessor.bind(this));
			this.$router.patch('/plant-unit-line-processors/:plant_unit_line_processor_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitLineProcessor.bind(this));

			this.$router.get('/plant-unit-line-attached-forms/:plant_unit_line_attached_form_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitLineAttachedForm.bind(this));
			this.$router.post('/plant-unit-line-attached-forms', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitLineAttachedForm.bind(this));
			this.$router.delete('/plant-unit-line-attached-forms/:plant_unit_line_attached_form_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitLineAttachedForm.bind(this));

			this.$router.get('/plant-unit-line-events/:plant_unit_line_event_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitLineEvent.bind(this));
			this.$router.post('/plant-unit-line-events', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitLineEvent.bind(this));

			this.$router.get('/plant-unit-line-work-order-formats/:plant_unit_line_work_order_format_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitLineWorkOrderFormat.bind(this));
			this.$router.post('/plant-unit-line-work-order-formats', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitLineWorkOrderFormat.bind(this));
			this.$router.patch('/plant-unit-line-work-order-formats/:plant_unit_line_work_order_format_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitLineWorkOrderFormat.bind(this));
			this.$router.delete('/plant-unit-line-work-order-formats/:plant_unit_line_work_order_format_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitLineWorkOrderFormat.bind(this));

			this.$router.get('/plant-unit-line-work-orders/:plant_unit_line_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitLineWorkOrders.bind(this));
			this.$router.get('/plant-unit-line-work-orders-production', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitLineWorkOrdersProduction.bind(this));

			this.$router.get('/plant-unit-line-supervisors/:plant_unit_line_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitLineSupervisors.bind(this));

			this.$router.get('/plant-unit-line-watchers/:plant_unit_line_watcher_id', this.$parent._rbac('manufacturing-read OR manufacturing-watch'), this._getTenantPlantUnitLineWatcher.bind(this));
			this.$router.post('/plant-unit-line-watchers', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitLineWatcher.bind(this));
			this.$router.delete('/plant-unit-line-watchers/:plant_unit_line_watcher_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitLineWatcher.bind(this));

			this.$router.get('/possibleLineTenantUsersList', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitLinePossibleWatchers.bind(this));

			this.$router.get('/plant-unit-stations/:plant_unit_station_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitStation.bind(this));
			this.$router.post('/plant-unit-stations', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitStation.bind(this));
			this.$router.patch('/plant-unit-stations/:plant_unit_station_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitStation.bind(this));
			this.$router.delete('/plant-unit-stations/:plant_unit_station_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitStation.bind(this));

			this.$router.get('/plant-unit-station-observed-machines/:plant_unit_station_observed_machine_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitStationObservedMachine.bind(this));
			this.$router.post('/plant-unit-station-observed-machines', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitStationObservedMachine.bind(this));
			this.$router.delete('/plant-unit-station-observed-machines/:plant_unit_station_observed_machine_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitStationObservedMachine.bind(this));

			this.$router.get('/plant-unit-station-observed-machine-templates/:plant_unit_station_observed_machine_template_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitStationObservedMachineTemplate.bind(this));
			this.$router.post('/plant-unit-station-observed-machine-templates', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitStationObservedMachineTemplate.bind(this));
			this.$router.patch('/plant-unit-station-observed-machine-templates/:plant_unit_station_observed_machine_template_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitStationObservedMachineTemplate.bind(this));

			this.$router.get('/plant-unit-station-observed-lines/:plant_unit_station_observed_line_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitStationObservedLine.bind(this));
			this.$router.post('/plant-unit-station-observed-lines', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitStationObservedLine.bind(this));
			this.$router.patch('/plant-unit-station-observed-lines/:plant_unit_station_observed_line_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitStationObservedLine.bind(this));
			this.$router.delete('/plant-unit-station-observed-lines/:plant_unit_station_observed_line_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitStationObservedLine.bind(this));

			this.$router.get('/plant-unit-station-observed-line-templates/:plant_unit_station_observed_line_template_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitStationObservedLineTemplate.bind(this));
			this.$router.post('/plant-unit-station-observed-line-templates', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitStationObservedLineTemplate.bind(this));
			this.$router.patch('/plant-unit-station-observed-line-templates/:plant_unit_station_observed_line_template_id', this.$parent._rbac('manufacturing-update'), this._updateTenantPlantUnitStationObservedLineTemplate.bind(this));

			this.$router.get('/plant-unit-station-attached-forms/:plant_unit_station_attached_form_id', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitStationAttachedForm.bind(this));
			this.$router.post('/plant-unit-station-attached-forms', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitStationAttachedForm.bind(this));
			this.$router.delete('/plant-unit-station-attached-forms/:plant_unit_station_attached_form_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitStationAttachedForm.bind(this));

			this.$router.get('/plant-unit-station-watchers/:plant_unit_station_watcher_id', this.$parent._rbac('manufacturing-read OR manufacturing-watch'), this._getTenantPlantUnitStationWatcher.bind(this));
			this.$router.post('/plant-unit-station-watchers', this.$parent._rbac('manufacturing-create'), this._addTenantPlantUnitStationWatcher.bind(this));
			this.$router.delete('/plant-unit-station-watchers/:plant_unit_station_watcher_id', this.$parent._rbac('manufacturing-delete'), this._deleteTenantPlantUnitStationWatcher.bind(this));

			this.$router.get('/possibleStationTenantUsersList', this.$parent._rbac('manufacturing-read'), this._getTenantPlantUnitStationPossibleWatchers.bind(this));

			this.$router.get('/getFirstNonMetaDowntime/:plant_unit_machine_id', this.$parent._rbac('manufacturing-read'), this._getFirstNonMetaDowntime.bind(this));
			this.$router.post('/submitShiftData', this.$parent._rbac('manufacturing-create'), this._submitShiftData.bind(this));

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
			throw new PlantWorksComponentError(`Error retrieving manufacturing development environment tree nodes`, err);
		}
	}

	async _getScheduleTreeNodes(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const treeNodeData = await apiSrvc.execute('Main::getScheduleTreeNodes', ctxt);

			ctxt.status = 200;
			ctxt.body = treeNodeData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing schedule tree nodes`, err);
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
			throw new PlantWorksComponentError(`Error retrieving manufacturing folder`, err);
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
			throw new PlantWorksComponentError(`Error retrieving manufacturing attribute set`, err);
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
			throw new PlantWorksComponentError(`Error adding manufacturing attribute set`, err);
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
			throw new PlantWorksComponentError(`Error updating manufacturing attribute set`, err);
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
			throw new PlantWorksComponentError(`Error deleting manufacturing attribute set`, err);
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
			throw new PlantWorksComponentError(`Error retrieving all manufacturing attribute sets`, err);
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
			throw new PlantWorksComponentError(`Error retrieving manufacturing attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error adding manufacturing attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error updating manufacturing attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error deleting manufacturing attribute set property`, err);
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
			throw new PlantWorksComponentError(`Error retrieving manufacturing attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error adding manufacturing attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error updating manufacturing attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error deleting manufacturing attribute set function`, err);
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
			throw new PlantWorksComponentError(`Error retrieving manufacturing attribute set function observed property`, err);
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
			throw new PlantWorksComponentError(`Error adding manufacturing attribute set function observed property`, err);
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
			throw new PlantWorksComponentError(`Error deleting manufacturing attribute set function observed property`, err);
		}
	}

	async _getTenantPlant(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantData = await apiSrvc.execute('Main::getTenantPlant', ctxt);

			ctxt.status = 200;
			ctxt.body = plantData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant`, err);
		}
	}

	async _addTenantPlant(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlant = await apiSrvc.execute('Main::addTenantPlant', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlant.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant`, err);
		}
	}

	async _updateTenantPlant(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlant = await apiSrvc.execute('Main::updateTenantPlant', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlant.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant`, err);
		}
	}

	async _deleteTenantPlant(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlant', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant`, err);
		}
	}

	async _getAllTenantPlants(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantData = await apiSrvc.execute('Main::getAllTenantPlants', ctxt);

			ctxt.status = 200;
			ctxt.body = plantData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving all manufacturing plants`, err);
		}
	}

	async _getTenantPlantUnit(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitData = await apiSrvc.execute('Main::getTenantPlantUnit', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit`, err);
		}
	}

	async _addTenantPlantUnit(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnit = await apiSrvc.execute('Main::addTenantPlantUnit', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnit.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit`, err);
		}
	}

	async _updateTenantPlantUnit(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnit = await apiSrvc.execute('Main::updateTenantPlantUnit', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnit.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit`, err);
		}
	}

	async _deleteTenantPlantUnit(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnit', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit`, err);
		}
	}

	async _getTenantPlantSchedule(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitData = await apiSrvc.execute('Main::getTenantPlantSchedule', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant schedule`, err);
		}
	}

	async _addTenantPlantSchedule(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnit = await apiSrvc.execute('Main::addTenantPlantSchedule', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnit.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant schedule`, err);
		}
	}


	async _updateTenantPlantSchedule(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantSchedule = await apiSrvc.execute('Main::updateTenantPlantSchedule', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantSchedule.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant schedule`, err);
		}
	}

	async _deleteTenantPlantSchedule(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantSchedule', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant schedule`, err);
		}
	}

	async _getTenantPlantUnitSchedule(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitSchedule = await apiSrvc.execute('Main::getTenantPlantUnitSchedule', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitSchedule.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving tenant plant unit schedule`, err);
		}
	}

	async _addTenantPlantUnitSchedule(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitSchedule = await apiSrvc.execute('Main::addTenantPlantUnitSchedule', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitSchedule.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit schedule`, err);
		}
	}

	async _updateTenantPlantUnitSchedule(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitSchedule = await apiSrvc.execute('Main::updateTenantPlantUnitSchedule', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitSchedule.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit schedule`, err);
		}
	}

	async _deleteTenantPlantUnitSchedule(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitSchedule', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit schedule`, err);
		}
	}

	async _getTenantPlantUnitScheduleExtension(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitScheduleExtension = await apiSrvc.execute('Main::getTenantPlantUnitScheduleExtension', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitScheduleExtension.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving tenant plant unit schedule extension`, err);
		}
	}

	async _addTenantPlantUnitScheduleExtension(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitScheduleExtension = await apiSrvc.execute('Main::addTenantPlantUnitScheduleExtension', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitScheduleExtension.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit schedule extension`, err);
		}
	}

	async _updateTenantPlantUnitScheduleExtension(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitScheduleExtension = await apiSrvc.execute('Main::updateTenantPlantUnitScheduleExtension', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitScheduleExtension.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit schedule extension`, err);
		}
	}

	async _deleteTenantPlantUnitScheduleExtension(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitScheduleExtension', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit schedule extension`, err);
		}
	}

	async _getTenantPlantUnitDriver(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitDriverData = await apiSrvc.execute('Main::getTenantPlantUnitDriver', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitDriverData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit driver`, err);
		}
	}

	async _addTenantPlantUnitDriver(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitDriver = await apiSrvc.execute('Main::addTenantPlantUnitDriver', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitDriver.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit driver`, err);
		}
	}

	async _updateTenantPlantUnitDriver(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitDriver = await apiSrvc.execute('Main::updateTenantPlantUnitDriver', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitDriver.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit driver`, err);
		}
	}

	async _deleteTenantPlantUnitDriver(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitDriver', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit driver`, err);
		}
	}

	async _getTenantPlantUnitMachine(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitMachineData = await apiSrvc.execute('Main::getTenantPlantUnitMachine', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitMachineData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit machine`, err);
		}
	}

	async _addTenantPlantUnitMachine(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachine = await apiSrvc.execute('Main::addTenantPlantUnitMachine', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachine.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit machine`, err);
		}
	}

	async _updateTenantPlantUnitMachine(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachine = await apiSrvc.execute('Main::updateTenantPlantUnitMachine', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachine.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit machine`, err);
		}
	}

	async _deleteTenantPlantUnitMachine(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitMachine', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit machine`, err);
		}
	}

	async _getTenantPlantUnitMachineAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitMachineAttributeSetData = await apiSrvc.execute('Main::getTenantPlantUnitMachineAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitMachineAttributeSetData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit machine attribute set`, err);
		}
	}

	async _addTenantPlantUnitMachineAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachineAttributeSet = await apiSrvc.execute('Main::addTenantPlantUnitMachineAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachineAttributeSet.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit machine attribute set`, err);
		}
	}

	async _updateTenantPlantUnitMachineAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachineAttributeSet = await apiSrvc.execute('Main::updateTenantPlantUnitMachineAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachineAttributeSet.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit machine attribute set`, err);
		}
	}

	async _deleteTenantPlantUnitMachineAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitMachineAttributeSet', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit machine attribute set`, err);
		}
	}

	async _getTenantPlantUnitMachineProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitMachineProcessorData = await apiSrvc.execute('Main::getTenantPlantUnitMachineProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitMachineProcessorData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit machine processor`, err);
		}
	}

	async _addTenantPlantUnitMachineProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachineProcessor = await apiSrvc.execute('Main::addTenantPlantUnitMachineProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachineProcessor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit machine processor`, err);
		}
	}

	async _updateTenantPlantUnitMachineProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachineProcessor = await apiSrvc.execute('Main::updateTenantPlantUnitMachineProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachineProcessor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit machine processor`, err);
		}
	}

	async _getTenantPlantUnitMachineDowntime(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitMachineDowntimeData = await apiSrvc.execute('Main::getTenantPlantUnitMachineDowntime', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitMachineDowntimeData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit machine downtime`, err);
		}
	}

	async _getTenantPlantUnitMachineApprovedDowntime(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitMachineApprovedDowntimeData = await apiSrvc.execute('Main::getTenantPlantUnitMachineApprovedDowntime', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitMachineApprovedDowntimeData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit machine approved downtime`, err);
		}
	}

	async _getTenantPlantUnitMachineSetuptime(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitMachineSetuptimeData = await apiSrvc.execute('Main::getTenantPlantUnitMachineSetuptime', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitMachineSetuptimeData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit machine setup time`, err);
		}
	}

	async _getTenantPlantUnitMachineIdletime(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitMachineIdletimeData = await apiSrvc.execute('Main::getTenantPlantUnitMachineIdletime', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitMachineIdletimeData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit machine idle time`, err);
		}
	}

	async _getTenantPlantUnitMachineConnectionDetails(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitMachineConnectionData = await apiSrvc.execute('Main::getTenantPlantUnitMachineConnectionDetails', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitMachineConnectionData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit machine connection detais`, err);
		}
	}

	async _getTenantPlantUnitMachineDowntimeReason(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const machineDowntimeReasonData = await apiSrvc.execute('Main::getTenantPlantUnitMachineDowntimeReason', ctxt);

			ctxt.status = 200;
			ctxt.body = machineDowntimeReasonData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit machine downtime reason`, err);
		}
	}

	async _addTenantPlantUnitMachineDowntimeReason(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachineDowntimeReason = await apiSrvc.execute('Main::addTenantPlantUnitMachineDowntimeReason', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachineDowntimeReason.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit machine downtime reason`, err);
		}
	}

	async _updateTenantPlantUnitMachineDowntimeReason(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachineDowntimeReason = await apiSrvc.execute('Main::updateTenantPlantUnitMachineDowntimeReason', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachineDowntimeReason.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit machine downtime reason`, err);
		}
	}

	async _deleteTenantPlantUnitMachineDowntimeReason(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitMachineDowntimeReason', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit machine downtime reason`, err);
		}
	}

	async _getTenantPlantUnitMachineApprovedDowntimeReason(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const machineApprovedDowntimeReasonData = await apiSrvc.execute('Main::getTenantPlantUnitMachineApprovedDowntimeReason', ctxt);

			ctxt.status = 200;
			ctxt.body = machineApprovedDowntimeReasonData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit machine approved downtime reason`, err);
		}
	}

	async _addTenantPlantUnitMachineApprovedDowntimeReason(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachineApprovedDowntimeReason = await apiSrvc.execute('Main::addTenantPlantUnitMachineApprovedDowntimeReason', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachineApprovedDowntimeReason.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit machine approved downtime reason`, err);
		}
	}

	async _updateTenantPlantUnitMachineApprovedDowntimeReason(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachineApprovedDowntimeReason = await apiSrvc.execute('Main::updateTenantPlantUnitMachineApprovedDowntimeReason', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachineApprovedDowntimeReason.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit machine approved downtime reason`, err);
		}
	}

	async _deleteTenantPlantUnitMachineApprovedDowntimeReason(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitMachineApprovedDowntimeReason', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit machine approved downtime reason`, err);
		}
	}

	async _getTenantPlantUnitMachineSetuptimeReason(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const machineSetuptimeReasonData = await apiSrvc.execute('Main::getTenantPlantUnitMachineSetuptimeReason', ctxt);

			ctxt.status = 200;
			ctxt.body = machineSetuptimeReasonData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit machine setup time reason`, err);
		}
	}

	async _addTenantPlantUnitMachineSetuptimeReason(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachineSetuptimeReason = await apiSrvc.execute('Main::addTenantPlantUnitMachineSetuptimeReason', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachineSetuptimeReason.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit machine setuptime reason`, err);
		}
	}

	async _updateTenantPlantUnitMachineSetuptimeReason(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachineSetuptimeReason = await apiSrvc.execute('Main::updateTenantPlantUnitMachineSetuptimeReason', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachineSetuptimeReason.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit machine setuptime reason`, err);
		}
	}

	async _deleteTenantPlantUnitMachineSetuptimeReason(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitMachineSetuptimeReason', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit machine setuptime reason`, err);
		}
	}

	async _getTenantPlantUnitMachineIdletimeReason(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const machineIdletimeReasonData = await apiSrvc.execute('Main::getTenantPlantUnitMachineIdletimeReason', ctxt);

			ctxt.status = 200;
			ctxt.body = machineIdletimeReasonData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit machine idle time reason`, err);
		}
	}

	async _addTenantPlantUnitMachineIdletimeReason(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachineIdletimeReason = await apiSrvc.execute('Main::addTenantPlantUnitMachineIdletimeReason', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachineIdletimeReason.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit machine idletime reason`, err);
		}
	}

	async _updateTenantPlantUnitMachineIdletimeReason(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachineIdletimeReason = await apiSrvc.execute('Main::updateTenantPlantUnitMachineIdletimeReason', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachineIdletimeReason.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit machine idletime reason`, err);
		}
	}

	async _deleteTenantPlantUnitMachineIdletimeReason(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitMachineIdletimeReason', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit machine idletime reason`, err);
		}
	}

	async _getTenantPlantUnitMachineTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitMachineTemplateData = await apiSrvc.execute('Main::getTenantPlantUnitMachineTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitMachineTemplateData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit machine template`, err);
		}
	}

	async _addTenantPlantUnitMachineTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachineTemplate = await apiSrvc.execute('Main::addTenantPlantUnitMachineTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachineTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit machine template`, err);
		}
	}

	async _updateTenantPlantUnitMachineTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachineTemplate = await apiSrvc.execute('Main::updateTenantPlantUnitMachineTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachineTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit machine template`, err);
		}
	}

	async _getTenantPlantUnitMachineSchedule(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitMachineSchedule = await apiSrvc.execute('Main::getTenantPlantUnitMachineSchedule', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitMachineSchedule.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving tenant plant unit machine schedule`, err);
		}
	}

	async _addTenantPlantUnitMachineSchedule(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitMachineSchedule = await apiSrvc.execute('Main::addTenantPlantUnitMachineSchedule', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitMachineSchedule.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit machine schedule`, err);
		}
	}

	async _uploadTenantPlantUnitMachineSchedules(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const finalResult = await apiSrvc.execute('Main::uploadTenantPlantUnitMachineSchedules', ctxt);

			ctxt.status = 200;
			ctxt.body = finalResult.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error uploading tenant plant unit schedules`, err);
		}
	}

	async _approveTenantPlantUnitMachineSchedules(ctxt) {

		try {
			const apiSrvc = this.$dependencies.ApiService;
			const uploadResult = await apiSrvc.execute('Main::approveTenantPlantUnitMachineSchedules', ctxt);

			ctxt.status = 200;
			ctxt.body = uploadResult.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error approving plant unit machine schedules`, err);
		}

	}

	async _updateTenantPlantUnitMachineSchedule(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitMachineSchedule = await apiSrvc.execute('Main::updateTenantPlantUnitMachineSchedule', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitMachineSchedule.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit machine schedule`, err);
		}
	}

	async _deleteTenantPlantUnitMachineSchedule(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitMachineSchedule', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit machine schedule`, err);
		}
	}

	async _getTenantPlantUnitMachineAttachedForm(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitMachineAttachedFormData = await apiSrvc.execute('Main::getTenantPlantUnitMachineAttachedForm', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitMachineAttachedFormData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit machine attached form`, err);
		}
	}

	async _addTenantPlantUnitMachineAttachedForm(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachineAttachedForm = await apiSrvc.execute('Main::addTenantPlantUnitMachineAttachedForm', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachineAttachedForm.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit machine attached form`, err);
		}
	}

	async _deleteTenantPlantUnitMachineAttachedForm(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitMachineAttachedForm', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit machine attached form`, err);
		}
	}

	async _getTenantPlantUnitMachineOperators(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachineOperators = await apiSrvc.execute('Main::getTenantPlantUnitMachineOperators', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachineOperators.shift();
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error getting tenant plant unit machine operators`, err);
		}
	}

	async _getTenantPlantUnitMachineAggregate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitMachineAggregateData = await apiSrvc.execute('Main::getTenantPlantUnitMachineAggregate', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitMachineAggregateData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving tenant plant unit machine aggregate`, err);
		}
	}

	async _addTenantPlantUnitMachineAggregate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachineAggregate = await apiSrvc.execute('Main::addTenantPlantUnitMachineAggregate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachineAggregate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant tenant plant unit machine aggregate`, err);
		}
	}

	async _updateTenantPlantUnitMachineAggregate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachineAggregate = await apiSrvc.execute('Main::updateTenantPlantUnitMachineAggregate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachineAggregate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant tenant plant unit machine aggregate`, err);
		}
	}

	async _deleteTenantPlantUnitMachineAggregate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitMachineAggregate', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant tenant plant unit machine aggregate`, err);
		}
	}

	async _getTenantPlantUnitLine(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitLineData = await apiSrvc.execute('Main::getTenantPlantUnitLine', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitLineData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit line`, err);
		}
	}

	async _getAllTenantPlantUnitLines(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitLineData = await apiSrvc.execute('Main::getAllTenantPlantUnitLines', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitLineData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit line`, err);
		}
	}

	async _addTenantPlantUnitLine(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitLine = await apiSrvc.execute('Main::addTenantPlantUnitLine', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitLine.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit line`, err);
		}
	}

	async _updateTenantPlantUnitLine(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitLine = await apiSrvc.execute('Main::updateTenantPlantUnitLine', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitLine.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit line`, err);
		}
	}

	async _deleteTenantPlantUnitLine(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitLine', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit line`, err);
		}
	}

	async _getTenantPlantUnitLineAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitLineAttributeSetData = await apiSrvc.execute('Main::getTenantPlantUnitLineAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitLineAttributeSetData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit Line attribute set`, err);
		}
	}

	async _addTenantPlantUnitLineAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitLineAttributeSet = await apiSrvc.execute('Main::addTenantPlantUnitLineAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitLineAttributeSet.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit Line attribute set`, err);
		}
	}

	async _updateTenantPlantUnitLineAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitLineAttributeSet = await apiSrvc.execute('Main::updateTenantPlantUnitLineAttributeSet', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitLineAttributeSet.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit Line attribute set`, err);
		}
	}

	async _deleteTenantPlantUnitLineAttributeSet(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitLineAttributeSet', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit Line attribute set`, err);
		}
	}

	async _getTenantPlantUnitLineConstituent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitLineConstituentData = await apiSrvc.execute('Main::getTenantPlantUnitLineConstituent', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitLineConstituentData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit line constituent`, err);
		}
	}

	async _addTenantPlantUnitLineConstituent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitLineConstituent = await apiSrvc.execute('Main::addTenantPlantUnitLineConstituent', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitLineConstituent.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit line constituent`, err);
		}
	}

	async _updateTenantPlantUnitLineConstituent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::updateTenantPlantUnitLineConstituent', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit line constituent`, err);
		}
	}

	async _deleteTenantPlantUnitLineConstituent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitLineConstituent', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit line constituent`, err);
		}
	}

	async _getTenantPlantUnitLineBlockEntities(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const blockEntitiesData = await apiSrvc.execute('Main::getTenantPlantUnitLineBlockEntities', ctxt);

			ctxt.status = 200;
			ctxt.body = blockEntitiesData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit line block entities`, err);
		}
	}

	async _addTenantPlantUnitLineBlockEntities(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const blockEntitiesData = await apiSrvc.execute('Main::addTenantPlantUnitLineBlockEntities', ctxt);

			ctxt.status = 200;
			ctxt.body = blockEntitiesData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error saving manufacturing plant unit line block entities`, err);
		}
	}

	async _deleteTenantPlantUnitLineBlockEntities(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitLineBlockEntities', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit line block entities`, err);
		}
	}

	async _getTenantPlantUnitLineProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitLineProcessorData = await apiSrvc.execute('Main::getTenantPlantUnitLineProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitLineProcessorData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit line processor`, err);
		}
	}

	async _addTenantPlantUnitLineProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitLineProcessor = await apiSrvc.execute('Main::addTenantPlantUnitLineProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitLineProcessor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit line processor`, err);
		}
	}

	async _updateTenantPlantUnitLineProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitLineProcessor = await apiSrvc.execute('Main::updateTenantPlantUnitLineProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitLineProcessor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit line processor`, err);
		}
	}

	async _getTenantPlantUnitLineTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitLineTemplateData = await apiSrvc.execute('Main::getTenantPlantUnitLineTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitLineTemplateData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit line template`, err);
		}
	}

	async _addTenantPlantUnitLineTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitLineTemplate = await apiSrvc.execute('Main::addTenantPlantUnitLineTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitLineTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit line template`, err);
		}
	}

	async _updateTenantPlantUnitLineTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitLineTemplate = await apiSrvc.execute('Main::updateTenantPlantUnitLineTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitLineTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit line template`, err);
		}
	}

	async _getTenantPlantUnitLineAttachedForm(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitLineAttachedFormData = await apiSrvc.execute('Main::getTenantPlantUnitLineAttachedForm', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitLineAttachedFormData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit line attached form`, err);
		}
	}

	async _addTenantPlantUnitLineAttachedForm(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitLineAttachedForm = await apiSrvc.execute('Main::addTenantPlantUnitLineAttachedForm', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitLineAttachedForm.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit line attached form`, err);
		}
	}

	async _deleteTenantPlantUnitLineAttachedForm(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitLineAttachedForm', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit line attached form`, err);
		}
	}

	async _getTenantPlantUnitLineEvent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitLineEventData = await apiSrvc.execute('Main::getTenantPlantUnitLineEvent', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitLineEventData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit line event`, err);
		}
	}

	async _addTenantPlantUnitLineEvent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitLineEvent = await apiSrvc.execute('Main::addTenantPlantUnitLineEvent', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitLineEvent.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit line event`, err);
		}
	}

	async _getTenantPlantUnitLineWorkOrderFormat(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitLineWorkOrderFormatData = await apiSrvc.execute('Main::getTenantPlantUnitLineWorkOrderFormat', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitLineWorkOrderFormatData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit line work order format`, err);
		}
	}

	async _addTenantPlantUnitLineWorkOrderFormat(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitLineWorkOrderFormat = await apiSrvc.execute('Main::addTenantPlantUnitLineWorkOrderFormat', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitLineWorkOrderFormat.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit line work order format`, err);
		}
	}

	async _updateTenantPlantUnitLineWorkOrderFormat(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::updateTenantPlantUnitLineWorkOrderFormat', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit line work order format`, err);
		}
	}

	async _deleteTenantPlantUnitLineWorkOrderFormat(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitLineWorkOrderFormat', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit line constituent`, err);
		}
	}

	async _getTenantPlantUnitLineWorkOrders(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitLineWorkOrderData = await apiSrvc.execute('Main::getTenantPlantUnitLineWorkOrders', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitLineWorkOrderData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error gettting tenant plant unit line work orders`, err);
		}
	}

	async _getTenantPlantUnitLineWorkOrdersProduction(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitLineWorkOrderProductionData = await apiSrvc.execute('Main::getTenantPlantUnitLineWorkOrdersProduction', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitLineWorkOrderProductionData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error gettting tenant plant unit line work orders`, err);
		}
	}

	async _getTenantPlantUnitLineSupervisors(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitLineSupervisors = await apiSrvc.execute('Main::getTenantPlantUnitLineSupervisors', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitLineSupervisors.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error geting tenant plant unit line supervisors`, err);
		}
	}

	async _getTenantPlantUnitLineWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const lineWatcherData = await apiSrvc.execute('Main::getTenantPlantUnitLineWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = lineWatcherData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving line watcher`, err);
		}
	}

	async _addTenantPlantUnitLineWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantLineWatcher = await apiSrvc.execute('Main::addTenantPlantUnitLineWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantLineWatcher.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant line watcher`, err);
		}
	}

	async _deleteTenantPlantUnitLineWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitLineWatcher', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant line watcher`, err);
		}
	}

	async _getTenantPlantUnitLinePossibleWatchers(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const possibleTenantUsers = await apiSrvc.execute('Main::possibleLineTenantUsersList', ctxt);

			ctxt.status = 200;
			ctxt.body = possibleTenantUsers.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving possible watchers for the line`, err);
		}
	}

	async _getTenantPlantUnitStation(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitStationData = await apiSrvc.execute('Main::getTenantPlantUnitStation', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitStationData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit station`, err);
		}
	}

	async _addTenantPlantUnitStation(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitStation = await apiSrvc.execute('Main::addTenantPlantUnitStation', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitStation.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit station`, err);
		}
	}

	async _updateTenantPlantUnitStation(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitStation = await apiSrvc.execute('Main::updateTenantPlantUnitStation', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitStation.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit station`, err);
		}
	}

	async _deleteTenantPlantUnitStation(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitStation', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit station`, err);
		}
	}

	async _getTenantPlantUnitStationObservedMachine(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitStationObservedMachineData = await apiSrvc.execute('Main::getTenantPlantUnitStationObservedMachine', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitStationObservedMachineData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit station observed machine`, err);
		}
	}

	async _addTenantPlantUnitStationObservedMachine(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitStationObservedMachine = await apiSrvc.execute('Main::addTenantPlantUnitStationObservedMachine', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitStationObservedMachine.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit station observed machine`, err);
		}
	}

	async _deleteTenantPlantUnitStationObservedMachine(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitStationObservedMachine', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit station observed machine`, err);
		}
	}

	async _getTenantPlantUnitStationObservedMachineTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitMachineStationObservedMachineTemplateData = await apiSrvc.execute('Main::getTenantPlantUnitStationObservedMachineTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitMachineStationObservedMachineTemplateData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit station observed machine template`, err);
		}
	}

	async _addTenantPlantUnitStationObservedMachineTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitStationObservedMachineTemplate = await apiSrvc.execute('Main::addTenantPlantUnitStationObservedMachineTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitStationObservedMachineTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit station observed machine template`, err);
		}
	}

	async _updateTenantPlantUnitStationObservedMachineTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitStationObservedMachineTemplate = await apiSrvc.execute('Main::updateTenantPlantUnitStationObservedMachineTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitStationObservedMachineTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit station observed machine template`, err);
		}
	}

	async _getTenantPlantUnitMachineEvent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitMachineEventData = await apiSrvc.execute('Main::getTenantPlantUnitMachineEvent', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitMachineEventData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit machine event`, err);
		}
	}

	async _addTenantPlantUnitMachineEvent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitMachineEvent = await apiSrvc.execute('Main::addTenantPlantUnitMachineEvent', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitMachineEvent.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit machine event`, err);
		}
	}

	async _getTenantPlantUnitStationObservedLine(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitStationObservedLineData = await apiSrvc.execute('Main::getTenantPlantUnitStationObservedLine', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitStationObservedLineData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit station observed Line`, err);
		}
	}

	async _addTenantPlantUnitStationObservedLine(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitStationObservedLine = await apiSrvc.execute('Main::addTenantPlantUnitStationObservedLine', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitStationObservedLine.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit station observed line`, err);
		}
	}

	async _updateTenantPlantUnitStationObservedLine(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitStationObservedLine = await apiSrvc.execute('Main::updateTenantPlantUnitStationObservedLine', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitStationObservedLine.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit station observed line`, err);
		}
	}

	async _deleteTenantPlantUnitStationObservedLine(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitStationObservedLine', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit station observed line`, err);
		}
	}

	async _getTenantPlantUnitStationObservedLineTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitMachineStationObservedLineTemplateData = await apiSrvc.execute('Main::getTenantPlantUnitStationObservedLineTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitMachineStationObservedLineTemplateData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit station observed line template`, err);
		}
	}

	async _addTenantPlantUnitStationObservedLineTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitStationObservedLineTemplate = await apiSrvc.execute('Main::addTenantPlantUnitStationObservedLineTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitStationObservedLineTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit station observed line template`, err);
		}
	}

	async _updateTenantPlantUnitStationObservedLineTemplate(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitStationObservedLineTemplate = await apiSrvc.execute('Main::updateTenantPlantUnitStationObservedLineTemplate', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitStationObservedLineTemplate.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit station observed line template`, err);
		}
	}

	async _getTenantPlantUnitStationObservedLineEvent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitStationObservedLineEventData = await apiSrvc.execute('Main::getTenantPlantUnitStationObservedLineEvent', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitStationObservedLineEventData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit station observed line event`, err);
		}
	}

	async _addTenantPlantUnitStationObservedLineEvent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitStationObservedLineEvent = await apiSrvc.execute('Main::addTenantPlantUnitStationObservedLineEvent', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitStationObservedLineEvent.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit station observed line event`, err);
		}
	}

	async _updateTenantPlantUnitStationObservedLineEvent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitStationObservedLineEvent = await apiSrvc.execute('Main::updateTenantPlantUnitStationObservedLineEvent', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitStationObservedLineEvent.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant plant unit station observed line event`, err);
		}
	}

	async _getTenantPlantUnitStationAttachedForm(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plantUnitStationAttachedFormData = await apiSrvc.execute('Main::getTenantPlantUnitStationAttachedForm', ctxt);

			ctxt.status = 200;
			ctxt.body = plantUnitStationAttachedFormData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving manufacturing plant unit station attached form`, err);
		}
	}

	async _addTenantPlantUnitStationAttachedForm(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantPlantUnitStationAttachedForm = await apiSrvc.execute('Main::addTenantPlantUnitStationAttachedForm', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantPlantUnitStationAttachedForm.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant plant unit station attached form`, err);
		}
	}

	async _deleteTenantPlantUnitStationAttachedForm(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitStationAttachedForm', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant plant unit station attached form`, err);
		}
	}

	async _getTenantPlantUnitStationWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const stationWatcherData = await apiSrvc.execute('Main::getTenantPlantUnitStationWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = stationWatcherData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving station watcher`, err);
		}
	}

	async _addTenantPlantUnitStationWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantStationWatcher = await apiSrvc.execute('Main::addTenantPlantUnitStationWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantStationWatcher.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant station watcher`, err);
		}
	}

	async _deleteTenantPlantUnitStationWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantPlantUnitStationWatcher', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant station watcher`, err);
		}
	}

	async _getTenantPlantUnitStationPossibleWatchers(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const possibleTenantUsers = await apiSrvc.execute('Main::possibleStationTenantUsersList', ctxt);

			ctxt.status = 200;
			ctxt.body = possibleTenantUsers.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving possible watchers for the station`, err);
		}
	}

	async _getFirstNonMetaDowntime(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const resultData = await apiSrvc.execute('Main::getFirstNonMetaDowntime', ctxt);

			ctxt.status = 200;
			ctxt.body = resultData.shift();

			return null;

		}
		catch(err) {
			throw new PlantWorksComponentError(`Error geting first non meta downtime`, err);
		}
	}

	async _submitShiftData(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::submitShiftData', ctxt);

			ctxt.status = 204;
			return null;

		}
		catch(err) {
			throw new PlantWorksComponentError(`Error while updating shift data`, err);
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
