exports.up = async function(knex) {
	await knex.raw('ALTER TABLE tenant_historical_dashboard_aggregates ALTER COLUMN evaluation_expression TYPE uuid USING evaluation_expression::uuid');

	await knex.raw(`ALTER TABLE tenant_historical_dashboard_aggregates ADD COLUMN IF NOT EXISTS config JSONB NOT NULL DEFAULT '{}'`);
	await knex.raw(`ALTER TABLE tenant_historical_dashboard_aggregates ADD COLUMN IF NOT EXISTS filters JSONB`);

	await knex.schema.withSchema('public').table('tenant_historical_dashboard_aggregates', function(HistoricalDashboardAggregatesTbl) {
		HistoricalDashboardAggregatesTbl.foreign(['evaluation_expression']).references(['id']).inTable('tenant_attribute_set_properties').onDelete('CASCADE').onUpdate('CASCADE');
	});

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_data_point_mapping_from_historical_dashboard_aggregates ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN

	UPDATE
		tenant_historical_dashboard_aggregates
	SET
		evaluation_expression = NULL
	WHERE
		tenant_id = OLD.tenant_id AND
		tenant_historical_dashboard_id = OLD.tenant_historical_dashboard_id AND
		evaluation_expression in (SELECT id FROM tenant_attribute_set_properties WHERE attribute_set_id = OLD.tenant_attribute_set_id AND tenant_id = OLD.tenant_id);

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_fn_remove_data_point_mapping_from_historical_dashboard_aggregates AFTER DELETE ON public.tenant_historical_dashboards_attribute_sets FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_data_point_mapping_from_historical_dashboard_aggregates();');
};

exports.down = async function(knex) {
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_data_point_mapping_from_historical_dashboard_aggregates ON public.tenant_historical_dashboards_attribute_sets CASCADE;');

	await knex.raw('DROP FUNCTION IF EXISTS public.fn_remove_data_point_mapping_from_historical_dashboard_aggregates () CASCADE;');

	await knex.raw(`ALTER TABLE tenant_historical_dashboard_aggregates DROP COLUMN IF EXISTS config`);

	await knex.raw('ALTER TABLE tenant_historical_dashboard_aggregates DROP COLUMN IF EXISTS evaluation_expression');
};
