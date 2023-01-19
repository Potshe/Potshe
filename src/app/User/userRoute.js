const user = require("./userController");

module.exports = function (app) {
  const user = require("./userController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 5. GET /users 모든 사용자 조회 user.getUserProfile
  app.get("/users", user.getUserProfile);

  // 6. GET /users/:userId 사용자 프로필 조회
  app.get("/users/:userId", user.getUserProfileById);

  // 7. PUT /users/:userId 사용자 프로필 수정
  app.put("/users/:userId", user.editUserProfile);

  // 8. POST /users 회원가입 시 사용자 프로필 생성
  app.post("/users", user.createUserProfile);

  // 11. 특정 포인트에 좋아요 표시
  app.post("/app/users/:userId/likes/:pointId", user.postUserLike);

  // 12. 포인트 좋아요 취소
  app.delete("/app/users/:userId/likes/:pointId", user.deleteUserLike);
};
