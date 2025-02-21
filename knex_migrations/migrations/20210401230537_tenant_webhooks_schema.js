'use strict';
/**
 * This sets up the schema for the tenant alerts feature
 * @ignore
 */
exports.up = async function(knex) {
	const exists = await knex.schema.withSchema('public').hasTable('tenant_webhooks');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_webhooks', function(WebhookTbl) {
			WebhookTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			WebhookTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			WebhookTbl.text('name').notNullable();
			WebhookTbl.text('description');
			WebhookTbl.text('url').notNullable();
			WebhookTbl.jsonb('events').notNullable().defaultTo('[]');
			WebhookTbl.jsonb('headers').defaultTo('[]');

			WebhookTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			WebhookTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
		});
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_webhooks CASCADE;`);
};
