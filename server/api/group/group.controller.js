'use strict';

var _ = require('lodash'),
	mongoose = require('mongoose');

var Group = require('./group.model'),
	User = require('../user/user.model');

function handleError (res, err) {
	return res.status(500).json({err: 'error'});
}

//Creates a new group in the DB.
//TODO: should return new group created with the attributes.
exports.create = function (req, res) {
	// console.log(req.user._id);
	var creatorId = req.user._id;
	var group = new Group ({
		name: req.body.name,
		bet: req.body.bet,
		start: req.body.start,
		end: req.body.end,
		_creator: creatorId
	});

	group.save(function (error, data) {
		if (data) {
			User.findOne({_id: creatorId}, function (error, creator){
				if (error) {
					return handleError(error, error);
				} else {
					var id = mongoose.Types.ObjectId(creator._id);
					creator._groups.push(id);
					creator.save();
					res.json(data);
				}
			});
		} else if (error) {
				console.error(error.stack);
				return handleError(error, error);
		}
	});

	// Group.create(req.body, function (err, createdGroup) {
	// 	console.log('express side reached');
	// 	if (err) {
	// 		return handleError(res, err);
	// 	}
	// 	res.status(201).json({
	// 		group: createdGroup
	// 	});
	// });
}

//view single group
exports.showGroup = function (req, res) {
	console.log('made it to showGroup!');
	Group.findOne(req.params.id, function (err, group) {
		console.log('show group: ', req.user._id);
		if (err) { return handleError(res, err); }
		if(req.user._id === group._creator || indexOf(group._members) > -1) {
			res.status(200).json(group);
		} else {
			res.status(404).json({err: 'not found'});
		}
	});
}

//Delete a group
exports.delete = function (req, res){
	var group = new Group({_id: req.params.group_id});
	group.remove( function (err, deletedGroup){
	    if(err){
	        return handleError(err, err);
	    }
	    res.status(400).json({
	        group: deletedGroup
	    });
	});
}