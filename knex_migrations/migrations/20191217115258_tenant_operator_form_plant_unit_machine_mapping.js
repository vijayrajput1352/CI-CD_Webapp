/**
 * This sets up the schema for the tenant panel -> tenant user mapping
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;
	exists = await knex.schema.withSchema('public').hasTable('tenant_operator_forms_plant_unit_machines');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_operator_forms_plant_unit_machines', function(operatorFormsMachinesTbl) {
			operatorFormsMachinesTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			operatorFormsMachinesTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			operatorFormsMachinesTbl.uuid('tenant_operator_form_id').notNullable();
			operatorFormsMachinesTbl.uuid('tenant_plant_unit_machine_id').notNullable();

			operatorFormsMachinesTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			operatorFormsMachinesTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			operatorFormsMachinesTbl.unique(['id', 'tenant_id']);
			operatorFormsMachinesTbl.unique(['tenant_operator_form_id', 'tenant_plant_unit_machine_id']);

			// operatorFormsMachinesTbl.foreign(['tenant_operator_form_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_operator_forms').onDelete('CASCADE').onUpdate('CASCADE');
			// operatorFormsMachinesTbl.foreign(['tenant_plant_unit_machine_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_machines').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE public.tenant_operator_forms_plant_unit_machines
			ADD CONSTRAINT fk_tenant_oper_forms_machines_oper_forms
			FOREIGN KEY (
				tenant_operator_form_id,
				tenant_id
			)
			REFERENCES tenant_operator_forms (
				id,
				tenant_id
			)
			ON UPDATE CASCADE
			ON DELETE CASCADE`
		);

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE public.tenant_operator_forms_plant_unit_machines
			ADD CONSTRAINT fk_tenant_oper_forms_plant_unit_machines
			FOREIGN KEY (
				tenant_plant_unit_machine_id,
				tenant_id
			)
			REFERENCES tenant_plant_unit_machines (
				id,
				tenant_id
			)
			ON UPDATE CASCADE
			ON DELETE CASCADE`
		);
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_operator_forms_plant_unit_machines CASCADE;`);
};
