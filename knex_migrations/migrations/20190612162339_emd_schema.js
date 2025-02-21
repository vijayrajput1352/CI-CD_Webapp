
exports.up = async function(knex) {
	let exists = null;

	/* Step 0: Create EMD configurations Table */
	exists = await knex.schema.withSchema('public').hasTable('tenant_emd_configurations');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_emd_configurations', function(EmdConfigsTbl) {
			EmdConfigsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			EmdConfigsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			EmdConfigsTbl.uuid('tenant_folder_id').notNullable();

			EmdConfigsTbl.text('raw_data_transform_code');
			EmdConfigsTbl.text('processed_data_transform_code');

			EmdConfigsTbl.text('name').notNullable();
			EmdConfigsTbl.text('description');

			EmdConfigsTbl.jsonb('attribute_set_metadata').notNullable().defaultTo('[]');

			EmdConfigsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			EmdConfigsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			EmdConfigsTbl.unique(['id', 'tenant_id']);
			EmdConfigsTbl.foreign(['tenant_folder_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_folders').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	/* Step 1: Create EMD configurations attribute sets Table */
	exists = await knex.schema.withSchema('public').hasTable('tenant_emd_configuration_attribute_sets');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_emd_configuration_attribute_sets', function(EmdConfigsAttributeSetsTbl) {
			EmdConfigsAttributeSetsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			EmdConfigsAttributeSetsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			EmdConfigsAttributeSetsTbl.uuid('tenant_emd_configuration_id').notNullable();
			EmdConfigsAttributeSetsTbl.uuid('tenant_attribute_set_id').notNullable();
			EmdConfigsAttributeSetsTbl.integer('evaluation_order').notNullable().defaultTo(1);

			EmdConfigsAttributeSetsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			EmdConfigsAttributeSetsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			EmdConfigsAttributeSetsTbl.unique(['id', 'tenant_id']);

			EmdConfigsAttributeSetsTbl.foreign(['tenant_emd_configuration_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_emd_configurations').onDelete('CASCADE').onUpdate('CASCADE');
			EmdConfigsAttributeSetsTbl.foreign(['tenant_attribute_set_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_attribute_sets').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_emd_config_attr_set ON public.tenant_emd_configuration_attribute_sets
			USING btree
			(
				tenant_emd_configuration_id ASC,
				tenant_attribute_set_id ASC
			)`
		);
	}

	/* Step 2: Create trigger functions */
	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_create_emd_folder_for_tenant ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	server_id UUID;
	emd_feature_id UUID;
	root_folder_id UUID;
BEGIN
	server_id := NULL;
	emd_feature_id := NULL;
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
		name = 'Emd' AND
		type = 'feature'
	INTO
		emd_feature_id;

	IF emd_feature_id IS NULL
	THEN
		RETURN NEW;
	END IF;

	IF NEW.module_id <> emd_feature_id
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
		'emd_feature.folder_names.root.name',
		'emd_feature.folder_names.root.description'
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
		'emd_feature.folder_names.attribute_sets.name',
		'emd_feature.folder_names.attribute_sets.description'
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
		'emd_feature.folder_names.emd_configurations.name',
		'emd_feature.folder_names.emd_configurations.description'
	);

	RETURN NEW;
END;
$$;`
	);

	/* Finally, hook up the triggers */
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_create_emd_folder_for_tenant AFTER INSERT OR UPDATE ON public.tenants_modules FOR EACH ROW EXECUTE PROCEDURE public.fn_create_emd_folder_for_tenant();');
};

exports.down = async function(knex) {
	await knex.raw('DROP TRIGGER IF EXISTS trigger_create_emd_folder_for_tenant ON public.tenants_modules CASCADE;');
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_create_emd_folder_for_tenant () CASCADE;`);

	await knex.raw('DROP TABLE IF EXISTS public.tenant_emd_configuration_attribute_sets CASCADE;');
	await knex.raw('DROP TABLE IF EXISTS public.tenant_emd_configurations CASCADE;');
};
