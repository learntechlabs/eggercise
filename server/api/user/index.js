'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./user.controller');
var auth = require('../../auth/auth.service');

router.get('/me', auth.isAuthenticated(), controller.getMe);
router.post('/', controller.create);
router.post('/updateProfile', auth.isAuthenticated(), controller.updateProfile);
router.post('/log', auth.isAuthenticated(), controller.logWorkout);
router.post('/unlog', auth.isAuthenticated(), controller.unlogWorkout);
router.get('/showLog/:userId', auth.isAuthenticated(), controller.showLogs);

module.exports = router;
