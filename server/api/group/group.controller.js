'use strict';

var _ = require('lodash');

var Group = require('./group.model');

function handleError (res, err) {
  return res.status(500).send(err);
}

//Creates a new group in the DB.
exports.create = function (req, res) {
	Group.create(req.body, function (err, createdGroup) {
		if (err) {
			return handleError(res, err);
		}
        res.status(201).json({
			group: createdGroup
		});
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