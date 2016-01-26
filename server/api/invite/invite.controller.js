'use strict';

var _ = require('lodash'),
authService = require('../../auth/auth.service'),
  mongoose = require('mongoose');
var Group = require('../group/group.model'),
  User = require('../user/user.model'),
  Invite = require('./invite.model'),
  EmailService = require('../../email/email.service');

var errorHandler = require('../../error/error-handling');

function handleError (res, err, status) {
  return res.status(status).json({err: err});
}

function handleSuccess(res, message, status) {
  return res.status(status).json({message: message});
}

function generateInvitation (invitedUserName, groupCreator, id) {
  var emailBody = "Hello " + invitedUserName + ", you've been invited by " + groupCreator + " to join the Eggercise app! Please join by clicking on the link to accept your invitation."
  var localBaseUrl = "localhost:3000";
  var eggerciseBaseUrl = "https://www.eggercise.com"
  var fullUrl = localBaseUrl + "/invites/accept/" + id;
  return emailBody + " " + fullUrl;
}

function createInvite (savedInvite, req, res) {
  var creatorId = req.user._id;
  var groupId = req.body._group;
  var groupCreator = req.user;
  var groupCreatorName = groupCreator.name;
  var invitedUserName = req.body.name;

  if (savedInvite) {
    var subject = "You've been invited to join eggercise!"
    var emailText = generateInvitation(invitedUserName, groupCreatorName, savedInvite._id);
    var emailTo = savedInvite.email;

    EmailService.send(emailTo, subject, emailText, sendInvite(savedInvite, req, res));
  } else {
    errorHandler.handle(res, 'Did not create the invite', 422);
  }
}

function sendInvite (savedInvite, req, res) {
  if (res.json) {
    savedInvite.sent_at = Date.now();
    var returnedPromise = savedInvite.save();
    renderInvite(returnedPromise, savedInvite, res);
  } else {
    console.log('Error for failed send: ', err);
    res.json(err);
  }
}

function renderInvite (returnedPromise, sentInvite, res) {
  if (!returnedPromise) {
    console.log('The invitation did not save successfully.');
  } else {
    res.json(sentInvite);
  }
}

//Creates a new invite in the DB
exports.create = function (req, res) {
  var invite = new Invite ({
    name: req.body.name,
    email: req.body.email,
    _group: req.body._group,
    status: false
  });

  // Run a check for an existing invite in the database
  var query = Invite.find ({ email: invite.email, _group: invite._group });
  query.exec(function (error, foundInvitationsArray) {
    if (foundInvitationsArray.length <= 0) {
      // If no invites were found for this email address, then create invite
      invite.save(createInvite(invite, req, res));
    } else {
      foundInvitationsArray.forEach(function checkInvitations(foundInvite, index, inviteArray) {
        if (foundInvite._group.toString() === invite._group.toString()) {
          // Respond with server error
          errorHandler.handle(res, error, 500);
        }
      });
    }
  });
}

//View a single invitation
exports.showInvite = function (req, res) {
  var inviteId = req.params.invite_id;

  Invite.findOne({ _id: inviteId})
    .populate('_group')
    .exec(function (error, foundInvite) {
      if (!foundInvite && error === null) {
        errorHandler.handle(res, 'Invite not found', 404);
      } else if (foundInvite) {
        res.json(foundInvite);
      }
    });
}

//Invitee accepts invitation
exports.acceptInvite = function(req, res) {
  var newUser = req.body;
  var groupId = newUser.group._id;

  User.create(newUser, function (error, user) {
    if (error) {
      errorHandler.handle(res, error, 500);
    } else {
      User.findOne({_id: user._id})
      .populate('_groups')
      .exec(function (error, foundInvitee) {
        if (error) {
          errorHandler.handle(res, error, 404);
        }
          user._groups.push(newUser.group);
          user.save();
          var updatedGroup = populateMember(req, res, user._id);
          res.status(201).json({
          user: _.omit(user.toObject(), ['passwordHash', 'salt']),
          token: authService.signToken(user._id),
          invitee: foundInvitee
      })
    });
    }
  });
}

function populateMember (req, res, id) {
  var newUser = req.body;
  var groupId = newUser.group._id;

  Group.findOne({_id: groupId})
  .populate('_members')
  .exec(function (error, foundGroup) {
    if (error) {
      errorHandler.handle(res, error, 404);
    }
    foundGroup._members.push(id);
    foundGroup.save();
    return foundGroup;
  })
}
