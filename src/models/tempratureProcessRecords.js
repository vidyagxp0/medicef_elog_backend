const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const TempratureProcessForm = require("./tempratureProcessForm");

const TempraturePressureRecord = sequelize.define(
  "TempratureRecord",
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
        model: TempratureProcessForm,
        key: 'form_id',
      }
    },
    unique_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
    min_temprature_record: {
      type: DataTypes.STRING,
    },
    max_temprature_record: {
      type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.STRING,
    },
    done_by: {
      type: DataTypes.STRING,
    },
    humidity_record: {
      type: DataTypes.STRING,
    }, 
    done_by: {
      type: DataTypes.STRING,
    },
    checked_by: {
      type: DataTypes.STRING,
    },
    // supporting_docs: {
    //   type: DataTypes.STRING,
    // },
    reviewed_by: {
      type: DataTypes.STRING,
    },
    approved_by: {
      type: DataTypes.STRING,
    },
  }
);

TempraturePressureRecord.belongsTo(TempratureProcessForm, { foreignKey: 'form_id' });
TempratureProcessForm.hasMany(TempraturePressureRecord, { foreignKey: 'form_id' });

module.exports = TempraturePressureRecord;
