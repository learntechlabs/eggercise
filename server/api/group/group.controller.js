'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose');

var Group = require('./group.model'),
  User = require('../user/user.model');

function handleError (res, err, status) {
  return res.status(status).json({err: err});
}

//Show all groups
exports.showAllGroups = function (req, res) {
  var loggedUserId = req.user._id;
  User.findOne({ _id: loggedUserId})
    .populate('_groups')
    .exec(function (error, foundUser) {
    if (error) {
      return handleError(res, error, 500);
    } else if (foundUser) {
      res.json(foundUser._groups);
    }
  });
}


//Creates a new group in the DB.
//TODO: should return new group created with the attributes.
exports.create = function (req, res) {
  var creatorId = req.user._id;
  var group = new Group ({
    name: req.body.name,
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
          return handleError(res, error, 500);
        } else {
          var id = mongoose.Types.ObjectId(creator._id);
          creator._groups.push(data._id);
          creator.save();
          res.json(data);
        }
      });
    } else if (error) {
      console.error(error.stack);
      return handleError(res, error, 500);
    }
  });
}

//view single group
exports.showGroup = function (req, res) {
  if (mongoose.Types.ObjectId.isValid(req.params.group_id)) {
    Group.findOne({_id: req.params.group_id})
      .populate('_members')
      .exec(function (err, group) {
      if (err) { return handleError(res, err, 500);
      } else if (group) {
        if(req.user._id + '' == group._creator || group._members.indexOf() > -1) {
          res.status(200).json(group);
        } else {
          res.status(401).json({err: 'not authorized'});
        }
      } else {
        res.status(404).json({err: 'not found'});
      }
    });
  } else {
    res.status(404).json({err: 'not found'});
  }
}

//Delete a group
exports.delete = function (req, res){
  var group = new Group({_id: req.params.group_id});
  group.remove(function (err, deletedGroup){
    if(err){
      // res.status(400).json({err: 'deletedGroup not found'});
      return handleError(res, 'deletedGroup not found', 404);
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
  console.log('groupId: ', groupId);
  console.log('req.body : ', req.body);
  Group.update( groupId , {$set: {
    name: req.body.name,
    bet: req.body.bet,
    start: req.body.start,
    end: req.body.end,
    _creator: creatorId
  }}, function (err, updatedGroup){
      console.log('req.body : ', req.body);
      console.log('server err', err);
      console.log('server updatedGroup', updatedGroup);
    if(err){
      return handleError(res, 'updatedGroup not found', 404);
    }
    res.status(200).json({
      group: updatedGroup
    });
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
      return handleError(res, 'group not found', 404);
    }
  })
};




//show total # of exercises of each member in that group
// exports.exercisesCount = function (req, res) {

// })




