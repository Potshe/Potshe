const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const { response, errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");
const userProvider = require("../User/userProvider")

const pointDao = require("./pointDao");

// Provider: Read 비즈니스 로직 처리

exports.retrievePoint = async function (keyword) {

    if (!keyword) {
        const connection = await pool.getConnection(async (conn) => conn);
        const pointListResult = await pointDao.selectPoints(connection);
        connection.release();

        return pointListResult;

    } else {
        const connection = await pool.getConnection(async (conn) => conn);
        const keywordParams = [keyword, keyword, keyword, keyword, keyword]
        const pointListResultByKeyword = await pointDao.selectPointsByKeyword(connection, keywordParams);
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
exports.getUserIdFromPoint = async function (pointId){
    const connection = await pool.getConnection(async (conn) => conn);
    const userIdFromPointResult = await pointDao.selectUserIdFromPoint(connection, pointId);
    connection.release();
    return response(baseResponse, userIdFromPointResult);
}
