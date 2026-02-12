const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const ColdChamberForm = require("./coldChamberForm");

const ColdChamberRecord = sequelize.define(
  "ColdChamberRecord",
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
        model: ColdChamberForm,
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
    time_from: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time_to: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    outer_surface: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    inner_door_surface: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    walls: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ceiling: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    light_fixtures: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    floor: {
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
    remarks: {
      type: DataTypes.STRING,
    },
  }
);

ColdChamberRecord.belongsTo(ColdChamberForm, { foreignKey: 'form_id' });
ColdChamberForm.hasMany(ColdChamberRecord, { foreignKey: 'form_id' });

module.exports = ColdChamberRecord;
