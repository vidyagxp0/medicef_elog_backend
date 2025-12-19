const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");
const Site = require("./sites");
const User = require("./users");

const EquipmentUsageProcessForm = sequelize.define(
  "EquipmentUsageProcessForm",
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
    equipment_name: {
      type: DataTypes.STRING,
    },
    equipment_id: {
      type: DataTypes.STRING,
    },
    department: {
      type: DataTypes.STRING,
    },
    compression_area: {
      type: DataTypes.STRING,
    },
    area_name: {
      type: DataTypes.STRING,
    },
    limit: {
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
      type: DataTypes.JSON,
      allowNull:true,
    },
    batch_noArray: {
      type: DataTypes.JSON,
      allowNull:true,
    },
  }
);

EquipmentUsageProcessForm.belongsTo(Site, { foreignKey: "site_id" });
Site.hasMany(EquipmentUsageProcessForm, { foreignKey: "site_id" });

EquipmentUsageProcessForm.belongsTo(User, { foreignKey: "initiator_id" });
User.hasMany(EquipmentUsageProcessForm, { foreignKey: "initiator_id" });

EquipmentUsageProcessForm.belongsTo(User, {
  foreignKey: "reviewer_id",
  as: "reviewer1",
});
User.hasMany(EquipmentUsageProcessForm, {
  foreignKey: "reviewer_id",
  as: "reviewer1",
});

EquipmentUsageProcessForm.belongsTo(User, {
  foreignKey: "approver_id",
  as: "approver1",
});
User.hasMany(EquipmentUsageProcessForm, {
  foreignKey: "approver_id",
  as: "approver1",
});

module.exports = EquipmentUsageProcessForm;
