const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const DailyVerificationForm = require("./dailyVerificationForm");

const DailyVerificationAuditTrail = sequelize.define(
  "DailyVerificationAuditTrail",
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
        model: DailyVerificationForm,
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

DailyVerificationAuditTrail.belongsTo(User, { foreignKey: "changed_by",as: "changedByUser", });
User.hasMany(DailyVerificationAuditTrail, { foreignKey: "changed_by" });

DailyVerificationAuditTrail.belongsTo(DailyVerificationForm, {
  foreignKey: "form_id",
});
DailyVerificationForm.hasMany(DailyVerificationAuditTrail, {
  foreignKey: "form_id",
});

module.exports = DailyVerificationAuditTrail;
