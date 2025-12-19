const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const OpAndCalParameterForm = require("./OpAndCalParameterForm")

const OpAndCalParameterAuditTrail = sequelize.define(
  "OpAndCalParameterAuditTrail",
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
        model: OpAndCalParameterForm,
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

OpAndCalParameterAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(OpAndCalParameterAuditTrail, { foreignKey: "changed_by" });

OpAndCalParameterAuditTrail.belongsTo(OpAndCalParameterForm, {
  foreignKey: "form_id",
});
OpAndCalParameterForm.hasMany(OpAndCalParameterAuditTrail, {
  foreignKey: "form_id",
});

module.exports = OpAndCalParameterAuditTrail;
