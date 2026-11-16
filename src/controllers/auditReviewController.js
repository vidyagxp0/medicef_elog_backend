
const bcrypt = require("bcrypt");
const formModelRegistry = require("../utils/formModelRegistry");
const ElogAuditReview = require("../models/elogAuditReview");
const User = require("../models/users");
const WorkflowState = require("../models/workflowState");
const { sequelize } = require("../config/db");

const getTodayIST = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

const getRegistry = (process_id) => {
  const registry = formModelRegistry[Number(process_id)];

  if (!registry || !registry.form || !registry.audit) {
    throw new Error("Invalid process or audit configuration");
  }

  return registry;
};

// POST: Create one review per user, per record, per day
exports.createAuditReview = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { form_id, process_id } = req.params;
    const { comment, password, esignInput } = req.body;

    const userId = req.user?.userId;
    const today = getTodayIST();

    if (!userId) {
      await transaction.rollback();
      return res.status(401).json({
        error: true,
        message: "Unauthorized user",
      });
    }

    if (!comment?.trim()) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Review comment is required",
      });
    }

    if (!password || !esignInput) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Password and e-signature are required",
      });
    }

    const registry = getRegistry(process_id);
    const FormModel = registry.form;
    const AuditModel = registry.audit;

    const user = await User.findByPk(userId, { transaction });

    if (!user || user.isActive === false) {
      await transaction.rollback();
      return res.status(403).json({
        error: true,
        message: "User is inactive or not found",
      });
    }

    // Validate e-signature against the logged-in user.
    const enteredEmail = String(esignInput).trim().toLowerCase();
    const registeredEmail = String(user.email || "").trim().toLowerCase();
    const registeredUsername = String(user.userName || "").trim().toLowerCase();

    if (
      enteredEmail !== registeredEmail &&
      enteredEmail !== registeredUsername
    ) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Invalid e-signature",
      });
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordValid) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Invalid password",
      });
    }

    const form = await FormModel.findByPk(form_id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: "Record not found",
      });
    }

    const workflowState = form.workflow_state_id
      ? await WorkflowState.findByPk(form.workflow_state_id, {
          transaction,
        })
      : null;

    const stateName = String(workflowState?.name || "")
      .trim()
      .toLowerCase();

    if (stateName !== "closed - done") {
      await transaction.rollback();
      return res.status(403).json({
        error: true,
        message: "Audit review is allowed only after Closed - Done",
        workflow_state: workflowState?.name || null,
      });
    }

    // Enforce one review for this user and record on this date.
    const existingReview = await ElogAuditReview.findOne({
      where: {
        form_id: Number(form_id),
        process_id: Number(process_id),
        reviewer_id: userId,
        reviewed_date: today,
      },
      transaction,
    });

    if (existingReview) {
      await transaction.rollback();
      return res.status(409).json({
        error: true,
        message: "You have already reviewed this record today.",
        already_reviewed_today: true,
        reviewed_at: existingReview.reviewed_at,
      });
    }

    const auditPrimaryKey = AuditModel.primaryKeyAttribute;

    const auditCount = await AuditModel.count({
      where: { form_id: Number(form_id) },
      transaction,
    });

    const latestAudit = await AuditModel.findOne({
      where: { form_id: Number(form_id) },
      attributes: [auditPrimaryKey],
      order: [[auditPrimaryKey, "DESC"]],
      transaction,
    });

    const review = await ElogAuditReview.create(
      {
        form_id: Number(form_id),
        process_id: Number(process_id),
        reviewer_id: userId,
        reviewer_name:
          user.name ||
          user.fullName ||
          user.userName ||
          "Unknown User",
        reviewer_email: user.email || null,
        comment: comment.trim(),
        reviewed_date: today,
        reviewed_at: new Date(),
        reviewed_audit_count: auditCount,
        last_audit_trail_id: latestAudit
          ? latestAudit[auditPrimaryKey]
          : null,
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      error: false,
      message: "Audit review submitted successfully",
      data: review,
    });
  } catch (error) {
    await transaction.rollback();

    // The database unique index is the final protection against
    // two simultaneous review requests on the same day.
    if (
      error.name === "SequelizeUniqueConstraintError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(409).json({
        error: true,
        message: "You have already reviewed this record today.",
        already_reviewed_today: true,
      });
    }

    console.error("Create Audit Review Error:", error);

    return res.status(500).json({
      error: true,
      message: error.message || "Failed to submit audit review",
    });
  }
};

// GET: Fetch complete review history for a record
exports.getAuditReviews = async (req, res) => {
  try {
    const { form_id, process_id } = req.params;
    const userId = req.user?.userId;
    const today = getTodayIST();

    const registry = getRegistry(process_id);
    const FormModel = registry.form;

    const form = await FormModel.findByPk(form_id);

    if (!form) {
      return res.status(404).json({
        error: true,
        message: "Record not found",
      });
    }

    const workflowState = form.workflow_state_id
      ? await WorkflowState.findByPk(form.workflow_state_id)
      : null;

    const stateName = String(workflowState?.name || "")
      .trim()
      .toLowerCase();

    const reviews = await ElogAuditReview.findAll({
      where: {
        form_id: Number(form_id),
        process_id: Number(process_id),
      },
      order: [
        ["reviewed_at", "DESC"],
        ["id", "DESC"],
      ],
    });

    const alreadyReviewedToday = reviews.some(
      (review) =>
        Number(review.reviewer_id) === Number(userId) &&
        review.reviewed_date === today
    );

    return res.status(200).json({
      error: false,
      message: "Audit review history fetched successfully",
      data: {
        reviews,
        totalReviews: reviews.length,
        workflow_state: workflowState
          ? {
              id: workflowState.id,
              name: workflowState.name,
            }
          : null,
        can_review: stateName === "closed - done",
        already_reviewed_today: alreadyReviewedToday,
      },
    });
  } catch (error) {
    console.error("Get Audit Reviews Error:", error);

    return res.status(500).json({
      error: true,
      message: error.message || "Failed to fetch audit review history",
    });
  }
};
