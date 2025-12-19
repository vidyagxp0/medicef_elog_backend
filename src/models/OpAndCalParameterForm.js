const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");
const Site = require("./sites");
const User = require("./users");

const OpAndCalMultiParameterProcessForm = sequelize.define("OpAndCalMultiParameterProcessForm", {
  form_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Site,
      key: "site_id",
    },
  },
  initiator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  initiator_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_of_initiation: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  date_of_review: {
    type: DataTypes.DATE,
  },
  date_of_approval: {
    type: DataTypes.DATE,
  },
  description: {
    type: DataTypes.JSON,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stage: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
  },
  reviewer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  approver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  reviewComment: {
    type: DataTypes.STRING,
  },
  approverComment: {
    type: DataTypes.STRING,
  },
  initiatorComment: {
    allowNull:true,
    type: DataTypes.STRING,
  },
  initiatorAttachment: {
    type: DataTypes.STRING,
  },
  reviewerAttachment: {
    type: DataTypes.STRING,
  },
  approverAttachment: {
    type: DataTypes.STRING,
  },
  additionalAttachment: {
    type: DataTypes.STRING,
  },
  additionalInfo: {
    type: DataTypes.STRING,
  },
});

OpAndCalMultiParameterProcessForm.belongsTo(Site, { foreignKey: "site_id4" });
Site.hasMany(OpAndCalMultiParameterProcessForm, { foreignKey: "site_id4" });

OpAndCalMultiParameterProcessForm.belongsTo(User, { foreignKey: "initiator_id4" });
User.hasMany(OpAndCalMultiParameterProcessForm, { foreignKey: "initiator_id4" });

OpAndCalMultiParameterProcessForm.belongsTo(User, {
  foreignKey: "reviewer_id",
  as: "reviewer7",
});
User.hasMany(OpAndCalMultiParameterProcessForm, {
  foreignKey: "reviewer_id",
  as: "reviewer7",
});

OpAndCalMultiParameterProcessForm.belongsTo(User, {
  foreignKey: "approver_id",
  as: "approver7",
});
User.hasMany(OpAndCalMultiParameterProcessForm, {
  foreignKey: "approver_id",
  as: "approver7",
});

module.exports = OpAndCalMultiParameterProcessForm;
