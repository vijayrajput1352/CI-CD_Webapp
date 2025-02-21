exports.up = async function(knex) {
	let exists = null;
	exists = await knex.schema.withSchema('public').hasTable('tenant_historical_dashboard_aggregates');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_historical_dashboard_aggregates', function(HistoricalDashboardAggregatesTbl) {
			HistoricalDashboardAggregatesTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			HistoricalDashboardAggregatesTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			HistoricalDashboardAggregatesTbl.uuid('tenant_historical_dashboard_id').notNullable();

			HistoricalDashboardAggregatesTbl.text('name').notNullable();
			HistoricalDashboardAggregatesTbl.text('description');

			HistoricalDashboardAggregatesTbl.text('internal_tag').notNullable();
			HistoricalDashboardAggregatesTbl.text('evaluation_expression');

			HistoricalDashboardAggregatesTbl.text('units');

			HistoricalDashboardAggregatesTbl.specificType('datatype', 'public.attribute_value_type').notNullable().defaultTo('number');
			HistoricalDashboardAggregatesTbl.specificType('timestamp_format', 'public.attribute_timestamp_type').notNullable().defaultTo('not_a_timestamp');

			HistoricalDashboardAggregatesTbl.jsonb('config').notNullable().defaultTo('{}');
			HistoricalDashboardAggregatesTbl.jsonb('filters');

			HistoricalDashboardAggregatesTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			HistoricalDashboardAggregatesTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			HistoricalDashboardAggregatesTbl.unique(['id', 'tenant_id']);
			HistoricalDashboardAggregatesTbl.unique(['id', 'tenant_historical_dashboard_id']);

			HistoricalDashboardAggregatesTbl.foreign(['tenant_historical_dashboard_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_historical_dashboards').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_historical_dashboard_aggregates CASCADE;`);
};
