const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const BreakdownMaintenanceProcess = require("../controllers/breakdownMaintenanceProcess");
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

// post differential pressure elog
router.post(
  "/create",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(21, 1),
  BreakdownMaintenanceProcess.InsertBreakdownMaintenance
);

// edit differential pressure elog details
router.put(
  "/update/:form_id",
  Auth.checkUserJwtToken,
  upload.any(),
  BreakdownMaintenanceProcess.EditBreakdownMaintenance
);

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  BreakdownMaintenanceProcess.generateReport
);

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  BreakdownMaintenanceProcess.chatByPdf
);

router.post("/view-report/:form_id", BreakdownMaintenanceProcess.viewReport);

router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  BreakdownMaintenanceProcess.effetiveChatByPdf
);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  BreakdownMaintenanceProcess.blankReport
);

router.post(
  "/effective-view-report/:form_id",
  BreakdownMaintenanceProcess.effetiveViewReport
);
router.post(
  "/send-report-on-mail/:id",
  upload.any(),
  BreakdownMaintenanceProcess.sendReportOnMail
);

// router.get("/search", BreakdownMaintenanceProcess.GetAll);

module.exports = router;
