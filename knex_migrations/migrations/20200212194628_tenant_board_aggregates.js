exports.up = async function(knex) {
	let exists = null;
	exists = await knex.schema.withSchema('public').hasTable('tenant_panel_aggregates');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_panel_aggregates', function(PanelAggregatesTbl) {
			PanelAggregatesTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PanelAggregatesTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			PanelAggregatesTbl.uuid('tenant_panel_id').notNullable();

			PanelAggregatesTbl.text('name').notNullable();
			PanelAggregatesTbl.text('description');

			PanelAggregatesTbl.text('internal_tag').notNullable();
			PanelAggregatesTbl.text('evaluation_expression');

			PanelAggregatesTbl.text('units');

			PanelAggregatesTbl.specificType('datatype', 'public.attribute_value_type').notNullable().defaultTo('number');
			PanelAggregatesTbl.specificType('timestamp_format', 'public.attribute_timestamp_type').notNullable().defaultTo('not_a_timestamp');

			PanelAggregatesTbl.jsonb('config').notNullable().defaultTo('{}');
			PanelAggregatesTbl.jsonb('filters');

			PanelAggregatesTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PanelAggregatesTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PanelAggregatesTbl.unique(['id', 'tenant_id']);
			PanelAggregatesTbl.unique(['id', 'tenant_panel_id']);

			PanelAggregatesTbl.foreign(['tenant_panel_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_panels').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_panel_aggregates CASCADE;`);
};
