/**
 * This sets up the schema for the tenant panel -> tenant user mapping
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;
	exists = await knex.schema.withSchema('public').hasTable('tenant_panels_users');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_panels_users', function(PanelsUsersTbl) {
			PanelsUsersTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PanelsUsersTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			PanelsUsersTbl.uuid('tenant_panel_id').notNullable();
			PanelsUsersTbl.uuid('tenant_user_id').notNullable();

			PanelsUsersTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PanelsUsersTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PanelsUsersTbl.unique(['id', 'tenant_id']);
			PanelsUsersTbl.unique(['tenant_panel_id', 'tenant_user_id']);

			PanelsUsersTbl.foreign(['tenant_panel_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_panels').onDelete('CASCADE').onUpdate('CASCADE');
			PanelsUsersTbl.foreign(['tenant_user_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenants_users').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_panels_users CASCADE;`);
};
