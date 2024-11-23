// models/index.js

const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');
const Location = require('./location'); // 팀원의 러닝 코스 관련 모델들

// 모든 모델을 객체로 내보냄
module.exports = {
  User,
  Post,
  Comment,
  Location,
};
