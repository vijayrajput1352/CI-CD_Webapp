/* eslint-disable security/detect-object-injection */

'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules.
 *
 * @ignore
 */
const safeJsonStringify = require('safe-json-stringify'); // eslint-disable-line no-unused-vars

/**
 * Module dependencies, required for this module.
 *
 * @ignore
 */
const PlantWorksBaseMiddleware = require('plantworks-base-middleware').PlantWorksBaseMiddleware;
const PlantWorksMiddlewareError = require('plantworks-middleware-error').PlantWorksMiddlewareError;
const moment = require('moment');

/**
 * @class   Main
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Alerts Main middleware - manages CRUD for alerts.
 *
 *
 */
class Main extends PlantWorksBaseMiddleware {
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
	 * @memberof ApiService
	 * @name     _setup
	 *
	 * @returns  {null} Nothing.
	 *
	 * @summary  Sets up the broker to manage API exposed by other modules.
	 */
	async _setup() {
		try {
			await super._setup();

			const dbSrvc = this.$dependencies.DatabaseService;
			const self = this; // eslint-disable-line consistent-this

			Object.defineProperty(this, '$TenantModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenants',
					'hasTimestamps': true,

					'manufacturingFolders': function() {
						return this.hasMany(self.$TenantFolderModel, 'tenant_id');
					},

					'tenantPlants': function() {
						return this.hasMany(self.$TenantPlantModel, 'tenant_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantFolderModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_folders',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'parent': function() {
						return this.belongsTo(self.$TenantFolderModel, 'parent_id');
					},

					'folders': function() {
						return this.hasMany(self.$TenantFolderModel, 'parent_id');
					},

					'eventAlerts': function() {
						return this.hasMany(self.$TenantEventAlertModel, 'tenant_folder_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantEventAlertModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_event_alerts',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'folder': function() {
						return this.belongsTo(self.$TenantFolderModel, 'tenant_folder_id');
					},

					'processors': function() {
						return this.hasMany(self.$EventAlertProcessorModel, 'tenant_event_alert_id');
					},

					'responseFormatters': function() {
						return this.hasMany(self.$EventAlertResponseFormatterModel, 'tenant_event_alert_id');
					},

					'constituents': function() {
						return this.hasMany(self.$EventAlertConstituentModel, 'tenant_event_alert_id');
					},

					'watchers': function() {
						return this.hasMany(self.$EventAlertWatcherModel, 'tenant_event_alert_id');
					}
				}, {
					'jsonColumns': ['escalation_levels', 'response_types']
				})
			});

			Object.defineProperty(this, '$EventAlertProcessorModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_event_alert_processors',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantEventAlert': function() {
						return this.belongsTo(self.$TenantEventAlertModel, 'tenant_event_alert_id');
					}
				})
			});

			Object.defineProperty(this, '$EventAlertResponseFormatterModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_event_alert_response_formatters',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantEventAlert': function() {
						return this.belongsTo(self.$TenantEventAlertModel, 'tenant_event_alert_id');
					}
				})
			});

			Object.defineProperty(this, '$EventAlertConstituentModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_event_alert_constituents',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantEventAlert': function() {
						return this.belongsTo(self.$TenantEventAlertModel, 'tenant_event_alert_id');
					}
				})
			});

			Object.defineProperty(this, '$EventAlertWatcherModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_event_alerts_users',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantEventAlert': function() {
						return this.belongsTo(self.$TenantEventAlertModel, 'tenant_event_alert_id');
					},

					'tenantUser': function() {
						return this.belongsTo(self.$TenantUserModel, 'tenant_user_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantUserModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenants_users',
					'hasTimestamps': true
				})
			});

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_setup error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof ApiService
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Deletes the broker that manages API.
	 */
	async _teardown() {
		delete this.$TenantUserModel;

		delete this.$EventAlertWatcherModel;
		delete this.$EventAlertConstituentModel;
		delete this.$EventAlertProcessorModel;

		delete this.$TenantEventAlertModel;
		delete this.$TenantFolderModel;
		delete this.$TenantModel;

		await super._teardown();
		return null;
	}
	// #endregion

	// #region Protected methods
	async _registerApis() {
		try {
			const ApiService = this.$dependencies.ApiService;
			await ApiService.add(`${this.name}::getConfigTreeNodes`, this._getConfigTreeNodes.bind(this));
			await ApiService.add(`${this.name}::getDevEnvTreeNodes`, this._getDevEnvTreeNodes.bind(this));

			await ApiService.add(`${this.name}::getTenantFolder`, this._getTenantFolder.bind(this));
			await ApiService.add(`${this.name}::addTenantFolder`, this._addTenantFolder.bind(this));
			await ApiService.add(`${this.name}::updateTenantFolder`, this._updateTenantFolder.bind(this));
			await ApiService.add(`${this.name}::deleteTenantFolder`, this._deleteTenantFolder.bind(this));

			await ApiService.add(`${this.name}::getTenantEventAlert`, this._getTenantEventAlert.bind(this));
			await ApiService.add(`${this.name}::getAllTenantEventAlerts`, this._getAllTenantEventAlerts.bind(this));
			await ApiService.add(`${this.name}::addTenantEventAlert`, this._addTenantEventAlert.bind(this));
			await ApiService.add(`${this.name}::updateTenantEventAlert`, this._updateTenantEventAlert.bind(this));
			await ApiService.add(`${this.name}::deleteTenantEventAlert`, this._deleteTenantEventAlert.bind(this));

			await ApiService.add(`${this.name}::getTenantEventAlertProcessor`, this._getTenantEventAlertProcessor.bind(this));
			await ApiService.add(`${this.name}::addTenantEventAlertProcessor`, this._addTenantEventAlertProcessor.bind(this));
			await ApiService.add(`${this.name}::updateTenantEventAlertProcessor`, this._updateTenantEventAlertProcessor.bind(this));

			await ApiService.add(`${this.name}::getTenantEventAlertResponseFormatter`, this._getTenantEventAlertResponseFormatter.bind(this));
			await ApiService.add(`${this.name}::addTenantEventAlertResponseFormatter`, this._addTenantEventAlertResponseFormatter.bind(this));
			await ApiService.add(`${this.name}::updateTenantEventAlertResponseFormatter`, this._updateTenantEventAlertResponseFormatter.bind(this));

			await ApiService.add(`${this.name}::getTenantEventAlertConstituent`, this._getTenantEventAlertConstituent.bind(this));
			await ApiService.add(`${this.name}::addTenantEventAlertConstituent`, this._addTenantEventAlertConstituent.bind(this));
			await ApiService.add(`${this.name}::deleteTenantEventAlertConstituent`, this._deleteTenantEventAlertConstituent.bind(this));

			await ApiService.add(`${this.name}::getTenantEventAlertWatcher`, this._getTenantEventAlertWatcher.bind(this));
			await ApiService.add(`${this.name}::addTenantEventAlertWatcher`, this._addTenantEventAlertWatcher.bind(this));
			await ApiService.add(`${this.name}::updateTenantEventAlertWatcher`, this._updateTenantEventAlertWatcher.bind(this));
			await ApiService.add(`${this.name}::deleteTenantEventAlertWatcher`, this._deleteTenantEventAlertWatcher.bind(this));

			await ApiService.add(`${this.name}::possibleTenantUsersList`, this._getPossibleTenantUsersList.bind(this));
			await super._registerApis();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_registerApis`, err);
		}
	}

	async _deregisterApis() {
		try {
			const ApiService = this.$dependencies.ApiService;
			await ApiService.remove(`${this.name}::possibleTenantUsersList`, this._getPossibleTenantUsersList.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantEventAlertWatcher`, this._deleteTenantEventAlertWatcher.bind(this));
			await ApiService.remove(`${this.name}::updateTenantEventAlertWatcher`, this._updateTenantEventAlertWatcher.bind(this));
			await ApiService.remove(`${this.name}::addTenantEventAlertWatcher`, this._addTenantEventAlertWatcher.bind(this));
			await ApiService.remove(`${this.name}::getTenantEventAlertWatcher`, this._getTenantEventAlertWatcher.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantEventAlertConstituent`, this._deleteTenantEventAlertConstituent.bind(this));
			await ApiService.remove(`${this.name}::addTenantEventAlertConstituent`, this._addTenantEventAlertConstituent.bind(this));
			await ApiService.remove(`${this.name}::getTenantEventAlertConstituent`, this._getTenantEventAlertConstituent.bind(this));

			await ApiService.remove(`${this.name}::updateTenantEventAlertResponseFormatter`, this._updateTenantEventAlertResponseFormatter.bind(this));
			await ApiService.remove(`${this.name}::addTenantEventAlertResponseFormatter`, this._addTenantEventAlertResponseFormatter.bind(this));
			await ApiService.remove(`${this.name}::getTenantEventAlertResponseFormatter`, this._getTenantEventAlertResponseFormatter.bind(this));

			await ApiService.remove(`${this.name}::updateTenantEventAlertProcessor`, this._updateTenantEventAlertProcessor.bind(this));
			await ApiService.remove(`${this.name}::addTenantEventAlertProcessor`, this._addTenantEventAlertProcessor.bind(this));
			await ApiService.remove(`${this.name}::getTenantEventAlertProcessor`, this._getTenantEventAlertProcessor.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantEventAlert`, this._deleteTenantEventAlert.bind(this));
			await ApiService.remove(`${this.name}::updateTenantEventAlert`, this._updateTenantEventAlert.bind(this));
			await ApiService.remove(`${this.name}::addTenantEventAlert`, this._addTenantEventAlert.bind(this));
			await ApiService.remove(`${this.name}::getAllTenantEventAlerts`, this._getAllTenantEventAlerts.bind(this));
			await ApiService.remove(`${this.name}::getTenantEventAlert`, this._getTenantEventAlert.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantFolder`, this._deleteTenantFolder.bind(this));
			await ApiService.remove(`${this.name}::updateTenantFolder`, this._updateTenantFolder.bind(this));
			await ApiService.remove(`${this.name}::addTenantFolder`, this._addTenantFolder.bind(this));
			await ApiService.remove(`${this.name}::getTenantFolder`, this._getTenantFolder.bind(this));

			await ApiService.remove(`${this.name}::getDevEnvTreeNodes`, this._getDevEnvTreeNodes.bind(this));
			await ApiService.remove(`${this.name}::getconfigTreeNodes`, this._getConfigTreeNodes.bind(this));
			await super._deregisterApis();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getConfigTreeNodes(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			if(ctxt.query.node_type === 'event-alert-folder' || ctxt.query.node_type === 'root-folder') {
				// Get the sub-folders
				let tenantFolders = await dbSrvc.knex.raw(`SELECT * FROM fn_get_folder_descendants(?) WHERE level = 2`, [ctxt.query.node_id]);
				tenantFolders = tenantFolders.rows.map((folder) => {
					return {
						'id': folder.id,
						'parent': folder.parent_id,
						'text': folder.name,
						'children': true,

						'li_attr': {
							'title': folder.name
						},

						'data': {
							'configsRoute': 'configure.event-alert',
							'dataUrl': '/event-alert/config-tree-nodes',
							'intl': false,
							'type': 'event-alert-folder'
						}
					};
				});

				// Get the alerts in this folder
				let tenantEventAlerts = await dbSrvc.knex.raw(`SELECT id, tenant_folder_id AS parent_id, name FROM tenant_event_alerts WHERE tenant_folder_id  = ?`, [ctxt.query.node_id]);
				tenantEventAlerts = tenantEventAlerts.rows.map((eventAlert) => {
					return {
						'id': eventAlert.id,
						'parent': eventAlert.parent_id,
						'text': eventAlert.name,
						'children': false,

						'li_attr': {
							'title': eventAlert.name
						},

						'data': {
							'configsRoute': 'configure.event-alert',
							'dataUrl': '/event-alert/config-tree-nodes',
							'type': 'event-alert'
						}
					};
				});

				return [...tenantFolders, ...tenantEventAlerts];
			}

			return [];
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getConfigTreeNodes`, err);
		}
	}

	async _getDevEnvTreeNodes(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			if(ctxt.query.node_type === 'event-alert-folder' || ctxt.query.node_type === 'root-folder') {
				// Get the sub-folders
				let tenantFolders = await dbSrvc.knex.raw(`SELECT * FROM fn_get_folder_descendants(?) WHERE level = 2`, [ctxt.query.node_id]);
				tenantFolders = tenantFolders.rows.map((folder) => {
					return {
						'id': folder.id,
						'parent': folder.parent_id,
						'text': folder.name,
						'children': true,

						'li_attr': {
							'title': folder.name
						},

						'data': {
							'devenvRoute': 'devenv.event-alert',
							'dataUrl': '/event-alert/devenv-tree-nodes',
							'intl': false,
							'type': 'event-alert-folder'
						}
					};
				});

				// Get the alerts in this folder
				let tenantEventAlerts = await dbSrvc.knex.raw(`SELECT id, tenant_folder_id AS parent_id, name FROM tenant_event_alerts WHERE tenant_folder_id  = ?`, [ctxt.query.node_id]);
				tenantEventAlerts = tenantEventAlerts.rows.map((eventAlert) => {
					return {
						'id': eventAlert.id,
						'parent': eventAlert.parent_id,
						'text': eventAlert.name,
						'children': false,

						'li_attr': {
							'title': eventAlert.name
						},

						'data': {
							'devenvRoute': 'devenv.event-alert',
							'dataUrl': '/event-alert/devenv-tree-nodes',
							'type': 'event-alert'
						}
					};
				});

				return [...tenantFolders, ...tenantEventAlerts];
			}

			return [];
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getDevEnvTreeNodes`, err);
		}
	}

	async _getTenantFolder(ctxt) {
		try {
			let folderData = await this.$TenantFolderModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.folder_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'parent', 'folders', 'eventAlerts']
			});

			folderData = this._convertToJsonApiFormat(folderData, 'event-alert/folder', {
				'tenant': 'settings/account/basics/tenant',
				'parent': 'event-alert/folder',
				'folders': 'event-alert/folder',
				'eventAlerts': 'event-alert/event-alert'
			});

			return folderData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantFolder`, err);
		}
	}

	async _addTenantFolder(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantFolderModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantFolder`, err);
		}
	}

	async _updateTenantFolder(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			const savedRecord = await this.$TenantFolderModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantFolder`, err);
		}
	}

	async _deleteTenantFolder(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;
			const cacheMulti = this.$dependencies.CacheService.multi();

			const tenantFolder = await this.$TenantFolderModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params['folder_id'] })
				.andWhere({ 'tenant_id': ctxt.state.tenant['tenant_id'] });
			})
			.fetch();

			if(!tenantFolder) throw new Error('Unknown Tenant Folder');

			const folderDescendants = await dbSrvc.knex.raw(`SELECT * FROM fn_get_folder_descendants(?)`, [ctxt.params.folder_id]);
			let cachedArtifacts = [];

			// delete cached rendered processor of alert within folder
			// update rendered processor of deleted alert constituents
			const folderEventAlerts = await dbSrvc.knex.raw(`SELECT id FROM tenant_event_alerts WHERE tenant_folder_id IN (${folderDescendants.rows.map(() => { return '?'; }).join(',')});`, folderDescendants.rows.map((f) => { return f['id']; }));

			await tenantFolder.destroy();

			for(let idx = 0; idx < folderEventAlerts.rows.length; idx++) {
				const folderEventAlert = folderEventAlerts.rows[idx];
				const eventAlertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [folderEventAlert.id, 'ealert']);
				cachedArtifacts = cachedArtifacts.concat(eventAlertArtifacts.shift());
			}

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantFolder`, err);
		}
	}

	async _getTenantEventAlert(ctxt) {
		try {
			let eventAlertData = await this.$TenantEventAlertModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.event_alert_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'processors', 'responseFormatters', 'constituents', 'watchers']
			});

			eventAlertData = this._convertToJsonApiFormat(eventAlertData, 'event-alert/event-alert', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'event-alert/folder',
				'processors': 'event-alert/event-alert-processor',
				'responseFormatters': 'event-alert/event-alert-response-formatter',
				'constituents': 'event-alert/event-alert-constituent',
				'watchers': 'event-alert/event-alert-watcher'
			});

			return eventAlertData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantEventAlert`, err);
		}
	}

	async _getAllTenantEventAlerts(ctxt) {
		let hasEventAlertReadPermissions = false;
		try {
			const rbacChecker = this._rbac('event-alert-read');
			await rbacChecker(ctxt);

			hasEventAlertReadPermissions = true;
		}
		catch(err) {
			hasEventAlertReadPermissions = false;
		}

		try {
			let eventAlertData = null;

			if(hasEventAlertReadPermissions) { // eslint-disable-line curly
				eventAlertData = await this.$TenantEventAlertModel
				.query(function(qb) {
					qb.where({ 'tenant_id': ctxt.state.tenant.tenant_id });
				})
				.fetchAll({
					'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'processors', 'constituents', 'watchers']
				});
			}
			else { // eslint-disable-line curly
				eventAlertData = await this.$TenantEventAlertModel
				.query(function(qb) {
					qb
					.whereRaw(`id IN (SELECT tenant_event_alert_id FROM tenant_event_alerts_users WHERE tenant_user_id IN (SELECT id FROM tenants_users WHERE user_id = ?))`, [ctxt.state.user.user_id])
					.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id })
					.orderBy('name');
				})
				.fetchAll({
					'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'folder', 'processors', 'constituents', 'watchers']
				});
			}

			eventAlertData = this._convertToJsonApiFormat(eventAlertData, 'event-alert/event-alert', {
				'tenant': 'settings/account/basics/tenant',
				'folder': 'event-alert/folder',
				'processors': 'event-alert/event-alert-processor',
				'constituents': 'event-alert/event-alert-constituent',
				'attributeSets': 'event-alert/event-alert-attribute-set',
				'watchers': 'event-alert/event-alert-watcher'
			});

			return eventAlertData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllTenantEventAlerts`, err);
		}
	}

	async _addTenantEventAlert(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const savedRecord = await this.$TenantEventAlertModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantEventAlert`, err);
		}
	}

	async _updateTenantEventAlert(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(jsonDeserializedData.name !== undefined && jsonDeserializedData.name !== null && jsonDeserializedData.name.trim() === '') throw new Error('Name cannot be empty');

			jsonDeserializedData['tenant_folder_id'] = jsonDeserializedData['folder_id'];
			delete jsonDeserializedData.folder_id;

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedAlertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['id'], 'ealert']);

			const savedRecord = await this.$TenantEventAlertModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			cachedAlertArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [savedRecord.get('id'), 'ealert', ctxt.state.tenant['tenant_id']]);

			await cacheMulti.execAsync();
			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantEventAlert`, err);
		}
	}

	async _deleteTenantEventAlert(ctxt) {
		try {
			const ApiService = this.$dependencies.ApiService;

			const tenantEventAlert = await this.$TenantEventAlertModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.event_alert_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!tenantEventAlert) throw new Error('Unknown Tenant Event Alert');

			const cacheMulti = this.$dependencies.CacheService.multi();
			const cachedEventAlertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [ctxt.params['alert_id'], 'ealert']);
			const cachedArtifacts = cachedEventAlertArtifacts.shift();

			await tenantEventAlert.destroy();

			cachedArtifacts.forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			await cacheMulti.execAsync();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantEventAlert`, err);
		}
	}

	async _getTenantEventAlertProcessor(ctxt) {
		try {
			let eventAlertProcessorData = await this.$EventAlertProcessorModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.event_alert_processor_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantEventAlert']
			});

			eventAlertProcessorData = this._convertToJsonApiFormat(eventAlertProcessorData, 'event-alert/event-alert-processor', {
				'tenant': 'settings/account/basics/tenant',
				'tenantEventAlert': 'event-alert/event-alert'
			});

			return eventAlertProcessorData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantEventAlertProcessor`, err);
		}
	}

	async _addTenantEventAlertProcessor(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			if(!jsonDeserializedData['processor']) jsonDeserializedData['processor'] = '';

			const savedRecord = await this.$EventAlertProcessorModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantEventAlertProcessor`, err);
		}
	}

	async _updateTenantEventAlertProcessor(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const ApiService = this.$dependencies.ApiService;

			const cacheMulti = this.$dependencies.CacheService.multi();

			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const newPublishStatus = jsonDeserializedData.publish_status;

			const oldRecord = await this.$EventAlertProcessorModel
			.query(function(qb) {
				qb.where({'id': jsonDeserializedData.id});
			}).fetch();

			const oldPublishStatus = oldRecord['attributes']['publish_status'];

			// eslint-disable-next-line curly
			if(oldPublishStatus && !newPublishStatus) {
				throw new Error('Published Processor Record cannot be unpublished');
			}

			// 1. update effectivity stop of the current effective processor
			// 2. set effectivity start of the newly published processor

			// if a previously unpublished processor is being published:
			let updateEffectivity;

			if(!oldPublishStatus && newPublishStatus) {
				const now = moment();
				updateEffectivity = await dbSrvc.knex.raw('UPDATE tenant_event_alert_processors SET effectivity_end = ? WHERE tenant_id = ? AND tenant_event_alert_id = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL AND publish_status = ? RETURNING id,publish_status', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_event_alert_id, true]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$EventAlertProcessorModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			// 3. Update Rendered Processor
			const evaluatorFactory = require('evaluator-factory');

			// 4. On Publishing a New processor, generate and store rendered processor and delete cached artifacts
			if(!oldPublishStatus && newPublishStatus) {
				try{

					const renderedEvaluator = await evaluatorFactory.renderEvaluatorString({
						'id': savedRecord.get('tenant_event_alert_id'),
						'type': 'ealert',
						'database': dbSrvc
					});

					await dbSrvc.knex.raw(`UPDATE tenant_event_alert_processors SET processor = ? WHERE id = ?`, [renderedEvaluator, savedRecord.get('id')]);

				}
				catch(err) {
					// if dont get render evaluator then update the status to false
					jsonDeserializedData['publish_status'] = false;
					await this.$EventAlertProcessorModel
						.forge()
						.save(jsonDeserializedData, {
							'method': 'update',
							'patch': true
						});

					await dbSrvc.knex.raw('UPDATE tenant_event_alert_processors SET effectivity_end = null WHERE id = ?', [updateEffectivity.rows[0]['id']]);

					throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantEventAlertProcessor`, err);
				}

				const cachedAlertArtifacts = await ApiService.execute('DataProcessorManager::_getCachedArtifacts', [savedRecord.get('tenant_alert_id'), 'ealert']);

				cachedAlertArtifacts.shift().forEach((cachedArtifact) => {
					cacheMulti.delAsync(cachedArtifact);
				});

				await cacheMulti.execAsync();
			}

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantEventAlertProcessor`, err);
		}
	}

	async _getTenantEventAlertResponseFormatter(ctxt) {
		try {
			let eventAlertResponseFormatterData = await this.$EventAlertResponseFormatterModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.event_alert_response_formatter_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantEventAlert']
			});

			eventAlertResponseFormatterData = this._convertToJsonApiFormat(eventAlertResponseFormatterData, 'event-alert/event-alert-response-formatter', {
				'tenant': 'settings/account/basics/tenant',
				'tenantEventAlert': 'event-alert/event-alert'
			});

			return eventAlertResponseFormatterData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantEventAlertResponseFormatter`, err);
		}
	}

	async _addTenantEventAlertResponseFormatter(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$EventAlertResponseFormatterModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantEventAlertResponseFormatter`, err);
		}
	}

	async _updateTenantEventAlertResponseFormatter(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const newPublishStatus = jsonDeserializedData.publish_status;
			const cachedAlertArtifacts = await this.$dependencies.ApiService.execute('DataProcessorManager::_getCachedArtifacts', [jsonDeserializedData['tenant_alert_id'], 'ealert']);
			const cacheMulti = this.$dependencies.CacheService.multi();

			const oldRecord = await this.$EventAlertResponseFormatterModel
			.query(function(qb) {
				qb.where({'id': jsonDeserializedData.id});
			}).fetch();

			const oldPublishStatus = oldRecord['attributes']['publish_status'];

			// eslint-disable-next-line curly
			if(oldPublishStatus && !newPublishStatus) {
				throw new Error('Published Response Formatter Record cannot be unpublished');
			}

			// 1. update effectivity stop of the current effective processor
			// 2. set effectivity start of the newly published processor

			let updateEffectivity;

			if(!oldPublishStatus && newPublishStatus) {
				const now = moment();
				updateEffectivity = await dbSrvc.knex.raw('UPDATE tenant_event_alert_response_formatters SET effectivity_end = ? WHERE tenant_id = ? AND tenant_event_alert_id = ? AND type = ? AND effectivity_start IS NOT NULL AND effectivity_end IS NULL AND publish_status = ? RETURNING id,publish_status', [now.format(), ctxt.state.tenant.tenant_id, jsonDeserializedData.tenant_event_alert_id, jsonDeserializedData.type, true]);
				jsonDeserializedData['effectivity_start'] = now.format();
			}

			const savedRecord = await this.$EventAlertResponseFormatterModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			cachedAlertArtifacts.shift().forEach((cachedArtifact) => {
				cacheMulti.delAsync(cachedArtifact);
			});

			if(!oldPublishStatus && newPublishStatus) {
				try{
					await this.$dependencies.ApiService.execute('DataProcessorManager::_updateRenderedProcessor', [jsonDeserializedData['tenant_event_alert_id'], 'ealert', jsonDeserializedData['tenant_id']]);
				}
				catch(err){
					// if dont get render evaluator then update the status to false
					jsonDeserializedData['publish_status'] = false;
					await this.$EventAlertResponseFormatterModel
					.forge()
					.save(jsonDeserializedData, {
						'method': 'update',
						'patch': true
					});

					await dbSrvc.knex.raw('UPDATE tenant_event_alert_response_formatters SET effectivity_end = null WHERE id = ?', [updateEffectivity.rows[0]['id']]);

					throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantEventAlertResponseFormatter`, err);
				}
				await cacheMulti.execAsync();
			}

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantEventAlertResponseFormatter`, err);
		}
	}

	async _getTenantEventAlertConstituent(ctxt) {
		try {
			let eventAlertConstituentData = await this.$EventAlertConstituentModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.event_alert_constituent_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantEventAlert']
			});

			eventAlertConstituentData = this._convertToJsonApiFormat(eventAlertConstituentData, 'event-alert/event-alert-constituent', {
				'tenant': 'settings/account/basics/tenant',
				'tenantEventAlert': 'event-alert/event-alert'
			});

			return eventAlertConstituentData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantEventAlertConstituent`, err);
		}
	}

	async _addTenantEventAlertConstituent(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$EventAlertConstituentModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantEventAlertConstituent`, err);
		}
	}

	async _deleteTenantEventAlertConstituent(ctxt) {
		try {
			const alertConstituent = await this.$EventAlertConstituentModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.event_alert_constituent_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!alertConstituent) throw new Error('Unknown Event Alert constituent mapping');

			await alertConstituent.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantEventAlertConstituent`, err);
		}
	}

	async _getTenantEventAlertWatcher(ctxt) {
		try {
			let eventAlertWatcherData = await this.$EventAlertWatcherModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.event_alert_watcher_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'tenantEventAlert', 'tenantUser']
			});

			eventAlertWatcherData = this._convertToJsonApiFormat(eventAlertWatcherData, 'event-alert/event-alert-watcher', {
				'tenant': 'settings/account/basics/tenant',
				'tenantEventAlert': 'event-alert/event-alert',
				'tenantUser': 'pug/user-manager/tenant-user'
			});

			return eventAlertWatcherData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantEventAlertWatcher`, err);
		}
	}

	async _addTenantEventAlertWatcher(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);

			const savedRecord = await this.$EventAlertWatcherModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});
			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantEventAlertWatcher`, err);
		}
	}

	async _updateTenantEventAlertWatcher(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$EventAlertWatcherModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantEventAlertWatcher`, err);
		}
	}

	async _deleteTenantEventAlertWatcher(ctxt) {
		try {
			const eventAlertWatcher = await this.$EventAlertWatcherModel
			.query(function(qb) {
				qb
				.where({ 'id': ctxt.params.event_alert_watcher_id })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!eventAlertWatcher) throw new Error('Unknown Event Alert User mapping');

			await eventAlertWatcher.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantEventAlertWatcher`, err);
		}
	}

	async _getPossibleTenantUsersList(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;
			const possibleTenantUsers = await dbSrvc.knex.raw(`SELECT A.id, B.first_name AS "firstName", B.middle_names AS "middleNames", B.last_name AS "lastName", B.email FROM tenants_users A INNER JOIN users B ON (A.user_id = B.id) WHERE A.tenant_id = ? AND A.access_status = 'authorized' AND A.id NOT IN (SELECT tenant_user_id FROM tenant_event_alerts_users WHERE tenant_event_alert_id = ?)`, [ctxt.state.tenant.tenant_id, ctxt.query.eventAlert]);
			return possibleTenantUsers.rows;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getPossibleTenantUsersList`, err);
		}
	}
	// #endregion

	// #region Private Methods

	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}

	/**
	 * @override
	 */
	get dependencies() {
		return ['PubsubService'].concat(super.dependencies);
	}
	// #endregion
}

exports.middleware = Main;
