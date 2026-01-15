const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");
const Department = require("./departments");
const User = require("./users");
const Process = require("./processes");
const WorkflowState = require("./workflowState");

const EquipmentUsageForm = sequelize.define("EquipmentUsageForm", {
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
  equipmentName: {
    type: DataTypes.STRING,
  },
  equipmentID: {
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

EquipmentUsageForm.belongsTo(Department, { foreignKey: "department_id" });
Department.hasMany(EquipmentUsageForm, { foreignKey: "department_id" });

EquipmentUsageForm.belongsTo(Process, { foreignKey: "process_id" });
Process.hasMany(EquipmentUsageForm, { foreignKey: "process_id" });

EquipmentUsageForm.belongsTo(User, { foreignKey: "initiator_id" });
User.hasMany(EquipmentUsageForm, { foreignKey: "initiator_id" });

// EquipmentUsageForm.belongsTo(User, {
//   foreignKey: "reviewer_id",
//   as: "reviewer",
// });
// User.hasMany(EquipmentUsageForm, {
//   foreignKey: "reviewer_id",
//   as: "reviewer",
// });

EquipmentUsageForm.belongsTo(User, {
  foreignKey: "approver_id",
  as: "approver",
});
User.hasMany(EquipmentUsageForm, {
  foreignKey: "approver_id",
  as: "EUApprovals",
});

EquipmentUsageForm.belongsTo(WorkflowState, {
  foreignKey: "workflow_state_id",
  as: "workflow_state"
});

WorkflowState.hasMany(EquipmentUsageForm, {
  foreignKey: "workflow_state_id"
});


module.exports = EquipmentUsageForm;
