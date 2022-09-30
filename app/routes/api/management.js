'use strict';

var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');
router.use(expressValidator())



// Home page
router.get('/', (req, res, next) => {
	res.send('/api/management route called')
});

// Login
router.get('/status', (req, res, next)=>{
    res.send('/api/management/status called')
});

module.exports = router;