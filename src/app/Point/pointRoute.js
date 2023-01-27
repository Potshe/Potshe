const imageUploader = require("../../../config/imageUploader")
const point = require("./pointController");

module.exports = function(app){
    const point = require('./pointController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 14. 모든 포인트 조회 API + 22. 키워드로 포인트 검색 API
    app.get('/app/points', point.getPoints)

    // 15. 특정 포인트 조회 API
    app.get('/app/points/:pointId', point.getPointByPointId)



    // 16. 포인트 생성 API
     app.post('/app/points', imageUploader.array("images", 5), point.postPoints);

    // 17. 포인트 수정
    app.put('/app/points/:pointId', point.putPoint);

    // 18. 포인트 삭제 API
    app.delete('/app/points/:pointId', point.deletePoint)




};
