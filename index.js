'use strict';

var koa = require('koa');
var cors = require('koa-cors');
var app = koa();
var bodyParser = require('koa-bodyparser');
var Q = require('q');
var nodemailer = require('nodemailer');
var _ = require('lodash');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports.run = function run(config) {

  app.use(cors());

  app.use(bodyParser());

  app.use(function* () {

    let referer_domain = this.request.header.origin;
    let allowed_sender = config.allowed_sender;
    let allowed = false;
    let err = "";
    let options = {};
    var that = this;

    if (this.req.method == 'POST') {
      this.req.rawBody = '';

      options = this.request.body;

      let allowedSender = getValidSender();

      if (allowedSender) {
        let err = yield sendEmail(allowedSender);
        console.log(err)
      } else {
        // this.body = {
        //   err: "Could not send E-Mail."
        // };
        console.log("Somebody tried to send an email, but I think he is not allowed!");
        console.log(options);
      }
    }

    function sendEmail(allowedSender) {
      let deferred = Q.defer();

      let smtp_config = config.smtp;

      if (allowedSender.smtp)
        smtp_config = Object.assign(config.smtp, allowedSender.smtp);

      // create reusable transporter object using the default SMTP transport
      //let url = `smtps://${smtp_config.user}:${smtp_config.password}@${smtp_config.host}`;

      // Could be important in the future.. Maybe... :D
      let smtpConfig = {
        host: smtp_config.host,
        //port: smtp_config.port,
        port: 465,
        authMethod: 'LOGIN',
        auth: {
          user: smtp_config.user,
          pass: smtp_config.password
        },
        tls: {
          rejectUnauthorized: false
        },
        debug: true,
        name: 'localhost',
        secure: true
      }

      //let transporter = nodemailer.createTransport(smtpTransport(url));
      let transporter = nodemailer.createTransport(smtpTransport(smtpConfig));


      // setup e-mail data with unicode symbols
      let mailOptions = {
        from: options.from || 'mailer@schmidigital.de', // sender address
        to: options.to, // list of receivers
        replyTo: options.replyTo,
        subject: options.subject || '✉️  Neue Kontaktanfrage', // Subject line
        text: options.text.plain, // plaintext body
        html: options.text.html // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          that.body = {
            err: "We sent the E-Mail, but the mail Server had some problem. =/",
            msg: ""
          };

          deferred.reject();
          return console.log(error);
        }
        that.body = {
          err: "",
          msg: "E-Mail sent! Thank you 😀"
        };

        console.log(' ✉️  Message sent: ' + info.response);
        deferred.resolve();
      });

      return deferred.promise;
    }

    function getValidSender() {
      // Only allow certain domains
      var allowedSender = _.find(allowed_sender, sender => {
        return referer_domain.indexOf(sender.domain) > -1 ? sender : false;
      });

      if (allowedSender) {
        if (allowedSender.email.indexOf(options.from) > -1) {
          console.log("Sender Email allowed");
          return allowedSender;
        } else {
          err = "Sender E-Mail not allowed! Got " + options.from;
          that.body = err;
          return false;
        }

      } else {
        err = "Sender Host not allowed! Got: " + referer_domain;
        that.body = err;
        return false;
      }
    }

  });

  console.log("HTTP Mail Client is listening on port 3000")
}


app.listen(3000, "0.0.0.0");