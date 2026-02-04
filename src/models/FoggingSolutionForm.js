const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");
const Department = require("./departments");
const User = require("./users");
const Process = require("./processes");
const WorkflowState = require("./workflowState");

const foggingSolutionForm = sequelize.define("foggingSolutionForm", {
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
  approver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  }, 
  reviewer_id: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  reviewerData: {
    type: DataTypes.JSON,
    allowNull: false,
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
  description: {
    type: DataTypes.TEXT,
  },
  instrumentID: {
    type: DataTypes.STRING,
  },
  room_id: {
    type: DataTypes.STRING,
  },
  departmentName: {
    type: DataTypes.STRING,
  },
  area_name: {
    type: DataTypes.STRING,
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
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stage: {
    type: DataTypes.INTEGER,
    allowNull: false,
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

foggingSolutionForm.belongsTo(Department, { foreignKey: "department_id" });
Department.hasMany(foggingSolutionForm, { foreignKey: "department_id" });

foggingSolutionForm.belongsTo(Process, { foreignKey: "process_id" });
Process.hasMany(foggingSolutionForm, { foreignKey: "process_id" });

foggingSolutionForm.belongsTo(User, { foreignKey: "initiator_id" });
User.hasMany(foggingSolutionForm, { foreignKey: "initiator_id" });

// foggingSolutionForm.belongsTo(User, {
//   foreignKey: "reviewer_id",
//   as: "reviewer",
// });
// User.hasMany(foggingSolutionForm, {
//   foreignKey: "reviewer_id",
//   as: "reviewer",
// });

foggingSolutionForm.belongsTo(User, {
  foreignKey: "approver_id",
  as: "approver",
});
User.hasMany(foggingSolutionForm, {
  foreignKey: "approver_id",
  as: "FSApprovals",
});

foggingSolutionForm.belongsTo(WorkflowState, {
  foreignKey: "workflow_state_id",
  as: "workflow_state"
});

WorkflowState.hasMany(foggingSolutionForm, {
  foreignKey: "workflow_state_id"
});


module.exports = foggingSolutionForm;
