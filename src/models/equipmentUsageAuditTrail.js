const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const EquipmentUsageProcessForm = require("./equipmentUsageProcessForm");

const EquipmentUsageProcessAuditTrail = sequelize.define(
  "EquipmentUsageProcessAuditTrail",
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
        model: EquipmentUsageProcessForm,
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

EquipmentUsageProcessAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(EquipmentUsageProcessAuditTrail, { foreignKey: "changed_by" });

EquipmentUsageProcessAuditTrail.belongsTo(EquipmentUsageProcessForm, {
  foreignKey: "form_id",
});
EquipmentUsageProcessForm.hasMany(EquipmentUsageProcessAuditTrail, {
  foreignKey: "form_id",
});

module.exports = EquipmentUsageProcessAuditTrail;
