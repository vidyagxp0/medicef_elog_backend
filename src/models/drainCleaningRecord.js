const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const DrainCleaningForm = require("./drainCleaningForm");

const DrainCleaningRecord = sequelize.define(
  "DrainCleaningRecord",
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
        model: DrainCleaningForm,
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
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cleaning_agent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disinfectant_used: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sanitizer_used: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    drain_id: {
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

DrainCleaningRecord.belongsTo(DrainCleaningForm, { foreignKey: 'form_id' });
DrainCleaningForm.hasMany(DrainCleaningRecord, { foreignKey: 'form_id' });

module.exports = DrainCleaningRecord;
