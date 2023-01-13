const upload = require("../../../config/imageUploader")

module.exports = function(app){
    const point = require('./pointController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. point img upload API - test
    app.post('/app/points/fileUpload', upload.single('image'), (req, res) => {
        return res.send(req.file.location)
    });

    // 1. point img upload API
    // app.post('/app/points/fileUpload/:pointId', imageUploader.single('image'), point.postImage);



};
