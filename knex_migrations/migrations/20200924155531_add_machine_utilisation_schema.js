
exports.up = async function(knex) {
	let exists = null;
	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_machine_statistics');
	if(!exists)
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_machine_statistics', function(MachineStatisicsTbl) {
			MachineStatisicsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			MachineStatisicsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			MachineStatisicsTbl.uuid('tenant_plant_unit_machine_id').notNullable();

			MachineStatisicsTbl.timestamp('start_time').notNullable().defaultTo(knex.fn.now());
			MachineStatisicsTbl.timestamp('end_time');
			MachineStatisicsTbl.text('work_order_id');
			MachineStatisicsTbl.text('sku');
			MachineStatisicsTbl.text('operator');
			MachineStatisicsTbl.text('supervisor');
			MachineStatisicsTbl.integer('standard_speed');
			MachineStatisicsTbl.specificType('weighted_avg_speed', 'double precision');//avg speed with 0 speed
			MachineStatisicsTbl.specificType('actual_avg_speed', 'double precision');//avg speed ignoring 0 speed
			MachineStatisicsTbl.integer('downtime');//in seconds or miliseconds
			MachineStatisicsTbl.integer('runtime');//in seconds or miliseconds
			MachineStatisicsTbl.specificType('wastage', 'double precision');
			MachineStatisicsTbl.specificType('total_production', 'double precision');
			MachineStatisicsTbl.specificType('planned_production', 'double precision');
			MachineStatisicsTbl.integer('machine_stoppages');//number of times speed comes to 0
			MachineStatisicsTbl.boolean('job_change').notNullable().defaultTo(false);

			MachineStatisicsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			MachineStatisicsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			MachineStatisicsTbl.unique(['id', 'tenant_id']);
			MachineStatisicsTbl.foreign(['tenant_plant_unit_machine_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_machines').onDelete('CASCADE').onUpdate('CASCADE');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_downtimes', 'supervisor');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_downtimes', function(DowntimesTbl) {
			DowntimesTbl.text('supervisor');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_downtimes', 'operator');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_downtimes', function(DowntimesTbl) {
			DowntimesTbl.text('operator');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_downtimes', 'sku');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_downtimes', function(DowntimesTbl) {
			DowntimesTbl.text('sku');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_setuptimes', 'supervisor');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_setuptimes', function(DowntimesTbl) {
			DowntimesTbl.text('supervisor');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_setuptimes', 'operator');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_setuptimes', function(DowntimesTbl) {
			DowntimesTbl.text('operator');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_setuptimes', 'sku');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_setuptimes', function(DowntimesTbl) {
			DowntimesTbl.text('sku');
		});
};

exports.down = async function(knex) {
	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_setuptimes', 'sku');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_setuptimes', function(DowntimesTbl) {
			DowntimesTbl.dropColumn('sku');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_setuptimes', 'operator');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_setuptimes', function(DowntimesTbl) {
			DowntimesTbl.dropColumn('operator');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_setuptimes', 'supervisor');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_setuptimes', function(DowntimesTbl) {
			DowntimesTbl.dropColumn('supervisor');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_downtimes', 'sku');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_downtimes', function(DowntimesTbl) {
			DowntimesTbl.dropColumn('sku');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_downtimes', 'operator');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_downtimes', function(DowntimesTbl) {
			DowntimesTbl.dropColumn('operator');
		});

	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_downtimes', 'supervisor');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_downtimes', function(DowntimesTbl) {
			DowntimesTbl.dropColumn('supervisor');
		});

	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_machine_statistics CASCADE;`);
};
