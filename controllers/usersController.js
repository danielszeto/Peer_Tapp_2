var User = require('../models/user');


var UserController = {

index: function(req, res) {
    console.log("Here!"); 
   User.find({}, function(err, users) {
     console.log("Error".bgRed, err);
    if(err) {
      console.log("Users so far ".green, users); 
    } 
    res.status(200).send(JSON.stringify(users));
  });
 },

create: function(req, res) {
    console.log("hellloooo create", res);
  var newUser = new User(req.body);
    console.log("A New User".green, newUser); 

  newUser.save(function(err, savedUser) {
   if(err) {
    console.log("Error".red, err); 
   }
    console.log("User".green, savedUser);
    res.json(savedUser);
   });
 }

}

module.exports = UserController;