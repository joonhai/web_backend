const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Post} = require('../models');
const { uploadPost , renderTalk } = require('../controllers/post');
const { createComment} = require('../controllers/comment');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();


// POST /post
const upload2 = multer();
router.post('/talk',  upload2.none(), uploadPost);

router.get('/talk', renderTalk)


router.get('/login',  (req, res) => {
  res.render('mypage', { title: '마이페이지' });
});


// 댓글 
router.post('/comment', isLoggedIn, createComment);


// 댓글 수정기능
router.patch('/comment/:id',  async (req, res, next) => {
  try {
    const comment = await Comment.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!comment) {
      return res.status(404).send('댓글이 존재하지 않거나 수정 권한이 없습니다.');
    }

    await comment.update({ content: req.body.content });
    res.status(200).json({ message: '댓글 수정 성공', comment });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 댓글 삭제기능
router.delete('/comment/:id',  async (req, res, next) => {
  try {
    const comment = await Comment.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!comment) {
      return res.status(404).send('댓글이 존재하지 않거나 삭제 권한이 없습니다.');
    }

    await comment.destroy();
    res.status(200).json({ message: '댓글 삭제 성공' });
  } catch (error) {
    console.error(error);
    next(error);
  }
});


module.exports = router;