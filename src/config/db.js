// src/config/db.js
const { Sequelize } = require("sequelize");
const config = require("./config.json");

const sequelize = new Sequelize(
  config.development.dbName,
  config.development.username,
  config.development.password,
  {
    dialect: config.development.dialect,
    host: config.development.host,
    logging: false,
    pool: {
      max: 30,
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
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

module.exports = { sequelize, connectToDB };