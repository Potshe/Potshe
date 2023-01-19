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

exports.creatPoint = async function (title, content, type, location, creature, date) {
    try{
        const point = new Point({
            title,
            content,
            type,
            location,
            creature,
            date,
            writer : response.locals.user_id

        })

    } catch(err) {
        logger.error(`App - createPoint Service error\n: ${error.messge}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}