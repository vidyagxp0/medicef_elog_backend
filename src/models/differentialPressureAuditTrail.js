const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const DifferentialPressureForm = require("./differentialPressureForm");

const DifferentialPressureAuditTrail = sequelize.define(
  "DifferentialPressureAuditTrail",
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
        model: DifferentialPressureForm,
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

DifferentialPressureAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(DifferentialPressureAuditTrail, { foreignKey: "changed_by" });

DifferentialPressureAuditTrail.belongsTo(DifferentialPressureForm, {
  foreignKey: "form_id",
});
DifferentialPressureForm.hasMany(DifferentialPressureAuditTrail, {
  foreignKey: "form_id",
});

module.exports = DifferentialPressureAuditTrail;
