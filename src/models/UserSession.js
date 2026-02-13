const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");

const UserSession = sequelize.define("UserSession", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  login_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  logout_time: {
    type: DataTypes.DATE,
  },
  duration: {
    type: DataTypes.INTEGER,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

UserSession.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(UserSession, {
  foreignKey: "user_id",
  as: "sessions",
});

module.exports = UserSession;
