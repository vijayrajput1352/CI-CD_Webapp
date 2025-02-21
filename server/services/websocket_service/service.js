'use strict';

/* eslint-disable security/detect-object-injection */

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
const PlantWorksSrvcError = require('plantworks-service-error').PlantWorksServiceError;

/**
 * @class   WebsocketService
 * @extends {PlantWorksBaseService}
 * @classdesc The Plant.Works Web Application Server Websocket Service.
 *
 * @description
 * Allows the rest of the Plant.Works Modules to use Websockets for realtime communication with the front-end.
 *
 */
class WebsocketService extends PlantWorksBaseService {
	// #region Constructor
	constructor(parent, loader) {
		super(parent, loader);
	}
	// #endregion

	// #region reconfiguration code
	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof WebsocketService
	 * @name     _dependencyReconfigure
	 *
	 * @param    {PlantWorksBaseModule} dependency - Instance of the dependency that was reconfigured.
	 *
	 * @returns  {null} Nothing.
	 *
	 * @summary  If WebserverService was reconfigured, reset. Otherwise, ignore
	 */
	async _dependencyReconfigure(dependency) {
		try {
			const superStatus = await super._dependencyReconfigure(dependency);
			if(dependency.name !== 'WebserverService')
				return superStatus;

			await this._teardown();
			await this._setup();

			return superStatus;
		}
		catch(err) {
			console.error(`${this.name}::_dependencyReconfigure error: ${err.message}\n${err.stack}`);
			return null;
		}
	}
	// #endregion

	// #region startup/teardown code
	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof WebsocketService
	 * @name     _setup
	 *
	 * @returns  {null} Nothing.
	 *
	 * @summary  Sets up the Websocket Server.
	 */
	async _setup() {
		try {
			if(this.$websocketServer)
				return null;

			await super._setup();

			const PrimusRooms = require('primus-rooms');
			const PrimusServer = require('primus');

			// Step 1: Setup the realtime streaming server
			const thisConfig = JSON.parse(safeJsonStringify(this.$config.primus));
			this.$websocketServer = new PrimusServer(this.$dependencies.WebserverService.Server, thisConfig);

			// Step 2: Re-use Koa middlewares so we don't duplicate session / cookie handling
			const self = this; // eslint-disable-line consistent-this
			this.$websocketServer.use('plantworks', function() {
				const httpMocks = require('node-mocks-http');
				const koaRequestHandler = self.$dependencies.WebserverService.App.callback();

				const plantworksPrimusMiddleware = async function(request, response, next) {
					try {
						const mockResponse = httpMocks.createResponse({
							'locals': response.locals,
							'req': request
						});

						await koaRequestHandler(request, mockResponse);
						const responseData = JSON.parse(mockResponse._getData());

						request.headers['x-request-id'] = responseData.id;
						request.user = responseData.user;
						request.tenant = responseData.tenant;
					}
					catch(err) {
						const error = new PlantWorksSrvcError(`WebsocketService::plantworksPrimusMiddleware error`, err);
						self.$dependencies.LoggerService.error(error.toString());
					}

					next();
				};

				return plantworksPrimusMiddleware;
			}, undefined, 0);

			// Step 3: Authorization hook
			this.$websocketServer.authorize(this._authorizeWebsocketConnection.bind(this));

			// Step 4: Primus extensions...
			this.$websocketServer.plugin('rooms', PrimusRooms);

			// Step 5: Attach the event handlers...
			this.$websocketServer.on('initialised', this._websocketServerInitialised.bind(this));
			this.$websocketServer.on('log', this._websocketServerLog.bind(this));
			this.$websocketServer.on('error', this._websocketServerError.bind(this));

			// Step 6: Log connection / disconnection events
			this.$websocketServer.on('connection', this._websocketServerConnection.bind(this));
			this.$websocketServer.on('disconnection', this._websocketServerDisconnection.bind(this));

			// And we're done...
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
	 * @memberof WebsocketService
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Destroys the Websocket Server.
	 */
	async _teardown() {
		try {
			if(!this.$websocketServer)
				return null;

			this.$websocketServer.end({
				'close': true,
				'reconnect': false,
				'timeout': 10
			});

			delete this.$websocketServer;

			await super._teardown();
			return null;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::_teardown error`, err);
		}
	}
	// #endregion

	// #region Private Methods
	_authorizeWebsocketConnection(request, callback) {
		if(callback) callback(!request.user);
	}

	async _websocketServerInitialised(transformer, parser, options) {
		if((plantworksEnv !== 'development') && (plantworksEnv !== 'test'))
			return;

		await snooze(1000);
		this.$dependencies.LoggerService.debug(`Websocket Server has been initialised with options`, options);
	}

	_websocketServerLog() {
		const loggerSrvc = this.$dependencies.LoggerService;
		if(plantworksEnv === 'development') loggerSrvc.debug(`Websocket Server Log`, safeJsonStringify(arguments, undefined, '\t'));
	}

	_websocketServerError() {
		const loggerSrvc = this.$dependencies.LoggerService;
		loggerSrvc.error(`Websocket Server Error`, safeJsonStringify(arguments, undefined, '\t'));

		this.emit('websocket-error', arguments);
	}

	_websocketServerConnection(spark) {
		const username = spark.request.user ? spark.request.user.name : 'Anonymous';

		if(plantworksEnv === 'development') {
			const loggerSrvc = this.$dependencies.LoggerService;
			loggerSrvc.debug(`Websocket Connection for user ${username}`);
		}

		if(this.$websocketServer) this.$websocketServer.emit('websocket-connect', spark);
		spark.write({ 'channel': 'display-status-message', 'data': `Realtime Data connection established for User: ${username}` });
	}

	_websocketServerDisconnection(spark) {
		const username = spark.request.user ? spark.request.user.name : 'Anonymous';

		if(plantworksEnv === 'development') {
			const loggerSrvc = this.$dependencies.LoggerService;
			loggerSrvc.debug(`Websocket Disconnection for user ${username}`);
		}

		if(this.$websocketServer) this.$websocketServer.emit('websocket-disconnect', spark);

		spark.leaveAll();
		spark.removeAllListeners();
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get Interface() {
		return this.$websocketServer;
	}

	/**
	 * @override
	 */
	get dependencies() {
		return [
			'LoggerService',
			'WebserverService'
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

exports.service = WebsocketService;
