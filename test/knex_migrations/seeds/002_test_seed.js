'use strict';

exports.seed = async function(knex) {
	// Step 0: Getting the basic server details...
	let parentId = await knex.raw(`SELECT id FROM modules WHERE name = ? AND type = 'server' AND parent_id IS NULL`, ['PlantWorksWebappServer']);
	if(!parentId.rows.length)
		return null;

	parentId = parentId.rows[0]['id'];

	// Insert the manufacturing feature
	let featureId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [parentId, 'Manufacturing']);
	if(!featureId.rows.length) {
		featureId = await knex('modules').insert({
			'parent_id': parentId,
			'type': 'feature',
			'deploy': 'custom',
			'name': 'Manufacturing',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.19.8',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		})
		.returning('id');

		featureId = featureId[0];

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'manufacturing-read',
			'implies_permissions': '["config-access", "devenv-access"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'manufacturing-update',
			'implies_permissions': '["manufacturing-read"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'manufacturing-create',
			'implies_permissions': '["manufacturing-update"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'manufacturing-delete',
			'implies_permissions': '["manufacturing-update"]'
		});

	}
	else {
		featureId = featureId.rows[0]['id'];
	}


	// Insert supported Hardware Protocols
	let modbusRTUId = await knex.raw(`SELECT id FROM hardware_protocol_master WHERE name = ? AND version = ?`, ['Modbus', 'RTU']);
	if(!modbusRTUId.rows.length) {
		modbusRTUId = await knex('hardware_protocol_master').insert({
			'name': 'Modbus',
			'version': 'RTU',
			'description': 'Serial Communication with PLC / Controller'
		})
		.returning('id');

		modbusRTUId = modbusRTUId[0];
	}
	else {
		modbusRTUId = modbusRTUId.rows[0]['id'];
	}

	let modbusTCPId = await knex.raw(`SELECT id FROM hardware_protocol_master WHERE name = ? AND version = ?`, ['Modbus', 'TCP']);
	if(!modbusTCPId.rows.length) {
		modbusTCPId = await knex('hardware_protocol_master').insert({
			'name': 'Modbus',
			'version': 'TCP',
			'description': 'TCP/IP Communication with PLC / Controller'
		})
		.returning('id');

		modbusTCPId = modbusTCPId[0];
	}
	else {
		modbusTCPId = modbusTCPId.rows[0]['id'];
	}

	let fileParseId = await knex.raw(`SELECT id FROM hardware_protocol_master WHERE name = ? AND version = ?`, ['File Parse', '2.0.3']);
	if(!fileParseId.rows.length) {
		fileParseId = await knex('hardware_protocol_master').insert({
			'name': 'File Parse',
			'version': '2.0.3',
			'description': 'Parse file written by SCADA systems, etc.'
		})
		.returning('id');

		fileParseId = fileParseId[0];
	}
	else {
		fileParseId = fileParseId.rows[0]['id'];
	}

	// Insert supported Communication Protocols
	let httpsId = await knex.raw(`SELECT id FROM communication_protocol_master WHERE name = ? AND version = ?`, ['HTTPS', '1.1']);
	if(!httpsId.rows.length) {
		httpsId = await knex('communication_protocol_master').insert({
			'name': 'HTTPS',
			'version': '1.1',
			'is_bidirectional': false,
			'description': 'Upload data via HTTPS'
		})
		.returning('id');

		httpsId = httpsId[0];
	}
	else {
		httpsId = httpsId.rows[0]['id'];
	}

	let mqttsId = await knex.raw(`SELECT id FROM communication_protocol_master WHERE name = ? AND version = ?`, ['MQTTS', '1.1']);
	if(!mqttsId.rows.length) {
		mqttsId = await knex('communication_protocol_master').insert({
			'name': 'MQTTS',
			'version': '1.1',
			'is_bidirectional': true,
			'description': 'Upload data via MQTTS'
		})
		.returning('id');

		mqttsId = mqttsId[0];
	}
	else {
		mqttsId = mqttsId.rows[0]['id'];
	}

	// Insert supported Gateways
	let winSrvcId = await knex.raw(`SELECT id FROM gateway_master WHERE name = ?`, ['Windows Service']);
	if(!winSrvcId.rows.length) {
		winSrvcId = await knex('gateway_master').insert({
			'name': 'Windows Service',
			'manufacturer': 'Plant.Works',
			'category': 'File Driver',
			'model': 'W2.0.3',
			'description': 'Standard Windows Service used to upload data written to file by SCADA systems, et al.'
		})
		.returning('id');

		winSrvcId = winSrvcId[0];
	}
	else {
		winSrvcId = winSrvcId.rows[0]['id'];
	}

	let linuxDaemonId = await knex.raw(`SELECT id FROM gateway_master WHERE name = ?`, ['Linux Daemon']);
	if(!linuxDaemonId.rows.length) {
		linuxDaemonId = await knex('gateway_master').insert({
			'name': 'Linux Daemon',
			'manufacturer': 'Plant.Works',
			'category': 'File Driver',
			'model': 'L2.0.3',
			'description': 'Standard Linux Daemon used to upload data written to file by SCADA systems, et al.'
		})
		.returning('id');

		linuxDaemonId = linuxDaemonId[0];
	}
	else {
		linuxDaemonId = linuxDaemonId.rows[0]['id'];
	}

	let raspPiId = await knex.raw(`SELECT id FROM gateway_master WHERE name = ?`, ['Raspberry Pi']);
	if(!raspPiId.rows.length) {
		raspPiId = await knex('gateway_master').insert({
			'name': 'Raspberry Pi',
			'manufacturer': 'Plant.Works',
			'category': 'SoC Driver',
			'model': 'R2.0.3',
			'description': 'Raspberry Pi configured with the Plant.Works daemon'
		})
		.returning('id');

		raspPiId = raspPiId[0];
	}
	else {
		raspPiId = raspPiId.rows[0]['id'];
	}

	let orangePiId = await knex.raw(`SELECT id FROM gateway_master WHERE name = ?`, ['Orange Pi']);
	if(!orangePiId.rows.length) {
		orangePiId = await knex('gateway_master').insert({
			'name': 'Orange Pi',
			'manufacturer': 'Plant.Works',
			'category': 'SoC Driver',
			'model': 'O2.0.3',
			'description': 'Orange Pi configured with the Plant.Works daemon'
		})
		.returning('id');

		orangePiId = orangePiId[0];
	}
	else {
		orangePiId = orangePiId.rows[0]['id'];
	}

	let flexyId = await knex.raw(`SELECT id FROM gateway_master WHERE name = ?`, ['Ewon Flexy']);
	if(!flexyId.rows.length) {
		flexyId = await knex('gateway_master').insert({
			'name': 'Ewon Flexy',
			'manufacturer': 'Ewon Corporation',
			'category': 'SoC Driver',
			'model': 'V1.1.1',
			'description': 'Ewon Flexy Series of Hardwares'
		})
		.returning('id');

		flexyId = flexyId[0];
	}
	else {
		flexyId = flexyId.rows[0]['id'];
	}

	// Map Gateways to supported Hardware Protocols
	let winSrvcHardwareProtocolId = await knex.raw(`SELECT id FROM gateways_hardware_protocols WHERE gateway_id = ? AND protocol_id = ?`, [winSrvcId, fileParseId]);
	if(!winSrvcHardwareProtocolId.rows.length) {
		await knex('gateways_hardware_protocols').insert({
			'gateway_id': winSrvcId,
			'protocol_id': fileParseId
		});
	}

	let linuxDaemonHardwareProtocolId = await knex.raw(`SELECT id FROM gateways_hardware_protocols WHERE gateway_id = ? AND protocol_id = ?`, [linuxDaemonId, fileParseId]);
	if(!linuxDaemonHardwareProtocolId.rows.length) {
		await knex('gateways_hardware_protocols').insert({
			'gateway_id': linuxDaemonId,
			'protocol_id': fileParseId
		});
	}

	let raspPiHardwareProtocolId = await knex.raw(`SELECT id FROM gateways_hardware_protocols WHERE gateway_id = ? AND protocol_id = ?`, [raspPiId, fileParseId]);
	if(!raspPiHardwareProtocolId.rows.length) {
		await knex('gateways_hardware_protocols').insert({
			'gateway_id': raspPiId,
			'protocol_id': fileParseId
		});
	}

	raspPiHardwareProtocolId = await knex.raw(`SELECT id FROM gateways_hardware_protocols WHERE gateway_id = ? AND protocol_id = ?`, [raspPiId, modbusRTUId]);
	if(!raspPiHardwareProtocolId.rows.length) {
		await knex('gateways_hardware_protocols').insert({
			'gateway_id': raspPiId,
			'protocol_id': modbusRTUId
		});
	}

	raspPiHardwareProtocolId = await knex.raw(`SELECT id FROM gateways_hardware_protocols WHERE gateway_id = ? AND protocol_id = ?`, [raspPiId, modbusTCPId]);
	if(!raspPiHardwareProtocolId.rows.length) {
		await knex('gateways_hardware_protocols').insert({
			'gateway_id': raspPiId,
			'protocol_id': modbusTCPId
		});
	}

	let orangePiHardwareProtocolId = await knex.raw(`SELECT id FROM gateways_hardware_protocols WHERE gateway_id = ? AND protocol_id = ?`, [orangePiId, fileParseId]);
	if(!orangePiHardwareProtocolId.rows.length) {
		await knex('gateways_hardware_protocols').insert({
			'gateway_id': orangePiId,
			'protocol_id': fileParseId
		});
	}

	orangePiHardwareProtocolId = await knex.raw(`SELECT id FROM gateways_hardware_protocols WHERE gateway_id = ? AND protocol_id = ?`, [orangePiId, modbusRTUId]);
	if(!orangePiHardwareProtocolId.rows.length) {
		await knex('gateways_hardware_protocols').insert({
			'gateway_id': orangePiId,
			'protocol_id': modbusRTUId
		});
	}

	orangePiHardwareProtocolId = await knex.raw(`SELECT id FROM gateways_hardware_protocols WHERE gateway_id = ? AND protocol_id = ?`, [orangePiId, modbusTCPId]);
	if(!raspPiHardwareProtocolId.rows.length) {
		await knex('gateways_hardware_protocols').insert({
			'gateway_id': orangePiId,
			'protocol_id': modbusTCPId
		});
	}

	let flexyHardwareProtocolId = await knex.raw(`SELECT id FROM gateways_hardware_protocols WHERE gateway_id = ? AND protocol_id = ?`, [flexyId, modbusRTUId]);
	if(!flexyHardwareProtocolId.rows.length) {
		await knex('gateways_hardware_protocols').insert({
			'gateway_id': flexyId,
			'protocol_id': modbusRTUId
		});
	}

	flexyHardwareProtocolId = await knex.raw(`SELECT id FROM gateways_hardware_protocols WHERE gateway_id = ? AND protocol_id = ?`, [flexyId, modbusTCPId]);
	if(!flexyHardwareProtocolId.rows.length) {
		await knex('gateways_hardware_protocols').insert({
			'gateway_id': flexyId,
			'protocol_id': modbusTCPId
		});
	}

	// Map Gateways to supported Communication Protocols
	let winSrvcCommunicationProtocolId = await knex.raw(`SELECT id FROM gateways_communication_protocols WHERE gateway_id = ? AND protocol_id = ?`, [winSrvcId, httpsId]);
	if(!winSrvcCommunicationProtocolId.rows.length) {
		await knex('gateways_communication_protocols').insert({
			'gateway_id': winSrvcId,
			'protocol_id': httpsId
		});
	}

	let linuxDaemonCommunicationProtocolId = await knex.raw(`SELECT id FROM gateways_communication_protocols WHERE gateway_id = ? AND protocol_id = ?`, [linuxDaemonId, httpsId]);
	if(!linuxDaemonCommunicationProtocolId.rows.length) {
		await knex('gateways_communication_protocols').insert({
			'gateway_id': linuxDaemonId,
			'protocol_id': httpsId
		});
	}

	let raspPiCommunicationProtocolId = await knex.raw(`SELECT id FROM gateways_communication_protocols WHERE gateway_id = ? AND protocol_id = ?`, [raspPiId, httpsId]);
	if(!raspPiCommunicationProtocolId.rows.length) {
		await knex('gateways_communication_protocols').insert({
			'gateway_id': raspPiId,
			'protocol_id': httpsId
		});
	}

	let orangePiCommunicationProtocolId = await knex.raw(`SELECT id FROM gateways_communication_protocols WHERE gateway_id = ? AND protocol_id = ?`, [orangePiId, httpsId]);
	if(!orangePiCommunicationProtocolId.rows.length) {
		await knex('gateways_communication_protocols').insert({
			'gateway_id': orangePiId,
			'protocol_id': httpsId
		});
	}

	let flexyCommunicationProtocolId = await knex.raw(`SELECT id FROM gateways_communication_protocols WHERE gateway_id = ? AND protocol_id = ?`, [flexyId, httpsId]);
	if(!flexyCommunicationProtocolId.rows.length) {
		await knex('gateways_communication_protocols').insert({
			'gateway_id': flexyId,
			'protocol_id': httpsId
		});
	}

	// Insert supported Plcs
	let noxViewId = await knex.raw(`SELECT id FROM plc_master WHERE name = ?`, ['Nox View']);
	if(!noxViewId.rows.length) {
		noxViewId = await knex('plc_master').insert({
			'name': 'Nox View',
			'manufacturer': 'Nutron Systems',
			'category': 'LabView Extension',
			'model': 'W2.0.3',
			'firmware_version': '1.1.4-NULB20109',
			'description': 'LabView based system to act as a PLC / SCADA for the rest of the Plant.Works stack'
		})
		.returning('id');

		noxViewId = noxViewId[0];
	}
	else {
		noxViewId = noxViewId.rows[0]['id'];
	}

	// Map PLCs to supported Hardware Protocols
	let noxViewHardwareProtocolId = await knex.raw(`SELECT id FROM plcs_hardware_protocols WHERE plc_id = ? AND protocol_id = ?`, [noxViewId, fileParseId]);
	if(!noxViewHardwareProtocolId.rows.length) {
		await knex('plcs_hardware_protocols').insert({
			'plc_id': noxViewId,
			'protocol_id': fileParseId
		});
	}

	let tenantId = await knex.raw('SELECT id FROM tenants WHERE sub_domain =\'pw\'');
	tenantId = tenantId.rows[0]['id'];

	let tenantFolderId = await knex.raw('SELECT id FROM tenant_folders WHERE tenant_id = ? AND name = ?', [tenantId, 'manufacturing_feature.folder_names.plants.name']);
	tenantFolderId = tenantFolderId.rows[0]['id'];

	// Create a new Adani plant for testing
	let adaniPlantId = await knex.raw(`SELECT id FROM tenant_plants WHERE tenant_id = ? AND name = 'Adani Wilmar'`, [tenantId]);
	if(!adaniPlantId.rows.length) {
		adaniPlantId = await knex('tenant_plants').insert({
			'tenant_id': tenantId,
			'tenant_folder_id': tenantFolderId,
			'name': 'Adani Wilmar',
			'description': 'Adani Wilmar Plant description'
		})
		.returning('id');

		adaniPlantId = adaniPlantId[0];
	}
	else {
		adaniPlantId = adaniPlantId.rows[0]['id'];
	}

	// Create a plant unit of Adani wilmar for testing
	let adaniPlantUnitId = await knex.raw(`SELECT id FROM tenant_plant_units WHERE tenant_plant_id = ? AND name = 'Neemuch Plant'`, [adaniPlantId]);
	if(!adaniPlantUnitId.rows.length) {
		adaniPlantUnitId = await knex('tenant_plant_units').insert({
			'tenant_id': tenantId,
			'tenant_plant_id': adaniPlantId,
			'name': 'Neemuch Plant',
			'description': 'Neemuch Plant description'
		})
		.returning('id');

		adaniPlantUnitId = adaniPlantUnitId[0];
	}
	else {
		adaniPlantUnitId = adaniPlantUnitId.rows[0]['id'];
	}

	// Create a new pouch machine 1 under Adani unit for testing
	let pouchMachine1Id = await knex.raw(`SELECT id FROM tenant_plant_unit_machines WHERE tenant_plant_unit_id = ? AND name = 'Pouch Machine 1'`, [adaniPlantUnitId]);
	if(!pouchMachine1Id.rows.length) {
		pouchMachine1Id = await knex('tenant_plant_unit_machines').insert({
			'id': '450949a0-43b4-484a-8982-f5a6586568c0',
			'tenant_id': tenantId,
			'tenant_plant_unit_id': adaniPlantUnitId,
			'name': 'Pouch Machine 1',
			'description': 'Pouch Machine 1 description',
			'data_persistence_period': 183
		})
		.returning('id');

		pouchMachine1Id = pouchMachine1Id[0];
	}
	else {
		pouchMachine1Id = pouchMachine1Id.rows[0]['id'];
	}

	// Create a new pouch machine 2 under Adani unit for testing
	let pouchMachine2Id = await knex.raw(`SELECT id FROM tenant_plant_unit_machines WHERE tenant_plant_unit_id = ? AND name = 'Pouch Machine 2'`, [adaniPlantUnitId]);
	if(!pouchMachine2Id.rows.length) {
		pouchMachine2Id = await knex('tenant_plant_unit_machines').insert({
			'id': '2aaceeea-d7aa-48bd-9809-0abe9668541f',
			'tenant_id': tenantId,
			'tenant_plant_unit_id': adaniPlantUnitId,
			'name': 'Pouch Machine 2',
			'description': 'Pouch Machine 2 description',
			'data_persistence_period': 183
		})
		.returning('id');

		pouchMachine2Id = pouchMachine2Id[0];
	}
	else {
		pouchMachine2Id = pouchMachine2Id.rows[0]['id'];
	}

	// Create a new pouch machine 3 under Adani unit for testing
	let pouchMachine3Id = await knex.raw(`SELECT id FROM tenant_plant_unit_machines WHERE tenant_plant_unit_id = ? AND name = 'Pouch Machine 3'`, [adaniPlantUnitId]);
	if(!pouchMachine3Id.rows.length) {
		pouchMachine3Id = await knex('tenant_plant_unit_machines').insert({
			'id': 'ab110b6d-ea61-41eb-bc9c-17e7aa7781c0',
			'tenant_id': tenantId,
			'tenant_plant_unit_id': adaniPlantUnitId,
			'name': 'Pouch Machine 3',
			'description': 'Pouch Machine 3 description',
			'data_persistence_period': 183
		})
		.returning('id');

		pouchMachine3Id = pouchMachine3Id[0];
	}
	else {
		pouchMachine3Id = pouchMachine3Id.rows[0]['id'];
	}

	// Create a new pouch machine 4 under Adani unit for testing
	let pouchMachine4Id = await knex.raw(`SELECT id FROM tenant_plant_unit_machines WHERE tenant_plant_unit_id = ? AND name = 'Pouch Machine 4'`, [adaniPlantUnitId]);
	if(!pouchMachine4Id.rows.length) {
		pouchMachine4Id = await knex('tenant_plant_unit_machines').insert({
			'id': 'ad48a267-8090-4063-a786-7d227ccd236f',
			'tenant_id': tenantId,
			'tenant_plant_unit_id': adaniPlantUnitId,
			'name': 'Pouch Machine 4',
			'description': 'Pouch Machine 4 description',
			'data_persistence_period': 183
		})
		.returning('id');

		pouchMachine4Id = pouchMachine4Id[0];
	}
	else {
		pouchMachine4Id = pouchMachine4Id.rows[0]['id'];
	}

	// Create a new pouch machine 5 under Adani unit for testing
	let pouchMachine5Id = await knex.raw(`SELECT id FROM tenant_plant_unit_machines WHERE tenant_plant_unit_id = ? AND name = 'Pouch Machine 5'`, [adaniPlantUnitId]);
	if(!pouchMachine5Id.rows.length) {
		pouchMachine5Id = await knex('tenant_plant_unit_machines').insert({
			'id': '6603dd7d-9660-47a7-8316-68cb6e2aa15b',
			'tenant_id': tenantId,
			'tenant_plant_unit_id': adaniPlantUnitId,
			'name': 'Pouch Machine 5',
			'description': 'Pouch Machine 5 description',
			'data_persistence_period': 183
		})
		.returning('id');

		pouchMachine5Id = pouchMachine5Id[0];
	}
	else {
		pouchMachine5Id = pouchMachine5Id.rows[0]['id'];
	}

	// Get the attribute set folder, etc....
	let attributeSetFolderId = await knex.raw(`SELECT id FROM tenant_folders WHERE tenant_id = ? AND name = 'manufacturing_feature.folder_names.attribute_sets.name'`, [tenantId]);
	attributeSetFolderId = attributeSetFolderId.rows[0]['id'];

	let tenantModuleId = await knex.raw(`SELECT id FROM tenants_modules WHERE tenant_id = ? AND module_id = ?`, [tenantId, featureId]);
	tenantModuleId = tenantModuleId.rows[0]['id'];

	// Create new Machine Attribute Set for Adani Plant Unit Machines for testing
	let pouchMachineAttributeSetId = await knex.raw(`SELECT id FROM tenant_attribute_sets WHERE tenant_id = ? AND name = 'Pouch Machine Data Set'`, [tenantId]);
	if(!pouchMachineAttributeSetId.rows.length) {
		pouchMachineAttributeSetId = await knex('tenant_attribute_sets').insert({
			'tenant_id': tenantId,
			'tenant_module_id': tenantModuleId,
			'tenant_folder_id': attributeSetFolderId,
			'name': 'Pouch Machine Data Set',
			'description': 'Pouch Machine Data Set description'
		})
		.returning('id');

		pouchMachineAttributeSetId = pouchMachineAttributeSetId[0];
	}
	else {
		pouchMachineAttributeSetId = pouchMachineAttributeSetId.rows[0]['id'];
	}

	// Assign Pouch Machine Attribute Set to all five Adani Machines for testing
	await knex.raw(`INSERT INTO tenant_plant_unit_machines_attribute_sets (tenant_id, tenant_plant_unit_machine_id, tenant_attribute_set_id) VALUES (?, ?, ?) ON CONFLICT DO NOTHING`, [tenantId, pouchMachine1Id, pouchMachineAttributeSetId]);
	await knex.raw(`INSERT INTO tenant_plant_unit_machines_attribute_sets (tenant_id, tenant_plant_unit_machine_id, tenant_attribute_set_id) VALUES (?, ?, ?) ON CONFLICT DO NOTHING`, [tenantId, pouchMachine2Id, pouchMachineAttributeSetId]);
	await knex.raw(`INSERT INTO tenant_plant_unit_machines_attribute_sets (tenant_id, tenant_plant_unit_machine_id, tenant_attribute_set_id) VALUES (?, ?, ?) ON CONFLICT DO NOTHING`, [tenantId, pouchMachine3Id, pouchMachineAttributeSetId]);
	await knex.raw(`INSERT INTO tenant_plant_unit_machines_attribute_sets (tenant_id, tenant_plant_unit_machine_id, tenant_attribute_set_id) VALUES (?, ?, ?) ON CONFLICT DO NOTHING`, [tenantId, pouchMachine4Id, pouchMachineAttributeSetId]);
	await knex.raw(`INSERT INTO tenant_plant_unit_machines_attribute_sets (tenant_id, tenant_plant_unit_machine_id, tenant_attribute_set_id) VALUES (?, ?, ?) ON CONFLICT DO NOTHING`, [tenantId, pouchMachine5Id, pouchMachineAttributeSetId]);

	// Create Adani Pouch Machine Attribute Set properties for testing
	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, pouchMachineAttributeSetId, 'Actual speed', 'Pouch Machine Data Set -> Actual Speed', 'ACTUAL_SPEED', 'input', 'number']
	);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, pouchMachineAttributeSetId, 'Alarm Code', 'Pouch Machine Data Set -> Alarm Code', 'ALARM_CODE', 'input', 'number']
	);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, pouchMachineAttributeSetId, 'Feeder On', 'Pouch Machine Data Set -> Feeder On', 'FEEDER_ON', 'input', 'number']
	);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, pouchMachineAttributeSetId, 'IDLE_REASONS', 'Pouch Machine Data Set -> IDLE_REASONS', 'IDLE_REASONS', 'input', 'number']
	);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, pouchMachineAttributeSetId, 'Machine On', 'Pouch Machine Data Set -> Machine On', 'MACHINE_ON', 'input', 'number']
	);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, pouchMachineAttributeSetId, 'Pouch Counts', 'Pouch Machine Data Set -> Pouch Counts', 'POUCH_COUNTS', 'input', 'number']
	);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, pouchMachineAttributeSetId, 'Pouch Length', 'Pouch Machine Data Set -> Pouch Length', 'POUCH_LENGTH', 'input', 'number']
	);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, pouchMachineAttributeSetId, 'Set Speed', 'Pouch Machine Data Set -> Set Speed', 'SET_SPEED', 'input', 'number']
	);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, pouchMachineAttributeSetId, 'Standard Production Shift', 'Pouch Machine Data Set -> Standard Production Shift', 'STANDARD_PRODUCTION_SHIFT', 'static', 'number']
	);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, pouchMachineAttributeSetId, 'Design Speed', 'Pouch Machine Data Set -> Design Speed', 'DESIGN_SPEED', 'static', 'number']
	);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, pouchMachineAttributeSetId, 'Standard Speed', 'Pouch Machine Data Set -> Standard Speed', 'STANDARD_SPEED', 'static', 'number']
	);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, pouchMachineAttributeSetId, 'HOURLY SPEED', 'Adani Wilmar Machine Data Set -> HOURLY SPEED', 'HOURLY_SPEED', 'generated', 'number']
	);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, pouchMachineAttributeSetId, 'HOURLY PRODUCTION COUNT', 'Adani Wilmar Machine Data Set -> HOURLY PRODUCTION COUNT', 'HOURLY_PRODUCTION_COUNT', 'generated', 'number']
	);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		source,
		datatype,
		timestamp_format
	)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, pouchMachineAttributeSetId, 'ERN RSV CLIENT TIMESTAMP', 'Adani Wilmar Machine Data Set -> ERN RSV CLIENT TIMESTAMP', 'ERN_RSV_CLIENT_TIMESTAMP', 'input', 'date', 'unix_epoch_with_milliseconds']
);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		source,
		evaluation_expression,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, pouchMachineAttributeSetId, 'Test Computed Parameter', 'Pouch Machine Data Set -> Test Computed Parameter', 'TEST_COMPUTED_PARAMETER', 'computed', 'ACTUAL_SPEED+POUCH_LENGTH', 'number']
	);

	// Test Before Function

	let beforeFunctionId = await knex.raw(`SELECT id FROM tenant_attribute_set_functions WHERE tenant_id = ? AND name = 'TEST BEFORE FUNCTION'`, [tenantId]);
	if(!beforeFunctionId.rows.length) {
		beforeFunctionId = await knex('tenant_attribute_set_functions').insert({
				'tenant_id': tenantId,
				'attribute_set_id': pouchMachineAttributeSetId,
				'name': 'TEST BEFORE FUNCTION',
				'type': 'pre',
				'description': 'Adani Wilmar Machine Data Set -> TEST BEFORE FUNCTION',
				'code': `const getValues = function(machineData){
					let valueArr = [];
					valueArr = machineData.map(data=>{return data.value});
					return valueArr;
				}
				try{
					  //machine table id and keyspace
					  const keyspace = 'pw';
					  const tableId = \`machine_\${this.#id.replace(/-/g, "_")}\`;
					  const paramQuery = \`select * from \${keyspace}.\${tableId} where internal_tag = 'POUCH_LENGTH' order by generated_at desc limit 1\`;

					  const queryData =  await this.$cassandra.execute(paramQuery, {prepare: true});
					  let queryValues = getValues(queryData.rows);
				        if(!this.POUCH_LENGTH) this.POUCH_LENGTH = queryValues[0];
				}
				catch(err){
					console.error('Observer function :: adani -> hourly production count ', err);
				}`
			})
			.returning('id');

		beforeFunctionId = beforeFunctionId[0];
	}
	else {
		beforeFunctionId = beforeFunctionId.rows[0]['id'];
	}

	// Test After Function

	let afterFunctionId = await knex.raw(`SELECT id FROM tenant_attribute_set_functions WHERE tenant_id = ? AND name = 'TEST AFTER FUNCTION'`, [tenantId]);
	if(!afterFunctionId.rows.length) {
		afterFunctionId = await knex('tenant_attribute_set_functions').insert({
				'tenant_id': tenantId,
				'attribute_set_id': pouchMachineAttributeSetId,
				'name': 'TEST AFTER FUNCTION',
				'type': 'post',
				'description': 'Adani Wilmar Machine Data Set -> TEST AFTER FUNCTION',
				'code': `const getValues = function(machineData){
					let valueArr = [];
					valueArr = machineData.map(data=>{return data.value});
					return valueArr;
				}
				try{
					  //machine table id and keyspace
					  const keyspace = 'pw';
					  const tableId = \`machine_\${this.#id.replace(/-/g, "_")}\`;
					  const paramQuery = \`select * from \${keyspace}.\${tableId} where internal_tag = 'SET_SPEED' order by generated_at desc limit 1\`;

					  const queryData =  await this.$cassandra.execute(paramQuery, {prepare: true});
					  let queryValues = getValues(queryData.rows);
				        if(!this.SET_SPEED) this.SET_SPEED = queryValues[0];
				}
				catch(err){
					console.error('Observer function :: adani -> hourly production count ', err);
				}`
			})
			.returning('id');

		afterFunctionId = afterFunctionId[0];
	}
	else {
		afterFunctionId = afterFunctionId.rows[0]['id'];
	}

	// Generated Parameter

	let clientTimestampId = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE attribute_set_id = ? AND internal_tag = 'POUCH_COUNTS'`, [pouchMachineAttributeSetId]);
	clientTimestampId = clientTimestampId.rows[0]['id'];


	let hourlyProductionId = await knex.raw(`SELECT id FROM tenant_attribute_set_functions WHERE tenant_id = ? AND name = 'HOURLY PRODUCTION COUNT'`, [tenantId]);
	if(!hourlyProductionId.rows.length) {
		hourlyProductionId = await knex('tenant_attribute_set_functions').insert({
				'tenant_id': tenantId,
				'attribute_set_id': pouchMachineAttributeSetId,
				'name': 'HOURLY PRODUCTION COUNT',
				'description': 'Adani Wilmar Machine Data Set -> HOURLY PRODUCTION COUNT',
				'code': `const _calculateStatParameter =  function(data) {
					var allCountsLastHour = data,
						self = this;
					// Convert all the values to numbers...
					allCountsLastHour.forEach(function (dataPoint, index) {
						allCountsLastHour[index] = Number(dataPoint);
					});
					// Setup sequences
					var sequences = [];
					sequences.push([]);
					allCountsLastHour.forEach(function (dataPoint, index) {
						var currentSequence = sequences[(sequences.length - 1)];
						// Always consider first values
						if(index == 0) {
							currentSequence.push(dataPoint);
							return;
						}
						var diff = dataPoint - allCountsLastHour[(index - 1)];
						(diff >= 0) ? currentSequence.push(dataPoint) : sequences.push([dataPoint]);
					});
					// Eliminate single-value "sequences" - they're clearly anomalies
					sequences = sequences.filter((sequence) => {
						return sequence.length >= 2;
					});
					// For each of the remaining sequences, calculate median diff and split them further
					var splitSequences = [];
					sequences.forEach((sequence) => {
						var diffs = [],
							halfWay = null,
							averageDiff = null,
							medianDiff = null;
						sequence.forEach(function(dataPoint, index) {
							if(index == 0) return;
							diffs.push(dataPoint - sequence[(index-1)]);
						});
						diffs.sort(function(a, b) { return (a - b); });
						halfWay = Math.floor(diffs.length / 2);
						medianDiff = Math.abs((diffs.length % 2) ? diffs[halfWay] : ((diffs[halfWay - 1] + diffs[halfWay]) / 2.0));
						var upperAllowedDiff = 1.5 * medianDiff;
						var subSequence = [];
						sequence.forEach(function(dataPoint, index) {
							if(index == 0) {
								subSequence.push(dataPoint);
								return;
							}
							var diff = dataPoint - sequence[(index - 1)];
							if((diff >= 0) && (diff <= upperAllowedDiff)) {
								subSequence.push(dataPoint);
								return;
							}
							splitSequences.push(subSequence);
							subSequence = [dataPoint];
						});
						splitSequences.push(subSequence);
					});
					var totalsToDate = [];
					var finalCalculatedValue = splitSequences.reduce((total, subSequence, seqIdx) => {
						totalsToDate.push(total);
						if(subSequence.length == 0)
							return total;
						if(seqIdx > 0) {
							var lastSubSeq = splitSequences[(seqIdx - 1)];
							var lastSubSeqLastVal = lastSubSeq[(lastSubSeq.length - 1)]
							if(lastSubSeqLastVal <= subSequence[0])
								total = total + (subSequence[0] - lastSubSeqLastVal);
						}
						return total + (subSequence[(subSequence.length - 1)] - subSequence[0]);
					}, 0);
					return  finalCalculatedValue;
				}
				const getValues = function(machineData){
					let valueArr = [];
					valueArr = machineData.map(data=>{return data.value});
					return valueArr;
				}
				try{
					  //machine table id and keyspace
					  const keyspace = 'pw';
					  const tableId = \`machine_\${this.#id.replace(/-/g, "_")}\`;
					//store the production for the current hour
					let currentHour = this.#currentTimestamp.clone().tz('Asia/Kolkata').hour();
					let currentMinute = this.#currentTimestamp.clone().tz('Asia/Kolkata').minute();
					let currentMinuteStart = this.#currentTimestamp.clone().tz('Asia/Kolkata').hours(currentHour).minutes(currentMinute).seconds(0);
					let currentMinuteEnd = currentMinuteStart.clone().add(1, 'minute');
					  const paramQuery = \`select * from \${keyspace}.\${tableId} where internal_tag = 'POUCH_COUNTS' and
						generated_at >=  '\${currentMinuteStart.clone().utc().format('YYYY-MM-DD HH:mm:ss') + '+0000'}'
						and generated_at <= '\${currentMinuteEnd.clone().utc().format('YYYY-MM-DD HH:mm:ss') + '+0000'}' order by generated_at asc\`;

					  const queryData =  await this.$cassandra.execute(paramQuery, {prepare: true});
					  let queryValues = getValues(queryData.rows);
					  if(this.POUCH_COUNTS) queryValues.push(this.POUCH_COUNTS);
					let calculatedValue = _calculateStatParameter(queryValues);
					  this.HOURLY_PRODUCTION_COUNT = calculatedValue;
				}
				catch(err){
					console.error('Observer function :: adani -> hourly production count ', err);
				}
				`
			})
			.returning('id');

		hourlyProductionId = hourlyProductionId[0];
	}
	else {
		hourlyProductionId = hourlyProductionId.rows[0]['id'];
	}

	// adding observer properties to generated functions

	let observedpouchCountForHourlyProductionId = await knex.raw(`SELECT id FROM tenant_attribute_set_function_observed_properties WHERE tenant_id = ? AND attribute_set_property_id = ? AND attribute_set_function_id = ?`, [tenantId, clientTimestampId, hourlyProductionId]);
	if(!observedpouchCountForHourlyProductionId.rows.length) {
		observedpouchCountForHourlyProductionId = await knex('tenant_attribute_set_function_observed_properties').insert({
			'tenant_id': tenantId,
			'attribute_set_id': pouchMachineAttributeSetId,
			'attribute_set_property_id': clientTimestampId,
			'attribute_set_function_id': hourlyProductionId,
		})
	}

	// Create new Adani Line for testing
	let adaniLineId1 = await knex.raw(`SELECT id FROM tenant_plant_unit_lines WHERE tenant_plant_unit_id = ? AND name = 'Adani Line 1'`, [adaniPlantUnitId]);
	if(!adaniLineId1.rows.length) {
		adaniLineId1 = await knex('tenant_plant_unit_lines').insert({
			'id': 'b92ac567-1c78-48fc-b600-4d12231ff872',
			'tenant_id': tenantId,
			'tenant_plant_unit_id': adaniPlantUnitId,
			'name': 'Adani Line 1',
			'description': 'Adani Line 1 description',
			'data_persistence_period': 183
		})
		.returning('id');

		adaniLineId1 = adaniLineId1[0];
	}
	else {
		adaniLineId1 = adaniLineId1.rows[0]['id'];
	}

	let adaniLineId2 = await knex.raw(`SELECT id FROM tenant_plant_unit_lines WHERE tenant_plant_unit_id = ? AND name = 'Adani Line 2'`, [adaniPlantUnitId]);
	if(!adaniLineId2.rows.length) {
		adaniLineId2 = await knex('tenant_plant_unit_lines').insert({
			'id': '88a0e7fa-9f45-49b7-8ad0-ac5b73aeaaac',
			'tenant_id': tenantId,
			'tenant_plant_unit_id': adaniPlantUnitId,
			'name': 'Adani Line 2',
			'description': 'Adani Line 2 description',
			'data_persistence_period': 183
		})
		.returning('id');

		adaniLineId2 = adaniLineId2[0];
	}
	else {
		adaniLineId2 = adaniLineId2.rows[0]['id'];
	}

	// add Adani line attribute set in tenant table for testing
	let adaniLineAttributeSetId1 = await knex.raw(`SELECT id FROM tenant_attribute_sets WHERE tenant_id = ? AND name = 'Adani Line Data Set 1'`, [tenantId]);
	if(!adaniLineAttributeSetId1.rows.length) {
		adaniLineAttributeSetId1 = await knex('tenant_attribute_sets').insert({
			'id': '73fa0b1b-6519-43a7-8504-be12254dd383',
			'tenant_id': tenantId,
			'tenant_module_id': tenantModuleId,
			'tenant_folder_id': attributeSetFolderId,
			'name': 'Adani Line Data Set 1',
			'description': 'Adani Line Data Set 1 description'
		})
		.returning('id');

		adaniLineAttributeSetId1 = adaniLineAttributeSetId1[0];
	}
	else {
		adaniLineAttributeSetId1 = adaniLineAttributeSetId1.rows[0]['id'];
	}

	let lineAttributeSetId2 = await knex.raw(`SELECT id FROM tenant_attribute_sets WHERE tenant_id = ? AND name = 'line Data Set'`, [tenantId]);
	if(!lineAttributeSetId2.rows.length) {
		lineAttributeSetId2 = await knex('tenant_attribute_sets').insert({
			'id': '4901b8fa-e700-43ec-b371-603b829ed2aa',
			'tenant_id': tenantId,
			'tenant_module_id': tenantModuleId,
			'tenant_folder_id': attributeSetFolderId,
			'name': 'line Data Set',
			'description': 'line Data Set description'
		})
		.returning('id');

		lineAttributeSetId2 = lineAttributeSetId2[0];
	}
	else {
		lineAttributeSetId2 = lineAttributeSetId2.rows[0]['id'];
	}

	// add Adani Line 1 machine constituent for testing
	let adaniLine1DependentMachine1Id = await knex.raw(`SELECT id FROM tenant_plant_unit_line_constituents WHERE tenant_id = ? AND tenant_plant_unit_line_constituent_id = ? AND tenant_plant_unit_line_id = ?`, [tenantId, pouchMachine1Id, adaniLineId1]);
	if(!adaniLine1DependentMachine1Id.rows.length) {
		adaniLine1DependentMachine1Id = await knex('tenant_plant_unit_line_constituents').insert({
			'id': '1166a147-393a-4ea3-af0c-55957b4c2a0f',
			'tenant_id': tenantId,
			'tenant_plant_unit_line_id': adaniLineId1,
			'step': 1,
			'tenant_plant_unit_line_constituent_id': pouchMachine1Id,
			'constituent_type': 'machine'
		})
		.returning('id');

		adaniLine1DependentMachine1Id = adaniLine1DependentMachine1Id[0];
	}
	else {
		adaniLine1DependentMachine1Id = adaniLine1DependentMachine1Id.rows[0]['id'];
	}

	let adaniLine1DependentMachine2Id = await knex.raw(`SELECT id FROM tenant_plant_unit_line_constituents WHERE tenant_id = ? AND tenant_plant_unit_line_constituent_id = ? AND tenant_plant_unit_line_id = ?`, [tenantId, pouchMachine2Id, adaniLineId1]);
	if(!adaniLine1DependentMachine2Id.rows.length) {
		adaniLine1DependentMachine2Id = await knex('tenant_plant_unit_line_constituents').insert({
			'id': '5fa9ad45-b309-463a-b21c-63127544641a',
			'tenant_id': tenantId,
			'tenant_plant_unit_line_id': adaniLineId1,
			'step': 2,
			'tenant_plant_unit_line_constituent_id': pouchMachine2Id,
			'constituent_type': 'machine'
		})
		.returning('id');

		adaniLine1DependentMachine2Id = adaniLine1DependentMachine2Id[0];
	}
	else {
		adaniLine1DependentMachine2Id = adaniLine1DependentMachine2Id.rows[0]['id'];
	}

	let adaniLine1DependentMachine3Id = await knex.raw(`SELECT id FROM tenant_plant_unit_line_constituents WHERE tenant_id = ? AND tenant_plant_unit_line_constituent_id = ? AND tenant_plant_unit_line_id = ?`, [tenantId, pouchMachine3Id, adaniLineId1]);
	if(!adaniLine1DependentMachine3Id.rows.length) {
		adaniLine1DependentMachine3Id = await knex('tenant_plant_unit_line_constituents').insert({
			'id': '63ea748d-32d6-4253-adca-ab35d9adc753',
			'tenant_id': tenantId,
			'tenant_plant_unit_line_id': adaniLineId1,
			'step': 3,
			'tenant_plant_unit_line_constituent_id': pouchMachine3Id,
			'constituent_type': 'machine'
		})
		.returning('id');

		adaniLine1DependentMachine3Id = adaniLine1DependentMachine3Id[0];
	}
	else {
		adaniLine1DependentMachine3Id = adaniLine1DependentMachine3Id.rows[0]['id'];
	}

	let adaniLine1DependentLineId = await knex.raw(`SELECT id FROM tenant_plant_unit_line_constituents WHERE tenant_id = ? AND tenant_plant_unit_line_constituent_id = ? AND tenant_plant_unit_line_id = ?`, [tenantId, adaniLineId2, adaniLineId1]);
	if(!adaniLine1DependentLineId.rows.length) {
		adaniLine1DependentLineId = await knex('tenant_plant_unit_line_constituents').insert({
			'id': '3f679ff6-098f-47d3-89ab-dadb58ea6d1c',
			'tenant_id': tenantId,
			'tenant_plant_unit_line_id': adaniLineId1,
			'step': 5,
			'tenant_plant_unit_line_constituent_id': adaniLineId2,
			'constituent_type': 'line'
		})
		.returning('id');

		adaniLine1DependentLineId = adaniLine1DependentLineId[0];
	}
	else {
		adaniLine1DependentLineId = adaniLine1DependentLineId.rows[0]['id'];
	}

	// add Adani Line 2 machine constituent for testing
	let line2TrackedMachine1Id = await knex.raw(`SELECT id FROM tenant_plant_unit_line_constituents WHERE tenant_id = ? AND tenant_plant_unit_line_constituent_id = ? AND tenant_plant_unit_line_id = ?`, [tenantId, pouchMachine1Id, adaniLineId2]);
	if(!line2TrackedMachine1Id.rows.length) {
		line2TrackedMachine1Id = await knex('tenant_plant_unit_line_constituents').insert({
			'id': 'dc5c5a19-b918-416a-a7e0-2ce5e37bae4e',
			'tenant_id': tenantId,
			'tenant_plant_unit_line_id': adaniLineId2,
			'step': 1,
			'tenant_plant_unit_line_constituent_id': pouchMachine1Id,
			'constituent_type': 'machine'
		})
		.returning('id');

		line2TrackedMachine1Id = line2TrackedMachine1Id[0];
	}
	else {
		line2TrackedMachine1Id = line2TrackedMachine1Id.rows[0]['id'];
	}

	let line2TrackedMachine2Id = await knex.raw(`SELECT id FROM tenant_plant_unit_line_constituents WHERE tenant_id = ? AND tenant_plant_unit_line_constituent_id = ? AND tenant_plant_unit_line_id = ?`, [tenantId, pouchMachine2Id, adaniLineId2]);
	if(!line2TrackedMachine2Id.rows.length) {
		line2TrackedMachine2Id = await knex('tenant_plant_unit_line_constituents').insert({
			'id': 'fbb83bb2-3e2b-4408-a7a1-53aa610eafa2',
			'tenant_id': tenantId,
			'tenant_plant_unit_line_id': adaniLineId2,
			'step': 2,
			'tenant_plant_unit_line_constituent_id': pouchMachine2Id,
			'constituent_type': 'machine'
		})
		.returning('id');

		line2TrackedMachine2Id = line2TrackedMachine2Id[0];
	}
	else {
		line2TrackedMachine2Id = line2TrackedMachine2Id.rows[0]['id'];
	}

	let line2TrackedMachine3Id = await knex.raw(`SELECT id FROM tenant_plant_unit_line_constituents WHERE tenant_id = ? AND tenant_plant_unit_line_constituent_id = ? AND tenant_plant_unit_line_id = ?`, [tenantId, pouchMachine3Id, adaniLineId2]);
	if(!line2TrackedMachine3Id.rows.length) {
		line2TrackedMachine3Id = await knex('tenant_plant_unit_line_constituents').insert({
			'id': 'ac614b33-6e61-46b1-afa4-dbfbc3261355',
			'tenant_id': tenantId,
			'tenant_plant_unit_line_id': adaniLineId2,
			'step': 3,
			'tenant_plant_unit_line_constituent_id': pouchMachine3Id,
			'constituent_type': 'machine'
		})
		.returning('id');

		line2TrackedMachine3Id = line2TrackedMachine3Id[0];
	}
	else {
		line2TrackedMachine3Id = line2TrackedMachine3Id.rows[0]['id'];
	}

	// add Adani line 1 attribute set properties in tenant attribute properties table for testing
	let adaniLine1AttrSetProperty1 = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND description = 'Adani Line Data Set 1 -> Pouch_machine_1_Actual_Speed'`, [tenantId]);
	if(!adaniLine1AttrSetProperty1.rows.length) {
		adaniLine1AttrSetProperty1 = await knex('tenant_attribute_set_properties').insert({
			'id': 'a2992ad2-b6f5-4c24-949a-e6cda725389a',
			'tenant_id': tenantId,
			'attribute_set_id': adaniLineAttributeSetId1,
			'name': 'Pouch_machine_1_Actual_Speed',
			'description': 'Adani Line Data Set 1 -> Pouch_machine_1_Actual_Speed',
			'internal_tag': 'LINE_1_TEST_POUCH_MACHINE_1_ACTUAL_SPEED',
			'evaluation_expression': '',
			'units': '',
			'source': 'input',
			'datatype': 'number',
			'timestamp_format': 'not_a_timestamp'
		})
		.returning('id');

		adaniLine1AttrSetProperty1 = adaniLine1AttrSetProperty1[0];
	}
	else {
		adaniLine1AttrSetProperty1 = adaniLine1AttrSetProperty1.rows[0]['id'];
	}

	let adaniLine1AttrSetProperty2 = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND description = 'Adani Line Data Set 1 -> Pouch_machine_2_Actual_Speed'`, [tenantId]);
	if(!adaniLine1AttrSetProperty2.rows.length) {
		adaniLine1AttrSetProperty2 = await knex('tenant_attribute_set_properties').insert({
			'id': '9b87b30b-cb5a-42e7-bbb2-e9c44f05785c',
			'tenant_id': tenantId,
			'attribute_set_id': adaniLineAttributeSetId1,
			'name': 'Pouch_machine_2_Actual_Speed',
			'description': 'Adani Line Data Set 1 -> Pouch_machine_2_Actual_Speed',
			'internal_tag': 'LINE_1_TEST_POUCH_MACHINE_2_ACTUAL_SPEED',
			'evaluation_expression': '',
			'units': '',
			'source': 'input',
			'datatype': 'number',
			'timestamp_format': 'not_a_timestamp'
		})
		.returning('id');

		adaniLine1AttrSetProperty2 = adaniLine1AttrSetProperty2[0];
	}
	else {
		adaniLine1AttrSetProperty2 = adaniLine1AttrSetProperty2.rows[0]['id'];
	}

	let adaniLine1AttrSetProperty3 = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND description = 'Adani Line Data Set 1 -> Pouch_machine_3_Actual_Speed'`, [tenantId]);
	if(!adaniLine1AttrSetProperty3.rows.length) {
		adaniLine1AttrSetProperty3 = await knex('tenant_attribute_set_properties').insert({
			'id': 'e83a3335-896b-4ac1-b389-328db300cd20',
			'tenant_id': tenantId,
			'attribute_set_id': adaniLineAttributeSetId1,
			'name': 'Pouch_machine_3_Actual_Speed',
			'description': 'Adani Line Data Set 1 -> Pouch_machine_3_Actual_Speed',
			'internal_tag': 'LINE_1_TEST_POUCH_MACHINE_3_ACTUAL_SPEED',
			'evaluation_expression': '',
			'units': '',
			'source': 'input',
			'datatype': 'number',
			'timestamp_format': 'not_a_timestamp'
		})
		.returning('id');

		adaniLine1AttrSetProperty3 = adaniLine1AttrSetProperty3[0];
	}
	else {
		adaniLine1AttrSetProperty3 = adaniLine1AttrSetProperty3.rows[0]['id'];
	}

	let adaniLine1AttrSetProperty4 = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND description = 'Adani Line Data Set 1 -> Tracked_Line_2_Computed_Actual_Speed'`, [tenantId]);
	if(!adaniLine1AttrSetProperty4.rows.length) {
		adaniLine1AttrSetProperty4 = await knex('tenant_attribute_set_properties').insert({
			'id': '01cf9697-8386-4240-aa18-ccd84db23b77',
			'tenant_id': tenantId,
			'attribute_set_id': adaniLineAttributeSetId1,
			'name': 'Line 2 Computed Actual Speed',
			'description': 'Adani Line Data Set 1 -> Tracked_Line_2_Computed_Actual_Speed',
			'internal_tag': 'TRACKED_LINE_2_COMPUTED_ACTUAL_SPEED',
			'evaluation_expression': '',
			'units': '',
			'source': 'input',
			'datatype': 'number',
			'timestamp_format': 'not_a_timestamp'
		})
		.returning('id');

		adaniLine1AttrSetProperty4 = adaniLine1AttrSetProperty4[0];
	}
	else {
		adaniLine1AttrSetProperty4 = adaniLine1AttrSetProperty4.rows[0]['id'];
	}

	let adaniLine1AttrSetProperty5 = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND description = 'Adani Line Data Set 1 -> Tracked_Line_2_Demo_Computed_Parameter'`, [tenantId]);
	if(!adaniLine1AttrSetProperty5.rows.length) {
		adaniLine1AttrSetProperty5 = await knex('tenant_attribute_set_properties').insert({
			'id': '23fffe24-aec6-4e34-93db-350978f0cada',
			'tenant_id': tenantId,
			'attribute_set_id': adaniLineAttributeSetId1,
			'name': 'Tracked_Line_2_Demo_Computed_Parameter',
			'description': 'Adani Line Data Set 1 -> Tracked_Line_2_Demo_Computed_Parameter',
			'internal_tag': 'TRACKED_LINE_2_DEMO_COMPUTED_PARAMETER',
			'evaluation_expression': '',
			'units': '',
			'source': 'input',
			'datatype': 'number',
			'timestamp_format': 'not_a_timestamp'
		})
		.returning('id');

		adaniLine1AttrSetProperty5 = adaniLine1AttrSetProperty5[0];
	}
	else {
		adaniLine1AttrSetProperty5 = adaniLine1AttrSetProperty5.rows[0]['id'];
	}

	let adaniLine1AttrSetProperty6 = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND description = 'Adani Line Data Set 1 -> Computed_Line_1_Actual_Speed'`, [tenantId]);
	if(!adaniLine1AttrSetProperty6.rows.length) {
		adaniLine1AttrSetProperty6 = await knex('tenant_attribute_set_properties').insert({
			'id': '53c02c50-0422-4348-b6aa-35a55fd6108f',
			'tenant_id': tenantId,
			'attribute_set_id': adaniLineAttributeSetId1,
			'name': 'Computed_Line_1_Actual_Speed',
			'description': 'Adani Line Data Set 1 -> Computed_Line_1_Actual_Speed',
			'internal_tag': 'COMPUTED_LINE_1_ACTUAL_SPEED',
			'evaluation_expression': 'LINE_1_TEST_POUCH_MACHINE_1_ACTUAL_SPEED+LINE_1_TEST_POUCH_MACHINE_2_ACTUAL_SPEED+LINE_1_TEST_POUCH_MACHINE_3_ACTUAL_SPEED',
			'units': '',
			'source': 'computed',
			'datatype': 'number',
			'timestamp_format': 'not_a_timestamp'
		})
		.returning('id');

		adaniLine1AttrSetProperty6 = adaniLine1AttrSetProperty6[0];
	}
	else {
		adaniLine1AttrSetProperty6 = adaniLine1AttrSetProperty6.rows[0]['id'];
	}

	let adaniLine1AttrSetProperty7 = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND description = 'Adani Line Data Set 1 -> Demo_Line_1_Computed_Parameter'`, [tenantId]);
	if(!adaniLine1AttrSetProperty7.rows.length) {
		adaniLine1AttrSetProperty7 = await knex('tenant_attribute_set_properties').insert({
			'id': '4236545c-12c5-40ed-889c-7ef1fc169f19',
			'tenant_id': tenantId,
			'attribute_set_id': adaniLineAttributeSetId1,
			'name': 'Demo_Line_1_Computed_Parameter',
			'description': 'Adani Line Data Set 1 -> Demo_Line_1_Computed_Parameter',
			'internal_tag': 'DEMO_LINE_1_COMPUTED_PARAMETER',
			'evaluation_expression': 'TRACKED_LINE_2_COMPUTED_ACTUAL_SPEED+TRACKED_LINE_2_DEMO_COMPUTED_PARAMETER',
			'units': '',
			'source': 'computed',
			'datatype': 'number',
			'timestamp_format': 'not_a_timestamp'
		})
		.returning('id');

		adaniLine1AttrSetProperty7 = adaniLine1AttrSetProperty7[0];
	}
	else {
		adaniLine1AttrSetProperty7 = adaniLine1AttrSetProperty7.rows[0]['id'];
	}

	// add Adani line 2 attribute set properties in tenant attribute properties table for testing
	let adaniLine2AttrSetProperty1 = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND description = 'Adani Line Data Set 2 -> Pouch_machine_1_Actual_Speed'`, [tenantId]);
	if(!adaniLine2AttrSetProperty1.rows.length) {
		adaniLine2AttrSetProperty1 = await knex('tenant_attribute_set_properties').insert({
			'id': '35063686-96fd-49d5-8283-2025c434642f',
			'tenant_id': tenantId,
			'attribute_set_id': lineAttributeSetId2,
			'name': 'Pouch_machine_1_Actual_Speed',
			'description': 'Adani Line Data Set 2 -> Pouch_machine_1_Actual_Speed',
			'internal_tag': 'LINE_2_TEST_POUCH_MACHINE_1_ACTUAL_SPEED',
			'evaluation_expression': '',
			'units': '',
			'source': 'input',
			'datatype': 'number',
			'timestamp_format': 'not_a_timestamp'
		})
		.returning('id');

		adaniLine2AttrSetProperty1 = adaniLine2AttrSetProperty1[0];
	}
	else {
		adaniLine2AttrSetProperty1 = adaniLine2AttrSetProperty1.rows[0]['id'];
	}

	let adaniLine2AttrSetProperty2 = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND description = 'Adani Line Data Set 2 -> Pouch_machine_2_Actual_Speed'`, [tenantId]);
	if(!adaniLine2AttrSetProperty2.rows.length) {
		adaniLine2AttrSetProperty2 = await knex('tenant_attribute_set_properties').insert({
			'id': '5e04717e-4ea4-4b24-8f7f-6bec82a3fedf',
			'tenant_id': tenantId,
			'attribute_set_id': lineAttributeSetId2,
			'name': 'Pouch_machine_2_Actual_Speed',
			'description': 'Adani Line Data Set 2 -> Pouch_machine_2_Actual_Speed',
			'internal_tag': 'LINE_2_TEST_POUCH_MACHINE_2_ACTUAL_SPEED',
			'evaluation_expression': '',
			'units': '',
			'source': 'input',
			'datatype': 'number',
			'timestamp_format': 'not_a_timestamp'
		})
		.returning('id');

		adaniLine2AttrSetProperty2 = adaniLine2AttrSetProperty2[0];
	}
	else {
		adaniLine2AttrSetProperty2 = adaniLine2AttrSetProperty2.rows[0]['id'];
	}

	let adaniLine2AttrSetProperty3 = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND description = 'Adani Line Data Set 2 -> Pouch_machine_3_Actual_Speed'`, [tenantId]);
	if(!adaniLine2AttrSetProperty3.rows.length) {
		adaniLine2AttrSetProperty3 = await knex('tenant_attribute_set_properties').insert({
			'id': '3ab98732-9eb8-4be7-a800-af9de9ee4d11',
			'tenant_id': tenantId,
			'attribute_set_id': lineAttributeSetId2,
			'name': 'Pouch_machine_3_Actual_Speed',
			'description': 'Adani Line Data Set 2 -> Pouch_machine_3_Actual_Speed',
			'internal_tag': 'LINE_2_TEST_POUCH_MACHINE_3_ACTUAL_SPEED',
			'evaluation_expression': '',
			'units': '',
			'source': 'input',
			'datatype': 'number',
			'timestamp_format': 'not_a_timestamp'
		})
		.returning('id');

		adaniLine2AttrSetProperty3 = adaniLine2AttrSetProperty3[0];
	}
	else {
		adaniLine2AttrSetProperty3 = adaniLine2AttrSetProperty3.rows[0]['id'];
	}

	let adaniLine2AttrSetProperty4 = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND description = 'Adani Line Data Set 2 -> Computed_Line_2_Actual_Speed'`, [tenantId]);
	if(!adaniLine2AttrSetProperty4.rows.length) {
		adaniLine2AttrSetProperty4 = await knex('tenant_attribute_set_properties').insert({
			'id': '0eed7e81-6d46-4116-9916-1dbdb3dd5296',
			'tenant_id': tenantId,
			'attribute_set_id': lineAttributeSetId2,
			'name': 'Computed_Line_2_Actual_Speed',
			'description': 'Adani Line Data Set 2 -> Computed_Line_2_Actual_Speed',
			'internal_tag': 'COMPUTED_LINE_2_ACTUAL_SPEED',
			'evaluation_expression': 'LINE_2_TEST_POUCH_MACHINE_1_ACTUAL_SPEED+LINE_2_TEST_POUCH_MACHINE_2_ACTUAL_SPEED+LINE_2_TEST_POUCH_MACHINE_3_ACTUAL_SPEED',
			'units': '',
			'source': 'computed',
			'datatype': 'number',
			'timestamp_format': 'not_a_timestamp'
		})
		.returning('id');

		adaniLine2AttrSetProperty4 = adaniLine2AttrSetProperty4[0];
	}
	else {
		adaniLine2AttrSetProperty4 = adaniLine2AttrSetProperty4.rows[0]['id'];
	}

	let adaniLine2AttrSetProperty5 = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND description = 'Adani Line Data Set 2 -> Demo_Line_2_Computed_Parameter'`, [tenantId]);
	if(!adaniLine2AttrSetProperty5.rows.length) {
		adaniLine2AttrSetProperty5 = await knex('tenant_attribute_set_properties').insert({
			'id': '294b585a-65a5-4267-89ac-e47bdb925f8e',
			'tenant_id': tenantId,
			'attribute_set_id': lineAttributeSetId2,
			'name': 'Demo_Line_2_Computed_Parameter',
			'description': 'Adani Line Data Set 2 -> Demo_Line_2_Computed_Parameter',
			'internal_tag': 'DEMO_LINE_2_COMPUTED_PARAMETER',
			'evaluation_expression': 'LINE_2_TEST_POUCH_MACHINE_1_ACTUAL_SPEED+LINE_2_TEST_POUCH_MACHINE_2_ACTUAL_SPEED',
			'units': '',
			'source': 'computed',
			'datatype': 'number',
			'timestamp_format': 'not_a_timestamp'
		})
		.returning('id');

		adaniLine2AttrSetProperty5 = adaniLine2AttrSetProperty5[0];
	}
	else {
		adaniLine2AttrSetProperty5 = adaniLine2AttrSetProperty5.rows[0]['id'];
	}

	// Add metadata for created Adani Line 1 for testing
	let adaniLine1Metadata = [];

	let adaniLine_1_Pouch_machine_1_Actual_Speed = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND attribute_set_id = ? AND internal_tag = 'LINE_1_TEST_POUCH_MACHINE_1_ACTUAL_SPEED'`, [tenantId, adaniLineAttributeSetId1]);
	let adaniLine1MetadataObject1ActualSpeed = {
		'constituent_id': adaniLineId2,
		'constituent_type': 'line',
		'external_tag': 'LINE_2_TEST_POUCH_MACHINE_1_ACTUAL_SPEED',
		'is_global': true,
		'parameter_id': adaniLine_1_Pouch_machine_1_Actual_Speed.rows[0].id
	};
	adaniLine1Metadata.push(adaniLine1MetadataObject1ActualSpeed);

	let adaniLine_1_Pouch_machine_2_Actual_Speed = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND attribute_set_id = ? AND internal_tag = 'LINE_1_TEST_POUCH_MACHINE_2_ACTUAL_SPEED'`, [tenantId, adaniLineAttributeSetId1]);
	let adaniLine1MetadataObject2ActualSpeed = {
		'constituent_id': adaniLineId2,
		'constituent_type': 'line',
		'external_tag': 'LINE_2_TEST_POUCH_MACHINE_2_ACTUAL_SPEED',
		'is_global': true,
		'parameter_id': adaniLine_1_Pouch_machine_2_Actual_Speed.rows[0].id
	};
	adaniLine1Metadata.push(adaniLine1MetadataObject2ActualSpeed);

	let adaniLine_1_Pouch_machine_3_Actual_Speed = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND attribute_set_id = ? AND internal_tag = 'LINE_1_TEST_POUCH_MACHINE_3_ACTUAL_SPEED'`, [tenantId, adaniLineAttributeSetId1]);
	let adaniLine1MetadataObject3ActualSpeed = {
		'constituent_id': adaniLineId2,
		'constituent_type': 'line',
		'external_tag': 'LINE_2_TEST_POUCH_MACHINE_3_ACTUAL_SPEED',
		'is_global': true,
		'parameter_id': adaniLine_1_Pouch_machine_3_Actual_Speed.rows[0].id
	};
	adaniLine1Metadata.push(adaniLine1MetadataObject3ActualSpeed);

	let Line_2_Computed_Actual_Speed = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND attribute_set_id = ? AND internal_tag = 'TRACKED_LINE_2_COMPUTED_ACTUAL_SPEED'`, [tenantId, adaniLineAttributeSetId1]);
	let adaniLine1MetadataObject4ActualSpeed = {
		'constituent_id': adaniLineId2,
		'constituent_type': 'line',
		'external_tag': 'COMPUTED_LINE_2_ACTUAL_SPEED',
		'is_global': true,
		'parameter_id': Line_2_Computed_Actual_Speed.rows[0].id
	};
	adaniLine1Metadata.push(adaniLine1MetadataObject4ActualSpeed);

	let Line_2_Demo_Computed_Parameter = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND attribute_set_id = ? AND internal_tag = 'TRACKED_LINE_2_DEMO_COMPUTED_PARAMETER'`, [tenantId, adaniLineAttributeSetId1]);
	let adaniLine1MetadataObject5ActualSpeed = {
		'constituent_id': adaniLineId2,
		'constituent_type': 'line',
		'external_tag': 'DEMO_LINE_2_COMPUTED_PARAMETER',
		'is_global': true,
		'parameter_id': Line_2_Demo_Computed_Parameter.rows[0].id
	};
	adaniLine1Metadata.push(adaniLine1MetadataObject5ActualSpeed);

	await knex('tenant_plant_unit_lines')
	.where({
		'id': adaniLineId1
	})
	.update({
		'attribute_set_metadata': JSON.stringify(adaniLine1Metadata)
	});

	// Add metadata for created Adani Line 2 for testing
	let adaniLine2Metadata = [];

	let adaniLine_2_Pouch_machine_1_Actual_Speed = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND attribute_set_id = ? AND internal_tag = 'LINE_2_TEST_POUCH_MACHINE_1_ACTUAL_SPEED'`, [tenantId, lineAttributeSetId2]);
	let adaniLine2MetadataObject1ActualSpeed = {
		'constituent_id': pouchMachine1Id,
		'constituent_type': 'machine',
		'external_tag': 'ACTUAL_SPEED',
		'is_global': true,
		'parameter_id': adaniLine_2_Pouch_machine_1_Actual_Speed.rows[0].id
	};
	adaniLine2Metadata.push(adaniLine2MetadataObject1ActualSpeed);

	let adaniLine_2_Pouch_machine_2_Actual_Speed = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND attribute_set_id = ? AND internal_tag = 'LINE_2_TEST_POUCH_MACHINE_2_ACTUAL_SPEED'`, [tenantId, lineAttributeSetId2]);
	let adaniLine2MetadataObject2ActualSpeed = {
		'constituent_id': pouchMachine2Id,
		'constituent_type': 'machine',
		'external_tag': 'ACTUAL_SPEED',
		'is_global': true,
		'parameter_id': adaniLine_2_Pouch_machine_2_Actual_Speed.rows[0].id
	};
	adaniLine2Metadata.push(adaniLine2MetadataObject2ActualSpeed);

	let adaniLine_2_Pouch_machine_3_Actual_Speed = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND attribute_set_id = ? AND internal_tag = 'LINE_2_TEST_POUCH_MACHINE_3_ACTUAL_SPEED'`, [tenantId, lineAttributeSetId2]);
	let adaniLine2MetadataObject3ActualSpeed = {
		'constituent_id': pouchMachine3Id,
		'constituent_type': 'machine',
		'external_tag': 'ACTUAL_SPEED',
		'is_global': true,
		'parameter_id': adaniLine_2_Pouch_machine_3_Actual_Speed.rows[0].id
	};
	adaniLine2Metadata.push(adaniLine2MetadataObject3ActualSpeed);

	await knex('tenant_plant_unit_lines')
	.where({
		'id': adaniLineId2
	})
	.update({
		'attribute_set_metadata': JSON.stringify(adaniLine2Metadata)
	});

	// link Adani line 1 attribute set in lines table
	let adaniLineAttributeId1 = await knex.raw(`SELECT id FROM tenant_plant_unit_lines_attribute_sets WHERE tenant_id = ? AND tenant_plant_unit_line_id = ?`, [tenantId, adaniLineId1]);
	if(!adaniLineAttributeId1.rows.length) {
		adaniLineAttributeId1 = await knex('tenant_plant_unit_lines_attribute_sets').insert({
			'id': 'de8420c5-8106-4770-9b41-786cdde94b11',
			'tenant_id': tenantId,
			'tenant_plant_unit_line_id': adaniLineId1,
			'tenant_attribute_set_id': adaniLineAttributeSetId1,
			'evaluation_order': 1
		})
		.returning('id');

		adaniLineAttributeId1 = adaniLineAttributeId1[0];
	}
	else {
		adaniLineAttributeId1 = adaniLineAttributeId1.rows[0]['id'];
	}

	// link Adani line 1 attribute set in lines table
	let adaniLineAttributeId2 = await knex.raw(`SELECT id FROM tenant_plant_unit_lines_attribute_sets WHERE tenant_id = ? AND tenant_plant_unit_line_id = ?`, [tenantId, adaniLineId2]);
	if(!adaniLineAttributeId2.rows.length) {
		adaniLineAttributeId2 = await knex('tenant_plant_unit_lines_attribute_sets').insert({
			'id': '6a1a879a-2c82-4e73-80b5-22ff8fecbee6',
			'tenant_id': tenantId,
			'tenant_plant_unit_line_id': adaniLineId2,
			'tenant_attribute_set_id': lineAttributeSetId2,
			'evaluation_order': 1
		})
		.returning('id');

		adaniLineAttributeId2 = adaniLineAttributeId2[0];
	}
	else {
		adaniLineAttributeId2 = adaniLineAttributeId2.rows[0]['id'];
	}

}
