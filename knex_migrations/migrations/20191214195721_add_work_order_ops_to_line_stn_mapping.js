
exports.up = async function(knex) {
	await knex.raw(`ALTER TABLE tenant_plant_unit_stations_observed_lines ADD COLUMN IF NOT EXISTS work_order_operations_enabled BOOLEAN NOT NULL DEFAULT FALSE`);
};

exports.down = async function(knex) {
	await knex.raw(`ALTER TABLE tenant_plant_unit_stations_observed_lines DROP COLUMN IF EXISTS work_order_operations_enabled`);
};
