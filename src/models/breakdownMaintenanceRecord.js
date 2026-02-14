const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const BreakdownMaintenanceForm = require("./breakdownMaintenanceForm");

const BreakdownMaintenanceRecord = sequelize.define(
  "BreakdownMaintenanceRecord",
  {
    record_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: BreakdownMaintenanceForm,
        key: 'form_id',
      }
    },
    unique_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    material_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    autoclave_load_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cycle_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cycle_hold_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    autoclave_start_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    autoclave_end_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sterilization_hold_start_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sterilization_hold_end_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    temperature: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pressure: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    done_by: {
      type: DataTypes.STRING,
    },
    checked_by: {
      type: DataTypes.STRING,
    },
    reviewed_by: {
      type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.STRING,
    },
  }
);

BreakdownMaintenanceRecord.belongsTo(BreakdownMaintenanceForm, { foreignKey: 'form_id' });
BreakdownMaintenanceForm.hasMany(BreakdownMaintenanceRecord, { foreignKey: 'form_id' });

module.exports = BreakdownMaintenanceRecord;
