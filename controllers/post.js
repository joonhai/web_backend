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

exports.renderTalk = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'nick')
      .populate({
        path: 'comments',
        populate: {
          path: 'userId', // 댓글 작성자 정보 가져옴
          select: 'nick', // 작성자의 닉네임만 가져옴
        }
      })
      .exec();
      
    res.render('talk', {
      title: '러닝 톡',
      write: posts,
      user: req.user, // 로그인한 사용자 정보
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
