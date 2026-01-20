const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const DPMonitoringProcess = require("../controllers/dpMonitoringProcess");
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
  Auth.authorizeUserRole(5, 1),
  DPMonitoringProcess.InsertDPMonitoring
);

// edit differential pressure elog details
router.put(
  "/update/:form_id",
  Auth.checkUserJwtToken,
  upload.any(),
//   Auth.authorizeUserRole(5, 1),
  DPMonitoringProcess.EditDPMonitoring
);

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  DPMonitoringProcess.generateReport
);

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  DPMonitoringProcess.chatByPdf
);

router.post("/view-report/:form_id", DPMonitoringProcess.viewReport);

router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  DPMonitoringProcess.effetiveChatByPdf
);
router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  DPMonitoringProcess.blankReport
);

router.post("/effective-view-report", DPMonitoringProcess.effetiveViewReport);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  DPMonitoringProcess.blankReport
);

module.exports = router;
