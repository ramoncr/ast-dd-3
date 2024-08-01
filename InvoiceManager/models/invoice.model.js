const clientModel = require("./client.model");
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("invoice", {
      number: {
        type: DataTypes.STRING
      },
      title: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
      },
      published: {
        type: DataTypes.BOOLEAN
      },
      publishedDate: {
        type: DataTypes.STRING
      },
      dueDate: {
        type: DataTypes.STRING
      },
      amount: {
        type: DataTypes.FLOAT
      },
    });
 };
  