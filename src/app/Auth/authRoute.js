const passport = require("passport");
const {
  isLoggedIn,
  isNotLoggedIn,
} = require("../../../config/loginMiddleware");

module.exports = function (app) {
  // 카카오 로그인 페이지로 이동
  app.get("/auth/kakao", passport.authenticate("kakao"));

  // 카카오 로그인 버튼을 누르면...
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
  app.get("/auth/logout", async (req, res, next) => {
    req.logout(() => {
      res.redirect("/"); // 로그아웃하면 다시 '/'로 이동
    });
  });

  // 최종 회원가입 페이지 보여주기
  app.get("/join", (req, res, next) => {
    res.render("join.html", { userData: req.user });
  });

  // 로그인 성공 시 startPage 보여주기
  app.get("/startPage", (req, res, next) => {
    res.render("startPage.html", { userData: req.user });
  });
};
