/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable max-nested-callbacks */
'use strict';

const chai = require('chai'); // eslint-disable-line node/no-unpublished-require
const chaiHttp = require('chai-http'); // eslint-disable-line node/no-unpublished-require
const fs = require('fs');

chai.use(chaiHttp);

describe('Schedule Test Cases', function() {
	const agent = chai.request.agent('http://localhost:9100');
	const expect = chai.expect;

	let nodeId, tenantId;
	let manufacturingNodeId;
	let newMachineMaintenanceId, newMachinePlannedDowntimeId, newMachineScheduleDowntimeId, newPlantHoliday, newPlantUnitHoliday,
		newUnitPlannedDowntimeId, newUnitScheduleDowntimeId, newUnitShiftId;
	let nodeIdTempManufacturing, plantNodeIdTemp, tempMachineId, tempPlantId, tempPlantUnitId;
	// eslint-disable-next-line no-unused-vars
	let maintenanceData, plannedDowntimeData, scheduleDowntimeData;

	// path for the spreadsheets
	const path = __dirname.split('/features');

	// Reading the spreadsheets and storing the data
	fs.readFile(`${path[0]}/user_assets/excelsheet/maintenance.xlsx`, function(err, data) {
		if(err)
			throw err;
		maintenanceData = data;
	});

	fs.readFile(`${path[0]}/user_assets/excelsheet/planned-downtime-machines.xlsx`, function(err, data) {
		if(err)
			throw err;
		plannedDowntimeData = data;
	});

	fs.readFile(`${path[0]}/user_assets/excelsheet/scheduled-downtime-machines.xlsx`, function(err, data) {
		if(err)
			throw err;
		scheduleDowntimeData = data;
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
						if(error) {
							done(error);
							return;
						}

						agent
							.get(`/configure/nodes?_=1569908851488`)
							.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36')
							.end((error1, response1) => {
								nodeIdTempManufacturing = response1.body.data[2].id;
								if(error1) {
									done(error1);
									return;
								}

								agent
									.get(`/manufacturing/config-tree-nodes?node_id=${nodeIdTempManufacturing}&node_type=root-folder&_=1574228443915`)
									.end((error2, response2) => {
										// expect(response2).to.have.status(200);
										// eslint-disable-next-line curly
										if(response2.body[0].data.type === 'attribute-folder') {
											plantNodeIdTemp = response2.body[1].id;
										}
										// eslint-disable-next-line curly
										else {
											plantNodeIdTemp = response2.body[0].id;
										}
										if(error2) {
											done(error2);
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
											.end((error3, response3) => {
												// expect(response3).to.have.status(200);
												tempPlantId = response3.body.data.id;
												if(error3) {
													done(error3);
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
													.end((error4, response4) => {
														// expect(response4).to.have.status(200);
														tempPlantUnitId = response4.body.data.id;
														if(error4) {
															done(error4);
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
															.end((error5, response5) => {
																// expect(response5).to.have.status(200);
																tempMachineId = response5.body.data.id;
																if(error5) {
																	done(error5);
																	return;
																}

																agent
																	.post(`/manufacturing/plant-schedules`)
																	.send({
																		'data': {
																			'attributes': {
																				'description': 'New plant Holiday Temp',
																				'start_date': '2020-07-16T08:10:27.769Z',
																				'end_date': '2020-07-16T08:10:27.769Z',
																				'start_time': '00:00',
																				'end_time': '00:00',
																				'type': 'holiday'
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
																			'type': 'manufacturing/plant-schedules'
																		}
																	})
																	.end((error6) => {
																		// expect(response6).to.have.status(200);
																		if(error6) {
																			done(error6);
																			return;
																		}

																		agent
																			.post(`/manufacturing/plant-unit-schedules`)
																			.send({
																				'data': {
																					'attributes': {
																						'description': 'Temp unit Holiday',
																						'start_date': '2020-07-16T08:10:27.769Z',
																						'end_date': '2020-07-16T08:10:27.769Z',
																						'start_time': '00:00',
																						'end_time': '00:00',
																						'type': 'holiday'
																					},
																					'relationships': {
																						'tenant_plant_unit': {
																							'data': {
																								'id': tempPlantUnitId,
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
																					'type': 'manufacturing/plant-schedules'
																				}
																			})
																			.end((error7) => {
																				// expect(response7).to.have.status(200);
																				done(error7);
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
		// agent
			// .del(`/manufacturing/plants/${tempPlantId}`)
			// .end((err) => {
				// eslint-disable-next-line curly
				// if(err) {
				// 	done(err);
				// }

				agent
					.get('/session/logout')
					.end((err1) => {
						done(err1);
					});
			// });
	});

	it('Should get the details of Node for the Schedule', function(done) {
		agent
			.get(`/schedule/nodes?_=1573888749940`)
			.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36')
			.end((err, response) => {
				expect(response).to.have.status(200);
				nodeId = response.body.data[0].id;
				done(err);
			});
	});

	it('Should get the details for the schedule-tree-node details', function(done) {
		agent
			.get(`/manufacturing/schedule-tree-nodes?node_id=${nodeId}&node_type=root-folder&_=1573888749941`)
			.end((err, response) => {
				manufacturingNodeId = response.body[0].id;
				done(err);
			});
	});

	it('Should get and return the details for the manufacturing node id', function(done) {
		agent
			.get(`/manufacturing/schedule-tree-nodes?node_id=${manufacturingNodeId}&node_type=plant-folder&_=1573888749943`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should get details for the detils for the plant schedule-tree-node', function(done) {
		agent
			.get(`/manufacturing/schedule-tree-nodes?node_id=${tempPlantId}&node_type=plant&_=1573888749945`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test cases for the Plant Level
	// Plant Level will have only Holidays
	it('Should throw error while creating schedule for the plant with start date as null or empty string', function(done) {
		agent
			.post(`/manufacturing/plant-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': ' ',
						'end_date': '2020-06-16T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
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
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating schedule for the plant with end date as null or empty string', function(done) {
		agent
			.post(`/manufacturing/plant-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': ' ',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
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
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating schedule for the plant with start time as null or empty string', function(done) {
		agent
			.post(`/manufacturing/plant-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': '2020-06-26T08:10:27.769Z',
						'start_time': ' ',
						'end_time': '00:00',
						'type': 'holiday'
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
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating schedule for the plant with end time as null or empty string', function(done) {
		agent
			.post(`/manufacturing/plant-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': '2020-06-26T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': ' ',
						'type': 'holiday'
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
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating schedule for the plant with type as null or empty string', function(done) {
		agent
			.post(`/manufacturing/plant-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': '2020-06-26T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': ' '
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
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating holiday for the plant with description as null or empty string', function(done) {
		agent
			.post(`/manufacturing/plant-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': ' ',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': '2020-06-16T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
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
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating holiday for the plant with post date', function(done) {
		agent
			.post(`/manufacturing/plant-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': ' ',
						'start_date': '2019-06-16T08:10:27.769Z',
						'end_date': '2019-06-16T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
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
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create a holiday for the plant with valid description and date', function(done) {
		agent
			.post(`/manufacturing/plant-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'New plant Holiday',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': '2020-06-16T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
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
					'id': newPlantHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newPlantHoliday = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while creating holiday for the plant with duplicate description', function(done) {
		agent
			.post(`/manufacturing/plant-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'New plant Holiday',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': '2020-06-16T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
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
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating multiple holiday for plant with same date', function(done) {
		agent
			.post(`/manufacturing/plant-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'New plant Holiday Dup',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': '2020-06-16T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
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
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating existing holiday with start date as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-schedules/${newPlantHoliday}`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': ' ',
						'end_date': '2020-06-16T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
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
					'id': newPlantHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating existing holiday with end date as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-schedules/${newPlantHoliday}`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': ' ',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
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
					'id': newPlantHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating existing holiday with start time as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-schedules/${newPlantHoliday}`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': '2020-06-26T08:10:27.769Z',
						'start_time': ' ',
						'end_time': '00:00',
						'type': 'holiday'
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
					'id': newPlantHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating existing holiday with end time as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-schedules/${newPlantHoliday}`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': '2020-06-26T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': ' ',
						'type': 'holiday'
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
					'id': newPlantHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating existing holiday with type as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-schedules/${newPlantHoliday}`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': '2020-06-26T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': ' '
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
					'id': newPlantHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating existing holiday with description as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-schedules/${newPlantHoliday}`)
			.send({
				'data': {
					'attributes': {
						'description': ' ',
						'start_date': '2020-06-17T08:10:27.769Z',
						'end_date': '2020-06-17T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
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
					'id': newPlantHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the holiday with duplicate description', function(done) {
		agent
			.patch(`/manufacturing/plant-schedules/${newPlantHoliday}`)
			.send({
				'data': {
					'attributes': {
						'description': 'New plant Holiday Temp',
						'start_date': '2020-06-17T08:10:27.769Z',
						'end_date': '2020-06-17T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
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
					'id': newPlantHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error while updating the holiday with same date as Temp Holiday', function(done) {
		agent
			.patch(`/manufacturing/plant-schedules/${newPlantHoliday}`)
			.send({
				'data': {
					'attributes': {
						'description': 'New Unit Holiday',
						'start_date': '2020-07-16T08:10:27.769Z',
						'end_date': '2020-07-16T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
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
					'id': newPlantHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update the existing holiday with valid description and date', function(done) {
		agent
			.patch(`/manufacturing/plant-schedules/${newPlantHoliday}`)
			.send({
				'data': {
					'attributes': {
						'description': 'New Plant Holiday',
						'start_date': '2020-06-17T08:10:27.769Z',
						'end_date': '2020-06-17T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
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
					'id': newPlantHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error while passing invalid query params of url provided', function(done) {
		agent
			.get(`/manufacturing/plant-schedules/${newPlantHoliday}?_=1573888749942&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if try to get details of non-existing holiday', function(done) {
		agent
			.get(`/manufacturing/plant-schedules/7fc39716-8cd5-440a-8453-482355636506?_=1573888749942`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the detils for the existing holiday', function(done) {
		agent
			.get(`/manufacturing/plant-schedules/${newPlantHoliday}?_=1573888749942`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Unit Lvl
	// Unit lvl test cases for the Holiday
	it('Should throw error while creating schedule with start date as null or empty-string', function(done) {
		agent
			.post(`/manufacturing/plant-unit-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': ' ',
						'end_date': '2020-06-16T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating schedule with end date as null or empty-string', function(done) {
		agent
			.post(`/manufacturing/plant-unit-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': ' ',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating schedule with start time as null or empty-string', function(done) {
		agent
			.post(`/manufacturing/plant-unit-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': '2020-06-26T08:10:27.769Z',
						'start_time': ' ',
						'end_time': '00:00',
						'type': 'holiday'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating schedule with end time as null or empty-string', function(done) {
		agent
			.post(`/manufacturing/plant-unit-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': '2020-06-26T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': ' ',
						'type': 'holiday'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating schedule with type as null or empty-string', function(done) {
		agent
			.post(`/manufacturing/plant-unit-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': '2020-06-26T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': ' '
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating holiday with descriptions as null or empty-string', function(done) {
		agent
			.post(`/manufacturing/plant-unit-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': ' ',
						'start_date': '2020-07-16T08:10:27.769Z',
						'end_date': '2020-07-16T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating holiday with post date', function(done) {
		agent
			.post(`/manufacturing/plant-unit-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'New unit Holiday',
						'start_date': '2019-07-16T08:10:27.769Z',
						'end_date': '2019-07-16T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create holiday with description and valid date', function(done) {
		agent
			.post(`/manufacturing/plant-unit-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'New unit Holiday',
						'start_date': '2020-07-16T08:10:27.769Z',
						'end_date': '2020-07-16T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newPlantUnitHoliday = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while creating holiday with duplicate description', function(done) {
		agent
			.post(`/manufacturing/plant-unit-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'New unit Holiday',
						'start_date': '2020-08-16T08:10:27.769Z',
						'end_date': '2020-08-16T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating multiple holiday with same dates', function(done) {
		agent
			.post(`/manufacturing/plant-unit-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'New unit Holiday DP',
						'start_date': '2020-07-16T08:10:27.769Z',
						'end_date': '2020-07-16T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the schedule for unit with start date as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-schedules/${newPlantUnitHoliday}`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': ' ',
						'end_date': '2020-06-16T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'id': newPlantUnitHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the schedule for unit with end date as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-schedules/${newPlantUnitHoliday}`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': ' ',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'id': newPlantUnitHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the schedule for unit with start time as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-schedules/${newPlantUnitHoliday}`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': '2020-06-26T08:10:27.769Z',
						'start_time': ' ',
						'end_time': '00:00',
						'type': 'holiday'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'id': newPlantUnitHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the schedule for unit with end time as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-schedules/${newPlantUnitHoliday}`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': '2020-06-26T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': ' ',
						'type': 'holiday'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'id': newPlantUnitHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the schedule for unit with type as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-schedules/${newPlantUnitHoliday}`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_date': '2020-06-16T08:10:27.769Z',
						'end_date': '2020-06-26T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': ' '
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'id': newPlantUnitHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the holiday for unit with description as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-schedules/${newPlantUnitHoliday}`)
			.send({
				'data': {
					'attributes': {
						'description': ' ',
						'start_date': '2020-07-16T08:10:27.769Z',
						'end_date': '2020-07-16T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'id': newPlantUnitHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the holiday for unit with duplicate description', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-schedules/${newPlantUnitHoliday}`)
			.send({
				'data': {
					'attributes': {
						'description': 'Temp unit Holiday',
						'start_date': '2020-08-16T08:10:27.769Z',
						'end_date': '2020-08-16T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'id': newPlantUnitHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the holiday for unit with post dates', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-schedules/${newPlantUnitHoliday}`)
			.send({
				'data': {
					'attributes': {
						'description': 'New unit Holiday',
						'start_date': '2019-07-16T08:10:27.769Z',
						'end_date': '2019-07-16T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'id': newPlantUnitHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the holiday for unit with same date as Temp unit Holiday', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-schedules/${newPlantUnitHoliday}`)
			.send({
				'data': {
					'attributes': {
						'description': 'Temp unit Holiday',
						'start_date': '2020-07-16T08:10:27.769Z',
						'end_date': '2020-07-16T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'id': newPlantUnitHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update the holiday with valid description and date', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-schedules/${newPlantUnitHoliday}`)
			.send({
				'data': {
					'attributes': {
						'description': 'New Unit Holiday',
						'start_date': '2020-07-20T08:10:27.769Z',
						'end_date': '2020-07-20T08:10:27.769Z',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'holiday'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'id': newPlantUnitHoliday,
					'type': 'manufacturing/plant-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error while passing invalid query params of url provided', function(done) {
		agent
			.get(`/manufacturing/plant-unit-schedules/${newPlantUnitHoliday}?_=1573888749942&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if try to get details of non-existing holiday', function(done) {
		agent
			.get(`/manufacturing/plant-unit-schedules/7fc39716-8cd5-440a-8453-482355636506?_=1573888749942`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the details for existing holiday for unit', function(done) {
		agent
			.get(`/manufacturing/plant-unit-schedules/${newPlantUnitHoliday}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Planned DownTime at Plant Unit lvl
	it('Should throw error while creating planned downtime where start time is after end time', function(done) {
		agent
			.post(`/manufacturing/plant-unit-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'New Planned-Downtime DP',
						'start_time': '17:00',
						'end_time': '15:00',
						'type': 'planned_downtime'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'type': 'manufacturing/plant-unit-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create the planned down-time with the valid description', function(done) {
		agent
			.post(`/manufacturing/plant-unit-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'New Planned-Downtime',
						'start_time': '13:00',
						'end_time': '15:00',
						'type': 'planned_downtime'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'id': newUnitPlannedDowntimeId,
					'type': 'manufacturing/plant-unit-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newUnitPlannedDowntimeId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while updating the planned down-time with invalid time', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-schedules/${newUnitPlannedDowntimeId}`)
			.send({
				'data': {
					'attributes': {
						'description': 'New Planned Downtime',
						'start_time': '14:00',
						'end_time': '11:00',
						'type': 'planned_downtime'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'id': newUnitPlannedDowntimeId,
					'type': 'manufacturing/plant-unit-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update the planned down-time with time', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-schedules/${newUnitPlannedDowntimeId}`)
			.send({
				'data': {
					'attributes': {
						'description': 'New Planned Downtime',
						'start_time': '14:00',
						'end_time': '16:00',
						'type': 'planned_downtime'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'id': newUnitPlannedDowntimeId,
					'type': 'manufacturing/plant-unit-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Scheduled Down-Time for Plant Unit Lvl
	it('Should throw error while creating the schedule downtime where start date is after end date', function(done) {
		agent
			.post(`/manufacturing/plant-unit-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'New Schedule downtime',
						'start_date': '2019-13-21T11:07:05.712Z',
						'start_time': '15:00',
						'end_date': '2019-12-21T11:07:05.712Z',
						'end_time': '15:00',
						'type': 'scheduled_downtime'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'id': newUnitScheduleDowntimeId,
					'type': 'manufacturing/plant-unit-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create schedule downtime with valid description and date-time', function(done) {
		agent
			.post(`/manufacturing/plant-unit-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'New Schedule downtime',
						'start_date': '2019-12-20T11:07:05.712Z',
						'start_time': '15:00',
						'end_date': '2019-12-21T11:07:05.712Z',
						'end_time': '15:00',
						'type': 'scheduled_downtime'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'id': newUnitScheduleDowntimeId,
					'type': 'manufacturing/plant-unit-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newUnitScheduleDowntimeId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while updating the shedule downtime with in-valid date-time', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-schedules/${newUnitScheduleDowntimeId}`)
			.send({
				'data': {
					'attributes': {
						'description': 'New Schedule downtime',
						'start_date': '2019-15-21T11:07:05.712Z',
						'start_time': '16:00',
						'end_date': '2019-14-21T11:07:05.712Z',
						'end_time': '14:00',
						'type': 'scheduled_downtime'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'id': newUnitScheduleDowntimeId,
					'type': 'manufacturing/plant-unit-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update the schedule downtime with valid date-time', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-schedules/${newUnitScheduleDowntimeId}`)
			.send({
				'data': {
					'attributes': {
						'description': 'New Schedule downtime',
						'start_date': '2019-12-21T11:07:05.712Z',
						'start_time': '16:00',
						'end_date': '2019-12-22T11:07:05.712Z',
						'end_time': '14:00',
						'type': 'scheduled_downtime'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'id': newUnitScheduleDowntimeId,
					'type': 'manufacturing/plant-unit-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Shift at Unit Lvl
	it('Should create shift at unit lvl', function(done) {
		agent
			.post(`/manufacturing/plant-unit-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'New Shift',
						'start_time': '14:00',
						'end_time': '11:00',
						'type': 'shift'
					},
					'relationships': {
						'tenant_plant_unit': {
							'data': {
								'id': tempPlantUnitId,
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
					'id': newUnitShiftId,
					'type': 'manufacturing/plant-unit-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newUnitShiftId = response.body.data.id;
				done(err);
			});
	});

	// Test Cases for the Uploder
	it('Should Upload the Maintenance spreadsheet', function(done) {
		agent
			.post(`/manufacturing/plant-unit-machine-schedules/upload?plantUnitId=${tempPlantUnitId}`)
			.set('Content-Type', 'multipart/form-data')
			.field('relativePath', '')
			.field('name', 'maintenance.xlsx')
			.field('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
			.attach('files[]', maintenanceData, 'maintenance')
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should approve Maintenance Data from excel shit', function(done) {
		agent
			.post(`/manufacturing/plant-unit-machine-schedules/approve-upload?plantUnitId=${tempPlantUnitId}`)
			.send({
				'attributes': [
					'MACHINE_NAME',
					'DESCRIPTION',
					'START_TIME',
					'END_TIME',
					'START_DATE',
					'END_DATE',
					'TYPE'
				],
				'rows': [
					{
						'MACHINE_NAME': 'Temp Machine',
						'DESCRIPTION': 'MA desc',
						'START_TIME': '11:00',
						'START_DATE': '12-23-2019',
						'END_TIME': '12:00',
						'END_DATE': '12-23-2019',
						'TYPE': 'maintenance'
					}
				]
			})
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should Upload the Planned Downtime spreadsheet', function(done) {
		agent
			.post(`/manufacturing/plant-unit-machine-schedules/upload?plantUnitId=${tempPlantUnitId}`)
			.set('Content-Type', 'multipart/form-data')
			.field('relativePath', '')
			.field('name', 'planned-downtime-machines.xlsx')
			.field('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
			.attach('files[]', plannedDowntimeData, 'planned-downtime-machines')
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should Upload the Schedule Downtime spreadsheet', function(done) {
		agent
			.post(`/manufacturing/plant-unit-machine-schedules/upload?plantUnitId=${tempPlantUnitId}`)
			.set('Content-Type', 'multipart/form-data')
			.field('relativePath', '')
			.field('name', 'scheduled-downtime-machines.xlsx')
			.field('type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
			.attach('files[]', plannedDowntimeData, 'scheduled-downtime-machines')
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Machine lvl schedule
	// Planned Downtime
	it('Should throw error while creating Schedule with start time as null or empty string', function(done) {
		agent
			.post(`/manufacturing/plant-unit-machine-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_time': '',
						'end_time': '00:00',
						'type': 'planned_downtime'
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
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'type': 'manufacturing/plant-unit-machine-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating Schedule with end time as null or empty string', function(done) {
		agent
			.post(`/manufacturing/plant-unit-machine-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_time': '00:00',
						'end_time': ' ',
						'type': 'planned_downtime'
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
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'type': 'manufacturing/plant-unit-machine-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating Schedule with type as null or empty string', function(done) {
		agent
			.post(`/manufacturing/plant-unit-machine-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': ' '
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
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'type': 'manufacturing/plant-unit-machine-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating Planned Downtime with description as null or empty string', function(done) {
		agent
			.post(`/manufacturing/plant-unit-machine-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': ' ',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': 'planned_downtime'
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
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'type': 'manufacturing/plant-unit-machine-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating Planned Downtime where start time is after end time', function(done) {
		agent
			.post(`/manufacturing/plant-unit-machine-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'New Planned Downtime DP',
						'start_time': '15:00',
						'end_time': '13:00',
						'type': 'planned_downtime'
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
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'type': 'manufacturing/plant-unit-machine-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create a Planned Downtime with valid description and time', function(done) {
		agent
			.post(`/manufacturing/plant-unit-machine-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'New Planned Downtime Machine',
						'start_time': '13:00',
						'end_time': '15:00',
						'type': 'planned_downtime'
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
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'id': newMachinePlannedDowntimeId,
					'type': 'manufacturing/plant-unit-machine-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newMachinePlannedDowntimeId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while creating the Planned Downtime for Machine with duplicate description', function(done) {
		agent
			.post(`/manufacturing/plant-unit-machine-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'New Planned Downtime',
						'start_time': '13:00',
						'end_time': '15:00',
						'type': 'planned_downtime'
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
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'type': 'manufacturing/plant-unit-machine-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while creating multiple Planned downtime for machine with same time', function(done) {
		agent
			.post(`/manufacturing/plant-unit-machine-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'Planned Donwtime',
						'start_time': '13:00',
						'end_time': '15:00',
						'type': 'planned_downtime'
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
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'type': 'manufacturing/plant-unit-machine-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the schedule with start time as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-machine-schedules/${newMachinePlannedDowntimeId}`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_time': ' ',
						'end_time': '00:00',
						'type': 'planned_downtime'
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
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'id': newMachinePlannedDowntimeId,
					'type': 'manufacturing/plant-unit-machine-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the schedule with end time as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-machine-schedules/${newMachinePlannedDowntimeId}`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_time': '00:00',
						'end_time': ' ',
						'type': 'planned_downtime'
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
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'id': newMachinePlannedDowntimeId,
					'type': 'manufacturing/plant-unit-machine-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the schedule with type as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-machine-schedules/${newMachinePlannedDowntimeId}`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule',
						'start_time': '00:00',
						'end_time': '00:00',
						'type': ' '
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
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'id': newMachinePlannedDowntimeId,
					'type': 'manufacturing/plant-unit-machine-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while updating the Planned Downtime with description as null or empty string', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-machine-schedules/${newMachinePlannedDowntimeId}`)
			.send({
				'data': {
					'attributes': {
						'description': ' ',
						'start_time': '13:00',
						'end_time': '15:00',
						'type': 'planned_downtime'
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
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'id': newMachinePlannedDowntimeId,
					'type': 'manufacturing/plant-unit-machine-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should thow error while updating the Planned Downtime where start time is after end time', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-machine-schedules/${newMachinePlannedDowntimeId}`)
			.send({
				'data': {
					'attributes': {
						'description': 'Planned Donwtime',
						'start_time': '17:00',
						'end_time': '15:00',
						'type': 'planned_downtime'
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
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'id': newMachinePlannedDowntimeId,
					'type': 'manufacturing/plant-unit-machine-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update the Planned Downtime with valid description and time', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-machine-schedules/${newMachinePlannedDowntimeId}`)
			.send({
				'data': {
					'attributes': {
						'description': 'Planned Donwtime Machine',
						'start_time': '13:00',
						'end_time': '15:00',
						'type': 'planned_downtime'
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
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'id': newMachinePlannedDowntimeId,
					'type': 'manufacturing/plant-unit-machine-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw error while updating the non-existing Planned downtime', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-machine-schedules/7fc39716-8cd5-440a-8453-482355636506`)
			.send({
				'data': {
					'attributes': {
						'description': 'Planned Donwtime',
						'start_time': '13:00',
						'end_time': '15:00',
						'type': 'planned_downtime'
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
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'id': '7fc39716-8cd5-440a-8453-482355636506',
					'type': 'manufacturing/plant-unit-machine-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw error while passing invalid query params of url provided while fetching Machine schedule details', function(done) {
		agent
			.get(`/manufacturing/plant-unit-machine-schedules/${newMachinePlannedDowntimeId}?_=1573888749942&include=t`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return null if we try to get details of non-existing Machine Schedule', function(done) {
		agent
			.get(`/manufacturing/plant-unit-machine-schedules/7fc39716-8cd5-440a-8453-482355636506`)
			.end((err, response) => {
				expect(response.body.data).to.eql(null);
				done(err);
			});
	});

	it('Should get the detils for the existing Machine Schedule', function(done) {
		agent
			.get(`/manufacturing/plant-unit-machine-schedules/${newMachinePlannedDowntimeId}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Schedule Downtime for the Machine
	it('Should throw error while creating the schedule downtime where start date is after end date', function(done) {
		agent
			.post(`/manufacturing/plant-unit-machine-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule Downtime',
						'start_date': '2020-06-25T06:52:54.145Z',
						'start_time': '13:00',
						'end_date': '2020-06-24T06:52:54.145Z',
						'end_time': '15:00'
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
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'type': 'manufacturing/plant-unit-machine-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should create a schedule down time with valid description and date', function(done) {
		agent
			.post(`/manufacturing/plant-unit-machine-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule Downtime',
						'start_date': '2020-06-23T06:52:54.145Z',
						'start_time': '13:00',
						'end_date': '2020-06-24T06:52:54.145Z',
						'end_time': '15:00'
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
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'id': newMachineScheduleDowntimeId,
					'type': 'manufacturing/plant-unit-machine-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newMachineScheduleDowntimeId = response.body.data.id;
				done(err);
			});
	});

	it('Should throw error while updating the schedule downtime where start date is after end date', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-machine-schedules/${newMachineScheduleDowntimeId}`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule Downtime',
						'start_date': '2020-06-25T06:52:54.145Z',
						'start_time': '13:00',
						'end_date': '2020-06-24T06:52:54.145Z',
						'end_time': '15:00'
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
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'id': newMachineScheduleDowntimeId,
					'type': 'manufacturing/plant-unit-machine-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should update the schedule downtime with valid description and date', function(done) {
		agent
			.patch(`/manufacturing/plant-unit-machine-schedules/${newMachineScheduleDowntimeId}`)
			.send({
				'data': {
					'attributes': {
						'description': 'Schedule Downtime',
						'start_date': '2020-06-22T06:52:54.145Z',
						'start_time': '13:00',
						'end_date': '2020-06-24T06:52:54.145Z',
						'end_time': '15:00'
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
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						}
					},
					'id': newMachineScheduleDowntimeId,
					'type': 'manufacturing/plant-unit-machine-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should get the details for the schedule downtime', function(done) {
		agent
			.get(`/manufacturing/plant-unit-machine-schedules/${newMachineScheduleDowntimeId}`)
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	// Test Cases for the Maintenance for the Machine
	it('Should create the maintenance for the machine', function(done) {
		agent
			.post(`/manufacturing/plant-unit-machine-schedules`)
			.send({
				'data': {
					'attributes': {
						'description': 'New Maintenance',
						'start_date': '2020-10-21T11:07:05.712Z',
						'start_time': '16:00',
						'end_date': '2020-10-21T11:07:05.712Z',
						'end_time': '20:00',
						'type': 'maintenance'
					},
					'relationships': {
						'tenant_plant_unit_machine': {
							'data': {
								'id': tempMachineId,
								'type': 'manufacturing/plant-unit-machines'
							}
						},
						'tenant': {
							'data': {
								'id': tenantId,
								'type': 'settings/account/basics/tenants'
							}
						}
					},
					'id': newMachineMaintenanceId,
					'type': 'manufacturing/plant-unit-schedules'
				}
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				newMachineMaintenanceId = response.body.data.id;
				done(err);
			});
	});

	// Delete Test cases for the Maintenance for the Machine
	it('Should delete the maintenance for the machine', function(done) {
		agent
			.del(`/manufacturing/plant-unit-machine-schedules/${newMachineMaintenanceId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete test cases for the schedule downtime for the Machine
	it('Should delete the existing schedule downtime added to the machine', function(done) {
		agent
			.del(`/manufacturing/plant-unit-machine-schedules/${newMachineScheduleDowntimeId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete Test Cases for the Planned Downtime for the Machine
	it(`Should delete the existing Planned Downtime added to the machine`, function(done) {
		agent
			.del(`/manufacturing/plant-unit-machine-schedules/${newMachinePlannedDowntimeId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should not delete the non-existing Planned Downtime for the machine', function(done) {
		agent
			.del(`/manufacturing/plant-unit-machine-schedules/7fc39716-8cd5-440a-8453-482355636506`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	// Delete Test Cases for the Shift at Plant Unit Lvl
	it('Should delete the shift added for the unit', function(done) {
		agent
			.del(`/manufacturing/plant-unit-schedules/${newUnitShiftId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete Test Cases for the Schedule-Downtime at Plant Unit Lvl
	it(`Should delete the existing schedule down-time added to the unit`, function(done) {
		agent
			.del(`/manufacturing/plant-unit-schedules/${newUnitScheduleDowntimeId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete Test Cases for the Planned-Downtime at Plant Unit Lvl
	it(`Should delete the existing planned down-time added to the unit`, function(done) {
		agent
			.del(`/manufacturing/plant-unit-schedules/${newUnitPlannedDowntimeId}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	// Delete Test Cases for the Holiday at Plant Unit Lvl
	it(`Should delete the existing holiday added to the unit`, function(done) {
		agent
			.del(`/manufacturing/plant-unit-schedules/${newPlantUnitHoliday}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should not delete the non-existing holiday for the unit', function(done) {
		agent
			.del(`/manufacturing/plant-unit-schedules/7fc39716-8cd5-440a-8453-482355636506`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	// Delete Test Cases for the Holiday at Plant Lvl
	it(`Should delete the existing holiday added to the plant`, function(done) {
		agent
			.del(`/manufacturing/plant-schedules/${newPlantHoliday}`)
			.end((err, response) => {
				expect(response).to.have.status(204);
				done(err);
			});
	});

	it('Should not delete the non-existing holiday for the plant', function(done) {
		agent
			.del(`/manufacturing/plant-schedules/7fc39716-8cd5-440a-8453-482355636506`)
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

});
