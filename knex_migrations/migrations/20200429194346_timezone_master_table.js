
exports.up = async function(knex) {
	exists = await knex.schema.withSchema('public').hasTable('timezones');
	if(!exists) {
		await knex.schema.withSchema('public').createTable('timezones', function(TimezoneTbl) {
			TimezoneTbl.uuid('id').notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
			TimezoneTbl.text('timezone_id').notNullable();

			TimezoneTbl.unique('timezone_id');
		});
	}
};

exports.down = async function(knex) {
	await knex.raw('DROP TABLE IF EXISTS timezones CASCADE');
};
