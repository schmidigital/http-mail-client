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

3. Now pass the data to your http-mail-client

Example config.json
```
{
  "smtp": {
    "host": "mail.foo.de",
    "user": "user@bar.de",
    "password": "1234haha",
    "port": 465
  },
  "allowed_sender": [{
    "domain": "website-where-your-script-is-launched.com", // the script will only allow requests from this domain. For local development, just enter 'localhost'
    "email": "foo@bar.de", // the script will only allow this email as valid sender.
    "smtp": { // These are the credentials for your smtp server
      "user": "override@defaultsmtp.com",
      "password": "awesomepassword",
      "host": "smtp.my-server.com",
      "port": 587
    }
  }]
}
```

Example Http Request
```
let mail = {
  from: 'no-reply@your-company.com',
  to: 'info@your-company.com',
  replyTo: 'hermine@granger.com,
  subject: '✉️ Contact Request from Hermine Granger',
  text: {
    plain: message.plain,
    html: message.html
  }
};

*Important*

// This is an example using Angular 2 HTTP POST Query. Works with any other http library too, ofc ;-).
// Just use the 'mail' object as your body.
this.http.post('https://mailer.schmid.digital', mail)
  .subscribe(res => console.log('response', res))
```

If you have any questions, feel free to open an issue on github!