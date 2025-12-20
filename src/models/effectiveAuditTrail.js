const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const User = require("./users");
const DifferentialPressureForm = require("./differentialPressureForm");
const DifferentialPressureRecord = require("./differentialPressureRecords");

const EffectiveAuditTrail = sequelize.define(
  "EffectiveAuditTrail",
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
        model: DifferentialPressureForm,
        key: "form_id",
      },
    },
    record_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: DifferentialPressureRecord,
        key: "record_id",
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

EffectiveAuditTrail.belongsTo(User, { foreignKey: "changed_by" });
User.hasMany(EffectiveAuditTrail, { foreignKey: "changed_by" });

EffectiveAuditTrail.belongsTo(DifferentialPressureForm, { foreignKey: "form_id",});
DifferentialPressureForm.hasMany(EffectiveAuditTrail, { foreignKey: "form_id",});

EffectiveAuditTrail.belongsTo(DifferentialPressureRecord, { foreignKey: "record_id",});
DifferentialPressureRecord.hasMany(EffectiveAuditTrail, { foreignKey: "record_id",});

module.exports = EffectiveAuditTrail;

















































































