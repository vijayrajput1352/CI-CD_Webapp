exports.config = {
	'cassandra': {
		'replication': {
			'class': 'SimpleStrategy',
			'factor': '1'
		}
	}
};
