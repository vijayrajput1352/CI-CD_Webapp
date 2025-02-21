exports.up = async function(knex) {
	let exists = null;
	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_machine_aggregates');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_machine_aggregates', function(MachineAggregatesTbl) {
			MachineAggregatesTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			MachineAggregatesTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			MachineAggregatesTbl.uuid('tenant_plant_unit_machine_id').notNullable();

			MachineAggregatesTbl.text('name').notNullable();
			MachineAggregatesTbl.text('description');

			MachineAggregatesTbl.text('internal_tag').notNullable();
			MachineAggregatesTbl.text('evaluation_expression');

			MachineAggregatesTbl.text('units');

			MachineAggregatesTbl.specificType('datatype', 'public.attribute_value_type').notNullable().defaultTo('number');
			MachineAggregatesTbl.specificType('timestamp_format', 'public.attribute_timestamp_type').notNullable().defaultTo('not_a_timestamp');

			MachineAggregatesTbl.jsonb('config').notNullable().defaultTo('{}');
			MachineAggregatesTbl.jsonb('filters');

			MachineAggregatesTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			MachineAggregatesTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			MachineAggregatesTbl.unique(['id', 'tenant_id']);
			MachineAggregatesTbl.unique(['id', 'tenant_plant_unit_machine_id']);

			MachineAggregatesTbl.foreign(['tenant_plant_unit_machine_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_machines').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_machine_aggregates CASCADE;`);
};
