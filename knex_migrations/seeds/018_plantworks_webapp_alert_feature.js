'use strict';

exports.seed = async function(knex) {
	// Step 0: Getting the basic server details...
	let parentId = await knex.raw(`SELECT id FROM modules WHERE name = ? AND type = 'server' AND parent_id IS NULL`, ['PlantWorksWebappServer']);
	if(!parentId.rows.length)
		return null;

	parentId = parentId.rows[0]['id'];

	// Insert the alert feature
	let featureId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [parentId, 'Alert']);
	if(!featureId.rows.length) {
		featureId = await knex('modules').insert({
			'parent_id': parentId,
			'type': 'feature',
			'deploy': 'custom',
			'name': 'Alert',
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
			'name': 'alert-read',
			'implies_permissions': '["config-access", "devenv-access"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'alert-update',
			'implies_permissions': '["alert-read"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'alert-create',
			'implies_permissions': '["alert-update"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'alert-delete',
			'implies_permissions': '["alert-update"]'
		});
	}
}
