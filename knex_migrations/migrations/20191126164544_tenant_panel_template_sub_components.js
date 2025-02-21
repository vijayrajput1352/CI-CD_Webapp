
exports.up = async function(knex) {
	let exists = null;

	exists = await knex.schema.withSchema('public').hasTable('tenant_panel_subcomponents');
	if(!exists)
		await knex.schema.withSchema('public').createTable('tenant_panel_subcomponents', function(PanelSubcomponentsTbl) {
			PanelSubcomponentsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PanelSubcomponentsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			PanelSubcomponentsTbl.uuid('component_id').notNullable();
			PanelSubcomponentsTbl.uuid('tenant_panel_id').notNullable();

			PanelSubcomponentsTbl.text('name').notNullable();

			PanelSubcomponentsTbl.boolean('publish_status').notNullable().defaultTo(false);

			PanelSubcomponentsTbl.timestamp('effectivity_start');
			PanelSubcomponentsTbl.timestamp('effectivity_end');

			PanelSubcomponentsTbl.text('component_state').notNullable().defaultTo('{}');
			PanelSubcomponentsTbl.text('component_before_render_code');
			PanelSubcomponentsTbl.text('component_after_render_code');
			PanelSubcomponentsTbl.text('component_before_destroy_code');
			PanelSubcomponentsTbl.text('template');
			PanelSubcomponentsTbl.jsonb('component_observers').notNullable().defaultTo('[]');
			PanelSubcomponentsTbl.jsonb('component_tasks').notNullable().defaultTo('[]');

			PanelSubcomponentsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PanelSubcomponentsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PanelSubcomponentsTbl.unique(['id', 'tenant_id']);
			PanelSubcomponentsTbl.foreign(['tenant_panel_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_panels').onDelete('CASCADE').onUpdate('CASCADE');
		});
};

exports.down = async function(knex) {
	await knex.raw('DROP TABLE IF EXISTS tenant_panel_subcomponents CASCADE');
};
