'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose');

var Group = require('./group.model'),
  User = require('../user/user.model');

var errorHandler = require('../../error/error-handling');

//Show all groups
exports.showAllGroups = function (req, res) {
  var loggedUserId = req.user._id;
  User.findOne({ _id: loggedUserId})
    .populate('_groups')
    .exec(function (error, foundUser) {
    if (error) {
      errorHandler.handle(res, error, 404);
    } else if (foundUser) {
      res.json(foundUser._groups);
    }
  });
}


//Creates a new group in the DB.
exports.create = function (req, res) {
  var creatorId = req.user._id;
  var group = new Group ({
    name: req.body.name,
    description: req.body.description,
    bet: req.body.bet,
    start: req.body.start,
    end: req.body.end,
    _creator: creatorId,
    _members: creatorId
  });

  group.save(function (error, data) {
    if (data) {
      User.findOne({_id: creatorId}, function (error, creator){
        if (error) {
          errorHandler.handle(res, error, 404);
        } else {
          var id = mongoose.Types.ObjectId(creator._id);
          creator._groups.push(data._id);
          creator.save();
          res.json(data);
        }
      });
    } else if (error) {
      console.error(error.stack);
      errorHandler.handle(res, error, 500);
    }
  });
}

//view single group
exports.showGroup = function (req, res) {
  // cast the user id to a string data type
  var loggedUserId =  req.user._id.toString();
  var groupCreatorId;
  var groupMemberIds = [];

  function runStatus(group) {
    res.status(200).json(group);
  }

  if (mongoose.Types.ObjectId.isValid(req.params.group_id)) {
    Group.findOne({_id: req.params.group_id})
      .populate('_members')
      .exec(function (error, group) {
      groupCreatorId = group._creator.toString();

      if (error) {
        errorHandler.handle(res, error, 404);
      } else if (group) {
        // store the member group ids in an array
        for (var i = 0; i < group._members.length; i++) {
          // cast the group member id to a string data type
          var stringGroupMemberId = group._members[i]._id.toString();
          groupMemberIds.push(stringGroupMemberId);
        }
        // check if the logged in user is part of the group
        for (var j = 0; j < groupMemberIds.length; j++) {
          if (loggedUserId === groupMemberIds[j]) {
            runStatus(group);
          }
        }
      }
    });
  }
}

//Delete a group
exports.delete = function (req, res){
  var group = new Group({_id: req.params.group_id});
  group.remove(function (error, deletedGroup){
    if(error){
      // res.status(400).json({err: 'deletedGroup not found'});
      errorHandler.handle(res, 'deletedGroup not found', 404);
      return;
    }
    res.status(200).json({
      group: deletedGroup
    });
  });
}

//Update a group
exports.update = function (req, res){
  var creatorId = req.user._id;
  var groupId = {_id: req.params.group_id};
  var options = {new: true};

  var formInputs = {
    name: req.body.name,
    description: req.body.description,
    bet: req.body.bet,
    start: req.body.start,
    end: req.body.end,
    _creator: creatorId
  }

  var update = {};
  for( var key in formInputs){
    if(formInputs[key]) {
      update[key] = formInputs[key];
    }
  }

  Group.findByIdAndUpdate(groupId, update, options, function (error, updatedGroup) {
    if (error) {
      errorHandler.handle(res, error, 422);
      return;
    }
    res.status(200).json(updatedGroup);
  });
}


//Show Leaderboard with members
exports.showGroupLeaderboard = function (req, res){
  var groupId = req.params.group_id;
  Group.findOne({_id: groupId})
  .populate('_members')
  .exec(function (error, foundGroup) {
    if(foundGroup){
      res.status(200).json({
        members: foundGroup._members
      });
    } else {
      errorHandler.handle(res, 'group not found', 404);
    }
  })
};
