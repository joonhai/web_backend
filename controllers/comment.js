const { Comment, Post } = require('../models');

exports.createComment = async (req, res, next) => {
  try {
    const { postId } = req.body;
    const { content } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send('게시물이 존재하지 않습니다.');
    }

    // 댓글 생성
    const comment = new Comment({
      content,
      postId,
      userId: req.user._id,
    });

    await comment.save();

    // 게시물에 댓글 추가
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });

   res.redirect('/post/talk'); // 댓글 작성 후 다시 '러닝톡' 페이지로 리다이렉트
  } catch (error) {
    console.error(error);
    next(error);
  }
};