const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const workflowController = require("../controllers/workflowController");
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

router.get("/get-all-stages", workflowController.GetAllStages);
router.get("/current-stage/:form_id/:process_id", workflowController.GetCurrentStage);
router.get("/transitions/:form_id/:process_id", workflowController.GetTransitions);
router.post("/move-stage/:form_id/:process_id",Auth.checkUserJwtToken, upload.any(), workflowController.updateWorkflowStage
);

module.exports = router;
