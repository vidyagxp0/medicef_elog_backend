const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const hplcForm = require("./hplcForm");

const hplcAuditTrail = sequelize.define(
  "hplcAuditTrail",
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
        model: hplcForm,
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

hplcAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(hplcAuditTrail, { foreignKey: "changed_by" });

hplcAuditTrail.belongsTo(hplcForm, {
  foreignKey: "form_id",
});
hplcForm.hasMany(hplcAuditTrail, {
  foreignKey: "form_id",
});

module.exports = hplcAuditTrail;
