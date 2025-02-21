/**
 * This sets up the schema for attribute sets, the data points for each set, and the functions that operate on them
 * @ignore
 */
exports.up = async function(knex) {
	let exists = null;

	exists = await knex.schema.withSchema('public').hasTable('tenant_attribute_sets');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_attribute_sets', function(AttributeSetsTbl) {
			AttributeSetsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			AttributeSetsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			AttributeSetsTbl.uuid('tenant_module_id').notNullable();

			AttributeSetsTbl.uuid('tenant_folder_id').notNullable();
			AttributeSetsTbl.text('name').notNullable();
			AttributeSetsTbl.text('description');

			AttributeSetsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			AttributeSetsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			AttributeSetsTbl.unique(['id', 'tenant_id']);

			AttributeSetsTbl.foreign(['tenant_module_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenants_modules').onDelete('CASCADE').onUpdate('CASCADE');
			AttributeSetsTbl.foreign(['tenant_folder_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_folders').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_attribute_set_processor');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_attribute_set_processor', function(AttributeProcessorTbl) {
			AttributeProcessorTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			AttributeProcessorTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			AttributeProcessorTbl.uuid('attribute_set_id').notNullable();

			AttributeProcessorTbl.text('processor').notNullable();
			AttributeProcessorTbl.timestamp('effectivity_start').notNullable().defaultTo(knex.fn.now());
			AttributeProcessorTbl.timestamp('effectivity_end').defaultTo(knex.fn.now());

			AttributeProcessorTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			AttributeProcessorTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			AttributeProcessorTbl.unique(['id', 'tenant_id']);
			AttributeProcessorTbl.foreign(['attribute_set_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_attribute_sets').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_attribute_set_properties');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_attribute_set_properties', function(AttributePropertiesTbl) {
			AttributePropertiesTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			AttributePropertiesTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			AttributePropertiesTbl.uuid('attribute_set_id').notNullable();

			AttributePropertiesTbl.text('name').notNullable();
			AttributePropertiesTbl.text('description');

			AttributePropertiesTbl.text('internal_tag').notNullable();
			AttributePropertiesTbl.text('evaluation_expression');

			AttributePropertiesTbl.text('units');

			AttributePropertiesTbl.specificType('source', 'public.attribute_source_type').notNullable().defaultTo('static');
			AttributePropertiesTbl.specificType('datatype', 'public.attribute_value_type').notNullable().defaultTo('number');
			AttributePropertiesTbl.specificType('timestamp_format', 'public.attribute_timestamp_type').notNullable().defaultTo('not_a_timestamp');

			AttributePropertiesTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			AttributePropertiesTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			AttributePropertiesTbl.unique(['id', 'tenant_id']);
			AttributePropertiesTbl.unique(['id', 'attribute_set_id']);
			AttributePropertiesTbl.foreign(['attribute_set_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_attribute_sets').onDelete('CASCADE').onUpdate('CASCADE');
		});

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_attribute_set_id_name ON public.tenant_attribute_set_properties
			USING btree
			(
				attribute_set_id ASC,
				name ASC
			)`
		);

		await knex.schema.withSchema('public').raw(`
			CREATE UNIQUE INDEX uidx_tenant_attribute_set_id_internal_tag ON public.tenant_attribute_set_properties
			USING btree
			(
				attribute_set_id ASC,
				internal_tag ASC
			)`
		);
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_attribute_set_functions');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_attribute_set_functions', function(AttributeFunctionsTbl) {
			AttributeFunctionsTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			AttributeFunctionsTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');
			AttributeFunctionsTbl.uuid('attribute_set_id').notNullable();

			AttributeFunctionsTbl.text('name').notNullable();
			AttributeFunctionsTbl.text('description');

			AttributeFunctionsTbl.specificType('type', 'public.attribute_function_type').notNullable().defaultTo('observer');
			AttributeFunctionsTbl.integer('execution_order').notNullable().defaultTo(1);
			AttributeFunctionsTbl.text('code');

			AttributeFunctionsTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			AttributeFunctionsTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			AttributeFunctionsTbl.unique(['id', 'tenant_id']);
			AttributeFunctionsTbl.unique(['id', 'attribute_set_id']);
			AttributeFunctionsTbl.unique(['attribute_set_id', 'type', 'name']);

			AttributeFunctionsTbl.foreign(['attribute_set_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_attribute_sets').onDelete('CASCADE').onUpdate('CASCADE');
		});
	}

	exists = await knex.schema.withSchema('public').hasTable('tenant_attribute_set_function_observed_properties');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_attribute_set_function_observed_properties', function(AttributeFunctionObservedPropertiesTbl) {
			AttributeFunctionObservedPropertiesTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));;
			AttributeFunctionObservedPropertiesTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			AttributeFunctionObservedPropertiesTbl.uuid('attribute_set_id').notNullable();
			AttributeFunctionObservedPropertiesTbl.uuid('attribute_set_function_id').notNullable();
			AttributeFunctionObservedPropertiesTbl.uuid('attribute_set_property_id').notNullable();

			AttributeFunctionObservedPropertiesTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			AttributeFunctionObservedPropertiesTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			AttributeFunctionObservedPropertiesTbl.unique(['id', 'tenant_id']);
			AttributeFunctionObservedPropertiesTbl.unique(['attribute_set_function_id', 'attribute_set_property_id']);
		});

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE public.tenant_attribute_set_function_observed_properties
			ADD CONSTRAINT fk_tenant_attr_set_fn_observed_prop_attribute_set_fn
			FOREIGN KEY (
				attribute_set_function_id,
				attribute_set_id
			)
			REFERENCES tenant_attribute_set_functions (
				id,
				attribute_set_id
			)
			ON UPDATE CASCADE
			ON DELETE CASCADE`
		);

		await knex.schema.withSchema('public').raw(`
			ALTER TABLE public.tenant_attribute_set_function_observed_properties
			ADD CONSTRAINT fk_tenant_attr_set_fn_observed_prop_attribute_set_prop
			FOREIGN KEY (
				attribute_set_property_id,
				attribute_set_id
			)
			REFERENCES tenant_attribute_set_properties (
				id,
				attribute_set_id
			)
			ON UPDATE CASCADE
			ON DELETE CASCADE`
		);
	}
};

exports.down = async function(knex) {
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_attribute_set_function_observed_properties CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_attribute_set_functions CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_attribute_set_properties CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_attribute_set_processor CASCADE;`);
	await knex.raw(`DROP TABLE IF EXISTS public.tenant_attribute_sets CASCADE;`);
};
