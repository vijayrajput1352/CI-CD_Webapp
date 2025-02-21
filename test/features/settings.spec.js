'use strict';

const chai = require('chai'); // eslint-disable-line node/no-unpublished-require
const chaiHttp = require('chai-http'); // eslint-disable-line node/no-unpublished-require

chai.use(chaiHttp);


describe('Settings Feature Test Cases', function() {
	const agent = chai.request.agent('http://localhost:9100');
	const expect = chai.expect;
	let featureId, featureId1, moduleId, tenantId;
	let locationId, rootUserLocationId;

	before(function(done) {
		agent
			.post('/session/login')
			.type('form')
			.send({
				'username': 'root@plant.works',
				'password': 'plantworks'
			})
			.end((err) => {
				if(err) {
					done(err);
					return;
				}

				agent
					.get('/session/user?_=1565679224509')
					.end((error, response) => {
						tenantId = response.body.tenant_id;
						if(err) {
							done(error);
							return;
						}

						agent
							.get('/server-administration/features/tree?id=%23&_=1570794102947')
							.end((err2, response2) => {
								featureId1 = response2.body[9].id;
								done(err2);
							});
					});
			});
	});

	it('Should return proper Node details', function(done) {
		agent
			.get('/settings/nodes?_=1567755828120')
			.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36')
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data[0].attributes).to.have.property('display_order').eql('first');
				expect(response.body.data[0].attributes).to.have.property('node_type').eql('leaf');
				expect(response.body.data[0].attributes).to.have.property('route').eql('account.basics');
				expect(response.body.data[1].attributes).to.have.property('display_order').eql('0');
				expect(response.body.data[1].attributes).to.have.property('node_type').eql('leaf');
				expect(response.body.data[1].attributes).to.have.property('route').eql('account.features');
				done(err);
			});
	});

	it('Should get Tenant Account details', function(done) {
		agent
			.get(`/settings/account/basics/tenants/${tenantId}?_=1567755828121`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('Plant.Works');
				expect(response.body.data.attributes).to.have.property('sub_domain').eql('www');
				expect(response.body.data.attributes).to.have.property('enabled').eql(true);
				expect(response.body.data).to.have.property('id').eql(tenantId);
				rootUserLocationId = response.body.included[0].id;
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url', function(done) {
		agent
			.get(`/settings/account/basics/tenants/${tenantId}?_=1567755828121&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to update account details providing null or empty string as Organization Name', function(done) {
		agent
			.patch(`/settings/account/basics/tenants/${tenantId}`)
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'sub_domain': 'www'
					},
					'id': tenantId,
					'type': 'settings/account/basics/tenants'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to update account details providing null or empty string as Sub-domain', function(done) {
		agent
			.patch(`/settings/account/basics/tenants/${tenantId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'Plant.Works',
						'sub_domain': ''
					},
					'id': tenantId,
					'type': 'settings/account/basics/tenants'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to update account details if we provide all required details', function(done) {
		agent
			.patch(`/settings/account/basics/tenants/${tenantId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'Plant.Works',
						'sub_domain': 'www'
					},
					'id': tenantId,
					'type': 'settings/account/basics/tenants'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should get Tenant Account Location details', function(done) {
		agent
			.get(`/settings/account/basics/tenant-locations/${rootUserLocationId}?_=1567761718270`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('area').eql('Ellisbridge');
				expect(response.body.data.attributes).to.have.property('city').eql('Ahmedabad');
				expect(response.body.data.attributes).to.have.property('country').eql('India');
				expect(response.body.data.attributes).to.have.property('is_primary').eql(true);
				expect(response.body.data.attributes).to.have.property('name').eql('Head Office');
				expect(response.body.data).to.have.property('id').eql(rootUserLocationId);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url', function(done) {
		agent
			.get(`/settings/account/basics/tenant-locations/${rootUserLocationId}?_=1567761718270&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should not be add Tenant Account Location if Name Field is empty', function(done) {
		agent
			.post('/settings/account/basics/tenant-locations')
			.send({
				'data': {
					'attributes': {
						'name': '',
						'area': 'Char Kaman',
						'city': 'Hyderabad',
						'country': 'India',
						'is_primary': false,
						'line1': 'Charminar Circle',
						'postal_code': '500002',
						'state': 'Hyderabad, Telangana',
						'latitude': 17.3615636,
						'longitude': 78.4746645,
						'timezone_id': 'Asia/Calcutta',
						'timezone_name': 'India Standard Time'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'settings/account/basics/tenant-locations'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should not be add Tenant Account Location if First Line is empty', function(done) {
		agent
			.post('/settings/account/basics/tenant-locations')
			.send({
				'data': {
					'attributes': {
						'name': 'Charminar',
						'area': 'Char Kaman',
						'city': 'Hyderabad',
						'country': 'India',
						'is_primary': false,
						'line1': '',
						'postal_code': '500002',
						'state': 'Hyderabad, Telangana',
						'latitude': 17.3615636,
						'longitude': 78.4746645,
						'timezone_id': 'Asia/Calcutta',
						'timezone_name': 'India Standard Time'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'settings/account/basics/tenant-locations'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add Tenant Account Location if all required fields are filled', function(done) {
		agent
			.post('/settings/account/basics/tenant-locations')
			.send({
				'data': {
					'attributes': {
						'name': 'Charminar',
						'area': 'Char Kaman',
						'city': 'Hyderabad',
						'country': 'India',
						'is_primary': false,
						'line1': 'Charminar Circle',
						'postal_code': '500002',
						'state': 'Hyderabad, Telangana',
						'latitude': 17.3615636,
						'longitude': 78.4746645,
						'timezone_id': 'Asia/Calcutta',
						'timezone_name': 'India Standard Time'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'settings/account/basics/tenant-locations'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				locationId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw an error if we try to edit non existing Tenant Account Location', function(done) {
		agent
			.patch('/settings/account/basics/tenant-locations/7748552b-832e-4cb9-8dac-1f3b15ca1g65r198')
			.send({
				'data': {
					'attributes': {
						'name': '',
						'area': 'Char Kaman',
						'city': 'Hyderabad',
						'country': 'India',
						'is_primary': false,
						'line1': 'Charminar Circle',
						'postal_code': '500002',
						'state': 'Hyderabad, Telangana',
						'latitude': 17.3615636,
						'longitude': 78.4746645,
						'timezone_id': 'Asia/Calcutta',
						'timezone_name': 'India Standard Time'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': locationId,
					'type': 'settings/account/basics/tenant-locations'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit Tenant Account Location by giving empty name', function(done) {
		agent
			.patch(`/settings/account/basics/tenant-locations/${locationId}`)
			.send({
				'data': {
					'attributes': {
						'name': '',
						'area': 'Char Kaman',
						'city': 'Hyderabad',
						'country': 'India',
						'is_primary': false,
						'line1': 'Charminar Circle',
						'postal_code': '500002',
						'state': 'Hyderabad, Telangana',
						'latitude': 17.3615636,
						'longitude': 78.4746645,
						'timezone_id': 'Asia/Calcutta',
						'timezone_name': 'India Standard Time'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': locationId,
					'type': 'settings/account/basics/tenant-locations'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit Tenant Account Location by giving empty First Line of address', function(done) {
		agent
			.patch(`/settings/account/basics/tenant-locations/${locationId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'Charminar',
						'area': 'Char Kaman',
						'city': 'Hyderabad',
						'country': 'India',
						'is_primary': false,
						'line1': '',
						'postal_code': '500002',
						'state': 'Hyderabad, Telangana',
						'latitude': 17.3615636,
						'longitude': 78.4746645,
						'timezone_id': 'Asia/Calcutta',
						'timezone_name': 'India Standard Time'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': locationId,
					'type': 'settings/account/basics/tenant-locations'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to edit Tenant Account Location if all required details are filled', function(done) {
		agent
			.patch(`/settings/account/basics/tenant-locations/${locationId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'Charminar',
						'area': 'Char Kaman',
						'city': 'Hyderabad',
						'country': 'India',
						'is_primary': false,
						'line1': 'Charminar Circle',
						'postal_code': '500002',
						'state': 'Hyderabad, Telangana',
						'latitude': 17.3615636,
						'longitude': 78.4746645,
						'timezone_id': 'Asia/Calcutta',
						'timezone_name': 'India Standard Time'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': locationId,
					'type': 'settings/account/basics/tenant-locations'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to delete non existing Tenant Account Location', function(done) {
		agent
			.del('/settings/account/basics/tenant-locations/7748552b-832e-4cb9-8dac-1f3b15ca1r2e198')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete existing Tenant Account Location', function(done) {
		agent
			.del(`/settings/account/basics/tenant-locations/${locationId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should be able to get all tenant features if we provide correct params in request', function(done) {
		agent
			.get('/settings/account/features/tenant-features?_=1575449692752&tenant_feature_id=a32f7396-17f9-4df7-a3af-69a5495a2580')
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to get all tenant features', function(done) {
		agent
			.get('/settings/account/features/tenant-features')
			.end((err, response) => {
				featureId = response.body.data[0].id;
				moduleId = response.body.data[0].attributes.module_id;
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to get individual tenant feature details', function(done) {
		agent
			.get(`/settings/account/features/tenant-features/${featureId}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('module_id').eql(moduleId);
				done(err);
			});
	});

	it('Should be able to delete a existing feature', function(done) {
		agent
			.del(`/settings/account/features/tenant-features/${featureId1}`)
			.end((err, response) => {
																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																																							expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should return null if we give non existing feature id', function(done) {
		agent
			.get('/settings/account/features/tenant-features/425fe598-a3b6-44b1-a077-64c5238e6040')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	// it('Should be able to add the deleted feature', function(done) {
	// 	agent
	// 		.post('/settings/account/features/tenant-features')
	// 		.send({
	// 			'data': {
	// 				'attributes': {},
	// 				'relationships': {
	// 					'feature': {
	// 						'data': {
	// 							'id': featureId1,
	// 							'type': 'server-administration/features'
	// 						}
	// 					},
	// 					'tenant': {
	// 						'data': {
	// 							'id': tenantId,
	// 							'type': 'settings/account/basics/tenants'
	// 						}
	// 					}
	// 				},
	// 				'type': 'settings/account/features/tenant-features'
	// 			}
	// 		})
	// 		.end((err, response) => {
	// 			expect(response).to.have.status(200);
	// 			done(err);
	// 		});
	// });

	it('Should throw an error if we try to delete the tenant with Sub-Domain as www', function(done) {
		agent
			.del(`/settings/account/basics/tenants/${tenantId}`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

});
