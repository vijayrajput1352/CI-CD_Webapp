/* eslint-disable no-mixed-spaces-and-tabs */
'use strict';

const chai = require('chai'); // eslint-disable-line node/no-unpublished-require
const chaiHttp = require('chai-http'); // eslint-disable-line node/no-unpublished-require
const imageUri = require('image-data-uri');

chai.use(chaiHttp);


describe('Profile Feature Test Cases', function() {
	const agent = chai.request.agent('http://localhost:9100');
	const expect = chai.expect;
	let contactId, contactId1, tenantId, userId;
	let createdUserId, createdUserId1, tenantUserId;
	let imageData, imageData1;
	let superAdministratorId;

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

	chai.should();

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
					userId = response1.body.user_id;
					tenantId = response1.body.tenant_id;
					if(err1) {
						done(err1);
						return;
					}

					agent
						.post('/pug/user-manager/users')
						.send({
							'data': {
								'attributes': {
									'email': 'new5.user.test@www.com',
									'first_name': 'New5',
									'last_name': 'User5',
									'password': '1234'
								},
								'type': 'pug/user-manager/users'
							}
						})
						.end((err2, response2) => {
							createdUserId = response2.body.data.id;
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
													'id': createdUserId,
													'type': 'pug/user-manager/users'
												}
											}
										},
										'type': 'pug/user-manager/tenant-users'
									}
								})
								.end((err3) => {
									if(err3) {
										done(err3);
										return;
									}

									agent
										.post('/pug/user-manager/users')
										.send({
											'data': {
												'attributes': {
													'email': 'demo.user@www.com',
													'first_name': 'demo',
													'last_name': 'User',
													'password': '1234'
												},
												'type': 'pug/user-manager/users'
											}
										})
										.end((err4, response4) => {
											createdUserId1 = response4.body.data.id;
											if(err4) {
												done(err4);
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
																	'id': createdUserId1,
																	'type': 'pug/user-manager/users'
																}
															}
														},
														'type': 'pug/user-manager/tenant-users'
													}
												})
												.end((err5, response5) => {
													tenantUserId = response5.body.data.id;
													if(err5) {
														done(err5);
														return;
													}

													agent
														.get('/pug/group-manager/tree?id=%23&_=1566209871952')
														.end((err6, response6) => {
															superAdministratorId = response6.body[0].id;
															if(err) {
																done(err6);
																return;
															}

															agent
																.post('/pug/group-manager/tenant-user-groups')
																.send({
																	'data': {
																		'attributes': {},
																		'relationships': {
																			'tenant_group': {
																				'data': {
																					'id': superAdministratorId,
																					'type': 'pug/group-manager/tenant-groups'
																				}
																			},
																			'tenant_user': {
																				'data': {
																					'id': tenantUserId,
																					'type': 'pug/user-manager/tenant-users'
																				}
																			}
																		},
																		'type': 'pug/group-manager/tenant-user-groups'
																	}
																})
																.end((err7) => {
																	if(err7) {
																		done(err7);
																		return;
																	}

																	agent
																		.get('/session/logout')
																		// eslint-disable-next-line max-nested-callbacks
																		.end((err8) => {
																				if(err8) {
																					done(err8);
																					return;
																				}

																				agent
																					.post('/session/login')
																					.type('form')
																					.send({
																						'username': 'demo.user@www.com',
																						'password': '1234'
																					})
																					// eslint-disable-next-line max-nested-callbacks
																					.end((err9) => {
																						done(err9);
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

	after(function(done) {
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
					.del(`/profile/user-contacts/${contactId1}`)
					.end((err1, response) => {
						expect(response).to.have.status(204);
						if(err1) {
							done(err1);
							return;
						}

						agent
							.post('/profile/upload-image')
							.type('form')
							.send({
								'image': imageData1,
								'metadata': {
									'points': [2, 0, 336, 334],
									'zoom': 1,
									'orientation': 1
								}
							})
							.end((err2, response2) => {
								expect(response2).to.have.status(200);
								if(err2) {
									done(err2);
									return;
								}

								knex.raw(`UPDATE users SET profile_image = ? WHERE email = ?`, ['f8a9da32-26c5-495a-be9a-42f2eb8e4ed1', 'root@plant.works'])
								.then(() => {
									agent
									.get('/session/logout')
									.end((err3) => {
											done(err3);
									});
								})
								.catch((err4) => {
									done(err4);
								})
								.finally(() => {
									return knex.destroy();
								});
							});
					});
			});
	});

	it('Should be return anonymous.jpg if we try to get profile image of newly created user', function(done) {
		agent
			.get('/profile/get-image?_random=1538566796891')
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to upload new Profile image for New user', function(done) {
		agent
			.post('/profile/upload-image')
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

	it('Should be able to delete created Demo User with Super User privileges as another Super User Root exists under same tenant', function(done) {
		agent
			.del(`/profile/users/${createdUserId1}`)
			.end((err, response) => {
				expect(response.status).to.eql(204);
				if(err) {
					done(err);
					return;
				}

				agent
					.post('/session/login')
					.type('form')
					.send({
						'username': 'root@plant.works',
						'password': 'plantworks'
					})
					.end((err1) => {
						done(err1);
					});
			});
	});

	it('Should return profile image if logged in', function(done) {
		agent
			.get('/profile/get-image?_random=1538566796891')
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should give proper user id', function(done) {
		agent
			.get(`/profile/users/${userId}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				response.body.data.should.have.property('id').eql(userId);
				done(err);
			});
	});

	// it('Should throw an error if we try to get details of a non existing user', function(done) {
	// 	agent
	// 		.get('/profile/users/13c9393c-83d1-4667-8f1f-9d357f6ce7a5')
	// 		.end((err, response) => {
	// 			console.error('response', response.body);
	// 			expect(response).to.have.status(422);
	// 			done(err);
	// 		});
	// });

	it('Should throw an error if we try to get details of root user by providing invalid query params in request', function(done) {
		agent
			.get(`/profile/users/${userId}?_=1565679224512&include=trwy`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should have all root user details in profile section', function(done) {
		agent
			.get(`/profile/users/${userId}?_=1565679224512&include`)
			.end((err, response) => {
				expect(response.body.data.attributes).to.have.property('first_name').eql('Root');
				response.body.data.attributes.should.have.property('last_name').eql('PlantWorks');
				response.body.data.attributes.should.have.property('email').eql('root@plant.works');
				response.body.data.attributes.should.have.property('nickname').eql('root');
				done(err);
			});
	});

	it('Should throw an error if Last Name is null', function(done) {
		agent
			.patch(`/profile/users/${userId}`)
			.send({
				'data': {
					'attributes': {
						'first_name': 'Root1',
						'middle_names': ' ',
						'last_name': ''
					},
					'id': userId,
					'type': 'profile/users'
				}

			})
			.end((err, response) => {
				expect(response.status).to.eql(422);
				done(err);
			});
	});

	it('Should throw an error if First Name is null', function(done) {
		agent
			.patch(`/profile/users/${userId}`)
			.send({
				'data': {
					'attributes': {
						'first_name': '',
						'last_name': 'Plantworks'
					},
					'id': userId,
					'type': 'profile/users'
				}
			})
			.end((err, response) => {
				expect(response.status).to.eql(422);
				done(err);
			});
	});

	it('Should allow updating profile if all details are filled', function(done) {
		agent
			.patch(`/profile/users/${userId}`)
			.send({
				'data': {
					'attributes': {
						'first_name': 'Root',
						'last_name': 'PlantWorks'
					},
					'id': userId,
					'type': 'profile/users'
				}
			})
			.end((err, response) => {
				expect(response.status).to.eql(200);
				done(err);
			});
	});

	it('Should be able to upload new Profile image for Root user', function(done) {
		agent
			.post('/profile/upload-image')
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

	it('Should not allow changing Password if passwords do not match', function(done) {
		agent
			.post('/profile/changePassword')
			.type('form')
			.send({
				'currentPassword': 'plantworks',
				'newPassword1': '1234',
				'newPassword2': '2345'
			})
			.end((err, response) => {
				expect(response.status).to.eql(422);
				done(err);
			});
	});

	it('Should give an error if any field of Password is empty', function(done) {
		agent
			.post('/profile/changePassword')
			.type('form')
			.send({
				'currentPassword': 'plantworks',
				'newPassword1': '',
				'newPassword2': ''
			})
			.end((err, response) => {
				expect(response.status).to.eql(422);
				done(err);
			});
	});

	it('Should give an error if current Password is empty', function(done) {
		agent
			.post('/profile/changePassword')
			.type('form')
			.send({
				'currentPassword': ' ',
				'newPassword1': 'plantworks',
				'newPassword2': 'plantworks'
			})
			.end((err, response) => {
				expect(response.status).to.eql(422);
				done(err);
			});
	});

	it('Should give an error if current password is wrong', function(done) {
		agent
			.post('/profile/changePassword')
			.type('form')
			.send({
				'currentPassword': '1234',
				'newPassword1': 'plantworks',
				'newPassword2': 'plantworks'
			})
			.end((err, response) => {
				expect(response.status).to.eql(422);
				done(err);
			});
	});

	it('Should allow changing Password If all fields are correctly filled', function(done) {
		agent
			.post('/profile/changePassword')
			.type('form')
			.send({
				'currentPassword': 'plantworks',
				'newPassword1': 'plantworks',
				'newPassword2': 'plantworks'
			})
			.end((err, response) => {
				expect(response.status).to.eql(200);
				done(err);
			});
	});

	it('Should throw an error if we try to delete only Super User under same tenant', function(done) {
		agent
			.del(`/profile/users/${userId}`)
			.end((err, response) => {
				expect(response.status).to.eql(422);
				done(err);
			});
	});

	it('Should allow to add a user contact', function(done) {
		agent
			.post('/profile/user-contacts')
			.send({
				'data': {
					'attributes': {
						'contact': 9980908857,
						'type': 'mobile',
						'verified': false
					},
					'relationships': {
						'user': {
							'data': {
								'id': userId,
								'type': 'profile/users'
							}
						}
					},
					'type': 'profile/user-contacts'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				contactId = response.body.data.id;
				if(err) {
					done(err);
					return;
				}

				agent
					.post('/profile/user-contacts')
					.send({
						'data': {
							'attributes': {
								'contact': 7760755889,
								'type': 'mobile',
								'verified': false
							},
							'relationships': {
								'user': {
									'data': {
										'id': userId,
										'type': 'profile/users'
									}
								}
							},
							'type': 'profile/user-contacts'
						}
					})
					.end((err1, response1) => {
						contactId1 = response1.body.data.id;
						done(err1);
					});

			});
	});

	it('Should be able to delete the added user contact', function(done) {
		agent
			.del(`/profile/user-contacts/${contactId}`)
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
								'username': 'new5.user@www.com',
								'password': '1234'
							})
							.end((err2) => {
									done(err2);
							});
					});
			});
	});

	it('Should throw an error if we try to delete a contact of different user', function(done) {
		agent
			.del(`/profile/user-contacts/${contactId1}`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete the created user', function(done) {
		agent
			.del(`/profile/users/${createdUserId}`)
			.end((err, response) => {
				expect(response.status).to.eql(204);
				done(err);
			});
	});

});
