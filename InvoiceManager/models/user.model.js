const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("user", {
      username: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING
      },
      salt: {
        type: DataTypes.STRING
      },
      strategy: {
        type: DataTypes.STRING,
      },
      locked: {
        type: DataTypes.BOOLEAN
      },
      isAdmin : {
        type: DataTypes.BOOLEAN
      }
    });

  };
  