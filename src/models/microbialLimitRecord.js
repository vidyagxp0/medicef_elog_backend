const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const MicrobialLimitForm = require("./microbialLimitForm");

const MicrobialLimitRecord = sequelize.define(
  "MicrobialLimitRecord",
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
        model: MicrobialLimitForm,
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
    mfg_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    exp_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ar_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    analysis_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    analyzed_by: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    results_of_tbc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    results_of_tfc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_observation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    observed1_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    observed2_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    e_coli: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salmonella: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    p_aeruginosa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    s_aureus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shigellaboydii: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    c_albicans: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clostridia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bile_tolerant: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_release: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    done_by: {
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

MicrobialLimitRecord.belongsTo(MicrobialLimitForm, { foreignKey: 'form_id' });
MicrobialLimitForm.hasMany(MicrobialLimitRecord, { foreignKey: 'form_id' });

module.exports = MicrobialLimitRecord;
