const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const DailyVerificationProcess = require("../controllers/dailyVerificationProcess");
const multer = require("multer");
const path = require("path");
// console.log(DailyVerificationProcess);
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
  Auth.authorizeUserRole(23, 1),
  DailyVerificationProcess.InsertDailyVerification
);

// edit differential pressure elog details
router.put(
  "/update/:form_id",
  Auth.checkUserJwtToken,
  upload.any(),
  DailyVerificationProcess.EditDailyVerification
);

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  DailyVerificationProcess.generateReport
);

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  DailyVerificationProcess.chatByPdf
);

router.post("/view-report/:form_id", DailyVerificationProcess.viewReport);

router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  DailyVerificationProcess.effetiveChatByPdf
);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  DailyVerificationProcess.blankReport
);

router.post(
  "/effective-view-report/:form_id",
  DailyVerificationProcess.effetiveViewReport
);
router.post(
  "/send-report-on-mail/:id",
  upload.any(),
  DailyVerificationProcess.sendReportOnMail
);

// router.get("/search", DailyVerificationProcess.GetAll);

module.exports = router;
