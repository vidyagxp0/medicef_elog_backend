const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const voCalibForm = require("./voCalibForm");

const voCalibAuditTrail = sequelize.define(
  "voCalibAuditTrail",
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
        model: voCalibForm,
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
      allowNull: false,
    },
    new_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    declaration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }
);

voCalibAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(voCalibAuditTrail, { foreignKey: "changed_by" });

voCalibAuditTrail.belongsTo(voCalibForm, {
  foreignKey: "form_id",
});
voCalibForm.hasMany(voCalibAuditTrail, {
  foreignKey: "form_id",
});

module.exports = voCalibAuditTrail;
