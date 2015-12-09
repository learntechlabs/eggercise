'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./group.controller');
var auth = require('../../auth/auth.service');

router.get('/', controller.showAllGroups);
router.post('/create', auth.isAuthenticated(), controller.create);
router.post('/delete/:group_id', auth.isAuthenticated(), controller.delete);

module.exports = router;
