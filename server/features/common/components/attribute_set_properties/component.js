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
 * @class   AttributeSetProperties
 * @extends {PlantWorksBaseComponent}
 * @classdesc The Plant.Works Web Application Server AttributeSetProperty component - exposes attribute set management.
 *
 *
 */
class AttributeSetProperties extends PlantWorksBaseComponent {
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
	 * @memberof AttributeSetProperty
	 * @name     _addRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds routes to the Koa Router.
	 */
	async _addRoutes() {
		try {
			this.$router.get('/:attributeSetPropertyId', this.$parent._rbac('registered'), this._getAttributeSetProperty.bind(this));
			this.$router.post('/', this.$parent._rbac('registered'), this._addAttributeSetProperty.bind(this));
			this.$router.patch('/:attributeSetPropertyId', this.$parent._rbac('registered'), this._updateAttributeSetProperty.bind(this));
			this.$router.delete('/:attributeSetPropertyId', this.$parent._rbac('registered'), this._deleteAttributeSetProperty.bind(this));

			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _getAttributeSetProperty(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const attributeSetPropertyData = await apiSrvc.execute('AttributeSetProperties::getAttributeSetProperty', ctxt);

			ctxt.status = 200;
			ctxt.body = attributeSetPropertyData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving attribute set property data`, err);
		}
	}

	async _addAttributeSetProperty(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const attributeSetPropertyData = await apiSrvc.execute('AttributeSetProperties::createAttributeSetProperty', ctxt);

			ctxt.status = 200;
			ctxt.body = attributeSetPropertyData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error creating attribute set property data`, err);
		}
	}

	async _updateAttributeSetProperty(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const attributeSetPropertyData = await apiSrvc.execute('AttributeSetProperties::updateAttributeSetProperty', ctxt);

			ctxt.status = 200;
			ctxt.body = attributeSetPropertyData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating attribute set property data`, err);
		}
	}

	async _deleteAttributeSetProperty(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('AttributeSetProperties::deleteAttributeSetProperty', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting attribute set property data`, err);
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

exports.component = AttributeSetProperties;
