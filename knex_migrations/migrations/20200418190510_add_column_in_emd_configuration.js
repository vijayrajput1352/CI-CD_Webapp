
exports.up = async function(knex) {
	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_emd_configurations', 'operation_metadata');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_emd_configurations', function(EmdConfigTbl) {
			EmdConfigTbl.text('operation_metadata').defaultTo('Merge');
		});
};

exports.down = async function(knex) {
	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_emd_configurations', 'operation_metadata');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_emd_configurations', function(EmdConfigTbl) {
			EmdConfigTbl.dropColumn('operation_metadata');
		});

};
