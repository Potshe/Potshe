const passport = require("passport");
const { logout } = require("./authController");

module.exports = function (app) {
  app.get("/auth/kakao", passport.authenticate("kakao"));

  app.get(
    "/auth/kakao/callback",
    passport.authenticate("kakao", {
      failureRedirect: "/",
    }),
    (req, res) => {
      res.redirect("/join"); // 이미지 업로드 및 닉네임 입력 페이지 보여주기(프론트에서 처리..? -> 이미지 업로드 및 닉네임 입력 -> 'localhost:3000/app/users' 라우팅)
    }
  );

  // 로그아웃
  app.get("/auth/logout", logout);

  // 최종 회원가입 페이지 보여주기
  app.get("/join", (req, res, next) => {
    res.render("join.html", { userData: req.user });
  });

  // 로그인 성공 시 startPage 보여주기
  app.get("/startPage", (req, res, next) => {
    res.render("startPage.html", { userData: req.user });
  });
};
