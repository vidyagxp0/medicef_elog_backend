const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const EquipmentUsageForm = require("./EquipmentUsageForm");

const EquipmentUsageAuditTrail = sequelize.define(
  "EquipmentUsageAuditTrail",
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
        model: EquipmentUsageForm,
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

EquipmentUsageAuditTrail.belongsTo(User, { foreignKey: "changed_by",as: "changedByUser", });
User.hasMany(EquipmentUsageAuditTrail, { foreignKey: "changed_by" });

EquipmentUsageAuditTrail.belongsTo(EquipmentUsageForm, {
  foreignKey: "form_id",
});
EquipmentUsageForm.hasMany(EquipmentUsageAuditTrail, {
  foreignKey: "form_id",
});

module.exports = EquipmentUsageAuditTrail;
