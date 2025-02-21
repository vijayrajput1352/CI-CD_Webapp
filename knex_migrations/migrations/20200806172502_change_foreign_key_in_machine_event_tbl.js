
exports.up = async function(knex) {
	await knex.schema.withSchema('public').table('tenant_plant_unit_machine_events', function(MachineEvent) {
		MachineEvent.dropForeign(['tenant_plant_unit_machine_id', 'tenant_id']);
		MachineEvent.foreign(['tenant_plant_unit_machine_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_machines').onDelete('CASCADE').onUpdate('CASCADE');

	});

};

exports.down = async function(knex) {
	await knex.schema.withSchema('public').table('tenant_plant_unit_machine_events', function(MachineEvent) {
		MachineEvent.dropForeign(['tenant_plant_unit_machine_id', 'tenant_id']);
		MachineEvent.foreign(['tenant_plant_unit_machine_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_machines').onDelete('RESTRICT').onUpdate('CASCADE');
	});
};
