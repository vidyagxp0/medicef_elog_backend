const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const AllEffectiveChange = sequelize.define(
  "AllEffectiveChange",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    productName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },

    batchNo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },

    weightTaken: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
    },

    testActivity: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },

    changedProductName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },

    changedBatchNo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null,
    },

    changedWeightTaken: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null,
    },

    changedTestActivity: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: "AllEffectiveChange",
    timestamps: false,
  }
);

module.exports = AllEffectiveChange;