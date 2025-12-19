const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const AnalyticalBalanceProcessForm = require("./AnalyticalBalanceForm")

const AnalyticalBalance = sequelize.define(
  "AnalyticalBalance",
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
        model: AnalyticalBalanceProcessForm,
        key: "form_id",
      },
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reg_no: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    instrument_no: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    instrument_name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
     sample_name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    factorValue: { 
     type: DataTypes.STRING, 
     allowNull: false 
   },
    weight_taken: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    uom: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    uomOther: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    done_by: { 
      type: DataTypes.STRING
     },
    supporting_docs: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    checked_by: {
       type: DataTypes.STRING
       },
    reviewed_by: {
      type: DataTypes.STRING,
    },
    remarks: { 
      type: DataTypes.STRING 
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

AnalyticalBalance.belongsTo(AnalyticalBalanceProcessForm, { foreignKey: 'form_id' });
AnalyticalBalanceProcessForm.hasMany(AnalyticalBalance, { foreignKey: 'form_id' });

module.exports = AnalyticalBalance;
