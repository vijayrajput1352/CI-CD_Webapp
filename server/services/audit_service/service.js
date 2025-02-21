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

const PlantWorksBaseError = require('plantworks-base-error').PlantWorksBaseError;
const PlantWorksSrvcError = require('plantworks-service-error').PlantWorksServiceError;

/**
 * @class   AuditService
 * @extends {PlantWorksBaseService}
 * @classdesc The Plant.Works Web Application Server Auditing Service.
 *
 * @description
 * Allows the rest of the Plant.Works Modules to publish audit trails.
 *
 */
class AuditService extends PlantWorksBaseService {
	// #region Constructor
	constructor(parent, loader) {
		super(parent, loader);
	}
	// #endregion

	// #region API
	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof AuditService
	 * @name     publish
	 *
	 * @param    {object} auditPayload - The payload to be cleaned and published to the message queue.
	 *
	 * @returns  {null} Nothing.
	 *
	 * @summary  Publishes the audit trail to the messaging queue, and then deletes the cached details.
	 */
	async publish(auditPayload) {
		if(!auditPayload) return;
		try {
			this._cleanBeforePublish(auditPayload);
			if(!Object.keys(auditPayload).length) return;

			if(auditPayload.error) {
				this.$dependencies.LoggerService.error(`Error Servicing Request ${auditPayload.id} - ${auditPayload['request-meta']['url']}:`, auditPayload);
				await this.$dependencies.PubsubService.publish('plantworks-audit', 'WEBSERVER.AUDIT.ERROR', safeJsonStringify(auditPayload));
			}
			else {
				if(plantworksEnv === 'development') this.$dependencies.LoggerService.debug(`Serviced Request ${auditPayload.id} - ${auditPayload['request-meta']['url']}:`, auditPayload);
				await this.$dependencies.PubsubService.publish('plantworks-audit', 'WEBSERVER.AUDIT.LOG', safeJsonStringify(auditPayload));
			}
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::_publishAudit error`, err);
		}
	}
	// #endregion

	// #region Private Methods
	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof AuditService
	 * @name     _cleanBeforePublish
	 *
	 * @param    {object} auditDetails - The data for the request/response cycle.
	 * @param    {object} [value] - The audit trail information.
	 *
	 * @returns  {null} Nothing.
	 *
	 * @summary  Deletes any empty keys in the audit trail data.
	 */
	_cleanBeforePublish(auditDetails, value) {
		if(!auditDetails && value) auditDetails = { 'payload': value };
		if(!auditDetails) return null;

		if(!Object.keys(auditDetails).length)
			return null;

		Object.keys(auditDetails).forEach((key) => {
			if(!auditDetails[key]) {
				delete auditDetails[key];
				return;
			}

			if(['password', 'image', 'random'].indexOf(key.toLowerCase()) >= 0) {
				auditDetails[key] = '****';
				return;
			}

			if(key.startsWith('_')) {
				delete auditDetails[key];
				return;
			}

			if(auditDetails[key] instanceof PlantWorksBaseError) {
				auditDetails[key] = auditDetails[key].toString();
				return;
			}

			if(auditDetails[key] instanceof Error) {
				auditDetails[key] = new PlantWorksBaseError(`Wrapped for Auditing`, auditDetails[key]).toString();
				return;
			}

			if(typeof auditDetails[key] === 'object') {
				auditDetails[key] = this._cleanBeforePublish(auditDetails[key]);

				if(!auditDetails[key]) {
					delete auditDetails[key];
					return;
				}

				if(!Object.keys(auditDetails[key]).length) {
					delete auditDetails[key];
					return;
				}
			}
		});

		if(!Object.keys(auditDetails).length)
			return null;

		return auditDetails;
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get Interface() {
		return {
			'publish': this.publish.bind(this)
		};
	}

	/**
	 * @override
	 */
	get dependencies() {
		return ['ConfigurationService', 'LoggerService', 'PubsubService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.service = AuditService;
