'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseComponent = require('plantworks-base-component').PlantWorksBaseComponent;
const PlantWorksCompError = require('plantworks-component-error').PlantWorksComponentError;

/**
 * @class   Masterdata
 * @extends {PlantWorksBaseComponent}
 * @classdesc The Plant.Works Web Application Server Masterdata component - exposes a read-only view of the master data in Plant.Works.
 *
 *
 */
class Masterdata extends PlantWorksBaseComponent {
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
	 * @memberof Masterdata
	 * @name     _addRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds routes to the Koa Router.
	 */
	async _addRoutes() {
		try {
			this.$router.get('/attributeSourceTypes', this._getAttributeSourceTypes.bind(this));
			this.$router.get('/attributeDataTypes', this._getAttributeDataTypes.bind(this));
			this.$router.get('/timestampFormatTypes', this._getTimestampTypes.bind(this));
			this.$router.get('/contactTypes', this._getContactTypes.bind(this));

			this.$router.get('/boardDataDisplayChoices', this._getBoardDataDisplayChoices.bind(this));
			this.$router.get('/reportDataDisplayChoices', this._getReportDataDisplayChoices.bind(this));

			this.$router.get('/boardAggregationTypeChoices', this._getBoardAggregationTypeChoices.bind(this));
			this.$router.get('/boardAggregationPeriodChoices', this._getBoardAggregationPeriodChoices.bind(this));

			this.$router.get('/gateway-masters/:gateway_master_id', this._getGatewayMaster.bind(this));
			this.$router.get('/gateway-masters', this._getGatewayMasters.bind(this));

			this.$router.get('/gateway-hardware-protocols/:gateway_hardware_protocol_id', this._getGatewayHardwareProtocol.bind(this));
			this.$router.get('/gateway-communication-protocols/:gateway_communication_protocol_id', this._getGatewayCommunicationProtocol.bind(this));

			this.$router.get('/machine-masters/:machine_master_id', this._getMachineMaster.bind(this));
			this.$router.get('/machine-masters', this._getMachineMasters.bind(this));

			this.$router.get('/plc-masters/:plc_master_id', this._getPlcMaster.bind(this));
			this.$router.get('/plc-masters', this._getPlcMasters.bind(this));

			this.$router.get('/plc-hardware-protocols/:plc_hardware_protocol_id', this._getPlcHardwareProtocol.bind(this));

			this.$router.get('/hardware-protocol-masters/:hardware_protocol_id', this._getHardwareProtocol.bind(this));
			this.$router.get('/communication-protocol-masters/:communication_protocol_id', this._getCommunicationProtocol.bind(this));

			this.$router.get('/plant-schedule-types', this._getPlantScheduleTypes.bind(this));
			this.$router.get('/plant-unit-schedule-types', this._getPlantUnitScheduleTypes.bind(this));
			this.$router.get('/plant-unit-machine-schedule-types', this._getPlantUnitMachineScheduleTypes.bind(this));

			this.$router.get('/event-types', this._getAllEventTypes.bind(this));
			this.$router.get('/event-types/:event_id', this._getEventTypes.bind(this));

			this.$router.get('/report-request-formatter-types', this._getAllReportRequestFormatterTypes.bind(this));
			this.$router.get('/report-response-formatter-types', this._getAllReportResponseFormatterTypes.bind(this));

			this.$router.get('/alert-response-formatter-types', this._getAllAlertResponseFormatterTypes.bind(this));
			this.$router.get('/event-alert-response-formatter-types', this._getAllEventAlertResponseFormatterTypes.bind(this));

			this.$router.get('/timezones', this._getAllTimezones.bind(this));

			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksCompError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _getAttributeSourceTypes(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		const dbSrvc = this.$dependencies.DatabaseService;
		const sourceTypes = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::attribute_source_type)) AS source_type');

		const responseData = [];
		sourceTypes.rows.forEach((sourceTypeData) => {
			responseData.push(sourceTypeData['source_type']);
		});

		ctxt.status = 200;
		ctxt.body = responseData;
	}

	async _getAttributeDataTypes(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		const dbSrvc = this.$dependencies.DatabaseService;
		const valueTypes = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::attribute_value_type)) AS value_type');

		const responseData = [];
		valueTypes.rows.forEach((valueTypeData) => {
			responseData.push(valueTypeData['value_type']);
		});

		ctxt.status = 200;
		ctxt.body = responseData;
	}

	async _getTimestampTypes(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		const dbSrvc = this.$dependencies.DatabaseService;
		const timestampTypes = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::attribute_timestamp_type)) AS timestamp_type');

		const responseData = [];
		timestampTypes.rows.forEach((timestampTypeData) => {
			responseData.push(timestampTypeData['timestamp_type']);
		});

		ctxt.status = 200;
		ctxt.body = responseData;
	}

	async _getContactTypes(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		const dbSrvc = this.$dependencies.DatabaseService;
		const contactTypes = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::contact_type)) AS contact_types');

		const responseData = [];
		contactTypes.rows.forEach((contactTypeData) => {
			responseData.push(contactTypeData.contact_types);
		});

		ctxt.status = 200;
		ctxt.body = responseData;
	}

	async _getBoardDataDisplayChoices(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		const dbSrvc = this.$dependencies.DatabaseService;
		const displayChoices = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::tenant_panel_data_display_choices)) AS tenant_panel_data_display_choices');

		const responseData = [];
		displayChoices.rows.forEach((displayChoice) => {
			responseData.push(displayChoice.tenant_panel_data_display_choices);
		});

		ctxt.status = 200;
		ctxt.body = responseData;
	}

	async _getReportDataDisplayChoices(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		const dbSrvc = this.$dependencies.DatabaseService;
		const displayChoices = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::tenant_panel_data_display_choices)) AS tenant_panel_data_display_choices');

		const responseData = [];
		displayChoices.rows.forEach((displayChoice) => {
			responseData.push(displayChoice.tenant_panel_data_display_choices);
		});

		ctxt.status = 200;
		ctxt.body = responseData;
	}

	async _getBoardAggregationTypeChoices(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		const dbSrvc = this.$dependencies.DatabaseService;
		const displayChoices = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::tenant_panel_aggregation_type_choices)) AS tenant_panel_aggregation_type_choices');

		const responseData = [];
		displayChoices.rows.forEach((displayChoice) => {
			responseData.push(displayChoice.tenant_panel_aggregation_type_choices);
		});

		ctxt.status = 200;
		ctxt.body = responseData;
	}

	async _getBoardAggregationPeriodChoices(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		const dbSrvc = this.$dependencies.DatabaseService;
		const displayChoices = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::tenant_panel_aggregation_period_choices)) AS tenant_panel_aggregation_period_choices');

		const responseData = [];
		displayChoices.rows.forEach((displayChoice) => {
			responseData.push(displayChoice.tenant_panel_aggregation_period_choices);
		});

		ctxt.status = 200;
		ctxt.body = responseData;
	}

	async _getGatewayMaster(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		try {
			const apiSrvc = this.$dependencies.ApiService;
			const gatewayMasterData = await apiSrvc.execute('Masterdata::getGatewayHardware', ctxt);

			ctxt.status = 200;
			ctxt.body = gatewayMasterData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksCompError(`Error retrieving gateways masters`, err);
		}
	}

	async _getGatewayMasters(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		try {
			const apiSrvc = this.$dependencies.ApiService;
			const gatewayMasterData = await apiSrvc.execute('Masterdata::getSupportedGatewayHardwares', ctxt);

			ctxt.status = 200;
			ctxt.body = gatewayMasterData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksCompError(`Error retrieving gateways masters`, err);
		}
	}

	async _getGatewayHardwareProtocol(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		try {
			const apiSrvc = this.$dependencies.ApiService;
			const gatewayHardwareProtocolData = await apiSrvc.execute('Masterdata::getGatewayHardwareProtocol', ctxt);

			ctxt.status = 200;
			ctxt.body = gatewayHardwareProtocolData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksCompError(`Error retrieving gateway hardware protocol`, err);
		}
	}

	async _getGatewayCommunicationProtocol(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		try {
			const apiSrvc = this.$dependencies.ApiService;
			const gatewayCommunicationProtocolData = await apiSrvc.execute('Masterdata::getGatewayCommunicationProtocol', ctxt);

			ctxt.status = 200;
			ctxt.body = gatewayCommunicationProtocolData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksCompError(`Error retrieving gateway communication protocol`, err);
		}
	}

	async _getMachineMaster(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		try {
			const apiSrvc = this.$dependencies.ApiService;
			const machineMasterData = await apiSrvc.execute('Masterdata::getMachineHardware', ctxt);

			ctxt.status = 200;
			ctxt.body = machineMasterData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksCompError(`Error retrieving machine master`, err);
		}
	}

	async _getMachineMasters(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		try {
			const apiSrvc = this.$dependencies.ApiService;
			const machineMasterData = await apiSrvc.execute('Masterdata::getSupportedMachineHardwares', ctxt);

			ctxt.status = 200;
			ctxt.body = machineMasterData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksCompError(`Error retrieving machine masters`, err);
		}
	}

	async _getPlcMaster(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plcMasterData = await apiSrvc.execute('Masterdata::getPlcHardware', ctxt);

			ctxt.status = 200;
			ctxt.body = plcMasterData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksCompError(`Error retrieving plc master`, err);
		}
	}

	async _getPlcMasters(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plcMasterData = await apiSrvc.execute('Masterdata::getSupportedPlcHardwares', ctxt);

			ctxt.status = 200;
			ctxt.body = plcMasterData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksCompError(`Error retrieving plcs masters`, err);
		}
	}

	async _getPlcHardwareProtocol(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		try {
			const apiSrvc = this.$dependencies.ApiService;
			const plcHardwareProtocolData = await apiSrvc.execute('Masterdata::getPlcHardwareProtocol', ctxt);

			ctxt.status = 200;
			ctxt.body = plcHardwareProtocolData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksCompError(`Error retrieving plc hardware protocol`, err);
		}
	}

	async _getHardwareProtocol(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		try {
			const apiSrvc = this.$dependencies.ApiService;
			const hardwareProtocolData = await apiSrvc.execute('Masterdata::getHardwareProtocol', ctxt);

			ctxt.status = 200;
			ctxt.body = hardwareProtocolData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksCompError(`Error retrieving hardware protocol`, err);
		}
	}

	async _getCommunicationProtocol(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		try {
			const apiSrvc = this.$dependencies.ApiService;
			const communicationProtocolData = await apiSrvc.execute('Masterdata::getCommunicationProtocol', ctxt);

			ctxt.status = 200;
			ctxt.body = communicationProtocolData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksCompError(`Error retrieving communication protocol`, err);
		}
	}

	async _getPlantScheduleTypes(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		const dbSrvc = this.$dependencies.DatabaseService;
		const scheduleTypes = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::plant_schedule_type)) AS plant_schedule_type');

		const responseData = [];
		scheduleTypes.rows.forEach((scheduleTypeData) => {
			responseData.push(scheduleTypeData['plant_schedule_type']);
		});

		ctxt.status = 200;
		ctxt.body = responseData;
	}

	async _getPlantUnitScheduleTypes(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		const dbSrvc = this.$dependencies.DatabaseService;
		const scheduleTypes = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::plant_unit_schedule_type)) AS plant_unit_schedule_type');

		const responseData = [];
		scheduleTypes.rows.forEach((scheduleTypeData) => {
			responseData.push(scheduleTypeData['plant_unit_schedule_type']);
		});

		ctxt.status = 200;
		ctxt.body = responseData;
	}

	async _getPlantUnitMachineScheduleTypes(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		const dbSrvc = this.$dependencies.DatabaseService;
		const scheduleTypes = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::plant_unit_machine_schedule_type)) AS plant_unit_machine_schedule_type');

		const responseData = [];
		scheduleTypes.rows.forEach((scheduleTypeData) => {
			responseData.push(scheduleTypeData['plant_unit_machine_schedule_type']);
		});

		ctxt.status = 200;
		ctxt.body = responseData;
	}

	async _getAllEventTypes(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		try {
			const apiSrvc = this.$dependencies.ApiService;
			const eventTypeData = await apiSrvc.execute('Masterdata::getAllEventTypes');

			ctxt.status = 200;
			ctxt.body = eventTypeData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksCompError(`Error retrieving all event types`, err);
		}
	}

	async _getEventTypes(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		try {
			const apiSrvc = this.$dependencies.ApiService;
			const eventTypeData = await apiSrvc.execute('Masterdata::getEventTypes', ctxt);

			ctxt.status = 200;
			ctxt.body = eventTypeData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksCompError(`Error retrieving event types`, err);
		}
	}

	async _getAllReportRequestFormatterTypes(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const reportRequestTypes = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::tenant_report_request_types)) AS report_request_type;');

			const responseData = reportRequestTypes.rows.map((row) => {
				return row['report_request_type'];
			});

			ctxt.status = 200;
			ctxt.body = responseData;
		}
		catch(err) {
			throw new PlantWorksCompError(`Error retrieving report request types`, err);
		}
	}

	async _getAllReportResponseFormatterTypes(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const reportOutputTypes = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::tenant_report_response_types)) AS report_response_type;');


			const responseData = reportOutputTypes.rows.map((row) => {
				return row['report_response_type'];
			});

			ctxt.status = 200;
			ctxt.body = responseData;
		}
		catch(err) {
			throw new PlantWorksCompError(`Error retrieving report response formatter types`, err);
		}
	}

	async _getAllAlertResponseFormatterTypes(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const reportOutputTypes = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::tenant_alert_response_types)) AS alert_response_type;');

			const responseData = reportOutputTypes.rows.map((row) => {
				return row['alert_response_type'];
			});

			ctxt.status = 200;
			ctxt.body = responseData;
		}
		catch(err) {
			throw new PlantWorksCompError(`Error retrieving alert response formatter types`, err);
		}
	}

	async _getAllEventAlertResponseFormatterTypes(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const eventAlertOutputTypes = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::tenant_event_alert_response_types)) AS event_alert_response_type;');

			const responseData = eventAlertOutputTypes.rows.map((row) => {
				return row['event_alert_response_type'];
			});

			ctxt.status = 200;
			ctxt.body = responseData;
		}
		catch(err) {
			throw new PlantWorksCompError(`Error retrieving event alert response formatter types`, err);
		}
	}

	async _getAllTimezones(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const timezones = await dbSrvc.knex.raw('SELECT timezone_id FROM timezones ORDER BY timezone_id;');

			const responseData = timezones.rows.map((row) => {
				return row['timezone_id'];
			});

			ctxt.status = 200;
			ctxt.body = responseData;
		}
		catch(err) {
			throw new PlantWorksCompError(`Error retrieving timezones`, err);
		}
	}

	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get dependencies() {
		return ['DatabaseService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.component = Masterdata;
