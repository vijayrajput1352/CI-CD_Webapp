exports.config = {
	"primus": {
		"parser": "JSON",
		"pathname": "/websockets",
		"transformer": "websockets",
		"iknowclusterwillbreakconnections": false
	},
	"session": {
		"key": "plantworks-webapp",
		"ttl": 3600,
		"store": {
			"media": "redis",
			"prefix": "plantworks!webapp!session!"
		},
		"secret": "Th1s!sThePlantWorksWebAppFramew0rk"
	},
	"cookieParser": {
		"path": "/",
		"domain": "azure.plant.works",
		"maxAge": 1814172241670,
		"secure": false,
		"httpOnly": false
	},
	"subdomainMappings": {
		"cloud-portal": "www",
		"local-portal": "www",
		"localhost": "www",
		"127.0.0.1": "www"
	}
};
