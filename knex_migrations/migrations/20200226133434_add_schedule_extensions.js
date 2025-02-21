
exports.up = async function(knex) {
	let exists = null;
	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_schedule_extensions');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_schedule_extensions', function(PlantUnitScheduleExtensionTbl) {
			PlantUnitScheduleExtensionTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PlantUnitScheduleExtensionTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			PlantUnitScheduleExtensionTbl.uuid('shift_id').notNullable();
			PlantUnitScheduleExtensionTbl.uuid('tenant_plant_unit_id').notNullable();

			PlantUnitScheduleExtensionTbl.timestamp('extension_date').notNullable().defaultTo(knex.fn.now());

			PlantUnitScheduleExtensionTbl.text('extension_duration').notNullable().defaultTo("00:00");

			PlantUnitScheduleExtensionTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PlantUnitScheduleExtensionTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PlantUnitScheduleExtensionTbl.unique(['id', 'tenant_id']);
			PlantUnitScheduleExtensionTbl.unique(['id', 'shift_id']);

			PlantUnitScheduleExtensionTbl.foreign(['shift_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_schedules').onDelete('CASCADE').onUpdate('CASCADE');
			PlantUnitScheduleExtensionTbl.foreign(['tenant_plant_unit_id']).references(['id']).inTable('tenant_plant_units').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_schedule_extensions CASCADE;`);
};
