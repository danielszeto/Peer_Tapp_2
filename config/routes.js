//api goes here
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    router = express.Router();
    usersController = require('../controllers/usersController');

// connect to mongodb
mongoose.connect('mongodb://localhost/peertapp');

router.route('/api/users')
	.get(usersController.index)
	.post(usersController.create);


module.exports = router;