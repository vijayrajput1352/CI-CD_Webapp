'use strict';

exports.seed = async function(knex) {
	let parentId = await knex.raw(`SELECT id FROM modules WHERE name = ? AND type = 'server' AND parent_id IS NULL`, ['PlantWorksWebappServer']);
	if(!parentId.rows.length)
		return null;

	parentId = parentId.rows[0]['id'];

	let componentId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'component'`, [parentId, 'Incoming']);
	if(!componentId.rows.length) {
		await knex('modules').insert({
			'parent_id': parentId,
			'type': 'component',
			'deploy': 'default',
			'name': 'Incoming',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.19.8',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});
	}

	componentId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'component'`, [parentId, 'Session']);
	if(!componentId.rows.length) {
		await knex('modules').insert({
			'parent_id': parentId,
			'type': 'component',
			'deploy': 'default',
			'name': 'Session',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.19.8',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});
	}

	componentId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'component'`, [parentId, 'Masterdata']);
	if(!componentId.rows.length) {
		await knex('modules').insert({
			'parent_id': parentId,
			'type': 'component',
			'deploy': 'default',
			'name': 'Masterdata',
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
