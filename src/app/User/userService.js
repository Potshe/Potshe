const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const pointProvider = require("../Point/pointProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (email, password, nickname) {
    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const insertUserInfoParams = [email, hashedPassword, nickname];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (email, password) {
    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

        const selectEmail = emailRows[0].email

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);

        if (passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);

        if (userInfoRows[0].status === "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === "DELETED") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log(userInfoRows[0].id) // DB의 userId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].id, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editUser = async function (id, nickname) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, id, nickname)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.userPointLike = async function (userId, pointId) {

    // Users 테이블에 유저 존재 여부 확인
    const userRows = await userProvider.retrieveUser(userId);
    console.log('userRows', userRows)
    if (userRows.length < 1) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

    // Points 테이블에 포인트 존재 여부 확인
    const pointRows = await pointProvider.retrievePoint(pointId);
    console.log('pointRows', pointRows)
    if (pointRows.length < 1) return errResponse(baseResponse.POINT_POINTID_NOT_EXIST);

    // User_point_likes 테이블에 이미 해당 정보가 있는지 여부 확인
    const userPointLikeRows = await userProvider.retrieveUserPointLike(userId, pointId);
    console.log('userPointLikeRows', userPointLikeRows)
    if (userPointLikeRows.length > 0) return errResponse(baseResponse.LIKE_USERID_POINTID_EXIST);

    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const addUserPointLike = await userDao.insertUserPointLike(connection, userId, pointId)
        connection.release();

        return response(baseResponse.USER_POINT_LIKE_SUCCESS);

    } catch (err) {
        logger.error(`App - userPointLike Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.userPointLikeCancel = async function (userId, pointId) {

    // Users 테이블에 유저 존재 여부 확인
    const userRows = await userProvider.retrieveUser(userId);
    console.log('userRows', userRows)
    if (userRows.length < 1) return errResponse(baseResponse.USER_USERID_NOT_EXIST);

    // Points 테이블에 포인트 존재 여부 확인
    const pointRows = await pointProvider.retrievePoint(pointId);
    console.log('pointRows', pointRows)
    if (pointRows.length < 1) return errResponse(baseResponse.POINT_POINTID_NOT_EXIST);

    // User_point_likes 테이블에 이미 해당 정보가 있는지 여부 확인
    const userPointLikeRows = await userProvider.retrieveUserPointLike(userId, pointId);
    console.log('userPointLikeRows', userPointLikeRows)
    if (userPointLikeRows.length < 1) return errResponse(baseResponse.LIKE_USERID_POINTID_NOT_EXIST);

    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteUserPointLike = await userDao.deleteUserPointLike(connection, userId, pointId)
        connection.release();

        return response(baseResponse.USER_POINT_LIKE_CANCEL_SUCCESS);

    } catch (err) {
        logger.error(`App - userPointLikeCancel Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

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