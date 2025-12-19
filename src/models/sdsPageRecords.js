const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const sdsPageForm = require("./sdsPageForm");

const sdsPageRecords = sequelize.define(
  "sdsPageRecords",
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
        model: sdsPageForm,
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
sdsPageRecords.belongsTo(sdsPageForm, { foreignKey: "form_id" });
sdsPageForm.hasMany(sdsPageRecords, { foreignKey: "form_id" });

module.exports = sdsPageRecords;
