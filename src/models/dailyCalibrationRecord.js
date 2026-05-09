const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const DailyCalibrationForm = require("./dailyCalibrationForm");

const DailyCalibrationRecord = sequelize.define(
  "DailyCalibrationRecord",
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
        model: DailyCalibrationForm,
        key: 'form_id',
      }
    },
    unique_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    theoreticalWeight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    standardWt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    observedWt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    observedDeviation: {
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
     verified_by: {
      type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.STRING,
    },
  }
);

DailyCalibrationRecord.belongsTo(DailyCalibrationForm, { foreignKey: 'form_id' });
DailyCalibrationForm.hasMany(DailyCalibrationRecord, { foreignKey: 'form_id' });

module.exports = DailyCalibrationRecord;
