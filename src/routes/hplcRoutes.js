const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const hplc = require("../controllers/hplcController");
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

// post hplc elog
router.post(
  "/post-hplc",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(9, 1),
  hplc.InsertHPLC
);

// edit hplc elog details
router.put(
  "/update-hplc",
  Auth.checkUserJwtToken,
  upload.any(),
  // Auth.authorizeUserRole(9, 1),
  hplc.EditHPLC
);

//get a hplc elog by id
router.get(
  "/get-hplc/:id",
  Auth.checkUserJwtToken,
  hplc.GethplcElog
);

//get all the hplc elogs
router.get(
  "/get-all-hplc",
  Auth.checkUserJwtToken,
  hplc.GetAllhplcElog
);

//send hplc elog for review
router.put(
  "/send-HP-elog-for-review",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(9, 1),
  hplc.SendHPElogForReview
);

// change status of hplc elog from review to open
router.put(
  "/send-HP-elog-from-review-to-open",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(9, 2),
  hplc.SendHPElogfromReviewToOpen
);

// send hplc elog from review to approval
router.put(
  "/send-HP-from-review-to-approval",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(9, 2),
  hplc.SendHPfromReviewToApproval
);

// send hplc elog from under-approval to open
router.put(
  "/send-HP-elog-from-approval-to-open",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(9, 3),
  hplc.SendHPfromApprovalToOpen
);

// APPROVE hplc elog
router.put(
  "/approve-HP-elog",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(9, 3),
  hplc.ApproveHPElog
);

// get users based on roles, sites and processes
router.post(
  "/get-user-roleGroups",
  Auth.checkUserJwtToken,
  hplc.GetUserOnBasisOfRoleGroup
);

router.get("/get-processes", hplc.getAllProcesses);

router.get(
  "/get-audit-trail-for-elog/:id",
  Auth.checkUserJwtToken,
  hplc.getAuditTrailForAnElog
);

// router.get(
//   "/get-audit-report/:formId/:type/:userId",
//   hplc.generateAuditPdfbyId
// );

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  hplc.generateReport
);

// delete hplc elog attachment
router.delete("/delete-hplc/attachment/:record_id", hplc.deleteHplcAttachment);

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  hplc.chatByPdf
);

router.post("/view-report", hplc.viewReport);
router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  hplc.effetiveChatByPdf
);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  hplc.blankReport
);

router.post(
  "/effective-view-report",
  hplc.effetiveViewReport
);
// router.post(
//   "/send-report-on-mail/:id",
//   upload.any(),
//   hplc.sendReportOnMail
// );

// // router.get("/search", hplc.GetAll);

module.exports = router;
