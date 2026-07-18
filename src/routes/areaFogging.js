const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const areaFoggingProcess = require("../controllers/areaFoggingProcess");
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
  Auth.authorizeUserRole(9, 1),
  areaFoggingProcess.InsertareaFogging
);

// edit differential pressure elog details
router.put(
  "/update/:form_id",
  Auth.checkUserJwtToken,
  upload.any(),
  areaFoggingProcess.EditareaFogging
);

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  areaFoggingProcess.generateReport
);

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  areaFoggingProcess.chatByPdf
);

router.post("/view-report/:form_id", areaFoggingProcess.viewReport);

router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  areaFoggingProcess.effetiveChatByPdf
);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  areaFoggingProcess.blankReport
);

router.post(
  "/effective-view-report/:form_id",
  areaFoggingProcess.effetiveViewReport
);
router.post(
  "/send-report-on-mail/:id",
  upload.any(),
  areaFoggingProcess.sendReportOnMail
);

// router.get("/search", areaFoggingProcess.GetAll);

module.exports = router;
