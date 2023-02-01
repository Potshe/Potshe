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
        // profile : 카카오로부터 받은 사용자 정보
        console.log(
          `kakao profile : ${util.inspect(profile, false, null, true)}`
        );
        try {
          const exUser = await userProvider.retrieveUserByKakaoId(profile.id); // Users 테이블의 kakao_id를 통해 가입 유무 확인
          if (exUser.length !== 0) {
            done(null, exUser[0]); // -> serializeUser 호출
          } else {
            // 회원가입
            const result = await userService.createUserProfileInKakao({
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
            done(null, newUser[0]); // -> serializeUser 호출
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};