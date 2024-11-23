const passport = require('passport');
const localStrategy = require('./localStrategy');
const User = require('../models/user'); // User 모델 불러오기

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id); // User 모델에서 사용자 찾기
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  localStrategy(); // 로컬 전략 등록
};
