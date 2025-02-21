
exports.up = async function(knex) {
	let exists = null;

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_lines_worok_order_formats');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_lines_work_order_formats', function(LineWorkOrderFormatTbl) {
			LineWorkOrderFormatTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			LineWorkOrderFormatTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			LineWorkOrderFormatTbl.uuid('tenant_plant_unit_line_id').notNullable();
			LineWorkOrderFormatTbl.uuid('tenant_work_order_format_id').notNullable();

			LineWorkOrderFormatTbl.jsonb('filters').notNullable().defaultTo('[]');

			LineWorkOrderFormatTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			LineWorkOrderFormatTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			LineWorkOrderFormatTbl.foreign(['tenant_work_order_format_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_work_order_formats').onDelete('CASCADE').onUpdate('CASCADE');
			LineWorkOrderFormatTbl.foreign(['tenant_plant_unit_line_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_lines').onDelete('CASCADE').onUpdate('CASCADE');
			LineWorkOrderFormatTbl.unique(['tenant_plant_unit_line_id', 'tenant_work_order_format_id'], 'uidx_tenant_plant_unit_line_id_tenant_work_order_format_id');
		});
	}
};

exports.down = async function(knex) {
	await knex.raw('DROP TABLE IF EXISTS public.tenant_plant_unit_lines_work_order_formats CASCADE');
};
