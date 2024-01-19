module.exports = (sequelize, Sequelize) => {
  const branch_info = sequelize.define("branch", {
    branch: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });
  return branch_info;
};
