module.exports = (sequelize, Sequelize) => {
  const DNS_Record = sequelize.define("dns_records", {
    dns_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    action: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    dns_record_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    dns_name: {
      type: Sequelize.STRING,
    },
    ip_address: {
      type: Sequelize.STRING,
    },
    fqdn_name: {
      type: Sequelize.STRING,
    },
    service: {
      type: Sequelize.STRING,
    },
    protocol: {
      type: Sequelize.STRING,
    },
    domain: {
      type: Sequelize.STRING,
    },
    weight: {
      type: Sequelize.STRING,
    },
    port_no: {
      type: Sequelize.STRING,
    },
    priority: {
      type: Sequelize.STRING,
    },
    domain_name: {
      type: Sequelize.STRING,
    },
    zone_name: {
      type: Sequelize.STRING,
    },
    c_name: {
      type: Sequelize.STRING,
    },
    service_tier: {
      type: Sequelize.STRING,
    },
    testing_mode: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    ticket_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    scheduled_on: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
    },
  });
  return DNS_Record;
};
