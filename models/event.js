var mongoose = require('mongoose');


var EventSchema = new mongoose.Schema({
  location: {type: String, required: true},
  host: {type: String, required: true},
  eventuserid: {type: String, required: true},
  upvotes: {type: Number, default: 0},
  createdAt: { type : Date, default: Date.now() }
});



// create a method directly on the model: `all`

EventSchema.statics.all = function all(cb) {
  return
    this.model.find({})
    .catch(function(err) {
      console.log(err);
    })
    .then(function(events) {
      cb(events);
    })
  ;
};


// define the model
var Event = mongoose.model("Event", EventSchema);
// export the model to any files that `require` this one
module.exports = Event;