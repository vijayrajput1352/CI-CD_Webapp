'use strict';

const chai = require('chai'); // eslint-disable-line node/no-unpublished-require
const chaiHttp = require('chai-http'); // eslint-disable-line node/no-unpublished-require

chai.use(chaiHttp);


describe('Manufacturing Feature Test Cases', function() {
	const agent = chai.request.agent('http://localhost:9100');
	const expect = chai.expect;
	let tenantId;
	let nodeId;
	let dataSetsNodeId, plantsNodeId;
	let newFolderId2;
	let newAttributeSetFunctionId, newAttributeSetFunctionObservedPropertyId, newAttributeSetId, newAttributeSetObserverFunctionId, newAttributeSetPropertyId;
	let newIoTGatewayId, newLineDataSetId, newLineId, newLineId1, newLineId2, newMachineDataSetId, newMachineId, newMachineId1, newPlantId, newPlantUnitId, newStationDataSetId, newStationId;
	let newLineConstituentId, newLineConstituentId1;
	let newTemplateCodeId, newTranformCodeId, newTranformCodeId1;

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
			.get('/session/logout')
			.end((err) => {
				done(err);
			});
	});

	it('Should return proper Node details', function(done) {
		agent
			.get('/configure/nodes?_=1566818693175')
			.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36')
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data[3].attributes).to.have.property('name').eql('Manufacturing');
				expect(response.body.data[3].attributes).to.have.property('node_type').eql('root-folder');
				expect(response.body.data[3].attributes).to.have.property('route').eql('manufacturing');
				nodeId = response.body.data[3].id;
				done(err);
			});
	});

	it('Should return empty array if we try to get details of a tree of invalid type', function(done) {
		agent
			.get(`/manufacturing/config-tree-nodes?node_id=${nodeId}&node_type=invalid&_=1571466069310`)
			.end((err, response) => {
				expect(response.body).to.be.eql([]);
				done(err);
			});
	});

	it('Should return existing tree for Root node', function(done) {
		agent
			.get(`/manufacturing/config-tree-nodes?node_id=${nodeId}&node_type=root-folder&_=1566990208766`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				if(response.body[0].data.type === 'attribute-folder') {
					expect(response.body[0]).to.have.property('children').eql(true);
					expect(response.body[0]).to.have.property('parent').eql(nodeId);
					expect(response.body[0].data).to.have.property('type').eql('attribute-folder');
					expect(response.body[1]).to.have.property('children').eql(true);
					expect(response.body[1]).to.have.property('parent').eql(nodeId);
					expect(response.body[1].data).to.have.property('type').eql('plant-folder');
					plantsNodeId = response.body[1].id;
					dataSetsNodeId = response.body[0].id;
				}
				else {
					expect(response.body[1]).to.have.property('children').eql(true);
					expect(response.body[1]).to.have.property('parent').eql(nodeId);
					expect(response.body[1].data).to.have.property('type').eql('attribute-folder');
					expect(response.body[0]).to.have.property('children').eql(true);
					expect(response.body[0]).to.have.property('parent').eql(nodeId);
					expect(response.body[0].data).to.have.property('type').eql('plant-folder');
					plantsNodeId = response.body[0].id;
					dataSetsNodeId = response.body[1].id;
				}
				done(err);
			});
	});

	it('Should return existing tree for Data Sets Node', function(done) {
		agent
			.get(`/manufacturing/config-tree-nodes?node_id=${dataSetsNodeId}&node_type=attribute-folder&_=1571466069310`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should return existing tree for Plants Node', function(done) {
		agent
			.get(`/manufacturing/config-tree-nodes?node_id=${plantsNodeId}&node_type=plant-folder&_=1571466069310`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('should return Root Tenant folder details', function(done) {
		agent
			.get(`/manufacturing/folders/${nodeId}?_=1566890475910`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('manufacturing_feature.folder_names.root.name');
				expect(response.body.data.attributes).to.have.property('description').eql('manufacturing_feature.folder_names.root.description');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(null);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	it('should return Data Sets folder details', function(done) {
		agent
			.get(`/manufacturing/folders/${dataSetsNodeId}?_=1566890475910`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('manufacturing_feature.folder_names.attribute_sets.name');
				expect(response.body.data.attributes).to.have.property('description').eql('manufacturing_feature.folder_names.attribute_sets.description');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(nodeId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	it('should return Plants folder details', function(done) {
		agent
			.get(`/manufacturing/folders/${plantsNodeId}?_=1566890475910`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('manufacturing_feature.folder_names.plants.name');
				expect(response.body.data.attributes).to.have.property('description').eql('manufacturing_feature.folder_names.plants.description');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(nodeId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a folder details', function(done) {
		agent
			.get(`/manufacturing/folders/${nodeId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should not be able to create a folder with empty Name under Data Sets', function(done) {
		agent
			.post('/manufacturing/folders')
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
					'type': 'manufacturing/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to create a folder under Data Sets if all details are valid', function(done) {
		agent
			.post('/manufacturing/folders')
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
					'id': newFolderId2,
					'type': 'manufacturing/folders'
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
			.patch(`/manufacturing/folders/${newFolderId2}`)
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
					'id': newFolderId2,
					'type': 'manufacturing/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to update folder details if all required details are filled', function(done) {
		agent
			.patch(`/manufacturing/folders/${newFolderId2}`)
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
					'id': newFolderId2,
					'type': 'manufacturing/folders'
			}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing folder', function(done) {
		agent
			.del(`/manufacturing/folders/13c9393c-83d1-4667-8f1f-9d357f6ce7a5`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete existing folder', function(done) {
		agent
			.del(`/manufacturing/folders/${newFolderId2}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should not be able to add new Attribute set if Name is null or empty string', function(done) {
		agent
			.post('/manufacturing/attribute-sets')
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
					'type': 'manufacturing/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Attribute set if required fields are filled', function(done) {
		agent
			.post('/manufacturing/attribute-sets')
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
					'type': 'manufacturing/attribute-sets'
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
			.get('/manufacturing/attribute-sets?_=1567414700691&include=t')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of all availible Attribute set(s)', function(done) {
		agent
			.get('/manufacturing/attribute-sets')
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('should return null if we try to get details of a non existing attribute set', function(done) {
		agent
			.get('/manufacturing/attribute-sets/13c9393c-83d1-4667-8f1f-9d357f6ce7a5?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Attribute Set details', function(done) {
		agent
			.get(`/manufacturing/attribute-sets/${newAttributeSetId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added attribute set', function(done) {
		agent
			.get(`/manufacturing/attribute-sets/${newAttributeSetId}?_=1567147599011`)
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
			.patch('/manufacturing/attribute-sets/13c9393c-83d1-4667-8f1f-9d357f6ce7a5')
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
					'id': '13c9393c-83d1-4667-8f1f-9d357f6ce7a5',
					'type': 'manufacturing/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a attribute set by giving null or empty string as Name', function(done) {
		agent
			.patch(`/manufacturing/attribute-sets/${newAttributeSetId}`)
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
					'id': newAttributeSetId,
					'type': 'manufacturing/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to update attribute set if all reqired fields are filled', function(done) {
		agent
			.patch(`/manufacturing/attribute-sets/${newAttributeSetId}`)
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
					'id': newAttributeSetId,
					'type': 'manufacturing/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should not be able to add new Data Set Property if Name is null or empty string', function(done) {
		agent
			.post('/manufacturing/attribute-set-properties')
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
								'type': 'manufacturing/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'manufacturing/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Data Set Property if all required details are filled', function(done) {
		agent
			.post('/manufacturing/attribute-set-properties')
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
								'type': 'manufacturing/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'manufacturing/attribute-set-properties'
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
			.get('/manufacturing/attribute-set-properties/25a77cbf-f1ad-43b2-8aa0-cab8585636de?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Attribute Set details', function(done) {
		agent
			.get(`/manufacturing/attribute-set-properties/${newAttributeSetPropertyId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added attribute set property', function(done) {
		agent
			.get(`/manufacturing/attribute-set-properties/${newAttributeSetPropertyId}?_=1567149414732`)
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
			.patch('/manufacturing/attribute-set-properties/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
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
								'type': 'manufacturing/attribute-sets'
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
					'type': 'manufacturing/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a Attribute Set Property by giving Name field as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/attribute-set-properties/${newAttributeSetPropertyId}`)
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
								'type': 'manufacturing/attribute-sets'
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
					'type': 'manufacturing/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to edit a Attribute Set Property if all required fields are filled', function(done) {
		agent
			.patch(`/manufacturing/attribute-set-properties/${newAttributeSetPropertyId}`)
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
								'type': 'manufacturing/attribute-sets'
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
					'type': 'manufacturing/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should not be able to add new Data Set function if Name is null or empty string', function(done) {
		agent
			.post('/manufacturing/attribute-set-functions')
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
								'type': 'manufacturing/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'manufacturing/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Data Set Function if all required details are filled', function(done) {
		agent
			.post('/manufacturing/attribute-set-functions')
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
								'type': 'manufacturing/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'manufacturing/attribute-set-functions'
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
			.get('/manufacturing/attribute-set-functions/25a77cbf-f1ad-43b2-8aa0-cab8585636de?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Attribute Set details', function(done) {
		agent
			.get(`/manufacturing/attribute-set-functions/${newAttributeSetFunctionId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added attribute set function', function(done) {
		agent
			.get(`/manufacturing/attribute-set-functions/${newAttributeSetFunctionId}?_=1567147599011`)
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
			.patch('/manufacturing/attribute-set-functions/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
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
								'type': 'manufacturing/attribute-sets'
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
					'type': 'manufacturing/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a Attribute Set Function by giving Name field as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/attribute-set-functions/${newAttributeSetFunctionId}`)
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
								'type': 'manufacturing/attribute-sets'
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
					'type': 'manufacturing/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to edit a Attribute Set Functions if all required fields are filled', function(done) {
		agent
			.patch(`/manufacturing/attribute-set-functions/${newAttributeSetFunctionId}`)
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
								'type': 'manufacturing/attribute-sets'
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
					'type': 'manufacturing/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to add new Data Set Observer Function', function(done) {
		agent
			.post('/manufacturing/attribute-set-functions')
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
								'type': 'manufacturing/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'manufacturing/attribute-set-functions'
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
			.post('/manufacturing/attribute-set-function-observed-properties')
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'manufacturing/attribute-sets'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': '44056e3f-a529-476b-8c03-cd21324b6e97',
								'type': 'manufacturing/attribute-set-properties'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': newAttributeSetObserverFunctionId,
								'type': 'manufacturing/attribute-set-properties'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'manufacturing/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to add Data Set Property to a non existing Observer Function', function(done) {
		agent
			.post('/manufacturing/attribute-set-function-observed-properties')
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'manufacturing/attribute-sets'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': newAttributeSetPropertyId,
								'type': 'manufacturing/attribute-set-properties'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': '44056e3f-a529-476b-8c03-cd21324b6e97',
								'type': 'manufacturing/attribute-set-properties'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'manufacturing/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Data Set Property to Observer Function', function(done) {
		agent
			.post('/manufacturing/attribute-set-function-observed-properties')
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'manufacturing/attribute-sets'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': newAttributeSetPropertyId,
								'type': 'manufacturing/attribute-set-properties'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': newAttributeSetObserverFunctionId,
								'type': 'manufacturing/attribute-set-properties'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'manufacturing/attribute-set-functions'
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
			.get('/manufacturing/attribute-set-function-observed-properties/44056e3f-a529-476b-8c03-cd21324b6e97?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Data Set Function Observed Property details', function(done) {
		agent
			.get(`/manufacturing/attribute-set-function-observed-properties/${newAttributeSetFunctionObservedPropertyId}?_=1571304871241&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to get details of added Data Set Function Observed Property', function(done) {
		agent
			.get(`/manufacturing/attribute-set-function-observed-properties/${newAttributeSetFunctionObservedPropertyId}?_=1571304871241`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('attribute_set_function_id').eql(newAttributeSetObserverFunctionId);
				expect(response.body.data.attributes).to.have.property('attribute_set_property_id').eql(newAttributeSetPropertyId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('attribute_set_id').eql(newAttributeSetId);
				done(err);
			});
	});

	it('Should not be able to add a new Plant if Name is null or empty string', function(done) {
		agent
			.post('/manufacturing/plants')
			.send({
				'data': {
					'attributes': {
						'name': ' ',
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
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add a new Plant if all required fields are filled', function(done) {
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
			.end((err, response) => {
				expect(response).to.have.status(200);
				newPlantId = response.body.data.id;
				done(err);
			});
	});

	it('should return null if we try to get details of a non existing Plant', function(done) {
		agent
			.get('/manufacturing/plants/25a77cbf-f1ad-43b2-8aa0-cab8585636de?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Plant details', function(done) {
		agent
			.get(`/manufacturing/plants/${newPlantId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of Plant', function(done) {
		agent
			.get(`/manufacturing/plants/${newPlantId}?_=1567150110744`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('New Plant');
				expect(response.body.data.attributes).to.have.property('tenant_folder_id').eql(plantsNodeId);
				expect(response.body.data.attributes).to.have.property('tenant_location_id').eql(null);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data).to.have.property('id').eql(newPlantId);
				done(err);
			});
	});

	it('Should return existing tree for Plant Node', function(done) {
		agent
			.get(`/manufacturing/config-tree-nodes?node_id=${newPlantId}&node_type=plant&_=1571466069310`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('should throw an error if we provide invalid query params in url while fetching all availible Plants', function(done) {
		agent
			.get('/manufacturing/plants?_=1567414700691&include=t')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get all availible Plants', function(done) {
		agent
			.get('/manufacturing/plants')
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a non existing Plant details', function(done) {
		agent
			.patch('/manufacturing/plants/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.send({
				'data': {
					'attributes': {
						'name': 'New Plant1',
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
					'id': '25a77cbf-f1ad-43b2-8aa0-cab8585636de',
					'type': 'manufacturing/plants'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a Plant by giving null or empty string as Name', function(done) {
		agent
			.patch(`/manufacturing/plants/${newPlantId}`)
			.send({
				'data': {
					'attributes': {
						'name': ' ',
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
					'id': newPlantId,
					'type': 'manufacturing/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to update Plant if all reqired fields are filled', function(done) {
		agent
			.patch(`/manufacturing/plants/${newPlantId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Plant1',
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
					'id': newPlantId,
					'type': 'manufacturing/plants'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should not be able to add Plant Unit if Name is null or empty string', function(done) {
		agent
			.post('/manufacturing/plant-units')
			.send({
				'data': {
					'attributes': {
						'name': ' ',
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
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Plant Unit if all required details are filled', function(done) {
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
			.end((err, response) => {
				expect(response).to.have.status(200);
				newPlantUnitId = response.body.data.id;
				done(err);
			});
	});

	it('Should return existing tree for Plant Units Node', function(done) {
		agent
			.get(`/manufacturing/config-tree-nodes?node_id=${newPlantUnitId}&node_type=plant-unit&_=1571466069310`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('should return null if we try to get details of a non existing Plant Unit', function(done) {
		agent
			.get('/manufacturing/plant-units/25a77cbf-f1ad-43b2-8aa0-cab8585636de?_=1567150110753')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Plant Unit details', function(done) {
		agent
			.get(`/manufacturing/plant-units/${newPlantUnitId}?_=1567150110753&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added Plant Unit', function(done) {
		agent
			.get(`/manufacturing/plant-units/${newPlantUnitId}?_=1567150110753`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('New Plant Unit');
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('tenant_plant_id').eql(newPlantId);
				expect(response.body.data).to.have.property('id').eql(newPlantUnitId);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a non existing Plant Unit details', function(done) {
		agent
			.patch('/manufacturing/plant-units/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.send({
				'data': {
					'attributes': {
						'name': 'New Plant Unit1',
						'description': 'New Plant Unit under newly added Plant'
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
					'id': '25a77cbf-f1ad-43b2-8aa0-cab8585636de',
					'type': 'manufacturing/plant-units'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a Plant Unit by giving Name field as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-units/${newPlantUnitId}`)
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': 'New Plant Unit under newly added Plant'
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
					'id': newPlantUnitId,
					'type': 'manufacturing/plant-units'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to edit a Plant Unit if all required fields are filled', function(done) {
		agent
			.patch(`/manufacturing/plant-units/${newPlantUnitId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Plant Unit1',
						'description': 'New Plant Unit under newly added Plant'
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
					'id': newPlantUnitId,
					'type': 'manufacturing/plant-units'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should return empty array if we try to get details of a tree of invalid type', function(done) {
		agent
			.get(`/manufacturing/devenv-tree-nodes?node_id=${nodeId}&node_type=invalid&_=1571466069310`)
			.end((err, response) => {
				expect(response.body).to.be.eql([]);
				done(err);
			});
	});

	it('Should be able to get Dev Env tree for Root Folder Node', function(done) {
		agent
			.get(`/manufacturing/devenv-tree-nodes?node_id=${nodeId}&node_type=root-folder&_=1573196536511`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to get Dev Env tree for Data Set Folder Node', function(done) {
		agent
			.get(`/manufacturing/devenv-tree-nodes?node_id=${dataSetsNodeId}&node_type=attribute-folder&_=1573196536511`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to get Dev Env tree for Plants Folder Node', function(done) {
		agent
			.get(`/manufacturing/devenv-tree-nodes?node_id=${plantsNodeId}&node_type=plant-folder&_=1573196536511`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to get Dev Env tree for new Plant Node', function(done) {
		agent
			.get(`/manufacturing/devenv-tree-nodes?node_id=${newPlantId}&node_type=plant&_=1573196536511`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to get Dev Env tree for new Plant Unit Node', function(done) {
		agent
			.get(`/manufacturing/devenv-tree-nodes?node_id=${newPlantUnitId}&node_type=plant-unit&_=1573196536511`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should not be able to add a IoT Gateway if Name is null or empty string', function(done) {
		agent
			.post('/manufacturing/plant-unit-drivers')
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': 'New IoT Gateway under Newly added Plant Unit',
						'status': false
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
					'type': 'manufacturing/plant-unit-drivers'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new IoT Gateway if all required details are filled', function(done) {
		agent
			.post('/manufacturing/plant-unit-drivers')
			.send({
				'data': {
					'attributes': {
						'name': 'New Iot Gateway',
						'description': 'New IoT Gateway under Newly added Plant Unit',
						'status': false
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
					'type': 'manufacturing/plant-unit-drivers'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newIoTGatewayId = response.body.data.id;
				done(err);
			});
	});

	it('should return null if we try to get details of a non existing IoT Gateway', function(done) {
		agent
			.get('/manufacturing/plant-unit-drivers/25a77cbf-f1ad-43b2-8aa0-cab8585636de?_=1567150110753')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a IoT Gateway details', function(done) {
		agent
			.get(`/manufacturing/plant-unit-drivers/${newIoTGatewayId}?_=1567157414325&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added IoT Gateway', function(done) {
		agent
			.get(`/manufacturing/plant-unit-drivers/${newIoTGatewayId}?_=1567157414325`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('New Iot Gateway');
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('tenant_plant_unit_id').eql(newPlantUnitId);
				expect(response.body.data).to.have.property('id').eql(newIoTGatewayId);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a non existing IoT Gateway details', function(done) {
		agent
			.patch('/manufacturing/plant-unit-drivers/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.send({
				'data': {
					'attributes': {
						'name': 'New Iot Gateway1',
						'description': 'New IoT Gateway under Newly added Plant Unit',
						'status': false
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
					'id': '25a77cbf-f1ad-43b2-8aa0-cab8585636de',
					'type': 'manufacturing/plant-unit-drivers'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a IoT Gateway by giving Name field as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-drivers/${newIoTGatewayId}`)
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': 'New IoT Gateway under Newly added Plant Unit',
						'status': false
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
					'id': newIoTGatewayId,
					'type': 'manufacturing/plant-unit-drivers'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to edit a IoT Gtaeway details if all required fields are filled', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-drivers/${newIoTGatewayId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Iot Gateway1',
						'description': 'New IoT Gateway under Newly added Plant Unit',
						'status': false
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
					'id': newIoTGatewayId,
					'type': 'manufacturing/plant-unit-drivers'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should not be able to add a Machine if Name is null or empty string', function(done) {
		agent
			.post('/manufacturing/plant-unit-machines')
			.send({
				'data': {
					'attributes': {
						'name': ' ',
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
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Machine if all required details are filled', function(done) {
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
			.end((err, response) => {
				expect(response).to.have.status(200);
				newMachineId = response.body.data.id;
				if(err) {
					done(err);
					return;
				}

				agent
					.post('/manufacturing/plant-unit-machines')
					.send({
						'data': {
							'attributes': {
								'name': 'New Machine 1',
								'description': 'New Machine 1 under Newly added Plant Unit',
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
					.end((err1, response1) => {
						expect(response1).to.have.status(200);
						newMachineId1 = response1.body.data.id;
						done(err);
					});
			});
	});

	it('should return null if we try to get details of a non existing Machine', function(done) {
		agent
			.get('/manufacturing/plant-unit-machines/25a77cbf-f1ad-43b2-8aa0-cab8585636de?_=1567150110753')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Machine details', function(done) {
		agent
			.get(`/manufacturing/plant-unit-machines/${newMachineId}?_=1567163681681&include=trqlsh`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added Machine', function(done) {
		agent
			.get(`/manufacturing/plant-unit-machines/${newMachineId}?_=1567157414325`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('New Machine');
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('communication_protocol_id').eql(null);
				expect(response.body.data.attributes).to.have.property('hardware_protocol_id').eql(null);
				expect(response.body.data.attributes).to.have.property('machine_id').eql(null);
				expect(response.body.data.attributes).to.have.property('plc_id').eql(null);
				expect(response.body.data.attributes).to.have.property('downtime_list_filters').eql([]);
				expect(response.body.data.attributes).to.have.property('operator_list_filters').eql([]);
				expect(response.body.data.attributes).to.have.property('tags').eql(null);
				expect(response.body.data.attributes).to.have.property('tenant_plant_unit_driver_id').eql(null);
				expect(response.body.data.attributes).to.have.property('tenant_plant_unit_id').eql(newPlantUnitId);
				expect(response.body.data).to.have.property('id').eql(newMachineId);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a non existing Machine details', function(done) {
		agent
			.patch('/manufacturing/plant-unit-machines/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.send({
				'data': {
					'attributes': {
						'name': 'New Machine1',
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
					'id': '25a77cbf-f1ad-43b2-8aa0-cab8585636de',
					'type': 'manufacturing/plant-unit-machines'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a Machine by giving Name field as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-machines/${newMachineId}`)
			.send({
				'data': {
					'attributes': {
						'name': ' ',
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
					'id': newMachineId,
					'type': 'manufacturing/plant-unit-machines'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to edit a Machine details if all required fields are filled', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-machines/${newMachineId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Machine1',
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
					'id': newMachineId,
					'type': 'manufacturing/plant-unit-machines'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to add availible Data Set to Machine', function(done) {
		agent
			.post('/manufacturing/plant-unit-machine-attribute-sets')
			.send({
				'data': {
					'attributes': {
						'evaluation_order': 1
					},
					'relationships': {
						'tenant_plant_unit_machine': {
							'data': {
								'id': newMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						},
						'tenant_attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'manufacturing/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'manufacturing/plant-unit-machine-attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newMachineDataSetId = response.body.data.id;
				done(err);
			});
	});

	it('should return null if we try to get details of a non existing Machine Data Set', function(done) {
		agent
			.get('/manufacturing/plant-unit-machine-attribute-sets/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Machine Data Set details', function(done) {
		agent
			.get(`/manufacturing/plant-unit-machine-attribute-sets/${newMachineDataSetId}?_=1567163681681&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added Machine Data set', function(done) {
		agent
			.get(`/manufacturing/plant-unit-machine-attribute-sets/${newMachineDataSetId}?_=1567163681681`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('tenant_attribute_set_id').eql(newAttributeSetId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('tenant_plant_unit_machine_id').eql(newMachineId);
				expect(response.body.data).to.have.property('id').eql(newMachineDataSetId);
				done(err);
			});
	});

	// Test Cases for the Transform code
	it('Should add the Transform code to the machine', function(done) {
		agent
			.post(`/manufacturing/plant-unit-machine-processors`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'raw_data_transform_code': 'return currentData;',
						'availability_calculation_code': null,
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
						'tenant_plant_unit_machine': {
							'data': {
								'id': newMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'type': 'manufacturing/plant-unit-machine-processors'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newTranformCodeId = response.body.data.id;
				done(err);
			});
	});

	it('Should add the Transform code to the machine with processor information provided', function(done) {
		agent
			.post(`/manufacturing/plant-unit-machine-processors`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'processor': 'ABC',
						'raw_data_transform_code': 'return currentData;',
						'availability_calculation_code': null,
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
						'tenant_plant_unit_machine': {
							'data': {
								'id': newMachineId1,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'type': 'manufacturing/plant-unit-machine-processors'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newTranformCodeId1 = response.body.data.id;
				done(err);
			});
	});


	it('Should update the Transform code with publish status true', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-machine-processors/${newTranformCodeId1}`)
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
						'tenant_plant_unit_machine': {
							'data': {
								'id': newMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'id': newTranformCodeId1,
					'type': 'manufacturing/plant-unit-machine-processors'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to update the Transform code with publish status false again (once it is Published it cannot be Unpublished)', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-machine-processors/${newTranformCodeId1}`)
			.send({
				'data': {
					'attributes': {
						'pre_realtime_push_transform_code': 'ABC();',
						'processed_data_transform_code': 'XYZ();',
						'publish_status': false
					},
					'relationships': {
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						},
						'tenant_plant_unit_machine': {
							'data': {
								'id': newMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'id': newTranformCodeId1,
					'type': 'manufacturing/plant-unit-machine-processors'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error if we provide the invalid query params to get details of Transform code', function(done) {
		agent
			.get(`/manufacturing/plant-unit-machine-processors/${newTranformCodeId}?_=1567414700691&include=trans`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should get null if we try to get details for the non-existing Transform-Code', function(done) {
		agent
			.get(`/manufacturing/plant-unit-machine-processors/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567414700691`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the Transform code', function(done) {
		agent
			.get(`/manufacturing/plant-unit-machine-processors/${newTranformCodeId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should add the Template code to the machine', function(done) {
		agent
			.post(`/manufacturing/plant-unit-machine-templates`)
			.send({
				'data': {
					'attributes': {
						'created_at': Date.now(),
						'template': '<h1>return</h1>',
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
						'tenant_plant_unit_machine': {
							'data': {
								'id': newMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'type': 'manufacturing/plant-unit-machine-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newTemplateCodeId = response.body.data.id;
				done(err);
			});
	});

	it('Should update the Template code with publish status true', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-machine-templates/${newTemplateCodeId}`)
			.send({
				'data': {
					'attributes': {
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
						'tenant_plant_unit_machine': {
							'data': {
								'id': newMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'id': newTemplateCodeId,
					'type': 'manufacturing/plant-unit-machine-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to update the Transform code with publish status false again (once it is Published it cannot be Unpublished)', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-machine-templates/${newTemplateCodeId}`)
			.send({
				'data': {
					'attributes': {
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
						'tenant_plant_unit_machine': {
							'data': {
								'id': newMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'id': newTemplateCodeId,
					'type': 'manufacturing/plant-unit-machine-templates'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error if we provide the invalid query params to get details of Template code', function(done) {
		agent
			.get(`/manufacturing/plant-unit-machine-templates/${newTemplateCodeId}?_=1567414700691&include=trans`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should get null if we try to get details for the non-existing Template Code', function(done) {
		agent
			.get(`/manufacturing/plant-unit-machine-templates/848305dd-d59b-4cf5-91b2-22224c141a9f?_=1567414700691`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for the template code', function(done) {
		agent
			.get(`/manufacturing/plant-unit-machine-templates/${newTemplateCodeId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should not be able to add a Station if Name is null or empty string', function(done) {
		agent
			.post('/manufacturing/plant-unit-stations')
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': 'New Station under Newly added Plant Unit',
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
					'type': 'manufacturing/plant-unit-stations'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Station if all required details are filled', function(done) {
		agent
			.post('/manufacturing/plant-unit-stations')
			.send({
				'data': {
					'attributes': {
						'name': 'New Station',
						'description': 'New Station under Newly added Plant Unit',
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
					'type': 'manufacturing/plant-unit-stations'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newStationId = response.body.data.id;
				done(err);
			});
	});

	it('should return null if we try to get details of a non existing Station', function(done) {
		agent
			.get('/manufacturing/plant-unit-stations/25a77cbf-f1ad-43b2-8aa0-cab8585636de?_=1567150110753')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Station details', function(done) {
		agent
			.get(`/manufacturing/plant-unit-stations/${newStationId}?_=1567157414325&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added Station', function(done) {
		agent
			.get(`/manufacturing/plant-unit-stations/${newStationId}?_=1567157414325`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('New Station');
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('tags').eql(null);
				expect(response.body.data.attributes).to.have.property('tenant_plant_unit_id').eql(newPlantUnitId);
				expect(response.body.data).to.have.property('id').eql(newStationId);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a non existing Station details', function(done) {
		agent
			.patch('/manufacturing/plant-unit-stations/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.send({
				'data': {
					'attributes': {
						'name': 'New Station1',
						'description': 'New Station under Newly added Plant Unit',
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
					'id': '25a77cbf-f1ad-43b2-8aa0-cab8585636de',
					'type': 'manufacturing/plant-unit-stations'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a Station by giving Name field as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-stations/${newStationId}`)
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': 'New Station under Newly added Plant Unit',
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
					'id': newStationId,
					'type': 'manufacturing/plant-unit-stations'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to edit a Station details if all required fields are filled', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-stations/${newStationId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Station1',
						'description': 'New Station under Newly added Plant Unit',
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
					'id': newStationId,
					'type': 'manufacturing/plant-unit-stations'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to add availible Data Set to Station', function(done) {
		agent
			.post('/manufacturing/plant-unit-station-attribute-sets')
			.send({
				'data': {
					'attributes': {
						'evaluation_order': 1
					},
					'relationships': {
						'tenant_plant_unit_station': {
							'data': {
								'id': newStationId,
								'type': 'manufacturing/plant-unit-stations'
							}
						},
						'tenant_attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'manufacturing/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'manufacturing/plant-unit-station-attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newStationDataSetId = response.body.data.id;
				done(err);
			});
	});

	it('Should return empty object if we try to get non existing Station Data Set details', function(done) {
		agent
			.get('/manufacturing/plant-unit-station-attribute-sets/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response.body.data).to.be.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Station Data Set details', function(done) {
		agent
			.get(`/manufacturing/plant-unit-station-attribute-sets/${newStationDataSetId}?_=1567157414325&include=trq`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to get details of added Station Data Set', function(done) {
		agent
			.get(`/manufacturing/plant-unit-station-attribute-sets/${newStationDataSetId}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('tenant_attribute_set_id').eql(newAttributeSetId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('tenant_plant_unit_station_id').eql(newStationId);
				expect(response.body.data).to.have.property('id').eql(newStationDataSetId);
				done(err);
			});
	});

	// it('Should be able to edit evaluation order of Station Data Set', function(done) {
	// 	agent
	// 		.patch(`/manufacturing/plant-unit-station-attribute-sets/${newStationDataSetId}`)
	// 		.send({
	// 			'data': {
	// 				'attributes': {
	// 					'evaluation_order': 2
	// 				},
	// 				'relationships': {
	// 					'tenant_plant_unit_station': {},
	// 					'tenant_attribute_set': {
	// 						'data': {
	// 							'type': 'manufacturing/attribute-sets'
	// 						}
	// 					},
	// 					'tenant': {
	// 						'data': {
	// 							'id': tenantId,
	// 							'type': 'settings/account/basics/tenants'
	// 						}
	// 					}
	// 				},
	// 				'id': newStationDataSetId,
	// 				'type': 'manufacturing/plant-unit-station-attribute-sets'
	// 			}
	// 		})
	// 		.end((err, response) => {
	// 			console.error('response error 14:', JSON.stringify(response));
	// 			expect(response).to.have.status(200);
	// 			done(err);
	// 		});
	// });

	it('Should not be able to add a Line if Name is null or empty string', function(done) {
		agent
			.post('/manufacturing/plant-unit-lines')
			.send({
				'data': {
					'attributes': {
						'name': ' ',
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
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Line if all required details are filled', function(done) {
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
			.end((err, response) => {
				expect(response).to.have.status(200);
				newLineId = response.body.data.id;
				done(err);
			});
	});

	it('should throw an error if we try to get details of a non existing Line', function(done) {
		agent
			.get('/manufacturing/plant-unit-lines/25a77cbf-f1ad-43b2-8aa0-cab8585636de?_=1567150110753')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Line details', function(done) {
		agent
			.get(`/manufacturing/plant-unit-lines/${newLineId}?_=1567157414325&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added Line', function(done) {
		agent
			.get(`/manufacturing/plant-unit-lines/${newLineId}?_=1567157414325`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('New Line');
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('tags').eql(null);
				expect(response.body.data.attributes).to.have.property('tenant_plant_unit_id').eql(newPlantUnitId);
				expect(response.body.data).to.have.property('id').eql(newLineId);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching all existing Lines', function(done) {
		agent
			.get(`/manufacturing/plant-unit-lines?_=1567157414325&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to get all existing Lines', function(done) {
		agent
			.get(`/manufacturing/plant-unit-lines`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a non existing Line details', function(done) {
		agent
			.patch('/manufacturing/plant-unit-lines/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.send({
				'data': {
					'attributes': {
						'name': 'New Line1',
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
					'id': '25a77cbf-f1ad-43b2-8aa0-cab8585636de',
					'type': 'manufacturing/plant-unit-lines'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a Line by giving Name field as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-lines/${newLineId}`)
			.send({
				'data': {
					'attributes': {
						'name': ' ',
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
					'id': newLineId,
					'type': 'manufacturing/plant-unit-lines'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to edit a Line details if all required fields are filled', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-lines/${newLineId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Line1',
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
					'id': newLineId,
					'type': 'manufacturing/plant-unit-lines'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to add non existing Data Set to line', function(done) {
		agent
			.post('/manufacturing/plant-unit-line-attribute-sets')
			.send({
				'data': {
					'attributes': {
						'evaluation_order': 1
					},
					'relationships': {
						'tenant_plant_unit_line': {
							'data': {
								'id': newLineId,
								'type': 'manufacturing/plant-unit-lines'
							}
						},
						'tenant_attribute_set': {
							'data': {
								'id': '25a77cbf-f1ad-43b2-8aa0-cab8585636de',
								'type': 'manufacturing/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'manufacturing/plant-unit-line-attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add availible Data Set to line', function(done) {
		agent
			.post('/manufacturing/plant-unit-line-attribute-sets')
			.send({
				'data': {
					'attributes': {
						'evaluation_order': 1
					},
					'relationships': {
						'tenant_plant_unit_line': {
							'data': {
								'id': newLineId,
								'type': 'manufacturing/plant-unit-lines'
							}
						},
						'tenant_attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'manufacturing/attribute-sets'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'manufacturing/plant-unit-line-attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newLineDataSetId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw an error if we try to add a non existing machine to the line as tracked entity', function(done) {
		agent
			.post('/manufacturing/plant-unit-line-constituents')
			.send({
				'data': {
					'attributes': {
						'constituent_type': 'machine',
						'step': '1',
						'tenant_plant_unit_line_constituent_id': '25a77cbf-f1ad-43b2-8aa0-cab8585636de'

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
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to add a existing machine to a non existing line as tracked entity', function(done) {
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
								'id': '25a77cbf-f1ad-43b2-8aa0-cab8585636de',
								'type': 'manufacturing/plant-unit-lines'
							}
						}
					},
					'type': 'manufacturing/plant-unit-line-constituents'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to add a existing machine to a line as tracked entity without providing order', function(done) {
		agent
			.post('/manufacturing/plant-unit-line-constituents')
			.send({
				'data': {
					'attributes': {
						'constituent_type': 'machine',
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
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add a existing machine to the line as tracked entity', function(done) {
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
			.end((err, response) => {
				expect(response).to.have.status(200);
				newLineConstituentId = response.body.data.id;
				done(err);
			});
	});


	it('Should throw an error if we try to add a existing machine to a line as tracked entity with already existing order', function(done) {
		agent
			.post('/manufacturing/plant-unit-line-constituents')
			.send({
				'data': {
					'attributes': {
						'constituent_type': 'machine',
						'step': '1',
						'tenant_plant_unit_line_constituent_id': newMachineId1

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
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to add a non existing line to already existing line as tracked entity', function(done) {
		agent
			.post('/manufacturing/plant-unit-line-constituents')
			.send({
				'data': {
					'attributes': {
						'constituent_type': 'line',
						'step': '2',
						'tenant_plant_unit_line_constituent_id': '25a77cbf-f1ad-43b2-8aa0-cab8585636de'

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
			.end((err, response) => {
				expect(response).to.have.status(422);
				if(err) {
					done(err);
					return;
				}

				agent
					.post('/manufacturing/plant-unit-lines')
					.send({
						'data': {
							'attributes': {
								'name': 'New Test Line',
								'description': 'New Test Line under Newly added Plant Unit',
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
					.end((err1, response1) => {
						newLineId1 = response1.body.data.id;
						done(err1);
					});
			});
	});

	it('Should throw an error if we try to add newly created line to a non existing line as tracked entity', function(done) {
		agent
			.post('/manufacturing/plant-unit-line-constituents')
			.send({
				'data': {
					'attributes': {
						'constituent_type': 'line',
						'step': '2',
						'tenant_plant_unit_line_constituent_id': newLineId1

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
								'id': '25a77cbf-f1ad-43b2-8aa0-cab8585636de',
								'type': 'manufacturing/plant-unit-lines'
							}
						}
					},
					'type': 'manufacturing/plant-unit-line-constituents'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to add newly created line to a line as tracked entity without providing order', function(done) {
		agent
			.post('/manufacturing/plant-unit-line-constituents')
			.send({
				'data': {
					'attributes': {
						'constituent_type': 'line',
						'tenant_plant_unit_line_constituent_id': newLineId1

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
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add newly created line to existing line as tracked entity', function(done) {
		agent
			.post('/manufacturing/plant-unit-line-constituents')
			.send({
				'data': {
					'attributes': {
						'constituent_type': 'line',
						'step': '2',
						'tenant_plant_unit_line_constituent_id': newLineId1

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
			.end((err, response) => {
				expect(response).to.have.status(200);
				newLineConstituentId1 = response.body.data.id;
				if(err) {
					done(err);
					return;
				}

				agent
					.post('/manufacturing/plant-unit-lines')
					.send({
						'data': {
							'attributes': {
								'name': 'New Test Line 2',
								'description': 'New Test Line under Newly added Plant Unit',
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
					.end((err1, response1) => {
						newLineId2 = response1.body.data.id;
						done(err1);
					});
			});
	});

	it('should throw an error if we try to get details of a non existing Line Constituent', function(done) {
		agent
			.get('/manufacturing/plant-unit-line-constituents/25a77cbf-f1ad-43b2-8aa0-cab8585636de?_=1567150110753')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Line Constituent details', function(done) {
		agent
			.get(`/manufacturing/plant-unit-line-constituents/${newLineId}?_=1567157414325&include=trlm`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added Line Constituent', function(done) {
		agent
			.get(`/manufacturing/plant-unit-line-constituents/${newLineId}?_=1567157414325`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to add newly created line to a line as tracked entity with already existing order', function(done) {
		agent
			.post('/manufacturing/plant-unit-line-constituents')
			.send({
				'data': {
					'attributes': {
						'constituent_type': 'line',
						'step': '2',
						'tenant_plant_unit_line_constituent_id': newLineId2

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
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to get non existing Line Data Set details', function(done) {
		agent
			.get('/manufacturing/plant-unit-line-attribute-sets/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response.body.data).to.be.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Line Data Set details', function(done) {
		agent
			.get(`/manufacturing/plant-unit-line-attribute-sets/${newLineDataSetId}?_=1567157414325&include=trq`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to get details of added Line Data Set', function(done) {
		agent
			.get(`/manufacturing/plant-unit-line-attribute-sets/${newLineDataSetId}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('tenant_attribute_set_id').eql(newAttributeSetId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('tenant_plant_unit_line_id').eql(newLineId);
				expect(response.body.data).to.have.property('id').eql(newLineDataSetId);
				done(err);
			});
	});

	// it('Should be able to edit evaluation order of Line Data Set', function(done) {
	// 	agent
	// 		.patch(`/manufacturing/plant-unit-line-attribute-sets/${newLineDataSetId}`)
	// 		.send({
	// 			'data': {
	// 				'attributes': {
	// 					'evaluation_order': 2
	// 				},
	// 				'relationships': {
	// 					'tenant_plant_unit_line': {},
	// 					'tenant_attribute_set': {
	// 						'data': {
	// 							'type': 'manufacturing/attribute-sets'
	// 						}
	// 					},
	// 					'tenant': {
	// 						'data': {
	// 							'id': tenantId,
	// 							'type': 'settings/account/basics/tenants'
	// 						}
	// 					}
	// 				},
	// 				'id': newLineDataSetId,
	// 				'type': 'manufacturing/plant-unit-line-attribute-sets'
	// 			}
	// 		})
	// 		.end((err, response) => {
	// 			console.error('response error 19:', JSON.stringify(response));
	// 			expect(response).to.have.status(200);
	// 			done(err);
	// 		});
	// });

	it('should be able to get details of all availible attribute set', function(done) {
		agent
			.get('/manufacturing/attribute-sets?_=1567157414382')
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data[0].attributes).to.have.property('name').eql('Std. Machine Data Set');
				expect(response.body.data[0].attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data[0].attributes).to.have.property('tenant_folder_id').eql(dataSetsNodeId);
				done(err);
			});
	});

	it('Should throw an error if we try to delete non existing tracked machine from the line', function(done) {
		agent
			.del('/manufacturing/plant-unit-line-constituents/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete added tracked machine from the line', function(done) {
		agent
			.del(`/manufacturing/plant-unit-line-constituents/${newLineConstituentId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete non existing tracked line from the line', function(done) {
		agent
			.del('/manufacturing/plant-unit-line-constituents/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete added tracked line from the line', function(done) {
		agent
			.del(`/manufacturing/plant-unit-line-constituents/${newLineConstituentId1}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Machine Data Set', function(done) {
		agent
			.del('/manufacturing/plant-unit-machine-attribute-sets/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete added Machine Data set', function(done) {
		agent
			.del(`/manufacturing/plant-unit-machine-attribute-sets/${newMachineDataSetId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Station Data Set', function(done) {
		agent
			.del('/manufacturing/plant-unit-station-attribute-sets/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete added Station Data set', function(done) {
		agent
			.del(`/manufacturing/plant-unit-station-attribute-sets/${newStationDataSetId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Station', function(done) {
		agent
			.del('/manufacturing/plant-unit-stations/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete added Station', function(done) {
		agent
			.del(`/manufacturing/plant-unit-stations/${newStationId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Line Data Set', function(done) {
		agent
			.del('/manufacturing/plant-unit-line-attribute-sets/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete added Line Data set', function(done) {
		agent
			.del(`/manufacturing/plant-unit-line-attribute-sets/${newLineDataSetId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Line', function(done) {
		agent
			.del('/manufacturing/plant-unit-lines/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete added Line', function(done) {
		agent
			.del(`/manufacturing/plant-unit-lines/${newLineId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing IoT Gateway', function(done) {
		agent
			.del('/manufacturing/plant-unit-drivers/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete added Iot Gateway', function(done) {
		agent
			.del(`/manufacturing/plant-unit-drivers/${newIoTGatewayId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Machine', function(done) {
		agent
			.del('/manufacturing/plant-unit-machines/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete added Machine', function(done) {
		agent
			.del(`/manufacturing/plant-unit-machines/${newMachineId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Plant Unit', function(done) {
		agent
			.del('/manufacturing/plant-units/13c9393c-83d1-4667-8f1f-9d357f6ce7a5')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete added Plant unit', function(done) {
		agent
			.del(`/manufacturing/plant-units/${newPlantUnitId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Plant', function(done) {
		agent
			.del('/manufacturing/plants/13c9393c-83d1-4667-8f1f-9d357f6ce7a5')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete added Plant', function(done) {
		agent
			.del(`/manufacturing/plants/${newPlantId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Attribute Set Function Observed Property', function(done) {
		agent
			.del('/manufacturing/attribute-set-function-observed-properties/44056e3f-a529-476b-8c03-cd21324b6e97')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete added Attribute Set Function Observed Property', function(done) {
		agent
			.del(`/manufacturing/attribute-set-function-observed-properties/${newAttributeSetFunctionObservedPropertyId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Attribute Set Property', function(done) {
		agent
			.del('/manufacturing/attribute-set-properties/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete created Attribute Set Property', function(done) {
		agent
			.del(`/manufacturing/attribute-set-properties/${newAttributeSetPropertyId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Attribute Set Function', function(done) {
		agent
			.del('/manufacturing/attribute-set-functions/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete created Attribute Set Function', function(done) {
		agent
			.del(`/manufacturing/attribute-set-functions/${newAttributeSetFunctionId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Attribute set', function(done) {
		agent
			.del('/manufacturing/attribute-sets/13c9393c-83d1-4667-8f1f-9d357f6ce7a5')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete created Attribute Set', function(done) {
		agent
			.del(`/manufacturing/attribute-sets/${newAttributeSetId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

});
