'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./invite.controller');
var auth = require('../../auth/auth.service.js');

router.get('/accept/:invite_id', controller.acceptInvite);
router.post('/create', auth.isAuthenticated(), controller.create);

module.exports = router;
