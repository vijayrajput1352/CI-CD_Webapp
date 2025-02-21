exports.up = async function(knex) {
	await knex.schema.table('tenant_plant_unit_line_events', function(lineEventTbl) {
		lineEventTbl.index(['tenant_plant_unit_line_id', 'event_timestamp']);
	});

	await knex.schema.table('tenant_plant_unit_machine_events', function(machineEventTbl) {
		machineEventTbl.index(['tenant_plant_unit_machine_id', 'event_timestamp']);
	});
};

exports.down = async function(knex) {
	await knex.schema.table('tenant_plant_unit_machine_events', function(machineEventTbl) {
		machineEventTbl.dropIndex(['tenant_plant_unit_machine_id', 'event_timestamp']);
	});

	await knex.schema.table('tenant_plant_unit_line_events', function(lineEventTbl) {
		lineEventTbl.dropIndex(['tenant_plant_unit_line_id', 'event_timstamp']);
	});
};
