const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");
const Department = require("./departments");
const User = require("./users");
const WorkflowState = require("./workflowState");
const Process = require("./processes");

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
  process_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Process,
      key: "process_id",
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
  reviewer_id: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  reviewerData: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  approver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
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
  departmentName: {
    type: DataTypes.STRING,
  },
  compression_area: {
    type: DataTypes.STRING,
  },
   area_name:{
    type:DataTypes.STRING,
  },
   room_id:{
    type:DataTypes.STRING,
  },
   instrument_id_no:{
    type:DataTypes.STRING,
  },
   acceptance_temperature:{
    type:DataTypes.STRING,
  },
    relative_humidity_criteria:{
       type:DataTypes.STRING,
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
  workflow_state_id: {
  type: DataTypes.INTEGER,
  defaultValue: 1,
  references: {
    model: WorkflowState,
    key: "id"
  }
}
});

TempratureProcessForm.belongsTo(Department, { foreignKey: "department_id" });
Department.hasMany(TempratureProcessForm, { foreignKey: "department_id" });

TempratureProcessForm.belongsTo(Process, { foreignKey: "process_id" });
Process.hasMany(TempratureProcessForm, { foreignKey: "process_id" });

TempratureProcessForm.belongsTo(User, { foreignKey: "initiator_id" });
User.hasMany(TempratureProcessForm, { foreignKey: "initiator_id" });

// TempratureProcessForm.belongsTo(User, {
//   foreignKey: "reviewer_id",
//   as: "tpreviewer",
// });
// User.hasMany(TempratureProcessForm, {
//   foreignKey: "reviewer_id",
//   as: "tpreviewer",
// });

TempratureProcessForm.belongsTo(User, {
  foreignKey: "approver_id",
  as: "approver",
});
User.hasMany(TempratureProcessForm, {
  foreignKey: "approver_id",
  as: "temperatureApprovals",
});

TempratureProcessForm.belongsTo(WorkflowState, {
  foreignKey: "workflow_state_id",
  as: "workflow_state"
});

WorkflowState.hasMany(TempratureProcessForm, {
  foreignKey: "workflow_state_id"
});


module.exports = TempratureProcessForm;
