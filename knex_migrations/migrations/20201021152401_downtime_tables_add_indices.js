
exports.up = async function(knex) {
	await knex.schema.table('tenant_plant_unit_line_downtimes', function(lineDowntimeTbl) {
		lineDowntimeTbl.index(['tenant_plant_unit_line_id', 'start_time', 'end_time']);
	});

	await knex.schema.table('tenant_plant_unit_machine_downtimes', function(machineDowntimeTbl) {
		machineDowntimeTbl.index(['tenant_plant_unit_machine_id', 'start_time', 'end_time']);
	});


};

exports.down = async function(knex) {
	await knex.schema.table('tenant_plant_unit_machine_downtimes', function(machineDowntimeTbl) {
		machineDowntimeTbl.dropIndex(['tenant_plant_unit_machine_id', 'start_time', 'end_time']);
	});

	await knex.schema.table('tenant_plant_unit_line_downtimes', function(lineDowntimeTbl) {
		lineDowntimeTbl.dropIndex(['tenant_plant_unit_line_id', 'start_time', 'end_time']);
	});

};
