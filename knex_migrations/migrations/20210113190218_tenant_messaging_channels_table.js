
exports.up = async function(knex) {
	let exists = null;
	await knex.schema.raw("CREATE TYPE public.tenant_messaging_service_types AS ENUM ('whatsapp', 'telegram', 'signal')");

	exists = await knex.schema.withSchema('public').hasTable('tenant_messaging_channels');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_messaging_channels', function(channelsTbl) {
			channelsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			channelsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			channelsTbl.specificType('service_name', 'public.tenant_messaging_service_types').notNullable();
			channelsTbl.jsonb('configuration').notNullable().defaultTo('{}');

			channelsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			channelsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			channelsTbl.unique(['id', 'tenant_id']);
			channelsTbl.unique(['tenant_id', 'service_name']);
		});
	}
};

exports.down = async function(knex) {
	await knex.raw('DROP TABLE IF EXISTS public.tenant_messaging_channels CASCADE;');
	await knex.raw(`DROP TYPE IF EXISTS public.tenant_messaging_service_types CASCADE;`);

};
