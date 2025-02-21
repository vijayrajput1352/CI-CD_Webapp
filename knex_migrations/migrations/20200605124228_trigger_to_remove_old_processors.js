
exports.up = async function(knex) {
	// Machine
 	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_old_machine_processors ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			DELETE FROM tenant_plant_unit_machine_processors WHERE tenant_plant_unit_machine_id = NEW.tenant_plant_unit_machine_id AND effectivity_end < (now() - interval '72 hours');
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_machine_processors AFTER INSERT OR UPDATE ON public.tenant_plant_unit_machine_processors FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_machine_processors();');

	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_old_machine_templates ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			DELETE FROM tenant_plant_unit_machine_templates WHERE tenant_plant_unit_machine_id = NEW.tenant_plant_unit_machine_id AND effectivity_end < (now() - interval '72 hours');
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_machine_templates AFTER INSERT OR UPDATE ON public.tenant_plant_unit_machine_templates FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_machine_templates();');

	// Line
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_old_line_processors ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			DELETE FROM tenant_plant_unit_line_processors WHERE tenant_plant_unit_line_id = NEW.tenant_plant_unit_line_id AND effectivity_end < (now() - interval '72 hours');
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_line_processors AFTER INSERT OR UPDATE ON public.tenant_plant_unit_line_processors FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_line_processors();');

	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_old_line_templates ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			DELETE FROM tenant_plant_unit_line_templates WHERE tenant_plant_unit_line_id = NEW.tenant_plant_unit_line_id AND effectivity_end < (now() - interval '72 hours');
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_line_templates AFTER INSERT OR UPDATE ON public.tenant_plant_unit_line_templates FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_line_templates();');

	// Panels
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_old_panel_processors ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			DELETE FROM tenant_panel_processors WHERE tenant_panel_id = NEW.tenant_panel_id AND effectivity_end < (now() - interval '72 hours');
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_panel_processors AFTER INSERT OR UPDATE ON public.tenant_panel_processors FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_panel_processors();');

	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_old_panel_templates ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			DELETE FROM tenant_panel_templates WHERE tenant_panel_id = NEW.tenant_panel_id AND effectivity_end < (now() - interval '72 hours');
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_panel_templates AFTER INSERT OR UPDATE ON public.tenant_panel_templates FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_panel_templates();');

	// Historical Dashboards
	// procesors
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_old_historical_dashboard_processors ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			DELETE FROM tenant_historical_dashboard_processors WHERE tenant_historical_dashboard_id = NEW.tenant_historical_dashboard_id AND effectivity_end < (now() - interval '72 hours');
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_historical_dashboard_processors AFTER INSERT OR UPDATE ON public.tenant_historical_dashboard_processors FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_historical_dashboard_processors();');

	// executors
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_old_historical_dashboard_executors ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			DELETE FROM tenant_historical_dashboard_executors WHERE tenant_historical_dashboard_id = NEW.tenant_historical_dashboard_id AND effectivity_end < (now() - interval '72 hours');
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_historical_dashboard_executors AFTER INSERT OR UPDATE ON public.tenant_historical_dashboard_executors FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_historical_dashboard_executors();');

	// request formatters
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_old_historical_dashboard_request_formatters ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			DELETE FROM tenant_historical_dashboard_request_formatters WHERE tenant_historical_dashboard_id = NEW.tenant_historical_dashboard_id AND effectivity_end < (now() - interval '72 hours');
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_historical_dashboard_request_formatters AFTER INSERT OR UPDATE ON public.tenant_historical_dashboard_request_formatters FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_historical_dashboard_request_formatters();');

	// response formatters
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_old_historical_dashboard_response_formatters ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			DELETE FROM tenant_historical_dashboard_response_formatters WHERE tenant_historical_dashboard_id = NEW.tenant_historical_dashboard_id AND effectivity_end < (now() - interval '72 hours');
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_historical_dashboard_response_formatters AFTER INSERT OR UPDATE ON public.tenant_historical_dashboard_response_formatters FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_historical_dashboard_response_formatters();');

	// input templates
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_old_historical_dashboard_input_templates ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			DELETE FROM tenant_historical_dashboard_input_templates WHERE tenant_historical_dashboard_id = NEW.tenant_historical_dashboard_id AND effectivity_end < (now() - interval '72 hours');
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_historical_dashboard_input_templates AFTER INSERT OR UPDATE ON public.tenant_historical_dashboard_input_templates FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_historical_dashboard_input_templates();');

	// result templates
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_old_historical_dashboard_result_templates ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			DELETE FROM tenant_historical_dashboard_result_templates WHERE tenant_historical_dashboard_id = NEW.tenant_historical_dashboard_id AND effectivity_end < (now() - interval '72 hours');
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_historical_dashboard_result_templates AFTER INSERT OR UPDATE ON public.tenant_historical_dashboard_result_templates FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_historical_dashboard_result_templates();');

	// subcomponents
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_old_historical_dashboard_subcomponents ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			DELETE FROM tenant_historical_dashboard_subcomponents WHERE tenant_historical_dashboard_id = NEW.tenant_historical_dashboard_id AND effectivity_end < (now() - interval '72 hours');
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_historical_dashboard_subcomponents AFTER INSERT OR UPDATE ON public.tenant_historical_dashboard_subcomponents FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_historical_dashboard_subcomponents();');





	// Reports
	// procesors
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_old_report_processors ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			DELETE FROM tenant_report_processors WHERE tenant_report_id = NEW.tenant_report_id AND effectivity_end < (now() - interval '72 hours');
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_report_processors AFTER INSERT OR UPDATE ON public.tenant_report_processors FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_report_processors();');

	// executors
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_old_report_executors ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			DELETE FROM tenant_report_executors WHERE tenant_report_id = NEW.tenant_report_id AND effectivity_end < (now() - interval '72 hours');
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_report_executors AFTER INSERT OR UPDATE ON public.tenant_report_executors FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_report_executors();');

	// request formatters
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_old_report_request_formatters ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			DELETE FROM tenant_report_request_formatters WHERE tenant_report_id = NEW.tenant_report_id AND effectivity_end < (now() - interval '72 hours');
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_report_request_formatters AFTER INSERT OR UPDATE ON public.tenant_report_request_formatters FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_report_request_formatters();');

	// response formatters
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_old_report_response_formatters ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			DELETE FROM tenant_report_response_formatters WHERE tenant_report_id = NEW.tenant_report_id AND effectivity_end < (now() - interval '72 hours');
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_report_response_formatters AFTER INSERT OR UPDATE ON public.tenant_report_response_formatters FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_report_response_formatters();');

	// input templates
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_old_report_input_templates ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			DELETE FROM tenant_report_input_templates WHERE tenant_report_id = NEW.tenant_report_id AND effectivity_end < (now() - interval '72 hours');
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_report_input_templates AFTER INSERT OR UPDATE ON public.tenant_report_input_templates FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_report_input_templates();');

	// result templates
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_delete_old_report_result_templates ()
			RETURNS trigger
			LANGUAGE plpgsql
			VOLATILE
			CALLED ON NULL INPUT
			SECURITY INVOKER
			COST 1
			AS $$
		BEGIN
			DELETE FROM tenant_report_result_templates WHERE tenant_report_id = NEW.tenant_report_id AND effectivity_end < (now() - interval '72 hours');
			RETURN NULL;
		END;
		$$;`
	);
	await knex.schema.withSchema('public').raw('CREATE TRIGGER trigger_delete_old_report_result_templates AFTER INSERT OR UPDATE ON public.tenant_report_result_templates FOR EACH ROW EXECUTE PROCEDURE public.fn_delete_old_report_result_templates();');


};

exports.down = async function(knex) {
	// report
	// result templates
	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_delete_old_report_result_templates ON public.tenant_report_result_templates CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_delete_old_report_result_templates () CASCADE;');

	// input templates
	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_delete_old_report_input_templates ON public.tenant_report_input_templates CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_delete_old_report_input_templates () CASCADE;');

	// response formatters
	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_delete_old_report_response_formatters ON public.tenant_report_response_formatters CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_delete_old_report_response_formatters () CASCADE;');

	// request formatters
	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_delete_old_report_request_formatters ON public.tenant_report_request_formatters CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_delete_old_report_request_formatters () CASCADE;');

	// executors
	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_delete_old_report_executors ON public.tenant_report_executors CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_delete_old_report_executors () CASCADE;');

	// executors
	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_delete_old_report_processors ON public.tenant_report_processors CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_delete_old_report_processors () CASCADE;');

	// Historical Dashboard
	// subcomponents
	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_delete_old_historical_dashboard_subcomponents ON public.tenant_historical_dashboard_subcomponents CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_delete_old_historical_dashboard_subcomponents () CASCADE;');

	// result templates
	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_delete_old_historical_dashboard_result_templates ON public.tenant_historical_dashboard_result_templates CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_delete_old_historical_dashboard_result_templates () CASCADE;');

	// input templates
	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_delete_old_historical_dashboard_input_templates ON public.tenant_historical_dashboard_input_templates CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_delete_old_historical_dashboard_input_templates () CASCADE;');

	// response formatters
	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_delete_old_historical_dashboard_response_formatters ON public.tenant_historical_dashboard_response_formatters CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_delete_old_historical_dashboard_response_formatters () CASCADE;');

	// request formatters
	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_delete_old_historical_dashboard_request_formatters ON public.tenant_historical_dashboard_request_formatters CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_delete_old_historical_dashboard_request_formatters () CASCADE;');

	// executors
	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_delete_old_historical_dashboard_executors ON public.tenant_historical_dashboard_executors CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_delete_old_historical_dashboard_executors () CASCADE;');

	// executors
	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_delete_old_historical_dashboard_processors ON public.tenant_historical_dashboard_processors CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_delete_old_historical_dashboard_processors () CASCADE;');


	// Panel
	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_delete_old_panel_templates ON public.tenant_panel_templates CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_delete_old_panel_templates () CASCADE;');

	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_delete_old_panel_processors ON public.tenant_panel_processors CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_delete_old_panel_processors () CASCADE;');

	// Line
	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_delete_old_line_templates ON public.tenant_plant_unit_line_templates CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_delete_old_line_templates () CASCADE;');

	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_delete_old_line_processors ON public.tenant_plant_unit_line_processors CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_delete_old_line_processors () CASCADE;');

	// Machine
	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_delete_old_machine_templates ON public.tenant_plant_unit_machine_templates CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_delete_old_machine_templates () CASCADE;');

	await knex.schema.withSchema('public').raw('DROP TRIGGER IF EXISTS trigger_delete_old_machine_processors ON public.tenant_plant_unit_machine_processors CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_delete_old_machine_processors () CASCADE;');
};
