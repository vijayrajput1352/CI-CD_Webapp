exports.up = async function(knex) {
	let columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_statistics', 'calcstat_parameters');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_statistics', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.jsonb('calcstat_parameters').notNullable().defaultTo('{}');
		});
};

exports.down = async function(knex) {
	let columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_statistics', 'calcstat_parameters');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_statistics', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.dropColumn('calcstat_parameters');
		});
};
