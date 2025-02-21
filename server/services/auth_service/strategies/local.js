'use strict';

/**
 * Module dependencies, required for ALL Plant.Works modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */

exports.strategy = function() {
	const upash = require('upash');
	// Not required here - apparently, once installed anywhere, we're good to go
	// upash.install('pbkdf2', require('@phc/pbkdf2'));

	const databaseSrvc = this.$dependencies.DatabaseService;
	const User = databaseSrvc.Model.extend({
		'tableName': 'users'
	});

	const LocalStrategy = require('passport-local').Strategy;
	const passport = this.Interface;
	passport.use('plantworks-local', new LocalStrategy({ 'passReqToCallback': true }, async (request, username, password, callback) => {
		try {
			if(!this.$config.local.enabled) { // eslint-disable-line curly
				throw new Error('Username / Password Authentication has been disabled');
			}

			const userRecord = await new User({ 'email': username }).fetch();
			if(!userRecord) throw new Error('Invalid Credentials - please try again');

			const credentialMatch = await upash.verify(userRecord.get('password'), password);
			if(!credentialMatch) throw new Error('Invalid Credentials - please try again');

			if(callback) callback(null, userRecord.toJSON());
			return null;
		}
		catch(err) {
			if(callback) callback(err);
			return null;
		}
	}));
};

