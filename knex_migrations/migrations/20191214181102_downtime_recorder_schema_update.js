
exports.up = async function(knex) {
	await knex.schema.raw('ALTER TABLE public.tenant_plant_unit_machine_downtimes ALTER COLUMN type TYPE text USING type::text');
	await knex.schema.raw('ALTER TABLE public.tenant_plant_unit_line_downtimes ALTER COLUMN type TYPE text USING type::text');
	await knex.schema.raw('DROP TYPE IF EXISTS public.downtime_type CASCADE');
};

exports.down = async function(knex) {
	await knex.schema.raw("CREATE TYPE public.downtime_type AS ENUM ('downtime', 'no_data', 'disconnected')");
	await knex.schema.raw('ALTER TABLE public.tenant_plant_unit_line_downtimes ALTER COLUMN type TYPE public.downtime_type USING type::public.downtime_type');
	await knex.schema.raw('ALTER TABLE public.tenant_plant_unit_machine_downtimes ALTER COLUMN type TYPE public.downtime_type USING type::public.downtime_type');
};
