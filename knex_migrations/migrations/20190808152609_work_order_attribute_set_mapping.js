
exports.up = async function(knex) {
	let exists = null;

	exists = await knex.schema.withSchema('public').hasTable('tenant_work_order_format_attribute_sets');
    if(!exists) {
        await knex.schema.withSchema('public').createTable('tenant_work_order_format_attribute_sets', function(WorkOrderFormatsAttributeSetsTbl) {
            WorkOrderFormatsAttributeSetsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
            WorkOrderFormatsAttributeSetsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

            WorkOrderFormatsAttributeSetsTbl.uuid('tenant_work_order_format_id').notNullable();
            WorkOrderFormatsAttributeSetsTbl.uuid('tenant_attribute_set_id').notNullable();
            WorkOrderFormatsAttributeSetsTbl.integer('evaluation_order').notNullable().defaultTo(1);

            WorkOrderFormatsAttributeSetsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
            WorkOrderFormatsAttributeSetsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

            WorkOrderFormatsAttributeSetsTbl.foreign(['tenant_attribute_set_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_attribute_sets').onDelete('CASCADE').onUpdate('CASCADE');
            WorkOrderFormatsAttributeSetsTbl.foreign(['tenant_work_order_format_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_work_order_formats').onDelete('CASCADE').onUpdate('CASCADE');

            WorkOrderFormatsAttributeSetsTbl.unique(['id', 'tenant_id']);
        });
    }
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_work_order_format_attribute_sets CASCADE;`);
};
