const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const DispenseOfMaterialProcessForm = require("./dispensingOfMaterialForm");

const DispenseOfMaterialRecord = sequelize.define("DispenseOfMaterial", {
  record_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  form_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: DispenseOfMaterialProcessForm,
      key: "form_id",
    },
  },
  unique_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  on_time_auh: {
    type: DataTypes.STRING,
  },
  on_time_laf: {
    type: DataTypes.STRING,
  },
  on_time_uv_light: {
    type: DataTypes.STRING,
  },
  on_time_done_by: {
    type: DataTypes.STRING,
  },
  name_of_material: {
    type: DataTypes.STRING,
  },
  control_no: {
    type: DataTypes.STRING,
  },
  dispensed_quantity: {
    type: DataTypes.STRING,
  },
  dispensed_by_qa: {
    type: DataTypes.STRING,
  },
  dispensed_by_store: {
    type: DataTypes.STRING,
  },
  off_time_auh: {
    type: DataTypes.STRING,
  },
  off_time_laf: {
    type: DataTypes.STRING,
  },
  off_time_uv_light: {
    type: DataTypes.STRING,
  },
  uv_burning: {
    type: DataTypes.STRING,
  },
  off_time_done_by: {
    type: DataTypes.STRING,
  },
  cleaning_done_by: {
    type: DataTypes.STRING,
  },
  checked_by: {
    type: DataTypes.STRING,
  },
  weighing_balance_id: {
    type: DataTypes.STRING,
  },
  remark: {
    type: DataTypes.STRING,
  },
  reviewed_by: {
    type: DataTypes.STRING,
  },
});

DispenseOfMaterialRecord.belongsTo(DispenseOfMaterialProcessForm, {
  foreignKey: "form_id",
});
DispenseOfMaterialProcessForm.hasMany(DispenseOfMaterialRecord, {
  foreignKey: "form_id",
});

module.exports = DispenseOfMaterialRecord;
