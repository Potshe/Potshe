const pointProvider = require("../Point/pointProvider");
const pointService = require("../../app/Point/pointService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {post} = require("axios");

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
     * Body : userId, title, content, point_type, location, creature, point_date
     */
    const { title, content, point_type, location, creature, point_date} = req.body;
    const userId = "c0997af2-96ff-11ed-931f-069e6ea2831c" //테스트할때 사용 아직 jwt 부분 없어서.. jwt 부분에 user_id 정보 남기기*/req.verifiedToken.userId;

    //빈 값 체크
    if (!title)
        return res.send(response(baseResponse.POINT_TITLE_EMPTY));
    
    if(!content)
        return res.send(response(baseResponse.POINT_CONTENT_EMPTY));
    if (!point_type)
        return res.send(response(baseResponse.POINT_TYPE_EMPTY));
    if(!location)
        return res.send(response(baseResponse.POINT_LOCATION_EMPTY));
    if (!creature)
        return res.send(response(baseResponse.POINT_CREATURE_EMPTY));
    if (!point_date)
        return res.send(response(baseResponse.POINT_DATE_EMPTY));


    const postPointResponse = await pointService.createPoint(
        userId, title, content, point_type, location, creature, point_date
    );

    console.log('req.files', req.files)

    // 사용자가 포인트 등록할 때, image 까지 업로드 했을 경우에만
    if(req.files){
        req.files.map((item) => {
            pointService.createPointImg(
                postPointResponse.result.pointId, item.location
            )
        })
    }

    return res.send(postPointResponse)
}

/**
 * API No. 17
 * API Name : 특정 포인트 수정
 * [POST] /app/points/:pointId
 * path variable : pointId
 * body : 
 */
exports.putPoint = async function (req, res) {
    const { title, content, type, location, creature, date} = req.body;
    //포인트의 userId와 jwt에 userId가 같은지 확인
    const userIdFromJwt = req.verifiedToken.userId;
    const pointId = req.params.pointId;
    console.log(pointId);
    const userIdFromPoint = pointProvider.getUserIdFromPoint(pointId);
    console.log(userIdFromPoint);
    return res.send(userIdFromPoint);
    // if (userIdFromJwt != userIdFromPoint) {
    //     res.send(errResponse());
    // } else {
    //     const editPointInfo = await pointService.editPoint(userIdFromJwt,pointId);
    // }
    const editPointInfo = await pointService.editPoint({pointId}, {title, content, type, location, creature, date});


}
