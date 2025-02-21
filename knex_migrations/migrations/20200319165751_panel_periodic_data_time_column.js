
exports.up = async function(knex) {
	let columnExists = null;

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_panels', 'data_request_period');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_panels', function(PanelTbl) {
			PanelTbl.integer('data_request_period').notNullable().defaultTo(300);
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_panel_templates', 'component_on_periodic_data_code');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_panel_templates', function(PanelTemplateTbl) {
			PanelTemplateTbl.text('component_on_periodic_data_code');
		});
};

exports.down = async function(knex) {
	let columnExists = null;

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_panels', 'data_request_period');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_panels', function(PanelTbl) {
			PanelTbl.dropColumn('data_request_period');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_panel_templates', 'component_on_periodic_data_code');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_panel_templates', function(PanelTemplateTbl) {
			PanelTemplateTbl.dropColumn('component_on_periodic_data_code');
		});
};
