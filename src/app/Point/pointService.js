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
const fetch = require("node-fetch");
const locationFinder = require('../../../config/locationFinder')


exports.createPoint = async function (userId, title, content, point_type, location, creature, point_date) {

    // 유저가 Users 테이블에 존재하는 유저인지 검사
    const userRows = await userProvider.retrieveUser(userId);
    console.log("userRows", userRows);
    if (userRows.length < 1)
        return errResponse(baseResponse.USER_USERID_NOT_EXIST);


    console.log('location')
    console.log(location)

    try{

        const insertPointParams = [userId, title, content, point_type, location, creature, point_date];

        const connection = await pool.getConnection(async (conn) => conn);

        console.log(insertPointParams);
        const createPointResult = await pointDao.insertPoint(
            connection,
            insertPointParams,
        );


        console.log(`추가된 포인트 id : ${createPointResult[0].point_id}`);

        connection.release();

        return response(baseResponse.SUCCESS, {pointId: createPointResult[0].point_id, location});

    } catch(err) {
        logger.error(`App - createPoint Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);//왜인지 데이터베이스 에러가 뜨지만 추가는 됩니다... 뭘까용..
    }

}

exports.createPointImg = async function (pointId, imgUrl) {

    console.log('createPointImg - pointId')
    console.log(pointId)

    console.log('createPointImg - imgUrl')
    console.log(imgUrl)

    // 존재하는 포인트의 id인지 판별
    // const pointRows = await pointProvider.getUserIdFromPoint(pointId);
    // console.log("pointRows", pointRows);
    // if (pointRows.length < 1)
    //     return errResponse(baseResponse.POINT_POINTID_NOT_EXIST);

    try{

        const insertPointImgParams = [pointId, imgUrl];

        const connection = await pool.getConnection(async (conn) => conn);

        const createPointResult = await pointDao.insertPointImg(
            connection,
            insertPointImgParams,
        );

        connection.release();

        return response(baseResponse.SUCCESS, {"img" : "성공"});

    } catch(err) {
        logger.error(`App - createPointImg Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);//왜인지 데이터베이스 에러가 뜨지만 추가는 됩니다... 뭘까용..
    }
}

exports.createPointLocation = async function(pointId, lat, long) {
    try{

        const connection = await pool.getConnection(async (conn) => conn);

        const createPointLocationParams = [pointId, lat, long]

        const createPointLocationResponse = await pointDao.insertPointLocation(connection, createPointLocationParams);
        connection.release();

        //return response(baseResponse.SUCCESS);

    } catch(err) {
        logger.error(`App - createPointLocation Service Error\n : ${error.message}`);
        return errResponse(baseResponse.DB_ERROR);
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

exports.deletePoint = async function(pointId) {
    // Points 테이블에 존재하는 point인지 판별
    const pointRows = await pointProvider.retrievePointById(pointId);
    console.log("pointRows", pointRows);
    if (pointRows.length < 1){
        return errResponse(baseResponse.POINT_POINTID_NOT_EXIST);
        /* TODO */
        // errResponse를 return 해줬는데도 그냥 {} 뜸..
    }

        try{

            const connection = await pool.getConnection(async (conn) => conn);

            const deletePointResult = await pointDao.deletePoint(
                connection,
                pointId,
            );

            connection.release();

            return response(baseResponse.SUCCESS);

        } catch(err) {
            logger.error(`App - createPointImg Service error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);//왜인지 데이터베이스 에러가 뜨지만 추가는 됩니다... 뭘까용..
        }


}