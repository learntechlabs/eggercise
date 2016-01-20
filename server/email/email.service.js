// using SendGrid's Node.js Library - https://github.com/sendgrid/sendgrid-nodejs
var config = require('../config/environment');
var sendgrid  = require('sendgrid')(config.sendgrid_api_key);

// callback must be a function that will receive two parameters: err, json
exports.send = function (emailTo, subject, emailText, callback) {
    if(emailTo){
      sendgrid.send({
        to:       emailTo,
        from:     'team@eggercise.com',
        subject:  subject,
        text:     emailText
      }, callback);
    }else{
        callback('Email must be provided', null);
    }
}


