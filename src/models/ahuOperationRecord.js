const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const AreaCleaningForm = require("./ahuOperationForm")

const AhuOperationRecord = sequelize.define(
  "AhuOperationRecord",
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
        model: AreaCleaningForm,
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
    equipmentId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stopTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stoppedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    done_by: {
        type: DataTypes.STRING,
    },
    checked_by: {
        type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.STRING,
    },

  }
);

AhuOperationRecord.belongsTo(AreaCleaningForm, { foreignKey: 'form_id' });
AreaCleaningForm.hasMany(AhuOperationRecord, { foreignKey: 'form_id' });

module.exports = AhuOperationRecord;
