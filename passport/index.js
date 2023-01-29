const passport = require("passport");
const kakao = require("./kakaoStrategy");
const userProvier = require("../src/app/User/userProvider");
const userService = require("../src/app/User/userService");
const util = require("util");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userProvier.retrieveUser(id);
      console.log(`deserializeUser -> user : ${util.inspect(user)}`);
      done(null, user[0]);
    } catch (err) {
      done(err);
    }
  });

  kakao();
};
