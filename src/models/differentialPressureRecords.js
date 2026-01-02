const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const DifferentialPressureForm = require("./differentialPressureForm")

const DifferentialPressureRecord = sequelize.define(
  "DifferentialPressureRecord",
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
        model: DifferentialPressureForm,
        key: 'form_id',
      }
    },
    unique_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    differential_pressure: {
      type: DataTypes.STRING,
    },
    differential_pressure_max: {
      type: DataTypes.STRING,
    },
    differential_pressure_min: {
      type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.STRING,
    },
    done_by: {
      type: DataTypes.STRING,
    },
    approver_remarks: {
      type: DataTypes.STRING,
    },
    checked_by: {
      type: DataTypes.STRING,
    },
    reviewed_by: {
      type: DataTypes.STRING,
    },
    approved_by: {
      type: DataTypes.STRING,
    },
    // supporting_docs: {
    //   type: DataTypes.STRING,
    // },
  }
);

DifferentialPressureRecord.belongsTo(DifferentialPressureForm, { foreignKey: 'form_id' });
DifferentialPressureForm.hasMany(DifferentialPressureRecord, { foreignKey: 'form_id' });

module.exports = DifferentialPressureRecord;
