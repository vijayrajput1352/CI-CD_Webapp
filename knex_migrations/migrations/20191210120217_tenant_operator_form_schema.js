/**
 * This sets up the schema for the tenant operator form feature
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;

	exists = await knex.schema.withSchema('public').hasTable('tenant_operator_forms');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_operator_forms', function(operatorFormsTbl) {
			operatorFormsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			operatorFormsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			operatorFormsTbl.uuid('tenant_folder_id').notNullable();

			operatorFormsTbl.text('name').notNullable();
			operatorFormsTbl.text('tags');
			operatorFormsTbl.text('description');
			operatorFormsTbl.integer('data_persistence_period').notNullable().defaultTo(1);

			operatorFormsTbl.jsonb('attribute_set_metadata').notNullable().defaultTo('[]');

			operatorFormsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			operatorFormsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			operatorFormsTbl.unique(['id', 'tenant_id']);
			operatorFormsTbl.unique(['tenant_folder_id', 'name']);

			operatorFormsTbl.foreign(['tenant_folder_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_folders').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_operator_forms_attribute_sets');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_operator_forms_attribute_sets', function(operatorFormAttributeSetTbl) {
			operatorFormAttributeSetTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			operatorFormAttributeSetTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			operatorFormAttributeSetTbl.uuid('tenant_operator_form_id').notNullable();
			operatorFormAttributeSetTbl.uuid('tenant_attribute_set_id').notNullable();
			operatorFormAttributeSetTbl.integer('evaluation_order').notNullable().defaultTo(1);

			operatorFormAttributeSetTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			operatorFormAttributeSetTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			operatorFormAttributeSetTbl.unique(['id', 'tenant_id']);

			operatorFormAttributeSetTbl.foreign(['tenant_operator_form_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_operator_forms').onDelete('CASCADE').onUpdate('CASCADE');
			operatorFormAttributeSetTbl.foreign(['tenant_attribute_set_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_attribute_sets').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_operator_form_attr_set ON public.tenant_operator_forms_attribute_sets
			USING btree
			(
				tenant_operator_form_id ASC,
				tenant_attribute_set_id ASC
			)`
		);
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_operator_form_request_formatters');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_operator_form_request_formatters', function(operatorFormRequestFormatterTbl) {
			operatorFormRequestFormatterTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			operatorFormRequestFormatterTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			operatorFormRequestFormatterTbl.uuid('tenant_operator_form_id').notNullable();

			operatorFormRequestFormatterTbl.text('formatter_code').notNullable();

			operatorFormRequestFormatterTbl.boolean('publish_status').notNullable().defaultTo(false);
			operatorFormRequestFormatterTbl.timestamp('effectivity_start').notNullable().defaultTo(knex.fn.now());
			operatorFormRequestFormatterTbl.timestamp('effectivity_end').defaultTo(knex.fn.now());

			operatorFormRequestFormatterTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			operatorFormRequestFormatterTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			operatorFormRequestFormatterTbl.unique(['id', 'tenant_id']);
			operatorFormRequestFormatterTbl.foreign(['tenant_operator_form_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_operator_forms').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_operator_form_executors');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_operator_form_executors', function(operatorFormExecutorTbl) {
			operatorFormExecutorTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			operatorFormExecutorTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			operatorFormExecutorTbl.uuid('tenant_operator_form_id').notNullable();

			operatorFormExecutorTbl.text('executor_code').notNullable();

			operatorFormExecutorTbl.boolean('publish_status').notNullable().defaultTo(false);
			operatorFormExecutorTbl.timestamp('effectivity_start').notNullable().defaultTo(knex.fn.now());
			operatorFormExecutorTbl.timestamp('effectivity_end').defaultTo(knex.fn.now());

			operatorFormExecutorTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			operatorFormExecutorTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			operatorFormExecutorTbl.unique(['id', 'tenant_id']);
			operatorFormExecutorTbl.foreign(['tenant_operator_form_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_operator_forms').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_operator_form_response_formatters');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_operator_form_response_formatters', function(operatorFormRequestFormatterTbl) {
			operatorFormRequestFormatterTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			operatorFormRequestFormatterTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			operatorFormRequestFormatterTbl.uuid('tenant_operator_form_id').notNullable();

			operatorFormRequestFormatterTbl.text('formatter_code').notNullable();

			operatorFormRequestFormatterTbl.boolean('publish_status').notNullable().defaultTo(false);
			operatorFormRequestFormatterTbl.timestamp('effectivity_start').notNullable().defaultTo(knex.fn.now());
			operatorFormRequestFormatterTbl.timestamp('effectivity_end').defaultTo(knex.fn.now());

			operatorFormRequestFormatterTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			operatorFormRequestFormatterTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			operatorFormRequestFormatterTbl.unique(['id', 'tenant_id']);
			operatorFormRequestFormatterTbl.foreign(['tenant_operator_form_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_operator_forms').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_operator_form_input_templates');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_operator_form_input_templates', function(operatorFormInputTmplTbl) {
			operatorFormInputTmplTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			operatorFormInputTmplTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			operatorFormInputTmplTbl.uuid('tenant_operator_form_id').notNullable();

			operatorFormInputTmplTbl.text('component_state').notNullable().defaultTo('{}');
			operatorFormInputTmplTbl.text('component_before_render_code');
			operatorFormInputTmplTbl.text('component_after_render_code');
			operatorFormInputTmplTbl.text('component_on_submit_code');
			operatorFormInputTmplTbl.text('component_before_destroy_code');
			operatorFormInputTmplTbl.jsonb('component_observers').notNullable().defaultTo('[]');
			operatorFormInputTmplTbl.jsonb('component_tasks').notNullable().defaultTo('[]');
			operatorFormInputTmplTbl.text('template');

			operatorFormInputTmplTbl.boolean('publish_status').notNullable().defaultTo(false);
			operatorFormInputTmplTbl.timestamp('effectivity_start');
			operatorFormInputTmplTbl.timestamp('effectivity_end');

			operatorFormInputTmplTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			operatorFormInputTmplTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			operatorFormInputTmplTbl.unique(['id', 'tenant_id']);
			operatorFormInputTmplTbl.foreign(['tenant_operator_form_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_operator_forms').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_operator_form_result_templates');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_operator_form_result_templates', function(operatorFormResultTmplTbl) {
			operatorFormResultTmplTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			operatorFormResultTmplTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			operatorFormResultTmplTbl.uuid('tenant_operator_form_id').notNullable();

			operatorFormResultTmplTbl.text('component_state').notNullable().defaultTo('{}');
			operatorFormResultTmplTbl.text('component_before_render_code');
			operatorFormResultTmplTbl.text('component_after_render_code');
			operatorFormResultTmplTbl.text('component_on_data_code');
			operatorFormResultTmplTbl.text('component_before_destroy_code');
			operatorFormResultTmplTbl.jsonb('component_observers').notNullable().defaultTo('[]');
			operatorFormResultTmplTbl.jsonb('component_tasks').notNullable().defaultTo('[]');

			operatorFormResultTmplTbl.text('template');

			operatorFormResultTmplTbl.boolean('publish_status').notNullable().defaultTo(false);
			operatorFormResultTmplTbl.timestamp('effectivity_start');
			operatorFormResultTmplTbl.timestamp('effectivity_end');

			operatorFormResultTmplTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			operatorFormResultTmplTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			operatorFormResultTmplTbl.unique(['id', 'tenant_id']);
			operatorFormResultTmplTbl.foreign(['tenant_operator_form_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_operator_forms').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	/* Functions, business rules enforced using triggers, etc. */
	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_create_operator_form_folder_for_tenant ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	server_id UUID;
	operator_form_feature_id UUID;
	root_folder_id UUID;
BEGIN
	server_id := NULL;
	operator_form_feature_id := NULL;
	root_folder_id := NULL;

	SELECT
		id
	FROM
		modules
	WHERE
		name = 'PlantWorksWebappServer' AND
		type = 'server' AND
		parent_id IS NULL
	INTO
		server_id;

	IF server_id IS NULL
	THEN
		RETURN NEW;
	END IF;

	SELECT
		id
	FROM
		fn_get_module_descendants(server_id)
	WHERE
		name = 'OperatorForm' AND
		type = 'feature'
	INTO
		operator_form_feature_id;

	IF operator_form_feature_id IS NULL
	THEN
		RETURN NEW;
	END IF;

	IF NEW.module_id <> operator_form_feature_id
	THEN
		RETURN NEW;
	END IF;

	INSERT INTO tenant_folders (
		tenant_id,
		name,
		description
	)
	VALUES (
		NEW.tenant_id,
		'operator_form_feature.folder_names.root.name',
		'operator_form_feature.folder_names.root.description'
	)
	RETURNING
		id
	INTO
		root_folder_id;

	INSERT INTO tenant_folders (
		tenant_id,
		parent_id,
		name,
		description
	)
	VALUES (
		NEW.tenant_id,
		root_folder_id,
		'operator_form_feature.folder_names.attribute_sets.name',
		'operator_form_feature.folder_names.attribute_sets.description'
	);

	INSERT INTO tenant_folders (
		tenant_id,
		parent_id,
		name,
		description
	)
	VALUES (
		NEW.tenant_id,
		root_folder_id,
		'operator_form_feature.folder_names.operator_forms.name',
		'operator_form_feature.folder_names.operator_forms.description'
	);

	RETURN NEW;
END;
$$;`
	);

	/* Finally, hook up the triggers */
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_create_operator_form_folder_for_tenant AFTER INSERT OR UPDATE ON public.tenants_modules FOR EACH ROW EXECUTE PROCEDURE public.fn_create_operator_form_folder_for_tenant();');
};

exports.down = async function(knex) {
	await knex.raw('DROP TRIGGER IF EXISTS trigger_create_operator_form_folder_for_tenant ON public.tenants_modules CASCADE;');

	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_create_operator_form_folder_for_tenant () CASCADE;`);

	await knex.raw(`DROP TABLE IF EXISTS public.tenant_operator_form_result_templates CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_operator_form_input_templates CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_operator_form_response_formatters CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_operator_form_executors CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_operator_form_request_formatters CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_operator_forms_attribute_sets CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_operator_forms CASCADE;`);
};
