const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  hashtags: [{ type: Schema.Types.ObjectId, ref: 'Hashtag' }],
}, {
  timestamps: true,
  versionKey: false,
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

