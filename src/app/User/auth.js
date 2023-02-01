const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy
const userProvider = require('./userProvider');

passport.use('kakao-login',
   new KakaoStrategy(
      {
         clientID: '94be56c7057c88479c1d6554d5e6b5b0',                  // !!!!!!!!!!!! client ID 수정 필요 (.env에 저장하기)
         clientSecret: 'tTcB3N0FObdRu4xQsimTn25xluxBpO8S',
         prompt: 'login',
         callbackURL: '/auth/kakao/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
         const userToken = {
            id: profile.id,
            accessToken: accessToken || '',
         }
         return done(null, userToken);           // 카카오 계정 식별 아이디 (10자리 숫자);
      },
   ),
);

passport.serializeUser(function (data, done) {
   done(null, data);
});

passport.deserializeUser(function (user, done) {

   userProvider.retrieveUser(user.id)
      .then((result) => {
         done(null, user);
      })
      .catch((error) => done(error));
});
