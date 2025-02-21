
exports.up = async function(knex) {
	await knex.schema.withSchema('public').table('tenant_plant_unit_line_events', function(lineEventsTable) {
		lineEventsTable.index('event_metadata', null, 'gin');
	});
	await knex.schema.withSchema('public').table('tenant_plant_unit_machine_events', function(machineEventsTable) {
		machineEventsTable.index('event_metadata', null, 'gin');
	});

};

exports.down = async function(knex) {
	await knex.schema.withSchema('public').table('tenant_plant_unit_machine_events', function(machineEventsTable) {
		machineEventsTable.dropIndex('event_metadata');
	});

	await knex.schema.withSchema('public').table('tenant_plant_unit_line_events', function(lineEventsTable) {
		lineEventsTable.dropIndex('event_metadata');
	});
};
