'use strict';

const chai = require('chai'); // eslint-disable-line node/no-unpublished-require
const chaiHttp = require('chai-http'); // eslint-disable-line node/no-unpublished-require

chai.use(chaiHttp);


describe('Operator Form Feature Test Cases', function() {
	const agent = chai.request.agent('http://localhost:9100');
	const expect = chai.expect;
	let tenantId;
	let nodeId;
	let dataSetsNodeId, operatorFormNodeId;
	let newFolderId2;
	let newAttributeSetFunctionId, newAttributeSetFunctionObservedPropertyId, newAttributeSetId, newAttributeSetId1, newAttributeSetObserverFunctionId, newAttributeSetPropertyId;
	let newOperatorFormDataSetId, newOperatorFormId;
	let newExecutorCodeId, newInputTemplateCodeId, newRequestFormatterCodeId, newResponseFormatterCodeId, newResultTemplateCodeId;
	// let newIoTGatewayId, newLineDataSetId, newLineId, newLineId1, newLineId2, newOperatorFormDataSetId, newOperatorFormId, newMachineId1, newOperatorFormId, newPlantUnitId, newStationDataSetId, newStationId;
	// let newLineConstituentId, newLineConstituentId1;

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
						done(error);
					});
			});
	});

	after(function(done) {
		agent
			.del(`/operator-form/attribute-sets/${newAttributeSetId1}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				if(err) {
					done(err);
					return;
				}

				agent
					.get('/session/logout')
					.end((err1) => {
						done(err1);
					});
			});
	});

	it('Should return proper Node details', function(done) {
		agent
			.get('/configure/nodes?_=1566818693175')
			.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36')
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data[4].attributes).to.have.property('name').eql('OperatorForm');
				expect(response.body.data[4].attributes).to.have.property('node_type').eql('root-folder');
				expect(response.body.data[4].attributes).to.have.property('route').eql('operator-form');
				nodeId = response.body.data[4].id;
				done(err);
			});
	});

	it('Should return empty array if we try to get details of a tree of invalid type', function(done) {
		agent
			.get(`/operator-form/config-tree-nodes?node_id=${nodeId}&node_type=invalid&_=1571466069310`)
			.end((err, response) => {
				expect(response.body).to.be.eql([]);
				done(err);
			});
	});

	it('Should return existing tree for Root node', function(done) {
		agent
			.get(`/operator-form/config-tree-nodes?node_id=${nodeId}&node_type=root-folder&_=1566990208766`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				if(response.body[0].data.type === 'attribute-folder') {
					expect(response.body[0]).to.have.property('children').eql(true);
					expect(response.body[0]).to.have.property('parent').eql(nodeId);
					expect(response.body[0].data).to.have.property('type').eql('attribute-folder');
					expect(response.body[1]).to.have.property('children').eql(true);
					expect(response.body[1]).to.have.property('parent').eql(nodeId);
					expect(response.body[1].data).to.have.property('type').eql('operator-form-folder');
					operatorFormNodeId = response.body[1].id;
					dataSetsNodeId = response.body[0].id;
				}
				else {
					expect(response.body[1]).to.have.property('children').eql(true);
					expect(response.body[1]).to.have.property('parent').eql(nodeId);
					expect(response.body[1].data).to.have.property('type').eql('attribute-folder');
					expect(response.body[0]).to.have.property('children').eql(true);
					expect(response.body[0]).to.have.property('parent').eql(nodeId);
					expect(response.body[0].data).to.have.property('type').eql('operator-form-folder');
					operatorFormNodeId = response.body[0].id;
					dataSetsNodeId = response.body[1].id;
				}
				done(err);
			});
	});

	it('Should return existing tree for Data Sets Node', function(done) {
		agent
			.get(`/operator-form/config-tree-nodes?node_id=${dataSetsNodeId}&node_type=attribute-folder&_=1571466069310`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should return existing tree for Operator Forms Node', function(done) {
		agent
			.get(`/operator-form/config-tree-nodes?node_id=${operatorFormNodeId}&node_type=operator-form-folder&_=1571466069310`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('should return Root Tenant folder details', function(done) {
		agent
			.get(`/operator-form/folders/${nodeId}?_=1566890475910`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('operator_form_feature.folder_names.root.name');
				expect(response.body.data.attributes).to.have.property('description').eql('operator_form_feature.folder_names.root.description');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(null);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	it('should return Data Sets folder details', function(done) {
		agent
			.get(`/operator-form/folders/${dataSetsNodeId}?_=1566890475910`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('operator_form_feature.folder_names.attribute_sets.name');
				expect(response.body.data.attributes).to.have.property('description').eql('operator_form_feature.folder_names.attribute_sets.description');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(nodeId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	it('should return Operator Form folder details', function(done) {
		agent
			.get(`/operator-form/folders/${operatorFormNodeId}?_=1566890475910`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('operator_form_feature.folder_names.operator_forms.name');
				expect(response.body.data.attributes).to.have.property('description').eql('operator_form_feature.folder_names.operator_forms.description');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(nodeId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a folder details', function(done) {
		agent
			.get(`/operator-form/folders/${nodeId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should not be able to create a folder with empty Name under Data Sets', function(done) {
		agent
			.post('/operator-form/folders')
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
								'type': 'operator-form/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'operator-form/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to create a folder under Data Sets if all details are valid', function(done) {
		agent
			.post('/operator-form/folders')
			.send({
				'data': {
					'attributes': {
						'name': 'New folder 1',
						'description': 'New folder under Data Sets'
					},
					'relationships': {
						'parent': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'operator-form/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newFolderId2,
					'type': 'operator-form/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newFolderId2 = response.body.data.id;
				done(err);
			});
	});

	it('Should throw an error if we try to update folder details providing null or empty string as Name', function(done) {
		agent
			.patch(`/operator-form/folders/${newFolderId2}`)
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': 'New folder under Data Sets'
					},
					'relationships': {
						'parent': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'operator-form/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newFolderId2,
					'type': 'operator-form/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to update folder details if all required details are filled', function(done) {
		agent
			.patch(`/operator-form/folders/${newFolderId2}`)
			.send({
				'data': {
					'attributes': {
						'name': 'Updated New Folder',
						'description': 'New folder under Data Sets'
					},
					'relationships': {
						'parent': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'operator-form/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newFolderId2,
					'type': 'operator-form/folders'
			}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing folder', function(done) {
		agent
			.del(`/operator-form/folders/13c9393c-83d1-4667-8f1f-9d357f6ce7a5`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete existing folder', function(done) {
		agent
			.del(`/operator-form/folders/${newFolderId2}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should not be able to add new Attribute set if Name is null or empty string', function(done) {
		agent
			.post('/operator-form/attribute-sets')
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
								'type': 'operator-form/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'operator-form/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Attribute set if required fields are filled', function(done) {
		agent
			.post('/operator-form/attribute-sets')
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
								'type': 'operator-form/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'operator-form/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newAttributeSetId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching all availible Attribute Set(s) details', function(done) {
		agent
			.get('/operator-form/attribute-sets?_=1567414700691&include=t')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of all availible Attribute set(s)', function(done) {
		agent
			.get('/operator-form/attribute-sets')
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('should return null if we try to get details of a non existing attribute set', function(done) {
		agent
			.get('/operator-form/attribute-sets/13c9393c-83d1-4667-8f1f-9d357f6ce7a5?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Attribute Set details', function(done) {
		agent
			.get(`/operator-form/attribute-sets/${newAttributeSetId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added attribute set', function(done) {
		agent
			.get(`/operator-form/attribute-sets/${newAttributeSetId}?_=1567147599011`)
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
			.patch('/operator-form/attribute-sets/13c9393c-83d1-4667-8f1f-9d357f6ce7a5')
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
								'type': 'operator-form/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': '13c9393c-83d1-4667-8f1f-9d357f6ce7a5',
					'type': 'operator-form/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a attribute set by giving null or empty string as Name', function(done) {
		agent
			.patch(`/operator-form/attribute-sets/${newAttributeSetId}`)
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
								'type': 'operator-form/folders'
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
					'type': 'operator-form/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to update attribute set if all reqired fields are filled', function(done) {
		agent
			.patch(`/operator-form/attribute-sets/${newAttributeSetId}`)
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
								'type': 'operator-form/folders'
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
					'type': 'operator-form/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				if(err) {
					done(err);
					return;
				}

				agent
					.post('/operator-form/attribute-sets')
					.send({
						'data': {
							'attributes': {
								'name': 'New Demo Attribute Set',
								'description': 'New Attribute set under Data Sets'
							},
							'relationships': {
								'folder': {
									'data': {
										'id': dataSetsNodeId,
										'type': 'operator-form/folders'
									}
								},
								'tenant': {
									'data': {
										'id': tenantId,
										'type': 'settings/account/basics/tenants'
									}
								}
							},
							'type': 'operator-form/attribute-sets'
						}
					})
					.end((err1, response1) => {
						expect(response1).to.have.status(200);
						newAttributeSetId1 = response1.body.data.id;
						done(err1);
					});
			});
	});

	it('Should not be able to add new Data Set Property if Name is null or empty string', function(done) {
		agent
			.post('/operator-form/attribute-set-properties')
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
								'type': 'operator-form/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'operator-form/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Data Set Property if all required details are filled', function(done) {
		agent
			.post('/operator-form/attribute-set-properties')
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
								'type': 'operator-form/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'operator-form/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newAttributeSetPropertyId = response.body.data.id;
				done(err);
			});
	});

	it('should return null if we try to get details of a non existing attribute set property', function(done) {
		agent
			.get('/operator-form/attribute-set-properties/25a77cbf-f1ad-43b2-8aa0-cab8585636de?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Attribute Set details', function(done) {
		agent
			.get(`/operator-form/attribute-set-properties/${newAttributeSetPropertyId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added attribute set property', function(done) {
		agent
			.get(`/operator-form/attribute-set-properties/${newAttributeSetPropertyId}?_=1567149414732`)
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
			.patch('/operator-form/attribute-set-properties/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
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
								'type': 'operator-form/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': '25a77cbf-f1ad-43b2-8aa0-cab8585636de',
					'type': 'operator-form/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a Attribute Set Property by giving Name field as null or empty string', function(done) {
		agent
			.patch(`/operator-form/attribute-set-properties/${newAttributeSetPropertyId}`)
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
								'type': 'operator-form/attribute-sets'
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
					'type': 'operator-form/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to edit a Attribute Set Property if all required fields are filled', function(done) {
		agent
			.patch(`/operator-form/attribute-set-properties/${newAttributeSetPropertyId}`)
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
								'type': 'operator-form/attribute-sets'
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
					'type': 'operator-form/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				if(err) {
					done(err);
					return;
				}

				agent
					.post('/operator-form/attribute-set-properties')
					.send({
						'data': {
							'attributes': {
								'name': 'New Demo Data Set Property',
								'description': 'New Data Set Property',
								'source': 'input',
								'datatype': 'string',
								'evaluation_expression': null,
								'internal_tag': 'new_data_set_property',
								'timestamp_format': 'not_a_timestamp',
								'units': null
							},
							'relationships': {
								'attribute_set': {
									'data': {
										'id': newAttributeSetId1,
										'type': 'operator-form/attribute-sets'
									}
								},
								'tenant': {
									'data': {
										'id': tenantId,
										'type': 'settings/account/basics/tenants'
									}
								}
							},
							'type': 'operator-form/attribute-set-properties'
						}
					})
					.end((err1, response1) => {
						expect(response1).to.have.status(200);
						done(err);
					});
			});
	});

	it('Should not be able to add new Data Set function if Name is null or empty string', function(done) {
		agent
			.post('/operator-form/attribute-set-functions')
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
								'type': 'operator-form/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'operator-form/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Data Set Function if all required details are filled', function(done) {
		agent
			.post('/operator-form/attribute-set-functions')
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
								'type': 'operator-form/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'operator-form/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newAttributeSetFunctionId = response.body.data.id;
				done(err);
			});
	});

	it('should return null if we try to get details of a non existing attribute set function', function(done) {
		agent
			.get('/operator-form/attribute-set-functions/25a77cbf-f1ad-43b2-8aa0-cab8585636de?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Attribute Set details', function(done) {
		agent
			.get(`/operator-form/attribute-set-functions/${newAttributeSetFunctionId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added attribute set function', function(done) {
		agent
			.get(`/operator-form/attribute-set-functions/${newAttributeSetFunctionId}?_=1567147599011`)
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
			.patch('/operator-form/attribute-set-functions/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
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
								'type': 'operator-form/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': '25a77cbf-f1ad-43b2-8aa0-cab8585636de',
					'type': 'operator-form/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a Attribute Set Function by giving Name field as null or empty string', function(done) {
		agent
			.patch(`/operator-form/attribute-set-functions/${newAttributeSetFunctionId}`)
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
								'type': 'operator-form/attribute-sets'
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
					'type': 'operator-form/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to edit a Attribute Set Functions if all required fields are filled', function(done) {
		agent
			.patch(`/operator-form/attribute-set-functions/${newAttributeSetFunctionId}`)
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
								'type': 'operator-form/attribute-sets'
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
					'type': 'operator-form/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to add new Data Set Observer Function', function(done) {
		agent
			.post('/operator-form/attribute-set-functions')
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
								'type': 'operator-form/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'operator-form/attribute-set-functions'
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
			.post('/operator-form/attribute-set-function-observed-properties')
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'operator-form/attribute-sets'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': '44056e3f-a529-476b-8c03-cd21324b6e97',
								'type': 'operator-form/attribute-set-properties'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': newAttributeSetObserverFunctionId,
								'type': 'operator-form/attribute-set-properties'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'operator-form/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to add Data Set Property to a non existing Observer Function', function(done) {
		agent
			.post('/operator-form/attribute-set-function-observed-properties')
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'operator-form/attribute-sets'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': newAttributeSetPropertyId,
								'type': 'operator-form/attribute-set-properties'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': '44056e3f-a529-476b-8c03-cd21324b6e97',
								'type': 'operator-form/attribute-set-properties'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'operator-form/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Data Set Property to Observer Function', function(done) {
		agent
			.post('/operator-form/attribute-set-function-observed-properties')
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'operator-form/attribute-sets'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': newAttributeSetPropertyId,
								'type': 'operator-form/attribute-set-properties'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': newAttributeSetObserverFunctionId,
								'type': 'operator-form/attribute-set-properties'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'operator-form/attribute-set-functions'
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
			.get('/operator-form/attribute-set-function-observed-properties/44056e3f-a529-476b-8c03-cd21324b6e97?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Data Set Function Observed Property details', function(done) {
		agent
			.get(`/operator-form/attribute-set-function-observed-properties/${newAttributeSetFunctionObservedPropertyId}?_=1571304871241&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to get details of added Data Set Function Observed Property', function(done) {
		agent
			.get(`/operator-form/attribute-set-function-observed-properties/${newAttributeSetFunctionObservedPropertyId}?_=1571304871241`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('attribute_set_function_id').eql(newAttributeSetObserverFunctionId);
				expect(response.body.data.attributes).to.have.property('attribute_set_property_id').eql(newAttributeSetPropertyId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('attribute_set_id').eql(newAttributeSetId);
				done(err);
			});
	});

	// operator form test cases

	it('Should not be able to add a new Operator Form if Name is null or empty string', function(done) {
		agent
			.post('/operator-form/operator-forms')
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': 'New Operator Form under Operator Forms'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': operatorFormNodeId,
								'type': 'operator-form/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'operator-form/operator-forms'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add a new Operator Form if all required fields are filled', function(done) {
		agent
			.post('/operator-form/operator-forms')
			.send({
				'data': {
					'attributes': {
						'name': 'New Operator Form',
						'description': 'New Operator Form under Operator Forms'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': operatorFormNodeId,
								'type': 'operator-form/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'operator-form/operator-forms'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newOperatorFormId = response.body.data.id;
				done(err);
			});
	});

	it('should return null if we try to get details of a non existing Operator Form', function(done) {
		agent
			.get('/operator-form/operator-forms/25a77cbf-f1ad-43b2-8aa0-cab8585636de?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Operator Form details', function(done) {
		agent
			.get(`/operator-form/operator-forms/${newOperatorFormId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of Operator Form', function(done) {
		agent
			.get(`/operator-form/operator-forms/${newOperatorFormId}?_=1567150110744`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('New Operator Form');
				expect(response.body.data.attributes).to.have.property('tenant_folder_id').eql(operatorFormNodeId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data).to.have.property('id').eql(newOperatorFormId);
				done(err);
			});
	});

	it('Should return existing tree for Operator Form Node', function(done) {
		agent
			.get(`/operator-form/config-tree-nodes?node_id=${newOperatorFormId}&node_type=operator-form-folder&_=1571466069310`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('should throw an error if we provide invalid query params in url while fetching all availible Operator Forms', function(done) {
		agent
			.get('/operator-form/operator-forms?_=1567414700691&include=t')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get all availible Operator Forms', function(done) {
		agent
			.get('/operator-form/operator-forms')
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a non existing Operator Form details', function(done) {
		agent
			.patch('/operator-form/operator-forms/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.send({
				'data': {
					'attributes': {
						'name': 'New Operator Form 1',
						'description': 'New Operator Form under Operator Forms'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': operatorFormNodeId,
								'type': 'operator-form/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': '25a77cbf-f1ad-43b2-8aa0-cab8585636de',
					'type': 'operator-form/operator-forms'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a Operator Form by giving null or empty string as Name', function(done) {
		agent
			.patch(`/operator-form/operator-forms/${newOperatorFormId}`)
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': 'New Operator Form under Operator Forms'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': operatorFormNodeId,
								'type': 'operator-form/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newOperatorFormId,
					'type': 'operator-form/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to update Operator Form if all reqired fields are filled', function(done) {
		agent
			.patch(`/operator-form/operator-forms/${newOperatorFormId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Operator Form 1',
						'description': 'New Operator Form under Operator Forms'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': operatorFormNodeId,
								'type': 'operator-form/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newOperatorFormId,
					'type': 'operator-form/operator-forms'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// test cases on operator form attribute sets

	it('Should be able to add availible Data Set to Operator Form', function(done) {
		agent
			.post('/operator-form/operator-form-attribute-sets')
			.send({
				'data': {
					'attributes': {
						'evaluation_order': 1
					},
					'relationships': {
						'tenant_operator_form': {
							'data': {
								'id': newOperatorFormId,
								'type': 'operator-form/operator-forms'
							}
						},
						'tenant_attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'operator-form/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'operator-form/operator-form-attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newOperatorFormDataSetId = response.body.data.id;
				if(err) {
					done(err);
					return;
				}

				agent
					.post('/operator-form/operator-form-attribute-sets')
					.send({
						'data': {
							'attributes': {
								'evaluation_order': 2
							},
							'relationships': {
								'tenant_operator_form': {
									'data': {
										'id': newOperatorFormId,
										'type': 'operator-form/operator-forms'
									}
								},
								'tenant_attribute_set': {
									'data': {
										'id': newAttributeSetId1,
										'type': 'operator-form/attribute-sets'
									}
								},
								'tenant': {
									'data': {
										'id': tenantId,
										'type': 'settings/account/basics/tenants'
									}
								}
							},
							'type': 'operator-form/operator-form-attribute-sets'
						}
					})
					.end((err1, response1) => {
						expect(response1).to.have.status(200);
						done(err1);
					});
			});
	});

	it('should return null if we try to get details of a non existing Operator Form Data Set', function(done) {
		agent
			.get('/operator-form/operator-form-attribute-sets/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Operator Form Data Set details', function(done) {
		agent
			.get(`/operator-form/operator-form-attribute-sets/${newOperatorFormDataSetId}?_=1567163681681&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added Operator Form Data set', function(done) {
		agent
			.get(`/operator-form/operator-form-attribute-sets/${newOperatorFormDataSetId}?_=1567163681681`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('tenant_operator_form_id').eql(newOperatorFormId);
				expect(response.body.data.attributes).to.have.property('tenant_attribute_set_id').eql(newAttributeSetId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data).to.have.property('id').eql(newOperatorFormDataSetId);
				done(err);
			});
	});

	it('Should be able to evaluation order of Operator Form Data Set', function(done) {
		agent
			.patch(`/operator-form/operator-form-attribute-sets/${newOperatorFormDataSetId}`)
			.send({
				'data': {
					'attributes': {
						'evaluation_order': 4
					},
					'relationships': {
						'tenant_operator_form': {
							'data': {
								'id': newOperatorFormId,
								'type': 'operator-form/operator-forms'
							}
						},
						'tenant_attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'operator-form/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newOperatorFormDataSetId,
					'type': 'operator-form/operator-form-attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Request Formatter code
	it('Should add the Request Formatter code to the Operator Form', function(done) {
		agent
			.post(`/operator-form/operator-form-request-formatters`)
			.send({
				'data': {
					'attributes': {
						'formatter_code': 'return JSON.stringify(inputData);',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_operator_form': {
							'data': {
								'id': newOperatorFormId,
								'type': 'operator-form/operator-forms'
							}
						}
					},
					'type': 'operator-form/operator-form-request-formatters'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newRequestFormatterCodeId = response.body.data.id;
				done(err);
			});
	});

	it('Should update the Request Formatter code with publish status true', function(done) {
		agent
			.patch(`/operator-form/operator-form-request-formatters/${newRequestFormatterCodeId}`)
			.send({
				'data': {
					'attributes': {
						'formatter_code': 'return JSON.stringify(inputData);',
						'publish_status': true
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_operator_form': {
							'data': {
								'id': newOperatorFormId,
								'type': 'operator-form/operator-forms'
							}
						}
					},
					'id': newRequestFormatterCodeId,
					'type': 'operator-form/operator-form-request-formatters'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to update the Request Formatter code with publish status false again (once it is Published it cannot be Unpublished)', function(done) {
		agent
			.patch(`/operator-form/operator-form-request-formatters/${newRequestFormatterCodeId}`)
			.send({
				'data': {
					'attributes': {
						'formatter_code': 'return JSON.stringify(inputData);',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_operator_form': {
							'data': {
								'id': newOperatorFormId,
								'type': 'operator-form/operator-forms'
							}
						}
					},
					'id': newRequestFormatterCodeId,
					'type': 'operator-form/operator-form-request-formatters'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error if we provide the invalid query params to get details of Request Formatter code', function(done) {
		agent
			.get(`/operator-form/operator-form-request-formatters/${newRequestFormatterCodeId}?_=1567414700691&include=trans`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should get null if we try to get details for the non-existing Request Formatter code', function(done) {
		agent
			.get(`/operator-form/operator-form-request-formatters/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567414700691`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the Request Formatter code', function(done) {
		agent
			.get(`/operator-form/operator-form-request-formatters/${newRequestFormatterCodeId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Operator Form Executor code
	it('Should add the Operator Form Executor code to the Operator Form', function(done) {
		agent
			.post(`/operator-form/operator-form-executors`)
			.send({
				'data': {
					'attributes': {
						'executor_code': 'return JSON.stringify(formattedData);',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_operator_form': {
							'data': {
								'id': newOperatorFormId,
								'type': 'operator-form/operator-forms'
							}
						}
					},
					'type': 'operator-form/operator-form-executors'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newExecutorCodeId = response.body.data.id;
				done(err);
			});
	});

	it('Should update the Operator Form Executor code with publish status true', function(done) {
		agent
			.patch(`/operator-form/operator-form-executors/${newExecutorCodeId}`)
			.send({
				'data': {
					'attributes': {
						'executor_code': 'return JSON.stringify(formattedData);',
						'publish_status': true
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_operator_form': {
							'data': {
								'id': newOperatorFormId,
								'type': 'operator-form/operator-forms'
							}
						}
					},
					'id': newExecutorCodeId,
					'type': 'operator-form/operator-form-executors'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to update the Operator Form Executor code with publish status false again (once it is Published it cannot be Unpublished)', function(done) {
		agent
			.patch(`/operator-form/operator-form-executors/${newExecutorCodeId}`)
			.send({
				'data': {
					'attributes': {
						'executor_code': 'return JSON.stringify(formattedData);',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_operator_form': {
							'data': {
								'id': newOperatorFormId,
								'type': 'operator-form/operator-forms'
							}
						}
					},
					'id': newExecutorCodeId,
					'type': 'operator-form/operator-form-executors'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error if we provide the invalid query params to get details of Operator Form Executor code', function(done) {
		agent
			.get(`/operator-form/operator-form-executors/${newExecutorCodeId}?_=1567414700691&include=trans`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should get null if we try to get details for the non-existing Operator Form Executor code', function(done) {
		agent
			.get(`/operator-form/operator-form-executors/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567414700691`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the Operator Form Executor code', function(done) {
		agent
			.get(`/operator-form/operator-form-executors/${newExecutorCodeId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Operator Form Response Formatter code
	it('Should add the Operator Form Response Formatter code to the Operator Form', function(done) {
		agent
			.post(`/operator-form/operator-form-response-formatters`)
			.send({
				'data': {
					'attributes': {
						'formatter_code': 'return JSON.stringify(processedData);',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_operator_form': {
							'data': {
								'id': newOperatorFormId,
								'type': 'operator-form/operator-forms'
							}
						}
					},
					'type': 'operator-form/operator-form-response-formatters'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newResponseFormatterCodeId = response.body.data.id;
				done(err);
			});
	});

	it('Should update the Operator Form Response Formatter code with publish status true', function(done) {
		agent
			.patch(`/operator-form/operator-form-response-formatters/${newResponseFormatterCodeId}`)
			.send({
				'data': {
					'attributes': {
						'formatter_code': 'return JSON.stringify(processedData);',
						'publish_status': true
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_operator_form': {
							'data': {
								'id': newOperatorFormId,
								'type': 'operator-form/operator-forms'
							}
						}
					},
					'id': newResponseFormatterCodeId,
					'type': 'operator-form/operator-form-response-formatters'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to update the Operator Form Response Formatter code with publish status false again (once it is Published it cannot be Unpublished)', function(done) {
		agent
			.patch(`/operator-form/operator-form-response-formatters/${newResponseFormatterCodeId}`)
			.send({
				'data': {
					'attributes': {
						'formatter_code': 'return JSON.stringify(processedData);',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_operator_form': {
							'data': {
								'id': newOperatorFormId,
								'type': 'operator-form/operator-forms'
							}
						}
					},
					'id': newResponseFormatterCodeId,
					'type': 'operator-form/operator-form-response-formatters'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error if we provide the invalid query params to get details of Operator Form Response Formatter code', function(done) {
		agent
			.get(`/operator-form/operator-form-response-formatters/${newResponseFormatterCodeId}?_=1567414700691&include=trans`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should get null if we try to get details for the non-existing Operator Form Response Formatter code', function(done) {
		agent
			.get(`/operator-form/operator-form-response-formatters/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567414700691`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the Operator Form Response Formatter code', function(done) {
		agent
			.get(`/operator-form/operator-form-response-formatters/${newResponseFormatterCodeId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Operator Form Input Template code
	it('Should add the Operator Form Input Template code to the Operator Form', function(done) {
		agent
			.post(`/operator-form/operator-form-input-templates`)
			.send({
				'data': {
					'attributes': {
						'component_before_render_code': 'xyz();',
						'component_after_render_code': 'ABC();',
						'component_before_destroy_code': null,
						'template': '<h1>return</h1>',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_operator_form': {
							'data': {
								'id': newOperatorFormId,
								'type': 'operator-form/operator-forms'
							}
						}
					},
					'type': 'operator-form/operator-form-input-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newInputTemplateCodeId = response.body.data.id;
				done(err);
			});
	});

	it('Should update the Operator Form Input Template code with publish status true', function(done) {
		agent
			.patch(`/operator-form/operator-form-input-templates/${newInputTemplateCodeId}`)
			.send({
				'data': {
					'attributes': {
						'component_before_render_code': 'xyz();',
						'component_after_render_code': 'ABC();',
						'component_before_destroy_code': null,
						'template': '<h1>return</h1>',
						'publish_status': true
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_operator_form': {
							'data': {
								'id': newOperatorFormId,
								'type': 'operator-form/operator-forms'
							}
						}
					},
					'id': newInputTemplateCodeId,
					'type': 'operator-form/operator-form-input-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to update the Operator Form Input Template code with publish status false again (once it is Published it cannot be Unpublished)', function(done) {
		agent
			.patch(`/operator-form/operator-form-input-templates/${newInputTemplateCodeId}`)
			.send({
				'data': {
					'attributes': {
						'component_before_render_code': 'xyz();',
						'component_after_render_code': 'ABC();',
						'component_before_destroy_code': null,
						'template': '<h1>return</h1>',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_operator_form': {
							'data': {
								'id': newOperatorFormId,
								'type': 'operator-form/operator-forms'
							}
						}
					},
					'id': newInputTemplateCodeId,
					'type': 'operator-form/operator-form-input-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error if we provide the invalid query params to get details of Operator Form Input Template code', function(done) {
		agent
			.get(`/operator-form/operator-form-input-templates/${newInputTemplateCodeId}?_=1567414700691&include=trans`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should get null if we try to get details for the non-existing Operator Form Input Template code', function(done) {
		agent
			.get(`/operator-form/operator-form-input-templates/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567414700691`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the Operator Form Input Template code', function(done) {
		agent
			.get(`/operator-form/operator-form-input-templates/${newInputTemplateCodeId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Operator Form Result Template code
	it('Should add the Operator Form Result Template code to the Operator Form', function(done) {
		agent
			.post(`/operator-form/operator-form-result-templates`)
			.send({
				'data': {
					'attributes': {
						'component_before_render_code': 'xyz();',
						'component_after_render_code': 'ABC();',
						'component_on_data_code': 'ABC();',
						'component_before_destroy_code': null,
						'template': '<h1>return</h1>',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_operator_form': {
							'data': {
								'id': newOperatorFormId,
								'type': 'operator-form/operator-forms'
							}
						}
					},
					'type': 'operator-form/operator-form-result-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newResultTemplateCodeId = response.body.data.id;
				done(err);
			});
	});

	it('Should update the Operator Form Result Template code with publish status true', function(done) {
		agent
			.patch(`/operator-form/operator-form-result-templates/${newResultTemplateCodeId}`)
			.send({
				'data': {
					'attributes': {
						'component_before_render_code': 'xyz();',
						'component_after_render_code': 'ABC();',
						'component_on_data_code': 'ABC();',
						'component_before_destroy_code': null,
						'template': '<h1>return</h1>',
						'publish_status': true
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_operator_form': {
							'data': {
								'id': newOperatorFormId,
								'type': 'operator-form/operator-forms'
							}
						}
					},
					'id': newResultTemplateCodeId,
					'type': 'operator-form/operator-form-result-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to update the Operator Form Result Template code with publish status false again (once it is Published it cannot be Unpublished)', function(done) {
		agent
			.patch(`/operator-form/operator-form-result-templates/${newResultTemplateCodeId}`)
			.send({
				'data': {
					'attributes': {
						'component_before_render_code': 'xyz();',
						'component_after_render_code': 'ABC();',
						'component_on_data_code': 'ABC();',
						'component_before_destroy_code': null,
						'template': '<h1>return</h1>',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_operator_form': {
							'data': {
								'id': newOperatorFormId,
								'type': 'operator-form/operator-forms'
							}
						}
					},
					'id': newResultTemplateCodeId,
					'type': 'operator-form/operator-form-result-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error if we provide the invalid query params to get details of Operator Form Result Template code', function(done) {
		agent
			.get(`/operator-form/operator-form-result-templates/${newResultTemplateCodeId}?_=1567414700691&include=trans`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should get null if we try to get details for the non-existing Operator Form Result Template code', function(done) {
		agent
			.get(`/operator-form/operator-form-result-templates/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567414700691`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the Operator Form Result Template code', function(done) {
		agent
			.get(`/operator-form/operator-form-result-templates/${newResultTemplateCodeId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// delete test cases.
	it('Should throw an error if we try to delete a non existing Machine Data Set', function(done) {
		agent
			.del('/operator-form/operator-form-attribute-sets/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete added Machine Data set', function(done) {
		agent
			.del(`/operator-form/operator-form-attribute-sets/${newOperatorFormDataSetId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Operator Form', function(done) {
		agent
			.del('/operator-form/operator-forms/13c9393c-83d1-4667-8f1f-9d357f6ce7a5')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete added Operator Form', function(done) {
		agent
			.del(`/operator-form/operator-forms/${newOperatorFormId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Attribute Set Function Observed Property', function(done) {
		agent
			.del('/operator-form/attribute-set-function-observed-properties/44056e3f-a529-476b-8c03-cd21324b6e97')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete added Attribute Set Function Observed Property', function(done) {
		agent
			.del(`/operator-form/attribute-set-function-observed-properties/${newAttributeSetFunctionObservedPropertyId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Attribute Set Property', function(done) {
		agent
			.del('/operator-form/attribute-set-properties/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete created Attribute Set Property', function(done) {
		agent
			.del(`/operator-form/attribute-set-properties/${newAttributeSetPropertyId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Attribute Set Function', function(done) {
		agent
			.del('/operator-form/attribute-set-functions/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete created Attribute Set Function', function(done) {
		agent
			.del(`/operator-form/attribute-set-functions/${newAttributeSetFunctionId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Attribute set', function(done) {
		agent
			.del('/operator-form/attribute-sets/13c9393c-83d1-4667-8f1f-9d357f6ce7a5')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete created Attribute Set', function(done) {
		agent
			.del(`/operator-form/attribute-sets/${newAttributeSetId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

});

