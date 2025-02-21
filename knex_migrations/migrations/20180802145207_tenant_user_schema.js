/**
 * This sets up the schema for mapping users to tenants, and vice-versa
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;

	// Step 1: Create the "tenants_users" table
	await knex.schema.raw("CREATE TYPE public.tenant_user_access_status AS ENUM ('waiting', 'authorized', 'disabled')");

	exists = await knex.schema.withSchema('public').hasTable('tenants_users');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenants_users', function(tenantUserTbl) {
			tenantUserTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			tenantUserTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			tenantUserTbl.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');

			tenantUserTbl.specificType('access_status', 'public.tenant_user_access_status').notNullable().defaultTo('waiting');
			tenantUserTbl.uuid('default_application');
			tenantUserTbl.jsonb('default_application_parameters').notNullable().defaultTo('{}');
			tenantUserTbl.text('designation');

			tenantUserTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			tenantUserTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			tenantUserTbl.unique(['id', 'tenant_id']);
			tenantUserTbl.unique(['id', 'user_id']);
			tenantUserTbl.unique(['tenant_id', 'user_id']);
		});
	}

	// Step 2: Create the "tenants_users_groups" table
	exists = await knex.schema.withSchema('public').hasTable('tenants_users_groups');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenants_users_groups', function(tenantUserGroupTbl) {
			tenantUserGroupTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));

			tenantUserGroupTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			tenantUserGroupTbl.uuid('tenant_user_id').notNullable()
			tenantUserGroupTbl.uuid('tenant_group_id').notNullable();

			tenantUserGroupTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			tenantUserGroupTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			tenantUserGroupTbl.unique(['id', 'tenant_id']);
			tenantUserGroupTbl.unique(['tenant_user_id', 'tenant_group_id']);
			tenantUserGroupTbl.foreign(['tenant_user_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenants_users').onDelete('CASCADE').onUpdate('CASCADE');
			tenantUserGroupTbl.foreign(['tenant_group_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_groups').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	// Step 3: Enforce rules for sanity using triggers.
	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_check_tenant_user_upsert_is_valid ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	is_valid_feature	INTEGER;
BEGIN
	IF TG_OP = 'UPDATE'
	THEN
		IF OLD.tenant_id <> NEW.tenant_id
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Tenant is NOT mutable';
			RETURN NULL;
		END IF;

		IF OLD.user_id <> NEW.user_id
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE ='User is NOT mutable';
			RETURN NULL;
		END IF;
	END IF;

	IF NEW.default_application IS NULL
	THEN
		RETURN NEW;
	END IF;

	is_valid_feature := 0;
	SELECT
		COUNT(module_id)
	FROM
		tenants_modules
	WHERE
		tenant_id = NEW.tenant_id AND
		module_id = NEW.default_application
	INTO
		is_valid_feature;

	IF is_valid_feature = 0
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE ='This feature is not available for this Tenant';
		RETURN NULL;
	END IF;

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_assign_default_group_to_tenant_user ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	default_tenant_group	UUID;
BEGIN
	default_tenant_group := NULL;

	SELECT
		id
	FROM
		tenant_groups
	WHERE
		tenant_id = NEW.tenant_id AND
		default_for_new_user = true
	INTO
		default_tenant_group;

	IF default_tenant_group IS NULL
	THEN
		RETURN NEW;
	END IF;

	INSERT INTO tenants_users_groups (
		tenant_id,
		tenant_user_id,
		tenant_group_id
	)
	VALUES (
		NEW.tenant_id,
		NEW.id,
		default_tenant_group
	);

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_check_tenant_user_group_upsert_is_valid ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	is_member_of_ancestor_group	INTEGER;
BEGIN
	is_member_of_ancestor_group := 0;
	SELECT
		count(tenant_group_id)
	FROM
		tenants_users_groups
	WHERE
		tenant_user_id = NEW.tenant_user_id AND
		tenant_group_id IN (SELECT id FROM fn_get_group_ancestors(NEW.tenant_group_id) WHERE level > 1)
	INTO
		is_member_of_ancestor_group;

	IF is_member_of_ancestor_group = 0
	THEN
		RETURN NEW;
	END IF;

	RAISE SQLSTATE '2F003' USING MESSAGE = 'User is already a member of a Parent Group';
	RETURN NULL;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_descendant_group_from_tenant_user ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenants_users_groups
	WHERE
		tenant_user_id = NEW.tenant_user_id AND
		tenant_group_id IN (SELECT id FROM fn_get_group_descendants(NEW.tenant_group_id) WHERE level >= 2);

	RETURN NEW;
END;
$$;`
	);

	// TODO: Setup triggers to ensure that the max numbers of users per tenant is lte the configured max_users field in the tenant table

	// Step 4: Finally, create the triggers...
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_tenant_user_upsert_is_valid BEFORE INSERT OR UPDATE ON public.tenants_users FOR EACH ROW EXECUTE PROCEDURE public.fn_check_tenant_user_upsert_is_valid();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_assign_default_group_to_tenant_user AFTER INSERT ON public.tenants_users FOR EACH ROW EXECUTE PROCEDURE public.fn_assign_default_group_to_tenant_user();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_tenant_user_group_upsert_is_valid AFTER INSERT OR UPDATE ON public.tenants_users_groups FOR EACH ROW EXECUTE PROCEDURE public.fn_check_tenant_user_group_upsert_is_valid();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_descendant_group_from_tenant_user AFTER INSERT OR UPDATE ON public.tenants_users_groups FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_descendant_group_from_tenant_user();');
};

exports.down = async function(knex) {
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_descendant_group_from_tenant_user ON public.tenants_users_groups CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_check_tenant_user_group_upsert_is_valid ON public.tenants_users_groups CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_assign_default_group_to_tenant_user ON public.tenants_users CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_check_tenant_user_upsert_is_valid ON public.tenants_users CASCADE;');

	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_remove_descendant_group_from_tenant_user () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_check_tenant_user_group_upsert_is_valid () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_check_tenant_user_upsert_is_valid () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_assign_default_group_to_tenant_user () CASCADE;`);

	await knex.raw(`DROP TABLE IF EXISTS public.tenants_users_groups CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenants_users CASCADE;`);

	await knex.schema.raw("DROP TYPE IF EXISTS public.tenant_user_access_status CASCADE;");
};
