'use strict';

const chai = require('chai'); // eslint-disable-line node/no-unpublished-require
const chaiHttp = require('chai-http'); // eslint-disable-line node/no-unpublished-require
const fs = require('fs');

chai.use(chaiHttp);


describe('External Master Data Feature Test Cases', function() {
	const agent = chai.request.agent('http://localhost:9100');
	const agnt = chai.request.agent('http://pw.plant.works:9100');
	const expect = chai.expect;
	let tenantId, tenantId1;
	let dataSetsNodeId, nodeId, uploadConfigNodeId;
	let newFolderId;
	let newAttributeSetFunctionId, newAttributeSetFunctionObservedPropertyId, newAttributeSetId, newAttributeSetObserverFunctionId, newAttributeSetPropertyId, newAttributeSetPropertyId1;
	let newEmdConfigDataSetId, newUploadConfigId;
	let invalidXlData, textData, updatedXlData, xlData;

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

	before(function(done) {
		agnt
			.post('/session/login')
			.type('form')
			.send({
				'username': 'root@plant.works',
				'password': 'plantworks'
			})
			.end((err) => {
				done(err);
			});
	});

	after(function(done) {
		const relPath = __dirname.split('/test/features');
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		fs.unlink(`${relPath[0]}/generated/emd_${newUploadConfigId.replace(/-/g, '_')}_evaluator.js`, (err) =>{
			if(err) done(err);
		});
		agent
			.del(`/emd/attribute-set-functions/${newAttributeSetObserverFunctionId}`)
			.end((err) => {
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

	it('Should be able to add new Attribute set if required fields are filled', function(done) {
		agnt
			.post('/emd/attribute-sets')
			.send({
				'data': {
					'attributes': {
						'name': 'New Attribute Set test',
						'description': 'New Attribute set under Data Sets'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': dataSetsNodeId,
								'type': 'emd/folders'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId1,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'emd/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				// newAttributeSetId = response.body.data.id;
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
					.end((err1, response1) => {
						expect(response1).to.have.status(200);
						if(err1) {
							done(err1);
							return;
						}

						agent
							.get('/session/user?_=1565679224509')
							.end((error, response2) => {
								tenantId = response2.body.tenant_id;
								done(error);
							});
					});
			});
	});


	it('Should return proper Node details', function(done) {
		agent
			.get('/configure/nodes?_=1571066917331')
			.set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36')
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data[1].attributes).to.have.property('name').eql('Emd');
				expect(response.body.data[1].attributes).to.have.property('node_type').eql('root-folder');
				expect(response.body.data[1].attributes).to.have.property('route').eql('emd');
				nodeId = response.body.data[1].id;
				done(err);
			});
	});
	// Attribute folder and emd-config folder will be at random index too so some times so we are using if-else statement.

	it('Should return existing tree for Root node', function(done) {
		agent
			.get(`/emd/tree-nodes?node_id=${nodeId}&node_type=root-folder&_=1567414700694`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				if(response.body[0].data.type === 'attribute-folder') {
					expect(response.body[0]).to.have.property('children').eql(true);
					expect(response.body[0]).to.have.property('parent').eql(nodeId);
					expect(response.body[0].data).to.have.property('type').eql('attribute-folder');
					expect(response.body[1]).to.have.property('children').eql(true);
					expect(response.body[1]).to.have.property('parent').eql(nodeId);
					expect(response.body[1].data).to.have.property('type').eql('emd-config-folder');
					uploadConfigNodeId = response.body[1].id;
					dataSetsNodeId = response.body[0].id;
				}
				else {
					expect(response.body[0]).to.have.property('children').eql(true);
					expect(response.body[0]).to.have.property('parent').eql(nodeId);
					expect(response.body[0].data).to.have.property('type').eql('emd-config-folder');
					expect(response.body[1]).to.have.property('children').eql(true);
					expect(response.body[1]).to.have.property('parent').eql(nodeId);
					expect(response.body[1].data).to.have.property('type').eql('attribute-folder');
					uploadConfigNodeId = response.body[0].id;
					dataSetsNodeId = response.body[1].id;
				}
				done(err);
			});
	});

	it('Should return existing tree for Emd Config Node', function(done) {
		agent
			.get(`/emd/tree-nodes?node_id=${uploadConfigNodeId}&node_type=emd-config-folder&_=1571140450140`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('should return Root Tenant folder details', function(done) {
		agent
			.get(`/emd/folders/${nodeId}?_=1567414700691`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('emd_feature.folder_names.root.name');
				expect(response.body.data.attributes).to.have.property('description').eql('emd_feature.folder_names.root.description');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(null);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	it('should return Data Sets folder details', function(done) {
		agent
			.get(`/emd/folders/${dataSetsNodeId}?_=1567414700692`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('emd_feature.folder_names.attribute_sets.name');
				expect(response.body.data.attributes).to.have.property('description').eql('emd_feature.folder_names.attribute_sets.description');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(nodeId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	it('should return Upload Configurations folder details', function(done) {
		agent
			.get(`/emd/folders/${uploadConfigNodeId}?_=1567414700693`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('emd_feature.folder_names.emd_configurations.name');
				expect(response.body.data.attributes).to.have.property('description').eql('emd_feature.folder_names.emd_configurations.description');
				expect(response.body.data.attributes).to.have.property('parent_id').eql(nodeId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a folder details', function(done) {
		agent
			.get(`/emd/folders/${nodeId}?_=1567414700691&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should not be able to create a folder with empty Name under Data Sets', function(done) {
		agent
			.post('/emd/folders')
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
					'type': 'emd/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to create a folder under Data Sets if all details are valid', function(done) {
		agent
			.post('/emd/folders')
			.send({
				'data': {
					'attributes': {
						'name': 'New folder',
						'description': 'New folder under Data Sets'
					},
					'relationships': {
						'parent': {
							'data': {
								'id': dataSetsNodeId,
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
					'type': 'emd/folders'
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
			.patch(`/emd/folders/${newFolderId}`)
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
					'id': newFolderId,
					'type': 'emd/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to update folder details if all required details are filled', function(done) {
		agent
			.patch(`/emd/folders/${newFolderId}`)
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
					'id': newFolderId,
					'type': 'emd/folders'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing folder', function(done) {
		agent
			.del(`/emd/folders/13c9393c-83d1-4667-8f1f-9d357f6ce7a5`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete existing folder', function(done) {
		agent
			.del(`/emd/folders/${newFolderId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should not be able to add new Attribute set if Name is null or empty string', function(done) {
		agent
			.post('/emd/attribute-sets')
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
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Attribute set if required fields are filled', function(done) {
		agent
			.post('/emd/attribute-sets')
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
			.end((err, response) => {
				expect(response).to.have.status(200);
				newAttributeSetId = response.body.data.id;
				done(err);
			});
	});

	it('should throw an error if we try to get details of a non existing attribute set', function(done) {
		agent
			.get('/emd/attribute-sets/25a77cbf-f1ad-43b2-8aa0-cab8585636de?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a attribute set details', function(done) {
		agent
			.get(`/emd/attribute-sets/${newAttributeSetId}?_=1567147599011&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added attribute set', function(done) {
		agent
			.get(`/emd/attribute-sets/${newAttributeSetId}?_=1567147599011`)
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
			.patch('/emd/attribute-sets/44056e3f-a529-476b-8c03-cd21324b6e97')
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
					'id': '44056e3f-a529-476b-8c03-cd21324b6e97',
					'type': 'emd/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a attribute set by giving null or empty string as Name', function(done) {
		agent
			.patch(`/emd/attribute-sets/${newAttributeSetId}`)
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
					'id': newAttributeSetId,
					'type': 'emd/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to update attribute set if all reqired fields are filled', function(done) {
		agent
			.patch(`/emd/attribute-sets/${newAttributeSetId}`)
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
					'id': newAttributeSetId,
					'type': 'emd/attribute-sets'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('should throw an error if we provide invalid query params while fetching details of all existing attribute sets', function(done) {
		agent
			.get('/emd/attribute-sets?_=1567147599011&include=trune')
			.end((err, response) => {
				console.error('response body:', response.body);
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should get details of existing attribute sets', function(done) {
		agent
			.get('/emd/attribute-sets')
			.end((err, response) => {
				console.error('response body 2:', response.body);
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should not be able to add new Data Set Property if Name is null or empty string', function(done) {
		agent
			.post('/emd/attribute-set-properties')
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
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Data Set Property if all required details are filled', function(done) {
		agent
			.post('/emd/attribute-set-properties')
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
			.end((err, response) => {
				expect(response).to.have.status(200);
				newAttributeSetPropertyId = response.body.data.id;
				done(err);
			});
	});

	it('should throw an error if we try to get details of a non existing attribute set property', function(done) {
		agent
			.get('/emd/attribute-set-properties/25a77cbf-f1ad-43b2-8aa0-cab8585636de?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a attribute set details', function(done) {
		agent
			.get(`/emd/attribute-set-properties/${newAttributeSetPropertyId}?_=1567149414732&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added attribute set property', function(done) {
		agent
			.get(`/emd/attribute-set-properties/${newAttributeSetPropertyId}?_=1567149414732`)
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
			.patch('/emd/attribute-set-properties/44056e3f-a529-476b-8c03-cd21324b6e97')
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
					'id': '44056e3f-a529-476b-8c03-cd21324b6e97',
					'type': 'emd/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a Attribute Set Property by giving Name field as null or empty string', function(done) {
		agent
			.patch(`/emd/attribute-set-properties/${newAttributeSetPropertyId}`)
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
					'id': newAttributeSetPropertyId,
					'type': 'emd/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to edit a Attribute Set Property if all required fields are filled', function(done) {
		agent
			.patch(`/emd/attribute-set-properties/${newAttributeSetPropertyId}`)
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
					'id': newAttributeSetPropertyId,
					'type': 'emd/attribute-set-properties'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				if(err) {
					done(err);
					return;
				}

				agent
					.post('/emd/attribute-set-properties')
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
					.end((err1, response1) => {
						newAttributeSetPropertyId1 = response1.body.data.id;
						done(err1);
					});
			});
	});

	it('Should not be able to add new Data Set function if Name is null or empty string', function(done) {
		agent
			.post('/emd/attribute-set-functions')
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
					'type': 'emd/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Data Set Function if all required details are filled', function(done) {
		agent
			.post('/emd/attribute-set-functions')
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
					'type': 'emd/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newAttributeSetFunctionId = response.body.data.id;
				done(err);
			});
	});

	it('should throw an error if we try to get details of a non existing attribute set function', function(done) {
		agent
			.get('/emd/attribute-set-functions/25a77cbf-f1ad-43b2-8aa0-cab8585636de?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a attribute set details', function(done) {
		agent
			.get(`/emd/attribute-set-functions/${newAttributeSetFunctionId}?_=1567147599011&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added attribute set function', function(done) {
		agent
			.get(`/emd/attribute-set-functions/${newAttributeSetFunctionId}?_=1567147599011`)
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
			.patch('/emd/attribute-set-functions/44056e3f-a529-476b-8c03-cd21324b6e97')
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
					'id': '44056e3f-a529-476b-8c03-cd21324b6e97',
					'type': 'emd/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a Attribute Set Function by giving Name field as null or empty string', function(done) {
		agent
			.patch(`/emd/attribute-set-functions/${newAttributeSetFunctionId}`)
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
					'id': newAttributeSetFunctionId,
					'type': 'emd/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to edit a Attribute Set Functions if all required fields are filled', function(done) {
		agent
			.patch(`/emd/attribute-set-functions/${newAttributeSetFunctionId}`)
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
					'id': newAttributeSetFunctionId,
					'type': 'emd/attribute-set-function'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to add new Data Set Observer Function', function(done) {
		agent
			.post('/emd/attribute-set-functions')
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
					'type': 'emd/attribute-set-functions'
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
			.post('/emd/attribute-set-function-observed-properties')
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'emd/attribute-sets'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': '44056e3f-a529-476b-8c03-cd21324b6e97',
								'type': 'emd/attribute-set-properties'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': newAttributeSetObserverFunctionId,
								'type': 'emd/attribute-set-properties'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'emd/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to add Data Set Property to a non existing Observer Function', function(done) {
		agent
			.post('/emd/attribute-set-function-observed-properties')
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'emd/attribute-sets'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': newAttributeSetPropertyId,
								'type': 'emd/attribute-set-properties'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': '44056e3f-a529-476b-8c03-cd21324b6e97',
								'type': 'emd/attribute-set-properties'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'emd/attribute-set-functions'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add new Data Set Property to Observer Function', function(done) {
		agent
			.post('/emd/attribute-set-function-observed-properties')
			.send({
				'data': {
					'relationships': {
						'attribute_set': {
							'data': {
								'id': newAttributeSetId,
								'type': 'emd/attribute-sets'
							}
						},
						'attribute_set_property': {
							'data': {
								'id': newAttributeSetPropertyId,
								'type': 'emd/attribute-set-properties'
							}
						},
						'attribute_set_function': {
							'data': {
								'id': newAttributeSetObserverFunctionId,
								'type': 'emd/attribute-set-properties'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'type': 'emd/attribute-set-functions'
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
			.get('/emd/attribute-set-function-observed-properties/44056e3f-a529-476b-8c03-cd21324b6e97?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a Data Set Function Observed Property details', function(done) {
		agent
			.get(`/emd/attribute-set-function-observed-properties/${newAttributeSetFunctionObservedPropertyId}?_=1571304871241&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to get details of added Data Set Function Observed Property', function(done) {
		agent
			.get(`/emd/attribute-set-function-observed-properties/${newAttributeSetFunctionObservedPropertyId}?_=1571304871241`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('attribute_set_function_id').eql(newAttributeSetObserverFunctionId);
				expect(response.body.data.attributes).to.have.property('attribute_set_property_id').eql(newAttributeSetPropertyId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('attribute_set_id').eql(newAttributeSetId);
				done(err);
			});
	});

	it('Should not be able to add a new Emd Upload Configuration if Name is null or empty string', function(done) {
		agent
			.post('/emd/configurations')
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': 'New Emd Upload Configuration under Upload Configurations'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': uploadConfigNodeId,
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
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add a new Emd Upload Configuration if all required fields are filled', function(done) {
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
								'id': uploadConfigNodeId,
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
			.end((err, response) => {
				expect(response).to.have.status(200);
				newUploadConfigId = response.body.data.id;
				done(err);
			});
	});

	it('should throw an error if we provide invalid query params in url while fetching all existing Emd Upload Configurations', function(done) {
		agent
			.get('/emd/configurations?_=1567150110744&include=t')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should get details of all existing Emd Upload Configurations', function(done) {
		agent
			.get('/emd/configurations')
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('should throw an error if we try to get details of a non existing Emd Upload Configuration', function(done) {
		agent
			.get('/emd/configurations/25a77cbf-f1ad-43b2-8aa0-cab8585636de?_=1567062554849')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a attribute set details', function(done) {
		agent
			.get(`/emd/configurations/${newUploadConfigId}?_=1567150110744&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of Emd Upload Configuration', function(done) {
		agent
			.get(`/emd/configurations/${newUploadConfigId}?_=1567150110744`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('name').eql('New Emd Upload Configuration');
				expect(response.body.data.attributes).to.have.property('tenant_folder_id').eql(uploadConfigNodeId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data).to.have.property('id').eql(newUploadConfigId);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a non existing Emd Upload Configuration details', function(done) {
		agent
			.patch('/emd/configurations/465f1a46-46a6-4ab1-8674-1d18c6fe427am6r')
			.send({
				'data': {
					'attributes': {
						'name': 'New Emd Upload Configuration1',
						'description': 'New Emd Upload Configuration under Upload Configurations1'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': uploadConfigNodeId,
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
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to edit a Emd Upload Configuration by giving null or empty string as Name', function(done) {
		agent
			.patch(`/emd/configurations/${newUploadConfigId}`)
			.send({
				'data': {
					'attributes': {
						'name': ' ',
						'description': 'New Emd Upload Configuration under Upload Configurations1'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': uploadConfigNodeId,
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
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to update Emd Upload Configuration if all reqired fields are filled', function(done) {
		agent
			.patch(`/emd/configurations/${newUploadConfigId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Emd Upload Configuration1',
						'description': 'New Emd Upload Configuration under Upload Configurations1'
					},
					'relationships': {
						'folder': {
							'data': {
								'id': uploadConfigNodeId,
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
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to update Emd Upload Configuration if Attribute Set Meta Data is provided', function(done) {
		agent
			.patch(`/emd/configurations/${newUploadConfigId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Emd Upload Configuration1',
						'description': 'New Emd Upload Configuration under Upload Configurations1',
						'attribute_set_metadata': []
					},
					'relationships': {
						'folder': {
							'data': {
								'id': uploadConfigNodeId,
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
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to add availible Data Set to Emd Upload Configuration', function(done) {
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
								'id': newAttributeSetId,
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
			.end((err, response) => {
				setTimeout(() => {
					expect(response).to.have.status(200);
					newEmdConfigDataSetId = response.body.data.id;
					done(err);
				}, 45000);
			});
	});

	it('Should not be able to upload excel sheet if none of the Attribute Set parameters are made Unique', function(done) {
		agent
			.post(`/emd/uploadData/${newUploadConfigId}`)
			.set('Content-Type', 'multipart/form-data; boundary=----WebKitFormBoundaryiekbkGNf2y4NuMCv')
			.field('relativePath', '')
			.field('name', 'avatar.xlsx')
			.field('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
			.attach('emdFile', xlData, 'avatar')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to add Attribute Set Meta Data to the Emd Upload Configuration', function(done) {
		agent
			.patch(`/emd/configurations/${newUploadConfigId}`)
			.send({
				'data': {
					'attributes': {
						'name': 'New Emd Upload Configuration1',
						'description': 'New Emd Upload Configuration under Upload Configurations1',
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
								'id': uploadConfigNodeId,
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
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error if we try to upload excel sheet that do not contain unique parameter', function(done) {
		agent
			.post(`/emd/uploadData/${newUploadConfigId}`)
			.set('Content-Type', 'multipart/form-data; boundary=----WebKitFormBoundaryiekbkGNf2y4NuMCv')
			.field('relativePath', '')
			.field('name', 'exampletests.xls')
			.field('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
			.attach('emdFile', invalidXlData, 'exampletests')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error if we try to upload text file instead of excel sheet', function(done) {
		agent
			.post(`/emd/uploadData/${newUploadConfigId}`)
			.set('Content-Type', 'multipart/form-data; boundary=----WebKitFormBoundaryiekbkGNf2y4NuMCv')
			.field('relativePath', '')
			.field('name', 'test.txt')
			.field('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
			.attach('emdFile', textData, 'test')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to upload excel sheet', function(done) {
		agent
			.post(`/emd/uploadData/${newUploadConfigId}`)
			.set('Content-Type', 'multipart/form-data; boundary=----WebKitFormBoundaryiekbkGNf2y4NuMCv')
			.field('relativePath', '')
			.field('name', 'avatar.xlsx')
			.field('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
			.attach('emdFile', xlData, 'avatar')
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to commit the uploaded excel sheet data', function(done) {
		agent
			.post(`/emd/commitData/${newUploadConfigId}`)
			.send([{
				'approved': true,
				'new': true,
				'showDiff': false,
				'uniqueIdParameter': 'ID',
				'attributes': {
					'ID': '56',
					'NAME': 'ashish s'
				},
				'tagTypeMap': {
					'ID': 'string',
					'NAME': 'string'
				},
				'id': newUploadConfigId
			}, {
				'approved': true,
				'new': true,
				'showDiff': false,
				'uniqueIdParameter': 'ID',
				'attributes': {
					'ID': '58',
					'NAME': 'ash'
				},
				'tagTypeMap': {
					'ID': 'string',
					'NAME': 'string'
				},
				'id': newUploadConfigId
			}, {
				'approved': true,
				'new': true,
				'showDiff': false,
				'uniqueIdParameter': 'ID',
				'attributes': {
					'ID': '57',
					'NAME': 'ashis'
				},
				'tagTypeMap': {
					'ID': 'string',
					'NAME': 'string'
				},
				'id': newUploadConfigId
			}])
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should be able to update the values if we change any parameter values in excel sheet and upload', function(done) {
		agent
			.post(`/emd/uploadData/${newUploadConfigId}`)
			.set('Content-Type', 'multipart/form-data; boundary=----WebKitFormBoundaryiekbkGNf2y4NuMCv')
			.field('relativePath', '')
			.field('name', 'avatar.xlsx')
			.field('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
			.attach('emdFile', updatedXlData, 'avatar')
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body[0][1].attributes).to.have.property('ID').eql('58');
				expect(response.body[0][2].attributes).to.have.property('ID').eql('57');
				expect(response.body[0][1].attributes).to.have.property('NAME').eql('ash');
				expect(response.body[0][2].attributes).to.have.property('NAME').eql('ashis');
				// expect(response.body[0][1].diff).to.have.property('NAME').eql('ash s');
				// expect(response.body[0][2].diff).to.have.property('NAME').eql('ashish new');
				if(err) {
					done(err);
					return;
				}

				agent
				.patch(`/emd/attribute-set-properties/${newAttributeSetPropertyId1}`)
				.send({
					'data': {
						'attributes': {
							'name': 'name',
							'description': 'New Data Set Property1',
							'source': 'static',
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
						'id': newAttributeSetPropertyId1,
						'type': 'emd/attribute-set-properties'
					}
				})
				.end((err1) => {
					done(err1);
				});
			});
	});

	it('Should throw an error if we provide values to a static parameter in excel sheet while uploading', function(done) {
		agent
			.post(`/emd/uploadData/${newUploadConfigId}`)
			.set('Content-Type', 'multipart/form-data; boundary=----WebKitFormBoundaryiekbkGNf2y4NuMCv')
			.field('relativePath', '')
			.field('name', 'avatar.xlsx')
			.field('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
			.attach('emdFile', xlData, 'avatar')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should throw an error if we try to get details of non existing Emd Upload Configuration Data set', function(done) {
		agent
			.get('/emd/configuration-attribute-sets/25a77cbf-f1ad-43b2-8aa0-cab8585636de?_=1567503045450')
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should throw an error if we provide invalid query params in url while fetching a attribute set details', function(done) {
		agent
			.get(`/emd/configuration-attribute-sets/${newEmdConfigDataSetId}?_=1567503045450&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('should be able to get details of added Emd Upload Configuration Data set', function(done) {
		agent
			.get(`/emd/configuration-attribute-sets/${newEmdConfigDataSetId}?_=1567503045450`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body.data.attributes).to.have.property('tenant_attribute_set_id').eql(newAttributeSetId);
				expect(response.body.data.attributes).to.have.property('tenant_id').eql(tenantId);
				expect(response.body.data.attributes).to.have.property('tenant_emd_configuration_id').eql(newUploadConfigId);
				expect(response.body.data).to.have.property('id').eql(newEmdConfigDataSetId);
				done(err);
			});
	});

	it('Should return existing Application Tree for Root node', function(done) {
		agent
			.get(`/emd/tree?id=%23&_=1571380304576`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body[0]).to.have.property('parent').eql('#');
				expect(response.body[0]).to.have.property('text').eql('emd_feature.folder_names.emd_configurations.name');
				expect(response.body[0].data).to.have.property('type').eql('emd/folder');
				expect(response.body[0].data).to.have.property('intl').eql(true);
				expect(response.body[1].data).to.have.property('type').eql('emd/configuration');
				expect(response.body[1].data).to.have.property('intl').eql(false);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Emd Upload Configuration Data set', function(done) {
		agent
			.del(`/emd/configuration-attribute-sets/25a77cbf-f1ad-43b2-8aa0-cab8585636de`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete added Emd Upload Configuration Data set', function(done) {
		agent
			.del(`/emd/configuration-attribute-sets/${newEmdConfigDataSetId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Emd Upload Configuration', function(done) {
		agent
			.del('/emd/configurations/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete created Emd Upload Configuration', function(done) {
		agent
			.del(`/emd/configurations/${newUploadConfigId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Attribute Set Function Observed Property', function(done) {
		agent
			.del('/emd/attribute-set-function-observed-properties/44056e3f-a529-476b-8c03-cd21324b6e97')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete added Attribute Set Function Observed Property', function(done) {
		agent
			.del(`/emd/attribute-set-function-observed-properties/${newAttributeSetFunctionObservedPropertyId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Attribute Set Function', function(done) {
		agent
			.del('/emd/attribute-set-functions/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete created Attribute Set Function', function(done) {
		agent
			.del(`/emd/attribute-set-functions/${newAttributeSetFunctionId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Attribute Set Property', function(done) {
		agent
			.del('/emd/attribute-set-properties/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete created Attribute Set Property', function(done) {
		agent
			.del(`/emd/attribute-set-properties/${newAttributeSetPropertyId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should throw an error if we try to delete a non existing Attribute set', function(done) {
		agent
			.del('/emd/attribute-sets/25a77cbf-f1ad-43b2-8aa0-cab8585636de')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should be able to delete created Attribute Set', function(done) {
		agent
			.del(`/emd/attribute-sets/${newAttributeSetId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

});
