'use strict';

exports.seed = async function(knex) {
	// Step 0: Getting the basic server details...
	let parentId = await knex.raw(`SELECT id FROM modules WHERE name = ? AND type = 'server' AND parent_id IS NULL`, ['PlantWorksWebappServer']);
	if(!parentId.rows.length)
		return null;

	parentId = parentId.rows[0]['id'];

	// Step 1: Getting the alert feature
	let featureId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [parentId, 'Alert']);
	if(!featureId.rows.length)
		return null;

	featureId = featureId.rows[0]['id'];

	// Step 2: Get All Tenants
	let tenants = await knex.raw('SELECT id FROM tenants WHERE id NOT IN (SELECT tenant_id FROM tenants_modules WHERE module_id = ?);', [featureId]);
	tenants = tenants.rows;

	// Step 3: Add feature to tenants;
	for(let idx = 0; idx < tenants.length; idx++) {
		await knex('tenants_modules').insert({
			'tenant_id': tenants[idx]['id'],
			'module_id': featureId
		});
	}
}
