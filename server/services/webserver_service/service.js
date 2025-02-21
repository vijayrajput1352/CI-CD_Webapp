'use strict';

/* eslint-disable security/detect-object-injection */
/* eslint-disable security/detect-non-literal-require */

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */
const safeJsonStringify = require('safe-json-stringify'); // eslint-disable-line no-unused-vars

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseService = require('plantworks-base-service').PlantWorksBaseService;

const PlantWorksBaseError = require('plantworks-base-error').PlantWorksBaseError;
const PlantWorksSrvcError = require('plantworks-service-error').PlantWorksServiceError;

/**
 * @class   WebserverService
 * @extends {PlantWorksBaseService}
 * @classdesc The Plant.Works Web Application Server Webserver Service - based on Koa.
 *
 * @description
 * Allows the rest of the Plant.Works Modules to expose REST API.
 *
 */
class WebserverService extends PlantWorksBaseService {
	// #region Constructor
	constructor(parent, loader) {
		super(parent, loader);
	}
	// #endregion

	// #region startup/teardown code
	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof WebserverService
	 * @name     _setup
	 *
	 * @returns  {null} Nothing.
	 *
	 * @summary  Sets up the Web Server using Koa.
	 */
	async _setup() {
		try {
			if(this.$server) return null;
			await super._setup();

			this.$proxies = {};
			this.$serveFavicons = {};
			this.$serveStatics = {};

			/**
			 * Step 1: Setup Koa Application.
			 *
			 * @ignore
			 */

			// Step 1.1: Instantiate Koa & do basic setup
			const Koa = require('koa');
			const path = require('path');
			const promises = require('bluebird');
			const self = this; // eslint-disable-line consistent-this

			this.$koa = new Koa();
			this.$koa.keys = this.$config.session.keys;
			this.$koa.proxy = ((plantworksEnv !== 'development') && (plantworksEnv !== 'test'));
			this.$koa.subdomainOffset = this.$config.session.config.domain.split('.').length;

			// Step 1.1.1: Ranged static Assets / Favicon / etc. go absolutely right at the top
			const koaRange = require('koa-range');
			this.$koa.use(koaRange);

			// Step 1.2: Generate or Use a unique id for this request
			const requestId = require('koa-requestid');
			this.$koa.use(requestId({
				'expose': 'X-Request-Id',
				'header': 'X-Request-Id',
				'query': 'requestId'
			}));

			this.$koa.use(async (ctxt, next) => {
				ctxt.req.socket.setNoDelay(true);

				ctxt.request.headers['x-request-id'] = ctxt.state.id;
				ctxt.set('x-powered-by', this.$config.poweredBy);

				await next();
			});

			// Step 1.3: Handle the bloody errors...
			this.$koa.use(async (ctxt, next) => {
				try {
					await next();
				}
				catch(err) {
					let error = err;
					if(error && !(error instanceof PlantWorksBaseError)) { // eslint-disable-line curly
						error = new PlantWorksBaseError(`Web Request Error: `, err);
					}

					ctxt.type = 'application/json; charset=utf-8';
					ctxt.status = 422;
					ctxt.body = error.toJSON();
				}
				finally {
					if(this.$config.protocol === 'http2')
						delete ctxt.status;
				}
			});

			// Step 1.4: Security middlewares, Rate Limiters, etc. - first
			// But only in production - its a pain having to deal with these in development
			if((plantworksEnv !== 'development') && (plantworksEnv !== 'test')) {
				// Blacklisted IP? No chance...
				// const honeypot = require('nodejs-projecthoneypot');
				// honeypot.setApiKey(this.$config.honeyPot.apiKey);

				// this.$koa.use(async (ctxt, next) => {
				// 	try {
				// 		const honeyPayload = await honeypot.checkIP(ctxt.ip);
				// 		if(!honeyPayload.found) {
				// 			await next();
				// 			return;
				// 		}

				// 		throw new URIError(`Blacklisted Request IP Address: ${ctxt.ip}`);
				// 	}
				// 	catch(err) {
				// 		let error = err;

				// 		// eslint-disable-next-line curly
				// 		if(error && !(error instanceof PlantWorksSrvcError)) {
				// 			error = new PlantWorksSrvcError(`${this.name}::_checkHoneypot`, error);
				// 		}

				// 		throw error;
				// 	}
				// });
			}

			// TODO: Enable proper Content-Security-Policy once we're done with figuring out where we get stuff from
			// And add a CSP report uri, as well
			const koaHelmet = require('koa-helmet');
			this.$koa.use(koaHelmet({
				'hidePoweredBy': false,
				'hpkp': false,
				'hsts': false
			}));

			// Not blacklisted but not whitelisted here? Forget it
			const koaCors = require('@koa/cors');
			this.$koa.use(koaCors({
				'credentials': true,
				'keepHeadersOnError': true,

				'origin': async function(ctxt) {
					if(ctxt.get('Origin').indexOf(self.$config.session.config.domain) >= 0)
						return ctxt.get('Origin');

					if(((plantworksEnv === 'development') || (plantworksEnv === 'test')) && (ctxt.hostname === 'localhost'))
						return ctxt.get('Origin');

					return null;
				}
			}));

			// Ok... whitelisted, but exceeding request quotas? Stop right now!
			const ratelimiter = require('koa-ratelimit');
			this.$koa.use(ratelimiter({
				'db': this.$dependencies.CacheService,
				'duration': 1000,
				'max': 1000
			}));

			// All fine, but the server is overloaded? You gotta wait, dude!
			const overloadProtection = require('overload-protection')('koa', {
				'maxEventLoopDelay': 60000,
				'logging': this.$dependencies.LoggerService
			});
			this.$koa.use(overloadProtection);

			// Step 1.5: Before proceeding further, check if this node will process this...
			this.$koa.use(this._setTenant.bind(this));
			this.$koa.use(this._handleOrProxytoCluster.bind(this));

			// Step 1.6: Add in the static server stuff - compressor, etc.
			const compressor = require('koa-compress');
			this.$koa.use(compressor({
				'threshold': 4096
			}));

			const koaFavicon = require('koa-favicon');
			this.$koa.use(this._serveTenantFavicon.bind(this));
			this.$koa.use(koaFavicon(path.join(path.dirname(path.dirname(require.main.filename)), 'static_assets/www/favicon.ico')));

			const koaStatic = require('koa-static');
			this.$koa.use(this._serveTenantStaticAssets.bind(this));
			this.$koa.use(koaStatic(path.join(path.dirname(path.dirname(require.main.filename)), 'static_assets'), {
				'maxAge': 86400000
			}));

			// Step 1.7: Add in the request modifying middlewares
			const acceptOverride = require('koa-accept-override');
			this.$koa.use(acceptOverride());

			const methodOverride = require('koa-methodoverride');
			this.$koa.use(methodOverride());

			const device = require('device');
			this.$koa.use(async (ctxt, next) => {
				ctxt.state.device = device(ctxt.req.headers['user-agent'] || '');
				await next();
			});

			// Step 1.8: Session
			const sessionConfig = JSON.parse(safeJsonStringify(this.$config.session.config));
			sessionConfig.genid = function() {
				const uuid = require('uuid/v4');
				return `plantworks!webapp!server!${uuid()}`;
			};

			const KoaSessionStore = require('koa-redis');
			sessionConfig.store = new KoaSessionStore({
				'client': this.$dependencies.CacheService
			});

			const koaSession = require('koa-session');
			this.$koa.use(async (ctxt, next) => {
				if(ctxt.hostname.split('.').includes('localhost'))
					delete sessionConfig['domain'];

				const sessionMiddleware = koaSession(sessionConfig, this.$koa);
				return sessionMiddleware(ctxt, next);
			});

			// Step 1.9: The body parsers...
			const koaFormidable = require('koa2-formidable');
			const koaFormidableMiddleware = koaFormidable();
			this.$koa.use(async (ctxt, next) => {
				let formidableOk = false;

				try {
					await koaFormidableMiddleware(ctxt, async function() {
						try {
							formidableOk = true;
						}
						catch(err) {
							let error = err;
							if(error && !(error instanceof PlantWorksBaseError)) { // eslint-disable-line curly
								error = new PlantWorksBaseError(`Web Request Error: `, err);
							}

							ctxt.type = 'application/json; charset=utf-8';
							ctxt.status = 422;
							ctxt.body = error.toJSON();
						}
						finally {
							await next(...arguments);
						}
					});
				}
				catch(err) {
					if(!formidableOk) {
						await next();
						return;
					}

					throw err;
				}
			});

			const koaBodyParser = require('koa-bodyparser');
			this.$koa.use(koaBodyParser({
				'formLimit': '10mb',
				'jsonLimit': '10mb',
				'textLimit': '10mb',
				'enableTypes': ['json', 'text'],
				'extendTypes': {
					'json': ['application/x-javascript', 'application/vnd.api+json']
				}
			}));

			// Step 1.10: Passport based authentication
			this.$koa.use(this.$dependencies.AuthService.initialize());
			this.$koa.use(this.$dependencies.AuthService.session());

			// Step 1.11: Plant.Works Auditing & Logger for auditing...
			this.$koa.use(this._auditLog.bind(this));

			// Step 1.12: Add in the router
			const Router = require('koa-router');
			this.$router = new Router();

			this.$koa.use(this.$router.routes());
			this.$koa.use(this.$router.allowedMethods());

			/**
			 * Step 2: Setup node.js Web Server
			 * @ignore
			 */

			// Step 2.1: Create the Server
			this.$config.protocol = this.$config.protocol || 'http';
			const protocol = require(this.$config.protocol || 'http');

			if(this.$config.protocol === 'http') { // eslint-disable-line curly
				this.$server = protocol.createServer(this.$koa.callback());
			}

			const filesystem = promises.promisifyAll(require('fs'));
			if((this.$config.protocol === 'https') || this.$config.protocol === 'spdy') {
				const secureKey = await filesystem.readFileAsync(path.isAbsolute(this.$config.secureProtocols[this.$config.protocol].key) ? this.$config.secureProtocols[this.$config.protocol].key : path.join(__dirname, this.$config.secureProtocols[this.$config.protocol].key));
				const secureCert = await filesystem.readFileAsync(path.isAbsolute(this.$config.secureProtocols[this.$config.protocol].cert) ? this.$config.secureProtocols[this.$config.protocol].cert : path.join(__dirname, this.$config.secureProtocols[this.$config.protocol].cert));

				this.$config.secureProtocols[this.$config.protocol].key = secureKey;
				this.$config.secureProtocols[this.$config.protocol].cert = secureCert;

				this.$server = protocol.createServer(this.$config.secureProtocols[this.$config.protocol], this.$koa.callback());
			}

			if(this.$config.protocol === 'http2') {
				const secureKey = await filesystem.readFileAsync(path.isAbsolute(this.$config.secureProtocols[this.$config.protocol].key) ? this.$config.secureProtocols[this.$config.protocol].key : path.join(__dirname, this.$config.secureProtocols[this.$config.protocol].key));
				const secureCert = await filesystem.readFileAsync(path.isAbsolute(this.$config.secureProtocols[this.$config.protocol].cert) ? this.$config.secureProtocols[this.$config.protocol].cert : path.join(__dirname, this.$config.secureProtocols[this.$config.protocol].cert));

				this.$config.secureProtocols[this.$config.protocol].key = secureKey;
				this.$config.secureProtocols[this.$config.protocol].cert = secureCert;

				this.$server = protocol.createSecureServer(this.$config.secureProtocols[this.$config.protocol], this.$koa.callback());
			}

			// Step 2.2: Add utility to force-stop server
			const serverDestroy = require('server-destroy');
			serverDestroy(this.$server);

			// Step 2.3: Start listening to events
			this.$server.on('connection', this._serverConnection.bind(this));

			this.$koa.on('error', this._handleKoaError.bind(this));
			this.$server.on('error', this._serverError.bind(this));

			// Finally, Start listening...
			this.$server = promises.promisifyAll(this.$server);
			this.$parent.once('server-online', this._listenAndPrintNetworkInterfaces.bind(this));

			return null;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::_setup error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof WebserverService
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Destroys the Koa Web Server.
	 */
	async _teardown() {
		try {
			if(!this.$server) return null;
			if(this.$server.listening) { // eslint-disable-line curly
				await this.$server.destroyAsync();
			}

			this.$server.off('connection', this._serverConnection.bind(this));

			this.$server.off('error', this._serverError.bind(this));
			this.$koa.off('error', this._handleKoaError.bind(this));

			this.$router.stack.length = 0;

			delete this.$router;
			delete this.$koa;
			delete this.$server;

			await super._teardown();
			return null;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::_teardown error`, err);
		}
	}
	// #endregion

	// #region Configuration Change Handlers
	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof WebserverService
	 * @name     _reconfigure
	 *
	 * @param    {object} newConfig - The changed configuration.
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Changes the configuration of this module, and informs everyone interested.
	 */
	async _reconfigure(newConfig) {
		this.$parent.emit('server-offline');
		await super._reconfigure(newConfig);
		this.$parent.emit('server-online');

		return null;
	}
	// #endregion

	// #region Koa Middlewares
	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof WebserverService
	 * @name     _setTenant
	 *
	 * @param    {object} ctxt - Koa context.
	 * @param    {callback} next - Callback to pass the request on to the next route in the chain.
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Sets up the tenant context on each request so we know which node in the cluster to route it to.
	 */
	async _setTenant(ctxt, next) {
		let _setTenantError = true;

		try {
			const cacheSrvc = this.$dependencies.CacheService,
				dbSrvc = this.$dependencies.DatabaseService.knex;

			let tenantSubDomain = (ctxt.subdomains.length === 1) ? ctxt.subdomains[0] : 'www';

			if(ctxt.subdomains.length > 1) {
				ctxt.subdomains.reverse();
				tenantSubDomain = ctxt.subdomains.join('.');
				ctxt.subdomains.reverse();
			}

			if(this.$config.subdomainMappings && this.$config.subdomainMappings[tenantSubDomain])
				tenantSubDomain = this.$config.subdomainMappings[tenantSubDomain];

			let tenant = null;
			if(ctxt.get['tenant']) { // eslint-disable-line curly
				tenant = JSON.parse(ctxt.get['tenant']);
			}

			if(!tenant) {
				tenant = await cacheSrvc.getAsync(`plantworks!webapp!tenant!${tenantSubDomain}`);
				if(tenant) tenant = JSON.parse(tenant);
			}

			if(!tenant) {
				let parentModule = this.$parent;
				while(parentModule.$parent) parentModule = parentModule.$parent;

				const parentModuleId = await this.$dependencies.ConfigurationService.getModuleID(parentModule);

				tenant = await dbSrvc.raw('SELECT id AS tenant_id, name, sub_domain FROM tenants WHERE sub_domain = ?', [tenantSubDomain]);
				if(!tenant.rows.length) {
					let redirectDomain = `${this.$config.protocol}://www.${this.$config.session.config.domain}`;
					if(this.$config.externalPort) redirectDomain = `${redirectDomain}:${this.$config.externalPort}`;

					ctxt.redirect(redirectDomain);
					return;
				}

				tenant = tenant.rows.shift();

				let template = await dbSrvc.raw(`SELECT * FROM fn_get_tenant_server_template(?, ?)`, [tenant.tenant_id, parentModuleId]);
				template = template.rows.shift();

				tenant['template'] = template;

				const tenantFeatures = await dbSrvc.raw(`SELECT * FROM fn_get_module_descendants(?) WHERE type = 'feature' AND id IN (SELECT module_id FROM tenants_modules WHERE tenant_id = ?)`, [parentModuleId, tenant.tenant_id]);
				tenant['features'] = this._setupTenantFeatureTree(tenantFeatures.rows, parentModuleId);

				const cacheMulti = cacheSrvc.multi();
				cacheMulti.setAsync(`plantworks!webapp!tenant!${tenantSubDomain}`, safeJsonStringify(tenant));
				cacheMulti.expireAsync(`plantworks!webapp!tenant!${tenantSubDomain}`, ((plantworksEnv === 'development') ? 300 : 86400));

				await cacheMulti.execAsync();
			}

			ctxt.state.tenant = tenant;
			ctxt.request.headers['tenant'] = safeJsonStringify(tenant);

			_setTenantError = false;
			await next();
			_setTenantError = true;
		}
		catch(err) {
			let error = err;

			if(!error) { // eslint-disable-line curly
				error = new PlantWorksSrvcError(`${this.name}::_setTenant: Unknown Error`);
				throw error;
			}

			if(_setTenantError) { // eslint-disable-line curly
				error = new PlantWorksSrvcError(`${this.name}::_setTenant`, error);
				throw error;
			}

			if(!(error instanceof PlantWorksBaseError)) { // eslint-disable-line curly
				error = new PlantWorksSrvcError(`${this.name}::_setTenant::Web Request Error: `, err);
				throw error;
			}

			throw error;
		}
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof WebserverService
	 * @name     _auditLog
	 *
	 * @param    {object} ctxt - Koa context.
	 * @param    {callback} next - Callback to pass the request on to the next route in the chain.
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Pushes the data from the request/response cycle to the Audit Service for publication.
	 */
	async _auditLog(ctxt, next) {
		let _auditLogError = true;

		try {
			const convertHRTime = require('convert-hrtime');
			const moment = require('moment');
			const statusCodes = require('http').STATUS_CODES;

			const reqHeaders = {};
			Object.keys(ctxt.request.headers).forEach((reqHeader) => {
				try {
					reqHeaders[reqHeader] = JSON.parse(safeJsonStringify(ctxt.request.headers[reqHeader]));
				}
				catch(err) {
					// Do Nothing
				}
			});

			const logMsgMeta = {
				'id': ctxt.state.id,
				'start_time': moment().valueOf(),
				'duration': 0,

				'user': {
					'user_id': ctxt.state.user ? ctxt.state.user.user_id : 'ffffffff-ffff-4fff-ffff-ffffffffffff',
					'name': ctxt.state.user ? `${ctxt.state.user.first_name} ${ctxt.state.user.last_name}` : 'Public'
				},

				'tenant': {
					'tenant_id': ctxt.state.tenant ? ctxt.state.tenant.tenant_id : '00000000-0000-4000-0000-000000000000',
					'sub_domain': ctxt.state.tenant ? ctxt.state.tenant.sub_domain : '???',
					'name': ctxt.state.tenant ? ctxt.state.tenant.name : 'Unknown'
				},

				'request-meta': {
					'headers': reqHeaders || {},
					'method': ctxt.request.method,
					'url': ctxt.request.url,
					'ip': ctxt.request.ip,
					'ips': JSON.parse(safeJsonStringify(ctxt.request.ips || []))
				},

				'response-meta': {
				},

				'query': JSON.parse(safeJsonStringify(ctxt.query || {})),
				'params': JSON.parse(safeJsonStringify(ctxt.params || {})),
				'body': JSON.parse(safeJsonStringify(ctxt.request.body || {})),
				'payload': null,
				'error': null
			};

			const startTime = process.hrtime();
			if(next) {
				_auditLogError = false;
				await next();
				_auditLogError = true;
			}
			const duration = process.hrtime(startTime);

			logMsgMeta.duration = convertHRTime(duration).milliseconds;

			logMsgMeta['response-meta']['headers'] = JSON.parse(safeJsonStringify(ctxt.response.headers));
			logMsgMeta['response-meta']['status'] = {
				'code': ctxt.status,
				'message': statusCodes[ctxt.status]
			};

			logMsgMeta['payload'] = (Buffer.isBuffer(ctxt.body)) ? 'BUFFER' : JSON.parse(safeJsonStringify(ctxt.body || {}));
			logMsgMeta['error'] = ctxt.state.error || (ctxt.status >= 400);

			logMsgMeta['request-meta']['headers']['tenant'] = undefined;

			if(ctxt.request.url.indexOf('websockets') >= 0) {
				ctxt.status = 200;
				ctxt.type = 'application/json; charset=utf-8';
				ctxt.body = logMsgMeta;

				return;
			}

			await this.$dependencies.AuditService.publish(logMsgMeta);
		}
		catch(err) {
			let error = err;

			if(!error) { // eslint-disable-line curly
				error = new PlantWorksSrvcError(`${this.name}::_auditLog: Unknown Error`);
				throw error;
			}

			if(_auditLogError) { // eslint-disable-line curly
				error = new PlantWorksSrvcError(`${this.name}::_auditLog`, error);
				throw error;
			}

			if(!(error instanceof PlantWorksBaseError)) { // eslint-disable-line curly
				error = new PlantWorksSrvcError(`${this.name}::_auditLog::Web Request Error: `, err);
				throw error;
			}

			throw error;
		}
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof WebserverService
	 * @name     _handleOrProxytoCluster
	 *
	 * @param    {object} ctxt - Koa context.
	 * @param    {callback} next - Callback to pass the request on to the next route in the chain.
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Call the Sharding Service to decide whether to handle the request, or to forward it someplace else.
	 */
	async _handleOrProxytoCluster(ctxt, next) {
		let _handleOrProxytoClusterError = true;

		try {
			const hashring = this.$dependencies.ShardingService;
			if(!hashring || !hashring.lookup) {
				_handleOrProxytoClusterError = false;
				await next();
				_handleOrProxytoClusterError = true;

				return;
			}

			if(hashring.allocatedToMe(ctxt.state.tenant.tenant_id)) {
				_handleOrProxytoClusterError = false;
				await next();
				_handleOrProxytoClusterError = true;

				return;
			}

			delete this.$serveFavicons[ctxt.state.tenant.sub_domain];
			delete this.$serveStatics[ctxt.state.tenant.sub_domain];

			const hostPort = [];
			hostPort.push(hashring.lookup(ctxt.state.tenant.tenant_id)['id']);
			hostPort.push(this.$config.internalPort || 9100);
			// hostPort.push(this.$config.internalPort === 9100 ? 9101 : 9100);

			// TODO: Delete the proxy when the node goes off the hashring...
			const dest = `${this.$config.protocol}://${hostPort.join(':')}${ctxt.path}`;
			if(!this.$proxies[dest]) {
				const proxy = require('koa-better-http-proxy');
				this.$proxies[dest] = proxy(dest, {
					'preserveReqSession': true,
					'preserveHostHdr': true
				});
			}

			await this.$proxies[dest](ctxt, next);
		}
		catch(err) {
			let error = err;

			if(!error) { // eslint-disable-line curly
				error = new PlantWorksSrvcError(`${this.name}::_handleOrProxytoCluster: Unknown Error`);
				throw error;
			}

			if(_handleOrProxytoClusterError) { // eslint-disable-line curly
				error = new PlantWorksSrvcError(`${this.name}::_handleOrProxytoCluster`, error);
				throw error;
			}

			if(!(error instanceof PlantWorksBaseError)) { // eslint-disable-line curly
				error = new PlantWorksSrvcError(`${this.name}::_handleOrProxytoCluster::Web Request Error: `, err);
				throw error;
			}

			throw error;
		}
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof WebserverService
	 * @name     _serveTenantFavicon
	 *
	 * @param    {object} ctxt - Koa context.
	 * @param    {callback} next - Callback to pass the request on to the next route in the chain.
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Return the favicon set by the tenant.
	 */
	async _serveTenantFavicon(ctxt, next) {
		const path = require('path');
		const serveFavicon = require('koa-favicon');

		try {
			const tenantFaviconPath = path.join(path.dirname(path.dirname(require.main.filename)), 'static_assets', ctxt.state.tenant['sub_domain'], 'favicon.ico');
			if(!this.$serveFavicons[ctxt.state.tenant.sub_domain]) { // eslint-disable-line curly
				this.$serveFavicons[ctxt.state.tenant.sub_domain] = serveFavicon(tenantFaviconPath);
			}
		}
		catch(err) {
			await next();
			return;
		}

		await this.$serveFavicons[ctxt.state.tenant.sub_domain](ctxt, next);
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof WebserverService
	 * @name     _serveTenantStaticAssets
	 *
	 * @param    {object} ctxt - Koa context.
	 * @param    {callback} next - Callback to pass the request on to the next route in the chain.
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Serve up the static assets from the current tenants folder.
	 */
	async _serveTenantStaticAssets(ctxt, next) {
		const path = require('path');
		const serveStatic = require('koa-static');

		try {
			if(!this.$serveStatics[ctxt.state.tenant.sub_domain]) { // eslint-disable-line curly
				const tenantStaticAssetPath = path.join(path.dirname(path.dirname(require.main.filename)), 'static_assets', ctxt.state.tenant['sub_domain']);
				this.$serveStatics[ctxt.state.tenant.sub_domain] = serveStatic(tenantStaticAssetPath, {
					'maxAge': 86400000
				});
			}
		}
		catch(err) {
			await next();
			return;
		}

		await this.$serveStatics[ctxt.state.tenant.sub_domain](ctxt, next);
	}

	// #endregion

	// #region Miscellaneous
	/**
	 * @function
	 * @instance
	 * @memberof WebserverService
	 * @name     _setupTenantFeatureTree
	 *
	 * @param    {Array} tenantFeatures - List of features this tenant has access to in the database.
	 * @param    {string} parentModuleId - Parent Feature to be considered.
	 *
	 * @returns  {object} Tree structure.
	 *
	 * @summary  Returns a tree structure of the features / sub-features that the tenant has access to.
	 */
	_setupTenantFeatureTree(tenantFeatures, parentModuleId) {
		const thisParentFeatures = {};
		tenantFeatures.forEach((tenantFeature) => {
			if(tenantFeature['parent_id'] !== parentModuleId)
				return;

			thisParentFeatures[tenantFeature.name] = this._setupTenantFeatureTree(tenantFeatures, tenantFeature['id']);
		});

		return thisParentFeatures;
	}
	// #endregion

	// #region Private Methods
	_serverConnection(socket) {
		socket.setTimeout(this.$config.connectionTimeout * 1000);
	}

	_serverError(err) {
		let error = err;

		// eslint-disable-next-line curly
		if(error && !(error instanceof PlantWorksSrvcError)) {
			error = new PlantWorksSrvcError(`${this.name}::_serverError`, error);
		}

		this.$dependencies.LoggerService.error(`${this.name}::_serverError\n\n${error.toString()}`);
	}

	_handleKoaError(err, ctxt) {
		let error = err;

		// eslint-disable-next-line curly
		if(error && !(error instanceof PlantWorksSrvcError)) {
			error = new PlantWorksSrvcError(`${this.name}::_handleKoaError`, error);
		}

		ctxt.state.error = error;
		this._auditLog(ctxt);
	}

	async _listenAndPrintNetworkInterfaces() {
		await snooze(1000);
		await this.$server.listenAsync(this.$config.internalPort || 9090);

		if(plantworksEnv !== 'development' && plantworksEnv !== 'test')
			return;

		const forPrint = [],
			networkInterfaces = require('os').networkInterfaces();

		Object.keys(networkInterfaces).forEach((networkInterfaceName) => {
			const networkInterfaceAddresses = networkInterfaces[networkInterfaceName];

			for(const address of networkInterfaceAddresses)
				forPrint.push({
					'Interface': networkInterfaceName,
					'Protocol': address.family,
					'Address': address.address,
					'Port': this.$config.internalPort || 9100
				});
		});

		console.table(forPrint);
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get Interface() {
		return {
			'App': this.$koa,
			'Router': this.$router,
			'Server': this.$server
		};
	}

	/**
	 * @override
	 */
	get dependencies() {
		return [
			'AuditService',
			'AuthService',
			'CacheService',
			'ConfigurationService',
			'DatabaseService',
			'LocalizationService',
			'LoggerService',
			'ShardingService'
		].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.service = WebserverService;
