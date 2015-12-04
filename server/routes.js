'use strict';

var config = require('./config/environment');

module.exports = function (app) {

  // API
  app.use('/api/users', require('./api/user'));
  app.use('/api/groups', require('./api/group'));

  // Auth
  app.use('/auth', require('./auth'));

  // Returning 404 when user tries to access hidden route
  app.route('/:url(api|app|bower_components|assets)/*')
    .get(function (req, res) {
      res.status(404).end();
    });

  app.route('/*')
    .get(function (req, res) {
      res.sendFile(
        app.get('appPath') + '/index.html',
        { root: config.root }
      );
    });

};
