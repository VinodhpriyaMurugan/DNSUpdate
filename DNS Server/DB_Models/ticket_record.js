module.exports = (sequelize, Sequelize) => {
  const Ticket_id = sequelize.define("ticket_infos", {
    user_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    ticket_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    forwaded_to: {
      type: Sequelize.STRING,
    },
    ticket_status: {
      type: Sequelize.STRING,
    },
    file_name: {
      type: Sequelize.STRING,
    },
    remarks: {
      type: Sequelize.STRING,
    },
  });
  return Ticket_id;
};
