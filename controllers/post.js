const { Post } = require('../models');


exports.uploadPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      userId: req.user._id,
    });

    await post.save();  // 몽고디비에 저장
    res.redirect('/post/talk');
  } catch (error) {
    console.error(error);
    next(error);
  }
};