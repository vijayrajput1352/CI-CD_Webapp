
exports.up = async function(knex) {
	// Add trigger for tenant_plant_unit_machine_statistics;
	await knex.raw(`
CREATE OR REPLACE FUNCTION notify_tenant_plant_unit_machine_statistics_cud() RETURNS TRIGGER AS $$
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

    PERFORM pg_notify('tenant_plant_unit_machine_statistics_cud'::text, final_payload::text);

    -- Returning null because it is an after trigger.
    RETURN NULL;
    END;
$$ LANGUAGE plpgsql;
`);

	await knex.raw(`CREATE TRIGGER trigger_tenant_plant_unit_machine_statistics_cud AFTER INSERT OR UPDATE OR DELETE ON tenant_plant_unit_machine_statistics FOR EACH ROW EXECUTE PROCEDURE notify_tenant_plant_unit_machine_statistics_cud();`);

	// Add trigger for users;
	await knex.raw(`
CREATE OR REPLACE FUNCTION notify_users_cud() RETURNS TRIGGER AS $$
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

    PERFORM pg_notify('users_cud'::text, final_payload::text);

    -- Returning null because it is an after trigger.
    RETURN NULL;
    END;
$$ LANGUAGE plpgsql;
`);

	await knex.raw(`CREATE TRIGGER trigger_users_cud AFTER INSERT OR UPDATE OR DELETE ON users FOR EACH ROW EXECUTE PROCEDURE notify_users_cud();`);

	// Add trigger for user_contacts;
	await knex.raw(`
CREATE OR REPLACE FUNCTION notify_user_contacts_cud() RETURNS TRIGGER AS $$
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

    PERFORM pg_notify('user_contacts_cud'::text, final_payload::text);

    -- Returning null because it is an after trigger.
    RETURN NULL;
    END;
$$ LANGUAGE plpgsql;
`);

	await knex.raw(`CREATE TRIGGER trigger_user_contacts_cud AFTER INSERT OR UPDATE OR DELETE ON user_contacts FOR EACH ROW EXECUTE PROCEDURE notify_user_contacts_cud();`);

	// Add trigger for user_social_logins;
	await knex.raw(`
CREATE OR REPLACE FUNCTION notify_user_social_logins_cud() RETURNS TRIGGER AS $$
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

    PERFORM pg_notify('user_social_logins_cud'::text, final_payload::text);

    -- Returning null because it is an after trigger.
    RETURN NULL;
    END;
$$ LANGUAGE plpgsql;
`);

	await knex.raw(`CREATE TRIGGER trigger_user_social_logins_cud AFTER INSERT OR UPDATE OR DELETE ON user_social_logins FOR EACH ROW EXECUTE PROCEDURE notify_user_social_logins_cud();`);

  // Add trigger for tenant_plant_unit_lines_users;
	await knex.raw(`
CREATE OR REPLACE FUNCTION notify_tenant_plant_unit_lines_users_cud() RETURNS TRIGGER AS $$
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

    PERFORM pg_notify('tenant_plant_unit_lines_users_cud'::text, final_payload::text);

    -- Returning null because it is an after trigger.
    RETURN NULL;
    END;
$$ LANGUAGE plpgsql;
`);

	await knex.raw(`CREATE TRIGGER trigger_tenant_plant_unit_lines_users_cud AFTER INSERT OR UPDATE OR DELETE ON tenant_plant_unit_lines_users FOR EACH ROW EXECUTE PROCEDURE notify_tenant_plant_unit_lines_users_cud();`);

	// Add trigger for tenant_emd_data;
	await knex.raw(`
CREATE OR REPLACE FUNCTION notify_tenant_emd_data_cud() RETURNS TRIGGER AS $$
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

    PERFORM pg_notify('tenant_emd_data_cud'::text, final_payload::text);

    -- Returning null because it is an after trigger.
    RETURN NULL;
    END;
$$ LANGUAGE plpgsql;
`);

	await knex.raw(`CREATE TRIGGER trigger_tenant_emd_data_cud AFTER INSERT OR UPDATE OR DELETE ON tenant_emd_data FOR EACH ROW EXECUTE PROCEDURE notify_tenant_emd_data_cud();`);

	// Add trigger for tenant_work_orders;
	await knex.raw(`
CREATE OR REPLACE FUNCTION notify_tenant_work_orders_cud() RETURNS TRIGGER AS $$
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
  final_payload = jsonb_build_object('tenant_id', jsonb_extract_path_text(payload, 'row', 'tenant_id'), 'work_order_id', jsonb_extract_path_text(payload, 'row', 'work_order_id'), 'operation', jsonb_extract_path_text(payload, 'operation'));


    -- Calling the pg_notify for my_table_update event with output as final_payload

    PERFORM pg_notify('tenant_work_orders_cud'::text, final_payload::text);

    -- Returning null because it is an after trigger.
    RETURN NULL;
    END;
$$ LANGUAGE plpgsql;
`);

	await knex.raw(`CREATE TRIGGER trigger_tenant_work_orders_cud AFTER INSERT OR UPDATE OR DELETE ON tenant_work_orders FOR EACH ROW EXECUTE PROCEDURE notify_tenant_work_orders_cud();`);


};

exports.down = async function(knex) {
  	await knex.raw(`DROP TRIGGER IF EXISTS trigger_tenant_work_orders_cud ON tenant_work_orders CASCADE`);
	await knex.raw(`DROP FUNCTION IF EXISTS notify_tenant_work_orders_cud CASCADE`);

  	await knex.raw(`DROP TRIGGER IF EXISTS trigger_tenant_emd_data_cud ON tenant_emd_data CASCADE`);
	await knex.raw(`DROP FUNCTION IF EXISTS notify_tenant_emd_data_cud CASCADE`);

  	await knex.raw(`DROP TRIGGER IF EXISTS trigger_tenant_plant_unit_lines_users_cud ON tenant_plant_unit_lines_users CASCADE`);
	await knex.raw(`DROP FUNCTION IF EXISTS notify_tenant_plant_unit_lines_users_cud CASCADE`);

	await knex.raw(`DROP TRIGGER IF EXISTS trigger_user_social_logins_cud ON user_social_logins CASCADE`);
	await knex.raw(`DROP FUNCTION IF EXISTS notify_user_social_logins_cud CASCADE`);

	await knex.raw(`DROP TRIGGER IF EXISTS trigger_user_contacts_cud ON user_contacts CASCADE`);
	await knex.raw(`DROP FUNCTION IF EXISTS notify_user_contacts_cud CASCADE`);

	await knex.raw(`DROP TRIGGER IF EXISTS trigger_users_cud ON users CASCADE`);
	await knex.raw(`DROP FUNCTION IF EXISTS notify_users_cud CASCADE`);

	await knex.raw(`DROP TRIGGER IF EXISTS trigger_tenant_plant_unit_machine_statistics_cud ON tenant_plant_unit_machine_statistics CASCADE`);
	await knex.raw(`DROP FUNCTION IF EXISTS notify_tenant_plant_unit_machine_statistics_cud CASCADE`);
};
