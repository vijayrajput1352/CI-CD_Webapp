exports.up = async function(knex) {
	let columnExists = false;
	columnExists = await knex.schema.withSchema('public').hasColumn('tenants', 'settings');
	if(!columnExists)
		columnExists = await knex.schema.withSchema('public').table('tenants', function(tenantsTbl) {
			tenantsTbl.jsonb('settings').notNullable().defaultTo('{}');
		});
};

exports.down = async function(knex) {
	let columnExists = false;
	columnExists = await knex.schema.withSchema('public').hasColumn('tenants', 'settings');
	if(columnExists)
		columnExists = await knex.schema.withSchema('public').table('tenants', function(tenantsTbl) {
			tenantsTbl.dropColumn('settings');
		});
};
