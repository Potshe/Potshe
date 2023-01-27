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



/**
 * API No. 16
 * API Name : 포인트 등록
 * [POST] /app/points
 * body : userId
    title
    content
    type
    location
    creature
    date
 */
exports.postPoints = async function (req, res) {
    /**
     * Body : userId, title, content, type, location, creature, date
     */
    const { title, content, type, location, creature, date} = req.body;
    const userId = "c0997af2-96ff-11ed-931f-069e6ea2831c" //테스트할때 사용 아직 jwt 부분 없어서.. jwt 부분에 user_id 정보 남기기*/req.verifiedToken.userId;



    //빈 값 체크
    if (!title)
        return res.send(response(baseResponse.POINT_TITLE_EMPTY));
    
    if(!content)
        return res.send(response(baseResponse.POINT_CONTENT_EMPTY));
    if (!type)
        return res.send(response(baseResponse.POINT_TYPE_EMPTY));
    if(!location)
        return res.send(response(baseResponse.POINT_LOCATION_EMPTY));
    if (!creature)
        return res.send(response(baseResponse.POINT_CREATURE_EMPTY));
    // if (!date)
    //     return res.send(response(baseResponse.POINT_DATE_EMPTY));

    const postResponse = await pointService.createPoint(
        userId, title, content, type, location, creature, date
    );
    return res.send(postResponse);
}
/**
 * API No. 17
 * API Name : 특정 포인트 수정
 * [POST] /app/points/:pointId
 * path variable : pointId
 * body : 
 */
exports.putPoint = async function (req, res) {
    const { title, content, point_type, location, creature, point_date} = req.body;

    //포인트의 userId와 req에 userId가 같은지 확인
    //const userIdFromUserInfo = req.user.id;
    const pointId = req.params.pointId;
    console.log(pointId);
    const userIdFromPoint = pointProvider.getUserIdFromPoint(pointId);
    console.log(userIdFromPoint);

    // if (userIdFromUserInfo != userIdFromPoint) {  //로그인한 유저와 포인트의 유저가 같지 않을 때 에러
    //     res.send(errResponse());
    // } else {
    //     const editPointInfo = await pointService.editPoint(pointId, title, content, point_type, location, creature, point_date);
    //           return res.send(editPointInfo)
    // }
    const editPointInfo = await pointService.editPoint(pointId, title, content, point_type, location, creature, point_date);//나중에 지우고 주석해제
    return res.send(editPointInfo);

}
