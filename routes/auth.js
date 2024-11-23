const express = require('express');
const { User } = require("../models");
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


router.get('/mypage', async (req, res) => {
  try {
    if (req.isAuthenticated()) { 
      const user = await User.findById(req.user._id).populate('likedPosts'); // 좋아요한 게시글 로드
      res.render('mypage', { title: '마이페이지', user });
    } else {
      res.render('mypage', { title: '마이페이지', user: null });
    }
  } catch (error) {
    console.error('마이페이지 로드 중 오류:', error);
    res.status(500).send('마이페이지 로드 중 오류 발생');
  }
});




// POST /auth/login
router.post('/login',  login);

// GET /auth/logout
router.get('/logout',  logout);


module.exports = router;