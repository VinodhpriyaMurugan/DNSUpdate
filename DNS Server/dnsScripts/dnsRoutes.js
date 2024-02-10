module.exports = (app) => {
  var router = require("express").Router();
  const dnsRecord = require("./index");
  console.log("Router called ========>");
  router.post("/createDnsRecord", dnsRecord.createRecord);
  router.get("/getCreateActionDnsRecord", dnsRecord.getCreateRecord);
  router.get("/getDeleteActionDnsRecord", dnsRecord.getDeleteRecord);
  router.get("/getModifyActionDnsRecord", dnsRecord.getModifyRecord);
  router.get("/getAllRecord", dnsRecord.getAllRecord);
  router.get("/getDnsRecord/:ticket", dnsRecord.getDnsRecord);
  router.get("/getDnsRecordById/:id", dnsRecord.getDnsRecordById);
  router.post("/updateDnsRecord", dnsRecord.updateDnsRecord);
  router.get("/getDnsRecordByType/:type", dnsRecord.getDnsRecordByType);
  router.get("/getDnsRecordByDate/:date", dnsRecord.getDnsRecordByDate);
  router.get("/getTypeUnscheduled/:type", dnsRecord.getTypeUnscheduled);
  router.get("/getCount", dnsRecord.getCount);
  router.get("/getCountById/:user", dnsRecord.getCountByUser);
  router.get("/runDNSByCSV", dnsRecord.runSshCSV);
  router.get(
    "/getApprovedDnsRecordByUser/:id",
    dnsRecord.getApprovedDnsRecordByUser
  );
  app.use("/api/dns", router);
};
