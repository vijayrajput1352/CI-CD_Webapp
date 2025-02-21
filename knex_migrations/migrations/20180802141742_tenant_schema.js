/**
 * This sets up the schema for tenants, their locations, and groups
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;

	await knex.schema.raw("CREATE TYPE public.tenant_relationship_type AS ENUM ('customer', 'oem', 'partner', 'service_provider', 'vendor')");
	await knex.schema.raw("CREATE TYPE public.tenant_relationship_status AS ENUM ('waiting', 'authorized', 'disabled')");

	// Step 1: Create the basic "tenants" table
	exists = await knex.schema.withSchema('public').hasTable('tenants');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenants', function(tenantTbl) {
			tenantTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));

			tenantTbl.text('name').notNullable();
			tenantTbl.text('sub_domain').notNullable();
			tenantTbl.boolean('enabled').notNullable().defaultTo(true);
			tenantTbl.integer('max_users').notNullable().defaultTo(1);

			tenantTbl.boolean('can_create_tenants').notNullable().defaultTo(false);
			tenantTbl.uuid('created_by_tenant').references('id').inTable('tenants').onDelete('SET NULL').onUpdate('SET NULL');
			tenantTbl.jsonb('settings').notNullable().defaultTo('{}');

			tenantTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			tenantTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			tenantTbl.unique(['sub_domain']);
		});
	}

	// Step 2: Create the "tenant_locations" table
	exists = await knex.schema.withSchema('public').hasTable('tenant_locations');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_locations', function(tenantLocationTbl) {
			tenantLocationTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			tenantLocationTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			tenantLocationTbl.boolean('is_primary').notNullable().defaultTo(false);

			tenantLocationTbl.text('name').notNullable();
			tenantLocationTbl.text('line1').notNullable();
			tenantLocationTbl.text('line2');
			tenantLocationTbl.text('line3');
			tenantLocationTbl.text('area').notNullable();
			tenantLocationTbl.text('city').notNullable();
			tenantLocationTbl.text('state').notNullable();
			tenantLocationTbl.text('country').notNullable();
			tenantLocationTbl.text('postal_code').notNullable();

			tenantLocationTbl.specificType('latitude', 'double precision').notNullable();
			tenantLocationTbl.specificType('longitude', 'double precision').notNullable();

			tenantLocationTbl.text('timezone_id').notNullable();
			tenantLocationTbl.text('timezone_name').notNullable();

			tenantLocationTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			tenantLocationTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			tenantLocationTbl.unique(['id', 'tenant_id']);
			tenantLocationTbl.unique(['tenant_id', 'name']);
		});
	}

	// Step 3: Create the "tenant_groups" table
	exists = await knex.schema.withSchema('public').hasTable('tenant_groups');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_groups', function(groupTbl) {
			groupTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			groupTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			groupTbl.uuid('parent_id');

			groupTbl.text('name').notNullable();
			groupTbl.text('display_name').notNullable();
			groupTbl.text('description');

			groupTbl.boolean('default_for_new_user').notNullable().defaultTo(false);

			groupTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			groupTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			groupTbl.unique(['id', 'tenant_id']);
			groupTbl.unique(['parent_id', 'name']);

			groupTbl.foreign(['parent_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_groups').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	// Step 4: Create the tenant_relationships table
	exists = await knex.schema.withSchema('public').hasTable('tenant_relationships');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_relationships', function(tenantRelationshipsTbl) {
			tenantRelationshipsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			tenantRelationshipsTbl.uuid('tenant_id').notNullable().references(['id']).inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			tenantRelationshipsTbl.uuid('other_tenant_id').notNullable().references(['id']).inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			tenantRelationshipsTbl.specificType('relationship', 'public.tenant_relationship_type').notNullable();
			tenantRelationshipsTbl.specificType('relationship_status', 'public.tenant_relationship_status').notNullable().defaultTo('waiting');

			tenantRelationshipsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			tenantRelationshipsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			tenantRelationshipsTbl.unique(['id', 'tenant_id']);
			tenantRelationshipsTbl.unique(['tenant_id', 'other_tenant_id', 'relationship']);
		});
	}

	// Step 5: Setup user-defined functions on the groups table for traversing the tree, etc.
	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_get_group_ancestors (IN groupid uuid)
	RETURNS TABLE (level integer, id uuid, parent_id uuid, name text)
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	RETURN QUERY
	WITH RECURSIVE q AS (
		SELECT
			1 AS level,
			A.id,
			A.parent_id,
			A.name
		FROM
			tenant_groups A
		WHERE
			A.id = groupid
		UNION ALL
		SELECT
			q.level + 1,
			B.id,
			B.parent_id,
			B.name
		FROM
			q,
			tenant_groups B
		WHERE
			B.id = q.parent_id
	)
	SELECT DISTINCT
		q.level,
		q.id,
		q.parent_id,
		q.name
	FROM
		q
	ORDER BY
		q.level;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_get_group_descendants (IN groupid uuid)
	RETURNS TABLE (level integer, id uuid, parent_id uuid, name text)
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	RETURN QUERY
	WITH RECURSIVE q AS (
		SELECT
			1 AS level,
			A.id,
			A.parent_id,
			A.name
		FROM
			tenant_groups A
		WHERE
			A.id = groupid
		UNION ALL
		SELECT
			q.level + 1,
			B.id,
			B.parent_id,
			B.name
		FROM
			q,
			tenant_groups B
		WHERE
			B.parent_id = q.id
	)
	SELECT DISTINCT
		q.level,
		q.id,
		q.parent_id,
		q.name
	FROM
		q
	ORDER BY
		q.level;
END;
$$;`
	);

	// Step 6: Enforce rules for sanity using triggers.
	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_assign_defaults_to_tenant ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	admin_group_id		UUID;
	user_group_id		UUID;
	primary_tenant_id	UUID;
BEGIN
	admin_group_id := NULL;
	user_group_id := NULL;
	primary_tenant_id := NULL;

	INSERT INTO tenant_groups (
		tenant_id,
		name,
		display_name,
		description
	)
	VALUES (
		NEW.id,
		'administrators',
		NEW.name || ' Administrators',
		'The Administrator Group for ' || NEW.name
	)
	RETURNING
		id
	INTO
		admin_group_id;

	INSERT INTO tenant_groups (
		tenant_id,
		parent_id,
		name,
		display_name,
		description,
		default_for_new_user
	)
	VALUES (
		NEW.id,
		admin_group_id,
		'users',
		NEW.name || ' Users',
		'All Users Group for ' || NEW.name,
		true
	)
	RETURNING
		id
	INTO
		user_group_id;

	SELECT
		id
	FROM
		tenants
	WHERE
		sub_domain = 'www'
	INTO
		primary_tenant_id;

	IF primary_tenant_id = NEW.id
	THEN
		RETURN NEW;
	END IF;

	INSERT INTO tenant_relationships (
		tenant_id,
		other_tenant_id,
		relationship,
		relationship_status
	)
	VALUES (
		primary_tenant_id,
		NEW.id,
		'customer',
		'authorized'
	);

	INSERT INTO tenant_relationships (
		tenant_id,
		other_tenant_id,
		relationship,
		relationship_status
	)
	VALUES (
		NEW.id,
		primary_tenant_id,
		'service_provider',
		'authorized'
	);

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_check_group_update_is_valid ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$

BEGIN
	IF OLD.parent_id <> NEW.parent_id
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Group cannot change parent';
		RETURN NULL;
	END IF;

	IF OLD.default_for_new_user = false AND NEW.default_for_new_user = true
	THEN
		UPDATE
			tenant_groups
		SET
			default_for_new_user = false
		WHERE
			tenant_id = NEW.tenant_id AND
			id <> NEW.id AND
			default_for_new_user = true;
	END IF;

	RETURN NEW;
END;
$$;`
	);

	// TODO: Setup trigger to check that the "can_create_tenants" flag is TRUE for the tenant referenced in the "created_by_tenant" field

	// Finally, create the triggers...
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_assign_defaults_to_tenant AFTER INSERT ON public.tenants FOR EACH ROW EXECUTE PROCEDURE public.fn_assign_defaults_to_tenant();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_group_update_is_valid BEFORE UPDATE ON public.tenant_groups FOR EACH ROW EXECUTE PROCEDURE public.fn_check_group_update_is_valid();');
};

exports.down = async function(knex) {
	await knex.raw('DROP TRIGGER IF EXISTS trigger_check_group_update_is_valid ON public.tenant_groups CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_assign_defaults_to_tenant ON public.tenants CASCADE;');

	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_check_group_update_is_valid () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_assign_defaults_to_tenant () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_get_group_descendants (IN uuid) CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_get_group_ancestors (IN uuid) CASCADE;`);

	await knex.raw('DROP TABLE IF EXISTS public.tenant_relationships CASCADE;');
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_groups CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_locations CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenants CASCADE;`);

	await knex.raw(`DROP TYPE IF EXISTS public.tenant_relationship_status CASCADE;`);
	await knex.raw(`DROP TYPE IF EXISTS public.tenant_relationship_type CASCADE;`);
};
