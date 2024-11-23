const express = require('express');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { join, login, logout } = require('../controllers/auth');

const router = express.Router();

// POST /auth/join
//회원가입 페이지
router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', { title: '회원가입' }); 
});
router.post('/join', isNotLoggedIn, join); 

//로그인 페이지

router.post('/join', isNotLoggedIn, join); 
//회원가입 요청 -> 로그인아닌 상태에만 가능 -> join은 controllers/auth.js
//             -> await User.create 수행 -> 여기서 User는 models/user.js


router.get('/mypage', (req, res) => {
  res.render('mypage', {title: '마이페이지', user: req.user });
});


// POST /auth/login
router.post('/login', isNotLoggedIn, login);

// GET /auth/logout
router.get('/logout', isLoggedIn, logout);

// GET /auth/kakao
router.get('/kakao', passport.authenticate('kakao'));

// GET /auth/kakao/callback
router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/?error=카카오로그인 실패',
}), (req, res) => {
  res.redirect('/'); // 성공 시에는 /로 이동  
});
router.get('/check-login', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`로그인 상태입니다. 사용자: ${req.user.userId}`);
  } else {
    res.send('로그인되지 않았습니다.');
  }
});

module.exports = router;