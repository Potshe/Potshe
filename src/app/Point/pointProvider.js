const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const pointDao = require("./pointDao");

// Provider: Read 비즈니스 로직 처리

exports.retrievePoint = async function (pointId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const pointResult = await pointDao.selectPointId(connection, pointId);
    connection.release();

    return pointResult;
};
