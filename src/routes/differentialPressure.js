const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const DifferentialPressureProcess = require("../controllers/DifferentialPressureProcess");
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
  "/create",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(1, 1),
  DifferentialPressureProcess.InsertDifferentialPressure
);

// edit differential pressure elog details
router.put(
  "/update/:form_id",
  Auth.checkUserJwtToken,
  upload.any(),
  // Auth.authorizeUserRole(1, 1),
  DifferentialPressureProcess.EditDifferentialPressure
);

//get a differential pressure elog by id
router.get(
  "/get/:form_id",
  Auth.checkUserJwtToken,
  DifferentialPressureProcess.GetDifferentialPressureElog
);

//get all the differential pressure elogs
// router.get(
//   "/get-all",
//   Auth.checkUserJwtToken,
//   DifferentialPressureProcess.GetAllDifferentialPressureElog
// );

//send differential pressure elog for review
router.put(
  "/send-for-review",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(1, 1),
  DifferentialPressureProcess.SendDPElogForReview
);

// change status of differential pressure elog from review to open
router.put(
  "/review-to-open",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(1, 2),
  DifferentialPressureProcess.SendDPElogfromReviewToOpen
);

// send differential pressure elog from review to approval
router.put(
  "/review-to-approval",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(1, 2),
  DifferentialPressureProcess.SendDPfromReviewToApproval
);

// send differential pressure elog from under-approval to open
router.put(
  "/approval-to-open",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(1, 3),
  DifferentialPressureProcess.SendDPfromApprovalToOpen
);

// APPROVE differential pressure elog
router.put(
  "/approve-elog",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(1, 3),
  DifferentialPressureProcess.ApproveDPElog
);

// get users based on roles, departments and processes
router.post(
  "/get-user-roleGroups",
  Auth.checkUserJwtToken,
  DifferentialPressureProcess.GetUserOnBasisOfRoleGroup
);

router.get(
  "/get-audit-trail-for-elog/:id",
  Auth.checkUserJwtToken,
  DifferentialPressureProcess.getAuditTrailForAnElog
);

router.get(
  "/get-audit-report/:formId/:type/:userId",
  DifferentialPressureProcess.generateAuditPdfbyId
);

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  DifferentialPressureProcess.generateReport
);

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  DifferentialPressureProcess.chatByPdf
);

router.post("/view-report", DifferentialPressureProcess.viewReport);
router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  DifferentialPressureProcess.effetiveChatByPdf
);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  DifferentialPressureProcess.blankReport
);

router.post(
  "/effective-view-report",
  DifferentialPressureProcess.effetiveViewReport
);
router.post(
  "/send-report-on-mail/:id",
  upload.any(),
  DifferentialPressureProcess.sendReportOnMail
);

// router.get("/search", DifferentialPressureProcess.GetAll);

module.exports = router;
