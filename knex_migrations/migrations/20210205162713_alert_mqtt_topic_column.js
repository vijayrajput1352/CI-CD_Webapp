
exports.up = async function(knex) {
	let columnExists = false;
	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_alerts', 'mqtt_topic');
	if(!columnExists)
		columnExists = await knex.schema.withSchema('public').table('tenant_alerts', function(alertsTbl) {
			alertsTbl.text('mqtt_topic');
		});
};

exports.down = async function(knex) {
	let columnExists = false;
	columnExists = await knex.schema.withSchema('public').hasColumn('tenant_alerts', 'mqtt_topic');
	if(columnExists)
		columnExists = await knex.schema.withSchema('public').table('tenant_alerts', function(alertsTbl) {
			alertsTbl.dropColumn('mqtt_topic');
		});
};
