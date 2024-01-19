const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
require("dotenv").config();
const PORT = process.env.PORT || 3100;
// const mysql = require("mysql");
const passport = require("passport");
const CORS = require("cors");
require("./passport_config")(passport);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(CORS());

// const DB_HOST = process.env.DB_HOST || 'localhost';
// const DB_PORT = process.env.DB_PORT || 3306
// const DB_USER = process.env.DB_USER
// const DB_PASS = process.env.DB_PASS

const db = require("./DB_Models/index");
db.sequelize.sync();
// const conn = mysql.createConnection({
//     host: DB_HOST,
//     port: DB_PORT,
//     user: DB_USER,
//     password: DB_PASS
// })
try {
  // conn.connect((err) => {
  //     if (err) throw err
  //     console.log("Database connected..!")
  //     conn.query("CREATE DATABASE dns_update", function (err, result) {
  //         if (err) {
  //             if (err.code !== "ER_DB_CREATE_EXISTS") {
  //                 throw err
  //             }
  //             else {
  //                 console.log("Database already exist")
  //             }
  //         } else {
  //             console.log("Database created");
  //         }
  //     });
  // })
} catch (error) {
  console.log(error);
}
console.log("routing===============>");
const dnsRunner = require("./dnsScripts");
require("./dnsScripts/dnsRoutes")(app);
require("./Users/userRoutes")(app);
require("./ticket_routes/ticket_route")(app);
require("./branch-routes/branch_route")(app);
require("./branch-routes/department_route")(app);

app.get(
  "/runDns",
  passport.authenticate("jwt", { session: false }),
  dnsRunner.runSsh
);

app.listen(PORT, () => {
  console.log("Server started at port ", PORT);
});
