'use strict';

/* eslint-disable no-loop-func */
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
const PlantWorksSrvcError = require('plantworks-service-error').PlantWorksServiceError;
const replyQueue = 'amq.rabbitmq.reply-to';

/**
 * @class   RpcService
 * @extends {PlantWorksBaseService}
 * @classdesc The Plant.Works Web Application Server RPC Service.
 *
 * @description
 * Allows the rest of the Plant.Works Modules to call Remote procedures or subscrbie to RPC queues.
 *
 */
class RpcService extends PlantWorksBaseService {
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
	 * @memberof RpcService
	 * @name     _setup
	 *
	 * @returns  {null} Nothing.
	 *
	 * @summary  Sets up connections to the messaging servers.
	 */
	async _setup() {
		try {
			await super._setup();

			Object.defineProperty(this, '$activeRequests', {
				'__proto__': null,
				'configurable': true,
				'writable': true,

				'value': {}
			});

			Object.defineProperty(this, '$listeners', {
				'__proto__': null,
				'configurable': true,
				'writable': true,

				'value': {}
			});

			Object.defineProperty(this, '$connection', {
				'__proto__': null,
				'configurable': true,
				'writable': true,

				'value': null
			});

			Object.defineProperty(this, '$requestChannel', {
				'__proto__': null,
				'configurable': true,
				'writable': true,

				'value': null
			});

			Object.defineProperty(this, '$listenerChannel', {
				'__proto__': null,
				'configurable': true,
				'writable': true,

				'value': null
			});

			Object.defineProperty(this, '$consumerTag', {
				'__proto__': null,
				'configurable': true,
				'writable': true,

				'value': null
			});

			const AMQPLib = require('amqplib');

			const connection = await AMQPLib.connect(this.$config);

			this.$requestChannel = await connection.createChannel();
			this.$listenerChannel = await connection.createChannel();

			connection.on('error', this._handleAmqpError.bind(this));

			this.$requestChannel.on('error', this._handleAmqpError.bind(this));
			this.$listenerChannel.on('error', this._handleAmqpError.bind(this));

			await this.$requestChannel.prefetch(this.$config['requestPrefetch']);
			await this.$listenerChannel.prefetch(this.$config['listenerPrefetch']);

			const consumerData = await this.$requestChannel.consume(replyQueue, this._handleRpcResponse.bind(this), {
				'noAck': true
			});

			this.$consumerTag = consumerData.consumerTag;

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
	 * @memberof RpcService
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Quits the connection to the messaging servers.
	 */
	async _teardown() {
		try {
			// eslint-disable-next-line curly
			if(this.$consumerTag && this.$requestChannel) {
				await this.$requestChannel.cancel(replyQueue, this.$consumerTag);
				delete this.$consumerTag;
			}

			if(this.$requestChannel) {
				await this.$requestChannel.close();
				delete this.$requestChannel;
			}

			if(this.$listenerChannel) {
				await this.$listenerChannel.close();
				delete this.$listenerChannel;
			}

			if(this.$connection) {
				await this.$connection.close();
				delete this.$connection;
			}

			delete this.$activeRequests;
			delete this.$listeners;

			await super._teardown();
			return null;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::_teardown error`, err);
		}
	}
	// #endregion

	// #region API
	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof RpcService
	 * @name     callRemoteProcedure
	 *
	 * @param    {string} topic - The topic to publish on.
	 * @param    {object} data - The data to publish.
	 *
	 * @returns  {object} Response from remote server.
	 *
	 * @summary  Publishes data to the specified queues.
	 */
	async callRemoteProcedure(topic, data) {
		try {
			const channel = this.$requestChannel;
			const exchange = this.$config['exchange'];
			const correlationId = this._generateCorrelationId();

			await channel.checkQueue(topic);

			const response = new Promise((resolve, reject) => {
				this.$activeRequests[correlationId] = {
					'resolve': resolve,
					'reject': reject
				};

				setTimeout(() => {
					reject(new Error(`RPC Request timeout: ${topic} - ${correlationId}`));
					delete this.$activeRequests[correlationId];
				}, this.$config['requestTimeout']);
			});

			const pubStatus = await channel.publish(exchange, topic, Buffer.from(safeJsonStringify(data), 'utf-8'), {
				'replyTo': replyQueue,
				'correlationId': correlationId
			});

			// eslint-disable-next-line curly
			if(!pubStatus)
				throw new Error(`Channel Buffer Full: ${topic}`);

			return response;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::callRemoteProcedure error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof RpcService
	 * @name     subscribe
	 *
	 * @param    {string} topic - The topic to subscribe to.
	 * @param    {Function} listener - The callback to invoke when data is received.
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Subscribes the listener to the specified queues.
	 */
	async subscribe(topic, listener) {
		try {
			const channel = this.$listenerChannel;
			await channel.checkQueue(topic);

			if(!this.$listeners)
				this.$listeners = {};

			if(this.$listeners[topic])
				throw new Error(`This RPC queue already has subscriber - ${topic}`);

			this.$listeners[topic] = {};

			// eslint-disable-next-line curly
			const consumeResult = await channel.consume(topic, this._handleRpcRequest.bind(this, topic));
			this.$listeners[topic]['consumerId'] = consumeResult['consumerTag'];

			this.$listeners[topic]['consumer'] = listener;

			return null;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::subscribe error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof RpcService
	 * @name     unsubscribe
	 *
	 * @param    {string} topic - The topic to unsubscribe from.
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Unubscribes the listener to the specified queues.
	 */
	async unsubscribe(topic) {
		try {
			if(!this.$listeners[topic])
				throw new Error('RPC subscription does not exist');

			const channel = this.$listenerChannel;
			await channel.cancel(this.$listeners[topic]['consumerId']);

			delete this.$listeners[topic];

			return null;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::unsubscribe error`, err);
		}
	}
	// #endregion

	// #region Private Methods
	async _handleRpcResponse(message) {
		try {
			const messageContent = message.content.toString('utf-8');
			const correlationId = message.properties.correlationId;
			if(!this.$activeRequests[correlationId])
				return;

			try {
				const response = JSON.parse(messageContent);
				if(response.error)
					this.$activeRequests[correlationId]['reject'](new Error(messageContent.data));
				else
					this.$activeRequests[correlationId]['resolve'](response.data);
			}
			catch(err) {
				this.$activeRequests[correlationId]['reject'](err);
			}

			delete this.$activeRequests[correlationId];
		}
		catch(err) {
			this.$dependencies.LoggerService.error(new PlantWorksSrvcError(`${this.name}::_handleRpcResponse::error`, err).toString());
		}
	}

	async _handleRpcRequest(topic, message) {
		try {
			const channel = this.$listenerChannel;
			const messageContent = message.content.toString('utf-8');
			const correlationId = message.properties.correlationId;

			if(!this.$listeners[topic] || !this.$listeners[topic]['consumer']) {
				await channel.nack(message);
				throw new Error(`No Listener register on this topic - ${topic}`);
			}

			let responseData = null;
			let isError = false;
			try {
				responseData = await this.$listeners[topic]['consumer'](topic, JSON.parse(messageContent));
			}
			catch(err) {
				const errorString = new PlantWorksSrvcError(`${this.name}::_handleRpcRequest::error`, err).toString();
				this.$dependencies.LoggerService.error(errorString);
				isError = true;
				responseData = errorString;
			}

			const response = {
				'error': isError,
				'data': responseData
			};

			await channel.publish('', message.properties.replyTo, Buffer.from(safeJsonStringify(response), 'utf-8'), {
				'correlationId': correlationId
			});

			await channel.ack(message);
		}
		catch(err) {
			this.$dependencies.LoggerService.error(new PlantWorksSrvcError(`${this.name}::_handleRpcRequest::error`, err).toString());
		}
	}
	_handleAmqpError(err) {
		throw new PlantWorksSrvcError(`${this.name}::_handleAmqpError error`, err);
	}

	_generateCorrelationId() {
		const uuid = require('uuid/v4');
		return `plantworks!rpcrequest!${uuid()}`;
	}

	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get Interface() {
		return {
			'callRemoteProcedure': this.callRemoteProcedure.bind(this),
			'subscribe': this.subscribe.bind(this),
			'unsubscribe': this.unsubscribe.bind(this)
		};
	}

	/**
	 * @override
	 */
	get dependencies() {
		return ['ConfigurationService', 'LoggerService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.service = RpcService;
