'use strict';

const chai = require('chai'); // eslint-disable-line node/no-unpublished-require
const chaiHttp = require('chai-http'); // eslint-disable-line node/no-unpublished-require

chai.use(chaiHttp);

describe('Session Component Test Cases', function() {
	const agent = chai.request.agent('http://localhost:9100');
	const agnt = chai.request.agent('http://pw.plant.works:9100');
	const expect = chai.expect;

	let createdUserId, tenantId;

	chai.should();

    after(function(done) {
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
		knex.raw(`UPDATE users SET password = ? WHERE email = ?`, ['$pbkdf2-sha512$i=25000$TcpuHsGqh+o3S+KNIXREjw$MjHMSkGA5WHnRWG0UbUP/CPxfADCN+o+8momCsXOzRSigcty3/R3CPftGy7l9EcLoF1BYpo8Q7/PlnfRC24PkA', 'root@plant.works'])
		.then(() => {
			knex.raw('DELETE from users WHERE email = ?', ['new5.user@www.com'])
			.then(() => {
				done();
			});
		})
		.catch((err) => {
			done(err);
		})
		.finally(() => {
			return knex.destroy();
		});
	});

	it('Should be able to login under different tenant', function(done) {
		agnt
			.post('/session/login')
			.type('form')
			.send({
				'username': 'root@plant.works',
				'password': 'plantworks'
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response).to.have.cookie('plantworks!webapp!server');
				if(err) {
					done(err);
					return;
				}

				agnt
					.get('/session/user')
					.end((err1, response1) => {
						tenantId = response1.body.tenant_id;
						if(err1) {
							done(err1);
							return;
						}

						agnt
							.post('/pug/user-manager/users')
							.send({
								'data': {
									'attributes': {
										'email': 'new5.user@www.com',
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

								agnt
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

										agnt
											.get('/session/logout')
											.end((err4) => {
												done(err4);
											});
									});
							});
					});
			});
	});

	it('Should redirect', function(done) {
		agent
			.post('/session/login')
			.type('form')
			.send({
				'username': 'new5.user@www.com',
				'password': '1234'
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response.body).to.have.property('nextAction').eql('redirect');
				expect(response.body).to.have.property('redirectDomain').eql('pw');

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

	it('Should return the Public User details', function(done) {
		agent
			.get('/session/user')
			.end((err, response) => {
				expect(response).to.have.status(200);
				response.body.should.have.property('name').eql('Public');
				response.body.should.have.property('loggedIn').eql(false);
				response.body.should.have.property('permissions').eql(['public']);

				done(err);
			});
	});

	it('Should throw an error on Logout before Login', function(done) {
		agent
			.get('/session/logout')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error on Login without a password', function(done) {
		agent
			.post('/session/login')
			.type('form')
			.send({
				'username': 'root@plant.works'
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error on Login with an invalid User', function(done) {
		agent
			.post('/session/login')
			.type('form')
			.send({
				'username': 'root@something.com',
				'password': 'plantworks'
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should throw an error on Login with an invalid Password', function(done) {
		agent
			.post('/session/login')
			.type('form')
			.send({
				'username': 'root@plant.works',
				'password': 'plantworks2'
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should Login and Start a Session with a Cookie', function(done) {
		agent
			.post('/session/login')
			.type('form')
			.send({
				'username': 'root@plant.works',
				'password': 'plantworks'
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				expect(response).to.have.cookie('plantworks!webapp!server');

				done(err);
			});
	});

	it('Should throw an error on Login for an authenticated session', function(done) {
		agent
			.post('/session/login')
			.type('form')
			.send({
				'username': 'root@plant.works',
				'password': 'plantworks'
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should return the Root User details', function(done) {
		agent
			.get('/session/user')
			.end((err, response) => {
				expect(response).to.have.status(200);
				response.body.should.have.property('name').eql('Root PlantWorks');
				response.body.should.have.property('loggedIn').eql(true);
				response.body.should.have.property('permissions').with.length.gte(4);

				done(err);
			});
	});

	it('Should logout', function(done) {
		agent
			.get('/session/logout')
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Should throw an error on Logout after a Logout', function(done) {
		agent
			.get('/session/logout')
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should go back to returning the Public User details', function(done) {
		agent
			.get('/session/user')
			.end((err, response) => {
				expect(response).to.have.status(200);
				response.body.should.have.property('name').eql('Public');
				response.body.should.have.property('loggedIn').eql(false);
				response.body.should.have.property('permissions').eql(['public']);

				done(err);
			});
	});

	it('Should throw a reset password error if User is not registered', function(done) {
		agent
			.post('/session/reset-password')
			.type('form')
			.send({
				'username': 'unknown-user@plant.works'
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

	it('Should reset password if User is registered', function(done) {
		agent
			.post('/session/reset-password')
			.type('form')
			.send({
				'username': 'root@plant.works'
			})
			.end((err, response) => {
				expect(response).to.have.status(200);
				done(err);
			});
	});

	it('Login with old password should not work anymore', function(done) {
		agent
			.post('/session/login')
			.type('form')
			.send({
				'username': 'root@plant.works',
				'password': 'plantworks'
			})
			.end((err, response) => {
				expect(response).to.have.status(422);
				done(err);
			});
	});

});

