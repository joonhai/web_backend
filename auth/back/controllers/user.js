const User = require('../models/user');



/*exports.follow = async (req, res, next) => {
  try {
    // 현재 로그인한 사용자의 ID를 이용해 사용자 찾기
    const user = await User.findById(req.user._id); // Mongoose에서는 findById로 ObjectId로 찾습니다.
    if (!user) {
      return res.status(404).send('사용자를 찾을 수 없습니다.');
    }

    // 팔로우할 대상 사용자의 ID
    const targetUserId = req.params.id;

    // 이미 팔로우하고 있는지 확인
    if (user.followings.includes(targetUserId)) {
      return res.status(400).send('이미 팔로우 중입니다.');
    }

    // 팔로잉 목록에 대상 사용자 추가
    user.followings.push(targetUserId);
    await user.save(); // 저장

    // 팔로우 당하는 사용자의 followers에 현재 사용자 추가
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).send('팔로우할 사용자를 찾을 수 없습니다.');
    }
    targetUser.followers.push(req.user._id);
    await targetUser.save(); // 저장

    res.send('success');
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/*exports.follow = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) { // req.user.id가 followerId, req.params.id가 followingId
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};*/
