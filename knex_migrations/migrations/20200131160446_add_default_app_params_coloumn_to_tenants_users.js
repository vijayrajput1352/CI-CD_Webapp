
exports.up = async function(knex) {
	await knex.raw(`ALTER TABLE tenants_users ADD COLUMN IF NOT EXISTS default_application_parameters JSONB NOT NULL DEFAULT '{}'`);
};

exports.down = async function(knex) {
	await knex.raw(`ALTER TABLE tenants_users DROP COLUMN IF EXISTS default_application_parameters`);
};
