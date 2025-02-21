exports.up = async function(knex) {
	await knex.schema.table('tenant_plant_unit_machine_statistics', function(machineStatisticsTbl) {
		machineStatisticsTbl.index(['tenant_plant_unit_machine_id', 'start_time', 'end_time']);
	});
};

exports.down = async function(knex) {
	await knex.schema.table('tenant_plant_unit_machine_statistics', function(machineStatisticsTbl) {
		machineStatisticsTbl.dropIndex(['tenant_plant_unit_machine_id', 'start_time', 'end_time']);
	});
};
