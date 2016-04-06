var Beer = require('../models/beer');

var beersController = {
  beersIndex: function (req, res) {
    Beer.find({}, function (err, allBeers){
      err ? console.log(err) : res.json(allBeers);
    });
  },
  showBeer: function(req,res) {
    var id = req.params.id;
    Beer.findById({_id: id}, function(err, data) {
      err ? console.log(err) : res.json(data);
    });
  },

  newBeer: function (req, res) {
    var newBeer = new Beer(req.body);
    newBeer.save(function (err, savedBeer) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(savedBeer);
      }
    });
  },
  editBeer: function (req, res) {
    // get beer id from url params (`req.params`)
    var beerId = req.params.id;
    console.log('hit get route');
    // find beer in db by id
    Beer.findOne({ _id: beerId }, function (err, foundBeer) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
      } else {
        res.json(foundBeer);
      }
    });
  },
  deleteGarden: function (req, res) {
    var id = req.params.id;
    Beer.remove({_id:id}, function (err, data) {
     if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  },
};

module.exports = beersController