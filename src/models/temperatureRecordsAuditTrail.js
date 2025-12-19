const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const TempratureProcessForm = require("./tempratureProcessForm");

const TemperatureRecordsAuditTrail = sequelize.define(
  "TemperatureRecordsAuditTrail",
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
        model: TempratureProcessForm,
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

TemperatureRecordsAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(TemperatureRecordsAuditTrail, { foreignKey: "changed_by" });

TemperatureRecordsAuditTrail.belongsTo(TempratureProcessForm, {
  foreignKey: "form_id",
});
TempratureProcessForm.hasMany(TemperatureRecordsAuditTrail, {
  foreignKey: "form_id",
});

module.exports = TemperatureRecordsAuditTrail;
