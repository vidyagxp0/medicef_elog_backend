const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const BalanceUsesProcess = require("../controllers/balanceUsesProcess");
const multer = require("multer");
const path = require("path");
// console.log(BalanceUsesProcess);
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
  BalanceUsesProcess.InsertBalanceUses
);

// edit differential pressure elog details
router.put(
  "/update/:form_id",
  Auth.checkUserJwtToken,
  upload.any(),
  // Auth.authorizeUserRole(7, 1),
  BalanceUsesProcess.EditBalanceUses
);

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  BalanceUsesProcess.generateReport
);

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  BalanceUsesProcess.chatByPdf
);

router.post("/view-report/:form_id", BalanceUsesProcess.viewReport);

router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  BalanceUsesProcess.effetiveChatByPdf
);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  BalanceUsesProcess.blankReport
);

router.post(
  "/effective-view-report/:form_id",
  BalanceUsesProcess.effetiveViewReport
);
router.post(
  "/send-report-on-mail/:id",
  upload.any(),
  BalanceUsesProcess.sendReportOnMail
);

// router.get("/search", BalanceUsesProcess.GetAll);

module.exports = router;
