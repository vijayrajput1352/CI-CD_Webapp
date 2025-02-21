exports.up = async function(knex) {
	await knex.raw(`ALTER TABLE tenant_emd_data ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP WITH TIME ZONE `);
};

exports.down = async function(knex) {
	await knex.raw(`ALTER TABLE tenant_emd_data DROP COLUMN IF EXISTS rejected_at`);
};