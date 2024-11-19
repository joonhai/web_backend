var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var savedPath = []; // 임시로 경로 데이터를 저장할 배열

// 저장된 경로 데이터를 POST로 저장하는 API
app.post('/savePath', (req, res) => {
    savedPath = req.body.path;
    res.send('Path saved successfully');
});

// 저장된 경로 데이터를 가져오는 API
app.get('/getPath', (req, res) => {
    res.json(savedPath);
});

// 기본 라우트 설정
app.use('/', indexRouter);
app.use('/users', usersRouter);

// /location 경로 처리
app.get('/location', (req, res) => {
    console.log("Accessed /location route");
    res.render('location');
});

// 리스트 상세 정보 페이지 처리
app.get('/list/:id/detail', (req, res) => {
    const listId = req.params.id;
    console.log(`Accessed detail page for list ID: ${listId}`);
    // 여기에서 실제로 데이터베이스에서 해당 listId를 조회해야 함.
    const list = {
        title: '제목 예시',
        content: '내용 예시',
        location: [
            { title: '장소1', address: '주소1', time: '시간1', memo: '메모1' },
            { title: '장소2', address: '주소2', time: '시간2', memo: '메모2' }
        ]
    };
    res.render('detail', { list: list });
});

// 리스트의 장소 추가 페이지 처리
app.get('/list/:id/location', (req, res) => {
    const listId = req.params.id;
    console.log(`Accessed location page for list ID: ${listId}`);
    res.render('location');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
