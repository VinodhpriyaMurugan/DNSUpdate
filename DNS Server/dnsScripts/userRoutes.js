module.exports = (app) => {
  var router = require("express").Router();
  const reg_user = require("./index");
  console.log("Router called ========>");
  router.post("/saveUser", reg_user.saveUser);
  app.use("/api/user", router);
};
