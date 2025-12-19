const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const EquipmentUsageRecordProcess = require("../controllers/EquipmentUsageRecordProcess");
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

// post EquipmentUsageRecordProcess elog
router.post(
  "/post",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(3, 1),
  EquipmentUsageRecordProcess.InsertEquipmentUsage
);

// edit EquipmentUsageRecordProcess elog details
router.put(
  "/update",
  Auth.checkUserJwtToken,
  upload.any(),
  // Auth.authorizeUserRole(3, 1),
  EquipmentUsageRecordProcess.EditEquipmentUsage
);

// //get a EquipmentUsageRecordProcess elog by id
router.get(
  "/get/:id",
  Auth.checkUserJwtToken,
  EquipmentUsageRecordProcess.GetEquipmentUsage
);

// //get all the EquipmentUsageRecordProcess elogs
router.get(
  "/get-all",
  Auth.checkUserJwtToken,
  EquipmentUsageRecordProcess.GetAllEquipmentUsage
);

//send EquipmentUsageRecordProcess elog for review
router.put(
  "/send-for-review",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(3, 1),
  EquipmentUsageRecordProcess.SendEUElogForReview
);

// change status of EquipmentUsageRecordProcess elog from review to open
router.put(
  "/send-review-to-open",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(3, 2),
  EquipmentUsageRecordProcess.SendEUElogfromReviewToOpen
);

// send EquipmentUsageRecordProcess elog from review to approval
router.put(
  "/send-review-to-approval",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(3, 2),
  EquipmentUsageRecordProcess.SendEUfromReviewToApproval
);

// send EquipmentUsageRecordProcess elog from under-approval to open
router.put(
  "/send-approval-to-open",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(3, 3),
  EquipmentUsageRecordProcess.SendEUfromApprovalToOpen
);

// APPROVE EquipmentUsageRecordProcess elog
router.put(
  "/approve",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(3, 3),
  EquipmentUsageRecordProcess.ApproveEUElog
);

// get users based on roles, sites and processes
router.post(
  "/get-user-roleGroups",
  Auth.checkUserJwtToken,
  EquipmentUsageRecordProcess.GetUserOnBasisOfRoleGroup
);

// router.get("/get-processes", EquipmentUsageRecordProcess.getAllProcesses);

router.get(
  "/get-audit-trail-for-elog/:id",
  Auth.checkUserJwtToken,
  EquipmentUsageRecordProcess.getAuditTrailForAnElog
);

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  EquipmentUsageRecordProcess.generateReport
);
router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  EquipmentUsageRecordProcess.chatByPdf
);

router.post("/view-report", EquipmentUsageRecordProcess.viewReport);
router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  EquipmentUsageRecordProcess.effetiveChatByPdf
);

router.post(
  "/effective-view-report",
  EquipmentUsageRecordProcess.effetiveViewReport
);
router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  EquipmentUsageRecordProcess.blankReport
);
module.exports = router;
