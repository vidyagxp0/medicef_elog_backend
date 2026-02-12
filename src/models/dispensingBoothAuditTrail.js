const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const DispensingBoothForm = require("./dispensingBoothForm");

const DispensingBoothAuditTrail = sequelize.define(
  "DispensingBoothAuditTrail",
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
        model: DispensingBoothForm,
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

DispensingBoothAuditTrail.belongsTo(User, { foreignKey: "changed_by",as: "changedByUser", });
User.hasMany(DispensingBoothAuditTrail, { foreignKey: "changed_by" });

DispensingBoothAuditTrail.belongsTo(DispensingBoothForm, {
  foreignKey: "form_id",
});
DispensingBoothForm.hasMany(DispensingBoothAuditTrail, {
  foreignKey: "form_id",
});

module.exports = DispensingBoothAuditTrail;
