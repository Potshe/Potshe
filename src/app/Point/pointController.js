const pointProvider = require("../Point/pointProvider");
const pointService = require("../../app/Point/pointService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const userProvider = require("../User/userProvider");
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

/**
 * API No. 14, 22
 * API Name : 포인트 조회
 * [GET] /app/points
 * query string: keyword
 */
exports.getPoints = async function (req, res) {

    /**
     * Query String: keyword
     */
    const keyword = req.query.keyword

    if (!keyword) {
        // 포인트 전체 조회
        const getPointsResponse = await pointProvider.retrievePoint();
        return res.send(getPointsResponse);
    } else {
        // 포인트 키워드 검색 조회
        const getPointsByKeywordResponse = await pointProvider.retrievePoint(keyword);
        return res.send(getPointsByKeywordResponse);
    }
};