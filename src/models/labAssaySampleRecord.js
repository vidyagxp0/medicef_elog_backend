const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const LabAssaySampleForm = require("./labAssaySampleForm")

const LabAssaySampleRecord = sequelize.define(
  "LabAssaySampleRecord",
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
        model: LabAssaySampleForm,
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
    },
    mfg_date: {
      type: DataTypes.STRING,
    },
    exp_date: {
      type: DataTypes.STRING,
    },
    ar_no: {
      type: DataTypes.STRING,
    },
    analyzed_by: {
      type: DataTypes.STRING,
    },
    average_cfu: {
      type: DataTypes.STRING,
    },
    no_of_spores: {
      type: DataTypes.STRING,
    },
    percentage_of_spores: {
      type: DataTypes.STRING,
    },
    date_of_observation: {
      type: DataTypes.STRING,
    },
    observed_by: {
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

LabAssaySampleRecord.belongsTo(LabAssaySampleForm, { foreignKey: 'form_id' });
LabAssaySampleForm.hasMany(LabAssaySampleRecord, { foreignKey: 'form_id' });

module.exports = LabAssaySampleRecord;
