const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

/**
 * API No. 5
 * API Name : 모든 사용자 조회
 * [GET] /users
 */
exports.getUserProfile = async function (req, res) {
  const userList = await userProvider.retrieveUserList();
  return res.send(response(baseResponse.SUCCESS, userList));
};

/**
 * API No. 6
 * API Name : 사용자 프로필 조회
 * [GET] /users/:userId
 */
exports.getUserProfileById = async function (req, res) {
  const userId = req.params.userId;

  const userByUserId = await userProvider.retrieveUser(userId);
  return res.send(response(baseResponse.SUCCESS, userByUserId));
};

/**
 * API No. 7
 * API Name : 사용자 프로필 수젇ㅇ
 * [PUT] /users/:userId
 */
exports.editUserProfile = async function (req, res) {
  const userId = req.params.userId;

  const { nickname, imageUrl } = req.body;
  const editUserProfileInfo = await userService.editUserProfile(
    userId,
    nickname,
    imageUrl
  );

  return res.send(response(baseResponse.SUCCESS, editUserProfileInfo));
};

/**
 * API No. 8
 * API Name : 회원가입 시 사용자 프로필 생성
 * [POST] /users
 */
exports.createUserProfile = async function (req, res) {
  const { nickname, imageUrl } = req.body;
  const signupResponse = await userService.createUserProfile(
    nickname,
    imageUrl
  );

  return res.send(response(signupResponse));
};

/**
 * API No. 11
 * API Name : 특정 포인트에 좋아요 표시
 * [POST] /app/users/likes/:userId/:pointId
 * path variable : userId, pointId
 */
exports.postUserLike = async function (req, res) {
  const { userId, pointId } = req.params;
  console.log("userId", userId);
  console.log("pointId", pointId);

  // userId가 없는 경우
  if (userId === ":userId")
    return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

  // pointId가 없는 경우
  if (pointId === ":pointId")
    return res.send(errResponse(baseResponse.POINT_POINTID_EMPTY));

  const pointLikeResponse = await userService.userPointLike(userId, pointId);

  return res.send(pointLikeResponse);
};

/**
 * API No. 12
 * API Name : 특정 포인트에 좋아요 취소
 * [DELETE] /app/users/likes/:userId/:pointId
 * path variable : userId, pointId
 */
exports.deleteUserLike = async function (req, res) {
  const { userId, pointId } = req.params;

  // userId가 없는 경우
  if (userId === ":userId")
    return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

  // pointId가 없는 경우
  if (pointId === ":pointId")
    return res.send(errResponse(baseResponse.POINT_POINTID_EMPTY));

  const pointLikeCancelResponse = await userService.userPointLikeCancel(
    userId,
    pointId
  );

  return res.send(pointLikeCancelResponse);
};

/**
 * API No. 13
 * API Name : 유저 프로필 이미지 등록 및 수정 API
 * [POST] /app/users/:userId/image
 * path variable : userId
 */
exports.updateImage = async function (req, res) {

    const { userId } = req.params;
    const filePath = req.file.location;
    
    // userId가 없는 경우
    if (userId === ":userId") return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    // 유효하지 않은 파일 경로일 경우
    if(!filePath){
        return res.send(baseResponse.FILE_INVALID_PATH);
    }

    const userImageUpdateResponse = await userService.userImageUpdate(userId, filePath);

    return res.send(userImageUpdateResponse);


};






/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
