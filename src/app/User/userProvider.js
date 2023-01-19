const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

// 모든 사용자 조회
exports.retrieveUserList = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const userListResult = await userDao.selectUser(connection);

  connection.release();

  return userListResult;
};

// 사용자 프로필 조회
exports.retrieveUser = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserId(connection, userId);

  connection.release();

  return userResult[0];
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
