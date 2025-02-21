/**
 * This sets up the schema for the Line feature
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;

	/* Step 0: Basics - enums, master tables, etc. */
	await knex.schema.raw("CREATE TYPE public.tenant_plant_unit_line_constituent_types AS ENUM ('machine', 'line', 'block_any', 'block_some')");
	await knex.schema.raw("CREATE TYPE public.tenant_plant_unit_line_constituent_entity_types AS ENUM ('machine', 'line')");

	/* Step 1: create line entities tables */
	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_lines');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_lines', function(PlantLinesTbl) {
			PlantLinesTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PlantLinesTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			PlantLinesTbl.uuid('tenant_plant_unit_id').notNullable();

			PlantLinesTbl.text('name').notNullable();
			PlantLinesTbl.text('tags');
			PlantLinesTbl.text('description');
			PlantLinesTbl.integer('data_period').notNull().defaultTo(60);
			PlantLinesTbl.integer('data_persistence_period').notNullable().defaultTo(1);
			PlantLinesTbl.jsonb('attribute_set_metadata').notNullable().defaultTo('[]');

			PlantLinesTbl.uuid('supervisor_list_id');
			PlantLinesTbl.jsonb('supervisor_list_filters').notNullable().defaultTo('[]')

			PlantLinesTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PlantLinesTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PlantLinesTbl.unique(['id', 'tenant_id']);
			PlantLinesTbl.unique(['tenant_plant_unit_id', 'name']);

			PlantLinesTbl.foreign(['tenant_plant_unit_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_units').onDelete('CASCADE').onUpdate('CASCADE');
			PlantLinesTbl.foreign(['supervisor_list_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_emd_configurations').onDelete('SET NULL').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_lines_attribute_sets');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_lines_attribute_sets', function(LineAttributeSetTbl) {
			LineAttributeSetTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			LineAttributeSetTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			LineAttributeSetTbl.uuid('tenant_plant_unit_line_id').notNullable();
			LineAttributeSetTbl.uuid('tenant_attribute_set_id').notNullable();
			LineAttributeSetTbl.integer('evaluation_order').notNullable().defaultTo(1);

			LineAttributeSetTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			LineAttributeSetTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			LineAttributeSetTbl.unique(['id', 'tenant_id']);

			LineAttributeSetTbl.foreign(['tenant_plant_unit_line_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_lines').onDelete('CASCADE').onUpdate('CASCADE');
			LineAttributeSetTbl.foreign(['tenant_attribute_set_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_attribute_sets').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_plant_unit_line_attr_set ON public.tenant_plant_unit_lines_attribute_sets
			USING btree
			(
				tenant_plant_unit_line_id ASC,
				tenant_attribute_set_id ASC
			)`
		);
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_line_constituents');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_line_constituents', function(PlantUnitLineConstituentsTbl) {
			PlantUnitLineConstituentsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PlantUnitLineConstituentsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			PlantUnitLineConstituentsTbl.uuid('tenant_plant_unit_line_id').notNullable();
			PlantUnitLineConstituentsTbl.integer('step').notNullable();

			PlantUnitLineConstituentsTbl.uuid('tenant_plant_unit_line_constituent_id').notNullable();
			PlantUnitLineConstituentsTbl.specificType('constituent_type', 'public.tenant_plant_unit_line_constituent_types').notNullable().defaultTo('machine');
			PlantUnitLineConstituentsTbl.jsonb('metadata').notNullable().defaultTo('{}');

			PlantUnitLineConstituentsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PlantUnitLineConstituentsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PlantUnitLineConstituentsTbl.unique(['id', 'tenant_id']);
			PlantUnitLineConstituentsTbl.foreign(['tenant_plant_unit_line_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_lines').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_plant_unit_line_and_constituent ON public.tenant_plant_unit_line_constituents
			USING btree
			(
				tenant_plant_unit_line_id ASC,
				tenant_plant_unit_line_constituent_id ASC
			)`
		);

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_plant_unit_line_step ON public.tenant_plant_unit_line_constituents
			USING btree
			(
				tenant_plant_unit_line_id ASC,
				step ASC
			)`
		);
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_line_constituent_block_entities');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_line_constituent_block_entities', function(PlantUnitLineConstituentBlockTbl) {
			PlantUnitLineConstituentBlockTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PlantUnitLineConstituentBlockTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			PlantUnitLineConstituentBlockTbl.uuid('block_id').notNullable();
			PlantUnitLineConstituentBlockTbl.uuid('entity_id').notNullable();
			PlantUnitLineConstituentBlockTbl.specificType('entity_type', 'public.tenant_plant_unit_line_constituent_entity_types').notNullable().defaultTo('machine');
			PlantUnitLineConstituentBlockTbl.boolean('is_active').notNullable().defaultTo(true);

			PlantUnitLineConstituentBlockTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PlantUnitLineConstituentBlockTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PlantUnitLineConstituentBlockTbl.unique(['id', 'tenant_id']);
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_plant_unit_line_constituent_block_entity ON public.tenant_plant_unit_line_constituent_block_entities
			USING btree
			(
				block_id ASC,
				entity_id ASC
			)`
		);
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_line_processors');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_line_processors', function(LineProcessorTbl) {
			LineProcessorTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			LineProcessorTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			LineProcessorTbl.uuid('tenant_plant_unit_line_id').notNullable();

			LineProcessorTbl.text('processed_data_transform_code');
			LineProcessorTbl.text('pre_realtime_push_transform_code');

			LineProcessorTbl.text('availability_calculation_code');
			LineProcessorTbl.text('performance_calculation_code');
			LineProcessorTbl.text('quality_calculation_code');

			LineProcessorTbl.boolean('is_custom_oee_calculation').notNullable().defaultTo(false);
			LineProcessorTbl.text('custom_oee_calculation_code');

			LineProcessorTbl.text('processor');
			LineProcessorTbl.boolean('publish_status').notNullable().defaultTo(false);

			LineProcessorTbl.timestamp('effectivity_start');
			LineProcessorTbl.timestamp('effectivity_end');

			LineProcessorTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			LineProcessorTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			LineProcessorTbl.unique(['id', 'tenant_id']);
			LineProcessorTbl.foreign(['tenant_plant_unit_line_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_lines').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_line_templates');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_line_templates', function(LineTemplateTbl) {
			LineTemplateTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			LineTemplateTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			LineTemplateTbl.uuid('tenant_plant_unit_line_id').notNullable();

			LineTemplateTbl.boolean('publish_status').notNullable().defaultTo(false);

			LineTemplateTbl.timestamp('effectivity_start');
			LineTemplateTbl.timestamp('effectivity_end');

			LineTemplateTbl.text('component_state').notNullable().defaultTo('{}');
			LineTemplateTbl.text('component_before_render_code');
			LineTemplateTbl.text('component_after_render_code');
			LineTemplateTbl.text('component_on_data_code');
			LineTemplateTbl.text('component_before_destroy_code');
			LineTemplateTbl.text('template');
			LineTemplateTbl.jsonb('component_observers').notNullable().defaultTo('[]');
			LineTemplateTbl.jsonb('component_tasks').notNullable().defaultTo('[]');

			LineTemplateTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			LineTemplateTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			LineTemplateTbl.unique(['id', 'tenant_id']);
			LineTemplateTbl.foreign(['tenant_plant_unit_line_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_lines').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_stations_observed_lines');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_stations_observed_lines', function(PlantUnitStationObservedLinesTbl) {
			PlantUnitStationObservedLinesTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			PlantUnitStationObservedLinesTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			PlantUnitStationObservedLinesTbl.uuid('tenant_plant_unit_station_id').notNullable();
			PlantUnitStationObservedLinesTbl.uuid('tenant_plant_unit_line_id').notNullable();
			PlantUnitStationObservedLinesTbl.boolean('work_order_operations_enabled').notNullable().defaultTo(false);

			PlantUnitStationObservedLinesTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			PlantUnitStationObservedLinesTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			PlantUnitStationObservedLinesTbl.unique(['id', 'tenant_id']);
			PlantUnitStationObservedLinesTbl.unique(['tenant_plant_unit_station_id', 'tenant_plant_unit_line_id']);
		});

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE
				public.tenant_plant_unit_stations_observed_lines
			ADD CONSTRAINT
				fk_stations_observed_lines_stations
			FOREIGN KEY (
				tenant_plant_unit_station_id,
				tenant_id
			)
			REFERENCES
				public.tenant_plant_unit_stations (
					id,
					tenant_id
				)
			ON UPDATE CASCADE
			ON DELETE CASCADE;
			`
		);

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE
				public.tenant_plant_unit_stations_observed_lines
			ADD CONSTRAINT
				fk_stations_observed_lines_lines
			FOREIGN KEY (
				tenant_plant_unit_line_id,
				tenant_id
			)
			REFERENCES
				public.tenant_plant_unit_lines (
					id,
					tenant_id
				)
			ON UPDATE CASCADE
			ON DELETE CASCADE;
			`
		);
	}

	/* Step 2: Functions, business rules enforced using triggers, etc. */
	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_check_line_constituent_is_valid ()
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
		IF (OLD.constituent_type = NEW.constituent_type) AND (OLD.tenant_plant_unit_line_constituent_id = NEW.tenant_plant_unit_line_constituent_id)
		THEN
			RETURN NEW;
		END IF;
	END IF;

	IF NEW.constituent_type = 'machine'
	THEN
		is_valid_entity := 0;

		SELECT
			COUNT(id)
		FROM
			tenant_plant_unit_machines
		WHERE
			id = NEW.tenant_plant_unit_line_constituent_id AND
			tenant_id = NEW.tenant_id
		INTO
			is_valid_entity;

		IF is_valid_entity = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Invalid line Constituent Machine';
			RETURN NULL;
		END IF;
	END IF;

	IF NEW.constituent_type = 'line'
	THEN
		is_valid_entity := 0;

		SELECT
			COUNT(id)
		FROM
			tenant_plant_unit_lines
		WHERE
			id = NEW.tenant_plant_unit_line_constituent_id AND
			tenant_id = NEW.tenant_id
		INTO
			is_valid_entity;

		IF is_valid_entity = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Invalid line Constituent Sub-line';
			RETURN NULL;
		END IF;
	END IF;

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_check_line_constituent_block_entity_is_valid ()
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
		IF (OLD.entity_type = NEW.entity_type) AND (OLD.entity_id = NEW.entity_id)
		THEN
			RETURN NEW;
		END IF;
	END IF;

	IF NEW.entity_type = 'machine'
	THEN
		is_valid_entity := 0;

		SELECT
			COUNT(id)
		FROM
			tenant_plant_unit_machines
		WHERE
			id = NEW.entity_id AND
			tenant_id = NEW.tenant_id
		INTO
			is_valid_entity;

		IF is_valid_entity = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Invalid line Constituent Block Entity Machine';
			RETURN NULL;
		END IF;
	END IF;

	IF NEW.entity_type = 'line'
	THEN
		is_valid_entity := 0;

		SELECT
			COUNT(id)
		FROM
			tenant_plant_unit_lines
		WHERE
			id = NEW.entity_id AND
			tenant_id = NEW.tenant_id
		INTO
			is_valid_entity;

		IF is_valid_entity = 0
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Invalid line Constituent Block Entity Sub-line';
			RETURN NULL;
		END IF;
	END IF;

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_line_constituent_machine ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_plant_unit_line_constituents
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_plant_unit_line_constituent_id = OLD.id AND
		constituent_type = 'machine';

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_line_constituent_line ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_plant_unit_line_constituents
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_plant_unit_line_constituent_id = OLD.id AND
		constituent_type = 'line';

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_line_constituent_block_entity_machine ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_plant_unit_line_constituent_block_entities
	WHERE
		tenant_id = OLD.tenant_id AND
		entity_id = OLD.id AND
		entity_type = 'machine';

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_line_constituent_block_entity_line ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_plant_unit_line_constituent_block_entities
	WHERE
		tenant_id = OLD.tenant_id AND
		entity_id = OLD.id AND
		entity_type = 'line';

	RETURN OLD;
END;
$$;`
	);

	/* Finally, hook up the triggers */
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_line_constituent_is_valid BEFORE INSERT OR UPDATE ON public.tenant_plant_unit_line_constituents FOR EACH ROW EXECUTE PROCEDURE public.fn_check_line_constituent_is_valid();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_line_constituent_block_entity_is_valid BEFORE INSERT OR UPDATE ON public.tenant_plant_unit_line_constituent_block_entities FOR EACH ROW EXECUTE PROCEDURE public.fn_check_line_constituent_block_entity_is_valid();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_line_constituent_machine AFTER DELETE ON public.tenant_plant_unit_machines FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_line_constituent_machine();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_line_constituent_line AFTER DELETE ON public.tenant_plant_unit_lines FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_line_constituent_line();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_line_constituent_block_entity_machine AFTER DELETE ON public.tenant_plant_unit_machines FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_line_constituent_block_entity_machine();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_line_constituent_block_entity_line AFTER DELETE ON public.tenant_plant_unit_lines FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_line_constituent_block_entity_line();');
};

exports.down = async function(knex) {
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_line_constituent_block_entity_line ON public.tenant_plant_unit_lines CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_line_constituent_block_entity_machine ON public.tenant_plant_unit_machines CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_line_constituent_line ON public.tenant_plant_unit_lines CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_line_constituent_machine ON public.tenant_plant_unit_machines CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_check_line_constituent_block_entity_is_valid ON public.tenant_plant_unit_line_constituent_block_entities CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_check_line_constituent_is_valid ON public.tenant_plant_unit_line_constituents CASCADE;');

	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_line_constituent_block_entity_line () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_line_constituent_block_entity_machine () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_line_constituent_line () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_line_constituent_machine () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_check_line_constituent_block_entity_is_valid () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_check_line_constituent_is_valid () CASCADE;`);

	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_stations_observed_lines CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_line_templates CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_line_processors CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_line_constituent_block_entities CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_line_constituents CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_lines_attribute_sets CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_lines CASCADE;`);

	await knex.raw(`DROP TYPE IF EXISTS public.tenant_plant_unit_line_constituent_entity_types CASCADE;`);
	await knex.raw(`DROP TYPE IF EXISTS public.tenant_plant_unit_line_constituent_types CASCADE;`);
};
