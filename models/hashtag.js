const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const hashtagSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post', // Post 모델과 참조 관계 설정
    },
  ],
}, {
  timestamps: true, // createdAt과 updatedAt을 자동으로 관리
});

// Hashtag 모델 생성
const Hashtag = mongoose.model('Hashtag', hashtagSchema);

module.exports = Hashtag;
