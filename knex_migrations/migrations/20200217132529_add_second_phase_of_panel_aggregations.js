exports.up = async function(knex) {
	await knex.schema.raw("CREATE TYPE public.tenant_panel_aggregation_period_choices AS ENUM ('fifteen_minutes', 'thirty_minutes', 'one_hour', 'four_hours', 'eight_hours', 'shift', 'day', 'week', 'fortnight', 'month', 'quarter', 'year')");
	await knex.schema.raw("CREATE TYPE public.tenant_panel_aggregation_type_choices AS ENUM ('mean', 'median', 'count', 'difference')");

	await knex.raw('ALTER TABLE tenant_panel_aggregates ALTER COLUMN evaluation_expression TYPE uuid USING evaluation_expression::uuid');

	await knex.raw(`ALTER TABLE tenant_panel_aggregates ADD COLUMN IF NOT EXISTS config JSONB NOT NULL DEFAULT '{}'`);
	await knex.raw(`ALTER TABLE tenant_panel_aggregates ADD COLUMN IF NOT EXISTS filters JSONB`);

	await knex.schema.withSchema('public').table('tenant_panel_aggregates', function(PanelAggregatesTbl) {
		PanelAggregatesTbl.foreign(['evaluation_expression']).references(['id']).inTable('tenant_attribute_set_properties').onDelete('CASCADE').onUpdate('CASCADE');
	});

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_data_point_mapping_from_panel_aggregates ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN

	UPDATE
		tenant_panel_aggregates
	SET
		evaluation_expression = NULL
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_panel_id = OLD.tenant_panel_id AND
		evaluation_expression in (SELECT id FROM tenant_attribute_set_properties WHERE attribute_set_id = OLD.tenant_attribute_set_id AND tenant_id = OLD.tenant_id);

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_fn_remove_data_point_mapping_from_panel_aggregates AFTER DELETE ON public.tenant_panels_attribute_sets FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_data_point_mapping_from_panel_aggregates();');
};

exports.down = async function(knex) {
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_data_point_mapping_from_panel_aggregates ON public.tenant_panels_attribute_sets CASCADE;');

	await knex.raw('DROP FUNCTION IF EXISTS public.fn_remove_data_point_mapping_from_panel_aggregates () CASCADE;');

	await knex.raw(`ALTER TABLE tenant_panel_aggregates DROP COLUMN IF EXISTS config`);

	await knex.raw('ALTER TABLE tenant_panel_aggregates DROP COLUMN IF EXISTS evaluation_expression');

	await knex.raw(`DROP TYPE IF EXISTS public.tenant_panel_aggregation_period_choices CASCADE;`);
	await knex.raw(`DROP TYPE IF EXISTS public.tenant_panel_aggregation_type_choices CASCADE;`);
};
