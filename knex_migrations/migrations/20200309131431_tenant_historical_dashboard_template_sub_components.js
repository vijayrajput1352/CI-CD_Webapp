
exports.up = async function(knex) {
	let exists = null;

	exists = await knex.schema.withSchema('public').hasTable('tenant_historical_dashboard_subcomponents');
	if(!exists)
		await knex.schema.withSchema('public').createTable('tenant_historical_dashboard_subcomponents', function(HistoricalDashboardSubcomponentsTbl) {
			HistoricalDashboardSubcomponentsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			HistoricalDashboardSubcomponentsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			HistoricalDashboardSubcomponentsTbl.uuid('component_id').notNullable();
			HistoricalDashboardSubcomponentsTbl.uuid('tenant_historical_dashboard_id').notNullable();

			HistoricalDashboardSubcomponentsTbl.text('name').notNullable();

			HistoricalDashboardSubcomponentsTbl.boolean('publish_status').notNullable().defaultTo(false);

			HistoricalDashboardSubcomponentsTbl.timestamp('effectivity_start');
			HistoricalDashboardSubcomponentsTbl.timestamp('effectivity_end');

			HistoricalDashboardSubcomponentsTbl.text('component_state').notNullable().defaultTo('{}');
			HistoricalDashboardSubcomponentsTbl.text('component_before_render_code');
			HistoricalDashboardSubcomponentsTbl.text('component_after_render_code');
			HistoricalDashboardSubcomponentsTbl.text('component_before_destroy_code');
			HistoricalDashboardSubcomponentsTbl.text('template');
			HistoricalDashboardSubcomponentsTbl.jsonb('component_observers').notNullable().defaultTo('[]');
			HistoricalDashboardSubcomponentsTbl.jsonb('component_tasks').notNullable().defaultTo('[]');

			HistoricalDashboardSubcomponentsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			HistoricalDashboardSubcomponentsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			HistoricalDashboardSubcomponentsTbl.unique(['id', 'tenant_id']);
			HistoricalDashboardSubcomponentsTbl.foreign(['tenant_historical_dashboard_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_historical_dashboards').onDelete('CASCADE').onUpdate('CASCADE');
		});
};

exports.down = async function(knex) {
	await knex.raw('DROP TABLE IF EXISTS tenant_historical_dashboard_subcomponents CASCADE');
};
