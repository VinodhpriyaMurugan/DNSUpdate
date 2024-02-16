const Sequelize = require("sequelize");
const PATH = require("path");
const dotenv = require("dotenv");
const { Client } = require("pg");

console.log(PATH.resolve("DB_Models", "..", ".env"));
const ENV = process.env;
dotenv.config({ path: PATH.resolve("DB_Models", "..", ".env") });
initialize();

async function initialize() {
  const connectionString = `postgres://postgres:Dinesh@123#@18.191.166.144:5432/postgres`;
  const client = new Client({ connectionString });

  try {
    await client.connect();
    await client.query(`CREATE DATABASE dns_server`);
  } catch (error) {
    console.error("Error creating database:", error);
  } finally {
    await client.end();
  }
}

const sequelize = new Sequelize("dns_server", "postgres", "Dinesh@123#", {
  host: "3.21.129.26",
  port: 5432,
  dialect: "postgres",
  // operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("./users")(sequelize, Sequelize);
db.dns_records = require("./dns_record")(sequelize, Sequelize);
db.ticket_records = require("./ticket_record")(sequelize, Sequelize);
db.branch = require("./branch")(sequelize, Sequelize);
db.dept = require("./department")(sequelize, Sequelize);

module.exports = db;
