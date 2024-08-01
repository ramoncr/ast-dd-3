const invoiceModel = require("./invoice.model");
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("client", {
      number: {
        type: DataTypes.STRING
      },
      title: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      }
    });
  };
  