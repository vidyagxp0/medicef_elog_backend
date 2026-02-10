const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const LabAssaySampleForm = require("./labAssaySampleForm");
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
        model: LabAssaySampleForm,
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
    },
    mfg_date: {
      type: DataTypes.STRING,
    },
    exp_date: {
      type: DataTypes.STRING,
    },
    ar_no: {
      type: DataTypes.STRING,
    },
    analysis_date: {
      type: DataTypes.STRING,
    },
    analyzed_by: {
      type: DataTypes.STRING,
    },
    results_of_tbc: {
      type: DataTypes.STRING,
    },
    results_of_tfc: {
      type: DataTypes.STRING,
    },
    no_of_spores: {
      type: DataTypes.STRING,
    },
    percentage_of_spores: {
      type: DataTypes.STRING,
    },
    date_of_observation: {
      type: DataTypes.STRING,
    },
    observed1_by: {
      type: DataTypes.STRING,
    },
    observed2_by: {
      type: DataTypes.STRING,
    },
    e_coli: {
      type: DataTypes.STRING,
    },
    salmonella: {
      type: DataTypes.STRING,
    },
    p_aeruginosa: {
      type: DataTypes.STRING,
    },
    s_aureus: {
      type: DataTypes.STRING,
    },
    shigellaboydii: {
      type: DataTypes.STRING,
    },
    c_albicans: {
      type: DataTypes.STRING,
    },
    clostridia: {
      type: DataTypes.STRING,
    },
    bile_tolerant: {
      type: DataTypes.STRING,
    },
    date_of_release: {
      type: DataTypes.STRING,
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
