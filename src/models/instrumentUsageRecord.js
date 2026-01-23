const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const instrumentUsageForm = require("./instrumentUsageForm")

const instrumentUsageRecord = sequelize.define(
  "instrumentUsageRecord",
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
        model: instrumentUsageForm,
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
    productName: {
      type: DataTypes.STRING,
    },
    batchNo: {
      type: DataTypes.STRING,
    },
    testname: {
      type: DataTypes.STRING,
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    analyzed_by: {
      type: DataTypes.STRING,
    },
    // done_by: {
    //     type: DataTypes.STRING,
    // },
    reviewed_by: {
        type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.STRING,
    },
    // supporting_docs: {
    //   type: DataTypes.STRING,
    // },
  }
);

instrumentUsageRecord.belongsTo(instrumentUsageForm, { foreignKey: 'form_id' });
instrumentUsageForm.hasMany(instrumentUsageRecord, { foreignKey: 'form_id' });

module.exports = instrumentUsageRecord;
