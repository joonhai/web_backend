const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { afterUploadImage, uploadPost } = require('../controllers/post');
const { createComment} = require('../controllers/comment');
const { isLoggedIn } = require('../middlewares');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },    // 이미지.png -> 이미지12312315.png
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /post/img
router.post('/img', isLoggedIn, upload.single('img'), afterUploadImage);

// POST /post
const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), uploadPost);


// 댓글 
router.post('/comment',isLoggedIn,createComment);

/*router.post('/comment', isLoggedIn, async (req, res, next) => {
  try {
    const { postId } = req.body;
    const { content } = req.body;

    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(404).send('게시물이 존재하지 않습니다.');
    }

    const comment = await Comment.create({
      content,
      postId,
      userId: req.user.id,
    });

    return res.status(201).json(comment); // 댓글 객체 자체를 반환하여 클라이언트에서 바로 사용할 수 있도록 합니다.
  } catch (error) {
    console.error(error);
    next(error);
  }
});*/


// 댓글 수정기능
router.patch('/comment/:id', isLoggedIn, async (req, res, next) => {
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
router.delete('/comment/:id', isLoggedIn, async (req, res, next) => {
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