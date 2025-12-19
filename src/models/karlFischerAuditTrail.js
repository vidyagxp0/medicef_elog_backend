const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const karlFischerForm = require("./karlFischerForm");

const karlFischerAuditTrail = sequelize.define(
  "karlFischerAuditTrail",
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
        model: karlFischerForm,
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

karlFischerAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(karlFischerAuditTrail, { foreignKey: "changed_by" });

karlFischerAuditTrail.belongsTo(karlFischerForm, {
  foreignKey: "form_id",
});
karlFischerForm.hasMany(karlFischerAuditTrail, {
  foreignKey: "form_id",
});

module.exports = karlFischerAuditTrail;
