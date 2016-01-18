'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./group.controller');
var auth = require('../../auth/auth.service');

router.get('/', auth.isAuthenticated(), controller.showAllGroups);
router.post('/create', auth.isAuthenticated(), controller.create);
router.get('/:group_id', auth.isAuthenticated(), controller.showGroup);
router.post('/delete/:group_id', auth.isAuthenticated(), controller.delete);
router.post('/update/:group_id', auth.isAuthenticated(), controller.update);
router.get('/:group_id/leaderboard', auth.isAuthenticated(), controller.showGroupLeaderboard);

module.exports = router;
