const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const WorkflowState = sequelize.define("workflow_states", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING,
    unique: true
  },
  name: {
    type: DataTypes.STRING
  },
  order_no: {
    type: DataTypes.INTEGER
  },
  is_final: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

WorkflowState.addHook("afterSync", async () => {
  try {
    const count = await WorkflowState.count();
    if (count > 0) {
      console.log("Workflow states already exist");
      return;
    }

    await WorkflowState.bulkCreate([
      { id: 1, code: "OPENED", name: "Opened", order_no: 1, is_final: 0 },
      { id: 2, code: "UNDER_REVIEW", name: "Under Review", order_no: 2, is_final: 0 },
      { id: 3, code: "UNDER_APPROVAL", name: "Under Approval", order_no: 3, is_final: 0 },
      { id: 4, code: "CLOSED_DONE", name: "Closed - Done", order_no: 4, is_final: 1 },
      { id: 5, code: "CLOSED_CANCELLED", name: "Closed - Cancelled", order_no: 5, is_final: 1 }
    ]);

    console.log("Workflow states created");
  } catch (err) {
    console.error("WorkflowState hook error:", err);
  }
});

module.exports = WorkflowState;
