const fs = require("fs");
const path = require("path");
const { NodeSSH } = require("node-ssh");
const DNS_Runner = {};
const db = require("../DB_Models/index");
const DNSRecord = db.dns_records;
const Ticket = db.ticket_records;
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { Op } = require("sequelize");
const today = new Date();
const ssh = new NodeSSH();
const password = "R@gU^677&";
DNS_Runner.runSsh = (req, res) => {
  ssh
    .connect({
      host: "183.83.187.19",
      port: "4567",
      username: "ragu",
      password,
      tryKeyboard: true,
    })
    .then(() => {
      // Add-DnsServerResourceRecordA -Name demo -IPv4Address 192.168.0.201 -ZoneName dcloud.com
      //nslookup -type=A google.com

      ssh
        .execCommand("PowerShell -File C:/temp/ADD_DNS_Records.ps1")
        .then(function (result) {
          console.log("STDOUT: " + result.stdout);
          console.log("STDERR: " + result.stderr);
          if (result.stdout) res.send("STDOUT: " + result.stdout.toString());
          else res.send("STDERR: " + result.stderr.toString());

          // if (ssh.isConnected()) {
          //     console.log("Closing connection");
          //     ssh.dispose()
          // }
        });
    });
};

DNS_Runner.runSshCSV = (req, res) => {
  const csvFolder = "csv_files"; // Specify the folder name where CSV files will be stored
  const csvFileName = `${req.query.id}.csv`; // Generate CSV file name based on the query id
  const csvFilePath = `${csvFolder}/${csvFileName}`; // Construct the full path for the CSV file

  console.log(req.query.id);

  // Ensure the folder exists
  if (!fs.existsSync(csvFolder)) {
    fs.mkdirSync(csvFolder);
  }

  DNSRecord.findAll({
    where: {
      ticket_id: req.query.id,
    },
  }).then((response) => {
    console.log("Run SSH for ", response);
    const csvWriter = createCsvWriter({
      path: csvFilePath, // Use the full path for the CSV file
      header: [
        { id: "Zone", title: "Zone" },
        { id: "Name", title: "Name" },
        { id: "RRType", title: "RRType" },
        { id: "RRData", title: "RRData" },
      ],
    });
    let Data = [];
    response.forEach((response) => {
      let rrData = "";
      if (response.dns_record_type === "A") {
        rrData = response.ip_address;
      } else if (response.dns_record_type === "CNAME") {
        rrData = response.c_name;
      }
      let record = {
        Zone: response.zone_name,
        Name: response.dns_name,
        RRType: response.dns_record_type,
        RRData: rrData,
      };
      Data.push(record);
    });

    console.log("Data==========>", Data);
    csvWriter
      .writeRecords(Data) // returns a promise
      .then(() => {
        ssh
          .connect({
            host: "183.83.187.19",
            port: "4567",
            username: "ragu",
            password,
            tryKeyboard: true,
          })
          .then(() => {
            //     // Add-DnsServerResourceRecordA -Name demo -IPv4Address 192.168.0.201 -ZoneName dcloud.com
            //     //nslookup -type=A google.com
            ssh
              .putFile(`${csvFile}.csv`, `C:/${csvFile}.csv`)
              .then(function (result) {
                console.log("File Moved");
                ssh
                  .execCommand("PowerShell -File C:/temp/ADD_DNS_Records.ps1")
                  .then(function (result) {
                    console.log("STDOUT: " + result.stdout);
                    console.log("STDERR: " + result.stderr);
                    if (result.stdout)
                      res.send("STDOUT: " + result.stdout.toString());
                    else res.send("STDERR: " + result.stderr.toString());
                  });
              });
          })
          .catch((error) => {
            console.error("Error occurred:", error);
            res.status(500).json("Script running failed");
          });
      });
  });
};

// DNS_Runner.createRecord = (req, res) => {
//   console.log("request==========>", req.body);
//   for (var i = 0; i < req.body.length; i++) {
//     console.log("req.body[i]", req.body[i]);
//     DNSRecord.create(req.body[i])
//       .then(() => res.json("Records created successfully"))
//       .catch((err) => res.status(400).json(err));
//   }
//   // const createPromises = req.body.map((record) => DNSRecord.create(record));

//   // Promise.all(createPromises);
// };

DNS_Runner.createRecord = async (req, res) => {
  const recordsToInsert = req.body;

  // Map the array of records to an array of promises returned by DNSRecord.create
  const createPromises = recordsToInsert.map((record) =>
    DNSRecord.create(record)
  );

  // Await all the promises to resolve before proceeding
  const insertedRecords = await Promise.all(createPromises);

  // insertedRecords will now be an array containing the inserted DNS records
  console.log("insertedRecords", insertedRecords);

  // Respond with a success message
  res.json("Records created successfully");
};

DNS_Runner.getCreateRecord = async (req, res) => {
  DNSRecord.findAll({
    where: {
      action: "create",
    },
  })
    .then((dnsData) => {
      // console.log("DNS DATA LENGTH=====>", dnsData.length);
      res.json(dnsData);
    })
    .catch((err) => res.status(400).json(err));
};
DNS_Runner.getDeleteRecord = (req, res) => {
  DNSRecord.findAll({
    where: {
      action: "delete",
    },
  })
    .then((dnsData) => res.json(dnsData))
    .catch((err) => res.status(400).json(err));
};
DNS_Runner.getModifyRecord = (req, res) => {
  DNSRecord.findAll({
    where: {
      action: "modify",
    },
  })
    .then((dnsData) => res.json(dnsData))
    .catch((err) => res.status(400).json(err));
};

DNS_Runner.getDnsRecord = async (req, res) => {
  console.log("req.params.ticket", req.params.ticket);
  DNSRecord.findAll({
    where: {
      ticket_id: req.params.ticket,
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

DNS_Runner.getDnsRecordByType = async (req, res) => {
  console.log("inside get dns by type");
  if (req.params.type === "ALL TYPES") {
    console.log("inside all type");
    DNSRecord.findAll({
      where: {
        status: "Approved",
        scheduled_on: {
          [Op.lte]: today,
        },
      },
    })
      .then((result) => {
        if (result) {
          // Data found, do something with it
          console.log("result==========>", result);
          res.json(result);
        } else {
          res.status(404).json({ message: "Data not found." });
        }
      })
      .catch((error) => {
        console.error("Error retrieving data:", error);
        res.status(500).json({ message: "Error retrieving data." });
      });
  } else {
    DNSRecord.findAll({
      where: {
        dns_record_type: req.params.type,
        status: "Approved",
        scheduled_on: {
          [Op.lte]: today,
        },
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
        console.error("Error retrieving data:", error);
        res.status(500).json({ message: "Error retrieving data." });
      });
  }
};
DNS_Runner.getDnsRecordByDate = async (req, res) => {
  DNSRecord.findAll({
    where: {
      status: "Approved",
      scheduled_on: {
        [Op.eq]: req.params.date,
      },
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
      console.error("Error retrieving data:", error);
      res.status(500).json({ message: "Error retrieving data." });
    });
};

// getTypeUnscheduled
DNS_Runner.getTypeUnscheduled = async (req, res) => {
  console.log("inside get dns by date");
  DNSRecord.findAll({
    where: {
      dns_record_type: req.params.type,
      status: "Approved",
      scheduled_on: {
        [Op.gt]: today,
      },
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
      console.error("Error retrieving data:", error);
      res.status(500).json({ message: "Error retrieving data." });
    });
};

DNS_Runner.getDnsRecordById = async (req, res) => {
  console.log("inside get dns by type", req.params.id);
  DNSRecord.findAll({
    where: {
      id: req.params.id,
    },
  })
    .then((result) => {
      if (result) {
        console.log("result==========>", result);
        res.json(result);
      } else {
        res.status(404).json({ message: "Data not found." });
      }
    })
    .catch((error) => {
      console.error("Error retrieving data:", error);
      res.status(500).json({ message: "Error retrieving data." });
    });
};
DNS_Runner.getDnsRecordByUser = async (req, res) => {
  console.log("inside get dns by type", req.params.id);
  DNSRecord.findAll({
    where: {
      ticket_id: req.params.id,
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
      console.error("Error retrieving data:", error);
      res.status(500).json({ message: "Error retrieving data." });
    });
};
DNS_Runner.getApprovedDnsRecordByUser = async (req, res) => {
  console.log("insidegetApprovedDnsRecordByUser");
  DNSRecord.findAll({
    where: {
      user: req.params.id,
      status: "Approved",
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
      console.error("Error retrieving data:", error);
      res.status(500).json({ message: "Error retrieving data." });
    });
};
DNS_Runner.updateDnsRecord = async (req, res) => {
  try {
    let dateVal = null;
    console.log("inside get dns by type");
    let affectedRows = [];
    if (req.body.date) {
      console.log("if condition");
      dateVal = req.body.date; // Corrected assignment
      affectedRows = await DNSRecord.update(
        { status: req.body.status, scheduled_on: dateVal },
        { where: { id: req.body.id } }
      );
    } else {
      console.log("else condition");
      affectedRows = await DNSRecord.update(
        { status: req.body.status },
        { where: { id: req.body.id } }
      );
    }
    console.log(`Updated ${affectedRows} row(s).`);
    res.status(200).json("Updated Record");
  } catch (error) {
    console.error("Error occurred during update:", error);
    res.status(500).json("Updating failed !!!!");
  }
};
DNS_Runner.updateTicketStatus = async (req, res) => {
  try {
    // Update DNSRecord
    const affectedRowsDNSRecord = await DNSRecord.update(
      { status: req.body.status, remarks: req.body.remarks || "" },
      { where: { ticket_id: req.body.id } }
    );

    // Update ticket_record
    const affectedRowsTicketRecord = await Ticket.update(
      { ticket_status: req.body.status, remarks: req.body.remarks || "" },
      { where: { ticket_id: req.body.id } }
    );

    console.log("Affected rows in DNSRecord:", affectedRowsDNSRecord);
    console.log("Affected rows in ticket_record:", affectedRowsTicketRecord);

    res.status(200).json("Updated ticket Status");
  } catch (error) {
    console.error("Error updating records:", error);
    res.status(500).json(error);
  }
};
DNS_Runner.updateDnsRecordByUser = async (req, res) => {
  try {
    const dataArray = req.body;

    for (const data of dataArray) {
      console.log("data=====>>>>>", data);
      const {
        id,
        dns_type,
        action,
        dns_record_type,
        date,
        dns_name,
        ip_address,
        fqdn_name,
        service,
        protocol,
        domain,
        weight,
        ttl,
        target_value,
        port_no,
        priority,
        domain_name,
        zone_name,
        c_name,
        service_tier,
        testing_mode,
        description,
        ticket_id,
        user,
        scheduled_on,
        status,
      } = data;

      await DNSRecord.update(
        {
          dns_type,
          action,
          dns_record_type,
          date,
          dns_name,
          ip_address,
          fqdn_name,
          service,
          protocol,
          domain,
          weight,
          ttl,
          target_value,
          port_no,
          priority,
          domain_name,
          zone_name,
          c_name,
          service_tier,
          testing_mode,
          description,
          ticket_id,
          user,
          scheduled_on,
          status: "Pending",
        },
        { where: { id } }
      );
    }

    // Respond with success message
    res.status(200).json({ message: "Records updated successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error updating records:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
DNS_Runner.getAllRecord = async (req, res) => {
  const allRecord = await DNSRecord.findAll();
  res.json(allRecord);
  console.log("all Record data==>", allRecord);
};
DNS_Runner.getCount = async (req, res) => {
  console.log("getcount method");
  const create = await db.ticket_records.count({
    where: {
      ticket_status: "Approved",
    },
  });

  const scheduled = await db.ticket_records.count({
    where: {
      ticket_status: "Reject",
      // scheduled_on: {
      //   [Op.lte]: today,
      // },
    },
  });
  const modify = await db.ticket_records.count({
    where: {
      ticket_status: "Pending", // Replace with your desired WHERE condition
    },
  });
  const totalCount = await db.ticket_records.count();
  const countValues = {
    approved: create,
    pending: modify,
    total: totalCount,
    scheduled: scheduled,
    // totalCount: totalCount,
  };
  console.log("============>", countValues);
  res.json(countValues);
};

DNS_Runner.getCountByUser = async (req, res) => {
  const create = await db.ticket_records.count({
    where: {
      user_id: req.params.user,
    },
  });
  const modify = await db.ticket_records.count({
    where: {
      user_id: req.params.user,
      ticket_status: "Approved", // Replace with your desired WHERE condition
    },
  });
  const deleteTicket = await db.ticket_records.count({
    where: {
      user_id: req.params.user,
      ticket_status: "Pending", // Replace with your desired WHERE condition
    },
  });
  const totalCount = await DNSRecord.count();
  const countValues = {
    total: create,
    approved: modify,
    pending: deleteTicket,
  };
  console.log("============>", countValues);
  res.json(countValues);
};

module.exports = DNS_Runner;
