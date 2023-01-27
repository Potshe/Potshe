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
const userProvider = require("../User/userProvider");

exports.createPoint = async function (userId, title, content, type, location, creature, date) {

    // 유저가 Users 테이블에 존재하는 유저인지 검사
    const userRows = await userProvider.retrieveUser(userId);
    console.log("userRows", userRows);
    if (userRows.length < 1)
        return errResponse(baseResponse.USER_USERID_NOT_EXIST);

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

exports.editPoint = async function(pointId, title, content, point_type, location, creature, point_date){
    try{

        const connection = await pool.getConnection(async (conn) => conn);

        const editPointParams = [title, content, point_type, location, creature, point_date, pointId]

        const editPointResult = await pointDao.updatePoint(connection, editPointParams);
        connection.release();
  
      return response(baseResponse.SUCCESS);

    } catch(err) {
        logger.error(`App - edtiPoint Service Error\n : ${error.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

}