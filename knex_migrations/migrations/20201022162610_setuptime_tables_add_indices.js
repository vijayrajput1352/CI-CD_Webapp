exports.up = async function(knex) {
	await knex.schema.table('tenant_plant_unit_line_setuptimes', function(lineSetuptimeTbl) {
		lineSetuptimeTbl.index(['tenant_plant_unit_line_id', 'start_time', 'end_time']);
	});

	await knex.schema.table('tenant_plant_unit_machine_setuptimes', function(machineSetuptimeTbl) {
		machineSetuptimeTbl.index(['tenant_plant_unit_machine_id', 'start_time', 'end_time']);
	});
};

exports.down = async function(knex) {
	await knex.schema.table('tenant_plant_unit_machine_setuptimes', function(machineSetuptimeTbl) {
		machineSetuptimeTbl.dropIndex(['tenant_plant_unit_machine_id', 'start_time', 'end_time']);
	});

	await knex.schema.table('tenant_plant_unit_line_setuptimes', function(lineSetuptimeTbl) {
		lineSetuptimeTbl.dropIndex(['tenant_plant_unit_line_id', 'start_time', 'end_time']);
	});
};
