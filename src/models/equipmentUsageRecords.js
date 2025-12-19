const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const EquipmentUsageProcessForm = require("./equipmentUsageProcessForm")

const EquipmentUsageRecord = sequelize.define(
  "EquipmentUsageRecord",
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
        model: EquipmentUsageProcessForm,
        key: 'form_id',
      }
    },
    unique_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_name: {
      type: DataTypes.STRING,
    },
    batch_no: {
      type: DataTypes.STRING,
    },
    container_size: {
      type: DataTypes.STRING,
    },
    batch_size: {
      type: DataTypes.STRING,
    },
    theoretical_production: {
      type: DataTypes.STRING,
    },
    loaded_quantity: {
      type: DataTypes.STRING,
    },
    remarks: {
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
    yield: {
      type: DataTypes.STRING,
    },
  }
);

EquipmentUsageRecord.belongsTo(EquipmentUsageProcessForm, { foreignKey: 'form_id' });
EquipmentUsageProcessForm.hasMany(EquipmentUsageRecord, { foreignKey: 'form_id' });

module.exports = EquipmentUsageRecord;
