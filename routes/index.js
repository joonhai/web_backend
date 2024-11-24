var express = require('express');
var router = express.Router();
const { Location, Body } = require("../models/location");
const { User } = require("../models");

/* GET home page. */
router.get('/', function(req, res, next) {
    Body.find()
    .then(results => {
        res.render('list.ejs', { write: results, user: req.user });
    })
    .catch(error => console.error(error));
});

router.get('/write', function (req, res) {
	res.render('write',{user: req.user});
});

// 글 작성 처리
router.post('/write', function (req, res) {
    const { title, content } = req.body;
    let body = new Body();
    body.title = title;
    body.content = content;

    body.save()
        .then(result => {
            res.redirect(`/list/${result._id}`); 
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error saving body');
        });
});

//상세페이지
router.get('/list/:id', (req, res) => {
    const listid = req.params.id;
    
    // 요청이 AJAX인지 확인
    const isAjaxRequest = req.xhr || req.headers.accept.indexOf('json') > -1;

    Body.findById(listid)
        .populate('location')  // 위치 데이터를 함께 조회
        .then(result => {
            if (result) {
                if (isAjaxRequest) {
                    // AJAX 요청일 경우 JSON 응답 반환
                    res.json({
                        message: "success",
                        locations: result.location
                    });
                } else {
                    // 일반 요청일 경우 HTML 렌더링
                    res.render('detail', { list: result, locations: result.location,user: req.user });
                }
            } else {
                console.error("Body 데이터를 찾을 수 없습니다.");
                res.status(404).send('List not found');
            }
        })
        .catch(error => {
            console.error("데이터 조회 오류:", error);
            res.status(500).send('Error retrieving list');
        });
});

//좋아요

router.post('/list/:id/like', async (req, res) => {
    const listId = req.params.id; // 게시글 ID
    const userId = req.user.id; // 로그인된 사용자 ID

    try {
        const user = await User.findById(userId);
        const post = await Body.findById(listId);

        if (user.likedPosts.includes(listId)) {
            // 좋아요 취소
            user.likedPosts = user.likedPosts.filter(postId => postId.toString() !== listId);
            post.likes = Math.max(0, (post.likes || 1) - 1); // 최소 0 유지
        } else {
            // 좋아요 추가
            user.likedPosts.push(listId);
            post.likes = (post.likes || 0) + 1;
        }

        await user.save();
        await post.save();

        res.redirect(`/list/${listId}`);
    } catch (error) {
        console.error('좋아요 처리 중 오류:', error);
        res.status(500).send('좋아요 처리 중 오류 발생');
    }
});


  //위치추가페이지
router.get('/list/:id/location',  async (req, res) => {
    const bodyId = req.params.id; // 게시글 ID
    const userId = req.user._id; // 현재 로그인된 사용자 ID

    try {
    const user = await User.findById(userId);

      // 사용자가 좋아요를 눌렀는지 확인
    if (!user.likedPosts.includes(bodyId)) {
        return res.status(403).send('<script>alert("러닝에 참여해야 코스를 추가할 수 있습니다."); window.history.back();</script>');
    }

      // 좋아요를 누른 경우 위치 추가 페이지 렌더링
res.render('location', { title: '위치 추가하기', bodyId });
    } catch (error) {
    console.error('위치 추가 페이지 로드 중 오류:', error);
    res.status(500).send('서버 오류가 발생했습니다.');
    }
});
router.post('/list/:id/location', (req, res) => {
    const bodyId = req.params.id;  // Body의 ID를 가져옴
    const { title, address, lat, lng, memo, time } = req.body;

    // 새로운 위치 객체 생성
    let location = new Location({
        title,
        address,
        lat,
        lng,
        memo,
        time,
        bodyId: bodyId  // 해당 위치가 어떤 Body에 속하는지 설정
    });

    location
        .save()  // 위치 저장
        .then(() => {
            return Body.findById(bodyId);  // 위치 저장 후 해당 Body 객체를 찾음
        })
        .then((body) => {
            if (body) {
                body.location.push(location);  // 찾은 Body 객체에 위치 추가
                return body.save();  // Body 객체 저장
            } else {
                res.status(404).send('Body not found');
            }
        })
        .then(() => {
            res.redirect(`/list/${bodyId}`);  // 위치 추가 후 상세 페이지로 리다이렉트
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Error adding location');
        });
});

router.get('/talk', (req, res) => {
	res.render('talk');
})

router.get('/mypage', (req, res) => {
    res.render('mypage')
})

router.get('/join', (req, res) => {
    res.render('join')
})

router.get('/writeTalk', (req, res) => {
    res.render('writeTalk')
})
  
  
module.exports = router;