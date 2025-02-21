exports.config = {
	"protocol": "http",
	"internalPort": 9100,
	"externalPort": 9100,
	"version": "2.4.3",
	"poweredBy": "Plant.Works Portal",
	"connectionTimeout": 600,
	"logLevel": "debug",
	"honeyPot": {
		"apiKey": "YOUR_API_KEY"
	},
	"secureProtocols": {
		"https": {
			"key": "./ssl/server.key",
			"cert": "./ssl/server.crt",
			"rejectUnauthorized": true
		},
		"spdy": {
			"key": "./ssl/server.key",
			"cert": "./ssl/server.crt",
			"rejectUnauthorized": true
		},
		"http2": {
			"key": "./ssl/server.key",
			"cert": "./ssl/server.crt",
			"allowHTTP1": true,
			"settings": {
				"enablePush": true
			}
		}
	},
	"session": {
		"keys": [
			"Th1s!sThePlantWorksWebAppFramew0rk"
		],
		"config": {
			"autoCommit": true,
			"domain": "azure.plant.works",
			"key": "plantworks!webapp!server",
			"maxAge": 86400000,
			"overwrite": true,
			"httpOnly": true,
			"signed": true,
			"rolling": false,
			"renew": true
		}
	},
	"subdomainMappings": {
		"cloud-portal": "www",
		"local-portal": "www",
		"localhost": "www",
		"127.0.0.1": "www"
	}
};
