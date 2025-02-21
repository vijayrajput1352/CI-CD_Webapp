exports.up = async function(knex) {
	await knex.raw('ALTER TABLE tenant_plant_unit_machine_aggregates ALTER COLUMN evaluation_expression TYPE uuid USING evaluation_expression::uuid');

	await knex.raw(`ALTER TABLE tenant_plant_unit_machine_aggregates ADD COLUMN IF NOT EXISTS config JSONB NOT NULL DEFAULT '{}'`);
	await knex.raw(`ALTER TABLE tenant_plant_unit_machine_aggregates ADD COLUMN IF NOT EXISTS filters JSONB`);

	await knex.schema.withSchema('public').table('tenant_plant_unit_machine_aggregates', function(plantUnitMachineAggregatesTbl) {
		plantUnitMachineAggregatesTbl.foreign(['evaluation_expression']).references(['id']).inTable('tenant_attribute_set_properties').onDelete('CASCADE').onUpdate('CASCADE');
	});

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_data_point_mapping_from_machine_aggregates ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN

	UPDATE
		tenant_plant_unit_machine_aggregates
	SET
		evaluation_expression = NULL
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_plant_unit_machine_id = OLD.tenant_plant_unit_machine_id AND
		evaluation_expression in (SELECT id FROM tenant_attribute_set_properties WHERE attribute_set_id = OLD.tenant_attribute_set_id AND tenant_id = OLD.tenant_id);

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_fn_remove_data_point_mapping_from_machine_aggregates AFTER DELETE ON public.tenant_plant_unit_machines_attribute_sets FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_data_point_mapping_from_machine_aggregates();');
};

exports.down = async function(knex) {
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_data_point_mapping_from_machine_aggregates ON public.tenant_plant_unit_machines_attribute_sets CASCADE;');

	await knex.raw('DROP FUNCTION IF EXISTS public.fn_remove_data_point_mapping_from_machine_aggregates () CASCADE;');

	await knex.raw(`ALTER TABLE tenant_plant_unit_machine_aggregates DROP COLUMN IF EXISTS config`);

	await knex.raw('ALTER TABLE tenant_plant_unit_machine_aggregates DROP COLUMN IF EXISTS evaluation_expression');
};
