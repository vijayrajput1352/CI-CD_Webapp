'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */
const safeJsonStringify = require('safe-json-stringify'); // eslint-disable-line no-unused-vars

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseMiddleware = require('plantworks-base-middleware').PlantWorksBaseMiddleware;
const PlantWorksMiddlewareError = require('plantworks-middleware-error').PlantWorksMiddlewareError;

/**
 * @class   Masterdata
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Server Masterdata middleware - manages masterdata CRUD operations.
 *
 *
 */
class Masterdata extends PlantWorksBaseMiddleware {
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

					'gateways': function() {
						return this.hasMany(self.$GatewayHardwareProtocolModel, 'protocol_id');
					}
				})
			});

			Object.defineProperty(this, '$CommunicationProtocolMasterModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'communication_protocol_master',
					'hasTimestamps': true,

					'gateways': function() {
						return this.hasMany(self.$GatewayCommunicationProtocolModel, 'protocol_id');
					}
				})
			});

			Object.defineProperty(this, '$GatewayMasterModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'gateway_master',
					'hasTimestamps': true,

					'hardwareProtocols': function() {
						return this.hasMany(self.$GatewayHardwareProtocolModel, 'gateway_id');
					},

					'communicationProtocols': function() {
						return this.hasMany(self.$GatewayCommunicationProtocolModel, 'gateway_id');
					}
				})
			});

			Object.defineProperty(this, '$GatewayHardwareProtocolModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'gateways_hardware_protocols',
					'hasTimestamps': true,

					'gateway': function() {
						return this.belongsTo(self.$GatewayMasterModel, 'gateway_id');
					},

					'protocol': function() {
						return this.belongsTo(self.$HardwareProtocolMasterModel, 'protocol_id');
					}
				})
			});

			Object.defineProperty(this, '$GatewayCommunicationProtocolModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'gateways_communication_protocols',
					'hasTimestamps': true,

					'gateway': function() {
						return this.belongsTo(self.$GatewayMasterModel, 'gateway_id');
					},

					'protocol': function() {
						return this.belongsTo(self.$CommunicationProtocolMasterModel, 'protocol_id');
					}
				})
			});

			Object.defineProperty(this, '$MachineMasterModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'machine_master',
					'hasTimestamps': true
				})
			});

			Object.defineProperty(this, '$PlcMasterModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'plc_master',
					'hasTimestamps': true,

					'hardwareProtocols': function() {
						return this.hasMany(self.$PlcHardwareProtocolModel, 'plc_id');
					}
				})
			});

			Object.defineProperty(this, '$PlcHardwareProtocolModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'plcs_hardware_protocols',
					'hasTimestamps': true,

					'plc': function() {
						return this.belongsTo(self.$PlcMasterModel, 'plc_id');
					},

					'protocol': function() {
						return this.belongsTo(self.$HardwareProtocolMasterModel, 'protocol_id');
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
		delete this.$PlcHardwareProtocolModel;
		delete this.$PlcMasterModel;
		delete this.$MachineMasterModel;
		delete this.$GatewayCommunicationProtocolModel;
		delete this.$GatewayHardwareProtocolModel;
		delete this.$GatewayMasterModel;
		delete this.$CommunicationProtocolMasterModel;
		delete this.$HardwareProtocolMasterModel;

		await super._teardown();
		return null;
	}
	// #endregion

	// #region Protected methods
	async _registerApis() {
		try {
			const ApiService = this.$dependencies.ApiService;
			await super._registerApis();

			await ApiService.add(`${this.name}::getSupportedGatewayHardwares`, this._getSupportedGatewayHardwares.bind(this));
			await ApiService.add(`${this.name}::getGatewayHardware`, this._getGatewayHardware.bind(this));

			await ApiService.add(`${this.name}::getGatewayHardwareProtocol`, this._getGatewayHardwareProtocol.bind(this));
			await ApiService.add(`${this.name}::getGatewayCommunicationProtocol`, this._getGatewayCommunicationProtocol.bind(this));

			await ApiService.add(`${this.name}::getSupportedMachineHardwares`, this._getSupportedMachineHardwares.bind(this));
			await ApiService.add(`${this.name}::getMachineHardware`, this._getMachineHardware.bind(this));

			await ApiService.add(`${this.name}::getSupportedPlcHardwares`, this._getSupportedPlcHardwares.bind(this));
			await ApiService.add(`${this.name}::getPlcHardware`, this._getPlcHardware.bind(this));

			await ApiService.add(`${this.name}::getPlcHardwareProtocol`, this._getPlcHardwareProtocol.bind(this));

			await ApiService.add(`${this.name}::getHardwareProtocol`, this._getHardwareProtocol.bind(this));
			await ApiService.add(`${this.name}::getCommunicationProtocol`, this._getCommunicationProtocol.bind(this));

			await ApiService.add(`${this.name}::getAllEventTypes`, this._getAllEventTypes.bind(this));
			await ApiService.add(`${this.name}::getEventTypes`, this._getEventTypes.bind(this));

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_registerApis`, err);
		}
	}

	async _deregisterApis() {
		try {
			const ApiService = this.$dependencies.ApiService;
			await ApiService.remove(`${this.name}::getEventTypes`, this._getEventTypes.bind(this));
			await ApiService.remove(`${this.name}::getAllEventTypes`, this._getAllEventTypes.bind(this));

			await ApiService.remove(`${this.name}::getCommunicationProtocol`, this._getCommunicationProtocol.bind(this));
			await ApiService.remove(`${this.name}::getHardwareProtocol`, this._getHardwareProtocol.bind(this));


			await ApiService.remove(`${this.name}::getPlcHardwareProtocol`, this._getPlcHardwareProtocol.bind(this));

			await ApiService.remove(`${this.name}::getPlcHardware`, this._getPlcHardware.bind(this));
			await ApiService.remove(`${this.name}::getSupportedPlcHardwares`, this._getSupportedPlcHardwares.bind(this));

			await ApiService.remove(`${this.name}::getMachineHardware`, this._getMachineHardware.bind(this));
			await ApiService.remove(`${this.name}::getSupportedMachineHardwares`, this._getSupportedMachineHardwares.bind(this));

			await ApiService.remove(`${this.name}::getGatewayCommunicationProtocol`, this._getGatewayCommunicationProtocol.bind(this));
			await ApiService.remove(`${this.name}::getGatewayHardwareProtocol`, this._getGatewayHardwareProtocol.bind(this));

			await ApiService.remove(`${this.name}::getGatewayHardware`, this._getGatewayHardware.bind(this));
			await ApiService.remove(`${this.name}::getSupportedGatewayHardwares`, this._getSupportedGatewayHardwares.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getSupportedGatewayHardwares() {
		try {
			let gatewayMasterRecords = await this.$GatewayMasterModel
				.forge()
				.fetchAll({
					'withRelated': ['hardwareProtocols', 'communicationProtocols']
				});

			gatewayMasterRecords = this._convertToJsonApiFormat(gatewayMasterRecords, 'masterdata/gateway-master', {
				'hardwareProtocols': 'masterdata/gateway-hardware-protocol',
				'communicationProtocols': 'masterdata/gateway-communication-protocol'
			});

			return gatewayMasterRecords;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getSupportedGatewayHardwares`, err);
		}
	}

	async _getGatewayHardware(ctxt) {
		try {
			const GatewayHardwareRecord = new this.$GatewayMasterModel({
				'id': ctxt.params.gateway_master_id
			});

			let gatewayHardwareData = await GatewayHardwareRecord.fetch({
				'withRelated': ['hardwareProtocols', 'communicationProtocols']
			});


			gatewayHardwareData = this._convertToJsonApiFormat(gatewayHardwareData, 'masterdata/gateway-master', {
				'hardwareProtocols': 'masterdata/gateway-hardware-protocol',
				'communicationProtocols': 'masterdata/gateway-communication-protocol'
			});

			return gatewayHardwareData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getGatewayHardware`, err);
		}
	}

	async _getGatewayHardwareProtocol(ctxt) {
		try {
			const GatewayHardwareProtocolRecord = new this.$GatewayHardwareProtocolModel({
				'id': ctxt.params.gateway_hardware_protocol_id
			});

			let gatewayHardwareProtocolData = await GatewayHardwareProtocolRecord.fetch({
				'withRelated': ['gateway', 'protocol']
			});


			gatewayHardwareProtocolData = this._convertToJsonApiFormat(gatewayHardwareProtocolData, 'masterdata/gateway-hardware-protocol', {
				'gateway': 'masterdata/gateway-master',
				'protocol': 'masterdata/hardware-protocol-master'
			});

			return gatewayHardwareProtocolData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getGatewayHardwareProtocol`, err);
		}
	}

	async _getGatewayCommunicationProtocol(ctxt) {
		try {
			const GatewayCommunicationProtocolRecord = new this.$GatewayCommunicationProtocolModel({
				'id': ctxt.params.gateway_communication_protocol_id
			});

			let gatewayCommunicationProtocolData = await GatewayCommunicationProtocolRecord.fetch({
				'withRelated': ['gateway', 'protocol']
			});


			gatewayCommunicationProtocolData = this._convertToJsonApiFormat(gatewayCommunicationProtocolData, 'masterdata/gateway-communication-protocol', {
				'gateway': 'masterdata/gateway-master',
				'protocol': 'masterdata/communication-protocol-master'
			});

			return gatewayCommunicationProtocolData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getGatewayCommunicationProtocol`, err);
		}
	}

	async _getSupportedMachineHardwares() {
		try {
			let machineMasterRecords = await this.$MachineMasterModel
				.forge()
				.fetchAll();

			machineMasterRecords = this._convertToJsonApiFormat(machineMasterRecords, 'masterdata/machine-master');
			return machineMasterRecords;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getSupportedMachineHardwares`, err);
		}
	}

	async _getMachineHardware(ctxt) {
		try {
			const MachineHardwareRecord = new this.$MachineMasterModel({
				'id': ctxt.params.machine_master_id
			});

			let machineHardwareData = await MachineHardwareRecord.fetch();


			machineHardwareData = this._convertToJsonApiFormat(machineHardwareData, 'masterdata/machine-master');
			return machineHardwareData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getMachineHardware`, err);
		}
	}

	async _getSupportedPlcHardwares() {
		try {
			let plcMasterRecords = await this.$PlcMasterModel
				.forge()
				.fetchAll({
					'withRelated': ['hardwareProtocols']
				});

			plcMasterRecords = this._convertToJsonApiFormat(plcMasterRecords, 'masterdata/plc-master', {
				'hardwareProtocols': 'masterdata/plc-hardware-protocol'
			});

			return plcMasterRecords;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getSupportedPlcHardwares`, err);
		}
	}

	async _getPlcHardware(ctxt) {
		try {
			const PlcHardwareRecord = new this.$PlcMasterModel({
				'id': ctxt.params.plc_master_id
			});

			let plcHardwareData = await PlcHardwareRecord.fetch({
				'withRelated': ['hardwareProtocols']
			});


			plcHardwareData = this._convertToJsonApiFormat(plcHardwareData, 'masterdata/plc-master', {
				'hardwareProtocols': 'masterdata/plc-hardware-protocol'
			});

			return plcHardwareData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getPlcHardware`, err);
		}
	}

	async _getPlcHardwareProtocol(ctxt) {
		try {
			const PlcHardwareProtocolRecord = new this.$PlcHardwareProtocolModel({
				'id': ctxt.params.plc_hardware_protocol_id
			});

			let plcHardwareProtocolData = await PlcHardwareProtocolRecord.fetch({
				'withRelated': ['plc', 'protocol']
			});


			plcHardwareProtocolData = this._convertToJsonApiFormat(plcHardwareProtocolData, 'masterdata/plc-hardware-protocol', {
				'plc': 'masterdata/plc-master',
				'protocol': 'masterdata/hardware-protocol-master'
			});

			return plcHardwareProtocolData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getPlcHardwareProtocol`, err);
		}
	}

	async _getHardwareProtocol(ctxt) {
		try {
			const HardwareProtocolRecord = new this.$HardwareProtocolMasterModel({
				'id': ctxt.params.hardware_protocol_id
			});

			let hardwareProtocolData = await HardwareProtocolRecord.fetch({
				'withRelated': ['gateways']
			});


			hardwareProtocolData = this._convertToJsonApiFormat(hardwareProtocolData, 'masterdata/hardware-protocol-master', {
				'gateways': 'masterdata/gateway-hardware-protocol'
			});

			return hardwareProtocolData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getHardwareProtocol`, err);
		}
	}

	async _getCommunicationProtocol(ctxt) {
		try {
			const CommunicationProtocolRecord = new this.$CommunicationProtocolMasterModel({
				'id': ctxt.params.communication_protocol_id
			});

			let communicationProtocolData = await CommunicationProtocolRecord.fetch({
				'withRelated': ['gateways']
			});


			communicationProtocolData = this._convertToJsonApiFormat(communicationProtocolData, 'masterdata/communication-protocol-master', {
				'gateways': 'masterdata/gateway-communication-protocol'
			});

			return communicationProtocolData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getCommunicationProtocol`, err);
		}
	}
	async _getAllEventTypes() {
		try {
			let eventTypeRecords = await this.$EventTypeModel
				.forge()
				.fetchAll();

			eventTypeRecords = this._convertToJsonApiFormat(eventTypeRecords, 'masterdata/event-type', {
			});

			return eventTypeRecords;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllEventTypes`, err);
		}
	}

	async _getEventTypes(ctxt) {
		try {
			let eventTypeRecord = new this.$EventTypeModel({
				'id': ctxt.params.event_id
			});

			eventTypeRecord = await eventTypeRecord.fetch();

			eventTypeRecord = this._convertToJsonApiFormat(eventTypeRecord, 'masterdata/event-type', {
			});

			return eventTypeRecord;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getEventTypes`, err);
		}
	}

	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.middleware = Masterdata;
