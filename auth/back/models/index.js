//const Sequelize = require('sequelize');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { User } = require('./user');
const { Post } = require('./post');
const { Comment } = require('./comment');
const { Hashtag } = require('./hashtag');
const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
//const config = require('../config/config')[env];


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
      process.exit(1);
  }
};

// 모델을 초기화하고 연결
const initModels = () => {
  return {
      User,
      Post,
      Comment,
      Hashtag,
  };
};

// DB 연결 함수 호출
connectDB();

module.exports = initModels();





/*const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;

const basename = path.basename(__filename);
fs
  .readdirSync(__dirname) // 현재 폴더의 모든 파일을 조회
  .filter(file => { // 숨김 파일, index.js, js 확장자가 아닌 파일 필터링
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => { // 해당 파일의 모델 불러와서 init
    const model = require(path.join(__dirname, file));
    console.log(file, model.name);
    db[model.name] = model;
    model.initiate(sequelize);
  });

Object.keys(db).forEach(modelName => { // associate 호출
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

//Comment.initiate(sequelize);
//db.Comment = Comment;

module.exports = db;*/