exports.up = async function(knex) {
	let exists = null;

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_station_observed_machine_templates');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_station_observed_machine_templates', function(MachineTemplateTbl) {
			MachineTemplateTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			MachineTemplateTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			MachineTemplateTbl.uuid('tenant_plant_unit_station_observed_machine_id').notNullable();

			MachineTemplateTbl.text('component_state').notNullable().defaultTo('{}');
			MachineTemplateTbl.text('component_before_render_code');
			MachineTemplateTbl.text('component_after_render_code');
			MachineTemplateTbl.text('component_on_data_code');
			MachineTemplateTbl.text('component_before_destroy_code');
			MachineTemplateTbl.text('template');
			MachineTemplateTbl.jsonb('component_observers').notNullable().defaultTo('[]');
			MachineTemplateTbl.jsonb('component_tasks').notNullable().defaultTo('[]');

			MachineTemplateTbl.boolean('publish_status').notNullable().defaultTo(false);

			MachineTemplateTbl.timestamp('effectivity_start');
			MachineTemplateTbl.timestamp('effectivity_end');

			MachineTemplateTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			MachineTemplateTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			MachineTemplateTbl.unique(['id', 'tenant_id']);
			MachineTemplateTbl.foreign(['tenant_plant_unit_station_observed_machine_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_stations_observed_machines').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_station_observed_line_templates');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_station_observed_line_templates', function(LineTemplateTbl) {
			LineTemplateTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			LineTemplateTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			LineTemplateTbl.uuid('tenant_plant_unit_station_observed_line_id').notNullable();

			LineTemplateTbl.boolean('publish_status').notNullable().defaultTo(false);

			LineTemplateTbl.timestamp('effectivity_start');
			LineTemplateTbl.timestamp('effectivity_end');

			LineTemplateTbl.text('component_state').notNullable().defaultTo('{}');
			LineTemplateTbl.text('component_before_render_code');
			LineTemplateTbl.text('component_after_render_code');
			LineTemplateTbl.text('component_on_data_code');
			LineTemplateTbl.text('component_before_destroy_code');
			LineTemplateTbl.text('template');
			LineTemplateTbl.jsonb('component_observers').notNullable().defaultTo('[]');
			LineTemplateTbl.jsonb('component_tasks').notNullable().defaultTo('[]');

			LineTemplateTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			LineTemplateTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			LineTemplateTbl.unique(['id', 'tenant_id']);
			LineTemplateTbl.foreign(['tenant_plant_unit_station_observed_line_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_stations_observed_lines').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}
}

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_station_observed_line_templates CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_plant_unit_station_observed_machine_templates CASCADE;`);
}
