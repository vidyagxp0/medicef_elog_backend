const gelDocIGeneForm = require("../models/gelDocIGeneForm");
const gelDocIGeneRecordss = require("../models/gelDocIGeneRecords");
const Process = require("../models/processes");
const { sequelize } = require("../config/db");
const User = require("../models/users");
const UserRole = require("../models/userRoles");
const { Op, ValidationError } = require("sequelize");
const bcrypt = require("bcrypt");
const { getElogDocsUrl } = require("../middlewares/authentication");
const gelDocIGeneAuditTrail = require("../models/gelDocIGeneAuditTrail");
const Mailer = require("../middlewares/mailer");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { sendEmail } = require("../utils/mailer");
const { v4: uuidv4 } = require("uuid");
const getUserById = async (user_id) => {
  const user = await User.findOne({ where: { user_id, isActive: true } });
  return user;
};

// Fill Differential pressure form and insert its records.
exports.Insert = async (req, res) => {
  const {
    site_id,
    description,
    department,
    compression_area,
    limit,
    reviewer_id,
    approver_id,
    initiatorComment,
    email,
    password,
    UVvisCalibProcessRecords,
    initiatorDeclaration,
    additionalAttachment,
    additionalInfo,
  } = req.body;

  if (!approver_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide an approver." });
  }
  if (!reviewer_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a reviewer." });
  }

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email and password." });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne({
      where: { user_id: req.user.userId, isActive: true },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid e-signature." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid e-signature." });
    }

    let initiatorAttachment = null;
    let additionalAttachment = null;
    const supportingDocs = {};

    // Process files
    req.files?.forEach((file) => {
      if (file.fieldname === "initiatorAttachment") {
        initiatorAttachment = file;
      } else if (file.fieldname === "additionalAttachment") {
        additionalAttachment = file;
      } else if (file.fieldname.startsWith("UVvisCalibProcessRecords[")) {
        // Extract the index from the fieldname
        const match = file.fieldname.match(
          /UVvisCalibProcessRecords\[(\d+)\]\[supporting_docs\]/
        );
        if (match) {
          const index = match[1];
          supportingDocs[index] = file;
        }
      }
    });

    // Create new Differential Pressure Form
    const newForm = await gelDocIGeneForm.create(
      {
        site_id: site_id,
        initiator_id: user.user_id,
        initiator_name: user.name,
        description: description,
        status: "Opened",
        stage: 1,
        department: department,
        compression_area: compression_area,
        limit: limit,
        reviewer_id: reviewer_id,
        approver_id: approver_id,
        initiatorAttachment: getElogDocsUrl(initiatorAttachment),
        additionalAttachment: getElogDocsUrl(additionalAttachment),
        initiatorComment: initiatorComment,
        additionalInfo: additionalInfo,
      },

      { transaction }
    );

    const auditTrailEntries = [];
    const fields = {
      description,
      department,
      compression_area,
      limit,
      reviewer: (await getUserById(reviewer_id))?.name,
      approver: (await getUserById(approver_id))?.name,
      initiatorComment,
      additionalInfo,
    };
    for (const [field, value] of Object.entries(fields)) {
      if (value !== undefined && value !== null && value !== "") {
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: field,
          previous_value: null,
          new_value: value,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
      }
    }

    if (initiatorAttachment) {
      auditTrailEntries.push({
        form_id: newForm.form_id,
        field_name: "initiatorAttachment",
        previous_value: null,
        new_value: getElogDocsUrl(initiatorAttachment),
        changed_by: user.user_id,
        previous_status: "Not Applicable",
        new_status: "Opened",
        declaration: initiatorDeclaration,
        action: "Opened",
      });
    }

    if (additionalAttachment) {
      auditTrailEntries.push({
        form_id: newForm.form_id,
        field_name: "additionalAttachment",
        previous_value: null,
        new_value: getElogDocsUrl(additionalAttachment),
        changed_by: user.user_id,
        previous_status: "Not Applicable",
        new_status: "Opened",
        declaration: initiatorDeclaration,
        action: "Opened",
      });
    }

    if (Array.isArray(UVvisCalibProcessRecords) && UVvisCalibProcessRecords?.length > 0) {
      const formRecords = UVvisCalibProcessRecords.map((record, index) => ({
        form_id: newForm?.form_id,
        date: record?.date,
        sample_name: record?.sample_name,
        reg_no: record?.reg_no,
        // method_used: record?.method_used,
        // parameter_or_activity: record?.parameter_or_activity,
        // column_no: record?.column_no,
        // start_time: record?.start_time,
        // end_time: record?.end_time,
        time: record?.time,
        // no_of_injections: record?.no_of_injections,
        done_by: record?.done_by,
        checked_by: record?.checked_by,
        reviewed_by: record?.reviewed_by,
        remarks: record?.remarks,
        remarksOther: record?.remarksOther,
        remarksType: record?.remarksType,
        remarksSubType: record?.remarksSubType,
        status:record?.status,
        supporting_docs: getElogDocsUrl(supportingDocs),
      }));

      await gelDocIGeneRecordss.bulkCreate(formRecords, { transaction });

      formRecords.forEach((record, index) => {
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: "Sample Name",
          previous_value: null,
          new_value: record?.sample_name,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: "Reg.No",
          previous_value: null,
          new_value: record?.reg_no,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        // auditTrailEntries.push({
        //   form_id: newForm.form_id,
        //   field_name: "Method Use",
        //   previous_value: null,
        //   new_value: record?.method_used,
        //   changed_by: user.user_id,
        //   previous_status: "Not Applicable",
        //   new_status: "Opened",
        //   declaration: initiatorDeclaration,
        //   action: "Opened",
        // });
        // auditTrailEntries.push({
        //   form_id: newForm.form_id,
        //   field_name: "Parameter or Activity",
        //   previous_value: null,
        //   new_value: record?.parameter_or_activity,
        //   changed_by: user.user_id,
        //   previous_status: "Not Applicable",
        //   new_status: "Opened",
        //   declaration: initiatorDeclaration,
        //   action: "Opened",
        // });
        // auditTrailEntries.push({
        //   form_id: newForm.form_id,
        //   field_name: "Column No",
        //   previous_value: null,
        //   new_value: record?.column_no,
        //   changed_by: user.user_id,
        //   previous_status: "Not Applicable",
        //   new_status: "Opened",
        //   declaration: initiatorDeclaration,
        //   action: "Opened",
        // });
        // auditTrailEntries.push({
        //   form_id: newForm.form_id,
        //   field_name: "Start Time",
        //   previous_value: null,
        //   new_value: record?.start_time,
        //   changed_by: user.user_id,
        //   previous_status: "Not Applicable",
        //   new_status: "Opened",
        //   declaration: initiatorDeclaration,
        //   action: "Opened",
        // });
        // auditTrailEntries.push({
        //   form_id: newForm.form_id,
        //   field_name: "End Time",
        //   previous_value: null,
        //   new_value: record?.end_time,
        //   changed_by: user.user_id,
        //   previous_status: "Not Applicable",
        //   new_status: "Opened",
        //   declaration: initiatorDeclaration,
        //   action: "Opened",
        // });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: "Time",
          previous_value: null,
          new_value: record?.time,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        // auditTrailEntries.push({
        //   form_id: newForm.form_id,
        //   field_name: "No Of Injections",
        //   previous_value: null,
        //   new_value: record?.no_of_injections,
        //   changed_by: user.user_id,
        //   previous_status: "Not Applicable",
        //   new_status: "Opened",
        //   declaration: initiatorDeclaration,
        //   action: "Opened",
        // });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: "Done By",
          previous_value: null,
          new_value: record.done_by,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: "Checked By",
          previous_value: null,
          new_value: record.checked_by,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: "Remarks",
          previous_value: null,
          new_value: record?.remarks,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: "Status",
          previous_value: null,
          new_value: record?.status,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: "Remarks Other",
          previous_value: null,
          new_value: record?.remarksOther,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: "Remarks Type",
          previous_value: null,
          new_value: record?.remarksType,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        auditTrailEntries.push({
          form_id: newForm.form_id,
          field_name: "Remarks Sub Type",
          previous_value: null,
          new_value: record?.remarksSubType,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Opened",
        });
        if (supportingDocs[index]) {
          auditTrailEntries.push({
            form_id: newForm.form_id,
            field_name: "SupportingDocs",
            previous_value: null,
            new_value: getElogDocsUrl(supportingDocs),
            changed_by: user.user_id,
            previous_status: "Not Applicable",
            new_status: "Opened",
            declaration: initiatorDeclaration,
            action: "Opened",
          });
        }
      });
    }

    await gelDocIGeneAuditTrail.bulkCreate(auditTrailEntries, {
      transaction,
    });

    await transaction.commit();
    return res.status(200).json({
      error: false,
      message: "E-log Created successfully",
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    let errorMessage = "Error during creating elog";
    if (error instanceof ValidationError) {
      errorMessage = error.errors.map((e) => e.message).join(", ");
    }

    return res.status(500).json({
      error: true,
      message: `${errorMessage}: ${error.message}`,
    });
  }
};

// edit differential pressure elog details
exports.Edit = async (req, res) => {
  const {
    form_id,
    site_id,
    description,
    department,
    compression_area,
    limit,
    reviewer_id,
    approver_id,
    gelDocIGeneRecords,
    email,
    password,
    initiatorComment,
    initiatorDeclaration,
    additionalInfo,
  } = req.body;

  if (!form_id || !email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide form ID, email and password." });
  }

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne({
      where: { user_id: req.user.userId, isActive: true },
      transaction,
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      await transaction.rollback();
      return res.status(401).json({ error: true, message: "Invalid e-signature." });
    }

    let initiatorAttachment = null;
    let additionalAttachment = null;
    const supportingDocs = {};

    req.files?.forEach((file) => {
      if (file.fieldname === "initiatorAttachment") {
        initiatorAttachment = file;
      } else if (file.fieldname === "additionalAttachment") {
        additionalAttachment = file;
      } else {
        const match = file.fieldname.match(/gelDocIGeneRecords\[(\d+)\]\[supporting_docs\]/);
        if (match) {
          const index = parseInt(match[1]);
          supportingDocs[index] = file;
        }
      }
    });

    const form = await gelDocIGeneForm.findOne({ where: { form_id }, transaction });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "Form not found." });
    }

    const EPSILON = 0.000001;
    const areFloatsEqual = (a, b) => Math.abs(a - b) < EPSILON;

    const auditTrailEntries = [];
    const updatedFields = {
      description,
      department,
      compression_area,
      limit,
      initiatorComment,
      initiatorAttachment: initiatorAttachment
        ? getElogDocsUrl(initiatorAttachment)
        : form.initiatorAttachment,
      additionalAttachment: additionalAttachment
        ? getElogDocsUrl(additionalAttachment)
        : form.additionalAttachment,
      additionalInfo,
    };

    for (const [field, newValue] of Object.entries(updatedFields)) {
      const oldValue = form[field];
      if (
        newValue !== undefined &&
        ((typeof newValue === "number" && !areFloatsEqual(oldValue, newValue)) ||
          oldValue != newValue)
      ) {
        auditTrailEntries.push({
          form_id,
          field_name: field,
          previous_value: oldValue || null,
          new_value: newValue,
          changed_by: user.user_id,
          previous_status: form.status,
          new_status: "Opened",
          declaration: initiatorDeclaration,
          action: "Update Elog",
        });
      }
    }

    await form.update(
      {
        site_id,
        description,
        department,
        compression_area,
        limit,
        reviewer_id,
        approver_id,
        initiatorAttachment: getElogDocsUrl(initiatorAttachment),
        additionalAttachment: getElogDocsUrl(additionalAttachment),
        initiatorComment,
        additionalInfo,
      },
      { transaction }
    );

    const existingRecords = await gelDocIGeneRecordss.findAll({
      where: { form_id },
      transaction,
    });

    const existingMap = {};
    existingRecords.forEach((rec) => {
      existingMap[rec.record_id] = rec;
    });

    for (let i = 0; i < gelDocIGeneRecords?.length; i++) {
      const record = gelDocIGeneRecords[i];
      const record_id = record.record_id || null;
      const file = supportingDocs[i];

      const supporting_docs_url = file
        ? getElogDocsUrl(file)
        : existingMap[record_id]?.supporting_docs || null;

      const newData = {
        form_id,
        date: record.date,
        sample_name: record.sample_name,
        reg_no: record.reg_no,
        // method_used: record.method_used,
        // parameter_or_activity: record?.parameter_or_activity,
        // column_no: record?.column_no,
        // start_time: record?.start_time,
        // end_time: record.end_time,
        time: record.time,
        // no_of_injections: record.no_of_injections,
        done_by: record?.done_by,
        reviewed_by: record?.reviewed_by,
        remarks: record?.remarks,
        status: record?.status,
        remarksOther: record?.remarksOther,
        remarksType: record?.remarksType,
        remarksSubType: record?.remarksSubType,
        supporting_docs: supporting_docs_url,
      };

      if (record_id && existingMap[record_id]) {
        await gelDocIGeneRecordss.update(newData, {
          where: { record_id },
          transaction,
        });

        for (const [field, newValue] of Object.entries(newData)) {
          const oldValue = existingMap[record_id][field];
          if (
            newValue !== undefined &&
            ((typeof newValue === "number" && !areFloatsEqual(oldValue, newValue)) ||
              oldValue != newValue)
          ) {
            auditTrailEntries.push({
              form_id,
              field_name: `${field}[${i}]`,
              previous_value: oldValue || null,
              new_value: newValue,
              changed_by: user.user_id,
              previous_status: form.status,
              new_status: "Opened",
              declaration: initiatorDeclaration,
              action: "Update Elog",
            });
          }
        }
      } else {
        const created = await gelDocIGeneRecordss.create(newData, { transaction });

        for (const [field, newValue] of Object.entries(newData)) {
          if (field !== "form_id") {
            auditTrailEntries.push({
              form_id,
              field_name: `${field}[${i}]`,
              previous_value: null,
              new_value: newValue,
              changed_by: user.user_id,
              previous_status: form.status,
              new_status: "Opened",
              declaration: initiatorDeclaration,
              action: "Update Elog",
            });
          }
        }
      }
    }

    const validAuditEntries = auditTrailEntries.filter((entry) => {
      return (
        entry.new_value !== null &&
        entry.new_value !== "" &&
        entry.new_value !== undefined
      );
    });

    if (validAuditEntries?.length > 0) {
      await gelDocIGeneAuditTrail.bulkCreate(validAuditEntries, { transaction });
    }

    await transaction.commit();
    return res.status(200).json({
      error: false,
      message: "E-log Updated successfully",
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      error: true,
      message: `Error during updating elog: ${error.message}`,
    });
  }
};

//deleting attachment
exports.deleteAttachment = async (req, res) => {
  const { record_id } = req.params;

  if (!record_id) {
    return res.status(400).json({ error: true, message: "Record ID is required." });
  }

  try {
    const record = await gelDocIGeneRecordss.findOne({ where: { record_id } });

    if (!record) {
      return res.status(404).json({ error: true, message: "Record not found." });
    }

    if (!record.supporting_docs) {
      return res.status(400).json({ error: true, message: "No attachment to delete." });
    }

    await gelDocIGeneRecordss.update(
      { supporting_docs: null },
      { where: { record_id } }
    );

    return res.status(200).json({
      error: false,
      message: "Attachment deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal server error: " + error.message,
    });
  }
};
//get a differential pressure elog by id
exports.GetElog = async (req, res) => {
  const form_id = req.params.id;

  if (!form_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a form ID." });
  }

  gelDocIGeneForm
    .findOne({
      where: {
        form_id: form_id,
      },
      include: [
        {
          model: gelDocIGeneRecordss,
        },
      ],
    })
    .then((result) => {
      res.json({
        error: false,
        message: result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: true,
        message: error.message,
      });
    });
};

//get all the differential pressure elogs
exports.GetAllElog = async (req, res) => {
  gelDocIGeneForm
    .findAll({
      include: [
        {
          model: gelDocIGeneRecordss,
        },
        {
          model: User,
          as: "reviewerss10", // Use the consistent alias 'reviewer'
          attributes: ["user_id", "name"], // Specify which user attributes to fetch (optional)
        },
        {
          model: User,
          as: "approverss10", // Use the consistent alias 'approver'
          attributes: ["user_id", "name"], // Specify which user attributes to fetch (optional)
        },
      ],
      order: [["form_id", "DESC"]],
    })
    .then((result) => {
      res.json({
        error: false,
        message: result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: true,
        message: error.message,
      });
    });
};

//send differential pressure elog for review
exports.SendElogForReview = async (req, res) => {
  const { form_id, email, password, initiatorDeclaration, initiatorComment } =
    req.body;

  // Check for required fields and provide specific error messages
  if (!form_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a form ID." });
  }
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email and password." });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Verify user credentials
    const user = await User.findOne({
      where: { user_id: req.user.userId, isActive: true },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    // Find the form
    const form = await gelDocIGeneForm.findOne({
      where: { form_id },
      transaction,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "Elog not found." });
    }

    // if (form.stage !== 1) {
    //   await transaction.rollback();
    //   return res.status(400).json({
    //     error: true,
    //     message: "Elog is not in a valid stage to be sent for review.",
    //   });
    // }

    const auditTrailEntries = [];
    let initiatorAttachment = null;
    let additionalAttachment = null;
    // Process files
    req?.files?.forEach((file) => {
      if (file.fieldname === "initiatorAttachment") {
        initiatorAttachment = file;
      } else if (file.fieldname === "additionalAttachment") {
        additionalAttachment = file;
      }
    });
    // Add audit trail entry for the attachment if it exists
    if (initiatorAttachment) {
      auditTrailEntries.push({
        form_id: form.form_id,
        field_name: "initiatorAttachment",
        previous_value: form.initiatorAttachment || null,
        new_value: getElogDocsUrl(initiatorAttachment),
        changed_by: user.user_id,
        previous_status: "Opened",
        new_status: "Under Review",
        declaration: initiatorDeclaration,
        action: "Send For Review",
      });
    }

    if (additionalAttachment) {
      auditTrailEntries.push({
        form_id: form.form_id,
        field_name: "additionalAttachment",
        previous_value: form.additionalAttachment || null,
        new_value: getElogDocsUrl(additionalAttachment),
        changed_by: user.user_id,
        previous_status: "Opened",
        new_status: "Under Review",
        declaration: initiatorDeclaration,
        action: "Send For Review",
      });
    }

    auditTrailEntries.push({
      form_id: form.form_id,
      field_name: "stage Change",
      previous_value: "Not Applicable",
      new_value: "Not Applicable",
      changed_by: user.user_id,
      previous_status: "Opened",
      new_status: "Under Review",
      declaration: initiatorDeclaration,
      action: "Send For Review",
    });

    // Update the form details
    await form.update(
      {
        status: "Under Review",
        stage: 2,
        initiatorComment: initiatorComment,
        initiatorAttachment: getElogDocsUrl(initiatorAttachment),
        additionalAttachment: getElogDocsUrl(additionalAttachment),
      },
      { transaction }
    );

    // Insert audit trail entries
    await gelDocIGeneAuditTrail.bulkCreate(auditTrailEntries, {
      transaction,
    });

    // Commit the transaction
    await transaction.commit();

    return res.status(200).json({
      error: false,
      message: "E-log successfully sent for review",
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    return res.status(500).json({
      error: true,
      message: `Error during sending E-log for review: ${error.message}`,
    });
  }
};

// change status of differential pressure elog from review to open
exports.SendElogfromReviewToOpen = async (req, res) => {
  const { form_id, email, password, reviewerDeclaration } = req.body;

  // Check for required fields and provide specific error messages
  if (!form_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a form ID." });
  }
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email and password." });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Verify user credentials
    const user = await User.findOne({
      where: { user_id: req.user.userId, email, isActive: true },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    // Find the form
    const form = await gelDocIGeneForm.findOne({
      where: { form_id },
      transaction,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "Elog not found." });
    }

    if (form.stage !== 2) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Elog is not in a valid stage.",
      });
    }

    const auditTrailEntries = [];

    // Add audit trail entry for the attachment if it exists
    if (req?.file) {
      auditTrailEntries.push({
        form_id: form.form_id,
        field_name: "reviewerAttachment",
        previous_value: form.reviewerAttachment || null,
        new_value: getElogDocsUrl(req.file),
        changed_by: user.user_id,
        previous_status: "Under Review",
        new_status: "Opened",
        declaration: reviewerDeclaration,
        action: "Open Elog",
      });
    }

    auditTrailEntries.push({
      form_id: form.form_id,
      field_name: "stage Change",
      previous_value: "Not Applicable",
      new_value: "Not Applicable",
      changed_by: user.user_id,
      previous_status: "Under Review",
      new_status: "Opened",
      declaration: reviewerDeclaration,
      action: "Open Elog",
    });

    // Update the form details
    await form.update(
      {
        status: "Opened",
        stage: 1,
        reviewerAttachment: getElogDocsUrl(req?.file),
      },
      { transaction }
    );

    // Insert audit trail entries
    await gelDocIGeneAuditTrail.bulkCreate(auditTrailEntries, {
      transaction,
    });

    // Commit the transaction
    await transaction.commit();

    // try {
    //   const initiator = await getUserById(form.initiator_id);
    //   // Send emails
    //   await Mailer.sendEmail("reminderInitiator", {
    //     initiatorName: initiator.name,
    //     dateOfInitiation: new Date().toISOString().split("T")[0],
    //     description: form.description,
    //     status: "Opened",
    //     recipients: initiator.email,
    //   });

    return res.status(200).json({
      error: false,
      message: "E-log status successfully changed from review to Opened",
    });
    // } catch (emailError) {
    //   console.error("Failed to send emails:", emailError.message);
    //   return res.json({
    //     error: true,
    //     message: "E-log Created but failed to send emails.",
    //   });
    // }
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    return res.status(500).json({
      error: true,
      message: `Error during changing stage of elog: ${error.message}`,
    });
  }
};

// send differential pressure elog from review to approval
exports.SendfromReviewToApproval = async (req, res) => {
  const { form_id, reviewComment, email, password, reviewerDeclaration } =
    req.body;

  // Check for required fields and provide specific error messages
  if (!form_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a form ID." });
  }
  if (!reviewComment) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a review comment." });
  }
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email and password." });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Verify user credentials
    const user = await User.findOne({
      where: { user_id: req.user.userId, email, isActive: true },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    // Find the form
    const form = await gelDocIGeneForm.findOne({
      where: { form_id },
      transaction,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "Elog not found." });
    }

    if (form.stage !== 2) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Elog is not in a valid stage to be sent for approval.",
      });
    }

    const auditTrailEntries = [];

    if (reviewComment) {
      auditTrailEntries.push({
        form_id: form.form_id,
        field_name: "reviewComment",
        previous_value: form.reviewComment || null,
        new_value: reviewComment,
        changed_by: user.user_id,
        previous_status: "Under Review",
        new_status: "Under Approval",
        declaration: reviewerDeclaration,
        action: "Send For Approval",
      });
    }

    // Add audit trail entry for the attachment if it exists
    if (req?.file) {
      auditTrailEntries.push({
        form_id: form.form_id,
        field_name: "reviewerAttachment",
        previous_value: form.reviewerAttachment || null,
        new_value: getElogDocsUrl(req.file),
        changed_by: user.user_id,
        previous_status: "Under Review",
        new_status: "Under Approval",
        declaration: reviewerDeclaration,
        action: "Send For Approval",
      });
    }

    auditTrailEntries.push({
      form_id: form.form_id,
      field_name: "stage Change",
      previous_value: "Not Applicable",
      new_value: "Not Applicable",
      changed_by: user.user_id,
      previous_status: "Under Review",
      new_status: "Under Approval",
      declaration: reviewerDeclaration,
      action: "Send For Approval",
    });

    // Update the form details
    await form.update(
      {
        status: "Under Approval",
        stage: 3,
        reviewComment: reviewComment,
        reviewerAttachment: req?.file
          ? getElogDocsUrl(req.file)
          : form.reviewerAttachment,
        date_of_review: new Date(),
      },
      { transaction }
    );

    // Insert audit trail entries
    await gelDocIGeneAuditTrail.bulkCreate(auditTrailEntries, {
      transaction,
    });

    // Commit the transaction
    await transaction.commit();

    // try {
    //   const approver = await getUserById(form.approver_id);
    //   // Send emails
    //   await Mailer.sendEmail("reminderApprover", {
    //     approverName: approver.name,
    //     dateOfInitiation: new Date().toISOString().split("T")[0],
    //     description: form.description,
    //     reviewer: user.name,
    //     status: "Under Approval",
    //     recipients: approver.email,
    //   });

    return res.status(200).json({
      error: false,
      message:
        "E-log status successfully changed from review to under-approval",
    });
    // } catch (emailError) {
    //   console.error("Failed to send emails:", emailError.message);
    //   return res.json({
    //     error: true,
    //     message: "E-log Created but failed to send emails.",
    //   });
    // }
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    return res.status(500).json({
      error: true,
      message: `Error during sending E-log for approval: ${error.message}`,
    });
  }
};

// send differential pressure elog from under approval to open
exports.SendfromApprovalToOpen = async (req, res) => {
  const { form_id, email, password, approverDeclaration } = req.body;

  // Check for required fields and provide specific error messages
  if (!form_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a form ID." });
  }
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email and password." });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Verify user credentials
    const user = await User.findOne({
      where: { user_id: req.user.userId, email, isActive: true },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    // Find the form
    const form = await gelDocIGeneForm.findOne({
      where: { form_id },
      transaction,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "Elog not found." });
    }

    if (form.stage !== 3) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Elog is not in a valid stage.",
      });
    }

    const auditTrailEntries = [];

    // Add audit trail entry for the attachment if it exists
    if (req?.file) {
      auditTrailEntries.push({
        form_id: form.form_id,
        field_name: "approverAttachment",
        previous_value: form.approverAttachment || null,
        new_value: getElogDocsUrl(req.file),
        changed_by: user.user_id,
        previous_status: "Under Approval",
        new_status: "Under Review",
        declaration: approverDeclaration,
        action: "Open Elog",
      });
    }

    auditTrailEntries.push({
      form_id: form.form_id,
      field_name: "stage Change",
      previous_value: "Not Applicable",
      new_value: "Not Applicable",
      changed_by: user.user_id,
      previous_status: "Under Approval",
      new_status: "Under Review",
      declaration: approverDeclaration,
      action: "Open Elog",
    });

    // Update the form details
    await form.update(
      {
        status: "Under Review",
        stage: 2,
        approverAttachment: getElogDocsUrl(req?.file),
      },
      { transaction }
    );

    // Insert audit trail entries
    await gelDocIGeneAuditTrail.bulkCreate(auditTrailEntries, {
      transaction,
    });

    // Commit the transaction
    await transaction.commit();

    // try {
    //   const initiator = await getUserById(form.initiator_id);
    //   // Send emails
    //   await Mailer.sendEmail("reminderInitiator", {
    //     initiatorName: initiator.name,
    //     dateOfInitiation: new Date().toISOString().split("T")[0],
    //     description: form.description,
    //     status: "Opened",
    //     recipients: initiator.email,
    //   });

    return res.status(200).json({
      error: false,
      message:
        "E-log status successfully changed from under-approval to under-review",
    });
    // } catch (emailError) {
    //   console.error("Failed to send emails:", emailError.message);
    //   return res.json({
    //     error: true,
    //     message: "E-log Created but failed to send emails.",
    //   });
    // }
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    return res.status(500).json({
      error: true,
      message: `Error during changing stage of elog: ${error.message}`,
    });
  }
};

// APPROVE differential pressure elog
exports.ApproveElog = async (req, res) => {
  const { form_id, approverComment, email, password, approverDeclaration } =
    req.body;

  // Check for required fields and provide specific error messages
  if (!form_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a form ID." });
  }
  if (!approverComment) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide an approver comment." });
  }
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email and password." });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Verify user credentials
    const user = await User.findOne({
      where: { user_id: req.user.userId, email, isActive: true },
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password." });
    }

    // Find the form
    const form = await gelDocIGeneForm.findOne({
      where: { form_id },
      transaction,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "Elog not found." });
    }

    if (form.stage !== 3) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Elog is not in a valid stage.",
      });
    }

    const auditTrailEntries = [];

    if (approverComment) {
      auditTrailEntries.push({
        form_id: form.form_id,
        field_name: "approverComment",
        previous_value: form.approverComment || null,
        new_value: approverComment,
        changed_by: user.user_id,
        previous_status: "Under Approval",
        new_status: "Closed",
        declaration: approverDeclaration,
        action: "Closed",
      });
    }

    // Add audit trail entry for the attachment if it exists
    if (req?.file) {
      auditTrailEntries.push({
        form_id: form.form_id,
        field_name: "approverAttachment",
        previous_value: form.approverAttachment || null,
        new_value: getElogDocsUrl(req.file),
        changed_by: user.user_id,
        previous_status: "Under Approval",
        new_status: "Closed",
        declaration: approverDeclaration,
        action: "Closed",
      });
    }

    auditTrailEntries.push({
      form_id: form.form_id,
      field_name: "stage Change",
      previous_value: "Not Applicable",
      new_value: "Not Applicable",
      changed_by: user.user_id,
      previous_status: "Under Approval",
      new_status: "Closed",
      declaration: approverDeclaration,
      action: "Closed",
    });

    // Update the form details
    await form.update(
      {
        status: "Closed",
        stage: 4,
        approverComment: approverComment,
        approverAttachment: req?.file
          ? getElogDocsUrl(req.file)
          : form.approverAttachment,
        date_of_approval: new Date(),
      },
      { transaction }
    );

    // Insert audit trail entries
    await gelDocIGeneAuditTrail.bulkCreate(auditTrailEntries, {
      transaction,
    });

    // Commit the transaction
    await transaction.commit();

    return res.status(200).json({
      error: false,
      message: "E-log successfully closed",
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    return res.status(500).json({
      error: true,
      message: `Error approving elog: ${error.message}`,
    });
  }
};

// get users based on roles, sites and processes
exports.GetUserOnBasisOfRoleGroup = async (req, res) => {
  const { role_id, site_id, process_id } = req.body;

  try {
    // Fetch users based on role, site, and process
    const selectedUsers = await UserRole.findAll({
      where: {
        [Op.or]: [
          { role_id: role_id, process_id: process_id, site_id: site_id },
          { role_id: 5, process_id: process_id, site_id: site_id },
        ],
      },
      include: {
        model: User,
        where: { isActive: true },
      },
    });

    // Send the response with the fetched users
    return res.status(200).json({
      error: false,
      message: selectedUsers,
    });
  } catch (error) {
    // Catch any errors and send an appropriate response
    console.error("Error fetching users:", error);
    return res.status(500).json({
      error: true,
      message: `Error fetching users: ${error.message}`,
    });
  }
};

exports.getAllProcesses = async (req, res) => {
  Process.findAll()
    .then((result) => {
      res.json({
        error: false,
        message: result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: true,
        message: "Couldn't find processes " + error,
      });
    });
};

exports.getAuditTrailForAnElog = async (req, res) => {
  try {
    // Extract form_id from request parameters
    const formId = req.params.id;

    // Check if form_id is provided
    if (!formId) {
      return res
        .status(400)
        .json({ error: true, message: "Form ID is required." });
    }

    // Find all audit trail entries for the given form_id
    const auditTrail = await gelDocIGeneAuditTrail.findAll({
      where: { form_id: formId },
      include: {
        model: User,
        attributes: ["user_id", "name"],
      },
      order: [["auditTrail_id", "DESC"]],
    });

    if (!auditTrail || auditTrail.length === 0) {
      return res.status(404).json({
        error: true,
        message: "No audit trail found for the given form ID.",
      });
    }

    return res.status(200).json({ error: false, auditTrail });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: `Error retrieving audit trail: ${error.message}`,
    });
  }
};

exports.generateReport = async (req, res) => {
  try {
    let reportData = req.body.reportData;

    const date = new Date();
    const formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Specify using 24-hour format
    });

    // Render HTML using EJS template
    const html = await new Promise((resolve, reject) => {
      res.render("report", { reportData }, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const logoPath = path.join(__dirname, "../public/vidyalogo.png.png");
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");
    const logoDataUri = `data:image/png;base64,${logoBase64}`;

    const user = await getUserById(req.user.userId);

    // Set HTML content
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: await new Promise((resolve, reject) => {
        req.app.render(
          "header",
          { reportData: reportData, logoDataUri: logoDataUri },
          (err, html) => {
            if (err) return reject(err);
            resolve(html);
          }
        );
      }),

      footerTemplate: await new Promise((resolve, reject) => {
        req.app.render(
          "footer",
          { userName: user?.name, date: formattedDate },
          (err, html) => {
            if (err) return reject(err);
            resolve(html);
          }
        );
      }),
      margin: {
        top: "120px",
        bottom: "60px",
        right: "30px",
        left: "30px",
      },
    });

    // Close the browser
    await browser.close();

    // Set response headers and send PDF
    res.set("Content-Type", "application/pdf");
    res.send(pdf);
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res
      .status(500)
      .json({ error: true, message: `Error generating PDF: ${error.message}` });
  }
};
const removeHtmlTags = (htmlString) => {
  return htmlString.replace(/<\/?[^>]+(>|$)/g, ""); // Removes all tags
};
exports.chatByPdf = async (req, res) => {
  try {
    const reportData = req.body.reportData;

    const formId = req.params.form_id;
    reportData.description = removeHtmlTags(reportData.description);

    const date = new Date();
    const formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Specify using 24-hour format
    });

    // Render HTML using EJS template
    const html = await new Promise((resolve, reject) => {
      req.app.render("hplc", { reportData }, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const logoPath = path.join(__dirname, "../public/vidyalogo.png.png");
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");
    const logoDataUri = `data:image/png;base64,${logoBase64}`;

    const user = await getUserById(req.user.userId);

    // Set HTML content
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: await new Promise((resolve, reject) => {
        req.app.render(
          "header",
          { reportData: reportData, logoDataUri: logoDataUri },
          (err, html) => {
            if (err) return reject(err);
            resolve(html);
          }
        );
      }),

      footerTemplate: await new Promise((resolve, reject) => {
        req.app.render(
          "footer",
          { userName: user?.name, date: formattedDate },
          (err, html) => {
            if (err) return reject(err);
            resolve(html);
          }
        );
      }),
      margin: {
        top: "150px",
        right: "50px",
        bottom: "50px",
        left: "50px",
      },
    });

    // Close the browser
    await browser.close();

    // Generate a unique UUID
    // const uniqueId = uuidv4();
    const filePath = path.resolve("public", `HP_Elog_Report_${formId}.pdf`);
    fs.writeFileSync(filePath, pdf);

    res.status(200).json({ filename: `HP_Elog_Report_${formId}.pdf` });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res
      .status(500)
      .json({ error: true, message: `Error generating PDF: ${error.message}` });
  }
};
exports.viewReport = async (req, res) => {
  try {
    let reportData = req.body.reportData;
    // Render HTML using EJS template
    req.app.render("hplc", { reportData }, (err, html) => {
      if (err) {
        console.error("Error rendering HTML:", err);
        return res.status(500).send("Error rendering HTML", err);
      }
      res.send(html);
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res
      .status(500)
      .json({ error: true, message: `Error generating PDF: ${error.message}` });
  }
};
exports.effetiveChatByPdf = async (req, res) => {
  try {
    const reportData = req.body.reportData;
    const formId = req.params.form_id;
    reportData.addtionalInfo = reportData?.addtionalInfo
      ? removeHtmlTags(reportData?.addtionalInfo)
      : "Not Applicable";

    const date = new Date();
    const formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Specify using 24-hour format
    });

    // Render HTML using EJS template
    const html = await new Promise((resolve, reject) => {
      req.app.render("effectiveHPReport", { reportData }, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const logoPath = path.join(__dirname, "../public/ipc.png.png");
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");
    const logoDataUri = `data:image/png;base64,${logoBase64}`;

    const user = await getUserById(req.user.userId);

    // Set HTML content
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: await new Promise((resolve, reject) => {
        req.app.render(
          "header",
          { reportData: reportData, logoDataUri: logoDataUri },
          (err, html) => {
            if (err) return reject(err);
            resolve(html);
          }
        );
      }),

      footerTemplate: await new Promise((resolve, reject) => {
        req.app.render(
          "footer",
          { userName: user?.name, date: formattedDate },
          (err, html) => {
            if (err) return reject(err);
            resolve(html);
          }
        );
      }),
      margin: {
        top: "180px",
        bottom: "50px",
        left: "30px",
        right: "30px",
      },
    });

    // Close the browser
    await browser.close();
    // const uniqueId = uuidv4();

    const filePath = path.resolve(
      "public",
      `HPEffective_Elog_Report_${formId}.pdf`
    );
    fs.writeFileSync(filePath, pdf);

    res.status(200).json({ filename: `HPEffective_Elog_Report_${formId}.pdf` });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res
      .status(500)
      .json({ error: true, message: `Error generating PDF: ${error.message}` });
  }
};
exports.effetiveViewReport = async (req, res) => {
  try {
    let reportData = req.body.reportData;
    // Render HTML using EJS template
    req.app.render("effectiveHPReport", { reportData }, (err, html) => {
      if (err) {
        console.error("Error rendering HTML:", err);
        return res.status(500).send("Error rendering HTML", err);
      }
      res.send(html);
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res
      .status(500)
      .json({ error: true, message: `Error generating PDF: ${error.message}` });
  }
};
exports.blankReport = async (req, res) => {
  try {
    let reportData = req.body.reportData;
    const formId = req.params.form_id;
    // reportData.title = "RUSOMA LABORATORIES PRIVATE LIMITED";

    const date = new Date();
    const formattedDate = date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Specify using 24-hour format
    });

    const blankRows = Array(reportData?.blankRows);

    const data = reportData?.hplcRecords?.map((record) => ({
      s_no: record?.s_no || "",
      date: record?.date || "",
      sample_name: record?.sample_name || "",
      reg_no: record?.reg_no || "",
      method_used: record?.method_used || "",
      parameter_or_activity: record?.parameter_or_activity || "",
      column_no: record?.column_no || "",
      start_time: record?.start_time || "",
      end_time: record?.end_time || "",
      no_of_injections: record?.no_of_injections || "",
      done_by: record?.done_by || "",
      checked_by: record?.checked_by || "",
      reviewed_by: record?.reviewed_by || "",
      remarks: record?.remarks || "",
      status: record?.status || "",
    }));

    const arrayData = [...data, ...blankRows];
    // Render HTML using EJS template
    const html = await new Promise((resolve, reject) => {
      req.app.render("blankHPReport", { arrayData }, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const logoPath = path.join(__dirname, "../public/vidyalogo.png.png");
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");
    const logoDataUri = `data:image/png;base64,${logoBase64}`;

    const user = await getUserById(req.user.userId);

    // Set HTML content
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: await new Promise((resolve, reject) => {
        req.app.render(
          "header",
          { reportData: reportData, logoDataUri: logoDataUri },
          (err, html) => {
            if (err) return reject(err);
            resolve(html);
          }
        );
      }),

      footerTemplate: await new Promise((resolve, reject) => {
        req.app.render(
          "footer",
          { userName: user?.name, date: formattedDate },
          (err, html) => {
            if (err) return reject(err);
            resolve(html);
          }
        );
      }),
      margin: {
        top: "120px",
        right: "50px",
        bottom: "50px",
        left: "50px",
      },
    });

    // Close the browser
    await browser.close();

    const filePath = path.resolve("public", `HP_Elog_Report_${formId}.pdf`);
    fs.writeFileSync(filePath, pdf);

    res.status(200).json({ filename: `HP_Elog_Report_${formId}.pdf` });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res
      .status(500)
      .json({ error: true, message: `Error generating PDF: ${error.message}` });
  }
};
// // exports.GetAll = async (req, res) => {
// //   try {
// //     const { search } = req.query; // Capture search keyword from query parameters

// //     const searchCondition = search
// //       ? {
// //           [Op.or]: [
// //             { site_id: { [Op.like]: `%${search}%` } }, // Example: Search by name
// //             { form_id: { [Op.like]: `%${search}%` } }, // Example: Search by form_id
// //             { initiator_name: { [Op.like]: `%${search}%` } }, // Example: Search by initiator_name
// //           ],
// //         }
// //       : {};

// //     // Use Promise.all to run all queries concurrently
// //     const [
// //       differentialPressureForms,
// //       dispenseOfMaterialForms,
// //       loadedQuantityForms,
// //       mediaRecordForms,
// //       operationOfSterilizerForms,
// //       temperatureForms,
// //     ] = await Promise.all([
// //       gelDocIGeneForm.findAll({
// //         where: searchCondition,
// //         include: [
// //           { model: gelDocIGeneRecordss },
// //           { model: User, as: "reviewers", attributes: ["user_id", "name"] },
// //           { model: User, as: "approvers", attributes: ["user_id", "name"] },
// //         ],
// //         order: [["form_id", "DESC"]],
// //       }),
// //       DispenseOfMaterialForm.findAll({
// //         where: searchCondition,
// //         include: [
// //           { model: DispenseOfMaterialRecord },
// //           { model: User, as: "reviewers", attributes: ["user_id", "name"] },
// //           { model: User, as: "approvers", attributes: ["user_id", "name"] },
// //         ],
// //         order: [["form_id", "DESC"]],
// //       }),
// //       LoadedQuantityProcessForm.findAll({
// //         where: searchCondition,
// //         include: [
// //           { model: LoadedQuantityRecord },
// //           { model: User, as: "reviewers", attributes: ["user_id", "name"] },
// //           { model: User, as: "approvers", attributes: ["user_id", "name"] },
// //         ],
// //         order: [["form_id", "DESC"]],
// //       }),
// //       MediaRecordProcessForm.findAll({
// //         where: searchCondition,
// //         include: [
// //           { model: MediaRecord },
// //           { model: User, as: "reviewers", attributes: ["user_id", "name"] },
// //           { model: User, as: "approvers", attributes: ["user_id", "name"] },
// //         ],
// //         order: [["form_id", "DESC"]],
// //       }),
// //       OperationOfSterilizerProcessForm.findAll({
// //         where: searchCondition,
// //         include: [
// //           { model: OperationOfSterilizerRecord },
// //           { model: User, as: "reviewers", attributes: ["user_id", "name"] },
// //           { model: User, as: "approvers", attributes: ["user_id", "name"] },
// //         ],
// //         order: [["form_id", "DESC"]],
// //       }),
// //       TempratureProcessForm.findAll({
// //         where: searchCondition,
// //         include: [
// //           { model: TempratureProcessRecord },
// //           { model: User, as: "tpreviewer", attributes: ["user_id", "name"] },
// //           { model: User, as: "tpapprover", attributes: ["user_id", "name"] },
// //         ],
// //         order: [["form_id", "DESC"]],
// //       }),
// //     ]);

// //     // Combine all results into a single object
// //     const data = {
// //       differentialPressureForms,
// //       dispenseOfMaterialForms,
// //       loadedQuantityForms,
// //       mediaRecordForms,
// //       operationOfSterilizerForms,
// //       temperatureForms,
// //     };

// //     return res.status(200).json({
// //       error: false,
// //       message: "Data fetched successfully",
// //       data: data,
// //     });
// //   } catch (error) {
// //     console.error("Error:", error);
// //     return res
// //       .status(500)
// //       .json({ error: true, message: `Error: ${error.message}` });
// //   }
// // };

exports.sendReportOnMail = async (req, res) => {
  const { to, cc, bcc, subject, message } = req.body;
  const elogId = req.params.id;
  console.log(elogId, "elogId");

  const filePath = path.resolve("public", elogId);

  const fileExists = fs.existsSync(filePath);
  console.log(fileExists, "fileExists");
  if (!fileExists) {
    return res.status(404).json({
      status: 404,
      error: true,
      message: "Attachment file not found",
    });
  }

  const attachments = req.files?.map((file) => ({
    filename: file.originalname,
    path: file.path,
  }));

  const additionalAttachments = [
    {
      filename: `Elog_Report_${elogId}.pdf`,
      path: filePath,
    },
    ...attachments,
  ];

  const mailData = {
    to: to,
    cc: cc || undefined,
    bcc: bcc || undefined,
    subject: subject,
    message: message,
    additionalAttachments,
  };

  try {
    const result = await sendEmail(mailData);
    return res.status(200).json({
      status: 200,
      error: false,
      message: "Report email sent successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: true,
      message: `Internal Server Error${error}`,
    });
  }
};

// exports.generateAuditPdfbyId = async (req, res) => {
//   const { formId, type, userId } = req.params;
//   const date = new Date();
//   const formattedDate = date.toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//   });
//   let browser;

//   const user = await getUserById(userId);

//   try {
//     let getData;

//     switch (type) {
//       case "gelDocIGeneAuditTrail":
//         getData = await gelDocIGeneAuditTrail.findAll({
//           where: { form_id: formId },
//           include: {
//             model: User,
//             attributes: ["user_id", "name"],
//           },
//           order: [["auditTrail_id", "DESC"]],
//         });
//         break;

//       case "DispenseOfMatrialAuditTrail":
//         getData = await DispenseOfMatrialAuditTrail.findAll({
//           where: { form_id: formId },
//           include: {
//             model: User,
//             attributes: ["user_id", "name"],
//           },
//           order: [["auditTrail_id", "DESC"]],
//         });
//         break;

//       case "LoadedQuantityProcessAuditTrail":
//         getData = await LoadedQuantityProcessAuditTrail.findAll({
//           where: { form_id: formId },
//           include: {
//             model: User,
//             attributes: ["user_id", "name"],
//           },
//           order: [["auditTrail_id", "DESC"]],
//         });
//         break;

//       case "MediaRecordAuditTrail":
//         getData = await MediaRecordAuditTrail.findAll({
//           where: { form_id: formId },
//           include: {
//             model: User,
//             attributes: ["user_id", "name"],
//           },
//           order: [["auditTrail_id", "DESC"]],
//         });
//         break;

//       case "OperationOfSterilizerProcessAuditTrail":
//         getData = await OperationOfSterilizerProcessAuditTrail.findAll({
//           where: { form_id: formId },
//           include: {
//             model: User,
//             attributes: ["user_id", "name"],
//           },
//           order: [["auditTrail_id", "DESC"]],
//         });
//         break;

//       case "TemperatureRecordsAuditTrail":
//         getData = await TemperatureRecordsAuditTrail.findAll({
//           where: { form_id: formId },
//           include: {
//             model: User,
//             attributes: ["user_id", "name"],
//           },
//           order: [["auditTrail_id", "DESC"]],
//         });
//         break;

//       default:
//         return res.status(400).json({
//           error: true,
//           message: `Invalid type: ${type}`,
//         });
//     }

//     // console.log(getData);
//     const logoPath = path.join(__dirname, "../public/vidyalogo.png.png");
//     const logoBase64 = fs.readFileSync(logoPath).toString("base64");
//     const logoDataUri = `data:image/png;base64,${logoBase64}`;
//     const data = {
//       title: `${type.replace(/([A-Z])/g, " $1")} Audit Report`,
//       form_id: formId,
//       status: "status",
//       auditTrail: getData,
//     };

//     // Render audit report content using EJS
//     const htmlContent = await new Promise((resolve, reject) => {
//       req.app.render("auditReport", { reportData: data }, (err, html) => {
//         if (err) reject(err);
//         resolve(html);
//       });
//     });

//     const headerHtml = await new Promise((resolve, reject) => {
//       req.app.render(
//         "header",
//         { reportData: data, logoDataUri: logoDataUri },
//         (err, html) => {
//           if (err) return reject(err);
//           resolve(html);
//         }
//       );
//     });

//     const footerHtml = await new Promise((resolve, reject) => {
//       req.app.render(
//         "footer",
//         { userName: user?.name, date: formattedDate },
//         (err, html) => {
//           if (err) return reject(err);
//           resolve(html);
//         }
//       );
//     });

//     browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//       // executablePath: '/usr/bin/chromium-browser',
//     });
//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: "networkidle0" });

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       displayHeaderFooter: true,
//       headerTemplate: headerHtml,
//       footerTemplate: footerHtml,
//       margin: {
//         top: "200px",
//         right: "52px",
//         bottom: "70px",
//         left: "52px",
//       },
//     });

//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=${type}_Audit_Report.pdf`
//     );
//     res.setHeader("Content-Type", "application/pdf");
//     res.send(pdfBuffer);
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     return res
//       .status(500)
//       .json({ error: true, message: "Error generating PDF", error });
//   } finally {
//     if (browser) {
//       await browser.close();
//     }
//   }
// };
