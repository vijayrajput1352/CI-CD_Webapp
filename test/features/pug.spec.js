'use strict';

const chai = require('chai'); // eslint-disable-line node/no-unpublished-require
const chaiHttp = require('chai-http'); // eslint-disable-line node/no-unpublished-require
const imageUri = require('image-data-uri');

chai.use(chaiHttp);

describe('PUG Feature Test Cases', function() {
	const agent = chai.request.agent('http://localhost:9100');
	const expect = chai.expect;
	let tenantId;
	let administratorId, publicId, registeredUserId, superAdministratorId;
	let tenantGroupId, tenantGroupId2, tenantGroupId3;
	let createdTenantUserId, rootUserId, tenantUserId, tenantUserId1;
	let createdUserId1, createdUserId2, createdUserId3;
	let imageData, imageData1;
	let boardNodeId, newPanelId, newReportID, panelNodeId, reportsNodeId;

	const knexInstance = {
		'pool': {
			'max': 2,
			'min': 1
		},
		'debug': false,
		'client': 'pg',
		'connection': {
			'host': '127.0.0.1',
			'port': 5432,
			'user': 'plantworks',
			'database': 'plantworks',
			'password': 'plantworks'
		}
	};

	const knex = require('knex')(knexInstance);

	imageUri.encodeFromFile('./test/user_assets/profile_images/cqlsh.png')
	.then(res => {
		imageData = res;
	});

	imageUri.encodeFromFile('./user_assets/profile_images/f8a9da32-26c5-495a-be9a-42f2eb8e4ed1.png')
	.then(res => {
		imageData1 = res;
	});

	after(function(done) {
		agent
			.post('/session/login')
			.type('form')
			.send({
				'username': 'root@plant.works',
				'password': '1234'
			})
			.end((err) => {
				if(err) {
					done(err);
					return;
				}
			agent
				.del(`/pug/group-manager/tenant-groups/${tenantGroupId2}`)
				.end((error1) => {
					if(error1) {
						done(error1);
						return;
					}

					agent
						.del(`/pug/group-manager/tenant-groups/${tenantGroupId3}`)
						.end((error2) => {
							if(error2) {
								done(error2);
								return;
							}

							agent
								.del(`/pug/user-manager/users/${createdUserId2}`)
								.end((error3) => {
									if(error3) {
										done(error3);
										return;
									}

									agent
										.del(`/pug/user-manager/users/${createdUserId3}`)
										.end((error4) => {
											if(error4) {
												done(error4);
												return;
											}

											agent
												.post('/pug/user-manager/resetPassword')
												.type('form')
												.send({
													'user': rootUserId,
													'password': 'plantworks',
													'generate': false
												})
												.end((error5) => {
													if(error5) {
														done(error5);
														return;
													}

													agent
														.post(`/pug/user-manager/upload-image/${tenantUserId}`)
														.type('form')
														.send({
															'image': imageData1,
															'metadata': {
																'points': [2, 0, 336, 334],
																'zoom': 1,
																'orientation': 1
															}
														})
														// eslint-disable-next-line max-nested-callbacks
														.end((error7, response7) => {
															expect(response7).to.have.status(200);

															if(error7) {
																done(error7);
																return;
															}

															agent
																.del(`/board/panels/${newPanelId}`)
																// eslint-disable-next-line max-nested-callbacks
																.end((error8, response8) => {
																	expect(response8).to.have.status(204);

																	if(error8) {
																		done(error8);
																		return;
																	}

																	agent
																		.del(`/report/reports/${newReportID}`)
																		// eslint-disable-next-line max-nested-callbacks
																		.end((error9, response9) => {
																			expect(response9).to.have.status(204);

																			if(error9) {
																				done(error9);
																				return;
																			}

																			knex.raw(`UPDATE users SET profile_image = ? WHERE email = ?`, ['f8a9da32-26c5-495a-be9a-42f2eb8e4ed1', 'root@plant.works'])
																			// eslint-disable-next-line max-nested-callbacks
																			.then(() => {
																				agent
																				.get('/session/logout')
																				// eslint-disable-next-line max-nested-callbacks
																				.end((err10) => {
																						done(err10);
																				});
																			})
																			// eslint-disable-next-line max-nested-callbacks
																			.catch((err11) => {
																				done(err11);
																			})
																			// eslint-disable-next-line max-nested-callbacks
																			.finally(() => {
																				return knex.destroy();
																			});

																		});
																});
														});
												});
										});
								});
						});
				});
		});
	});

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
					.end((err1, response1) => {
						tenantId = response1.body.tenant_id;

						if(err1) {
							done(err1);
							return;
						}

						agent
							.get('/configure/nodes?_=1569908851488')
							.set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36')
							.end((err2, response2) => {
								expect(response2).to.have.status(200);
								boardNodeId = response2.body.data[0].id;
								reportsNodeId = response2.body.data[3].id;

								if(err2) {
									done(err2);
									return;
								}

								agent
									.get(`/board/config-tree-nodes?node_id=${boardNodeId}&node_type=root-folder&_=1569908851489`)
									.end((err3, response3) => {
										expect(response3).to.have.status(200);
										if(response3.body[0].data.type === 'attribute-folder')
											panelNodeId = response3.body[1].id;
										else
											panelNodeId = response3.body[0].id;

										if(err3) {
											done(err3);
											return;
										}

										agent
											.post('/board/panels')
											.send({
												'data': {
													'attributes': {
														'attribute_set_metadata': [],
														'data_persistence_period': 1,
														'name': 'New Panel',
														'description': ' '
													},
													'relationships': {
														'folder': {
															'data': {
																'id': panelNodeId,
																'type': 'board/folders'
															}
														},
														'tenant': {
															'data': {
																'id': tenantId,
																'type': 'settings/account/basics/tenants'
															}
														}
													},
													'type': 'board/panels'
												}
											})
											.end((err4, response4) => {
												expect(response4).to.have.status(200);
												newPanelId = response4.body.data.id;

												if(err4) {
													done(err4);
													return;
												}

												agent
													.get(`/report/config-tree-nodes?node_id=${reportsNodeId}&node_type=root-folder&_=1574234595205`)
													.end((err5, response5) => {
														expect(response5).to.have.status(200);
														if(response5.body[0].data.type === 'attribute-folder')
															reportsNodeId = response5.body[1].id;
														else
															reportsNodeId = response5.body[0].id;

														if(err5) {
															done(err5);
															return;
														}

														agent
															.post(`/report/reports`)
															.send({
																'data': {
																	'attributes': {
																		'attribute_set_metadata': [],
																		'data_persistence_period': 1,
																		'description': ' ',
																		'name': 'New Report'
																	},
																	'relationships': {
																		'folder': {
																			'data': {
																				'id': reportsNodeId,
																				'type': 'report/folders'
																			}
																		},
																		'tenant': {
																			'data': {
																				'id': tenantId,
																				'type': 'settings/account/basics/tenants'
																			}
																		}
																	},
																	'type': 'report/reports'
																}
															})
															.end((err6, response6) => {
																expect(response6).to.have.status(200);
																newReportID = response6.body.data.id;
																done(err6);
															});
													});
											});
									});
							});
					});
			});
	});

	it('Should return correct Tenant Group Tree', function (done) {
		agent
			.get('/pug/group-manager/tree?id=%23&_=1566209871952')
			.end((err, response) => {
				expect(response.body[0]).to.have.property('text').eql('Super Administrators');
				expect(response.body[0]).to.have.property('parent').eql('#');
				expect(response.body[1]).to.have.property('text').eql('Administrators');
				expect(response.body[1]).to.have.property('parent').eql(response.body[0].id);
				expect(response.body[2]).to.have.property('text').eql('Registered Users');
				expect(response.body[2]).to.have.property('parent').eql(response.body[1].id);
				expect(response.body[3]).to.have.property('text').eql('Public');
				expect(response.body[3]).to.have.property('parent').eql(response.body[2].id);
				superAdministratorId = response.body[0].id;
				administratorId = response.body[1].id;
				registeredUserId = response.body[2].id;
				publicId = response.body[3].id;
				done(err);
			});
	});

	it('Should return correct Tenant Group Tree for Registered Users', function (done) {
		agent
			.get(`/pug/group-manager/tree?id=${registeredUserId}&_=1566209871952`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should return Super Administrators details', function(done) {
		agent
			.get(`/pug/group-manager/tenant-groups/${superAdministratorId}?_=1566220373749`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data).to.have.property('id').eql(superAdministratorId);
				expect(response.body.data.attributes).to.have.property('parent_id').eql(null);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('name').eql('super-administrators');
				expect(response.body.data.attributes).to.have.property('default_for_new_user').eql(false);
				done(err);
			});
	});

	it('Should return Administrators details', function(done) {
		agent
			.get(`/pug/group-manager/tenant-groups/${administratorId}?_=1566220373750`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data).to.have.property('id').eql(administratorId);
				expect(response.body.data.attributes).to.have.property('parent_id').eql(superAdministratorId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('name').eql('administrators');
				expect(response.body.data.attributes).to.have.property('default_for_new_user').eql(false);
				done(err);
			});
	});

	it('Should return Registered Users details', function(done) {
		agent
			.get(`/pug/group-manager/tenant-groups/${registeredUserId}?_=1566220373751`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data).to.have.property('id').eql(registeredUserId);
				expect(response.body.data.attributes).to.have.property('parent_id').eql(administratorId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('name').eql('registered-users');
				expect(response.body.data.attributes).to.have.property('default_for_new_user').eql(true);
				done(err);
			});
	});

	it('Should return Public details', function(done) {
		agent
			.get(`/pug/group-manager/tenant-groups/${publicId}?_=1566220373752`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data).to.have.property('id').eql(publicId);
				expect(response.body.data.attributes).to.have.property('parent_id').eql(registeredUserId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('name').eql('public');
				expect(response.body.data.attributes).to.have.property('default_for_new_user').eql(false);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Tenant Group datails', function(done) {
		agent
			.get(`/pug/group-manager/tenant-groups/${publicId}?_=1566220373752&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should display proper possible tenant users list', function(done) {
		agent
			.get(`/pug/group-manager/possibleTenantUsersList?group=${superAdministratorId}&_=1566385279676`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body[0]).to.have.property('firstName').eql('Public');
				expect(response.body[0]).to.have.property('lastName').eql('Visitor');
				expect(response.body[0]).to.have.property('email').eql('public@plant.works');
				done(err);
			});
	});

	it('Should not allow adding a group by Super Administrator if group name is empty', function(done) {
		agent
			.post('/pug/group-manager/tenant-groups')
			.send({
				'data': {
					'attributes': {
						'display_name': ' ',
						'description': 'New administrators group',
						'default_for_new_user': false,
						'name': 'administrator-0'
					},
					'relationships': {
						'parent': {
							'data': {
								'id': superAdministratorId,
								'type': 'pug/group-manager/tenant-groups'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					}
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should allow adding a group by Super Administrator even if group description is empty', function(done) {
		agent
			.post('/pug/group-manager/tenant-groups')
			.send({
				'data': {
					'attributes': {
						'display_name': 'Administrator 1',
						'description': ' ',
						'default_for_new_user': false,
						'name': 'administrator-1'
					},
					'relationships': {
						'parent': {
							'data': {
								'id': superAdministratorId,
								'type': 'pug/group-manager/tenant-groups'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					}
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				tenantGroupId = response.body.data.id;
				done(err);
			});
	});

	it('Should allow adding a group by Super Administrator if All details are filled', function(done) {
		agent
			.post('/pug/group-manager/tenant-groups')
			.send({
				'data': {
					'attributes': {
						'display_name': 'Administrator 2',
						'description': 'New administrator group',
						'default_for_new_user': false,
						'name': 'administrator-2'
					},
					'relationships': {
						'parent': {
							'data': {
								'id': superAdministratorId,
								'type': 'pug/group-manager/tenant-groups'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					}
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				tenantGroupId2 = response.body.data.id;
				done(err);
			});
	});

	it('Should not allow adding a group by Super Administrator if given name already exists under same parent', function(done) {
		agent
			.post('/pug/group-manager/tenant-groups')
			.send({
				'data': {
					'attributes': {
						'display_name': 'Administrator 2',
						'description': 'New administrator group',
						'default_for_new_user': false,
						'name': 'administrator-2'
					},
					'relationships': {
						'parent': {
							'data': {
								'id': superAdministratorId,
								'type': 'pug/group-manager/tenant-groups'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					}
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should allow adding a group by Super Administrator by setting default to false', function(done) {
		agent
			.post('/pug/group-manager/tenant-groups')
			.send({
				'data': {
					'attributes': {
						'display_name': 'Administrator 3',
						'description': 'New administrator group',
						'name': 'administrator-3'
					},
					'relationships': {
						'parent': {
							'data': {
								'id': superAdministratorId,
								'type': 'pug/group-manager/tenant-groups'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					}
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				tenantGroupId3 = response.body.data.id;
				done(err);
			});
	});

	it('Should not be able to update the added group details if we provide empty Display Name', function(done) {
		agent
			.patch(`/pug/group-manager/tenant-groups/${tenantGroupId3}`)
			.send({
				'data': {
					'attributes': {
						'display_name': ' ',
						'description': 'New edited administrator group',
						'name': 'administrator-3'
					},
					'relationships': {
						'parent': {
							'data': {
								'id': superAdministratorId,
								'type': 'pug/group-manager/tenant-groups'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': tenantGroupId3,
					'type': 'pug/group-manager/tenant-groups'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to edit the added group details', function(done) {
		agent
			.patch(`/pug/group-manager/tenant-groups/${tenantGroupId3}`)
			.send({
				'data': {
					'attributes': {
						'display_name': 'Administrator 4',
						'description': 'New edited administrator group',
						'name': 'administrator-3'
					},
					'relationships': {
						'parent': {
							'data': {
								'id': superAdministratorId,
								'type': 'pug/group-manager/tenant-groups'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': tenantGroupId3,
					'type': 'pug/group-manager/tenant-groups'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to delete the correct tenant group', function(done) {
		agent
			.del(`/pug/group-manager/tenant-groups/${tenantGroupId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error when we try to delete non existing tanent group', function(done) {
		agent
			.del(`/pug/group-manager/tenant-groups/${tenantGroupId}`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to delete default user', function(done) {
		agent
			.del(`/pug/group-manager/tenant-groups/${registeredUserId}`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should display existing Tenant users details', function(done) {
		agent
			.get('/pug/user-manager/tenant-users?_=1566458482116')
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data[0].attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data[0].attributes).to.have.property('designation').eql('Super Administrator');
				expect(response.body.data[0].attributes).to.have.property('access_status').eql('authorized');
				expect(response.body.data[1].attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data[1].attributes).to.have.property('designation').eql('Visitor');
				expect(response.body.data[1].attributes).to.have.property('access_status').eql('authorized');
				expect(response.body.data[1].attributes).to.have.property('user_id').eql('ffffffff-ffff-4fff-ffff-ffffffffffff');
				rootUserId = response.body.data[0].attributes.user_id;
				tenantUserId = response.body.data[0].id;
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching all existing Tenant users datails', function(done) {
		agent
			.get('/pug/user-manager/tenant-users?_=1566458482116&include=t')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if we try to get details of non existing tenant user', function(done) {
		agent
			.get('/pug/user-manager/tenant-users/13c9393c-83d1-4667-8f1f-9d357f6ce7a5')
			.end((err, response) => {
				expect(response.body.data).to.be.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching Root Tenant user datails', function(done) {
		agent
			.get(`/pug/user-manager/tenant-users/${tenantUserId}?_=1566458482116&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return the Root Tenant user details', function(done) {
		agent
			.get(`/pug/user-manager/tenant-users/${tenantUserId}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.included[0].attributes).to.have.property('name').eql('Plant.Works');
				expect(response.body.included[0].attributes).to.have.property('sub_domain').eql('www');
				done(err);
			});
	});

	it('Should display profile image for Root Tenant User', function(done) {
		agent
			.get(`/pug/user-manager/get-image/${tenantUserId}/?random=1566462172216`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('should be able to update profile image for Root Tenant User', function(done) {
		agent
			.post(`/pug/user-manager/upload-image/${tenantUserId}`)
			.type('form')
			.send({
				'image': imageData,
				'metadata': {
					'points': [420, 0, 1501, 1081],
					'zoom': 0.3042,
					'orientation': 1
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to search availible users when we are adding an user', function(done) {
		agent
			.get('/pug/user-manager/searchUsers')
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should return the Root user details', function(done) {
		agent
			.get(`/pug/user-manager/users/${rootUserId}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('email').eql('root@plant.works');
				expect(response.body.data.attributes).to.have.property('first_name').eql('Root');
				expect(response.body.data.attributes).to.have.property('last_name').eql('PlantWorks');
				expect(response.body.data.attributes).to.have.property('nickname').eql('root');
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching Root user datails', function(done) {
		agent
			.get(`/pug/user-manager/users/${rootUserId}?_=1566458482116&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should not be able to create a user if his email is empty', function(done) {
		agent
			.post('/pug/user-manager/users')
			.send({
				'data': {
					'attributes': {
						'email': '',
						'first_name': 'New',
						'last_name': 'User',
						'password': '1234'
					},
					'type': 'pug/user-manager/users'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should not be able to create a user if his First Name is empty', function(done) {
		agent
			.post('/pug/user-manager/users')
			.send({
				'data': {
					'attributes': {
						'email': 'new.user@www.com',
						'first_name': '',
						'last_name': 'User',
						'password': '1234'
					},
					'type': 'pug/user-manager/users'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should not be able to create a user if his Last Name is empty', function(done) {
		agent
			.post('/pug/user-manager/users')
			.send({
				'data': {
					'attributes': {
						'email': 'new1.user@www.com',
						'first_name': 'New',
						'last_name': '',
						'password': '1234 '
					},
					'type': 'pug/user-manager/users'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create a randomly generated password if his Password is given as null', function(done) {
		agent
			.post('/pug/user-manager/users')
			.send({
				'data': {
					'attributes': {
						'email': 'new2.user@www.com',
						'first_name': 'New2',
						'last_name': 'User2',
						'password': ' '
					},
					'type': 'pug/user-manager/users'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				createdUserId1 = response.body.data.id;
				done(err);
			});
	});

	it('Should create a randomly generated password if his Password is given as empty srting', function(done) {
		agent
			.post('/pug/user-manager/users')
			.send({
				'data': {
					'attributes': {
						'email': 'new3.user@www.com',
						'first_name': 'New3',
						'last_name': 'User3',
						'password': ''
					},
					'type': 'pug/user-manager/users'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				createdUserId2 = response.body.data.id;
				done(err);
			});
	});

	// it('Should create a randomly generated password if we give generate password option', function(done) {
	// 	agent
	// 		.post('/pug/user-manager/users')
	// 		.send({
	// 			'data': {
	// 				'attributes': {
	// 					'email': 'new3.user@www.com',
	// 					'first_name': 'New3',
	// 					'last_name': 'User3',
	// 					'password': ' '
	// 				},
	// 				'type': 'pug/user-manager/users'
	// 			}
	// 		})
	// 		.end((err, response) => {
	// 			expect(response).to.have.status(200);
	// 			createdUserId2 = response.body.data.id;
	// 			done(err);
	// 		});
	// });

	it('Should be able to create a user if all details are filled', function(done) {
		agent
			.post('/pug/user-manager/users')
			.send({
				'data': {
					'attributes': {
						'email': 'new4.user@www.com',
						'first_name': 'New4',
						'last_name': 'User4',
						'password': '1234'
					},
					'type': 'pug/user-manager/users'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				createdUserId3 = response.body.data.id;
				done(err);
			});
	});

	it('Should be able to create a tenant user if all details are filled', function(done) {
		agent
			.post('/pug/user-manager/tenant-users')
			.send({
				'data': {
					'attributes': {
						'access_status': 'waiting'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'user': {
							'data': {
								'id': createdUserId2,
								'type': 'pug/user-manager/users'
							}
						}
					},
					'type': 'pug/user-manager/tenant-users'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				createdTenantUserId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw an error if we try to update a non existing tenant user details', function(done) {
		agent
			.patch(`/pug/user-manager/tenant-users/13c9393c-83d1-4667-8f1f-9d357f6ce7a5`)
			.send({
				'data': {
					'attributes': {
						'access_status': 'authorized'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'user': {
							'data': {
								'id': createdUserId2,
								'type': 'pug/user-manager/users'
							}
						}
					},
					'id': '13c9393c-83d1-4667-8f1f-9d357f6ce7a5',
					'type': 'pug/user-manager/tenant-users'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to update a tenant user details', function(done) {
		agent
			.patch(`/pug/user-manager/tenant-users/${createdTenantUserId}`)
			.send({
				'data': {
					'attributes': {
						'access_status': 'authorized'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'user': {
							'data': {
								'id': createdUserId2,
								'type': 'pug/user-manager/users'
							}
						}
					},
					'id': createdTenantUserId,
					'type': 'pug/user-manager/tenant-users'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to get all the availible panel(s) to a non existing tenant user', function(done) {
		agent
			.get('/pug/user-manager/panels?user_id=13c9393c-83d1-4667-8f1f-9d357f6ce7a5')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to get all the availible panel(s) to the created tenant user', function(done) {
		agent
			.get(`/pug/user-manager/panels?user_id=${createdUserId2}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to give a panel access to non existing tenant user', function(done) {
		const formData = [{
			'id': newPanelId,
			'name': 'New Panel',
			'path': [
				'board_feature.folder_names.root.name',
				'board_feature.folder_names.panels.name',
				'New Panel'
			],
			'tenant_folder_id': panelNodeId,
			'newAccess': true,
			'currentAccess': false
		}];

		agent
			.post('/pug/user-manager/panels')
			.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
			.field('tenantPanels', JSON.stringify(formData))
			.field('tenant_user_id', '13c9393c-83d1-4667-8f1f-9d357f6ce7a5')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to give a non existing panel access to new tenant user', function(done) {
		const formData = [{
			'id': '13c9393c-83d1-4667-8f1f-9d357f6ce7a5',
			'name': 'New Panel',
			'path': [
				'board_feature.folder_names.root.name',
				'board_feature.folder_names.panels.name',
				'New Panel'
			],
			'tenant_folder_id': panelNodeId,
			'newAccess': true,
			'currentAccess': false
		}];

		agent
			.post('/pug/user-manager/panels')
			.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
			.field('tenantPanels', JSON.stringify(formData))
			.field('tenant_user_id', createdTenantUserId)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to give a panel access to new tenant user', function(done) {
		const formData = [{
			'id': newPanelId,
			'name': 'New Panel',
			'path': [
				'board_feature.folder_names.root.name',
				'board_feature.folder_names.panels.name',
				'New Panel'
			],
			'tenant_folder_id': panelNodeId,
			'newAccess': true,
			'currentAccess': false
		}];

		agent
			.post('/pug/user-manager/panels')
			.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
			.field('tenantPanels', JSON.stringify(formData))
			.field('tenant_user_id', createdTenantUserId)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to remove a panel access to non existing tenant user', function(done) {
		const formData = [{
			'id': newPanelId,
			'name': 'New Panel',
			'path': [
				'board_feature.folder_names.root.name',
				'board_feature.folder_names.panels.name',
				'New Panel'
			],
			'tenant_folder_id': panelNodeId,
			'newAccess': false,
			'currentAccess': true
		}];

		agent
			.post('/pug/user-manager/panels')
			.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
			.field('tenantPanels', JSON.stringify(formData))
			.field('tenant_user_id', '13c9393c-83d1-4667-8f1f-9d357f6ce7a5')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to remove a non existing panel access to new tenant user', function(done) {
		const formData = [{
			'id': '13c9393c-83d1-4667-8f1f-9d357f6ce7a5',
			'name': 'New Panel',
			'path': [
				'board_feature.folder_names.root.name',
				'board_feature.folder_names.panels.name',
				'New Panel'
			],
			'tenant_folder_id': panelNodeId,
			'newAccess': false,
			'currentAccess': true
		}];

		agent
			.post('/pug/user-manager/panels')
			.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
			.field('tenantPanels', JSON.stringify(formData))
			.field('tenant_user_id', createdTenantUserId)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to remove a panel access to new tenant user', function(done) {
		const formData = [{
			'id': newPanelId,
			'name': 'New Panel',
			'path': [
				'board_feature.folder_names.root.name',
				'board_feature.folder_names.panels.name',
				'New Panel'
			],
			'tenant_folder_id': panelNodeId,
			'newAccess': false,
			'currentAccess': true
		}];

		agent
			.post('/pug/user-manager/panels')
			.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
			.field('tenantPanels', JSON.stringify(formData))
			.field('tenant_user_id', createdTenantUserId)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to get all the availible report(s) to the created tenant user', function(done) {
		agent
			.get(`/pug/user-manager/reports?user_id=${createdUserId2}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to give a panel access to new tenant user', function(done) {
		const formData = [{
			'id': newReportID,
			'name': 'New Report',
			'path': [
				'report_feature.folder_names.root.name',
				'report_feature.folder_names.reports.name',
				'New Report'
			],
			'tenant_folder_id': reportsNodeId,
			'newAccess': true,
			'currentAccess': false
		}];

		agent
			.post('/pug/user-manager/reports')
			.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
			.field('tenantReports', JSON.stringify(formData))
			.field('tenant_user_id', createdTenantUserId)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to delete non existing tenant user', function(done) {
		agent
			.del('/pug/user-manager/tenant-users/895d431e-74ce-422b-bfd2-c5427eb54g92')
			.end((error, response) => {
				expect(response).to.have.status(422);
				done(error);
			});
	});

	it('Should be able to delete created tenant user', function(done) {
		agent
			.del(`/pug/user-manager/tenant-users/${createdTenantUserId}`)
			.end((error, response) => {
				expect(response).to.have.status(204);
				done(error);
			});
	});

	it('Should throw an error if we use already existing Email Id', function(done) {
		agent
			.post('/pug/user-manager/users')
			.send({
				'data': {
					'attributes': {
						'email': 'new3.user@www.com',
						'first_name': 'New',
						'last_name': 'User',
						'password': '1234'
					},
					'type': 'pug/user-manager/users'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should not be able to update tenant user details for invalid user', function(done) {
		agent
			.patch('/pug/user-manager/users/895d431e-74ce-422b-bfd2-c5427eb54g92')
			.send({
				'data': {
					'id': '895d431e-74ce-422b-bfd2-c5427eb54f9c',
					'attributes': {
						'first_name': 'Root1',
						'last_name': 'Plantworks1'
					},
					'type': 'pug/user-manager/users'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should not be able to update Root user details if First Name is null', function(done) {
		agent
			.patch(`/pug/user-manager/users/${rootUserId}`)
			.send({
				'data': {
					'attributes': {
						'first_name': '',
						'last_name': 'Plantworks'
					},
					'id': rootUserId,
					'type': 'pug/user-manager/users'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should not be able to update Root user details if Last Name is null', function(done) {
		agent
			.patch(`/pug/user-manager/users/${rootUserId}`)
			.send({
				'data': {
					'attributes': {
						'first_name': 'Root',
						'last_name': ''
					},
					'id': rootUserId,
					'type': 'pug/user-manager/users'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to update Root user details if all details are filled', function(done) {
		agent
			.patch(`/pug/user-manager/users/${rootUserId}`)
			.send({
				'data': {
					'id': rootUserId,
					'attributes': {
						'first_name': 'Root',
						'last_name': 'PlantWorks'
					},
					'type': 'pug/user-manager/users'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw a reset password error if User is invalid', function(done) {
		agent
			.post('/pug/user-manager/resetPassword')
			.type('form')
			.send({
				'user': '895d431e-74ce-422b-bfd2-c5427eb54f9c',
				'password': '1234',
				'generate': false
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw a reset password error if new password is empty', function(done) {
		agent
			.post('/pug/user-manager/resetPassword')
			.type('form')
			.send({
				'user': rootUserId,
				'password': ''
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should reset password if User is valid', function(done) {
		agent
			.post('/pug/user-manager/resetPassword')
			.type('form')
			.send({
				'user': rootUserId,
				'password': '1234',
				'generate': false
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should generate password if we give generate password option as true', function(done) {
		agent
			.post('/pug/user-manager/resetPassword')
			.type('form')
			.send({
				'user': rootUserId,
				'password': '',
				'generate': false
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to delete an invalid user', function(done) {
		agent
			.del('/pug/user-manager/users/895d431e-74ce-422b-bfd2-c5427eb54f9c')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete already created user', function(done) {
		agent
			.del(`/pug/user-manager/users/${createdUserId1}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				if(err) {
					done(err);
					return;
				}

				agent
					.get('/session/logout')
					.end((err1) => {
						if(err1) {
							done(err1);
							return;
						}

						agent
							.post('/session/login')
							.type('form')
							.send({
								'username': 'new4.user@www.com',
								'password': '1234'
							})
							.end((err2) => {
								done(err2);
							});
					});
			});
	});

	it('Should not allow adding a group by a user who is not Tenant User', function(done) {
		agent
			.post('/pug/group-manager/tenant-groups')
			.send({
				'data': {
					'attributes': {
						'display_name': 'New Group',
						'description': 'New group',
						'default_for_new_user': false,
						'name': 'new-group'
					},
					'relationships': {
						'parent': {
							'data': {
								'id': administratorId,
								'type': 'pug/group-manager/tenant-groups'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					}
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error when we try to delete tanent group by a user who is not a Tenant User', function(done) {
		agent
			.del(`/pug/group-manager/tenant-groups/${tenantGroupId2}`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				if(err) {
					done(err);
					return;
				}

				agent
					.get('/session/logout')
					.end((err1, response1) => {
						expect(response1).to.have.status(200);
						if(err1) {
						done(err1);
						return;
						}

						agent
							.post('/session/login')
							.type('form')
							.send({
								'username': 'root@plant.works',
								'password': '1234'
							})
							.end((err2, response2) => {
								expect(response2).to.have.status(200);
								if(err2) {
									done(err2);
									return;
								}

								agent
									.post('/pug/user-manager/tenant-users')
									.send({
										'data': {
											'attributes': {
												'access_status': 'authorized'
											},
											'relationships': {
												'tenant': {
													'data': {
														'id': tenantId,
														'type': 'settings/account/basics/tenants'
													}
												},
												'user': {
													'data': {
														'id': createdUserId3,
														'type': 'pug/user-manager/users'
													}
												}
											},
											'type': 'pug/user-manager/tenant-users'
										}
									})
									.end((err3, response3) => {
										expect(response3).to.have.status(200);
										tenantUserId1 = response3.body.data.id;
										done(err3);
									});
							});
					});
			});
	});

	it('Should be able to get profile image for created user', function(done) {
		agent
			.get(`/pug/user-manager/get-image/${tenantUserId1}/?random=1566462172216`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('should be able to update profile image for New User', function(done) {
		agent
			.post(`/pug/user-manager/upload-image/${tenantUserId}`)
			.type('form')
			.send({
				'image': imageData,
				'metadata': {
					'points': [420, 0, 1501, 1081],
					'zoom': 0.3042,
					'orientation': 1
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				if(err) {
					done(err);
					return;
				}

				agent
					.get('/session/logout')
					.end((err1, response1) => {
						expect(response1).to.have.status(200);
						if(err1) {
							done(err1);
							return;
						}

						agent
							.post('/session/login')
							.type('form')
							.send({
								'username': 'new4.user@www.com',
								'password': '1234'
							})
							.end((err2, response2) => {
								expect(response2).to.have.status(200);
								done(err2);
							});
					});
			});
});

	it('Should throw an error when we try to delete tanent group by invalid Tenant User', function(done) {
		agent
			.del(`/pug/group-manager/tenant-groups/${tenantGroupId2}`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				if(err) {
					done(err);
					return;
				}

				agent
					.get('/session/logout')
					.end((err1, response1) => {
						expect(response1).to.have.status(200);
						done(err1);
					});
			});
	});

});
