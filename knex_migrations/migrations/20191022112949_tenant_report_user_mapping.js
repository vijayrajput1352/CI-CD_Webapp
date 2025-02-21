/**
 * This sets up the schema for the tenant panel -> tenant user mapping
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;
	exists = await knex.schema.withSchema('public').hasTable('tenant_reports_users');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_reports_users', function(ReportsUsersTbl) {
			ReportsUsersTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			ReportsUsersTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			ReportsUsersTbl.uuid('tenant_report_id').notNullable();
			ReportsUsersTbl.uuid('tenant_user_id').notNullable();

			ReportsUsersTbl.boolean('on_email_distribution_list').notNullable().defaultTo(false);
			ReportsUsersTbl.boolean('on_sms_distribution_list').notNullable().defaultTo(false);
			ReportsUsersTbl.boolean('on_message_distribution_list').notNullable().defaultTo(false);

			ReportsUsersTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			ReportsUsersTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			ReportsUsersTbl.unique(['id', 'tenant_id']);
			ReportsUsersTbl.unique(['tenant_report_id', 'tenant_user_id']);

			ReportsUsersTbl.foreign(['tenant_report_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_reports').onDelete('CASCADE').onUpdate('CASCADE');
			ReportsUsersTbl.foreign(['tenant_user_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenants_users').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_reports_users CASCADE;`);
};
