var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    hbs = require('hbs'),
    path = require('path'),
    routes = require('./config/routes'),
    User = require('./models/user');

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));

// require and load dotenv
require('dotenv').load();

// parse application/json
app.use(bodyParser.json());

app.use(routes);

// set view engine to hbs (handlebars)
app.set('view engine', 'hbs');

// serve static files from public folder
app.use(express.static(__dirname + '/public'));



app.get('*', function (req, res) {
  res.render('index');
});

//signup and login

app.post('/auth/signup', function (req, res) {
  User.findOne({ email: req.body.email }, function (err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken.' });
    }
    var user = new User({
      displayName: req.body.displayName,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    user.save(function (err, result) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      res.send({ token: auth.createJWT(result) });
    });
  });
});

app.post('/auth/login', function (req, res) {
  User.findOne({ email: req.body.email }, '+password', function (err, user) {
    if (!user) {
      return res.status(401).send({ message: 'Invalid email or password.' });
    }
    user.comparePassword(req.body.password, function (err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: 'Invalid email or password.' });
      }
      res.send({ token: auth.createJWT(user) });
    });
  });
});

// listen on port 3000
app.listen(3000, function() {
  console.log('server started');
});

module.exports = app;