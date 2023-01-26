// const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const { logger } = require("./winston");

// dotenv.config();

const pool = mysql.createPool({
  host: "database-1.coiwdqamvdyz.ap-northeast-2.rds.amazonaws.com",
  user: "admin",
  port: 3306,
  password: "10131013",
  // password: process.env.DB_PASSWORD,
  database: "Potshe",
});

module.exports = {
  pool: pool,
};