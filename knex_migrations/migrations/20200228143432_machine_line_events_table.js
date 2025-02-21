
exports.up = async function(knex) {
	let exists = null;
	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_line_events');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_line_events', function(lineEventsTypeTbl) {
			lineEventsTypeTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			lineEventsTypeTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			lineEventsTypeTbl.uuid('tenant_plant_unit_line_id').notNullable();
			lineEventsTypeTbl.uuid('tenant_plant_unit_station_id').notNullable();

			lineEventsTypeTbl.uuid('event_type_id').notNullable().references('id').inTable('event_types').onUpdate('CASCADE').onDelete('RESTRICT');
			lineEventsTypeTbl.jsonb('event_metadata').notNullable().defaultTo('{}');
			lineEventsTypeTbl.timestamp('event_timestamp').notNullable().defaultTo(knex.fn.now());

			lineEventsTypeTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			lineEventsTypeTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			lineEventsTypeTbl.foreign(['tenant_plant_unit_line_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_lines').onDelete('RESTRICT').onUpdate('CASCADE');
			lineEventsTypeTbl.foreign(['tenant_plant_unit_station_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_stations').onDelete('RESTRICT').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_station_observed_machine_events');
	if(exists) {
		await knex.raw('DROP TABLE IF EXISTS public.tenant_plant_unit_station_observed_machine_events');
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_machine_events');

	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_machine_events', function(lineEventsTypeTbl) {
			lineEventsTypeTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			lineEventsTypeTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			lineEventsTypeTbl.uuid('tenant_plant_unit_machine_id').notNullable();
			lineEventsTypeTbl.uuid('tenant_plant_unit_station_id').notNullable();

			lineEventsTypeTbl.uuid('event_type_id').notNullable().references('id').inTable('event_types').onUpdate('CASCADE').onDelete('RESTRICT');
			lineEventsTypeTbl.jsonb('event_metadata').notNullable().defaultTo('{}');
			lineEventsTypeTbl.timestamp('event_timestamp').notNullable().defaultTo(knex.fn.now());

			lineEventsTypeTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			lineEventsTypeTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			lineEventsTypeTbl.foreign(['tenant_plant_unit_machine_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_machines').onDelete('RESTRICT').onUpdate('CASCADE');
			lineEventsTypeTbl.foreign(['tenant_plant_unit_station_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_stations').onDelete('RESTRICT').onUpdate('CASCADE');
		});
	}
};

exports.down = async function(knex) {
	await knex.raw('DROP TABLE IF EXISTS public.tenant_plant_unit_machine_events CASCADE');

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_station_observed_machine_events');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_station_observed_machine_events', function(ObservedMachineEventsTbl) {
			ObservedMachineEventsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			ObservedMachineEventsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			ObservedMachineEventsTbl.uuid('tenant_plant_unit_station_observed_machine_id').notNullable();

			ObservedMachineEventsTbl.uuid('event_type_id').notNullable().references('id').inTable('event_types').onUpdate('CASCADE').onDelete('RESTRICT');
			ObservedMachineEventsTbl.jsonb('event_metadata').notNullable().defaultTo('{}');
			ObservedMachineEventsTbl.timestamp('event_timestamp').notNullable().defaultTo(knex.fn.now());

			ObservedMachineEventsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			ObservedMachineEventsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			ObservedMachineEventsTbl.foreign(['tenant_plant_unit_station_observed_machine_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_stations_observed_machines').onDelete('RESTRICT').onUpdate('CASCADE');
		});
	}

	await knex.raw('DROP TABLE IF EXISTS public.tenant_plant_unit_line_events CASCADE');
};
