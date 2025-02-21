/**
 * This sets up the schema for the tenant machine downtime reasons capture
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;
	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_machine_downtime_reasons');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_machine_downtime_reasons', function(machineDowntimeReasonsTbl) {
			machineDowntimeReasonsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			machineDowntimeReasonsTbl.uuid('tenant_id').notNullable();
			machineDowntimeReasonsTbl.uuid('tenant_plant_unit_machine_downtime_id');

			machineDowntimeReasonsTbl.text('reason_code');
			machineDowntimeReasonsTbl.text('reason_description');
			machineDowntimeReasonsTbl.integer('reason_duration_in_min');

			machineDowntimeReasonsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			machineDowntimeReasonsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			machineDowntimeReasonsTbl.unique(['id', 'tenant_id']);
			machineDowntimeReasonsTbl.unique(['tenant_plant_unit_machine_downtime_id', 'reason_code']);
		});

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE public.tenant_plant_unit_machine_downtime_reasons
			ADD CONSTRAINT fk_tenant_machines_downtime_reasons
			FOREIGN KEY (
				tenant_plant_unit_machine_downtime_id,
				tenant_id
			)
			REFERENCES tenant_plant_unit_machine_downtimes (
				id,
				tenant_id
			)
			ON UPDATE CASCADE
			ON DELETE CASCADE`
		);
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_machine_downtime_reasons CASCADE;`);
};
