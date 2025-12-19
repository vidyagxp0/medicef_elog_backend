const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const DispenseOfMatrialProcessForm = require("./dispensingOfMaterialForm");

const DispenseOfMatrialAuditTrail = sequelize.define(
  "DispenseOfMatrialAuditTrail",
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
        model: DispenseOfMatrialProcessForm,
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

DispenseOfMatrialAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(DispenseOfMatrialAuditTrail, { foreignKey: "changed_by" });

DispenseOfMatrialAuditTrail.belongsTo(DispenseOfMatrialProcessForm, {
  foreignKey: "form_id",
});
DispenseOfMatrialProcessForm.hasMany(DispenseOfMatrialAuditTrail, {
  foreignKey: "form_id",
});

module.exports = DispenseOfMatrialAuditTrail;
