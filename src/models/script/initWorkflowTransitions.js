// scripts/initWorkflowTransitions.js
const WorkflowTransition = require("../workflowTransition");

const initWorkflowTransitions = async () => {
  try {
    const count = await WorkflowTransition.count();
    if (count > 0) return;

    await WorkflowTransition.bulkCreate([
      { from_state_id: 1, to_state_id: 2, action_key: "FORWARD" },
      { from_state_id: 2, to_state_id: 1, action_key: "BACKWARD" },
      { from_state_id: 2, to_state_id: 3, action_key: "FORWARD" },
      { from_state_id: 3, to_state_id: 2, action_key: "BACKWARD" },
      { from_state_id: 3, to_state_id: 4, action_key: "FORWARD" },
      { from_state_id: 1, to_state_id: 5, action_key: "CANCEL" },
      { from_state_id: 2, to_state_id: 5, action_key: "CANCEL" },
      { from_state_id: 3, to_state_id: 5, action_key: "CANCEL" }
    ]);

    console.log("Workflow transitions created (including CANCEL)");
  } catch (err) {
    console.error("Init workflow transitions error:", err);
  }
};

module.exports = initWorkflowTransitions;
