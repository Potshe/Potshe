const express = require("express");
const compression = require("compression");
const methodOverride = require("method-override");
const morgan = require("morgan");
const secret = require("./secret");
const passport = require("passport");
var cors = require("cors");
var session = require("express-session");

module.exports = function () {
  const app = express();

  // 요청과 응답에 대한 정보를 콘솔에 기록
  app.use(morgan("dev"));

  app.use(compression());

  app.use(express.json());

  app.use(express.urlencoded({ extended: true }));

  app.use(methodOverride());
  
  app.use(session({
    secret: secret.key,
    resave: false,
    saveUninitialized: false
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  

  app.use(cors());

  /* App (Android, iOS) */
  // TODO: 도메인을 추가할 경우 이곳에 Route를 추가하세요.

  // Back-End Routes
  require("../src/app/User/userRoute")(app);
  require("../src/app/Point/pointRoute")(app);
  // require('../src/app/Board/boardRoute')(app);

  return app;
};
