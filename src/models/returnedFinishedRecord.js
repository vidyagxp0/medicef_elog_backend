const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const ReturnedFinishedForm = require("./returnedFinishedForm");

const ReturnedFinishedRecord = sequelize.define(
  "ReturnedFinishedRecord",
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
        model: ReturnedFinishedForm,
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
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    batch_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mfg_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exp_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    no_of_package: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    returned_quantity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    party_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoice_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reason_for_return: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    received_by: {
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

ReturnedFinishedRecord.belongsTo(ReturnedFinishedForm, { foreignKey: 'form_id' });
ReturnedFinishedForm.hasMany(ReturnedFinishedRecord, { foreignKey: 'form_id' });

module.exports = ReturnedFinishedRecord;
