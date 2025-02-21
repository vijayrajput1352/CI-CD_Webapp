'use strict';
/**
 * This sets up the schema for the tenant alerts feature
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;

	await knex.schema.raw("CREATE TYPE public.tenant_event_alert_constituent_types AS ENUM ('machine', 'line')");
	await knex.schema.raw("CREATE TYPE public.tenant_event_alert_response_types AS ENUM ('api', 'email', 'http', 'message', 'sms', 'telegram', 'mqtt')");

	exists = await knex.schema.withSchema('public').hasTable('tenant_event_alerts');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_event_alerts', function(EventAlertsTbl) {
			EventAlertsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			EventAlertsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			EventAlertsTbl.uuid('tenant_folder_id').notNullable();

			EventAlertsTbl.text('name').notNullable();
			EventAlertsTbl.text('description');

			EventAlertsTbl.jsonb('escalation_levels').notNullable().defaultTo('[]');
			EventAlertsTbl.jsonb('response_types').notNullable().defaultTo('[]');
			EventAlertsTbl.text('mqtt_topic');

			EventAlertsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			EventAlertsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			EventAlertsTbl.unique(['id', 'tenant_id']);
			EventAlertsTbl.unique(['tenant_folder_id', 'name']);

			EventAlertsTbl.foreign(['tenant_folder_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_folders').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_event_alert_constituents');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_event_alert_constituents', function(EventAlertConstituentsTbl) {
			EventAlertConstituentsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			EventAlertConstituentsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			EventAlertConstituentsTbl.uuid('tenant_event_alert_id').notNullable();
			EventAlertConstituentsTbl.uuid('tenant_event_alert_constituent_id').notNullable();
			EventAlertConstituentsTbl.specificType('tenant_event_alert_constituent_type', 'public.tenant_event_alert_constituent_types').notNullable().defaultTo('machine');

			EventAlertConstituentsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			EventAlertConstituentsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			EventAlertConstituentsTbl.unique(['id', 'tenant_id']);
			EventAlertConstituentsTbl.foreign(['tenant_event_alert_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_event_alerts').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_event_alert_and_constituent ON public.tenant_event_alert_constituents
			USING btree
			(
				tenant_event_alert_id ASC,
				tenant_event_alert_constituent_id ASC
			)`
		);
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_event_alert_processors');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_event_alert_processors', function(EventAlertProcessorTbl) {
			EventAlertProcessorTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			EventAlertProcessorTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			EventAlertProcessorTbl.uuid('tenant_event_alert_id').notNullable();

			EventAlertProcessorTbl.text('processed_data_transform_code');
			EventAlertProcessorTbl.text('on_event_code');

			EventAlertProcessorTbl.text('processor');
			EventAlertProcessorTbl.boolean('publish_status').notNullable().defaultTo(false);

			EventAlertProcessorTbl.timestamp('effectivity_start');
			EventAlertProcessorTbl.timestamp('effectivity_end');

			EventAlertProcessorTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			EventAlertProcessorTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			EventAlertProcessorTbl.unique(['id', 'tenant_id']);
			EventAlertProcessorTbl.foreign(['tenant_event_alert_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_event_alerts').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_event_alert_response_formatters');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_event_alert_response_formatters', function(EventAlertResponseFormatterTbl) {
			EventAlertResponseFormatterTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			EventAlertResponseFormatterTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			EventAlertResponseFormatterTbl.uuid('tenant_event_alert_id').notNullable();

			EventAlertResponseFormatterTbl.specificType('type', 'public.tenant_event_alert_response_types').notNullable().defaultTo('sms');
			EventAlertResponseFormatterTbl.text('formatter_code');
			EventAlertResponseFormatterTbl.boolean('publish_status').notNullable().defaultTo(false);

			EventAlertResponseFormatterTbl.timestamp('effectivity_start');
			EventAlertResponseFormatterTbl.timestamp('effectivity_end');

			EventAlertResponseFormatterTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			EventAlertResponseFormatterTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			EventAlertResponseFormatterTbl.unique(['id', 'tenant_id']);
			EventAlertResponseFormatterTbl.foreign(['tenant_event_alert_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_event_alerts').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_event_alerts_users');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_event_alerts_users', function(EventAlertsUsersTbl) {
			EventAlertsUsersTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			EventAlertsUsersTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			EventAlertsUsersTbl.uuid('tenant_event_alert_id').notNullable();
			EventAlertsUsersTbl.uuid('tenant_user_id').notNullable();

			EventAlertsUsersTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			EventAlertsUsersTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			EventAlertsUsersTbl.boolean('on_email_distribution_list').notNullable().defaultTo(false);
			EventAlertsUsersTbl.boolean('on_sms_distribution_list').notNullable().defaultTo(false);
			EventAlertsUsersTbl.boolean('on_message_distribution_list').notNullable().defaultTo(false);

			EventAlertsUsersTbl.unique(['id', 'tenant_id']);
			EventAlertsUsersTbl.unique(['tenant_event_alert_id', 'tenant_user_id']);

			EventAlertsUsersTbl.foreign(['tenant_event_alert_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_event_alerts').onDelete('CASCADE').onUpdate('CASCADE');
			EventAlertsUsersTbl.foreign(['tenant_user_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenants_users').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	/* Functions, business rules enforced using triggers, etc. */
	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_check_event_alert_constituent_is_valid ()
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
		IF (OLD.tenant_event_alert_constituent_type = NEW.tenant_event_alert_constituent_type) AND (OLD.tenant_event_alert_constituent_id = NEW.tenant_event_alert_constituent_id)
		THEN
			RETURN NEW;
		END IF;
	END IF;

	IF NEW.tenant_event_alert_constituent_type = 'machine'
	THEN
		is_valid_entity := 0;

		SELECT
			COUNT(id)
		FROM
			tenant_plant_unit_machines
		WHERE
			id = NEW.tenant_event_alert_constituent_id AND
			tenant_id = NEW.tenant_id
		INTO
			is_valid_entity;

		IF is_valid_entity = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Invalid Event Alert Constituent Machine';
			RETURN NULL;
		END IF;
	END IF;

	IF NEW.tenant_event_alert_constituent_type = 'line'
	THEN
		is_valid_entity := 0;

		SELECT
			COUNT(id)
		FROM
			tenant_plant_unit_lines
		WHERE
			id = NEW.tenant_event_alert_constituent_id AND
			tenant_id = NEW.tenant_id
		INTO
			is_valid_entity;

		IF is_valid_entity = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Invalid Event Alert Constituent line';
			RETURN NULL;
		END IF;
	END IF;

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_event_alert_constituent_machine ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_event_alert_constituents
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_event_alert_constituent_id = OLD.id AND
		tenant_event_alert_constituent_type = 'machine';

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_event_alert_constituent_line ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_event_alert_constituents
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_event_alert_constituent_id = OLD.id AND
		tenant_event_alert_constituent_type = 'line';

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_create_event_alert_folder_for_tenant ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	server_id UUID;
	event_alert_feature_id UUID;
	root_folder_id UUID;
BEGIN
	server_id := NULL;
	event_alert_feature_id := NULL;
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
		name = 'EventAlert' AND
		type = 'feature'
	INTO
		event_alert_feature_id;

	IF event_alert_feature_id IS NULL
	THEN
		RETURN NEW;
	END IF;

	IF NEW.module_id <> event_alert_feature_id
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
		'event_alert_feature.folder_names.root.name',
		'event_alert_feature.folder_names.root.description'
	)
	RETURNING
		id
	INTO
		root_folder_id;

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_delete_old_event_alert_processors ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM tenant_event_alert_processors WHERE tenant_event_alert_id = NEW.tenant_event_alert_id AND effectivity_end < (now() - interval '72 hours');
	RETURN NULL;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_delete_old_event_alert_response_formatters ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM tenant_event_alert_response_formatters WHERE tenant_event_alert_id = NEW.tenant_event_alert_id AND effectivity_end < (now() - interval '72 hours');
	RETURN NULL;
END;
$$;`
	);

	/* Finally, hook up the triggers */
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_event_alert_constituent_is_valid BEFORE INSERT OR UPDATE ON public.tenant_event_alert_constituents FOR EACH ROW EXECUTE PROCEDURE public.fn_check_event_alert_constituent_is_valid();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_event_alert_constituent_machine AFTER DELETE ON public.tenant_plant_unit_machines FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_event_alert_constituent_machine();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_event_alert_constituent_line AFTER DELETE ON public.tenant_plant_unit_lines FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_event_alert_constituent_line();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_create_event_alert_folder_for_tenant AFTER INSERT OR UPDATE ON public.tenants_modules FOR EACH ROW EXECUTE PROCEDURE public.fn_create_event_alert_folder_for_tenant();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_event_alert_processors AFTER INSERT OR UPDATE ON public.tenant_event_alert_processors FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_event_alert_processors();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_event_alert_response_formatters AFTER INSERT OR UPDATE ON public.tenant_event_alert_response_formatters FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_event_alert_response_formatters();');
};

exports.down = async function(knex) {
	await knex.raw('DROP TRIGGER IF EXISTS trigger_delete_old_event_alert_response_formatters ON public.tenant_event_alert_response_formatters CASCADE');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_delete_old_event_alert_processors ON public.tenant_event_alert_processors CASCADE');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_create_event_alert_folder_for_tenant ON public.tenants_modules CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_event_alert_constituent_line ON public.tenant_plant_unit_lines CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_event_alert_constituent_machine ON public.tenant_plant_unit_machines CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_check_event_alert_constituent_is_valid ON public.tenant_event_alert_constituents CASCADE;');

	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_old_event_alert_response_formatters () CASCADE`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_old_event_alert_processors () CASCADE`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_create_event_alert_folder_for_tenant () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_event_alert_constituent_line () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_event_alert_constituent_machine () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_check_event_alert_constituent_is_valid () CASCADE;`);

	await knex.raw(`DROP TABLE IF EXISTS public.tenant_event_alerts_users CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_event_alert_response_formatters CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_event_alert_processors CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_event_alert_constituents CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_event_alerts CASCADE;`);

	await knex.raw(`DROP TYPE IF EXISTS public.tenant_event_alert_response_types CASCADE;`);
	await knex.raw(`DROP TYPE IF EXISTS public.tenant_event_alert_constituent_types CASCADE;`);
};
