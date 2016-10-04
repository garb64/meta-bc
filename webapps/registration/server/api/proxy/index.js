'use strict';

var express = require('express');
var controller = require('./proxy.controller');

var router = express.Router();

router.route('/').post(controller.create);

module.exports = router;
