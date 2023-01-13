const pointProvider = require("../Point/pointProvider");
const pointService = require("../../app/Point/pointService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
/**
 * API No. 1
 * API Name : 포인트 이미지 파일 업로드
 * [POST] /app/points/fileUpload
 * path variable : pointId
 * body : file
 */
exports.postImage = async function (req, res) {

    const { pointId } = req.params;
    const filePath = req.file.location;

    // 빈 값 체크
    if (!pointId)
        return res.send(response(baseResponse.POINT_POINTID_EMPTY));

    if (!filePath)
        return res.send(response(baseResponse.POINT_FILE_EMPTY));

    const fileUploadResponse = await pointService.createImage(
        pointId, filePath
    );

    return res.send(fileUploadResponse);
};