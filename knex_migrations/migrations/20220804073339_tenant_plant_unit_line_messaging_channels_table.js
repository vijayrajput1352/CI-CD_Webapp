
exports.up = async function(knex) {
	let exists = null;

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_line_messaging_channels');

	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_line_messaging_channels', function(channelsTbl) {
			channelsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			channelsTbl.uuid('tenant_plant_unit_line_id').notNullable().references('id').inTable('tenant_plant_unit_lines').onDelete('CASCADE').onUpdate('CASCADE');

			channelsTbl.specificType('service_name', 'public.tenant_messaging_service_types').notNullable();
			channelsTbl.jsonb('configuration').notNullable().defaultTo('{}');

			channelsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			channelsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			channelsTbl.unique(['id', 'tenant_plant_unit_line_id']);
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_plant_unit_line_service_name ON public.tenant_plant_unit_line_messaging_channels
			USING btree
			(
				tenant_plant_unit_line_id ASC,
				service_name ASC
			)`
		);
	}
};

exports.down = async function(knex) {
	await knex.raw('DROP TABLE IF EXISTS public.tenant_plant_unit_line_messaging_channels CASCADE;');
};
