'use strict';

var _ = require('lodash');

var Group = require('../group/group.model'),
  User = require('../user/user.model'),
  Invite = require('./invite.model');

function handleError (res, err, status) {
  return res.status(status).json({err: err});
}

//Creates a new invite in the DB
exports.create = function (req, res) {
  var creatorId = req.user._id;
  var groupId = req.body._group;
  var invite = new Invite ({
    email: req.body.email,
    _group: groupId
  });
  invite.save(function (error, savedInvite) {
    if (error) {
      return handleError(res, error, 500);
    } else {
      res.json(savedInvite);
    }
  });
}