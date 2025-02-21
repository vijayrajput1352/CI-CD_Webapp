'use strict';
exports.seed = async function(knex) {
	const events = [{
		'tag': 'operator_change',
		'id': 'e6bcef98-6f12-4b94-b3cc-4ef65d73394b',
		'description': 'Operator changed at the machine'
	}, {
		'tag': 'supervisor_change',
		'id':'67197600-5de2-41f6-932c-e5ac2d993425',
		'description': 'Supervisor changed at the line'
	}, {
		'tag': 'work_order_status_change',
		'id': 'b47a22ea-4d8f-4966-a108-2e8cb9341436',
		'description': 'Work Order Status changed at the line'
	}, {
		'tag': 'shift_change',
		'id': '27071cf1-385a-4c20-a987-c768881699ee',
		'description': 'Shift Change'
	}, {
		'tag': 'day_change',
		'id': '1f85e425-def3-4a41-a312-e88ff58213cc',
		'description': 'Day Change'
	}, {
		'tag': 'logical_day_change',
		'id': '0b15ff7a-fd2f-447a-b04b-2f7726163e61',
		'description': 'Beginning of the first shift of the day'
	}, {
		'tag': 'scheduled_report',
		'id': '95191807-f5a7-4dd7-a243-4fef65ee185f',
		'description': 'Report Scheduled to be delivered'
	}, {
		'tag': 'sku_change',
		'id': 'a681ceac-5a94-42cd-9e50-3b5fd3471439',
		'description': 'SKU change event'
	},{
		'tag': 'realtime_stream',
		'id': 'c9b15d05-cd74-4b9d-8ade-456c83664ce4',
		'description': 'Real-time data stream'
	},{
		'tag': 'downtime_update',
		'id': '616e9f39-c8c6-41cb-873f-7316df205399',
		'description': 'Downtime start/stop event'
	}];

	let eventsAlreadyPresent = await knex.raw('SELECT tag FROM event_types;');
	eventsAlreadyPresent = new Set(eventsAlreadyPresent.rows.map((row) => {
		return row['tag'];
	}));

	for(let idx = 0; idx < events.length; idx++) {
		const event = events[idx];
		if(eventsAlreadyPresent.has(event.tag))
			continue;

		await knex('event_types').insert(event);
	}
}
