
exports.up = async function(knex) {
	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_downtimes', 'work_order_id');
	if(!columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_downtimes', function(DowntimesTbl) {
			DowntimesTbl.text('work_order_id');
		});
};

exports.down = async function(knex) {
	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_plant_unit_machine_downtimes', 'work_order_id');
	if(columnExists)
		await knex.schema.withSchema('public').table('tenant_plant_unit_machine_downtimes', function(DowntimesTbl) {
			DowntimesTbl.dropColumn('work_order_id');
		});

};
