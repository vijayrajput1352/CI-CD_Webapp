exports.config = {
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
	"requestPrefetch": 0,
	"listenerPrefetch": 10,
    "requestTimeout": 60000
};
