
exports.up = async function(knex) {
	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_set_machine_emd_references_null ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
BEGIN
	UPDATE tenant_plant_unit_machines SET operator_list_id = NULL WHERE operator_list_id = OLD.id;
	UPDATE tenant_plant_unit_machines SET downtime_list_id = NULL WHERE downtime_list_id = OLD.id;
	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_set_station_emd_references_null ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
BEGIN
	UPDATE tenant_plant_unit_stations SET operator_list_id = NULL WHERE operator_list_id = OLD.id;
	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_set_machine_emd_references_null BEFORE DELETE ON public.tenant_emd_configurations FOR EACH ROW EXECUTE PROCEDURE public.fn_set_machine_emd_references_null();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_set_station_emd_references_null BEFORE DELETE ON public.tenant_emd_configurations FOR EACH ROW EXECUTE PROCEDURE public.fn_set_station_emd_references_null();');
};

exports.down = async function(knex) {
	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_set_machine_emd_references_null ON public.tenant_emd_configurations CASCADE');
	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_set_station_emd_references_null ON public.tenant_emd_configurations CASCADE');

	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS fn_set_machine_emd_references_null CASCADE');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS fn_set_station_emd_references_null CASCADE');
};
