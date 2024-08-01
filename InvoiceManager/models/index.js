const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize").Sequelize;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db.sqlite'
  });

  const db = {};
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

  db.invoices = require('./invoice.model')(sequelize);
  db.clients = require('./client.model')(sequelize);
  db.users = require('./user.model')(sequelize);
  db.plugins = require('./plugin.model')(sequelize);

  db.invoices.belongsTo(db.clients);
  db.clients.hasMany(db.invoices);

  module.exports = db;