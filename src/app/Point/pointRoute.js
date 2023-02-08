const imageUploader = require("../../../config/imageUploader")
const point = require("./pointController");

module.exports = function(app){
    const point = require('./pointController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // GET 모든 포인트 조회 API + 키워드로 포인트 검색 API
    app.get('/app/points', point.getPoints)

    // GET 특정 포인트 조회 API
    app.get('/app/points/:pointId', point.getPointByPointId)


    // POST 포인트 생성 API
     app.post('/app/points', imageUploader.array("images", 5), point.postPoints);

    // PUT 포인트 수정
    app.put('/app/points/:pointId', imageUploader.array("images", 5), point.putPoint);

    // DELETE 포인트 삭제 API
    app.delete('/app/points/:pointId', point.deletePoint)

    // GET 위도, 경도로 포인트 조회 API
    // app.get("/app/maps/mark", point.getPointsByLatLong)

    // 20. GET 모든 Map 포인트 조회 API -> GET /points와 동일
    // app.get("/app/maps", point.getPointMaps);

    // 21. GET 특정 Map 포인트 조회 API -> GET /points/:pointId 와 동일
    // app.get("/app/maps/:pointId", point.getPointMapByPointId);

    // 22. 위도, 경도 정보 조회 -> x : POST /points 랑 결합
    // app.get("/app/map", point.getKakaoMap);

};
