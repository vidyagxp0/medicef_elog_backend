const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const DisinfectantStockForm = require("./disinfectantStockForm")

const DisinfectantStockRecords = sequelize.define(
  "DisinfectantStockRecords",
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
        model: DisinfectantStockForm,
        key: 'form_id',
      }
    },
    unique_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_receiving: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity_received: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    batch_no: {
      type: DataTypes.STRING,
    },
    mfg_date: {
      type: DataTypes.STRING,
    },
    exp_date: {
      type: DataTypes.STRING,
    },
    received_by: {
      type: DataTypes.STRING,
    },
    issue_quantity: {
      type: DataTypes.STRING,
    },
    balance_quantity: {
      type: DataTypes.STRING,
    },
    issued_by: {
      type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.STRING,
    },
    checked_by: {
      type: DataTypes.STRING,
    },
    reviewed_by: {
      type: DataTypes.STRING,
    },
    
  }
);

DisinfectantStockRecords.belongsTo(DisinfectantStockForm, { foreignKey: 'form_id' });
DisinfectantStockForm.hasMany(DisinfectantStockRecords, { foreignKey: 'form_id' });

module.exports = DisinfectantStockRecords;
