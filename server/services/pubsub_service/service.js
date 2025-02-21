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

/**
 * @class   PubsubService
 * @extends {PlantWorksBaseService}
 * @classdesc The Plant.Works Web Application Server Publish/Subscribe Service.
 *
 * @description
 * Allows the rest of the Plant.Works Modules to use publish / subscribe to topics.
 *
 */
class PubsubService extends PlantWorksBaseService {
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
	 * @memberof PubsubService
	 * @name     _setup
	 *
	 * @returns  {null} Nothing.
	 *
	 * @summary  Sets up connections to the messaging servers.
	 */
	async _setup() {
		try {
			await super._setup();

			Object.defineProperty(this, '$listeners', {
				'__proto__': null,
				'configurable': true,
				'writable': true,

				'value': {}
			});

			const pubsubStrategies = Object.keys(this.$config);

			// eslint-disable-next-line curly
			for await (const pubsubStrategy of pubsubStrategies) {
				if(this.$config[pubsubStrategy]['type'] === 'redis') {
					this.$config[pubsubStrategy]['options']['retry_strategy'] = (options) => {
						if(options.error && options.error.code === 'ECONNREFUSED')
							throw new PlantWorksSrvcError(`${this.name}::retry_strategy::Server refused connection`, options.error);

						if(options.total_retry_time > 1000 * 60 * 60)
							throw new PlantWorksSrvcError('Retry time exhausted');

						if(options.times_connected > 10)
							return undefined;

						// reconnect after
						return Math.max(options.attempt * 100, 3000);
					};

					const promises = require('bluebird');
					const redis = require('redis');

					redis.RedisClient.prototype = promises.promisifyAll(redis.RedisClient.prototype);
					redis.Multi.prototype = promises.promisifyAll(redis.Multi.prototype);

					this.$listeners[pubsubStrategy] = {
						'type': 'redis',
						'connected': undefined,
						'publish_client': redis.createClient(this.$config[pubsubStrategy]['port'], this.$config[pubsubStrategy]['host'], this.$config[pubsubStrategy]['options']),
						'subscribe_client': redis.createClient(this.$config[pubsubStrategy]['port'], this.$config[pubsubStrategy]['host'], this.$config[pubsubStrategy]['options'])
					};

					this.$listeners[pubsubStrategy]['publish_client'].once('connect', async () => {
						this.$listeners[pubsubStrategy]['publish_client'].on('error', this._handleRedisError.bind(this));
						this.$listeners[pubsubStrategy]['connected'] = (this.$listeners[pubsubStrategy]['connected'] === undefined) ? true : (this.$listeners[pubsubStrategy]['connected'] && true);
					});

					this.$listeners[pubsubStrategy]['publish_client'].once('error', () => {
						this.$listeners[pubsubStrategy]['connected'] = false;
					});

					this.$listeners[pubsubStrategy]['subscribe_client'].once('connect', async () => {
						this.$listeners[pubsubStrategy]['subscribe_client'].on('error', this._handleRedisError.bind(this));
						this.$listeners[pubsubStrategy]['subscribe_client'].on('pmessage', this._handleRedisMessage.bind(this));

						this.$listeners[pubsubStrategy]['connected'] = (this.$listeners[pubsubStrategy]['connected'] === undefined) ? true : (this.$listeners[pubsubStrategy]['connected'] && true);
					});

					this.$listeners[pubsubStrategy]['subscribe_client'].once('error', () => {
						this.$listeners[pubsubStrategy]['connected'] = false;
					});
				}

				// TODO: AMQPLib Client
				if (this.$config[pubsubStrategy]['type'] === 'amqp') {
                    const AMQPLib = require('amqplib');
                    let connection = null;

                    const connectToAMQP = async () => {
                        try {
                            connection = await AMQPLib.connect(this.$config[pubsubStrategy]);
                            connection.on('error', this._handleAmqpError.bind(this));

                            this.$listeners[pubsubStrategy] = {
                                'type': 'amqp',
                                'connected': undefined,
                                'connection': connection,
                                'publish_client': await connection.createChannel(),
                                'subscribe_client': await connection.createChannel()
                            };

                            this.$listeners[pubsubStrategy]['publish_client'].on('error', this._handleAmqpError.bind(this));
                            this.$listeners[pubsubStrategy]['subscribe_client'].on('error', this._handleAmqpError.bind(this));

                            this.$listeners[pubsubStrategy]['connected'] = (this.$listeners[pubsubStrategy]['connected'] === undefined) ? true : (this.$listeners[pubsubStrategy]['connected'] && true);

                            this.$listeners[pubsubStrategy]['publish_client'].once('error', () => {
                                this.$listeners[pubsubStrategy]['connected'] = false;
                            });

                            this.$listeners[pubsubStrategy]['subscribe_client'].once('error', () => {
                                this.$listeners[pubsubStrategy]['connected'] = false;
                            });

                            if (this.$config[pubsubStrategy]['prefetch']) {
                                await this.$listeners[pubsubStrategy]['subscribe_client'].prefetch(this.$config[pubsubStrategy]['prefetch']);
                            }

                            console.log('Connected to AMQP');
                        } catch (error) {
                            console.error('Error connecting to AMQP:', error);
                            console.log('Retrying in 1 minute...');
                            setTimeout(connectToAMQP, 60000); // retry in 1 minute
                        }
                    };

                    connectToAMQP();
                }
			}

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
	 * @memberof PubsubService
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Quits the connection to the messaging servers.
	 */
	async _teardown() {
		try {
			const pubsubStrategies = Object.keys(this.$config);

			// eslint-disable-next-line curly
			for await (const pubsubStrategy of pubsubStrategies) {
				if(this.$config[pubsubStrategy]['type'] === 'redis' && this.$listeners && this.$listeners[pubsubStrategy]) {
					if(this.$listeners[pubsubStrategy]['publish_client'])
						await this.$listeners[pubsubStrategy]['publish_client'].quitAsync();

					if(this.$listeners[pubsubStrategy]['subscribe_client'])
						await this.$listeners[pubsubStrategy]['subscribe_client'].quitAsync();

					if(this.$listeners[pubsubStrategy]['publish_client'])
						this.$listeners[pubsubStrategy]['publish_client'].end(true);

					if(this.$listeners[pubsubStrategy]['subscribe_client'])
						this.$listeners[pubsubStrategy]['subscribe_client'].end(true);

					delete this.$listeners[pubsubStrategy];
				}

				// TODO: AMQPLib Client
				if(this.$config[pubsubStrategy]['type'] === 'amqp' && this.$listeners && this.$listeners[pubsubStrategy]) {
					if(this.$listeners[pubsubStrategy]['publish_client'])
						await this.$listeners[pubsubStrategy]['publish_client'].close();

					if(this.$listeners[pubsubStrategy]['subscribe_client'])
						await this.$listeners[pubsubStrategy]['subscribe_client'].close();

					if(this.$listeners[pubsubStrategy]['connection'])
						await this.$listeners[pubsubStrategy]['connection'].close();

					if(this.$listeners[pubsubStrategy]['noDataTimeout'])
						clearTimeout(this.$listeners[pubsubStrategy]['noDataTimeout']);

					delete this.$listeners[pubsubStrategy];
				}
			}

			this.$listeners = null;
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
	 * @memberof PubsubService
	 * @name     publish
	 *
	 * @param    {string} strategy - The messaging server/exchange to connect to.
	 * @param    {string} topic - The topic to publish on.
	 * @param    {object} data - The data to publish.
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Publishes data to the specified queues.
	 */
	async publish(strategy, topic, data/* , options */) { // eslint-disable-line no-inline-comments
		try {
			let publishCount = 0;

			if(!Array.isArray(strategy))
				strategy = [strategy];

			const pubsubStrategies = Object.keys(this.$config);
			for await (const pubsubStrategy of pubsubStrategies) {
				if(!strategy.includes('*') && !strategy.includes(pubsubStrategy))
					continue;

				if(this.$config[pubsubStrategy]['type'] === 'redis') {
					const pubClient = this.$listeners[pubsubStrategy]['publish_client'];
					await pubClient.publishAsync(topic, data);

					publishCount++;
				}

				// TODO: AMQPLib Client
				if(this.$config[pubsubStrategy]['type'] === 'amqp') {
					const channel = this.$listeners[pubsubStrategy]['publish_client'];
					const exchange = this.$config[pubsubStrategy]['exchange'];

					await channel.checkQueue(topic);

					const pubStatus = await channel.publish(exchange, topic, Buffer.from(data, 'utf-8'));

					// eslint-disable-next-line curly
					if(!pubStatus) {
						throw new Error(`Channel Buffer Full: ${strategy} - ${topic}`);
					}

					publishCount++;
				}
			}

			if(!publishCount) throw new Error(`Unknown Strategy: ${strategy}`);
			return null;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::publish error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof PubsubService
	 * @name     subscribe
	 *
	 * @param    {string} strategy - The messaging server/exchange to connect to.
	 * @param    {string} topic - The topic to subscribe to.
	 * @param    {Function} listener - The callback to invoke when data is received.
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Subscribes the listener to the specified queues.
	 */
	async subscribe(strategy, topic, listener) {
		try {
			let subscribeCount = 0;

			if(!Array.isArray(strategy))
				strategy = [strategy];

			const pubsubStrategies = Object.keys(this.$config);
			for await (const pubsubStrategy of pubsubStrategies) {
				if(!strategy.includes('*') && !strategy.includes(pubsubStrategy))
					continue;

				if(this.$config[pubsubStrategy]['type'] === 'redis') {
					if(!this.$listeners[pubsubStrategy]['subscribers']) this.$listeners[pubsubStrategy]['subscribers'] = {};
					if(!this.$listeners[pubsubStrategy]['subscribers'][topic]) this.$listeners[pubsubStrategy]['subscribers'][topic] = [];
					this.$listeners[pubsubStrategy]['subscribers'][topic].push(listener);

					const subClient = this.$listeners[pubsubStrategy]['subscribe_client'];
					await subClient.psubscribeAsync(topic);
				}

				// TODO: AMQPLib Client
				if(this.$config[pubsubStrategy]['type'] === 'amqp') {
					const channel = this.$listeners[pubsubStrategy]['subscribe_client'];
					const exchange = this.$config[pubsubStrategy]['exchange'];
					const exchangeType = this.$config[pubsubStrategy]['exchangeType'];


					await channel.assertExchange(exchange, exchangeType, {
						'durable': true
					});

					await channel.checkQueue(topic);

					if(!this.$listeners[pubsubStrategy]['subscribers'])
						this.$listeners[pubsubStrategy]['subscribers'] = {};

					if(!this.$listeners[pubsubStrategy]['subscribers'][topic])
						this.$listeners[pubsubStrategy]['subscribers'][topic] = {
							'consumers': [],
							'consumerId': null
						};

					// eslint-disable-next-line curly
					if(!this.$listeners[pubsubStrategy]['subscribers'][topic]['consumerId']) {
						const consumeResult = await channel.consume(topic, this._handleAmqpMessage.bind(this, pubsubStrategy));
						this.$listeners[pubsubStrategy]['subscribers'][topic]['consumerId'] = consumeResult['consumerTag'];
					}

					this.$listeners[pubsubStrategy]['subscribers'][topic]['consumers'].push(listener);

					if(plantworksEnv !== 'development' && !this.$listeners[pubsubStrategy]['noDataTimeout'] && this.$config[pubsubStrategy]['noDataTimeout'])
						this.$listeners[pubsubStrategy]['noDataTimeout'] = setTimeout(this._handleAmqpNoDataTimeout.bind(this, this.$config[pubsubStrategy]['noDataTimeout']), this.$config[pubsubStrategy]['noDataTimeout']);

					subscribeCount++;
				}

				subscribeCount++;
			}

			if(!subscribeCount) throw new Error(`Unknown Strategy: ${strategy}`);
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
	 * @memberof PubsubService
	 * @name     unsubscribe
	 *
	 * @param    {string} strategy - The messaging server/exchange to connect to.
	 * @param    {string} topic - The topic to unsubscribe from.
	 * @param    {Function} listener - The callback that was used for subscribing.
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Unubscribes the listener to the specified queues.
	 */
	async unsubscribe(strategy, topic, listener) {
		try {
			let unsubscribeCount = 0;

			if(!Array.isArray(strategy))
				strategy = [strategy];

			const pubsubStrategies = Object.keys(this.$config);
			for await (const pubsubStrategy of pubsubStrategies) {
				if(!strategy.includes('*') && !strategy.includes(pubsubStrategy))
					continue;

				if((this.$config[pubsubStrategy]['type'] === 'redis') && (this.$listeners[pubsubStrategy]['subscribers']) && (this.$listeners[pubsubStrategy]['subscribers'][topic])) {
					const listenerIdx = this.$listeners[pubsubStrategy]['subscribers'][topic].indexOf(listener);
					if(listenerIdx >= 0) this.$listeners[pubsubStrategy]['subscribers'][topic].splice(listenerIdx, 1);

					if(!this.$listeners[pubsubStrategy]['subscribers'][topic]['length']) {
						const subClient = this.$listeners[pubsubStrategy]['subscribe_client'];
						await subClient.punsubscribeAsync(topic);
					}
				}

				// TODO: AMQPLib Client
				if((this.$config[pubsubStrategy]['type'] === 'amqp') && (this.$listeners[pubsubStrategy]['subscribers']) && (this.$listeners[pubsubStrategy]['subscribers'][topic])) {
					const channel = this.$listeners[pubsubStrategy]['subscribe_client'];

					const listenerIdx = this.$listeners[pubsubStrategy]['subscribers'][topic]['consumers'].indexOf(listener);
					if(listenerIdx >= 0) this.$listeners[pubsubStrategy]['subscribers'][topic]['consumers'].splice(listenerIdx, 1);

					if(!this.$listeners[pubsubStrategy]['subscribers'][topic]['consumers'].length) {
						await channel.cancel(this.$listeners[pubsubStrategy]['subscribers'][topic]['consumerId']);
						this.$listeners[pubsubStrategy]['subscribers'][topic]['consumerId'] = null;
					}

					if(plantworksEnv !== 'development' && this.$listeners[pubsubStrategy]['noDataTimeout']) {
						const totalSubCount = Object.keys(this.$listeners[pubsubStrategy]['subscribers']).map((subscribedTopic) => {
							return this.$listeners[pubsubStrategy]['subscribers'][subscribedTopic]['consumers']['length'];
						})
						.reduce((acc, curr) => {
							return acc + curr;
						}, 0);

						if(!totalSubCount) {
							clearTimeout(this.$listeners[pubsubStrategy]['noDataTimeout']);
							this.$listeners[pubsubStrategy]['noDataTimeout'] = null;
						}
					}
				}

				unsubscribeCount++;
			}

			if(!unsubscribeCount) throw new Error(`Unknown Strategy: ${strategy}`);
			return null;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::unsubscribe error`, err);
		}
	}
	// #endregion

	// #region Private Methods
	async _handleRedisMessage(pattern, channel, message) {
		const pubsubStrategies = Object.keys(this.$config);
		for await (const pubsubStrategy of pubsubStrategies) {
			if(this.$config[pubsubStrategy]['type'] !== 'redis')
				continue;

			if(this.$listeners[pubsubStrategy]['subscribers'] && this.$listeners[pubsubStrategy]['subscribers'][pattern] && this.$listeners[pubsubStrategy]['subscribers'][pattern]['length']) { // eslint-disable-line curly
				for await (const listener of this.$listeners[pubsubStrategy]['subscribers'][pattern]) { // eslint-disable-line curly
					try {
						await listener(channel, message);
					}
					catch(err) {
						this.$dependencies.LoggerService.error(new PlantWorksSrvcError(`${this.name}::_handleRedisMessage::pattern:${pattern}/${channel}`, err));
					}
				}
			}

			if(pattern === channel)
				continue;

			if(this.$listeners[pubsubStrategy]['subscribers'] && this.$listeners[pubsubStrategy]['subscribers'][channel] && this.$listeners[pubsubStrategy]['subscribers'][channel]['length']) { // eslint-disable-line curly
				for await (const listener of this.$listeners[pubsubStrategy]['subscribers'][channel]) { // eslint-disable-line curly
					try {
						await listener(channel, message);
					}
					catch(err) {
						this.$dependencies.LoggerService.error(new PlantWorksSrvcError(`${this.name}::_handleRedisMessage::pattern:${pattern}/${channel}`, err));
					}
				}
			}
		}
	}

	async _handleAmqpMessage(pubsubStrategy, message) {
		const topic = message.fields.routingKey;
		const messageContent = message.content.toString('utf-8');

		try {
			if(!this.$listeners[pubsubStrategy])
				throw new Error(`Unknown Strategy: ${pubsubStrategy}`);

			if(!this.$listeners[pubsubStrategy]['subscribers'][topic])
				throw new Error(`Unsubscribed Topic: ${topic}`);
		}
		catch(err) {
			if(this.$listeners[pubsubStrategy] && this.$listeners[pubsubStrategy]['subscribe_client']) { // eslint-disable-line curly
				this.$listeners[pubsubStrategy]['subscribe_client'].ack(message);
			}

			this.$dependencies.LoggerService.error(new PlantWorksSrvcError(`${this.name}::_handleAmqpMessage::Error for Strategy "${pubsubStrategy}" and Topic "${topic}"`, err).toString());
			return;
		}

		try {
			let cleanExecutions = 0;

			if(plantworksEnv !== 'development' && this.$config[pubsubStrategy]['noDataTimeout']) {
				if(this.$listeners[pubsubStrategy]['noDataTimeout'])
					clearTimeout(this.$listeners[pubsubStrategy]['noDataTimeout']);
				this.$listeners[pubsubStrategy]['noDataTimeout'] = setTimeout(this._handleAmqpNoDataTimeout.bind(this, this.$config[pubsubStrategy]['noDataTimeout']), this.$config[pubsubStrategy]['noDataTimeout']);
			}

			for(let idx = 0; idx < this.$listeners[pubsubStrategy]['subscribers'][topic]['consumers'].length; idx++) {
				const consumer = this.$listeners[pubsubStrategy]['subscribers'][topic]['consumers'][idx];

				try {
					await consumer(topic, messageContent);
					cleanExecutions++;
				}
				catch(err) {
					this.$dependencies.LoggerService.error(new PlantWorksSrvcError(`${this.name}::_handleAmqpMessage::Consumer Error for Strategy "${pubsubStrategy}" and Topic "${topic}":`, err).toString());
				}
			}

			if(cleanExecutions) {
				this.$listeners[pubsubStrategy]['subscribe_client'].ack(message);
			}
			else {
				this.$listeners[pubsubStrategy]['subscribe_client'].nack(message, false, true);
				throw new Error(`All Consumers Failed To process message for Strategy "${pubsubStrategy}" and Topic "${topic}"::Message: ${messageContent}`);
			}
		}
		catch(err) {
			this.$dependencies.LoggerService.error(new PlantWorksSrvcError(`${this.name}::_handleAmqpMessage::error`, err).toString());
		}
	}

	_handleRedisError(err) {
		this.$dependencies.LoggerService.error(new PlantWorksSrvcError(`${this.name}::_handleRedisError error`, err).toString());
	}

	_handleAmqpError(err) {
		throw new PlantWorksSrvcError(`${this.name}::_handleAmqpError error`, err);
	}

	_handleAmqpNoDataTimeout(timeoutDuration) {
		const timeoutSeconds = Number(timeoutDuration) / 1000;
		throw new PlantWorksSrvcError(`${this.name}::_handleAmqpNoDataTimeout::No Data Received For ${timeoutSeconds} seconds`);
	}

	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get Interface() {
		return {
			'publish': this.publish.bind(this),
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

exports.service = PubsubService;
