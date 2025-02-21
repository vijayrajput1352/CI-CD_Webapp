
exports.up = async function(knex) {
	let exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_station_observed_line_events');
	if(exists) {
		await knex.raw('DROP TABLE IF EXISTS tenant_plant_unit_station_observed_line_events CASCADE;');
	}

	await knex.schema.withSchema('public').alterTable('tenant_plant_unit_machine_events', function(MachineEventsTbl) {
		MachineEventsTbl.uuid('tenant_plant_unit_station_id').nullable().alter();
	});
	await knex.schema.withSchema('public').alterTable('tenant_plant_unit_line_events', function(LineEventsTbl) {
		LineEventsTbl.uuid('tenant_plant_unit_station_id').nullable().alter();
	});

};

exports.down = async function(knex) {
	await knex.schema.withSchema('public').alterTable('tenant_plant_unit_line_events', function(LineEventsTbl) {
		LineEventsTbl.uuid('tenant_plant_unit_station_id').notNullable().alter();
	});

	await knex.schema.withSchema('public').alterTable('tenant_plant_unit_machine_events', function(MachineEventsTbl) {
		MachineEventsTbl.uuid('tenant_plant_unit_station_id').notNullable().alter();
	});

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
};
