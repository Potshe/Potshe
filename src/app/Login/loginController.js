const loginProvider = require("../Login/loginProvider");
const loginService = require("../../app/Login/loginService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const { SUCCESS } = require("../../../config/baseResponseStatus");

const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy

passport.use('kakao-login',
    new KakaoStrategy(
       {
        clientID: '',           // clientID 수정 필요
        callbackURL: '/auth/kakao/callback',
       },
       /*
        * clientID에 카카오 앱 아이디 추가
        * callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
        * accessToken, refreshToken: 로그인 성공 후 카카오가 보내준 토큰
        * profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입
        */
       async (accessToken, refreshToken, profile, done) => {
          console.log('kakao profile', profile);
       },
    ),
 );