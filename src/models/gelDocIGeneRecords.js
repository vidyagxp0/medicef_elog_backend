const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const gelDocIGeneForm = require("./gelDocIGeneForm");

const gelDocIGeneRecords = sequelize.define(
  "gelDocIGeneRecords",
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
        model: gelDocIGeneForm,
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
    time: {
      type: DataTypes.STRING,
    },
    // start_time: {
    //   type: DataTypes.STRING,
    // },
    // end_time: {
    //   type: DataTypes.STRING,
    // },
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
gelDocIGeneRecords.belongsTo(gelDocIGeneForm, { foreignKey: "form_id" });
gelDocIGeneForm.hasMany(gelDocIGeneRecords, { foreignKey: "form_id" });

module.exports = gelDocIGeneRecords;
