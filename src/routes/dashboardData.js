const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const dashboardDataController = require("../controllers/dashboardDataController");

router.get("/get-all", Auth.checkUserJwtToken, dashboardDataController.GetAllElogs);
router.get("/get/:form_id/:process_id", dashboardDataController.GetElogById);
router.get("/get-all-effective", Auth.checkUserJwtToken, dashboardDataController.GetAllEffectiveElogs);
router.get("/get-effective-by-id/:form_id/:process_id", Auth.checkUserJwtToken, dashboardDataController.GetEffectiveElogsById);
router.get("/get-processes", dashboardDataController.getAllProcesses);
router.get('/get-departments', dashboardDataController.getAllDepartments);
router.get('/get-server-time', dashboardDataController.getServerTime);
router.post("/get-user-roleGroups", Auth.checkUserJwtToken, dashboardDataController.GetUserOnBasisOfRoleGroup);

// common Audit-Trail
router.get("/get-all-audittrail/:form_id/:process_id", Auth.checkUserJwtToken, dashboardDataController.GetElogAuditTrail);
router.get( "/get-audit-report/:form_id/:process_id/:type", Auth.checkUserJwtToken, dashboardDataController.generateAuditPdfbyId);

//Attachment Delete
router.post("/delete-attachment/:form_id/:process_id", Auth.checkUserJwtToken,dashboardDataController.deleteAttachment)
module.exports = router;
