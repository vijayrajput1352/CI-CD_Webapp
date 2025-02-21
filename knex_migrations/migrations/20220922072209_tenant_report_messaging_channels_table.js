
exports.up = async function(knex) {
	let exists = null;

	exists = await knex.schema.withSchema('public').hasTable('tenant_report_messaging_channels');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_report_messaging_channels', function(channelsTbl) {
			channelsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			channelsTbl.uuid('tenant_report_id').notNullable().references('id').inTable('tenant_reports').onDelete('CASCADE').onUpdate('CASCADE');

			channelsTbl.specificType('service_name', 'public.tenant_messaging_service_types').notNullable();
			channelsTbl.jsonb('configuration').notNullable().defaultTo('{}');

			channelsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			channelsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			channelsTbl.unique(['id', 'tenant_report_id']);
			channelsTbl.unique(['tenant_report_id', 'service_name']);
		});
	}
};

exports.down = async function(knex) {
	await knex.raw('DROP TABLE IF EXISTS public.tenant_report_messaging_channels CASCADE;');
};
