'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./group.controller');

router.post('/groups', controller.showAll);
router.post('/groups/:group_id', controller.showOne);
router.post('/create', controller.create);
router.post('/:group_id', controller.delete);


module.exports = router;
