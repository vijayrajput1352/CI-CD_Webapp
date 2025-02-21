'use strict';
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  let tenantId = await knex.raw(`SELECT id FROM tenants WHERE sub_domain = 'pw'`);
	if(!tenantId.rows.length) {
      await knex('tenants').insert({
        'name': 'Test Tenant',
        'sub_domain': 'pw',
        'enabled': 't'
      });
    }
    let pwTenantId = await knex.raw(`SELECT id FROM tenants WHERE sub_domain = 'pw'`);
    pwTenantId = pwTenantId.rows[0]['id'];
    let pwId = await knex.raw(`SELECT id FROM tenants_users WHERE tenant_id = ?`,[pwTenantId]);
    let userId = await knex.raw(`SELECT id FROM users WHERE email = 'root@plant.works'`);
    let defaultApp = await knex.raw(`SELECT default_application FROM tenants_users`);
    if(!pwId.rows.length) {
        await knex('tenants_users').insert({
          'tenant_id': pwTenantId,
          'user_id': userId.rows[0].id,
          'access_status':'authorized',
          'default_application': defaultApp.rows[0].default_application,
          'designation': 'Administrator'
        });
      }

    let tenantGroupId = await knex.raw(`SELECT id from tenant_groups where tenant_id = ? AND name = 'administrators'`,[pwTenantId]);
    tenantGroupId = tenantGroupId.rows[0]['id'];
    await knex('tenants_users_groups').where('tenant_id', '=', pwTenantId).update({
      'tenant_group_id': tenantGroupId
    });

    let manufacturingId = await knex.raw(`SELECT id FROM modules where name = 'Manufacturing'`);
    let emdId = await knex.raw(`SELECT id FROM modules where name = 'Emd'`);
    let wororderId = await knex.raw(`SELECT id FROM modules where name = 'WorkOrder'`);
    let devenvId = await knex.raw(`SELECT id FROM modules where name = 'Devenv'`);
    let outgoingId = await knex.raw(`SELECT id FROM modules where name = 'Outgoing'`);
    let scheduleId = await knex.raw(`SELECT id FROM modules where name = 'Schedule'`);
     manufacturingId = manufacturingId.rows[0]['id'];
    let moduleId= await knex.raw(`SELECT id FROM tenants_modules where tenant_id = ? AND module_id = ?`,[pwTenantId,manufacturingId]);
   if(!moduleId.rows.length) {
    await knex('tenants_modules').insert({
      'tenant_id': pwTenantId,
      'module_id': manufacturingId,
    });
    await knex('tenants_modules').insert({
      'tenant_id': pwTenantId,
      'module_id': emdId.rows[0].id,
    });
    await knex('tenants_modules').insert({
      'tenant_id': pwTenantId,
      'module_id': wororderId.rows[0].id,
    });
    await knex('tenants_modules').insert({
      'tenant_id': pwTenantId,
      'module_id': devenvId.rows[0].id,
    });
    await knex('tenants_modules').insert({
      'tenant_id': pwTenantId,
      'module_id': outgoingId.rows[0].id,
    });
    await knex('tenants_modules').insert({
      'tenant_id': pwTenantId,
      'module_id': scheduleId.rows[0].id,
    });
   }
    let locationId = await knex.raw(`SELECT id FROM tenant_locations where tenant_id = ?`,[pwTenantId]);
    if(!locationId.rows.length) {
      await knex('tenant_locations').insert({
        'id': 'f51aa938-70ce-4259-ab2c-60c8af7bc072',
        'tenant_id': pwTenantId,
        'is_primary': 't',
        'name':'Balaji Wafers',
        'line1': 'Kalawad Road',
        'line2': 'Near IOCL petrol pump',
        'line3': 'Vajdi',
        'area': 'Lodhika',
        'city': 'Rajkot',
        'state': 'Gujarat',
        'country': 'India',
        'postal_code': '360021',
        'latitude': '22.305823',
        'longitude': '70.786185',
        'timezone_id': 'Asia/Calcutta',
        'timezone_name': 'India Standard Time'
      });
    }
  };
