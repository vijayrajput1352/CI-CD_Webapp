/**
 * This sets up the schema for the tenant emd -> tenant user mapping
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;
	exists = await knex.schema.withSchema('public').hasTable('tenant_emd_users');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_emd_users', function(emdUsersTbl) {
			emdUsersTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			emdUsersTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			emdUsersTbl.uuid('tenant_emd_id').notNullable();
			emdUsersTbl.uuid('tenant_user_id').notNullable();

			emdUsersTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			emdUsersTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			emdUsersTbl.unique(['id', 'tenant_id']);
			emdUsersTbl.unique(['tenant_emd_id', 'tenant_user_id']);

			emdUsersTbl.foreign(['tenant_emd_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_emd_configurations').onDelete('CASCADE').onUpdate('CASCADE');
			emdUsersTbl.foreign(['tenant_user_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenants_users').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_emd_users CASCADE;`);
};
