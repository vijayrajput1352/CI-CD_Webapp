'use strict';

exports.seed = async function(knex) {
	// Step 0: Getting the basic server details...
	let parentId = await knex.raw(`SELECT id FROM modules WHERE name = ? AND type = 'server' AND parent_id IS NULL`, ['PlantWorksWebappServer']);
	if(!parentId.rows.length)
		return null;

	parentId = parentId.rows[0]['id'];

	// Insert the work order management feature
	let featureId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [parentId, 'WorkOrder']);
	if(featureId.rows.length) {
		featureId = featureId.rows[0]['id'];

		let permissionId = await knex.raw(`SELECT id FROM module_permissions WHERE module_id = ? AND name = ?`, [featureId, 'work-order-admin-form-update']);
		if(permissionId.rows.length)
			return;

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'work-order-admin-form-update',
			'implies_permissions': '["work-order-read"]'
		});
	}
};
