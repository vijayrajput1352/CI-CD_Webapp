'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseComponent = require('plantworks-base-component').PlantWorksBaseComponent;
const PlantWorksComponentError = require('plantworks-component-error').PlantWorksComponentError;

/**
 * @class   Main
 * @extends {PlantWorksBaseComponent}
 * @classdesc The Main component of the Outgoing Feature - manages streaing data to browsers, etc.
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
			this.$router.get('/tree', this.$parent._rbac('realtime-data-access'), this._getTree.bind(this));
			await super._addRoutes();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _getTree(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const realtimeEntityData = await apiSrvc.execute('Main::getTree', ctxt);

			ctxt.status = 200;
			ctxt.body = realtimeEntityData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`${this.name}::_getTree: Error retrieving realtimeentity data`, err);
		}
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.component = Main;
