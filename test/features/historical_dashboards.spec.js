/* eslint-disable max-nested-callbacks */
'use strict';

const chai = require('chai'); // eslint-disable-line node/no-unpublished-require
const chaiHttp = require('chai-http'); // eslint-disable-line node/no-unpublished-require

chai.use(chaiHttp);

describe('Test cases for the Historical Dashboards', function() {
	const agent	= chai.request.agent('http://localhost:9100');
	// eslint-disable-next-line no-unused-vars
	const agnt = chai.request.agent('http://pw.plant.works:9100');
	const expect = chai.expect;

	let nodeId, tenantId;
	let dataSetsNodeId, historicalNodeId;
	let newDataSetFolderId, newDataSetId, newDataSetPropertiesId;
	let newBeforeFunctionId, newDataSetObserveFunctionPropertyId, newObserveFunctionId;
	let newHistoricalDashboardId, newWatcherID;
	let newTrackDataSetId, rootUserId;
	let newHistoricalDashboardLineConstituentsId, newHistoricalDashboardMachineConstituentsId;
	let newBackendCodeId, newInputComponentCode, newInputFormatterCode, newMainProcessorCode, newResponseFormatter, newResultComponentCode;
	let tempDataSetFolderId, tempDataSetId, tempDataSetPropertiesId, tempHistoricalDashboard;
	let dataSetsNodeIdTemp, historicalNodeIdTemp, nodeIdTempHistoricalDashboard, nodeIdTempManufacturing,
		plantNodeIdTemp, tempLineId, tempMachineId, tempPlantId, tempPlantUnitId;

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
					.end((err1, response) => {
						tenantId = response.body.tenant_id;
						if(err1) {
							done(err1);
							return;
						}

						agent
							.get(`/configure/nodes?_=1569908851488`)
							.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36')
							.end((error1, response1) => {
								expect(response1).to.have.status(200);
								nodeIdTempHistoricalDashboard = response1.body.data[2].id;
								nodeIdTempManufacturing = response1.body.data[3].id;
								if(error1) {
									done(error1);
									return;
								}

								agent
									.get(`/historical-dashboard/config-tree-nodes?node_id=${nodeIdTempHistoricalDashboard}&node_type=root-folder&_=1569908851489`)
									.end((error2, response2) => {
										expect(response2).to.have.status(200);
										if(response2.body[0].data.type === 'attribute-folder') {
											historicalNodeIdTemp = response2.body[1].id;
											dataSetsNodeIdTemp = response2.body[0].id;
										}
										else {
											historicalNodeIdTemp = response2.body[0].id;
											dataSetsNodeIdTemp = response2.body[1].id;
										}
										if(error2) {
											done(error2);
											return;
										}

										agent
											.post(`/historical-dashboard/folders`)
											.send({
												'data': {
													'attributes': {
														'name': 'Temp Folder',
														'description': ' '
													},
													'relationships': {
														'parent': {
															'data': {
																'id': dataSetsNodeIdTemp,
																'type': 'historical-dashboard/folders'
															}
														},
														'tenant': {
															'data': {
																'id': tenantId,
																'type': 'settings/account/basics/tenants'
															}
														}
													},
													'id': tempDataSetFolderId,
													'type': 'historical-dashboard/folders'
												}
											})
											.end((error3, response3) => {
												expect(response3).to.have.status(200);
												tempDataSetFolderId = response3.body.data.id;
												if(error3) {
													done(error3);
													return;
												}

												agent
													.post(`/historical-dashboard/attribute-sets`)
													.send({
														'data': {
															'attributes': {
																'name': 'Temp Data-Set',
																'description': ' '
															},
															'relationships': {
																'folder': {
																	'data': {
																		'id': dataSetsNodeIdTemp,
																		'type': 'historical-dashboard/folders'
																	}
																},
																'tenant': {
																	'data': {
																		'id': tenantId,
																		'type': 'settings/account/basics/tenants'
																	}
																}
															},
															'id': tempDataSetId,
															'type': 'historical-dashboard/attribute-sets'
														}
													})
													.end((error4, response4) => {
														tempDataSetId = response4.body.data.id;
														if(error4) {
															done(error4);
															return;
														}

														agent
															.post('/historical-dashboard/attribute-set-properties')
															.send({
																'data': {
																	'attributes': {
																		'name': 'Temp Data-Set-Property',
																		'description': ' ',
																		'source': 'input',
																		'datatype': 'number',
																		'evaluation_expression': null,
																		'internal_tag': 'TEMP_DATA_SET_PROPERTY',
																		'timestamp_format': 'not_a_timestamp',
																		'units': null
																	},
																	'relationships': {
																		'attribute_set': {
																			'data': {
																				'id': tempDataSetId,
																				'type': 'historical-dashboard/attribute-sets'
																			}
																		},
																		'tenant': {
																			'data': {
																				'id': tenantId,
																				'type': 'settings/account/basics/tenants'
																			}
																		}
																	},
																	'id': tempDataSetPropertiesId,
																	'type': 'historical-dashboard/attribute-set-properties'
																}
															})
															.end((error5, response5) => {
																expect(response5).to.have.status(200);
																tempDataSetPropertiesId = response5.body.data.id;
																if(error5) {
																	done(error5);
																	return;
																}

																agent
																	.post('/historical-dashboard/historical-dashboards')
																	.send({
																		'data': {
																			'attributes': {
																				'attribute_set_metadata': [],
																				'data_persistence_period': 1,
																				'name': 'Temp Historical Dashboard',
																				'description': ' '
																			},
																			'relationships': {
																				'folder': {
																					'data': {
																						'id': historicalNodeIdTemp,
																						'type': 'historical-dashboard/folders'
																					}
																				},
																				'tenant': {
																					'data': {
																						'id': tenantId,
																						'type': 'settings/account/basics/tenants'
																					}
																				}
																			},
																			'id': tempHistoricalDashboard,
																			'type': 'historical-dashboard/historical-dashboards'
																		}
																	})
																	.end((error6, response6) => {
																		expect(response6).to.have.status(200);
																		tempHistoricalDashboard = response6.body.data.id;
																		if(error6) {
																			done(error6);
																			return;
																		}

																		agent
																			.get(`/manufacturing/config-tree-nodes?node_id=${nodeIdTempManufacturing}&node_type=root-folder&_=1574228443915`)
																			.end((error7, response7) => {
																				expect(response7).to.have.status(200);
																				// eslint-disable-next-line curly
																				if(response7.body[0].data.type === 'attribute-folder') {
																					plantNodeIdTemp = response7.body[1].id;
																				}
																				// eslint-disable-next-line curly
																				else {
																					plantNodeIdTemp = response7.body[0].id;
																				}
																				if(error7) {
																					done(error7);
																					return;
																				}

																				agent
																					.post(`/manufacturing/plants`)
																					.send({
																						'data': {
																							'attributes': {
																								'name': 'Temp Plant',
																								'description': ' '
																							},
																							'relationships': {
																								'folder': {
																									'data': {
																										'id': plantNodeIdTemp,
																										'type': 'manufacturing/folders'
																									}
																								},
																								'tenant': {
																									'data': {
																										'id': tenantId,
																										'type': 'settings/account/basics/tenants'
																									}
																								}
																							},
																							'type': 'manufacturing/plants'
																						}
																					})
																					.end((error8, response8) => {
																						expect(response8).to.have.status(200);
																						tempPlantId = response8.body.data.id;
																						if(error8) {
																							done(error8);
																							return;
																						}

																						agent
																							.post(`/manufacturing/plant-units`)
																							.send({
																								'data': {
																									'attributes': {
																										'name': 'Temp Plant Unit',
																										'description': ' '
																									},
																									'relationships': {
																										'plant': {
																											'data': {
																												'id': tempPlantId,
																												'type': 'manufacturing/plants'
																											}
																										},
																										'tenant': {
																											'data': {
																												'id': tenantId,
																												'type': 'settings/account/basics/tenants'
																											}
																										}
																									},
																									'type': 'manufacturing/plant-units'
																								}
																							})
																							.end((error9, response9) => {
																								expect(response9).to.have.status(200);
																								tempPlantUnitId = response9.body.data.id;
																								if(error9) {
																									done(error9);
																									return;
																								}

																								agent
																									.post(`/manufacturing/plant-unit-machines`)
																									.send({
																										'data': {
																											'attributes': {
																												'name': 'Temp Machine',
																												'description': ' ',
																												'attribute_set_metadata': [],
																												'type': 'machine',
																												'data_persistence_period': 1,
																												'downtime_list_filters': [],
																												'operator_list_filters': []
																											},
																											'relationships': {
																												'tenant_plant_unit': {
																													'data': {
																														'id': tempPlantUnitId,
																														'type': 'manufacturing/plant-units'
																													}
																												},
																												'tenant': {
																													'data': {
																														'id': tenantId,
																														'type': 'settings/account/basics/tenants'
																													}
																												}
																											},
																											'type': 'manufacturing/plant-unit-machines'
																										}
																									})
																									.end((error10, response10) => {
																										expect(response10).to.have.status(200);
																										tempMachineId = response10.body.data.id;
																										if(error10) {
																											done(error10);
																											return;
																										}

																										agent
																											.post(`/manufacturing/plant-unit-lines`)
																											.send({
																												'data': {
																													'attributes': {
																														'name': 'Temp Line',
																														'description': ' ',
																														'attribute_set_metadata': []
																													},
																													'relationships': {
																														'tenant_plant_unit': {
																															'data': {
																																'id': tempPlantUnitId,
																																'type': 'manufacturing/plant-units'
																															}
																														},
																														'tenant': {
																															'data': {
																																'id': tenantId,
																																'type': 'settings/account/basics/tenants'
																															}
																														}
																													},
																													'type': 'manufacturing/plant-unit-lines'
																												}
																											})
																											.end((error11, response11) => {
																												expect(response11).to.have.status(200);
																												tempLineId = response11.body.data.id;
																												// if(error11) {
																													done(error11);
																												// 	return;
																												// }

																												// agent
																												// 	.post(`/manufacturing/plant-unit-stations`)
																												// 	.send({
																												// 		'data': {
																												// 			'attributes': {
																												// 				'name': 'Temp Station',
																												// 				'description': ' ',
																												// 				'attribute_set_metadata': []
																												// 			},
																												// 			'relationships': {
																												// 				'tenant_plant_unit': {
																												// 					'data': {
																												// 						'id': tempPlantUnitId,
																												// 						'type': 'manufacturing/plant-units'
																												// 					}
																												// 				},
																												// 				'tenant': {
																												// 					'data': {
																												// 						'id': tenantId,
																												// 						'type': 'settings/account/basics/tenants'
																												// 					}
																												// 				}
																												// 			},
																												// 			'type': 'manufacturing/plant-unit-lines'
																												// 		}
																												// 	})
																												// 	.end((error12, response12) => {
																												// 		expect(response12).to.have.status(200);
																												// 		tempStationId = response12.body.data.id;
																												// 		// if(error12) {
																												// 			done(error12);
																												// 			// return;
																												// 		// }
																												// 	});
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
					});
			});
	});

	after(function(done) {
		agent
			.del(`/historical-dashboard/folders/${tempDataSetFolderId}`)
			.end((err) => {
				if(err) {
					done(err);
					return;
				}

				agent
					.del(`/historical-dashboard/attribute-sets/${tempDataSetId}`)
					.end((err1) => {
						if(err1) {
							done(err1);
							return;
						}

						agent
							.del(`/manufacturing/plants/${tempPlantId}`)
							.end((err2) => {
								if(err2) {
									done(err2);
									return;
								}

								agent
									.del(`/historical-dashboard/historical-dashboards/${tempHistoricalDashboard}`)
									.end((err3) => {
										if(err3) {
											done(err3);
											return;
										}

										agent
											.get('/session/logout')
											.end((err4) => {
												done(err4);
											});
									});
							});
					});
			});
	});

	// 1st lvl
	// Test Cases for geting Basics details of the feature
	it('Should return proper Node details', function(done) {
		agent
			.get('/configure/nodes?_=1566818693175')
			.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36')
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data[2].attributes).to.have.property('name').eql('HistoricalDashboard');
				expect(response.body.data[2].attributes).to.have.property('node_type').eql('root-folder');
				expect(response.body.data[2].attributes).to.have.property('route').eql('historical-dashboard');
				nodeId = response.body.data[2].id;
				done(err);
			});
	});

	it('Should return existing tree for Root node', function(done) {
		agent
			.get(`/historical-dashboard/config-tree-nodes?node_id=${nodeId}&node_type=root-folder&_=1575888037532`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				if(response.body[0].data.type === 'attribute-folder') {
					expect(response.body[0]).to.have.property('children').eql(true);
					expect(response.body[0]).to.have.property('parent').eql(nodeId);
					expect(response.body[0].data).to.have.property('type').eql('attribute-folder');
					expect(response.body[1]).to.have.property('children').eql(true);
					expect(response.body[1]).to.have.property('parent').eql(nodeId);
					expect(response.body[1].data).to.have.property('type').eql('historical-dashboard-folder');
					historicalNodeId = response.body[1].id;
					dataSetsNodeId = response.body[0].id;
				}
				else {
					expect(response.body[1]).to.have.property('children').eql(true);
					expect(response.body[1]).to.have.property('parent').eql(nodeId);
					expect(response.body[1].data).to.have.property('type').eql('attribute-folder');
					expect(response.body[0]).to.have.property('children').eql(true);
					expect(response.body[0]).to.have.property('parent').eql(nodeId);
					expect(response.body[0].data).to.have.property('type').eql('historical-dashboard-folder');
					historicalNodeId = response.body[0].id;
					dataSetsNodeId = response.body[1].id;
				}
				done(err);
			});
	});

	it('Should return Root Tenant folder details', function(done) {
		agent
			.get(`/historical-dashboard/folders/${nodeId}?_=1566890475910`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('historical_dashboard_feature.folder_names.root.name');
				expect(response.body.data.attributes).to.have.property('description').eql('historical_dashboard_feature.folder_names.root.description');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(null);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.relationships.tenant.data).to.have.property('id').eql(tenantId);
				done(err);
			});
	});

	it('Should return the details for the data-set node', function(done) {
		agent
			.get(`/historical-dashboard/folders/${dataSetsNodeId}?_=1566890475910`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('historical_dashboard_feature.folder_names.attribute_sets.name');
				expect(response.body.data.attributes).to.have.property('description').eql('historical_dashboard_feature.folder_names.attribute_sets.description');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(nodeId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	it('Should return details for the historical node id', function(done) {
		agent
			.get(`/historical-dashboard/folders/${historicalNodeId}?_=1566890475910`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('historical_dashboard_feature.folder_names.historical_dashboards.name');
				expect(response.body.data.attributes).to.have.property('description').eql('historical_dashboard_feature.folder_names.historical_dashboards.description');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(nodeId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	// 2nd lvl
	// Test Cases for the Data Set Folders
	it('Should return the tree for the data sets', function(done) {
		agent
			.get(`/historical-dashboard/config-tree-nodes?node_id=${dataSetsNodeId}&node_type=attribute-folder&_=1571828662252`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error while creating new folder with name as empty field', function(done) {
		agent
			.post('/historical-dashboard/folders')
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': ' '
					},
					'relationships': {
						'parent': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'historical-dashboard/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create new folder with valid name', function(done) {
		agent
			.post('/historical-dashboard/folders')
			.send({
				'data': {
					'attributes': {
						'name': 'New DataSet folder',
						'description': ' '
					},
					'relationships': {
						'parent': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newDataSetFolderId,
					'type': 'historical-dashboard/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newDataSetFolderId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while creating new folder with duplicate name', function(done) {
		agent
			.post('/historical-dashboard/folders')
			.send({
				'data': {
					'attributes': {
						'name': 'New DataSet folder',
						'description': ' '
					},
					'relationships': {
						'parent': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'historical-dashboard/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating non-existing folder', function(done) {
		agent
			.patch('/historical-dashboard/folders/848305dd-d59b-4cf5-91b2-22224c141a9f')
			.send({
				'data': {
					'attributes': {
						'name': 'New DataSet folder',
						'description': ' '
					},
					'relationships': {
						'parent': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'historical-dashboard/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the existing-folder with name as null or empty string', function(done) {
		agent
			.patch(`/historical-dashboard/folders/${newDataSetFolderId}`)
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': ' '
					},
					'relationships': {
						'parent': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'historical-dashboard/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the folder with duplicate name', function(done) {
		agent
			.patch(`/historical-dashboard/folders/${newDataSetFolderId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'Temp Folder',
						'description': ' '
					},
					'relationships': {
						'parent': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'historical-dashboard/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update the folder with valid name', function(done) {
		agent
			.patch(`/historical-dashboard/folders/${newDataSetFolderId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'New DataSet Folder',
						'description': ' '
					},
					'relationships': {
						'parent': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newDataSetFolderId,
					'type': 'historical-dashboard/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching the details for the folder', function(done) {
		agent
			.get(`/historical-dashboard/folders/${newDataSetFolderId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if we try to fetch details of non-existing folder', function(done) {
		agent
			.get(`/historical-dashboard/folders/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567414700691`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the existing folder', function(done) {
		agent
			.get(`/historical-dashboard/folders/${newDataSetFolderId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Data-Set
	it('Should throw error while creating new data-set for tenant which has no permission for Historical-Dashboards', function(done) {
		agnt
			.post(`/historical-dashboard/attribute-sets`)
			.send({
				'data': {
					'attributes': {
						'name': 'Tenant has no permission for Historical Dashboard',
						'description': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'historical-dashboard/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error while creating new data-set with name is null or empty', function(done) {
		agent
			.post(`/historical-dashboard/attribute-sets`)
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'historical-dashboard/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create new Data-seet if required details are filled', function(done) {
		agent
			.post(`/historical-dashboard/attribute-sets`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Data-Set',
						'description': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newDataSetId,
					'type': 'historical-dashboard/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newDataSetId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while creating new data-set with duplicate name', function(done) {
		agent
			.post(`/historical-dashboard/attribute-sets`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Data-Set',
						'description': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'historical-dashboard/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating a non existing data set', function(done) {
		agent
			.patch(`/historical-dashboard/attribute-sets/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Data Set',
						'description': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'historical-dashboard/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the data-set with name as null or empty string', function(done) {
		agent
			.patch(`/historical-dashboard/attribute-sets/${newDataSetId}`)
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newDataSetId,
					'type': 'historical-dashboard/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the data-set with duplicate name', function(done) {
		agent
			.patch(`/historical-dashboard/attribute-sets/${newDataSetId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'Temp Data-Set',
						'description': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newDataSetId,
					'type': 'historical-dashboard/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update data-set if all required details are valid', function(done) {
		agent
			.patch(`/historical-dashboard/attribute-sets/${newDataSetId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Data Set',
						'description': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newDataSetId,
					'type': 'historical-dashboard/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error if we provide invalid query params in url while fetching Data-set', function(done) {
		agent
			.get(`/historical-dashboard/attribute-sets/${newDataSetId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if we try to get details for the non-existing Data-set', function(done) {
		agent
			.get(`/historical-dashboard/attribute-sets/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567414700691`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should be able to get details of all availible Data set(s)', function(done) {
		agent
			.get(`/historical-dashboard/attribute-sets/${newDataSetId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching all availible Data Set(s) details', function(done) {
		agent
			.get('/historical-dashboard/attribute-sets?_=1567414700691&include=t')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should get all the attribute set detials', function(done) {
		agent
			.get(`/historical-dashboard/attribute-sets`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Data-Set Property
	it('Should throw error while creating new Data-Set Property with name as null or empty string', function(done) {
		agent
			.post(`/historical-dashboard/attribute-set-properties`)
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': ' ',
						'source': 'static',
						'datatype': 'number',
						'evaluation_expression': null,
						'internal_tag': 'NEW_DATA_SET_PROPERTY',
						'timestamp_format': 'not_a_timestamp',
						'units': null
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'historical-dashboard/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create new Data Set Property if all required details are filled', function(done) {
		agent
			.post(`/historical-dashboard/attribute-set-properties`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Data-Set-Property',
						'description': ' ',
						'source': 'static',
						'datatype': 'number',
						'evaluation_expression': null,
						'internal_tag': 'NEW_DATA_SET_PROPERTY',
						'timestamp_format': 'not_a_timestamp',
						'units': null
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newDataSetPropertiesId,
					'type': 'historical-dashboard/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newDataSetPropertiesId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while creating the data-set property with duplicate name', function(done) {
		agent
			.post(`/historical-dashboard/attribute-set-properties`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Data-Set-Property',
						'description': ' ',
						'source': 'static',
						'datatype': 'number',
						'evaluation_expression': null,
						'internal_tag': 'NEW_DATA_SET_PROPERTY',
						'timestamp_format': 'not_a_timestamp',
						'units': null
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'historical-dashboard/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the data-set property with the name as null or empty string', function(done) {
		agent
			.patch(`/historical-dashboard/attribute-set-properties/${newDataSetPropertiesId}`)
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': ' ',
						'source': 'static',
						'datatype': 'number',
						'evaluation_expression': null,
						'internal_tag': 'NEW_DATA_SET_PROPERTY',
						'timestamp_format': 'not_a_timestamp',
						'units': null
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newDataSetPropertiesId,
					'type': 'historical-dashboard/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the non-existing data-set property', function(done) {
		agent
			.patch(`/historical-dashboard/attribute-set-properties/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.send({
				'data': {
					'attributes': {
						'name': 'Non-Existing data-set Property',
						'description': ' ',
						'source': 'static',
						'datatype': 'number',
						'evaluation_expression': null,
						'internal_tag': 'NEW_DATA_SET_PROPERTY',
						'timestamp_format': 'not_a_timestamp',
						'units': null
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': '848305dd-d59b-4cf5-91b2-22224c141a9f',
					'type': 'historical-dashboard/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating data-set-property with duplicate name', function(done) {
		agent
			.patch(`/historical-dashboard/attribute-set-properties/${newDataSetPropertiesId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'Temp Data-Set-Property',
						'description': ' ',
						'source': 'static',
						'datatype': 'number',
						'evaluation_expression': null,
						'internal_tag': 'NEW_DATA_SET_PROPERTY',
						'timestamp_format': 'not_a_timestamp',
						'units': null
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newDataSetPropertiesId,
					'type': 'historical-dashboard/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update the data-set-property with name', function(done) {
		agent
			.patch(`/historical-dashboard/attribute-set-properties/${newDataSetPropertiesId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Data Set Property',
						'description': ' ',
						'source': 'static',
						'datatype': 'number',
						'evaluation_expression': null,
						'internal_tag': 'NEW_DATA_SET_PROPERTY',
						'timestamp_format': 'not_a_timestamp',
						'units': null
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newDataSetPropertiesId,
					'type': 'historical-dashboard/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Data Set-property details', function(done) {
		agent
			.get(`/historical-dashboard/attribute-set-properties/${newDataSetPropertiesId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if we try to get details of a non existing data set property', function(done) {
		agent
			.get('/historical-dashboard/attribute-set-properties/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the attributes-set-property', function(done) {
		agent
			.get(`/historical-dashboard/attribute-set-properties/${newDataSetPropertiesId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Before,After and Observe Function under IDE
	it('Should return the Data set created to add function', function(done) {
		agent
			.get(`/historical-dashboard/devenv-tree-nodes?node_id=${newDataSetId}&node_type=attribute-set&_=1572849940633`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Before Function
	it('Should throw error while creating the before function for the data-set with name as null or empty-string', function(done) {
		agent
			.post(`/historical-dashboard/attribute-set-functions`)
			.send({
				'data': {
					'attributes': {
						'code': 'Start();',
						'description': ' ',
						'execution_order': 1,
						'name': ' ',
						'type': 'pre'
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'historical-dashboard/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create the before function for the data-setperty', function(done) {
		agent
			.post(`/historical-dashboard/attribute-set-functions`)
			.send({
				'data': {
					'attributes': {
						'code': 'Start();',
						'description': ' ',
						'execution_order': 1,
						'name': 'Before Function',
						'type': 'pre',
						'created_at': Date.now(),
						'updated_at': Date.now()
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newBeforeFunctionId,
					'type': 'historical-dashboard/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newBeforeFunctionId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while creating the before function for the data-set with the duplicate name', function(done) {
		agent
			.post(`/historical-dashboard/attribute-set-functions`)
			.send({
				'data': {
					'attributes': {
						'code': 'Start();',
						'description': ' ',
						'execution_order': 1,
						'name': 'Before Function',
						'type': 'pre'
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'historical-dashboard/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the before function with the name as null and empty string', function(done) {
		agent
			.patch(`/historical-dashboard/attribute-set-functions/${newBeforeFunctionId}`)
			.send({
				'data': {
					'attributes': {
						'code': 'Start();',
						'description': ' ',
						'execution_order': 1,
						'name': ' ',
						'type': 'pre'
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newBeforeFunctionId,
					'type': 'historical-dashboard/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update the before function with the valid name', function(done) {
		agent
			.patch(`/historical-dashboard/attribute-set-functions/${newBeforeFunctionId}`)
			.send({
				'data': {
					'attributes': {
						'code': 'Start();',
						'description': ' ',
						'execution_order': 1,
						'name': 'Before function',
						'type': 'pre'
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newBeforeFunctionId,
					'type': 'historical-dashboard/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should update the before function with the execution_order as 2', function(done) {
		agent
			.patch(`/historical-dashboard/attribute-set-functions/${newBeforeFunctionId}`)
			.send({
				'data': {
					'attributes': {
						'code': 'Start();',
						'description': ' ',
						'execution_order': 2,
						'name': 'Before function',
						'type': 'pre'
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newBeforeFunctionId,
					'type': 'historical-dashboard/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Observe Function
	it('Should add the observe function for the data-set', function(done) {
		agent
			.post(`/historical-dashboard/attribute-set-functions`)
			.send({
				'data': {
					'attributes': {
						'code': 'Observe();',
						'description': ' ',
						'execution_order': 1,
						'name': 'Observe Function',
						'type': 'observer'
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newObserveFunctionId,
					'type': 'historical-dashboard/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newObserveFunctionId = response.body.data.id;
				done(err);
			});
	});

	it('Should update the observe function with the valid name', function(done) {
		agent
			.patch(`/historical-dashboard/attribute-set-functions/${newObserveFunctionId}`)
			.send({
				'data': {
					'attributes': {
						'code': 'Observe();',
						'description': ' ',
						'execution_order': 1,
						'name': 'Observe function',
						'type': 'observer'
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newObserveFunctionId,
					'type': 'historical-dashboard/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error while adding a non-existing data-set-property to the observer function', function(done) {
		agent
			.post(`/historical-dashboard/attribute-set-function-observed-properties`)
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': newObserveFunctionId,
								'type': 'historical-dashboard/attribute-set-functions'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': '848305dd-d59b-4cf5-91b2-22224c141a9f',
								'type': 'historical-dashboard/attribute-set-properties'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'historical-dashboard/attribute-set-function-observed-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while adding a data-set-property to the non-existing observer function', function(done) {
		agent
			.post(`/historical-dashboard/attribute-set-function-observed-properties`)
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': '848305dd-d59b-4cf5-91b2-22224c141a9f',
								'type': 'historical-dashboard/attribute-set-functions'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': newDataSetPropertiesId,
								'type': 'historical-dashboard/attribute-set-properties'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'historical-dashboard/attribute-set-function-observed-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should add a observer-function-property to the observer function', function(done) {
		agent
			.post(`/historical-dashboard/attribute-set-function-observed-properties`)
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': newObserveFunctionId,
								'type': 'historical-dashboard/attribute-set-functions'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': newDataSetPropertiesId,
								'type': 'historical-dashboard/attribute-set-properties'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newDataSetObserveFunctionPropertyId,
					'type': 'historical-dashboard/attribute-set-function-observed-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newDataSetObserveFunctionPropertyId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a observe-function-properties', function(done) {
		agent
			.get(`/historical-dashboard/attribute-set-function-observed-properties/${newDataSetObserveFunctionPropertyId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if we try to get details of a non existing Data set observer-properties', function(done) {
		agent
			.get('/historical-dashboard/attribute-set-function-observed-properties/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the observe-data-set-property', function(done) {
		agent
			.get(`/historical-dashboard/attribute-set-function-observed-properties/${newDataSetObserveFunctionPropertyId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a data Set details', function(done) {
		agent
			.get(`/historical-dashboard/attribute-set-functions/${newObserveFunctionId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if we try to get details of a non existing data set function', function(done) {
		agent
			.get('/historical-dashboard/attribute-set-functions/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the observe function', function(done) {
		agent
			.get(`/historical-dashboard/attribute-set-functions/${newObserveFunctionId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Historical-Dashboards
	it('Should throw error while creating the Historical-Dashboard for tenant without permission', function(done) {
		agnt
			.post('/historical-dashboard/historical-dashboards')
			.send({
				'data': {
					'attributes': {
						'attribute_set_metadata': [],
						'data_persistence_period': 1,
						'name': 'Tenant has no permission for Boards',
						'description': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': historicalNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'historical-dashboard/historical-dashboards'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating new Historical-Dashboard with name as null or empty string', function(done) {
		agent
			.post('/historical-dashboard/historical-dashboards')
			.send({
				'data': {
					'attributes': {
						'attribute_set_metadata': [],
						'data_persistence_period': 1,
						'name': ' ',
						'description': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': historicalNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'historical-dashboard/historical-dashboards'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create Historical-Dashboard with valid name ', function(done) {
		agent
			.post('/historical-dashboard/historical-dashboards')
			.send({
				'data': {
					'attributes': {
						'attribute_set_metadata': [],
						'data_persistence_period': 1,
						'name': 'New Historical-dashboard',
						'description': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': historicalNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newHistoricalDashboardId,
					'type': 'historical-dashboard/historical-dashboards'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newHistoricalDashboardId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while creating Historical-Dashboard with duplicate name ', function(done) {
		agent
			.post('/historical-dashboard/historical-dashboards')
			.send({
				'data': {
					'attributes': {
						'attribute_set_metadata': [],
						'data_persistence_period': 1,
						'name': 'New Historical-dashboard',
						'description': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': historicalNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'historical-dashboard/historical-dashboards'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating Historical-Dashboard with name as null or empty string', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboards/${newHistoricalDashboardId}`)
			.send({
				'data': {
					'attributes': {
						'attribute_set_metadata': [],
						'data_persistence_period': 1,
						'name': ' ',
						'description': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': historicalNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newHistoricalDashboardId,
					'type': 'historical-dashboard/historical-dashboards'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating Historical-Dashboard with duplicate name', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboards/${newHistoricalDashboardId}`)
			.send({
				'data': {
					'attributes': {
						'attribute_set_metadata': [],
						'data_persistence_period': 1,
						'name': 'Temp Historical Dashboard',
						'description': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': historicalNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newHistoricalDashboardId,
					'type': 'historical-dashboard/historical-dashboards'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the non-existing Historical-Dashboard', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboards/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.send({
				'data': {
					'attributes': {
						'attribute_set_metadata': [],
						'data_persistence_period': 1,
						'name': 'Temp Historical D',
						'description': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': historicalNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'historical-dashboard/historical-dashboards'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update the Historical-Dashboard with valid name', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboards/${newHistoricalDashboardId}`)
			.send({
				'data': {
					'attributes': {
						'attribute_set_metadata': [],
						'data_persistence_period': 1,
						'name': 'New Historical Dashboard',
						'description': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': historicalNodeId,
								'type': 'historical-dashboard/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newHistoricalDashboardId,
					'type': 'historical-dashboard/historical-dashboards'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw invalid query params while fetching the Historical Dashboard', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboards/${newHistoricalDashboardId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if we try to get details of a non existing Historical Dashboard ', function(done) {
		agent
			.get('/historical-dashboard/historical-dashboards/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the Historical Dashboards created', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboards/${newHistoricalDashboardId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should not get details of Historical Dashboards for the tenant without permission', function(done) {
		agnt
			.get(`/historical-dashboard/historical-dashboards?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error if provided with invalid query params while fetching the details for the Historical Dashboards', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboards?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should get the details for all the Historical Dashboards', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboards?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Inside test cases for the Historical-Dashboards
	// Test cases for the Watchers
	it('Should return users list to choose the users for adding watchers', function(done) {
		agent
			.get(`/historical-dashboard/possibleTenantUsersList?historicalDashboard=${newHistoricalDashboardId}&_=1576132247546`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				rootUserId = response.body[0].id;
				console.log(rootUserId);
				done(err);
			});
	});

	it('Should throw error while adding a non-existing user as watchers', function(done) {
		agent
			.post('/historical-dashboard/historical-dashboard-watchers')
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'updated_at': Date.now()
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical-dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						},
						'tenant_user': {
							'data': {
								'id': '848305dd-d59b-4cf5-91b2-22224c141a9f',
								'type': 'pug/user-manager/tenant-users'
							}
						}
					},
					'type': 'historical-dashboard/historical-dashboard-watchers'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should add the root user to watchers list', function(done) {
		agent
			.post('/historical-dashboard/historical-dashboard-watchers')
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'updated_at': Date.now()
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						},
						'tenant_user': {
							'data': {
								'id': rootUserId,
								'type': 'pug/user-manager/tenant-users'
							}
						}
					},
					'id': newWatcherID,
					'type': 'historical-dashboard/historical-dashboard-watchers'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newWatcherID = response.body.data.id;
				done(err);
			});
	});

	it('Should throw invalid query params while fetching the watchers', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-watchers/${newWatcherID}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if we try to get details of a non existing historical dashboard-watchers', function(done) {
		agent
			.get('/historical-dashboard/historical-dashboard-watchers/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the watchers', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-watchers/${newWatcherID}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for adding the Data-Set for the Historical Dashboard
	it('Should throw error while adding the non-existing data-set to the historical-dashboard for tracking', function(done) {
		agent
			.post(`/historical-dashboard/historical-dashboard-attribute-sets`)
			.send({
				'data': {
					'attributes': {
						'evaluation_order': 1
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_attribute_set': {
							'data': {
								'id': '848305dd-d59b-4cf5-91b2-22224c141a9f',
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'type': 'historical-dashboard/historical-dashboard-attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should add the data-set to the historical-dashboards for the tracking', function(done) {
		agent
			.post(`/historical-dashboard/historical-dashboard-attribute-sets`)
			.send({
				'data': {
					'attributes': {
						'evaluation_order': 1
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'historical-dashboard/attribute-sets'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newTrackDataSetId,
					'type': 'historical-dashboard/historical-dashboard-attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newTrackDataSetId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw invalid query params while fetching the Data-Set under the historical-dashboard', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-attribute-sets/${newTrackDataSetId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should return null if we try to get details of a non existing Tracked Data-Set', function(done) {
		agent
			.get('/historical-dashboard/historical-dashboard-attribute-sets/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the detials for the tracked data-sets', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-attribute-sets/${newTrackDataSetId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Tracked Entities
	// Test cases fot the Machine as a tracked entities
	it('Should add the selected existing Machine as tracked entities in the historical dashboards', function(done) {
		agent
			.post(`/historical-dashboard/historical-dashboard-constituents`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'tenant_historical_dashboard_constituent_id': tempMachineId,
						'tenant_historical_dashboard_constituent_type': 'machine',
						'updated_at': Date.now()
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newHistoricalDashboardMachineConstituentsId,
					'type': 'historical-dashboard/historical-dashboard-constituents'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newHistoricalDashboardMachineConstituentsId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while adding non-existing Machine as tracked entities in the historical dashboards', function(done) {
		agent
			.post(`/historical-dashboard/historical-dashboard-constituents`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'tenant_historical_dashboard_constituent_id': '848305dd-d59b-4cf5-91b2-22224c141a9f',
						'tenant_historical_dashboard_constituent_type': 'machine',
						'updated_at': Date.now()
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'type': 'historical-dashboard/historical-dashboard-constituents'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	// Test Cases for the Lines as tracked entties
	it('Should add the selected existing Line as tracked entities in the Historical Dashboards', function(done) {
		agent
			.post(`/historical-dashboard/historical-dashboard-constituents`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'tenant_historical_dashboard_constituent_id': tempLineId,
						'tenant_historical_dashboard_constituent_type': 'line',
						'updated_at': Date.now()
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newHistoricalDashboardLineConstituentsId,
					'type': 'historical-dashboard/historical-dashboard-constituents'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newHistoricalDashboardLineConstituentsId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw invalid query params while fetching the Constituents', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-constituents/${newHistoricalDashboardLineConstituentsId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if we try to get details of a non existing Constituents', function(done) {
		agent
			.get('/historical-dashboard/historical-dashboard-constituents/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the constituents', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-constituents/${newHistoricalDashboardLineConstituentsId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Incoming Data-Configuration

	// Test Cases for the Historical Dashboard Under IDE
	// Tets Cases for the Backend Code
	it('Should add the Processed Data Transform Code', function(done) {
		agent
			.post(`/historical-dashboard/historical-dashboard-processors`)
			.send({
				'data': {
					'attributes': {
						'processed_data_transform_code': 'ABC();',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newBackendCodeId,
					'type': 'historical-dashboard/historical-dashboard-processors'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newBackendCodeId = response.body.data.id;
				done(err);
			});
	});

	it('Should update the Backend code with code', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-processors/${newBackendCodeId}`)
			.send({
				'data': {
					'attributes': {
						'processed_data_transform_code': 'ABC(abc);',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newBackendCodeId,
					'type': 'historical-dashboard/historical-dashboard-processors'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should update the Backend code with publish status as true', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-processors/${newBackendCodeId}`)
			.send({
				'data': {
					'attributes': {
						'processed_data_transform_code': 'ABC(abc);',
						'publish_status': true
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newBackendCodeId,
					'type': 'historical-dashboard/historical-dashboard-processors'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should not update the Backend code with publish status as false(Once published cannot be unpublished)', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-processors/${newBackendCodeId}`)
			.send({
				'data': {
					'attributes': {
						'processed_data_transform_code': 'ABC(abc);',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newBackendCodeId,
					'type': 'historical-dashboard/historical-dashboard-processors'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error if we provide the invalid query params to get details of Backend code', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-processors/${newBackendCodeId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should get null if we try to get details for the non-existing Backend-Code', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-processors/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567414700691`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the Backend code', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-processors/${newBackendCodeId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases For The REQUEST EXECUTOR CODE
	// Test Case for the INPUT FORMATTER
	it('Should add the input Formatter code', function(done) {
		agent
			.post(`/historical-dashboard/historical-dashboard-request-formatters`)
			.send({
				'data': {
					'attributes': {
						'formatter_code': 'ABC();',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newInputFormatterCode,
					'type': 'historical-dashboard/historical-dashboard-request-formatters'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newInputFormatterCode = response.body.data.id;
				done(err);
			});
	});

	it('Should update the input formatter with code', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-request-formatters/${newInputFormatterCode}`)
			.send({
				'data': {
					'attributes': {
						'formatter_code': 'ABC(abc);',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newInputFormatterCode,
					'type': 'historical-dashboard/historical-dashboard-request-formatters'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should update the input formatter with publish status as true', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-request-formatters/${newInputFormatterCode}`)
			.send({
				'data': {
					'attributes': {
						'formatter_code': 'ABC(abc);',
						'publish_status': true
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newInputFormatterCode,
					'type': 'historical-dashboard/historical-dashboard-request-formatters'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error while updating the publish status as false(Once published it cannot be unpublished)', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-request-formatters/${newInputFormatterCode}`)
			.send({
				'data': {
					'attributes': {
						'formatter_code': 'ABC(abc);',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newInputFormatterCode,
					'type': 'historical-dashboard/historical-dashboard-request-formatters'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error if we provide the invalid query params to get details of Input Formatter code', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-request-formatters/${newInputFormatterCode}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should get null if we try to get details for the non-existing Input Formatter Code', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-request-formatters/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567414700691`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the Input Formatter code', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-request-formatters/${newInputFormatterCode}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the MAIN PROCESSORS
	it('Should add the Main Processor code', function(done) {
		agent
			.post(`/historical-dashboard/historical-dashboard-executors`)
			.send({
				'data': {
					'attributes': {
						'executor_code': 'ABC();',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newMainProcessorCode,
					'type': 'historical-dashboard/historical-dashboard-executors'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newMainProcessorCode = response.body.data.id;
				done(err);
			});
	});

	it('Should update the Mainprocessor with code', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-executors/${newMainProcessorCode}`)
			.send({
				'data': {
					'attributes': {
						'executor_code': 'ABC(abc);',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newMainProcessorCode,
					'type': 'historical-dashboard/historical-dashboard-executors'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should update the Mainprocessor with publish status as true', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-executors/${newMainProcessorCode}`)
			.send({
				'data': {
					'attributes': {
						'executor_code': 'ABC(abc);',
						'publish_status': true
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newMainProcessorCode,
					'type': 'historical-dashboard/historical-dashboard-executors'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error while updating the publish status to false(Once published cannot be unpublished)', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-executors/${newMainProcessorCode}`)
			.send({
				'data': {
					'attributes': {
						'executor_code': 'ABC(abc);',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newMainProcessorCode,
					'type': 'historical-dashboard/historical-dashboard-executors'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error if we provide the invalid query params to get details of Mainprocessor code', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-executors/${newMainProcessorCode}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should get null if we try to get details for the non-existing Mainprocessor Code', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-executors/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567414700691`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the Mainprocessor code', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-executors/${newMainProcessorCode}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the RESPONSE FORMATTER
	it('Should add the Response Formatter code', function(done) {
		agent
			.post(`/historical-dashboard/historical-dashboard-response-formatters`)
			.send({
				'data': {
					'attributes': {
						'formatter_code': 'ABC();',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newResponseFormatter,
					'type': 'historical-dashboard/historical-dashboard-response-formatters'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newResponseFormatter = response.body.data.id;
				done(err);
			});
	});

	it('Should update the Response Formatter with code', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-response-formatters/${newResponseFormatter}`)
			.send({
				'data': {
					'attributes': {
						'formatter_code': 'ABC(abc);',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newResponseFormatter,
					'type': 'historical-dashboard/historical-dashboard-response-formatters'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should update the code with publish status as true', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-response-formatters/${newResponseFormatter}`)
			.send({
				'data': {
					'attributes': {
						'formatter_code': 'ABC();',
						'publish_status': true
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newResponseFormatter,
					'type': 'historical-dashboard/historical-dashboard-response-formatters'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error while updating the publish status as false(Once published cannot be unpublished)', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-response-formatters/${newResponseFormatter}`)
			.send({
				'data': {
					'attributes': {
						'formatter_code': 'ABC();',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newResponseFormatter,
					'type': 'historical-dashboard/historical-dashboard-response-formatters'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error if we provide the invalid query params to get details of Response Formatter code', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-response-formatters/${newResponseFormatter}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should get null if we try to get details for the non-existing Response Formatter Code', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-response-formatters/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567414700691`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the Response Formatter code', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-response-formatters/${newResponseFormatter}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Template Code
	// Test Cases for the INPUT COMPONENT
	it('Should add the Input component code of the Template', function(done) {
		agent
			.post(`/historical-dashboard/historical-dashboard-input-templates`)
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC();',
						'component_before_destroy_code': 'DEF();',
						'component_before_render_code': 'HIJ();',
						'component_observers': [],
						'component_on_submit_code': 'XYZ();',
						'component_state': {},
						'component_tasks': [],
						'publish_status': false,
						'template': 'PQR();'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newInputComponentCode,
					'type': 'historical-dashboard/historical-dashboard-input-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newInputComponentCode = response.body.data.id;
				done(err);
			});
	});

	it('Should update the Input component code of Template', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-input-templates/${newInputComponentCode}`)
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC(abc);',
						'component_before_destroy_code': 'DEF(def);',
						'component_before_render_code': 'HIJ(hij);',
						'component_observers': [],
						'component_on_submit_code': 'XYZ(xyz);',
						'component_state': {},
						'component_tasks': [],
						'publish_status': false,
						'template': 'PQR(pqr);'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newInputComponentCode,
					'type': 'historical-dashboard/historical-dashboard-input-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should update the publish status as true for Input Component code of Template', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-input-templates/${newInputComponentCode}`)
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC(abc);',
						'component_before_destroy_code': 'DEF(def);',
						'component_before_render_code': 'HIJ(hij);',
						'component_observers': [],
						'component_on_submit_code': 'XYZ(xyz);',
						'component_state': {},
						'component_tasks': [],
						'publish_status': true,
						'template': 'PQR(pqr);'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newInputComponentCode,
					'type': 'historical-dashboard/historical-dashboard-input-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error while updating the publish status as false of Input Component(Once published cannot be unpublished)', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-input-templates/${newInputComponentCode}`)
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC(abc);',
						'component_before_destroy_code': 'DEF(def);',
						'component_before_render_code': 'HIJ(hij);',
						'component_observers': [],
						'component_on_submit_code': 'XYZ(xyz);',
						'component_state': {},
						'component_tasks': [],
						'publish_status': false,
						'template': 'PQR(pqr);'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newInputComponentCode,
					'type': 'historical-dashboard/historical-dashboard-input-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	// Test Cases for the Subcomponent(Observers and Tasks)
	it('Should update the Input component after adding observer and task to it', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-input-templates/${newInputComponentCode}`)
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC(abc);',
						'component_before_destroy_code': 'DEF(def);',
						'component_before_render_code': 'HIJ(hij);',
						'component_observers': [
							{
								'function_code': 'ABC();',
								'name': 'New Observer',
								'observed_property': 'abc'
							}
						],
						'component_on_submit_code': 'XYZ(xyz);',
						'component_state': {},
						'component_tasks': [
							{
								'arguments': '',
								'function_code': 'ABC();',
								'name': 'New Task'
							}
						],
						'publish_status': true,
						'template': 'PQR(pqr);'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newInputComponentCode,
					'type': 'historical-dashboard/historical-dashboard-input-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should update the Input component after deleting observer and task to it', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-input-templates/${newInputComponentCode}`)
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC(abc);',
						'component_before_destroy_code': 'DEF(def);',
						'component_before_render_code': 'HIJ(hij);',
						'component_observers': [],
						'component_on_submit_code': 'XYZ(xyz);',
						'component_state': {},
						'component_tasks': [],
						'publish_status': true,
						'template': 'PQR(pqr);'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newInputComponentCode,
					'type': 'historical-dashboard/historical-dashboard-input-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});


	it('Should throw error if we provide the invalid query params to get details of Input Component', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-input-templates/${newInputComponentCode}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should get null if we try to get details for the non-existing Input Component', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-input-templates/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567414700691`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the Input Component', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-input-templates/${newInputComponentCode}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the RESULT DISPLAY COMPONENT
	it('Should add the Result component code of the Template', function(done) {
		agent
			.post(`/historical-dashboard/historical-dashboard-result-templates`)
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC();',
						'component_before_destroy_code': 'DEF();',
						'component_before_render_code': 'HIJ();',
						'component_observers': [],
						'component_on_data_code': 'XYZ();',
						'component_state': {},
						'component_tasks': [],
						'publish_status': false,
						'template': 'PQR();'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newResultComponentCode,
					'type': 'historical-dashboard/historical-dashboard-result-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newResultComponentCode = response.body.data.id;
				done(err);
			});
	});

	it('Should update the Result component code of Template', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-result-templates/${newResultComponentCode}`)
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC(abc);',
						'component_before_destroy_code': 'DEF(def);',
						'component_before_render_code': 'HIJ(hij);',
						'component_observers': [],
						'component_on_data_code': 'XYZ(xyz);',
						'component_state': {},
						'component_tasks': [],
						'publish_status': false,
						'template': 'PQR(pqr);'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newResultComponentCode,
					'type': 'historical-dashboard/historical-dashboard-result-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should update the publish status as true for Result Component code of Template', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-result-templates/${newResultComponentCode}`)
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC(abc);',
						'component_before_destroy_code': 'DEF(def);',
						'component_before_render_code': 'HIJ(hij);',
						'component_observers': [],
						'component_on_data_code': 'XYZ(xyz);',
						'component_state': {},
						'component_tasks': [],
						'publish_status': true,
						'template': 'PQR(pqr);'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newResultComponentCode,
					'type': 'historical-dashboard/historical-dashboard-result-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error while updating the publish status as false of Result Component(Once published cannot be unpublished)', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-result-templates/${newResultComponentCode}`)
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC(abc);',
						'component_before_destroy_code': 'DEF(def);',
						'component_before_render_code': 'HIJ(hij);',
						'component_observers': [],
						'component_on_data_code': 'XYZ(xyz);',
						'component_state': {},
						'component_tasks': [],
						'publish_status': false,
						'template': 'PQR(pqr);'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newResultComponentCode,
					'type': 'historical-dashboard/historical-dashboard-result-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	// Test Cases for the Subcomponent(Observers and Tasks)
	it('Should update the Result component after adding observer and task to it', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-result-templates/${newResultComponentCode}`)
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC(abc);',
						'component_before_destroy_code': 'DEF(def);',
						'component_before_render_code': 'HIJ(hij);',
						'component_observers': [
							{
								'function_code': 'ABC();',
								'name': 'New Observer',
								'observed_property': 'abc'
							}
						],
						'component_on_data_code': 'XYZ(xyz);',
						'component_state': {},
						'component_tasks': [
							{
								'arguments': '',
								'function_code': 'ABC();',
								'name': 'New Task'
							}
						],
						'publish_status': true,
						'template': 'PQR(pqr);'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newResultComponentCode,
					'type': 'historical-dashboard/historical-dashboard-result-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should update the Result component after deleting observer and task to it', function(done) {
		agent
			.patch(`/historical-dashboard/historical-dashboard-result-templates/${newResultComponentCode}`)
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC(abc);',
						'component_before_destroy_code': 'DEF(def);',
						'component_before_render_code': 'HIJ(hij);',
						'component_observers': [],
						'component_on_data_code': 'XYZ(xyz);',
						'component_state': {},
						'component_tasks': [],
						'publish_status': true,
						'template': 'PQR(pqr);'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_historical_dashboard': {
							'data': {
								'id': newHistoricalDashboardId,
								'type': 'historical-dashboard/historical-dashboards'
							}
						}
					},
					'id': newResultComponentCode,
					'type': 'historical-dashboard/historical-dashboard-result-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});


	it('Should throw error if we provide the invalid query params to get details of Result Component', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-result-templates/${newResultComponentCode}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should get null if we try to get details for the non-existing Result Component', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-result-templates/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567414700691`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the Result Component', function(done) {
		agent
			.get(`/historical-dashboard/historical-dashboard-result-templates/${newResultComponentCode}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Delete Test cases for the Constituents for Historical-Dashboard
	it('Should throw error while deleting the non-existing constituent', function(done) {
		agent
			.del(`/historical-dashboard/historical-dashboard-constituents/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the machine from the tracked entities', function(done) {
		agent
			.del(`/historical-dashboard/historical-dashboard-constituents/${newHistoricalDashboardMachineConstituentsId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should delete the Line from the tracked entities', function(done) {
		agent
			.del(`/historical-dashboard/historical-dashboard-constituents/${newHistoricalDashboardLineConstituentsId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test Cases for the Tracked Data-Sets
	it('Should throw error while deleting the non-existing tracked data-set for historical dashboard', function(done) {
		agent
			.del(`/historical-dashboard/historical-dashboard-attribute-sets/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delet the existing tracked data-set in historical dashboard', function(done) {
		agent
			.del(`/historical-dashboard/historical-dashboard-attribute-sets/${newTrackDataSetId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test Cases for the Watchers
	it('Should throw error while deleting the non-existing watcher for the historical dashboard', function(done) {
		agent
			.del(`/historical-dashboard/historical-dashboard-watchers/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the watcher for the historical dashboard', function(done) {
		agent
			.del(`/historical-dashboard/historical-dashboard-watchers/${newWatcherID}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test Cases for the Historical-Dashboards
	it('Should throw error while deleting the non-existing historical dashboard function', function(done) {
		agent
			.del(`/historical-dashboard/historical-dashboards/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing historical dashboard', function(done) {
		agent
			.del(`/historical-dashboard/historical-dashboards/${newHistoricalDashboardId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test for the Observe-function-property for the Observer function under IDE
	it('should throw error while deleting the non-existing observe-function-property from the observe function', function(done) {
		agent
			.del(`/historical-dashboard/attribute-set-function-observed-properties/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing observe-function-property from the observe function', function(done) {
		agent
			.del(`/historical-dashboard/attribute-set-function-observed-properties/${newDataSetObserveFunctionPropertyId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test for the Observe function for the Data-set under IDE
	it('Should throw error while deleting the non-existing observe function ', function(done) {
		agent
			.del(`/historical-dashboard/attribute-set-functions/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing observe function', function(done) {
		agent
			.del(`/historical-dashboard/attribute-set-functions/${newObserveFunctionId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test cases for the Before Function for the Data-set under IDE
	it('Should throw error while deleting the non-existing before function ', function(done) {
		agent
			.del(`/historical-dashboard/attribute-set-functions/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing before function', function(done) {
		agent
			.del(`/historical-dashboard/attribute-set-functions/${newBeforeFunctionId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete Test cases for the Data-Set-Property
	it('Should throw error while deleting the non-existing data-set-properties', function(done) {
		agent
			.del(`/historical-dashboard/attribute-set-properties/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing data-set-properties', function(done) {
		agent
			.del(`/historical-dashboard/attribute-set-properties/${newDataSetPropertiesId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test cases for the Data-set
	it('Should throw error while deleting the non existing Data-set', function(done) {
		agent
			.del(`/historical-dashboard/attribute-sets/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing data-set', function(done) {
		agent
			.del(`/historical-dashboard/attribute-sets/${newDataSetId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test cases for the Folders
	it('Should throw error while deleting the non existing folder', function(done) {
		agent
			.del(`/historical-dashboard/folders/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing folder', function(done) {
		agent
			.del(`/historical-dashboard/folders/${newDataSetFolderId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

});
