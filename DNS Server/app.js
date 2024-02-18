const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path"); // Import the path module
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

const XLSX = require("xlsx");
const fs = require("fs");

function downloadFile() {
  console.log("Downloading file");
  // Define column headers for each sheet
  const columns = {
    MX: ["zone_name", "dns_name", "ttl", "fqdn_name"],
    SRV: [
      "zone_name",
      "dns_name",
      "ttl",
      "service",
      "protocol",
      "port",
      "priority",
      "weight",
    ],
    TXT: ["zone_name", "dns_name", "ttl", "target_value"],
    A: ["zone_name", "dns_name", "ttl", "ip_address"],
    AAAA: ["zone_name", "dns_name", "ttl", "ip_address"],
    CNAME: ["zone_name", "dns_name", "ttl", "ip_address", "cname_target_value"],
  };

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Iterate over each sheet and add data
  Object.entries(columns).forEach(([sheetName, columnHeaders]) => {
    // Create a new worksheet
    const ws = XLSX.utils.aoa_to_sheet([columnHeaders]);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, ws, sheetName);
  });

  // Convert the workbook to a binary Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  // Set the file path where the Excel file will be saved
  const filePath = path.join(__dirname, "output.xlsx");

  // Write the Excel file to the server
  fs.writeFile(filePath, Buffer.from(excelBuffer), (err) => {
    if (err) {
      console.error("Error writing Excel file:", err);
    } else {
      console.log("Excel file saved:", filePath);

      // Once the file is saved, send the response to the client
    }
  });
}
// app.get("/downloadExcel", downloadFile);
app.get(
  "/runDns",
  passport.authenticate("jwt", { session: false }),
  dnsRunner.runSsh
);

app.listen(PORT, () => {
  console.log("Server started at port ", PORT);
  downloadFile();
});
