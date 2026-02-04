const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const areaFoggingForm = require("./areaFoggingForm");

const areaFoggingAuditTrail = sequelize.define(
  "areaFoggingAuditTrail",
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
        model: areaFoggingForm,
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

areaFoggingAuditTrail.belongsTo(User, { foreignKey: "changed_by",as: "changedByUser", });
User.hasMany(areaFoggingAuditTrail, { foreignKey: "changed_by" });

areaFoggingAuditTrail.belongsTo(areaFoggingForm, {
  foreignKey: "form_id",
});
areaFoggingForm.hasMany(areaFoggingAuditTrail, {
  foreignKey: "form_id",
});

module.exports = areaFoggingAuditTrail;
