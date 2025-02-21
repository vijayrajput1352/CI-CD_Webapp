/**
 * This sets up the schema for the tenant panel feature
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;

	await knex.schema.raw("CREATE TYPE public.tenant_panel_constituent_types AS ENUM ('machine', 'station', 'line', 'panel')");
	await knex.schema.raw("CREATE TYPE public.tenant_panel_data_display_choices AS ENUM ('realtime', 'last_one_hour', 'last_two_hours', 'last_four_hours', 'last_eight_hours', 'last_twelve_hours', 'last_twenty_four_hours', 'current_shift', 'current_day')");

	exists = await knex.schema.withSchema('public').hasTable('tenant_panels');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_panels', function(PanelsTbl) {
			PanelsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PanelsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			PanelsTbl.uuid('tenant_folder_id').notNullable();

			PanelsTbl.text('name').notNullable();
			PanelsTbl.text('tags');
			PanelsTbl.text('description');
			PanelsTbl.integer('data_persistence_period').notNullable().defaultTo(1);
			PanelsTbl.integer('data_request_period').notNullable().defaultTo(300);
			PanelsTbl.jsonb('attribute_set_metadata').notNullable().defaultTo('[]');

			PanelsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PanelsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PanelsTbl.unique(['id', 'tenant_id']);
			PanelsTbl.unique(['tenant_folder_id', 'name']);

			PanelsTbl.foreign(['tenant_folder_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_folders').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_panels_attribute_sets');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_panels_attribute_sets', function(PanelAttributeSetTbl) {
			PanelAttributeSetTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PanelAttributeSetTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			PanelAttributeSetTbl.uuid('tenant_panel_id').notNullable();
			PanelAttributeSetTbl.uuid('tenant_attribute_set_id').notNullable();
			PanelAttributeSetTbl.integer('evaluation_order').notNullable().defaultTo(1);

			PanelAttributeSetTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PanelAttributeSetTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PanelAttributeSetTbl.unique(['id', 'tenant_id']);

			PanelAttributeSetTbl.foreign(['tenant_panel_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_panels').onDelete('CASCADE').onUpdate('CASCADE');
			PanelAttributeSetTbl.foreign(['tenant_attribute_set_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_attribute_sets').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_panel_attr_set ON public.tenant_panels_attribute_sets
			USING btree
			(
				tenant_panel_id ASC,
				tenant_attribute_set_id ASC
			)`
		);
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_panel_constituents');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_panel_constituents', function(PanelConstituentsTbl) {
			PanelConstituentsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PanelConstituentsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			PanelConstituentsTbl.uuid('tenant_panel_id').notNullable();
			PanelConstituentsTbl.uuid('tenant_panel_constituent_id').notNullable();
			PanelConstituentsTbl.specificType('tenant_panel_constituent_type', 'public.tenant_panel_constituent_types').notNullable().defaultTo('machine');

			PanelConstituentsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PanelConstituentsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PanelConstituentsTbl.unique(['id', 'tenant_id']);
			PanelConstituentsTbl.foreign(['tenant_panel_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_panels').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_panel_and_constituent ON public.tenant_panel_constituents
			USING btree
			(
				tenant_panel_id ASC,
				tenant_panel_constituent_id ASC
			)`
		);
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_panel_processors');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_panel_processors', function(PanelProcessorTbl) {
			PanelProcessorTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PanelProcessorTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			PanelProcessorTbl.uuid('tenant_panel_id').notNullable();

			PanelProcessorTbl.text('processed_data_transform_code');
			PanelProcessorTbl.text('pre_realtime_push_transform_code');

			PanelProcessorTbl.text('processor');
			PanelProcessorTbl.boolean('publish_status').notNullable().defaultTo(false);

			PanelProcessorTbl.timestamp('effectivity_start');
			PanelProcessorTbl.timestamp('effectivity_end');

			PanelProcessorTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PanelProcessorTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PanelProcessorTbl.unique(['id', 'tenant_id']);
			PanelProcessorTbl.foreign(['tenant_panel_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_panels').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

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

	exists = await knex.schema.withSchema('public').hasTable('tenant_panel_templates');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_panel_templates', function(PanelTemplateTbl) {
			PanelTemplateTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PanelTemplateTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			PanelTemplateTbl.uuid('tenant_panel_id').notNullable();

			PanelTemplateTbl.boolean('publish_status').notNullable().defaultTo(false);

			PanelTemplateTbl.timestamp('effectivity_start');
			PanelTemplateTbl.timestamp('effectivity_end');

			PanelTemplateTbl.text('component_state').notNullable().defaultTo('{}');
			PanelTemplateTbl.text('component_before_render_code');
			PanelTemplateTbl.text('component_after_render_code');
			PanelTemplateTbl.text('component_on_data_code');
			PanelTemplateTbl.text('component_on_periodic_data_code');
			PanelTemplateTbl.text('component_before_destroy_code');
			PanelTemplateTbl.text('template');
			PanelTemplateTbl.jsonb('component_observers').notNullable().defaultTo('[]');
			PanelTemplateTbl.jsonb('component_tasks').notNullable().defaultTo('[]');

			PanelTemplateTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PanelTemplateTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PanelTemplateTbl.unique(['id', 'tenant_id']);
			PanelTemplateTbl.foreign(['tenant_panel_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_panels').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	/* Functions, business rules enforced using triggers, etc. */
	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_check_panel_constituent_is_valid ()
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
		IF (OLD.tenant_panel_constituent_type = NEW.tenant_panel_constituent_type) AND (OLD.tenant_panel_constituent_id = NEW.tenant_panel_constituent_id)
		THEN
			RETURN NEW;
		END IF;
	END IF;

	IF NEW.tenant_panel_constituent_type = 'machine'
	THEN
		is_valid_entity := 0;

		SELECT
			COUNT(id)
		FROM
			tenant_plant_unit_machines
		WHERE
			id = NEW.tenant_panel_constituent_id AND
			tenant_id = NEW.tenant_id
		INTO
			is_valid_entity;

		IF is_valid_entity = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Invalid Panel Constituent Machine';
			RETURN NULL;
		END IF;
	END IF;

	IF NEW.tenant_panel_constituent_type = 'station'
	THEN
		is_valid_entity := 0;

		SELECT
			COUNT(id)
		FROM
			tenant_plant_unit_stations
		WHERE
			id = NEW.tenant_panel_constituent_id AND
			tenant_id = NEW.tenant_id
		INTO
			is_valid_entity;

		IF is_valid_entity = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Invalid Panel Constituent Station';
			RETURN NULL;
		END IF;
	END IF;

	IF NEW.tenant_panel_constituent_type = 'line'
	THEN
		is_valid_entity := 0;

		SELECT
			COUNT(id)
		FROM
			tenant_plant_unit_lines
		WHERE
			id = NEW.tenant_panel_constituent_id AND
			tenant_id = NEW.tenant_id
		INTO
			is_valid_entity;

		IF is_valid_entity = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Invalid Panel Constituent line';
			RETURN NULL;
		END IF;
	END IF;

	IF NEW.tenant_panel_constituent_type = 'panel'
	THEN
		is_valid_entity := 0;

		SELECT
			COUNT(id)
		FROM
			tenant_panels
		WHERE
			id = NEW.tenant_panel_constituent_id AND
			tenant_id = NEW.tenant_id
		INTO
			is_valid_entity;

		IF is_valid_entity = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Invalid Panel Constituent Sub-panel';
			RETURN NULL;
		END IF;
	END IF;

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_panel_constituent_machine ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_panel_constituents
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_panel_constituent_id = OLD.id AND
		tenant_panel_constituent_type = 'machine';

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_panel_constituent_station ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_panel_constituents
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_panel_constituent_id = OLD.id AND
		tenant_panel_constituent_type = 'station';

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_panel_constituent_line ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_panel_constituents
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_panel_constituent_id = OLD.id AND
		tenant_panel_constituent_type = 'line';

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_panel_constituent_panel ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_panel_constituents
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_panel_constituent_id = OLD.id AND
		tenant_panel_constituent_type = 'panel';

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_create_panel_folder_for_tenant ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	server_id UUID;
	board_feature_id UUID;
	root_folder_id UUID;
BEGIN
	server_id := NULL;
	board_feature_id := NULL;
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
		name = 'Board' AND
		type = 'feature'
	INTO
		board_feature_id;

	IF board_feature_id IS NULL
	THEN
		RETURN NEW;
	END IF;

	IF NEW.module_id <> board_feature_id
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
		'board_feature.folder_names.root.name',
		'board_feature.folder_names.root.description'
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
		'board_feature.folder_names.attribute_sets.name',
		'board_feature.folder_names.attribute_sets.description'
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
		'board_feature.folder_names.panels.name',
		'board_feature.folder_names.panels.description'
	);

	RETURN NEW;
END;
$$;`
	);

	/* Finally, hook up the triggers */
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_panel_constituent_is_valid BEFORE INSERT OR UPDATE ON public.tenant_panel_constituents FOR EACH ROW EXECUTE PROCEDURE public.fn_check_panel_constituent_is_valid();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_panel_constituent_machine AFTER DELETE ON public.tenant_plant_unit_machines FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_panel_constituent_machine();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_panel_constituent_station AFTER DELETE ON public.tenant_plant_unit_stations FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_panel_constituent_station();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_panel_constituent_line AFTER DELETE ON public.tenant_plant_unit_lines FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_panel_constituent_line();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_panel_constituent_panel AFTER DELETE ON public.tenant_panels FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_panel_constituent_panel();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_create_panel_folder_for_tenant AFTER INSERT OR UPDATE ON public.tenants_modules FOR EACH ROW EXECUTE PROCEDURE public.fn_create_panel_folder_for_tenant();');
};

exports.down = async function(knex) {
	await knex.raw('DROP TRIGGER IF EXISTS trigger_create_panel_folder_for_tenant ON public.tenants_modules CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_panel_constituent_panel ON public.tenant_panels CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_panel_constituent_line ON public.tenant_plant_unit_lines CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_panel_constituent_station ON public.tenant_plant_unit_stations CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_panel_constituent_machine ON public.tenant_plant_unit_machines CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_check_panel_constituent_is_valid ON public.tenant_panel_constituents CASCADE;');

	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_create_panel_folder_for_tenant () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_panel_constituent_panel () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_panel_constituent_line () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_panel_constituent_station () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_panel_constituent_machine () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_check_panel_constituent_is_valid () CASCADE;`);

	await knex.raw(`DROP TABLE IF EXISTS public.tenant_panel_templates CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_panel_response_formatters CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_panel_executors CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_panel_request_formatters CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_panel_processors CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_panel_constituents CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_panels_attribute_sets CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_panels CASCADE;`);

	await knex.raw(`DROP TYPE IF EXISTS public.tenant_panel_data_display_choices CASCADE;`);
	await knex.raw(`DROP TYPE IF EXISTS public.tenant_panel_constituent_types CASCADE;`);
};
