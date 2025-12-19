const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const UvVisForm = require("./OpAndCalUvVisForm");

const UvVisAuditTrail = sequelize.define(
  "UvVisAuditTrail",
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
        model: UvVisForm,
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

UvVisAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(UvVisAuditTrail, { foreignKey: "changed_by" });

UvVisAuditTrail.belongsTo(UvVisForm, {
  foreignKey: "form_id",
});
UvVisForm.hasMany(UvVisAuditTrail, {
  foreignKey: "form_id",
});

module.exports = UvVisAuditTrail;
