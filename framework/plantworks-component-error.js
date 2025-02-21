'use strict';

/**
 * Module dependencies, required for ALL Plant.Works modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseError = require('./plantworks-base-error').PlantWorksBaseError;

/**
 * @class   PlantWorksComponentError
 * @extends {PlantWorksBaseError}
 * @classdesc   The Plant.Works Server Base Class for all errors emitted by Components
 *
 * @param {string} message - The Error Message.
 * @param {Error} [inner] - Inner Error, if any.
 *
 * @description
 * Serves as the "base class" for all other component errors in the Plant.Works Web Application Server.
 *
 */
class PlantWorksComponentError extends PlantWorksBaseError {
	constructor(message, inner) {
		super(message, inner);
	}
}

exports.PlantWorksComponentError = PlantWorksComponentError;
