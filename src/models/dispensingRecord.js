const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const DispensingForm = require("./dispensingForm");

const DispensingRecord = sequelize.define(
  "DispensingRecord",
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
        model: DispensingForm,
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
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    batch_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    batch_size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dispensingStartTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dispensingEndTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dispensingDoneBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dispensingCheckedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cleaningStartTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     cleaningEndTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     cleaningDoneBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     cleaningVerifiedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // checked_by: {
    //   type: DataTypes.STRING,
    // },
    // reviewed_by: {
    //   type: DataTypes.STRING,
    // },
    remarks: {
      type: DataTypes.STRING,
    },
  }
);

DispensingRecord.belongsTo(DispensingForm, { foreignKey: 'form_id' });
DispensingForm.hasMany(DispensingRecord, { foreignKey: 'form_id' });

module.exports = DispensingRecord;
