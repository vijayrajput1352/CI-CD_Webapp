
exports.up = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_station_templates CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_station_processors CASCADE;`);
};

exports.down = async function(knex) {
	let exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_station_processors');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_station_processors', function(StationProcessorTbl) {
			StationProcessorTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			StationProcessorTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			StationProcessorTbl.uuid('tenant_plant_unit_station_id').notNullable();

			StationProcessorTbl.text('processed_data_transform_code');
			StationProcessorTbl.text('pre_realtime_push_transform_code');

			StationProcessorTbl.text('processor');
			StationProcessorTbl.boolean('publish_status').notNullable().defaultTo(false);

			StationProcessorTbl.timestamp('effectivity_start');
			StationProcessorTbl.timestamp('effectivity_end');

			StationProcessorTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			StationProcessorTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			StationProcessorTbl.unique(['id', 'tenant_id']);
			StationProcessorTbl.foreign(['tenant_plant_unit_station_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_stations').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_station_templates');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_station_templates', function(StationTemplateTbl) {
			StationTemplateTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			StationTemplateTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			StationTemplateTbl.uuid('tenant_plant_unit_station_id').notNullable();

			StationTemplateTbl.text('component_state').notNullable().defaultTo('{}');
			StationTemplateTbl.text('component_before_render_code');
			StationTemplateTbl.text('component_after_render_code');
			StationTemplateTbl.text('component_on_data_code');
			StationTemplateTbl.text('component_before_destroy_code');
			StationTemplateTbl.text('template');
			StationTemplateTbl.jsonb('component_observers').notNullable().defaultTo('[]');
			StationTemplateTbl.jsonb('component_tasks').notNullable().defaultTo('[]');

			StationTemplateTbl.boolean('publish_status').notNullable().defaultTo(false);

			StationTemplateTbl.timestamp('effectivity_start');
			StationTemplateTbl.timestamp('effectivity_end');

			StationTemplateTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			StationTemplateTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			StationTemplateTbl.unique(['id', 'tenant_id']);
			StationTemplateTbl.foreign(['tenant_plant_unit_station_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_stations').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}
};
