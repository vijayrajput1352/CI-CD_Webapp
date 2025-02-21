/**
 * This sets up the schema for the tenant panel -> tenant user mapping
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;
	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_stations_users');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_stations_users', function(stationsUsersTbl) {
			stationsUsersTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			stationsUsersTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			stationsUsersTbl.uuid('tenant_plant_unit_station_id').notNullable();
			stationsUsersTbl.uuid('tenant_user_id').notNullable();

			stationsUsersTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			stationsUsersTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			stationsUsersTbl.unique(['id', 'tenant_id']);
			stationsUsersTbl.unique(['tenant_plant_unit_station_id', 'tenant_user_id']);

			// stationsUsersTbl.foreign(['tenant_plant_unit_station_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_stations').onDelete('CASCADE').onUpdate('CASCADE');
			// stationsUsersTbl.foreign(['tenant_user_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenants_users').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE public.tenant_plant_unit_stations_users
			ADD CONSTRAINT fk_tenant_station_users_stations
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

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE public.tenant_plant_unit_stations_users
			ADD CONSTRAINT fk_tenant_station_users_tenant_user
			FOREIGN KEY (
				tenant_user_id,
				tenant_id
			)
			REFERENCES tenants_users (
				id,
				tenant_id
			)
			ON UPDATE CASCADE
			ON DELETE CASCADE`
		);
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_stations_users CASCADE;`);
};
