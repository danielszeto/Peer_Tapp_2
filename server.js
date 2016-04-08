//SERVER SIDE JAVASCRIPT
var express       = require('express'),
    app             = express(),
    mongoose        = require('mongoose'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    auth            = require('./resources/auth'),
    hbs             = require('hbs'),
    path            = require('path'),
    logger          = require('morgan'),
    routes          = require('./config/routes'),
    User            = require('./models/user'),
    Beer = require('./models/beer'),
    cors = require('cors'),
    Event = require('./models/event');

app.use(cors());

// require and load dotenv
require('dotenv').load();


//MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));
app.use(methodOverride('__method'));

//set view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

//routes
app.use(routes);

/*
 * API Routes
 */

app.get('/api/me', auth.ensureAuthenticated, function (req, res) {
  User.findById(req.user, function (err, user) {
    res.send(user.populate('posts'));
  });
});

app.put('/api/me', auth.ensureAuthenticated, function (req, res) {
  User.findById(req.user, function (err, user) {
      console.log("Not updated yet, ".bgGreen, user); 
    if (!user) {
      return res.status(400).send({ message: 'User not found.' });
    }
    user.fullname = req.body.fullname || user.fullname;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.save(function(err) {
        console.log("UpdatedUser, ".bgYellow, user); 
      res.send(user);
    });
  });
});



app.delete('/api/me', function(req,res) {
    console.log("DELETE SERVER"); 
  User.findById(req.user, function(err, user) {
    if(err) {
      console.log("ERROR".bgRed, err); 
    }
      console.log("removing:", user); 
  });

});

// app.get('/api/me/beers', auth.ensureAuthenticated, function (req, res) {
//   console.log('req.user', req.user);
//   User.findById({_id: req.user}, function (err, user) {
//     Beer.find({_id: {$in: user.beers}}, function(err, beers) {
//       if (err) console.log(err);
//       res.send(beers);
//     });
//   });
// });

/*
 * Auth Routes
 */

app.post('/auth/signup', function (req, res) {
  User.findOne({ email: req.body.email }, function (err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken.' });
    }
    var user = new User({
      fullname: req.body.fullname,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    user.save(function (err, result) {
      if (err) {
        res.status(500).send({ message: err.message });
          console.log("Error".bgRed, err); 
      }
          console.log("Result".green, result); 
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
        console.log("logged in user ".green, user); 
      res.send({ token: auth.createJWT(user) });
    });
  });
});


/*
 * Catch All Route
 */

app.get('*', function (req, res) {
  res.render('index');
});


// app.get(['/', '/signup', '/login', '/profile'], function (req, res) {
//   res.render('index');
// });

app.listen(process.env.PORT || 3000, function(){
  console.log('server is running on port 3000');
});

module.exports = app;