'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules.
 *
 * @ignore
 */

/**
 * Module dependencies, required for this module.
 *
 * @ignore
 */
const PlantWorksBaseComponent = require('plantworks-base-component').PlantWorksBaseComponent;
const PlantWorksComponentError = require('plantworks-component-error').PlantWorksComponentError;

/**
 * @class   Main
 * @extends {PlantWorksBaseComponent}
 * @classdesc The Main component of the Tenant Administration Feature - manages CRUD for the account.
 *
 *
 */
class Main extends PlantWorksBaseComponent {
	// #region Constructor
	constructor(parent, loader) {
		super(parent, loader);
	}
	// #endregion

	// #region Protected methods - need to be overriden by derived classes
	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof Main
	 * @name     _addRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds routes to the Koa Router.
	 */
	async _addRoutes() {
		try {
			this.$router.get('/config-tree-nodes', this.$parent._rbac('event-alert-read OR event-alert-watch'), this._getConfigTreeNodes.bind(this));
			this.$router.get('/devenv-tree-nodes', this.$parent._rbac('event-alert-read OR event-alert-watch'), this._getDevEnvTreeNodes.bind(this));

			this.$router.get('/folders/:folder_id', this.$parent._rbac('event-alert-read OR event-alert-watch'), this._getTenantFolder.bind(this));
			this.$router.post('/folders', this.$parent._rbac('event-alert-create'), this._addTenantFolder.bind(this));
			this.$router.patch('/folders/:folder_id', this.$parent._rbac('event-alert-update'), this._updateTenantFolder.bind(this));
			this.$router.delete('/folders/:folder_id', this.$parent._rbac('event-alert-delete'), this._deleteTenantFolder.bind(this));

			this.$router.get('/event-alerts/:event_alert_id', this.$parent._rbac('event-alert-read OR event-alert-watch'), this._getTenantEventAlert.bind(this));
			this.$router.post('/event-alerts', this.$parent._rbac('event-alert-create'), this._addTenantEventAlert.bind(this));
			this.$router.patch('/event-alerts/:event_alert_id', this.$parent._rbac('event-alert-update'), this._updateTenantEventAlert.bind(this));
			this.$router.delete('/event-alerts/:event_alert_id', this.$parent._rbac('event-alert-delete'), this._deleteTenantEventAlert.bind(this));
			this.$router.get('/event-alerts', this.$parent._rbac('event-alert-read OR event-alert-watch'), this._getAllTenantEventAlerts.bind(this));

			this.$router.get('/event-alert-processors/:event_alert_processor_id', this.$parent._rbac('event-alert-read OR event-alert-watch'), this._getTenantEventAlertProcessor.bind(this));
			this.$router.post('/event-alert-processors', this.$parent._rbac('event-alert-create'), this._addTenantEventAlertProcessor.bind(this));
			this.$router.patch('/event-alert-processors/:event_alert_processor_id', this.$parent._rbac('event-alert-update'), this._updateTenantEventAlertProcessor.bind(this));

			this.$router.get('/event-alert-response-formatters/:event_alert_response_formatter_id', this.$parent._rbac('event-alert-read OR event-alert-watch'), this._getTenantEventAlertResponseFormatter.bind(this));
			this.$router.post('/event-alert-response-formatters', this.$parent._rbac('event-alert-create'), this._addTenantEventAlertResponseFormatter.bind(this));
			this.$router.patch('/event-alert-response-formatters/:event_alert_response_formatter_id', this.$parent._rbac('event-alert-update'), this._updateTenantEventAlertResponseFormatter.bind(this));

			this.$router.get('/event-alert-constituents/:event_alert_constituent_id', this.$parent._rbac('event-alert-read OR event-alert-watch'), this._getTenantEventAlertConstituent.bind(this));
			this.$router.post('/event-alert-constituents', this.$parent._rbac('event-alert-create'), this._addTenantEventAlertConstituent.bind(this));
			this.$router.delete('/event-alert-constituents/:event_alert_constituent_id', this.$parent._rbac('event-alert-delete'), this._deleteTenantEventAlertConstituent.bind(this));

			this.$router.get('/event-alert-watchers/:event_alert_watcher_id', this.$parent._rbac('event-alert-read OR event-alert-watch'), this._getTenantEventAlertWatcher.bind(this));
			this.$router.post('/event-alert-watchers', this.$parent._rbac('event-alert-create'), this._addTenantEventAlertWatcher.bind(this));
			this.$router.patch('/event-alert-watchers/:event_alert_watcher_id', this.$parent._rbac('event-alert-update'), this._updateTenantEventAlertWatcher.bind(this));
			this.$router.delete('/event-alert-watchers/:event_alert_watcher_id', this.$parent._rbac('event-alert-delete'), this._deleteTenantEventAlertWatcher.bind(this));

			this.$router.get('/possibleTenantUsersList', this.$parent._rbac('event-alert-read OR event-alert-watch'), this._getPossibleTenantUsersList.bind(this));
			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _getConfigTreeNodes(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const treeNodeData = await apiSrvc.execute('Main::getConfigTreeNodes', ctxt);

			ctxt.status = 200;
			ctxt.body = treeNodeData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving event alert configuration tree nodes`, err);
		}
	}

	async _getDevEnvTreeNodes(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const treeNodeData = await apiSrvc.execute('Main::getDevEnvTreeNodes', ctxt);

			ctxt.status = 200;
			ctxt.body = treeNodeData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving event alert development environment tree nodes`, err);
		}
	}

	async _getTenantFolder(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const folderData = await apiSrvc.execute('Main::getTenantFolder', ctxt);

			ctxt.status = 200;
			ctxt.body = folderData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving event alert folder`, err);
		}
	}

	async _addTenantFolder(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantFolder = await apiSrvc.execute('Main::addTenantFolder', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantFolder.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding event alert folder`, err);
		}
	}

	async _updateTenantFolder(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantFolder = await apiSrvc.execute('Main::updateTenantFolder', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantFolder.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant event alert folder`, err);
		}
	}

	async _deleteTenantFolder(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantFolder', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant folder`, err);
		}
	}

	async _getTenantEventAlert(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const eventAlertData = await apiSrvc.execute('Main::getTenantEventAlert', ctxt);

			ctxt.status = 200;
			ctxt.body = eventAlertData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving event alert`, err);
		}
	}

	async _getAllTenantEventAlerts(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const eventAlertData = await apiSrvc.execute('Main::getAllTenantEventAlerts', ctxt);

			ctxt.status = 200;
			ctxt.body = eventAlertData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving all event alerts`, err);
		}
	}

	async _addTenantEventAlert(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantEventAlert = await apiSrvc.execute('Main::addTenantEventAlert', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantEventAlert.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant event alert`, err);
		}
	}

	async _updateTenantEventAlert(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantEventAlert = await apiSrvc.execute('Main::updateTenantEventAlert', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantEventAlert.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant event alert`, err);
		}
	}

	async _deleteTenantEventAlert(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantEventAlert', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant event alert`, err);
		}
	}

	async _getTenantEventAlertProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const eventAlertProcessorData = await apiSrvc.execute('Main::getTenantEventAlertProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = eventAlertProcessorData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving event alert processor`, err);
		}
	}

	async _addTenantEventAlertProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantEventAlertProcessor = await apiSrvc.execute('Main::addTenantEventAlertProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantEventAlertProcessor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant event alert processor`, err);
		}
	}

	async _updateTenantEventAlertProcessor(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantEventAlertProcessor = await apiSrvc.execute('Main::updateTenantEventAlertProcessor', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantEventAlertProcessor.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant event alert processor`, err);
		}
	}

	async _getTenantEventAlertResponseFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const eventAlertResponseFormatterData = await apiSrvc.execute('Main::getTenantEventAlertResponseFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = eventAlertResponseFormatterData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving event alert response formatter`, err);
		}
	}

	async _addTenantEventAlertResponseFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantEventAlertResponseFormatter = await apiSrvc.execute('Main::addTenantEventAlertResponseFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantEventAlertResponseFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant event alert response formatter`, err);
		}
	}

	async _updateTenantEventAlertResponseFormatter(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantEventAlertResponseFormatter = await apiSrvc.execute('Main::updateTenantEventAlertResponseFormatter', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantEventAlertResponseFormatter.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant event alert response formatter`, err);
		}
	}

	async _getTenantEventAlertConstituent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const eventAlertConstituentData = await apiSrvc.execute('Main::getTenantEventAlertConstituent', ctxt);

			ctxt.status = 200;
			ctxt.body = eventAlertConstituentData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving event alert constituent`, err);
		}
	}

	async _addTenantEventAlertConstituent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantEventAlertConstituent = await apiSrvc.execute('Main::addTenantEventAlertConstituent', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantEventAlertConstituent.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant event alert constituent`, err);
		}
	}

	async _deleteTenantEventAlertConstituent(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantEventAlertConstituent', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant event alert constituent`, err);
		}
	}

	async _getTenantEventAlertWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const eventAlertWatcherData = await apiSrvc.execute('Main::getTenantEventAlertWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = eventAlertWatcherData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving event alert watcher`, err);
		}
	}

	async _addTenantEventAlertWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantEventAlertWatcher = await apiSrvc.execute('Main::addTenantEventAlertWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantEventAlertWatcher.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding tenant event alert watcher`, err);
		}
	}

	async _updateTenantEventAlertWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const eventAlertWatcherData = await apiSrvc.execute('Main::updateTenantEventAlertWatcher', ctxt);

			ctxt.status = 200;
			ctxt.body = eventAlertWatcherData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating event alert watcher`, err);
		}
	}

	async _deleteTenantEventAlertWatcher(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantEventAlertWatcher', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant event alert watcher`, err);
		}
	}

	async _getPossibleTenantUsersList(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const possibleTenantUsers = await apiSrvc.execute('Main::possibleTenantUsersList', ctxt);

			ctxt.status = 200;
			ctxt.body = possibleTenantUsers.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving possible watchers for the event alert`, err);
		}
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get dependencies() {
		return ['ApiService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.component = Main;
