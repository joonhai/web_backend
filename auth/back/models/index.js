const mongoose = require('mongoose');
const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');
const Hashtag = require('./hashtag');

// MongoDB 연결 설정
const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://joonhai:1234@ossp.iuuki.mongodb.net/?retryWrites=true&w=majority&appName=ossp`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB 연결 성공');
  } catch (error) {
    console.error('MongoDB 연결 실패:', error);
    process.exit(1); // 연결 실패 시 프로세스 종료
  }
};

// MongoDB 연결 실행
connectDB();

// 모든 모델을 객체로 내보냄
module.exports = {
  User,
  Post,
  Comment,
  Hashtag,
};

