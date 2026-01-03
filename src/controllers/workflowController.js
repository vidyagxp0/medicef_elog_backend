const WorkflowState = require("../models/workflowState");
const differential_pressure = require("../models/differentialPressureForm")
const processFormRegistry = require("../utils/processFormRegistry");
const workflow_transitions = require("../models/workflowTransition");
const DifferentialPressureAuditTrail = require("../models/differentialPressureAuditTrail");
const bcrypt = require("bcrypt");
const { getElogDocsUrl } = require("../middlewares/authentication");
const { sequelize } = require("../config/db");
const formModelRegistry = require("../utils/formModelRegistry");
const WorkflowTransition = require("../models/workflowTransition");
const User = require("../models/users");

exports.GetAllStages = async (req, res) => {
    try {
        const stages = await WorkflowState.findAll({
            order: [["order_no", "ASC"]]
        });
        
        if(!stages){
          return res.json({
            error:true,
            message:"stages not found"
          })
        }
        // Return combined response
        res.json({
            error: false,
            stages,
        });
    } catch (error) {
    console.error(error);
        res.status(400).json({
            error: true,
            message: error.message,
        });
    }
};
exports.GetCurrentStage = async (req, res) => {
  try {
    const { form_id, process_id } = req.params;

    if (!form_id || !process_id) {
      return res.status(400).json({
        error: true,
        message: "form_id and process_id are required",
      });
    }

    const FormModel = processFormRegistry[process_id];
    if (!FormModel) {
      return res.status(400).json({
        error: true,
        message: "Invalid process_id",
      });
    }

    const form = await FormModel.findByPk(form_id);

    if (!form) {
      return res.status(404).json({
        error: true,
        message: "Form not found",
      });
    }

    const current_stage = form.workflow_state_id;

    if (!current_stage) {
      return res.status(404).json({
        error: true,
        message: "workflow_state_id not found",
      });
    }

    res.json({
      error: false,
      process_id,
      form_id,
      current_stage,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
exports.GetTransitions = async (req, res) => {
  try {
    const { form_id, process_id } = req.params;

    if (!form_id || !process_id) {
      return res.status(400).json({
        error: true,
        message: "form_id and process_id are required",
      });
    }

    const FormModel = processFormRegistry[process_id];
    if (!FormModel) {
      return res.status(400).json({
        error: true,
        message: "Invalid process_id",
      });
    }

    const form = await FormModel.findByPk(form_id);

    if (!form) {
      return res.status(404).json({
        error: true,
        message: "Form not found",
      });
    }

    const state = form.workflow_state_id;

    if (!state) {
      return res.status(404).json({
        error: true,
        message: "Workflow state not found",
      });
    }

    if (state.is_final) {
      return res.json({
        error: false,
        transitions: [],
      });
    }

    const transitions = await WorkflowTransition.findAll({
      where: {
        from_state_id:state,
        is_active: true,
      }
    });

    res.json({
      error: false,
      current_stage: form.workflow_state_id,
      transitions,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
 exports.updateWorkflowStage = async (req, res) => {
  const { form_id, process_id } = req.params;
  const { action ,declaration,email, password,  } = req.body;
  const user = req.user; // logged-in user
  const files = req.files;
  // Start a transaction
  const transaction = await sequelize.transaction();
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "email, password are required",
      });
    }
    if (!form_id || !process_id ) {
      return res.status(400).json({
        message: "form_id, process_id are required",
      });
    }
    if (!action || !declaration ) {
      return res.status(400).json({
        message: "action, declaration are required",
      });
    }

    const dbUser = await User.findOne({
      where: {
        email: email.toLowerCase(),
        isActive: true,
      },
      raw: true,
    });

    if (!dbUser) {
      return res.status(401).json({
        error: true,
        message: "User not found ",
      });
    }

    const isMatch = await bcrypt.compare(password, dbUser.password);

    if (!isMatch) {
      return res.status(400).json({
        error: true,
        message: "Invalid password",
      });
    }

    if(dbUser.user_id !== user.userId){
      return res.status(400).json({
        error:true,
        message:"Invalid Signature",
      })
    }

    // Resolve form model dynamically
      const registry = formModelRegistry[process_id];

      if (!registry) {
        return res.status(400).json({
          error: true,
          message: "No process mapping found",
        });
      }

      const FormModel = registry.form;
      const AuditModel = registry.audit;


    // Fetch form with current workflow state
    const form = await FormModel.findOne({
      where: { form_id, process_id },
      include: [{ model: WorkflowState, as: "workflow_state" }],
      transaction,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ message: "Form not found" });
    }

    const currentStateId = form.workflow_state_id;
    // Find allowed transition dynamically
    const transition = await workflow_transitions.findOne({
      where: {
        from_state_id: currentStateId,
        action_key: action,
        is_active: 1,
      },
    });
    if (!transition) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Action ${action} not allowed from current stage`,
      });
    }

    const nextState = await WorkflowState.findByPk(transition.to_state_id);

    if (!nextState) {
      await transaction.rollback();
      return res.status(500).json({ message: "Next stage not found" });
    }

    // --------------------------
    // Role-based permission check
    // --------------------------

    const currentState = form.workflow_state.name; 
    let activeRole = null;
    if (user.userId === form.initiator_id) {
    activeRole = "initiator";
    } else if (
    Array.isArray(form.reviewer_id) &&
    form.reviewer_id.includes(user.userId)
    ) {
    activeRole = "reviewer";
    } else if (user.userId === form.approver_id) {
    activeRole = "approver";
    }

    if (!activeRole) {
    await transaction.rollback();
    return res.status(403).json({
        error: true,
        message: "Invalid signature / unauthorized to perform this action",
    });
    }

    const stageRoleMap = {
    "Opened": "initiator",
    "Under Review": "reviewer",
    "Under Approval": "approver",
    };

    const expectedRole = stageRoleMap[currentState];

    // Full permission roles
    const fullAccessRoles = ["fullpermission"];

    if (!fullAccessRoles.includes(activeRole) && expectedRole !== activeRole) {
    await transaction.rollback();
    return res.status(403).json({
        error: true,
        message: `Action not allowed. Only ${expectedRole} can act at ${currentState} stage.`,
    });
    }


    // const declaration = req.body[`${activeRole}Declaration`] || "";
    const comment = req.body[`${activeRole}Comment`] || "";

        if (!comment || comment.trim() === "") {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: `${activeRole} comment is mandatory`,
      });
    }
    // --------------------------
    // Update form workflow state
    // --------------------------
    await form.update(
      {
        workflow_state_id: nextState.id,
        stage: nextState.order_no,
        status: nextState.name,
        [`${activeRole}Comment`]: comment,
        [`${activeRole}Name`]: dbUser.name,
        [`${activeRole}Date`]: new Date(),
      },
      { transaction }
    );

    // --------------------------
    // Prepare audit trail
    // --------------------------
    const auditTrailEntries = [];

    // Stage change entry
    auditTrailEntries.push({
      form_id: form.form_id,
      field_name: "STAGE_CHANGE",
      previous_value: form.workflow_state.name,
      new_value: nextState.name,
      changed_by: user.userId,
      previous_status: form.workflow_state.name,
      new_status: nextState.name,
      action: action,
      declaration: declaration,
    });

    // if (comment) {
    //   auditTrailEntries.push({
    //     form_id: form.form_id,
    //     field_name: `${activeRole.toUpperCase()}_COMMENT`,
    //     previous_value: form[`${activeRole}Comment`] || null,
    //     new_value: comment,
    //     changed_by: user.userId,
    //     previous_status: form.workflow_state.name,
    //     new_status: nextState.name,
    //     action: action,
    //     declaration: declaration,
    //   });
    // }

    // Handle attachments dynamically
    // const roleAttachmentField = `${activeRole}Attachment`;
    // const attachment = files?.find((f) => f.fieldname === roleAttachmentField);
    // if (attachment) {
    //   auditTrailEntries.push({
    //     form_id: form.form_id,
    //     field_name: roleAttachmentField,
    //     previous_value: form[roleAttachmentField] || null,
    //     new_value: getElogDocsUrl(attachment),
    //     changed_by: user.userId,
    //     previous_status: form.workflow_state.name,
    //     new_status: nextState.name,
    //     action: action,
    //     declaration: declaration,
    //   });

    //   form[roleAttachmentField] = getElogDocsUrl(attachment);
    //   await form.save({ transaction });
    // }

    // --------------------------
    // Bulk insert audit trail entries
    // --------------------------
    await AuditModel.bulkCreate(auditTrailEntries, {
      transaction,
    });

    await transaction.commit();

    return res.json({
      success: true,
      message: `Form ${action} successfully`,
      current_state: nextState.name,
      is_final: nextState.is_final,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
}