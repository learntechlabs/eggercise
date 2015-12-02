'use strict';

var _ = require('lodash');

var Group = require('./group.model');

function handleError (res, err) {
  return res.status(500).send(err);
}

