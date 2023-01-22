const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const pointProvider = require("./pointProvider");
const pointDao = require("./pointDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");
const { USER_ID_NOT_MATCH } = require("../../../config/baseResponseStatus");
const { error } = require("winston");

exports.createPoint = async function (userId, title, content, type, location, creature, date) {
    try{

        const insertPointParams = [userId, title, content, type, location, creature, date];
        
        const connection = await pool.getConnection(async (conn) => conn);

        console.log(insertPointParams);
        const createPointResult = await pointDao.insertPoint(
            connection,
            insertPointParams
        );
      //console.log(`추가된 포인트 : ${createPointResult[0].affectedRows}`);
  
      connection.release();
  
      return response(baseResponse.SUCCESS);

    } catch(err) {
        logger.error(`App - createPoint Service error\n: ${error.messge}`);
        return errResponse(baseResponse.DB_ERROR);//왜인지 데이터베이스 에러가 뜨지만 추가는 됩니다... 뭘까용..
    }
}

