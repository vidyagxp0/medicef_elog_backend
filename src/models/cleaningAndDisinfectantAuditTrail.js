const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const CleaningAndDisinfectantForm = require("./cleaningAndDisinfectantForm");

const CleaningAndDisinfectantAuditTrail = sequelize.define(
  "CleaningAndDisinfectantAuditTrail",
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
        model: CleaningAndDisinfectantForm,
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

CleaningAndDisinfectantAuditTrail.belongsTo(User, { foreignKey: "changed_by",as: "changedByUser", });
User.hasMany(CleaningAndDisinfectantAuditTrail, { foreignKey: "changed_by" });

CleaningAndDisinfectantAuditTrail.belongsTo(CleaningAndDisinfectantForm, {
  foreignKey: "form_id",
});
CleaningAndDisinfectantForm.hasMany(CleaningAndDisinfectantAuditTrail, {
  foreignKey: "form_id",
});

module.exports = CleaningAndDisinfectantAuditTrail;
