
exports.up = async function(knex) {
	let exists = null;

	exists = await knex.schema.withSchema('public').hasTable('tenant_panel_request_formatters');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_panel_request_formatters', function(PanelRequestFormatterTbl) {
			PanelRequestFormatterTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PanelRequestFormatterTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			PanelRequestFormatterTbl.uuid('tenant_panel_id').notNullable();

			PanelRequestFormatterTbl.text('formatter_code').notNullable();

			PanelRequestFormatterTbl.boolean('publish_status').notNullable().defaultTo(false);
			PanelRequestFormatterTbl.timestamp('effectivity_start');
			PanelRequestFormatterTbl.timestamp('effectivity_end');

			PanelRequestFormatterTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PanelRequestFormatterTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PanelRequestFormatterTbl.unique(['id', 'tenant_id']);
			PanelRequestFormatterTbl.foreign(['tenant_panel_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_panels').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_panel_executors');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_panel_executors', function(PanelExecutorTbl) {
			PanelExecutorTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PanelExecutorTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			PanelExecutorTbl.uuid('tenant_panel_id').notNullable();

			PanelExecutorTbl.text('executor_code').notNullable();

			PanelExecutorTbl.boolean('publish_status').notNullable().defaultTo(false);
			PanelExecutorTbl.timestamp('effectivity_start');
			PanelExecutorTbl.timestamp('effectivity_end');

			PanelExecutorTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PanelExecutorTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PanelExecutorTbl.unique(['id', 'tenant_id']);
			PanelExecutorTbl.foreign(['tenant_panel_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_panels').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_panel_response_formatters');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_panel_response_formatters', function(PanelRequestFormatterTbl) {
			PanelRequestFormatterTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PanelRequestFormatterTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			PanelRequestFormatterTbl.uuid('tenant_panel_id').notNullable();

			PanelRequestFormatterTbl.text('formatter_code').notNullable();

			PanelRequestFormatterTbl.boolean('publish_status').notNullable().defaultTo(false);
			PanelRequestFormatterTbl.timestamp('effectivity_start');
			PanelRequestFormatterTbl.timestamp('effectivity_end');

			PanelRequestFormatterTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PanelRequestFormatterTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PanelRequestFormatterTbl.unique(['id', 'tenant_id']);
			PanelRequestFormatterTbl.foreign(['tenant_panel_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_panels').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_panel_response_formatters CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_panel_executors CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_panel_request_formatters CASCADE;`);
};
