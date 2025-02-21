'use strict';
/**
 * This sets up the schema for the tenant alerts feature
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;

	await knex.schema.raw("CREATE TYPE public.tenant_alert_constituent_types AS ENUM ('machine', 'line', 'panel')");
	await knex.schema.raw("CREATE TYPE public.tenant_alert_response_types AS ENUM ('api', 'email', 'http', 'message', 'sms', 'telegram', 'mqtt')");
	//await knex.schema.raw("CREATE TYPE public.tenant_panel_data_display_choices AS ENUM ('realtime', 'last_one_hour', 'last_two_hours', 'last_four_hours', 'last_eight_hours', 'last_twelve_hours', 'last_twenty_four_hours', 'current_shift', 'current_day')");

	exists = await knex.schema.withSchema('public').hasTable('tenant_alerts');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_alerts', function(AlertsTbl) {
			AlertsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			AlertsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			AlertsTbl.uuid('tenant_folder_id').notNullable();

			AlertsTbl.text('name').notNullable();
			AlertsTbl.text('description');

			AlertsTbl.jsonb('attribute_set_metadata').notNullable().defaultTo('[]');
			AlertsTbl.jsonb('escalation_levels').notNullable().defaultTo('[]');
			AlertsTbl.jsonb('response_types').notNullable().defaultTo('[]');
			AlertsTbl.text('mqtt_topic');
			AlertsTbl.integer('data_persistence_period').notNullable().defaultTo(1);

			AlertsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			AlertsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			AlertsTbl.unique(['id', 'tenant_id']);
			AlertsTbl.unique(['tenant_folder_id', 'name']);

			AlertsTbl.foreign(['tenant_folder_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_folders').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_alerts_attribute_sets');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_alerts_attribute_sets', function(AlertAttributeSetTbl) {
			AlertAttributeSetTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			AlertAttributeSetTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			AlertAttributeSetTbl.uuid('tenant_alert_id').notNullable();
			AlertAttributeSetTbl.uuid('tenant_attribute_set_id').notNullable();
			AlertAttributeSetTbl.integer('evaluation_order').notNullable().defaultTo(1);

			AlertAttributeSetTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			AlertAttributeSetTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			AlertAttributeSetTbl.unique(['id', 'tenant_id']);

			AlertAttributeSetTbl.foreign(['tenant_alert_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_alerts').onDelete('CASCADE').onUpdate('CASCADE');
			AlertAttributeSetTbl.foreign(['tenant_attribute_set_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_attribute_sets').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_alert_attr_set ON public.tenant_alerts_attribute_sets
			USING btree
			(
				tenant_alert_id ASC,
				tenant_attribute_set_id ASC
			)`
		);
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_alert_constituents');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_alert_constituents', function(AlertConstituentsTbl) {
			AlertConstituentsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			AlertConstituentsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			AlertConstituentsTbl.uuid('tenant_alert_id').notNullable();
			AlertConstituentsTbl.uuid('tenant_alert_constituent_id').notNullable();
			AlertConstituentsTbl.specificType('tenant_alert_constituent_type', 'public.tenant_alert_constituent_types').notNullable().defaultTo('machine');

			AlertConstituentsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			AlertConstituentsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			AlertConstituentsTbl.unique(['id', 'tenant_id']);
			AlertConstituentsTbl.foreign(['tenant_alert_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_alerts').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_alert_and_constituent ON public.tenant_alert_constituents
			USING btree
			(
				tenant_alert_id ASC,
				tenant_alert_constituent_id ASC
			)`
		);
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_alert_processors');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_alert_processors', function(AlertProcessorTbl) {
			AlertProcessorTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			AlertProcessorTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			AlertProcessorTbl.uuid('tenant_alert_id').notNullable();

			AlertProcessorTbl.text('processed_data_transform_code');
			AlertProcessorTbl.text('on_data_code');
			AlertProcessorTbl.text('on_event_code');

			AlertProcessorTbl.text('processor');
			AlertProcessorTbl.boolean('publish_status').notNullable().defaultTo(false);

			AlertProcessorTbl.timestamp('effectivity_start');
			AlertProcessorTbl.timestamp('effectivity_end');

			AlertProcessorTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			AlertProcessorTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			AlertProcessorTbl.unique(['id', 'tenant_id']);
			AlertProcessorTbl.foreign(['tenant_alert_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_alerts').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_alert_response_formatters');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_alert_response_formatters', function(AlertResponseFormatterTbl) {
			AlertResponseFormatterTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			AlertResponseFormatterTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			AlertResponseFormatterTbl.uuid('tenant_alert_id').notNullable();

			AlertResponseFormatterTbl.specificType('type', 'public.tenant_alert_response_types').notNullable().defaultTo('sms');
			AlertResponseFormatterTbl.text('formatter_code');
			AlertResponseFormatterTbl.boolean('publish_status').notNullable().defaultTo(false);

			AlertResponseFormatterTbl.timestamp('effectivity_start');
			AlertResponseFormatterTbl.timestamp('effectivity_end');

			AlertResponseFormatterTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			AlertResponseFormatterTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			AlertResponseFormatterTbl.unique(['id', 'tenant_id']);
			AlertResponseFormatterTbl.foreign(['tenant_alert_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_alerts').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_alerts_users');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_alerts_users', function(AlertsUsersTbl) {
			AlertsUsersTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			AlertsUsersTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			AlertsUsersTbl.uuid('tenant_alert_id').notNullable();
			AlertsUsersTbl.uuid('tenant_user_id').notNullable();

			AlertsUsersTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			AlertsUsersTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			AlertsUsersTbl.boolean('on_email_distribution_list').notNullable().defaultTo(false);
			AlertsUsersTbl.boolean('on_sms_distribution_list').notNullable().defaultTo(false);
			AlertsUsersTbl.boolean('on_message_distribution_list').notNullable().defaultTo(false);

			AlertsUsersTbl.unique(['id', 'tenant_id']);
			AlertsUsersTbl.unique(['tenant_alert_id', 'tenant_user_id']);

			AlertsUsersTbl.foreign(['tenant_alert_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_alerts').onDelete('CASCADE').onUpdate('CASCADE');
			AlertsUsersTbl.foreign(['tenant_user_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenants_users').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	/* Functions, business rules enforced using triggers, etc. */
	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_check_alert_constituent_is_valid ()
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
		IF (OLD.tenant_alert_constituent_type = NEW.tenant_alert_constituent_type) AND (OLD.tenant_alert_constituent_id = NEW.tenant_alert_constituent_id)
		THEN
			RETURN NEW;
		END IF;
	END IF;

	IF NEW.tenant_alert_constituent_type = 'machine'
	THEN
		is_valid_entity := 0;

		SELECT
			COUNT(id)
		FROM
			tenant_plant_unit_machines
		WHERE
			id = NEW.tenant_alert_constituent_id AND
			tenant_id = NEW.tenant_id
		INTO
			is_valid_entity;

		IF is_valid_entity = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Invalid Alert Constituent Machine';
			RETURN NULL;
		END IF;
	END IF;

	IF NEW.tenant_alert_constituent_type = 'line'
	THEN
		is_valid_entity := 0;

		SELECT
			COUNT(id)
		FROM
			tenant_plant_unit_lines
		WHERE
			id = NEW.tenant_alert_constituent_id AND
			tenant_id = NEW.tenant_id
		INTO
			is_valid_entity;

		IF is_valid_entity = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Invalid Alert Constituent line';
			RETURN NULL;
		END IF;
	END IF;

	IF NEW.tenant_alert_constituent_type = 'panel'
	THEN
		is_valid_entity := 0;

		SELECT
			COUNT(id)
		FROM
			tenant_panels
		WHERE
			id = NEW.tenant_alert_constituent_id AND
			tenant_id = NEW.tenant_id
		INTO
			is_valid_entity;

		IF is_valid_entity = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Invalid Alert Constituent Panel';
			RETURN NULL;
		END IF;
	END IF;

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_alert_constituent_machine ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_alert_constituents
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_alert_constituent_id = OLD.id AND
		tenant_alert_constituent_type = 'machine';

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_alert_constituent_line ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_alert_constituents
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_alert_constituent_id = OLD.id AND
		tenant_alert_constituent_type = 'line';

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_alert_constituent_panel ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_alert_constituents
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_alert_constituent_id = OLD.id AND
		tenant_alert_constituent_type = 'panel';

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_create_alert_folder_for_tenant ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	server_id UUID;
	alert_feature_id UUID;
	root_folder_id UUID;
BEGIN
	server_id := NULL;
	alert_feature_id := NULL;
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
		name = 'Alert' AND
		type = 'feature'
	INTO
		alert_feature_id;

	IF alert_feature_id IS NULL
	THEN
		RETURN NEW;
	END IF;

	IF NEW.module_id <> alert_feature_id
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
		'alert_feature.folder_names.root.name',
		'alert_feature.folder_names.root.description'
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
		'alert_feature.folder_names.attribute_sets.name',
		'alert_feature.folder_names.attribute_sets.description'
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
		'alert_feature.folder_names.alerts.name',
		'alert_feature.folder_names.alerts.description'
	);

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_delete_old_alert_processors ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM tenant_alert_processors WHERE tenant_alert_id = NEW.tenant_alert_id AND effectivity_end < (now() - interval '72 hours');
	RETURN NULL;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_delete_old_alert_response_formatters ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM tenant_alert_response_formatters WHERE tenant_alert_id = NEW.tenant_alert_id AND effectivity_end < (now() - interval '72 hours');
	RETURN NULL;
END;
$$;`
	);

	/* Finally, hook up the triggers */
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_alert_constituent_is_valid BEFORE INSERT OR UPDATE ON public.tenant_alert_constituents FOR EACH ROW EXECUTE PROCEDURE public.fn_check_alert_constituent_is_valid();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_alert_constituent_machine AFTER DELETE ON public.tenant_plant_unit_machines FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_alert_constituent_machine();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_alert_constituent_line AFTER DELETE ON public.tenant_plant_unit_lines FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_alert_constituent_line();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_alert_constituent_panel AFTER DELETE ON public.tenant_panels FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_alert_constituent_panel();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_create_alert_folder_for_tenant AFTER INSERT OR UPDATE ON public.tenants_modules FOR EACH ROW EXECUTE PROCEDURE public.fn_create_alert_folder_for_tenant();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_alert_processors AFTER INSERT OR UPDATE ON public.tenant_alert_processors FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_alert_processors();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_alert_response_formatters AFTER INSERT OR UPDATE ON public.tenant_alert_response_formatters FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_alert_response_formatters();');
};

exports.down = async function(knex) {
	await knex.raw('DROP TRIGGER IF EXISTS trigger_delete_old_alert_response_formatters ON public.tenant_alert_response_formatters CASCADE');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_delete_old_alert_processors ON public.tenant_alert_processors CASCADE');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_create_alert_folder_for_tenant ON public.tenants_modules CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_alert_constituent_panel ON public.tenant_panels CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_alert_constituent_line ON public.tenant_plant_unit_lines CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_alert_constituent_machine ON public.tenant_plant_unit_machines CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_check_alert_constituent_is_valid ON public.tenant_alert_constituents CASCADE;');

	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_old_alert_response_formatters () CASCADE`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_old_alert_processors () CASCADE`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_create_alert_folder_for_tenant () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_alert_constituent_panel () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_alert_constituent_line () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_alert_constituent_machine () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_check_alert_constituent_is_valid () CASCADE;`);

	await knex.raw(`DROP TABLE IF EXISTS public.tenant_alerts_users CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_alert_response_formatters CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_alert_processors CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_alert_constituents CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_alerts_attribute_sets CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_alerts CASCADE;`);

	await knex.raw(`DROP TYPE IF EXISTS public.tenant_alert_response_types CASCADE;`);
	await knex.raw(`DROP TYPE IF EXISTS public.tenant_alert_constituent_types CASCADE;`);
};
