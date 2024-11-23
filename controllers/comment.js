const { Comment, Post } = require('../models');

exports.createComment = async (req, res, next) => {
  try {
    const { postId } = req.body;
    const { content } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send('게시물이 존재하지 않습니다.');
    }

    const comment = new Comment({
      content,
      postId,
      userId: req.user._id,
    });

    await comment.save();

    post.comments.push(comment._id);
    await post.save();

    const fullComment = await Comment.findById(comment._id).populate({
      path: 'userId',
      select: 'nick',
    });

    return res.status(201).json({ message: '댓글 작성 성공', comment: fullComment });
  } catch (error) {
    console.error(error);
    next(error);
  }
};