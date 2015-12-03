'use strict';

var _ = require('lodash');

var Invite = require('./invite.model');

function handleError (res, err) {
  return res.status(500).send(err);
}

