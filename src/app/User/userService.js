const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const pointProvider = require("../Point/pointProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.editUserProfile = async function (userId, nickname, imageUrl) {

  // 존재하지 않는 유저면 error 메세지 return
  const userRows = await userProvider.retrieveUser(userId);
  console.log("userRows", userRows);
  if (userRows.length < 1)
    return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const editUserProfileResult = await userDao.updateUserProfileInfo(
      connection,
      userId,
      nickname,
      imageUrl
    );

    connection.release();

    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - editUserProfile Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.createUserProfile = async function (nickname, filePath) {
  try {
    const insertUserProfileParams = [nickname, filePath];
    const connection = await pool.getConnection(async (conn) => conn);
    const createUserResult = await userDao.insertUserInfo(
      connection,
      insertUserProfileParams
    );

    // console.log(userIdResult);
    console.log(`추가된 회원 : ${createUserResult[0].affectedRows}`);

    connection.release();

    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - createUserProfile Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.userPointLike = async function (userId, pointId) {
  // Users 테이블에 유저 존재 여부 확인
  const userRows = await userProvider.retrieveUser(userId);
  console.log("userRows", userRows);
  if (userRows.length < 1)
    return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  // Points 테이블에 포인트 존재 여부 확인
  const pointRows = await pointProvider.retrievePoint(pointId);
  console.log("pointRows", pointRows);
  if (pointRows.length < 1)
    return errResponse(baseResponse.POINT_POINTID_NOT_EXIST);

  // User_point_likes 테이블에 이미 해당 정보가 있는지 여부 확인
  const userPointLikeRows = await userProvider.retrieveUserPointLike(
    userId,
    pointId
  );
  console.log("userPointLikeRows", userPointLikeRows);
  if (userPointLikeRows.length > 0)
    return errResponse(baseResponse.LIKE_USERID_POINTID_EXIST);

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const addUserPointLike = await userDao.insertUserPointLike(
      connection,
      userId,
      pointId
    );
    connection.release();

    return response(baseResponse.USER_POINT_LIKE_SUCCESS);
  } catch (err) {
    logger.error(`App - userPointLike Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

exports.userPointLikeCancel = async function (userId, pointId) {
  // Users 테이블에 유저 존재 여부 확인
  const userRows = await userProvider.retrieveUser(userId);
  console.log("userRows", userRows);
  if (userRows.length < 1)
    return errResponse(baseResponse.USER_USERID_NOT_EXIST);

  // Points 테이블에 포인트 존재 여부 확인
  const pointRows = await pointProvider.retrievePoint(pointId);
  console.log("pointRows", pointRows);
  if (pointRows.length < 1)
    return errResponse(baseResponse.POINT_POINTID_NOT_EXIST);

  // User_point_likes 테이블에 이미 해당 정보가 있는지 여부 확인
  const userPointLikeRows = await userProvider.retrieveUserPointLike(
    userId,
    pointId
  );
  console.log("userPointLikeRows", userPointLikeRows);
  if (userPointLikeRows.length < 1)
    return errResponse(baseResponse.LIKE_USERID_POINTID_NOT_EXIST);

  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const deleteUserPointLike = await userDao.deleteUserPointLike(
      connection,
      userId,
      pointId
    );
    connection.release();

    return response(baseResponse.USER_POINT_LIKE_CANCEL_SUCCESS);
  } catch (err) {
    logger.error(`App - userPointLikeCancel Service error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};


exports.userImageUpdate = async function (userId, filePath) {

    // Users 테이블에 유저 존재 여부 확인
    const userRows = await userProvider.retrieveUser(userId);
    console.log('userRows', userRows)
    if (userRows.length < 1) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const updateUserProfile = await userDao.updateUserProfile(connection, userId, filePath)
        connection.release();

        return response(baseResponse.USER_PROFILE_IMAGE_SUCCESS);

    } catch (err) {
        logger.error(`App - updateUserProfile Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }


}