
exports.up = async function(knex) {
	let exists = null;

	/* Step 0: Basics - enums */
	await knex.schema.raw("CREATE TYPE public.work_order_status_type AS ENUM ('not_started','in_progress', 'discontinued', 'completed', 'canceled')");

	/* Step 1: The work order format */
	exists = await knex.schema.withSchema('public').hasTable('tenant_work_order_formats');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_work_order_formats', function(WOFormatsTbl) {
			WOFormatsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			WOFormatsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			WOFormatsTbl.uuid('tenant_folder_id').notNullable();

			WOFormatsTbl.text('raw_data_transform_code');
			WOFormatsTbl.text('processed_data_transform_code');

			WOFormatsTbl.text('name').notNullable();
			WOFormatsTbl.text('description');

			WOFormatsTbl.jsonb('attribute_set_metadata').notNullable().defaultTo('[]');

			WOFormatsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			WOFormatsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			WOFormatsTbl.unique(['id', 'tenant_id']);
			WOFormatsTbl.foreign(['tenant_folder_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_folders').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_create_work_order_folder_for_tenant ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	server_id UUID;
	work_order_feature_id UUID;
	root_folder_id UUID;
BEGIN
	server_id := NULL;
	work_order_feature_id := NULL;
	root_folder_id := NULL;

	SELECT
		id
	FROM
		modules
	WHERE
		name = 'PlantWorksWebappServer' AND
		type = 'server' AND
		parent_id IS NULL
	INTO
		server_id;

	IF server_id IS NULL
	THEN
		RETURN NEW;
	END IF;

	SELECT
		id
	FROM
		fn_get_module_descendants(server_id)
	WHERE
		name = 'WorkOrder' AND
		type = 'feature'
	INTO
		work_order_feature_id;

	IF work_order_feature_id IS NULL
	THEN
		RETURN NEW;
	END IF;

	IF NEW.module_id <> work_order_feature_id
	THEN
		RETURN NEW;
	END IF;

	INSERT INTO tenant_folders (
		tenant_id,
		name,
		description
	)
	VALUES (
		NEW.tenant_id,
		'work_order_feature.folder_names.root.name',
		'work_order_feature.folder_names.root.description'
	)
	RETURNING
		id
	INTO
		root_folder_id;

	INSERT INTO tenant_folders (
		tenant_id,
		parent_id,
		name,
		description
	)
	VALUES (
		NEW.tenant_id,
		root_folder_id,
		'work_order_feature.folder_names.attribute_sets.name',
		'work_order_feature.folder_names.attribute_sets.description'
	);

	INSERT INTO tenant_folders (
		tenant_id,
		parent_id,
		name,
		description
	)
	VALUES (
		NEW.tenant_id,
		root_folder_id,
		'work_order_feature.folder_names.format.name',
		'work_order_feature.folder_names.format.description'
	);

	RETURN NEW;
END;
$$;`
	);

	/* Finally, hook up the triggers */
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_create_work_order_folder_for_tenant AFTER INSERT OR UPDATE ON public.tenants_modules FOR EACH ROW EXECUTE PROCEDURE public.fn_create_work_order_folder_for_tenant();');
};

exports.down = async function(knex) {
	await knex.raw('DROP TRIGGER IF EXISTS trigger_create_work_order_folder_for_tenant ON public.tenants_modules CASCADE;');

	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_create_work_order_folder_for_tenant () CASCADE;`);

	await knex.raw(`DROP TABLE IF EXISTS public.tenant_work_order_formats CASCADE;`);

	await knex.raw(`DROP TYPE IF EXISTS public.work_order_status_type CASCADE;`);

};
