// const dotenv = require("dotenv");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const secret_config = require("./secret");

// dotenv.config();

aws.config.update({
  region: "ap-northeast-2",
  accessKeyId: secret_config["s3-access-key-id"],
  secretAccessKey: secret_config["s3-secret-access-key"],
  // accessKeyId: process.env.S3_ACCESS_KEY_ID,
  // secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "potshebucket",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const req_path = req.path;

      if (req_path.indexOf("users") != -1) {
        cb(null, `user/${Date.now()}_${file.originalname}`);
      } else if (req_path.indexOf("points") != -1) {
        cb(null, `point/${Date.now()}_${file.originalname}`);
      }
    },
    acl: "public-read-write",
  }),
});

module.exports = upload;
