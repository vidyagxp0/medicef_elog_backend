const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const AreaCleaningProcess = require("../controllers/areaCleaningProcess");
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
  Auth.authorizeUserRole(4, 1),
  AreaCleaningProcess.InsertAreaCleaning
);

// edit differential pressure elog details
router.put(
  "/update/:form_id",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(4, 1),
  AreaCleaningProcess.EditAreaCleaning
);

router.get(
  "/get-audit-trail-for-elog/:id",
  Auth.checkUserJwtToken,
  AreaCleaningProcess.getAuditTrailForAnElog
);

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  AreaCleaningProcess.generateReport
);

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  AreaCleaningProcess.chatByPdf
);

router.post("/view-report/:form_id", AreaCleaningProcess.viewReport);

router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  AreaCleaningProcess.effetiveChatByPdf
);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  AreaCleaningProcess.blankReport
);

router.post(
  "/effective-view-report/:form_id",
  AreaCleaningProcess.effetiveViewReport
);
router.post(
  "/send-report-on-mail/:id",
  upload.any(),
  AreaCleaningProcess.sendReportOnMail
);

// router.get("/search", AreaCleaningProcess.GetAll);

module.exports = router;
