const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const mediaConsumptionProcess = require("../controllers/mediaConsumptionProcess");
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
  Auth.authorizeUserRole(11, 1),
  mediaConsumptionProcess.InsertmediaConsumption
);

// edit differential pressure elog details
router.put(
  "/update/:form_id",
  Auth.checkUserJwtToken,
  upload.any(),
  mediaConsumptionProcess.EditmediaConsumption
);

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  mediaConsumptionProcess.generateReport
);

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  mediaConsumptionProcess.chatByPdf
);

router.post("/view-report/:form_id", mediaConsumptionProcess.viewReport);

router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  mediaConsumptionProcess.effetiveChatByPdf
);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  mediaConsumptionProcess.blankReport
);

router.post(
  "/effective-view-report/:form_id",
  mediaConsumptionProcess.effetiveViewReport
);
router.post(
  "/send-report-on-mail/:id",
  upload.any(),
  mediaConsumptionProcess.sendReportOnMail
);

// router.get("/search", mediaConsumptionProcess.GetAll);

module.exports = router;
