const passport = require("passport");
const { logout } = require("./authController");

module.exports = function (app) {
  console.log(logout);

  app.get("/auth/logout", logout);

  app.get("/auth/kakao", passport.authenticate("kakao"));

  app.get(
    "/auth/kakao/callback",
    passport.authenticate("kakao", {
      failureRedirect: "/",
    }),
    (req, res) => {
      res.redirect("/page"); // 이미지 업로드 및 닉네임 입력 페이지 보여주기(프론트에서 처리..? -> 이미지 업로드 및 닉네임 입력 -> 'localhost:3000/app/users' 라우팅)
    }
  );
};
