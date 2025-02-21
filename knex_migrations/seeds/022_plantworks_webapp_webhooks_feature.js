'use strict';

exports.seed = async function(knex) {
	// Step 0: Getting the basic server details...
	let parentId = await knex.raw(`SELECT id FROM modules WHERE name = ? AND type = 'server' AND parent_id IS NULL`, ['PlantWorksWebappServer']);
	if(!parentId.rows.length)
		return null;

	parentId = parentId.rows[0]['id'];

	// Step 1: Get the settings features and add webhooks permissions
	let featureId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [parentId, 'Settings']);
	featureId = featureId.rows.shift()['id'];
	const settingsFeatureId = featureId;

	featureId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [settingsFeatureId, 'Account']);
	if(featureId.rows.length) {
		featureId = featureId.rows.shift()['id'];

		let webhookPermissionId = await knex.raw(`SELECT id FROM module_permissions WHERE module_id = ? and name = ?`, [featureId, 'settings-account-webhooks-read']);
		if(!webhookPermissionId.rows.length) {
			await knex('module_permissions').insert({
				'module_id': featureId,
				'name': 'settings-account-webhooks-read',
				'implies_permissions': '["settings-access"]'
			});
		}

		webhookPermissionId = await knex.raw(`SELECT id FROM module_permissions WHERE module_id = ? and name = ?`, [featureId, 'settings-account-webhooks-update']);
		if(!webhookPermissionId.rows.length) {
			await knex('module_permissions').insert({
				'module_id': featureId,
				'name': 'settings-account-webhooks-update',
				'implies_permissions': '["settings-account-webhooks-read"]'
			});
		}

		webhookPermissionId = await knex.raw(`SELECT id FROM module_permissions WHERE module_id = ? and name = ?`, [featureId, 'settings-account-webhooks-create']);
		if(!webhookPermissionId.rows.length) {
			await knex('module_permissions').insert({
				'module_id': featureId,
				'name': 'settings-account-webhooks-create',
				'implies_permissions': '["settings-account-webhooks-update"]'
			});
		}

		webhookPermissionId = await knex.raw(`SELECT id FROM module_permissions WHERE module_id = ? and name = ?`, [featureId, 'settings-account-webhooks-delete']);
		if(!webhookPermissionId.rows.length) {
			await knex('module_permissions').insert({
				'module_id': featureId,
				'name': 'settings-account-webhooks-delete',
				'implies_permissions': '["settings-account-webhooks-update"]'
			});
		}
	}
};
