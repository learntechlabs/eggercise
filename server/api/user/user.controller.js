'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose');

var authService = require('../../auth/auth.service');
var User = require('./user.model');

function handleError (res, err) {
  return res.status(500).send(err);
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
  User.findById(req.user._id, function (err, user) {
    if (err) { return handleError(res, err); }
    if (!user) { return res.json(401); }
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

  var formInputs = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
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
  //Try changing this to req.params._id;
  var query = {'_id': req.params.id};
  // var query = {'_id': req.user._id};
  User.findById(query, function (err, user) {
    if (err) {
      return handleError(error, error);
    } else {
      var date = req.body.exercises;
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
  var query = {'_id': req.params.id};
  // var query = {'_id': req.user._id};
  User.findById(query, function (err, user) {
    if (err) {
      return handleError(error, error);
    } else {
      var date = req.body.exercises;
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