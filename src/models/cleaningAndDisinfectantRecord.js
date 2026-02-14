const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const CleaningAndDisinfectantForm = require("./cleaningAndDisinfectantForm");

const CleaningAndDisinfectantRecord = sequelize.define(
  "CleaningAndDisinfectantRecord",
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
        model: CleaningAndDisinfectantForm,
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
    name_of_solution: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    concentration_of_solution: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    volume_of_disinfectant: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    volume_of_purified : {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prepared_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_volume_of_solution: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department_area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prepared_date : {
      type: DataTypes.STRING,
      allowNull: false,
    },
    remaining_qty_destroyed: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destroyed_by: {
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
  }
);

CleaningAndDisinfectantRecord.belongsTo(CleaningAndDisinfectantForm, { foreignKey: 'form_id' });
CleaningAndDisinfectantForm.hasMany(CleaningAndDisinfectantRecord, { foreignKey: 'form_id' });

module.exports = CleaningAndDisinfectantRecord;
