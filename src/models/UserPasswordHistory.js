const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const UserPasswordHistory = sequelize.define("UserPasswordHistory", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = UserPasswordHistory;