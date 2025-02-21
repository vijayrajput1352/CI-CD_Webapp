
exports.up = async function(knex) {

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_machine_setuptimes');
	if(!exists)
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_machine_setuptimes', function(MachineSetuptimeTbl) {
			MachineSetuptimeTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			MachineSetuptimeTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			MachineSetuptimeTbl.uuid('tenant_plant_unit_machine_id').notNullable();

			MachineSetuptimeTbl.text('type');

			MachineSetuptimeTbl.timestamp('start_time').notNullable().defaultTo(knex.fn.now());
			MachineSetuptimeTbl.timestamp('end_time');
			MachineSetuptimeTbl.text('work_order_id');

			MachineSetuptimeTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			MachineSetuptimeTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			MachineSetuptimeTbl.unique(['id', 'tenant_id']);
			MachineSetuptimeTbl.foreign(['tenant_plant_unit_machine_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_machines').onDelete('CASCADE').onUpdate('CASCADE');
		});

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_machine_idletimes');
	if(!exists)
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_machine_idletimes', function(MachineIdletimeTbl) {
			MachineIdletimeTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			MachineIdletimeTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			MachineIdletimeTbl.uuid('tenant_plant_unit_machine_id').notNullable();

			MachineIdletimeTbl.text('type');

			MachineIdletimeTbl.timestamp('start_time').notNullable().defaultTo(knex.fn.now());
			MachineIdletimeTbl.timestamp('end_time');
			MachineIdletimeTbl.text('work_order_id');

			MachineIdletimeTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			MachineIdletimeTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			MachineIdletimeTbl.unique(['id', 'tenant_id']);
			MachineIdletimeTbl.foreign(['tenant_plant_unit_machine_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_machines').onDelete('CASCADE').onUpdate('CASCADE');
		});

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_line_setuptimes');
	if(!exists)
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_line_setuptimes', function(LineSetuptimeTbl) {
			LineSetuptimeTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			LineSetuptimeTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			LineSetuptimeTbl.uuid('tenant_plant_unit_line_id').notNullable();

			LineSetuptimeTbl.text('type').notNullable();

			LineSetuptimeTbl.timestamp('start_time').notNullable().defaultTo(knex.fn.now());
			LineSetuptimeTbl.timestamp('end_time');
			LineSetuptimeTbl.text('work_order_id');

			LineSetuptimeTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			LineSetuptimeTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			LineSetuptimeTbl.unique(['id', 'tenant_id']);
			LineSetuptimeTbl.foreign(['tenant_plant_unit_line_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_lines').onDelete('CASCADE').onUpdate('CASCADE');
		});

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_line_idletimes');
	if(!exists)
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_line_idletimes', function(LineIdletimeTbl) {
			LineIdletimeTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			LineIdletimeTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			LineIdletimeTbl.uuid('tenant_plant_unit_line_id').notNullable();

			LineIdletimeTbl.text('type').notNullable();

			LineIdletimeTbl.timestamp('start_time').notNullable().defaultTo(knex.fn.now());
			LineIdletimeTbl.timestamp('end_time');
			LineIdletimeTbl.text('work_order_id');

			LineIdletimeTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			LineIdletimeTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			LineIdletimeTbl.unique(['id', 'tenant_id']);
			LineIdletimeTbl.foreign(['tenant_plant_unit_line_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_lines').onDelete('CASCADE').onUpdate('CASCADE');
		});

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_machine_setuptime_reasons');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_machine_setuptime_reasons', function(machineSetuptimeReasonsTbl) {
			machineSetuptimeReasonsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			machineSetuptimeReasonsTbl.uuid('tenant_id').notNullable();
			machineSetuptimeReasonsTbl.uuid('tenant_plant_unit_machine_setuptime_id');

			machineSetuptimeReasonsTbl.text('reason_code');
			machineSetuptimeReasonsTbl.text('reason_description');
			machineSetuptimeReasonsTbl.integer('reason_duration_in_min');

			machineSetuptimeReasonsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			machineSetuptimeReasonsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			machineSetuptimeReasonsTbl.unique(['id', 'tenant_id']);
			machineSetuptimeReasonsTbl.unique(['tenant_plant_unit_machine_setuptime_id', 'reason_code']);
		});

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE public.tenant_plant_unit_machine_setuptime_reasons
			ADD CONSTRAINT fk_tenant_machines_setuptime_reasons
			FOREIGN KEY (
				tenant_plant_unit_machine_setuptime_id,
				tenant_id
			)
			REFERENCES tenant_plant_unit_machine_setuptimes (
				id,
				tenant_id
			)
			ON UPDATE CASCADE
			ON DELETE CASCADE`
		);
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_machine_idletime_reasons');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_machine_idletime_reasons', function(machineSetuptimeReasonsTbl) {
			machineSetuptimeReasonsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			machineSetuptimeReasonsTbl.uuid('tenant_id').notNullable();
			machineSetuptimeReasonsTbl.uuid('tenant_plant_unit_machine_idletime_id');

			machineSetuptimeReasonsTbl.text('reason_code');
			machineSetuptimeReasonsTbl.text('reason_description');
			machineSetuptimeReasonsTbl.integer('reason_duration_in_min');

			machineSetuptimeReasonsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			machineSetuptimeReasonsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			machineSetuptimeReasonsTbl.unique(['id', 'tenant_id']);
			machineSetuptimeReasonsTbl.unique(['tenant_plant_unit_machine_idletime_id', 'reason_code']);
		});

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE public.tenant_plant_unit_machine_idletime_reasons
			ADD CONSTRAINT fk_tenant_machines_setuptime_reasons
			FOREIGN KEY (
				tenant_plant_unit_machine_idletime_id,
				tenant_id
			)
			REFERENCES tenant_plant_unit_machine_idletimes (
				id,
				tenant_id
			)
			ON UPDATE CASCADE
			ON DELETE CASCADE`
		);
	}

};

exports.down = async function(knex) {

	await knex.raw('DROP TABLE IF EXISTS public.tenant_plant_unit_machine_idletime_reasons');
	await knex.raw('DROP TABLE IF EXISTS public.tenant_plant_unit_machine_setuptime_reasons');
	await knex.raw('DROP TABLE IF EXISTS public.tenant_plant_unit_line_idletimes');
	await knex.raw('DROP TABLE IF EXISTS public.tenant_plant_unit_line_setuptimes');
	await knex.raw('DROP TABLE IF EXISTS public.tenant_plant_unit_machine_idletimes');
	await knex.raw('DROP TABLE IF EXISTS public.tenant_plant_unit_machine_setuptimes');

};
