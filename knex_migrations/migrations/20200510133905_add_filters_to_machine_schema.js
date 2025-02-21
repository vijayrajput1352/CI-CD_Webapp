
exports.up = async function(knex) {
	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machines', 'setuptime_list_filters');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machines', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.jsonb('setuptime_list_filters').notNullable().defaultTo('[]');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machines', 'idletime_list_filters');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machines', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.jsonb('idletime_list_filters').notNullable().defaultTo('[]');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machines', 'speed_deviations_list_filters');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machines', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.jsonb('speed_deviations_list_filters').notNullable().defaultTo('[]');;
		});
};

exports.down = async function(knex) {
	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machines', 'setuptime_list_filters');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machines', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.dropColumn('setuptime_list_filters');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machines', 'idletime_list_filters');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machines', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.dropColumn('idletime_list_filters');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machines', 'speed_deviations_list_filters');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machines', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.dropColumn('speed_deviations_list_filters');
		});

};
