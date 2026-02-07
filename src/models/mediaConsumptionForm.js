const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");
const Department = require("./departments");
const User = require("./users");
const Process = require("./processes");
const WorkflowState = require("./workflowState");

const mediaConsumptionForm = sequelize.define("mediaConsumptionForm", {
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
//   instrumentID: {
//     type: DataTypes.STRING,
//   },
  room_id: {
    type: DataTypes.STRING,
  },
  departmentName: {
    type: DataTypes.STRING,
  },
  area_name: {
    type: DataTypes.STRING,
  },
  nameOfMedia:{
    type: DataTypes.STRING,
  },
  make:{
    type: DataTypes.STRING,
  },
  manufacturingDate: {
    type: DataTypes.DATE,
  },
  expiryDate: {
    type: DataTypes.DATE,
  },
  batchNo:{
    type: DataTypes.STRING,
  },
  dateOfReceipt: {
    type: DataTypes.DATE,
    },
 quantityReceived: {
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

mediaConsumptionForm.belongsTo(Department, { foreignKey: "department_id" });
Department.hasMany(mediaConsumptionForm, { foreignKey: "department_id" });

mediaConsumptionForm.belongsTo(Process, { foreignKey: "process_id" });
Process.hasMany(mediaConsumptionForm, { foreignKey: "process_id" });

mediaConsumptionForm.belongsTo(User, { foreignKey: "initiator_id" });
User.hasMany(mediaConsumptionForm, { foreignKey: "initiator_id" });

// mediaConsumptionForm.belongsTo(User, {
//   foreignKey: "reviewer_id",
//   as: "reviewer",
// });
// User.hasMany(mediaConsumptionForm, {
//   foreignKey: "reviewer_id",
//   as: "reviewer",
// });

mediaConsumptionForm.belongsTo(User, {
  foreignKey: "approver_id",
  as: "approver",
});
User.hasMany(mediaConsumptionForm, {
  foreignKey: "approver_id",
  as: "MCApprovals",
});

mediaConsumptionForm.belongsTo(WorkflowState, {
  foreignKey: "workflow_state_id",
  as: "workflow_state"
});

WorkflowState.hasMany(mediaConsumptionForm, {
  foreignKey: "workflow_state_id"
});


module.exports = mediaConsumptionForm;
