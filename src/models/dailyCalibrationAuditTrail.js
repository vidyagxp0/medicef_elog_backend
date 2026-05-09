const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const DailyCalibrationForm = require("./dailyCalibrationForm");

const DailyCalibrationAuditTrail = sequelize.define(
  "DailyCalibrationAuditTrail",
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
        model: DailyCalibrationForm,
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
      type: DataTypes.TEXT,
      allowNull: true,
    },
    new_value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    previous_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    new_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    declaration: {
      type: DataTypes.STRING,
      // allowNull: false,,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }
);

DailyCalibrationAuditTrail.belongsTo(User, { foreignKey: "changed_by",as: "changedByUser", });
User.hasMany(DailyCalibrationAuditTrail, { foreignKey: "changed_by" });

DailyCalibrationAuditTrail.belongsTo(DailyCalibrationForm, {
  foreignKey: "form_id",
});
DailyCalibrationForm.hasMany(DailyCalibrationAuditTrail, {
  foreignKey: "form_id",
});

module.exports = DailyCalibrationAuditTrail;
