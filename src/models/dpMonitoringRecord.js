const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const DPMonitoringForm = require("./dpMonitoringForm");

const DPMonitoringRecord = sequelize.define(
  "DPMonitoringRecord",
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
        model: DPMonitoringForm,
        key: 'form_id',
      }
    },
    unique_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    equipmentId: {
      type: DataTypes.STRING,
    },
    operationStatus: {
      type: DataTypes.STRING,
    },
    preFilter5to10: {
      type: DataTypes.STRING,
    },
    fineFilter7to10: {
      type: DataTypes.STRING,
    },
    fineFilter8to20: {
      type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.STRING,
    },
    done_by: {
      type: DataTypes.STRING,
    },
    reviewed_by: {
      type: DataTypes.STRING,
    },
  }
);

DPMonitoringRecord.belongsTo(DPMonitoringForm, { foreignKey: 'form_id' });
DPMonitoringForm.hasMany(DPMonitoringRecord, { foreignKey: 'form_id' });

module.exports = DPMonitoringRecord;
