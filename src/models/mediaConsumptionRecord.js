const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const mediaConsumptionForm = require("./mediaConsumptionForm")

const mediaConsumptionRecord = sequelize.define(
  "mediaConsumptionRecord",
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
        model: mediaConsumptionForm,
        key: 'form_id',
      }
    },
    unique_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfUse: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    containerNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mediaQty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mediaQtyWithdrawn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mediaBalanceQty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    autoclaveMedia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING,
    },
    done_by: {
        type: DataTypes.STRING,
    },
    reviewed_by: {
        type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.STRING,
    },
    // supporting_docs: {
    //   type: DataTypes.STRING,
    // },
  }
);

mediaConsumptionRecord.belongsTo(mediaConsumptionForm, { foreignKey: 'form_id' });
mediaConsumptionForm.hasMany(mediaConsumptionRecord, { foreignKey: 'form_id' });

module.exports = mediaConsumptionRecord;
