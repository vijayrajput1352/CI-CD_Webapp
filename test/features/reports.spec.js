/* eslint-disable max-nested-callbacks */
'use strict';

const chai = require('chai'); // eslint-disable-line node/no-unpublished-require
const chaiHttp = require('chai-http'); // eslint-disable-line node/no-unpublished-require

chai.use(chaiHttp);

describe('Test Cases for the Report Feature', function() {
	const agent	= chai.request.agent('http://localhost:9100');
	// eslint-disable-next-line no-unused-vars
	const agnt = chai.request.agent('http://pw.plant.works:9100');
	const expect = chai.expect;

	let nodeId, tenantId;
	let dataSetsNodeId, reportNodeId;
	let rootUserId;
	let newDataSetFolderID, newDataSetId, newDataSetPropertId, newReportID;
	let newBeforeFunctionId, newDataSetObserveFunctionPropertyId, newObserveFunctionId;
	let newTrackDataSetId, newWatcherId1;
	let newLineConstituentsId, newMachineConstituentsId, newStationConstituentsId;
	let newComponentTemplateId, newDataProcessorsId;
	let dataSetsNodeIdTemp, nodeIdTempManufacturing, nodeIdTempReport, plantNodeIdTemp, reportNodeIdTemp,
		tempDataSetFolderId, tempDataSetId, tempDataSetPropertiesId, tempLineId, tempMachineId, tempPlantId, tempPlantUnitId,
		tempReportId, tempStationId;

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
								nodeIdTempReport = response1.body.data[3].id;
								nodeIdTempManufacturing = response1.body.data[2].id;
								if(error1) {
									done(error1);
									return;
								}

								agent
									.get(`/report/config-tree-nodes?node_id=${nodeIdTempReport}&node_type=root-folder&_=1574246714567`)
									.end((error2, response2) => {
										expect(response2).to.have.status(200);
										if(response2.body[0].data.type === 'attribute-folder') {
											reportNodeIdTemp = response2.body[1].id;
											dataSetsNodeIdTemp = response2.body[0].id;
										}
										else {
											reportNodeIdTemp = response2.body[0].id;
											dataSetsNodeIdTemp = response2.body[1].id;
										}
										if(error2) {
											done(error2);
											return;
										}

										agent
											.post('/report/folders')
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
													'id': tempDataSetFolderId,
													'type': 'report/folders'
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
													.post('/report/attribute-sets')
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
															'id': tempDataSetId,
															'type': 'report/attribute-sets'
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
															.post('/report/attribute-set-properties')
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
																				'type': 'report/attribute-sets'
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
																	'type': 'report/attribute-set-properties'
																}
															})
															.end((error5, response5) => {
																expect(response5).to.have.status(200);
																if(error5) {
																	done(error5);
																	return;
																}

																agent
																	.post('/report/reports')
																	.send({
																		'data': {
																			'attributes': {
																				'name': 'Temp-Report',
																				'description': ' '
																			},
																			'relationships': {
																				'folder': {
																					'data': {
																						'id': reportNodeIdTemp,
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
																			'id': tempReportId,
																			'type': 'report/panels'
																		}
																	})
																	.end((error6, response6) => {
																		expect(response6).to.have.status(200);
																		tempReportId = response6.body.data.id;
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
			.end((error1) => {
				if(error1) {
					done(error1);
					return;
				}

				agent
					.del(`/report/reports/${tempReportId}`)
					.end((error2) => {
						if(error2) {
							done(error2);
							return;
						}

						agent
							.del(`/report/attribute-sets/${tempDataSetId}`)
							.end((error3) => {
								if(error3) {
									done(error3);
									return;
								}

								agent
									.del(`/report/folders/${tempDataSetFolderId}`)
									.end((error4) => {
										if(error4) {
											done(error4);
											return;
										}

										agent
											.get('/session/logout')
											.end((err) => {
												done(err);
											});
									});
							});
					});
			});
	});

	// 1st lvl Basics information
	it('Should return proper Node details', function(done) {
		agent
			.get('/configure/nodes?_=1569908851488')
			.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36')
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data[5].attributes).to.have.property('name').eql('Report');
				expect(response.body.data[5].attributes).to.have.property('node_type').eql('root-folder');
				expect(response.body.data[5].attributes).to.have.property('route').eql('report');
				nodeId = response.body.data[5].id;
				done(err);
			});
	});

	// Attribute folder and report-config folder will be at random index too so some times so we are using if-else statement.
	it('Should return the proper config-tree-node details', function(done) {
		agent
			.get(`/report/config-tree-nodes?node_id=${nodeId}&node_type=root-folder&_=1573474458155`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				if(response.body[0].data.type === 'attribute-folder') {
					expect(response.body[0]).to.have.property('children').eql(true);
					expect(response.body[0]).to.have.property('parent').eql(nodeId);
					expect(response.body[0].data).to.have.property('type').eql('attribute-folder');
					expect(response.body[1]).to.have.property('children').eql(true);
					expect(response.body[1]).to.have.property('parent').eql(nodeId);
					expect(response.body[1].data).to.have.property('type').eql('report-folder');
					reportNodeId = response.body[1].id;
					dataSetsNodeId = response.body[0].id;
				}
				else {
					expect(response.body[1]).to.have.property('children').eql(true);
					expect(response.body[1]).to.have.property('parent').eql(nodeId);
					expect(response.body[1].data).to.have.property('type').eql('attribute-folder');
					expect(response.body[0]).to.have.property('children').eql(true);
					expect(response.body[0]).to.have.property('parent').eql(nodeId);
					expect(response.body[0].data).to.have.property('type').eql('report-folder');
					reportNodeId = response.body[0].id;
					dataSetsNodeId = response.body[1].id;
				}
				done(err);
			});
	});

	it('Should return the details for the report-node', function(done) {
		agent
			.get(`/report/folders/${reportNodeId}?_=1573108230515`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('description').eql('report_feature.folder_names.reports.description');
				expect(response.body.data.attributes).to.have.property('name').eql('report_feature.folder_names.reports.name');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(nodeId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	it('Should return the details for the data-set-node', function(done) {
		agent
			.get(`/report/folders/${dataSetsNodeId}?_=1573108230516`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('description').eql('report_feature.folder_names.attribute_sets.description');
				expect(response.body.data.attributes).to.have.property('name').eql('report_feature.folder_names.attribute_sets.name');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(nodeId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	// 2nd lvl
	// Test cases for the Data-Set
	it('Should open up the config-tree with the data-set node', function(done) {
		agent
			.get(`/report/config-tree-nodes?node_id=${dataSetsNodeId}&node_type=attribute-folder&_=1573110586049`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// 3rd lvl
	// Test cases for the Data-set Folders
	it('Should throw error while creating folder with null or empty-string', function(done) {
		agent
			.post('/report/folders')
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
					'type': 'report/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create a folder with name valid name', function(done) {
		agent
			.post('/report/folders')
			.send({
				'data': {
					'attributes': {
						'name': 'New Folder Under Data-set',
						'description': ' '
					},
					'relationships': {
						'parent': {
							'data': {
								'id': dataSetsNodeId,
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
					'id': newDataSetFolderID,
					'type': 'report/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newDataSetFolderID = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while creating folder with duplicate name', function(done) {
		agent
			.post('/report/folders')
			.send({
				'data': {
					'attributes': {
						'name': 'New Folder Under Data-set',
						'description': ' '
					},
					'relationships': {
						'parent': {
							'data': {
								'id': dataSetsNodeId,
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
					'type': 'report/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the existing folder with the null or empty-string', function(done) {
		agent
			.patch(`/report/folders/${newDataSetFolderID}`)
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
					'id': newDataSetFolderID,
					'type': 'report/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating non-existing folder', function(done) {
		agent
			.patch(`/report/folders/43be5d6c-d052-40de-8d19-8681b073fc53`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Folder Under Data-set',
						'description': ' '
					},
					'relationships': {
						'parent': {
							'data': {
								'id': dataSetsNodeId,
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
					'type': 'report/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the existing folder with duplicate name', function(done) {
		agent
			.patch(`/report/folders/${newDataSetFolderID}`)
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
					'id': newDataSetFolderID,
					'type': 'report/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update the existing folder with the name', function(done) {
		agent
			.patch(`/report/folders/${newDataSetFolderID}`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Folder Under Data-Sets',
						'description': ' '
					},
					'relationships': {
						'parent': {
							'data': {
								'id': dataSetsNodeId,
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
					'id': newDataSetFolderID,
					'type': 'report/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error if povided with invalid query params while fetching the folders', function(done) {
		agent
			.get(`/report/folders/${newDataSetFolderID}?_=1573108230515&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if try to get details of non-existing folders', function(done) {
		agent
			.get(`/report/folders/43be5d6c-d052-40de-8d19-8681b073fc53?_=1567062554849`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get all the details for the folder', function(done) {
		agent
			.get(`/report/folders/${newDataSetFolderID}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test cases for the Data-set
	it('Should throw error while creating the Data-set with name as null of empty string', function(done) {
		agent
			.post('/report/attribute-sets')
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
					'type': 'report/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create the Data-set with valid name', function(done) {
		agent
			.post('/report/attribute-sets')
			.send({
				'data': {
					'attributes': {
						'name': 'New Data-Set under the Reports',
						'description': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': dataSetsNodeId,
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
					'id': newDataSetId,
					'type': 'report/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newDataSetId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while creating the Data-set with duplicate name', function(done) {
		agent
			.post('/report/attribute-sets')
			.send({
				'data': {
					'attributes': {
						'name': 'New Data-Set under the Reports',
						'description': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': dataSetsNodeId,
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
					'type': 'report/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the non-existing Data-set', function(done) {
		agent
			.patch(`/report/attribute-sets/43be5d6c-d052-40de-8d19-8681b073fc53`)
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
					'type': 'report/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating data-set with the name as null or empty string', function(done) {
		agent
			.patch(`/report/attribute-sets/${newDataSetId}`)
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
					'id': newDataSetId,
					'type': 'report/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the Data-set with duplicate name', function(done) {
		agent
			.post('/report/attribute-sets')
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
					'id': newDataSetId,
					'type': 'report/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update the Data-set with the valid name', function(done) {
		agent
			.patch(`/report/attribute-sets/${newDataSetId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Data-Set Under the Reports',
						'description': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': dataSetsNodeId,
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
					'id': newDataSetId,
					'type': 'report/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Data-set details', function(done) {
		agent
			.get(`/report/attribute-sets/${newDataSetId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should return null if we try to get details of a non existing data-Set', function(done) {
		agent
			.get('/report/attribute-sets/43be5d6c-d052-40de-8d19-8681b073fc53?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get all the details for the data-set', function(done) {
		agent
			.get(`/report/attribute-sets/${newDataSetId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('should be able to get details of all availible Data set(s)', function(done) {
		agent
			.get('/report/attribute-sets')
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Data-Set-Properties
	it('Should return up the config-tree for the Data-set-property on clicking data-set', function(done) {
		agent
			.get(`/report/config-tree-nodes?node_id=${newDataSetId}&node_type=attribute-set&_=1573118469737`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error while creating the data-set-property with name as null or empty-string', function(done) {
		agent
			.post(`/report/attribute-set-properties`)
			.send({
				'data': {
					'attributes': {
						'datatype': 'number',
						'description': 'Data-Set-Property',
						'evaluation_expression': null,
						'internal_tag': ' ',
						'name': ' ',
						'source': 'static',
						'timestamp_format': 'not_a_timestamp',
						'units': null
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'report/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newDataSetPropertId,
					'type': 'report/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create the data-set-property with valid name', function(done) {
		agent
			.post(`/report/attribute-set-properties`)
			.send({
				'data': {
					'attributes': {
						'datatype': 'number',
						'description': 'Data-Set-Property',
						'evaluation_expression': null,
						'internal_tag': 'NEW_DATA_SET_PROPERTY',
						'name': 'New data-set-property',
						'source': 'static',
						'timestamp_format': 'not_a_timestamp',
						'units': null
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'report/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newDataSetPropertId,
					'type': 'report/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newDataSetPropertId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while creating the data-set-property with duplicate name', function(done) {
		agent
			.post(`/report/attribute-set-properties`)
			.send({
				'data': {
					'attributes': {
						'datatype': 'number',
						'description': 'Data-Set-Property',
						'evaluation_expression': null,
						'internal_tag': 'NEW_DATA_SET_PROPERTY',
						'name': 'New data-set-property',
						'source': 'static',
						'timestamp_format': 'not_a_timestamp',
						'units': null
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'report/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newDataSetPropertId,
					'type': 'report/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the data-set-property with name as null or empty string', function(done) {
		agent
			.patch(`/report/attribute-set-properties/${newDataSetPropertId}`)
			.send({
				'data': {
					'attributes': {
						'datatype': 'number',
						'description': 'Data-Set-Property',
						'evaluation_expression': null,
						'internal_tag': 'NEW_DATA_SET_PROPERTY',
						'name': ' ',
						'source': 'static',
						'timestamp_format': 'not_a_timestamp',
						'units': null
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'report/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newDataSetPropertId,
					'type': 'report/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating non-existing data-set-property', function(done) {
		agent
			.patch(`/report/attribute-set-properties/43be5d6c-d052-40de-8d19-8681b073fc53`)
			.send({
				'data': {
					'attributes': {
						'datatype': 'number',
						'description': 'Data-Set-Property',
						'evaluation_expression': null,
						'internal_tag': 'NEW_DATA_SET_PROPERTY',
						'name': ' ',
						'source': 'static',
						'timestamp_format': 'not_a_timestamp',
						'units': null
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'report/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newDataSetPropertId,
					'type': 'report/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the data-set-property with duplicate name', function(done) {
		agent
			.patch(`/report/attribute-set-properties/${newDataSetPropertId}`)
			.send({
				'data': {
					'attributes': {
						'datatype': 'number',
						'description': 'Temp Data-Set-Property',
						'evaluation_expression': null,
						'internal_tag': 'NEW_DATA_SET_PROPERTY',
						'name': 'Temp Data-Set-Property',
						'source': 'static',
						'timestamp_format': 'not_a_timestamp',
						'units': null
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'report/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newDataSetPropertId,
					'type': 'report/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update the data-set-property with name', function(done) {
		agent
			.patch(`/report/attribute-set-properties/${newDataSetPropertId}`)
			.send({
				'data': {
					'attributes': {
						'datatype': 'number',
						'description': 'Data-Set-Property',
						'evaluation_expression': null,
						'internal_tag': 'NEW_DATA_SET_PROPERTY',
						'name': 'New Data-set-property',
						'source': 'static',
						'timestamp_format': 'not_a_timestamp',
						'units': null
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'report/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newDataSetPropertId,
					'type': 'report/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should return null if we try to get details of a non existing attribute set property', function(done) {
		agent
			.get('/report/attribute-set-properties/43be5d6c-d052-40de-8d19-8681b073fc53?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Attribute Set details', function(done) {
		agent
			.get(`/report/attribute-set-properties/${newDataSetPropertId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should get the details for the for the Data-Set-Property', function(done) {
		agent
			.get(`/report/attribute-set-properties/${newDataSetPropertId}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('New Data-set-property');
				done(err);
			});
	});

	it('Should open up the Report devenv-tree', function(done) {
		agent
			.get(`/report/devenv-tree-nodes?node_id=${nodeId}&node_type=root-folder&_=1573196536511`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				if(response.body[0].data.type === 'attribute-folder') {
					expect(response.body[0]).to.have.property('children').eql(true);
					expect(response.body[0].data).to.have.property('dataUrl').eql('/report/devenv-tree-nodes');
					expect(response.body[0].data).to.have.property('devenvRoute').eql('devenv.report');
					expect(response.body[0].data).to.have.property('type').eql('attribute-folder');
					expect(response.body[0].data).to.have.property('intl').eql(true);
					expect(response.body[0].li_attr).to.have.property('title').eql('report_feature.folder_names.attribute_sets.name');
					expect(response.body[1]).to.have.property('children').eql(true);
					expect(response.body[1].data).to.have.property('dataUrl').eql('/report/devenv-tree-nodes');
					expect(response.body[1].data).to.have.property('devenvRoute').eql('devenv.report');
					expect(response.body[1].data).to.have.property('type').eql('report-folder');
					expect(response.body[1].data).to.have.property('intl').eql(true);
					expect(response.body[1].li_attr).to.have.property('title').eql('report_feature.folder_names.reports.name');
				}
				else {
					expect(response.body[1]).to.have.property('children').eql(true);
					expect(response.body[1].data).to.have.property('dataUrl').eql('/report/devenv-tree-nodes');
					expect(response.body[1].data).to.have.property('devenvRoute').eql('devenv.report');
					expect(response.body[1].data).to.have.property('type').eql('attribute-folder');
					expect(response.body[1].data).to.have.property('intl').eql(true);
					expect(response.body[1].li_attr).to.have.property('title').eql('report_feature.folder_names.attribute_sets.name');
					expect(response.body[0]).to.have.property('children').eql(true);
					expect(response.body[0].data).to.have.property('dataUrl').eql('/report/devenv-tree-nodes');
					expect(response.body[0].data).to.have.property('devenvRoute').eql('devenv.report');
					expect(response.body[0].data).to.have.property('type').eql('report-folder');
					expect(response.body[0].data).to.have.property('intl').eql(true);
					expect(response.body[0].li_attr).to.have.property('title').eql('report_feature.folder_names.reports.name');
				}
				done(err);
			});
	});

	it('Should return the devenv-tree-nodes for the data-set-property', function(done) {
		agent
			.get(`/report/devenv-tree-nodes?node_id=${newDataSetPropertId}&node_type=attribute-set&_=1573197399743`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test cases for the Before,After and Observe function for the Data-set property under IDE
	// Before Function
	it('Should throw error while adding the before function for the data-set with name as null or empty-string', function(done) {
		agent
			.post(`/report/attribute-set-functions`)
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
								'type': 'report/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'report/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should add the before function for the data-set', function(done) {
		agent
			.post(`/report/attribute-set-functions`)
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
								'type': 'report/attribute-sets'
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
					'type': 'report/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newBeforeFunctionId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while adding the before function for the data-set with the duplicate name', function(done) {
		agent
			.post(`/report/attribute-set-functions`)
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
								'type': 'report/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'report/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update the before function with the valid name', function(done) {
		agent
			.patch(`/report/attribute-set-functions/${newBeforeFunctionId}`)
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
								'type': 'report/attribute-sets'
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
					'type': 'report/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error while updating the before function with the name as null and empty string', function(done) {
		agent
			.patch(`/report/attribute-set-functions/${newBeforeFunctionId}`)
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
								'type': 'report/attribute-sets'
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
					'type': 'report/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if we try to get details of a non existing Data set function', function(done) {
		agent
			.get('/report/attribute-set-functions/43be5d6c-d052-40de-8d19-8681b073fc53?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Data Set-Function details', function(done) {
		agent
			.get(`/report/attribute-set-functions/${newBeforeFunctionId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should get the details for the Data-set functions', function(done) {
		agent
			.get(`/report/attribute-set-functions/${newBeforeFunctionId}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Observe Function
	it('Should add the observe function for the data-set', function(done) {
		agent
			.post(`/report/attribute-set-functions`)
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
								'type': 'report/attribute-sets'
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
					'type': 'report/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newObserveFunctionId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while adding the observe function for the data-set with name as null or empty-string', function(done) {
		agent
			.post(`/report/attribute-set-functions`)
			.send({
				'data': {
					'attributes': {
						'code': 'Observe();',
						'description': ' ',
						'execution_order': 1,
						'name': ' ',
						'type': 'observer'
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'report/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'report/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while adding the observe function for the data-set with the duplicate name', function(done) {
		agent
			.post(`/report/attribute-set-functions`)
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
								'type': 'report/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'report/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update the observe function with the valid name', function(done) {
		agent
			.patch(`/report/attribute-set-functions/${newObserveFunctionId}`)
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
								'type': 'report/attribute-sets'
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
					'type': 'report/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error while updating the observe function with the name as null and empty string', function(done) {
		agent
			.patch(`/report/attribute-set-functions/${newObserveFunctionId}`)
			.send({
				'data': {
					'attributes': {
						'code': 'Observe();',
						'description': ' ',
						'execution_order': 1,
						'name': ' ',
						'type': 'observer'
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'report/attribute-sets'
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
					'type': 'report/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while adding a non-existing data-set-property to observe-function', function(done) {
		agent
			.post(`/report/attribute-set-function-observed-properties`)
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'report/attribute-sets'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': newObserveFunctionId,
								'type': 'report/attribute-set-functions'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': '43be5d6c-d052-40de-8d19-8681b073fc53',
								'type': 'report/attribute-set-properties'
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

	it('Should throw error while adding a data-set-property to non-existing observe-function', function(done) {
		agent
			.post(`/report/attribute-set-function-observed-properties`)
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'report/attribute-sets'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': '43be5d6c-d052-40de-8d19-8681b073fc53',
								'type': 'report/attribute-set-functions'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': newDataSetPropertId,
								'type': 'report/attribute-set-properties'
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

	it('Should add a observer-function-property to the observer function', function(done) {
		agent
			.post(`/report/attribute-set-function-observed-properties`)
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newDataSetId,
								'type': 'report/attribute-sets'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': newObserveFunctionId,
								'type': 'report/attribute-set-functions'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': newDataSetPropertId,
								'type': 'report/attribute-set-properties'
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

	it('Should return null if we try to get details of the non existing data-set-observe-function-prpoerty', function(done) {
		agent
			.get(`/report/attribute-set-function-observed-properties/43be5d6c-d052-40de-8d19-8681b073fc53?_=1567062554849`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw error if we provide invalid query params in url while fetching data-set-observe-function-prpoerty', function(done) {
		agent
			.get(`/report/attribute-set-function-observed-properties/${newDataSetObserveFunctionPropertyId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response.body.data).to.eql(undefined);
				done(err);
			});
	});

	it('Should get the details for the observe-function-property', function(done) {
		agent
			.get(`/report/attribute-set-function-observed-properties/${newDataSetObserveFunctionPropertyId}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Report test cases for the Config
	it('Should throw error while creating the Report with name as null or empty string', function(done) {
		agent
			.post(`/report/reports`)
			.send({
				'data': {
					'attributes': {
						'attribute_set_metadata': [],
						'data_persistence_period': 1,
						'description': ' ',
						'name': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': reportNodeId,
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
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create the Report with valid name', function(done) {
		agent
			.post(`/report/reports`)
			.send({
				'data': {
					'attributes': {
						'attribute_set_metadata': [],
						'data_persistence_period': 1,
						'description': ' ',
						'name': 'New report'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': reportNodeId,
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
					'id': newReportID,
					'type': 'report/reports'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newReportID = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while creating the Report with duplicate name', function(done) {
		agent
			.post(`/report/reports`)
			.send({
				'data': {
					'attributes': {
						'attribute_set_metadata': [],
						'data_persistence_period': 1,
						'description': ' ',
						'name': 'New report'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': reportNodeId,
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
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the Report with name as null or empty-string', function(done) {
		agent
			.patch(`/report/reports/${newReportID}`)
			.send({
				'data': {
					'attributes': {
						'attribute_set_metadata': [],
						'data_persistence_period': 1,
						'description': ' ',
						'name': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': reportNodeId,
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
					'id': newReportID,
					'type': 'report/reports'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the non-existing Report', function(done) {
		agent
			.patch(`/report/reports/43be5d6c-d052-40de-8d19-8681b073fc53`)
			.send({
				'data': {
					'attributes': {
						'attribute_set_metadata': [],
						'data_persistence_period': 1,
						'description': ' ',
						'name': ' '
					},
					'relationships': {
						'folder': {
							'data': {
								'id': reportNodeId,
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
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the Report with duplicate name', function(done) {
		agent
			.patch(`/report/reports/${newReportID}`)
			.send({
				'data': {
					'attributes': {
						'attribute_set_metadata': [],
						'data_persistence_period': 1,
						'description': ' ',
						'name': 'Temp-Report'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': reportNodeId,
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
					'id': newReportID,
					'type': 'report/reports'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update the Report with valid name', function(done) {
		agent
			.patch(`/report/reports/${newReportID}`)
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
								'id': reportNodeId,
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
					'id': newReportID,
					'type': 'report/reports'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw invalid query params while fetching the reports', function(done) {
		agent
			.get(`/report/reports/${newReportID}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if we try to get details of a non existing report ', function(done) {
		agent
			.get('/report/reports/43be5d6c-d052-40de-8d19-8681b073fc53?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for all the reports', function(done) {
		agent
			.get(`/report/reports`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should get the details for the existing report', function(done) {
		agent
			.get(`/report/reports/${newReportID}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test cases for the Inner-Report Features
	it('Should return the config-tree for the report created', function(done) {
		agent
			.get(`/report/config-tree-nodes?node_id=${newReportID}&node_type=report&_=1573456394286`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Watchers under the Reports
	it('Should return users list to choose the users for adding watchers', function(done) {
		agent
			.get(`/report/possibleTenantUsersList?report=${newReportID}&_=1574316307807`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				rootUserId = response.body[0].id;
				done(err);
			});
	});

	it('Should add root-user as watcher in the Reports', function(done) {
		agent
			.post(`/report/report-watchers`)
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
						'tenant_report': {
							'data': {
								'id': newReportID,
								'type': 'report/report'
							}
						},
						'tenant_user': {
							'data': {
								'id': rootUserId,
								'type': 'pug/user-manager/tenant-users'
							}
						}
					},
					'id': newWatcherId1,
					'type': 'report/report-watchers'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newWatcherId1 = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while adding non-existing user as watcher in the Reports', function(done) {
		agent
			.post(`/report/report-watchers`)
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
						'tenant_report': {
							'data': {
								'id': newReportID,
								'type': 'report/report'
							}
						},
						'tenant_user': {
							'data': {
								'id': '43be5d6c-d052-40de-8d19-8681b073fc53',
								'type': 'pug/user-manager/tenant-users'
							}
						}
					},
					'type': 'report/report-watchers'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw invalid query params while fetching the watcher under the reports', function(done) {
		agent
			.get(`/report/report-watchers/${newWatcherId1}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if we try to get details of a non existing watcher', function(done) {
		agent
			.get('/report/report-watchers/43be5d6c-d052-40de-8d19-8681b073fc53?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details of watchers', function(done) {
		agent
			.get(`/report/report-watchers/${newWatcherId1}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Case for the adding Data-Set for the Reports
	it('Should return the possible data-set for adding', function(done) {
		agent
			.get(`/report/attribute-sets?_=1573458257964`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error while adding the non-existing data-set to the report for tracking', function(done) {
		agent
			.post(`/report/report-attribute-sets`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'updated_at': Date.now(),
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
								'id': '43be5d6c-d052-40de-8d19-8681b073fc53',
								'type': 'report/attribute-sets'
							}
						},
						'tenant_report': {
							'data': {
								'id': newReportID,
								'type': 'report/reports'
							}
						}
					},
					'type': 'report/report-attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should add the data-set to the report for tracking', function(done) {
		agent
			.post(`/report/report-attribute-sets`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'updated_at': Date.now(),
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
								'type': 'report/attribute-sets'
							}
						},
						'tenant_report': {
							'data': {
								'id': newReportID,
								'type': 'report/reports'
							}
						}
					},
					'id': newTrackDataSetId,
					'type': 'report/report-attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newTrackDataSetId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw invalid query params while fetching the Tracked Data-Set under the reports', function(done) {
		agent
			.get(`/report/report-attribute-sets/${newTrackDataSetId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should return null if we try to get details of a non existing Tracked Data-Set', function(done) {
		agent
			.get('/report/report-attribute-sets/43be5d6c-d052-40de-8d19-8681b073fc53?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the Tracked Data-Set under the reports', function(done) {
		agent
			.get(`/report/report-attribute-sets/${newTrackDataSetId}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test for Machines
	it('Should add the machine to the tracked entities', function(done) {
		agent
			.post(`/report/report-constituents`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'updated_at': Date.now(),
						'tenant_report_constituent_id': tempMachineId,
						'tenant_report_constituent_type': 'machine'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_report': {
							'data': {
								'id': newReportID,
								'type': 'report/reports'
							}
						}
					},
					'id': newMachineConstituentsId,
					'type': 'report/report-constituents'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newMachineConstituentsId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while adding the non-existing machine to the tracked entities', function(done) {
		agent
			.post(`/report/report-constituents`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'updated_at': Date.now(),
						'tenant_report_constituent_id': '43be5d6c-d052-40de-8d19-8681b073fc53',
						'tenant_report_constituent_type': 'machine'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_report': {
							'data': {
								'id': newReportID,
								'type': 'report/reports'
							}
						}
					},
					'type': 'report/report-constituents'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	// Test for the Station
	it('Should add the station to the tracked entities', function(done) {
		agent
			.post(`/report/report-constituents`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'updated_at': Date.now(),
						'tenant_report_constituent_id': tempStationId,
						'tenant_report_constituent_type': 'station'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_report': {
							'data': {
								'id': newReportID,
								'type': 'report/reports'
							}
						}
					},
					'id': newStationConstituentsId,
					'type': 'report/report-constituents'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newStationConstituentsId = response.body.data.id;
				done(err);
			});
	});

	// Test for the Line
	it('Should add the line to the tracked entities', function(done) {
		agent
			.post(`/report/report-constituents`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'updated_at': Date.now(),
						'tenant_report_constituent_id': tempLineId,
						'tenant_report_constituent_type': 'line'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_report': {
							'data': {
								'id': newReportID,
								'type': 'report/reports'
							}
						}
					},
					'id': newLineConstituentsId,
					'type': 'report/report-constituents'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newLineConstituentsId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw invalid query params while fetching the Tracked Constituent Id under the reports', function(done) {
		agent
			.get(`/report/report-constituents/${newMachineConstituentsId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if we try to get details of a non existing Tracked Constitiuent', function(done) {
		agent
			.get('/report/report-constituents/43be5d6c-d052-40de-8d19-8681b073fc53?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details of the constituents under the reports', function(done) {
		agent
			.get(`/report/report-constituents/${newMachineConstituentsId}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Backend Code under IDE
	// it('Should throw error while creating Backend Code for the report with code as null', function(done) {
	// 	agent
	// 		.post(`/report/report-processors`)
	// 		.send({
	// 			'data': {
	// 				'attributes': {
	// 					'processed_data_transform_code': ' '
	// 				},
	// 				'relationships': {
	// 					'tenant': {
	// 						'data': {
	// 							'id': tenantId,
	// 							'type': 'settings/account/basics/tenants'
	// 						}
	// 					},
	// 					'tenant_report': {
	// 						'data': {
	// 							'id': newReportID,
	// 							'type': 'report/reports'
	// 						}
	// 					}
	// 				},
	// 				'type': 'report/report-processors'
	// 			}
	// 		})
	// 		.end((err, response) => {
	// 			expect(response).to.have.status(422);
	// 			done(err);
	// 		});
	// });

	it('Should create Backend Code for the report under IDE', function(done) {
		agent
			.post(`/report/report-processors`)
			.send({
				'data': {
					'attributes': {
						'processed_data_transform_code': 'ABC();'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_report': {
							'data': {
								'id': newReportID,
								'type': 'report/reports'
							}
						}
					},
					'id': newDataProcessorsId,
					'type': 'report/report-processors'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newDataProcessorsId = response.body.data.id;
				done(err);
			});
	});

	it('Should update the Backend Code for the Reports under IDE', function(done) {
		agent
			.patch(`/report/report-processors/${newDataProcessorsId}`)
			.send({
				'data': {
					'attributes': {
						'processed_data_transform_code': 'ABCQWE();'
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_report': {
							'data': {
								'id': newReportID,
								'type': 'report/reports'
							}
						}
					},
					'id': newDataProcessorsId,
					'type': 'report/report-processors'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// it('Should throw error while updating the Backend Code for the Reports under IDE', function(done) {
	// 	agent
	// 		.patch(`/report/report-processors/${newDataProcessorsId}`)
	// 		.send({
	// 			'data': {
	// 				'attributes': {
	// 					'processed_data_transform_code': ' '
	// 				},
	// 				'relationships': {
	// 					'tenant': {
	// 						'data': {
	// 							'id': tenantId,
	// 							'type': 'settings/account/basics/tenants'
	// 						}
	// 					},
	// 					'tenant_report': {
	// 						'data': {
	// 							'id': newReportID,
	// 							'type': 'report/reports'
	// 						}
	// 					}
	// 				},
	// 				'id': newDataProcessorsId,
	// 				'type': 'report/report-processors'
	// 			}
	// 		})
	// 		.end((err, response) => {
	// 			expect(response).to.have.status(422);
	// 			done(err);
	// 		});
	// });

	it('Should throw invalid query params while fetching the Backend Code under the reports', function(done) {
		agent
			.get(`/report/report-processors/${newDataProcessorsId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should return null if we try to get details of a non existing Backend', function(done) {
		agent
			.get('/report/report-processors/43be5d6c-d052-40de-8d19-8681b073fc53?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the Backend code under IDE', function(done) {
		agent
			.get(`/report/report-processors/${newDataProcessorsId}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Add a Component-Template Code from IDE
	it('Should throw error while adding a template code for report with on-data-code as null or empty', function(done) {
		agent
			.post('/report/report-templates')
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC',
						'component_before_destroy_code': 'PQR',
						'component_before_render_code': 'STR',
						'component_on_data_code': ' ',
						'component_state': {},
						'publish_status': false,
						'template': null
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_report': {
							'data': {
								'id': newReportID,
								'type': 'report/reports'
							}
						}
					},
					'type': 'report/report-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should add a template code to the report', function(done) {
		agent
			.post('/report/report-templates')
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC',
						'component_before_destroy_code': 'PQR',
						'component_before_render_code': 'STR',
						'component_on_data_code': 'XYZ',
						'component_state': {},
						'publish_status': false,
						'template': ''
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_report': {
							'data': {
								'id': newReportID,
								'type': 'report/reports'
							}
						}
					},
					'id': newComponentTemplateId,
					'type': 'report/report-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newComponentTemplateId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while updating a template code with on-data-code as null or empty', function(done) {
		agent
			.patch(`/report/report-templates/${newComponentTemplateId}`)
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC',
						'component_before_destroy_code': 'PQR',
						'component_before_render_code': 'STR()',
						'component_on_data_code': ' ',
						'component_state': {},
						'publish_status': true,
						'template': null
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_report': {
							'data': {
								'id': newReportID,
								'type': 'report/reports'
							}
						}
					},
					'id': newComponentTemplateId,
					'type': 'report/report-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update a template code for report with publish status as true', function(done) {
		agent
			.patch(`/report/report-templates/${newComponentTemplateId}`)
			.send({
				'data': {
					'attributes': {
						'component_after_render_code': 'ABC',
						'component_before_destroy_code': 'PQR',
						'component_before_render_code': 'STR',
						'component_on_data_code': 'XYZ',
						'component_state': {},
						'publish_status': true,
						'template': ''
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_report': {
							'data': {
								'id': newReportID,
								'type': 'report/reports'
							}
						}
					},
					'id': newComponentTemplateId,
					'type': 'report/report-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should get the detials for the template', function(done) {
		agent
			.get(`/report/report-templates/${newComponentTemplateId}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw invalid query params while fetching the Template', function(done) {
		agent
			.get(`/report/report-templates/${newComponentTemplateId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if we try to get details of a non existing Template', function(done) {
		agent
			.get('/report/report-templates/43be5d6c-d052-40de-8d19-8681b073fc53?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	// Delete test for the tracked entities Lines under Reports
	it('Should throw error while deleting the non-existing line constituents from reports', function(done) {
		agent
			.del(`/report/report-constituents/43be5d6c-d052-40de-8d19-8681b073fc53`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing line constituents from reports', function(done) {
		agent
			.del(`/report/report-constituents/${newLineConstituentsId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test for the tracked entities Station under Reports
	it('Should delete the existing station constituents from reports', function(done) {
		agent
			.del(`/report/report-constituents/${newStationConstituentsId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});


	// Delete test for the tracked entities Machine under Reports
	it('Should delete the existing machine constituents from reports', function(done) {
		agent
			.del(`/report/report-constituents/${newMachineConstituentsId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete Test for the Tracked Data-set under Reports
	it('Should throw error while deleting the non-existing tracked Data-set under Reports', function(done) {
		agent
			.del(`/report/report-attribute-sets/43be5d6c-d052-40de-8d19-8681b073fc53`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing tracked Data-set under reports', function(done) {
		agent
			.del(`/report/report-attribute-sets/${newTrackDataSetId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete Test for the watchers for the Reports
	it('Should throw error while deleting the non-existing watcher', function(done) {
		agent
			.del(`/report/report-watchers/43be5d6c-d052-40de-8d19-8681b073fc53`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the watcher from the watchers in the report', function(done) {
		agent
			.del(`/report/report-watchers/${newWatcherId1}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test for the Report under the Config
	it('Should throw error while deleting the non-existing report', function(done) {
		agent
			.del(`/report/reports/43be5d6c-d052-40de-8d19-8681b073fc53`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing report', function(done) {
		agent
			.del(`/report/reports/${newReportID}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test for the Observe-function-property for the Observer function under IDE
	it('should throw error while deleting the non-existing observe-function-property', function(done) {
		agent
			.del(`/report/attribute-set-function-observed-properties/43be5d6c-d052-40de-8d19-8681b073fc53`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing observe-function-property', function(done) {
		agent
			.del(`/report/attribute-set-function-observed-properties/${newDataSetObserveFunctionPropertyId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test for the Observe function for the Data-set under IDE
	it('Should throw error while deleting the non-existing observe function', function(done) {
		agent
			.del(`/report/attribute-set-functions/43be5d6c-d052-40de-8d19-8681b073fc53`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing observe function', function(done) {
		agent
			.del(`/report/attribute-set-functions/${newObserveFunctionId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test for the Before function for the Data-set under IDE
	it('Should delete the existing before function', function(done) {
		agent
			.del(`/report/attribute-set-functions/${newBeforeFunctionId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete Test for the Data-set-property under Data-Set
	it('Should throw error while deleting the non-existing data-set-property', function(done) {
		agent
			.del(`/report/attribute-set-properties/43be5d6c-d052-40de-8d19-8681b073fc53`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing data-set-property', function(done) {
		agent
			.del(`/report/attribute-set-properties/${newDataSetPropertId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test for the Data-sets
	it('Should throw error while deleting the non-existing Data-set', function(done) {
		agent
			.del(`/report/attribute-sets/43be5d6c-d052-40de-8d19-8681b073fc53`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing Data-set', function(done) {
		agent
			.del(`/report/attribute-sets/${newDataSetId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test for Folders under Data-set
	it('Should throw error while deleting the non-existing data-set folder', function(done) {
		agent
			.del(`/report/folders/43be5d6c-d052-40de-8d19-8681b073fc53`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should delete the existing data-set folder', function(done) {
		agent
			.del(`/report/folders/${newDataSetFolderID}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});
});
