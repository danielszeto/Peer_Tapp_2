//api goes here
var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    router = express.Router(),
    auth            = require('../resources/auth'),
    usersController = require('../controllers/usersController'),
    beersController = require('../controllers/beersController');

// connect to mongodb
mongoose.connect('mongodb://localhost/peertapp');

router.route('/api/users')
	.get(usersController.index)
	.post(usersController.create);

//  beer crud api
router.route('/api/beers')
  .get(beersController.beersIndex)
  .post(auth.ensureAuthenticated, beersController.newBeer);

router.route('/api/beers/:id')
  .get(beersController.showBeer)
  .put(beersController.editBeer)
  .delete(beersController.deleteBeer);


module.exports = router;