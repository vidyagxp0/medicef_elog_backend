const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const karlFischerForm = require("./karlFischerForm");

const karlFischerRecord = sequelize.define(
  "karlFischerRecord",
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
        model: karlFischerForm,
        key: 'form_id',
      },
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instrument_name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    instrument_no: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    lot_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sample_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    factorValue: { 
     type: DataTypes.STRING, 
     allowNull: false 
   },
    factor_percent_water: {
      type: DataTypes.STRING,
    },
    done_by: {
      type: DataTypes.STRING,
    },
    supporting_docs: {
      type: DataTypes.STRING,
      allowNull: true,
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
    remarksOther: {
      type: DataTypes.STRING,
    },
    remarksType: {
      type: DataTypes.STRING,
    },
    remarksSubType: {
      type: DataTypes.STRING,
    },
     performance: {
      type: DataTypes.STRING,
    },
    performanceStartTime: {
      type: DataTypes.STRING,
    },
    performanceEndTime: {
      type: DataTypes.STRING,
    },
    performanceEndDate: {
      type: DataTypes.STRING,
    },
    performanceEndDateTime: {
      type: DataTypes.STRING,
    },
    performanceRemark: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING
    }
  }
);

// Associations
karlFischerRecord.belongsTo(karlFischerForm, { foreignKey: 'form_id' });
karlFischerForm.hasMany(karlFischerRecord, { foreignKey: 'form_id' });

module.exports = karlFischerRecord;
