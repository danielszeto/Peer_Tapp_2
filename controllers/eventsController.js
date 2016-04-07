var Event = require('../models/event');

var eventsController = {
  eventsIndex: function (req, res) {
    Event.find({}, function (err, allEvents){
      err ? console.log(err) : res.json(allEvents);
      console.log('EventsIndex is getting hit');
    });
  },
  showEvent: function(req,res) {
    console.log('showEvents is getting hit');
    var id = req.params.id;
    Event.findById({_id: id}, function(err, data) {
      err ? console.log(err) : res.json(data);
    });
  },

  newEvent: function (req, res) {
    console.log('new event route is hittin');
    var location = req.body.location;
    var host = req.body.host;
    var location = req.body.location;
    var eventuserid = req.user;

    Event.create({location: location, host: host, eventuserid: eventuserid}, 
    function(err, newEvent) { 
      console.log(newEvent);
      err ? console.log(err) : res.json(newEvent);
    });
  },

  editEvent: function (req, res) {
    // get event id from url params (`req.params`)
    var eventId = req.params.id;
    console.log(req.params.id);
    console.log('hit editevent route');
    // find event in db by id
    Event.findOne({ _id: eventId }, function (err, foundEvent) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
      } else {
        foundEvent.location  = req.body.location;
        foundEvent.host = req.body.host;
        foundEvent.upvotes = req.body.upvotes;
        foundEvent.save(function (err, saved){
            if (err) { console.log(err);}
            res.json(saved);
        });
      }
    });
  },

  deleteEvent: function (req, res) {
    var id = req.params.id;
    Event.remove({_id:id}, function (err, data) {
     if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  },
};

module.exports = eventsController;