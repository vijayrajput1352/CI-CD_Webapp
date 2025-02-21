
exports.up = async function(knex) {
	// Drop Triggers
	await knex.raw(`DROP TRIGGER IF EXISTS trigger_delete_zero_duration_machine_downtimes ON public.tenant_plant_unit_machine_downtimes CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_zero_duration_machine_downtimes () CASCADE;`);

	await knex.raw(`DROP TRIGGER IF EXISTS trigger_delete_zero_duration_machine_setuptimes ON public.tenant_plant_unit_machine_setuptimes CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_zero_duration_machine_setuptimes () CASCADE;`);

	await knex.raw(`DROP TRIGGER IF EXISTS trigger_delete_zero_duration_machine_idletimes ON public.tenant_plant_unit_machine_idletimes CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_zero_duration_machine_idletimes () CASCADE;`);

	await knex.raw(`DROP TRIGGER IF EXISTS trigger_delete_zero_duration_line_downtimes ON public.tenant_plant_unit_line_downtimes CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_zero_duration_line_downtimes () CASCADE;`);

	await knex.raw(`DROP TRIGGER IF EXISTS trigger_delete_zero_duration_line_setuptimes ON public.tenant_plant_unit_line_setuptimes CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_zero_duration_line_setuptimes () CASCADE;`);

	await knex.raw(`DROP TRIGGER IF EXISTS trigger_delete_zero_duration_line_idletimes ON public.tenant_plant_unit_line_idletimes CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_zero_duration_line_idletimes () CASCADE;`);

	// Add Data Period Columns
	let columnExists = false;
	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machines', 'data_period');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machines', function(machineTbl) {
			machineTbl.integer('data_period').notNull().defaultTo(60);
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_lines', 'data_period');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_lines', function(lineTbl) {
			lineTbl.integer('data_period').notNull().defaultTo(60);
		});


	// Add New Triggers

	// Machine Downtime Table
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_zero_duration_machine_downtimes ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			IF NEW.end_time IS NULL
			THEN
				RETURN NULL;
			END IF;

			IF AGE(NEW.end_time, NEW.start_time) < (SELECT concat(data_period, ' seconds')::interval FROM tenant_plant_unit_machines WHERE id = NEW.tenant_plant_unit_machine_id)
			THEN
				DELETE FROM tenant_plant_unit_machine_downtimes WHERE id = NEW.id;
				RETURN NULL;
			END IF;

			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_zero_duration_machine_downtimes AFTER INSERT OR UPDATE ON public.tenant_plant_unit_machine_downtimes FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_zero_duration_machine_downtimes();');

	// Machine Setup Table
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_zero_duration_machine_setuptimes ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			IF NEW.end_time IS NULL
			THEN
				RETURN NULL;
			END IF;

			IF AGE(NEW.end_time, NEW.start_time) < (SELECT concat(data_period, ' seconds')::interval FROM tenant_plant_unit_machines WHERE id = NEW.tenant_plant_unit_machine_id)
			THEN
				DELETE FROM tenant_plant_unit_machine_setuptimes WHERE id = NEW.id;
				RETURN NULL;
			END IF;

			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_zero_duration_machine_setuptimes AFTER INSERT OR UPDATE ON public.tenant_plant_unit_machine_setuptimes FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_zero_duration_machine_setuptimes();');

	// Machine Idle Time Table
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_zero_duration_machine_idletimes ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			IF NEW.end_time IS NULL
			THEN
				RETURN NULL;
			END IF;

			IF AGE(NEW.end_time, NEW.start_time) < (SELECT concat(data_period, ' seconds')::interval FROM tenant_plant_unit_machines WHERE id = NEW.tenant_plant_unit_machine_id)
			THEN
				DELETE FROM tenant_plant_unit_machine_idletimes WHERE id = NEW.id;
				RETURN NULL;
			END IF;

			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_zero_duration_machine_idletimes AFTER INSERT OR UPDATE ON public.tenant_plant_unit_machine_idletimes FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_zero_duration_machine_idletimes();');

	// Line Down Time Table
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_zero_duration_line_downtimes ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			IF NEW.end_time IS NULL
			THEN
				RETURN NULL;
			END IF;

			IF AGE(NEW.end_time, NEW.start_time) < (SELECT concat(data_period, ' seconds')::interval FROM tenant_plant_unit_lines WHERE id = NEW.tenant_plant_unit_line_id)
			THEN
				DELETE FROM tenant_plant_unit_line_downtimes WHERE id = NEW.id;
				RETURN NULL;
			END IF;

			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_zero_duration_line_downtimes AFTER INSERT OR UPDATE ON public.tenant_plant_unit_line_downtimes FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_zero_duration_line_downtimes();');

	// Line Setup Time Table
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_zero_duration_line_setuptimes ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			IF NEW.end_time IS NULL
			THEN
				RETURN NULL;
			END IF;

			IF AGE(NEW.end_time, NEW.start_time) < (SELECT concat(data_period, ' seconds')::interval FROM tenant_plant_unit_lines WHERE id = NEW.tenant_plant_unit_line_id)
			THEN
				DELETE FROM tenant_plant_unit_line_setuptimes WHERE id = NEW.id;
				RETURN NULL;
			END IF;

			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_zero_duration_line_setuptimes AFTER INSERT OR UPDATE ON public.tenant_plant_unit_line_setuptimes FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_zero_duration_line_setuptimes();');

	// Line Idle Time Table
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_zero_duration_line_idletimes ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			IF NEW.end_time IS NULL
			THEN
				RETURN NULL;
			END IF;

			IF AGE(NEW.end_time, NEW.start_time) < (SELECT concat(data_period, ' seconds')::interval FROM tenant_plant_unit_lines WHERE id = NEW.tenant_plant_unit_line_id)
			THEN
				DELETE FROM tenant_plant_unit_line_idletimes WHERE id = NEW.id;
				RETURN NULL;
			END IF;

			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_zero_duration_line_idletimes AFTER INSERT OR UPDATE ON public.tenant_plant_unit_line_idletimes FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_zero_duration_line_idletimes();');

};

exports.down = async function(knex) {
	// Drop Triggers
	await knex.raw(`DROP TRIGGER IF EXISTS trigger_delete_zero_duration_line_idletimes ON public.tenant_plant_unit_line_idletimes CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_zero_duration_line_idletimes () CASCADE;`);

	await knex.raw(`DROP TRIGGER IF EXISTS trigger_delete_zero_duration_line_setuptimes ON public.tenant_plant_unit_line_setuptimes CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_zero_duration_line_setuptimes () CASCADE;`);

	await knex.raw(`DROP TRIGGER IF EXISTS trigger_delete_zero_duration_line_downtimes ON public.tenant_plant_unit_line_downtimes CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_zero_duration_line_downtimes () CASCADE;`);

	await knex.raw(`DROP TRIGGER IF EXISTS trigger_delete_zero_duration_machine_idletimes ON public.tenant_plant_unit_machine_idletimes CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_zero_duration_machine_idletimes () CASCADE;`);

	await knex.raw(`DROP TRIGGER IF EXISTS trigger_delete_zero_duration_machine_setuptimes ON public.tenant_plant_unit_machine_setuptimes CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_zero_duration_machine_setuptimes () CASCADE;`);

	await knex.raw(`DROP TRIGGER IF EXISTS trigger_delete_zero_duration_machine_downtimes ON public.tenant_plant_unit_machine_downtimes CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_zero_duration_machine_downtimes () CASCADE;`);

	// Drop Data Period Columns
	let columnExists = false;
	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machines', 'data_period');
	if(columnExists)
		await knex.raw(`ALTER TABLE public.tenant_plant_unit_machines DROP COLUMN data_period;`);

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_lines', 'data_period');
	if(columnExists)
		await knex.raw(`ALTER TABLE public.tenant_plant_unit_lines DROP COLUMN data_period;`);


	// Line Idle Time Table
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_zero_duration_line_idletimes ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			IF NEW.end_time IS NULL
			THEN
				RETURN NULL;
			END IF;

			IF AGE(NEW.end_time, NEW.start_time) < interval '120 S'
			THEN
				DELETE FROM tenant_plant_unit_line_idletimes WHERE id = NEW.id;
				RETURN NULL;
			END IF;

			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_zero_duration_line_idletimes AFTER INSERT OR UPDATE ON public.tenant_plant_unit_line_idletimes FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_zero_duration_line_idletimes();');

	// Line Setup Time Table
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_zero_duration_line_setuptimes ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			IF NEW.end_time IS NULL
			THEN
				RETURN NULL;
			END IF;

			IF AGE(NEW.end_time, NEW.start_time) < interval '120 S'
			THEN
				DELETE FROM tenant_plant_unit_line_setuptimes WHERE id = NEW.id;
				RETURN NULL;
			END IF;

			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_zero_duration_line_setuptimes AFTER INSERT OR UPDATE ON public.tenant_plant_unit_line_setuptimes FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_zero_duration_line_setuptimes();');

	// Line Down Time Table
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_zero_duration_line_downtimes ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			IF NEW.end_time IS NULL
			THEN
				RETURN NULL;
			END IF;

			IF AGE(NEW.end_time, NEW.start_time) < interval '120 S'
			THEN
				DELETE FROM tenant_plant_unit_line_downtimes WHERE id = NEW.id;
				RETURN NULL;
			END IF;

			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_zero_duration_line_downtimes AFTER INSERT OR UPDATE ON public.tenant_plant_unit_line_downtimes FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_zero_duration_line_downtimes();');

	// Machine Idle Time Table
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_zero_duration_machine_idletimes ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			IF NEW.end_time IS NULL
			THEN
				RETURN NULL;
			END IF;

			IF AGE(NEW.end_time, NEW.start_time) < interval '120 S'
			THEN
				DELETE FROM tenant_plant_unit_machine_idletimes WHERE id = NEW.id;
				RETURN NULL;
			END IF;

			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_zero_duration_machine_idletimes AFTER INSERT OR UPDATE ON public.tenant_plant_unit_machine_idletimes FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_zero_duration_machine_idletimes();');

	// Machine Setup Table
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_zero_duration_machine_setuptimes ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			IF NEW.end_time IS NULL
			THEN
				RETURN NULL;
			END IF;

			IF AGE(NEW.end_time, NEW.start_time) < interval '120 S'
			THEN
				DELETE FROM tenant_plant_unit_machine_setuptimes WHERE id = NEW.id;
				RETURN NULL;
			END IF;

			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_zero_duration_machine_setuptimes AFTER INSERT OR UPDATE ON public.tenant_plant_unit_machine_setuptimes FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_zero_duration_machine_setuptimes();');

	// Machine Downtime Table
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_zero_duration_machine_downtimes ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			IF NEW.end_time IS NULL
			THEN
				RETURN NULL;
			END IF;

			IF AGE(NEW.end_time, NEW.start_time) < interval '120 S'
			THEN
				DELETE FROM tenant_plant_unit_machine_downtimes WHERE id = NEW.id;
				RETURN NULL;
			END IF;

			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_zero_duration_machine_downtimes AFTER INSERT OR UPDATE ON public.tenant_plant_unit_machine_downtimes FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_zero_duration_machine_downtimes();');
};
