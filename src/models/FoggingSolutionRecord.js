const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const foggingSolutionForm = require("./FoggingSolutionForm")

const foggingSolutionRecord = sequelize.define(
  "foggingSolutionRecord",
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
        model: foggingSolutionForm,
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
    virosilTaken: {
      type: DataTypes.STRING,
    },
    waterTaken: {
      type: DataTypes.STRING,
    },
    totalSolution: {
      type: DataTypes.STRING,
    },
    preparedBy: {
      type: DataTypes.STRING,
    },
    time: {
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

foggingSolutionRecord.belongsTo(foggingSolutionForm, { foreignKey: 'form_id' });
foggingSolutionForm.hasMany(foggingSolutionRecord, { foreignKey: 'form_id' });

module.exports = foggingSolutionRecord;
