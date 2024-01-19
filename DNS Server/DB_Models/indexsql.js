// const Sequelize = require("sequelize");
// const PATH = require("path");
// const mysql = require("mysql2/promise");

// console.log(PATH.resolve("DB_Models", "..", ".env"));
// const ENV = process.env;
// require("dotenv").config({ path: PATH.resolve("DB_Models", "..", ".env") });
// initialize();
// // async function initialize() {
// //     const connection = await mysql.createConnection({ host: ENV.DB_HOST, port: ENV.DB_PORT, user: ENV.DB_USER, password: ENV.DB_PASS });
// //     await connection.query(`CREATE DATABASE IF NOT EXISTS \`${ENV.DB_DATABASE_NAME}\`;`);
// //  host: "127.0.0.1",
// //     port:"5432",
// //     user: "postgres",
// //     password: "postgres",
// //     database: "aircraft_fueling"
// // }
// async function initialize() {
//   const connection = await mysql.createConnection({
//     host: 3306,
//     user: "root",
//     password: "root",
//   });
//   await connection.query(`CREATE DATABASE IF NOT EXISTS DNSSERVER`);
// }
// const sequelize = new Sequelize("DNSSERVER", "root", "root", {
//   host: 3306,
//   dialect: "mysql",
//   operatorsAliases: false,

//   pool: {
//     max: 5,
//     min: 0,
//     idle: 10000,
//   },
// });
// const db = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;
// db.users = require("./users")(sequelize, Sequelize);
// db.dns_records = require("./dns_record")(sequelize, Sequelize);
// db.ticket_records = require("./ticket_record")(sequelize, Sequelize);
// db.branch = require("./branch")(sequelize, Sequelize);
// db.dept = require("./department")(sequelize, Sequelize);
// // db.register_user = require("./register_user")(sequelize, Sequelize);
// module.exports = db;
