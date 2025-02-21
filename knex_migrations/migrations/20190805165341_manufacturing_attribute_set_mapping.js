/**
 * This sets up the schema for mapping manufacturing entities with the attribute sets they consume
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_machines_attribute_sets');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_machines_attribute_sets', function(MachineAttributeSetTbl) {
			MachineAttributeSetTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			MachineAttributeSetTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			MachineAttributeSetTbl.uuid('tenant_plant_unit_machine_id').notNullable();
			MachineAttributeSetTbl.uuid('tenant_attribute_set_id').notNullable();
			MachineAttributeSetTbl.integer('evaluation_order').notNullable().defaultTo(1);

			MachineAttributeSetTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			MachineAttributeSetTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			MachineAttributeSetTbl.unique(['id', 'tenant_id']);

			MachineAttributeSetTbl.foreign(['tenant_plant_unit_machine_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_machines').onDelete('CASCADE').onUpdate('CASCADE');
			MachineAttributeSetTbl.foreign(['tenant_attribute_set_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_attribute_sets').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_plant_unit_machine_attr_set ON public.tenant_plant_unit_machines_attribute_sets
			USING btree
			(
				tenant_plant_unit_machine_id ASC,
				tenant_attribute_set_id ASC
			)`
		);
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_stations_attribute_sets');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_stations_attribute_sets', function(StationAttributeSetTbl) {
			StationAttributeSetTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			StationAttributeSetTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			StationAttributeSetTbl.uuid('tenant_plant_unit_station_id').notNullable();
			StationAttributeSetTbl.uuid('tenant_attribute_set_id').notNullable();
			StationAttributeSetTbl.integer('evaluation_order').notNullable().defaultTo(1);

			StationAttributeSetTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			StationAttributeSetTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			StationAttributeSetTbl.unique(['id', 'tenant_id']);

			StationAttributeSetTbl.foreign(['tenant_plant_unit_station_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_stations').onDelete('CASCADE').onUpdate('CASCADE');
			StationAttributeSetTbl.foreign(['tenant_attribute_set_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_attribute_sets').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_plant_unit_station_attr_set ON public.tenant_plant_unit_stations_attribute_sets
			USING btree
			(
				tenant_plant_unit_station_id ASC,
				tenant_attribute_set_id ASC
			)`
		);
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_stations_attribute_sets CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_machines_attribute_sets CASCADE;`);
};
