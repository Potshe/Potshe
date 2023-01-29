const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const userProvider = require("../src/app/User/userProvider");
const userService = require("../src/app/User/userService");
const util = require("util");
const dotenv = require("dotenv");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: "d06d001370e6aa5bb8ceddfc8db23f5c",
        callbackURL: "/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(
          `kakao profile : ${util.inspect(profile, false, null, true)}`
        );
        try {
          const exUser = await userProvider.retrieveUserByKakaoId(profile.id);
          if (exUser.length !== 0) {
            done(null, exUser[0]);
          } else {
            // 회원가입
            const result = await userService.createUserProfile({
              kakaoId: profile.id,
              nickname: profile.displayName,
              // 기본이미지
              filePath:
                "https://potshebucket.s3.ap-northeast-2.amazonaws.com/user/1674975810127_newjeans.jpg",
            });
            const newUser = await userProvider.retrieveUserByKakaoId(
              profile.id
            );
            console.log(`newUser : ${util.inspect(newUser)}`);
            done(null, newUser[0]);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
