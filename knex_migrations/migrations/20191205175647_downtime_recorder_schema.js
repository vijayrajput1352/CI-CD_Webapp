
exports.up = async function(knex) {
	let exists = null;
	await knex.schema.raw("CREATE TYPE public.downtime_type AS ENUM ('downtime', 'no_data', 'disconnected')");

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_machine_downtimes');
	if(!exists)
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_machine_downtimes', function(MachineDowntimeTbl) {
			MachineDowntimeTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			MachineDowntimeTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			MachineDowntimeTbl.uuid('tenant_plant_unit_machine_id').notNullable();

			MachineDowntimeTbl.specificType('type', 'public.downtime_type').notNullable();

			MachineDowntimeTbl.timestamp('start_time').notNullable().defaultTo(knex.fn.now());
			MachineDowntimeTbl.timestamp('end_time');
			MachineDowntimeTbl.text('work_order_id');

			MachineDowntimeTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			MachineDowntimeTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			MachineDowntimeTbl.unique(['id', 'tenant_id']);
			MachineDowntimeTbl.foreign(['tenant_plant_unit_machine_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_machines').onDelete('CASCADE').onUpdate('CASCADE');
		});

	exists = await knex.schema.withSchema('public').hasTable('tenant_plant_unit_line_downtimes');
	if(!exists)
		await knex.schema.withSchema('public').createTable('tenant_plant_unit_line_downtimes', function(LineDowntimeTbl) {
			LineDowntimeTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			LineDowntimeTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			LineDowntimeTbl.uuid('tenant_plant_unit_line_id').notNullable();

			LineDowntimeTbl.specificType('type', 'public.downtime_type').notNullable();

			LineDowntimeTbl.timestamp('start_time').notNullable().defaultTo(knex.fn.now());
			LineDowntimeTbl.timestamp('end_time');
			LineDowntimeTbl.text('work_order_id');

			LineDowntimeTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			LineDowntimeTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			LineDowntimeTbl.unique(['id', 'tenant_id']);
			LineDowntimeTbl.foreign(['tenant_plant_unit_line_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_plant_unit_lines').onDelete('CASCADE').onUpdate('CASCADE');
		});

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_delete_zero_duration_machine_downtimes ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	IF NEW.end_time IS NULL
	THEN
		RETURN NULL;
	END IF;

	IF AGE(NEW.end_time, NEW.start_time) < interval '120 S'
	THEN
		DELETE FROM tenant_plant_unit_machine_downtimes WHERE id = NEW.id;
		RETURN NULL;
	END IF;

	RETURN NULL;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_delete_zero_duration_line_downtimes ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	IF NEW.end_time IS NULL
	THEN
		RETURN NULL;
	END IF;

	IF AGE(NEW.end_time, NEW.start_time) < interval '120 S'
	THEN
		DELETE FROM tenant_plant_unit_line_downtimes WHERE id = NEW.id;
		RETURN NULL;
	END IF;

	RETURN NULL;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_zero_duration_machine_downtimes AFTER INSERT OR UPDATE ON public.tenant_plant_unit_machine_downtimes FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_zero_duration_machine_downtimes();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_zero_duration_line_downtimes AFTER INSERT OR UPDATE ON public.tenant_plant_unit_line_downtimes FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_zero_duration_line_downtimes();');
};

exports.down = async function(knex) {
	await knex.raw(`DROP TRIGGER IF EXISTS trigger_delete_zero_duration_machine_downtimes ON public.tenant_plant_unit_machine_downtimes CASCADE;`);
	await knex.raw(`DROP TRIGGER IF EXISTS trigger_delete_zero_duration_line_downtimes ON public.tenant_plant_unit_line_downtimes CASCADE;`);

	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_zero_duration_machine_downtimes () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_delete_zero_duration_line_downtimes () CASCADE;`);

	await knex.raw('DROP TABLE IF EXISTS public.tenant_plant_unit_machine_downtimes');
	await knex.raw('DROP TABLE IF EXISTS public.tenant_plant_unit_line_downtimes');

	await knex.raw('DROP TYPE IF EXISTS public.downtime_type CASCADE');
};
