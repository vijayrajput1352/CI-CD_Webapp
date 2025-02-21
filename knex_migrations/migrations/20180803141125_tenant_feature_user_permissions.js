/**
 * This sets up the function to calculate permissions for a given tenant-user combination
 * @ignore
 */
exports.up = async function(knex) {
	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_get_user_permissions (IN tenantId uuid, IN userId uuid)
	RETURNS TABLE (permission uuid, name text, implies_permissions jsonb)
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	RETURN QUERY
	SELECT
		Z.id,
		Z.name,
		Z.implies_permissions
	FROM
		module_permissions Z
	WHERE
		Z.id IN (
			SELECT DISTINCT
				module_permission_id
			FROM
				tenant_group_permissions
			WHERE
				tenant_group_id IN (
					SELECT
						tenant_group_id
					FROM
						tenants_users_groups
					WHERE
						tenant_user_id = (SELECT id FROM tenants_users WHERE tenant_id = tenantId AND user_id = userId)
				)
			);
END;
$$;`
	);
};

exports.down = async function(knex) {
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_get_user_permissions (IN UUID, IN UUID) CASCADE;`);
};
