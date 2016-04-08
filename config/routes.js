//api goes here
var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    router = express.Router(),
    auth            = require('../resources/auth'),
    usersController = require('../controllers/usersController'),
    beersController = require('../controllers/beersController'),
    commentsController = require('../controllers/commentsController'),
    eventsController = require('../controllers/eventsController');


router.route('/api/users')
  .get(usersController.index)
  .post(usersController.create);

//  beer crud api
router.route('/api/beers')
  .get(beersController.beersIndex)
  .post(auth.ensureAuthenticated, beersController.newBeer);

router.route('/api/beers/:id')
  .get(auth.ensureAuthenticated, beersController.showBeer)
  .put(auth.ensureAuthenticated, beersController.editBeer)
  .delete(auth.ensureAuthenticated, beersController.deleteBeer);

//  comments crud api
router.route('/api/comments')
  .get(commentsController.commentsIndex)
  .post(commentsController.newComment);

router.route('/api/commments/:id')
  .get(commentsController.showComment)
  .put(commentsController.editComment);
  // .delete(auth.ensureAuthenticated, beersController.deleteComment);


  //  events crud api
router.route('/api/events')
  .get(eventsController.eventsIndex)
  .post(auth.ensureAuthenticated, eventsController.newEvent);

router.route('/api/events/:id')
  .get(eventsController.showEvent)
  .put(eventsController.editEvent);
  // .delete(auth.ensureAuthenticated, beersController.deleteComment);




module.exports = router;