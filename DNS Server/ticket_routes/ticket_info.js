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
const exceljs = require("exceljs");

// Define a route to handle Excel file download

// exports.uploadFile = async (req, res) => {
//   try {
//     // if (!req.file) {
//     //   return res.status(400).send("No file uploaded.");
//     // }
//     const newTicket = {
//       user_id: 1,
//       ticket_id: req.body.ticket,
//       ticket_status: "Pending",
//       file_name: "fileName",
//     };

//     // Create ticket
//     const ticket = await Tickets.create(newTicket);
//     console.log("Ticket created:", ticket);
//     const workbook = new exceljs.Workbook();
//     await workbook.xlsx.readFile(req.file.path);

//     // Assuming the first worksheet contains the data
//     const worksheet = workbook.getWorksheet(1);
//     // Iterate through rows and update the database
//     await Promise.all(
//       worksheet.eachRow(async (row, rowNumber) => {
//         if (rowNumber > 1) {
//           // Skip header row
//           const rowData = row.values;
//           // Update database using Sequelize
//           await dnsRecords.create({
//             // Update the fields with the data from the Excel file
//             dns_type: rowData[1],
//             action: rowData[2],
//             dns_record_type: rowData[3],
//             dns_name: rowData[5],
//             ip_address: rowData[6],
//             fqdn_name: rowData[7],
//             service: rowData[8],
//             protocol: rowData[9],
//             domain: rowData[10],
//             weight: rowData[11],
//             port_no: rowData[12],
//             priority: rowData[13],
//             domain_name: rowData[14],
//             zone_name: rowData[15],
//             c_name: rowData[16],
//             service_tier: rowData[17],
//             testing_mode: rowData[18],
//             description: rowData[19],
//             ticket_id: req.body.ticket,
//             user: req.body.user,
//           });
//         }
//       })
//     );

//     return res.status(200).send("Excel file uploaded and data updated.");
//   } catch (error) {
//     console.error("Error processing file:", error);
//     return res.status(500).send("Internal server error.");
//   }
// };

exports.uploadFile = async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    console.log("ticket value", req.body);
    // Define the new ticket object
    const newTicket = {
      user_id: req.body.user_id,
      ticket_id: req.body.ticket,
      ticket_status: "Pending",
      file_name: req.file.originalname,
      remarks: "",
    };

    // Create the ticket
    const ticket = await Tickets.create(newTicket);
    console.log("Ticket created:", ticket);

    // Read data from the uploaded Excel file
    const workbook = XLSX.readFile(req.file.path);
    const sheetNames = workbook.SheetNames;

    // Iterate through each sheet and update the database
    sheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(worksheet);
      console.log("ROW data", sheetData);
      // Iterate through each row of the sheet data and update the database
      sheetData.forEach(async (rowData) => {
        await dnsRecords.create({
          dns_type: "create",
          action: rowData.action || "",
          dns_record_type: sheetName,
          dns_name: rowData.dns_name || "",
          ip_address: rowData.ip_address || "",
          fqdn_name: rowData.fqdn_name || "",
          service: rowData.service || "",
          protocol: rowData.protocol || "",
          domain: rowData.domain || "",
          weight: rowData.weight || "",
          port_no: rowData.port_no || "",
          priority: rowData.priority || "",
          domain_name: rowData.domain_name || "",
          zone_name: rowData.zone_name || "",
          c_name: rowData.c_name || "",
          service_tier: rowData.service_tier || "",
          testing_mode: rowData.testing_mode || "",
          description: rowData.description || "",
          ticket_id: req.body.ticket || "",
          user: req.body.user || "",
          remarks: "",
        });
      });
    });

    // Remove the uploaded file
    fs.unlinkSync(req.file.path);

    return res.status(200).send("Excel file uploaded and data updated.");
  } catch (error) {
    console.error("Error processing file:", error);
    return res.status(500).send("Internal server error.");
  }
};

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
  console.log("creating ticket");
  try {
    const newTicket = {
      user_id: userId,
      ticket_id: ticketId,
      ticket_status: status,
      file_name: fileName,
    };

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
            console.log("ticket details=============>", ticketDetails);
            // Combine the ticket and ticket details data
            const result = tickets.map((ticket) => {
              const matchingTicketDetails = ticketDetails.find(
                (detail) => detail.ticket_id === ticket.ticket_id
              );
              console.log("Matching  tickets", matchingTicketDetails);
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

const XLSX = require("xlsx");

exports.downloadExcel = (req, res) => {
  console.log(
    "path------------------------",
    path.join(__dirname, "output.xlsx")
  );
  const filePath = path.join(__dirname, "output.xlsx"); // Path to the Excel file on the server

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  // Set response headers
  res.set({
    "Content-Type": "application/octet-stream",
    "Content-Disposition": 'attachment; filename="output.xlsx"', // Specify the file name
  });

  // Send the file as a response
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
};
exports.downloadFile = (req, res) => {
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

  // Set response headers
  res.set({
    "Content-Type": "application/octet-stream",
    "Content-Disposition": 'attachment; filename="output.xlsx"', // Set the file name here
    "Content-Length": excelBuffer.length,
  });

  // Send the Excel file content as response
  res.send(Buffer.from(excelBuffer));
};

// exports.downloadFile = (req, res) => {
//   console.log(req.params);

//   const { fileName } = req.params;
//   const customerDirectory = path.join(basePath);
//   const filePath = path.join(customerDirectory, fileName);

//   fs.stat(filePath, (err, stats) => {
//     if (err) {
//       console.error(`Error getting file stats for ${fileName}:`, err);
//       return res.status(500).json({ error: "Error getting file stats" });
//     }

//     res.set({
//       "Content-Type": "application/octet-stream",
//       "Content-Disposition": `attachment; filename="${encodeURIComponent(
//         fileName
//       )}"`,
//       "Content-Length": stats.size,
//     });

//     const fileStream = fs.createReadStream(filePath);
//     fileStream.pipe(res);
//   });
// };
