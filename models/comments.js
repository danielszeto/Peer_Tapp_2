var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  body: String,
  upvotes: {type: Number, default: 0},
  beerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beer' }
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;