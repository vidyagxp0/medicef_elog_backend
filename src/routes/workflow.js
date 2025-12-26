const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const workflowController = require("../controllers/workflowController");

router.get("/get-all-stages/", workflowController.GetAllStages);
router.get("/current-stage/:form_id", workflowController.GetCurrentStage);
router.get("/transitions/:form_id", workflowController.GetTransitions);
router.post("/move-stage",Auth.checkUserJwtToken, workflowController.updateWorkflowStage
);

module.exports = router;
