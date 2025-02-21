/**
 * This sets up the schema for the tenant panel -> tenant user mapping
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;
	exists = await knex.schema.withSchema('public').hasTable('tenant_historical_dashboards_users');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_historical_dashboards_users', function(HistoricalDashboardsUsersTbl) {
			HistoricalDashboardsUsersTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			HistoricalDashboardsUsersTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			HistoricalDashboardsUsersTbl.uuid('tenant_historical_dashboard_id').notNullable();
			HistoricalDashboardsUsersTbl.uuid('tenant_user_id').notNullable();

			HistoricalDashboardsUsersTbl.boolean('on_email_distribution_list').notNullable().defaultTo(false);
			HistoricalDashboardsUsersTbl.boolean('on_sms_distribution_list').notNullable().defaultTo(false);
			HistoricalDashboardsUsersTbl.boolean('on_message_distribution_list').notNullable().defaultTo(false);

			HistoricalDashboardsUsersTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			HistoricalDashboardsUsersTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			HistoricalDashboardsUsersTbl.unique(['id', 'tenant_id']);
			HistoricalDashboardsUsersTbl.unique(['tenant_historical_dashboard_id', 'tenant_user_id']);

			// HistoricalDashboardsUsersTbl.foreign(['tenant_historical_dashboard_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_historical_dashboards').onDelete('CASCADE').onUpdate('CASCADE');
			// HistoricalDashboardsUsersTbl.foreign(['tenant_user_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenants_users').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE public.tenant_historical_dashboards_users
			ADD CONSTRAINT fk_tenant_hdash_users_tenant_hdash
			FOREIGN KEY (
				tenant_historical_dashboard_id,
				tenant_id
			)
			REFERENCES tenant_historical_dashboards (
				id,
				tenant_id
			)
			ON UPDATE CASCADE
			ON DELETE CASCADE`
		);

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE public.tenant_historical_dashboards_users
			ADD CONSTRAINT fk_tenant_hdash_users_tenant_user
			FOREIGN KEY (
				tenant_user_id,
				tenant_id
			)
			REFERENCES tenants_users (
				id,
				tenant_id
			)
			ON UPDATE CASCADE
			ON DELETE CASCADE`
		);
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_historical_dashboards_users CASCADE;`);
};
