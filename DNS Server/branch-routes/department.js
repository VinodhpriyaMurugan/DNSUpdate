const db = require("../DB_Models/index");
const Branch = db.branch;
const Department = db.dept;
const Op = db.Sequelize.Op;

const saveDepartment = (req, res) => {
  const { branchId, department } = req.body;

  Department.create({ department: department, branch_id: branchId })
    .then((createdDepartment) => {
      res.json({ message: "Department saved successfully." });
    })
    .catch((error) => {
      console.error("Error creating department:", error);
      res.status(500).json({ message: "Error creating department." });
    });
};
const getAll = (req, res) => {
  Department.findAll({
    where: {
      branch_id: req.params.id,
    },
  })
    .then((deptValue) => res.json(deptValue))
    .catch((err) => res.status(400).json(err));
};

module.exports = {
  saveDepartment,
  getAll,
};
