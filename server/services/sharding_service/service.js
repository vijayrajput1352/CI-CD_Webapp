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
 * @class   ShardingService
 * @extends {PlantWorksBaseService}
 * @classdesc The Plant.Works Web Application Server Sharding Service.
 *
 * @description
 * Allows the rest of the Plant.Works Modules to use Sharding SDK API.
 *
 */
class ShardingService extends PlantWorksBaseService {
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
	 * @memberof ShardingService
	 * @name     _setup
	 *
	 * @returns  {null} Nothing.
	 *
	 * @summary  Sets up the connection to the Sharding SDK.
	 */
	async _setup() {
		try {
			await super._setup();

			const Promise = require('bluebird');
			// const hashRing = require('swim-hashring');

			return new Promise((resolve, reject) => {
				try {
					const config = JSON.parse(safeJsonStringify(this.$config));
					config.name = process.title;

					// this.$hashring = hashRing(config);
					// this.$hashring.once('error', (err) => {
					// 	reject(new PlantWorksSrvcError(`${this.name}::_setup::hashring error`, err));
					// });

					// this.$hashring.on('up', () => {
					// 	this.$hashring.on('error', this.onShardError.bind(this));
					// 	resolve();
					// });

					resolve();
				}
				catch(err) {
					reject(new PlantWorksSrvcError(`${this.name}::_setup::inner error`, err));
				}
			});
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::_setup::outer error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof ShardingService
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Quits the connection to the Sharding SDK.
	 */
	async _teardown() {
		if(!this.$hashring)
			return null;

		try {
			this.$hashring.off('error', this.onShardError.bind(this));
			this.$hashring.off('steal', this.onKeysAdded.bind(this));
			this.$hashring.off('move', this.onKeysLost.bind(this));

			this.$hashring.close();
			delete this.$hashring;

			await super._teardown();
			return null;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::_teardown error`, err);
		}
	}
	// #endregion

	// #region Private Methods
	async _printInformation() {
		if((plantworksEnv !== 'development') && (plantworksEnv !== 'test'))
			return;

		await snooze(600);
		this.$dependencies.LoggerService.debug(`Sharding cluster initialized at ${this.$hashring.whoami()}`);
	}

	async onShardError(error) {
		if(!(error instanceof PlantWorksSrvcError)) error = new PlantWorksSrvcError(`${this.name}::onShardError`, error);

		const shardingService = this.$hashring;
		if(!shardingService || !shardingService.allocatedToMe) return;

		const amILeader = shardingService.allocatedToMe('LEADER');
		if(!amILeader)
			return;

		const loggerService = this.$dependencies.LoggerService;
		const mailerService = this.$dependencies.MailerService;
		const mailOptions = {
			'from': 'root@plantworks.io',
			'to': 'vish@eronkan.com',
			'subject': 'Plant.Works Hashring Error',
			'text': `Hashring Error: ${safeJsonStringify(arguments, null, '\t')}`
		};

		const mailInfo = await mailerService.sendMailAsync(mailOptions);
		loggerService.error(`Hashring Error: ${safeJsonStringify(arguments, null, '\t')}\nEmail Details: ${safeJsonStringify(mailInfo, null, '\t')}`);
		}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get Interface() {
		return this.$hashring;
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

exports.service = ShardingService;
