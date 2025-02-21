
exports.up = async function(knex) {
	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_ttl_setuptimes (startDate timestamptz, endDate timestamptz, mId uuid)
		RETURNS integer AS $ttl$
		DECLARE
			ttl integer;

		BEGIN
			SELECT SUM((DATE_PART('day', end_time::timestamptz - start_time::timestamptz) * 24 +
					   DATE_PART('hour', end_time::timestamptz - start_time::timestamptz)) * 60 +
					   DATE_PART('minute', end_time::timestamptz - start_time::timestamptz)) as datediff into ttl from tenant_plant_unit_machine_setuptimes where tenant_plant_unit_machine_id=mId and start_time >= startDate and end_time <= endDate;
			RETURN ttl;

		END
		$ttl$ LANGUAGE plpgsql;`
	);

	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_ttl_setuprzn (startDate timestamptz, endDate timestamptz, mId uuid)
		RETURNS integer AS $rzn$
		DECLARE
			rzn integer;

		BEGIN
			select SUM(reason_duration_in_min) into rzn from tenant_plant_unit_machine_setuptime_reasons stp join tenant_plant_unit_machine_setuptimes setups on setups.id = stp.tenant_plant_unit_machine_setuptime_id and setups.tenant_plant_unit_machine_id=mId and setups.start_time >= startDate and setups.end_time <= endDate;
			RETURN rzn;

		END
		$rzn$ LANGUAGE plpgsql;`
	);

	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_ttl_idletimes (startDate timestamptz, endDate timestamptz, mId uuid)
		RETURNS integer AS $ttl$
		DECLARE
			ttl integer;

		BEGIN
			SELECT SUM((DATE_PART('day', end_time::timestamptz - start_time::timestamptz) * 24 +
					   DATE_PART('hour', end_time::timestamptz - start_time::timestamptz)) * 60 +
					   DATE_PART('minute', end_time::timestamptz - start_time::timestamptz)) as datediff into ttl from tenant_plant_unit_machine_idletimes where tenant_plant_unit_machine_id=mId and start_time >= startDate and end_time <= endDate;
			RETURN ttl;

		END
		$ttl$ LANGUAGE plpgsql;`
	);

	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_ttl_idlerzn (startDate timestamptz, endDate timestamptz, mId uuid)
		RETURNS integer AS $rzn$
		DECLARE
			rzn integer;

		BEGIN
			select SUM(reason_duration_in_min) into rzn from tenant_plant_unit_machine_idletime_reasons stp join tenant_plant_unit_machine_idletimes idles on idles.id = stp.tenant_plant_unit_machine_idletime_id and idles.tenant_plant_unit_machine_id=mId and idles.start_time >= startDate and idles.end_time <= endDate;
			RETURN rzn;

		END
		$rzn$ LANGUAGE plpgsql;`
	);

	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_get_setuptime_rzns (startDate timestamptz, endDate timestamptz, mId uuid)
		RETURNS SETOF temp_tbl AS $stoppages$
		DECLARE
			r temp_tbl%rowtype;
			diff integer;
		BEGIN
			FOR r IN
				select stp.reason_description, stp.reason_duration_in_min, stp.reason_code, dt.id, dt.tenant_plant_unit_machine_id, dt.start_time, dt.end_time from tenant_plant_unit_machine_setuptimes dt
				join tenant_plant_unit_machine_setuptime_reasons stp on dt.id = stp.tenant_plant_unit_machine_setuptime_id and dt.tenant_plant_unit_machine_id = mId
				and dt.start_time >= startDate and dt.end_time <= endDate
			LOOP
				return NEXT r;
			END LOOP;

			diff = fn_ttl_setuptimes(startDate, endDate, mId) - fn_ttl_setuprzn(startDate, endDate, mId);
			IF diff > 0 THEN
				INSERT INTO temp_tbl(reason_description, reason_duration_in_min, tenant_plant_unit_machine_id) VALUES ('Undefined', diff, mId);
				FOR r IN
					select * from temp_tbl
				LOOP
					return NEXT r;
				END LOOP;
			END IF;

			DELETE FROM temp_tbl WHERE tenant_plant_unit_machine_id = mId;
			RETURN;
		END
		$stoppages$ LANGUAGE plpgsql;`
	);

	await knex.schema.withSchema('public').raw(
		`CREATE OR REPLACE FUNCTION public.fn_get_idletime_rzns (startDate timestamptz, endDate timestamptz, mId uuid)
		RETURNS SETOF temp_tbl AS $stoppages$
		DECLARE
			r temp_tbl%rowtype;
			diff integer;
		BEGIN
			FOR r IN
				select stp.reason_description, stp.reason_duration_in_min, stp.reason_code, dt.id, dt.tenant_plant_unit_machine_id, dt.start_time, dt.end_time from tenant_plant_unit_machine_idletimes dt
				join tenant_plant_unit_machine_idletime_reasons stp on dt.id = stp.tenant_plant_unit_machine_idletime_id and dt.tenant_plant_unit_machine_id = mId
				and dt.start_time >= startDate and dt.end_time <= endDate
			LOOP
				return NEXT r;
			END LOOP;

			diff = fn_ttl_idletimes(startDate, endDate, mId) - fn_ttl_idlerzn(startDate, endDate, mId);
			IF diff > 0 THEN
				INSERT INTO temp_tbl(reason_description, reason_duration_in_min, tenant_plant_unit_machine_id) VALUES ('Undefined', diff, mId);
				FOR r IN
					select * from temp_tbl
				LOOP
					return NEXT r;
				END LOOP;
			END IF;

			DELETE FROM temp_tbl WHERE tenant_plant_unit_machine_id = mId;
			RETURN;
		END
		$stoppages$ LANGUAGE plpgsql;`
	);
};

exports.down = async function(knex) {
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_get_idletime_rzns CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_get_setuptime_rzns CASCADE;');

	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_ttl_idlerzn CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_ttl_idletimes CASCADE;');

	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_ttl_setuprzn CASCADE;');
	await knex.schema.withSchema('public').raw('DROP FUNCTION IF EXISTS public.fn_ttl_setuptimes CASCADE;');
};
