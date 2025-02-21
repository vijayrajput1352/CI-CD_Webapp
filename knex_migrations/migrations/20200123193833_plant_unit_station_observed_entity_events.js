
exports.up = async function(knex) {
	let exists = null;

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_station_observed_line_events');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_station_observed_line_events', function(ObservedLineEventsTbl) {
			ObservedLineEventsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			ObservedLineEventsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			ObservedLineEventsTbl.uuid('tenant_plant_unit_station_observed_line_id').notNullable();

			ObservedLineEventsTbl.text('event_type').notNullable();
			ObservedLineEventsTbl.jsonb('event_metadata').notNullable().defaultTo('{}');
			ObservedLineEventsTbl.timestamp('event_timestamp').notNullable().defaultTo(knex.fn.now());

			ObservedLineEventsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			ObservedLineEventsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			ObservedLineEventsTbl.foreign(['tenant_plant_unit_station_observed_line_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_stations_observed_lines').onDelete('RESTRICT').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_station_observed_machine_events');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_station_observed_machine_events', function(ObservedMachineEventsTbl) {
			ObservedMachineEventsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			ObservedMachineEventsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			ObservedMachineEventsTbl.uuid('tenant_plant_unit_station_observed_machine_id').notNullable();

			ObservedMachineEventsTbl.text('event_type').notNullable();
			ObservedMachineEventsTbl.jsonb('event_metadata').notNullable().defaultTo('{}');
			ObservedMachineEventsTbl.timestamp('event_timestamp').notNullable().defaultTo(knex.fn.now());

			ObservedMachineEventsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			ObservedMachineEventsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			ObservedMachineEventsTbl.foreign(['tenant_plant_unit_station_observed_machine_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_stations_observed_machines').onDelete('RESTRICT').onUpdate('CASCADE');
		});
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_station_observed_machine_events CASCADE`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_station_observed_line_events CASCADE`);
};
