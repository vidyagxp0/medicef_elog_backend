const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const MediaRecordProcessForm = require("./mediaRrecordForm");

const MediaRecordAuditTrail = sequelize.define(
  "MediaRecordAuditTrail",
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
        model: MediaRecordProcessForm,
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
        allowNull: false
    },
    new_status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    declaration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }
);

MediaRecordAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(MediaRecordAuditTrail, { foreignKey: "changed_by" });

MediaRecordAuditTrail.belongsTo(MediaRecordProcessForm, {
  foreignKey: "form_id",
});
MediaRecordProcessForm.hasMany(MediaRecordAuditTrail, {
  foreignKey: "form_id",
});

module.exports = MediaRecordAuditTrail;
