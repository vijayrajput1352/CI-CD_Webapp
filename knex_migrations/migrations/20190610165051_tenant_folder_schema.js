/**
 * This sets up the schema for tenant folders
 * @ignore
 */
exports.up = async function(knex) {
	let exists = await knex.schema.withSchema('public').hasTable('tenant_folders');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_folders', function(tenantFolderTbl) {
			tenantFolderTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			tenantFolderTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			tenantFolderTbl.uuid('parent_id');

			tenantFolderTbl.text('name').notNullable();
			tenantFolderTbl.text('description');

			tenantFolderTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			tenantFolderTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			tenantFolderTbl.unique(['id', 'tenant_id']);
			tenantFolderTbl.unique(['parent_id', 'name']);

			tenantFolderTbl.foreign(['parent_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_folders').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_get_folder_ancestors (IN folderid uuid)
	RETURNS TABLE (level integer, id uuid,  parent_id uuid,  name text)
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
			tenant_folders A
		WHERE
			A.id = folderid
		UNION ALL
		SELECT
			q.level + 1,
			B.id,
			B.parent_id,
			B.name
		FROM
			q,
			tenant_folders B
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
`CREATE OR REPLACE FUNCTION public.fn_get_folder_descendants (IN folderid uuid)
	RETURNS TABLE (level integer,  id uuid,  parent_id uuid,  name text)
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
			tenant_folders A
		WHERE
			A.id = folderid
		UNION ALL
		SELECT
			q.level + 1,
			B.id,
			B.parent_id,
			B.name
		FROM
			q,
			tenant_folders B
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

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_check_folder_upsert_is_valid ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	is_folder_in_tree	INTEGER;
BEGIN
	/* Rule #1: No obviously infinite loops */
	IF NEW.id = NEW.parent_id
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Folder cannot be its own parent';
		RETURN NULL;
	END IF;

	/* Rule #2: No non-obvious infinite loops, either */
	is_folder_in_tree := 0;
	SELECT
		COUNT(id)
	FROM
		fn_get_folder_ancestors(NEW.parent_id)
	WHERE
		id = NEW.id
	INTO
		is_folder_in_tree;

	IF is_folder_in_tree > 0
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Folder cannot be its own ancestor';
		RETURN NULL;
	END IF;

	is_folder_in_tree := 0;
	SELECT
		COUNT(id)
	FROM
		fn_get_folder_descendants(NEW.id)
	WHERE
		id = NEW.id AND
		level > 1
	INTO
		is_folder_in_tree;

	IF is_folder_in_tree > 0
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Folder cannot be its own descendant';
		RETURN NULL;
	END IF;

	/* We're good to go! */
	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_folder_upsert_is_valid BEFORE INSERT OR UPDATE ON public.tenant_folders FOR EACH ROW EXECUTE PROCEDURE public.fn_check_folder_upsert_is_valid();');
};

exports.down = async function(knex) {
	await knex.raw('DROP TRIGGER IF EXISTS trigger_check_folder_upsert_is_valid ON public.tenant_folders CASCADE;');

	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_check_folder_upsert_is_valid () CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_get_folder_descendants (IN uuid) CASCADE;`);
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_get_folder_ancestors (IN uuid) CASCADE;`);

	await knex.raw(`DROP TABLE IF EXISTS public.tenant_folders CASCADE;`);
};
