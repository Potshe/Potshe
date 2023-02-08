const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const { response, errResponse } = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");
const userProvider = require("../User/userProvider");

const pointDao = require("./pointDao");

// Provider: Read 비즈니스 로직 처리

exports.retrievePoint = async function (pageId, keyword, order) {
  if (!keyword) {
    const connection = await pool.getConnection(async (conn) => conn);
    let pointListResult;

    if (order !== "추천순" && order !== "최신순") {
      pointListResult = await pointDao.selectPoints(connection, pageId);
    } else if (order === "추천순") {
      pointListResult = await pointDao.selectPointsOrderByLikes(
        connection,
        pageId
      );
    } else if (order === "최신순") {
      pointListResult = await pointDao.selectPointsOrderByTime(
        connection,
        pageId
      );
    }

    connection.release();

    return pointListResult;
  } else if (keyword !== undefined) {
    const connection = await pool.getConnection(async (conn) => conn);
    let keywordParams = [keyword, keyword, keyword, keyword, keyword];
    let pointListResultByKeyword;

    if (order !== "추천순" && order !== "최신순") {
      pointListResultByKeyword = await pointDao.selectPointsByKeyword(
        connection,
        keywordParams
      );
    } else if (order === "추천순") {
      pointListResultByKeyword =
        await pointDao.selectPointsByKeywordOrderByLikes(
          connection,
          keywordParams
        );
    } else if (order === "최신순") {
      pointListResultByKeyword =
        await pointDao.selectPointsByKeywordOrderByTime(
          connection,
          keywordParams
        );
    }

    connection.release();

    return pointListResultByKeyword;
  }
};
exports.retrievePointById = async function (pointId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const pointListResult = await pointDao.selectPointById(connection, pointId);
  connection.release();
  return pointListResult;
};

//포인트의 유저아이디 반환
exports.getUserIdFromPoint = async function (pointId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userIdFromPointResult = await pointDao.selectUserIdFromPoint(
    connection,
    pointId
  );
  connection.release();
  return response(baseResponse, userIdFromPointResult);
};

// 모든 map 반환
exports.retrieveMapList = async function (pointId) {
  if (!pointId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const mapListResult = await pointDao.selectMap(connection);
    connection.release();

    return mapListResult;
  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const mapListResult = await pointDao.selectMapId(connection, pointId);
    connection.release();

    return mapListResult;
  }
};

// point_id 따른 특정 map 반환
exports.retrieveMap = async function (pointId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const mapResult = await pointDao.selectMapId(connection, pointId);
  connection.release();
  return response(mapResult);
};

// 모든 map 반환
exports.retrieveMapList = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const mapListResult = await pointDao.selectMapId(connection, pointId);
  connection.release();

  return mapListResult;
};

// point_id 따른 특정 map 반환
exports.retrieveMap = async function (pointId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const mapResult = await pointDao.selectMapId(connection, pointId);
  connection.release();
  return response(mapResult);
};

exports.retrieveMapMark = async function (latitude, longitude) {
  const connection = await pool.getConnection(async (conn) => conn);
  let locationParams = [latitude, longitude];
  const mapResult = await pointDao.selectMapMark(connection, locationParams);
  connection.release();
  console.log("map result");
  console.log(mapResult);
  return mapResult;
};
