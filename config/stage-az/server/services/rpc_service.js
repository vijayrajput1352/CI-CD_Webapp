exports.config = {
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
	"requestPrefetch": 0,
	"listenerPrefetch": 10,
    "requestTimeout": 60000
};
