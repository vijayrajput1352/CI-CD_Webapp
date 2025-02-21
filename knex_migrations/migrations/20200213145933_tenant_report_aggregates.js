exports.up = async function(knex) {
	let exists = null;
	exists = await knex.schema.withSchema('public').hasTable('tenant_report_aggregates');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_report_aggregates', function(ReportAggregatesTbl) {
			ReportAggregatesTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			ReportAggregatesTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			ReportAggregatesTbl.uuid('tenant_report_id').notNullable();

			ReportAggregatesTbl.text('name').notNullable();
			ReportAggregatesTbl.text('description');

			ReportAggregatesTbl.text('internal_tag').notNullable();
			ReportAggregatesTbl.text('evaluation_expression');

			ReportAggregatesTbl.text('units');

			ReportAggregatesTbl.specificType('datatype', 'public.attribute_value_type').notNullable().defaultTo('number');
			ReportAggregatesTbl.specificType('timestamp_format', 'public.attribute_timestamp_type').notNullable().defaultTo('not_a_timestamp');

			ReportAggregatesTbl.jsonb('config').notNullable().defaultTo('{}');
			ReportAggregatesTbl.jsonb('filters');

			ReportAggregatesTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			ReportAggregatesTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			ReportAggregatesTbl.unique(['id', 'tenant_id']);
			ReportAggregatesTbl.unique(['id', 'tenant_report_id']);

			ReportAggregatesTbl.foreign(['tenant_report_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_reports').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_report_aggregates CASCADE;`);
};
