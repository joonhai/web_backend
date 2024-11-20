const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

exports.join = async (req, res, next) => {
  const { userId, nick, password } = req.body;
  try {
    console.log(req.body);
    const exUser = await User.findOne({ userId: userId });
    // 로그인 - 일단 이 아이디로 가입한 유저가 있는지 찾기
    if (exUser) {
      return res.redirect('/join?error=exist');  // 이미 존재하는 아이디인지..
    }
    const hash = await bcrypt.hash(password, 12); // bcrypt 비밀번호 암호화
    const newUser = new User({
      userId,
      nick,
      password: hash,
    });
    await newUser.save();
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
}

exports.login = (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?error=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
};