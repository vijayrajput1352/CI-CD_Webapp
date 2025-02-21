/* eslint-disable max-nested-callbacks */
'use strict';

const chai = require('chai'); // eslint-disable-line node/no-unpublished-require
const chaiHttp = require('chai-http'); // eslint-disable-line node/no-unpublished-require

chai.use(chaiHttp);

describe('Test Cases for the Board Feature', function() {
	const agent	= chai.request.agent('http://localhost:9100');
	// eslint-disable-next-line no-unused-vars
	const agnt = chai.request.agent('http://pw.plant.works:9100');
	const expect = chai.expect;
	let nodeId, tenantId;
	let dataSetsNodeId, panelNodeId;
	let newDataSetFolderId, newDataSetId, newDataSetPropertiesId, newPanelId;
	let newBeforeFunctionId, newDataSetObserveFunctionPropertyId, newObserveFunctionId;
	let tempDataSetFolderId, tempDataSetPropertiesId, tempPanelId;
	let rootUserId;
	let newPanelLineConstituentsId, newPanelMachineConstituentsId, newPanelStationConstituentsId, newPanelTempPanelConstituentsId, newTrackDataSetId, newWatcherID;
	let newBackendCodeId, newPanelTemplateCodeID;
	let dataSetsNodeIdTemp, nodeIdTempBoard, nodeIdTempManufacturing, panelNodeIdTemp, plantNodeIdTemp, tempDataSetId,
		tempLineId, tempMachineId, tempPlantId, tempPlantUnitId, tempStationId;

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
						if(error) {
							done(error);
							return;
						}

						agent
							.get('/configure/nodes?_=1569908851488')
							.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36')
							.end((error1, response1) => {
								expect(response1).to.have.status(200);
								nodeIdTempBoard = response1.body.data[0].id;
								nodeIdTempManufacturing = response1.body.data[2].id;
								if(error1) {
									done(error1);
									return;
								}

								agent
									.get(`/board/config-tree-nodes?node_id=${nodeIdTempBoard}&node_type=root-folder&_=1569908851489`)
									.end((error2, response2) => {
										expect(response2).to.have.status(200);
										if(response2.body[0].data.type === 'attribute-folder') {
											panelNodeIdTemp = response2.body[1].id;
											dataSetsNodeIdTemp = response2.body[0].id;
										}
										else {
											panelNodeIdTemp = response2.body[0].id;
											dataSetsNodeIdTemp = response2.body[1].id;
										}
										if(error2) {
											done(error2);
											return;
										}

										agent
											.post('/board/folders')
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
													'id': tempDataSetFolderId,
													'type': 'board/folders'
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
													.post('/board/attribute-sets')
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
															'id': tempDataSetId,
															'type': 'board/attribute-sets'
														}
													})
													.end((error4, response4) => {
														expect(response4).to.have.status(200);
														tempDataSetId = response4.body.data.id;
														if(error4) {
															done(error4);
															return;
														}

														agent
															.post('/board/attribute-set-properties')
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
																				'type': 'board/attribute-sets'
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
																	'type': 'board/attribute-set-properties'
																}
															})
															.end((error5, response5) => {
																expect(response5).to.have.status(200);
																if(error5) {
																	done(error5);
																	return;
																}

																agent
																	.post('/board/panels')
																	.send({
																		'data': {
																			'attributes': {
																				'attribute_set_metadata': [],
																				'data_persistence_period': 1,
																				'name': 'Temp-Panel',
																				'description': ' '
																			},
																			'relationships': {
																				'folder': {
																					'data': {
																						'id': panelNodeIdTemp,
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
																			'id': tempPanelId,
																			'type': 'board/panels'
																		}
																	})
																	.end((error6, response6) => {
																		expect(response6).to.have.status(200);
																		tempPanelId = response6.body.data.id;
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
																												if(error11) {
																													done(error11);
																													return;
																												}

																												agent
																													.post(`/manufacturing/plant-unit-stations`)
																													.send({
																														'data': {
																															'attributes': {
																																'name': 'Temp Station',
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
																													.end((error12, response12) => {
																														expect(response12).to.have.status(200);
																														tempStationId = response12.body.data.id;
																														done(error12);
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
	});

	after(function(done) {
		agent
			.del(`/manufacturing/plants/${tempPlantId}`)
			.end((err1) => {
				if(err1) {
					done(err1);
					return;
				}

				agent
					.del(`/board/panels/${tempPanelId}`)
					.end((err2) => {
						if(err2) {
							done(err2);
							return;
						}

						agent
							.del(`/board/attribute-sets/${tempDataSetId}`)
							.end((err3) => {
								if(err3) {
									done(err3);
									return;
								}

								agent
									.del(`/board/folders/${tempDataSetFolderId}`)
									.end((err4) => {
										if(err4) {
											done(err4);
											return;
										}

										agent
											.get('/session/logout')
											.end((err5) => {
												done(err5);
											});
									});
							});
					});
			});
	});

	// 1st lvl
	// Some Basics informations Test Cases
	it('Should return proper Node details', function(done) {
		agent
			.get('/configure/nodes?_=1569908851488')
			.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36')
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data[0].attributes).to.have.property('name').eql('Board');
				expect(response.body.data[0].attributes).to.have.property('node_type').eql('root-folder');
				expect(response.body.data[0].attributes).to.have.property('route').eql('board');
				nodeId = response.body.data[0].id;
				done(err);
			});
	});

	it('Should return existing tree for Root node', function(done) {
		agent
			.get(`/board/config-tree-nodes?node_id=${nodeId}&node_type=root-folder&_=1569908851489`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				if(response.body[0].data.type === 'attribute-folder') {
					expect(response.body[0]).to.have.property('children').eql(true);
					expect(response.body[0]).to.have.property('parent').eql(nodeId);
					expect(response.body[0].data).to.have.property('type').eql('attribute-folder');
					expect(response.body[1]).to.have.property('children').eql(true);
					expect(response.body[1]).to.have.property('parent').eql(nodeId);
					expect(response.body[1].data).to.have.property('type').eql('panel-folder');
					panelNodeId = response.body[1].id;
					dataSetsNodeId = response.body[0].id;
				}
				else {
					expect(response.body[1]).to.have.property('children').eql(true);
					expect(response.body[1]).to.have.property('parent').eql(nodeId);
					expect(response.body[1].data).to.have.property('type').eql('attribute-folder');
					expect(response.body[0]).to.have.property('children').eql(true);
					expect(response.body[0]).to.have.property('parent').eql(nodeId);
					expect(response.body[0].data).to.have.property('type').eql('panel-folder');
					panelNodeId = response.body[0].id;
					dataSetsNodeId = response.body[1].id;
				}
				done(err);
			});
	});

	it('Should return Root Tenant folder details', function(done) {
		agent
			.get(`/board/folders/${nodeId}?_=1566890475910`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('board_feature.folder_names.root.name');
				expect(response.body.data.attributes).to.have.property('description').eql('board_feature.folder_names.root.description');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(null);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.relationships.tenant.data).to.have.property('id').eql(tenantId);
				done(err);
			});
	});

	it('Should return the details for the data-set node', function(done) {
		agent
			.get(`/board/folders/${dataSetsNodeId}?_=1573545275501`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('board_feature.folder_names.attribute_sets.name');
				expect(response.body.data.attributes).to.have.property('description').eql('board_feature.folder_names.attribute_sets.description');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(nodeId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	it('Should return the details for the panel node', function(done) {
		agent
			.get(`/board/folders/${panelNodeId}?_=1573545275502`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('board_feature.folder_names.panels.name');
				expect(response.body.data.attributes).to.have.property('description').eql('board_feature.folder_names.panels.description');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(nodeId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	// 2nd lvl
	// Test cases for the Data Set Folders
	it('Should return the tree for the data sets', function(done) {
		agent
			.get(`/board/config-tree-nodes?node_id=${dataSetsNodeId}&node_type=attribute-folder&_=1571828662252`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error while creating new folder with name as empty field', function(done) {
		agent
			.post('/board/folders')
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
					'type': 'board/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create new folder with valid name', function(done) {
		agent
			.post('/board/folders')
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
					'id': newDataSetFolderId,
					'type': 'board/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newDataSetFolderId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while creating new folder with Duplicate Name', function(done) {
		agent
			.post('/board/folders')
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
					'type': 'board/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the non-existing folder', function(done) {
		agent
			.patch(`/board/folders/848305dd-d59b-4cf5-91b2-22224c141a9f`)
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
					'type': 'board/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the existing folder with name as null or empth string', function(done) {
		agent
			.patch(`/board/folders/${newDataSetFolderId}`)
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
					'id': newDataSetFolderId,
					'type': 'board/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the folder with duplicate name', function(done) {
		agent
			.patch(`/board/folders/${newDataSetFolderId}`)
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
					'id': newDataSetFolderId,
					'type': 'board/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update folder details if all required details are filled', function(done) {
		agent
			.patch(`/board/folders/${newDataSetFolderId}`)
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
					'id': newDataSetFolderId,
					'type': 'board/folders'
			}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a folder details', function(done) {
		agent
		.get(`/board/folders/${newDataSetFolderId}?_=1567414700691&include=t`)
		.end((err, response) => {
			expect(response).to.have.status(422);
			done(err);
		});
	});

	it('Should return null if try to get details of the non-existing folder', function(done) {
		agent
			.get(`/board/folders/25a77cbf-f1ad-43b2-8aa0-cab8585636de?_=1567414700691`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the folders', function(done) {
		agent
			.get(`/board/folders/${newDataSetFolderId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Data-Set
	it('Should throw an error while creating new data-set with name is null or empty', function(done) {
		agent
			.post('/board/attribute-sets')
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
					'type': 'board/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create new data set if required details are filled', function(done) {
		agent
			.post('/board/attribute-sets')
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
					'id': newDataSetId,
					'type': 'board/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newDataSetId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while creating new data set with duplicate name', function(done) {
		agent
			.post('/board/attribute-sets')
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
					'type': 'board/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating a non existing data set', function(done) {
		agent
			.patch('/board/attribute-sets/848305dd-d59b-4cf5-91b2-22224c141a9f')
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
					'type': 'board/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error while updating a data-set with name as null or empty string', function(done) {
		agent
			.patch(`/board/attribute-sets/${newDataSetId}`)
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
					'id': newDataSetId,
					'type': 'board/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the data-set with duplicate name', function(done) {
		agent
			.patch(`/board/attribute-sets/${newDataSetId}`)
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
					'id': newDataSetId,
					'type': 'board/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update data-set if all reqired details are filled', function(done) {
		agent
			.patch(`/board/attribute-sets/${newDataSetId}`)
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
					'id': newDataSetId,
					'type': 'board/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching all availible Data Set(s) details', function(done) {
		agent
			.get('/board/attribute-sets?_=1567414700691&include=t')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if we try to get details for the non-existing detils', function(done) {
		agent
			.get(`/board/attribute-sets/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567414700691`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should be able to get details of all availible Data set(s)', function(done) {
		agent
			.get(`/board/attribute-sets/${newDataSetId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should get all the attribute set detials', function(done) {
		agent
			.get(`/board/attribute-sets`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Data-Set Property
	it('Should throw error while creating new Data Set Property with name as null or empty string', function(done) {
		agent
			.post('/board/attribute-set-properties')
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
								'type': 'board/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'board/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create new Data Set Property if all required details are filled', function(done) {
		agent
			.post('/board/attribute-set-properties')
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
								'type': 'board/attribute-sets'
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
					'type': 'board/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newDataSetPropertiesId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while creating new Data Set Property with duplicate name', function(done) {
		agent
			.post('/board/attribute-set-properties')
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
								'type': 'board/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'board/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the data-set property with the name as null or empty string', function(done) {
		agent
			.patch(`/board/attribute-set-properties/${newDataSetPropertiesId}`)
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
								'type': 'board/attribute-sets'
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
					'type': 'board/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the non-existing data-set property', function(done) {
		agent
			.patch(`/board/attribute-set-properties/848305dd-d59b-4cf5-91b2-22224c141a9f`)
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
								'type': 'board/attribute-sets'
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
					'type': 'board/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update the data-set-property with name', function(done) {
		agent
			.patch(`/board/attribute-set-properties/${newDataSetPropertiesId}`)
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
								'type': 'board/attribute-sets'
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
					'type': 'board/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Data Set-property details', function(done) {
		agent
			.get(`/board/attribute-set-properties/${newDataSetPropertiesId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if we try to get details of a non existing data set property', function(done) {
		agent
			.get('/board/attribute-set-properties/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the attributes-set-property', function(done) {
		agent
			.get(`/board/attribute-set-properties/${newDataSetPropertiesId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Before,After and Observe Function under the IDE
	it('Should return the Data set created to add function', function(done) {
		agent
			.get(`/board/devenv-tree-nodes?node_id=${newDataSetId}&node_type=attribute-set&_=1572849940633`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Before Function
	it('Should throw error while creating the before function for the data-set with name as null or empty-string', function(done) {
		agent
			.post(`/board/attribute-set-functions`)
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
								'type': 'board/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'board/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create the before function for the data-setperty', function(done) {
		agent
			.post(`/board/attribute-set-functions`)
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
								'type': 'board/attribute-sets'
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
					'type': 'board/attribute-set-functions'
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
			.post(`/board/attribute-set-functions`)
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
								'type': 'board/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'board/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the before function with the name as null and empty string', function(done) {
		agent
			.patch(`/board/attribute-set-functions/${newBeforeFunctionId}`)
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
								'type': 'board/attribute-sets'
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
					'type': 'board/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update the before function with the valid name', function(done) {
		agent
			.patch(`/board/attribute-set-functions/${newBeforeFunctionId}`)
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
								'type': 'board/attribute-sets'
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
					'type': 'board/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should update the before function with the execution_order as 2', function(done) {
		agent
			.patch(`/board/attribute-set-functions/${newBeforeFunctionId}`)
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
								'type': 'board/attribute-sets'
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
					'type': 'board/attribute-set-functions'
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
			.post(`/board/attribute-set-functions`)
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
								'type': 'board/attribute-sets'
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
					'type': 'board/attribute-set-functions'
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
			.patch(`/board/attribute-set-functions/${newObserveFunctionId}`)
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
								'type': 'board/attribute-sets'
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
					'type': 'board/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should add a observer-function-property to the observer function', function(done) {
		agent
			.post(`/board/attribute-set-function-observed-properties`)
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'board/attribute-sets'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': newObserveFunctionId,
								'type': 'board/attribute-set-functions'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': newDataSetPropertiesId,
								'type': 'board/attribute-set-properties'
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
					'type': 'manufacturing/attribute-set-function-observed-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newDataSetObserveFunctionPropertyId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while adding a non-existing data-set-property to the observer function', function(done) {
		agent
			.post(`/board/attribute-set-function-observed-properties`)
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'board/attribute-sets'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': newObserveFunctionId,
								'type': 'board/attribute-set-functions'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': '848305dd-d59b-4cf5-91b2-22224c141a9f',
								'type': 'board/attribute-set-properties'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'manufacturing/attribute-set-function-observed-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while adding a data-set-property to the non-existing observer function', function(done) {
		agent
			.post(`/board/attribute-set-function-observed-properties`)
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'board/attribute-sets'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': '848305dd-d59b-4cf5-91b2-22224c141a9f',
								'type': 'board/attribute-set-functions'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': newDataSetPropertiesId,
								'type': 'board/attribute-set-properties'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'manufacturing/attribute-set-function-observed-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a observe-function-properties', function(done) {
		agent
			.get(`/board/attribute-set-function-observed-properties/${newDataSetObserveFunctionPropertyId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if we try to get details of a non existing Data set observer-properties', function(done) {
		agent
			.get('/board/attribute-set-function-observed-properties/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the observe-data-set-property', function(done) {
		agent
			.get(`/board/attribute-set-function-observed-properties/${newDataSetObserveFunctionPropertyId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a data Set details', function(done) {
		agent
			.get(`/board/attribute-set-functions/${newObserveFunctionId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if we try to get details of a non existing data set function', function(done) {
		agent
			.get('/board/attribute-set-functions/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the observe function', function(done) {
		agent
			.get(`/board/attribute-set-functions/${newObserveFunctionId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test cases for the Panels
	it('Should throw error while creating new Panel with name as null or empty string', function(done) {
		agent
			.post('/board/panels')
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
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create a new Panel with valid name', function(done) {
		agent
			.post('/board/panels')
			.send({
				'data': {
					'attributes': {
						'attribute_set_metadata': [],
						'data_persistence_period': 1,
						'name': 'New-panel',
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
					'id': newPanelId,
					'type': 'board/panels'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newPanelId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while creating a new Panel with duplicate name', function(done) {
		agent
			.post('/board/panels')
			.send({
				'data': {
					'attributes': {
						'attribute_set_metadata': [],
						'data_persistence_period': 1,
						'name': 'New-panel',
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
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the panel with name as null or empty string', function(done) {
		agent
			.patch(`/board/panels/${newPanelId}`)
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
					'id': newPanelId,
					'type': 'board/panels'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the panel with duplicate name', function(done) {
		agent
			.patch(`/board/panels/${newPanelId}`)
			.send({
				'data': {
					'attributes': {
						'attribute_set_metadata': [],
						'data_persistence_period': 1,
						'name': 'Temp-Panel',
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
					'id': newPanelId,
					'type': 'board/panels'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update the panel with vaild name', function(done) {
		agent
			.patch(`/board/panels/${newPanelId}`)
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
					'id': newPanelId,
					'type': 'board/panels'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw invalid query params while fetching the panels under the panels', function(done) {
		agent
			.get(`/board/panels/${newPanelId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should return null if we try to get details of a non existing panels ', function(done) {
		agent
			.get('/board/panels/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for all the panels', function(done) {
		agent
			.get(`/board/panels?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should get the details for the panels created', function(done) {
		agent
			.get(`/board/panels/${newPanelId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Inside test cases for the panels
	// Test cases for the Watchers
	it('Should return users list to choose the users for adding watchers', function(done) {
		agent
			.get(`/board/possibleTenantUsersList?panel=${newPanelId}&_=1570089713830`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				rootUserId = response.body[0].id;
				done(err);
			});
	});

	it('Should throw error while adding a non-existing user as watchers', function(done) {
		agent
		.post('/board/panel-watchers')
		.send({
			'data': {
				'relationships': {
					'tenant': {
						'data': {
							'id': tenantId,
							'type': 'settings/account/basics/tenants'
						}
					},
					'tenant_panel': {
						'data': {
							'id': newPanelId,
							'type': 'board/panels'
						}
					},
					'tenant_user': {
						'data': {
							'id': '848305dd-d59b-4cf5-91b2-22224c141a9f',
							'type': 'pug/user-manager/tenant-users'
						}
					}
				},
				'type': 'board/panel-watchers'
			}
		})
		.end((err, response) => {
			expect(response).to.have.status(422);
			done(err);
		});
	});

	it('Should add the root user to watchers list', function(done) {
		agent
			.post('/board/panel-watchers')
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
						'tenant_panel': {
							'data': {
								'id': newPanelId,
								'type': 'board/panels'
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
					'type': 'board/panel-watchers'
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
			.get(`/board/panel-watchers/${newWatcherID}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should return null if we try to get details of a non existing panels-watchers', function(done) {
		agent
			.get('/board/panel-watchers/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the watchers', function(done) {
		agent
			.get(`/board/panel-watchers/${newWatcherID}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Case for the adding Data-Set for the Boards
	it('Should throw error while adding the non-existing data-set to the report for tracking', function(done) {
		agent
			.post(`/board/panel-attribute-sets`)
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
								'type': 'board/attribute-sets'
							}
						},
						'tenant_panel': {
							'data': {
								'id': newPanelId,
								'type': 'board/panels'
							}
						}
					},
					'type': 'board/board-attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should add the data-set to the panels for tracking', function(done) {
		agent
			.post(`/board/panel-attribute-sets`)
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
								'type': 'board/attribute-sets'
							}
						},
						'tenant_panel': {
							'data': {
								'id': newPanelId,
								'type': 'board/panels'
							}
						}
					},
					'id': newTrackDataSetId,
					'type': 'board/board-attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newTrackDataSetId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw invalid query params while fetching the Data-Set under the panels', function(done) {
		agent
			.get(`/board/panel-attribute-sets/${newTrackDataSetId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should return null if we try to get details of a non existing Tracked Data-Set', function(done) {
		agent
			.get('/board/panel-attribute-sets/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the detials for the tracked data-sets', function(done) {
		agent
			.get(`/board/panel-attribute-sets/${newTrackDataSetId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test cases for the Tracked Entities
	// Test cases fot the Machine as a tracked entities
	it('Should add selected existing Machine as tracked entities in the panels', function(done) {
		agent
			.post(`/board/panel-constituents`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'tenant_panel_constituent_id': tempMachineId,
						'tenant_panel_constituent_type': 'machine',
						'updated_at': Date.now()
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_panel': {
							'data': {
								'id': newPanelId,
								'type': 'board/panels'
							}
						}
					},
					'id': newPanelMachineConstituentsId,
					'type': 'board/panel-constituents'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newPanelMachineConstituentsId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while adding non-existing Machine as tracked entities in the panels', function(done) {
		agent
			.post(`/board/panel-constituents`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'tenant_panel_constituent_id': '848305dd-d59b-4cf5-91b2-22224c141a9f',
						'tenant_panel_constituent_type': 'machine',
						'updated_at': Date.now()
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_panel': {
							'data': {
								'id': newPanelId,
								'type': 'board/panels'
							}
						}
					},
					'type': 'board/panel-constituents'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	// Test cases for the stations as tracked entities
	it('Should add selected existing Station as tracked entities in the panels', function(done) {
		agent
			.post(`/board/panel-constituents`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'tenant_panel_constituent_id': tempStationId,
						'tenant_panel_constituent_type': 'station',
						'updated_at': Date.now()
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_panel': {
							'data': {
								'id': newPanelId,
								'type': 'board/panels'
							}
						}
					},
					'id': newPanelStationConstituentsId,
					'type': 'board/panel-constituents'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newPanelStationConstituentsId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while adding non-existing Station as tracked entities in the panels', function(done) {
		agent
			.post(`/board/panel-constituents`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'tenant_panel_constituent_id': '848305dd-d59b-4cf5-91b2-22224c141a9f',
						'tenant_panel_constituent_type': 'station',
						'updated_at': Date.now()
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_panel': {
							'data': {
								'id': newPanelId,
								'type': 'board/panels'
							}
						}
					},
					'type': 'board/panel-constituents'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	// Test cases for the Lines as tracked entities
	it('Should add selected existing Line as tracked entities in the panels', function(done) {
		agent
			.post(`/board/panel-constituents`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'tenant_panel_constituent_id': tempLineId,
						'tenant_panel_constituent_type': 'line',
						'updated_at': Date.now()
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_panel': {
							'data': {
								'id': newPanelId,
								'type': 'board/panels'
							}
						}
					},
					'id': newPanelLineConstituentsId,
					'type': 'board/panel-constituents'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newPanelLineConstituentsId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while adding non-existing Line as tracked entities in the panels', function(done) {
		agent
			.post(`/board/panel-constituents`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'tenant_panel_constituent_id': '848305dd-d59b-4cf5-91b2-22224c141a9f',
						'tenant_panel_constituent_type': 'line',
						'updated_at': Date.now()
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_panel': {
							'data': {
								'id': newPanelId,
								'type': 'board/panels'
							}
						}
					},
					'type': 'board/panel-constituents'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	// Test Cases for the panels as the tracked entities
	it('Should throw error while adding non-existing panel as tracked entities', function(done) {
		agent
			.post(`/board/panel-constituents`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'tenant_panel_constituent_id': '848305dd-d59b-4cf5-91b2-22224c141a9f',
						'tenant_panel_constituent_type': 'panel',
						'updated_at': Date.now()
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_panel': {
							'data': {
								'id': newPanelId,
								'type': 'board/panels'
							}
						}
					},
					'type': 'board/panel-constituents'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should add a temporary panel as tracked entities', function(done) {
		agent
			.post(`/board/panel-constituents`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'tenant_panel_constituent_id': tempPanelId,
						'tenant_panel_constituent_type': 'panel',
						'updated_at': Date.now()
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_panel': {
							'data': {
								'id': newPanelId,
								'type': 'board/panels'
							}
						}
					},
					'id': newPanelTempPanelConstituentsId,
					'type': 'board/panel-constituents'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newPanelTempPanelConstituentsId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw invalid query params while fetching the Constituents', function(done) {
		agent
			.get(`/board/panel-constituents/${newPanelLineConstituentsId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should return null if we try to get details of a non existing Constituents', function(done) {
		agent
			.get('/board/panel-constituents/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the constituents', function(done) {
		agent
			.get(`/board/panel-constituents/${newPanelLineConstituentsId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Backend code
	it('Should add the Backend code to the panels', function(done) {
		agent
			.post(`/board/panel-processors`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'pre_realtime_push_transform_code': 'ABC();',
						'processed_data_transform_code': 'XYZ();',
						'publish_status': false,
						'updated_at': Date.now()
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_panel': {
							'data': {
								'id': newPanelId,
								'type': 'board/panels'
							}
						}
					},
					'id': newBackendCodeId,
					'type': 'board/panel-processors'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newBackendCodeId = response.body.data.id;
				done(err);
			});
	});

	it('Should update the Backend code with publish status', function(done) {
		agent
			.patch(`/board/panel-processors/${newBackendCodeId}`)
			.send({
				'data': {
					'attributes': {
						'pre_realtime_push_transform_code': 'ABC();',
						'processed_data_transform_code': 'XYZ();',
						'publish_status': true
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_panel': {
							'data': {
								'id': newPanelId,
								'type': 'board/panels'
							}
						}
					},
					'id': newBackendCodeId,
					'type': 'board/panel-processors'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error if we provide the invalid query params to get details of Backend code', function(done) {
		agent
			.get(`/board/panel-processors/${newBackendCodeId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should get null if we try to get details for the non-existing Backend-Code', function(done) {
		agent
			.get(`/board/panel-processors/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567414700691`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the Backend code', function(done) {
		agent
			.get(`/board/panel-processors/${newBackendCodeId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Template Code
	it('Should throw error while adding a template code to the panels with On-Data-Code as null or empty', function(done) {
		agent
			.post(`/board/panel-templates`)
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC()',
						'component_before_destroy_code': 'PQR()',
						'component_before_render_code': 'XYZ()',
						'component_on_data_code': ' ',
						'component_state': {},
						'created_at': Date.now(),
						'publish_status': false,
						'template': 'ABC',
						'updated_at': Date.now()
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_panel': {
							'data': {
								'id': newPanelId,
								'type': 'board/panels'
							}
						}
					},
					'type': 'board/panel-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should add a template code to the panels', function(done) {
		agent
			.post(`/board/panel-templates`)
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC()',
						'component_before_destroy_code': 'PQR()',
						'component_before_render_code': 'XYZ()',
						'component_on_data_code': 'QWT()',
						'component_state': {},
						'created_at': Date.now(),
						'publish_status': false,
						'template': 'ABC',
						'updated_at': Date.now()
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_panel': {
							'data': {
								'id': newPanelId,
								'type': 'board/panels'
							}
						}
					},
					'id': newPanelTemplateCodeID,
					'type': 'board/panel-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newPanelTemplateCodeID = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while updating a template code with On-Data-Code as null or empty', function(done) {
		agent
			.patch(`/board/panel-templates/${newPanelTemplateCodeID}`)
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC()',
						'component_before_destroy_code': 'PQR()',
						'component_before_render_code': 'XYZ()',
						'component_on_data_code': ' ',
						'component_state': {},
						'created_at': Date.now(),
						'publish_status': true,
						'template': 'ABC',
						'updated_at': Date.now()
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_panel': {
							'data': {
								'id': newPanelId,
								'type': 'board/panels'
							}
						}
					},
					'id': newPanelTemplateCodeID,
					'type': 'board/panel-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update a template code to the panels to make it publish', function(done) {
		agent
			.patch(`/board/panel-templates/${newPanelTemplateCodeID}`)
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC()',
						'component_before_destroy_code': 'PQR()',
						'component_before_render_code': 'XYZ()',
						'component_on_data_code': 'QWT()',
						'component_state': {},
						'created_at': Date.now(),
						'publish_status': true,
						'template': 'ABC',
						'updated_at': Date.now()
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_panel': {
							'data': {
								'id': newPanelId,
								'type': 'board/panels'
							}
						}
					},
					'id': newPanelTemplateCodeID,
					'type': 'board/panel-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw invalid query params while fetching the Template Code under the panels', function(done) {
		agent
			.get(`/board/panel-templates/${newPanelTemplateCodeID}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should return null if we try to get details of a non existing Template Code', function(done) {
		agent
			.get('/board/panel-templates/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get details for the Template code for the panels', function(done) {
		agent
			.get(`/board/panel-templates/${newPanelTemplateCodeID}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Delete test cases for the Tracked Sub Panels Entities
	it('Should throw error while deleting the non-existing sub-panels tracked entities', function(done) {
		agent
			.del(`/board/panel-constituents/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the sub-panel as a tracked entities', function(done) {
		agent
			.del(`/board/panel-constituents/${newPanelTempPanelConstituentsId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test cases for the Tracked Lines Entities
	it('Should throw error while deleting the non-existing line as tracked entities', function(done) {
		agent
			.del(`/board/panel-constituents/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the line as a tracked entities', function(done) {
		agent
			.del(`/board/panel-constituents/${newPanelLineConstituentsId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test cases for the Tracked Stations Entities
	it('Should delete the station as a tracked entities', function(done) {
		agent
			.del(`/board/panel-constituents/${newPanelStationConstituentsId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test cases for the Tracked Machines Entities
	it('Should delete the machine as a tracked entities', function(done) {
		agent
			.del(`/board/panel-constituents/${newPanelMachineConstituentsId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test cases for the data-set under the panels
	it('Should throw error while deleting the non-existing data-set under panels', function(done) {
		agent
			.del(`/board/panel-attribute-sets/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the exisiting data-set under the panels', function(done) {
		agent
			.del(`/board/panel-attribute-sets/${newTrackDataSetId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test case for the Watchers
	it('Should throw error while deleting the non-existing watcher for the panel', function(done) {
		agent
			.del(`/board/panel-watchers/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the watcher for the panel', function(done) {
		agent
			.del(`/board/panel-watchers/${newWatcherID}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test cases for the Panels under the Panels
	it('Should throw error while deleting the non-existing panel', function(done) {
		agent
			.del(`/board/panels/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing panel', function(done) {
		agent
			.del(`/board/panels/${newPanelId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test for the Observe-function-property for the Observer function under IDE
	it('should throw error while deleting the non-existing observe-function-property from the observe function', function(done) {
		agent
			.del(`/board/attribute-set-function-observed-properties/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing observe-function-property from the observe function', function(done) {
		agent
			.del(`/board/attribute-set-function-observed-properties/${newDataSetObserveFunctionPropertyId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// // Delete test for the Observe function for the Data-set under IDE
	it('Should throw error while deleting the non-existing observe function ', function(done) {
		agent
			.del(`/board/attribute-set-functions/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing observe function', function(done) {
		agent
			.del(`/board/attribute-set-functions/${newObserveFunctionId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test for the Before function for the Data-set under IDE
	it('Should throw error while deleting the non-existing before function ', function(done) {
		agent
			.del(`/board/attribute-set-functions/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing before function', function(done) {
		agent
			.del(`/board/attribute-set-functions/${newBeforeFunctionId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test case for the Data-set property
	it('Should throw error while deleting the non-existing data-set-properties', function(done) {
		agent
			.del(`/board/attribute-set-properties/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing data-set-properties', function(done) {
		agent
			.del(`/board/attribute-set-properties/${newDataSetPropertiesId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete Test cases for the Data-Set
	it('Should throw error while deleting the non-existing data-set', function(done) {
		agent
			.del(`/board/attribute-sets/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing data-set', function(done) {
		agent
			.del(`/board/attribute-sets/${newDataSetId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete Test cases for the Data-Set Folders
	it('Should throw error while deleting the non-existing data-set folder', function(done) {
		agent
			.del(`/board/folders/848305dd-d59b-4cf5-91b2-22224c141a9f`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing data-set folder', function(done) {
		agent
			.del(`/board/folders/${newDataSetFolderId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});
});
