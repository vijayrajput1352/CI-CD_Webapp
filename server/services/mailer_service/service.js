/* eslint-disable security/detect-object-injection */
'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseService = require('plantworks-base-service').PlantWorksBaseService;
const PlantWorksSrvcError = require('plantworks-service-error').PlantWorksServiceError;

/**
 * @class   MailerService
 * @extends {PlantWorksBaseService}
 * @classdesc The Plant.Works Web Application Server SMTP Service.
 *
 * @description
 * Allows the rest of the Plant.Works Modules to send emails via SMTP.
 *
 */
class MailerService extends PlantWorksBaseService {
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
	 * @memberof MailerService
	 * @name     _setup
	 *
	 * @returns  {null} Nothing.
	 *
	 * @summary  Sets up the connection to the SMTP server.
	 */
	async _setup() {
		try {
			return null;
			await super._setup();

			const self = this; // eslint-disable-line consistent-this
			const loggerProxy = {
				'log': function() {
					if(!self.$dependencies.LoggerService)
						return;

					if(!self.$dependencies.LoggerService.log)
						return;

					self.$dependencies.LoggerService.silly(...arguments);
				},
				'trace': function() {
					if(!self.$dependencies.LoggerService)
						return;

					if(!self.$dependencies.LoggerService.silly)
						return;

					self.$dependencies.LoggerService.silly(...arguments);
				},
				'silly': function() {
					if(!self.$dependencies.LoggerService)
						return;

					if(!self.$dependencies.LoggerService.silly)
						return;

					self.$dependencies.LoggerService.silly(...arguments);
				},

				'debug': function() {
					if(!self.$dependencies.LoggerService)
						return;

					if(!self.$dependencies.LoggerService.debug)
						return;

					self.$dependencies.LoggerService.debug(...arguments);
				},

				'verbose': function() {
					if(!self.$dependencies.LoggerService)
						return;

					if(!self.$dependencies.LoggerService.verbose)
						return;

					self.$dependencies.LoggerService.verbose(...arguments);
				},

				'info': function() {
					if(!self.$dependencies.LoggerService)
						return;

					if(!self.$dependencies.LoggerService.info)
						return;

					self.$dependencies.LoggerService.info(...arguments);
				},

				'warn': function() {
					if(!self.$dependencies.LoggerService)
						return;

					if(!self.$dependencies.LoggerService.warn)
						return;

					self.$dependencies.LoggerService.warn(...arguments);
				},

				'error': function() {
					if(!self.$dependencies.LoggerService)
						return;

					if(!self.$dependencies.LoggerService.error)
						return;

					self.$dependencies.LoggerService.error(...arguments);
				}
			};

			const promises = require('bluebird');
			const mailer = promises.promisifyAll(require('nodemailer'));
			const aws = this.$dependencies.AwsService;
			const mode = this.$config.mode;
			let transporter;

			this.$config[mode].transporter.debug = (plantworksEnv === 'development') || (plantworksEnv === 'test');
			this.$config[mode].transporter.logger = loggerProxy;

			if(this.$config[mode].test) {
				const account = await mailer.createTestAccountAsync();

				this.$config[mode].transporter.auth.user = account.user;
				this.$config[mode].transporter.auth.pass = account.pass;
			}

			if(this.$config.mode === 'AWS-SES') {
				aws.config.update(this.$config[mode].transporter);
				transporter = promises.promisifyAll(mailer.createTransport({
					'SES': new aws.SES()
				}));
			}
			else {
				transporter = promises.promisifyAll(mailer.createTransport(this.$config[mode].transporter));
			}

			this.$smtpTransporter = transporter;
			await this.$smtpTransporter.verifyAsync();

			return null;
		}
		catch(err) {
			const error = new PlantWorksSrvcError(`${this.name}::_setup error`, err);
			this.$dependencies.LoggerService.error(error.toString());
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof MailerService
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Quits the connection to the SMTP server.
	 */
	async _teardown() {
		try {
			if(this.$smtpTransporter) {
				this.$smtpTransporter.close();
				delete this.$smtpTransporter;
			}

			await super._teardown();
			return null;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::_teardown error`, err);
		}
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get Interface() {
		return this.$smtpTransporter;
	}

	/**
	 * @override
	 */
	get dependencies() {
		return ['AwsService', 'ConfigurationService', 'LoggerService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.service = MailerService;
