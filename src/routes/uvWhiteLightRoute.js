const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const uvWhiteLight = require("../controllers/uvWhiteLightProcess");
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
  Auth.authorizeUserRole(14, 1),
  uvWhiteLight.Insert
);

// edit  elog details
router.put(
  "/update",
  Auth.checkUserJwtToken,
  upload.any(),
  // Auth.authorizeUserRole(9, 1),
  uvWhiteLight.Edit
);

//get a  elog by id
router.get(
  "/get/:id",
  Auth.checkUserJwtToken,
  uvWhiteLight.GetElog
);

//get all the  elogs
router.get(
  "/get-all",
  Auth.checkUserJwtToken,
  uvWhiteLight.GetAllElog
);

//send  elog for review
router.put(
  "/send-elog-for-review",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(14, 1),
  uvWhiteLight.SendElogForReview
);

// change status of  elog from review to open
router.put(
  "/send-elog-from-review-to-open",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(14, 2),
  uvWhiteLight.SendElogfromReviewToOpen
);

// send  elog from review to approval
router.put(
  "/send-from-review-to-approval",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(14, 2),
  uvWhiteLight.SendfromReviewToApproval
);

// send  elog from under-approval to open
router.put(
  "/send-elog-from-approval-to-open",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(14, 3),
  uvWhiteLight.SendfromApprovalToOpen
);

// APPROVE  elog
router.put(
  "/approve-elog",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(14, 3),
  uvWhiteLight.ApproveElog
);

// get users based on roles, sites and processes
router.post(
  "/get-user-roleGroups",
  Auth.checkUserJwtToken,
  uvWhiteLight.GetUserOnBasisOfRoleGroup
);

router.get("/get-processes", uvWhiteLight.getAllProcesses);

router.get(
  "/get-audit-trail-for-elog/:id",
  Auth.checkUserJwtToken,
  uvWhiteLight.getAuditTrailForAnElog
);

// router.get(
//   "/get-audit-report/:formId/:type/:userId",
//   uvWhiteLight.generateAuditPdfbyId
// );

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  uvWhiteLight.generateReport
);

// delete uvWhiteLight elog attachment
router.delete("/delete/attachment/:record_id", uvWhiteLight.deleteAttachment);

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  uvWhiteLight.chatByPdf
);

router.post("/view-report", uvWhiteLight.viewReport);
router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  uvWhiteLight.effetiveChatByPdf
);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  uvWhiteLight.blankReport
);

router.post(
  "/effective-view-report",
  uvWhiteLight.effetiveViewReport
);
// router.post(
//   "/send-report-on-mail/:id",
//   upload.any(),
//   uvWhiteLight.sendReportOnMail
// );

// // router.get("/search", uvWhiteLight.GetAll);

module.exports = router;
