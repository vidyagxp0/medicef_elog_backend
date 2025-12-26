// models/workflowTransition.js
const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const WorkflowTransition = sequelize.define("workflow_transitions", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  from_state_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  to_state_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  action_key: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_active: {
    type: DataTypes.TINYINT,
    defaultValue: 1
  }
});

// afterSync hook for initial insert
// WorkflowTransition.addHook("afterSync", async () => {
//   try {
//     const count = await WorkflowTransition.count();
//     if (count > 0) {
//       console.log("Workflow transitions already exist");
//       return;
//     }

//     await WorkflowTransition.bulkCreate([
//       { from_state_id: 1, to_state_id: 2, action_key: "FORWARD" },
//       { from_state_id: 2, to_state_id: 1, action_key: "BACKWARD" },
//       { from_state_id: 2, to_state_id: 3, action_key: "FORWARD" },
//       { from_state_id: 3, to_state_id: 2, action_key: "BACKWARD" },
//       { from_state_id: 3, to_state_id: 4, action_key: "FORWARD" }, // Done
//       { from_state_id: 1, to_state_id: 5, action_key: "CANCEL" },
//       { from_state_id: 2, to_state_id: 5, action_key: "CANCEL" },
//       { from_state_id: 3, to_state_id: 5, action_key: "CANCEL" }
//     ]);

//     console.log("Workflow transitions created (including CANCEL)");
//   } catch (err) {
//     console.error("WorkflowTransition hook error:", err);
//   }
// });

module.exports = WorkflowTransition;
