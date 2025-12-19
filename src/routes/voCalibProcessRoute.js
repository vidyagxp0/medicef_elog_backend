const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const voCalib = require("../controllers/voCalibProcess");
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

// post  elog
router.post(
  "/post",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(15, 1),
  voCalib.Insert
);

// edit  elog details
router.put(
  "/update",
  Auth.checkUserJwtToken,
  upload.any(),
  // Auth.authorizeUserRole(9, 1),
  voCalib.Edit
);

//get a  elog by id
router.get(
  "/get/:id",
  Auth.checkUserJwtToken,
  voCalib.GetElog
);

//get all the  elogs
router.get(
  "/get-all",
  Auth.checkUserJwtToken,
  voCalib.GetAllElog
);

//send  elog for review
router.put(
  "/send-elog-for-review",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(15, 1),
  voCalib.SendElogForReview
);

// change status of  elog from review to open
router.put(
  "/send-elog-from-review-to-open",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(15, 2),
  voCalib.SendElogfromReviewToOpen
);

// send  elog from review to approval
router.put(
  "/send-from-review-to-approval",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(15, 2),
  voCalib.SendfromReviewToApproval
);

// send  elog from under-approval to open
router.put(
  "/send-elog-from-approval-to-open",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(15, 3),
  voCalib.SendfromApprovalToOpen
);

// APPROVE  elog
router.put(
  "/approve-elog",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(15, 3),
  voCalib.ApproveElog
);

// get users based on roles, sites and processes
router.post(
  "/get-user-roleGroups",
  Auth.checkUserJwtToken,
  voCalib.GetUserOnBasisOfRoleGroup
);

router.get("/get-processes", voCalib.getAllProcesses);

router.get(
  "/get-audit-trail-for-elog/:id",
  Auth.checkUserJwtToken,
  voCalib.getAuditTrailForAnElog
);

// router.get(
//   "/get-audit-report/:formId/:type/:userId",
//   voCalib.generateAuditPdfbyId
// );

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  voCalib.generateReport
);

// delete voCalib elog attachment
router.delete("/delete/attachment/:record_id", voCalib.deleteAttachment);

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  voCalib.chatByPdf
);

router.post("/view-report", voCalib.viewReport);
router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  voCalib.effetiveChatByPdf
);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  voCalib.blankReport
);

router.post(
  "/effective-view-report",
  voCalib.effetiveViewReport
);
// router.post(
//   "/send-report-on-mail/:id",
//   upload.any(),
//   voCalib.sendReportOnMail
// );

// // router.get("/search", voCalib.GetAll);

module.exports = router;
