const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const AreaCleaningForm = require("./areaCleaningForm")

const AreaCleaningRecord = sequelize.define(
  "AreaCleaningRecord",
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
    fromTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cleaningAgent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disinfectantUsed: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ceiling: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lightFixtures: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    walls: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    riserGrills: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    doorCloser: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    electricFixtures: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    viewingGlassPanel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    floorCoving: {
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

  }
);

AreaCleaningRecord.belongsTo(AreaCleaningForm, { foreignKey: 'form_id' });
AreaCleaningForm.hasMany(AreaCleaningRecord, { foreignKey: 'form_id' });

module.exports = AreaCleaningRecord;
