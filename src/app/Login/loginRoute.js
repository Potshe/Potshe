const secret_config = require("../../../config/secret");

module.exports = function(app){
    const login = require('./loginController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const passport = require('passport');

    // 환경변수 KakaoStrategy 수정 필요 
    app.get('/auth/kakao', passport.authenticate('kakao-login'));
    app.get('/auth/kakao/callback', passport.authenticate('kakao-login', {
        failureRedirect: '/',
    }), (req, res) => {
        res.redirect('/');
    });

};
