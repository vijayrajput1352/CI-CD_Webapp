exports.config = {
	'state': true,
	'configuration': {
		'priorities': {
			'FileConfigurationService': 10,
			'DatabaseConfigurationService': 20
		},
		'subservices': {
			'DatabaseConfigurationService': {
				'connection': {
					'host': '10.0.0.23',
					'port': '5432',
					'user': 'plantworks',
					'password': 'plantworks',
					'database': 'plantworks'
				}
			}
		}
	}
};
