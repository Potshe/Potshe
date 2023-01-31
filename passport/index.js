const passport = require("passport");
const kakao = require("./kakaoStrategy");
const userProvier = require("../src/app/User/userProvider");
const userService = require("../src/app/User/userService");
const util = require("util");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.user_id); // 사용자의 user_id만 저장한다.
  });

  passport.deserializeUser(async (id, done) => {
    try {
      // 사용자의 id를 통해 Users 테이블에 존재하는 사용자 정보를 가져온다.
      const user = await userProvier.retrieveUser(id);
      console.log(`deserializeUser -> user : ${util.inspect(user)}`);
      done(null, user[0]); // -> req.user에 사용자 정보 담기
    } catch (err) {
      done(err);
    }
  });

  kakao();
};
