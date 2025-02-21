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
const PlantWorksBaseMiddleware = require('plantworks-base-middleware').PlantWorksBaseMiddleware;
const PlantWorksMiddlewareError = require('plantworks-middleware-error').PlantWorksMiddlewareError;

/**
 * @class   AttributeSetProperties
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Server AttributeSetProperties middleware - manage CRUD for all attribute sets / properties related operations.
 *
 *
 */
class AttributeSetProperties extends PlantWorksBaseMiddleware {
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
	 * @memberof AttributeSetProperties
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

					'tenantFeatures': function() {
						return this.hasMany(self.$TenantFeatureModel, 'tenant_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantFeatureModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenants_modules',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'attributeSets': function() {
						return this.hasMany(self.$AttributeSetModel, 'tenant_feature_id');
					}
				})
			});

			Object.defineProperty(this, '$AttributeSetModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'attribute_sets',
					'hasTimestamps': true,

					'tenantFeature': function() {
						return this.belongsTo(self.$TenantFeatureModel, 'tenant_feature_id');
					},

					'properties': function() {
						return this.hasMany(self.$AttributeSetPropertyModel, 'attribute_set_id');
					}
				})
			});

			Object.defineProperty(this, '$AttributeSetPropertyModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'attribute_set_properties',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'attributeSet': function() {
						return this.belongsTo(self.$AttributeSetModel, 'attribute_set_id');
					},

					'dependantFunctions': function() {
						return this.hasMany(self.$AttributeSetFunctionObservedPropertyModel, 'attribute_set_property_id');
					}
				})
			});

			Object.defineProperty(this, '$AttributeSetFunctionModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'attribute_set_functions',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'attributeSet': function() {
						return this.belongsTo(self.$AttributeSetModel, 'attribute_set_id');
					},

					'observedProperties': function() {
						return this.hasMany(self.$AttributeSetFunctionObservedPropertyModel, 'attribute_set_function_id');
					}
				})
			});

			Object.defineProperty(this, '$AttributeSetFunctionObservedPropertyModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'attribute_set_function_observed_properties',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'attributeSet': function() {
						return this.belongsTo(self.$AttributeSetModel, 'attribute_set_id');
					},

					'attributeSetFunction': function() {
						return this.belongsTo(self.$AttributeSetFunctionModel, 'attribute_set_function_id');
					},

					'attributeSetProperty': function() {
						return this.belongsTo(self.$AttributeSetPropertyModel, 'attribute_set_property_id');
					}
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
	 * @memberof AttributeSetProperties
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Deletes the broker that manages API.
	 */
	async _teardown() {
		try {
			delete this.$AttributeSetFunctionObservedPropertyModel;
			delete this.$AttributeSetPropertyModel;
			delete this.$AttributeSetModel;
			delete this.$TenantFeatureModel;
			delete this.$TenantModel;

			await super._teardown();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_teardown error`, err);
		}
	}
	// #endregion

	// #region Protected methods
	async _registerApis() {
		try {
			const ApiService = this.$dependencies.ApiService;

			await super._registerApis();

			await ApiService.add(`${this.name}::getAttributeSetProperty`, this._getAttributeSetProperty.bind(this));
			await ApiService.add(`${this.name}::createAttributeSetProperty`, this._createAttributeSetProperty.bind(this));
			await ApiService.add(`${this.name}::updateAttributeSetProperty`, this._updateAttributeSetProperty.bind(this));
			await ApiService.add(`${this.name}::deleteAttributeSetProperty`, this._deleteAttributeSetProperty.bind(this));

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_registerApis`, err);
		}
	}

	async _deregisterApis() {
		try {
			const ApiService = this.$dependencies.ApiService;

			await ApiService.remove(`${this.name}::deleteAttributeSetProperty`, this._deleteAttributeSetProperty.bind(this));
			await ApiService.remove(`${this.name}::updateAttributeSetProperty`, this._updateAttributeSetProperty.bind(this));
			await ApiService.remove(`${this.name}::createAttributeSetProperty`, this._createAttributeSetProperty.bind(this));
			await ApiService.remove(`${this.name}::getAttributeSetProperty`, this._getAttributeSetProperty.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getAttributeSetProperty(ctxt) {
		try {
			let attributeSetPropertyData = await this.$AttributeSetPropertyModel
			.query(function(qb) {
				qb
				.where({ 'attribute_set_property_id': ctxt.params['attributeSetPropertyId'] })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'attributeSet', 'dependantFunctions']
			});

			attributeSetPropertyData = this._convertToJsonApiFormat(attributeSetPropertyData, 'common/attribute-set-property', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'common/attribute-set',
				'dependantFunctions': 'common/attribute-set-function-observed-property'
			});

			delete attributeSetPropertyData.included;
			return attributeSetPropertyData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAttributeSetProperty`, err);
		}
	}

	async _createAttributeSetProperty(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$AttributeSetPropertyModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('attribute_set_property_id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_createAttributeSetProperty`, err);
		}
	}

	async _updateAttributeSetProperty(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$AttributeSetPropertyModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('attribute_set_property_id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateAttributeSetProperty`, err);
		}
	}

	async _deleteAttributeSetProperty(ctxt) {
		try {
			const attributeSetProperty = await this.$AttributeSetPropertyModel
			.query(function(qb) {
				qb
				.where({ 'attribute_set_property_id': ctxt.params.attributeSetPropertyId })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!attributeSetProperty) throw new Error('Unknown Attribute Set Property');

			await attributeSetProperty.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteAttributeSetProperty`, err);
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

exports.middleware = AttributeSetProperties;
