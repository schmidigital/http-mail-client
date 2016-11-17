# http-mail-client
A simple small http interface which accepts E-Mails and sends them to whereevery you want!

Just use the config.sample.json and there you go!

example is provided in the example folder! :)

## TLDR:
1. Copy the example folder to your app and fit the config to your needs
2. You have 2 possibilities to start the server
2. 1. Start your server with "node mailer.js"
2. 2. Fit the docker-compose.yml to your needs and start your server with "docker-compose up -d"


In case you want to use docker, I recommend you to use "jwilder reverse proxy", so you can run your http mail client very easily on a domain like 'mailer.my-domain.com'.