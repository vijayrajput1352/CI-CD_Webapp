
exports.up = async function(knex) {
	await knex.schema.raw('ALTER TABLE public.tenant_plant_unit_machine_statistics ALTER COLUMN standard_speed TYPE double precision USING standard_speed::double precision');
};

exports.down = async function(knex) {
	await knex.schema.raw('ALTER TABLE public.tenant_plant_unit_machine_statistics ALTER COLUMN standard_speed TYPE integer USING standard_speed::integer');
};
