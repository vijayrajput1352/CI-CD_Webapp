/* eslint-disable max-nested-callbacks */
'use strict';

const chai = require('chai'); // eslint-disable-line node/no-unpublished-require
const chaiHttp = require('chai-http'); // eslint-disable-line node/no-unpublished-require
const fs = require('fs');
const moment = require('moment');

chai.use(chaiHttp);


describe('Work Orders Feature Test Cases', function() {
	const agent = chai.request.agent('http://localhost:9100');
	const expect = chai.expect;
	let tenantId;
	let dataSetsNodeId, nodeId, workOrderFormatNodeId;
	let newFolderId;
	let formatAttributeSetId, newAttributeSetFunctionId, newAttributeSetFunctionObservedPropertyId, newAttributeSetId, newAttributeSetObserverFunctionId, newAttributeSetPropertyId, newAttributeSetPropertyId1;
	let workOrderFormatId;
	let invalidXlData, rejectedXlData, textData, updatedXlData, xlData;
	let manufacturingNodeId, newLineConstituentId, newLineId, newMachineId, newPlantId, newPlantUnitId, plantsNodeId;
	let emdDataSetsNodeId, emdNodeId, emdUploadConfigNodeId, emdXlData, newEmdAttributeSetId, newEmdAttributeSetPropertyId1, newEmdAttributeSetPropertyId2, newEmdAttributeSetPropertyId3, newEmdAttributeSetPropertyId4, newEmdAttributeSetPropertyId5, newEmdConfigDataSetId, newUploadConfigId;
	// let workOrderId;

	const path = __dirname.split('/features');
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	fs.readFile(`${path[0]}/user_assets/excelsheet/avatar.xlsx`, function(err, data) {
		if(err) throw err;
		xlData = data;
	});

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	fs.readFile(`${path[0]}/user_assets/excelsheet/tests-example.xls`, function(err, data) {
		if(err) throw err;
		invalidXlData = data;
	});

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	fs.readFile(`${path[0]}/user_assets/excelsheet/updated_avatar.xlsx`, function(err, data) {
		if(err) throw err;
		updatedXlData = data;
	});

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	fs.readFile(`${path[0]}/user_assets/excelsheet/test.txt`, function(err, data) {
		if(err) throw err;
		textData = data;
	});

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	fs.readFile(`${path[0]}/user_assets/excelsheet/rejected_avatar.xlsx`, function(err, data) {
		if(err) throw err;
		rejectedXlData = data;
	});

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	fs.readFile(`${path[0]}/user_assets/excelsheet/imp.xlsx`, function(err, data) {
		if(err) throw err;
		emdXlData = data;
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
					.end((error, response) => {
						tenantId = response.body.tenant_id;
						if(err) {
							done(error);
							return;
						}

						agent
							.get('/configure/nodes?_=1566818693175')
							.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36')
							.end((error1, response1) => {
								manufacturingNodeId = response1.body.data[3].id;
								emdNodeId = response1.body.data[1].id;
								if(error1) {
									done(error1);
									return;
								}

								agent
									.get(`/manufacturing/config-tree-nodes?node_id=${manufacturingNodeId}&node_type=root-folder&_=1566990208766`)
									.end((error2, response2) => {
										if(response2.body[0].data.type === 'attribute-folder')
											plantsNodeId = response2.body[1].id;
										else
											plantsNodeId = response2.body[0].id;

										if(error2) {
											done(error2);
											return;
										}

										agent
											.post('/manufacturing/plants')
											.send({
												'data': {
													'attributes': {
														'name': 'New Plant',
														'description': 'New Plant under Plants'
													},
													'relationships': {
														'folder': {
															'data': {
																'id': plantsNodeId,
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
											.end((error3, response3) => {
												newPlantId = response3.body.data.id;
												if(error3) {
													done(error3);
													return;
												}

												agent
													.post('/manufacturing/plant-units')
													.send({
														'data': {
															'attributes': {
																'name': 'New Plant Unit',
																'description': 'New Plant-unit under Newly added Plant'
															},
															'relationships': {
																'plant': {
																	'data': {
																		'id': newPlantId,
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
													.end((error4, response4) => {
														expect(response4).to.have.status(200);
														newPlantUnitId = response4.body.data.id;
														if(error4) {
															done(error4);
															return;
														}

														agent
															.post('/manufacturing/plant-unit-machines')
															.send({
																'data': {
																	'attributes': {
																		'name': 'New Machine',
																		'description': 'New Machine under Newly added Plant Unit',
																		'attribute_set_metadata': [],
																		'type': 'machine',
																		'data_persistence_period': 1,
																		'downtime_list_filters': [],
																		'operator_list_filters': []
																	},
																	'relationships': {
																		'tenant_plant_unit': {
																			'data': {
																				'id': newPlantUnitId,
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
															.end((error5, response5) => {
																newMachineId = response5.body.data.id;
																if(error5) {
																	done(err);
																	return;
																}

																agent
																	.post('/manufacturing/plant-unit-lines')
																	.send({
																		'data': {
																			'attributes': {
																				'name': 'New Line',
																				'description': 'New Line under Newly added Plant Unit',
																				'attribute_set_metadata': []
																			},
																			'relationships': {
																				'tenant_plant_unit': {
																					'data': {
																						'id': newPlantUnitId,
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
																	.end((error6, response6) => {
																		expect(response6).to.have.status(200);
																		newLineId = response6.body.data.id;
																		if(error6) {
																			done(error6);
																			return;
																		}

																		agent
																			.post('/manufacturing/plant-unit-line-constituents')
																			.send({
																				'data': {
																					'attributes': {
																						'constituent_type': 'machine',
																						'step': '1',
																						'tenant_plant_unit_line_constituent_id': newMachineId

																					},
																					'relationships': {
																						'tenant': {
																							'data': {
																								'id': tenantId,
																								'type': 'settings/account/basics/tenants'
																							}
																						},
																						'tenant_plant_unit_line': {
																							'data': {
																								'id': newLineId,
																								'type': 'manufacturing/plant-unit-lines'
																							}
																						}
																					},
																					'type': 'manufacturing/plant-unit-line-constituents'
																				}
																			})
																			// eslint-disable-next-line max-nested-callbacks
																			.end((error7, response7) => {
																				expect(response7).to.have.status(200);
																				newLineConstituentId = response7.body.data.id;
																				if(error7) {
																					done(error7);
																					return;
																				}

																				agent
																					.get(`/emd/tree-nodes?node_id=${emdNodeId}&node_type=root-folder&_=1567414700694`)
																					.end((error8, response8) => {
																						expect(response8).to.have.status(200);
																						if(response8.body[0].data.type === 'attribute-folder') {
																							emdUploadConfigNodeId = response8.body[1].id;
																							emdDataSetsNodeId = response8.body[0].id;
																						}
																						else {
																							emdUploadConfigNodeId = response8.body[0].id;
																							emdDataSetsNodeId = response8.body[1].id;
																						}
																						if(error8) {
																							done(error8);
																							return;
																						}

																						agent
																							.post('/emd/attribute-sets')
																							.send({
																								'data': {
																									'attributes': {
																										'name': 'New Emd Attribute Set',
																										'description': 'New Attribute set under Data Sets'
																									},
																									'relationships': {
																										'folder': {
																											'data': {
																												'id': emdDataSetsNodeId,
																												'type': 'emd/folders'
																											}
																										},
																										'tenant': {
																											'data': {
																												'id': tenantId,
																												'type': 'settings/account/basics/tenants'
																											}
																										}
																									},
																									'type': 'emd/attribute-sets'
																								}
																							})
																							.end((error9, response9) => {
																								expect(response9).to.have.status(200);
																								newEmdAttributeSetId = response9.body.data.id;
																								if(error9) {
																									done(error9);
																									return;
																								}

																								agent
																									.post('/emd/attribute-set-properties')
																									.send({
																										'data': {
																											'attributes': {
																												'name': 'NAME',
																												'description': 'New Data Set Property',
																												'source': 'input',
																												'datatype': 'string',
																												'evaluation_expression': null,
																												'internal_tag': 'NAME',
																												'timestamp_format': 'not_a_timestamp',
																												'units': null
																											},
																											'relationships': {
																												'attribute_set': {
																													'data': {
																														'id': newEmdAttributeSetId,
																														'type': 'emd/attribute-sets'
																													}
																												},
																												'tenant': {
																													'data': {
																														'id': tenantId,
																														'type': 'settings/account/basics/tenants'
																													}
																												}
																											},
																											'type': 'emd/attribute-set-properties'
																										}
																									})
																									.end((error10, response10) => {
																										expect(response10).to.have.status(200);
																										newEmdAttributeSetPropertyId1 = response10.body.data.id;
																										if(error10) {
																											done(error10);
																											return;
																										}

																										agent
																											.post('/emd/attribute-set-properties')
																											.send({
																												'data': {
																													'attributes': {
																														'name': 'ROLE',
																														'description': 'New Data Set Property',
																														'source': 'input',
																														'datatype': 'string',
																														'evaluation_expression': null,
																														'internal_tag': 'ROLE',
																														'timestamp_format': 'not_a_timestamp',
																														'units': null
																													},
																													'relationships': {
																														'attribute_set': {
																															'data': {
																																'id': newEmdAttributeSetId,
																																'type': 'emd/attribute-sets'
																															}
																														},
																														'tenant': {
																															'data': {
																																'id': tenantId,
																																'type': 'settings/account/basics/tenants'
																															}
																														}
																													},
																													'type': 'emd/attribute-set-properties'
																												}
																											})
																											.end((error11, response11) => {
																												expect(response11).to.have.status(200);
																												newEmdAttributeSetPropertyId2 = response11.body.data.id;
																												if(error11) {
																													done(error11);
																													return;
																												}


																												agent
																													.post('/emd/attribute-set-properties')
																													.send({
																														'data': {
																															'attributes': {
																																'name': 'VAL1',
																																'description': 'New Data Set Property',
																																'source': 'input',
																																'datatype': 'number',
																																'evaluation_expression': null,
																																'internal_tag': 'VAL1',
																																'timestamp_format': 'not_a_timestamp',
																																'units': null
																															},
																															'relationships': {
																																'attribute_set': {
																																	'data': {
																																		'id': newEmdAttributeSetId,
																																		'type': 'emd/attribute-sets'
																																	}
																																},
																																'tenant': {
																																	'data': {
																																		'id': tenantId,
																																		'type': 'settings/account/basics/tenants'
																																	}
																																}
																															},
																															'type': 'emd/attribute-set-properties'
																														}
																													})
																													.end((error12, response12) => {
																														newEmdAttributeSetPropertyId3 = response12.body.data.id;
																														expect(response12).to.have.status(200);
																														if(error12) {
																															done(error12);
																															return;
																														}

																														agent
																															.post('/emd/attribute-set-properties')
																															.send({
																																'data': {
																																	'attributes': {
																																		'name': 'VAL2',
																																		'description': 'New Data Set Property',
																																		'source': 'input',
																																		'datatype': 'boolean',
																																		'evaluation_expression': null,
																																		'internal_tag': 'VAL2',
																																		'timestamp_format': 'not_a_timestamp',
																																		'units': null
																																	},
																																	'relationships': {
																																		'attribute_set': {
																																			'data': {
																																				'id': newEmdAttributeSetId,
																																				'type': 'emd/attribute-sets'
																																			}
																																		},
																																		'tenant': {
																																			'data': {
																																				'id': tenantId,
																																				'type': 'settings/account/basics/tenants'
																																			}
																																		}
																																	},
																																	'type': 'emd/attribute-set-properties'
																																}
																															})
																															.end((error13, response13) => {
																																newEmdAttributeSetPropertyId4 = response13.body.data.id;
																																expect(response13).to.have.status(200);
																																if(error13) {
																																	done(error13);
																																	return;
																																}

																																agent
																																	.post('/emd/attribute-set-properties')
																																	.send({
																																		'data': {
																																			'attributes': {
																																				'name': 'VAL3',
																																				'description': 'New Data Set Property',
																																				'source': 'input',
																																				'datatype': 'date',
																																				'evaluation_expression': null,
																																				'internal_tag': 'VAL3',
																																				'timestamp_format': 'unix_epoch_with_milliseconds',
																																				'units': null
																																			},
																																			'relationships': {
																																				'attribute_set': {
																																					'data': {
																																						'id': newEmdAttributeSetId,
																																						'type': 'emd/attribute-sets'
																																					}
																																				},
																																				'tenant': {
																																					'data': {
																																						'id': tenantId,
																																						'type': 'settings/account/basics/tenants'
																																					}
																																				}
																																			},
																																			'type': 'emd/attribute-set-properties'
																																		}
																																	})
																																	.end((error14, response14) => {
																																		newEmdAttributeSetPropertyId5 = response14.body.data.id;
																																		expect(response14).to.have.status(200);
																																		if(error14) {
																																			done(error14);
																																			return;
																																		}

																																		agent
																																			.post('/emd/configurations')
																																			.send({
																																				'data': {
																																					'attributes': {
																																						'name': 'New Emd Upload Configuration',
																																						'description': 'New Emd Upload Configuration under Upload Configurations'
																																					},
																																					'relationships': {
																																						'folder': {
																																							'data': {
																																								'id': emdUploadConfigNodeId,
																																								'type': 'emd/folders'
																																							}
																																						},
																																						'tenant': {
																																							'data': {
																																								'id': tenantId,
																																								'type': 'settings/account/basics/tenants'
																																							}
																																						}
																																					},
																																					'type': 'emd/configurations'
																																				}
																																			})
																																			.end((error15, response15) => {
																																				expect(response15).to.have.status(200);
																																				newUploadConfigId = response15.body.data.id;
																																				if(error15) {
																																					done(error15);
																																					return;
																																				}

																																				agent
																																					.post('/emd/configuration-attribute-sets')
																																					.send({
																																						'data': {
																																							'attributes': {
																																								'evaluation_order': 1
																																							},
																																							'relationships': {
																																								'tenant_emd_configuration': {
																																									'data': {
																																										'id': newUploadConfigId,
																																										'type': 'emd/configurations'
																																									}
																																								},
																																								'tenant_attribute_set': {
																																									'data': {
																																										'id': newEmdAttributeSetId,
																																										'type': 'emd/attribute-sets'
																																									}
																																								},
																																								'tenant': {
																																									'data': {
																																										'id': tenantId,
																																										'type': 'settings/account/basics/tenants'
																																									}
																																								}
																																							},
																																							'type': 'emd/configuration-attribute-sets'
																																						}
																																					})
																																					.end((error16, response16) => {
																																						expect(response16).to.have.status(200);
																																						newEmdConfigDataSetId = response16.body.data.id;
																																						if(error16) {
																																							done(error16);
																																							return;
																																						}

																																						agent
																																							.patch(`/emd/configurations/${newUploadConfigId}`)
																																							.send({
																																								'data': {
																																									'attributes': {
																																										'name': 'New Emd Upload Configuration1',
																																										'description': 'New Emd Upload Configuration under Upload Configurations1',
																																										'attribute_set_metadata': [{
																																											'parameter_id': newEmdAttributeSetPropertyId1,
																																											'is_unique_id': true
																																										},
																																										{
																																											'parameter_id': newEmdAttributeSetPropertyId2,
																																											'is_unique_id': false
																																										}]
																																									},
																																									'relationships': {
																																										'folder': {
																																											'data': {
																																												'id': emdUploadConfigNodeId,
																																												'type': 'emd/folders'
																																											}
																																										},
																																										'tenant': {
																																											'data': {
																																												'id': tenantId,
																																												'type': 'settings/account/basics/tenants'
																																											}
																																										}
																																									},
																																									'id': newUploadConfigId,
																																									'type': 'emd/configurations'
																																								}
																																							})
																																							.end((error17, response17) => {
																																								expect(response17).to.have.status(200);
																																								done(error17);
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
									});
							});
					});
			});
	});

	after(function(done) {
		const relPath = __dirname.split('/test/features');
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		fs.unlink(`${relPath[0]}/generated/wo_format_${workOrderFormatId.replace(/-/g, '_')}_evaluator.js`, (err) =>{
			if(err) done(err);
		});

		agent
			.del(`/work-order/attribute-set-functions/${newAttributeSetObserverFunctionId}`)
			.end((err) => {
				if(err) {
					done(err);
					return;
				}

				agent
					.del(`/work-order/attribute-set-properties/${newAttributeSetPropertyId1}`)
					.end((err1) => {
						if(err) {
							done(err1);
							return;
						}

						agent
							.del(`/manufacturing/plants/${newPlantId}`)
							.end((err2) => {
								if(err2) {
									done(err2);
									return;
								}
								agent
									.del(`/emd/attribute-sets/${newEmdAttributeSetId}`)
									.end((errrrr, response) => {
										expect(response).to.have.status(204);
										if(errrrr) {
											done(errrrr);
											return;
										}

										agent
											.get('/session/logout')
											.end((err3) => {
												done(err3);
											});
									});
							});
					});
			});
	});

	it('Should return proper Node details', function(done) {
		agent
			.get('/configure/nodes?_=1567414700690')
			.set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36')
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data[6].attributes).to.have.property('name').eql('work-order');
				expect(response.body.data[6].attributes).to.have.property('node_type').eql('root-folder');
				expect(response.body.data[6].attributes).to.have.property('route').eql('work-order');
				nodeId = response.body.data[6].id;
				done(err);
			});
	});

// Format folder and Attribute folder will be fetched at random indexes so below test case uses if-else statement

	it('Should return existing tree for Root node', function(done) {
		agent
			.get(`/work-order/tree-nodes?node_id=${nodeId}&node_type=root-folder&_=1567504225130`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				if(response.body[0].text === 'work_order_feature.folder_names.attribute_sets.name') {
					expect(response.body[1]).to.have.property('children').eql(true);
					expect(response.body[1]).to.have.property('parent').eql(nodeId);
					// expect(response.body[1].data).to.have.property('type').eql('format-folder');
					expect(response.body[0]).to.have.property('children').eql(true);
					expect(response.body[0]).to.have.property('parent').eql(nodeId);
					expect(response.body[0].data).to.have.property('type').eql('attribute-folder');
					workOrderFormatNodeId = response.body[1].id;
					dataSetsNodeId = response.body[0].id;
				}
				else {
					expect(response.body[0]).to.have.property('children').eql(true);
					expect(response.body[0]).to.have.property('parent').eql(nodeId);
					// expect(response.body[0].data).to.have.property('type').eql('format-folder');
					expect(response.body[1]).to.have.property('children').eql(true);
					expect(response.body[1]).to.have.property('parent').eql(nodeId);
					expect(response.body[1].data).to.have.property('type').eql('attribute-folder');
					workOrderFormatNodeId = response.body[0].id;
					dataSetsNodeId = response.body[1].id;
				}
				done(err);
			});
	});

	it('Should return existing tree for Work Order Format node', function(done) {
		agent
			.get(`/work-order/tree-nodes?node_id=${workOrderFormatNodeId}&node_type=attribute-folder&_=1567504225130`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('should return Root Tenant folder details', function(done) {
		agent
			.get(`/work-order/folders/${nodeId}?_=1567504225125`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('work_order_feature.folder_names.root.name');
				expect(response.body.data.attributes).to.have.property('description').eql('work_order_feature.folder_names.root.description');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(null);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	it('should return Data Sets folder details', function(done) {
		agent
			.get(`/work-order/folders/${dataSetsNodeId}?_=1567414700692`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('work_order_feature.folder_names.attribute_sets.name');
				expect(response.body.data.attributes).to.have.property('description').eql('work_order_feature.folder_names.attribute_sets.description');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(nodeId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	it('should return Work Order Format folder details', function(done) {
		agent
			.get(`/work-order/folders/${workOrderFormatNodeId}?_=1567414700693`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('work_order_feature.folder_names.format.name');
				expect(response.body.data.attributes).to.have.property('description').eql('work_order_feature.folder_names.format.description');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(nodeId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a folder details', function(done) {
		agent
			.get(`/work-order/folders/${nodeId}?_=1567504225125&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should not be able to create a folder with empty Name under Data Sets', function(done) {
		agent
			.post('/work-order/folders')
			.send({
				'data': {
					'attributes': {
						'name': '',
						'description': 'New folder under Data Sets'
					},
					'relationships': {
						'parent': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'work-order/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'work-order/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to create a folder under Data Sets if all details are valid', function(done) {
		agent
			.post('/work-order/folders')
			.send({
				'data': {
					'attributes': {
						'name': 'New Demo folder',
						'description': 'New folder under Data Sets'
					},
					'relationships': {
						'parent': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'work-order/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'work-order/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newFolderId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw an error if we try to update folder details providing null or empty string as Name', function(done) {
		agent
			.patch(`/work-order/folders/${newFolderId}`)
			.send({
				'data': {
					'attributes': {
						'name': '',
						'description': 'New folder under Data Sets'
					},
					'relationships': {
						'parent': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'work-order/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newFolderId,
					'type': 'work-order/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to update folder details if all required details are filled', function(done) {
		agent
			.patch(`/work-order/folders/${newFolderId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'Updated New folder',
						'description': 'New folder under Data Sets'
					},
					'relationships': {
						'parent': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'work-order/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newFolderId,
					'type': 'work-order/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing folder', function(done) {
		agent
			.del(`/work-order/folders/44056e3f-a529-476b-8c03-cd21324b6e97`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete existing folder', function(done) {
		agent
			.del(`/work-order/folders/${newFolderId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should not be able to add new Attribute set if Name is null or empty string', function(done) {
		agent
			.post('/work-order/attribute-sets')
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': 'New Attribute set under Data Sets'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'work-order/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'work-order/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Attribute set if required fields are filled', function(done) {
		agent
			.post('/work-order/attribute-sets')
			.send({
				'data': {
					'attributes': {
						'name': 'New Attribute Set',
						'description': 'New Attribute set under Data Sets'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'work-order/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'work-order/attribute-sets'
				}
			})
			.end((err, response) => {
				newAttributeSetId = response.body.data.id;
				expect(response).to.have.status(200);

				// if(err) {
					done(err);
				// 	return;
				// }

				// agent
				// 	.post('/work-order/attribute-sets')
				// 	.send({
				// 		'data': {
				// 			'attributes': {
				// 				'name': 'New Attribute Set 1',
				// 				'description': 'New Attribute set under Data Sets 1'
				// 			},
				// 			'relationships': {
				// 				'folder': {
				// 					'data': {
				// 						'id': dataSetsNodeId,
				// 						'type': 'work-order/folders'
				// 					}
				// 				},
				// 				'tenant': {
				// 					'data': {
				// 						'id': tenantId,
				// 						'type': 'settings/account/basics/tenants'
				// 					}
				// 				}
				// 			},
				// 			'type': 'work-order/attribute-sets'
				// 		}
				// 	})
				// 	.end((err1, response1) => {
				// 		newAttributeSetId1 = response1.body.data.id;
				// 		done(err1);
				// 	});
			});
	});

	it('should throw an error if we try to get details of a non existing attribute set', function(done) {
		agent
			.get('/work-order/attribute-sets/44056e3f-a529-476b-8c03-cd21324b6e97?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a attribute set details', function(done) {
		agent
			.get(`/work-order/attribute-sets/${newAttributeSetId}?_=1567147599011&include=tpqsh`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added attribute set', function(done) {
		agent
			.get(`/work-order/attribute-sets/${newAttributeSetId}?_=1567147599011`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('New Attribute Set');
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('tenant_folder_id').eql(dataSetsNodeId);
				expect(response.body.data).to.have.property('id').eql(newAttributeSetId);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a non existing attribute set', function(done) {
		agent
			.patch('/work-order/attribute-sets/44056e3f-a529-476b-8c03-cd21324b6e97')
			.send({
				'data': {
					'attributes': {
						'name': 'Attribute Set',
						'description': 'New Attribute set under Data Sets'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'work-order/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': '44056e3f-a529-476b-8c03-cd21324b6e97',
					'type': 'work-order/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a attribute set by giving null or empty string as Name', function(done) {
		agent
			.patch(`/work-order/attribute-sets/${newAttributeSetId}`)
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': 'New Attribute set under Data Sets'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'work-order/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newAttributeSetId,
					'type': 'work-order/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to update attribute set if all reqired fields are filled', function(done) {
		agent
			.patch(`/work-order/attribute-sets/${newAttributeSetId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'Attribute Set',
						'description': 'New Attribute set under Data Sets'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'work-order/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newAttributeSetId,
					'type': 'work-order/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should not be able to add new Data Set Property if Name is null or empty string', function(done) {
		agent
			.post('/work-order/attribute-set-properties')
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': 'New Data Set Property',
						'source': 'static',
						'datatype': 'number',
						'evaluation_expression': null,
						'internal_tag': 'new_data_set_property',
						'timestamp_format': 'not_a_timestamp',
						'units': null
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'work-order/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'work-order/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Data Set Property if all required details are filled', function(done) {
		agent
			.post('/work-order/attribute-set-properties')
			.send({
				'data': {
					'attributes': {
						'name': 'New Data Set Property',
						'description': 'New Data Set Property',
						'source': 'static',
						'datatype': 'number',
						'evaluation_expression': null,
						'internal_tag': 'new_data_set_property',
						'timestamp_format': 'not_a_timestamp',
						'units': null
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'work-order/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'work-order/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newAttributeSetPropertyId = response.body.data.id;
				done(err);
			});
	});

	it('should throw an error if we try to get details of a non existing attribute set property', function(done) {
		agent
			.get('/work-order/attribute-set-properties/44056e3f-a529-476b-8c03-cd21324b6e97?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a attribute set details', function(done) {
		agent
			.get(`/work-order/attribute-set-properties/${newAttributeSetPropertyId}?_=1567149414732&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added attribute set property', function(done) {
		agent
			.get(`/work-order/attribute-set-properties/${newAttributeSetPropertyId}?_=1567149414732`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('New Data Set Property');
				expect(response.body.data.attributes).to.have.property('source').eql('static');
				expect(response.body.data.attributes).to.have.property('datatype').eql('number');
				expect(response.body.data.attributes).to.have.property('evaluation_expression').eql(null);
				expect(response.body.data.attributes).to.have.property('internal_tag').eql('new_data_set_property');
				expect(response.body.data.attributes).to.have.property('units').eql(null);
				expect(response.body.data.attributes).to.have.property('timestamp_format').eql('not_a_timestamp');
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('attribute_set_id').eql(newAttributeSetId);
				expect(response.body.data).to.have.property('id').eql(newAttributeSetPropertyId);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a non existing Attribute Set Property', function(done) {
		agent
			.patch('/work-order/attribute-set-properties/44056e3f-a529-476b-8c03-cd21324b6e97')
			.send({
				'data': {
					'attributes': {
						'name': 'New Data Set Property1',
						'description': 'New Data Set Property1',
						'source': 'input',
						'datatype': 'object',
						'evaluation_expression': null,
						'internal_tag': 'new_data_set_property1',
						'timestamp_format': 'not_a_timestamp',
						'units': null
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'work-order/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': '44056e3f-a529-476b-8c03-cd21324b6e97',
					'type': 'work-order/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a Attribute Set Property by giving Name field as null or empty string', function(done) {
		agent
			.patch(`/work-order/attribute-set-properties/${newAttributeSetPropertyId}`)
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': 'New Data Set Property1',
						'source': 'input',
						'datatype': 'object',
						'evaluation_expression': null,
						'internal_tag': 'new_data_set_property1',
						'timestamp_format': 'not_a_timestamp',
						'units': null
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'work-order/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newAttributeSetPropertyId,
					'type': 'work-order/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to edit a Attribute Set Property if all required fields are filled', function(done) {
		agent
			.patch(`/work-order/attribute-set-properties/${newAttributeSetPropertyId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'Id',
						'description': 'New Data Set Property1',
						'source': 'input',
						'datatype': 'string',
						'evaluation_expression': null,
						'internal_tag': 'ID',
						'timestamp_format': 'not_a_timestamp',
						'units': null
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'work-order/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newAttributeSetPropertyId,
					'type': 'work-order/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				if(err) {
					done(err);
					return;
				}

				agent
					.post('/work-order/attribute-set-properties')
					.send({
						'data': {
							'attributes': {
								'name': 'Name',
								'description': 'New Data Set Property',
								'source': 'input',
								'datatype': 'string',
								'evaluation_expression': null,
								'internal_tag': 'NAME',
								'timestamp_format': 'not_a_timestamp',
								'units': null
							},
							'relationships': {
								'attribute_set': {
									'data': {
										'id': newAttributeSetId,
										'type': 'work-order/attribute-sets'
									}
								},
								'tenant': {
									'data': {
										'id': tenantId,
										'type': 'settings/account/basics/tenants'
									}
								}
							},
							'type': 'work-order/attribute-set-properties'
						}
					})
					.end((err1, response1) => {
						newAttributeSetPropertyId1 = response1.body.data.id;
						done(err1);
					});
			});
	});

	it('Should not be able to add new Data Set function if Name is null or empty string', function(done) {
		agent
			.post('/work-order/attribute-set-functions')
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': 'New Data Set function',
						'code': null,
						'type': 'pre'
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'work-order/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'work-order/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Data Set Function if all required details are filled', function(done) {
		agent
			.post('/work-order/attribute-set-functions')
			.send({
				'data': {
					'attributes': {
						'name': 'New Data Set Function',
						'description': 'New Data Set Function',
						'code': null,
						'type': 'pre'
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'work-order/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'work-order/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newAttributeSetFunctionId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw an error if we try to get details of all availible attribute sets', function(done) {
		agent
			.get('/work-order/attribute-sets?_=1567147599011&include=trlso')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to get details of all availible attribute sets', function(done) {
		agent
			.get('/work-order/attribute-sets')
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('should throw an error if we try to get details of a non existing attribute set function', function(done) {
		agent
			.get('/work-order/attribute-set-functions/44056e3f-a529-476b-8c03-cd21324b6e97?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a attribute set details', function(done) {
		agent
			.get(`/work-order/attribute-set-functions/${newAttributeSetFunctionId}?_=1567147599011&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added attribute set function', function(done) {
		agent
			.get(`/work-order/attribute-set-functions/${newAttributeSetFunctionId}?_=1567147599011`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('New Data Set Function');
				expect(response.body.data.attributes).to.have.property('code').eql(null);
				expect(response.body.data.attributes).to.have.property('type').eql('pre');
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('attribute_set_id').eql(newAttributeSetId);
				expect(response.body.data).to.have.property('id').eql(newAttributeSetFunctionId);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a non existing Attribute Set Function', function(done) {
		agent
			.patch('/work-order/attribute-set-functions/44056e3f-a529-476b-8c03-cd21324b6e97')
			.send({
				'data': {
					'attributes': {
						'name': 'New Data Set Function1',
						'description': 'New Data Set Function1',
						'code': null,
						'type': 'pre'
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'work-order/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'work-order/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a Attribute Set Function by giving Name field as null or empty string', function(done) {
		agent
			.patch(`/work-order/attribute-set-functions/${newAttributeSetFunctionId}`)
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': 'New Data Set Function1',
						'code': null,
						'type': 'pre'
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'work-order/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newAttributeSetFunctionId,
					'type': 'work-order/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to edit a Attribute Set Functions if all required fields are filled', function(done) {
		agent
			.patch(`/work-order/attribute-set-functions/${newAttributeSetFunctionId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Data Set Function1',
						'description': 'New Data Set Function1',
						'code': null,
						'type': 'pre'
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'work-order/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newAttributeSetFunctionId,
					'type': 'work-order/attribute-set-function'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to add new Data Set Observer Function', function(done) {
		agent
			.post('/work-order/attribute-set-functions')
			.send({
				'data': {
					'attributes': {
						'name': 'New Data Set Function',
						'description': 'New Data Set Function',
						'code': null,
						'type': 'observer'
					},
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'work-order/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'work-order/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newAttributeSetObserverFunctionId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw an error if we try to add non existing Data Set Property to Observer Function', function(done) {
		agent
			.post('/work-order/attribute-set-function-observed-properties')
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'work-order/attribute-sets'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': '44056e3f-a529-476b-8c03-cd21324b6e97',
								'type': 'work-order/attribute-set-properties'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': newAttributeSetObserverFunctionId,
								'type': 'work-order/attribute-set-properties'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'work-order/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to add Data Set Property to a non existing Observer Function', function(done) {
		agent
			.post('/work-order/attribute-set-function-observed-properties')
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'work-order/attribute-sets'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': newAttributeSetPropertyId,
								'type': 'work-order/attribute-set-properties'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': '44056e3f-a529-476b-8c03-cd21324b6e97',
								'type': 'work-order/attribute-set-properties'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'work-order/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Data Set Property to Observer Function', function(done) {
		agent
			.post('/work-order/attribute-set-function-observed-properties')
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'work-order/attribute-sets'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': newAttributeSetPropertyId1,
								'type': 'work-order/attribute-set-properties'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': newAttributeSetObserverFunctionId,
								'type': 'work-order/attribute-set-properties'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'work-order/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newAttributeSetFunctionObservedPropertyId = response.body.data.id;
				done(err);
			});
	});

	it('should throw an error if we try to get details of a non existing Data Set Function Observed Property', function(done) {
		agent
			.get('/work-order/attribute-set-function-observed-properties/44056e3f-a529-476b-8c03-cd21324b6e97?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Data Set Function Observed Property details', function(done) {
		agent
			.get(`/work-order/attribute-set-function-observed-properties/${newAttributeSetFunctionObservedPropertyId}?_=1571304871241&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to get details of added Data Set Function Observed Property', function(done) {
		agent
			.get(`/work-order/attribute-set-function-observed-properties/${newAttributeSetFunctionObservedPropertyId}?_=1571304871241`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('attribute_set_function_id').eql(newAttributeSetObserverFunctionId);
				expect(response.body.data.attributes).to.have.property('attribute_set_property_id').eql(newAttributeSetPropertyId1);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('attribute_set_id').eql(newAttributeSetId);
				done(err);
			});
	});

	it('Should not be able to add a new Work Order Format if Name field is empty string', function(done) {
		agent
			.post('/work-order/work-order-formats')
			.send({
				'data': {
					'attributes': {
						'name': '',
						'description': 'New work order format for test'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': workOrderFormatNodeId,
								'type': 'work-order/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'work-order/work-order-formats'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add a new Work Order Format', function(done) {
		agent
			.post('/work-order/work-order-formats')
			.send({
				'data': {
					'attributes': {
						'name': 'New Work Order Format',
						'description': 'New work order format for test'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': workOrderFormatNodeId,
								'type': 'work-order/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'work-order/work-order-formats'
				}
			})
			.end((err, response) => {
				workOrderFormatId = response.body.data.id;
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('should throw an error if we try to get details of a non existing Work Order Format', function(done) {
		agent
			.get('/work-order/work-order-formats/44056e3f-a529-476b-8c03-cd21324b6e97?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Work Order Format details', function(done) {
		agent
			.get(`/work-order/work-order-formats/${workOrderFormatId}?_=1571304871241&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to get details of added Work Order', function(done) {
		agent
			.get(`/work-order/work-order-formats/${workOrderFormatId}?_=1571304871241`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('New Work Order Format');
				expect(response.body.data.attributes).to.have.property('attribute_set_metadata').eql([]);
				expect(response.body.data.attributes).to.have.property('tenant_folder_id').eql(workOrderFormatNodeId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a non existing Work Order Format', function(done) {
		agent
			.patch('/work-order/work-order-formats/44056e3f-a529-476b-8c03-cd21324b6e97')
			.send({
				'data': {
					'attributes': {
						'name': '',
						'description': 'Edited work order format for test'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': workOrderFormatNodeId,
								'type': 'work-order/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': '44056e3f-a529-476b-8c03-cd21324b6e97',
					'type': 'work-order/work-order-formats'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should not be able to edit a Work Order Format if name field is left empty', function(done) {
		agent
			.patch(`/work-order/work-order-formats/${workOrderFormatId}`)
			.send({
				'data': {
					'attributes': {
						'name': '',
						'description': 'Edited work order format for test'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': workOrderFormatNodeId,
								'type': 'work-order/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': workOrderFormatId,
					'type': 'work-order/work-order-formats'
				}
			})
			.end((err, response) => {
				setTimeout(() => {
					expect(response).to.have.status(422);
					done(err);
				}, 40000);
			});
	});

	it('Should be able to edit a Work Order Format if all details are filled', function(done) {
		agent
			.patch(`/work-order/work-order-formats/${workOrderFormatId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'Edited Work Order Format',
						'description': 'Edited work order format for test'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': workOrderFormatNodeId,
								'type': 'work-order/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': workOrderFormatId,
					'type': 'work-order/work-order-formats'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to edit a Work Order Format if Attribute Set Metadata is provided empty', function(done) {
		agent
			.patch(`/work-order/work-order-formats/${workOrderFormatId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'Edited Work Order Format',
						'description': 'Edited work order format for test',
						'attribute_set_metadata': []
					},
					'relationships': {
						'folder': {
							'data': {
								'id': workOrderFormatNodeId,
								'type': 'work-order/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': workOrderFormatId,
					'type': 'work-order/work-order-formats'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to add non existing attribute set to the new Work Order Format', function(done) {
		agent
			.post('/work-order/format-attribute-sets')
			.send({
				'data': {
					'relationships': {
						'tenant_attribute_set': {
							'data': {
								'id': '44056e3f-a529-476b-8c03-cd21324b6e97',
								'type': 'work-order/attribute-sets'
							}
						},
						'work_order_format': {
							'data': {
								'id': workOrderFormatId,
								'type': 'work-order/work-order-formats'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'work-order/format-attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});
	it('Should throw an error if we try to add a attribute set to work order format without any relationships provided', function(done) {
		agent
			.post('/work-order/format-attribute-sets')
			.send({
				'data': {}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add created attribute set to the new Work Order Format', function(done) {
		agent
			.post('/work-order/format-attribute-sets')
			.send({
				'data': {
					'relationships': {
						'tenant_attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'work-order/attribute-sets'
							}
						},
						'work_order_format': {
							'data': {
								'id': workOrderFormatId,
								'type': 'work-order/work-order-formats'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'dummy': {
							'data': {}
						},
						'dummy1': {}
					},
					'type': 'work-order/format-attribute-sets'
				}
			})
			.end((err, response) => {
				formatAttributeSetId = response.body.data.id;
				setTimeout(() => {
					expect(response).to.have.status(200);
					done(err);
				}, 40000);
				// if(err) {
				//	done(err);
				// 	return;
				// }

				// agent
				// 	.post('/work-order/format-attribute-sets')
				// 	.send({
				// 		'data': {
				// 			'relationships': {
				// 				'tenant_attribute_set': {
				// 					'data': {
				// 						'id': newAttributeSetId1,
				// 						'type': 'work-order/attribute-sets'
				// 					}
				// 				},
				// 				'work_order_format': {
				// 					'data': {
				// 						'id': workOrderFormatId,
				// 						'type': 'work-order/work-order-formats'
				// 					}
				// 				},
				// 				'tenant': {
				// 					'data': {
				// 						'id': tenantId,
				// 						'type': 'settings/account/basics/tenants'
				// 					}
				// 				}
				// 			},
				// 			'type': 'work-order/format-attribute-sets'
				// 		}
				// 	})
				// 	.end((err1) => {
				// 		done(err1);
				// 	});
			});
	});

	it('Should be able to get tree for work order app', function(done) {
		agent
			.get('/work-order/node?id=%23&_=1575883734060')
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should not be able to upload excel sheet if none of the Attribute Set parameters are made Unique', function(done) {
		agent
			.post(`/work-order/upload-work-order/${workOrderFormatId}`)
			.set('Content-Type', 'multipart/form-data')
			.field('relativePath', '')
			.field('name', 'avatar.xlsx')
			.field('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
			.attach('files[]', xlData, 'avatar')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add Attribute Set Metadata to a Work Order Format', function(done) {
		agent
			.patch(`/work-order/work-order-formats/${workOrderFormatId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'Edited Work Order Format',
						'description': 'Edited work order format for test',
						'attribute_set_metadata': [{
							'parameter_id': newAttributeSetPropertyId,
							'is_unique_id': true
						},
						{
							'parameter_id': newAttributeSetPropertyId1,
							'is_unique_id': false
						}]
					},
					'relationships': {
						'folder': {
							'data': {
								'id': workOrderFormatNodeId,
								'type': 'work-order/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': workOrderFormatId,
					'type': 'work-order/work-order-formats'
				}
			})
			.end((err, response) => {
				setTimeout(() => {
					expect(response).to.have.status(200);
					done(err);
				}, 5000);
			});
	});

	// Work Order Upload feature test cases

	it('Should throw an error if we try to upload excel sheet that do not contain Unique Parameter', function(done) {
		agent
			.post(`/work-order/upload-work-order/${workOrderFormatId}`)
			.set('Content-Type', 'multipart/form-data')
			.field('relativePath', '')
			.field('name', 'testexample.xls')
			.field('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
			.attach('files[]', invalidXlData, 'testexample')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to upload text file instead of excel sheet', function(done) {
		agent
			.post(`/work-order/upload-work-order/${workOrderFormatId}`)
			.set('Content-Type', 'multipart/form-data; boundary=----WebKitFormBoundaryiekbkGNf2y4NuMCv')
			.field('relativePath', '')
			.field('name', 'test.txt')
			.field('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
			.attach('files[]', textData, 'test')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to upload excel sheet', function(done) {
		agent
			.post(`/work-order/upload-work-order/${workOrderFormatId}`)
			.set('Content-Type', 'multipart/form-data')
			.field('relativePath', '')
			.field('name', 'avatar.xlsx')
			.field('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
			.attach('files[]', xlData, 'avatar')
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to commit the uploaded excel sheet data', function(done) {
		agent
			.post(`/work-order/approve-upload/${workOrderFormatId}`)
			.send({
				'attributes': ['ID', 'NAME', 'status'],
				'rows': [
					{
						'ID': '56',
						'NAME': 'ashish s',
						'notes': [],
						'status': 'NEW'
					},
					{
						'ID': '58',
						'NAME': 'ash s',
						'notes': [],
						'status': 'NEW'
					},
					{
						'ID': '57',
						'NAME': 'ashish new',
						'notes': [],
						'status': 'REJECTED'
					}
				]
			})
			.end((err, response) => {
				setTimeout(() => {
					expect(response).to.have.status(204);
					done(err);
				}, 25000);
			});
	});

	it('Should be able to start work order after adding a line to the work order', function(done) {
		agent
			.post('/work-order/change-work-order-status/56')
			.type('form')
			.send({
				'newStatus': 'in_progress',
				'workOrderId': '56',
				'lineId': newLineId,
				'statusUpdateTime': moment().format(),
				'lineConfig': {
					'lineName': 'New Line',
					'constituents': []
				}
			})
			.end((err, response) => {
				// console.error('response error', response);
				expect(response).to.have.status(200);
				expect(response.body).to.have.property('msg').eql('update Success');
				// if(err) {
					done(err);
				// 	return;
				// }

			});
	});

	it('Should return empty array if we try to get all supervisor list availible for added line which does not have any upload config added', function(done) {
		agent
			.get(`/work-order/supervisor-list/${newLineId}`)
			.end((err, response) =>{
				expect(response.body).to.be.eql([]);
				console.error('response body', response.body);
				done(err);
			});
	});

	it('Should return empty array if we try to get all operator list availible for added machine which does not have any upload config added', function(done) {
		agent
			.get(`/work-order/operator-list/${newMachineId}`)
			.end((err, response) =>{
				expect(response.body).to.be.eql([]);
				console.error('response body', response.body);
				if(err) {
					done(err);
					return;
				}

				agent
					.patch(`/manufacturing/plant-unit-lines/${newLineId}`)
					.send({
						'data': {
							'attributes': {
								'name': 'New Line',
								'description': 'New Line under Newly added Plant Unit',
								'attribute_set_metadata': [],
								'supervisor_list_filters': []
							},
							'relationships': {
								'tenant_plant_unit': {
									'data': {
										'id': newPlantUnitId,
										'type': 'manufacturing/plant-units'
									}
								},
								'tenant': {
									'data': {
										'id': tenantId,
										'type': 'settings/account/basics/tenants'
									}
								},
								'supervisor_list': {
									'data': {
										'id': newUploadConfigId,
										'type': 'emd/configurations'
									}
								}
							},
							'id': newLineId,
							'type': 'manufacturing/plant-unit-lines'
						}
					})
					// eslint-disable-next-line max-nested-callbacks
					.end((error17, response17) => {
						expect(response17).to.have.status(200);
						if(error17) {
							done(error17);
							return;
						}

						agent
							.patch(`/manufacturing/plant-unit-machines/${newMachineId}`)
							.send({
								'data': {
									'attributes': {
										'name': 'New Machine',
										'description': 'New Machine under Newly added Plant Unit',
										'downtime_list_filters': [],
										'operator_list_filters': [],
										'type': 'machine',
										'attribute_set_metadata': []
									},
									'relationships': {
										'tenant_plant_unit': {
											'data': {
												'id': newPlantUnitId,
												'type': 'manufacturing/plant-units'
											}
										},
										'tenant': {
											'data': {
												'id': tenantId,
												'type': 'settings/account/basics/tenants'
											}
										},
										'operator_list': {
											'data': {
												'id': newUploadConfigId,
												'type': 'emd/configurations'
											}
										}
									},
									'id': newMachineId,
									'type': 'manufacturing/plant-unit-machines'
								}
							})
							// eslint-disable-next-line max-nested-callbacks
							.end((error18, response18) => {
								expect(response18).to.have.status(200);
								// if(err8) {
									done(error18);
									return;
								// }
							});
					});
			});
	});

	it('Should return empty array if we try to get all supervisor list availible for added line when there is no master data uploaded for that Emd upload config', function(done) {
		agent
			.get(`/work-order/supervisor-list/${newLineId}`)
			.end((err, response) =>{
				expect(response.body).to.be.eql([]);
				console.error('response body', response.body);
				done(err);
			});
	});


	it('Should return empty array if we try to get all operator list availible for added machine when there is no master data uploaded for that Emd upload config', function(done) {
		agent
			.get(`/work-order/operator-list/${newMachineId}`)
			.end((err, response) =>{
				expect(response.body).to.be.eql([]);
				console.error('response body', response.body);
				if(err) {
					done(err);
					return;
				}

				agent
					.post(`/emd/uploadData/${newUploadConfigId}`)
					.set('Content-Type', 'multipart/form-data; boundary=----WebKitFormBoundaryiekbkGNf2y4NuMCv')
					.field('relativePath', '')
					.field('name', 'avatar.xlsx')
					.field('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
					.attach('emdFile', emdXlData, 'avatar')
					.end((error15, response15) => {
						expect(response15).to.have.status(200);
						if(error15) {
							done(error15);
							return;
						}

						agent
							.post(`/emd/commitData/${newUploadConfigId}`)
							.send([{
								'approved': true,
								'new': true,
								'showDiff': false,
								'uniqueIdParameter': 'NAME',
								'attributes': {
									'ROLE': 'supervisor',
									'NAME': 'Ashish',
									'VAL1': 70,
									'VAL2': true,
									'VAL3': '2019-12-20T06:41:45.942Z'
								},
								'tagTypeMap': {
									'ROLE': 'string',
									'NAME': 'string',
									'VAL1': 'number',
									'VAL2': 'boolean',
									'VAL3': 'date'
								},
								'id': newUploadConfigId
							}, {
								'approved': true,
								'new': true,
								'showDiff': false,
								'uniqueIdParameter': 'NAME',
								'attributes': {
									'ROLE': 'operator',
									'NAME': 'Ash',
									'VAL1': 70,
									'VAL2': true,
									'VAL3': '2019-12-20T06:41:45.942Z'
								},
								'tagTypeMap': {
									'ROLE': 'string',
									'NAME': 'string',
									'VAL1': 'number',
									'VAL2': 'boolean',
									'VAL3': 'date'
								},
								'id': newUploadConfigId
							}])
							// eslint-disable-next-line max-nested-callbacks
							.end((error16, response16) => {
								setTimeout(() => {
									expect(response16).to.have.status(200);
									done(err);
								}, 25000);
							});
					});
			});
	});

	it('Should return all supervisor list availible for added line', function(done) {
		agent
			.get(`/work-order/supervisor-list/${newLineId}`)
			.end((err, response) =>{
				console.error('response body', response.body);
				done(err);
			});
	});

	it('Should return all operator list availible for added machine', function(done) {
		agent
			.get(`/work-order/operator-list/${newMachineId}`)
			.end((err, response) =>{
				console.error('response body', response.body);
				if(err) {
					done(err);
					return;
				}

				agent
					.patch(`/manufacturing/plant-unit-lines/${newLineId}`)
					.send({
						'data': {
							'attributes': {
								'name': 'New Line',
								'description': 'New Line under Newly added Plant Unit',
								'attribute_set_metadata': [],
								'supervisor_list_filters': [{
									'parameter_id': newEmdAttributeSetPropertyId2,
									'comparison_operator': '=',
									'value': 'supervisor'
									},
									{
									'parameter_id': newEmdAttributeSetPropertyId3,
									'comparison_operator': '>',
									'value': '20'
									},
									{
									'parameter_id': newEmdAttributeSetPropertyId4,
									'comparison_operator': '=',
									'value': 'TRUE'
									},
									{
									'parameter_id': newEmdAttributeSetPropertyId5,
									'comparison_operator': '>',
									'value': '1576824105000'
									}
								]
							},
							'relationships': {
								'tenant_plant_unit': {
									'data': {
										'id': newPlantUnitId,
										'type': 'manufacturing/plant-units'
									}
								},
								'tenant': {
									'data': {
										'id': tenantId,
										'type': 'settings/account/basics/tenants'
									}
								},
								'supervisor_list': {
									'data': {
										'id': newUploadConfigId,
										'type': 'emd/configurations'
									}
								}
							},
							'id': newLineId,
							'type': 'manufacturing/plant-unit-lines'
						}
					})
					// eslint-disable-next-line max-nested-callbacks
					.end((error17, response17) => {
						expect(response17).to.have.status(200);
						if(error17) {
							done(error17);
							return;
						}

						agent
							.patch(`/manufacturing/plant-unit-machines/${newMachineId}`)
							.send({
								'data': {
									'attributes': {
										'name': 'New Machine',
										'description': 'New Machine under Newly added Plant Unit',
										'downtime_list_filters': [],
										'operator_list_filters': [{
											'parameter_id': newEmdAttributeSetPropertyId2,
											'comparison_operator': '=',
											'value': 'supervisor'
											},
											{
											'parameter_id': newEmdAttributeSetPropertyId3,
											'comparison_operator': '>',
											'value': '20'
											},
											{
											'parameter_id': newEmdAttributeSetPropertyId4,
											'comparison_operator': '=',
											'value': 'TRUE'
											},
											{
											'parameter_id': newEmdAttributeSetPropertyId5,
											'comparison_operator': '>',
											'value': '1576824105000'
											}
										],
										'type': 'machine',
										'attribute_set_metadata': []
									},
									'relationships': {
										'tenant_plant_unit': {
											'data': {
												'id': newPlantUnitId,
												'type': 'manufacturing/plant-units'
											}
										},
										'tenant': {
											'data': {
												'id': tenantId,
												'type': 'settings/account/basics/tenants'
											}
										},
										'operator_list': {
											'data': {
												'id': newUploadConfigId,
												'type': 'emd/configurations'
											}
										}
									},
									'id': newMachineId,
									'type': 'manufacturing/plant-unit-machines'
								}
							})
							// eslint-disable-next-line max-nested-callbacks
							.end((error18, response18) => {
								expect(response18).to.have.status(200);
								// if(err8) {
									done(error18);
									return;
								// }
							});
					});
			});
	});

	it('Should return all supervisor list availible for added line after relative supervisor filters are applied', function(done) {
		agent
			.get(`/work-order/supervisor-list/${newLineId}`)
			.end((err, response) =>{
				console.error('response body', response.body);
				done(err);
			});
	});

	it('Should return all operator list availible for added machine after relative operator filters are applied', function(done) {
		agent
			.get(`/work-order/operator-list/${newMachineId}`)
			.end((err, response) =>{
				console.error('response body', response.body);
				done(err);
			});
	});

	it('Should throw an error if we try to get details of non existing work order format', function(done) {
		agent
			.get('/work-order/format-work-orders/0fa7672e-977c-4311-8e2e-3f2b1954861b?_=1573809229918')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to get details of uploaded work order format', function(done) {
		agent
			.get(`/work-order/format-work-orders/${workOrderFormatId}?_=1567062554849`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.rows[0].data[0]).to.eql('ashish s');
				expect(response.body.rows[0]).to.have.property('displayStatus').to.eql('not started');
				expect(response.body.rows[0]).to.have.property('lineConfig').to.eql(null);
				expect(response.body.rows[0]).to.have.property('status').to.eql('not_started');

				// expect(response.body.rows[1].data[0]).to.eql('ash');
				// expect(response.body.rows[1]).to.have.property('displayStatus').to.eql('not started');
				// expect(response.body.rows[1]).to.have.property('lineConfig').to.eql(null);
				// expect(response.body.rows[1]).to.have.property('status').to.eql('not_started');

				// expect(response.body.rows[2].data[0]).to.eql('ash s');
				// expect(response.body.rows[2]).to.have.property('displayStatus').to.eql('not started');
				// expect(response.body.rows[2]).to.have.property('lineConfig').to.eql(null);
				// expect(response.body.rows[2]).to.have.property('status').to.eql('not_started');

				// workOrderId = response.body.rows[0].work_order_id;
				done(err);
			});
	});

	it('Should be able to update the values if we change any parameter values in excel sheet and upload', function(done) {
		agent
			.post(`/work-order/upload-work-order/${workOrderFormatId}`)
			.set('Content-Type', 'multipart/form-data; boundary=----WebKitFormBoundaryiekbkGNf2y4NuMCv')
			.field('relativePath', '')
			.field('name', 'avatar.xlsx')
			.field('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
			.attach('files[]', updatedXlData, 'avatar')
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.attributes[0]).to.eql('ID');
				expect(response.body.attributes[1]).to.eql('NAME');
				expect(response.body.attributes[2]).to.eql('status');

				expect(response.body.rows[0]).to.have.property('ID').eql('56');
				expect(response.body.rows[0]).to.have.property('NAME').eql('ashish s');
				expect(response.body.rows[0]).to.have.property('status').eql('NO CHANGE');
				expect(response.body.rows[1]).to.have.property('ID').eql('58');
				expect(response.body.rows[1]).to.have.property('NAME').eql('ash');
				expect(response.body.rows[1]).to.have.property('status').eql('UPDATED');
				expect(response.body.rows[2]).to.have.property('ID').eql('57');
				expect(response.body.rows[2]).to.have.property('NAME').eql('ashis');
				expect(response.body.rows[2]).to.have.property('status').eql('NEW');

				expect(response.body.rows[1].notes[0]).eql('NAME has changed from "ash s" to "ash"');

				done(err);
			});
	});

	it('Should be able to commit the uploaded excel sheet when one or more values are updated', function(done) {
		agent
			.post(`/work-order/approve-upload/${workOrderFormatId}`)
			.send({
				'attributes': ['ID', 'NAME', 'status'],
				'rows': [
					{
						'ID': '56',
						'NAME': 'ashish s',
						'notes': [],
						'status': 'NEW'
					},
					{
						'ID': '58',
						'NAME': 'ash',
						'notes': [],
						'status': 'UPDATED'
					},
					{
						'ID': '57',
						'NAME': 'ashish new',
						'notes': [],
						'status': 'NEW'
					}
				]
			})
			.end((err, response) => {
				expect(response).to.have.status(204);
				if(err) {
					done(err);
					return;
				}

				agent
					.post(`/work-order/upload-work-order/${workOrderFormatId}`)
					.set('Content-Type', 'multipart/form-data')
					.field('relativePath', '')
					.field('name', 'avatar.xlsx')
					.field('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
					.attach('files[]', rejectedXlData, 'avatar')
					.end((err1, response1) => {
						expect(response1).to.have.status(200);
						done(err1);
					});
			});
	});

	it('Should be able to handle if there is only one value in excel sheet which is rejected when we try to commit the uploaded excel sheet', function(done) {
		agent
			.post(`/work-order/approve-upload/${workOrderFormatId}`)
			.send({
				'attributes': ['ID', 'NAME', 'status'],
				'rows': [
					{
						'ID': '90',
						'NAME': 'ashish eronkan',
						'notes': [],
						'status': 'REJECTED'
					}
				]
			})
			.end((err, response) => {
				expect(response).to.have.status(204);
				if(err) {
					done(err);
					return;
				}

				agent
					.post(`/work-order/upload-work-order/${workOrderFormatId}`)
					.set('Content-Type', 'multipart/form-data')
					.field('relativePath', '')
					.field('name', 'avatar.xlsx')
					.field('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
					.attach('files[]', xlData, 'avatar')
					.end((err1, response1) => {
						expect(response1).to.have.status(200);
						if(err1) {
							done(err1);
							return;
						}

						agent
							.patch(`/work-order/work-order-formats/${workOrderFormatId}`)
							.send({
								'data': {
									'attributes': {
										'name': 'Edited Work Order Format',
										'description': 'Edited work order format for test',
										'attribute_set_metadata': [{
											'parameter_id': newAttributeSetPropertyId,
											'is_unique_id': false
										}]
									},
									'relationships': {
										'folder': {
											'data': {
												'id': workOrderFormatNodeId,
												'type': 'work-order/folders'
											}
										},
										'tenant': {
											'data': {
												'id': tenantId,
												'type': 'settings/account/basics/tenants'
											}
										}
									},
									'id': workOrderFormatId,
									'type': 'work-order/work-order-formats'
								}
							})
							.end((err2, response2) => {
								expect(response2).to.have.status(200);
								done(err2);
							});
					});
			});
	});

	it('Should throw an error if there is no unique property when we try to commit the uploaded excel sheet', function(done) {
		agent
			.post(`/work-order/approve-upload/${workOrderFormatId}`)
			.send({
				'attributes': ['ID', 'NAME', 'status'],
				'rows': [
					{
						'ID': '56',
						'NAME': 'ashish s',
						'notes': [],
						'status': 'NEW'
					},
					{
						'ID': '58',
						'NAME': 'ash s',
						'notes': [],
						'status': 'NEW'
					},
					{
						'ID': '57',
						'NAME': 'ashish new',
						'notes': [],
						'status': 'NEW'
					}
				]
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				if(err) {
					done(err);
					return;
				}

				agent
					.patch(`/work-order/work-order-formats/${workOrderFormatId}`)
					.send({
						'data': {
							'attributes': {
								'name': 'Edited Work Order Format',
								'description': 'Edited work order format for test',
								'attribute_set_metadata': [{
									'parameter_id': newAttributeSetPropertyId,
									'is_unique_id': true
								},
								{
									'parameter_id': newAttributeSetPropertyId1,
									'is_unique_id': false
								}]
							},
							'relationships': {
								'folder': {
									'data': {
										'id': workOrderFormatNodeId,
										'type': 'work-order/folders'
									}
								},
								'tenant': {
									'data': {
										'id': tenantId,
										'type': 'settings/account/basics/tenants'
									}
								}
							},
							'id': workOrderFormatId,
							'type': 'work-order/work-order-formats'
						}
					})
					.end((err1, response1) => {
						expect(response1).to.have.status(200);
						if(err1) {
							done(err1);
							return;
						}

						agent
							.post(`/work-order/upload-work-order/${workOrderFormatId}`)
							.set('Content-Type', 'multipart/form-data')
							.field('relativePath', '')
							.field('name', 'avatar.xlsx')
							.field('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
							.attach('files[]', xlData, 'avatar')
							.end((err2, response2) => {
								expect(response2).to.have.status(200);
								if(err2) {
									done(err2);
									return;
								}

								agent
									.del(`/work-order/attribute-set-properties/${newAttributeSetPropertyId}`)
									.end((err3, response3) => {
										expect(response3).to.have.status(204);
										done(err3);
									});
							});
					});
			});
	});

	it('Should throw an error if we try to commit the uploaded excel sheet after deleting unique property from the Attribute set', function(done) {
		agent
			.post(`/work-order/approve-upload/${workOrderFormatId}`)
			.send({
				'attributes': ['ID', 'NAME', 'status'],
				'rows': [
					{
						'ID': '56',
						'NAME': 'ashish s',
						'notes': [],
						'status': 'NEW'
					},
					{
						'ID': '58',
						'NAME': 'ash s',
						'notes': [],
						'status': 'NEW'
					},
					{
						'ID': '57',
						'NAME': 'ashish new',
						'notes': [],
						'status': 'NEW'
					}
				]
			})
			.end((err, response) => {
				setTimeout(() => {
					expect(response).to.have.status(422);
					done(err);
				}, 25000);
			});
	});


	it('Should throw an error if we try to start non existing work order', function(done) {
		agent
			.post('/work-order/change-work-order-status/90083094718579')
			.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
			.field('newStatus', 'in_process')
			.field('workOrderId', '90083094718579')
			.field('lineId', newLineId)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});


	// it('Should throw an error if we provide values to a static parameter in excel sheet while uploading', function(done) {
	// 	agent
	// 		.post(`/work-order/upload-work-order/${workOrderFormatId}`)
	// 		.set('Content-Type', 'multipart/form-data; boundary=----WebKitFormBoundaryiekbkGNf2y4NuMCv')
	// 		.field('relativePath', '')
	// 		.field('name', 'avatar.xlsx')
	// 		.field('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
	// 		.attach('files[]', xlData, 'avatar')
	// 		.end((err, response) => {
	// 			expect(response).to.have.status(422);
	// 			done(err);
	// 		});
	// });

	it('should throw an error if we try to get details of a non existing Work Order Format Attribute Set', function(done) {
		agent
			.get('/work-order/format-attribute-sets/44056e3f-a529-476b-8c03-cd21324b6e97?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a  Work Order Format Attribute Set details', function(done) {
		agent
			.get(`/work-order/format-attribute-sets/${formatAttributeSetId}?_=1571304871241&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to get details of added Work Order Format Attribute set', function(done) {
		agent
			.get(`/work-order/format-attribute-sets/${formatAttributeSetId}?_=1571304871241`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				// expect(response.body.data.attributes).to.have.property('tenant_attribute_set_id').eql(newAttributeSetId);
				// expect(response.body.data.attributes).to.have.property('tenant_work_order_format_id').eql(workOrderFormatId);
				// expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	it('Should be able to edit evaluation order of added Work Order Format Attribute Set without providing any relationships', function(done) {
		agent
			.patch(`/work-order/format-attribute-sets/${formatAttributeSetId}`)
			.send({
				'data': {
					'attributes': {
						'evaluation_order': 2
					},
					'id': formatAttributeSetId,
					'type': 'work-order/format-attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to edit evaluation order of added Work Order Format Attribute Set', function(done) {
		agent
			.patch(`/work-order/format-attribute-sets/${formatAttributeSetId}`)
			.send({
				'data': {
					'attributes': {
						'evaluation_order': 2
					},
					'relationships': {
						'tenant_attribute_set': {
							'data': {
								'type': 'work-order/attribute-sets'
							}
						},
						'work_order_format': {},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': formatAttributeSetId,
					'type': 'work-order/format-attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Work Order Format Attribute Set', function(done) {
		agent
			.del('/work-order/format-attribute-sets/44056e3f-a529-476b-8c03-cd21324b6e97')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete added Work Order Format Attribute Set', function(done) {
		agent
			.del(`/work-order/format-attribute-sets/${formatAttributeSetId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Work Order Format', function(done) {
		agent
			.del('/work-order/work-order-formats/44056e3f-a529-476b-8c03-cd21324b6e97')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete created Work Order Format', function(done) {
		agent
			.del(`/work-order/work-order-formats/${workOrderFormatId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Attribute Set Function Observed Property', function(done) {
		agent
			.del('/work-order/attribute-set-function-observed-properties/44056e3f-a529-476b-8c03-cd21324b6e97')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete added Attribute Set Function Observed Property', function(done) {
		agent
			.del(`/work-order/attribute-set-function-observed-properties/${newAttributeSetFunctionObservedPropertyId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Attribute Set Function', function(done) {
		agent
			.del('/work-order/attribute-set-functions/44056e3f-a529-476b-8c03-cd21324b6e97')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete created Attribute Set Function', function(done) {
		agent
			.del(`/work-order/attribute-set-functions/${newAttributeSetFunctionId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Attribute Set Property', function(done) {
		agent
			.del('/work-order/attribute-set-properties/44056e3f-a529-476b-8c03-cd21324b6e97')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete created Attribute Set Property', function(done) {
		agent
			.del(`/work-order/attribute-set-properties/${newAttributeSetPropertyId1}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Attribute set', function(done) {
		agent
			.del('/work-order/attribute-sets/44056e3f-a529-476b-8c03-cd21324b6e97')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete created Attribute Set', function(done) {
		agent
			.del(`/work-order/attribute-sets/${newAttributeSetId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

});
