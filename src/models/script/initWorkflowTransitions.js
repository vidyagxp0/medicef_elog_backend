// scripts/initWorkflowTransitions.js
const WorkflowTransition = require("../workflowTransition");

const initWorkflowTransitions = async () => {
  try {
    const count = await WorkflowTransition.count();
    if (count > 0) return;

    await WorkflowTransition.bulkCreate([
      { from_state_id: 1, to_state_id: 2, action_key: "Send For Review" },
      { from_state_id: 2, to_state_id: 1, action_key: "More Info" },
      { from_state_id: 2, to_state_id: 3, action_key: "Send For Approval" },
      { from_state_id: 3, to_state_id: 2, action_key: "More Info" },
      { from_state_id: 3, to_state_id: 4, action_key: "Approved" },
      { from_state_id: 1, to_state_id: 5, action_key: "Cancel" },
      { from_state_id: 2, to_state_id: 5, action_key: "Cancel" },
      { from_state_id: 3, to_state_id: 5, action_key: "Cancel" }
    ]);

    console.log("Workflow transitions created");
  } catch (err) {
    console.error("Init workflow transitions error:", err);
  }
};

module.exports = initWorkflowTransitions;
