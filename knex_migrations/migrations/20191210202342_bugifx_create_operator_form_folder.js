
exports.up = async function(knex) {
	await knex.schema.withSchema('public')
	.raw(
`CREATE OR REPLACE FUNCTION public.fn_create_operator_form_folder_for_tenant ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	server_id UUID;
	operator_form_feature_id UUID;
	root_folder_id UUID;
BEGIN
	server_id := NULL;
	operator_form_feature_id := NULL;
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
		name = 'OperatorForm' AND
		type = 'feature'
	INTO
		operator_form_feature_id;

	IF operator_form_feature_id IS NULL
	THEN
		RETURN NEW;
	END IF;

	IF NEW.module_id <> operator_form_feature_id
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
		'operator_form_feature.folder_names.root.name',
		'operator_form_feature.folder_names.root.description'
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
		'operator_form_feature.folder_names.attribute_sets.name',
		'operator_form_feature.folder_names.attribute_sets.description'
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
		'operator_form_feature.folder_names.operator_forms.name',
		'operator_form_feature.folder_names.operator_forms.description'
	);

	RETURN NEW;
END;
$$;`
	);
};

exports.down = async function(knex) {
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_create_operator_form_folder_for_tenant () CASCADE;`);
};
