exports.up = async function(knex) {
	await knex.schema.table('tenant_plant_unit_line_idletimes', function(lineIdletimeTbl) {
		lineIdletimeTbl.index(['tenant_plant_unit_line_id', 'start_time', 'end_time']);
	});

	await knex.schema.table('tenant_plant_unit_machine_idletimes', function(machineIdletimeTbl) {
		machineIdletimeTbl.index(['tenant_plant_unit_machine_id', 'start_time', 'end_time']);
	});
};

exports.down = async function(knex) {
	await knex.schema.table('tenant_plant_unit_machine_idletimes', function(machineIdletimeTbl) {
		machineIdletimeTbl.dropIndex(['tenant_plant_unit_machine_id', 'start_time', 'end_time']);
	});

	await knex.schema.table('tenant_plant_unit_line_idletimes', function(lineIdletimeTbl) {
		lineIdletimeTbl.dropIndex(['tenant_plant_unit_line_id', 'start_time', 'end_time']);
	});
};
