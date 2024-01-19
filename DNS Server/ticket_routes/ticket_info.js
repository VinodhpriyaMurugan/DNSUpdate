const db = require("../DB_Models/index");
const path = require("path");
const fs = require("fs");
const { Sequelize } = require("sequelize");
const Tickets = db.ticket_records;
const Users = db.users;
const dnsRecords = db.dns_records;
const Op = db.Sequelize.Op;
const basePath = "TicketFiles";
require("dotenv").config({ path: "./../.env" });
exports.create = async (req, res) => {
  console.log("inside create==========>");
  try {
    if (req.file) {
      console.log("inside try==========>");
      const existingTickets = await Tickets.findAll({
        where: {
          file_name: req.file.originalname,
        },
      });

      if (existingTickets.length > 0) {
        throw new Error("File already exists");
      }
    }

    console.log("Request from frontend ===========>");

    const { file, body } = req;

    let fileName = "";
    console.log("valueeee==================>", file);
    if (file) {
      fileName = file.originalname;

      //create directory for ticket files
      const ticketDirectory = path.join(basePath);
      console.log("basePath & customer", basePath);

      if (!fs.existsSync(ticketDirectory)) {
        fs.mkdirSync(ticketDirectory, { recursive: true });
      }

      // Move the File to the destination Path
      fs.rename(
        file.path,
        path.join(ticketDirectory, file.originalname),
        (error) => {
          if (error) {
            console.error("Error moving file:", error);
            return res.status(500).json({ error: "Error moving file" });
          }
          console.log("File moved successfully");

          // Create ticket after file is moved
          console.log("to create ticket");
          createTicket(body.id, body.ticket, fileName, res);
        }
      );
    } else {
      // If file doesn't exist, only create the ticket
      createTicket(body.id, body.ticket, body.ticket_status, fileName, res);
    }
  } catch (error) {
    // console.error("Error creating ticket:", error);
    res.status(400).json({ error: error.message });
  }
};

async function createTicket(userId, ticketId, status, fileName, res) {
  console.log("create ticket======>");
  try {
    const newTicket = {
      user_id: userId,
      ticket_id: ticketId,
      ticket_status: status,
      file_name: fileName,
    };
    console.log();
    // Create ticket
    const ticket = await Tickets.create(newTicket);
    console.log("Ticket created:", ticket);
    res.json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(400).json({ error: error.message });
  }
}

exports.createnew = async (req, res) => {
  try {
    if (req.file) {
      const existingTickets = await Tickets.findAll({
        where: {
          file_name: req.file.originalname,
        },
      });

      if (existingTickets.length > 0) {
        throw new Error("File already exists");
      }
    }

    console.log("Request from frontend ===========>", req);

    const { file, body } = req;
    let fileName = ""; // Initialize fileName variable

    if (req.file && req.file.originalname) {
      fileName = req.file.originalname;
    }
    console.log("Request body==========>", fileName);
    const newTicket = {
      user_id: req.body.id,
      ticket_id: req.body.ticket,
      file_name: fileName,
    };

    //create directory for ticket files
    const ticketDirectory = path.join(basePath);
    console.log("basePath ", basePath);

    if (!fs.existsSync(ticketDirectory)) {
      fs.mkdirSync(ticketDirectory, { recursive: true });
    }

    // Move the File to the destination Path
    fs.rename(
      file.path,
      path.join(ticketDirectory, file.originalname),
      (error) => {
        if (error) {
          console.error("Error moving file:", error);
          return res.status(500).json({ error: "Error moving file" });
        }
        console.log("File moved successfully");
        res.json({ message: "File uploaded successfully" });
      }
    );

    // Create ticket
    const ticket = await Tickets.create(newTicket);
    console.log("Ticket created:", ticket);
    res.json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(400).json({ error: error.message });
  }
};

// exports.getTickets =(req,res)=>{
//     Tickets.findAll()
//     .then((users) => {
//         Users.findByPk(users.id).then(data => {
//             if (data) {
//                 console.log("Data values ============>",data)
//                 // res.send(data)
//             } else {
//                 res.status(404).send({
//                     message: `User not found with id=${id}.`
//                 });
//             }
//         }).catch(err => {
//             res.status(500).send({
//                 message: "Error retrieving User with id=" + id
//             });
//         });
//         res.send(users)
//       console.log("Users ===========>",users); // Array of user objects
//     })
//     .catch(err => {
//         res.status(500).send({
//             message: "Error retrieving Users"
//         });
//     });
// }

exports.getTickets = (req, res) => {
  Tickets.findAll()
    .then((tickets) => {
      const userIds = tickets.map((ticket) => ticket.user_id);
      const forwardedToIds = tickets.map((ticket) => ticket.forwaded_to);
      const uniqueUserIds = [...new Set([...userIds, ...forwardedToIds])];

      Users.findAll({
        where: {
          id: uniqueUserIds,
        },
      })
        .then((users) => {
          const userMap = users.reduce((map, user) => {
            map[user.id] = user;
            return map;
          }, {});

          const ticketData = tickets.map((ticket) => {
            return {
              ticket_id: ticket.ticket_id,
              forwaded_to: ticket.forwaded_to,
              status: ticket.ticket_status,
              fileName: ticket.file_name,
              user: userMap[ticket.user_id],
              forwarded_user: userMap[ticket.forwaded_to],
            };
          });

          console.log("Ticket data:", ticketData);
          res.json(ticketData);
        })
        .catch((err) => {
          console.error("Error retrieving user details:", err);
          res.status(500).send({
            message: "Error retrieving user details",
          });
        });
    })
    .catch((err) => {
      console.error("Error retrieving tickets:", err);
      res.status(500).send({
        message: "Error retrieving tickets",
      });
    });
};

exports.updateTickets = async (req, res) => {
  try {
    const affectedRows = await Tickets.update(
      { forwaded_to: req.body.forwarded_to, ticket_status: req.body.status }, // Update values
      { where: { ticket_id: req.body.ticketValue } } // Condition for the update (e.g., based on ID)
    );

    console.log(`Updated ${affectedRows} row(s).`);
  } catch (error) {
    console.error("Error occurred during update:", error);
  }
};
exports.getTicketsByUser = (req, res) => {
  console.log("params ==========>", req.params.id); // Assuming you have the path variable value

  Tickets.findAll({
    where: {
      forwaded_to: req.params.id,
    },
  })
    .then((result) => {
      if (result) {
        // Data found, do something with it
        console.log("result==========>", result);
        res.json(result);
      } else {
        // No data found
        res.status(404).json({ message: "Data not found." });
      }
    })
    .catch((error) => {
      // Error occurred during the query
      console.error("Error retrieving data:", error);
      res.status(500).json({ message: "Error retrieving data." });
    });
};

exports.getUserTickets = (req, res) => {
  console.log("params ==========>", req.params.id); // Assuming you have the path variable value

  Tickets.findAll({
    where: {
      user_id: req.params.id,
      ticket_status: "Pending",
    },
  })

    .then((tickets) => {
      if (tickets.length > 0) {
        const ticketIds = tickets.map((ticket) => ticket.ticket_id);

        // Fetch ticket details from the other table using the ticket IDs
        dnsRecords
          .findAll({
            where: {
              ticket_id: ticketIds,
            },
          })
          .then((ticketDetails) => {
            // Combine the ticket and ticket details data
            const result = tickets.map((ticket) => {
              const matchingTicketDetails = ticketDetails.find(
                (detail) => detail.ticket_id === ticket.ticket_id
              );
              return {
                ticket,
                details: matchingTicketDetails || null,
              };
            });

            console.log("result==========>", result);
            res.json(result);
          })
          .catch((error) => {
            console.error("Error retrieving ticket details:", error);
            res
              .status(500)
              .json({ message: "Error retrieving ticket details." });
          });
      } else {
        res.status(404).json({ message: "Data not found." });
      }
    })
    .catch((error) => {
      console.error("Error retrieving tickets:", error);
      res.status(500).json({ message: "Error retrieving tickets." });
    });
};

exports.searchByTickets = (req, res) => {
  const { ticketId } = req.params;
  console.log("Request params ====>>>>>>>>>>>>>>>", req.params);
  Tickets.findAll({
    where: {
      ticket_id: {
        [Sequelize.Op.like]: `%${ticketId}%`,
      },
    },
  })
    .then((ticket) => {
      if (!ticket) {
        // Handle case when no ticket is found
        res.json(null);
      } else {
        dnsRecords
          .findAll({
            where: {
              ticket_id: {
                [Sequelize.Op.like]: `%${ticketId}%`,
              },
            },
          })
          .then((ticketDetails) => {
            const result = {
              ticket,
              details: ticketDetails || null,
            };

            console.log("result of ticket search==========>", result);
            res.json(result);
          })
          .catch((error) => {
            console.error("Error retrieving ticket details:", error);
            res
              .status(500)
              .json({ message: "Error retrieving ticket details." });
          });
      }
    })
    .catch((error) => {
      console.error("Error retrieving ticket:", error);
      res.status(500).json({ message: "Error retrieving ticket." });
    });
};

exports.downloadFile = (req, res) => {
  console.log(req.params);

  const { fileName } = req.params;
  const customerDirectory = path.join(basePath);
  const filePath = path.join(customerDirectory, fileName);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error(`Error getting file stats for ${fileName}:`, err);
      return res.status(500).json({ error: "Error getting file stats" });
    }

    res.set({
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(
        fileName
      )}"`,
      "Content-Length": stats.size,
    });

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
};
