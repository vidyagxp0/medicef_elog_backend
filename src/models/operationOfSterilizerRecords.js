const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const OperationOfSterilizerRecordProcessForm = require("./OperationOfSterilizerProcessForm")

const OperationOfSterilizerRecord = sequelize.define(
  "OperationOfSterilizerRecord",
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
        model: OperationOfSterilizerRecordProcessForm,
        key: "form_id",
      },
    },
    unique_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    air_pressure: {
      type: DataTypes.STRING,
    },
    steam_pressure: {
      type: DataTypes.STRING,
    },
    printer_ok: {
      type: DataTypes.STRING,
    },
    product_name: {
      type: DataTypes.STRING,
    },
    container_size: {
      type: DataTypes.STRING,
    },
    loaded_quantity: {
      type: DataTypes.STRING,
    },
    batch_no_lot_no: {
      type: DataTypes.STRING,
    },
    loading_time: {
      type: DataTypes.STRING,
    },
    d_well_period_start: {
      type: DataTypes.STRING,
    },
    d_well_period_end: {
      type: DataTypes.STRING,
    },
    unloading_time: {
      type: DataTypes.STRING,
    },
    cleaning_time_start: {
      type: DataTypes.STRING,
    },
    cleaning_time_end: {
      type: DataTypes.STRING,
    },
    cleaning_done_by: {
      type: DataTypes.STRING,
    },
    checked_by: {
      type: DataTypes.STRING,
    },
    reviewed_by: {
      type: DataTypes.STRING,
    },
  }
);

OperationOfSterilizerRecord.belongsTo(OperationOfSterilizerRecordProcessForm, { foreignKey: 'form_id' });
OperationOfSterilizerRecordProcessForm.hasMany(OperationOfSterilizerRecord, { foreignKey: 'form_id' });

module.exports = OperationOfSterilizerRecord;
