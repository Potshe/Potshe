const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const { response } = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");


const pointDao = require("./pointDao");

// Provider: Read 비즈니스 로직 처리

exports.retrievePoint = async function (keyword) {

    if (!keyword) {
        const connection = await pool.getConnection(async (conn) => conn);
        const pointListResult = await pointDao.selectPoints(connection);
        connection.release();

        return response(baseResponse.POINT_SUCCESS, pointListResult);

    } else {
        const connection = await pool.getConnection(async (conn) => conn);
        const keywordParams = [keyword, keyword, keyword, keyword, keyword]
        const pointListResultByKeyword = await pointDao.selectPointsByKeyword(connection, keywordParams);
        connection.release();

        return response(baseResponse.POINT_SUCCESS_BY_KEYWORD, pointListResultByKeyword);
    }
};


