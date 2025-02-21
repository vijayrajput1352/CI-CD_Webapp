/**
 * This sets up the schema for the tenant wof -> tenant user mapping
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;
	exists = await knex.schema.withSchema('public').hasTable('tenant_wof_users');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_wof_users', function(wofUsersTbl) {
			wofUsersTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			wofUsersTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			wofUsersTbl.uuid('tenant_wof_id').notNullable();
			wofUsersTbl.uuid('tenant_user_id').notNullable();

			wofUsersTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			wofUsersTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			wofUsersTbl.unique(['id', 'tenant_id']);
			wofUsersTbl.unique(['tenant_wof_id', 'tenant_user_id']);

			wofUsersTbl.foreign(['tenant_wof_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_work_order_formats').onDelete('CASCADE').onUpdate('CASCADE');
			wofUsersTbl.foreign(['tenant_user_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenants_users').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_wof_users CASCADE;`);
};
