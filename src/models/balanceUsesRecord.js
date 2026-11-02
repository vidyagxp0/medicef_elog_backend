const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const BalanceUsesForm = require("./balanceUsesForm");

const BalanceUsesRecord = sequelize.define("BalanceUsesRecord", {
  record_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  form_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: BalanceUsesForm,
      key: "form_id",
    },
  },
  unique_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  batchNo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  weightTaken: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  testActivity: {
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
});

BalanceUsesRecord.belongsTo(BalanceUsesForm, { foreignKey: "form_id" });
BalanceUsesForm.hasMany(BalanceUsesRecord, { foreignKey: "form_id" });

module.exports = BalanceUsesRecord;
