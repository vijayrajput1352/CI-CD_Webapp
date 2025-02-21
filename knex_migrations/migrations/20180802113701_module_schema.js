/**
 * This sets up the schema for servers based on the base PlantWorksServer - for e.g., the PlantWorksWebappServer
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;

	// Step 1: Setup the basics in the database
	await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public');

	// Step 2: Create the enums we need
	await knex.schema.raw("CREATE TYPE public.module_type AS ENUM ('component', 'feature', 'middleware', 'service', 'server', 'template')");
	await knex.schema.raw("CREATE TYPE public.module_deploy_type AS ENUM ('admin', 'custom', 'default')");

	// Step 3: Create the basic "modules" table
	exists = await knex.schema.withSchema('public').hasTable('modules');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('modules', (modTbl) => {
			modTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			modTbl.uuid('parent_id').references('id').inTable('modules').onDelete('CASCADE').onUpdate('CASCADE');

			modTbl.text('name').notNullable();
			modTbl.specificType('type', 'public.module_type').notNullable().defaultTo('feature');
			modTbl.specificType('deploy', 'public.module_deploy_type').notNullable().defaultTo('admin');

			modTbl.jsonb('configuration').notNullable().defaultTo('{}');
			modTbl.jsonb('configuration_schema').notNullable().defaultTo('{}');

			modTbl.jsonb('metadata').notNullable().defaultTo('{}');
			modTbl.boolean('enabled').notNullable().defaultTo(true);

			modTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			modTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			modTbl.unique(['parent_id', 'type', 'name']);
		});
	}

	// Step 4: Setup permissions table - stores details of permissions defined/described by the features
	exists = await knex.schema.withSchema('public').hasTable('module_permissions');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('module_permissions', function(permTbl) {
			permTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			permTbl.uuid('module_id').notNullable().references('id').inTable('modules').onDelete('CASCADE').onUpdate('CASCADE');

			permTbl.text('name').notNullable();
			permTbl.jsonb('implies_permissions').notNullable().defaultTo('[]');

			permTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			permTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			permTbl.unique(['id', 'module_id']);
			permTbl.unique(['module_id', 'name']);
		});
	}

	// Step 6: Setup user-defined functions on the modules table for traversing the tree, etc.
	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_get_module_ancestors (IN moduleid uuid)
	RETURNS TABLE (level integer, id uuid, parent_id uuid, name text, type public.module_type, enabled boolean)
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
			A.name,
			A.type,
			A.enabled
		FROM
			modules A
		WHERE
			A.id = moduleid
		UNION ALL
		SELECT
			q.level + 1,
			B.id,
			B.parent_id,
			B.name,
			B.type,
			B.enabled
		FROM
			q,
			modules B
		WHERE
			B.id = q.parent_id
	)
	SELECT DISTINCT
		q.level,
		q.id,
		q.parent_id,
		q.name,
		q.type,
		q.enabled
	FROM
		q
	ORDER BY
		q.level;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_get_module_descendants (IN moduleid uuid)
	RETURNS TABLE (level integer, id uuid, parent_id uuid, name text, type public.module_type, enabled boolean)
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
			A.name,
			A.type,
			A.enabled
		FROM
			modules A
		WHERE
			A.id = moduleid
		UNION ALL
		SELECT
			q.level + 1,
			B.id,
			B.parent_id,
			B.name,
			B.type,
			B.enabled
		FROM
			q,
			modules B
		WHERE
			B.parent_id = q.id
	)
	SELECT DISTINCT
		q.level,
		q.id,
		q.parent_id,
		q.name,
		q.type,
		q.enabled
	FROM
		q
	ORDER BY
		q.level;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_is_module_enabled (IN moduleid uuid)
	RETURNS boolean
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	is_disabled	integer;
BEGIN
	is_disabled := 0;

	SELECT
		COUNT(enabled)
	FROM
		fn_get_module_ancestors(moduleid)
	WHERE
		enabled = false
	INTO
		is_disabled;

	RETURN is_disabled <= 0;
END;
$$;`
	);

	// Step 7: Enforce rules for sanity using triggers.
	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_check_module_upsert_is_valid ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	parent_type	TEXT;
	is_module_in_tree	INTEGER;
BEGIN
	/* Rule #1: No obviously infinite loops */
	IF NEW.id = NEW.parent_id
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Module cannot be its own parent';
		RETURN NULL;
	END IF;

	/* Rule #2: Name and Type are not mutable */
	IF TG_OP = 'UPDATE'
	THEN
		IF OLD.name <> NEW.name
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Module name is NOT mutable';
			RETURN NULL;
		END IF;

		IF OLD.type <> NEW.type
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Module type is NOT mutable';
			RETURN NULL;
		END IF;
	END IF;

	/* Rule #3: Servers cannot have parents */
	IF NEW.type = 'server' AND NEW.parent_id IS NULL
	THEN
		RETURN NEW;
	END IF;

	IF NEW.type = 'server' AND NEW.parent_id IS NOT NULL
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Server Modules cannot have parents' ;
		RETURN NULL;
	END IF;

	/* Rule #4: All non-servers MUST have parents */
	IF NEW.type <> 'server' AND NEW.parent_id IS NULL
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Only Server Modules cannot have parents - all other module types must belong to a Server' ;
		RETURN NULL;
	END IF;

	parent_type := '';
	SELECT
		type
	FROM
		modules
	WHERE
		id = NEW.parent_id
	INTO
		parent_type;

	/* Rule #5: Modules cannot host other module types as parents - unless they are either Servers or Features */
	IF parent_type <> 'server' AND parent_type <> 'feature' AND parent_type <> CAST(NEW.type AS TEXT)
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Sub-modules must be of the same type as the parent module - except in cases of servers and features' ;
		RETURN NULL;
	END IF;

	/* Rule #6: Templates cannot have sub-modules */
	IF parent_type = 'template'
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Templates cannot have sub-modules' ;
		RETURN NULL;
	END IF;

	/* Rule #7: Only Servers/Features can have templates */
	IF NEW.type = 'template' AND (parent_type <> 'server' AND parent_type <> 'feature')
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Only servers or features can have templates';
		RETURN NULL;
	END IF;

	/* Rule #8: No non-obvious infinite loops, either */
	is_module_in_tree := 0;
	SELECT
		COUNT(id)
	FROM
		fn_get_module_ancestors(NEW.parent_id)
	WHERE
		id = NEW.id
	INTO
		is_module_in_tree;

	IF is_module_in_tree > 0
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Module cannot be its own ancestor';
		RETURN NULL;
	END IF;

	is_module_in_tree := 0;
	SELECT
		COUNT(id)
	FROM
		fn_get_module_descendants(NEW.id)
	WHERE
		id = NEW.id AND
		level > 1
	INTO
		is_module_in_tree;

	IF is_module_in_tree > 0
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Module cannot be its own descendant';
		RETURN NULL;
	END IF;

	/* We're good to go! */
	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_check_permission_upsert_is_valid ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	is_feature	INTEGER;
BEGIN
	IF TG_OP = 'UPDATE'
	THEN
		IF OLD.module_id <> NEW.module_id
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Module assigned to a permission is NOT mutable';
			RETURN NULL;
		END IF;

		IF OLD.name <> NEW.name
		THEN
			RAISE SQLSTATE '2F003' USING MESSAGE = 'Permission name is NOT mutable';
			RETURN NULL;
		END IF;
	END IF;

	is_feature := 0;
	SELECT
		COUNT(id)
	FROM
		modules
	WHERE
		id = NEW.module_id AND
		(type = 'feature' OR type = 'server')
	INTO
		is_feature;

	IF is_feature <= 0
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Only Servers and Features can define permissions';
		RETURN NULL;
	END IF;

	RETURN NEW;
END;
$$;`
	);

	// Step 8: Update outside world of goings-on using triggers.
	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_notify_module_change ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	server_name TEXT;
BEGIN
	server_name := '';

	IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE'
	THEN
		SELECT
			name
		FROM
			fn_get_module_ancestors(NEW.id)
		WHERE
			parent_id IS NULL
		INTO
			server_name;
	END IF;

	IF TG_OP = 'DELETE'
	THEN
		SELECT
			name
		FROM
			fn_get_module_ancestors(OLD.id)
		WHERE
			parent_id IS NULL
		INTO
			server_name;
	END IF;

	IF TG_OP = 'INSERT'
	THEN
		IF NEW.name = server_name
		THEN
			PERFORM pg_notify(CONCAT(server_name, '!Added'), CAST(NEW.id AS text));
		END IF;

		IF NEW.name <> server_name
		THEN
			PERFORM pg_notify(CONCAT(server_name, '!Module!Added'), CAST(NEW.id AS text));
		END IF;

		RETURN NEW;
	END IF;

	IF TG_OP = 'UPDATE'
	THEN
		IF NEW.name = server_name
		THEN
			PERFORM pg_notify(CONCAT(server_name, '!Updated'), CAST(NEW.id AS text));
		END IF;

		IF NEW.name <> server_name
		THEN
			PERFORM pg_notify(CONCAT(server_name, '!Module!Updated'), CAST(NEW.id AS text));
		END IF;

		IF OLD.configuration <> NEW.configuration
		THEN
			PERFORM pg_notify(CONCAT(server_name, '!Config!Changed'), CAST(NEW.id AS text));
		END IF;

		IF OLD.enabled <> NEW.enabled
		THEN
			PERFORM pg_notify(CONCAT(server_name, '!State!Changed'), CAST(NEW.id AS text));
		END IF;

		RETURN NEW;
	END IF;

	IF TG_OP = 'DELETE'
	THEN
		IF OLD.name = server_name
		THEN
			PERFORM pg_notify(CONCAT(server_name, '!Deleted'), CAST(OLD.id AS text));
		END IF;

		IF OLD.name <> server_name
		THEN
			PERFORM pg_notify(CONCAT(server_name, '!Module!Deleted'), CAST(OLD.id AS text));
		END IF;

		RETURN OLD;
	END IF;
END;
$$;`
	);

	// Finally, create the triggers...
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_module_upsert_is_valid BEFORE INSERT OR UPDATE ON public.modules FOR EACH ROW EXECUTE PROCEDURE public.fn_check_module_upsert_is_valid();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_permission_upsert_is_valid BEFORE INSERT OR UPDATE ON public.module_permissions FOR EACH ROW EXECUTE PROCEDURE public.fn_check_permission_upsert_is_valid();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_notify_module_change AFTER UPDATE ON public.modules FOR EACH ROW EXECUTE PROCEDURE public.fn_notify_module_change();');
};

exports.down = async function(knex) {
	await knex.raw(`DROP TRIGGER IF EXISTS trigger_notify_module_change ON public.modules CASCADE;`);
	await knex.raw(`DROP TRIGGER IF EXISTS trigger_check_permission_upsert_is_valid ON public.module_permissions CASCADE;`);
	await knex.raw(`DROP TRIGGER IF EXISTS trigger_check_module_upsert_is_valid ON public.modules CASCADE;`);

	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_notify_module_change () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_check_permission_upsert_is_valid () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_check_module_upsert_is_valid () CASCADE;`);

	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_is_module_enabled (IN uuid) CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_get_module_descendants (IN uuid) CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_get_module_ancestors (IN uuid) CASCADE;`);

	await knex.raw(`DROP TABLE IF EXISTS public.module_permissions CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.modules CASCADE;`);

	await knex.raw(`DROP TYPE IF EXISTS public.module_type CASCADE;`);
	await knex.raw(`DROP TYPE IF EXISTS public.module_deploy_type CASCADE;`);

	await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;');
};
