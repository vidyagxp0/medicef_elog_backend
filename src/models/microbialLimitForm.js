const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");
const Department = require("./departments");
const User = require("./users");
const Process = require("./processes");
const WorkflowState = require("./workflowState");
const { room_id } = require("../utils/auditFieldMap");

const MicrobialLimitForm = sequelize.define("MicrobialLimitForm", {
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
    allowNull:true,
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
  approverName  : {
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
    key: "id"
  }
}
});

MicrobialLimitForm.belongsTo(Department, { foreignKey: "department_id" });
Department.hasMany(MicrobialLimitForm, { foreignKey: "department_id" });

MicrobialLimitForm.belongsTo(Process, { foreignKey: "process_id" });
Process.hasMany(MicrobialLimitForm, { foreignKey: "process_id" });

MicrobialLimitForm.belongsTo(User, { foreignKey: "initiator_id" });
User.hasMany(MicrobialLimitForm, { foreignKey: "initiator_id" });

// MicrobialLimitForm.belongsTo(User, {
//   foreignKey: "reviewer_id",
//   as: "reviewer",
// });
// User.hasMany(MicrobialLimitForm, {
//   foreignKey: "reviewer_id",
//   as: "reviewer",
// });

MicrobialLimitForm.belongsTo(User, {
  foreignKey: "approver_id",
  as: "approver",
});
User.hasMany(MicrobialLimitForm, {
  foreignKey: "approver_id",
  as: "dpApprovals",
});

MicrobialLimitForm.belongsTo(WorkflowState, {
  foreignKey: "workflow_state_id",
  as: "workflow_state"
});

WorkflowState.hasMany(MicrobialLimitForm, {
  foreignKey: "workflow_state_id"
});


module.exports = MicrobialLimitForm;
