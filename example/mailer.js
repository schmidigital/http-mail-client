var mail_client = require('http-mail-client');
var config = require('./config.json')

mail_client.run(config);