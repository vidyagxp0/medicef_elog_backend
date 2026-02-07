const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const mediaConsumptionForm = require("./mediaConsumptionForm");

const mediaConsumptionAuditTrail = sequelize.define(
  "mediaConsumptionAuditTrail",
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
        model: mediaConsumptionForm,
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

mediaConsumptionAuditTrail.belongsTo(User, { foreignKey: "changed_by",as: "changedByUser", });
User.hasMany(mediaConsumptionAuditTrail, { foreignKey: "changed_by" });

mediaConsumptionAuditTrail.belongsTo(mediaConsumptionForm, {
  foreignKey: "form_id",
});
mediaConsumptionForm.hasMany(mediaConsumptionAuditTrail, {
  foreignKey: "form_id",
});

module.exports = mediaConsumptionAuditTrail;
