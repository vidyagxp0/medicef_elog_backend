const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const DispensingBoothForm = require("./dispensingBoothForm");

const DispensingBoothRecord = sequelize.define(
  "DispensingBoothRecord",
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
        model: DispensingBoothForm,
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
    rlaf_start_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pre_filter: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    intermediate_filter: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hepa_filter: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    batch_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    batch_size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dispensing_start_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dispensing_end_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rlaf_end_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dispensing_doneby: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dispensing_verifiedby: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type_of_cleaning: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dbc_start_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dbc_end_time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dbc_doneby: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dbc_verifiedby: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    checked_by: {
      type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.STRING,
    },
  }
);

DispensingBoothRecord.belongsTo(DispensingBoothForm, { foreignKey: 'form_id' });
DispensingBoothForm.hasMany(DispensingBoothRecord, { foreignKey: 'form_id' });

module.exports = DispensingBoothRecord;
