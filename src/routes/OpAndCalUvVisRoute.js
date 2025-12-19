const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const UvVis = require("../controllers/OpAndCalUvVisProcess");
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

// post UV-VIS elog
router.post(
  "/post",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(11, 1),
  UvVis.InsertUvVis
);

// edit UV-VIS elog details
router.put(
  "/update",
  Auth.checkUserJwtToken,
  upload.any(),
  // Auth.authorizeUserRole(9, 1),
  UvVis.EditUvVis
);

//get a UV-VIS elog by id
router.get(
  "/get/:id",
  Auth.checkUserJwtToken,
  UvVis.GetUvVisElog
);

//get all the UV-VIS elogs
router.get(
  "/get-all",
  Auth.checkUserJwtToken,
  UvVis.GetAllUvVisElog
);

//send UV-VIS elog for review
router.put(
  "/send-elog-for-review",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(11, 1),
  UvVis.SendUVElogForReview
);

// change status of UV-VIS elog from review to open
router.put(
  "/send-elog-from-review-to-open",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(11, 2),
  UvVis.SendUVElogfromReviewToOpen
);

// send UV-VIS elog from review to approval
router.put(
  "/send-from-review-to-approval",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(11, 2),
  UvVis.SendUVfromReviewToApproval
);

// send UV-VIS elog from under-approval to open
router.put(
  "/send-elog-from-approval-to-open",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(11, 3),
  UvVis.SendUVfromApprovalToOpen
);

// APPROVE UV-VIS elog
router.put(
  "/approve-elog",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(11, 3),
  UvVis.ApproveUVElog
);

// get users based on roles, sites and processes
router.post(
  "/get-user-roleGroups",
  Auth.checkUserJwtToken,
  UvVis.GetUserOnBasisOfRoleGroup
);

router.get("/get-processes", UvVis.getAllProcesses);

router.get(
  "/get-audit-trail-for-elog/:id",
  Auth.checkUserJwtToken,
  UvVis.getAuditTrailForAnElog
);

// router.get(
//   "/get-audit-report/:formId/:type/:userId",
//   UvVis.generateAuditPdfbyId
// );

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  UvVis.generateReport
);

// delete UvVis elog attachment
router.delete("/delete/attachment/:record_id", UvVis.deleteUvVisAttachment);

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  UvVis.chatByPdf
);

router.post("/view-report", UvVis.viewReport);
router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  UvVis.effetiveChatByPdf
);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  UvVis.blankReport
);

router.post(
  "/effective-view-report",
  UvVis.effetiveViewReport
);
// router.post(
//   "/send-report-on-mail/:id",
//   upload.any(),
//   UvVis.sendReportOnMail
// );

// // router.get("/search", UvVis.GetAll);

module.exports = router;
