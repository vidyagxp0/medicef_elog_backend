const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const EquipmentUsageForm = require("./EquipmentUsageForm")

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
        model: EquipmentUsageForm,
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
    productName: {
      type: DataTypes.STRING,
    },
    batchNo: {
      type: DataTypes.STRING,
    },
    batchSize: {
      type: DataTypes.STRING,
    },
    activityType: {
      type: DataTypes.STRING,
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.STRING,
    },
    done_by: {
      type: DataTypes.STRING,
    },
    reviewed_by: {
      type: DataTypes.STRING,
    },
    verified_by: {
      type: DataTypes.STRING,
    },
    // supporting_docs: {
    //   type: DataTypes.STRING,
    // },
  }
);

EquipmentUsageRecord.belongsTo(EquipmentUsageForm, { foreignKey: 'form_id' });
EquipmentUsageForm.hasMany(EquipmentUsageRecord, { foreignKey: 'form_id' });

module.exports = EquipmentUsageRecord;
