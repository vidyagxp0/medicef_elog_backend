const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");
const Department = require("./departments");
const User = require("./users");
const WorkflowState = require("./workflowState");
const Process = require("./processes");

const DPMonitoringForm = sequelize.define("DPMonitoringForm", {
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
  initiatorDate: {
    type: DataTypes.DATE,
  },
  approverDate: {
    type: DataTypes.DATE,
  },
  reviewerDate: {
    type: DataTypes.DATE,
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
  description: {
    type: DataTypes.TEXT,
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
   area_name:{
    type:DataTypes.STRING,
  },
   room_id:{
    type:DataTypes.STRING,
  },
  reviewerComment: {
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
  initiatorName: {
    type: DataTypes.STRING,
  },
  reviewerName: {
    type: DataTypes.STRING,
  },
  approverName : {
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
  allowNull:false,
  defaultValue: 1,
  references: {
    model: WorkflowState,
    key: "id"
  }
}
});

DPMonitoringForm.belongsTo(Department, { foreignKey: "department_id" });
Department.hasMany(DPMonitoringForm, { foreignKey: "department_id" });

DPMonitoringForm.belongsTo(Process, { foreignKey: "process_id" });
Process.hasMany(DPMonitoringForm, { foreignKey: "process_id" });

DPMonitoringForm.belongsTo(User, { foreignKey: "initiator_id" });
User.hasMany(DPMonitoringForm, { foreignKey: "initiator_id" });

// DPMonitoringForm.belongsTo(User, {
//   foreignKey: "reviewer_id",
//   as: "tpreviewer",
// });
// User.hasMany(DPMonitoringForm, {
//   foreignKey: "reviewer_id",
//   as: "tpreviewer",
// });

DPMonitoringForm.belongsTo(User, {
  foreignKey: "approver_id",
  as: "approver",
});
User.hasMany(DPMonitoringForm, {
  foreignKey: "approver_id",
  as: "monitoringApprovals",
});

DPMonitoringForm.belongsTo(WorkflowState, {
  foreignKey: "workflow_state_id",
  as: "workflow_state"
});

WorkflowState.hasMany(DPMonitoringForm, {
  foreignKey: "workflow_state_id"
});


module.exports = DPMonitoringForm;
