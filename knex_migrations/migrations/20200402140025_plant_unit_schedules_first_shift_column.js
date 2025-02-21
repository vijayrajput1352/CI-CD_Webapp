
exports.up = async function(knex) {
	let columnExists = null;
	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_schedules', 'is_first_shift');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_schedules', function(PlantUnitScheduleTbl) {
			PlantUnitScheduleTbl.boolean('is_first_shift').notNullable().defaultTo(false);
		});
};

exports.down = async function(knex) {
	let columnExists = null;
	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_schedules', 'is_first_shift');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_schedules', function(PlantUnitScheduleTbl) {
			PlantUnitScheduleTbl.dropColumn('is_first_shift');
		});
};
