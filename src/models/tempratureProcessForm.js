const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");
const Department = require("./departments");
const User = require("./users");

const TempratureProcessForm = sequelize.define("TempratureProcessForm", {
  form_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Department,
      key: "department_id",
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
  compression_area: {
    type: DataTypes.STRING,
  },
  limit: {
    type: DataTypes.FLOAT,
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
  initiatorDeclaration: {
    type: DataTypes.STRING,
  },
  reviewerDeclaration: {
    type: DataTypes.STRING,
  },
  approverDeclaration: {
    type: DataTypes.STRING,
  },
  additionalAttachment: {
    type: DataTypes.STRING,
  },
  additionalInfo: {
    type: DataTypes.STRING,
  },
   area_name:{
    type:DataTypes.STRING,
  },
   room_id:{
    type:DataTypes.STRING,
  },
   instrument_id:{
    type:DataTypes.STRING,
  },
   acceptance_temperature:{
    type:DataTypes.STRING,
  },
    relative_humidity_criteria:{
       type:DataTypes.STRING,
  }
});

TempratureProcessForm.belongsTo(Department, { foreignKey: "department_id" });
Department.hasMany(TempratureProcessForm, { foreignKey: "department_id" });

TempratureProcessForm.belongsTo(User, { foreignKey: "initiator_id" });
User.hasMany(TempratureProcessForm, { foreignKey: "initiator_id" });

TempratureProcessForm.belongsTo(User, {
  foreignKey: "reviewer_id",
  as: "tpreviewer",
});
User.hasMany(TempratureProcessForm, {
  foreignKey: "reviewer_id",
  as: "tpreviewer",
});

TempratureProcessForm.belongsTo(User, {
  foreignKey: "approver_id",
  as: "tpapprover",
});
User.hasMany(TempratureProcessForm, {
  foreignKey: "approver_id",
  as: "tpapprover",
});

module.exports = TempratureProcessForm;
