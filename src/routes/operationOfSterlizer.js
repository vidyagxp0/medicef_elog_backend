const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const OperationOfSterilizer = require("../controllers/OperationOfSterlizer");
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

// post OperationOfSterilizer elog
router.post(
  "/post",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(4, 1),
  OperationOfSterilizer.InsertOperationOfSterilizerForm
);

// edit OperationOfSterilizer elog details
router.put(
  "/update",
  Auth.checkUserJwtToken,
  upload.any(),
  // Auth.authorizeUserRole(4, 1),
  OperationOfSterilizer.EditOperationOfSterilizerForm
);

// //get a OperationOfSterilizer elog by id
router.get(
  "/get/:id",
  Auth.checkUserJwtToken,
  OperationOfSterilizer.GettOperationOfSterilizerForm
);

// //get all the OperationOfSterilizer elogs
router.get(
  "/get-all",
  Auth.checkUserJwtToken,
  OperationOfSterilizer.GetAlltOperationOfSterilizerForm
);
//send OperationOfSterilizer elog for review
router.put(
  "/send-for-review",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(4, 1),
  OperationOfSterilizer.SendDPElogForReview
);

// change status of OperationOfSterilizer elog from review to open
router.put(
  "/send-review-to-open",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(4, 2),
  OperationOfSterilizer.SendDPElogfromReviewToOpen
);

// send OperationOfSterilizer elog from review to approval
router.put(
  "/send-review-to-approval",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(4, 2),
  OperationOfSterilizer.SendDPfromReviewToApproval
);

// send OperationOfSterilizer elog from under-approval to open
router.put(
  "/send-approval-to-open",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(4, 3),
  OperationOfSterilizer.SendDPfromApprovalToOpen
);

// APPROVE OperationOfSterilizer elog
router.put(
  "/approve",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(4, 3),
  OperationOfSterilizer.ApproveDPElog
);

// get users based on roles, sites and processes
// router.post(
//   "/get-user-roleGroups",
//   Auth.checkUserJwtToken,
//   OperationOfSterilizer.GetUserOnBasisOfRoleGroup
// );

// router.get("/get-processes", OperationOfSterilizer.getAllProcesses);

router.get(
  "/get-audit-trail-for-elog/:id",
  Auth.checkUserJwtToken,
  OperationOfSterilizer.getAuditTrailForAnElog
);

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  OperationOfSterilizer.generateReport
);

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  OperationOfSterilizer.chatByPdf
);
router.post("/view-report", OperationOfSterilizer.viewReport);

router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  OperationOfSterilizer.effetiveChatByPdf
);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  OperationOfSterilizer.blankReport
);

router.post("/effective-view-report", OperationOfSterilizer.effetiveViewReport);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  OperationOfSterilizer.blankReport
);

module.exports = router;
