
exports.up = async function(knex) {
	let exists = await knex.schema.withSchema('public').hasTable('tenant_work_orders');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_work_orders', function(WoTbl) {
			WoTbl.text('work_order_id').notNullable();

			WoTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			WoTbl.uuid('tenant_work_order_format_id').notNullable();

			WoTbl.timestamp('planned_start_time').notNullable();
			WoTbl.timestamp('planned_stop_time').notNullable();

			WoTbl.specificType('current_status', 'public.work_order_status_type').notNullable().defaultTo('not_started');

			WoTbl.jsonb('values').notNullable();
			WoTbl.jsonb('data_types').notNullable();

			WoTbl.timestamp('inserted_at').notNullable();
			WoTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

			WoTbl.primary(['work_order_id', 'tenant_id']);
			WoTbl.foreign(['tenant_work_order_format_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_work_order_formats').onDelete('CASCADE').onUpdate('CASCADE');

			WoTbl.index('values', null, 'gin');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_work_order_status');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_work_order_status', function(WoStatusTbl) {
			WoStatusTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			WoStatusTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			WoStatusTbl.uuid('tenant_work_order_format_id');
			WoStatusTbl.uuid('tenant_plant_unit_station_id');
			WoStatusTbl.uuid('tenant_plant_unit_line_id');
			WoStatusTbl.text('work_order_id').notNullable();

			WoStatusTbl.text('status').notNullable();
			WoStatusTbl.jsonb('metadata').notNullable().defaultTo('{}');
			WoStatusTbl.timestamp('created_at').notNullable();

			WoStatusTbl.foreign(['tenant_work_order_format_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_work_order_formats').onDelete('SET NULL').onUpdate('CASCADE');
			WoStatusTbl.foreign(['tenant_plant_unit_station_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_stations').onDelete('SET NULL').onUpdate('CASCADE');
			WoStatusTbl.foreign(['tenant_plant_unit_line_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_lines').onDelete('SET NULL').onUpdate('CASCADE');

			WoStatusTbl.foreign(['work_order_id', 'tenant_id']).references(['work_order_id', 'tenant_id']).inTable('tenant_work_orders').onDelete('CASCADE').onUpdate('CASCADE');

			WoStatusTbl.index('metadata', null, 'gin');
		});
	}
};

exports.down = async function(knex) {
	await knex.raw('DROP TABLE IF EXISTS public.tenant_work_order_status CASCADE');
	await knex.raw('DROP TABLE IF EXISTS public.tenant_work_orders CASCADE');
};
