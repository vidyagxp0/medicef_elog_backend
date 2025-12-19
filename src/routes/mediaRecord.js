const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const MediaRecord = require("../controllers/MediaRecord");
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

// post MediaRecord elog
router.post(
  "/post",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(5, 1),
  MediaRecord.InsertMediaRecord
);

// edit MediaRecord elog details
router.put(
  "/update",
  Auth.checkUserJwtToken,
  upload.any(),
  // Auth.authorizeUserRole(5, 1),
  MediaRecord.EditMediaRecord
);

// //get a MediaRecord elog by id
router.get("/get/:id", Auth.checkUserJwtToken, MediaRecord.GetMediaRecord);

// //get all the MediaRecord elogs
router.get("/get-all", Auth.checkUserJwtToken, MediaRecord.GetAllMediaRecord);

//send MediaRecord elog for review
router.put(
  "/send-for-review",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(5, 1),
  MediaRecord.SendDPElogForReview
);

// change status of MediaRecord elog from review to open
router.put(
  "/send-review-to-open",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(5, 2),
  MediaRecord.SendDPElogfromReviewToOpen
);

// send MediaRecord elog from review to approval
router.put(
  "/send-review-to-approval",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(5, 2),
  MediaRecord.SendDPfromReviewToApproval
);

// send MediaRecord elog from under-approval to open
router.put(
  "/send-approval-to-open",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(5, 3),
  MediaRecord.SendDPfromApprovalToOpen
);

// APPROVE MediaRecord elog
router.put(
  "/approve",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(5, 3),
  MediaRecord.ApproveDPElog
);

// get users based on roles, sites and processes
// router.post(
//   "/get-user-roleGroups",
//   Auth.checkUserJwtToken,
//   MediaRecord.GetUserOnBasisOfRoleGroup
// );

// router.get("/get-processes", MediaRecord.getAllProcesses);

router.get(
  "/get-audit-trail-for-elog/:id",
  Auth.checkUserJwtToken,
  MediaRecord.getAuditTrailForAnElog
);

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  MediaRecord.generateReport
);

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  MediaRecord.chatByPdf
);
router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  MediaRecord.generateReport
);

router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  MediaRecord.effetiveChatByPdf
);
router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  MediaRecord.blankReport
);
router.post("/effective-view-report", MediaRecord.effetiveViewReport);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  MediaRecord.blankReport
);

module.exports = router;
