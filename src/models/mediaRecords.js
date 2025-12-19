const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const MediaRecordProcessForm = require("./mediaRrecordForm")

const MediaRecord = sequelize.define(
  "MediaRecord",
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
        model: MediaRecordProcessForm,
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
    name_medium: {
      type: DataTypes.STRING,
    },
    date_of_preparation: {
      type: DataTypes.STRING,
    },
    date_of_use: {
      type: DataTypes.STRING,
    },
    lot_no: {
      type: DataTypes.STRING,
    },
    no_of_plate_prepared: {
      type: DataTypes.STRING,
    },
    no_of_plate_used: {
      type: DataTypes.STRING,
    },
    used_for: {
      type: DataTypes.STRING,
    },
    balance_no_plate: {
      type: DataTypes.STRING,
    },
    signature: {
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

MediaRecord.belongsTo(MediaRecordProcessForm, { foreignKey: 'form_id' });
MediaRecordProcessForm.hasMany(MediaRecord, { foreignKey: 'form_id' });

module.exports = MediaRecord;
