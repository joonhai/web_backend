const { User, Post, Hashtag, Comment } = require('../models');

exports.renderProfile = (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird' });
};

exports.renderJoin = (req, res) => {
  res.render('join', { title: '회원가입 - NodeBird' });
};


// 메인 페이지 렌더링
exports.renderMain = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('userId', 'nick').sort({ createdAt: -1 });
    res.render('main', {
      title: 'webback',
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// 해시태그 검색 렌더링
exports.renderHashtag = async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ title: query });
    let posts = [];
    if (hashtag) {
      posts = await Post.find({ hashtags: hashtag._id })
        .populate({
          path: 'userId', // 게시물 작성자 정보 포함
          select: 'nick', // 작성자의 닉네임만 포함
        });
    }

    return res.render('main', {
      title: `${query} | node_project`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};


/*exports.renderMain = async (req, res, next) => {
  try {
    const posts = await Post.find({
      include: [
        {
          model: User,
          attributes: ['id', 'nick'],
        },
        {
          model: Comment, // 댓글 포함
          include: {
            model: User, // 댓글 작성자 정보 포함
            attributes: ['id', 'nick'],
          },
        },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.render('main', {
      title: 'node_project',
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

exports.renderHashtag = async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }

    return res.render('main', {
      title: `${query} | node_project`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};*/