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
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    equipmentID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preFilterID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preFilterQty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    returnRiserFilterID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    returnRiserFilterQty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fineFilterID: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    fineFilterQty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cleaningStartTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cleaningEndTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    physicalCondition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dryingStartTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dryingStopTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fineCleaningStart: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fineCleaningEnd: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    finePhysicalCondition: {
      type: DataTypes.STRING,
      allowNull: false,
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
