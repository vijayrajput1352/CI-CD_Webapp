'use strict';

module.exports = {
	'apps': [{
		'name': 'webapp-server',
		'script': './server/index.js',

		'watch': false,
		'ignore_watch': [],

		'merge_logs': true,

		'env': {
			// 'BLUEBIRD_DEBUG': 1,
			// 'DEBUG': '*',
			'NODE_ENV': 'production'
		},
		'env_test': {
			'BLUEBIRD_DEBUG': 1,
			'DEBUG': '*',
			'NODE_ENV': 'test'
		},
		'env_stage': {
			'NODE_ENV': 'stage'
		},
		'env_production': {
			'NODE_ENV': 'production'
		},
		'env_stage_az': {
			'NODE_ENV': 'stage-az'
		}

	}]
};
