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
 * @class   AttributeSetFunctions
 * @extends {PlantWorksBaseComponent}
 * @classdesc The Plant.Works Web Application Server AttributeSetFunction component - exposes attribute set management.
 *
 *
 */
class AttributeSetFunctions extends PlantWorksBaseComponent {
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
	 * @memberof AttributeSetFunction
	 * @name     _addRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds routes to the Koa Router.
	 */
	async _addRoutes() {
		try {
			this.$router.get('/:attributeSetFunctionId', this.$parent._rbac('registered'), this._getAttributeSetFunction.bind(this));
			this.$router.post('/', this.$parent._rbac('registered'), this._addAttributeSetFunction.bind(this));
			this.$router.patch('/:attributeSetFunctionId', this.$parent._rbac('registered'), this._updateAttributeSetFunction.bind(this));
			this.$router.delete('/:attributeSetFunctionId', this.$parent._rbac('registered'), this._deleteAttributeSetFunction.bind(this));

			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _getAttributeSetFunction(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const attributeSetFunctionData = await apiSrvc.execute('AttributeSetFunctions::getAttributeSetFunction', ctxt);

			ctxt.status = 200;
			ctxt.body = attributeSetFunctionData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving attribute set function data`, err);
		}
	}

	async _addAttributeSetFunction(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const attributeSetFunctionData = await apiSrvc.execute('AttributeSetFunctions::createAttributeSetFunction', ctxt);

			ctxt.status = 200;
			ctxt.body = attributeSetFunctionData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error creating attribute set function data`, err);
		}
	}

	async _updateAttributeSetFunction(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const attributeSetFunctionData = await apiSrvc.execute('AttributeSetFunctions::updateAttributeSetFunction', ctxt);

			ctxt.status = 200;
			ctxt.body = attributeSetFunctionData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating attribute set function data`, err);
		}
	}

	async _deleteAttributeSetFunction(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('AttributeSetFunctions::deleteAttributeSetFunction', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting attribute set function data`, err);
		}
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get dependencies() {
		return ['DatabaseService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.component = AttributeSetFunctions;
