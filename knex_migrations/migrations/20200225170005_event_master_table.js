exports.up = async function(knex) {
	let exists = null;
	exists = await knex.schema.withSchema('public').hasTable('event_types');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('event_types', function(eventsTypeTbl) {
			eventsTypeTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			eventsTypeTbl.text('tag').notNullable();
			eventsTypeTbl.text('description');
			eventsTypeTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			eventsTypeTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
			eventsTypeTbl.unique('tag');
		});
	}

	await knex.schema.withSchema('public').table('tenant_plant_unit_station_observed_line_events', function(observedLineEventsTbl) {
		observedLineEventsTbl.dropColumn('event_type');
		observedLineEventsTbl.uuid('event_type_id').notNullable().references('id').inTable('event_types').onUpdate('CASCADE').onDelete('RESTRICT');
	});

	await knex.schema.withSchema('public').table('tenant_plant_unit_station_observed_machine_events', function(observedMachineEventsTbl) {
		observedMachineEventsTbl.dropColumn('event_type');
		observedMachineEventsTbl.uuid('event_type_id').notNullable().references('id').inTable('event_types').onUpdate('CASCADE').onDelete('RESTRICT');
	});
};

exports.down = async function(knex) {
	await knex.schema.withSchema('public').table('tenant_plant_unit_station_observed_line_events', function(observedLineEventsTbl) {
		observedLineEventsTbl.text('event_type').notNullable();
		observedLineEventsTbl.dropColumn('event_type_id')
	});

	await knex.schema.withSchema('public').table('tenant_plant_unit_station_observed_machine_events', function(observedMachineEventsTbl) {
		observedMachineEventsTbl.text('event_type').notNullable();
		observedMachineEventsTbl.dropColumn('event_type_id');
	});

	await knex.raw(`DROP TABLE IF EXISTS public.event_types CASCADE`);
};
