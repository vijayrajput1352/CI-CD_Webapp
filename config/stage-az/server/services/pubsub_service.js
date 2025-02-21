exports.config = {
	"plantworks-audit": {
		"type": "redis",
		"host": "10.0.0.23",
		"port": 6379,
		"db": 12,
		"options": {
			"retry": "Yellow",
			"dropBufferSupport": true
		}
	},
	"plantworks-data-stream": {
		"port": 5672,
		"type": "amqp",
		"vhost": "/",
		"locale": "en_US",
		"frameMax": 0,
		"hostname": "10.0.0.23",
		"password": "plantworks",
		"protocol": "amqp",
		"username": "plantworks",
		"heartbeat": 10,
		"exchange": "PlantworksEx",
		"exchangeType": "direct",
		"noDataTimeout": 300000,
		"prefetch": 10
	},
	"plantworks-realtime-push": {
		"type": "redis",
		"host": "10.0.0.23",
		"port": 6379,
		"db": 12,
		"options": {
			"retry": "Yellow",
			"dropBufferSupport": true
		}
	}
};
