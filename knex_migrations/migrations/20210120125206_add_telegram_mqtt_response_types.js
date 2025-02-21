
exports.up = async function(knex) {
	let reportResponseTypes = await knex.raw('SELECT unnest(enum_range(NULL::tenant_report_response_types)) AS report_response_type;');
	reportResponseTypes = reportResponseTypes.rows.map((r) => {
		return r['report_response_type'];
	});

	if(!reportResponseTypes.includes('telegram'))
		await knex.raw(`ALTER TYPE public.tenant_report_response_types ADD VALUE 'telegram';`);

	let alertResponseTypes = await knex.raw('SELECT unnest(enum_range(NULL::tenant_alert_response_types)) AS alert_response_type;');
	alertResponseTypes = alertResponseTypes.rows.map((r) => {
		return r['alert_response_type'];
	});

	if(!alertResponseTypes.includes('telegram'))
		await knex.raw(`ALTER TYPE public.tenant_alert_response_types ADD VALUE 'telegram';`);

	if(!alertResponseTypes.includes('mqtt'))
		await knex.raw(`ALTER TYPE public.tenant_alert_response_types ADD VALUE 'mqtt';`);
};

exports.down = async function(knex) {

};

exports.config = { transaction: false };
