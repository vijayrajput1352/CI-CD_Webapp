/**
 * This sets up the schema for the tenant historical dashboard feature
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;

	await knex.schema.raw("CREATE TYPE public.tenant_historical_dashboard_constituent_types AS ENUM ('machine', 'station', 'line')");

	exists = await knex.schema.withSchema('public').hasTable('tenant_historical_dashboards');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_historical_dashboards', function(HistoricalDashboardsTbl) {
			HistoricalDashboardsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			HistoricalDashboardsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			HistoricalDashboardsTbl.uuid('tenant_folder_id').notNullable();

			HistoricalDashboardsTbl.text('name').notNullable();
			HistoricalDashboardsTbl.text('tags');
			HistoricalDashboardsTbl.text('description');
			HistoricalDashboardsTbl.integer('data_persistence_period').notNullable().defaultTo(1);

			HistoricalDashboardsTbl.jsonb('attribute_set_metadata').notNullable().defaultTo('[]');

			HistoricalDashboardsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			HistoricalDashboardsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			HistoricalDashboardsTbl.unique(['id', 'tenant_id']);
			HistoricalDashboardsTbl.unique(['tenant_folder_id', 'name']);

			HistoricalDashboardsTbl.foreign(['tenant_folder_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_folders').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_historical_dashboards_attribute_sets');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_historical_dashboards_attribute_sets', function(HistoricalDashboardAttributeSetTbl) {
			HistoricalDashboardAttributeSetTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			HistoricalDashboardAttributeSetTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			HistoricalDashboardAttributeSetTbl.uuid('tenant_historical_dashboard_id').notNullable();
			HistoricalDashboardAttributeSetTbl.uuid('tenant_attribute_set_id').notNullable();
			HistoricalDashboardAttributeSetTbl.integer('evaluation_order').notNullable().defaultTo(1);

			HistoricalDashboardAttributeSetTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			HistoricalDashboardAttributeSetTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			HistoricalDashboardAttributeSetTbl.unique(['id', 'tenant_id']);

			HistoricalDashboardAttributeSetTbl.foreign(['tenant_historical_dashboard_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_historical_dashboards').onDelete('CASCADE').onUpdate('CASCADE');
			HistoricalDashboardAttributeSetTbl.foreign(['tenant_attribute_set_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_attribute_sets').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_historical_dashboard_attr_set ON public.tenant_historical_dashboards_attribute_sets
			USING btree
			(
				tenant_historical_dashboard_id ASC,
				tenant_attribute_set_id ASC
			)`
		);
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_historical_dashboard_constituents');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_historical_dashboard_constituents', function(HistoricalDashboardConstituentsTbl) {
			HistoricalDashboardConstituentsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			HistoricalDashboardConstituentsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			HistoricalDashboardConstituentsTbl.uuid('tenant_historical_dashboard_id').notNullable();
			HistoricalDashboardConstituentsTbl.uuid('tenant_historical_dashboard_constituent_id').notNullable();
			HistoricalDashboardConstituentsTbl.specificType('tenant_historical_dashboard_constituent_type', 'public.tenant_historical_dashboard_constituent_types').notNullable().defaultTo('machine');

			HistoricalDashboardConstituentsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			HistoricalDashboardConstituentsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			HistoricalDashboardConstituentsTbl.unique(['id', 'tenant_id']);
			HistoricalDashboardConstituentsTbl.foreign(['tenant_historical_dashboard_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_historical_dashboards').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_historical_dashboard_and_constituent ON public.tenant_historical_dashboard_constituents
			USING btree
			(
				tenant_historical_dashboard_id ASC,
				tenant_historical_dashboard_constituent_id ASC
			)`
		);
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_historical_dashboard_processors');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_historical_dashboard_processors', function(HistoricalDashboardProcessorTbl) {
			HistoricalDashboardProcessorTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			HistoricalDashboardProcessorTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			HistoricalDashboardProcessorTbl.uuid('tenant_historical_dashboard_id').notNullable();

			HistoricalDashboardProcessorTbl.text('processed_data_transform_code');
			HistoricalDashboardProcessorTbl.text('processor');

			HistoricalDashboardProcessorTbl.boolean('publish_status').notNullable().defaultTo(false);
			HistoricalDashboardProcessorTbl.timestamp('effectivity_start');
			HistoricalDashboardProcessorTbl.timestamp('effectivity_end');

			HistoricalDashboardProcessorTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			HistoricalDashboardProcessorTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			HistoricalDashboardProcessorTbl.unique(['id', 'tenant_id']);
			HistoricalDashboardProcessorTbl.foreign(['tenant_historical_dashboard_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_historical_dashboards').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_historical_dashboard_request_formatters');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_historical_dashboard_request_formatters', function(HistoricalDashboardRequestFormatterTbl) {
			HistoricalDashboardRequestFormatterTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			HistoricalDashboardRequestFormatterTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			HistoricalDashboardRequestFormatterTbl.uuid('tenant_historical_dashboard_id').notNullable();

			HistoricalDashboardRequestFormatterTbl.text('formatter_code').notNullable();

			HistoricalDashboardRequestFormatterTbl.boolean('publish_status').notNullable().defaultTo(false);
			HistoricalDashboardRequestFormatterTbl.timestamp('effectivity_start');
			HistoricalDashboardRequestFormatterTbl.timestamp('effectivity_end');

			HistoricalDashboardRequestFormatterTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			HistoricalDashboardRequestFormatterTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			HistoricalDashboardRequestFormatterTbl.unique(['id', 'tenant_id']);
			HistoricalDashboardRequestFormatterTbl.foreign(['tenant_historical_dashboard_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_historical_dashboards').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_historical_dashboard_executors');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_historical_dashboard_executors', function(HistoricalDashboardExecutorTbl) {
			HistoricalDashboardExecutorTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			HistoricalDashboardExecutorTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			HistoricalDashboardExecutorTbl.uuid('tenant_historical_dashboard_id').notNullable();

			HistoricalDashboardExecutorTbl.text('executor_code').notNullable();

			HistoricalDashboardExecutorTbl.boolean('publish_status').notNullable().defaultTo(false);
			HistoricalDashboardExecutorTbl.timestamp('effectivity_start');
			HistoricalDashboardExecutorTbl.timestamp('effectivity_end');

			HistoricalDashboardExecutorTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			HistoricalDashboardExecutorTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			HistoricalDashboardExecutorTbl.unique(['id', 'tenant_id']);
			HistoricalDashboardExecutorTbl.foreign(['tenant_historical_dashboard_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_historical_dashboards').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_historical_dashboard_response_formatters');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_historical_dashboard_response_formatters', function(HistoricalDashboardRequestFormatterTbl) {
			HistoricalDashboardRequestFormatterTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			HistoricalDashboardRequestFormatterTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			HistoricalDashboardRequestFormatterTbl.uuid('tenant_historical_dashboard_id').notNullable();

			HistoricalDashboardRequestFormatterTbl.text('formatter_code').notNullable();

			HistoricalDashboardRequestFormatterTbl.boolean('publish_status').notNullable().defaultTo(false);
			HistoricalDashboardRequestFormatterTbl.timestamp('effectivity_start');
			HistoricalDashboardRequestFormatterTbl.timestamp('effectivity_end');

			HistoricalDashboardRequestFormatterTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			HistoricalDashboardRequestFormatterTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			HistoricalDashboardRequestFormatterTbl.unique(['id', 'tenant_id']);
			HistoricalDashboardRequestFormatterTbl.foreign(['tenant_historical_dashboard_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_historical_dashboards').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_historical_dashboard_input_templates');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_historical_dashboard_input_templates', function(HistoricalDashboardInputTmplTbl) {
			HistoricalDashboardInputTmplTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			HistoricalDashboardInputTmplTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			HistoricalDashboardInputTmplTbl.uuid('tenant_historical_dashboard_id').notNullable();

			HistoricalDashboardInputTmplTbl.text('component_state').notNullable().defaultTo('{}');
			HistoricalDashboardInputTmplTbl.text('component_before_render_code');
			HistoricalDashboardInputTmplTbl.text('component_after_render_code');
			HistoricalDashboardInputTmplTbl.text('component_on_submit_code');
			HistoricalDashboardInputTmplTbl.text('component_before_destroy_code');
			HistoricalDashboardInputTmplTbl.jsonb('component_observers').notNullable().defaultTo('[]');
			HistoricalDashboardInputTmplTbl.jsonb('component_tasks').notNullable().defaultTo('[]');
			HistoricalDashboardInputTmplTbl.text('template');

			HistoricalDashboardInputTmplTbl.boolean('publish_status').notNullable().defaultTo(false);
			HistoricalDashboardInputTmplTbl.timestamp('effectivity_start');
			HistoricalDashboardInputTmplTbl.timestamp('effectivity_end');

			HistoricalDashboardInputTmplTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			HistoricalDashboardInputTmplTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			HistoricalDashboardInputTmplTbl.unique(['id', 'tenant_id']);
			HistoricalDashboardInputTmplTbl.foreign(['tenant_historical_dashboard_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_historical_dashboards').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_historical_dashboard_result_templates');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_historical_dashboard_result_templates', function(HistoricalDashboardResultTmplTbl) {
			HistoricalDashboardResultTmplTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			HistoricalDashboardResultTmplTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			HistoricalDashboardResultTmplTbl.uuid('tenant_historical_dashboard_id').notNullable();

			HistoricalDashboardResultTmplTbl.text('component_state').notNullable().defaultTo('{}');
			HistoricalDashboardResultTmplTbl.text('component_before_render_code');
			HistoricalDashboardResultTmplTbl.text('component_after_render_code');
			HistoricalDashboardResultTmplTbl.text('component_on_data_code');
			HistoricalDashboardResultTmplTbl.text('component_before_destroy_code');
			HistoricalDashboardResultTmplTbl.jsonb('component_observers').notNullable().defaultTo('[]');
			HistoricalDashboardResultTmplTbl.jsonb('component_tasks').notNullable().defaultTo('[]');

			HistoricalDashboardResultTmplTbl.text('template');

			HistoricalDashboardResultTmplTbl.boolean('publish_status').notNullable().defaultTo(false);
			HistoricalDashboardResultTmplTbl.timestamp('effectivity_start');
			HistoricalDashboardResultTmplTbl.timestamp('effectivity_end');

			HistoricalDashboardResultTmplTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			HistoricalDashboardResultTmplTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			HistoricalDashboardResultTmplTbl.unique(['id', 'tenant_id']);
			HistoricalDashboardResultTmplTbl.foreign(['tenant_historical_dashboard_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_historical_dashboards').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	/* Functions, business rules enforced using triggers, etc. */
	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_check_historical_dashboard_constituent_is_valid ()
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
		IF (OLD.tenant_historical_dashboard_constituent_type = NEW.tenant_historical_dashboard_constituent_type) AND (OLD.tenant_historical_dashboard_constituent_id = NEW.tenant_historical_dashboard_constituent_id)
		THEN
			RETURN NEW;
		END IF;
	END IF;

	IF NEW.tenant_historical_dashboard_constituent_type = 'machine'
	THEN
		is_valid_entity := 0;

		SELECT
			COUNT(id)
		FROM
			tenant_plant_unit_machines
		WHERE
			id = NEW.tenant_historical_dashboard_constituent_id AND
			tenant_id = NEW.tenant_id
		INTO
			is_valid_entity;

		IF is_valid_entity = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Invalid HistoricalDashboard Constituent Machine';
			RETURN NULL;
		END IF;
	END IF;

	IF NEW.tenant_historical_dashboard_constituent_type = 'station'
	THEN
		is_valid_entity := 0;

		SELECT
			COUNT(id)
		FROM
			tenant_plant_unit_stations
		WHERE
			id = NEW.tenant_historical_dashboard_constituent_id AND
			tenant_id = NEW.tenant_id
		INTO
			is_valid_entity;

		IF is_valid_entity = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Invalid HistoricalDashboard Constituent Station';
			RETURN NULL;
		END IF;
	END IF;

	IF NEW.tenant_historical_dashboard_constituent_type = 'line'
	THEN
		is_valid_entity := 0;

		SELECT
			COUNT(id)
		FROM
			tenant_plant_unit_lines
		WHERE
			id = NEW.tenant_historical_dashboard_constituent_id AND
			tenant_id = NEW.tenant_id
		INTO
			is_valid_entity;

		IF is_valid_entity = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Invalid Historical Dashboard Constituent line';
			RETURN NULL;
		END IF;
	END IF;

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_historical_dashboard_constituent_machine ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_historical_dashboard_constituents
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_historical_dashboard_constituent_id = OLD.id AND
		tenant_historical_dashboard_constituent_type = 'machine';

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_historical_dashboard_constituent_station ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_historical_dashboard_constituents
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_historical_dashboard_constituent_id = OLD.id AND
		tenant_historical_dashboard_constituent_type = 'station';

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_historical_dashboard_constituent_line ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_historical_dashboard_constituents
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_historical_dashboard_constituent_id = OLD.id AND
		tenant_historical_dashboard_constituent_type = 'line';

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_create_historical_dashboard_folder_for_tenant ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	server_id UUID;
	historical_dashboard_feature_id UUID;
	root_folder_id UUID;
BEGIN
	server_id := NULL;
	historical_dashboard_feature_id := NULL;
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
		name = 'HistoricalDashboard' AND
		type = 'feature'
	INTO
		historical_dashboard_feature_id;

	IF historical_dashboard_feature_id IS NULL
	THEN
		RETURN NEW;
	END IF;

	IF NEW.module_id <> historical_dashboard_feature_id
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
		'historical_dashboard_feature.folder_names.root.name',
		'historical_dashboard_feature.folder_names.root.description'
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
		'historical_dashboard_feature.folder_names.attribute_sets.name',
		'historical_dashboard_feature.folder_names.attribute_sets.description'
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
		'historical_dashboard_feature.folder_names.historical_dashboards.name',
		'historical_dashboard_feature.folder_names.historical_dashboards.description'
	);

	RETURN NEW;
END;
$$;`
	);

	/* Finally, hook up the triggers */
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_historical_dashboard_constituent_is_valid BEFORE INSERT OR UPDATE ON public.tenant_historical_dashboard_constituents FOR EACH ROW EXECUTE PROCEDURE public.fn_check_historical_dashboard_constituent_is_valid();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_historical_dashboard_constituent_machine AFTER DELETE ON public.tenant_plant_unit_machines FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_historical_dashboard_constituent_machine();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_historical_dashboard_constituent_station AFTER DELETE ON public.tenant_plant_unit_stations FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_historical_dashboard_constituent_station();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_historical_dashboard_constituent_line AFTER DELETE ON public.tenant_plant_unit_lines FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_historical_dashboard_constituent_line();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_create_historical_dashboard_folder_for_tenant AFTER INSERT OR UPDATE ON public.tenants_modules FOR EACH ROW EXECUTE PROCEDURE public.fn_create_historical_dashboard_folder_for_tenant();');
};

exports.down = async function(knex) {
	await knex.raw('DROP TRIGGER IF EXISTS trigger_create_historical_dashboard_folder_for_tenant ON public.tenants_modules CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_historical_dashboard_constituent_line ON public.tenant_plant_unit_lines CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_historical_dashboard_constituent_station ON public.tenant_plant_unit_stations CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_historical_dashboard_constituent_machine ON public.tenant_plant_unit_machines CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_check_historical_dashboard_constituent_is_valid ON public.tenant_historical_dashboard_constituents CASCADE;');

	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_create_historical_dashboard_folder_for_tenant () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_historical_dashboard_constituent_line () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_historical_dashboard_constituent_station () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_historical_dashboard_constituent_machine () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_check_historical_dashboard_constituent_is_valid () CASCADE;`);

	await knex.raw(`DROP TABLE IF EXISTS public.tenant_historical_dashboard_result_templates CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_historical_dashboard_input_templates CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_historical_dashboard_response_formatters CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_historical_dashboard_executors CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_historical_dashboard_request_formatters CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_historical_dashboard_processors CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_historical_dashboard_constituents CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_historical_dashboards_attribute_sets CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_historical_dashboards CASCADE;`);

	await knex.raw(`DROP TYPE IF EXISTS public.tenant_historical_dashboard_constituent_types CASCADE;`);
};
