
exports.up = async function(knex) {

	// No straight-forward way to just add the value to enum
	await knex.schema.raw("ALTER TABLE tenant_plant_unit_schedules ALTER COLUMN type DROP DEFAULT");
	await knex.schema.raw("ALTER TABLE tenant_plant_unit_schedules ALTER COLUMN type TYPE text");
	await knex.schema.raw("DROP TYPE IF EXISTS plant_unit_schedule_type");
	await knex.schema.raw("CREATE TYPE plant_unit_schedule_type AS ENUM ('holiday', 'planned_downtime', 'scheduled_downtime', 'shift', 'day')");
	await knex.schema.raw("ALTER TABLE tenant_plant_unit_schedules ALTER COLUMN type TYPE plant_unit_schedule_type USING (type::plant_unit_schedule_type)");
	await knex.schema.raw("ALTER TABLE tenant_plant_unit_schedules ALTER COLUMN type SET DEFAULT 'holiday'::plant_unit_schedule_type");

};

exports.down = async function(knex) {

	await knex.schema.raw("ALTER TABLE tenant_plant_unit_schedules ALTER COLUMN type DROP DEFAULT");
	await knex.schema.raw("ALTER TABLE tenant_plant_unit_schedules ALTER COLUMN type TYPE text");
	await knex.schema.raw("DROP TYPE IF EXISTS plant_unit_schedule_type");
	await knex.schema.raw("CREATE TYPE plant_unit_schedule_type AS ENUM ('holiday', 'planned_downtime', 'scheduled_downtime', 'shift')");
	await knex.schema.raw("ALTER TABLE tenant_plant_unit_schedules ALTER COLUMN type TYPE plant_unit_schedule_type USING (type::plant_unit_schedule_type)");
	await knex.schema.raw("ALTER TABLE tenant_plant_unit_schedules ALTER COLUMN type SET DEFAULT 'holiday'::plant_unit_schedule_type");

};
