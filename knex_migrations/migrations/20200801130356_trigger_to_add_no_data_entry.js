
exports.up = async function(knex) {
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_create_machine_no_data_entry ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			INSERT INTO tenant_plant_unit_machine_downtimes (tenant_id, tenant_plant_unit_machine_id, start_time, end_time, type, work_order_id) VALUES (NEW.tenant_id, NEW.id, NEW.created_at, NULL, 'no_data', NULL);
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_create_machine_no_data_entry AFTER INSERT ON public.tenant_plant_unit_machines FOR EACH ROW EXECUTE PROCEDURE public.fn_create_machine_no_data_entry();');

	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_create_line_no_data_entry ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			INSERT INTO tenant_plant_unit_line_downtimes (tenant_id, tenant_plant_unit_line_id, start_time, end_time, type, work_order_id) VALUES (NEW.tenant_id, NEW.id, NEW.created_at, NULL, 'no_data', NULL);
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_create_line_no_data_entry AFTER INSERT ON public.tenant_plant_unit_lines FOR EACH ROW EXECUTE PROCEDURE public.fn_create_line_no_data_entry();');
};

exports.down = async function(knex) {
	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_create_line_no_data_entry ON public.tenant_plant_unit_lines CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_create_line_no_data_entry () CASCADE;')

	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_create_machine_no_data_entry ON public.tenant_plant_unit_machines CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_create_machine_no_data_entry () CASCADE;')
};
