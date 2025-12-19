const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const sdsPageForm = require("./sdsPageForm");

const sdsPageAuditTrail = sequelize.define(
  "sdsPageAuditTrail",
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
        model: sdsPageForm,
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

sdsPageAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(sdsPageAuditTrail, { foreignKey: "changed_by" });

sdsPageAuditTrail.belongsTo(sdsPageForm, {
  foreignKey: "form_id",
});
sdsPageForm.hasMany(sdsPageAuditTrail, {
  foreignKey: "form_id",
});

module.exports = sdsPageAuditTrail;
