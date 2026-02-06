const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const filterCleaningForm = require("./filterCleaningForm")

const filterCleaningRecord = sequelize.define(
  "filterCleaningRecord",
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
        model: filterCleaningForm,
        key: 'form_id',
      }
    },
    unique_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foggingDueOn: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    dateOfFogging: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    foggingTimeStart: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foggingTimeStop: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foggingHoldingStart: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foggingHoldingStop: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING,
    },
    verified_by: {
      type: DataTypes.STRING,
    },
    done_by: {
        type: DataTypes.STRING,
    },
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

filterCleaningRecord.belongsTo(filterCleaningForm, { foreignKey: 'form_id' });
filterCleaningForm.hasMany(filterCleaningRecord, { foreignKey: 'form_id' });

module.exports = filterCleaningRecord;
