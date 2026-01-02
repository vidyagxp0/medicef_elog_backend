const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const dashboardDataController = require("../controllers/dashboardDataController");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, "../documents/elog_docs/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const originalName = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    const sanitizedOriginalName = originalName.replace(/[^a-zA-Z0-9]/g, "_"); // Sanitize the original name if necessary
    const newFilename = `${uniqueSuffix}-${sanitizedOriginalName}${path.extname(
      file.originalname
    )}`;
    cb(null, newFilename);
  },
});

const upload = multer({ storage: storage });

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
router.post("/delete-attachment/:form_id/:process_id", Auth.checkUserJwtToken,dashboardDataController.deleteAttachment);
router.post("/add-attachment/:form_id/:process_id",upload.any(), Auth.checkUserJwtToken,dashboardDataController.addAttachment);
module.exports = router;
