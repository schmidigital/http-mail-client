'use strict';

var logger = require('koa-logger')
var koa = require('koa');
var app = koa();
var bodyParser = require('koa-bodyparser');

var nodemailer = require('nodemailer');
var config = require('./config.json')

var Q = require('q');

// app.use(logger())

app.use(bodyParser());

app.use(function *(){
  let referer_host = this.request.header.host;
  let allowed_sender = config.allowed_sender;
  let allowed = false;
  var config = {};
  let err = "";
  var that = this;

  if(this.req.method == 'POST') {
    this.req.rawBody = '';

    console.log(this.request.body)

    config = this.request.body;

    let allowed = checkSender();

    if (allowed) {
      yield sendEmail();

      this.body = {
        err: "",
        msg: "E-Mail sent! Thank you 😀"
      };
    } else {
      this.body = {
        err: "Could not send E-Mail."
      };
      console.log( "Somebody tried to send an email, but I think he is not allowed!")
    }
  }

  function sendEmail(cb) {
    var deferred = Q.defer();

    // create reusable transporter object using the default SMTP transport
    let url = 'smtps://' + config.smtp.user + ':' + config.smtp.password + 
              + "@" + confit.smtp.host;
    var transporter = nodemailer.createTransport();

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: '"Jeffrey" <mailer@schmidigital.de>', // sender address
        to: config.to, // list of receivers
        subject: '✉️ Neue Kontaktanfrage', // Subject line
        text: config.text.plain, // plaintext body
        html: config.text.html // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info){
        if(error){
            return console.log(error);
        }
        console.log(' ✉️  Message sent: ' + info.response);
        deferred.resolve();
    });  

    return deferred.promise;
  }

  function checkSender() {
    // Only allow certain domains
    for (let sender of allowed_sender) {
      // console.log(`sender ${sender.domain}`)
      // console.log(`sender ${referer_host}`)

      if (referer_host.indexOf(sender.domain) > -1) {
        allowed = true;
      } else {
        err = "Sender Host not allowed!";
      }

      if (sender.email.indexOf(config.from) > -1) {
        allowed = true;
      } else {
        err = "Sender E-Mail not allowed!";
      }

      if (err) {
        that.body = err;
        return false;
        // TODO
        // Write Log File, if err happens.
      } else {
        return true;
      }
    }
  }

});

app.listen(3000);
