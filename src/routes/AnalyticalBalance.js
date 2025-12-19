const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const AnalyticalBalance = require("../controllers/AnalyticalBalanaceProcess")
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

// post AnalyticalBalance elog
router.post(
  "/post",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(7, 1),
  AnalyticalBalance.InsertAnalyticalBalance
);

// edit AnalyticalBalance elog details
router.put(
  "/update",
  Auth.checkUserJwtToken,
  upload.any(),
  // Auth.authorizeUserRole(7, 1),
  AnalyticalBalance.EditAnalyticalBalance
);
// delete analytical balance elog attachment
router.delete("/delete-analytical-balance/attachment/:record_id", AnalyticalBalance.deleteAnalyticalBalanceAttachment);
// //get a AnalyticalBalance elog by id
router.get("/get/:id", Auth.checkUserJwtToken, AnalyticalBalance.GetAnalyticalBalance);

// //get all the AnalyticalBalance elogs
router.get("/get-all", Auth.checkUserJwtToken, AnalyticalBalance.GetAllAnalyticalBalance);

//send AnalyticalBalance elog for review
router.put(
  "/send-for-review",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(7, 1),
  AnalyticalBalance.SendDPElogForReview
);

// change status of AnalyticalBalance elog from review to open
router.put(
  "/send-review-to-open",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(7, 2),
  AnalyticalBalance.SendDPElogfromReviewToOpen
);

// send AnalyticalBalance elog from review to approval
router.put(
  "/send-review-to-approval",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(7, 2),
  AnalyticalBalance.SendDPfromReviewToApproval
);

// send AnalyticalBalance elog from under-approval to open
router.put(
  "/send-approval-to-open",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(7, 3),
  AnalyticalBalance.SendDPfromApprovalToOpen
);

// APPROVE AnalyticalBalance elog
router.put(
  "/approve",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(7, 3),
  AnalyticalBalance.ApproveDPElog
);

// get users based on roles, sites and processes
router.post(
  "/get-user-roleGroups",
  Auth.checkUserJwtToken,
  AnalyticalBalance.GetUserOnBasisOfRoleGroup
);

router.get("/get-processes", AnalyticalBalance.getAllProcesses);

router.get(
  "/get-audit-trail-for-elog/:id",
  Auth.checkUserJwtToken,
  AnalyticalBalance.getAuditTrailForAnElog
);

// router.post(
//   "/generate-pdf",
//   Auth.checkUserJwtToken,
//   AnalyticalBalance.generateReport
// );

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  AnalyticalBalance.chatByPdf
);

router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  AnalyticalBalance.effetiveChatByPdf
);

// router.post("/effective-view-report", AnalyticalBalance.effetiveViewReport);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  AnalyticalBalance.blankReport
);
// get users based on roles, sites and processes
router.post(
  "/get-user-roleGroups",
  Auth.checkUserJwtToken,
  AnalyticalBalance.GetUserOnBasisOfRoleGroup
);

module.exports = router;
