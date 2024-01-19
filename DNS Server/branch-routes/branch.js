const db = require("../DB_Models/index");
const Branch = db.branch;
const Op = db.Sequelize.Op;

exports.save = (req, res) => {
  console.log("request==========>", req.body);

  for (const element of req.body) {
    console.log("request==========>", element);
    const branch = element;
    console.log("Find existing branch================>");
    // Check if branch with the same name already exists
    Branch.findOne({
      where: {
        branch: element,
      },
    })
      .then((existingBranch) => {
        if (existingBranch) {
          console.log("Branch already exists:", existingBranch);
          // Branch already exists, do not create a new record
          res.status(400).json("Branch already exists:");
          console.log("Branch already exists:", existingBranch);
        } else {
          console.log("Branch creation:", branch);
          // Branch does not exist, create a new record

          const newBranch = {
            branch: branch,
          };
          Branch.create(newBranch)
            .then((createdBranch) => {
              console.log("Record created successfully:", createdBranch);
            })
            .catch((err) => {
              console.error("Error creating record:", err);
              res.status(400).json(err);
            });
        }
      })
      .catch((err) => {
        console.error("Error checking branch existence:", err);
        res.status(500).json(err);
      });
  }

  res.json("Branches saved successfully");
};
exports.getAll = (req, res) => {
  Branch.findAll()
    .then((branchValue) => res.json(branchValue))
    .catch((err) => res.status(400).json(err));
};
