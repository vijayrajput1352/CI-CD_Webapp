/**
 * This sets up the schema for the tenant plant unit line -> tenant user mapping
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;
	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_lines_users');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_lines_users', function(LinesUsersTbl) {
			LinesUsersTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			LinesUsersTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			LinesUsersTbl.uuid('tenant_plant_unit_line_id').notNullable();
			LinesUsersTbl.uuid('tenant_user_id').notNullable();

			LinesUsersTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			LinesUsersTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			LinesUsersTbl.unique(['id', 'tenant_id']);
			LinesUsersTbl.unique(['tenant_plant_unit_line_id', 'tenant_user_id']);

			// LinesUsersTbl.foreign(['tenant_plant_unit_line_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_lines').onDelete('CASCADE').onUpdate('CASCADE');
			// LinesUsersTbl.foreign(['tenant_user_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenants_users').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE public.tenant_plant_unit_lines_users
			ADD CONSTRAINT fk_tenant_line_users_lines
			FOREIGN KEY (
				tenant_plant_unit_line_id,
				tenant_id
			)
			REFERENCES tenant_plant_unit_lines (
				id,
				tenant_id
			)
			ON UPDATE CASCADE
			ON DELETE CASCADE`
		);

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE public.tenant_plant_unit_lines_users
			ADD CONSTRAINT fk_tenant_line_users_tenant_user
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
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_lines_users CASCADE;`);
};
