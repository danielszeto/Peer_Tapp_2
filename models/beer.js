var mongoose = require('mongoose');


var BeerSchema = new mongoose.Schema({
  name: {type: String, required: true},
  kind: {type: String, required: true},
  style: {type: String, required: true},
  image: {type: String, required: true},
  upvotes: {type: Number, default: 0},
  createdAt: { type : Date, default: Date.now() }
});



// create a method directly on the model: `all`

BeerSchema.statics.all = function all(cb) {
  return
    this.model.find({})
    .catch(function(err) {
      console.log(err);
    })
    .then(function(beers) {
      cb(beers);
    })
  ;
};


// define the model
var Beer = mongoose.model("Beer", BeerSchema);
// export the model to any files that `require` this one
module.exports = Beer;