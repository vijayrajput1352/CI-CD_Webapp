'use strict';

exports.seed = async function(knex) {
	// Step 1: Get parent module
	let parentId = await knex.raw(`SELECT id FROM modules WHERE name = ? AND type = 'server' AND parent_id IS NULL`, ['PlantWorksWebappServer']);
	if(parentId.rows.length) {
		parentId = parentId.rows[0]['id'];

		// Step 2: check if data is already present
		let service = await knex.raw('SELECT id FROM modules WHERE parent_id = ? AND type = ? AND name = ?', [
			parentId,
			'service',
			'TimescaleService'
		]);

		if(service.rows.length)
			return;

		// Step 3: Insert the data for aws service
		await knex('modules').insert({
			'parent_id': parentId,
			'type': 'service',
			'deploy': 'admin',
			'name': 'TimescaleService',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.19.8',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});
    }
};
