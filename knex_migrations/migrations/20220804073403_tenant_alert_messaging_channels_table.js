
exports.up = async function(knex) {
	let exists = null;

	exists = await knex.schema.withSchema('public').hasTable('tenant_alert_messaging_channels');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_alert_messaging_channels', function(channelsTbl) {
			channelsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			channelsTbl.uuid('tenant_alert_id').notNullable().references('id').inTable('tenant_alerts').onDelete('CASCADE').onUpdate('CASCADE');

			channelsTbl.specificType('service_name', 'public.tenant_messaging_service_types').notNullable();
			channelsTbl.jsonb('configuration').notNullable().defaultTo('{}');

			channelsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			channelsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			channelsTbl.unique(['id', 'tenant_alert_id']);
			channelsTbl.unique(['tenant_alert_id', 'service_name']);
		});
	}
};

exports.down = async function(knex) {
	await knex.raw('DROP TABLE IF EXISTS public.tenant_alert_messaging_channels CASCADE;');
};
