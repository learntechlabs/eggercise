'use strict';

var path = require('path');
var _ = require('lodash');

var all = {

  env: process.env.NODE_ENV || 'development',
  root: path.normalize(__dirname + '/../../..'),
  port: process.env.PORT || 9000,

  sendgrid_api_key: process.env.SENDGRID_API_KEY ||
'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',

  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  secrets: {
    session: process.env.SESSION_SECRET || 'secretKey'
  }
};

module.exports = _.merge(all, require('./' + all.env + '.js'));
