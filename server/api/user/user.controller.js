'use strict';

var _ = require('lodash'),
mongoose = require('mongoose');

var authService = require('../../auth/auth.service');
var User = require('./user.model');

function handleError (res, err, status) {
  // return res.status(status).send(err);
  return res.status(status).json({err: err});
}

/**
 * Creates a new user in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  User.create(req.body, function (err, user) {
    if (err) { return handleError(res, err); }
    res.status(201).json({
      user: _.omit(user.toObject(), ['passwordHash', 'salt']),
      token: authService.signToken(user._id)
    });
  });
};

/**
 * Return the current logged user.
 *
 * @param req
 * @param res
 */
exports.getMe = function (req, res) {
  User.findById({_id: req.user._id})
    .populate('_groups')
    .exec(function (err, user) {
      if (err) { return handleError(res, err); }
      if (!user) { return res.json(401); }
      //This extracts user's create date from the objectId
      user.joinDate = user._id.getTimestamp();
      res.status(200).json(user);
    });
};


/**
 * Update a user profile in the DB.
 *
 * @param req
 * @param res
 */
exports.updateProfile = function (req, res) {
  var query = req.user._id;
  var options = {new: true};
  var password = req.body.password;

  var formInputs = {
    name: req.body.name,
    email: req.body.email,
  };

  if (password) {
    User.findById(query)
    .exec(function (err, user) {
      if (err) { return handleError(res, err); }
      if (!user) { return res.json(401); }
      user.password = password;
      user.save();
    });
  };

  var update = {};
  for (var key in formInputs) {
    if(formInputs[key]) {
      update[key] = formInputs[key];
    }
  }

  User.findByIdAndUpdate(query, update, options, function (err, user) {
    if (err) { return handleError(res, err);}
    res.status(200).json(user);
  });
};

/**
 * Log workout on a day.
 *
 * @param req
 * @param res
 */
exports.logWorkout = function (req, res) {
  var query = {'_id': req.user._id};
  User.findById(query, function (err, user) {
    if (err) {
      return handleError(error, error);
    } else {
      var date = req.body.date;
      user.exercises.push(date);
      user.save();
      res.json(user);
    }
  });
};

/**
 * Unlog workout on a day.
 *
 * @param req
 * @param res
 */
exports.unlogWorkout = function (req, res) {
  var query = {'_id': req.user._id};
  User.findById(query, function (err, user) {
    if (err) {
      return handleError(error, error);
    } else {
      var date = req.body.date;
      var convertedDate = new Date(date).toString();
      for (var i = 0; i < user.exercises.length; i++) {
        if(convertedDate == user.exercises[i]){
          user.exercises.splice(i,1);
          user.save();
          break;
        }
      }
      res.json(user);
    }
  });
};


/**
 * Show each members logs when clicked on a member.
 *
 * @param req
 * @param res
 */
exports.showLogs = function (req, res) {
  var userId = req.params.userId;
  User.findOne({_id: userId})
    .exec(function (error, foundUser) {
      if(error){
        return handleError(res, 'user not found', 404);
      } else if(foundUser){
        res.json(foundUser.exercises);
      }
    })
  };


/**
 * Remove a member from a group as a group creator
 *
 * @param req
 * @param res
 */
exports.delete = function (req, res){
  var user = new User({_id: req.params.userId});
  user.remove(function (error, deletedUser){
    if(error){
      return handleError(res, 'user not deleted', 404);
    }
    res.status(200).json({
      user: deletedUser
    });
  });
}


