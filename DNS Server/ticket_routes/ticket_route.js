const multer = require("multer");
const upload = multer({ dest: "storeFiles/" });

module.exports = (app) => {
  console.log("ticket router called");
  var router = require("express").Router();
  const ticket = require("./ticket_info");

  router.post("/saveTickets", upload.single("file"), ticket.create);
  router.get("/getTickets", ticket.getTickets);
  router.get("/getUserTicket/:id", ticket.getUserTickets);
  router.get("/getTicketsByUser/:id", ticket.getTicketsByUser);
  router.get("/searchByTicket/:ticketId", ticket.searchByTickets);
  router.post("/updateTicket", ticket.updateTickets);
  router.get("/download/:fileName", ticket.downloadFile);
  app.use("/api/ticket", router);
};
