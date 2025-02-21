
exports.up = async function(knex) {
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
};

exports.down = async function(knex) {
	await knex.raw(`DROP TRIGGER IF EXISTS trigger_delete_zero_duration_line_idletimes ON public.tenant_plant_unit_line_idletimes CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_zero_duration_line_idletimes () CASCADE;`);

	await knex.raw(`DROP TRIGGER IF EXISTS trigger_delete_zero_duration_line_setuptimes ON public.tenant_plant_unit_line_setuptimes CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_zero_duration_line_setuptimes () CASCADE;`);

	await knex.raw(`DROP TRIGGER IF EXISTS trigger_delete_zero_duration_machine_idletimes ON public.tenant_plant_unit_machine_idletimes CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_zero_duration_machine_idletimes () CASCADE;`);

	await knex.raw(`DROP TRIGGER IF EXISTS trigger_delete_zero_duration_machine_setuptimes ON public.tenant_plant_unit_machine_setuptimes CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_zero_duration_machine_setuptimes () CASCADE;`);
};
