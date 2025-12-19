const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const DispenseOfMaterial = require("../controllers/DispenseOfMaterial");
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

// post DispenseOfMaterial elog
router.post(
  "/post",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(6, 1),
  DispenseOfMaterial.InsertDispenseOfMaterialRecord
);

// edit DispenseOfMaterial elog details
router.put(
  "/update",
  Auth.checkUserJwtToken,
  upload.any(),
  // Auth.authorizeUserRole(6, 1),
  DispenseOfMaterial.EditDispenseOfMaterialRecord
);

// //get a DispenseOfMaterial elog by id
router.get(
  "/get/:id",
  Auth.checkUserJwtToken,
  DispenseOfMaterial.GetDispenseOfMaterialRecord
);

// //get all the DispenseOfMaterial elogs
router.get(
  "/get-all",
  Auth.checkUserJwtToken,
  DispenseOfMaterial.GetAllDispenseOfMaterialRecord
);

//send DispenseOfMaterial elog for review
router.put(
  "/send-for-review",
  Auth.checkUserJwtToken,
  upload.any(),
  Auth.authorizeUserRole(6, 1),
  DispenseOfMaterial.SendDPElogForReview
);

// change status of DispenseOfMaterial elog from review to open
router.put(
  "/send-review-to-open",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(6, 2),
  DispenseOfMaterial.SendDPElogfromReviewToOpen
);

// send DispenseOfMaterial elog from review to approval
router.put(
  "/send-review-to-approval",
  Auth.checkUserJwtToken,
  upload.single("reviewerAttachment"),
  Auth.authorizeUserRole(6, 2),
  DispenseOfMaterial.SendDPfromReviewToApproval
);

// send DispenseOfMaterial elog from under-approval to open
router.put(
  "/send-approval-to-open",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(6, 3),
  DispenseOfMaterial.SendDPfromApprovalToOpen
);

// APPROVE DispenseOfMaterial elog
router.put(
  "/approve",
  Auth.checkUserJwtToken,
  upload.single("approverAttachment"),
  Auth.authorizeUserRole(6, 3),
  DispenseOfMaterial.ApproveDPElog
);

// get users based on roles, sites and processes
// router.post(
//   "/get-user-roleGroups",
//   Auth.checkUserJwtToken,
//   DispenseOfMaterial.GetUserOnBasisOfRoleGroup
// );

// router.get("/get-processes", DispenseOfMaterial.getAllProcesses);

router.get(
  "/get-audit-trail-for-elog/:id",
  Auth.checkUserJwtToken,
  DispenseOfMaterial.getAuditTrailForAnElog
);

router.post(
  "/generate-pdf",
  Auth.checkUserJwtToken,
  DispenseOfMaterial.generateReport
);

router.post(
  "/chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  DispenseOfMaterial.chatByPdf
);

router.post("/view-report", DispenseOfMaterial.viewReport);

router.post(
  "/effective-chat-pdf/:form_id",
  Auth.checkUserJwtToken,
  DispenseOfMaterial.effetiveChatByPdf
);
router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  DispenseOfMaterial.blankReport
);
router.post("/effective-view-report", DispenseOfMaterial.effetiveViewReport);

router.post(
  "/blank-report/:form_id",
  Auth.checkUserJwtToken,
  DispenseOfMaterial.blankReport
);

module.exports = router;
