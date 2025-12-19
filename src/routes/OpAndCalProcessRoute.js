const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const OpAndCalParameterProcess = require("../controllers/OpAndCalParameterProcess")
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

// post OpAndCalParameterProcess elog
router.post(
  "/post",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(10, 1),
  OpAndCalParameterProcess.InsertOpAndCalMultiParameter
);

// edit OpAndCalParameterProcess elog details
router.put(
  "/update",
  Auth.checkUserJwtToken,
  upload.any(),
  // Auth.authorizeUserRole(10, 1),
  OpAndCalParameterProcess.EditOpAndCalMultiParameter
);
// delete analytical balance elog attachment
router.delete("/delete-analytical-balance/attachment/:record_id", OpAndCalParameterProcess.deleteOpAndCalMultiParameterAttachment);
// //get a OpAndCalParameterProcess elog by id
router.get("/get/:id", Auth.checkUserJwtToken, OpAndCalParameterProcess.GetOpAndCalMultiParameter);

// //get all the OpAndCalParameterProcess elogs
router.get("/get-all", Auth.checkUserJwtToken, OpAndCalParameterProcess.GetAllOpAndCalMultiParameter);

//send OpAndCalParameterProcess elog for review
router.put(
  "/send-for-review",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(10, 1),
  OpAndCalParameterProcess.SendElogForReview
);

// change status of OpAndCalParameterProcess elog from review to open
router.put(
  "/send-review-to-open",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(10, 2),
  OpAndCalParameterProcess.SendElogfromReviewToOpen
);

// send OpAndCalParameterProcess elog from review to approval
router.put(
  "/send-review-to-approval",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(10, 2),
  OpAndCalParameterProcess.SendfromReviewToApproval
);

// send OpAndCalParameterProcess elog from under-approval to open
router.put(
  "/send-approval-to-open",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(10, 3),
  OpAndCalParameterProcess.SendfromApprovalToOpen
);

// APPROVE OpAndCalParameterProcess elog
router.put(
  "/approve",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(10, 3),
  OpAndCalParameterProcess.ApproveElog
);

// get users based on roles, sites and processes
router.post(
  "/get-user-roleGroups",
  Auth.checkUserJwtToken,
  OpAndCalParameterProcess.GetUserOnBasisOfRoleGroup
);

router.get("/get-processes", OpAndCalParameterProcess.getAllProcesses);

router.get(
  "/get-audit-trail-for-elog/:id",
  Auth.checkUserJwtToken,
  OpAndCalParameterProcess.getAuditTrailForAnElog
);

// router.post(
//   "/generate-pdf",
//   Auth.checkUserJwtToken,
//   OpAndCalParameterProcess.generateReport
// );

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  OpAndCalParameterProcess.chatByPdf
);

router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  OpAndCalParameterProcess.effetiveChatByPdf
);

// router.post("/effective-view-report", OpAndCalParameterProcess.effetiveViewReport);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  OpAndCalParameterProcess.blankReport
);
// get users based on roles, sites and processes
router.post(
  "/get-user-roleGroups",
  Auth.checkUserJwtToken,
  OpAndCalParameterProcess.GetUserOnBasisOfRoleGroup
);

module.exports = router;
