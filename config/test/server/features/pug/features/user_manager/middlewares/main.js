exports.config = {
	"passwordFormat": {
		"length": 10,
		"numbers": true,
		"symbols": true,
		"uppercase": true,
		"excludeSimilarCharacters": true,
		"strict": true
	},
	"resetPasswordMail": {
		"from": "do-not-reply@plant.works",
		"subject": "Plant.Works account"
	}
};
