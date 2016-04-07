var Comments = require('../models/comments');

var commentsController = {
  commentsIndex: function (req, res) {
    console.log('comment index is getting hit');
  	Comments.find(function (err, allComments) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(allComments);
    }
  });
 
  },
  showComment: function(req,res) {
  	console.log('showcomment is getting hit');
    var id = req.params.id;
    Comments.findById({_id: id}, function(err, data) {
      err ? console.log(err) : res.json(data);
    });

  },

  newComment: function (req, res) {
  	var newComment = new Comments(req.body);
  	newComment.save(function (err, savedComment) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(savedComment);
    }
  });

  },

  editComment: function (req, res) {
  	var id = req.params.id;
    console.log('hit update route');
    Comments.findById({_id: id}, function (err, foundComment){
        if (err) console.log(err);
        foundComment.body = req.body.body;
        foundComment.upvotes = req.body.upvotes;
        foundComment.save(function (err, saved){
            if (err) { console.log(err);}
            res.json(saved);
        });
    });

  },

  deleteComment: function (req, res) {
  	var id = req.params.id;
  	Comments.remove({_id:id}, function (err) {
    if (err)
    console.log(err);

  });

  }
}

module.exports = commentsController;