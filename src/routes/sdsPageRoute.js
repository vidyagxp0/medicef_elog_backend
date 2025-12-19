const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const sdsPage = require("../controllers/sdsPageProcess");
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
  Auth.authorizeUserRole(12, 1),
  sdsPage.InsertsdsPage
);

// edit UV-VIS elog details
router.put(
  "/update",
  Auth.checkUserJwtToken,
  upload.any(),
  // Auth.authorizeUserRole(9, 1),
  sdsPage.EditsdsPage
);

//get a UV-VIS elog by id
router.get(
  "/get/:id",
  Auth.checkUserJwtToken,
  sdsPage.GetsdsPageElog
);

//get all the UV-VIS elogs
router.get(
  "/get-all",
  Auth.checkUserJwtToken,
  sdsPage.GetAllsdsPageElog
);

//send UV-VIS elog for review
router.put(
  "/send-elog-for-review",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(12, 1),
  sdsPage.SendElogForReview
);

// change status of UV-VIS elog from review to open
router.put(
  "/send-elog-from-review-to-open",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(12, 2),
  sdsPage.SendElogfromReviewToOpen
);

// send UV-VIS elog from review to approval
router.put(
  "/send-from-review-to-approval",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(12, 2),
  sdsPage.SendfromReviewToApproval
);

// send UV-VIS elog from under-approval to open
router.put(
  "/send-elog-from-approval-to-open",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(12, 3),
  sdsPage.SendfromApprovalToOpen
);

// APPROVE UV-VIS elog
router.put(
  "/approve-elog",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(12, 3),
  sdsPage.ApproveElog
);

// get users based on roles, sites and processes
router.post(
  "/get-user-roleGroups",
  Auth.checkUserJwtToken,
  sdsPage.GetUserOnBasisOfRoleGroup
);

router.get("/get-processes", sdsPage.getAllProcesses);

router.get(
  "/get-audit-trail-for-elog/:id",
  Auth.checkUserJwtToken,
  sdsPage.getAuditTrailForAnElog
);

// router.get(
//   "/get-audit-report/:formId/:type/:userId",
//   sdsPage.generateAuditPdfbyId
// );

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  sdsPage.generateReport
);

// delete sdsPage elog attachment
router.delete("/delete/attachment/:record_id", sdsPage.deletesdsPageAttachment);

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  sdsPage.chatByPdf
);

router.post("/view-report", sdsPage.viewReport);
router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  sdsPage.effetiveChatByPdf
);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  sdsPage.blankReport
);

router.post(
  "/effective-view-report",
  sdsPage.effetiveViewReport
);
// router.post(
//   "/send-report-on-mail/:id",
//   upload.any(),
//   sdsPage.sendReportOnMail
// );

// // router.get("/search", sdsPage.GetAll);

module.exports = router;
