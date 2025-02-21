
exports.up = async function(knex) {
	// Add trigger for tenant_attribute_set_properties;
	await knex.raw(`
CREATE OR REPLACE FUNCTION notify_tenant_attribute_set_properties_cud() RETURNS TRIGGER AS $$
    DECLARE
    row RECORD;
	output JSONB;
	row_obj JSONB;
	payload JSONB;
  final_payload JSONB;

    BEGIN
    -- Checking the Operation Type
    IF (TG_OP = 'DELETE') THEN
      row = OLD;
    ELSE
      row = NEW;
    END IF;

    -- Forming the Output as notification. You can choose you own notification.
	output = jsonb_build_object('operation', TG_OP);
	row_obj = jsonb_build_object('row', to_jsonb(row));
	payload = output || row_obj;
  final_payload = jsonb_build_object('id', jsonb_extract_path_text(payload, 'row', 'id'), 'operation', jsonb_extract_path_text(payload, 'operation'));


    -- Calling the pg_notify for my_table_update event with output as final_payload

    PERFORM pg_notify('tenant_attribute_set_properties_cud'::text, final_payload::text);

    -- Returning null because it is an after trigger.
    RETURN NULL;
    END;
$$ LANGUAGE plpgsql;
`);

	await knex.raw(`CREATE TRIGGER trigger_tenant_attribute_set_properties_cud AFTER INSERT OR UPDATE OR DELETE ON tenant_attribute_set_properties FOR EACH ROW EXECUTE PROCEDURE notify_tenant_attribute_set_properties_cud();`);

	// Add trigger for tenant_attribute_sets;
	await knex.raw(`
CREATE OR REPLACE FUNCTION notify_tenant_attribute_sets_cud() RETURNS TRIGGER AS $$
    DECLARE
    row RECORD;
	output JSONB;
	row_obj JSONB;
	payload JSONB;
  final_payload JSONB;

    BEGIN
    -- Checking the Operation Type
    IF (TG_OP = 'DELETE') THEN
      row = OLD;
    ELSE
      row = NEW;
    END IF;

    -- Forming the Output as notification. You can choose you own notification.
	output = jsonb_build_object('operation', TG_OP);
	row_obj = jsonb_build_object('row', to_jsonb(row));
	payload = output || row_obj;
  final_payload = jsonb_build_object('id', jsonb_extract_path_text(payload, 'row', 'id'), 'operation', jsonb_extract_path_text(payload, 'operation'));


    -- Calling the pg_notify for my_table_update event with output as final_payload

    PERFORM pg_notify('tenant_attribute_sets_cud'::text, final_payload::text);

    -- Returning null because it is an after trigger.
    RETURN NULL;
    END;
$$ LANGUAGE plpgsql;
`);

	await knex.raw(`CREATE TRIGGER trigger_tenant_attribute_sets_cud AFTER INSERT OR UPDATE OR DELETE ON tenant_attribute_sets FOR EACH ROW EXECUTE PROCEDURE notify_tenant_attribute_sets_cud();`);

};

exports.down = async function(knex) {
	await knex.raw(`DROP TRIGGER IF EXISTS trigger_tenant_attribute_sets_cud ON tenant_attribute_sets CASCADE`);
	await knex.raw(`DROP FUNCTION IF EXISTS notify_tenant_attribute_sets_cud CASCADE`);

	await knex.raw(`DROP TRIGGER IF EXISTS trigger_tenant_attribute_set_properties_cud ON tenant_attribute_set_properties CASCADE`);
	await knex.raw(`DROP FUNCTION IF EXISTS notify_tenant_attribute_set_properties_cud CASCADE`);
};
