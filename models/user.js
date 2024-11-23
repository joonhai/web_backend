const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  nick: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  //followings: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true,
  versionKey: false,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
