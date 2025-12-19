const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const gelDocIGene = require("../controllers/gelDocIGeneProcess");
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
  Auth.authorizeUserRole(13, 1),
  gelDocIGene.Insert
);

// edit  elog details
router.put(
  "/update",
  Auth.checkUserJwtToken,
  upload.any(),
  // Auth.authorizeUserRole(9, 1),
  gelDocIGene.Edit
);

//get a  elog by id
router.get(
  "/get/:id",
  Auth.checkUserJwtToken,
  gelDocIGene.GetElog
);

//get all the  elogs
router.get(
  "/get-all",
  Auth.checkUserJwtToken,
  gelDocIGene.GetAllElog
);

//send  elog for review
router.put(
  "/send-elog-for-review",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(13, 1),
  gelDocIGene.SendElogForReview
);

// change status of  elog from review to open
router.put(
  "/send-elog-from-review-to-open",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(13, 2),
  gelDocIGene.SendElogfromReviewToOpen
);

// send  elog from review to approval
router.put(
  "/send-from-review-to-approval",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(13, 2),
  gelDocIGene.SendfromReviewToApproval
);

// send  elog from under-approval to open
router.put(
  "/send-elog-from-approval-to-open",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(13, 3),
  gelDocIGene.SendfromApprovalToOpen
);

// APPROVE  elog
router.put(
  "/approve-elog",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(13, 3),
  gelDocIGene.ApproveElog
);

// get users based on roles, sites and processes
router.post(
  "/get-user-roleGroups",
  Auth.checkUserJwtToken,
  gelDocIGene.GetUserOnBasisOfRoleGroup
);

router.get("/get-processes", gelDocIGene.getAllProcesses);

router.get(
  "/get-audit-trail-for-elog/:id",
  Auth.checkUserJwtToken,
  gelDocIGene.getAuditTrailForAnElog
);

// router.get(
//   "/get-audit-report/:formId/:type/:userId",
//   gelDocIGene.generateAuditPdfbyId
// );

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  gelDocIGene.generateReport
);

// delete gelDocIGene elog attachment
router.delete("/delete/attachment/:record_id", gelDocIGene.deleteAttachment);

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  gelDocIGene.chatByPdf
);

router.post("/view-report", gelDocIGene.viewReport);
router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  gelDocIGene.effetiveChatByPdf
);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  gelDocIGene.blankReport
);

router.post(
  "/effective-view-report",
  gelDocIGene.effetiveViewReport
);
// router.post(
//   "/send-report-on-mail/:id",
//   upload.any(),
//   gelDocIGene.sendReportOnMail
// );

// // router.get("/search", gelDocIGene.GetAll);

module.exports = router;
