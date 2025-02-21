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
 * @class   AttributeSetFunctionObservedProperties
 * @extends {PlantWorksBaseComponent}
 * @classdesc The Plant.Works Web Application Server AttributeSetFunctionObservedProperties component - exposes attribute set management.
 *
 *
 */
class AttributeSetFunctionObservedProperties extends PlantWorksBaseComponent {
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
	 * @memberof AttributeSetFunctionObservedProperties
	 * @name     _addRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds routes to the Koa Router.
	 */
	async _addRoutes() {
		try {
			this.$router.get('/:attributeSetFunctionObservedPropertyId', this.$parent._rbac('registered'), this._getAttributeSetFunctionObservedProperty.bind(this));
			this.$router.post('/', this.$parent._rbac('registered'), this._addAttributeSetFunctionObservedProperty.bind(this));
			this.$router.patch('/:attributeSetFunctionObservedPropertyId', this.$parent._rbac('registered'), this._updateAttributeSetFunctionObservedProperty.bind(this));
			this.$router.delete('/:attributeSetFunctionObservedPropertyId', this.$parent._rbac('registered'), this._deleteAttributeSetFunctionObservedProperty.bind(this));

			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _getAttributeSetFunctionObservedProperty(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const attributeSetFunctionObservedPropertyData = await apiSrvc.execute('AttributeSetFunctionObservedProperties::getAttributeSetFunctionObservedProperty', ctxt);

			ctxt.status = 200;
			ctxt.body = attributeSetFunctionObservedPropertyData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving attribute set function observed property data`, err);
		}
	}

	async _addAttributeSetFunctionObservedProperty(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const attributeSetFunctionObservedPropertyData = await apiSrvc.execute('AttributeSetFunctionObservedProperties::createAttributeSetFunctionObservedProperty', ctxt);

			ctxt.status = 200;
			ctxt.body = attributeSetFunctionObservedPropertyData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error creating attribute set function observed property data`, err);
		}
	}

	async _updateAttributeSetFunctionObservedProperty(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const attributeSetFunctionObservedPropertyData = await apiSrvc.execute('AttributeSetFunctionObservedProperties::updateAttributeSetFunctionObservedProperty', ctxt);

			ctxt.status = 200;
			ctxt.body = attributeSetFunctionObservedPropertyData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating attribute set function observed property data`, err);
		}
	}

	async _deleteAttributeSetFunctionObservedProperty(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('AttributeSetFunctionObservedProperties::deleteAttributeSetFunctionObservedProperty', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting attribute set function observed property data`, err);
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

exports.component = AttributeSetFunctionObservedProperties;
