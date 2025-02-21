
exports.up = async function(knex) {
	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_assign_new_module_permissions_to_tenant ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	INSERT INTO
		tenant_group_permissions (
			tenant_id,
			tenant_group_id,
			module_id,
			module_permission_id
		)
	SELECT
		tenant_id,
		id,
		NEW.module_id,
		NEW.id
	FROM
		tenant_groups
	WHERE
		parent_id IS NULL AND
		tenant_id IN (SELECT tenant_id FROM tenants_modules WHERE module_id = NEW.module_id);

	RETURN NEW;
END;
$$;`
	);
};

exports.down = async function(knex) {
	await knex.raw('DROP FUNCTION IF EXISTS public.fn_assign_new_module_permissions_to_tenant () CASCADE;');
};
