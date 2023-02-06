const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const userProvider = require("./userProvider");
const secret = require("../../../config/secret");

passport.use(
  "kakao-login",
  new KakaoStrategy(
    {
      clientID: secret.REST_API_KEY,
      prompt: "login",
      callbackURL: secret.REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      const userToken = {
        id: profile.id, // 카카오 계정 식별 아이디 (10자리 숫자)
        accessToken: accessToken || "",
      };
      return done(null, userToken);
    }
  )
);

passport.serializeUser(function (data, done) {
  done(null, data);
});

passport.deserializeUser(function (user, done) {
  userProvider
    .retrieveUser(user.id)
    .then((result) => {
      done(null, user);
    })
    .catch((error) => done(error));
});
