const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const uvWhiteLightForm = require("./uvWhiteLightForm");

const uvWhiteLightAuditTrail = sequelize.define(
  "uvWhiteLightAuditTrail",
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
        model: uvWhiteLightForm,
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

uvWhiteLightAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(uvWhiteLightAuditTrail, { foreignKey: "changed_by" });

uvWhiteLightAuditTrail.belongsTo(uvWhiteLightForm, {
  foreignKey: "form_id",
});
uvWhiteLightForm.hasMany(uvWhiteLightAuditTrail, {
  foreignKey: "form_id",
});

module.exports = uvWhiteLightAuditTrail;
