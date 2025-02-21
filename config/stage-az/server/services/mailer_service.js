exports.config = {
	"mode": "dummy",
	"dummy": {
		"test": true,
		"transporter": {
			"host": "smtp.ethereal.email",
			"port": 587,
			"secure": false,
			"auth": {
				"user": "",
				"pass": ""
			}
		},
		"sendMail": {
			"from": "Plant.Works WebApp Server"
		}
	},
	"gmail": {
		"test": false,
		"transporter": {
			"service": "gmail",
			"port": 465,
			"secure": true,
			"auth": {
				"user": "do-not-reply@plant.works",
				"pass": "your password"
			}
		},
		"sendMail": {
			"from": "Plant.Works WebApp Server"
		}
	},
	"AWS-SES": {
		"test": false,
		"transporter": {
			"accessKeyId": "Your access key id",
			"secretAccessKey": "Your secret key id",
			"region": "ap-south-1",
			"port": 465,
			"secure": true
		},
		"sendMail": {
			"from": "Plant.Works WebApp Server"
		}
	}
};
