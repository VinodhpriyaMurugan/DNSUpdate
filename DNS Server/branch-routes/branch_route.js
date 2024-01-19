module.exports = (app) => {
  let router = require("express").Router();
  const branchRouter = require("./branch");
  console.log("branch = router called");
  router.post("/saveBranch", branchRouter.save);
  router.get("/getAll", branchRouter.getAll);

  app.use("/api/component", router);
};
