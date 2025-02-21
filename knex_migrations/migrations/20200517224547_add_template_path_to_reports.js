
exports.up = async function(knex) {
	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_reports', 'template_path');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_reports', function(ReportsTbl) {
			ReportsTbl.text('template_path');
		});
};

exports.down = async function(knex) {
	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_reports', 'template_path');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_reports', function(ReportsTbl) {
			ReportsTbl.dropColumn('template_path');
		});

};
