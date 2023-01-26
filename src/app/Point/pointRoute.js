const imageUploader = require("../../../config/imageUploader")

module.exports = function(app){
    const point = require('./pointController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. point img upload API - test
    // app.post('/app/points/fileUpload', upload.single('image'), (req, res) => {
    //     return res.send(req.file.location)
    // });

    // 1. point img upload API
    // app.post('/app/points/fileUpload/:pointId', imageUploader.single('image'), point.postImage);

    // 14. 모든 포인트 조회 API + 22. 키워드로 포인트 검색 API
    app.get('/app/points', point.getPoints)

    // 16. point post API
     app.post('/app/points', imageUploader.array("images", 5), point.postPoints);

    // 17. 포인트 수정
    app.put('/app/points/:pointId', point.putPoint);

    // 23. 포인트 이미지 파일 S3 업로드




};
