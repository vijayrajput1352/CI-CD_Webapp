
exports.up = async function(knex) {
	const exists = await knex.schema.withSchema('public').hasTable('tenant_emd_data');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_emd_data', function(EmdDataTbl) {
			EmdDataTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			EmdDataTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			EmdDataTbl.uuid('tenant_emd_configuration_id').notNullable();

			EmdDataTbl.text('masterdata_id').notNullable();

			EmdDataTbl.jsonb('values').notNullable();
			EmdDataTbl.jsonb('data_types').notNullable();
			EmdDataTbl.boolean('active').notNullable().defaultTo(true);

			EmdDataTbl.timestamp('inserted_at').notNullable();
			EmdDataTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

			EmdDataTbl.foreign(['tenant_emd_configuration_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_emd_configurations').onDelete('CASCADE').onUpdate('CASCADE');

			EmdDataTbl.index('values', null, 'gin');
		});
	}
};

exports.down = async function(knex) {
	await knex.raw('DROP TABLE IF EXISTS public.tenant_emd_data CASCADE');
};
