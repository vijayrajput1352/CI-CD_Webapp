/**
 * This sets up the schema for the manufacturing feature
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;

	/* Step 0: Basics - enums, master tables, etc. */
	await knex.schema.raw("CREATE TYPE public.plant_machine_type AS ENUM ('machine', 'splitter')");
	await knex.schema.raw("CREATE TYPE public.plant_schedule_type AS ENUM ('holiday')");
	await knex.schema.raw("CREATE TYPE public.plant_unit_schedule_type AS ENUM ('holiday', 'planned_downtime', 'scheduled_downtime', 'shift')");
	await knex.schema.raw("CREATE TYPE public.plant_unit_machine_schedule_type AS ENUM ('scheduled_downtime', 'planned_downtime', 'maintenance')");

	exists = await knex.schema.withSchema('public').hasTable('hardware_protocol_master');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('hardware_protocol_master', function(ProtocolMasterTbl) {
			ProtocolMasterTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			ProtocolMasterTbl.text('name').notNullable();
			ProtocolMasterTbl.text('version').notNullable();
			ProtocolMasterTbl.jsonb('configuration_schema').notNullable().defaultTo('{}');

			ProtocolMasterTbl.jsonb('metadata');
			ProtocolMasterTbl.text('description');

			ProtocolMasterTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			ProtocolMasterTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			ProtocolMasterTbl.unique(['name', 'version']);
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('communication_protocol_master');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('communication_protocol_master', function(ProtocolMasterTbl) {
			ProtocolMasterTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			ProtocolMasterTbl.text('name').notNullable();
			ProtocolMasterTbl.text('version').notNullable();
			ProtocolMasterTbl.boolean('is_bidirectional').notNullable().defaultTo(false);
			ProtocolMasterTbl.jsonb('configuration_schema').notNullable().defaultTo('{}');

			ProtocolMasterTbl.jsonb('metadata');
			ProtocolMasterTbl.text('description');

			ProtocolMasterTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			ProtocolMasterTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			ProtocolMasterTbl.unique(['name', 'version']);
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('machine_master');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('machine_master', function(MachineMasterTbl) {
			MachineMasterTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			MachineMasterTbl.text('name').notNullable();

			MachineMasterTbl.text('manufacturer').notNullable();
			MachineMasterTbl.text('category').notNullable();
			MachineMasterTbl.text('model').notNullable();
			MachineMasterTbl.text('firmware_version').notNullable();

			MachineMasterTbl.uuid('image');
			MachineMasterTbl.jsonb('metadata');
			MachineMasterTbl.text('description');

			MachineMasterTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			MachineMasterTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			MachineMasterTbl.unique(['manufacturer', 'category', 'model']);
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('plc_master');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('plc_master', function(PlcMasterTbl) {
			PlcMasterTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PlcMasterTbl.text('name').notNullable();

			PlcMasterTbl.text('manufacturer').notNullable();
			PlcMasterTbl.text('category').notNullable();
			PlcMasterTbl.text('model').notNullable();
			PlcMasterTbl.text('firmware_version').notNullable();

			PlcMasterTbl.uuid('image');
			PlcMasterTbl.jsonb('metadata');
			PlcMasterTbl.text('description');

			PlcMasterTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PlcMasterTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PlcMasterTbl.unique(['manufacturer', 'category', 'model']);
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('plcs_hardware_protocols');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('plcs_hardware_protocols', function(PlcProtocolTbl) {
			PlcProtocolTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));

			PlcProtocolTbl.uuid('plc_id').notNullable().references('id').inTable('plc_master').onDelete('CASCADE').onUpdate('CASCADE');
			PlcProtocolTbl.uuid('protocol_id').notNullable().references('id').inTable('hardware_protocol_master').onDelete('CASCADE').onUpdate('CASCADE');

			PlcProtocolTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PlcProtocolTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PlcProtocolTbl.unique(['plc_id', 'protocol_id']);
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('gateway_master');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('gateway_master', function(GatewayMasterTbl) {
			GatewayMasterTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			GatewayMasterTbl.text('name').notNullable();

			GatewayMasterTbl.text('manufacturer').notNullable();
			GatewayMasterTbl.text('category').notNullable();
			GatewayMasterTbl.text('model').notNullable();

			GatewayMasterTbl.uuid('image');
			GatewayMasterTbl.jsonb('metadata');
			GatewayMasterTbl.text('description');

			GatewayMasterTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			GatewayMasterTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			GatewayMasterTbl.unique(['manufacturer', 'category', 'model']);
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('gateways_hardware_protocols');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('gateways_hardware_protocols', function(GatewayProtocolTbl) {
			GatewayProtocolTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));

			GatewayProtocolTbl.uuid('gateway_id').notNullable().references('id').inTable('gateway_master').onDelete('CASCADE').onUpdate('CASCADE');
			GatewayProtocolTbl.uuid('protocol_id').notNullable().references('id').inTable('hardware_protocol_master').onDelete('CASCADE').onUpdate('CASCADE');

			GatewayProtocolTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			GatewayProtocolTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			GatewayProtocolTbl.unique(['gateway_id', 'protocol_id']);
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('gateways_communication_protocols');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('gateways_communication_protocols', function(GatewayProtocolTbl) {
			GatewayProtocolTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));

			GatewayProtocolTbl.uuid('gateway_id').notNullable().references('id').inTable('gateway_master').onDelete('CASCADE').onUpdate('CASCADE');
			GatewayProtocolTbl.uuid('protocol_id').notNullable().references('id').inTable('communication_protocol_master').onDelete('CASCADE').onUpdate('CASCADE');

			GatewayProtocolTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			GatewayProtocolTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			GatewayProtocolTbl.unique(['gateway_id', 'protocol_id']);
		});
	}

	/* Step 1: The plant */
	exists = await knex.schema.withSchema('public').hasTable('tenant_plants');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plants', function(PlantsTbl) {
			PlantsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PlantsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			PlantsTbl.uuid('tenant_folder_id').notNullable();

			PlantsTbl.text('name').notNullable();
			PlantsTbl.text('description');
			PlantsTbl.uuid('tenant_location_id');

			PlantsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PlantsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PlantsTbl.unique(['id', 'tenant_id']);
			PlantsTbl.unique(['tenant_folder_id', 'name']);

			PlantsTbl.foreign(['tenant_location_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_locations').onDelete('SET NULL').onUpdate('SET NULL');
			PlantsTbl.foreign(['tenant_folder_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_folders').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_schedules');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_schedules', function(PlantScheduleTbl) {
			PlantScheduleTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PlantScheduleTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			PlantScheduleTbl.uuid('tenant_plant_id').notNullable();

			PlantScheduleTbl.text('description');
			PlantScheduleTbl.specificType('type', 'public.plant_schedule_type').notNullable().defaultTo('holiday');
			PlantScheduleTbl.timestamp('start_date').notNullable().defaultTo(knex.fn.now());
			PlantScheduleTbl.timestamp('end_date').notNullable().defaultTo(knex.fn.now());

			PlantScheduleTbl.text('start_time').notNullable().defaultTo("00:00");
			PlantScheduleTbl.text('end_time').notNullable().defaultTo("00:00");

			PlantScheduleTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PlantScheduleTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PlantScheduleTbl.unique(['id', 'tenant_id']);

			PlantScheduleTbl.foreign(['tenant_plant_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plants').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	/* Step 2: The units inside a plant - contain machines and stations */
	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_units');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_units', function(PlantUnitsTbl) {
			PlantUnitsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PlantUnitsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			PlantUnitsTbl.uuid('tenant_plant_id').notNullable();
			PlantUnitsTbl.uuid('parent_id');

			PlantUnitsTbl.text('name').notNullable();
			PlantUnitsTbl.text('description');

			PlantUnitsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PlantUnitsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PlantUnitsTbl.unique(['id', 'tenant_id']);
			PlantUnitsTbl.unique(['parent_id', 'name']);

			PlantUnitsTbl.foreign(['parent_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_units').onDelete('CASCADE').onUpdate('CASCADE');
			PlantUnitsTbl.foreign(['tenant_plant_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plants').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_schedules');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_schedules', function(PlantUnitScheduleTbl) {
			PlantUnitScheduleTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PlantUnitScheduleTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			PlantUnitScheduleTbl.uuid('tenant_plant_unit_id').notNullable();

			PlantUnitScheduleTbl.text('description');
			PlantUnitScheduleTbl.specificType('type', 'public.plant_unit_schedule_type').notNullable().defaultTo('holiday');
			PlantUnitScheduleTbl.boolean('is_first_shift').notNullable().defaultTo(false);
			PlantUnitScheduleTbl.timestamp('start_date').notNullable().defaultTo(knex.fn.now());
			PlantUnitScheduleTbl.timestamp('end_date').notNullable().defaultTo(knex.fn.now());

			PlantUnitScheduleTbl.text('start_time').notNullable().defaultTo("00:00");
			PlantUnitScheduleTbl.text('end_time').notNullable().defaultTo("00:00");

			PlantUnitScheduleTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PlantUnitScheduleTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PlantUnitScheduleTbl.unique(['id', 'tenant_id']);

			PlantUnitScheduleTbl.foreign(['tenant_plant_unit_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_units').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	/* Step 3: The drivers that upload data from a plant - mapped to the machines that they are connected to */
	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_drivers');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_drivers', function(PlantDriversTbl) {
			PlantDriversTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PlantDriversTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			PlantDriversTbl.uuid('tenant_plant_unit_id').notNullable();

			PlantDriversTbl.text('name').notNullable();
			PlantDriversTbl.text('description');

			PlantDriversTbl.uuid('gateway_id').references('id').inTable('gateway_master').onDelete('SET NULL').onUpdate('CASCADE');
			PlantDriversTbl.boolean('status').notNullable().defaultTo(true);
			PlantDriversTbl.text('deployed_cloud').notNullable().defaultTo('Plant.Works');

			PlantDriversTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PlantDriversTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PlantDriversTbl.unique(['id', 'tenant_id']);
			PlantDriversTbl.unique(['tenant_plant_unit_id', 'name']);

			PlantDriversTbl.foreign(['tenant_plant_unit_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_units').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_driver_aws_artifacts');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_driver_aws_artifacts', function(PlantDriverAWSTbl) {
			PlantDriverAWSTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PlantDriverAWSTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			PlantDriverAWSTbl.uuid('tenant_plant_unit_driver_id').notNullable();

			PlantDriverAWSTbl.text('aws_certificate_id').notNullable();
			PlantDriverAWSTbl.jsonb('aws_certificate').notNullable();

			PlantDriverAWSTbl.text('aws_thing_id').notNullable();
			PlantDriverAWSTbl.jsonb('aws_thing').notNullable();

			PlantDriverAWSTbl.text('aws_endpoint').notNullable();

			PlantDriverAWSTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PlantDriverAWSTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PlantDriverAWSTbl.unique(['id', 'tenant_id']);
			PlantDriverAWSTbl.foreign(['tenant_plant_unit_driver_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_drivers').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	/* Step 4: Machines, stations, etc. */
	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_machines');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_machines', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PlantUnitMachinesTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			PlantUnitMachinesTbl.uuid('tenant_plant_unit_id').notNullable();

			PlantUnitMachinesTbl.text('name').notNullable();
			PlantUnitMachinesTbl.specificType('type', 'public.plant_machine_type').notNullable().defaultTo('machine');
			PlantUnitMachinesTbl.text('tags');
			PlantUnitMachinesTbl.text('description');

			PlantUnitMachinesTbl.uuid('machine_id').references('id').inTable('machine_master').onDelete('SET NULL').onUpdate('CASCADE');
			PlantUnitMachinesTbl.uuid('plc_id').references('id').inTable('plc_master').onDelete('SET NULL').onUpdate('CASCADE');
			PlantUnitMachinesTbl.uuid('tenant_plant_unit_driver_id');

			PlantUnitMachinesTbl.uuid('hardware_protocol_id');
			PlantUnitMachinesTbl.uuid('communication_protocol_id');
			PlantUnitMachinesTbl.integer('data_period').notNull().defaultTo(60);
			PlantUnitMachinesTbl.integer('data_persistence_period').notNullable().defaultTo(1);
			PlantUnitMachinesTbl.jsonb('attribute_set_metadata').notNullable().defaultTo('[]');

			PlantUnitMachinesTbl.uuid('operator_list_id');
			PlantUnitMachinesTbl.jsonb('operator_list_filters').notNullable().defaultTo('[]')

			PlantUnitMachinesTbl.uuid('downtime_list_id');
			PlantUnitMachinesTbl.uuid('speed_deviation_list_id');
			PlantUnitMachinesTbl.jsonb('downtime_list_filters').notNullable().defaultTo('[]');
			PlantUnitMachinesTbl.jsonb('setuptime_list_filters').notNullable().defaultTo('[]');
			PlantUnitMachinesTbl.jsonb('idletime_list_filters').notNullable().defaultTo('[]');
			PlantUnitMachinesTbl.jsonb('speed_deviations_list_filters').notNullable().defaultTo('[]');

			PlantUnitMachinesTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PlantUnitMachinesTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PlantUnitMachinesTbl.unique(['id', 'tenant_id']);
			PlantUnitMachinesTbl.unique(['tenant_plant_unit_id', 'name']);

			PlantUnitMachinesTbl.foreign(['tenant_plant_unit_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_units').onDelete('CASCADE').onUpdate('CASCADE');
			PlantUnitMachinesTbl.foreign(['tenant_plant_unit_driver_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_drivers').onDelete('SET NULL').onUpdate('CASCADE');
			PlantUnitMachinesTbl.foreign(['operator_list_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_emd_configurations').onDelete('SET NULL').onUpdate('CASCADE');
			PlantUnitMachinesTbl.foreign(['downtime_list_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_emd_configurations').onDelete('SET NULL').onUpdate('CASCADE');
			PlantUnitMachinesTbl.foreign(['speed_deviation_list_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_emd_configurations').onDelete('SET NULL').onUpdate('CASCADE');
			PlantUnitMachinesTbl.foreign(['plc_id', 'hardware_protocol_id']).references(['plc_id', 'protocol_id']).inTable('plcs_hardware_protocols').onDelete('SET NULL').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_machine_processors');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_machine_processors', function(MachineProcessorTbl) {
			MachineProcessorTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			MachineProcessorTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			MachineProcessorTbl.uuid('tenant_plant_unit_machine_id').notNullable();

			MachineProcessorTbl.text('raw_data_transform_code');
			MachineProcessorTbl.text('processed_data_transform_code');
			MachineProcessorTbl.text('pre_realtime_push_transform_code');

			MachineProcessorTbl.text('availability_calculation_code');
			MachineProcessorTbl.text('performance_calculation_code');
			MachineProcessorTbl.text('quality_calculation_code');

			MachineProcessorTbl.boolean('is_custom_oee_calculation').notNullable().defaultTo(false);
			MachineProcessorTbl.text('custom_oee_calculation_code');

			MachineProcessorTbl.text('processor');
			MachineProcessorTbl.boolean('publish_status').notNullable().defaultTo(false);

			MachineProcessorTbl.timestamp('effectivity_start');
			MachineProcessorTbl.timestamp('effectivity_end');

			MachineProcessorTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			MachineProcessorTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			MachineProcessorTbl.unique(['id', 'tenant_id']);
			MachineProcessorTbl.foreign(['tenant_plant_unit_machine_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_machines').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_machine_templates');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_machine_templates', function(MachineTemplateTbl) {
			MachineTemplateTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			MachineTemplateTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			MachineTemplateTbl.uuid('tenant_plant_unit_machine_id').notNullable();

			MachineTemplateTbl.text('component_state').notNullable().defaultTo('{}');
			MachineTemplateTbl.text('component_before_render_code');
			MachineTemplateTbl.text('component_after_render_code');
			MachineTemplateTbl.text('component_on_data_code');
			MachineTemplateTbl.text('component_before_destroy_code');
			MachineTemplateTbl.text('template');
			MachineTemplateTbl.jsonb('component_observers').notNullable().defaultTo('[]');
			MachineTemplateTbl.jsonb('component_tasks').notNullable().defaultTo('[]');

			MachineTemplateTbl.boolean('publish_status').notNullable().defaultTo(false);

			MachineTemplateTbl.timestamp('effectivity_start');
			MachineTemplateTbl.timestamp('effectivity_end');

			MachineTemplateTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			MachineTemplateTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			MachineTemplateTbl.unique(['id', 'tenant_id']);
			MachineTemplateTbl.foreign(['tenant_plant_unit_machine_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_machines').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_machine_schedules');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_machine_schedules', function(PlantUnitMachineScheduleTbl) {
			PlantUnitMachineScheduleTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PlantUnitMachineScheduleTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			PlantUnitMachineScheduleTbl.uuid('tenant_plant_unit_machine_id').notNullable();

			PlantUnitMachineScheduleTbl.text('description');
			PlantUnitMachineScheduleTbl.specificType('type', 'public.plant_unit_machine_schedule_type').notNullable().defaultTo('scheduled_downtime');
			PlantUnitMachineScheduleTbl.timestamp('start_date').notNullable().defaultTo(knex.fn.now());
			PlantUnitMachineScheduleTbl.timestamp('end_date').notNullable().defaultTo(knex.fn.now());

			PlantUnitMachineScheduleTbl.text('start_time').notNullable().defaultTo("00:00");
			PlantUnitMachineScheduleTbl.text('end_time').notNullable().defaultTo("00:00");

			PlantUnitMachineScheduleTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PlantUnitMachineScheduleTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PlantUnitMachineScheduleTbl.unique(['id', 'tenant_id']);

			PlantUnitMachineScheduleTbl.foreign(['tenant_plant_unit_machine_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_machines').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_stations');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_stations', function(PlantUnitStationsTbl) {
			PlantUnitStationsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PlantUnitStationsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			PlantUnitStationsTbl.uuid('tenant_plant_unit_id').notNullable();

			PlantUnitStationsTbl.text('name').notNullable();
			PlantUnitStationsTbl.text('tags');
			PlantUnitStationsTbl.text('description');

			PlantUnitStationsTbl.integer('data_persistence_period').notNullable().defaultTo(1);
			PlantUnitStationsTbl.jsonb('attribute_set_metadata').notNullable().defaultTo('[]');

			PlantUnitStationsTbl.uuid('operator_list_id');
			PlantUnitStationsTbl.jsonb('operator_list_filters').notNullable().defaultTo('[]')

			PlantUnitStationsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PlantUnitStationsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PlantUnitStationsTbl.unique(['id', 'tenant_id']);
			PlantUnitStationsTbl.unique(['tenant_plant_unit_id', 'name']);

			PlantUnitStationsTbl.foreign(['tenant_plant_unit_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_units').onDelete('CASCADE').onUpdate('CASCADE');
			PlantUnitStationsTbl.foreign(['operator_list_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_emd_configurations').onDelete('SET NULL').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_stations_observed_machines');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_stations_observed_machines', function(PlantUnitStationObservedMachinesTbl) {
			PlantUnitStationObservedMachinesTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PlantUnitStationObservedMachinesTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			PlantUnitStationObservedMachinesTbl.uuid('tenant_plant_unit_station_id').notNullable();
			PlantUnitStationObservedMachinesTbl.uuid('tenant_plant_unit_machine_id').notNullable();

			PlantUnitStationObservedMachinesTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PlantUnitStationObservedMachinesTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PlantUnitStationObservedMachinesTbl.unique(['id', 'tenant_id']);
			PlantUnitStationObservedMachinesTbl.unique(['tenant_plant_unit_station_id', 'tenant_plant_unit_machine_id']);
		});

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE
				public.tenant_plant_unit_stations_observed_machines
			ADD CONSTRAINT
				fk_stations_observed_machines_stations
			FOREIGN KEY (
				tenant_plant_unit_station_id,
				tenant_id
			)
			REFERENCES
				public.tenant_plant_unit_stations (
					id,
					tenant_id
				)
			ON UPDATE CASCADE
			ON DELETE CASCADE;
			`
		);

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE
				public.tenant_plant_unit_stations_observed_machines
			ADD CONSTRAINT
				fk_stations_observed_machines_machines
			FOREIGN KEY (
				tenant_plant_unit_machine_id,
				tenant_id
			)
			REFERENCES
				public.tenant_plant_unit_machines (
					id,
					tenant_id
				)
			ON UPDATE CASCADE
			ON DELETE CASCADE;
			`
		);
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_station_processors');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_station_processors', function(StationProcessorTbl) {
			StationProcessorTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			StationProcessorTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			StationProcessorTbl.uuid('tenant_plant_unit_station_id').notNullable();

			StationProcessorTbl.text('processed_data_transform_code');
			StationProcessorTbl.text('pre_realtime_push_transform_code');

			StationProcessorTbl.text('processor');
			StationProcessorTbl.boolean('publish_status').notNullable().defaultTo(false);

			StationProcessorTbl.timestamp('effectivity_start');
			StationProcessorTbl.timestamp('effectivity_end');

			StationProcessorTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			StationProcessorTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			StationProcessorTbl.unique(['id', 'tenant_id']);
			StationProcessorTbl.foreign(['tenant_plant_unit_station_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_stations').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_station_templates');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_station_templates', function(StationTemplateTbl) {
			StationTemplateTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			StationTemplateTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			StationTemplateTbl.uuid('tenant_plant_unit_station_id').notNullable();

			StationTemplateTbl.text('component_state').notNullable().defaultTo('{}');
			StationTemplateTbl.text('component_before_render_code');
			StationTemplateTbl.text('component_after_render_code');
			StationTemplateTbl.text('component_on_data_code');
			StationTemplateTbl.text('component_before_destroy_code');
			StationTemplateTbl.text('template');
			StationTemplateTbl.jsonb('component_observers').notNullable().defaultTo('[]');
			StationTemplateTbl.jsonb('component_tasks').notNullable().defaultTo('[]');

			StationTemplateTbl.boolean('publish_status').notNullable().defaultTo(false);

			StationTemplateTbl.timestamp('effectivity_start');
			StationTemplateTbl.timestamp('effectivity_end');

			StationTemplateTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			StationTemplateTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			StationTemplateTbl.unique(['id', 'tenant_id']);
			StationTemplateTbl.foreign(['tenant_plant_unit_station_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_stations').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	/* Step 5: Functions, business rules enforced using triggers, etc. */
	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_get_plant_unit_ancestors (IN plantunitid uuid)
	RETURNS TABLE (level integer, id uuid,  parent_id uuid,  name text)
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	RETURN QUERY
	WITH RECURSIVE q AS (
		SELECT
			1 AS level,
			A.id,
			A.parent_id,
			A.name
		FROM
			tenant_plant_units A
		WHERE
			A.id = plantunitid
		UNION ALL
		SELECT
			q.level + 1,
			B.id,
			B.parent_id,
			B.name
		FROM
			q,
			tenant_plant_units B
		WHERE
			B.id = q.parent_id
	)
	SELECT DISTINCT
		q.level,
		q.id,
		q.parent_id,
		q.name
	FROM
		q
	ORDER BY
		q.level;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_get_plant_unit_descendants (IN plantunitid uuid)
	RETURNS TABLE (level integer,  id uuid,  parent_id uuid,  name text)
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	RETURN QUERY
	WITH RECURSIVE q AS (
		SELECT
			1 AS level,
			A.id,
			A.parent_id,
			A.name
		FROM
			tenant_plant_units A
		WHERE
			A.id = plantunitid
		UNION ALL
		SELECT
			q.level + 1,
			B.id,
			B.parent_id,
			B.name
		FROM
			q,
			tenant_plant_units B
		WHERE
			B.parent_id = q.id
	)
	SELECT DISTINCT
		q.level,
		q.id,
		q.parent_id,
		q.name
	FROM
		q
	ORDER BY
		q.level;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_check_plant_unit_upsert_is_valid ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	parent_plant_unit_type	TEXT;
	is_plant_unit_in_tree	INTEGER;
BEGIN
	/* Rule #1: No obviously infinite loops */
	IF NEW.id = NEW.parent_id
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Plant Unit cannot be its own parent';
		RETURN NULL;
	END IF;

	/* Rule #2: No non-obvious infinite loops, either */
	is_plant_unit_in_tree := 0;
	SELECT
		COUNT(id)
	FROM
		fn_get_plant_unit_ancestors(NEW.parent_id)
	WHERE
		id = NEW.id
	INTO
		is_plant_unit_in_tree;

	IF is_plant_unit_in_tree > 0
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Plant Unit cannot be its own ancestor';
		RETURN NULL;
	END IF;

	is_plant_unit_in_tree := 0;
	SELECT
		COUNT(id)
	FROM
		fn_get_plant_unit_descendants(NEW.id)
	WHERE
		id = NEW.id AND
		level > 1
	INTO
		is_plant_unit_in_tree;

	IF is_plant_unit_in_tree > 0
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Plant Unit cannot be its own descendant';
		RETURN NULL;
	END IF;

	/* We're good to go! */
	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_ensure_new_machine_hardware_protocol_is_ok ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	protocol_match_count INTEGER;
BEGIN
	IF NEW.tenant_plant_unit_driver_id IS NULL
	THEN
		RETURN NEW;
	END IF;

	IF NEW.hardware_protocol_id IS NULL
	THEN
		RETURN NEW;
	END IF;

	protocol_match_count := 0;
	SELECT
		count(id)
	FROM
		gateways_hardware_protocols
	WHERE
		gateway_id = (SELECT gateway_id FROM tenant_plant_unit_drivers WHERE id = NEW.tenant_plant_unit_driver_id) AND
		protocol_id = NEW.hardware_protocol_id
	INTO
		protocol_match_count;

	IF protocol_match_count = 0
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Driver attached to machine does not support Hardware Protocol supported by the PLC attached to machinie';
		RETURN NULL;
	END IF;

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_ensure_new_machine_communication_protocol_is_ok ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	protocol_match_count INTEGER;
BEGIN
	IF NEW.communication_protocol_id IS NULL
	THEN
		RETURN NEW;
	END IF;

	IF NEW.tenant_plant_unit_driver_id IS NULL
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Communication protocol cannot be selected till a Driver/Gateway is attached to the machine';
		RETURN NULL;
	END IF;

	protocol_match_count := 0;
	SELECT
		count(id)
	FROM
		gateways_communication_protocols
	WHERE
		gateway_id = (SELECT gateway_id FROM tenant_plant_unit_drivers WHERE id = NEW.tenant_plant_unit_driver_id) AND
		protocol_id = NEW.communication_protocol_id
	INTO
		protocol_match_count;

	IF protocol_match_count = 0
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Driver attached to machine does not support selected communication protocol';
		RETURN NULL;
	END IF;

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_ensure_updated_machine_protocol_is_ok ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	/* TODO: Figure out the logic here */
	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_create_manufacturing_folder_for_tenant ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	server_id UUID;
	manufacturing_feature_id UUID;
	root_folder_id UUID;
BEGIN
	server_id := NULL;
	manufacturing_feature_id := NULL;
	root_folder_id := NULL;

	SELECT
		id
	FROM
		modules
	WHERE
		name = 'PlantWorksWebappServer' AND
		type = 'server' AND
		parent_id IS NULL
	INTO
		server_id;

	IF server_id IS NULL
	THEN
		RETURN NEW;
	END IF;

	SELECT
		id
	FROM
		fn_get_module_descendants(server_id)
	WHERE
		name = 'Manufacturing' AND
		type = 'feature'
	INTO
		manufacturing_feature_id;

	IF manufacturing_feature_id IS NULL
	THEN
		RETURN NEW;
	END IF;

	IF NEW.module_id <> manufacturing_feature_id
	THEN
		RETURN NEW;
	END IF;

	INSERT INTO tenant_folders (
		tenant_id,
		name,
		description
	)
	VALUES (
		NEW.tenant_id,
		'manufacturing_feature.folder_names.root.name',
		'manufacturing_feature.folder_names.root.description'
	)
	RETURNING
		id
	INTO
		root_folder_id;

	INSERT INTO tenant_folders (
		tenant_id,
		parent_id,
		name,
		description
	)
	VALUES (
		NEW.tenant_id,
		root_folder_id,
		'manufacturing_feature.folder_names.attribute_sets.name',
		'manufacturing_feature.folder_names.attribute_sets.description'
	);

	INSERT INTO tenant_folders (
		tenant_id,
		parent_id,
		name,
		description
	)
	VALUES (
		NEW.tenant_id,
		root_folder_id,
		'manufacturing_feature.folder_names.plants.name',
		'manufacturing_feature.folder_names.plants.description'
	);

	RETURN NEW;
END;
$$;`
	);

	/* Finally, hook up the triggers */
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_plant_unit_upsert_is_valid BEFORE INSERT OR UPDATE ON public.tenant_plant_units FOR EACH ROW EXECUTE PROCEDURE public.fn_check_plant_unit_upsert_is_valid();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_ensure_new_machine_hardware_protocol_is_ok BEFORE INSERT ON public.tenant_plant_unit_machines FOR EACH ROW EXECUTE PROCEDURE public.fn_ensure_new_machine_hardware_protocol_is_ok();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_ensure_new_machine_communication_protocol_is_ok BEFORE INSERT ON public.tenant_plant_unit_machines FOR EACH ROW EXECUTE PROCEDURE public.fn_ensure_new_machine_communication_protocol_is_ok();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_ensure_updated_machine_protocol_is_ok BEFORE UPDATE ON public.tenant_plant_unit_machines FOR EACH ROW EXECUTE PROCEDURE public.fn_ensure_updated_machine_protocol_is_ok();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_create_manufacturing_folder_for_tenant AFTER INSERT OR UPDATE ON public.tenants_modules FOR EACH ROW EXECUTE PROCEDURE public.fn_create_manufacturing_folder_for_tenant();');
};

exports.down = async function(knex) {
	await knex.raw('DROP TRIGGER IF EXISTS trigger_create_manufacturing_folder_for_tenant ON public.tenants_modules CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_ensure_updated_machine_protocol_is_ok ON public.tenant_plant_unit_machines CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_ensure_new_machine_communication_protocol_is_ok ON public.tenant_plant_unit_machines CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_ensure_new_machine_hardware_protocol_is_ok ON public.tenant_plant_unit_machines CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_check_plant_unit_upsert_is_valid ON public.tenant_plant_units CASCADE;');

	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_create_manufacturing_folder_for_tenant () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_ensure_updated_machine_protocol_is_ok () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_ensure_new_machine_communication_protocol_is_ok () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_ensure_new_machine_hardware_protocol_is_ok () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_check_plant_unit_upsert_is_valid () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_get_plant_unit_descendants (IN uuid) CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_get_plant_unit_ancestors (IN uuid) CASCADE;`);

	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_station_templates CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_station_processors CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_stations_observed_machines CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_stations CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_machine_schedules CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_machine_templates CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_machine_processors CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_machines CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_driver_aws_artifacts CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_drivers CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_schedules CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_units CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_schedules CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plants CASCADE;`);

	await knex.raw(`DROP TABLE IF EXISTS public.gateways_communication_protocols CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.gateways_hardware_protocols CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.gateway_master CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.plcs_hardware_protocols CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.plc_master CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.machine_master CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.communication_protocol_master CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.hardware_protocol_master CASCADE;`);

	await knex.raw("DROP TYPE IF EXISTS public.plant_unit_machine_schedule_type CASCADE");
	await knex.raw(`DROP TYPE IF EXISTS public.plant_unit_schedule_type CASCADE;`);
	await knex.raw(`DROP TYPE IF EXISTS public.plant_schedule_type CASCADE;`);
	await knex.raw(`DROP TYPE IF EXISTS public.plant_machine_type CASCADE;`);
};
