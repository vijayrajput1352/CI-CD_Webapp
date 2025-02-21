exports.up = async function(knex) {
	exists = await knex.schema.withSchema('public').hasTable('tenant_report_schedules');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('tenant_report_schedules', function(ReportSchedulesTbl) {
			ReportSchedulesTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			ReportSchedulesTbl.uuid('tenant_id').notNullable().references('id').inTable('tenants').onDelete('CASCADE').onUpdate('CASCADE');

			ReportSchedulesTbl.uuid('tenant_report_id').notNullable();

			ReportSchedulesTbl.boolean('enabled').notNullable().defaultTo(false);
			ReportSchedulesTbl.text('cron_string');
			ReportSchedulesTbl.text('timezone_id');
			ReportSchedulesTbl.jsonb('scheduled_output_types').notNullable().defaultTo('[]');

			ReportSchedulesTbl.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
			ReportSchedulesTbl.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

			ReportSchedulesTbl.unique(['id', 'tenant_id']);
			ReportSchedulesTbl.foreign(['tenant_report_id', 'tenant_id']).references(['id', 'tenant_id']).inTable('tenant_reports').onDelete('CASCADE').onUpdate('CASCADE');
		});
	};
}

exports.down = async function(knex) {
	await knex.raw('DROP TABLE IF EXISTS public.tenant_report_schedules CASCADE');
};
