module.exports = (sequelize, Sequelize) => {
  const department = sequelize.define("department", {
    branch_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    department: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return department;
};
