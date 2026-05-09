const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const DailyCalibrationProcess = require("../controllers/dailyCalibrationProcess");
const multer = require("multer");
const path = require("path");
// console.log(DailyCalibrationProcess);
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
  Auth.authorizeUserRole(7, 1),
  DailyCalibrationProcess.InsertDailyCalibration
);

// edit differential pressure elog details
router.put(
  "/update/:form_id",
  Auth.checkUserJwtToken,
  upload.any(),
  // Auth.authorizeUserRole(7, 1),
  DailyCalibrationProcess.EditDailyCalibration
);

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  DailyCalibrationProcess.generateReport
);

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  DailyCalibrationProcess.chatByPdf
);

router.post("/view-report/:form_id", DailyCalibrationProcess.viewReport);

router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  DailyCalibrationProcess.effetiveChatByPdf
);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  DailyCalibrationProcess.blankReport
);

router.post(
  "/effective-view-report/:form_id",
  DailyCalibrationProcess.effetiveViewReport
);
router.post(
  "/send-report-on-mail/:id",
  upload.any(),
  DailyCalibrationProcess.sendReportOnMail
);

// router.get("/search", DailyCalibrationProcess.GetAll);

module.exports = router;
