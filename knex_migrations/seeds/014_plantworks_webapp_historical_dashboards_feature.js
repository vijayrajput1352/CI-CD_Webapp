'use strict';

exports.seed = async function(knex) {
	// Step 0: Getting the basic server details...
	let parentId = await knex.raw(`SELECT id FROM modules WHERE name = ? AND type = 'server' AND parent_id IS NULL`, ['PlantWorksWebappServer']);
	if(!parentId.rows.length)
		return null;

	parentId = parentId.rows[0]['id'];

	// Insert the historical dashboard feature
	let featureId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [parentId, 'HistoricalDashboard']);
	if(!featureId.rows.length) {
		featureId = await knex('modules').insert({
			'parent_id': parentId,
			'type': 'feature',
			'deploy': 'custom',
			'name': 'HistoricalDashboard',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.19.8',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		})
		.returning('id');

		featureId = featureId[0];

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'historical-dashboard-read',
			'implies_permissions': '["config-access", "devenv-access"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'historical-dashboard-update',
			'implies_permissions': '["historical-dashboard-read"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'historical-dashboard-create',
			'implies_permissions': '["historical-dashboard-update"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'historical-dashboard-delete',
			'implies_permissions': '["historical-dashboard-update"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'historical-dashboard-watch',
			'implies_permissions': '[]'
		});
	}
}
