const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");
const { errResponse } = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");

// Provider: Read 비즈니스 로직 처리

// 모든 사용자 조회 결과 반환
exports.retrieveUserList = async function (nickname) {
  if (!nickname) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userProfileListResult = await userDao.selectUserProfile(connection);

    connection.release();

    return userProfileListResult;
  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const userProfileListResult = await userDao.selectUserProfileByNickname(
      connection,
      nickname
    );

    connection.release();

    return userProfileListResult;
  }
};

// 특정 사용자 프로필 조회 결과 반환
exports.retrieveUser = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userProfileResult = await userDao.selectUserProfileById(
    connection,
    userId
  );

  connection.release();

  return userProfileResult;
};

// 닉네임 중복 여부 확인

// 사용자가 좋아요한 포인트 결과 반환
exports.retrieveUserLikeList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userLikeListResult = await userDao.selectUserLike(connection, userId);

  connection.release();

  return userLikeListResult;
};

// 특정 유저가 좋아요한 특정 포인트 결과 반환
exports.retrieveUserPointLike = async function (userId, pointId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userPointLikeResult = await userDao.selectUserPointLike(
    connection,
    userId,
    pointId
  );

  connection.release();

  return userPointLikeResult;
};
