module.exports = (app) => {
  console.log("department router==========>");
  let router = require("express").Router();
  const deptRouter = require("./department");
  console.log("deptRouter = router called");
  router.post("/saveDepartment", deptRouter.saveDepartment);
  router.get("/getAll/:id", deptRouter.getAll);
  app.use("/api/component/dept", router);
};
