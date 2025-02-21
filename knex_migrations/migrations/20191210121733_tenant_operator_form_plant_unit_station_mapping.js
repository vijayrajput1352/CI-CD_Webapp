/**
 * This sets up the schema for the tenant panel -> tenant user mapping
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;
	exists = await knex.schema.withSchema('public').hasTable('tenant_operator_forms_plant_unit_stations');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_operator_forms_plant_unit_stations', function(operatorFormsStationsTbl) {
			operatorFormsStationsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			operatorFormsStationsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			operatorFormsStationsTbl.uuid('tenant_operator_form_id').notNullable();
			operatorFormsStationsTbl.uuid('tenant_plant_unit_station_id').notNullable();

			operatorFormsStationsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			operatorFormsStationsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			operatorFormsStationsTbl.unique(['id', 'tenant_id']);
			operatorFormsStationsTbl.unique(['tenant_operator_form_id', 'tenant_plant_unit_station_id']);

			// operatorFormsStationsTbl.foreign(['tenant_operator_form_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_operator_forms').onDelete('CASCADE').onUpdate('CASCADE');
			// operatorFormsStationsTbl.foreign(['tenant_plant_unit_station_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_stations').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE public.tenant_operator_forms_plant_unit_stations
			ADD CONSTRAINT fk_tenant_oper_forms_stns_oper_forms
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
			ALTER TABLE public.tenant_operator_forms_plant_unit_stations
			ADD CONSTRAINT fk_tenant_oper_forms_plant_unit_stns
			FOREIGN KEY (
				tenant_plant_unit_station_id,
				tenant_id
			)
			REFERENCES tenant_plant_unit_stations (
				id,
				tenant_id
			)
			ON UPDATE CASCADE
			ON DELETE CASCADE`
		);
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_operator_forms_plant_unit_stations CASCADE;`);
};
