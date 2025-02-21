
exports.up = async function(knex) {
	await knex.schema.withSchema('public').table('tenant_plant_unit_line_downtimes', function(lineDowntimesTable) {
		lineDowntimesTable.jsonb('metadata').notNullable().defaultTo('{}');
		lineDowntimesTable.index('metadata', null, 'gin');
	});

	await knex.schema.withSchema('public').table('tenant_plant_unit_machine_downtimes', function(machineDowntimesTable) {
		machineDowntimesTable.jsonb('metadata').notNullable().defaultTo('{}');
		machineDowntimesTable.index('metadata', null, 'gin');
	});
};

exports.down = async function(knex) {
	await knex.schema.withSchema('public').table('tenant_plant_unit_machine_downtimes', function(machineDowntimesTable) {
		machineDowntimesTable.dropIndex('metadata');
		machineDowntimesTable.dropColumn('metadata');

	});

	await knex.schema.withSchema('public').table('tenant_plant_unit_line_downtimes', function(lineDowntimesTable) {
		lineDowntimesTable.dropIndex('metadata');
		lineDowntimesTable.dropColumn('metadata');
	});
};
