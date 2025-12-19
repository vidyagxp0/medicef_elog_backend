const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const AnalyticalBalanceForm = require("./AnalyticalBalanceForm")

const AnalyticalBalanceAuditTrail = sequelize.define(
  "AnalyticalBalanceAuditTrail",
  {
    auditTrail_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AnalyticalBalanceForm,
        key: "form_id",
      },
    },
    changed_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
    },
    field_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    previous_value: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    new_value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    previous_status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    new_status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    declaration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }
);

AnalyticalBalanceAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(AnalyticalBalanceAuditTrail, { foreignKey: "changed_by" });

AnalyticalBalanceAuditTrail.belongsTo(AnalyticalBalanceForm, {
  foreignKey: "form_id",
});
AnalyticalBalanceForm.hasMany(AnalyticalBalanceAuditTrail, {
  foreignKey: "form_id",
});

module.exports = AnalyticalBalanceAuditTrail;
