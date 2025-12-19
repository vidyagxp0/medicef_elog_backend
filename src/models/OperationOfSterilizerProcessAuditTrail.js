const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const OperationOfSterilizerProcessForm = require("./OperationOfSterilizerProcessForm");

const OperationOfSterilizerProcessAuditTrail = sequelize.define(
  "OperationOfSterilizerProcessAuditTrail",
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
        model: OperationOfSterilizerProcessForm,
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

OperationOfSterilizerProcessAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(OperationOfSterilizerProcessAuditTrail, { foreignKey: "changed_by" });

OperationOfSterilizerProcessAuditTrail.belongsTo(OperationOfSterilizerProcessForm, {
  foreignKey: "form_id",
});
OperationOfSterilizerProcessForm.hasMany(OperationOfSterilizerProcessAuditTrail, {
  foreignKey: "form_id",
});

module.exports = OperationOfSterilizerProcessAuditTrail;
