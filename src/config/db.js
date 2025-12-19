const { Sequelize } = require("sequelize");
const config = require("../config/config.json");

const sequelize = new Sequelize(
  config.development.dbName,
  config.development.username,
  config.development.password,
  {
    dialect: config.development.dialect,
    host: config.development.host,
    logging: false,
  }
);

const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Successfully connected to DB");
  } catch (e) {
    console.log(e);
  }
};

sequelize
  .sync({ alter: false })
  .then(() => {
    console.log("Tables synchronized");
  })
  .catch((error) => {
    console.error("Error synchronizing tables:", error);
  });

module.exports = { sequelize, connectToDB };
