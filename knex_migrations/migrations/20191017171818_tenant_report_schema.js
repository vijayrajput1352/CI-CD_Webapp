/**
 * This sets up the schema for the tenant report feature
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;

	await knex.schema.raw("CREATE TYPE public.tenant_report_constituent_types AS ENUM ('machine', 'station', 'line')");
	await knex.schema.raw("CREATE TYPE public.tenant_report_request_types AS ENUM ('api', 'cron', 'email', 'http', 'message', 'sms')");
	await knex.schema.raw("CREATE TYPE public.tenant_report_response_types AS ENUM ('api', 'email', 'http', 'message', 'sms', 'telegram')");

	exists = await knex.schema.withSchema('public').hasTable('tenant_reports');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_reports', function(ReportsTbl) {
			ReportsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			ReportsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			ReportsTbl.uuid('tenant_folder_id').notNullable();

			ReportsTbl.text('name').notNullable();
			ReportsTbl.text('tags');
			ReportsTbl.text('description');
			ReportsTbl.integer('data_persistence_period').notNullable().defaultTo(1);

			ReportsTbl.jsonb('attribute_set_metadata').notNullable().defaultTo('[]');
			ReportsTbl.text('template_path');

			ReportsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			ReportsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			ReportsTbl.unique(['id', 'tenant_id']);
			ReportsTbl.unique(['tenant_folder_id', 'name']);

			ReportsTbl.foreign(['tenant_folder_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_folders').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_reports_attribute_sets');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_reports_attribute_sets', function(ReportAttributeSetTbl) {
			ReportAttributeSetTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			ReportAttributeSetTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			ReportAttributeSetTbl.uuid('tenant_report_id').notNullable();
			ReportAttributeSetTbl.uuid('tenant_attribute_set_id').notNullable();
			ReportAttributeSetTbl.integer('evaluation_order').notNullable().defaultTo(1);

			ReportAttributeSetTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			ReportAttributeSetTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			ReportAttributeSetTbl.unique(['id', 'tenant_id']);

			ReportAttributeSetTbl.foreign(['tenant_report_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_reports').onDelete('CASCADE').onUpdate('CASCADE');
			ReportAttributeSetTbl.foreign(['tenant_attribute_set_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_attribute_sets').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_report_attr_set ON public.tenant_reports_attribute_sets
			USING btree
			(
				tenant_report_id ASC,
				tenant_attribute_set_id ASC
			)`
		);
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_report_constituents');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_report_constituents', function(ReportConstituentsTbl) {
			ReportConstituentsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			ReportConstituentsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			ReportConstituentsTbl.uuid('tenant_report_id').notNullable();
			ReportConstituentsTbl.uuid('tenant_report_constituent_id').notNullable();
			ReportConstituentsTbl.specificType('tenant_report_constituent_type', 'public.tenant_report_constituent_types').notNullable().defaultTo('machine');

			ReportConstituentsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			ReportConstituentsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			ReportConstituentsTbl.unique(['id', 'tenant_id']);
			ReportConstituentsTbl.foreign(['tenant_report_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_reports').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_report_and_constituent ON public.tenant_report_constituents
			USING btree
			(
				tenant_report_id ASC,
				tenant_report_constituent_id ASC
			)`
		);
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_report_processors');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_report_processors', function(ReportProcessorTbl) {
			ReportProcessorTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			ReportProcessorTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			ReportProcessorTbl.uuid('tenant_report_id').notNullable();

			ReportProcessorTbl.text('processed_data_transform_code');
			ReportProcessorTbl.text('processor').notNullable();

			ReportProcessorTbl.boolean('publish_status').notNullable().defaultTo(false);
			ReportProcessorTbl.timestamp('effectivity_start');
			ReportProcessorTbl.timestamp('effectivity_end');

			ReportProcessorTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			ReportProcessorTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			ReportProcessorTbl.unique(['id', 'tenant_id']);
			ReportProcessorTbl.foreign(['tenant_report_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_reports').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_report_request_formatters');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_report_request_formatters', function(ReportRequestFormatterTbl) {
			ReportRequestFormatterTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			ReportRequestFormatterTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			ReportRequestFormatterTbl.uuid('tenant_report_id').notNullable();

			ReportRequestFormatterTbl.specificType('request_type', 'public.tenant_report_request_types').notNullable().defaultTo('http');
			ReportRequestFormatterTbl.text('formatter_code').notNullable();

			ReportRequestFormatterTbl.boolean('publish_status').notNullable().defaultTo(false);
			ReportRequestFormatterTbl.timestamp('effectivity_start');
			ReportRequestFormatterTbl.timestamp('effectivity_end');

			ReportRequestFormatterTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			ReportRequestFormatterTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			ReportRequestFormatterTbl.unique(['id', 'tenant_id']);
			ReportRequestFormatterTbl.foreign(['tenant_report_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_reports').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_report_executors');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_report_executors', function(ReportExecutorTbl) {
			ReportExecutorTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			ReportExecutorTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			ReportExecutorTbl.uuid('tenant_report_id').notNullable();

			ReportExecutorTbl.text('executor_code').notNullable();

			ReportExecutorTbl.boolean('publish_status').notNullable().defaultTo(false);
			ReportExecutorTbl.timestamp('effectivity_start');
			ReportExecutorTbl.timestamp('effectivity_end');

			ReportExecutorTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			ReportExecutorTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			ReportExecutorTbl.unique(['id', 'tenant_id']);
			ReportExecutorTbl.foreign(['tenant_report_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_reports').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_report_response_formatters');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_report_response_formatters', function(ReportRequestFormatterTbl) {
			ReportRequestFormatterTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			ReportRequestFormatterTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			ReportRequestFormatterTbl.uuid('tenant_report_id').notNullable();

			ReportRequestFormatterTbl.specificType('response_type', 'public.tenant_report_response_types').notNullable().defaultTo('http');
			ReportRequestFormatterTbl.text('formatter_code').notNullable();

			ReportRequestFormatterTbl.boolean('publish_status').notNullable().defaultTo(false);
			ReportRequestFormatterTbl.timestamp('effectivity_start');
			ReportRequestFormatterTbl.timestamp('effectivity_end');

			ReportRequestFormatterTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			ReportRequestFormatterTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			ReportRequestFormatterTbl.unique(['id', 'tenant_id']);
			ReportRequestFormatterTbl.foreign(['tenant_report_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_reports').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_report_input_templates');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_report_input_templates', function(ReportInputTmplTbl) {
			ReportInputTmplTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			ReportInputTmplTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			ReportInputTmplTbl.uuid('tenant_report_id').notNullable();

			ReportInputTmplTbl.text('component_state').notNullable().defaultTo('{}');
			ReportInputTmplTbl.text('component_before_render_code');
			ReportInputTmplTbl.text('component_after_render_code');
			ReportInputTmplTbl.text('component_on_submit_code');
			ReportInputTmplTbl.text('component_before_destroy_code');
			ReportInputTmplTbl.jsonb('component_observers').notNullable().defaultTo('[]');
			ReportInputTmplTbl.jsonb('component_tasks').notNullable().defaultTo('[]');
			ReportInputTmplTbl.text('template');

			ReportInputTmplTbl.boolean('publish_status').notNullable().defaultTo(false);
			ReportInputTmplTbl.timestamp('effectivity_start');
			ReportInputTmplTbl.timestamp('effectivity_end');

			ReportInputTmplTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			ReportInputTmplTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			ReportInputTmplTbl.unique(['id', 'tenant_id']);
			ReportInputTmplTbl.foreign(['tenant_report_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_reports').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_report_result_templates');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_report_result_templates', function(ReportResultTmplTbl) {
			ReportResultTmplTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			ReportResultTmplTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			ReportResultTmplTbl.uuid('tenant_report_id').notNullable();

			ReportResultTmplTbl.text('component_state').notNullable().defaultTo('{}');
			ReportResultTmplTbl.text('component_before_render_code');
			ReportResultTmplTbl.text('component_after_render_code');
			ReportResultTmplTbl.text('component_on_data_code');
			ReportResultTmplTbl.text('component_before_destroy_code');
			ReportResultTmplTbl.jsonb('component_observers').notNullable().defaultTo('[]');
			ReportResultTmplTbl.jsonb('component_tasks').notNullable().defaultTo('[]');

			ReportResultTmplTbl.specificType('response_type', 'public.tenant_report_response_types').notNullable().defaultTo('http');
			ReportResultTmplTbl.text('template');

			ReportResultTmplTbl.boolean('publish_status').notNullable().defaultTo(false);
			ReportResultTmplTbl.timestamp('effectivity_start');
			ReportResultTmplTbl.timestamp('effectivity_end');

			ReportResultTmplTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			ReportResultTmplTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			ReportResultTmplTbl.unique(['id', 'tenant_id']);
			ReportResultTmplTbl.foreign(['tenant_report_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_reports').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	/* Functions, business rules enforced using triggers, etc. */
	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_check_report_constituent_is_valid ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	is_valid_entity	INTEGER;
BEGIN
	is_valid_entity := 0;

	IF TG_OP = 'UPDATE'
	THEN
		IF (OLD.tenant_report_constituent_type = NEW.tenant_report_constituent_type) AND (OLD.tenant_report_constituent_id = NEW.tenant_report_constituent_id)
		THEN
			RETURN NEW;
		END IF;
	END IF;

	IF NEW.tenant_report_constituent_type = 'machine'
	THEN
		is_valid_entity := 0;

		SELECT
			COUNT(id)
		FROM
			tenant_plant_unit_machines
		WHERE
			id = NEW.tenant_report_constituent_id AND
			tenant_id = NEW.tenant_id
		INTO
			is_valid_entity;

		IF is_valid_entity = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Invalid Report Constituent Machine';
			RETURN NULL;
		END IF;
	END IF;

	IF NEW.tenant_report_constituent_type = 'station'
	THEN
		is_valid_entity := 0;

		SELECT
			COUNT(id)
		FROM
			tenant_plant_unit_stations
		WHERE
			id = NEW.tenant_report_constituent_id AND
			tenant_id = NEW.tenant_id
		INTO
			is_valid_entity;

		IF is_valid_entity = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Invalid Report Constituent Station';
			RETURN NULL;
		END IF;
	END IF;

	IF NEW.tenant_report_constituent_type = 'line'
	THEN
		is_valid_entity := 0;

		SELECT
			COUNT(id)
		FROM
			tenant_plant_unit_lines
		WHERE
			id = NEW.tenant_report_constituent_id AND
			tenant_id = NEW.tenant_id
		INTO
			is_valid_entity;

		IF is_valid_entity = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Invalid Report Constituent line';
			RETURN NULL;
		END IF;
	END IF;

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_report_constituent_machine ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_report_constituents
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_report_constituent_id = OLD.id AND
		tenant_report_constituent_type = 'machine';

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_report_constituent_station ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_report_constituents
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_report_constituent_id = OLD.id AND
		tenant_report_constituent_type = 'station';

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_report_constituent_line ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_report_constituents
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_report_constituent_id = OLD.id AND
		tenant_report_constituent_type = 'line';

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_create_report_folder_for_tenant ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	server_id UUID;
	report_feature_id UUID;
	root_folder_id UUID;
BEGIN
	server_id := NULL;
	report_feature_id := NULL;
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
		name = 'Report' AND
		type = 'feature'
	INTO
		report_feature_id;

	IF report_feature_id IS NULL
	THEN
		RETURN NEW;
	END IF;

	IF NEW.module_id <> report_feature_id
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
		'report_feature.folder_names.root.name',
		'report_feature.folder_names.root.description'
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
		'report_feature.folder_names.attribute_sets.name',
		'report_feature.folder_names.attribute_sets.description'
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
		'report_feature.folder_names.reports.name',
		'report_feature.folder_names.reports.description'
	);

	RETURN NEW;
END;
$$;`
	);

	/* Finally, hook up the triggers */
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_report_constituent_is_valid BEFORE INSERT OR UPDATE ON public.tenant_report_constituents FOR EACH ROW EXECUTE PROCEDURE public.fn_check_report_constituent_is_valid();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_report_constituent_machine AFTER DELETE ON public.tenant_plant_unit_machines FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_report_constituent_machine();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_report_constituent_station AFTER DELETE ON public.tenant_plant_unit_stations FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_report_constituent_station();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_report_constituent_line AFTER DELETE ON public.tenant_plant_unit_lines FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_report_constituent_line();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_create_report_folder_for_tenant AFTER INSERT OR UPDATE ON public.tenants_modules FOR EACH ROW EXECUTE PROCEDURE public.fn_create_report_folder_for_tenant();');
};

exports.down = async function(knex) {
	await knex.raw('DROP TRIGGER IF EXISTS trigger_create_report_folder_for_tenant ON public.tenants_modules CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_report_constituent_line ON public.tenant_plant_unit_lines CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_report_constituent_station ON public.tenant_plant_unit_stations CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_report_constituent_machine ON public.tenant_plant_unit_machines CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_check_report_constituent_is_valid ON public.tenant_report_constituents CASCADE;');

	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_create_report_folder_for_tenant () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_report_constituent_line () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_report_constituent_station () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_report_constituent_machine () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_check_report_constituent_is_valid () CASCADE;`);

	await knex.raw(`DROP TABLE IF EXISTS public.tenant_report_result_templates CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_report_input_templates CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_report_response_formatters CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_report_executors CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_report_request_formatters CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_report_processors CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_report_constituents CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_reports_attribute_sets CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_reports CASCADE;`);

	await knex.raw("DROP TYPE IF EXISTS public.tenant_report_response_types CASCADE;");
	await knex.raw("DROP TYPE IF EXISTS public.tenant_report_request_types CASCADE;");
	await knex.raw(`DROP TYPE IF EXISTS public.tenant_report_constituent_types CASCADE;`);
};
