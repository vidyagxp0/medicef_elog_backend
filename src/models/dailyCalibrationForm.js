const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");
const Department = require("./departments");
const User = require("./users");
const Process = require("./processes");
const WorkflowState = require("./workflowState");
const { room_id } = require("../utils/auditFieldMap");

const DailyCalibrationForm = sequelize.define("DailyCalibrationForm", {
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
  description: {
    type: DataTypes.TEXT,
  },
  location: {
    type: DataTypes.STRING,
  },
  identificationNo: {
    type: DataTypes.STRING,
  },
  make: {
    type: DataTypes.STRING,
  },
  modelNo: {
    type: DataTypes.STRING,
  },
  calibrationDoneOn: {
    type: DataTypes.DATE,
  },

  calibrationDueOn: {
    type: DataTypes.DATE,
  },
  capacity: {
    type: DataTypes.STRING,
  },
  leastCount: {
    type: DataTypes.STRING,
  },
  wtBoxId: {
    type: DataTypes.STRING,
  },

  validUpTo: {
    type: DataTypes.DATE,
  },
  certificateNo: {
    type: DataTypes.STRING,
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
  reviewerComment: {
    type: DataTypes.STRING,
  },
  approverComment: {
    type: DataTypes.STRING,
  },
  initiatorComment: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  initiatorAttachment: {
    type: DataTypes.STRING,
  },
  initiatorName: {
    type: DataTypes.STRING,
  },
  reviewerAttachment: {
    type: DataTypes.STRING,
  },
  reviewerName: {
    type: DataTypes.STRING,
  },
  approverAttachment: {
    type: DataTypes.STRING,
  },
  approverName: {
    type: DataTypes.STRING,
  },
  additionalAttachment: {
    type: DataTypes.STRING,
  },
  additionalInfo: {
    type: DataTypes.STRING,
  },
  area_name: {
    type: DataTypes.STRING,
  },
  room_id: {
    type: DataTypes.STRING,
  },
  workflow_state_id: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    references: {
      model: WorkflowState,
      key: "id",
    },
  },
});

DailyCalibrationForm.belongsTo(Department, { foreignKey: "department_id" });
Department.hasMany(DailyCalibrationForm, { foreignKey: "department_id" });

DailyCalibrationForm.belongsTo(Process, { foreignKey: "process_id" });
Process.hasMany(DailyCalibrationForm, { foreignKey: "process_id" });

DailyCalibrationForm.belongsTo(User, { foreignKey: "initiator_id" });
User.hasMany(DailyCalibrationForm, { foreignKey: "initiator_id" });

DailyCalibrationForm.belongsTo(User, {
  foreignKey: "approver_id",
  as: "approver",
});

User.hasMany(DailyCalibrationForm, {
  foreignKey: "approver_id",
  as: "DAApprovals",
});

DailyCalibrationForm.belongsTo(WorkflowState, {
  foreignKey: "workflow_state_id",
  as: "workflow_state",
});

WorkflowState.hasMany(DailyCalibrationForm, {
  foreignKey: "workflow_state_id",
});

module.exports = DailyCalibrationForm;
