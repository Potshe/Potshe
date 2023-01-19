const user = require("./userController");
const imageUploader = require('../../../config/imageUploader')

module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/app/test', user.getTest)

    // 1. 유저 생성 (회원가입) API
    app.post('/app/users', user.postUsers);

    // 2. 유저 조회 API (+ 검색)
    app.get('/app/users',user.getUsers); 

    // 3. 특정 유저 조회 API
    app.get('/app/users/:userId', user.getUserById);

    // 11. 특정 포인트에 좋아요 표시
    app.post('/app/users/:userId/likes/:pointId', user.postUserLike);

    // 12. 포인트 좋아요 취소
    app.delete('/app/users/:userId/likes/:pointId', user.deleteUserLike);

    // 13. 유저 프로필 이미지 수정 API
    app.post('/app/users/:userId/image', imageUploader.single('image'), user.updateImage);


    // TODO: After 로그인 인증 방법 (JWT)
    // 로그인 하기 API (JWT 생성)
    app.post('/app/login', user.login);

    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)



};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API