const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const secret_config = require('./secret');

aws.config.update({
    region: 'ap-northeast-2',
    accessKeyId: secret_config["s3-access-key-id"],
    secretAccessKey: secret_config['s3-secret-access-key'],
})

const s3 = new aws.S3();
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'potshebucket',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            cb(null, `test/${Date.now()}_${file.originalname}`);
        },
        acl: 'public-read-write',
    }),
});
module.exports = upload;

