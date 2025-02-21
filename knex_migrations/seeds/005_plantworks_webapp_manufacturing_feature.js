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

	// Create a new plant
	let tenantId = await knex.raw('SELECT id FROM tenants WHERE sub_domain =\'www\'');
	tenantId = tenantId.rows[0]['id'];

	let tenantFolderId = await knex.raw('SELECT id FROM tenant_folders WHERE tenant_id = ? AND name = ?', [tenantId, 'manufacturing_feature.folder_names.plants.name']);
	tenantFolderId = tenantFolderId.rows[0]['id'];

	let plantId = await knex.raw(`SELECT id FROM tenant_plants WHERE tenant_id = ? AND name = 'Plant 1'`, [tenantId]);
	if(!plantId.rows.length) {
		plantId = await knex('tenant_plants').insert({
			'tenant_id': tenantId,
			'tenant_folder_id': tenantFolderId,
			'name': 'Plant 1',
			'description': 'Plant 1 description',
			'tenant_location_id': 'af517115-5e12-4293-8691-11697e44aebf'
		})
		.returning('id');

		plantId = plantId[0];
	}
	else {
		plantId = plantId.rows[0]['id'];
	}

	// Create a sample schedule for plant
	let plantScheduleId = await knex.raw(`SELECT id FROM tenant_plant_schedules WHERE tenant_plant_id = ?`, [plantId]);
	if(!plantScheduleId.rows.length) {
		plantScheduleId = await knex('tenant_plant_schedules').insert({
			'tenant_id': tenantId,
			'tenant_plant_id': plantId,
			'type': 'holiday',
			'description': 'Christmas',
			'start_date': new Date("25-dec-2019"),
			'end_date': new Date("25-dec-2019")
		})
		.returning('id');

		plantScheduleId = plantScheduleId[0];
	}
	else {
		plantScheduleId = plantScheduleId.rows[0]['id'];
	}

	// Create a new plant unit
	let plantUnitId = await knex.raw(`SELECT id FROM tenant_plant_units WHERE tenant_plant_id = ? AND name = 'Main Unit'`, [plantId]);
	if(!plantUnitId.rows.length) {
		plantUnitId = await knex('tenant_plant_units').insert({
			'tenant_id': tenantId,
			'tenant_plant_id': plantId,
			'name': 'Main Unit',
			'description': 'Main Unit description'
		})
		.returning('id');

		plantUnitId = plantUnitId[0];
	}
	else {
		plantUnitId = plantUnitId.rows[0]['id'];
	}

	// Create a sample Maintenance schedule for unit
	let plantUnitScheduleId = await knex.raw(`SELECT id FROM tenant_plant_unit_schedules WHERE tenant_plant_unit_id = ?`, [plantUnitId]);
	if(!plantUnitScheduleId.rows.length) {
		plantUnitScheduleId = await knex('tenant_plant_unit_schedules').insert({
			'tenant_id': tenantId,
			'tenant_plant_unit_id': plantUnitId,
			'type': 'planned_downtime',
			'description': 'weekly',
			'start_date': new Date("30-dec-2019"),
			'end_date': new Date("30-dec-2019"),
			'start_time': '10:00',
			'end_time': '05:00'
		})
		.returning('id');

		plantUnitScheduleId = plantUnitScheduleId[0];
	}
	else {
		plantUnitScheduleId = plantUnitScheduleId.rows[0]['id'];
	}

	// Create a new IoT Gateway
	let mainUnitGatewayId = await knex.raw(`SELECT id FROM tenant_plant_unit_drivers WHERE tenant_plant_unit_id = ? AND name = 'Main Unit Gateway'`, [plantUnitId]);
	if(!mainUnitGatewayId.rows.length) {
		mainUnitGatewayId = await knex('tenant_plant_unit_drivers').insert({
			'tenant_id': tenantId,
			'tenant_plant_unit_id': plantUnitId,
			'name': 'Main Unit Gateway',
			'description': 'Main Unit Gateway description',
			'gateway_id': winSrvcId
		})
		.returning('id');

		mainUnitGatewayId = mainUnitGatewayId[0];
	}
	else {
		mainUnitGatewayId = mainUnitGatewayId.rows[0]['id'];
	}

	// Create new Machine A
	let mainUnitMachineAId = await knex.raw(`SELECT id FROM tenant_plant_unit_machines WHERE tenant_plant_unit_id = ? AND name = 'Machine A'`, [plantUnitId]);
	if(!mainUnitMachineAId.rows.length) {
		mainUnitMachineAId = await knex('tenant_plant_unit_machines').insert({
			'id': '3b1385b1-07fb-4ac9-8c23-d07fbb1736fe',
			'tenant_id': tenantId,
			'tenant_plant_unit_id': plantUnitId,
			'name': 'Machine A',
			'description': 'Machine A description',
			'plc_id': noxViewId,
			'tenant_plant_unit_driver_id': mainUnitGatewayId,
			'data_persistence_period': 183
		})
		.returning('id');

		mainUnitMachineAId = mainUnitMachineAId[0];
	}
	else {
		mainUnitMachineAId = mainUnitMachineAId.rows[0]['id'];
	}

	// Create a sample schedule for Machine A
	let plantUnitMachineAScheduleId = await knex.raw(`SELECT id FROM tenant_plant_unit_machine_schedules WHERE tenant_plant_unit_machine_id = ?`, [mainUnitMachineAId]);
	if(!plantUnitMachineAScheduleId.rows.length) {
		plantUnitMachineAScheduleId = await knex('tenant_plant_unit_machine_schedules').insert({
			'tenant_id': tenantId,
			'tenant_plant_unit_machine_id': mainUnitMachineAId,
			'type': 'scheduled_downtime',
			'description': 'Downtime',
			'start_time': '13:00',
			'end_time': '15:00'
		})
		.returning('id');
	}

	let mainUnitMachineATemplate = await knex.raw(`SELECT COUNT(id) AS template_count FROM tenant_plant_unit_machine_templates WHERE tenant_plant_unit_machine_id = ?`, [mainUnitMachineAId]);
	if(!Number(mainUnitMachineATemplate.rows[0]['template_count'])) {
		await knex('tenant_plant_unit_machine_templates').insert({
			'tenant_id': tenantId,
			'tenant_plant_unit_machine_id': mainUnitMachineAId,
			'template': `
<PlantWorksSubheader>
	<div class="layout-row layout-align-space-between-center">
		<span class="flex" style="font-weight:600;">
			<PlantWorksIcon @icon="timelapse" @class="m-0 p-0 mr-2" />
			{{entity.text}} {{t "plant_works_webapp_server_server.outgoing_feature.title"}}
		</span>

		<PlantWorksSwitch @class="m-0" @value={{categorizedDataSetPropertyView}} @onChange={{action (mut categorizedDataSetPropertyView)}}>
			{{#liquid-if categorizedDataSetPropertyView}}
				{{t "general.label_categorized"}}
			{{else}}
				{{t "general.label_uncategorized"}}
			{{/liquid-if}}
		</PlantWorksSwitch>
	</div>
</PlantWorksSubheader>

<div class="flex layout-column layout-align-start-stretch bg-blue-grey lighten-2 p-1">
	<div class="flex layout-column layout-align-start-stretch bg-white">
		{{#liquid-if categorizedDataSetPropertyView}}
			<PlantWorksTabs
				@borderBottom={{true}}
				@stretch={{true}}
				@selected={{selectedDataSetSourceType}}
				@onChange={{action (mut selectedDataSetSourceType)}} as |Tabs|
			>
				{{#each sourceTypes as |sourceType|}}
					<Tabs.Tab @value={{sourceType}}>{{humanize sourceType}}</Tabs.Tab>
				{{/each}}
			</PlantWorksTabs>

			{{#liquid-bind selectedDataSetSourceType class="dynamic-animation" as |currentSourceType|}}
				<PlantWorksTable @sortProp="name" @sortDir="asc" as |Table|>
					<Table.Head as |Head|>
						<Head.Column @sortProp="name">
							<MdiIcon @icon="sprout" @class="mr-0 mt-1" />
							{{t "general.label_name"}}
						</Head.Column>
						<Head.Column @sortProp="internalTag">
							<MdiIcon @icon="code-tags" @class="mr-0 mt-1" />
							{{t "plant_works_webapp_server_server.common.label_attribute_set_property_tag"}}
						</Head.Column>
						<Head.Column @sortProp="dataType">
							<PlantWorksIcon @icon="donut-small" @class="mr-0 mt-1" />
							{{t "plant_works_webapp_server_server.common.label_attribute_set_property_datatype"}}
						</Head.Column>
						<Head.Column @sortProp="currentValue">
							<PlantWorksIcon @icon="gavel" @class="mr-0 mt-1" />
							{{t "general.label_current_value"}}
						</Head.Column>
					</Table.Head>
					<Table.Body as |Body|>
						{{#each (sort-by Table.sortDesc (filter-by "source" currentSourceType model)) as |property|}}
							<Body.Row as |Row|>
								<Row.Cell>
									{{property.name}}
								</Row.Cell>

								<Row.Cell>
									{{property.internalTag}}
								</Row.Cell>

								<Row.Cell>
									{{capitalize property.dataType}}
								</Row.Cell>

								<Row.Cell>
									{{#if property.currentValue}}
										{{#if (eq property.dataType "date")}}
											{{moment-format property.currentValue "DD/MMM/YYYY HH:mm"}} {{property.units}}
										{{else}}
											{{property.currentValue}} {{property.units}}
										{{/if}}
									{{else}}
										&nbsp;
									{{/if}}
								</Row.Cell>
							</Body.Row>
						{{/each}}
					</Table.Body>
				</PlantWorksTable>
			{{/liquid-bind}}
		{{else}}
			<PlantWorksTable @sortProp="name" @sortDir="asc" as |Table|>
				<Table.Head as |Head|>
					<Head.Column @sortProp="source">
						<MdiIcon @icon="source-repository" @class="mr-0 mt-1" />
						{{t "plant_works_webapp_server_server.common.label_attribute_set_property_source"}}
					</Head.Column>
					<Head.Column @sortProp="name">
						<MdiIcon @icon="sprout" @class="mr-0 mt-1" />
						{{t "general.label_name"}}
					</Head.Column>
					<Head.Column @sortProp="internalTag">
						<MdiIcon @icon="code-tags" @class="mr-0 mt-1" />
						{{t "plant_works_webapp_server_server.common.label_attribute_set_property_tag"}}
					</Head.Column>
					<Head.Column @sortProp="dataType">
						<PlantWorksIcon @icon="donut-small" @class="mr-0 mt-1" />
						{{t "plant_works_webapp_server_server.common.label_attribute_set_property_datatype"}}
					</Head.Column>
					<Head.Column @sortProp="currentValue">
						<PlantWorksIcon @icon="gavel" @class="mr-0 mt-1" />
						{{t "general.label_current_value"}}
					</Head.Column>
				</Table.Head>
				<Table.Body as |Body|>
					{{#each (sort-by Table.sortDesc model) as |property|}}
						<Body.Row @onClick={{perform toggleAttributeSetProperty property}} as |Row|>
							<Row.Cell>
								{{capitalize property.source}}
							</Row.Cell>

							<Row.Cell>
								{{property.name}}
							</Row.Cell>

							<Row.Cell>
								{{property.internalTag}}
							</Row.Cell>

							<Row.Cell>
								{{capitalize property.dataType}}
							</Row.Cell>

							<Row.Cell>
								{{#if property.currentValue}}
									{{#if (eq property.dataType "date")}}
										{{moment-format property.currentValue "DD/MMM/YYYY HH:mm"}} {{property.units}}
									{{else}}
										{{property.currentValue}} {{property.units}}
									{{/if}}
								{{else}}
									&nbsp;
								{{/if}}
							</Row.Cell>
						</Body.Row>
					{{/each}}
				</Table.Body>
			</PlantWorksTable>
		{{/liquid-if}}
	</div>
</div>
`
		});
	}

	// Create new Machine B
	let mainUnitMachineBId = await knex.raw(`SELECT id FROM tenant_plant_unit_machines WHERE tenant_plant_unit_id = ? AND name = 'Machine B'`, [plantUnitId]);
	if(!mainUnitMachineBId.rows.length) {
		mainUnitMachineBId = await knex('tenant_plant_unit_machines').insert({
			'id': '11cccee1-307b-4f77-9e9f-6881ceb18637',
			'tenant_id': tenantId,
			'tenant_plant_unit_id': plantUnitId,
			'name': 'Machine B',
			'description': 'Machine B description',
			'plc_id': noxViewId,
			'tenant_plant_unit_driver_id': mainUnitGatewayId,
			'data_persistence_period': 183
		})
		.returning('id');

		mainUnitMachineBId = mainUnitMachineBId[0];
	}
	else {
		mainUnitMachineBId = mainUnitMachineBId.rows[0]['id'];
	}

	// Create a sample schedule for Machine B
	let plantUnitMachineBScheduleId = await knex.raw(`SELECT id FROM tenant_plant_unit_machine_schedules WHERE tenant_plant_unit_machine_id = ?`, [mainUnitMachineBId]);
	if(!plantUnitMachineBScheduleId.rows.length) {
		plantUnitMachineBScheduleId = await knex('tenant_plant_unit_machine_schedules').insert({
			'tenant_id': tenantId,
			'tenant_plant_unit_machine_id': mainUnitMachineBId,
			'type': 'scheduled_downtime',
			'description': 'Downtime',
			'start_time': '11:00',
			'end_time': '13:00'
		})
		.returning('id');
	}

	// Create new Station A,B
	let mainUnitStationABId = await knex.raw(`SELECT id FROM tenant_plant_unit_stations WHERE tenant_plant_unit_id = ? AND name = 'Station A,B'`, [plantUnitId]);
	if(!mainUnitStationABId.rows.length) {
		mainUnitStationABId = await knex('tenant_plant_unit_stations').insert({
			'id': 'f1924cb6-c457-4475-9691-00fbd5f61517',
			'tenant_id': tenantId,
			'tenant_plant_unit_id': plantUnitId,
			'name': 'Station A,B',
			'description': 'Station A,B description',
			'data_persistence_period': 183
		})
		.returning('id');

		mainUnitStationABId = mainUnitStationABId[0];
	}
	else {
		mainUnitStationABId = mainUnitStationABId.rows[0]['id'];
	}

	// Link Station A,B to Machine A and Machine B
	let stationABObservedMachineAId = await knex.raw(`SELECT id FROM tenant_plant_unit_stations_observed_machines WHERE tenant_plant_unit_station_id = ? AND tenant_plant_unit_machine_id = ?`, [mainUnitStationABId, mainUnitMachineAId]);
	if(!stationABObservedMachineAId.rows.length) {
		await knex('tenant_plant_unit_stations_observed_machines').insert({
			'tenant_id': tenantId,
			'tenant_plant_unit_station_id': mainUnitStationABId,
			'tenant_plant_unit_machine_id': mainUnitMachineAId
		});
	}

	let stationABObservedMachineBId = await knex.raw(`SELECT id FROM tenant_plant_unit_stations_observed_machines WHERE tenant_plant_unit_station_id = ? AND tenant_plant_unit_machine_id = ?`, [mainUnitStationABId, mainUnitMachineBId]);
	if(!stationABObservedMachineBId.rows.length) {
		await knex('tenant_plant_unit_stations_observed_machines').insert({
			'tenant_id': tenantId,
			'tenant_plant_unit_station_id': mainUnitStationABId,
			'tenant_plant_unit_machine_id': mainUnitMachineBId
		});
	}


	// Get the attribute set folder, etc....
	let attributeSetFolderId = await knex.raw(`SELECT id FROM tenant_folders WHERE tenant_id = ? AND name = 'manufacturing_feature.folder_names.attribute_sets.name'`, [tenantId]);
	attributeSetFolderId = attributeSetFolderId.rows[0]['id'];

	let tenantModuleId = await knex.raw(`SELECT id FROM tenants_modules WHERE tenant_id = ? AND module_id = ?`, [tenantId, featureId]);
	tenantModuleId = tenantModuleId.rows[0]['id'];

	// Create new Machine Attribute Set
	let machineAttributeSetId = await knex.raw(`SELECT id FROM tenant_attribute_sets WHERE tenant_id = ? AND name = 'Std. Machine Data Set'`, [tenantId]);
	if(!machineAttributeSetId.rows.length) {
		machineAttributeSetId = await knex('tenant_attribute_sets').insert({
			'tenant_id': tenantId,
			'tenant_module_id': tenantModuleId,
			'tenant_folder_id': attributeSetFolderId,
			'name': 'Std. Machine Data Set',
			'description': 'Std. Machine Data Set description'
		})
		.returning('id');

		machineAttributeSetId = machineAttributeSetId[0];
	}
	else {
		machineAttributeSetId = machineAttributeSetId.rows[0]['id'];
	}

	// Create new Station Attribute Set
	let stationAttributeSetId = await knex.raw(`SELECT id FROM tenant_attribute_sets WHERE tenant_id = ? AND name = 'Std. Station Data Set'`, [tenantId]);
	if(!stationAttributeSetId.rows.length) {
		stationAttributeSetId = await knex('tenant_attribute_sets').insert({
			'tenant_id': tenantId,
			'tenant_module_id': tenantModuleId,
			'tenant_folder_id': attributeSetFolderId,
			'name': 'Std. Station Data Set',
			'description': 'Std. Station Data Set description'
		})
		.returning('id');

		stationAttributeSetId = stationAttributeSetId[0];
	}
	else {
		stationAttributeSetId = stationAttributeSetId.rows[0]['id'];
	}

	// Assign Machine Attribute Set to both machines
	await knex.raw(`INSERT INTO tenant_plant_unit_machines_attribute_sets (tenant_id, tenant_plant_unit_machine_id, tenant_attribute_set_id) VALUES (?, ?, ?) ON CONFLICT DO NOTHING`, [tenantId, mainUnitMachineAId, machineAttributeSetId]);
	await knex.raw(`INSERT INTO tenant_plant_unit_machines_attribute_sets (tenant_id, tenant_plant_unit_machine_id, tenant_attribute_set_id) VALUES (?, ?, ?) ON CONFLICT DO NOTHING`, [tenantId, mainUnitMachineBId, machineAttributeSetId]);

	// Assign Station Attribute Set to Station A,b
	await knex.raw(`INSERT INTO tenant_plant_unit_stations_attribute_sets (tenant_id, tenant_plant_unit_station_id, tenant_attribute_set_id) VALUES (?, ?, ?) ON CONFLICT DO NOTHING`, [tenantId, mainUnitStationABId, stationAttributeSetId]);

	// Create Machine Attribute Set properties
	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		evaluation_expression,
		units,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, machineAttributeSetId, 'Machine Capacity', 'Std. Machine Data Set -> Machine Capacity', 'MACHINE_CAPACITY', '999', 'kg/hr', 'static', 'number']
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
	[tenantId, machineAttributeSetId, 'Machine Timestamp', 'Std. Machine Data Set -> Machine Timestamp', 'MACHINE_TIMESTAMP', 'input', 'date', 'unix_epoch_with_milliseconds']
	);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		units,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, machineAttributeSetId, 'Weight Per Hour', 'Std. Machine Data Set -> Weight Per Hour', 'WEIGHT_PER_HOUR', 'kg/hr', 'input', 'number']
	);

	// Create Station Attribute Set properties
	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		units,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, stationAttributeSetId, 'Machine A Capacity', 'Std. Station Data Set -> Machine A Capacity', 'MACHINE_A_CAPACITY', 'kg/hr', 'input', 'number']
	);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		units,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, stationAttributeSetId, 'Machine B Capacity', 'Std. Station Data Set -> Machine B Capacity', 'MACHINE_B_CAPACITY', 'kg/hr', 'input', 'number']
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
	[tenantId, stationAttributeSetId, 'Machine A Timestamp', 'Std. Station Data Set -> Machine A Timestamp', 'MACHINE_A_TIMESTAMP', 'input', 'date', 'unix_epoch_with_milliseconds']
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
	[tenantId, stationAttributeSetId, 'Machine B Timestamp', 'Std. Station Data Set -> Machine B Timestamp', 'MACHINE_B_TIMESTAMP', 'input', 'date', 'unix_epoch_with_milliseconds']
	);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		units,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, stationAttributeSetId, 'Machine A Weight Per Hour', 'Std. Station Data Set -> Machine A Weight Per Hour', 'MACHINE_A_WEIGHT_PER_HOUR', 'kg/hr', 'input', 'number']
	);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		units,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, stationAttributeSetId, 'Machine B Weight Per Hour', 'Std. Station Data Set -> Machine B Weight Per Hour', 'MACHINE_B_WEIGHT_PER_HOUR', 'kg/hr', 'input', 'number']
	);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		units,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, stationAttributeSetId, 'Machine B Weight Per Hour', 'Std. Station Data Set -> Machine B Weight Per Hour', 'MACHINE_B_WEIGHT_PER_HOUR', 'kg/hr', 'input', 'number']
	);

	await knex.raw(`
INSERT INTO
	tenant_attribute_set_properties (
		tenant_id,
		attribute_set_id,
		name,
		description,
		internal_tag,
		evaluation_expression,
		units,
		source,
		datatype
	)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT DO NOTHING
`,
	[tenantId, stationAttributeSetId, 'Total Weight Per Hour', 'Std. Station Data Set -> Total Weight Per Hour', 'TOTAL_WEIGHT_PER_HOUR', 'MACHINE_A_WEIGHT_PER_HOUR + MACHINE_B_WEIGHT_PER_HOUR', 'kg/hr', 'computed', 'number']
	);

	// Add metadata for machine A and B
	let machineMetadataAttrId = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND attribute_set_id = ? AND internal_tag = 'MACHINE_TIMESTAMP'`, [tenantId, machineAttributeSetId]);
	let machineMetadata = [{
		'is_timestamp': true,
		'parameter_id': machineMetadataAttrId.rows[0].id
	}];

	await knex('tenant_plant_unit_machines')
	.where({
		'id': mainUnitMachineAId
	})
	.update({
		'attribute_set_metadata': JSON.stringify(machineMetadata)
	});

	await knex('tenant_plant_unit_machines')
	.where({
		'id': mainUnitMachineBId
	})
	.update({
		'attribute_set_metadata': JSON.stringify(machineMetadata)
	});

	// Add metadata for station A,B
	let stationMetadata = [];

	let stationABMachineACapacity = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND attribute_set_id = ? AND internal_tag = 'MACHINE_A_CAPACITY'`, [tenantId, stationAttributeSetId]);
	let stationMetadataObjectAcapacity = {
		'machine_id': mainUnitMachineAId,
		'external_tag': 'MACHINE_CAPACITY' ,
		'parameter_id': stationABMachineACapacity.rows[0].id
	};
	stationMetadata.push(stationMetadataObjectAcapacity);

	let stationABMachineATimestamp = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND attribute_set_id = ? AND internal_tag = 'MACHINE_A_TIMESTAMP'`, [tenantId, stationAttributeSetId]);
	let stationMetadataObjectAtimestamp = {
		'machine_id': mainUnitMachineAId,
		'external_tag': 'MACHINE_TIMESTAMP',
		'parameter_id': stationABMachineATimestamp.rows[0].id
	};
	stationMetadata.push(stationMetadataObjectAtimestamp);

	let stationABMachineAWeight = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND attribute_set_id = ? AND internal_tag = 'MACHINE_A_WEIGHT_PER_HOUR'`, [tenantId, stationAttributeSetId]);
	let stationMetadataobjectAweight = {
		'machine_id': mainUnitMachineAId,
		'external_tag': 'WEIGHT_PER_HOUR',
		'parameter_id': stationABMachineAWeight.rows[0].id
	};
	stationMetadata.push(stationMetadataobjectAweight);

	let stationABMachineBCapacity = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND attribute_set_id = ? AND internal_tag = 'MACHINE_B_CAPACITY'`, [tenantId, stationAttributeSetId]);
	let stationMetadataObjectBcapacity = {
		'machine_id': mainUnitMachineBId,
		'external_tag': 'MACHINE_CAPACITY',
		'parameter_id': stationABMachineBCapacity.rows[0].id
	};
	stationMetadata.push(stationMetadataObjectBcapacity);

	let stationABMachineBTimestamp = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND attribute_set_id = ? AND internal_tag = 'MACHINE_B_TIMESTAMP'`, [tenantId, stationAttributeSetId]);
	let stationMetadataObjectBtimestamp = {
		'machine_id': mainUnitMachineBId,
		'external_tag': 'MACHINE_TIMESTAMP',
		'parameter_id': stationABMachineBTimestamp.rows[0].id
	};
	stationMetadata.push(stationMetadataObjectBtimestamp);

	let stationABMachineBWeight = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND attribute_set_id = ? AND internal_tag = 'MACHINE_B_WEIGHT_PER_HOUR'`, [tenantId, stationAttributeSetId]);
	let stationMetadataobjectBweight = {
		'machine_id': mainUnitMachineBId,
		'external_tag': 'WEIGHT_PER_HOUR',
		'parameter_id': stationABMachineBWeight.rows[0].id
	};
	stationMetadata.push(stationMetadataobjectBweight);

	await knex('tenant_plant_unit_stations')
	.where({
		'id': mainUnitStationABId
	})
	.update({
		'attribute_set_metadata': JSON.stringify(stationMetadata)
	});

	// Create new Line A
	let mainUnitLineAId = await knex.raw(`SELECT id FROM tenant_plant_unit_lines WHERE tenant_plant_unit_id = ? AND name = 'Line A'`, [plantUnitId]);
	if(!mainUnitLineAId.rows.length) {
		mainUnitLineAId = await knex('tenant_plant_unit_lines').insert({
			'id': '5667de92-0a57-48e0-8ea4-b7761b1665c5',
			'tenant_id': tenantId,
			'tenant_plant_unit_id': plantUnitId,
			'name': 'Line A',
			'description': 'Line A description',
			'data_persistence_period': 183
		})
		.returning('id');

		mainUnitLineAId = mainUnitLineAId[0];
	}
	else {
		mainUnitLineAId = mainUnitLineAId.rows[0]['id'];
	}

	// add standard line attribute set in tenant table
	let lineAttributeSetId = await knex.raw(`SELECT id FROM tenant_attribute_sets WHERE tenant_id = ? AND name = 'Std. Line Data Set'`, [tenantId]);
	if(!lineAttributeSetId.rows.length) {
		lineAttributeSetId = await knex('tenant_attribute_sets').insert({
			'id': '37cf7340-0326-4209-b6bd-e4d1b237ab88',
			'tenant_id': tenantId,
			'tenant_module_id': tenantModuleId,
			'tenant_folder_id': attributeSetFolderId,
			'name': 'Std. Line Data Set',
			'description': 'Std. Line Data Set description'
		})
		.returning('id');

		lineAttributeSetId = lineAttributeSetId[0];
	}
	else {
		lineAttributeSetId = lineAttributeSetId.rows[0]['id'];
	}

	// Create Line A constituents

	// add Line A constituent block table
	let lineConstituentBlockId = await knex.raw(`SELECT id FROM tenant_plant_unit_line_constituent_block_entities WHERE tenant_id = ? AND block_id = '76628f9a-c4c9-41f9-9d41-8df0b412d2d7'`, [tenantId]);
	if(!lineConstituentBlockId.rows.length) {
		lineConstituentBlockId = await knex('tenant_plant_unit_line_constituent_block_entities').insert({
			'id': '06f34d88-d53e-4e28-8c24-86e47e92e5f5',
			'tenant_id': tenantId,
			'block_id': '76628f9a-c4c9-41f9-9d41-8df0b412d2d7',
			'entity_id': '11cccee1-307b-4f77-9e9f-6881ceb18637',
			'entity_type': 'machine',
			'is_active': true
		})
		.returning('id');

		lineConstituentBlockId = lineConstituentBlockId[0];
	}
	else {
		lineConstituentBlockId = lineConstituentBlockId.rows[0]['id'];
	}

	// add Line A machine constituent
	let linedependentMachineId = await knex.raw(`SELECT id FROM tenant_plant_unit_line_constituents WHERE tenant_id = ? AND tenant_plant_unit_line_constituent_id = '3b1385b1-07fb-4ac9-8c23-d07fbb1736fe'`, [tenantId]);
	if(!linedependentMachineId.rows.length) {
		linedependentMachineId = await knex('tenant_plant_unit_line_constituents').insert({
			'id': '4f20adc3-4df8-4e0a-8465-70fae83e4459',
			'tenant_id': tenantId,
			'tenant_plant_unit_line_id': mainUnitLineAId,
			'step': 1,
			'tenant_plant_unit_line_constituent_id': '3b1385b1-07fb-4ac9-8c23-d07fbb1736fe',
			'constituent_type': 'machine'
		})
		.returning('id');

		linedependentMachineId = linedependentMachineId[0];
	}
	else {
		linedependentMachineId = linedependentMachineId.rows[0]['id'];
	}

	// add Line A block constituent
	let linedependentBlockId = await knex.raw(`SELECT id FROM tenant_plant_unit_line_constituents WHERE tenant_id = ? AND tenant_plant_unit_line_constituent_id = '76628f9a-c4c9-41f9-9d41-8df0b412d2d7'`, [tenantId]);
	if(!linedependentBlockId.rows.length) {
		linedependentBlockId = await knex('tenant_plant_unit_line_constituents').insert({
			'id': '5aee286b-cf38-4939-9b0d-8107431ad3d4',
			'tenant_id': tenantId,
			'tenant_plant_unit_line_id': mainUnitLineAId,
			'step': 2,
			'tenant_plant_unit_line_constituent_id': '76628f9a-c4c9-41f9-9d41-8df0b412d2d7',
			'constituent_type': 'block_some'
		})
		.returning('id');

		linedependentBlockId = linedependentBlockId[0];
	}
	else {
		linedependentBlockId = linedependentBlockId.rows[0]['id'];
	}

	// Create station observed lines
	let stationObservedLineA = await knex.raw(`SELECT id FROM tenant_plant_unit_stations_observed_lines WHERE tenant_plant_unit_station_id = ? AND tenant_plant_unit_line_id = ?`, [mainUnitStationABId, mainUnitLineAId]);
	if(!stationObservedLineA.rows.length) {
		stationObservedLineA = await knex('tenant_plant_unit_stations_observed_lines').insert({
			'id': 'c9777a94-603e-4183-be6e-b6726eae83dd',
			'tenant_id': tenantId,
			'tenant_plant_unit_station_id': mainUnitStationABId,
			'tenant_plant_unit_line_id': mainUnitLineAId
		})
		.returning('id');

		stationObservedLineA = stationObservedLineA[0];
	}
	else {
		stationObservedLineA = stationObservedLineA.rows[0]['id'];
	}

	// add line attribute set properties in tenant attribute properties table
	let lineAttrSetProperty1 = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND name = 'Machine A Capacity'`, [tenantId]);
	if(!lineAttrSetProperty1.rows.length) {
		lineAttrSetProperty1 = await knex('tenant_attribute_set_properties').insert({
			'id': '43edd3ac-b994-498a-9f53-e8684339b1f0',
			'tenant_id': tenantId,
			'attribute_set_id': lineAttributeSetId,
			'name': 'Machine A Capacity',
			'description': 'Std. Line Data Set -> Machine A Capacity',
			'internal_tag': 'MACHINE_A_CAPACITY',
			'evaluation_expression': '',
			'units': 'kg/hr',
			'source': 'input',
			'datatype': 'number',
			'timestamp_format': 'not_a_timestamp'
		})
		.returning('id');

		lineAttrSetProperty1 = lineAttrSetProperty1[0];
	}
	else {
		lineAttrSetProperty1 = lineAttrSetProperty1.rows[0]['id'];
	}

	let lineAttrSetProperty2 = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND name = 'Machine B Capacity'`, [tenantId]);
	if(!lineAttrSetProperty2.rows.length) {
		lineAttrSetProperty2 = await knex('tenant_attribute_set_properties').insert({
			'id': '509d9ef4-34dc-4039-b51e-e592d38e530c',
			'tenant_id': tenantId,
			'attribute_set_id': lineAttributeSetId,
			'name': 'Machine B Capacity',
			'description': 'Std. Line Data Set -> Machine B Capacity',
			'internal_tag': 'MACHINE_B_CAPACITY',
			'evaluation_expression': '',
			'units': 'kg/hr',
			'source': 'input',
			'datatype': 'number',
			'timestamp_format': 'not_a_timestamp'
		})
		.returning('id');

		lineAttrSetProperty2 = lineAttrSetProperty2[0];
	}
	else {
		lineAttrSetProperty2 = lineAttrSetProperty2.rows[0]['id'];
	}

	let lineAttrSetProperty3 = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND name = 'Machine A Timestamp'`, [tenantId]);
	if(!lineAttrSetProperty3.rows.length) {
		lineAttrSetProperty3 = await knex('tenant_attribute_set_properties').insert({
			'id': '85234d26-d1e0-476f-bb40-6fa25984b2ba',
			'tenant_id': tenantId,
			'attribute_set_id': lineAttributeSetId,
			'name': 'Machine A Timestamp',
			'description': 'Std. Line Data Set -> Machine A Timestamp',
			'internal_tag': 'MACHINE_A_Timestamp',
			'evaluation_expression': '',
			'units': '',
			'source': 'input',
			'datatype': 'date',
			'timestamp_format': 'unix_epoch_with_milliseconds'
		})
		.returning('id');

		lineAttrSetProperty3 = lineAttrSetProperty3[0];
	}
	else {
		lineAttrSetProperty3 = lineAttrSetProperty3.rows[0]['id'];
	}

	let lineAttrSetProperty4 = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND name = 'Machine B Timestamp'`, [tenantId]);
	if(!lineAttrSetProperty4.rows.length) {
		lineAttrSetProperty4 = await knex('tenant_attribute_set_properties').insert({
			'id': '6ad1a5e7-cdc7-4b8d-a6ed-9c01be76ba8e',
			'tenant_id': tenantId,
			'attribute_set_id': lineAttributeSetId,
			'name': 'Machine B Timestamp',
			'description': 'Std. Line Data Set -> Machine B Timestamp',
			'internal_tag': 'MACHINE_B_Timestamp',
			'evaluation_expression': '',
			'units': '',
			'source': 'input',
			'datatype': 'date',
			'timestamp_format': 'unix_epoch_with_milliseconds'
		})
		.returning('id');

		lineAttrSetProperty4 = lineAttrSetProperty4[0];
	}
	else {
		lineAttrSetProperty4 = lineAttrSetProperty4.rows[0]['id'];
	}

	let lineAttrSetProperty5 = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND name = 'Machine A Weight Per Hour'`, [tenantId]);
	if(!lineAttrSetProperty5.rows.length) {
		lineAttrSetProperty5 = await knex('tenant_attribute_set_properties').insert({
			'id': 'e425a3f7-5dae-4a91-b9c9-0167032f0118',
			'tenant_id': tenantId,
			'attribute_set_id': lineAttributeSetId,
			'name': 'Machine A Weight Per Hour',
			'description': 'Std. Line Data Set -> Machine A Weight Per Hour',
			'internal_tag': 'MACHINE_A_Weight_Per_Hour',
			'evaluation_expression': '',
			'units': 'kg/hr',
			'source': 'input',
			'datatype': 'number',
			'timestamp_format': 'not_a_timestamp'
		})
		.returning('id');

		lineAttrSetProperty5 = lineAttrSetProperty5[0];
	}
	else {
		lineAttrSetProperty5 = lineAttrSetProperty5.rows[0]['id'];
	}

	let lineAttrSetProperty6 = await knex.raw(`SELECT id FROM tenant_attribute_set_properties WHERE tenant_id = ? AND name = 'Machine B Weight Per Hour'`, [tenantId]);
	if(!lineAttrSetProperty6.rows.length) {
		lineAttrSetProperty6 = await knex('tenant_attribute_set_properties').insert({
			'id': '0b476c33-cc60-42a0-ae95-e390da746655',
			'tenant_id': tenantId,
			'attribute_set_id': lineAttributeSetId,
			'name': 'Machine B Weight Per Hour',
			'description': 'Std. Line Data Set -> Machine B Weight Per Hour',
			'internal_tag': 'MACHINE_B_Weight_Per_Hour',
			'evaluation_expression': '',
			'units': 'kg/hr',
			'source': 'input',
			'datatype': 'number',
			'timestamp_format': 'not_a_timestamp'
		})
		.returning('id');

		lineAttrSetProperty6 = lineAttrSetProperty6[0];
	}
	else {
		lineAttrSetProperty6 = lineAttrSetProperty6.rows[0]['id'];
	}

	// link line A attribute set in lines table
	let lineAattributeId = await knex.raw(`SELECT id FROM tenant_plant_unit_lines_attribute_sets WHERE tenant_id = ? AND tenant_plant_unit_line_id = ?`, [tenantId, mainUnitLineAId]);
	if(!lineAattributeId.rows.length) {
		lineAattributeId = await knex('tenant_plant_unit_lines_attribute_sets').insert({
			'id': '2b22ce18-3cda-4f7c-9ea0-c5acf7e0ac66',
			'tenant_id': tenantId,
			'tenant_plant_unit_line_id': mainUnitLineAId,
			'tenant_attribute_set_id': lineAttributeSetId,
			'evaluation_order': 1
		})
		.returning('id');

		lineAattributeId = lineAattributeId[0];
	}
	else {
		lineAattributeId = lineAattributeId.rows[0]['id'];
	}
}
