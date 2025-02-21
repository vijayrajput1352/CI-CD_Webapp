
exports.up = async function(knex) {
	let columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_statistics', 'downtime');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_statistics', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.dropColumn('downtime');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_statistics', 'runtime');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_statistics', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.dropColumn('runtime');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_statistics', 'weighted_avg_speed');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_statistics', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.dropColumn('weighted_avg_speed');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_statistics', 'actual_avg_speed');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_statistics', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.dropColumn('actual_avg_speed');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_statistics', 'average_speed');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_statistics', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.jsonb('average_speed').notNullable().defaultTo('{}');
		});
};

exports.down = async function(knex) {
	let columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_statistics', 'average_speed');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_statistics', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.dropColumn('average_speed');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_statistics', 'actual_avg_speed');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_statistics', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.specificType('actual_avg_speed', 'double precision');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_statistics', 'weighted_avg_speed');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_statistics', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.specificType('weighted_avg_speed', 'double precision');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_statistics', 'runtime');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_statistics', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.integer('runtime');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_statistics', 'downtime');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_statistics', function(PlantUnitMachinesTbl) {
			PlantUnitMachinesTbl.integer('downtime');
		});
};
