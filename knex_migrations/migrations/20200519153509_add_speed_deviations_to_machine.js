
exports.up = async function(knex) {
	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machines', 'speed_deviation_list_id');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machines', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.uuid('speed_deviation_list_id');
		});
};

exports.down = async function(knex) {
	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machines', 'speed_deviation_list_id');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machines', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.dropColumn('speed_deviation_list_id');
		});

};
