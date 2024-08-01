const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("plugin", {
        name: {
            type: DataTypes.STRING
        },
        storageLocation: {
            type: DataTypes.STRING
        },
        version: {
            type: DataTypes.STRING
        },
        isActive: {
            type: DataTypes.BOOLEAN
        },
    });
};
