'use strict';

exports.seed = async function(knex) {
	// Step 0: Getting the basic server details...
	let parentId = await knex.raw(`SELECT id FROM modules WHERE name = ? AND type = 'server' AND parent_id IS NULL`, ['PlantWorksWebappServer']);
	if(!parentId.rows.length)
		return null;

	parentId = parentId.rows[0]['id'];

	// Insert the work order management feature
	let featureId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [parentId, 'WorkOrder']);
	if(!featureId.rows.length) {
		featureId = await knex('modules').insert({
			'parent_id': parentId,
			'type': 'feature',
			'deploy': 'custom',
			'name': 'WorkOrder',
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
			'name': 'work-order-read',
			'implies_permissions': '["config-access"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'work-order-update',
			'implies_permissions': '["work-order-read"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'work-order-create',
			'implies_permissions': '["work-order-update"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'work-order-delete',
			'implies_permissions': '["work-order-update"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'work-order-upload',
			'implies_permissions': '[]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'work-order-operation',
			'implies_permissions': '[]'
		});
	}

}
