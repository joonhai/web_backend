var express = require('express');
var router = express.Router();
const { Location, Body } = require("../models/location");


/* GET home page. */
router.get('/', function(req, res, next) {
    Body.find()
    .then(results => {
        res.render('list.ejs', { write: results });
    })
    .catch(error => console.error(error));
});

router.get('/write', function (req, res) {
	res.render('write');
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
                    res.render('detail', { list: result, locations: result.location });
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


  //위치추가페이지
  router.get('/list/:id/location', function (req, res) {
    const bodyId = req.params.id;  // Body의 ID를 가져옴
	res.render('location');
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