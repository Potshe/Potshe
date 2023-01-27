const pointProvider = require("./pointProvider");
const pointService = require("./pointService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {post} = require("axios");
const userProvider = require("../User/userProvider");
/**
 * API No. 14, 22
 * API Name : 모든 포인트 조회 + 키워드 기반 포인트 조회
 * [GET] /app/points
 */
exports.getPoints = async function (req, res) {

    /**
     * query string : keyword
     */

    const { keyword } = req.query

    if(!keyword){
        const pointsResult = await pointProvider.retrievePoint();
        return res.send(response(baseResponse.SUCCESS, pointsResult));
    } else {
        const pointsResultWithKeyword = await pointProvider.retrievePoint(keyword);
        return res.send(response(baseResponse.SUCCESS, pointsResultWithKeyword));
    }

}

/**
 * API No. 15
 * API Name : 특정 포인트 조회
 * [GET] /app/points/:pointId
 */
exports.getPointByPointId = async function (req, res) {

    /**
     * path variable: pointId
     */
    const { pointId } = req.params

    if(!pointId || pointId === ':pointId'){

        return res.send(errResponse(baseResponse.POINT_POINTID_EMPTY));
    }
    const pointResultById = await pointProvider.retrievePointById(pointId);
    console.log('pointResultById')
    console.log(pointResultById)

    // 만약, 존재하지 않는 포인트면?
    if(pointResultById.length === 0){
        return res.send(errResponse(baseResponse.POINT_POINTID_NOT_EXIST));
    }

    return res.send(response(baseResponse.SUCCESS, pointResultById));


}


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

/**
 * API No. 18
 * API Name : 특정 포인트 삭제
 * [DELETE] /app/points/:pointId
 * path variable : pointId
 */
exports.deletePoint = async function (req, res) {
    
    const { pointId } = req.params;

    // pointId 입력안했을때
    if(!pointId || pointId === ':pointId'){
        return res.send(errResponse(baseResponse.POINT_POINTID_EMPTY));
    }

    const deletePointResponse = pointService.deletePoint(pointId);
    return res.send(deletePointResponse);

}

