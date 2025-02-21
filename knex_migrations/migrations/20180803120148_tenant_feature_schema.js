/**
 * This sets up the schema for mapping features to tenants, and vice-versa
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;

	// Step 1: Create the "tenants_modules" table
	exists = await knex.schema.withSchema('public').hasTable('tenants_modules');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenants_modules', function(tenantFeatureTbl) {
			tenantFeatureTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));

			tenantFeatureTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			tenantFeatureTbl.uuid('module_id').notNullable().references('id').inTable('modules').onDelete('CASCADE').onUpdate('CASCADE');

			tenantFeatureTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			tenantFeatureTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			tenantFeatureTbl.unique(['id', 'tenant_id']);
			tenantFeatureTbl.unique(['tenant_id', 'module_id']);
		});
	}

	// Step 2: Create the "tenant_group_permissions" table
	exists = await knex.schema.withSchema('public').hasTable('tenant_group_permissions');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_group_permissions', function(groupPermissionTbl) {
			groupPermissionTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));

			groupPermissionTbl.uuid('tenant_id').notNullable();
			groupPermissionTbl.uuid('tenant_group_id').notNullable();

			groupPermissionTbl.uuid('module_id').notNullable();
			groupPermissionTbl.uuid('module_permission_id').notNullable();

			groupPermissionTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			groupPermissionTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			groupPermissionTbl.unique(['id', 'tenant_id']);
			groupPermissionTbl.unique(['tenant_group_id', 'module_permission_id']);

			groupPermissionTbl.foreign(['tenant_id', 'module_id']).references(['tenant_id', 'module_id']).inTable('tenants_modules').onDelete('CASCADE').onUpdate('CASCADE');
			groupPermissionTbl.foreign(['module_permission_id', 'module_id']).references(['id', 'module_id']).inTable('module_permissions').onDelete('CASCADE').onUpdate('CASCADE');
			groupPermissionTbl.foreign(['tenant_group_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_groups').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	// Step 3: Create the "tenant_server_templates" table
	exists = await knex.schema.withSchema('public').hasTable('tenant_server_templates');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_server_templates', function(tmplTbl) {
			tmplTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));

			tmplTbl.uuid('tenant_id').notNullable();
			tmplTbl.uuid('module_id').notNullable();
			tmplTbl.uuid('base_template_id').notNullable();

			tmplTbl.text('name').notNullable();
			tmplTbl.text('relative_path_to_index').notNullable().defaultTo('index.html');
			tmplTbl.boolean('default').notNullable().defaultTo(false);

			tmplTbl.jsonb('configuration').notNullable().defaultTo('{}');
			tmplTbl.jsonb('configuration_schema').notNullable().defaultTo('{}');

			tmplTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			tmplTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			tmplTbl.unique(['id', 'tenant_id']);
			tmplTbl.foreign(['tenant_id', 'module_id']).references(['tenant_id', 'module_id']).inTable('tenants_modules').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	// Step 6: Setup user-defined functions on the tenant_server_templates table for getting the template for a tenant for a server
	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_get_tenant_server_template (IN tenantid uuid, IN moduleid uuid)
	RETURNS TABLE (base_template text, base_template_configuration jsonb, tenant_domain text, tmpl_name text, path_to_index text, configuration jsonb)
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	tenant_uuid			UUID;
	base_tmpl_id		UUID;
	base_template		TEXT;
	base_tmpl_config	JSONB;
	tenant_domain		TEXT;
	tmpl_name			TEXT;
	index_path			TEXT;
	configuration		JSONB;
BEGIN
	tenant_uuid			:= NULL;
	base_tmpl_id		:= NULL;
	base_template		:= NULL;
	base_tmpl_config	:= NULL;
	tenant_domain		:= NULL;
	tmpl_name			:= NULL;
	index_path			:= NULL;
	configuration		:= NULL;

	IF tenantid IS NULL
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Tenant ID is required';
		RETURN;
	END IF;

	IF moduleid IS NULL
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Server ID is required';
		RETURN;
	END IF;

	SELECT
		A.sub_domain,
		B.base_template_id,
		B.name,
		B.relative_path_to_index,
		B.configuration
	FROM
		tenants A LEFT OUTER JOIN
		tenant_server_templates B ON (B.tenant_id = A.id)
	WHERE
		A.id = tenantid AND
		A.enabled = true AND
		B.module_id = moduleid AND
		coalesce(B.default, false) = true
	INTO
		tenant_domain,
		base_tmpl_id,
		tmpl_name,
		index_path,
		configuration;

	IF tmpl_name IS NOT NULL
	THEN
		SELECT
			A.name,
			A.configuration
		FROM
			modules A
		WHERE
			A.id = base_tmpl_id AND
			A.type = 'template'
		INTO
			base_template,
			base_tmpl_config;

		RETURN QUERY SELECT base_template, base_tmpl_config, tenant_domain, tmpl_name, index_path, configuration;
		RETURN;
	END IF;

	IF tenant_domain IS NULL
	THEN
		tenant_domain := '.www';
	END IF;

	SELECT
		A.id
	FROM
		tenants A
	WHERE
		A.sub_domain = (SELECT array_to_string(ARRAY(SELECT unnest(string_to_array(tenant_domain, '.')) OFFSET 1), '.'))
	INTO
		tenant_uuid;

	RETURN QUERY
	SELECT
		*
	FROM
		fn_get_tenant_server_template(tenant_uuid, moduleid);
END;
$$;`
	);

	// Step 7: Enforce rules for sanity using triggers.
	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_check_tenant_feature_upsert_is_valid ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	is_feature			INTEGER;
	is_admin_only		INTEGER;
	feature_parent		UUID;
	tenant_sub_domain	TEXT;
BEGIN
	is_feature := 0;
	SELECT
		count(id)
	FROM
		modules
	WHERE
		id = NEW.module_id AND
		(type = 'feature' OR type = 'server')
	INTO
		is_feature;

	IF is_feature <= 0
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Only Servers and Features can be mapped to tenants';
		RETURN NULL;
	END IF;

	feature_parent := NULL;
	SELECT
		parent_id
	FROM
		modules
	WHERE
		id = NEW.module_id
	INTO
		feature_parent;

	IF feature_parent IS NULL
	THEN
		RETURN NEW;
	END IF;

	is_feature := 0;
	SELECT
		count(id)
	FROM
		tenants_modules
	WHERE
		tenant_id = NEW.tenant_id AND
		module_id = feature_parent
	INTO
		is_feature;

	IF is_feature = 0
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Parent feature not mapped to this Tenant';
	END IF;

	is_admin_only := 0;
	SELECT
		COUNT(deploy)
	FROM
		modules
	WHERE
		id IN (SELECT id FROM fn_get_module_ancestors(NEW.module_id)) AND
		type <> 'server' AND
		deploy <> 'default' AND
		deploy <> 'custom'
	INTO
		is_admin_only;

	IF is_admin_only = 0
	THEN
		RETURN NEW;
	END IF;

	tenant_sub_domain := '';
	SELECT
		sub_domain
	FROM
		tenants
	WHERE
		id = NEW.tenant_id
	INTO
		tenant_sub_domain;

	IF tenant_sub_domain <> 'www'
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Admin only features can be mapped only to root tenant';
		RETURN NULL;
	END IF;

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_assign_new_feature_to_tenants ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	is_admin_feature	INTEGER;
BEGIN
	IF NEW.type <> 'feature' AND NEW.type <> 'server'
	THEN
		RETURN NEW;
	END IF;

	is_admin_feature := 0;
	SELECT
		COUNT(deploy)
	FROM
		modules
	WHERE
		id IN (SELECT id FROM fn_get_module_ancestors(NEW.id)) AND
		type <> 'server' AND
		deploy <> 'default'
	INTO
		is_admin_feature;

	IF NEW.type = 'server' OR (NEW.type = 'feature' AND is_admin_feature = 0)
	THEN
		INSERT INTO tenants_modules (
			tenant_id,
			module_id
		)
		SELECT
			id,
			NEW.id
		FROM
			tenants;

		RETURN NEW;
	END IF;

	INSERT INTO tenants_modules (
		tenant_id,
		module_id
	)
	SELECT
		id,
		NEW.id
	FROM
		tenants
	WHERE
		sub_domain = 'www';

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_assign_features_to_new_tenants ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	server_record	RECORD;
	server_cursor 	CURSOR FOR SELECT id FROM modules WHERE parent_id IS NULL AND type = 'server';

	feature_record	RECORD;
	feature_cursor	CURSOR (server_id UUID) FOR SELECT id FROM fn_get_module_descendants(server_id) WHERE level > 1 AND type = 'feature' ORDER BY level ASC;

	is_admin_feature	INTEGER;
BEGIN
	OPEN server_cursor;
	LOOP
		FETCH server_cursor INTO server_record;
		EXIT WHEN NOT FOUND;

		INSERT INTO tenants_modules (
			tenant_id,
			module_id
		)
		VALUES (
			NEW.id,
			server_record.id
		);

		OPEN feature_cursor(server_record.id);
		LOOP
			FETCH feature_cursor INTO feature_record;
			EXIT WHEN NOT FOUND;

			is_admin_feature := 0;
			SELECT
				COUNT(deploy)
			FROM
				modules
			WHERE
				id IN (SELECT id FROM fn_get_module_ancestors(feature_record.id)) AND
				type <> 'server' AND
				deploy <> 'default'
			INTO
				is_admin_feature;

			IF is_admin_feature = 0
			THEN
				INSERT INTO tenants_modules (
					tenant_id,
					module_id
				)
				VALUES (
					NEW.id,
					feature_record.id
				);
			END IF;

			IF is_admin_feature = 1 AND NEW.sub_domain = 'www'
			THEN
				INSERT INTO tenants_modules (
					tenant_id,
					module_id
				)
				VALUES (
					NEW.id,
					feature_record.id
				);
			END IF;
		END LOOP;

		CLOSE feature_cursor;
	END LOOP;

	CLOSE server_cursor;
	RETURN NEW;
END;
$$;`
	);

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

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_assign_module_permissions_to_new_tenant ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	admin_group_id	UUID;
BEGIN
	admin_group_id := NULL;
	SELECT
		id
	FROM
		tenant_groups
	WHERE
		tenant_id = NEW.tenant_id AND
		parent_id IS NULL
	INTO
		admin_group_id;

	INSERT INTO
		tenant_group_permissions (
			tenant_id,
			tenant_group_id,
			module_id,
			module_permission_id
		)
	SELECT
		NEW.tenant_id,
		admin_group_id,
		NEW.module_id,
		id
	FROM
		module_permissions
	WHERE
		module_id = NEW.module_id;

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_add_descendant_feature_to_tenant ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	INSERT INTO tenants_modules (
		tenant_id,
		module_id
	)
	SELECT
		NEW.id,
		id
	FROM
		modules
	WHERE
		id IN (SELECT id FROM fn_get_module_descendants(NEW.id) WHERE level = 2) AND
		type = 'feature' AND
		deploy = 'default';

	RETURN NEW;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_descendant_feature_from_tenant ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenants_modules
	WHERE
		tenant_id = OLD.tenant_id AND
		module_id IN (SELECT id FROM fn_get_module_descendants(OLD.module_id) WHERE level = 2);

	UPDATE
		tenants_users
	SET
		default_application = NULL
	WHERE
		tenant_id = OLD.tenant_id AND
		default_application = OLD.module_id;

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_remove_group_permission_from_descendants ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
BEGIN
	DELETE FROM
		tenant_group_permissions
	WHERE
		tenant_group_id IN (SELECT id FROM fn_get_group_descendants(OLD.tenant_group_id) WHERE level = 2) AND
		module_permission_id = OLD.module_permission_id;

	RETURN OLD;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_check_group_permission_upsert_is_valid ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	parent_group_id						UUID;
	does_parent_group_have_permission	INTEGER;
BEGIN
	parent_group_id := NULL;
	SELECT
		parent_id
	FROM
		tenant_groups
	WHERE
		id = NEW.id AND
		tenant_id = NEW.tenant_id
	INTO
		parent_group_id;

	IF parent_group_id IS NULL
	THEN
		RETURN NEW;
	END IF;

	does_parent_group_have_permission := 0;
	SELECT
		COUNT(tenant_group_id)
	FROM
		tenant_group_permissions
	WHERE
		tenant_group_id = parent_group_id AND
		module_permission_id = NEW.module_permission_id
	INTO
		does_parent_group_have_permission;

	IF does_parent_group_have_permission > 0
	THEN
		RETURN NEW;
	END IF;

	RAISE SQLSTATE '2F003' USING MESSAGE = 'Parent Group does not have this permission';
	RETURN NULL;
END;
$$;`
	);

	await knex.schema.withSchema('public').raw(
`CREATE OR REPLACE FUNCTION public.fn_check_tenant_server_template_upsert_is_valid ()
	RETURNS trigger
	LANGUAGE plpgsql
	VOLATILE
	CALLED ON NULL INPUT
	SECURITY INVOKER
	COST 1
	AS $$
DECLARE
	is_server			INTEGER;
BEGIN
	is_server := 0;
	SELECT
		count(type)
	FROM
		modules
	WHERE
		id = NEW.module_id AND
		type = 'server'
	INTO
		is_server;

	IF is_server <= 0
	THEN
		RAISE SQLSTATE '2F003' USING MESSAGE = 'Only Servers can be mapped to Tenant Templates';
		RETURN NULL;
	END IF;

	RETURN NEW;
END;
$$;`
	);

	// Finally, create the triggers...
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_tenant_feature_upsert_is_valid BEFORE INSERT OR UPDATE ON public.tenants_modules FOR EACH ROW EXECUTE PROCEDURE public.fn_check_tenant_feature_upsert_is_valid();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_assign_feature_to_tenant AFTER INSERT ON public.modules FOR EACH ROW EXECUTE PROCEDURE public.fn_assign_new_feature_to_tenants();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_assign_tenant_to_feature AFTER INSERT ON public.tenants FOR EACH ROW EXECUTE PROCEDURE public.fn_assign_features_to_new_tenants();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_assign_new_module_permissions_to_tenant AFTER INSERT ON public.module_permissions FOR EACH ROW EXECUTE PROCEDURE public.fn_assign_new_module_permissions_to_tenant();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_assign_module_permissions_to_new_tenant AFTER INSERT ON public.tenants_modules FOR EACH ROW EXECUTE PROCEDURE public.fn_assign_module_permissions_to_new_tenant();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_add_descendant_feature_to_tenant AFTER INSERT ON public.tenants_modules FOR EACH ROW EXECUTE PROCEDURE public.fn_add_descendant_feature_to_tenant();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_descendant_feature_from_tenant AFTER DELETE ON public.tenants_modules FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_descendant_feature_from_tenant();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_remove_group_permission_from_descendants AFTER DELETE ON public.tenant_group_permissions FOR EACH ROW EXECUTE PROCEDURE public.fn_remove_group_permission_from_descendants();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_group_permission_upsert_is_valid BEFORE INSERT OR UPDATE ON public.tenant_group_permissions FOR EACH ROW EXECUTE PROCEDURE public.fn_check_group_permission_upsert_is_valid();');
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_check_tenant_server_template_upsert_is_valid BEFORE INSERT OR UPDATE ON public.tenant_server_templates FOR EACH ROW EXECUTE PROCEDURE public.fn_check_tenant_server_template_upsert_is_valid();');
};

exports.down = async function(knex) {
	await knex.raw('DROP TRIGGER IF EXISTS trigger_check_tenant_server_template_upsert_is_valid ON public.tenant_server_templates CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_check_group_permission_upsert_is_valid ON public.tenant_group_permissions CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_group_permission_from_descendants ON public.tenant_group_permissions CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_assign_new_module_permissions_to_tenant ON public.module_permissions CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_assign_module_permissions_to_new_tenant ON public.tenants_modules CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_remove_descendant_feature_from_tenant ON public.tenants_modules CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_add_descendant_feature_to_tenant ON public.tenants_modules CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_check_tenant_feature_upsert_is_valid ON public.tenants_modules CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_assign_new_module_permissions_to_tenant ON public.module_permissions CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_assign_tenant_to_feature ON public.tenants CASCADE;');
	await knex.raw('DROP TRIGGER IF EXISTS trigger_assign_feature_to_tenant ON public.modules CASCADE;');

	await knex.raw('DROP FUNCTION IF EXISTS public.fn_check_tenant_server_template_upsert_is_valid () CASCADE;');
	await knex.raw('DROP FUNCTION IF EXISTS public.fn_check_group_permission_upsert_is_valid () CASCADE;');
	await knex.raw('DROP FUNCTION IF EXISTS public.fn_remove_group_permission_from_descendants () CASCADE;');
	await knex.raw('DROP FUNCTION IF EXISTS public.fn_remove_descendant_feature_from_tenant () CASCADE;');
	await knex.raw('DROP FUNCTION IF EXISTS public.fn_add_descendant_feature_to_tenant () CASCADE;');
	await knex.raw('DROP FUNCTION IF EXISTS public.fn_assign_module_permissions_to_new_tenant () CASCADE;');
	await knex.raw('DROP FUNCTION IF EXISTS public.fn_assign_new_module_permissions_to_tenant () CASCADE;');
	await knex.raw('DROP FUNCTION IF EXISTS public.fn_check_tenant_feature_upsert_is_valid () CASCADE;');
	await knex.raw('DROP FUNCTION IF EXISTS public.fn_assign_features_to_new_tenants () CASCADE;');
	await knex.raw('DROP FUNCTION IF EXISTS public.fn_assign_new_feature_to_tenants () CASCADE;');
	await knex.raw(`DROP FUNCTION IF EXISTS public.fn_get_tenant_server_template (IN uuid, IN uuid)`);

	await knex.raw(`DROP TABLE IF EXISTS public.tenant_server_templates CASCADE;`);
	await knex.raw('DROP TABLE IF EXISTS public.tenant_group_permissions CASCADE;');
	await knex.raw('DROP TABLE IF EXISTS public.tenants_modules CASCADE;');
};
