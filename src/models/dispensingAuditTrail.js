const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const DispensingForm = require("./dispensingForm");

const DispensingAuditTrail = sequelize.define(
  "DispensingAuditTrail",
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
        model: DispensingForm,
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

DispensingAuditTrail.belongsTo(User, { foreignKey: "changed_by",as: "changedByUser", });
User.hasMany(DispensingAuditTrail, { foreignKey: "changed_by" });

DispensingAuditTrail.belongsTo(DispensingForm, {
  foreignKey: "form_id",
});
DispensingForm.hasMany(DispensingAuditTrail, {
  foreignKey: "form_id",
});

module.exports = DispensingAuditTrail;
