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
 * @class   AttributeSetFunctionObservedProperties
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Server AttributeSetFunctionObservedProperties middleware - manage CRUD for all attribute sets / functions related operations.
 *
 *
 */
class AttributeSetFunctionObservedProperties extends PlantWorksBaseMiddleware {
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
	 * @memberof AttributeSetFunctionObservedProperties
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
					},

					'functions': function() {
						return this.hasMany(self.$AttributeSetFunctionModel, 'attribute_set_id');
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
	 * @memberof AttributeSetFunctionObservedProperties
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Deletes the broker that manages API.
	 */
	async _teardown() {
		try {
			delete this.$AttributeSetFunctionObservedPropertyModel;
			delete this.$AttributeSetFunctionModel;
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

			await ApiService.add(`${this.name}::getAttributeSetFunctionObservedProperty`, this._getAttributeSetFunctionObservedProperty.bind(this));
			await ApiService.add(`${this.name}::createAttributeSetFunctionObservedProperty`, this._createAttributeSetFunctionObservedProperty.bind(this));
			await ApiService.add(`${this.name}::updateAttributeSetFunctionObservedProperty`, this._updateAttributeSetFunctionObservedProperty.bind(this));
			await ApiService.add(`${this.name}::deleteAttributeSetFunctionObservedProperty`, this._deleteAttributeSetFunctionObservedProperty.bind(this));

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_registerApis`, err);
		}
	}

	async _deregisterApis() {
		try {
			const ApiService = this.$dependencies.ApiService;

			await ApiService.remove(`${this.name}::deleteAttributeSetFunctionObservedProperty`, this._deleteAttributeSetFunctionObservedProperty.bind(this));
			await ApiService.remove(`${this.name}::updateAttributeSetFunctionObservedProperty`, this._updateAttributeSetFunctionObservedProperty.bind(this));
			await ApiService.remove(`${this.name}::createAttributeSetFunctionObservedProperty`, this._createAttributeSetFunctionObservedProperty.bind(this));
			await ApiService.remove(`${this.name}::getAttributeSetFunctionObservedProperty`, this._getAttributeSetFunctionObservedProperty.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getAttributeSetFunctionObservedProperty(ctxt) {
		try {
			let attributeSetFunctionObservedPropertyData = await this.$AttributeSetFunctionObservedPropertyModel
			.query(function(qb) {
				qb
				.where({ 'attribute_set_function_observed_property_id': ctxt.params['attributeSetFunctionObservedPropertyId'] })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'attributeSet', 'attributeSetFunction', 'attributeSetProperty']
			});

			attributeSetFunctionObservedPropertyData = this._convertToJsonApiFormat(attributeSetFunctionObservedPropertyData, 'common/attribute-set-function-observed-property', {
				'tenant': 'settings/account/basics/tenant',
				'attributeSet': 'common/attribute-set',
				'attributeSetFunction': 'common/attribute-set-function',
				'attributeSetProperty': 'common/attribute-set-property'
			});

			return attributeSetFunctionObservedPropertyData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAttributeSetFunctionObservedProperty`, err);
		}
	}

	async _createAttributeSetFunctionObservedProperty(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$AttributeSetFunctionObservedPropertyModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('attribute_set_function_observed_property_id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_createAttributeSetFunctionObservedProperty`, err);
		}
	}

	async _updateAttributeSetFunctionObservedProperty(ctxt) {
		try {
			const jsonDeserializedData = await this._convertFromJsonApiFormat(ctxt.request.body);
			const savedRecord = await this.$AttributeSetFunctionObservedPropertyModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			return {
				'data': {
					'type': ctxt.request.body.data.type,
					'id': savedRecord.get('attribute_set_function_observed_property_id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateAttributeSetFunctionObservedProperty`, err);
		}
	}

	async _deleteAttributeSetFunctionObservedProperty(ctxt) {
		try {
			const attributeSetFunctionObservedProperty = await this.$AttributeSetFunctionObservedPropertyModel
			.query(function(qb) {
				qb
				.where({ 'attribute_set_function_observed_property_id': ctxt.params.attributeSetFunctionObservedPropertyId })
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch();

			if(!attributeSetFunctionObservedProperty) throw new Error('Unknown Attribute Set Function Observed Property');

			await attributeSetFunctionObservedProperty.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteAttributeSetFunctionObservedProperty`, err);
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

exports.middleware = AttributeSetFunctionObservedProperties;
