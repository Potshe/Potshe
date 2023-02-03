const user = require("./userController");
const imageUploader = require("../../../config/imageUploader");
const point = require("../Point/pointController");
const userProvider = require("./userProvider");

module.exports = function (app) {
  const user = require("./userController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");
  const auth = require("./auth");
  const passport = require("passport");

  // GET 카카오톡 로그인 페이지 이동
  app.get("/app/auth/kakao", passport.authenticate("kakao-login")); // 환경변수 수정 필요
  // GET User 정보 수신
  app.get(
    "/app/auth/kakao/callback",
    passport.authenticate("kakao-login", {
      failureRedirect: "/",
    }),
    user.kakaoLogin
  );

  // GET 로그아웃
  app.get("/app/auth/kakao/logout", user.kakaoLogout);

  // GET 모든 사용자 조회 API && GET 닉네임 중복 여부 확인
  app.get("/app/users", user.getUserProfile);

  // GET 특정 사용자 프로필 조회 API
  app.get("/app/users/:userId", user.getUserProfileById);

  // POST 회원가입 시 사용자 프로필 생성 API
  app.post("/app/users", imageUploader.single("image"), user.createUserProfile);

  // PUT 특정 사용자 프로필 수정 API
  app.put(
    "/app/users/:userId",
    imageUploader.single("image"),
    user.editUserProfile
  );



  // DELETE 회원 탈퇴
  app.delete("/app/users", user.deleteUserProfile);

  // GET 특정 사용자가 좋아요한 포인트 조회 API
  app.get("/app/users/:userId/likes", user.getUserLike);

  // POST 특정 포인트에 좋아요 표시
  app.post("/app/users/:userId/likes/:pointId", user.postUserLike);

  // DELETE 포인트 좋아요 취소
  app.delete("/app/users/:userId/likes/:pointId", user.deleteUserLike);

  // POST 유저 프로필 이미지 수정 API
  app.post(
    "/app/users/:userId/image",
    imageUploader.single("image"),
    user.updateImage
  );

  // GET 유저가 올린 포인트 조회 API
  app.get("/app/users/:userId/points", user.getPointByUserId);

  // // TODO: After 로그인 인증 방법 (JWT)
  // // 로그인 하기 API (JWT 생성)
  // app.post('/app/login', user.login);
  //
  // // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
  // app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)

  // GET 회원가입 페이지 연결
  app.get("/join", (req, res, next) => {
    res.render("join.html", { user_id: req.session.passport.user.id });
  });

  // GET 로그인 성공 시 startPage 연결
  app.get("/startPage", async (req, res, next) => {
    console.log("req.session at startpage router", req.session);
    const userProfile = await userProvider.retrieveUser(
      req.session.passport.user.id
    );
    console.log("userProfile", userProfile);
    res.render("startPage.html", { userProfile: userProfile[0] });
  });
};
