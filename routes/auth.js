const express = require('express');
const passport = require('passport');

const { join, login, logout } = require('../controllers/auth');

const router = express.Router();

// POST /auth/join
//회원가입 페이지
router.get('/join',  (req, res) => {
  res.render('join', { title: '회원가입' }); 
});
router.post('/join',  join); 

//로그인 페이지

router.post('/join',  join); 
//회원가입 요청 -> 로그인아닌 상태에만 가능 -> join은 controllers/auth.js
//             -> await User.create 수행 -> 여기서 User는 models/user.js


router.get('/mypage', (req, res) => {
  res.render('mypage', {title: '마이페이지', user: req.user });
});


// POST /auth/login
router.post('/login',  login);

// GET /auth/logout
router.get('/logout',  logout);


module.exports = router;