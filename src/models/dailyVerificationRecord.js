const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const DailyVerificationForm = require("./dailyVerificationForm");

const DailyVerificationRecord = sequelize.define(
  "DailyVerificationRecord",
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
        model: DailyVerificationForm,
        key: 'form_id',
      }
    },
    unique_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zeroBalance: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    spiritLevelStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    observedWeightsW1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    observedWeightsW2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    observedWeightsW3: {
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

DailyVerificationRecord.belongsTo(DailyVerificationForm, { foreignKey: 'form_id' });
DailyVerificationForm.hasMany(DailyVerificationRecord, { foreignKey: 'form_id' });

module.exports = DailyVerificationRecord;
