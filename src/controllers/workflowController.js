const WorkflowState = require("../models/workflowState");
const differential_pressure = require("../models/differentialPressureForm")
const processFormRegistry = require("../utils/processFormRegistry");
const workflow_transitions = require("../models/workflowTransition");

exports.GetAllStages = async (req, res) => {
    try {
        const stages = await WorkflowState.findAll({
            order: [["order_no", "ASC"]]
        });
        // Return combined response
        res.json({
            error: false,
            stages,
        });
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message,
        });
    }
};
exports.GetCurrentStage = async (req, res) => {
    try {
        const {form_id} = req.params;

        if (!form_id) {
            return res.status(401).json({
                message: "form_id not found "
            })
        }

        const form = await differential_pressure.findByPk(form_id);

        const current_stage = form.workflow_state_id
        if (!current_stage) {
            return res.status(401).json({
                message: "workflow_state_id not found "
            })
        }
        // Return combined response
        res.json({
            error: false,
            current_stage,
        });
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message,
        });
    }
};
exports.GetTransitions = async (req, res) => {
    try {
        const { form_id } = req.params;

        if (!form_id) {
            return res.status(401).json({
                message: "form_id not found "
            })
        }
        
        const form = await differential_pressure.findByPk(form_id, {
        });

        const state = await WorkflowState.findByPk(form.workflow_state_id);
        if (state.is_final) return res.json([]);

        const transitions = await workflow_transitions.findAll({
            where: { from_state_id: form.workflow_state_id, is_active: true }
        });
        // Return combined response
        res.json({
            error: false,
            transitions,
        });
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message,
        });
    }
};


 exports.updateWorkflowStage = async (req, res) => {
    const { form_id, process_id, action } = req.body;
      // action = FORWARD | BACKWARD | CANCEL
     
      console.log("req.body",req.body)
    try {
        if (!form_id || !process_id || !action) {
            return res.status(400).json({
                message: "form_id, process_id and action are required"
            });
        }

        //  resolve model from registry
        const FormModel = processFormRegistry[process_id];
        if (!FormModel) {
            return res.status(400).json({
                message: "No form model mapped for this process_id"
            });
        }
        console.log("FormModel",FormModel)

        // fetch form (COMMON)
        const form = await FormModel.findOne({
            where: { form_id, process_id }
        });

        if (!form) {
            return res.status(404).json({
                message: "Form not found"
            });
        }

        const currentStateId = form.workflow_state_id;

        // validate transition
        const transition = await workflow_transitions.findOne({
            where: {
                from_state_id: currentStateId,
                action_key: action,
                is_active: 1
            }
        });

        if (!transition) {
            return res.status(400).json({
                message: `Action ${action} not allowed from current stage`
            });
        }

        // CANCEL
        if (action === "CANCEL") {
            await form.update({
                workflow_state_id: transition.to_state_id,
                status: "CANCELLED"
            });

            return res.json({
                success: true,
                message: "Form cancelled successfully"
            });
        }

        //  FORWARD / BACKWARD
        await form.update({
            workflow_state_id: transition.to_state_id
        });

        // state info
        const nextState = await WorkflowState.findByPk(
            transition.to_state_id
        );

        return res.json({
            success: true,
            message: `Form moved ${action}`,
            current_state: nextState.code,
            is_final: nextState.is_final
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message
        });
    }
};

