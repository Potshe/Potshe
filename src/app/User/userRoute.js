const user = require("./userController");
const imageUploader = require("../../../config/imageUploader");

module.exports = function (app) {
  const user = require("./userController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // GET 모든 사용자 조회 API && GET 닉네임 중복 여부 확인
  app.get("/app/users", user.getUserProfile);

  // GET 특정 사용자 프로필 조회 API
  app.get("/app/users/:userId", user.getUserProfileById);

  // PUT 특정 사용자 프로필 수정 API
  app.put(
    "/app/users/:userId",
    imageUploader.single("image"),
    user.editUserProfile
  );

  // POST 회원가입 시 사용자 프로필 생성 API
  app.post("/app/users", imageUploader.single("image"), user.createUserProfile);

  // DELETE 회원 탈퇴
  app.delete("/app/users", user.deleteUserProfile);

  // GET 특정 사용자가 좋아요한 포인트 조회 API
  app.get("/app/users/:userId/likes", user.getUserLike);

  // 11. POST 특정 포인트에 좋아요 표시
  app.post("/app/users/:userId/likes/:pointId", user.postUserLike);

  // 12. DELETE 포인트 좋아요 취소
  app.delete("/app/users/:userId/likes/:pointId", user.deleteUserLike);

  // 13. POST 유저 프로필 이미지 수정 API
  app.post(
    "/app/users/:userId/image",
    imageUploader.single("image"),
    user.updateImage
  );

  // // TODO: After 로그인 인증 방법 (JWT)
  // // 로그인 하기 API (JWT 생성)
  // app.post('/app/login', user.login);
  //
  // // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
  // app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)
};
