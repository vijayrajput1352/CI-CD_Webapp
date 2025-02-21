'use strict';

exports.seed = async function(knex) {
	// Step 0: Getting the basic server details...
	let parentId = await knex.raw(`SELECT id FROM modules WHERE name = ? AND type = 'server' AND parent_id IS NULL`, ['PlantWorksWebappServer']);
	if(!parentId.rows.length)
		return null;

	parentId = parentId.rows[0]['id'];

	// Insert the operator form feature
	let featureId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [parentId, 'OperatorForm']);
	if(!featureId.rows.length) {
		console.log(`STARTED: #1`);

		featureId = await knex('modules').insert({
			'parent_id': parentId,
			'type': 'feature',
			'deploy': 'custom',
			'name': 'OperatorForm',
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
			'name': 'operator-form-read',
			'implies_permissions': '["config-access", "devenv-access"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'operator-form-update',
			'implies_permissions': '["operator-form-read"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'operator-form-create',
			'implies_permissions': '["operator-form-update"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'operator-form-delete',
			'implies_permissions': '["operator-form-update"]'
		});
	}
}
