const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const KarlFischerProcess = require("../controllers/KarlFischerProcess");
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
  "/post-karl-fischer",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(8, 1),
  KarlFischerProcess.InsertKarlFischer
);

// edit differential pressure elog details
router.put(
  "/update-karl-fischer",
  Auth.checkUserJwtToken,
  upload.any(),
  // Auth.authorizeUserRole(8, 1),
  KarlFischerProcess.EditKarlFischer
);

// delete karl fischer elog attachment
router.delete("/delete-karl-fischer/attachment/:record_id", KarlFischerProcess.deleteKarlFischerAttachment);


//get a differential pressure elog by id
router.get(
  "/get-karl-fischer/:id",
  Auth.checkUserJwtToken,
  KarlFischerProcess.GetKarlFischerElog
);

//get all the differential pressure elogs
router.get(
  "/get-all-karl-fischer",
  Auth.checkUserJwtToken,
  KarlFischerProcess.GetAllKarlFischerElog
);

//send differential pressure elog for review
router.put(
  "/send-KF-elog-for-review",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(8, 1),
  KarlFischerProcess.SendKFElogForReview
);

// change status of differential pressure elog from review to open
router.put(
  "/send-KF-elog-from-review-to-open",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(8, 2),
  KarlFischerProcess.SendKFElogfromReviewToOpen
);

// send differential pressure elog from review to approval
router.put(
  "/send-KF-from-review-to-approval",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(8, 2),
  KarlFischerProcess.SendKFfromReviewToApproval
);

// send differential pressure elog from under-approval to open
router.put(
  "/send-KF-elog-from-approval-to-open",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(8, 3),
  KarlFischerProcess.SendKFfromApprovalToOpen
);

// APPROVE differential pressure elog
router.put(
  "/approve-KF-elog",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(8, 3),
  KarlFischerProcess.ApproveKFElog
);

// get users based on roles, sites and processes
router.get(
  "/get-user-roleGroups",
  Auth.checkUserJwtToken,
  KarlFischerProcess.GetUserOnBasisOfRoleGroup
);

router.get("/get-processes", KarlFischerProcess.getAllProcesses);

router.get(
  "/get-audit-trail-for-elog/:id",
  Auth.checkUserJwtToken,
  KarlFischerProcess.getAuditTrailForAnElog
);

// router.get(
//   "/get-audit-report/:formId/:type/:userId",
//   KarlFischerProcess.generateAuditPdfbyId
// );

// router.post(
//   "/generate-pdf",
//   Auth.checkUserJwtToken,
//   KarlFischerProcess.generateReport
// );

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  KarlFischerProcess.chatByPdf
);

router.post("/view-report", KarlFischerProcess.viewReport);
router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  KarlFischerProcess.effetiveChatByPdf
);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  KarlFischerProcess.blankReport
);

// router.post(
//   "/effective-view-report",
//   KarlFischerProcess.effetiveViewReport
// );
// router.post(
//   "/send-report-on-mail/:id",
//   upload.any(),
//   KarlFischerProcess.sendReportOnMail
// );

// // router.get("/search", KarlFischerProcess.GetAll);

module.exports = router;
