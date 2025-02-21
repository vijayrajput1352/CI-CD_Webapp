/* eslint-disable security/detect-object-injection */

'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules.
 *
 * @ignore
 */
const moment = require('moment');
const safeJsonStringify = require('safe-json-stringify'); // eslint-disable-line no-unused-vars
const XLSX = require('xlsx');

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

			Object.defineProperty(this, '$HardwareProtocolMasterModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'hardware_protocol_master',
					'hasTimestamps': true,

					'machines': function() {
						return this.hasMany(self.$TenantPlantUnitMachineModel, 'hardware_protocol_id');
					}
				}, {
					'jsonColumns': ['configuration_schema', 'metadata']
				})
			});

			Object.defineProperty(this, '$CommunicationProtocolMasterModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'communication_protocol_master',
					'hasTimestamps': true,

					'machines': function() {
						return this.hasMany(self.$TenantPlantUnitMachineModel, 'communication_protocol_id');
					}
				}, {
					'jsonColumns': ['configuration_schema', 'metadata']
				})
			});

			Object.defineProperty(this, '$MachineMasterModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'machine_master',
					'hasTimestamps': true,

					'machines': function() {
						return this.hasMany(self.$TenantPlantUnitMachineModel, 'machine_id');
					}
				}, {
					'jsonColumns': ['metadata']
				})
			});

			Object.defineProperty(this, '$PlcMasterModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'plc_master',
					'hasTimestamps': true,

					'machines': function() {
						return this.hasMany(self.$TenantPlantUnitMachineModel, 'plc_id');
					}
				}, {
					'jsonColumns': ['metadata']
				})
			});

			Object.defineProperty(this, '$GatewayMasterModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'gateway_master',
					'hasTimestamps': true,

					'drivers': function() {
						return this.hasMany(self.$TenantPlantUnitDriverModel, 'gateway_id');
					}
				}, {
					'jsonColumns': ['metadata']
				})
			});

			Object.defineProperty(this, '$TenantModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenants',
					'hasTimestamps': true,

					'manufacturingFolders': function() {
						return this.hasMany(self.$TenantFolderModel, 'tenant_id');
					},

					'tenantPlants': function() {
						return this.hasMany(self.$TenantPlantModel, 'tenant_id');
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

					'plants': function() {
						return this.hasMany(self.$TenantPlantModel, 'tenant_folder_id');
					},

					'attributeSets': function() {
						return this.hasMany(self.$TenantAttributeSetModel, 'tenant_folder_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantLocationModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_locations',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'plants': function() {
						return this.hasMany(self.$TenantPlantModel, 'tenant_location_id');
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
					},

					'dataPointExpression': function() {
						return this.hasMany(self.$TenantPlantUnitMachineAggregateModel, 'attribute_set_property_id');
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

					'tenantPlantUnitOperatorMachines': function() {
						return this.hasMany(self.$TenantPlantUnitMachineModel, 'operator_list_id');
					},

					'tenantPlantUnitOperatorStations': function() {
						return this.hasMany(self.$TenantPlantUnitStationModel, 'operator_list_id');
					},

					'tenantPlantUnitDowntimeMachines': function() {
						return this.hasMany(self.$TenantPlantUnitMachineModel, 'downtime_list_id');
					},

					'tenantPlantUnitSpeedDeviationMachines': function() {
						return this.hasMany(self.$TenantPlantUnitMachineModel, 'speed_deviation_list_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantPlantModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plants',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'folder': function() {
						return this.belongsTo(self.$TenantFolderModel, 'tenant_folder_id');
					},

					'tenantLocation': function() {
						return this.belongsTo(self.$TenantLocationModel, 'tenant_location_id');
					},

					'units': function() {
						return this.hasMany(self.$TenantPlantUnitModel, 'tenant_plant_id');
					},

					'schedules': function() {
						return this.hasMany(self.$TenantPlantScheduleModel, 'tenant_plant_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantPlantUnitModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_units',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'plant': function() {
						return this.belongsTo(self.$TenantPlantModel, 'tenant_plant_id');
					},

					'parent': function() {
						return this.belongsTo(self.$TenantPlantUnitModel, 'parent_id');
					},

					'units': function() {
						return this.hasMany(self.$TenantPlantUnitModel, 'parent_id');
					},

					'drivers': function() {
						return this.hasMany(self.$TenantPlantUnitDriverModel, 'tenant_plant_unit_id');
					},

					'machines': function() {
						return this.hasMany(self.$TenantPlantUnitMachineModel, 'tenant_plant_unit_id');
					},

					'stations': function() {
						return this.hasMany(self.$TenantPlantUnitStationModel, 'tenant_plant_unit_id');
					},

					'lines': function() {
						return this.hasMany(self.$TenantPlantUnitLineModel, 'tenant_plant_unit_id');
					},

					'schedules': function() {
						return this.hasMany(self.$TenantPlantUnitScheduleModel, 'tenant_plant_unit_id');
					},

					'extensions': function() {
						return this.hasMany(self.$TenantPlantUnitScheduleExtensionModel, 'tenant_plant_unit_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantPlantScheduleModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_schedules',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'plant': function() {
						return this.belongsTo(self.$TenantPlantModel, 'tenant_plant_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantPlantUnitScheduleModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_schedules',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnit': function() {
						return this.belongsTo(self.$TenantPlantUnitModel, 'tenant_plant_unit_id');
					},

					'extensions': function() {
						return this.hasMany(self.$TenantPlantUnitScheduleExtensionModel, 'tenant_plant_unit_schedule_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantPlantUnitScheduleExtensionModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_schedule_extensions',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnit': function() {
						return this.belongsTo(self.$TenantPlantUnitModel, 'tenant_plant_unit_id');
					},

					'shift': function() {
						return this.belongsTo(self.$TenantPlantUnitScheduleModel, 'shift_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantPlantUnitDriverModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_drivers',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnit': function() {
						return this.belongsTo(self.$TenantPlantUnitModel, 'tenant_plant_unit_id');
					},

					'gateway': function() {
						return this.belongsTo(self.$GatewayMasterModel, 'gateway_id');
					},

					'machines': function() {
						return this.hasMany(self.$TenantPlantUnitMachineModel, 'tenant_plant_unit_driver_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantPlantUnitMachineModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_machines',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnit': function() {
						return this.belongsTo(self.$TenantPlantUnitModel, 'tenant_plant_unit_id');
					},

					'machine': function() {
						return this.belongsTo(self.$MachineMasterModel, 'machine_id');
					},

					'plc': function() {
						return this.belongsTo(self.$PlcMasterModel, 'plc_id');
					},

					'tenantPlantUnitDriver': function() {
						return this.belongsTo(self.$TenantPlantUnitDriverModel, 'tenant_plant_unit_driver_id');
					},

					'hardwareProtocol': function() {
						return this.belongsTo(self.$HardwareProtocolMasterModel, 'hardware_protocol_id');
					},

					'communicationProtocol': function() {
						return this.belongsTo(self.$CommunicationProtocolMasterModel, 'communication_protocol_id');
					},

					'attributeSets': function() {
						return this.hasMany(self.$MachineAttributeSetModel, 'tenant_plant_unit_machine_id');
					},

					'processors': function() {
						return this.hasMany(self.$MachineProcessorModel, 'tenant_plant_unit_machine_id');
					},

					'downtimes': function() {
						return this.hasMany(self.$MachineDowntimeModel, 'tenant_plant_unit_machine_id');
					},

					'approvedDowntimes': function() {
						return this.hasMany(self.$MachineApprovedDowntimeModel, 'tenant_plant_unit_machine_id');
					},

					'setuptimes': function() {
						return this.hasMany(self.$MachineSetuptimeModel, 'tenant_plant_unit_machine_id');
					},

					'idletimes': function() {
						return this.hasMany(self.$MachineIdletimeModel, 'tenant_plant_unit_machine_id');
					},

					'templates': function() {
						return this.hasMany(self.$MachineTemplateModel, 'tenant_plant_unit_machine_id');
					},

					'linkedStations': function() {
						return this.hasMany(self.$StationObservedMachineModel, 'tenant_plant_unit_machine_id');
					},

					'operatorList': function() {
						return this.belongsTo(self.$TenantEmdConfigurationModel, 'operator_list_id');
					},

					'downtimeList': function() {
						return this.belongsTo(self.$TenantEmdConfigurationModel, 'downtime_list_id');
					},

					'speedDeviationList': function() {
						return this.belongsTo(self.$TenantEmdConfigurationModel, 'speed_deviation_list_id');
					},

					'schedules': function() {
						return this.hasMany(self.$TenantPlantUnitMachineScheduleModel, 'tenant_plant_unit_machine_id');
					},

					'attachedForms': function() {
						return this.hasMany(self.$MachineAttachedFormModel, 'tenant_plant_unit_machine_id');
					},

					'dataPointAggregations': function() {
						return this.hasMany(self.$TenantPlantUnitMachineAggregateModel, 'tenant_plant_unit_machine_id');
					},

					'events': function() {
						return this.hasMany(self.$TenantPlantUnitMachineEventModel, 'tenant_plant_unit_machine_id');
					}
				}, {
					'jsonColumns': ['attribute_set_metadata', 'operator_list_filters', 'downtime_list_filters', 'setuptime_list_filters', 'idletime_list_filters', 'speed_deviations_list_filters']
				})
			});

			Object.defineProperty(this, '$MachineAttributeSetModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_machines_attribute_sets',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantAttributeSet': function() {
						return this.belongsTo(self.$TenantAttributeSetModel, 'tenant_attribute_set_id');
					},

					'tenantPlantUnitMachine': function() {
						return this.belongsTo(self.$TenantPlantUnitMachineModel, 'tenant_plant_unit_machine_id');
					}
				})
			});

			Object.defineProperty(this, '$MachineProcessorModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_machine_processors',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitMachine': function() {
						return this.belongsTo(self.$TenantPlantUnitMachineModel, 'tenant_plant_unit_machine_id');
					}
				})
			});

			Object.defineProperty(this, '$MachineDowntimeModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_machine_downtimes',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitMachine': function() {
						return this.belongsTo(self.$TenantPlantUnitMachineModel, 'tenant_plant_unit_machine_id');
					},

					'reasons': function() {
						return this.hasMany(self.$MachineDowntimeReasonModel, 'tenant_plant_unit_machine_downtime_id');
					}
				})
			});

			Object.defineProperty(this, '$MachineApprovedDowntimeModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_machine_downtimes',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitMachine': function() {
						return this.belongsTo(self.$TenantPlantUnitMachineModel, 'tenant_plant_unit_machine_id');
					},

					'reasons': function() {
						return this.hasMany(self.$MachineApprovedDowntimeReasonModel, 'tenant_plant_unit_machine_downtime_id');
					}
				})
			});

			Object.defineProperty(this, '$MachineDowntimeReasonModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_machine_downtime_reasons',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitMachineDowntime': function() {
						return this.belongsTo(self.$MachineDowntimeModel, 'tenant_plant_unit_machine_downtime_id');
					}
				})
			});

			Object.defineProperty(this, '$MachineApprovedDowntimeReasonModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_machine_downtime_reasons',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitMachineApprovedDowntime': function() {
						return this.belongsTo(self.$MachineApprovedDowntimeModel, 'tenant_plant_unit_machine_downtime_id');
					}
				})
			});

			Object.defineProperty(this, '$MachineSetuptimeModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_machine_setuptimes',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitMachine': function() {
						return this.belongsTo(self.$TenantPlantUnitMachineModel, 'tenant_plant_unit_machine_id');
					},

					'reasons': function() {
						return this.hasMany(self.$MachineSetuptimeReasonModel, 'tenant_plant_unit_machine_setuptime_id');
					}
				})
			});

			Object.defineProperty(this, '$MachineSetuptimeReasonModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_machine_setuptime_reasons',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitMachineSetuptime': function() {
						return this.belongsTo(self.$MachineSetuptimeModel, 'tenant_plant_unit_machine_setuptime_id');
					}
				})
			});

			Object.defineProperty(this, '$MachineIdletimeModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_machine_idletimes',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitMachine': function() {
						return this.belongsTo(self.$TenantPlantUnitMachineModel, 'tenant_plant_unit_machine_id');
					},

					'reasons': function() {
						return this.hasMany(self.$MachineIdletimeReasonModel, 'tenant_plant_unit_machine_idletime_id');
					}
				})
			});

			Object.defineProperty(this, '$MachineIdletimeReasonModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_machine_idletime_reasons',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitMachineIdletime': function() {
						return this.belongsTo(self.$MachineIdletimeModel, 'tenant_plant_unit_machine_idletime_id');
					}
				})
			});

			Object.defineProperty(this, '$MachineTemplateModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_machine_templates',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitMachine': function() {
						return this.belongsTo(self.$TenantPlantUnitMachineModel, 'tenant_plant_unit_machine_id');
					}
				}, {
					'jsonColumns': ['component_observers', 'component_tasks']
				})
			});

			Object.defineProperty(this, '$TenantPlantUnitMachineScheduleModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_machine_schedules',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitMachine': function() {
						return this.belongsTo(self.$TenantPlantUnitMachineModel, 'tenant_plant_unit_machine_id');
					}
				})
			});

			Object.defineProperty(this, '$MachineAttachedFormModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_operator_forms_plant_unit_machines',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitMachine': function() {
						return this.belongsTo(self.$TenantPlantUnitMachineModel, 'tenant_plant_unit_machine_id');
					},

					'tenantOperatorForm': function() {
						return this.belongsTo(self.$TenantOperatorFormModel, 'tenant_operator_form_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantPlantUnitMachineAggregateModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_machine_aggregates',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitMachine': function() {
						return this.belongsTo(self.$TenantPlantUnitMachineModel, 'tenant_plant_unit_machine_id');
					},

					'evaluationExpression': function() {
						return this.belongsTo(self.$TenantAttributeSetPropertyModel, 'evaluation_expression');
					}
				}, {
					'jsonColumns': ['config', 'filters']
				})
			});

			Object.defineProperty(this, '$TenantPlantUnitMachineEventModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_machine_events',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitMachine': function() {
						return this.belongsTo(self.$TenantPlantUnitMachineModel, 'tenant_plant_unit_machine_id');
					},

					'tenantPlantUnitStation': function() {
						return this.belongsTo(self.$TenantPlantUnitStationModel, 'tenant_plant_unit_station_id');
					},

					'eventType': function() {
						return this.belongsTo(self.$EventTypeModel, 'event_type_id');
					}
				}, {
					'jsonColumns': ['event_metadata']
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

					'tenantPlantUnit': function() {
						return this.belongsTo(self.$TenantPlantUnitModel, 'tenant_plant_unit_id');
					},

					'templates': function() {
						return this.hasMany(self.$LineTemplateModel, 'tenant_plant_unit_line_id');
					},

					'processors': function() {
						return this.hasMany(self.$LineProcessorModel, 'tenant_plant_unit_line_id');
					},

					'attributeSets': function() {
						return this.hasMany(self.$LineAttributeSetModel, 'tenant_plant_unit_line_id');
					},

					'constituents': function() {
						return this.hasMany(self.$LineConstituentModel, 'tenant_plant_unit_line_id');
					},

					'supervisorList': function() {
						return this.belongsTo(self.$TenantEmdConfigurationModel, 'supervisor_list_id');
					},

					'attachedForms': function() {
						return this.hasMany(self.$LineAttachedFormModel, 'tenant_plant_unit_line_id');
					},

					'events': function() {
						return this.hasMany(self.$TenantPlantUnitLineEventModel, 'tenant_plant_unit_line_id');
					},

					'workOrderFormats': function() {
						return this.hasMany(self.$LineWorkOrderFormatModel, 'tenant_plant_unit_line_id');
					},

					'watchers': function() {
						return this.hasMany(self.$LineUserModel, 'tenant_plant_unit_line_id');
					}
				}, {
					'jsonColumns': ['attribute_set_metadata', 'supervisor_list_filters']
				})
			});

			Object.defineProperty(this, '$LineAttributeSetModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_lines_attribute_sets',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantAttributeSet': function() {
						return this.belongsTo(self.$TenantAttributeSetModel, 'tenant_attribute_set_id');
					},

					'tenantPlantUnitLine': function() {
						return this.belongsTo(self.$TenantPlantUnitLineModel, 'tenant_plant_unit_line_id');
					}
				})
			});

			Object.defineProperty(this, '$LineConstituentModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_line_constituents',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitLine': function() {
						return this.belongsTo(self.$TenantPlantUnitLineModel, 'tenant_plant_unit_line_id');
					},
					'entites': function() {
						return this.hasMany(self.$TenantBlockEntitiesModel, 'block_id', 'tenant_plant_unit_line_constituent_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantBlockEntitiesModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_line_constituent_block_entities',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'block': function() {
						return this.belongsTo(self.$LineConstituentModel, 'block_id', 'tenant_plant_unit_line_constituent_id');
					}
				})
			});

			Object.defineProperty(this, '$LineProcessorModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_line_processors',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitLine': function() {
						return this.belongsTo(self.$TenantPlantUnitLineModel, 'tenant_plant_unit_line_id');
					}
				})
			});

			Object.defineProperty(this, '$LineTemplateModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_line_templates',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitLine': function() {
						return this.belongsTo(self.$TenantPlantUnitLineModel, 'tenant_plant_unit_line_id');
					}
				}, {
					'jsonColumns': ['component_observers', 'component_tasks']
				})
			});

			Object.defineProperty(this, '$LineAttachedFormModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_operator_forms_plant_unit_lines',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitLine': function() {
						return this.belongsTo(self.$TenantPlantUnitLineModel, 'tenant_plant_unit_line_id');
					},

					'tenantOperatorForm': function() {
						return this.belongsTo(self.$TenantOperatorFormModel, 'tenant_operator_form_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantPlantUnitLineEventModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_line_events',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitLine': function() {
						return this.belongsTo(self.$TenantPlantUnitLineModel, 'tenant_plant_unit_line_id');
					},

					'tenantPlantUnitStation': function() {
						return this.belongs(self.$TenantPlantUnitStationModel, 'tenant_plant_unit_station_id');
					},

					'eventType': function() {
						return this.belongsTo(self.$EventTypeModel, 'event_type_id');
					}
				}, {
					'jsonColumns': ['event_metadata']
				})
			});

			Object.defineProperty(this, '$LineWorkOrderFormatModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_lines_work_order_formats',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitLine': function() {
						return this.belongsTo(self.$TenantPlantUnitLineModel, 'tenant_plant_unit_line_id');
					},

					'tenantWorkOrderFormat': function() {
						return this.belongsTo(self.$TenantWorkOrderFormatModel, 'tenant_work_order_format_id');
					}
				}, {
					'jsonColumns': ['filters']
				})
			});

			Object.defineProperty(this, '$LineUserModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_lines_users',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitLine': function() {
						return this.belongsTo(self.$TenantPlantUnitLineModel, 'tenant_plant_unit_line_id');
					},

					'tenantUser': function() {
						return this.belongsTo(self.$TenantUserModel, 'tenant_user_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantPlantUnitStationModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_stations',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnit': function() {
						return this.belongsTo(self.$TenantPlantUnitModel, 'tenant_plant_unit_id');
					},

					'observedMachines': function() {
						return this.hasMany(self.$StationObservedMachineModel, 'tenant_plant_unit_station_id');
					},

					'tenantPlantUnitMachineEvents': function() {
						return this.hasMany(self.$TenantPlantUnitMachineEventModel, 'tenant_plant_unit_station_id');
					},

					'tenantPlantUnitLineEvents': function() {
						return this.hasMany(self.$TenantPlantUnitLineEventModel, 'tenant_plant_unit_station_id');
					},

					'observedLines': function() {
						return this.hasMany(self.$StationObservedLineModel, 'tenant_plant_unit_station_id');
					},

					'attachedForms': function() {
						return this.hasMany(self.$StationAttachedFormModel, 'tenant_plant_unit_station_id');
					},

					'watchers': function() {
						return this.hasMany(self.$StationUserModel, 'tenant_plant_unit_station_id');
					}
				}, {
					'jsonColumns': ['attribute_set_metadata', 'operator_list_filters']
				})
			});

			Object.defineProperty(this, '$StationObservedMachineModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_stations_observed_machines',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitStation': function() {
						return this.belongsTo(self.$TenantPlantUnitStationModel, 'tenant_plant_unit_station_id');
					},

					'tenantPlantUnitMachine': function() {
						return this.belongsTo(self.$TenantPlantUnitMachineModel, 'tenant_plant_unit_machine_id');
					},

					'templates': function() {
						return this.hasMany(self.$StationObservedMachineTemplateModel, 'tenant_plant_unit_station_observed_machine_id');
					}
				})
			});

			Object.defineProperty(this, '$StationObservedMachineTemplateModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_station_observed_machine_templates',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitStationObservedMachine': function() {
						return this.belongsTo(self.$StationObservedMachineModel, 'tenant_plant_unit_station_observed_machine_id');
					}
				}, {
					'jsonColumns': ['component_observers', 'component_tasks']
				})
			});

			Object.defineProperty(this, '$StationObservedLineModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_stations_observed_lines',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitStation': function() {
						return this.belongsTo(self.$TenantPlantUnitStationModel, 'tenant_plant_unit_station_id');
					},

					'tenantPlantUnitLine': function() {
						return this.belongsTo(self.$TenantPlantUnitLineModel, 'tenant_plant_unit_line_id');
					},

					'templates': function() {
						return this.hasMany(self.$StationObservedLineTemplateModel, 'tenant_plant_unit_station_observed_line_id');
					}
				})
			});

			Object.defineProperty(this, '$StationObservedLineTemplateModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_station_observed_line_templates',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitStationObservedLine': function() {
						return this.belongsTo(self.$StationObservedLineModel, 'tenant_plant_unit_station_observed_line_id');
					}
				}, {
					'jsonColumns': ['component_observers', 'component_tasks']
				})
			});

			Object.defineProperty(this, '$StationAttachedFormModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_operator_forms_plant_unit_stations',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitStation': function() {
						return this.belongsTo(self.$TenantPlantUnitStationModel, 'tenant_plant_unit_station_id');
					},

					'tenantOperatorForm': function() {
						return this.belongsTo(self.$TenantOperatorFormModel, 'tenant_operator_form_id');
					}
				})
			});

			Object.defineProperty(this, '$StationUserModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_plant_unit_stations_users',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantPlantUnitStation': function() {
						return this.belongsTo(self.$TenantPlantUnitStationModel, 'tenant_plant_unit_station_id');
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

			Object.defineProperty(this, '$TenantOperatorFormModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_operator_forms',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantWorkOrderFormatModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_work_order_formats',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'lines': function() {
						return this.hasMany(self.$LineWorkOrderFormatModel, 'tenant_work_order_format_id');
					}
				})
			});

			Object.defineProperty(this, '$EventTypeModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'event_types',
					'hasTimestamps': true
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
		delete this.$EventTypeModel;

		delete this.$TenantWorkOrderFormatModel;

		delete this.$TenantOperatorFormModel;
		delete this.$TenantUserModel;

		delete this.$StationUserModel;
		delete this.$StationAttachedFormModel;
		delete this.$StationObservedLineTemplateModel;
		delete this.$StationObservedLineModel;
		delete this.$StationObservedMachineTemplateModel;
		delete this.$StationObservedMachineModel;
		delete this.$TenantPlantUnitStationModel;

		delete this.$LineUserModel;
		delete this.$LineWorkOrderFormatModel;
		delete this.$LineAttachedFormModel;
		delete this.$LineTemplateModel;
		delete this.$LineProcessorModel;
		delete this.$TenantBlockEntitiesModel;
		delete this.$LineConstituentModel;
		delete this.$LineAttributeSetModel;
		delete this.$TenantPlantUnitLineModel;

		delete this.$TenantPlantUnitMachineEventModel;
		delete this.$TenantPlantUnitMachineAggregateModel;
		delete this.$MachineAttachedFormModel;
		delete this.$TenantPlantUnitMachineScheduleModel;
		delete this.$MachineTemplateModel;
		delete this.$MachineDowntimeReasonModel;
		delete this.$MachineApprovedDowntimeReasonModel;
		delete this.$MachineSetuptimeReasonModel;
		delete this.$MachineIdletimeReasonModel;
		delete this.$MachineDowntimeModel;
		delete this.$MachineApprovedDowntimeModel;
		delete this.$MachineSetuptimeModel;
		delete this.$MachineIdletimeModel;
		delete this.$MachineProcessorModel;
		delete this.$MachineAttributeSetModel;
		delete this.$TenantPlantUnitMachineModel;

		delete this.$TenantPlantUnitDriverModel;

		delete this.$TenantPlantUnitScheduleExtensionModel;
		delete this.$TenantPlantUnitScheduleModel;
		delete this.$TenantPlantUnitModel;

		delete this.$TenantPlantScheduleModel;
		delete this.$TenantPlantModel;

		delete this.$TenantAttributeSetFunctionObservedPropertyModel;
		delete this.$TenantAttributeSetFunctionModel;
		delete this.$TenantAttributeSetPropertyModel;
		delete this.$TenantAttributeSetModel;

		delete this.$TenantLocationModel;
		delete this.$TenantFolderModel;
		delete this.$TenantModel;

		await super._teardown();
		return null;
	}
	// #endregion

	// #region Protected methods
	async _registerApis() {
		try {
			const ApiService = this.$dependencies.ApiService;
			await ApiService.add(`${this.name}::getConfigTreeNodes`, this._getConfigTreeNodes.bind(this));
			await ApiService.add(`${this.name}::getDevEnvTreeNodes`, this._getDevEnvTreeNodes.bind(this));
			await ApiService.add(`${this.name}::getScheduleTreeNodes`, this._getScheduleTreeNodes.bind(this));

			await ApiService.add(`${this.name}::getTenantFolder`, this._getTenantFolder.bind(this));
			await ApiService.add(`${this.name}::addTenantFolder`, this._addTenantFolder.bind(this));
			await ApiService.add(`${this.name}::updateTenantFolder`, this._updateTenantFolder.bind(this));
			await ApiService.add(`${this.name}::deleteTenantFolder`, this._deleteTenantFolder.bind(this));

			await ApiService.add(`${this.name}::getAllTenantAttributeSets`, this._getAllTenantAttributeSets.bind(this));
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

			await ApiService.add(`${this.name}::getAllTenantPlants`, this._getAllTenantPlants.bind(this));
			await ApiService.add(`${this.name}::getTenantPlant`, this._getTenantPlant.bind(this));
			await ApiService.add(`${this.name}::addTenantPlant`, this._addTenantPlant.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlant`, this._updateTenantPlant.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlant`, this._deleteTenantPlant.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantSchedule`, this._getTenantPlantSchedule.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantSchedule`, this._addTenantPlantSchedule.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantSchedule`, this._updateTenantPlantSchedule.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantSchedule`, this._deleteTenantPlantSchedule.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnit`, this._getTenantPlantUnit.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnit`, this._addTenantPlantUnit.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnit`, this._updateTenantPlantUnit.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitSchedule`, this._getTenantPlantUnitSchedule.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitSchedule`, this._addTenantPlantUnitSchedule.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitSchedule`, this._updateTenantPlantUnitSchedule.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitSchedule`, this._deleteTenantPlantUnitSchedule.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitScheduleExtension`, this._getTenantPlantUnitScheduleExtension.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitScheduleExtension`, this._addTenantPlantUnitScheduleExtension.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitScheduleExtension`, this._updateTenantPlantUnitScheduleExtension.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitScheduleExtension`, this._deleteTenantPlantUnitScheduleExtension.bind(this));

			await ApiService.add(`${this.name}::deleteTenantPlantUnit`, this._deleteTenantPlantUnit.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitDriver`, this._getTenantPlantUnitDriver.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitDriver`, this._addTenantPlantUnitDriver.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitDriver`, this._updateTenantPlantUnitDriver.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitDriver`, this._deleteTenantPlantUnitDriver.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitMachine`, this._getTenantPlantUnitMachine.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitMachine`, this._addTenantPlantUnitMachine.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitMachine`, this._updateTenantPlantUnitMachine.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitMachine`, this._deleteTenantPlantUnitMachine.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitMachineAttributeSet`, this._getTenantPlantUnitMachineAttributeSet.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitMachineAttributeSet`, this._addTenantPlantUnitMachineAttributeSet.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitMachineAttributeSet`, this._updateTenantPlantUnitMachineAttributeSet.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitMachineAttributeSet`, this._deleteTenantPlantUnitMachineAttributeSet.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitMachineProcessor`, this._getTenantPlantUnitMachineProcessor.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitMachineProcessor`, this._addTenantPlantUnitMachineProcessor.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitMachineProcessor`, this._updateTenantPlantUnitMachineProcessor.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitMachineDowntime`, this._getTenantPlantUnitMachineDowntime.bind(this));
			await ApiService.add(`${this.name}::getTenantPlantUnitMachineApprovedDowntime`, this._getTenantPlantUnitMachineApprovedDowntime.bind(this));
			await ApiService.add(`${this.name}::getTenantPlantUnitMachineConnectionDetails`, this._getTenantPlantUnitMachineConnectionDetails.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitMachineSetuptime`, this._getTenantPlantUnitMachineSetuptime.bind(this));
			await ApiService.add(`${this.name}::getTenantPlantUnitMachineIdletime`, this._getTenantPlantUnitMachineIdletime.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitMachineDowntimeReason`, this._getTenantPlantUnitMachineDowntimeReason.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitMachineDowntimeReason`, this._addTenantPlantUnitMachineDowntimeReason.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitMachineDowntimeReason`, this._updateTenantPlantUnitMachineDowntimeReason.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitMachineDowntimeReason`, this._deleteTenantPlantUnitMachineDowntimeReason.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitMachineApprovedDowntimeReason`, this._getTenantPlantUnitMachineApprovedDowntimeReason.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitMachineApprovedDowntimeReason`, this._addTenantPlantUnitMachineApprovedDowntimeReason.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitMachineApprovedDowntimeReason`, this._updateTenantPlantUnitMachineApprovedDowntimeReason.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitMachineApprovedDowntimeReason`, this._deleteTenantPlantUnitMachineApprovedDowntimeReason.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitMachineSetuptimeReason`, this._getTenantPlantUnitMachineSetuptimeReason.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitMachineSetuptimeReason`, this._addTenantPlantUnitMachineSetuptimeReason.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitMachineSetuptimeReason`, this._updateTenantPlantUnitMachineSetuptimeReason.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitMachineSetuptimeReason`, this._deleteTenantPlantUnitMachineSetuptimeReason.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitMachineIdletimeReason`, this._getTenantPlantUnitMachineIdletimeReason.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitMachineIdletimeReason`, this._addTenantPlantUnitMachineIdletimeReason.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitMachineIdletimeReason`, this._updateTenantPlantUnitMachineIdletimeReason.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitMachineIdletimeReason`, this._deleteTenantPlantUnitMachineIdletimeReason.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitMachineTemplate`, this._getTenantPlantUnitMachineTemplate.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitMachineTemplate`, this._addTenantPlantUnitMachineTemplate.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitMachineTemplate`, this._updateTenantPlantUnitMachineTemplate.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitMachineSchedule`, this._getTenantPlantUnitMachineSchedule.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitMachineSchedule`, this._addTenantPlantUnitMachineSchedule.bind(this));
			await ApiService.add(`${this.name}::uploadTenantPlantUnitMachineSchedules`, this._uploadTenantPlantUnitMachineSchedules.bind(this));
			await ApiService.add(`${this.name}::approveTenantPlantUnitMachineSchedules`, this._approveTenantPlantUnitMachineSchedules.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitMachineSchedule`, this._updateTenantPlantUnitMachineSchedule.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitMachineSchedule`, this._deleteTenantPlantUnitMachineSchedule.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitMachineAttachedForm`, this._getTenantPlantUnitMachineAttachedForm.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitMachineAttachedForm`, this._addTenantPlantUnitMachineAttachedForm.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitMachineAttachedForm`, this._deleteTenantPlantUnitMachineAttachedForm.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitMachineOperators`, this._getTenantPlantUnitMachineOperators.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitMachineAggregate`, this._getTenantPlantUnitMachineAggregate.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitMachineAggregate`, this._addTenantPlantUnitMachineAggregate.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitMachineAggregate`, this._updateTenantPlantUnitMachineAggregate.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitMachineAggregate`, this._deleteTenantPlantUnitMachineAggregate.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitMachineEvent`, this._getTenantPlantUnitMachineEvent.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitMachineEvent`, this._addTenantPlantUnitMachineEvent.bind(this));

			await ApiService.add(`${this.name}::getAllTenantPlantUnitLines`, this._getAllTenantPlantUnitLines.bind(this));
			await ApiService.add(`${this.name}::getTenantPlantUnitLine`, this._getTenantPlantUnitLine.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitLine`, this._addTenantPlantUnitLine.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitLine`, this._updateTenantPlantUnitLine.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitLine`, this._deleteTenantPlantUnitLine.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitLineAttributeSet`, this._getTenantPlantUnitLineAttributeSet.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitLineAttributeSet`, this._addTenantPlantUnitLineAttributeSet.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitLineAttributeSet`, this._updateTenantPlantUnitLineAttributeSet.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitLineAttributeSet`, this._deleteTenantPlantUnitLineAttributeSet.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitLineConstituent`, this._getTenantPlantUnitLineConstituent.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitLineConstituent`, this._addTenantPlantUnitLineConstituent.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitLineConstituent`, this._updateTenantPlantUnitLineConstituent.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitLineConstituent`, this._deleteTenantPlantUnitLineConstituent.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitLineBlockEntities`, this._getTenantPlantUnitLineBlockEntities.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitLineBlockEntities`, this._addTenantPlantUnitLineBlockEntities.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitLineBlockEntities`, this._deleteTenantPlantUnitLineBlockEntities.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitLineProcessor`, this._getTenantPlantUnitLineProcessor.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitLineProcessor`, this._addTenantPlantUnitLineProcessor.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitLineProcessor`, this._updateTenantPlantUnitLineProcessor.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitLineTemplate`, this._getTenantPlantUnitLineTemplate.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitLineTemplate`, this._addTenantPlantUnitLineTemplate.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitLineTemplate`, this._updateTenantPlantUnitLineTemplate.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitLineAttachedForm`, this._getTenantPlantUnitLineAttachedForm.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitLineAttachedForm`, this._addTenantPlantUnitLineAttachedForm.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitLineAttachedForm`, this._deleteTenantPlantUnitLineAttachedForm.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitLineEvent`, this._getTenantPlantUnitLineEvent.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitLineEvent`, this._addTenantPlantUnitLineEvent.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitLineWorkOrderFormat`, this._getTenantPlantUnitLineWorkOrderFormat.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitLineWorkOrderFormat`, this._addTenantPlantUnitLineWorkOrderFormat.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitLineWorkOrderFormat`, this._updateTenantPlantUnitLineWorkOrderFormat.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitLineWorkOrderFormat`, this._deleteTenantPlantUnitLineWorkOrderFormat.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitLineWorkOrders`, this._getTenantPlantUnitLineWorkOrders.bind(this));
			await ApiService.add(`${this.name}::getTenantPlantUnitLineWorkOrdersProduction`, this._getTenantPlantUnitLineWorkOrdersProduction.bind(this));
			await ApiService.add(`${this.name}::getTenantPlantUnitLineSupervisors`, this._getTenantPlantUnitLineSupervisors.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitLineWatcher`, this._getTenantPlantUnitLineWatcher.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitLineWatcher`, this._addTenantPlantUnitLineWatcher.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitLineWatcher`, this._deleteTenantPlantUnitLineWatcher.bind(this));

			await ApiService.add(`${this.name}::possibleLineTenantUsersList`, this._getPossibleLineTenantUsersList.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitStation`, this._getTenantPlantUnitStation.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitStation`, this._addTenantPlantUnitStation.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitStation`, this._updateTenantPlantUnitStation.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitStation`, this._deleteTenantPlantUnitStation.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitStationObservedMachine`, this._getTenantPlantUnitStationObservedMachine.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitStationObservedMachine`, this._addTenantPlantUnitStationObservedMachine.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitStationObservedMachine`, this._deleteTenantPlantUnitStationObservedMachine.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitStationObservedMachineTemplate`, this._getTenantPlantUnitStationObservedMachineTemplate.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitStationObservedMachineTemplate`, this._addTenantPlantUnitStationObservedMachineTemplate.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitStationObservedMachineTemplate`, this._updateTenantPlantUnitStationObservedMachineTemplate.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitStationObservedLine`, this._getTenantPlantUnitStationObservedLine.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitStationObservedLine`, this._addTenantPlantUnitStationObservedLine.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitStationObservedLine`, this._updateTenantPlantUnitStationObservedLine.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitStationObservedLine`, this._deleteTenantPlantUnitStationObservedLine.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitStationObservedLineTemplate`, this._getTenantPlantUnitStationObservedLineTemplate.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitStationObservedLineTemplate`, this._addTenantPlantUnitStationObservedLineTemplate.bind(this));
			await ApiService.add(`${this.name}::updateTenantPlantUnitStationObservedLineTemplate`, this._updateTenantPlantUnitStationObservedLineTemplate.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitStationAttachedForm`, this._getTenantPlantUnitStationAttachedForm.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitStationAttachedForm`, this._addTenantPlantUnitStationAttachedForm.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitStationAttachedForm`, this._deleteTenantPlantUnitStationAttachedForm.bind(this));

			await ApiService.add(`${this.name}::getTenantPlantUnitStationWatcher`, this._getTenantPlantUnitStationWatcher.bind(this));
			await ApiService.add(`${this.name}::addTenantPlantUnitStationWatcher`, this._addTenantPlantUnitStationWatcher.bind(this));
			await ApiService.add(`${this.name}::deleteTenantPlantUnitStationWatcher`, this._deleteTenantPlantUnitStationWatcher.bind(this));

			await ApiService.add(`${this.name}::possibleStationTenantUsersList`, this._getPossibleStationTenantUsersList.bind(this));

			await ApiService.add(`${this.name}::getFirstNonMetaDowntime`, this._getFirstNonMetaDowntime.bind(this));
			await ApiService.add(`${this.name}::submitShiftData`, this._submitShiftData.bind(this));

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
			await ApiService.remove(`${this.name}::possibleStationTenantUsersList`, this._getPossibleStationTenantUsersList.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitStationWatcher`, this._deleteTenantPlantUnitStationWatcher.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitStationWatcher`, this._addTenantPlantUnitStationWatcher.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitStationWatcher`, this._getTenantPlantUnitStationWatcher.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitStationAttachedForm`, this._deleteTenantPlantUnitStationAttachedForm.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitStationAttachedForm`, this._addTenantPlantUnitStationAttachedForm.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitStationAttachedForm`, this._getTenantPlantUnitStationAttachedForm.bind(this));

			await ApiService.remove(`${this.name}::updateTenantPlantUnitStationObservedLineTemplate`, this._updateTenantPlantUnitStationObservedLineTemplate.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitStationObservedLineTemplate`, this._addTenantPlantUnitStationObservedLineTemplate.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitStationObservedLineTemplate`, this._getTenantPlantUnitStationObservedLineTemplate.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitStationObservedLine`, this._deleteTenantPlantUnitStationObservedLine.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlantUnitStationObservedLine`, this._updateTenantPlantUnitStationObservedLine.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitStationObservedLine`, this._addTenantPlantUnitStationObservedLine.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitStationObservedLine`, this._getTenantPlantUnitStationObservedLine.bind(this));

			await ApiService.remove(`${this.name}::updateTenantPlantUnitStationObservedMachineTemplate`, this._updateTenantPlantUnitStationObservedMachineTemplate.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitStationObservedMachineTemplate`, this._addTenantPlantUnitStationObservedMachineTemplate.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitStationObservedMachineTemplate`, this._getTenantPlantUnitStationObservedMachineTemplate.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitStationObservedMachine`, this._deleteTenantPlantUnitStationObservedMachine.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitStationObservedMachine`, this._addTenantPlantUnitStationObservedMachine.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitStationObservedMachine`, this._getTenantPlantUnitStationObservedMachine.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitStation`, this._deleteTenantPlantUnitStation.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlantUnitStation`, this._updateTenantPlantUnitStation.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitStation`, this._addTenantPlantUnitStation.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitStation`, this._getTenantPlantUnitStation.bind(this));

			await ApiService.remove(`${this.name}::possibleLineTenantUsersList`, this._getPossibleLineTenantUsersList.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitLineWatcher`, this._deleteTenantPlantUnitLineWatcher.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitLineWatcher`, this._addTenantPlantUnitLineWatcher.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitLineWatcher`, this._getTenantPlantUnitLineWatcher.bind(this));

			await ApiService.remove(`${this.name}::getTenantPlantUnitLineWorkOrders`, this._getTenantPlantUnitLineWorkOrders.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitLineWorkOrdersProduction`, this._getTenantPlantUnitLineWorkOrdersProduction.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitLineSupervisors`, this._getTenantPlantUnitLineSupervisors.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitLineWorkOrderFormat`, this._deleteTenantPlantUnitLineWorkOrderFormat.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlantUnitLineWorkOrderFormat`, this._updateTenantPlantUnitLineWorkOrderFormat.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitLineWorkOrderFormat`, this._addTenantPlantUnitLineWorkOrderFormat.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitLineWorkOrderFormat`, this._getTenantPlantUnitLineWorkOrderFormat.bind(this));

			await ApiService.remove(`${this.name}::addTenantPlantUnitLineEvent`, this._addTenantPlantUnitLineEvent.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitLineEvent`, this._getTenantPlantUnitLineEvent.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitLineAttachedForm`, this._deleteTenantPlantUnitLineAttachedForm.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitLineAttachedForm`, this._addTenantPlantUnitLineAttachedForm.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitLineAttachedForm`, this._getTenantPlantUnitLineAttachedForm.bind(this));

			await ApiService.remove(`${this.name}::updateTenantPlantUnitLineTemplate`, this._updateTenantPlantUnitLineTemplate.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitLineTemplate`, this._addTenantPlantUnitLineTemplate.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitLineTemplate`, this._getTenantPlantUnitLineTemplate.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitMachineIdletimeReason`, this._deleteTenantPlantUnitMachineIdletimeReason.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlantUnitMachineIdletimeReason`, this._updateTenantPlantUnitMachineIdletimeReason.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitMachineIdletimeReason`, this._addTenantPlantUnitMachineIdletimeReason.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitMachineIdletimeReason`, this._getTenantPlantUnitMachineIdletimeReason.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitMachineSetuptimeReason`, this._deleteTenantPlantUnitMachineSetuptimeReason.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlantUnitMachineSetuptimeReason`, this._updateTenantPlantUnitMachineSetuptimeReason.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitMachineSetuptimeReason`, this._addTenantPlantUnitMachineSetuptimeReason.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitMachineSetuptimeReason`, this._getTenantPlantUnitMachineSetuptimeReason.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitMachineDowntimeReason`, this._deleteTenantPlantUnitMachineDowntimeReason.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlantUnitMachineDowntimeReason`, this._updateTenantPlantUnitMachineDowntimeReason.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitMachineDowntimeReason`, this._addTenantPlantUnitMachineDowntimeReason.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitMachineDowntimeReason`, this._getTenantPlantUnitMachineDowntimeReason.bind(this));

			await ApiService.remove(`${this.name}::getTenantPlantUnitMachineApprovedDowntimeReason`, this._getTenantPlantUnitMachineApprovedDowntimeReason.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitMachineApprovedDowntimeReason`, this._addTenantPlantUnitMachineApprovedDowntimeReason.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlantUnitMachineApprovedDowntimeReason`, this._updateTenantPlantUnitMachineApprovedDowntimeReason.bind(this));
			await ApiService.remove(`${this.name}::deleteTenantPlantUnitMachineApprovedDowntimeReason`, this._deleteTenantPlantUnitMachineApprovedDowntimeReason.bind(this));

			await ApiService.remove(`${this.name}::getTenantPlantUnitMachineIdletime`, this._getTenantPlantUnitMachineIdletime.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitMachineSetuptime`, this._getTenantPlantUnitMachineSetuptime.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitMachineDowntime`, this._getTenantPlantUnitMachineDowntime.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitApprovedMachineDowntime`, this._getTenantPlantUnitMachineApprovedDowntime.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitMachineConnectionDetails`, this._getTenantPlantUnitMachineConnectionDetails.bind(this));

			await ApiService.remove(`${this.name}::updateTenantPlantUnitLineProcessor`, this._updateTenantPlantUnitLineProcessor.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitLineProcessor`, this._addTenantPlantUnitLineProcessor.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitLineProcessor`, this._getTenantPlantUnitLineProcessor.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitLineBlockEntities`, this._deleteTenantPlantUnitLineBlockEntities.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitLineBlockEntities`, this._addTenantPlantUnitLineBlockEntities.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitLineBlockEntities`, this._getTenantPlantUnitLineBlockEntities.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitLineConstituent`, this._deleteTenantPlantUnitLineConstituent.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlantUnitLineConstituent`, this._updateTenantPlantUnitLineConstituent.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitLineConstituent`, this._addTenantPlantUnitLineConstituent.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitLineConstituent`, this._getTenantPlantUnitLineConstituent.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitLineAttributeSet`, this._deleteTenantPlantUnitLineAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlantUnitLineAttributeSet`, this._updateTenantPlantUnitLineAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitLineAttributeSet`, this._addTenantPlantUnitLineAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitLineAttributeSet`, this._getTenantPlantUnitLineAttributeSet.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitLine`, this._deleteTenantPlantUnitLine.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlantUnitLine`, this._updateTenantPlantUnitLine.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitLine`, this._addTenantPlantUnitLine.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitLine`, this._getTenantPlantUnitLine.bind(this));
			await ApiService.remove(`${this.name}::getAllTenantPlantUnitLines`, this._getAllTenantPlantUnitLines.bind(this));

			await ApiService.remove(`${this.name}::addTenantPlantUnitMachineEvent`, this._addTenantPlantUnitMachineEvent.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitMachineEvent`, this._getTenantPlantUnitMachineEvent.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitMachineAggregate`, this._deleteTenantPlantUnitMachineAggregate.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlantUnitMachineAggregate`, this._updateTenantPlantUnitMachineAggregate.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitMachineAggregate`, this._addTenantPlantUnitMachineAggregate.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitMachineAggregate`, this._getTenantPlantUnitMachineAggregate.bind(this));

			await ApiService.remove(`${this.name}::getTenantPlantUnitMachineOperators`, this._getTenantPlantUnitMachineOperators.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitMachineAttachedForm`, this._deleteTenantPlantUnitMachineAttachedForm.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitMachineAttachedForm`, this._addTenantPlantUnitMachineAttachedForm.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitMachineAttachedForm`, this._getTenantPlantUnitMachineAttachedForm.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitMachineSchedule`, this._deleteTenantPlantUnitMachineSchedule.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlantUnitMachineSchedule`, this._updateTenantPlantUnitMachineSchedule.bind(this));
			await ApiService.remove(`${this.name}::approveTenantPlantUnitMachineSchedules`, this._approveTenantPlantUnitMachineSchedules.bind(this));
			await ApiService.remove(`${this.name}::uploadTenantPlantUnitMachineSchedules`, this._uploadTenantPlantUnitMachineSchedules.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitMachineSchedule`, this._addTenantPlantUnitMachineSchedule.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitMachineSchedule`, this._getTenantPlantUnitMachineSchedule.bind(this));

			await ApiService.remove(`${this.name}::updateTenantPlantUnitMachineTemplate`, this._updateTenantPlantUnitMachineTemplate.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitMachineTemplate`, this._addTenantPlantUnitMachineTemplate.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitMachineTemplate`, this._getTenantPlantUnitMachineTemplate.bind(this));

			await ApiService.remove(`${this.name}::updateTenantPlantUnitMachineProcessor`, this._updateTenantPlantUnitMachineProcessor.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitMachineProcessor`, this._addTenantPlantUnitMachineProcessor.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitMachineProcessor`, this._getTenantPlantUnitMachineProcessor.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitMachineAttributeSet`, this._deleteTenantPlantUnitMachineAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlantUnitMachineAttributeSet`, this._updateTenantPlantUnitMachineAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitMachineAttributeSet`, this._addTenantPlantUnitMachineAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitMachineAttributeSet`, this._getTenantPlantUnitMachineAttributeSet.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitMachine`, this._deleteTenantPlantUnitMachine.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlantUnitMachine`, this._updateTenantPlantUnitMachine.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitMachine`, this._addTenantPlantUnitMachine.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitMachine`, this._getTenantPlantUnitMachine.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitDriver`, this._deleteTenantPlantUnitDriver.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlantUnitDriver`, this._updateTenantPlantUnitDriver.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitDriver`, this._addTenantPlantUnitDriver.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitDriver`, this._getTenantPlantUnitDriver.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitSchedule`, this._deleteTenantPlantUnitSchedule.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlantUnitSchedule`, this._updateTenantPlantUnitSchedule.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitSchedule`, this._addTenantPlantUnitSchedule.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitSchedule`, this._getTenantPlantUnitSchedule.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnitScheduleExtension`, this._deleteTenantPlantUnitScheduleExtension.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlantUnitScheduleExtension`, this._updateTenantPlantUnitScheduleExtension.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnitScheduleExtension`, this._addTenantPlantUnitScheduleExtension.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnitScheduleExtension`, this._getTenantPlantUnitScheduleExtension.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantUnit`, this._deleteTenantPlantUnit.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlantUnit`, this._updateTenantPlantUnit.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantUnit`, this._addTenantPlantUnit.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantUnit`, this._getTenantPlantUnit.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlantSchedule`, this._deleteTenantPlantSchedule.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlantSchedule`, this._updateTenantPlantSchedule.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlantSchedule`, this._addTenantPlantSchedule.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlantSchedule`, this._getTenantPlantSchedule.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantPlant`, this._deleteTenantPlant.bind(this));
			await ApiService.remove(`${this.name}::updateTenantPlant`, this._updateTenantPlant.bind(this));
			await ApiService.remove(`${this.name}::addTenantPlant`, this._addTenantPlant.bind(this));
			await ApiService.remove(`${this.name}::getTenantPlant`, this._getTenantPlant.bind(this));
			await ApiService.remove(`${this.name}::getAllTenantPlants`, this._getAllTenantPlants.bind(this));

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
			await ApiService.remove(`${this.name}::getAllTenantAttributeSets`, this._getAllTenantAttributeSets.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantFolder`, this._deleteTenantFolder.bind(this));
			await ApiService.remove(`${this.name}::updateTenantFolder`, this._updateTenantFolder.bind(this));
			await ApiService.remove(`${this.name}::addTenantFolder`, this._addTenantFolder.bind(this));
			await ApiService.remove(`${this.name}::getTenantFolder`, this._getTenantFolder.bind(this));

			await ApiService.remove(`${this.name}::getScheduleTreeNodes`, this._getScheduleTreeNodes.bind(this));
			await ApiService.remove(`${this.name}::getDevEnvTreeNodes`, this._getDevEnvTreeNodes.bind(this));
			await ApiService.remove(`${this.name}::getconfigTreeNodes`, this._getConfigTreeNodes.bind(this));

			await ApiService.remove(`${this.name}::getFirstNonMetaDowntime`, this._getFirstNonMetaDowntime.bind(this));
			await ApiService.remove(`${this.name}::submitShiftData`, this._submitShiftData.bind(this));

			await super._deregisterApis();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getConfigTreeNodes(ctxt) {
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
							'configsRoute': 'configure.manufacturing',
							'dataUrl': '/manufacturing/config-tree-nodes',
							'intl': true,
							'type': folder.name === 'manufacturing_feature.folder_names.attribute_sets.name' ? 'attribute-folder' : 'plant-folder'
						}
					};
				});

				return tenantFolders;
			}

			if(['attribute-folder', 'plant-folder'].includes(ctxt.query.node_type)) {
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
							'configsRoute': 'configure.manufacturing',
							'dataUrl': '/manufacturing/config-tree-nodes',
							'intl': false,
							'type': ctxt.query.node_type
						}
					};
				});

				// Get the plants in this folder
				let tenantPlants = await dbSrvc.knex.raw(`SELECT id, tenant_folder_id AS parent_id, name FROM tenant_plants WHERE tenant_folder_id  = ?`, [ctxt.query.node_id]);
				tenantPlants = tenantPlants.rows.map((plant) => {
					return {
						'id': plant.id,
						'parent': plant.parent_id,
						'text': plant.name,
						'children': true,

						'li_attr': {
							'title': plant.name
						},

						'data': {
							'configsRoute': 'configure.manufacturing',
							'dataUrl': '/manufacturing/config-tree-nodes',
							'type': 'plant'
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
							'configsRoute': 'configure.manufacturing',
							'dataUrl': '/manufacturing/config-tree-nodes',
							'type': 'attribute-set'
						}
					};
				});

				return [...tenantFolders, ...tenantPlants, ...tenantAttributeSets];
			}

			// Get a list of plant units
			if(ctxt.query.node_type === 'plant') {
				let plantUnits = await dbSrvc.knex.raw(`SELECT id, tenant_plant_id AS parent, name FROM tenant_plant_units WHERE tenant_id = ? AND tenant_plant_id = ? AND parent_id IS NULL`, [ctxt.state.tenant.tenant_id, ctxt.query.node_id]);
				plantUnits = plantUnits.rows.map((plantUnit) => {
					return {
						'id': plantUnit.id,
						'parent': plantUnit.parent,
						'text': plantUnit.name,
						'children': true,

						'li_attr': {
							'title': plantUnit.name
						},

						'data': {
							'configsRoute': 'configure.manufacturing',
							'dataUrl': '/manufacturing/config-tree-nodes',
							'type': 'plant-unit'
						}
					};
				});

				return plantUnits;
			}

			// Get a list of sub-units
			if(ctxt.query.node_type === 'plant-unit') {
				let plantUnits = await dbSrvc.knex.raw(`SELECT * FROM fn_get_plant_unit_descendants(?) WHERE level = 2`, [ctxt.query.node_id]);
				plantUnits = plantUnits.rows.map((plantUnit) => {
					return {
						'id': plantUnit.id,
						'parent': plantUnit.parent_id,
						'text': plantUnit.name,
						'children': true,

						'li_attr': {
							'title': plantUnit.name
						},

						'data': {
							'configsRoute': 'configure.manufacturing',
							'dataUrl': '/manufacturing/config-tree-nodes',
							'type': 'plant-unit'
						}
					};
				});

				return plantUnits;
			}

			return [];
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getConfigTreeNodes`, err);
		}
	}

	async _getDevEnvTreeNodes(ctxt) {
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
							'devenvRoute': 'devenv.manufacturing',
							'dataUrl': '/manufacturing/devenv-tree-nodes',
							'intl': true,
							'type': folder.name === 'manufacturing_feature.folder_names.attribute_sets.name' ? 'attribute-folder' : 'plant-folder'
						}
					};
				});

				return tenantFolders;
			}

			if(['attribute-folder', 'plant-folder'].includes(ctxt.query.node_type)) {
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
							'devenvRoute': 'devenv.manufacturing',
							'dataUrl': '/manufacturing/devenv-tree-nodes',
							'intl': false,
							'type': ctxt.query.node_type
						}
					};
				});

				// Get the plants in this folder
				let tenantPlants = await dbSrvc.knex.raw(`SELECT id, tenant_folder_id AS parent_id, name FROM tenant_plants WHERE tenant_folder_id  = ?`, [ctxt.query.node_id]);
				tenantPlants = tenantPlants.rows.map((plant) => {
					return {
						'id': plant.id,
						'parent': plant.parent_id,
						'text': plant.name,
						'children': true,

						'li_attr': {
							'title': plant.name
						},

						'data': {
							'devenvRoute': 'devenv.manufacturing',
							'dataUrl': '/manufacturing/devenv-tree-nodes',
							'type': 'plant'
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
							'devenvRoute': 'devenv.manufacturing',
							'dataUrl': '/manufacturing/devenv-tree-nodes',
							'type': 'attribute-set'
						}
					};
				});

				return [...tenantFolders, ...tenantPlants, ...tenantAttributeSets];
			}

			// Get a list of plant units
			if(ctxt.query.node_type === 'plant') {
				let plantUnits = await dbSrvc.knex.raw(`SELECT id, tenant_plant_id AS parent, name FROM tenant_plant_units WHERE tenant_id = ? AND tenant_plant_id = ? AND parent_id IS NULL`, [ctxt.state.tenant.tenant_id, ctxt.query.node_id]);
				plantUnits = plantUnits.rows.map((plantUnit) => {
					return {
						'id': plantUnit.id,
						'parent': plantUnit.parent,
						'text': plantUnit.name,
						'children': true,

						'li_attr': {
							'title': plantUnit.name
						},

						'data': {
							'devenvRoute': 'devenv.manufacturing',
							'dataUrl': '/manufacturing/devenv-tree-nodes',
							'type': 'plant-unit'
						}
					};
				});

				return plantUnits;
			}

			// Get a list of sub-units / machines / stations
			if(ctxt.query.node_type === 'plant-unit') {
				const plantUnitId = ctxt.query.node_id;

				let plantUnits = await dbSrvc.knex.raw(`SELECT * FROM fn_get_plant_unit_descendants(?) WHERE level = 2`, [plantUnitId]);
				plantUnits = plantUnits.rows.map((plantUnit) => {
					return {
						'id': plantUnit.id,
						'parent': plantUnitId,
						'text': plantUnit.name,
						'children': true,

						'li_attr': {
							'title': plantUnit.name
						},

						'data': {
							'devenvRoute': 'devenv.manufacturing',
							'dataUrl': '/manufacturing/devenv-tree-nodes',
							'type': 'plant-unit'
						}
					};
				});

				let plantUnitMachines = await dbSrvc.knex.raw(`SELECT id, name FROM tenant_plant_unit_machines WHERE tenant_plant_unit_id = ?`, [plantUnitId]);
				plantUnitMachines = plantUnitMachines.rows.map((plantUnitMachine) => {
					return {
						'id': plantUnitMachine.id,
						'parent': plantUnitId,
						'text': plantUnitMachine.name,
						'children': false,

						'li_attr': {
							'title': plantUnitMachine.name
						},

						'data': {
							'devenvRoute': 'devenv.manufacturing',
							'dataUrl': '/manufacturing/devenv-tree-nodes',
							'type': 'plant-unit-machine'
						}
					};
				});

				let plantUnitLines = await dbSrvc.knex.raw('SELECT id, name FROM tenant_plant_unit_lines WHERE tenant_plant_unit_id = ?', [plantUnitId]);
				plantUnitLines = plantUnitLines.rows.map((plantUnitLine) => {
					return {
						'id': plantUnitLine.id,
						'parent': plantUnitId,
						'text': plantUnitLine.name,
						'children': false,

						'li_attr': {
							'title': plantUnitLine.name
						},

						'data': {
							'devenvRoute': 'devenv.manufacturing',
							'dataUrl': '/manufacturing/devenv-tree-nodes',
							'type': 'plant-unit-line'
						}
					};
				});

				let plantUnitStations = await dbSrvc.knex.raw('SELECT id, name FROM tenant_plant_unit_stations WHERE tenant_plant_unit_id = ?', [plantUnitId]);
				plantUnitStations = plantUnitStations.rows.map((plantUnitStation) => {
					return {
						'id': plantUnitStation.id,
						'parent': plantUnitId,
						'text': plantUnitStation.name,
						'children': false,

						'li_attr': {
							'title': plantUnitStation.name
						},

						'data': {
							'devenvRoute': 'devenv.manufacturing',
							'dataUrl': '/manufacturing/devenv-tree-nodes',
							'type': 'plant-unit-station'
						}
					};
				});

				return [...plantUnits, ...plantUnitMachines, ...plantUnitLines, ...plantUnitStations];
			}

			return [];
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getDevEnvTreeNodes`, err);
		}
	}

	async _getScheduleTreeNodes(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			if(ctxt.query.node_type === 'root-folder') {
				let tenantFolders = null;

				// Get the sub-folders
				tenantFolders = await dbSrvc.knex.raw(`SELECT * FROM fn_get_folder_descendants(?) WHERE name <> 'manufacturing_feature.folder_names.attribute_sets.name' AND level = 2`, [ctxt.query.node_id]);
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
							'scheduleRoute': 'schedule.manufacturing',
							'dataUrl': '/manufacturing/schedule-tree-nodes',
							'intl': true,
							'type': 'plant-folder'
						}
					};
				});

				return tenantFolders;
			}

			if(ctxt.query.node_type === 'plant-folder') {
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
							'scheduleRoute': 'schedule.manufacturing',
							'dataUrl': '/manufacturing/schedule-tree-nodes',
							'intl': false,
							'type': ctxt.query.node_type
						}
					};
				});

				// Get the plants in this folder
				let tenantPlants = await dbSrvc.knex.raw(`SELECT id, tenant_folder_id AS parent_id, name FROM tenant_plants WHERE tenant_folder_id  = ?`, [ctxt.query.node_id]);
				tenantPlants = tenantPlants.rows.map((plant) => {
					return {
						'id': plant.id,
						'parent': plant.parent_id,
						'text': plant.name,
						'children': true,

						'li_attr': {
							'title': plant.name
						},

						'data': {
							'scheduleRoute': 'schedule.manufacturing',
							'dataUrl': '/manufacturing/schedule-tree-nodes',
							'type': 'plant'
						}
					};
				});

				return [...tenantFolders, ...tenantPlants];
			}

			// Get a list of plant units
			if(ctxt.query.node_type === 'plant') {
				let plantUnits = await dbSrvc.knex.raw(`SELECT id, tenant_plant_id AS parent, name FROM tenant_plant_units WHERE tenant_id = ? AND tenant_plant_id = ? AND parent_id IS NULL`, [ctxt.state.tenant.tenant_id, ctxt.query.node_id]);
				plantUnits = plantUnits.rows.map((plantUnit) => {
					return {
						'id': plantUnit.id,
						'parent': plantUnit.parent,
						'text': plantUnit.name,
						'children': true,

						'li_attr': {
							'title': plantUnit.name
						},

						'data': {
							'scheduleRoute': 'schedule.manufacturing',
							'dataUrl': '/manufacturing/schedule-tree-nodes',
							'type': 'plant-unit'
						}
					};
				});

				return plantUnits;
			}

			// Get a list of sub-units
			if(ctxt.query.node_type === 'plant-unit') {
				let plantUnits = await dbSrvc.knex.raw(`SELECT * FROM fn_get_plant_unit_descendants(?) WHERE level = 2`, [ctxt.query.node_id]);
				plantUnits = plantUnits.rows.map((plantUnit) => {
					return {
						'id': plantUnit.id,
						'parent': plantUnit.parent_id,
						'text': plantUnit.name,
						'children': true,

						'li_attr': {
							'title': plantUnit.name
						},

						'data': {
							'scheduleRoute': 'schedule.manufacturing',
							'dataUrl': '/manufacturing/schedule-tree-nodes',
							'type': 'plant-unit'
						}
					};
				});

				const plantUnitId = ctxt.query.node_id;
				let plantUnitMachines = await dbSrvc.knex.raw(`SELECT id, name FROM tenant_plant_unit_machines WHERE tenant_plant_unit_id = ?`, [plantUnitId]);
				plantUnitMachines = plantUnitMachines.rows.map((plantUnitMachine) => {
					return {
						'id': plantUnitMachine.id,
						'parent': plantUnitId,
						'text': plantUnitMachine.name,
						'children': false,

						'li_attr': {
							'title': plantUnitMachine.name
						},

						'data': {
							'devenvRoute': 'devenv.manufacturing',
							'dataUrl': '/manufacturing/schedule-tree-nodes',
							'type': 'plant-unit-machine'
						}
					};
				});

				return [...plantUnits, ...plantUnitMachines];
			}

			return [];
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getScheduleTreeNodes`, err);
		}
	}

	async _getTenantFolder(ctxt) {
		try {
			let folderData = await this.$TenantFolderModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.folder_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'parent', 'folders', 'plants', 'attributeSets']
			});

			folderData = this._convertToJsonApiFormat(folderData, 'manufacturing/folder', {
				'tenant': 'settings/account/basics/tenant',
				'parent': 'manufacturing/folder',
				'folders': 'manufacturing/folder',
				'plants': 'manufacturing/plant',
				'attributeSets': 'manufacturing/attribute-set'
			});

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
			// TODO: add warning on frontend about deleting lines with work orders running
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const tenantFolder = await this.$TenantFolderModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.folder_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantFolder) throw new Error('Unknown Tenant Folder');

			// 1. determine if attrSet folder or plant folder
			const attrSetsRootFolderName = 'manufacturing_feature.folder_names.attribute_sets.name';

			let isAttrSetsFolder = await dbSrvc.knex.raw(`SELECT count(id) FROM fn_get_folder_descendants((SELECT id FROM tenant_folders WHERE tenant_id = ? and name = ?)) WHERE id = ?`, [
				ctxt.state.tenant.tenant_id,
				attrSetsRootFolderName,
				ctxt.params.folder_id
			]);

			isAttrSetsFolder = isAttrSetsFolder.rows && isAttrSetsFolder.rows.length && !!isAttrSetsFolder.rows[0]['count'];

			const folderDescendants = await dbSrvc.knex.raw(`SELECT * FROM fn_get_folder_descendants(?)`, [ctxt.params.folder_id]);

			let cachedArtifacts = [];
			if(isAttrSetsFolder) {
				// delete cached processor of folder attr sets
				const folderAttrSets = await dbSrvc.knex.raw(`SELECT id FROM tenant_attribute_sets WHERE tenant_folder_id IN (${folderDescendants.rows.map(() => { return '?'; }).join(',')})`, folderDescendants.rows.map((f) => { return f['id']; }));
				// update db and cached rendered processor of machine/lines which using folder attr sets
				const folderAttrSetsMachines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_machine_id AS id FROM tenant_plant_unit_machines_attribute_sets WHERE tenant_attribute_set_id IN (SELECT id FROM tenant_attribute_sets WHERE tenant_folder_id IN (${folderDescendants.rows.map(() => { return '?'; }).join(',')}))`, folderDescendants.rows.map((f) => { return f['id']; }));
				const folderAttrSetsLines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_line_id AS id FROM tenant_plant_unit_lines_attribute_sets WHERE tenant_attribute_set_id IN (SELECT id FROM tenant_attribute_sets WHERE tenant_folder_id IN (${folderDescendants.rows.map(() => { return '?'; }).join(',')}))`, folderDescendants.rows.map((f) => { return f['id']; }));

				await tenantFolder.destroy();

				for(let idx = 0; idx < folderAttrSets.rows.length; idx++) {
					const folderAttrSet = folderAttrSets.rows[idx];
					const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderAttrSet.id, 'attrSet']);
					cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());
				}

				for(let idx = 0; idx < folderAttrSetsMachines.rows.length; idx++) {
					const folderAttrSetMachine = folderAttrSetsMachines.rows[idx];
					await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [folderAttrSetMachine.id, 'machine', ctxt.state.tenant['tenant_id']]);
					const machineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderAttrSetMachine.id, 'machine']);
					cachedArtifacts = cachedArtifacts.concat(machineArtifacts.shift());
				}

				for(let idx = 0; idx < folderAttrSetsLines.rows.length; idx++) {
					const folderAttrSetLine = folderAttrSetsLines.rows[idx];
					await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [folderAttrSetLine.id, 'line', ctxt.state.tenant['tenant_id']]);
					const lineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderAttrSetLine.id, 'line']);
					cachedArtifacts = cachedArtifacts.concat(lineArtifacts.shift());
				}
			}
			else {
				// delete cached rendered processor of machine/lines within folder plants
				const folderPlantsMachines = await dbSrvc.knex.raw(`SELECT id FROM tenant_plant_unit_machines WHERE tenant_plant_unit_id IN (SELECT id FROM tenant_plant_units WHERE tenant_plant_id IN (SELECT id FROM tenant_plants WHERE tenant_folder_id IN (${folderDescendants.rows.map(() => { return '?'; }).join(',')})));`, folderDescendants.rows.map((f) => { return f['id']; }));
				const folderPlantsLines = await dbSrvc.knex.raw(`SELECT id FROM tenant_plant_unit_lines WHERE tenant_plant_unit_id IN (SELECT id FROM tenant_plant_units WHERE tenant_plant_id IN (SELECT id FROM tenant_plants WHERE tenant_folder_id IN (${folderDescendants.rows.map(() => { return '?'; }).join(',')})));`, folderDescendants.rows.map((f) => { return f['id']; }));

				await tenantFolder.destroy();

				for(let idx = 0; idx < folderPlantsMachines.rows.length; idx++) {
					const folderPlantsMachine = folderPlantsMachines.rows[idx];
					const machineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderPlantsMachine.id, 'machine']);
					cachedArtifacts = cachedArtifacts.concat(machineArtifacts.shift());
				}

				for(let idx = 0; idx < folderPlantsLines.rows.length; idx++) {
					const folderPlantsLine = folderPlantsLines.rows[idx];
					const lineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderPlantsLine.id, 'line']);
					cachedArtifacts = cachedArtifacts.concat(lineArtifacts.shift());
				}
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});
			await cacheMulti.execAsync();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantFolder`, err);
		}
	}

	async _getAllTenantAttributeSets(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			let parentFolderId = await dbSrvc.knex.raw(`SELECT id FROM tenant_folders WHERE tenant_id = ? AND name = 'manufacturing_feature.folder_names.attribute_sets.name'`, [ctxt.state.tenant.tenant_id]);
			parentFolderId = parentFolderId.rows[0]['id'];

			let subFolders = await dbSrvc.knex.raw(`SELECT id FROM fn_get_folder_descendants(?)`, [parentFolderId]);
			subFolders = subFolders.rows.map((subFolder) => {
				return subFolder['id'];
			});

			let attributeSetData = await this.$TenantAttributeSetModel
			.query(function(qb) {
				qb.whereIn('tenant_folder_id', subFolders);
			})
			.fetchAll({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'properties', 'functions']
			});

			attributeSetData = this._convertToJsonApiFormat(attributeSetData, 'manufacturing/attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'manufacturing/folder',
				'properties': 'manufacturing/attribute-set-property',
				'functions': 'manufacturing/attribute-set-function'
			});

			delete attributeSetData.included;
			return attributeSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAttributeSet`, err);
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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'manufacturing/attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'manufacturing/folder',
				'properties': 'manufacturing/attribute-set-property',
				'functions': 'manufacturing/attribute-set-function'
			});

			delete attrSetData.included;
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

			let tenantModuleId = await dbSrvc.knex.raw(`SELECT id FROM tenants_modules WHERE tenant_id = ? AND module_id = (SELECT id FROM modules  WHERE name = ? AND type = 'feature')`, [ctxt.state.tenant.tenant_id, 'Manufacturing']);
			if(!tenantModuleId.rows.length) throw new Error('Manufacturing feature not enabled for this tenant');
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
			const ApiService = this.$dependencies.ApiService;
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const tenantAttributeSet = await this.$TenantAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantAttributeSet) throw new Error('Unknown Tenant Attribute Set');

			const attrSetMachines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_machine_id AS id FROM tenant_plant_unit_machines_attribute_sets WHERE tenant_attribute_set_id = ?`, [ctxt.params['attribute_set_id']]);
			const attrSetLines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_line_id AS id FROM tenant_plant_unit_lines_attribute_sets WHERE tenant_attribute_set_id = ?`, [ctxt.params['attribute_set_id']]);

			await tenantAttributeSet.destroy();

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [ctxt.params.attribute_set_id, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetMachines.rows.length; idx++) {
				const attrSetMachine = attrSetMachines.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetMachine.id, 'machine', ctxt.state.tenant['tenant_id']]);
				const machineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetMachine.id, 'machine']);
				cachedArtifacts = cachedArtifacts.concat(machineArtifacts.shift());
			}
			for(let idx = 0; idx < attrSetLines.rows.length; idx++) {
				const attrSetLine = attrSetLines.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetLine.id, 'line', ctxt.state.tenant['tenant_id']]);
				const lineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetLine.id, 'line']);
				cachedArtifacts = cachedArtifacts.concat(lineArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});
			await cacheMulti.execAsync();

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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'manufacturing/attribute-set-property', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'manufacturing/attribute-set'
			});

			return attrSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAttributeSetProperty`, err);
		}
	}

	async _addTenantAttributeSetProperty(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantAttributeSetPropertyModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const attrSetMachines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_machine_id AS id FROM tenant_plant_unit_machines_attribute_sets WHERE tenant_attribute_set_id = ?`, [jsonDeserializedData.attribute_set_id]);
			const attrSetLines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_line_id AS id FROM tenant_plant_unit_lines_attribute_sets WHERE tenant_attribute_set_id = ?`, [jsonDeserializedData.attribute_set_id]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData.attribute_set_id, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetMachines.rows.length; idx++) {
				const attrSetMachine = attrSetMachines.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetMachine.id, 'machine', ctxt.state.tenant['tenant_id']]);
				const machineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetMachine.id, 'machine']);
				cachedArtifacts = cachedArtifacts.concat(machineArtifacts.shift());
			}
			for(let idx = 0; idx < attrSetLines.rows.length; idx++) {
				const attrSetLine = attrSetLines.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetLine.id, 'line', ctxt.state.tenant['tenant_id']]);
				const lineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetLine.id, 'line']);
				cachedArtifacts = cachedArtifacts.concat(lineArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});
			await cacheMulti.execAsync();

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
			const ApiService = this.$dependencies.ApiService;
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantAttributeSetPropertyModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			const attrSetMachines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_machine_id AS id FROM tenant_plant_unit_machines_attribute_sets WHERE tenant_attribute_set_id = ?`, [jsonDeserializedData.attribute_set_id]);
			const attrSetLines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_line_id AS id FROM tenant_plant_unit_lines_attribute_sets WHERE tenant_attribute_set_id = ?`, [jsonDeserializedData.attribute_set_id]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData.attribute_set_id, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetMachines.rows.length; idx++) {
				const attrSetMachine = attrSetMachines.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetMachine.id, 'machine', ctxt.state.tenant['tenant_id']]);
				const machineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetMachine.id, 'machine']);
				cachedArtifacts = cachedArtifacts.concat(machineArtifacts.shift());
			}
			for(let idx = 0; idx < attrSetLines.rows.length; idx++) {
				const attrSetLine = attrSetLines.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetLine.id, 'line', ctxt.state.tenant['tenant_id']]);
				const lineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetLine.id, 'line']);
				cachedArtifacts = cachedArtifacts.concat(lineArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});
			await cacheMulti.execAsync();

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
			const ApiService = this.$dependencies.ApiService;
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const tenantAttributeSetProperty = await this.$TenantAttributeSetPropertyModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.attribute_set_property_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantAttributeSetProperty) throw new Error('Unknown Tenant Attribute Set Property');

			const attributeSetId = tenantAttributeSetProperty.get('attribute_set_id');
			await tenantAttributeSetProperty.destroy();

			const attrSetMachines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_machine_id AS id FROM tenant_plant_unit_machines_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);
			const attrSetLines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_line_id AS id FROM tenant_plant_unit_lines_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetMachines.rows.length; idx++) {
				const attrSetMachine = attrSetMachines.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetMachine.id, 'machine', ctxt.state.tenant['tenant_id']]);
				const machineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetMachine.id, 'machine']);
				cachedArtifacts = cachedArtifacts.concat(machineArtifacts.shift());
			}
			for(let idx = 0; idx < attrSetLines.rows.length; idx++) {
				const attrSetLine = attrSetLines.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetLine.id, 'line', ctxt.state.tenant['tenant_id']]);
				const lineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetLine.id, 'line']);
				cachedArtifacts = cachedArtifacts.concat(lineArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});
			await cacheMulti.execAsync();

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

			attrSetData = this._convertToJsonApiFormat(attrSetData, 'manufacturing/attribute-set-function', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'manufacturing/attribute-set',
				'observedProperties': 'manufacturing/attribute-set-function-observed-property'
			});

			return attrSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAttributeSetFunction`, err);
		}
	}

	async _addTenantAttributeSetFunction(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantAttributeSetFunctionModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const attributeSetId = savedRecord.get('attribute_set_id');

			const attrSetMachines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_machine_id AS id FROM tenant_plant_unit_machines_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);
			const attrSetLines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_line_id AS id FROM tenant_plant_unit_lines_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetMachines.rows.length; idx++) {
				const attrSetMachine = attrSetMachines.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetMachine.id, 'machine', ctxt.state.tenant['tenant_id']]);
				const machineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetMachine.id, 'machine']);
				cachedArtifacts = cachedArtifacts.concat(machineArtifacts.shift());
			}
			for(let idx = 0; idx < attrSetLines.rows.length; idx++) {
				const attrSetLine = attrSetLines.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetLine.id, 'line', ctxt.state.tenant['tenant_id']]);
				const lineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetLine.id, 'line']);
				cachedArtifacts = cachedArtifacts.concat(lineArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});
			await cacheMulti.execAsync();

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
			const ApiService = this.$dependencies.ApiService;
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantAttributeSetFunctionModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			const attributeSetId = savedRecord.get('attribute_set_id');

			const attrSetMachines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_machine_id AS id FROM tenant_plant_unit_machines_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);
			const attrSetLines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_line_id AS id FROM tenant_plant_unit_lines_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetMachines.rows.length; idx++) {
				const attrSetMachine = attrSetMachines.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetMachine.id, 'machine', ctxt.state.tenant['tenant_id']]);
				const machineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetMachine.id, 'machine']);
				cachedArtifacts = cachedArtifacts.concat(machineArtifacts.shift());
			}
			for(let idx = 0; idx < attrSetLines.rows.length; idx++) {
				const attrSetLine = attrSetLines.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetLine.id, 'line', ctxt.state.tenant['tenant_id']]);
				const lineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetLine.id, 'line']);
				cachedArtifacts = cachedArtifacts.concat(lineArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});
			await cacheMulti.execAsync();

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
			const ApiService = this.$dependencies.ApiService;
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const tenantAttributeSetFunction = await this.$TenantAttributeSetFunctionModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.attribute_set_function_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantAttributeSetFunction) throw new Error('Unknown Tenant Attribute Set Function');
			const attributeSetId = tenantAttributeSetFunction.get('attribute_set_id');

			await tenantAttributeSetFunction.destroy();

			const attrSetMachines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_machine_id AS id FROM tenant_plant_unit_machines_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);
			const attrSetLines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_line_id AS id FROM tenant_plant_unit_lines_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetMachines.rows.length; idx++) {
				const attrSetMachine = attrSetMachines.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetMachine.id, 'machine', ctxt.state.tenant['tenant_id']]);
				const machineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetMachine.id, 'machine']);
				cachedArtifacts = cachedArtifacts.concat(machineArtifacts.shift());
			}
			for(let idx = 0; idx < attrSetLines.rows.length; idx++) {
				const attrSetLine = attrSetLines.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetLine.id, 'line', ctxt.state.tenant['tenant_id']]);
				const lineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetLine.id, 'line']);
				cachedArtifacts = cachedArtifacts.concat(lineArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});
			await cacheMulti.execAsync();

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

			attrSetObservedPropertyData = this._convertToJsonApiFormat(attrSetObservedPropertyData, 'manufacturing/attribute-set-function-observed-property', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'manufacturing/attribute-set',
				'attributeSetFunction': 'manufacturing/attribute-set-function',
				'attributeSetProperty': 'manufacturing/attribute-set-property'
			});

			return attrSetObservedPropertyData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantAttributeSetFunctionObservedProperty`, err);
		}
	}

	async _addTenantAttributeSetFunctionObservedProperty(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$TenantAttributeSetFunctionObservedPropertyModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const attributeSetId = savedRecord.get('attribute_set_id');

			const attrSetMachines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_machine_id AS id FROM tenant_plant_unit_machines_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);
			const attrSetLines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_line_id AS id FROM tenant_plant_unit_lines_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetMachines.rows.length; idx++) {
				const attrSetMachine = attrSetMachines.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetMachine.id, 'machine', ctxt.state.tenant['tenant_id']]);
				const machineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetMachine.id, 'machine']);
				cachedArtifacts = cachedArtifacts.concat(machineArtifacts.shift());
			}
			for(let idx = 0; idx < attrSetLines.rows.length; idx++) {
				const attrSetLine = attrSetLines.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetLine.id, 'line', ctxt.state.tenant['tenant_id']]);
				const lineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetLine.id, 'line']);
				cachedArtifacts = cachedArtifacts.concat(lineArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});
			await cacheMulti.execAsync();

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
			const ApiService = this.$dependencies.ApiService;
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const tenantAttributeSetFunctionObservedProperty = await this.$TenantAttributeSetFunctionObservedPropertyModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.attribute_set_function_observed_property_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantAttributeSetFunctionObservedProperty) throw new Error('Unknown Tenant Attribute Set Function Observed Property');
			const attributeSetId = tenantAttributeSetFunctionObservedProperty.get('attribute_set_id');

			await tenantAttributeSetFunctionObservedProperty.destroy();

			const attrSetMachines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_machine_id AS id FROM tenant_plant_unit_machines_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);
			const attrSetLines = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_line_id AS id FROM tenant_plant_unit_lines_attribute_sets WHERE tenant_attribute_set_id = ?`, [attributeSetId]);

			let cachedArtifacts = [];
			const attrSetArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attributeSetId, 'attrSet']);
			cachedArtifacts = cachedArtifacts.concat(attrSetArtifacts.shift());

			for(let idx = 0; idx < attrSetMachines.rows.length; idx++) {
				const attrSetMachine = attrSetMachines.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetMachine.id, 'machine', ctxt.state.tenant['tenant_id']]);
				const machineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetMachine.id, 'machine']);
				cachedArtifacts = cachedArtifacts.concat(machineArtifacts.shift());
			}
			for(let idx = 0; idx < attrSetLines.rows.length; idx++) {
				const attrSetLine = attrSetLines.rows[idx];
				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [attrSetLine.id, 'line', ctxt.state.tenant['tenant_id']]);
				const lineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [attrSetLine.id, 'line']);
				cachedArtifacts = cachedArtifacts.concat(lineArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});
			await cacheMulti.execAsync();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantAttributeSetFunctionObservedProperty`, err);
		}
	}

	async _getAllTenantPlants(ctxt) {
		try {
			let plantData = await this.$TenantPlantModel
			.query(function(qb) {
				qb.where({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetchAll({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'tenantLocation', 'units', 'schedules']
			});

			plantData = this._convertToJsonApiFormat(plantData, 'manufacturing/plant', {
				'tenant': 'settings/account/basics/tenant',
				'tenantLocation': 'settings/account/basics/tenant-location',
				'folder': 'manufacturing/folder',
				'units': 'manufacturing/plant-unit',
				'schedules': 'manufacturing/plant-schedule'
			});

			return plantData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllTenantPlants`, err);
		}
	}

	async _getTenantPlant(ctxt) {
		try {
			let plantData = await this.$TenantPlantModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'tenantLocation', 'units', 'schedules']
			});

			plantData = this._convertToJsonApiFormat(plantData, 'manufacturing/plant', {
				'tenant': 'settings/account/basics/tenant',
				'tenantLocation': 'settings/account/basics/tenant-location',
				'folder': 'manufacturing/folder',
				'units': 'manufacturing/plant-unit',
				'schedules': 'manufacturing/plant-schedule'
			});

			return plantData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlant`, err);
		}
	}

	async _addTenantPlant(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const savedRecord = await this.$TenantPlantModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const location = await dbSrvc.knex.raw('INSERT INTO tenant_locations(tenant_id, is_primary, name, line1, area, city, state, country, postal_code, latitude, longitude, timezone_id,	timezone_name)  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)  RETURNING id ', [jsonDeserializedData.tenant_id, true, jsonDeserializedData.id, ' ', ' ', ' ', ' ', ' ', ' ', 0.00, 0.00, 'UTC', 'Utc Timezone']);

			await dbSrvc.knex.raw(`update tenant_plants set tenant_location_id = ? where id =  ?`, [location.rows[0].id, jsonDeserializedData.id]);
			this.$dependencies.PubsubService.publish('plantworks-realtime-push', 'SCHEDULE.UPDATE', safeJsonStringify({
				'action': 'create'
			}));

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlant`, err);
		}
	}

	async _updateTenantPlant(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const savedRecord = await this.$TenantPlantModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			this.$dependencies.PubsubService.publish('plantworks-realtime-push', 'SCHEDULE.UPDATE', safeJsonStringify({
				'action': 'update'
			}));

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlant`, err);
		}
	}

	async _deleteTenantPlant(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const tenantPlant = await this.$TenantPlantModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantPlant) throw new Error('Unknown Tenant Plant');

			// delete cached rendered processor of machine/lines within plant
			const folderPlantsMachines = await dbSrvc.knex.raw(`SELECT id FROM tenant_plant_unit_machines WHERE tenant_plant_unit_id IN (SELECT id FROM tenant_plant_units WHERE tenant_plant_id = ?);`, [ctxt.params.plant_id]);
			const folderPlantsLines = await dbSrvc.knex.raw(`SELECT id FROM tenant_plant_unit_lines WHERE tenant_plant_unit_id IN (SELECT id FROM tenant_plant_units WHERE tenant_plant_id = ?);`, [ctxt.params.plant_id]);

			await tenantPlant.destroy();

			let cachedArtifacts = [];

			for(let idx = 0; idx < folderPlantsMachines.rows.length; idx++) {
				const folderPlantsMachine = folderPlantsMachines.rows[idx];
				const machineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderPlantsMachine.id, 'machine']);
				cachedArtifacts = cachedArtifacts.concat(machineArtifacts.shift());
			}

			for(let idx = 0; idx < folderPlantsLines.rows.length; idx++) {
				const folderPlantsLine = folderPlantsLines.rows[idx];
				const lineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderPlantsLine.id, 'line']);
				cachedArtifacts = cachedArtifacts.concat(lineArtifacts.shift());
			}
			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlant`, err);
		}
	}

	async _getTenantPlantSchedule(ctxt) {
		try {
			let plantScheduleData = await this.$TenantPlantScheduleModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_schedule_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['plant', 'tenant']
			});

			plantScheduleData = this._convertToJsonApiFormat(plantScheduleData, 'manufacturing/plant-schedule', {
				'tenant': 'settings/account/basics/tenant',
				'plant': 'manufacturing/plant'
			});

			return plantScheduleData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantSchedule`, err);
		}
	}

	async _addTenantPlantSchedule(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.description !== undefined && jsonDeserializedData.description !== null && jsonDeserializedData.description.trim() === '') throw new Error('Description cannot be empty');
			if(jsonDeserializedData.type !== undefined && jsonDeserializedData.type !== null && jsonDeserializedData.type.trim() === '') throw new Error('Type cannot be empty');
			if(jsonDeserializedData.start_date !== undefined && jsonDeserializedData.start_date !== null && jsonDeserializedData.start_date.trim() === '') throw new Error('Start Date cannot be empty');
			if(jsonDeserializedData.end_date !== undefined && jsonDeserializedData.end_date !== null && jsonDeserializedData.end_date.trim() === '') throw new Error('End Date cannot be empty');
			if(jsonDeserializedData.start_time !== undefined && jsonDeserializedData.start_time !== null && jsonDeserializedData.start_time.trim() === '') throw new Error('Start Time cannot be empty');
			if(jsonDeserializedData.end_time !== undefined && jsonDeserializedData.end_time !== null && jsonDeserializedData.end_time.trim() === '') throw new Error('End Time cannot be empty');

			jsonDeserializedData['tenant_plant_id'] = jsonDeserializedData['plant_id'];
			delete jsonDeserializedData['plant_id'];

			// Check if Holiday with same date exists
			if(jsonDeserializedData.type === 'holiday') {
				const newStartDate = new Date(jsonDeserializedData.start_date);
				const dbSrvc = this.$dependencies.DatabaseService;
				const holidayList = await dbSrvc.knex.raw('SELECT start_date FROM tenant_plant_schedules WHERE tenant_id = ? AND type = ?', [ctxt.state.tenant.tenant_id, 'holiday']);
				holidayList.rows.forEach((holiday) => {
					if(holiday.start_date.getDate() === newStartDate.getDate() && holiday.start_date.getMonth() === newStartDate.getMonth() && holiday.start_date.getFullYear() === newStartDate.getFullYear())
						throw new Error('Holiday with this date already exists');
				});
			}

			const savedRecord = await this.$TenantPlantScheduleModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantSchedule`, err);
		}
	}

	async _updateTenantPlantSchedule(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.description !== undefined && jsonDeserializedData.description !== null && jsonDeserializedData.description.trim() === '') throw new Error('Description cannot be empty');
			if(jsonDeserializedData.type !== undefined && jsonDeserializedData.type !== null && jsonDeserializedData.type.trim() === '') throw new Error('Type cannot be empty');
			if(jsonDeserializedData.start_date !== undefined && jsonDeserializedData.start_date !== null && jsonDeserializedData.start_date.trim() === '') throw new Error('Start Date cannot be empty');
			if(jsonDeserializedData.end_date !== undefined && jsonDeserializedData.end_date !== null && jsonDeserializedData.end_date.trim() === '') throw new Error('End Date cannot be empty');
			if(jsonDeserializedData.start_time !== undefined && jsonDeserializedData.start_time !== null && jsonDeserializedData.start_time.trim() === '') throw new Error('Start Time cannot be empty');
			if(jsonDeserializedData.end_time !== undefined && jsonDeserializedData.end_time !== null && jsonDeserializedData.end_time.trim() === '') throw new Error('End Time cannot be empty');

			jsonDeserializedData['tenant_plant_id'] = jsonDeserializedData['plant_id'];
			delete jsonDeserializedData['plant_id'];

			// Check if Holiday with same date exists
			if(jsonDeserializedData.type === 'holiday') {
				const newStartDate = new Date(jsonDeserializedData.start_date);
				const dbSrvc = this.$dependencies.DatabaseService;
				const holidayList = await dbSrvc.knex.raw('SELECT start_date FROM tenant_plant_schedules WHERE tenant_id = ? AND type = ? AND NOT id = ?', [ctxt.state.tenant.tenant_id, 'holiday', ctxt.params.plant_schedule_id]);
				holidayList.rows.forEach((holiday) => {
					if(holiday.start_date.getDate() === newStartDate.getDate() && holiday.start_date.getMonth() === newStartDate.getMonth() && holiday.start_date.getFullYear() === newStartDate.getFullYear())
						throw new Error('Holiday with this date already exists');
				});
			}

			const savedRecord = await this.$TenantPlantScheduleModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantSchedule`, err);
		}
	}

	async _deleteTenantPlantSchedule(ctxt) {
		try {
			const tenantPlantSchedule = await this.$TenantPlantScheduleModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_schedule_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantPlantSchedule) throw new Error('Unknown Tenant Plant Schedule');

			await tenantPlantSchedule.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deletetenantPlantSchedule`, err);
		}
	}

	async _getTenantPlantUnit(ctxt) {
		try {
			let plantUnitData = await this.$TenantPlantUnitModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'plant', 'parent', 'units', 'drivers', 'machines', 'stations', 'schedules', 'lines', 'extensions']
			});

			plantUnitData = this._convertToJsonApiFormat(plantUnitData, 'manufacturing/plant-unit', {
				'tenant': 'settings/account/basics/tenant',
				'plant': 'manufacturing/plant',
				'parent': 'manufacturing/plant-unit',
				'units': 'manufacturing/plant-unit',
				'drivers': 'manufacturing/plant-unit-driver',
				'machines': 'manufacturing/plant-unit-machine',
				'stations': 'manufacturing/plant-unit-station',
				'lines': 'manufacturing/plant-unit-line',
				'schedules': 'manufacturing/plant-unit-schedule',
				'extensions': 'manufacturing/plant-unit-schedule-extension'
			});

			return plantUnitData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnit`, err);
		}
	}

	async _addTenantPlantUnit(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			jsonDeserializedData['tenant_plant_id'] = jsonDeserializedData['plant_id'];
			delete jsonDeserializedData['plant_id'];

			const savedRecord = await this.$TenantPlantUnitModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnit`, err);
		}
	}

	async _updateTenantPlantUnit(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			jsonDeserializedData['tenant_plant_id'] = jsonDeserializedData['plant_id'];
			delete jsonDeserializedData['plant_id'];

			const savedRecord = await this.$TenantPlantUnitModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnit`, err);
		}
	}

	async _deleteTenantPlantUnit(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const tenantPlantUnit = await this.$TenantPlantUnitModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantPlantUnit) throw new Error('Unknown Tenant Plant');

			// delete cached rendered processor of machine/lines within plant
			const folderPlantsMachines = await dbSrvc.knex.raw(`SELECT id FROM tenant_plant_unit_machines WHERE tenant_plant_unit_id = ?;`, [ctxt.params.plant_unit_id]);
			const folderPlantsLines = await dbSrvc.knex.raw(`SELECT id FROM tenant_plant_unit_lines WHERE tenant_plant_unit_id = ?;`, [ctxt.params.plant_unit_id]);

			await tenantPlantUnit.destroy();

			let cachedArtifacts = [];

			for(let idx = 0; idx < folderPlantsMachines.rows.length; idx++) {
				const folderPlantsMachine = folderPlantsMachines.rows[idx];
				const machineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderPlantsMachine.id, 'machine']);
				cachedArtifacts = cachedArtifacts.concat(machineArtifacts.shift());
			}

			for(let idx = 0; idx < folderPlantsLines.rows.length; idx++) {
				const folderPlantsLine = folderPlantsLines.rows[idx];
				const lineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderPlantsLine.id, 'line']);
				cachedArtifacts = cachedArtifacts.concat(lineArtifacts.shift());
			}
			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnit`, err);
		}
	}

	async _getTenantPlantUnitSchedule(ctxt) {
		try {
			let plantUnitScheduleData = await this.$TenantPlantUnitScheduleModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_schedule_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnit']
			});

			plantUnitScheduleData = this._convertToJsonApiFormat(plantUnitScheduleData, 'manufacturing/plant-unit-schedule', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnit': 'manufacturing/plant-unit'
			});

			return plantUnitScheduleData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitSchedule`, err);
		}
	}

	async _addTenantPlantUnitSchedule(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.description !== undefined && jsonDeserializedData.description !== null && jsonDeserializedData.description.trim() === '') throw new Error('Description cannot be empty');
			if(jsonDeserializedData.type !== undefined && jsonDeserializedData.type !== null && jsonDeserializedData.type.trim() === '') throw new Error('Type cannot be empty');
			if(jsonDeserializedData.start_date !== undefined && jsonDeserializedData.start_date !== null && jsonDeserializedData.start_date.trim() === '') throw new Error('Start Date cannot be empty');
			if(jsonDeserializedData.end_date !== undefined && jsonDeserializedData.end_date !== null && jsonDeserializedData.end_date.trim() === '') throw new Error('End Date cannot be empty');
			if(jsonDeserializedData.start_time !== undefined && jsonDeserializedData.start_time !== null && jsonDeserializedData.start_time.trim() === '') throw new Error('Start Time cannot be empty');
			if(jsonDeserializedData.end_time !== undefined && jsonDeserializedData.end_time !== null && jsonDeserializedData.end_time.trim() === '') throw new Error('End Time cannot be empty');

			// Check if Holiday with same date exists
			if(jsonDeserializedData.type === 'holiday') {
				const newStartDate = new Date(jsonDeserializedData.start_date);
				const dbSrvc = this.$dependencies.DatabaseService;
				const holidayList = await dbSrvc.knex.raw('SELECT start_date FROM tenant_plant_unit_schedules WHERE tenant_id = ? AND type = ?', [ctxt.state.tenant.tenant_id, 'holiday']);
				holidayList.rows.forEach((holiday) => {
					if(holiday.start_date.getDate() === newStartDate.getDate() && holiday.start_date.getMonth() === newStartDate.getMonth() && holiday.start_date.getFullYear() === newStartDate.getFullYear())
						throw new Error('Holiday with this date already exists');
				});
			}

			const savedRecord = await this.$TenantPlantUnitScheduleModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			this.$dependencies.PubsubService.publish('plantworks-realtime-push', 'SCHEDULE.UPDATE', safeJsonStringify({
				'action': 'create'
			}));

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitSchedule`, err);
		}
	}

	async _updateTenantPlantUnitSchedule(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.description !== undefined && jsonDeserializedData.description !== null && jsonDeserializedData.description.trim() === '') throw new Error('Description cannot be empty');
			if(jsonDeserializedData.type !== undefined && jsonDeserializedData.type !== null && jsonDeserializedData.type.trim() === '') throw new Error('Type cannot be empty');
			if(jsonDeserializedData.start_date !== undefined && jsonDeserializedData.start_date !== null && jsonDeserializedData.start_date.trim() === '') throw new Error('Start Date cannot be empty');
			if(jsonDeserializedData.end_date !== undefined && jsonDeserializedData.end_date !== null && jsonDeserializedData.end_date.trim() === '') throw new Error('End Date cannot be empty');
			if(jsonDeserializedData.start_time !== undefined && jsonDeserializedData.start_time !== null && jsonDeserializedData.start_time.trim() === '') throw new Error('Start Time cannot be empty');
			if(jsonDeserializedData.end_time !== undefined && jsonDeserializedData.end_time !== null && jsonDeserializedData.end_time.trim() === '') throw new Error('End Time cannot be empty');

			// Check if Holiday with same date exists
			if(jsonDeserializedData.type === 'holiday') {
				const newStartDate = new Date(jsonDeserializedData.start_date);
				const dbSrvc = this.$dependencies.DatabaseService;
				const holidayList = await dbSrvc.knex.raw('SELECT start_date FROM tenant_plant_schedules WHERE tenant_id = ? AND type = ? AND NOT id = ?', [ctxt.state.tenant.tenant_id, 'holiday', ctxt.params.plant_unit_schedule_id]);
				holidayList.rows.forEach((holiday) => {
					if(holiday.start_date.getDate() === newStartDate.getDate() && holiday.start_date.getMonth() === newStartDate.getMonth() && holiday.start_date.getFullYear() === newStartDate.getFullYear())
						throw new Error('Holiday with this date already exists');
				});
			}

			const savedRecord = await this.$TenantPlantUnitScheduleModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			this.$dependencies.PubsubService.publish('plantworks-realtime-push', 'SCHEDULE.UPDATE', safeJsonStringify({
				'action': 'update'
			}));

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitSchedule`, err);
		}
	}

	async _deleteTenantPlantUnitSchedule(ctxt) {
		try {
			const tenantPlantUnitSchedule = await new this.$TenantPlantUnitScheduleModel({
				'id': ctxt.params['plant_unit_schedule_id'],
				'tenant_id': ctxt.state.tenant['tenant_id']
			})
			.fetch();

			if(!tenantPlantUnitSchedule) throw new Error('Unknown Tenant Plant Unit Schedule');

			await tenantPlantUnitSchedule.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deletetenantPlantUnitSchedule`, err);
		}
	}

	async _getTenantPlantUnitScheduleExtension(ctxt) {
		try {
			let plantUnitScheduleExtensionData = await this.$TenantPlantUnitScheduleExtensionModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_schedule_extension_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'shift', 'tenantPlantUnit']
			});

			plantUnitScheduleExtensionData = this._convertToJsonApiFormat(plantUnitScheduleExtensionData, 'manufacturing/plant-unit-schedule-extension', {
				'tenant': 'settings/account/basics/tenant',
				'shift': 'manufacturing/plant-unit-schedule',
				'tenantPlantUnit': 'manufacturing/plant-unit'
			});

			return plantUnitScheduleExtensionData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitScheduleExtension`, err);
		}
	}

	async _addTenantPlantUnitScheduleExtension(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$TenantPlantUnitScheduleExtensionModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitScheduleExtension`, err);
		}
	}

	async _updateTenantPlantUnitScheduleExtension(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$TenantPlantUnitScheduleExtensionModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitScheduleExtension`, err);
		}
	}

	async _deleteTenantPlantUnitScheduleExtension(ctxt) {
		try {
			const tenantPlantUnitScheduleExtension = await new this.$TenantPlantUnitScheduleExtensionModel({
				'id': ctxt.params['plant_unit_schedule_extension_id'],
				'tenant_id': ctxt.state.tenant['tenant_id']
			})
			.fetch();

			if(!tenantPlantUnitScheduleExtension) throw new Error('Unknown Tenant Plant Unit Schedule Extension');

			await tenantPlantUnitScheduleExtension.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitScheduleExtension`, err);
		}
	}

	async _getTenantPlantUnitDriver(ctxt) {
		try {
			let plantUnitDriverData = await this.$TenantPlantUnitDriverModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_driver_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnit', 'gateway', 'machines']
			});

			plantUnitDriverData = this._convertToJsonApiFormat(plantUnitDriverData, 'manufacturing/plant-unit-driver', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnit': 'manufacturing/plant-unit',
				'gateway': 'masterdata/gateway-master',
				'machines': 'manufacturing/plant-unit-machine'
			});

			delete plantUnitDriverData.included;
			return plantUnitDriverData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitDriver`, err);
		}
	}

	async _addTenantPlantUnitDriver(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');
			const savedRecord = await this.$TenantPlantUnitDriverModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitDriver`, err);
		}
	}

	async _updateTenantPlantUnitDriver(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');
			const savedRecord = await this.$TenantPlantUnitDriverModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitDriver`, err);
		}
	}

	async _deleteTenantPlantUnitDriver(ctxt) {
		try {
			const tenantPlantUnitDriver = await this.$TenantPlantUnitDriverModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_driver_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantPlantUnitDriver) throw new Error('Unknown Tenant Plant Unit Driver');
			await tenantPlantUnitDriver.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitDriver`, err);
		}
	}

	async _getTenantPlantUnitMachine(ctxt) {
		try {
			const downtimeQuery = {
				'downtimes': function(qb) {
					qb
					.where('metadata', '{}')
					.andWhere('type', 'downtime')
					.orderBy('start_time', 'ASC');
				}
			};

			const approvedDowntimeQuery = {
				'approvedDowntimes': function(qb) {
					qb
					.where('metadata', '@>', '{"submited":true, "approved":false}')
					.andWhere('type', 'downtime');
				}
			};

			let plantUnitMachineData = await this.$TenantPlantUnitMachineModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnit', 'machine', 'plc', 'tenantPlantUnitDriver', 'hardwareProtocol', 'communicationProtocol', 'attributeSets', 'processors', downtimeQuery, approvedDowntimeQuery, 'templates', 'linkedStations', 'operatorList', 'downtimeList', 'speedDeviationList', 'schedules', 'attachedForms', 'dataPointAggregations', {'events': function(query) { query.whereRaw('event_timestamp > ?', moment().subtract(30, 'days').format()); }}]
			});

			plantUnitMachineData = this._convertToJsonApiFormat(plantUnitMachineData, 'manufacturing/plant-unit-machine', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnit': 'manufacturing/plant-unit',
				'machine': 'masterdata/machine-master',
				'plc': 'masterdata/plc-master',
				'tenantPlantUnitDriver': 'manufacturing/plant-unit-driver',
				'hardwareProtocol': 'masterdata/hardware-protocol-master',
				'communicationProtocol': 'masterdata/communication-protocol-master',
				'attributeSets': 'manufacturing/plant-unit-machine-attribute-set',
				'processors': 'manufacturing/plant-unit-machine-processor',
				'downtimes': 'manufacturing/plant-unit-machine-downtime',
				'approvedDowntimes': 'manufacturing/plant-unit-machine-approved-downtime',
				'templates': 'manufacturing/plant-unit-machine-template',
				'linkedStations': 'manufacturing/plant-unit-station-observed-machine',
				'operatorList': 'emd/configuration',
				'downtimeList': 'emd/configuration',
				'speedDeviationList': 'emd/configuration',
				'schedules': 'manufacturing/plant-unit-machine-schedule',
				'attachedForms': 'manufacturing/plant-unit-machine-attached-form',
				'dataPointAggregations': 'manufacturing/plant-unit-machine-aggregate',
				'events': 'manufacturing/plant-unit-machine-events'
			});

			return plantUnitMachineData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitMachine`, err);
		}
	}

	async _addTenantPlantUnitMachine(ctxt) {
		try {
			const pubsubService = this.$dependencies.PubsubService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantPlantUnitMachineModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const schemaChangePayload = safeJsonStringify({
				'id': savedRecord.get('id'),
				'sub_domain': ctxt.state.tenant['sub_domain'],
				'tenant_id': ctxt.state.tenant['tenant_id'],
				'type': 'machine'
			});

			await pubsubService.publish('plantworks-data-stream', 'SCHEMA.UPDATE', schemaChangePayload);
			await pubsubService.publish('plantworks-realtime-push', 'BACKLOG.TASK.UPDATE', schemaChangePayload);

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitMachine`, err);
		}
	}

	async _updateTenantPlantUnitMachine(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const cachedPlantUnitMachineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['id'], 'machine']);

			const savedRecord = await this.$TenantPlantUnitMachineModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			cachedPlantUnitMachineArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['id'], 'machine', ctxt.state.tenant['tenant_id']]);

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitMachine`, err);
		}
	}

	async _deleteTenantPlantUnitMachine(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const tenantPlantUnitMachine = await this.$TenantPlantUnitMachineModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantPlantUnitMachine) throw new Error('Unknown Tenant Plant Unit Machine');

			const cachedPlantUnitMachineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [ctxt.params['plant_unit_machine_id'], 'machine']);

			await tenantPlantUnitMachine.destroy();

			cachedPlantUnitMachineArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitMachine`, err);
		}
	}

	async _getTenantPlantUnitMachineAttributeSet(ctxt) {
		try {
			let machineAttributeSetData = await this.$MachineAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantAttributeSet', 'tenantPlantUnitMachine']
			});

			machineAttributeSetData = this._convertToJsonApiFormat(machineAttributeSetData, 'manufacturing/plant-unit-machine-attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'tenantAttributeSet': 'manufacturing/attribute-set',
				'tenantPlantUnitMachine': 'manufacturing/plant-unit-machine'
			});

			return machineAttributeSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitMachineAttributeSet`, err);
		}
	}

	async _addTenantPlantUnitMachineAttributeSet(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedPlantUnitMachineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_plant_unit_machine_id'], 'machine']);

			const savedRecord = await this.$MachineAttributeSetModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			cachedPlantUnitMachineArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_plant_unit_machine_id'], 'machine', jsonDeserializedData['tenant_id']]);

			await cacheMulti.execAsync();
			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitMachineAttributeSet`, err);
		}
	}

	async _updateTenantPlantUnitMachineAttributeSet(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedPlantUnitMachineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_plant_unit_machine_id'], 'machine']);

			const savedRecord = await this.$MachineAttributeSetModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_plant_unit_machine_id'], 'machine', jsonDeserializedData['tenant_id']]);

			cachedPlantUnitMachineArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();
			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitMachineAttributeSet`, err);
		}
	}

	async _deleteTenantPlantUnitMachineAttributeSet(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;

			const machineAttributeSet = await this.$MachineAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!machineAttributeSet) throw new Error('Unknown Tenant Plant Unit Machine Attribute Set');

			const machineId = machineAttributeSet.get('tenant_plant_unit_machine_id');

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedPlantUnitMachineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [machineId, 'machine']);

			await machineAttributeSet.destroy();

			cachedPlantUnitMachineArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [machineId, 'machine', ctxt.state.tenant['tenant_id']]);

			await cacheMulti.execAsync();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitMachineAttributeSet`, err);
		}
	}

	async _getTenantPlantUnitMachineProcessor(ctxt) {
		try {
			let machineProcessorData = await this.$MachineProcessorModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_processor_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitMachine']
			});

			machineProcessorData = this._convertToJsonApiFormat(machineProcessorData, 'manufacturing/plant-unit-machine-processor', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitMachine': 'manufacturing/plant-unit-machine'
			});

			return machineProcessorData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitMachineProcessor`, err);
		}
	}

	async _addTenantPlantUnitMachineProcessor(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(!jsonDeserializedData['processor']) jsonDeserializedData['processor'] = '';

			const savedRecord = await this.$MachineProcessorModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitMachineProcessor`, err);
		}
	}

	async _updateTenantPlantUnitMachineProcessor(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;

			const cacheMulti = this.$dependencies.CacheService.multi();
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$MachineProcessorModel
			.query(function(qb) {
				qb.where({'id': jsonDeserializedData.id});
			}).fetch();

			const oldPublishStatus = oldRecord['attributes']['publish_status'];

			// eslint-disable-next-line curly
			if(oldPublishStatus && !newPublishStatus) {
				throw new Error('Published Processor Record cannot be unpublished');
			}

			// 1. update effectivity stop of the current effective processor
			// 2. set effectivity start of the newly published processor

			// if a previously unpublished processor is being published:
			let updateEffectivity;

			if(!oldPublishStatus && newPublishStatus) {
				const now = moment();
				updateEffectivity = await dbSrvc.knex.raw('UPDATE tenant_plant_unit_machine_processors SET effectivity_end = ? WHERE tenant_id = ? AND tenant_plant_unit_machine_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL AND publish_status = ? RETURNING id,publish_status', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_plant_unit_machine_id, true]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$MachineProcessorModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});


			// 3. Update Rendered Processor
			const evaluatorFactory = require('evaluator-factory');

			// 4. On Publishing a New processor, generate and store rendered processor and delete cached artifacts
			if(!oldPublishStatus && newPublishStatus) {
				try {
					const renderedEvaluator = await evaluatorFactory.renderEvaluatorString({
						'id': savedRecord.get('tenant_plant_unit_machine_id'),
						'type': 'machine',
						'database': dbSrvc
					});

					await dbSrvc.knex.raw(`UPDATE tenant_plant_unit_machine_processors SET processor = ? WHERE id = ?`, [renderedEvaluator, savedRecord.get('id')]);
				}
				catch(err) {
					jsonDeserializedData['publish_status'] = false;
					await this.$MachineProcessorModel
						.forge()
						.save(jsonDeserializedData, {
							'method': 'update',
							'patch': true
						});

					await dbSrvc.knex.raw('UPDATE tenant_plant_unit_machine_processors SET effectivity_end = null WHERE id = ?', [updateEffectivity.rows[0]['id']]);

					throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitMachineProcessor`, err);
				}

				const cachedPlantUnitMachineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [savedRecord.get('tenant_plant_unit_machine_id'), 'machine']);

				cachedPlantUnitMachineArtifacts.shift().forEach((cachedArtifact) => {
					cacheMulti.delAsync(cachedArtifact);
				});

				await cacheMulti.execAsync();
			}

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitMachineProcessor`, err);
		}
	}

	async _getTenantPlantUnitMachineDowntime(ctxt) {
		try {
			let machineDowntimeData = await this.$MachineDowntimeModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_downtime_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitMachine', 'reasons']
			});

			machineDowntimeData = this._convertToJsonApiFormat(machineDowntimeData, 'manufacturing/plant-unit-machine-downtime', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitMachine': 'manufacturing/plant-unit-machine',
				'reasons': 'manufacturing/plant-unit-machine-downtime-reason'
			});

			return machineDowntimeData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitMachineDowntime`, err);
		}
	}

	async _getTenantPlantUnitMachineApprovedDowntime(ctxt) {
		try {
			let machineDowntimeData = await this.$MachineApprovedDowntimeModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_downtime_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitMachine', 'reasons']
			});

			machineDowntimeData = this._convertToJsonApiFormat(machineDowntimeData, 'manufacturing/plant-unit-machine-approved-downtime', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitMachine': 'manufacturing/plant-unit-machine',
				'reasons': 'manufacturing/plant-unit-machine-approved-downtime-reason'
			});

			return machineDowntimeData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitMachineApprovedDowntime`, err);
		}
	}

	async _getTenantPlantUnitMachineSetuptime(ctxt) {
		try {
			let machineSetuptimeData = await this.$MachineSetuptimeModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_setuptime_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitMachine', 'reasons']
			});

			machineSetuptimeData = this._convertToJsonApiFormat(machineSetuptimeData, 'manufacturing/plant-unit-machine-setuptime', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitMachine': 'manufacturing/plant-unit-machine',
				'reasons': 'manufacturing/plant-unit-machine-setuptime-reason'
			});

			return machineSetuptimeData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitMachineSetuptime`, err);
		}
	}

	async _getTenantPlantUnitMachineIdletime(ctxt) {
		try {
			let machineIdletimeData = await this.$MachineIdletimeModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_idletime_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitMachine', 'reasons']
			});

			machineIdletimeData = this._convertToJsonApiFormat(machineIdletimeData, 'manufacturing/plant-unit-machine-idletime', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitMachine': 'manufacturing/plant-unit-machine',
				'reasons': 'manufacturing/plant-unit-machine-idletime-reason'
			});

			return machineIdletimeData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitMachineIdletime`, err);
		}
	}

	async _getTenantPlantUnitMachineConnectionDetails(ctxt) {
		try {
			const machineId = ctxt.params.plant_unit_machine_id;
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheSrvc = this.$dependencies.CacheService;

			const tenantData = await dbSrvc.knex.raw(`select tenant_id from tenant_plant_unit_machines where id = ? `, [machineId]);
			const tenantId = tenantData.rows[0].tenant_id;

			const locationData = await dbSrvc.knex.raw(`select timezone_id from tenant_locations where tenant_id = ?`, [tenantId]);
			const locationTz = locationData.rows[0].timezone_id;

			const cacheData = await cacheSrvc.getAsync(`machine!keepalive!${machineId}`);
			let result;
			if(!cacheData) {
				const lastStopTime = await cacheSrvc.getAsync(`shadowkey!machine!keepalive!${machineId}`);
				const connectionData = {};

				if(lastStopTime) {
					connectionData['start_time'] = moment(Number(lastStopTime)).tz(locationTz).format('DD/MMM/YYYY hh:mm A');
					connectionData['end_time'] = null;
					result = connectionData;
				}
			}
			else {
				const connectionData = await dbSrvc.knex.raw(`select * from tenant_plant_unit_machine_downtimes where tenant_plant_unit_machine_id = ? and type = 'no_data' order by start_time desc limit 2`, [machineId]);

				if(!connectionData.rows)
					result = null;
				else
					result = connectionData.rows[1];
			}

			return result;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitMachineConnectionDetails`, err);
		}
	}

	async _getTenantPlantUnitMachineDowntimeReason(ctxt) {
		try {
			let plantUnitMachineDowntimeReasonData = await this.$MachineDowntimeReasonModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_downtime_reason_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitMachineDowntime']
			});

			plantUnitMachineDowntimeReasonData = this._convertToJsonApiFormat(plantUnitMachineDowntimeReasonData, 'manufacturing/plant-unit-machine-downtime-reason', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitMachineDowntime': 'manufacturing/plant-unit-machine-downtime'
			});

			return plantUnitMachineDowntimeReasonData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitMachineDowntimeReason`, err);
		}
	}

	async _getTenantPlantUnitMachineApprovedDowntimeReason(ctxt) {
		try {
			let plantUnitMachineDowntimeReasonData = await this.$MachineApprovedDowntimeReasonModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_downtime_reason_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitMachineApprovedDowntime']
			});

			plantUnitMachineDowntimeReasonData = this._convertToJsonApiFormat(plantUnitMachineDowntimeReasonData, 'manufacturing/plant-unit-machine-approved-downtime-reason', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitMachineApprovedDowntime': 'manufacturing/plant-unit-machine-approved-downtime'
			});

			return plantUnitMachineDowntimeReasonData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitMachineApprovedDowntimeReason`, err);
		}
	}

	async _addTenantPlantUnitMachineDowntimeReason(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const downData = await dbSrvc.knex.raw('SELECT start_time, end_time FROM tenant_plant_unit_machine_downtimes WHERE id = ?;', [jsonDeserializedData['tenant_plant_unit_machine_downtime_id']]);
			const downTime = downData.rows[0];
			if(downTime.end_time === null || downTime.end_time === undefined)
				downTime['end_time'] = moment().format();

			const actualTime = moment(downTime.end_time).startOf('minute').diff(moment(downTime.start_time).startOf('minute'), 'minutes');

			const enteredReason = await dbSrvc.knex.raw(`SELECT SUM(reason_duration_in_min) AS ttlreason FROM tenant_plant_unit_machine_downtime_reasons WHERE tenant_plant_unit_machine_downtime_id = ?;`, [jsonDeserializedData['tenant_plant_unit_machine_downtime_id']]);
			const enteredDuration = enteredReason.rows[0].ttlreason;

			if(actualTime - enteredDuration < jsonDeserializedData.reason_duration_in_min)
				throw new Error('reason duration cannot be more than unaccounted downtime');

			const savedRecord = await this.$MachineDowntimeReasonModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitMachineDowntimeReason`, err);
		}
	}

	async _addTenantPlantUnitMachineApprovedDowntimeReason(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			jsonDeserializedData['tenant_plant_unit_machine_downtime_id'] = jsonDeserializedData['tenant_plant_unit_machine_approved_downtime_id'];
			delete jsonDeserializedData['tenant_plant_unit_machine_approved_downtime_id'];

			const downData = await dbSrvc.knex.raw('SELECT start_time, end_time FROM tenant_plant_unit_machine_downtimes WHERE id = ?;', [jsonDeserializedData['tenant_plant_unit_machine_downtime_id']]);
			const downTime = downData.rows[0];
			if(downTime.end_time === null || downTime.end_time === undefined)
				downTime['end_time'] = moment().format();

			const actualTime = moment(downTime.end_time).startOf('minute').diff(moment(downTime.start_time).startOf('minute'), 'minutes');

			const enteredReason = await dbSrvc.knex.raw(`SELECT SUM(reason_duration_in_min) AS ttlreason FROM tenant_plant_unit_machine_downtime_reasons WHERE tenant_plant_unit_machine_downtime_id = ?;`, [jsonDeserializedData['tenant_plant_unit_machine_downtime_id']]);
			const enteredDuration = enteredReason.rows[0].ttlreason;

			if(actualTime - enteredDuration < jsonDeserializedData.reason_duration_in_min)
				throw new Error('reason duration cannot be more than unaccounted approved downtime');


			const savedRecord = await this.$MachineApprovedDowntimeReasonModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitMachineApprovedDowntimeReason`, err);
		}
	}

	async _updateTenantPlantUnitMachineDowntimeReason(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const downData = await dbSrvc.knex.raw('SELECT start_time, end_time FROM tenant_plant_unit_machine_downtimes WHERE id = ?', [jsonDeserializedData.tenant_plant_unit_machine_downtime_id]);
			const downTime = downData.rows[0];
			if(downTime.end_time === null || downTime.end_time === undefined)
				downTime['end_time'] = moment().format();

			const actualTime = moment(downTime.end_time).startOf('minute').diff(moment(downTime.start_time).startOf('minute'), 'minutes');

			const enteredReason = await dbSrvc.knex.raw('SELECT SUM(reason_duration_in_min) AS ttlreason FROM tenant_plant_unit_machine_downtime_reasons WHERE tenant_plant_unit_machine_downtime_id = ?', [jsonDeserializedData.tenant_plant_unit_machine_downtime_id]);
			let enteredDuration = enteredReason.rows[0].ttlreason;

			const enteredOldReason = await dbSrvc.knex.raw('SELECT reason_duration_in_min AS oldreason FROM tenant_plant_unit_machine_downtime_reasons WHERE id = ?', [jsonDeserializedData.id]);
			const enteredOldDuration = enteredOldReason.rows[0].oldreason;

			enteredDuration = Number(enteredDuration) - Number(enteredOldDuration);

			if(actualTime - enteredDuration < jsonDeserializedData.reason_duration_in_min)
				throw new Error('reason duration cannot be more than unaccounted downtime');

			const savedRecord = await this.$MachineDowntimeReasonModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitMachineDowntimeReason`, err);
		}
	}

	async _updateTenantPlantUnitMachineApprovedDowntimeReason(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			jsonDeserializedData['tenant_plant_unit_machine_downtime_id'] = jsonDeserializedData['tenant_plant_unit_machine_approved_downtime_id'];
			delete jsonDeserializedData['tenant_plant_unit_machine_approved_downtime_id'];

			const downData = await dbSrvc.knex.raw('SELECT start_time, end_time FROM tenant_plant_unit_machine_downtimes WHERE id = ?', [jsonDeserializedData.tenant_plant_unit_machine_downtime_id]);
			const downTime = downData.rows[0];
			if(downTime.end_time === null || downTime.end_time === undefined)
				downTime['end_time'] = moment().format();

			const actualTime = moment(downTime.end_time).startOf('minute').diff(moment(downTime.start_time).startOf('minute'), 'minutes');

			const enteredReason = await dbSrvc.knex.raw('SELECT SUM(reason_duration_in_min) AS ttlreason FROM tenant_plant_unit_machine_downtime_reasons WHERE tenant_plant_unit_machine_downtime_id = ?', [jsonDeserializedData.tenant_plant_unit_machine_downtime_id]);
			let enteredDuration = enteredReason.rows[0].ttlreason;

			const enteredOldReason = await dbSrvc.knex.raw('SELECT reason_duration_in_min AS oldreason FROM tenant_plant_unit_machine_downtime_reasons WHERE id = ?', [jsonDeserializedData.id]);
			const enteredOldDuration = enteredOldReason.rows[0].oldreason;

			enteredDuration = Number(enteredDuration) - Number(enteredOldDuration);

			if(actualTime - enteredDuration < jsonDeserializedData.reason_duration_in_min)
				throw new Error('reason duration cannot be more than unaccounted approved downtime');

			const savedRecord = await this.$MachineApprovedDowntimeReasonModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitMachineApprovedDowntimeReason`, err);
		}
	}

	async _deleteTenantPlantUnitMachineDowntimeReason(ctxt) {
		try {
			const tenantPlantUnitMachineDowntimeReason = await this.$MachineDowntimeReasonModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_downtime_reason_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantPlantUnitMachineDowntimeReason) throw new Error('Unknown Tenant Plant Unit Machine Downtime Reason');
			await tenantPlantUnitMachineDowntimeReason.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitMachineDowntimeReason`, err);
		}
	}

	async _deleteTenantPlantUnitMachineApprovedDowntimeReason(ctxt) {
		try {
			const tenantPlantUnitMachineDowntimeReason = await this.$MachineApprovedDowntimeReasonModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_downtime_reason_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantPlantUnitMachineDowntimeReason) throw new Error('Unknown Tenant Plant Unit Machine Approved Downtime Reason');
			await tenantPlantUnitMachineDowntimeReason.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitMachineApprovedDowntimeReason`, err);
		}
	}

	async _getTenantPlantUnitMachineSetuptimeReason(ctxt) {
		try {
			let plantUnitMachineSetuptimeReasonData = await this.$MachineSetuptimeReasonModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_setuptime_reason_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitMachineSetuptime']
			});

			plantUnitMachineSetuptimeReasonData = this._convertToJsonApiFormat(plantUnitMachineSetuptimeReasonData, 'manufacturing/plant-unit-machine-setuptime-reason', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitMachineSetuptime': 'manufacturing/plant-unit-machine-setuptime'
			});

			return plantUnitMachineSetuptimeReasonData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitMachineSetuptimeReason`, err);
		}
	}

	async _addTenantPlantUnitMachineSetuptimeReason(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const setupData = await dbSrvc.knex.raw(`select start_time, end_time from tenant_plant_unit_machine_setuptimes where id = ?`, jsonDeserializedData.tenant_plant_unit_machine_setuptime_id);

			const setupTime = setupData.rows[0];
			if(setupTime.end_time === null || setupTime.end_time === undefined)
				setupTime['end_time'] = moment().format();

			const actualTime = moment(setupTime.end_time).startOf('minute').diff(moment(setupTime.start_time).startOf('minute'), 'minutes');

			const enteredReason = await dbSrvc.knex.raw(`select SUM(reason_duration_in_min) as ttlReason from tenant_plant_unit_machine_setuptime_reasons where tenant_plant_unit_machine_setuptime_id = ?`, [jsonDeserializedData.tenant_plant_unit_machine_setuptime_id]);

			const enteredDuration = enteredReason.rows[0].ttlreason;

			if(actualTime - enteredDuration < jsonDeserializedData.reason_duration_in_min)
				throw new Error('reason duration cannot be more than unaccounted setuptime');

			const savedRecord = await this.$MachineSetuptimeReasonModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitMachineSetuptimeReason`, err);
		}
	}

	async _updateTenantPlantUnitMachineSetuptimeReason(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const setupData = await dbSrvc.knex.raw('SELECT start_time, end_time FROM tenant_plant_unit_machine_setuptimes WHERE id = ?', [jsonDeserializedData.tenant_plant_unit_machine_setuptime_id]);
			const setupTime = setupData.rows[0];
			if(setupTime.end_time === null || setupTime.end_time === undefined)
				setupTime['end_time'] = moment().format();

			const actualTime = moment(setupTime.end_time).startOf('minute').diff(moment(setupTime.start_time).startOf('minute'), 'minutes');

			const enteredReason = await dbSrvc.knex.raw('SELECT SUM(reason_duration_in_min) AS ttlreason FROM tenant_plant_unit_machine_setuptime_reasons WHERE tenant_plant_unit_machine_setuptime_id = ?', [jsonDeserializedData.tenant_plant_unit_machine_setuptime_id]);
			let enteredDuration = enteredReason.rows[0].ttlreason;

			const enteredOldReason = await dbSrvc.knex.raw('SELECT reason_duration_in_min AS oldreason FROM tenant_plant_unit_machine_setuptime_reasons WHERE id = ?', [jsonDeserializedData.id]);
			const enteredOldDuration = enteredOldReason.rows[0].oldreason;

			enteredDuration = Number(enteredDuration) - Number(enteredOldDuration);
			if(actualTime - enteredDuration < jsonDeserializedData.reason_duration_in_min)
				throw new Error('reason duration cannot be more than unaccounted setuptime');

			const savedRecord = await this.$MachineSetuptimeReasonModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitMachineSetuptimeReason`, err);
		}
	}

	async _deleteTenantPlantUnitMachineSetuptimeReason(ctxt) {
		try {
			const tenantPlantUnitMachineSetuptimeReason = await this.$MachineSetuptimeReasonModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_setuptime_reason_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantPlantUnitMachineSetuptimeReason) throw new Error('Unknown Tenant Plant Unit Machine Setuptime Reason');
			await tenantPlantUnitMachineSetuptimeReason.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitMachineSetuptimeReason`, err);
		}
	}

	async _getTenantPlantUnitMachineIdletimeReason(ctxt) {
		try {
			let plantUnitMachineIdletimeReasonData = await this.$MachineIdletimeReasonModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_idletime_reason_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitMachineIdletime']
			});

			plantUnitMachineIdletimeReasonData = this._convertToJsonApiFormat(plantUnitMachineIdletimeReasonData, 'manufacturing/plant-unit-machine-idletime-reason', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitMachineIdletime': 'manufacturing/plant-unit-machine-idletime'
			});

			return plantUnitMachineIdletimeReasonData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitMachineIdletimeReason`, err);
		}
	}

	async _addTenantPlantUnitMachineIdletimeReason(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const idleData = await dbSrvc.knex.raw('SELECT start_time, end_time FROM tenant_plant_unit_machine_idletimes WHERE id = ?', [jsonDeserializedData.tenant_plant_unit_machine_idletime_id]);
			const idleTime = idleData.rows[0];
			if(idleTime.end_time === null || idleTime.end_time === undefined)
				idleTime['end_time'] = moment().format();

			const actualTime = moment(idleTime.end_time).startOf('minute').diff(moment(idleTime.start_time).startOf('minute'), 'minutes');

			const enteredReason = await dbSrvc.knex.raw('SELECT SUM(reason_duration_in_min) AS ttlreason FROM tenant_plant_unit_machine_idletime_reasons WHERE tenant_plant_unit_machine_idletime_id = ?', [jsonDeserializedData.tenant_plant_unit_machine_idletime_id]);
			const enteredDuration = enteredReason.rows[0].ttlreason;

			if(actualTime - enteredDuration < jsonDeserializedData.reason_duration_in_min)
				throw new Error('reason duration cannot be more than unaccounted idletime');

			const savedRecord = await this.$MachineIdletimeReasonModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitMachineIdletimeReason`, err);
		}
	}

	async _updateTenantPlantUnitMachineIdletimeReason(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const idleData = await dbSrvc.knex.raw('SELECT start_time, end_time FROM tenant_plant_unit_machine_idletimes WHERE id = ?', [jsonDeserializedData.tenant_plant_unit_machine_idletime_id]);
			const idleTime = idleData.rows[0];

			if(idleTime.end_time === null || idleTime.end_time === undefined)
				idleTime['end_time'] = moment().format();

			const actualTime = moment(idleTime.end_time).startOf('minute').diff(moment(idleTime.start_time).startOf('minute'), 'minutes');

			const enteredReason = await dbSrvc.knex.raw('SELECT SUM(reason_duration_in_min) AS ttlreason FROM tenant_plant_unit_machine_idletime_reasons WHERE tenant_plant_unit_machine_idletime_id = ?', [jsonDeserializedData.tenant_plant_unit_machine_idletime_id]);
			let enteredDuration = enteredReason.rows[0].ttlreason;

			const enteredOldReason = await dbSrvc.knex.raw('SELECT reason_duration_in_min AS oldreason FROM tenant_plant_unit_machine_idletime_reasons WHERE id = ?', [jsonDeserializedData.id]);
			const enteredOldDuration = enteredOldReason.rows[0].oldreason;

			enteredDuration = Number(enteredDuration) - Number(enteredOldDuration);
			if(actualTime - enteredDuration < jsonDeserializedData.reason_duration_in_min)
				throw new Error('reason duration cannot be more than unaccounted idletime');

			const savedRecord = await this.$MachineIdletimeReasonModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitMachineIdletimeReason`, err);
		}
	}

	async _deleteTenantPlantUnitMachineIdletimeReason(ctxt) {
		try {
			const tenantPlantUnitMachineIdletimeReason = await this.$MachineIdletimeReasonModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_idletime_reason_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantPlantUnitMachineIdletimeReason) throw new Error('Unknown Tenant Plant Unit Machine Idletime Reason');
			await tenantPlantUnitMachineIdletimeReason.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitMachineIdletimeReason`, err);
		}
	}

	async _getTenantPlantUnitMachineTemplate(ctxt) {
		try {
			let machineTemplateData = await this.$MachineTemplateModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_template_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitMachine']
			});

			machineTemplateData = this._convertToJsonApiFormat(machineTemplateData, 'manufacturing/plant-unit-machine-template', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitMachine': 'manufacturing/plant-unit-machine'
			});

			return machineTemplateData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitMachineTemplate`, err);
		}
	}

	async _addTenantPlantUnitMachineTemplate(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$MachineTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitMachineTemplate`, err);
		}
	}

	async _updateTenantPlantUnitMachineTemplate(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const newPublishStatus = jsonDeserializedData.publish_status;
			const oldRecord = await this.$MachineTemplateModel
			.query(function(qb) {
				qb.where({'id': jsonDeserializedData.id});
			}).fetch();

			const oldPublishStatus = oldRecord['attributes']['publish_status'];

			// eslint-disable-next-line curly
			if(oldPublishStatus && !newPublishStatus) {
				throw new Error('Published Template Record cannot be unpublished');
			}

			// if a previously unpublished template is being published:
			// 1. update effectivity stop of the current effective template
			// 2. set effectivity start of the newly published template

			if(!oldPublishStatus && newPublishStatus) {
				const now = moment();
				await dbSrvc.knex.raw('UPDATE tenant_plant_unit_machine_templates SET effectivity_end = ? WHERE tenant_id = ? AND tenant_plant_unit_machine_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_plant_unit_machine_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$MachineTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitMachineTemplate`, err);
		}
	}

	async _getTenantPlantUnitMachineSchedule(ctxt) {
		try {
			let plantUnitMachineScheduleData = await this.$TenantPlantUnitMachineScheduleModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_schedule_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitMachine']
			});

			plantUnitMachineScheduleData = this._convertToJsonApiFormat(plantUnitMachineScheduleData, 'manufacturing/plant-unit-machine-schedule', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitMachine': 'manufacturing/plant-unit-machine'
			});

			return plantUnitMachineScheduleData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitMachineSchedule`, err);
		}
	}

	async _addTenantPlantUnitMachineSchedule(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.description !== undefined && jsonDeserializedData.description !== null && jsonDeserializedData.description.trim() === '') throw new Error('Description cannot be empty');
			if(jsonDeserializedData.type !== undefined && jsonDeserializedData.type !== null && jsonDeserializedData.type.trim() === '') throw new Error('Type cannot be empty');
			if(jsonDeserializedData.start_time !== undefined && jsonDeserializedData.start_time !== null && jsonDeserializedData.start_time.trim() === '') throw new Error('Start Time cannot be empty');
			if(jsonDeserializedData.end_time !== undefined && jsonDeserializedData.end_time !== null && jsonDeserializedData.end_time.trim() === '') throw new Error('End Time cannot be empty');

			const savedRecord = await this.$TenantPlantUnitMachineScheduleModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitMachineSchedule`, err);
		}
	}

	async _uploadTenantPlantUnitMachineSchedules(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const filePath = ctxt.request.files['files[]'].path;
			let formattedRows = [];
			// eslint-disable-next-line security/detect-non-literal-fs-filename
			const workBook = XLSX.readFile(filePath);

			const parsedSheets = workBook.SheetNames.map((sheetName) => {
				return XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]).map((row) => {
					const mappedRow = {};
					Object.keys(row).forEach((col) => {
						mappedRow[col.toUpperCase()] = row[col];
					});

					return mappedRow;
				});
			});
			parsedSheets.forEach(sheetData=>{
				formattedRows = formattedRows.concat(sheetData);
			});

			const plantUnitId = ctxt.query.plantUnitId;
			const scheduleType = ctxt.query.scheduleType;
			const tenantId = ctxt.state.tenant.tenant_id;

			// get machines for this unit
			const machineList = await dbSrvc.knex.raw('SELECT id, name FROM tenant_plant_unit_machines WHERE tenant_id = ? AND tenant_plant_unit_id= ?', [tenantId, plantUnitId]);
			const availableMachines = [];
			machineList.rows.forEach((machine) => {
				availableMachines.push(machine.name);
			});

			let attributes;
			let isDatesRequired = false;
			if(scheduleType === 'scheduled_downtime' || scheduleType === 'maintenance')
				isDatesRequired = true;

			if(isDatesRequired)
				attributes = ['MACHINE_NAME', 'TYPE', 'DESCRIPTION', 'START_TIME', 'END_TIME', 'START_DATE', 'END_DATE'];
			else
				attributes = ['MACHINE_NAME', 'TYPE', 'DESCRIPTION', 'START_TIME', 'END_TIME'];

			const validRows = [];
			for(let index = 0; index < formattedRows.length; index++) {
				const row = formattedRows[index];
				row.notes = [];
				row.status = 'OK';

				const MACHINE_NAME = row[attributes[0]];
				if(!MACHINE_NAME) {
					row.status = 'REJECTED';
					row.notes.push('MACHINE_NAME is required');
				}

				if(!availableMachines.includes(MACHINE_NAME)) {
					row.status = 'REJECTED';
					row.notes.push('Machine is not available for this unit');
				}

				const TYPE = row[attributes[1]];
				if(!TYPE) {
					row.status = 'REJECTED';
					row.notes.push('TYPE is required');
				}

				if(TYPE !== scheduleType) {
					row.status = 'REJECTED';
					row.notes.push(`TYPE should be ${scheduleType}`);
				}

				const DESCRIPTION = row[attributes[2]];
				if(!DESCRIPTION) {
					row.status = 'REJECTED';
					row.notes.push('DESCRIPTION is required');
				}

				const START_TIME = row[attributes[3]];
				if(!START_TIME) {
					row.status = 'REJECTED';
					row.notes.push('START_TIME is required');
				}

				const END_TIME = row[attributes[4]];
				if(!END_TIME) {
					row.status = 'REJECTED';
					row.notes.push('END_TIME is required');
				}

				let START_DATE = null;
				let END_DATE = null;

				if(isDatesRequired) {
					START_DATE = row[attributes[5]];
					if(!START_DATE) {
						row.status = 'REJECTED';
						row.notes.push('START_DATE is required');
					}

					END_DATE = row[attributes[6]];
					if(!END_DATE) {
						row.status = 'REJECTED';
						row.notes.push('END_DATE is required');
					}
				}

				let data = {};
				if(isDatesRequired)
					data = {MACHINE_NAME, TYPE, DESCRIPTION, START_TIME, END_TIME, START_DATE, END_DATE, 'status': row.status, 'notes': row.notes};
				else
					data = {MACHINE_NAME, TYPE, DESCRIPTION, START_TIME, END_TIME, 'status': row.status, 'notes': row.notes};

				validRows.push(data);

			}

			attributes.push('status');
			let finalResult = {};
			if(validRows.length > 0) { // eslint-disable-line curly
				finalResult = {
					'attributes': attributes,
					'rows': validRows
				};
			}

			return finalResult;

		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_uploadTenantPlantUnitMachineSchedules`, err);
		}
	}

	async _approveTenantPlantUnitMachineSchedules(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const approvedData = ctxt.request.body.rows;
			const plantUnitId = ctxt.query.plantUnitId;
			const tenantId = ctxt.state.tenant.tenant_id;

			for(let index = 0; index < approvedData.length; index++) {
				const element = approvedData[index];
				const machine = element.MACHINE_NAME;

				const machineResult = await dbSrvc.knex.raw('SELECT * FROM tenant_plant_unit_machines WHERE tenant_id = ? AND name = ? AND tenant_plant_unit_id = ?', [tenantId, machine, plantUnitId]);
				const machineId = machineResult.rows[0].id;

				const startDate = element.START_DATE || new Date();
				const endDate = element.END_DATE || new Date();

				await dbSrvc.knex.raw('INSERT INTO tenant_plant_unit_machine_schedules(tenant_id, tenant_plant_unit_machine_id, description, type, start_date, end_date, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [tenantId, machineId, element.DESCRIPTION, element.TYPE, startDate, endDate, element.START_TIME, element.END_TIME]);

			}

			return null;

		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_uploadTenantPlantUnitMachineSchedules`, err);
		}
	}

	async _updateTenantPlantUnitMachineSchedule(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.description !== undefined && jsonDeserializedData.description !== null && jsonDeserializedData.description.trim() === '') throw new Error('Description cannot be empty');
			if(jsonDeserializedData.type !== undefined && jsonDeserializedData.type !== null && jsonDeserializedData.type.trim() === '') throw new Error('Type cannot be empty');
			if(jsonDeserializedData.start_time !== undefined && jsonDeserializedData.start_time !== null && jsonDeserializedData.start_time.trim() === '') throw new Error('Start Time cannot be empty');
			if(jsonDeserializedData.end_time !== undefined && jsonDeserializedData.end_time !== null && jsonDeserializedData.end_time.trim() === '') throw new Error('End Time cannot be empty');

			const savedRecord = await this.$TenantPlantUnitMachineScheduleModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitMachineSchedule`, err);
		}
	}

	async _deleteTenantPlantUnitMachineSchedule(ctxt) {
		try {
			const tenantPlantUnitMachineSchedule = await new this.$TenantPlantUnitMachineScheduleModel({
				'id': ctxt.params['plant_unit_machine_schedule_id'],
				'tenant_id': ctxt.state.tenant['tenant_id']
			})
			.fetch();

			if(!tenantPlantUnitMachineSchedule) throw new Error('Unknown Tenant Plant Unit Machine Schedule');

			await tenantPlantUnitMachineSchedule.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deletetenantPlantUnitMachineSchedule`, err);
		}
	}

	async _getTenantPlantUnitMachineAttachedForm(ctxt) {
		try {
			let machineAttachedFormData = await this.$MachineAttachedFormModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_attached_form_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantOperatorForm', 'tenantPlantUnitMachine']
			});

			machineAttachedFormData = this._convertToJsonApiFormat(machineAttachedFormData, 'manufacturing/plant-unit-machine-attached-form', {
				'tenant': 'settings/account/basics/tenant',
				'tenantOperatorForm': 'operator-form/operator-form',
				'tenantPlantUnitMachine': 'manufacturing/plant-unit-machine'
			});

			return machineAttachedFormData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitMachineAttachedForm`, err);
		}
	}

	async _addTenantPlantUnitMachineAttachedForm(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$MachineAttachedFormModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitMachineAttachedForm`, err);
		}
	}

	async _deleteTenantPlantUnitMachineAttachedForm(ctxt) {
		try {
			const machineAttachedForm = await this.$MachineAttachedFormModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_attached_form_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!machineAttachedForm) throw new Error('Unknown Tenant Plant Unit Machine to Operator Form mapping');

			await machineAttachedForm.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitMachineAttachedForm`, err);
		}
	}

	async _getTenantPlantUnitMachineOperators(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const plantUnitMachine = await this.$TenantPlantUnitMachineModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id});
			})
			.fetch({
				'withRelated': ['operatorList']
			});

			if(!plantUnitMachine) throw new Error('Unknow Tenant Plant Unit Machine');

			const operatorListConfiguration = plantUnitMachine.related('operatorList');

			if(!operatorListConfiguration || !operatorListConfiguration.get('id'))
				return [];

			const masterData = await dbSrvc.knex.raw('SELECT masterdata_id, values FROM tenant_emd_data WHERE tenant_id = ? AND tenant_emd_configuration_id = ? AND active = ?', [
				ctxt.state.tenant['tenant_id'],
				operatorListConfiguration.get('id'),
				true
			]);

			if(!masterData || !masterData.rows || !masterData.rows.length)
				return [];

			const operatorList = masterData.rows.map((row) => {
				const masterDataValues = row.values;
				masterDataValues['masterdata_id'] = row['masterdata_id'];

				return masterDataValues;
			});

			// compute filter array
			let filters = plantUnitMachine.get('operator_list_filters');
			let compositeAttributeSetIds = await dbSrvc.knex.raw('SELECT tenant_attribute_set_id FROM tenant_emd_configuration_attribute_sets WHERE tenant_emd_configuration_id = ?', [operatorListConfiguration.get('id')]);

			compositeAttributeSetIds = compositeAttributeSetIds.rows.map((row) => {
				return row['tenant_attribute_set_id'];
			});

			const combinedAttributeSet = await this.combineAttributeSets(compositeAttributeSetIds);

			filters = filters.map((filter) => {
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

			// compute final filtered master data
			const filteredMasterArr = await this._filterMasterData(operatorList, filters);
			return filteredMasterArr;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitMachineOperators`, err);
		}
	}

	async _getTenantPlantUnitMachineAggregate(ctxt) {
		try {
			let tenantPlantUnitMachineAggregateData = await this.$TenantPlantUnitMachineAggregateModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_aggregate_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitMachine', 'evaluationExpression']
			});

			tenantPlantUnitMachineAggregateData = this._convertToJsonApiFormat(tenantPlantUnitMachineAggregateData, 'manufacturing/plant-unit-machine-aggregate', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitMachine': 'manufacturing/plant-unit-machine',
				'evaluationExpression': 'manufacturing/attribute-set-property'
			});

			return tenantPlantUnitMachineAggregateData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitMachineAggregate`, err);
		}
	}

	async _addTenantPlantUnitMachineAggregate(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');
			if(jsonDeserializedData.internal_tag !== undefined && jsonDeserializedData.internal_tag !== null && jsonDeserializedData.internal_tag.trim() === '') throw new Error('Tag cannot be empty');
			if(!jsonDeserializedData.evaluation_expression_id) throw new Error('Expression cannot be empty');

			jsonDeserializedData['evaluation_expression'] = jsonDeserializedData.evaluation_expression_id;
			delete jsonDeserializedData.evaluation_expression_id;

			const savedRecord = await this.$TenantPlantUnitMachineAggregateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitMachineAggregate`, err);
		}
	}

	async _updateTenantPlantUnitMachineAggregate(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');
			if(jsonDeserializedData.internal_tag !== undefined && jsonDeserializedData.internal_tag !== null && jsonDeserializedData.internal_tag.trim() === '') throw new Error('Tag cannot be empty');
			if(!jsonDeserializedData.evaluation_expression_id) throw new Error('Expression cannot be empty');

			jsonDeserializedData['evaluation_expression'] = jsonDeserializedData.evaluation_expression_id;
			delete jsonDeserializedData.evaluation_expression_id;

			const savedRecord = await this.$TenantPlantUnitMachineAggregateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitMachineAggregate`, err);
		}
	}

	async _deleteTenantPlantUnitMachineAggregate(ctxt) {
		try {

			const tenantPlantUnitMachineAggregate = await this.$TenantPlantUnitMachineAggregateModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_aggregate_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantPlantUnitMachineAggregate) throw new Error('Unknown Tenant Plant Unit Machine Aggregate');


			await tenantPlantUnitMachineAggregate.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitMachineAggregate`, err);
		}
	}

	async _getTenantPlantUnitMachineEvent(ctxt) {
		try {
			let machineEventData = await this.$TenantPlantUnitMachineEventModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_machine_event_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitMachine', 'eventType']
			});

			machineEventData = this._convertToJsonApiFormat(machineEventData, 'manufacturing/plant-unit-machine-event', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitMachine': 'manufacturing/plant-unit-machine',
				'eventType': 'masterdata/event-type'
			});

			return machineEventData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitMachineEvent`, err);
		}
	}

	async _addTenantPlantUnitMachineEvent(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheSrvc = this.$dependencies.CacheService;
			const pubsubService = this.$dependencies.PubsubService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			let eventType = await dbSrvc.knex.raw('SELECT * FROM event_types WHERE id = ?', jsonDeserializedData['event_type_id']);

			if(!eventType.rows || !eventType.rows.length)
				throw new Error('Invalid Event Type id');

			eventType = eventType.rows.shift();
			jsonDeserializedData['eventType'] = eventType;

			const eventMessage = {
				'type': eventType['tag'],
				'data': jsonDeserializedData
			};

			const now = moment();
			if(JSON.parse(eventMessage['data']['event_metadata']['previous_value']).masterdata_id === JSON.parse(eventMessage['data']['event_metadata']['value']).masterdata_id)
				throw new Error('the same operator name');

			if(now.diff(moment(eventMessage['data']['event_timestamp']), 'seconds') > 300)
				throw new Error('event timestamp older than 5 minutes');

			if(moment(eventMessage['data']['event_timestamp']).diff(now, 'seconds') > 300)
				throw new Error('event timestamp cannot be in the future');

			if(moment(eventMessage['data']['event_timestamp']).isAfter(now))
				eventMessage['data']['event_timestamp'] = now.format();

			// Check for duplicate event
			if(eventMessage.type === 'operator_change') {
				const latestEventCacheKey = `eventhandler!latest!${eventMessage.type}!${eventMessage.data.tenant_id}!${eventMessage.data.tenant_plant_unit_machine_id}`;
				let latestCachedEvent = await cacheSrvc.getAsync(latestEventCacheKey);
				if(latestCachedEvent) {
					latestCachedEvent = JSON.parse(latestCachedEvent);
					if(latestCachedEvent.masterdata_id === JSON.parse(eventMessage.data.event_metadata.value)['masterdata_id'])
						throw new Error('cannot create operator change event - duplicate event');
				}
			}

			await pubsubService.publish('plantworks-data-stream', 'EVENT.STREAM', safeJsonStringify(eventMessage));

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': jsonDeserializedData['id']
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitMachineEvent`, err);
		}
	}

	async _getAllTenantPlantUnitLines(ctxt) {
		try {
			let plantUnitLineData = await this.$TenantPlantUnitLineModel
			.query(function(qb) {
				qb.where({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetchAll({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnit', 'templates', 'attributeSets', 'constituents']
			});

			plantUnitLineData = this._convertToJsonApiFormat(plantUnitLineData, 'manufacturing/plant-unit-line', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnit': 'manufacturing/plant-unit',
				'templates': 'manufacturing/plant-unit-line-template',
				'attributeSets': 'manufacturing/plant-unit-line-attribute-set',
				'constituents': 'manufacturing/plant-unit-line-constituents'
			});

			return plantUnitLineData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllTenantPlantUnitLines`, err);
		}
	}

	async _getTenantPlantUnitLine(ctxt) {
		try {
			let plantUnitLineData = await this.$TenantPlantUnitLineModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_line_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnit', 'templates', 'processors', 'attributeSets', 'constituents', 'supervisorList', {'events': function(query) { return query.whereRaw('event_timestamp >= ?', moment().subtract(30, 'days').format()); }}, 'attachedForms', 'workOrderFormats', 'watchers']
			});

			plantUnitLineData = this._convertToJsonApiFormat(plantUnitLineData, 'manufacturing/plant-unit-line', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnit': 'manufacturing/plant-unit',
				'templates': 'manufacturing/plant-unit-line-template',
				'processors': 'manufacturing/plant-unit-line-processor',
				'attributeSets': 'manufacturing/plant-unit-line-attribute-set',
				'constituents': 'manufacturing/plant-unit-line-constituents',
				'supervisorList': 'emd/configuration',
				'events': 'manufacturing/plant-unit-line-event',
				'attachedForms': 'manufacturing/plant-unit-line-attached-form',
				'workOrderFormats': 'manufacturing/plant-unit-line-work-order-format',
				'watchers': 'manufacturing/plant-unit-line-watcher'
			});

			return plantUnitLineData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitLine`, err);
		}
	}

	async _addTenantPlantUnitLine(ctxt) {
		try {
			const pubsubService = this.$dependencies.PubsubService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');
			// jsonDeserializedData['attribute_set_metadata'] = safeJsonStringify(jsonDeserializedData['attribute_set_metadata']);

			const savedRecord = await this.$TenantPlantUnitLineModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const schemaChangePayload = safeJsonStringify({
				'id': savedRecord.get('id'),
				'sub_domain': ctxt.state.tenant['sub_domain'],
				'tenant_id': ctxt.state.tenant['tenant_id'],
				'type': 'line'
			});

			await pubsubService.publish('plantworks-data-stream', 'SCHEMA.UPDATE', schemaChangePayload);

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitLine`, err);
		}
	}

	async _updateTenantPlantUnitLine(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedPlantUnitLineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['id'], 'line']);

			const savedRecord = await this.$TenantPlantUnitLineModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			cachedPlantUnitLineArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['id'], 'line', ctxt.state.tenant['tenant_id']]);

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitLine`, err);
		}
	}

	async _deleteTenantPlantUnitLine(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const dbSrvc = this.$dependencies.DatabaseService;

			const tenantPlantUnitLine = await new this.$TenantPlantUnitLineModel({
				'id': ctxt.params['plant_unit_line_id'],
				'tenant_id': ctxt.state.tenant['tenant_id']
			})
			.fetch();

			if(!tenantPlantUnitLine) throw new Error('Unknown Tenant Plant Unit line');

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedPlantUnitLineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [ctxt.params['plant_unit_line_id'], 'line']);

			let cachedArtifacts = cachedPlantUnitLineArtifacts.shift();

			let lineConstituents = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_line_constituent_id AS id, constituent_type AS type FROM tenant_plant_unit_line_constituents WHERE tenant_plant_unit_line_id = ? AND (constituent_type = ? OR constituent_type = ?)`, [ctxt.params['plant_unit_line_id'], 'machine', 'line']);
			lineConstituents = lineConstituents.rows;
			const lineConstituentBlocks = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_line_constituent_id AS id FROM tenant_plant_unit_line_constituents WHERE tenant_plant_unit_line_id = ? AND (constituent_type = ? OR constituent_type = ?)`, [ctxt.params['plant_unit_line_id'], 'block_any', 'block_some']);

			for(let idx = 0; idx < lineConstituentBlocks.rows.length; idx++) {
				const lineConstituentBlock = lineConstituentBlocks.rows[idx];
				const blockEntities = await dbSrvc.knex.raw('SELECT entity_id AS id, entity_type as type FROM tenant_plant_unit_line_constituent_block_entities WHERE block_id = ?', [lineConstituentBlock.id]);
				lineConstituents = lineConstituents.concat(blockEntities.rows);
			}

			await tenantPlantUnitLine.destroy();

			for(let idx = 0; idx < lineConstituents.length; idx++) {
				const lineConstituent = lineConstituents[idx];
				const lineConstituentArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [lineConstituent.id, lineConstituent.type]);
				cachedArtifacts = cachedArtifacts.concat(lineConstituentArtifacts.shift());

				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [lineConstituent.id, lineConstituent.type, ctxt.state.tenant['tenant_id']]);
			}

			cachedPlantUnitLineArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deletetenantPlantUnitLine`, err);
		}
	}

	async _getTenantPlantUnitLineAttributeSet(ctxt) {
		try {
			let lineAttributeSetData = await this.$LineAttributeSetModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_line_attribute_set_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantAttributeSet', 'tenantPlantUnitLine']
			});

			lineAttributeSetData = this._convertToJsonApiFormat(lineAttributeSetData, 'manufacturing/plant-unit-line-attribute-set', {
				'tenant': 'settings/account/basics/tenant',
				'tenantAttributeSet': 'manufacturing/attribute-set',
				'tenantPlantUnitLine': 'manufacturing/plant-unit-line'
			});

			return lineAttributeSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitLineAttributeSet`, err);
		}
	}

	async _addTenantPlantUnitLineAttributeSet(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedPlantUnitLineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_plant_unit_line_id'], 'line']);

			const savedRecord = await this.$LineAttributeSetModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			cachedPlantUnitLineArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_plant_unit_line_id'], 'line', ctxt.state.tenant['tenant_id']]);

			await cacheMulti.execAsync();
			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitLineAttributeSet`, err);
		}
	}

	async _updateTenantPlantUnitLineAttributeSet(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedPlantUnitLineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_plant_unit_line_id'], 'line']);

			const savedRecord = await this.$LineAttributeSetModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			cachedPlantUnitLineArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_plant_unit_line_id'], 'line', ctxt.state.tenant['tenant_id']]);

			await cacheMulti.execAsync();
			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitLineAttributeSet`, err);
		}
	}

	async _deleteTenantPlantUnitLineAttributeSet(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const lineAttributeSet = await new this.$LineAttributeSetModel({
				'id': ctxt.params['plant_unit_line_attribute_set_id'],
				'tenant_id': ctxt.state.tenant['tenant_id']
			})
			.fetch();

			if(!lineAttributeSet) throw new Error('Unknown Tenant Plant Unit Line Attribute Set');

			const tenantPlantUnitLineId = lineAttributeSet.get('tenant_plant_unit_line_id');
			const cachedPlantUnitLineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [tenantPlantUnitLineId, 'line']);

			await lineAttributeSet.destroy();

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [tenantPlantUnitLineId, 'line', ctxt.state.tenant['tenant_id']]);

			cachedPlantUnitLineArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitLineAttributeSet`, err);
		}
	}

	async _getTenantPlantUnitLineConstituent(ctxt) {
		try {
			let lineConstituentData = await this.$LineConstituentModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_line_constituent_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitLine']
			});

			lineConstituentData = this._convertToJsonApiFormat(lineConstituentData, 'manufacturing/plant-unit-line-constituent', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitLine': 'manufacturing/plant-unit-line'
			});

			return lineConstituentData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitLineConstituent`, err);
		}
	}

	async _addTenantPlantUnitLineConstituent(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			// check for running work order
			const latestLineWorkOrderStatus = await this.getTenantPlantUnitLineCurrentWorkOrder(ctxt.state.tenant['tenant_id'], jsonDeserializedData['tenant_plant_unit_line_id']);
			if(latestLineWorkOrderStatus.length)
				throw new Error('Cannot add line constituent while work order is in progress');

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedPlantUnitLineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_plant_unit_line_id'], 'line']);
			let cachedArtifacts = cachedPlantUnitLineArtifacts.shift();

			const savedRecord = await this.$LineConstituentModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_plant_unit_line_id'], 'line', ctxt.state.tenant['tenant_id']]);

			const constituentId = jsonDeserializedData['tenant_plant_unit_line_constituent_id'];
			const constituentType = jsonDeserializedData['constituent_type'];

			let constituentsToUpdate;
			if(['line', 'machine'].includes(constituentType)) {
				constituentsToUpdate = [{
					'id': constituentId,
					'type': constituentType
				}];
			}
			else {
				const blockEntities = await dbSrvc.knex.raw('SELECT entity_id AS id, entity_type as type FROM tenant_plant_unit_line_constituent_block_entities WHERE block_id = ?', [constituentId]);
				constituentsToUpdate = blockEntities.rows;
			}

			for(let idx = 0; idx < constituentsToUpdate.length; idx++) {
				const constituent = constituentsToUpdate[idx];

				const constituentArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [constituent.id, constituent.type]);
				cachedArtifacts = cachedArtifacts.concat(constituentArtifacts.shift());

				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [constituent.id, constituent.type, ctxt.state.tenant['tenant_id']]);
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();
			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitLineConstituent`, err);
		}
	}

	async _updateTenantPlantUnitLineConstituent(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const dbSrvc = this.$dependencies.DatabaseService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			// check for running work order
			const latestLineWorkOrderStatus = await this.getTenantPlantUnitLineCurrentWorkOrder(ctxt.state.tenant['tenant_id'], jsonDeserializedData['tenant_plant_unit_line_id']);
			if(latestLineWorkOrderStatus.length)
				throw new Error('Cannot add line constituent while work order is in progress');

			const cacheMulti = this.$dependencies.CacheService.multi();

			const cachedPlantUnitLineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_plant_unit_line_id'], 'line']);
			let cachedArtifacts = cachedPlantUnitLineArtifacts.shift();

			const savedRecord = await this.$LineConstituentModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_plant_unit_line_id'], 'line', ctxt.state.tenant['tenant_id']]);

			const constituentId = jsonDeserializedData['tenant_plant_unit_line_constituent_id'];
			const constituentType = jsonDeserializedData['constituent_type'];

			let constituentsToUpdate;
			if(['line', 'machine'].includes(constituentType)) {
				constituentsToUpdate = [{
					'id': constituentId,
					'type': constituentType
				}];
			}
			else {
				const blockEntities = await dbSrvc.knex.raw('SELECT entity_id AS id, entity_type as type FROM tenant_plant_unit_line_constituent_block_entities WHERE block_id = ?', [constituentId]);
				constituentsToUpdate = blockEntities.rows;
			}

			for(let idx = 0; idx < constituentsToUpdate.length; idx++) {
				const constituent = constituentsToUpdate[idx];

				const constituentArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [constituent.id, constituent.type]);
				cachedArtifacts = cachedArtifacts.concat(constituentArtifacts.shift());

				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [constituent.id, constituent.type, ctxt.state.tenant['tenant_id']]);
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();
			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitLineConstituent`, err);
		}
	}

	async _deleteTenantPlantUnitLineConstituent(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;

			const lineConstituent = await new this.$LineConstituentModel({
				'id': ctxt.params['plant_unit_line_constituent_id'],
				'tenant_id': ctxt.state.tenant['tenant_id']
			})
			.fetch();

			if(!lineConstituent) throw new Error('Unknown Tenant Plant Unit line to constituent mapping');
			// check for running work order
			const latestLineWorkOrderStatus = await this.getTenantPlantUnitLineCurrentWorkOrder(ctxt.state.tenant['tenant_id'], lineConstituent.get('tenant_plant_unit_line_id'));
			if(latestLineWorkOrderStatus.length)
				throw new Error('Cannot add line constituent while work order is in progress');

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedPlantUnitLineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [lineConstituent.get('tenant_plant_unit_line_id'), 'line']);
			let cachedArtifacts = cachedPlantUnitLineArtifacts.shift();

			const constituentId = lineConstituent.get('tenant_plant_unit_line_constituent_id');
			const constituentType = lineConstituent.get('constituent_type');

			const entitiesToRerender = [];

			if(constituentType === 'machine' || constituentType === 'line') {
				entitiesToRerender.push({
					'id': constituentId,
					'type': constituentType
				});
			}
			else if(constituentType === 'block') {
				const blockEntities = await dbSrvc.knex.raw(`SELECT entity_type AS entityType, entity_id AS entityId FROM tenant_plant_unit_line_constituent_block_entities WHERE block_id = ?`, [constituentId]);
				for(let idx = 0; idx < blockEntities.rows; idx++) {
					const blockEntity = blockEntities.rows[idx];
					entitiesToRerender.push({
						'id': blockEntity.entityId,
						'type': blockEntity.entityType
					});
				}
			}

			await lineConstituent.destroy();

			for(let idx = 0; idx < entitiesToRerender.length; idx++) {
				const entity = entitiesToRerender[idx];

				const constituentArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [entity.id, entity.type]);
				cachedArtifacts = cachedArtifacts.concat(constituentArtifacts.shift());

				await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [entity.id, entity.type, ctxt.state.tenant['tenant_id']]);
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitLineConstituent`, err);
		}
	}

	async _getTenantPlantUnitLineBlockEntities(ctxt) {
		try {
			const BlockEntitiesRecord = await this.$TenantBlockEntitiesModel
			.query(function(qb) {
				qb
				.where({'block_id': ctxt.query.block_id})
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id});
			});

			let blockEntitesData = await BlockEntitiesRecord.fetchAll();

			blockEntitesData = this._convertToJsonApiFormat(blockEntitesData, 'manufacturing/plant-unit-line-block-entity', {});

			return blockEntitesData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitLineBlockEntities`, err);
		}
	}

	async _addTenantPlantUnitLineBlockEntities(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const LineConstituentRecord = new this.$LineConstituentModel({
				'id': jsonDeserializedData.block_id,
				'tenant_id': ctxt.state.tenant.tenant_id
			});

			// change block_id to constituent id in line constituent table
			const LineConstituentData = await LineConstituentRecord.fetch();
			jsonDeserializedData['block_id'] = LineConstituentData.attributes['tenant_plant_unit_line_constituent_id'];

			const savedRecord = await this.$TenantBlockEntitiesModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedPlantUnitLineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [LineConstituentRecord.get('tenant_plant_unit_line_id'), 'line']);
			const cachedArtifacts = cachedPlantUnitLineArtifacts.shift();

			const cachedLineConstituentArtifact = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [savedRecord.get('entity_id'), savedRecord.get('entity_type')]);
			cachedArtifacts.push(cachedLineConstituentArtifact.shift());

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [LineConstituentRecord.get('tenant_plant_unit_line_id'), 'line', ctxt.state.tenant['tenant_id']]);
			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [savedRecord.get('entity_id'), savedRecord.get('entity_type'), ctxt.state.tenant['tenant_id']]);

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitLineBlockEntities`, err);
		}
	}

	async _deleteTenantPlantUnitLineBlockEntities(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const dbSrvc = this.$dependencies.DatabaseService;

			const blockEntity = await new this.$TenantBlockEntitiesModel({
				'id': ctxt.params['block_entity_id'],
				'tenant_id': ctxt.state.tenant['tenant_id']
			})
			.fetch();

			if(!blockEntity) throw new Error('Unknown Tenant Plant Unit line block entity mapping');

			let tenantPlantUnitLineId = await dbSrvc.knex.raw(`SELECT tenant_plant_unit_line_id AS id FROM tenant_plant_unit_line_constituents WHERE tenant_plant_unit_line_constituent_id = ?`, [blockEntity.get('block_id')]);
			tenantPlantUnitLineId = tenantPlantUnitLineId.rows[0]['id'];

			const blockEntityId = blockEntity.get('entity_id');
			const blockEntityType = blockEntity.get('entity_type');

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedPlantUnitLineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [tenantPlantUnitLineId, 'line']);
			const cachedArtifacts = cachedPlantUnitLineArtifacts.shift();

			const cachedBlockEntityArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [blockEntityId, blockEntityType]);
			cachedArtifacts.push(cachedBlockEntityArtifacts.shift());

			await blockEntity.destroy();

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [tenantPlantUnitLineId, 'line', ctxt.state.tenant['tenant_id']]);
			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [blockEntityId, blockEntityType, ctxt.state.tenant['tenant_id']]);

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitLineBlockEntities`, err);
		}
	}

	async _getTenantPlantUnitLineProcessor(ctxt) {
		try {
			let lineProcessorData = await this.$LineProcessorModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_line_processor_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitLine']
			});

			lineProcessorData = this._convertToJsonApiFormat(lineProcessorData, 'manufacturing/plant-unit-line-processor', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitLine': 'manufacturing/plant-unit-line'
			});

			return lineProcessorData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitLineProcessor`, err);
		}
	}

	async _addTenantPlantUnitLineProcessor(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(!jsonDeserializedData['processor']) jsonDeserializedData['processor'] = '';

			const savedRecord = await this.$LineProcessorModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitLineProcessor`, err);
		}
	}

	async _updateTenantPlantUnitLineProcessor(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;

			const cacheMulti = this.$dependencies.CacheService.multi();
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$LineProcessorModel
			.query(function(qb) {
				qb.where({'id': jsonDeserializedData.id});
			}).fetch();

			const oldPublishStatus = oldRecord['attributes']['publish_status'];

			// eslint-disable-next-line curly
			if(oldPublishStatus && !newPublishStatus) {
				throw new Error('Published Processor Record cannot be unpublished');
			}

			// 1. update effectivity stop of the current effective processor
			// 2. set effectivity start of the newly published processor

			// if a previously unpublished processor is being published:
			let updateEffectivity;

			if(!oldPublishStatus && newPublishStatus) {
				const now = moment();
				updateEffectivity = await dbSrvc.knex.raw('UPDATE tenant_plant_unit_line_processors SET effectivity_end = ? WHERE tenant_id = ? AND tenant_plant_unit_line_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL AND publish_status = ? RETURNING id,publish_status', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_plant_unit_line_id, true]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$LineProcessorModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});


			// 3. Update Rendered Processor
			const evaluatorFactory = require('evaluator-factory');

			// 4. On Publishing a New processor, generate and store rendered processor and delete cached artifacts
			if(!oldPublishStatus && newPublishStatus) {
				try {
					const renderedEvaluator = await evaluatorFactory.renderEvaluatorString({
						'id': savedRecord.get('tenant_plant_unit_line_id'),
						'type': 'line',
						'database': dbSrvc
					});

					await dbSrvc.knex.raw(`UPDATE tenant_plant_unit_line_processors SET processor = ? WHERE id = ?`, [renderedEvaluator, savedRecord.get('id')]);
				}
				catch(err) {
					jsonDeserializedData['publish_status'] = false;
					await this.$LineProcessorModelk
						.forge()
						.save(jsonDeserializedData, {
							'method': 'update',
							'patch': true
						});

					await dbSrvc.knex.raw('UPDATE tenant_plant_unit_line_processors SET effectivity_end = null WHERE id = ?', [updateEffectivity.rows[0]['id']]);

					throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitLineProcessor`, err);
				}

				const cachedPlantUnitLineArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [savedRecord.get('tenant_plant_unit_line_id'), 'line']);

				cachedPlantUnitLineArtifacts.shift().forEach((cachedArtifact) => {
					cacheMulti.delAsync(cachedArtifact);
				});

				await cacheMulti.execAsync();
			}


			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitLineProcessor`, err);
		}
	}

	async _getTenantPlantUnitLineTemplate(ctxt) {
		try {
			let lineTemplateData = await this.$LineTemplateModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_line_template_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitLine']
			});

			lineTemplateData = this._convertToJsonApiFormat(lineTemplateData, 'manufacturing/plant-unit-line-template', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitLine': 'manufacturing/plant-unit-line'
			});

			return lineTemplateData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitLineTemplate`, err);
		}
	}

	async _addTenantPlantUnitLineTemplate(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$LineTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitLineTemplate`, err);
		}
	}

	async _updateTenantPlantUnitLineTemplate(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const newPublishStatus = jsonDeserializedData.publish_status;
			const oldRecord = await this.$LineTemplateModel
			.query(function(qb) {
				qb.where({'id': jsonDeserializedData.id});
			}).fetch();

			const oldPublishStatus = oldRecord['attributes']['publish_status'];

			// eslint-disable-next-line curly
			if(oldPublishStatus && !newPublishStatus) {
				throw new Error('Published Template Record cannot be unpublished');
			}

			// if a previously unpublished template is being published:
			// 1. update effectivity stop of the current effective template
			// 2. set effectivity start of the newly published template

			if(!oldPublishStatus && newPublishStatus) {
				const now = moment();
				await dbSrvc.knex.raw('UPDATE tenant_plant_unit_line_templates SET effectivity_end = ? WHERE tenant_id = ? AND tenant_plant_unit_line_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_plant_unit_line_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$LineTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitLineTemplate`, err);
		}
	}

	async _getTenantPlantUnitLineAttachedForm(ctxt) {
		try {
			let lineAttachedFormData = await this.$LineAttachedFormModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_line_attached_form_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantOperatorForm', 'tenantPlantUnitLine']
			});

			lineAttachedFormData = this._convertToJsonApiFormat(lineAttachedFormData, 'manufacturing/plant-unit-line-attached-form', {
				'tenant': 'settings/account/basics/tenant',
				'tenantOperatorForm': 'operator-form/operator-form',
				'tenantPlantUnitLine': 'manufacturing/plant-unit-line'
			});

			return lineAttachedFormData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitLineAttachedForm`, err);
		}
	}

	async _addTenantPlantUnitLineAttachedForm(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$LineAttachedFormModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitLineAttachedForm`, err);
		}
	}

	async _deleteTenantPlantUnitLineAttachedForm(ctxt) {
		try {
			const lineAttachedForm = await this.$LineAttachedFormModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_line_attached_form_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!lineAttachedForm) throw new Error('Unknown Tenant Plant Unit line to Operator Form mapping');

			await lineAttachedForm.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitLineAttachedForm`, err);
		}
	}

	async _getTenantPlantUnitLineEvent(ctxt) {
		try {
			let lineEventData = await this.$TenantPlantUnitLineEventModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_line_event_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitLine', 'eventType']
			});

			lineEventData = this._convertToJsonApiFormat(lineEventData, 'manufacturing/plant-unit-line-event', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitLine': 'manufacturing/plant-unit-line',
				'eventType': 'masterdata/event-type'
			});

			return lineEventData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitLineEvent`, err);
		}
	}

	async _addTenantPlantUnitLineEvent(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const pubsubService = this.$dependencies.PubsubService;
			const dbSrvc = this.$dependencies.DatabaseService;
			const cacheSrvc = this.$dependencies.CacheService;

			let eventType = await dbSrvc.knex.raw('SELECT * FROM event_types WHERE id = ?', jsonDeserializedData['event_type_id']);

			if(!eventType.rows || !eventType.rows.length)
				throw new Error('Invalid Event Type id');

			eventType = eventType.rows.shift();
			jsonDeserializedData['eventType'] = eventType;

			const eventMessage = {
				'type': eventType['tag'],
				'data': jsonDeserializedData
			};

			const now = moment();

			if(JSON.parse(eventMessage['data']['event_metadata']['previous_value']).masterdata_id === JSON.parse(eventMessage['data']['event_metadata']['value']).masterdata_id)
				throw new Error('the same supervisor name');

			if(now.diff(moment(eventMessage['data']['event_timestamp']), 'seconds') > 300)
				throw new Error('event timestamp older than 5 minutes');

			if(moment(eventMessage['data']['event_timestamp']).diff(now, 'seconds') > 300)
				throw new Error('event timestamp cannot be in the future');

			if(moment(eventMessage['data']['event_timestamp']).isAfter(now))
				eventMessage['data']['event_timestamp'] = now.format();

			if(eventMessage.type === 'supervisor_change') {
				const latestEventCacheKey = `eventhandler!latest!${eventMessage.type}!${eventMessage.data.tenant_id}!${eventMessage.data.tenant_plant_unit_machine_id}`;
				let latestCachedEvent = await cacheSrvc.getAsync(latestEventCacheKey);
				if(latestCachedEvent) {
					latestCachedEvent = JSON.parse(latestCachedEvent);
					if(latestCachedEvent.masterdata_id === JSON.parse(eventMessage.data.event_metadata.value)['masterdata_id'])
						throw new Error('cannot create supervisor change event - duplicate event');
				}
			}

			await pubsubService.publish('plantworks-data-stream', 'EVENT.STREAM', safeJsonStringify(eventMessage));

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': jsonDeserializedData['id']
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitLineEvent`, err);
		}
	}

	async _getTenantPlantUnitLineWorkOrderFormat(ctxt) {
		try {
			let plantUnitLineWorkOrderFormatData = await this.$LineWorkOrderFormatModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_line_work_order_format_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitLine', 'tenantWorkOrderFormat']
			});

			plantUnitLineWorkOrderFormatData = this._convertToJsonApiFormat(plantUnitLineWorkOrderFormatData, 'manufacturing/plant-unit-line-work-order-format', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitLine': 'manufacturing/plant-unit-line',
				'tenantWorkOrderFormat': 'work-order/work-order-format'
			});

			return plantUnitLineWorkOrderFormatData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitLineWorkOrderFormat`, err);
		}
	}

	async _addTenantPlantUnitLineWorkOrderFormat(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$LineWorkOrderFormatModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitLineWorkOrderFormat`, err);
		}
	}

	async _updateTenantPlantUnitLineWorkOrderFormat(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$LineWorkOrderFormatModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitLineWorkOrderFormat`, err);
		}
	}

	async _deleteTenantPlantUnitLineWorkOrderFormat(ctxt) {
		try {
			const tenantPlantUnitLineWorkOrderFormat = await new this.$LineWorkOrderFormatModel({
				'id': ctxt.params['plant_unit_line_work_order_format_id'],
				'tenant_id': ctxt.state.tenant['tenant_id']
			})
			.fetch();

			if(!tenantPlantUnitLineWorkOrderFormat) throw new Error('Unknown Tenant Plant Unit line');

			await tenantPlantUnitLineWorkOrderFormat.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deletetenantPlantUnitLine`, err);
		}
	}

	async _getTenantPlantUnitLineWorkOrders(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const tenantPlantUnitLine = await this.$TenantPlantUnitLineModel
			.query(function(qb) {
				qb.where({'id': ctxt.params.plant_unit_line_id});
			})
			.fetch({
				'withRelated': ['workOrderFormats']
			});

			if(!tenantPlantUnitLine)
				throw new Error('Invalid Line Id');

			const lineWorkOrderFormats = await tenantPlantUnitLine.related('workOrderFormats').fetch({
				'withRelated': ['tenantWorkOrderFormat']
			});

			if(!lineWorkOrderFormats || !lineWorkOrderFormats.length)
				return [];

			const workOrderFormatData = [];

			for(let idx = 0; idx < lineWorkOrderFormats.length; idx++) {
				const lineWorkOrderFormat = lineWorkOrderFormats.at(idx);
				let workOrderFilters = lineWorkOrderFormat.get('filters');

				// Fetch work order Format
				const workOrderFormat = lineWorkOrderFormat.related('tenantWorkOrderFormat');

				if(!workOrderFormat)
					throw new Error('Invalid Work Order Format Id', lineWorkOrderFormat.get('tenant_work_order_format_id'));

				// Fetch Combined Attribute Set
				let workOrderAttrSetIds = await dbSrvc.knex.raw('SELECT tenant_attribute_set_id FROM tenant_work_order_format_attribute_sets WHERE tenant_work_order_format_id = ?', [workOrderFormat.get('id')]);
				workOrderAttrSetIds = workOrderAttrSetIds.rows.map((row) => {
					return row['tenant_attribute_set_id'];
				});

				const workOrderParams = await this.combineAttributeSets(workOrderAttrSetIds);
				let uniqueAttribute = null;

				// Find Unique Attribute
				let uniqueAttributeMetadata = workOrderFormat.get('attribute_set_metadata').filter((metadata) => {
					return metadata['is_unique_id'];
				});

				if(uniqueAttributeMetadata.length) {
					uniqueAttributeMetadata = uniqueAttributeMetadata.shift();

					uniqueAttribute = workOrderParams.attributes.filter((param) => {
						return param['id'] === uniqueAttributeMetadata['parameter_id'];
					}).pop();
				}

				if(!uniqueAttribute)
					throw new Error('No unique Id Found on Work order format', workOrderFormat.get('id'));


				// Figure which internal tags are configured to displayed in the frontend
				workOrderFormat.get('attribute_set_metadata').forEach((metadata) => {
					workOrderParams.attributes.forEach((param) => {
						if(param['id'] === metadata['parameter_id'])
							param['display_in_station'] = metadata['display_in_station'] || false;
					});
				});

				// attach internal_tag to workOrderFilters
				workOrderFilters = workOrderFilters.map((filter) => {
					let filterParameter = workOrderParams['attributes'].filter((param) => {
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

				// table headers
				const head = workOrderParams.attributes
				.filter((param) => {
					return param['display_in_station'];
				})
				.map((param) => {
					return param['internal_tag'].replace(/_/g, ' ');
				});

				// internal tags to display
				const registers = workOrderParams.attributes
				.filter((param) => {
					return param['display_in_station'];
				})
				.map((param) => {
					return param['internal_tag'];
				});

				// select all work order with their latest status; filter out completed/canceled work orders; filter out work orders active on some other line
				const workOrderData = await dbSrvc.knex.raw('SELECT DISTINCT ON (work_order_id) A.work_order_id, A.current_status, A.values, B.status FROM tenant_work_orders A INNER JOIN tenant_work_order_status B on (A.work_order_id = B.work_order_id AND A.tenant_id = B.tenant_id) WHERE A.tenant_id = ? AND A.current_status != ? AND A.current_status != ? AND B.tenant_work_order_format_id = ? AND (B.tenant_plant_unit_line_id IS NULL OR B.tenant_plant_unit_line_id = ?) ORDER BY A.work_order_id, B.created_at DESC', [
					ctxt.state.tenant['tenant_id'],
					'completed',
					'canceled',
					workOrderFormat.get('id'),
					tenantPlantUnitLine.get('id')
				]);
				workOrderData.rows = await this._getWorkOrderStartTime(workOrderData.rows, tenantPlantUnitLine.get('id'));

				let workOrderList = workOrderData.rows.map((row) => {
					const workOrderValues = row.values;
					workOrderValues['work_order_id'] = row['work_order_id'];
					workOrderValues['status'] = row['status'];
					workOrderValues['current_status'] = row['current_status'];
					workOrderValues['work_order_start_time'] = row['work_order_start_time'];

					return workOrderValues;
				});

				workOrderList = await this._filterMasterData(workOrderList, workOrderFilters);
				workOrderList = workOrderList.map((row) => {
					return {
						'work_order_id': row['work_order_id'],
						'status': row['status'],
						'displayStatus': row['current_status'],
						'work_order_start_time': row['work_order_start_time'],
						'data': registers.map((internalTag) => {
							return row[internalTag];
						})
					};
				});

				workOrderFormatData.push({
					'head': head,
					'tenantWorkOrderFormatId': workOrderFormat.get('id'),
					'rows': workOrderList
				});
			}

			return workOrderFormatData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitLineWorkOrders`, err);
		}
	}

	async _getTenantPlantUnitLineWorkOrdersProduction(ctxt) {
		try {
			const tenantPlantUnitLine = ctxt.query['plant-unit-line-id'];
			const workOrders = JSON.parse(ctxt.query['plant-unit-line-work-orders']);
			const constituentDescription = ctxt.query['plant-unit-line-constituent-description'];

			const productionData = {};
			if(workOrders.length) {
				// get the total production data for chosen line and work orders
				const statisticsData = await this.$dependencies.DatabaseService.knex.raw(`SELECT sum(total_production) AS actual_production, work_order_id FROM tenant_plant_unit_machine_statistics WHERE tenant_plant_unit_machine_id IN
				(SELECT A.id FROM tenant_plant_unit_machines A JOIN tenant_plant_unit_line_constituents B ON (A.id = B.tenant_plant_unit_line_constituent_id) WHERE B.tenant_plant_unit_line_id = ? AND
				B.constituent_type = ? AND A.description = ?) AND work_order_id IN (${workOrders.map(() => { return '?';}).join(',')}) GROUP BY work_order_id`, [tenantPlantUnitLine, 'machine', constituentDescription, ...workOrders]);

				statisticsData.rows.forEach((row) => {
					productionData[row.work_order_id.replace(/[^a-zA-Z0-9]/g, '_')] = Number(row['actual_production'] / 1000).toFixed(2);
				});
			}

			return productionData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitLineWorkOrdersProduction`, err);
		}
	}

	async _getTenantPlantUnitLineSupervisors(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const plantUnitLine = await this.$TenantPlantUnitLineModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_line_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id});
			})
			.fetch({
				'withRelated': ['supervisorList']
			});

			if(!plantUnitLine) throw new Error('Unknow Tenant Plant Unit Line');

			const supervisorListConfiguration = plantUnitLine.related('supervisorList');

			if(!supervisorListConfiguration || !supervisorListConfiguration.get('id'))
				return [];

			const masterData = await dbSrvc.knex.raw('SELECT masterdata_id, values FROM tenant_emd_data WHERE tenant_id = ? AND tenant_emd_configuration_id = ? AND active = ?', [
				ctxt.state.tenant['tenant_id'],
				supervisorListConfiguration.get('id'),
				true
			]);

			if(!masterData || !masterData.rows || !masterData.rows.length)
				return [];

			const supervisorList = masterData.rows.map((row) => {
				const masterDataValues = row.values;
				masterDataValues['masterdata_id'] = row['masterdata_id'];

				return masterDataValues;
			});

			// compute filter array
			let filters = plantUnitLine.get('supervisor_list_filters');
			let compositeAttributeSetIds = await dbSrvc.knex.raw('SELECT tenant_attribute_set_id FROM tenant_emd_configuration_attribute_sets WHERE tenant_emd_configuration_id = ?', [supervisorListConfiguration.get('id')]);

			compositeAttributeSetIds = compositeAttributeSetIds.rows.map((row) => {
				return row['tenant_attribute_set_id'];
			});

			const combinedAttributeSet = await this.combineAttributeSets(compositeAttributeSetIds);

			filters = filters.map((filter) => {
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

			// compute final filtered master data
			const filteredMasterArr = await this._filterMasterData(supervisorList, filters);
			return filteredMasterArr;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitLineSupervisors`, err);
		}
	}

	async _getTenantPlantUnitLineWatcher(ctxt) {
		try {
			let lineWatcherData = await this.$LineUserModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_line_watcher_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitLine', 'tenantUser']
			});

			lineWatcherData = this._convertToJsonApiFormat(lineWatcherData, 'manufacturing/plant-unit-line-watcher', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitLine': 'manufacturing/plant-unit-line',
				'tenantUser': 'pug/user-manager/tenant-user'
			});

			return lineWatcherData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitLineWatcher`, err);
		}
	}

	async _addTenantPlantUnitLineWatcher(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$LineUserModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitLineWatcher`, err);
		}
	}

	async _deleteTenantPlantUnitLineWatcher(ctxt) {
		try {
			const lineWatcher = await this.$LineUserModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_line_watcher_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!lineWatcher) throw new Error('Unknown Line User mapping');

			await lineWatcher.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitLineWatcher`, err);
		}
	}

	async _getPossibleLineTenantUsersList(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const possibleTenantUsers = await dbSrvc.knex.raw(`SELECT A.id, B.first_name AS "firstName", B.middle_names AS "middleNames", B.last_name AS "lastName", B.email FROM tenants_users A INNER JOIN users B ON (A.user_id = B.id) WHERE A.tenant_id = ? AND A.access_status = 'authorized' AND A.id NOT IN (SELECT tenant_user_id FROM tenant_plant_unit_lines_users WHERE tenant_plant_unit_line_id = ?)`, [ctxt.state.tenant.tenant_id, ctxt.query.line]);
			return possibleTenantUsers.rows;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getPossibleLineTenantUsersList`, err);
		}
	}

	async _getTenantPlantUnitStation(ctxt) {
		try {
			let plantUnitStationData = await this.$TenantPlantUnitStationModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_station_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnit', 'observedMachines', 'observedLines', 'attachedForms', 'watchers', {'tenantPlantUnitMachineEvents': function(query) { query.whereRaw('event_timestamp > ?', moment().subtract(30, 'days').format()); }}, {'tenantPlantUnitLineEvents': function(query) { query.whereRaw('event_timestamp > ?', moment().subtract(30, 'days').format()); }}]
			});

			plantUnitStationData = this._convertToJsonApiFormat(plantUnitStationData, 'manufacturing/plant-unit-station', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnit': 'manufacturing/plant-unit',
				'observedMachines': 'manufacturing/plant-unit-station-observed-machine',
				'observedLines': 'manufacturing/plant-unit-station-observed-line',
				'attachedForms': 'manufacturing/plant-unit-station-attached-form',
				'watchers': 'manufacturing/plant-unit-station-watcher',
				'tenantPlantUnitMachineEvents': 'manufacturing/plant-unit-machine-event',
				'tenantPlantUnitLineEvents': 'manufacturing/plant-unit-line-event'
			});

			return plantUnitStationData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitStation`, err);
		}
	}

	async _addTenantPlantUnitStation(ctxt) {
		try {
			const pubsubService = this.$dependencies.PubsubService;

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');
			// jsonDeserializedData['attribute_set_metadata'] = safeJsonStringify(jsonDeserializedData['attribute_set_metadata']);

			const savedRecord = await this.$TenantPlantUnitStationModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			const schemaChangePayload = safeJsonStringify({
				'id': savedRecord.get('id'),
				'sub_domain': ctxt.state.tenant['sub_domain'],
				'tenant_id': ctxt.state.tenant['tenant_id'],
				'type': 'station'
			});

			await pubsubService.publish('plantworks-data-stream', 'SCHEMA.UPDATE', schemaChangePayload);

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitStation`, err);
		}
	}

	async _updateTenantPlantUnitStation(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantPlantUnitStationModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitStation`, err);
		}
	}

	async _deleteTenantPlantUnitStation(ctxt) {
		try {
			const tenantPlantUnitStation = await this.$TenantPlantUnitStationModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_station_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantPlantUnitStation) throw new Error('Unknown Tenant Plant Unit Station');

			await tenantPlantUnitStation.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitStation`, err);
		}
	}

	async _getTenantPlantUnitStationObservedMachine(ctxt) {
		try {
			let stationObservedMachineData = await this.$StationObservedMachineModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_station_observed_machine_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitMachine', 'tenantPlantUnitStation', 'templates']
			});

			stationObservedMachineData = this._convertToJsonApiFormat(stationObservedMachineData, 'manufacturing/plant-unit-station-observed-machine', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitMachine': 'manufacturing/plant-unit-machine',
				'tenantPlantUnitStation': 'manufacturing/plant-unit-station',
				'templates': 'manufacturing/plant-unit-station-observed-machine-template'
			});

			return stationObservedMachineData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitStationObservedMachine`, err);
		}
	}

	async _addTenantPlantUnitStationObservedMachine(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$StationObservedMachineModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitStationObservedMachine`, err);
		}
	}

	async _deleteTenantPlantUnitStationObservedMachine(ctxt) {
		try {
			const stationObservedMachine = await this.$StationObservedMachineModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_station_observed_machine_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!stationObservedMachine) throw new Error('Unknown Tenant Plant Unit Station to Machine mapping');

			await stationObservedMachine.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitStationObservedMachine`, err);
		}
	}

	async _getTenantPlantUnitStationObservedMachineTemplate(ctxt) {
		try {
			let observedMachineTemplateData = await this.$StationObservedMachineTemplateModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_station_observed_machine_template_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitStationObservedMachine']
			});

			observedMachineTemplateData = this._convertToJsonApiFormat(observedMachineTemplateData, 'manufacturing/plant-unit-station-observed-machine-template', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitStationObservedMachine': 'manufacturing/plant-unit-station-observed-machine'
			});

			return observedMachineTemplateData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitStationObservedMachineTemplate`, err);
		}
	}

	async _addTenantPlantUnitStationObservedMachineTemplate(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$StationObservedMachineTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitStationObservedMachineTemplate`, err);
		}
	}

	async _updateTenantPlantUnitStationObservedMachineTemplate(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const newPublishStatus = jsonDeserializedData.publish_status;
			const oldRecord = await this.$StationObservedMachineTemplateModel
			.query(function(qb) {
				qb.where({'id': jsonDeserializedData.id});
			}).fetch();

			const oldPublishStatus = oldRecord['attributes']['publish_status'];

			// eslint-disable-next-line curly
			if(oldPublishStatus && !newPublishStatus) {
				throw new Error('Published Template Record cannot be unpublished');
			}

			// if a previously unpublished template is being published:
			// 1. update effectivity stop of the current effective template
			// 2. set effectivity start of the newly published template

			if(!oldPublishStatus && newPublishStatus) {
				const now = moment();
				await dbSrvc.knex.raw('UPDATE tenant_plant_unit_station_observed_machine_templates SET effectivity_end = ? WHERE tenant_id = ? AND tenant_plant_unit_station_observed_machine_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_plant_unit_station_observed_machine_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$StationObservedMachineTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitStationObservedMachineTemplate`, err);
		}
	}

	async _getTenantPlantUnitStationObservedLine(ctxt) {
		try {
			let stationObservedLineData = await this.$StationObservedLineModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_station_observed_line_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitLine', 'tenantPlantUnitStation', 'templates']
			});

			stationObservedLineData = this._convertToJsonApiFormat(stationObservedLineData, 'manufacturing/plant-unit-station-observed-line', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitLine': 'manufacturing/plant-unit-line',
				'tenantPlantUnitStation': 'manufacturing/plant-unit-station',
				'templates': 'manufacturing/plant-unit-station-observed-line-template'
			});

			return stationObservedLineData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitStationObservedLine`, err);
		}
	}

	async _addTenantPlantUnitStationObservedLine(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$StationObservedLineModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitStationObservedLine`, err);
		}
	}

	async _updateTenantPlantUnitStationObservedLine(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$StationObservedLineModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitStationObservedLine`, err);
		}
	}

	async _deleteTenantPlantUnitStationObservedLine(ctxt) {
		try {
			const stationObservedLine = await this.$StationObservedLineModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_station_observed_line_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!stationObservedLine) throw new Error('Unknown Tenant Plant Unit Station to Line mapping');

			await stationObservedLine.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitStationObservedLine`, err);
		}
	}

	async _getTenantPlantUnitStationObservedLineTemplate(ctxt) {
		try {
			let observedLineTemplateData = await this.$StationObservedLineTemplateModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_station_observed_line_template_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitStationObservedLine']
			});

			observedLineTemplateData = this._convertToJsonApiFormat(observedLineTemplateData, 'manufacturing/plant-unit-station-observed-line-template', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitStationObservedLine': 'manufacturing/plant-unit-station-observed-line'
			});

			return observedLineTemplateData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitStationObservedLineTemplate`, err);
		}
	}

	async _addTenantPlantUnitStationObservedLineTemplate(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$StationObservedLineTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitStationObservedLineTemplate`, err);
		}
	}

	async _updateTenantPlantUnitStationObservedLineTemplate(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const newPublishStatus = jsonDeserializedData.publish_status;
			const oldRecord = await this.$StationObservedLineTemplateModel
			.query(function(qb) {
				qb.where({'id': jsonDeserializedData.id});
			}).fetch();

			const oldPublishStatus = oldRecord['attributes']['publish_status'];

			// eslint-disable-next-line curly
			if(oldPublishStatus && !newPublishStatus) {
				throw new Error('Published Template Record cannot be unpublished');
			}

			// if a previously unpublished template is being published:
			// 1. update effectivity stop of the current effective template
			// 2. set effectivity start of the newly published template

			if(!oldPublishStatus && newPublishStatus) {
				const now = moment();
				await dbSrvc.knex.raw('UPDATE tenant_plant_unit_station_observed_line_templates SET effectivity_end = ? WHERE tenant_id = ? AND tenant_plant_unit_station_observed_line_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_plant_unit_station_observed_line_id]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$StationObservedLineTemplateModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantPlantUnitStationObservedLineTemplate`, err);
		}
	}

	async _getTenantPlantUnitStationAttachedForm(ctxt) {
		try {
			let stationAttachedFormData = await this.$StationAttachedFormModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_station_attached_form_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantOperatorForm', 'tenantPlantUnitStation']
			});

			stationAttachedFormData = this._convertToJsonApiFormat(stationAttachedFormData, 'manufacturing/plant-unit-station-attached-form', {
				'tenant': 'settings/account/basics/tenant',
				'tenantOperatorForm': 'operator-form/operator-form',
				'tenantPlantUnitStation': 'manufacturing/plant-unit-station'
			});

			return stationAttachedFormData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitStationAttachedForm`, err);
		}
	}

	async _addTenantPlantUnitStationAttachedForm(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$StationAttachedFormModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitStationAttachedForm`, err);
		}
	}

	async _deleteTenantPlantUnitStationAttachedForm(ctxt) {
		try {
			const stationAttachedForm = await this.$StationAttachedFormModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_station_attached_form_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!stationAttachedForm) throw new Error('Unknown Tenant Plant Unit Station to Operator Form mapping');

			await stationAttachedForm.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitStationAttachedForm`, err);
		}
	}

	async _getTenantPlantUnitStationWatcher(ctxt) {
		try {
			let stationWatcherData = await this.$StationUserModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_station_watcher_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantPlantUnitStation', 'tenantUser']
			});

			stationWatcherData = this._convertToJsonApiFormat(stationWatcherData, 'manufacturing/plant-unit-station-watcher', {
				'tenant': 'settings/account/basics/tenant',
				'tenantPlantUnitStation': 'manufacturing/plant-unit-station',
				'tenantUser': 'pug/user-manager/tenant-user'
			});

			return stationWatcherData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantPlantUnitStationWatcher`, err);
		}
	}

	async _addTenantPlantUnitStationWatcher(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$StationUserModel
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
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantPlantUnitStationWatcher`, err);
		}
	}

	async _deleteTenantPlantUnitStationWatcher(ctxt) {
		try {
			const stationWatcher = await this.$StationUserModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.plant_unit_station_watcher_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!stationWatcher) throw new Error('Unknown Station User mapping');

			await stationWatcher.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantPlantUnitStationWatcher`, err);
		}
	}

	async _getPossibleStationTenantUsersList(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const possibleTenantUsers = await dbSrvc.knex.raw(`SELECT A.id, B.first_name AS "firstName", B.middle_names AS "middleNames", B.last_name AS "lastName", B.email FROM tenants_users A INNER JOIN users B ON (A.user_id = B.id) WHERE A.tenant_id = ? AND A.access_status = 'authorized' AND A.id NOT IN (SELECT tenant_user_id FROM tenant_plant_unit_stations_users WHERE tenant_plant_unit_station_id = ?)`, [ctxt.state.tenant.tenant_id, ctxt.query.station]);
			return possibleTenantUsers.rows;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getPossibleStationTenantUsersList`, err);
		}
	}

	async _getFirstNonMetaDowntime(ctxt) {
		try {

			const machineId = ctxt.params.plant_unit_machine_id;
			const dbSrvc = this.$dependencies.DatabaseService;

			const firstNonMetaDowntime = await dbSrvc.knex.raw(`select * from tenant_plant_unit_machine_downtimes where tenant_plant_unit_machine_id = ? and type = 'downtime' and metadata = '{}' order by start_time asc limit 1`, [machineId]);
			const firstNonApprovedDowntime = await dbSrvc.knex.raw(`select * from tenant_plant_unit_machine_downtimes where tenant_plant_unit_machine_id = ? and type = 'downtime' and metadata = '{"submited":true, "approved":false}' order by start_time asc limit 1`, [machineId]);

			const result = {
				'firstNonMetaDowntime': null,
				'firstNonApprovedDowntime': null
			};

			if(!firstNonMetaDowntime.rows)
				result['firstNonMetaDowntime'] = null;
			else
				result['firstNonMetaDowntime'] = firstNonMetaDowntime.rows[0];

			if(!firstNonApprovedDowntime.rows)
				result['firstNonApprovedDowntime'] = null;
			else
				result['firstNonApprovedDowntime'] = firstNonApprovedDowntime.rows[0];


			return result;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getFirstNonMetaDowntime`, err);
		}
	}

	async _submitShiftData(ctxt) {
		try {

			const dbSrvc = this.$dependencies.DatabaseService;
			const jsonDeserializedData = JSON.parse(ctxt.request.body.downtimeList);

			const approvedDowntimeUpdate = ctxt.request.body.approvedDowntimeUpdate;
			const downtimeListToUpdate = jsonDeserializedData;
			const tenantPlantUnitMachineId = ctxt.request.body.tenantPlantUnitMachineId;
			const tenantPlantUnitLine = ctxt.request.body.tenantPlantUnitLine;
			const tenantPlantUnit = ctxt.request.body.tenantPlantUnit;

			for(let d = 0; d < downtimeListToUpdate.length; d++) {
				const actualTime = moment(downtimeListToUpdate[d]['end_time'] || undefined).startOf('minute').diff(moment(downtimeListToUpdate[d]['start_time']).startOf('minute'), 'minutes');

				const enteredReason = await dbSrvc.knex.raw(`SELECT SUM(reason_duration_in_min) AS ttlreason FROM tenant_plant_unit_machine_downtime_reasons WHERE tenant_plant_unit_machine_downtime_id = ?;`, [downtimeListToUpdate[d]['id']]);
				let enteredDuration = enteredReason.rows[0].ttlreason;

				if(!enteredDuration)
					enteredDuration = 0;

				if((actualTime - enteredDuration > 0) && actualTime > 10)
					throw new Error('Please enter all the reason for downtime');

				downtimeListToUpdate[d]['add_minor_stoppage'] = (actualTime - enteredDuration > 0) && actualTime <= 10;
				downtimeListToUpdate[d]['minor_stoppage_duration_in_minutes'] = actualTime - enteredDuration;
			}

			let stoppageReasonsUploaderId = await dbSrvc.knex.raw(`SELECT downtime_list_id FROM tenant_plant_unit_machines WHERE id = ?`, [tenantPlantUnitMachineId]);
			if(!stoppageReasonsUploaderId.rows.length)
				throw new Error('Downtime list not configured');

			stoppageReasonsUploaderId = stoppageReasonsUploaderId.rows.shift();

			let minorStoppageReasonId = await dbSrvc.knex.raw(`SELECT masterdata_id FROM tenant_emd_data WHERE tenant_emd_configuration_id = ? AND values->>'REASON' = ? AND active = ?`, [stoppageReasonsUploaderId['downtime_list_id'], 'Minor Stoppage', true]);
			// filter the reason for selected line and unit
			minorStoppageReasonId = minorStoppageReasonId.rows.filter((e) => {
				return e['masterdata_id'].includes(`${tenantPlantUnit.toUpperCase().replace(/ /g, '_')}_${tenantPlantUnitLine.toUpperCase().replace(/ /g, '_')}`);
			});

			if(!minorStoppageReasonId.length)
				throw new Error('Minor stoppage reason not configured');

			minorStoppageReasonId = minorStoppageReasonId.shift();

			for(let d = 0; d < downtimeListToUpdate.length; d++) {
				// update the downtime reason for minor downtimes
				if(downtimeListToUpdate[d]['add_minor_stoppage'])
					await dbSrvc.knex('tenant_plant_unit_machine_downtime_reasons').insert({
						'tenant_id': downtimeListToUpdate[d]['tenant_id'],
						'tenant_plant_unit_machine_downtime_id': downtimeListToUpdate[d]['id'],
						'reason_duration_in_min': downtimeListToUpdate[d]['minor_stoppage_duration_in_minutes'],
						'reason_code': minorStoppageReasonId['masterdata_id'],
						'reason_description': 'Minor Stoppage'
					});

				// update the status as true for the downtimes
				if(approvedDowntimeUpdate === 'true')
					await dbSrvc.knex.raw(`UPDATE tenant_plant_unit_machine_downtimes SET metadata = ? WHERE id = ?`, ['{"submited":true, "approved":true}', downtimeListToUpdate[d]['id']]);
				else
					await dbSrvc.knex.raw(`UPDATE tenant_plant_unit_machine_downtimes SET metadata = ? WHERE id = ?`, ['{"submited":true, "approved":false}', downtimeListToUpdate[d]['id']]);
			}

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_submitShiftData`, err);
		}
	}

	// #endregion

	// #region Private Methods
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
			const properties = await dbSrvc.knex.raw(`SELECT id, internal_tag, source AS parameter_type, datatype AS data_type, evaluation_expression, units FROM tenant_attribute_set_properties WHERE attribute_set_id = ? ORDER BY internal_tag ASC`, [attributeSetId]);
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

	async getTenantPlantUnitLineCurrentWorkOrder(tenantId, tenantPlantUnitLineId) {
		const currentlyRunningWorkOrders = await this.$dependencies.DatabaseService.knex.raw('SELECT DISTINCT ON (work_order_id) A.work_order_id, A.current_status FROM tenant_work_orders A JOIN tenant_work_order_status B ON (A.work_order_id = B.work_order_id) WHERE A.tenant_id = ? AND A.current_status = ? AND B.tenant_plant_unit_line_id = ?', [
			tenantId,
			'in_progress',
			tenantPlantUnitLineId
		]);

		return currentlyRunningWorkOrders.rows;
	}

	async _getWorkOrderStartTime(workOrderData, tenantPlantUnitLineId) {
		for(let idx = 0; idx < workOrderData.length; idx++) {
			const workOrder = workOrderData[idx];

			let workOrderStartTime = null;
			// fetch work order start time for running work orders
			if(!(workOrder.status === 'completed' || workOrder.status === 'discontinued' || workOrder.status === 'not_started')) {
				const workOrderStartData = await this.$dependencies.DatabaseService.knex.raw(`SELECT created_at FROM tenant_work_order_status WHERE tenant_plant_unit_line_id = ? AND work_order_id = ? AND status = ? ORDER BY created_at DESC LIMIT 1`, [tenantPlantUnitLineId, workOrder['work_order_id'], 'in_progress']);
				workOrderStartTime = workOrderStartData.rows.length ? workOrderStartData.rows[0]['created_at'] : null;
			}

			workOrderData[idx]['work_order_start_time'] = workOrderStartTime;
		}

		return workOrderData;
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
		return ['PubsubService'].concat(super.dependencies);
	}
	// #endregion
}

exports.middleware = Main;
