var Beer = require('../models/beer');

var beersController = {
  beersIndex: function (req, res) {
    Beer.find({}, function (err, allBeers){
      err ? console.log(err) : res.json(allBeers);
      console.log('BeerIndex is getting hit');
    });
  },
  showBeer: function(req,res) {
    console.log('showBeer is getting hit');
    var id = req.params.id;
    Beer.findById({_id: id}, function(err, data) {
      err ? console.log(err) : res.json(data);
    });
  },

  newBeer: function (req, res) {
    console.log('new beer route is hittin');
    var name = req.body.name;
    var kind = req.body.kind;
    var style = req.body.style;
    var image = req.body.image;
    var userid = req.user;

    Beer.create({name: name, kind: kind, style: style, image: image, userid: userid}, 
    function(err, newBeer) { 
      console.log(newBeer);
      err ? console.log(err) : res.json(newBeer);
    });
  },

  editBeer: function (req, res) {
    // get beer id from url params (`req.params`)
    var beerId = req.params.id;
    console.log(req.params.id);
    console.log('hit editbeer route');
    // find beer in db by id
    Beer.findOne({ _id: beerId }, function (err, foundBeer) {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
      } else {
        foundBeer.name = req.body.name;
        foundBeer.kind = req.body.kind;
        foundBeer.style = req.body.style;
        foundBeer.upvotes = req.body.upvotes;
        foundBeer.save(function (err, saved){
            if (err) { console.log(err);}
            res.json(saved);
        });
      }
    });
  },

  deleteBeer: function (req, res) {
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

module.exports = beersController;