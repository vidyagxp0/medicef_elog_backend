const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");
const Site = require("./sites");
const User = require("./users");

const OperationOfSterilizerProcessForm = sequelize.define(
  "OperationOfSterilizerProcessForm",
  {
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
    product_nameArray: {
      allowNull: true,
      type: DataTypes.JSON,
    },
    batch_noArray: {
      allowNull: true,
      type: DataTypes.JSON,
    },
  }
);

OperationOfSterilizerProcessForm.belongsTo(Site, { foreignKey: "site_id2" });
Site.hasMany(OperationOfSterilizerProcessForm, { foreignKey: "site_id2" });

OperationOfSterilizerProcessForm.belongsTo(User, {
  foreignKey: "initiator_id2",
});
User.hasMany(OperationOfSterilizerProcessForm, { foreignKey: "initiator_id2" });

OperationOfSterilizerProcessForm.belongsTo(User, {
  foreignKey: "reviewer_id",
  as: "reviewer2",
});
User.hasMany(OperationOfSterilizerProcessForm, {
  foreignKey: "reviewer_id",
  as: "reviewer2",
});

OperationOfSterilizerProcessForm.belongsTo(User, {
  foreignKey: "approver_id",
  as: "approver2",
});
User.hasMany(OperationOfSterilizerProcessForm, {
  foreignKey: "approver_id",
  as: "approver2",
});

module.exports = OperationOfSterilizerProcessForm;
