exports.config = {
	"plantworks-audit": {
		"type": "redis",
		"host": "127.0.0.1",
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
		"hostname": "localhost",
		"password": "guest",
		"protocol": "amqp",
		"username": "guest",
		"heartbeat": 10,
		"exchange": "PlantworksEx",
		"exchangeType": "direct",
		"noDataTimeout": 300000,
		"prefetch": 10
	},
	"plantworks-realtime-push": {
		"type": "redis",
		"host": "127.0.0.1",
		"port": 6379,
		"db": 12,
		"options": {
			"retry": "Yellow",
			"dropBufferSupport": true
		}
	}
};
