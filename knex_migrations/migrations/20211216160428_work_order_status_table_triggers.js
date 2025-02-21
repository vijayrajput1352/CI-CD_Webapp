
exports.up = async function(knex) {
	// Add trigger for tenant_work_order_status;
	await knex.raw(`
CREATE OR REPLACE FUNCTION notify_tenant_work_order_status_cud() RETURNS TRIGGER AS $$
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

    PERFORM pg_notify('tenant_work_order_status_cud'::text, final_payload::text);

    -- Returning null because it is an after trigger.
    RETURN NULL;
    END;
$$ LANGUAGE plpgsql;
`);

	await knex.raw(`CREATE TRIGGER trigger_tenant_work_order_status_cud AFTER INSERT OR UPDATE OR DELETE ON tenant_work_order_status FOR EACH ROW EXECUTE PROCEDURE notify_tenant_work_order_status_cud();`);


};

exports.down = async function(knex) {
  	await knex.raw(`DROP TRIGGER IF EXISTS trigger_tenant_work_order_status_cud ON tenant_work_order_status CASCADE`);
	await knex.raw(`DROP FUNCTION IF EXISTS notify_tenant_work_order_status_cud CASCADE`);
};
