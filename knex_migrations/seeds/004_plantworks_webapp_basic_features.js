'use strict';

exports.seed = async function(knex) {
	// Step 0: Getting the basic server details...
	let parentId = await knex.raw(`SELECT id FROM modules WHERE name = ? AND type = 'server' AND parent_id IS NULL`, ['PlantWorksWebappServer']);
	if(!parentId.rows.length)
		return null;

	parentId = parentId.rows[0]['id'];

	// Step 1: Insert the profile feature
	let featureId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [parentId, 'Profile']);
	if(!featureId.rows.length) {
		await knex('modules').insert({
			'parent_id': parentId,
			'type': 'feature',
			'deploy': 'default',
			'name': 'Profile',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.19.8',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});
	}

	// Step 2: Insert the dashboard feature
	featureId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [parentId, 'Dashboard']);
	if(!featureId.rows.length) {
		let dashboardFeatureId = await knex('modules').insert({
			'parent_id': parentId,
			'type': 'feature',
			'deploy': 'default',
			'name': 'Dashboard',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.19.8',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		})
		.returning('id');

		dashboardFeatureId = dashboardFeatureId[0];
		await knex.raw(`UPDATE tenants_users SET default_application = ? WHERE user_id = (SELECT user_id FROM users WHERE email = 'root@plant.works')`, [dashboardFeatureId]);
	}

	// Step 3: Insert the permissions-users-groups (pug) feature
	featureId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [parentId, 'Pug']);
	if(!featureId.rows.length) {
		featureId = await knex('modules').insert({
			'parent_id': parentId,
			'type': 'feature',
			'deploy': 'default',
			'name': 'Pug',
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
			'name': 'pug-read'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'pug-update',
			'implies_permissions': '["pug-read"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'pug-all',
			'implies_permissions': '["pug-update"]'
		});
	}
	else {
		featureId = featureId.rows.shift()['id'];
	}

	const pugFeatureId = featureId;

	featureId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [pugFeatureId, 'GroupManager']);
	if(!featureId.rows.length) {
		featureId = await knex('modules').insert({
			'parent_id': pugFeatureId,
			'type': 'feature',
			'deploy': 'default',
			'name': 'GroupManager',
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
			'name': 'group-manager-read',
			'implies_permissions': '["pug-read"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'group-manager-update',
			'implies_permissions': '["group-manager-read"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'group-manager-all',
			'implies_permissions': '["group-manager-update"]'
		});
	}

	featureId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [pugFeatureId, 'UserManager']);
	if(!featureId.rows.length) {
		featureId = await knex('modules').insert({
			'parent_id': pugFeatureId,
			'type': 'feature',
			'deploy': 'default',
			'name': 'UserManager',
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
			'name': 'user-manager-read',
			'implies_permissions': '["pug-read"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'user-manager-update',
			'implies_permissions': '["user-manager-read"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'user-manager-all',
			'implies_permissions': '["user-manager-update"]'
		});
	}

	// Step 4: Insert the server administration feature
	featureId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [parentId, 'ServerAdministration']);
	if(!featureId.rows.length) {
		await knex('modules').insert({
			'parent_id': parentId,
			'type': 'feature',
			'deploy': 'admin',
			'name': 'ServerAdministration',
			'metadata': {
				'author': 'Plant.Works',
				'version': '2.19.8',
				'website': 'https://plant.works',
				'demo': 'https://plant.works',
				'documentation': 'https://plant.works'
			}
		});
	}

	// Step 5: Insert the settings feature
	featureId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [parentId, 'Settings']);
	if(!featureId.rows.length) {
		featureId = await knex('modules').insert({
			'parent_id': parentId,
			'type': 'feature',
			'deploy': 'default',
			'name': 'Settings',
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
			'name': 'settings-access'
		});
	}
	else {
		featureId = featureId.rows.shift()['id'];
	}

	const settingsFeatureId = featureId;

	featureId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [settingsFeatureId, 'Account']);
	if(!featureId.rows.length) {
		featureId = await knex('modules').insert({
			'parent_id': settingsFeatureId,
			'type': 'feature',
			'deploy': 'default',
			'name': 'Account',
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
			'name': 'settings-account-basics-read',
			'implies_permissions': '["settings-access"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'settings-account-basics-update',
			'implies_permissions': '["settings-account-basics-read"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'settings-account-basics-all',
			'implies_permissions': '["settings-account-basics-update"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'settings-account-features-read',
			'implies_permissions': '["settings-access"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'settings-account-features-update',
			'implies_permissions': '["settings-account-features-read"]'
		});

		await knex('module_permissions').insert({
			'module_id': featureId,
			'name': 'settings-account-features-all',
			'implies_permissions': '["settings-account-features-update"]'
		});
	}

	// Step 6: Insert the config feature
	featureId = await knex.raw(`SELECT id FROM fn_get_module_descendants(?) WHERE name = ? AND type = 'feature'`, [parentId, 'Configure']);
	if(!featureId.rows.length) {
		featureId = await knex('modules').insert({
			'parent_id': parentId,
			'type': 'feature',
			'deploy': 'default',
			'name': 'Configure',
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
			'name': 'config-access'
		});
	}
};
