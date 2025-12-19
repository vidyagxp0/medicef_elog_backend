const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const UvVisForm = require("./OpAndCalUvVisForm");

const UvVisRecords = sequelize.define(
  "UvVisRecords",
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
        model: UvVisForm,
        key: "form_id",
      },
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sample_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reg_no: {
      type: DataTypes.STRING,
    },
    // method_used: {
    //   type: DataTypes.STRING,
    // },
    // parameter_or_activity: {
    //   type: DataTypes.STRING,
    // },
    // column_no:{
    //   type: DataTypes.STRING,
    // },
    start_time: {
      type: DataTypes.STRING,
    },
    end_time: {
      type: DataTypes.STRING,
    },
    // no_of_injections: {
    //   type: DataTypes.STRING,
    // },
    done_by: {
      type: DataTypes.STRING,
    },
    supporting_docs: {
      type: DataTypes.STRING,
      allowNull: true,
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
    remarksOther: {
      type: DataTypes.STRING,
    },
    remarksType: {
      type: DataTypes.STRING,
    },
    remarksSubType: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING
    }
  }
);

// Associations
UvVisRecords.belongsTo(UvVisForm, { foreignKey: "form_id" });
UvVisForm.hasMany(UvVisRecords, { foreignKey: "form_id" });

module.exports = UvVisRecords;
