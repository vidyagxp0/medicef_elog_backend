const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");
const User = require('../models/users.js');


const EffectiveChangeAudit = sequelize.define(
  "EffectiveChangeAudit",
  {
    auditTrail_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    process_id: {
  type: DataTypes.INTEGER,
  allowNull: true,
},

    performed_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    field_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    previous_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    new_value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    status: {
  type: DataTypes.ENUM("created", "updated"),
  allowNull: false,
},
performed_at: {
  type: DataTypes.DATE,
  allowNull: true,
},
  },
  {
    tableName: "EffectiveChangeAudit",
    timestamps: false,
  }
);

EffectiveChangeAudit.belongsTo(User, {
  foreignKey: "performed_by",
  targetKey: "user_id",
  as: "performedByUser",
});


module.exports = EffectiveChangeAudit;