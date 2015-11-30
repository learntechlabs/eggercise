'use strict';

/**
 * Test tasks
 */

var chalk       = require('chalk');
var KarmaServer = require('karma').Server;

/**
 * Log. With options.
 *
 * @param {String} msg
 * @param {Object} options
 */
function log (msg, options) {
  options = options || {};
  console.log(
    (options.padding ? '\n' : '')
    + chalk.yellow(' > ' + msg)
    + (options.padding ? '\n' : '')
  );
}

function testServer (done) {

  log('Running server tests...', { padding: true });

  done();

}

function testClient (done) {

  log('Running client tests...', { padding: true });

  var server = new KarmaServer({
    configFile: __dirname + '/../karma.conf.js'
  }, done);

  server.start();
}

exports.test = function (done) {
  process.env.NODE_ENV = 'test';
  var arg = process.argv[3] ? process.argv[3].substr(2) : false;
  if (arg === 'client') {
    return testClient(done);
  } else if (arg === 'server') {
    return testServer(function (code) {
      done(code);
      process.exit(code);
    });
  } else if (arg === false) {
    return testClient(function (code) {
      if (code) { return done(code); }
      testServer(function (code) {
        done(code);
        process.exit(code);
      });
    });
  } else {
    console.log('Wrong parameter [%s], availables : --client, --server', arg);
  }
};
