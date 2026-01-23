const ahuOperationForm = require("../models/ahuOperationForm");
const ahuOperationRecord = require("../models/ahuOperationRecord");
const { sequelize } = require("../config/db");
const User = require("../models/users");
const UserRole = require("../models/userRoles");
const { Op, ValidationError } = require("sequelize");
const bcrypt = require("bcrypt");
const { getElogDocsUrl } = require("../middlewares/authentication");
const ahuOperationAuditTrail = require("../models/ahuOperationAuditTrail");
const Mailer = require("../middlewares/mailer");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const Process = require("../models/processes");

const getUserById = async (user_id) => {
  const user = await User.findOne({ where: { user_id, isActive: true } });
  return user;
};
const getUsersByIdsReviewer = async (user_ids) => {
  return await User.findAll({
    where: {
      user_id: user_ids,
      isActive: true,
    },
    attributes: ["name"],
  });
};
const parseIfString = (value, fallback = null) => {
  if (value === null || value === undefined) return fallback;

  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  return value;
};


// Fill tempratre record form and insert its records.
exports.InsertAHU = async (req, res) => {
  const {
    department_id,
    process_id,
    description,
    departmentName,
    reviewer_id,
    reviewerData,
    approver_id,
    initiatorComment,
    esignInput,
    password,
    FormRecordsArray,
    initiatorDeclaration,
    additionalAttachment,
    area_name,
    room_id,
    additionalInfo,
  } = req.body;


  if (!description) {
    return res
      .status(400)
      .json({ error: true, message: "Description field is mandatory." });
  }

  if (!area_name) {
    return res
      .status(400)
      .json({ error: true, message: "Area name field is mandatory." });
  }

  if (!reviewer_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a reviewer." });
  }

  if (!approver_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide an approver." });
  }
  if (!reviewerData) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a reviewer data." });
  }
  if (!esignInput || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email or username and password." });
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
      }
      //  else if (file.fieldname.startsWith("FormRecordsArray[")) {
      //   // Extract the index from the fieldname
      //   const match = file.fieldname.match(
      //     /FormRecordsArray\[(\d+)\]\[supporting_docs\]/
      //   );
      //   if (match) {
      //     const index = match[1];
      //     supportingDocs[index] = file;
      //   }
      // }
    });

    // Create new temperature record Form
    const newForm = await ahuOperationForm.create(
      {
        department_id: department_id,
        process_id: process_id,
        initiator_id: user.user_id,
        initiator_name: user.name,
        description: description,
        status: "Opened",
        stage: 1,
        departmentName: departmentName,
        area_name:area_name,
        room_id:room_id,
        reviewerData: reviewerData,
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
    const reviewerUsers = await getUsersByIdsReviewer(reviewer_id);
    const reviewerNames = reviewerUsers.map(u => u.name).join(", ");
    const fields = {
      description,
      departmentName,
      area_name,
      room_id,
      reviewer: reviewerNames,
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
          new_value: typeof value === "object" ? JSON.stringify(value) : value,
          changed_by: user.user_id,
          previous_status: "Not Applicable",
          new_status: "Opened",
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
        action: "Opened",
      });
    }

    // if (Array.isArray(FormRecordsArray) && FormRecordsArray.length > 0) {
    //   const formRecords = FormRecordsArray.map((record, index) => ({
    //     form_id: newForm?.form_id,
    //     unique_id: record?.unique_id,
    //     time: record?.time, // Assuming time was meant here instead of unique_id again
    //     date: record?.date,
    //     min_temprature_record: record?.min_temprature_record,
    //     max_temprature_record: record?.max_temprature_record,
    //     humidity_record: record?.humidity_record,
    //     remarks: record?.remarks,
    //     done_by: record?.done_by,
    //     checked_by: record?.checked_by,
    //     reviewed_by: record?.reviewed_by,
    //     approved_by: record?.approved_by,
    //     // supporting_docs: record?.supporting_docs
    //     //   ? record.supporting_docs
    //     //   : getElogDocsUrl(supportingDocs[index]),
    //   }));

    //   await ahuOperationRecord.bulkCreate(formRecords, { transaction });
    //   formRecords.forEach((record, index) => {
    //     auditTrailEntries.push({
    //       form_id: newForm.form_id,
    //       field_name: "Unique Id",
    //       previous_value: null,
    //       new_value: record.unique_id,
    //       changed_by: user.user_id,
    //       previous_status: "Not Applicable",
    //       new_status: "Opened",
    //       action: "Opened",
    //     });
    //     auditTrailEntries.push({
    //       form_id: newForm.form_id,
    //       field_name: "Time",
    //       previous_value: null,
    //       new_value: record.time,
    //       changed_by: user.user_id,
    //       previous_status: "Not Applicable",
    //       new_status: "Opened",
    //       action: "Opened",
    //     });
    //     auditTrailEntries.push({
    //       form_id: newForm.form_id,
    //       field_name: "Date",
    //       previous_value: null,
    //       new_value: record.date,
    //       changed_by: user.user_id,
    //       previous_status: "Not Applicable",
    //       new_status: "Opened",
    //       action: "Opened",
    //     });
    //     auditTrailEntries.push({
    //       form_id: newForm.form_id,
    //       field_name: "Temprature Record",
    //       previous_value: null,
    //       new_value: record.min_temprature_record,
    //       changed_by: user.user_id,
    //       previous_status: "Not Applicable",
    //       new_status: "Opened",
    //       action: "Opened",
    //     });
    //     auditTrailEntries.push({
    //       form_id: newForm.form_id,
    //       field_name: "Temprature Record",
    //       previous_value: null,
    //       new_value: record.max_temprature_record,
    //       changed_by: user.user_id,
    //       previous_status: "Not Applicable",
    //       new_status: "Opened",
    //       action: "Opened",
    //     });
    //     auditTrailEntries.push({
    //       form_id: newForm.form_id,
    //       field_name: "Humidity Record",
    //       previous_value: null,
    //       new_value: record.humidity_record,
    //       changed_by: user.user_id,
    //       previous_status: "Not Applicable",
    //       new_status: "Opened",
    //       action: "Opened",
    //     });
    //     auditTrailEntries.push({
    //       form_id: newForm.form_id,
    //       field_name: "Remarks",
    //       previous_value: null,
    //       new_value: record.remarks,
    //       changed_by: user.user_id,
    //       previous_status: "Not Applicable",
    //       new_status: "Opened",
    //       action: "Opened",
    //     });
    //     auditTrailEntries.push({
    //       form_id: newForm.form_id,
    //       field_name: "Done by",
    //       previous_value: null,
    //       new_value: record.done_by,
    //       changed_by: user.user_id,
    //       previous_status: "Not Applicable",
    //       new_status: "Opened",
    //       action: "Opened",
    //     });
    //     auditTrailEntries.push({
    //       form_id: newForm.form_id,
    //       field_name: "CheckedBy",
    //       previous_value: null,
    //       new_value: record.checked_by,
    //       changed_by: user.user_id,
    //       previous_status: "Not Applicable",
    //       new_status: "Opened",
    //       action: "Opened",
    //     });
    //     if (supportingDocs[index]) {
    //       auditTrailEntries.push({
    //         form_id: newForm.form_id,
    //         field_name: "SupportingDocs",
    //         previous_value: null,
    //         new_value: getElogDocsUrl(supportingDocs[index]),
    //         changed_by: user.user_id,
    //         previous_status: "Not Applicable",
    //         new_status: "Opened",
    //         action: "Opened",
    //       });
    //     }
    //   });
    // }

    await ahuOperationAuditTrail.bulkCreate(auditTrailEntries, {
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
      message: `${errorMessage}: ${error}`,
    });
  }
};

// edit tempratre record elog details
exports.EditAHU = async (req, res) => {
  const {form_id} = req.params;
  const {
    process_id,
    department_id,
    description,
    departmentName,
    reviewer_id,
    reviewerData,
    approver_id,
    AhuOperationRecords,
    esignInput,
    password,
    area_name,
    room_id,
    initiatorComment,
    initiatorDeclaration,
    additionalInfo,
  } = req.body;

  // Check for required fields and provide specific error messages

  if (!form_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a form ID." });
  }  

  if (!description) {
    return res
      .status(400)
      .json({ error: true, message: "Description field is mandatory." });
  }

  if (!area_name) {
    return res
      .status(400)
      .json({ error: true, message: "Area name field is mandatory." });
  }
  
  if (!reviewer_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide a reviewer." });
  }

  if (!approver_id) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide an approver." });
  }

  
  if (!esignInput || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please provide email or username and password." });
  }

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

    // if(!req.files){
    req.files?.forEach((file) => {
      if (file.fieldname === "initiatorAttachment") {
        initiatorAttachment = file;
      } else if (file.fieldname === "additionalAttachment") {
        additionalAttachment = file;
      }
      //  else if (file.fieldname.startsWith("AhuOperationRecords[")) {
      //   // Extract the index from the fieldname
      //   const match = file.fieldname.match(
      //     /AhuOperationRecords\[(\d+)\]\[supporting_docs\]/
      //   );
      //   if (match) {
      //     const index = match[1];
      //     supportingDocs[index] = file;
      //   }
      // }
    });
    // }

    // Find the form by ID
    const form = await ahuOperationForm.findOne({
      where: { form_id: form_id },
      transaction,
    });

    if (!form) {
      await transaction.rollback();
      return res.status(404).json({ error: true, message: "Form not found." });
    }

    // Define epsilon for float comparison
    const EPSILON = 0.000001;

    // Function to compare floats with epsilon
    const areFloatsEqual = (a, b) => Math.abs(a - b) < EPSILON;

    // Track changes for the form
    const auditTrailEntries = [];
    const fields = {
      description,
      departmentName,
      area_name,
      room_id,
      initiatorComment,
      initiatorAttachment: initiatorAttachment
        ? getElogDocsUrl(initiatorAttachment)
        : form.initiatorAttachment,
      additionalAttachment: additionalAttachment
        ? getElogDocsUrl(additionalAttachment)
        : form.additionalAttachment,
      additionalInfo,
    };


    const normalizeValue = (val) => {
      if (val === null || val === undefined) return val;

      if (Array.isArray(val)) {
        return val
          .map(normalizeValue)
          .sort((a, b) =>
            JSON.stringify(a).localeCompare(JSON.stringify(b))
          );
      }

      if (typeof val === "object") {
        return Object.keys(val)
          .sort()
          .reduce((acc, key) => {
            acc[key] = normalizeValue(val[key]);
            return acc;
          }, {});
      }

      return val;
    };

    const hasChanged = (oldVal, newVal) => {
      // number safe compare
      if (typeof oldVal === "number" && typeof newVal === "number") {
        return !areFloatsEqual(oldVal, newVal);
      }

      return JSON.stringify(normalizeValue(oldVal)) !==
        JSON.stringify(normalizeValue(newVal));
    };

  const formatAuditValue = (value) => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return value;
    };

    const dbReviewerIds = parseIfString(form?.reviewer_id, []);
    const reqReviewerIds = parseIfString(reviewer_id, []);
    if (
      reviewer_id &&
        JSON.stringify(dbReviewerIds?.sort()) !==
        JSON.stringify(reqReviewerIds?.sort())   
     ) {
      const oldReviewers = await getUsersByIdsReviewer(dbReviewerIds);
      const newReviewers = await getUsersByIdsReviewer(reqReviewerIds);

      auditTrailEntries.push({
        form_id: form.form_id,
        field_name: "reviewer",
        previous_value: oldReviewers.map(u => u.name).join(", "),
        new_value: newReviewers.map(u => u.name).join(", "),
        changed_by: user.user_id,
        previous_status: form.status,
        new_status: "Opened",
        action: "Update Elog",
      });
    }

    if (approver_id && form.approver_id !== approver_id) {
      const oldApprover = await getUserById(form.approver_id);
      const newApprover = await getUserById(approver_id);

      auditTrailEntries.push({
        form_id: form.form_id,
        field_name: "approver",
        previous_value: oldApprover?.name || "",
        new_value: newApprover?.name || "",
        changed_by: user.user_id,
        previous_status: form.status,
        new_status: "Opened",
        action: "Update Elog",
      });
    }


    for (const [field, newValue] of Object.entries(fields)) {
      const oldValue = form[field];

      if (newValue !== undefined && hasChanged(oldValue, newValue)) {
        auditTrailEntries.push({
          form_id: form.form_id,
          field_name: field,
          previous_value: formatAuditValue(oldValue) || null,
          new_value: formatAuditValue(newValue),
          changed_by: user.user_id,
          previous_status: form.status,
          new_status: form.status,
          action: "Update Elog",
        });
      }
    }


    // Update the form details
    await form.update(
      {
        department_id,
        description,
        departmentName,
        area_name,
        room_id,
        reviewer_id,
        reviewerData,
        approver_id,
        initiatorAttachment: initiatorAttachment
        ? getElogDocsUrl(initiatorAttachment)
        : form.initiatorAttachment,
        additionalAttachment: additionalAttachment
        ? getElogDocsUrl(additionalAttachment)
        : form.additionalAttachment,
        initiatorComment,
        additionalInfo,
      },
      { transaction }
    );

    // Update the Form Records if provided

    // if (Array.isArray(AhuOperationRecords) && AhuOperationRecords.length > 0) {
    //   const existingRecords = await ahuOperationRecord.findAll({
    //     where: { form_id: form_id },
    //     raw: true,
    //     // order: [["record_id", "DESC"]],
    //     transaction,
    //   });

    //   // Track changes for existing records
    //   existingRecords.forEach((existingRecord, index) => {
    //     AhuOperationRecords.sort(
    //       (a, b) => parseInt(a.record_id) - parseInt(b.record_id)
    //     );
    //     const newRecord = AhuOperationRecords[index];
    //     if (newRecord) {
    //       const recordFields = {
    //         min_temprature_record: newRecord.min_temprature_record,
    //         max_temprature_record: newRecord.max_temprature_record,
    //         humidity_record: newRecord.humidity_record,
    //         date: newRecord.date,
    //         time: newRecord.time,
    //         remarks: newRecord.remarks,
    //         done_by: newRecord.done_by,
    //         reviewed_by: newRecord?.reviewed_by,
    //         approved_by: newRecord?.approved_by,
    //         // supporting_docs:
    //         //   newRecord.supporting_docs ||
    //         //   getElogDocsUrl(supportingDocs[index]),
    //       };

    //       // for (const [field, newValue] of Object.entries(recordFields)) {
    //       //   const oldValue = existingRecord[field];
    //       //   if ( 
    //       //     newValue !== undefined &&
    //       //     ((typeof newValue === "number" &&
    //       //       !areFloatsEqual(oldValue, newValue)) ||
    //       //       oldValue != newValue)
    //       //   ) {
    //       //     auditTrailEntries.push({
    //       //       form_id: form.form_id,
    //       //       field_name: `${field}`,
    //       //       previous_value: oldValue || null,
    //       //       new_value: newValue || "",
    //       //       changed_by: user.user_id,
    //       //       previous_status: form.status,
    //       //       new_status: "Opened",
    //       //       action: "Update Elog",
    //       //     });
    //       //   }
    //       // }
    //     }
    //   });
    //   // Handle new records added
    //   if (AhuOperationRecords.length > existingRecords.length) {
    //     for (
    //       let i = existingRecords.length;
    //       i < AhuOperationRecords.length;
    //       i++
    //     ) {
    //       const newRecord = AhuOperationRecords[i];
    //       const recordFields = {
    //         unique_id: newRecord?.unique_id,
    //         time: newRecord?.time,
    //         checked_by: newRecord?.checked_by,
    //         min_temprature_record: newRecord.min_temprature_record,
    //         max_temprature_record: newRecord.max_temprature_record,
    //         humidity_record: newRecord.humidity_record,
    //         date: newRecord.date,
    //         remarks: newRecord.remarks,
    //         done_by: newRecord.done_by,
    //         reviewed_by: newRecord?.reviewed_by,
    //         approved_by: newRecord?.approved_by,
    //         // supporting_docs:
    //         //   newRecord.supporting_docs || getElogDocsUrl(supportingDocs[i]),
    //       };

    //       for (const [field, newValue] of Object.entries(recordFields)) {
    //         if (newValue !== undefined) {
    //           // auditTrailEntries.push({
    //           //   form_id: form.form_id,
    //           //   field_name: `${field}`,
    //           //   previous_value: null,
    //           //   new_value: newValue || "",
    //           //   changed_by: user.user_id,
    //           //   previous_status: form.status,
    //           //   new_status: "Opened",
    //           //   action: "Update Elog",
    //           // });
    //         }
    //       }
    //     }
    //   }

    //   // Delete existing records for the form
    //   await ahuOperationRecord.destroy({
    //     where: { form_id: form_id },
    //     transaction,
    //   });
    //   // Create new records  
    //   const formRecords = AhuOperationRecords.map((record, index) => ({
    //     form_id: form_id,
    //     unique_id: record?.unique_id,
    //     time: record?.time,
    //     date: record?.date,
    //     min_temprature_record: record?.min_temprature_record,
    //     max_temprature_record: record?.max_temprature_record,
    //     humidity_record: record?.humidity_record,
    //     remarks: record?.remarks,
    //     done_by: record?.done_by,
    //     checked_by: record?.checked_by,
    //     reviewed_by: record?.reviewed_by,
    //     approved_by: record?.approved_by,
    //     // supporting_docs: record?.supporting_docs
    //     //   ? record?.supporting_docs
    //     //   : getElogDocsUrl(supportingDocs[index]),
    //   }));
    //   await ahuOperationRecord.bulkCreate(formRecords, { transaction });
    // }

// Update / Create Temperature Records (NO DELETE)

      if (Array.isArray(AhuOperationRecords) && AhuOperationRecords.length > 0) {

        for (const record of AhuOperationRecords) {

          if (record.record_id) {
            // UPDATE existing row
            await ahuOperationRecord.update(
              {
                date: record?.date,
                equipmentId: record?.equipmentId,
                startTime: record?.startTime,
                startedBy: record?.startedBy,
                stopTime: record?.stopTime,
                stoppedBy: record?.stoppedBy,
                remarks: record?.remarks,
                done_by: record?.done_by,
                reviewed_by: record?.reviewed_by,
              },
              {
                where: {
                  record_id: record.record_id,
                  form_id: form_id,
                },
                transaction,
              }
            );

          } else {
            // CREATE only new row
            await ahuOperationRecord.create(
              {
                form_id: form_id,
                unique_id: record?.unique_id,
                date: record?.date,
                equipmentId: record?.equipmentId,
                startTime: record?.startTime,
                startedBy: record?.startedBy,
                stopTime: record?.stopTime,
                stoppedBy: record?.stoppedBy,
                remarks: record?.remarks,
                done_by: record?.done_by,
                reviewed_by: record?.reviewed_by,
              },
              { transaction }
            );
          }
        }
      }

      await ahuOperationAuditTrail.bulkCreate(auditTrailEntries, {
        transaction,
      });

    await transaction.commit();

    return res.status(200).json({
      error: false,
      message: "E-log Updated successfully",
    });
  } catch (error) {
    await transaction.rollback();

    let errorMessage = "Error during updating elog";
    if (error instanceof ValidationError) {
      errorMessage = error.errors.map((e) => e.message).join(", ");
    }

    return res.status(500).json({
      error: true,
      message: `${errorMessage}: ${error.message}`,
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
      res.render("tp_report", { reportData }, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });

    const browser = await puppeteer.launch({
      headless: true,
      timeout: 120000, // 2 minutes
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
    const { form_id } = req.params;
    const formData = await ahuOperationForm.findOne({
      where: { form_id },
      include: [
        {
          model: Process,
        },
        {
          model: User,
          as: "approver",
        }
      ],
    });

    if (!formData) {
      return res.status(404).json({ error: true, message: "Form not found" });
    }

        // Sequelize → Plain JS object
    const formJson = formData.toJSON();
    const reportData = formJson;

    const safeParse = (data) => {
      try {
        return typeof data === "string" ? JSON.parse(data) : data;
      } catch {
        return null;
      }
    };

    reportData.reviewerData = safeParse(reportData.reviewerData);

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
      req.app.render("ahu_report", { reportData }, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const logoPath = path.join(__dirname, "../public/medicef_logo.png.png");
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
        top: "130px",
        right: "15px",
        bottom: "50px",
        left: "15px",
      },
    });

    // Close the browser
    await browser.close();
    const uniqueId = uuidv4();

    const filePath = path.resolve("public", `Elog_Report_${uniqueId}.pdf`);
    fs.writeFileSync(filePath, pdf);

    res.status(200).json({ filename: `Elog_Report_${uniqueId}.pdf` });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res
      .status(500)
      .json({ error: true, message: `Error generating PDF: ${error.message}` });
  }
};
exports.viewReport = async (req, res) => {
  try {
    const { form_id } = req.params;
    const formData = await ahuOperationForm.findOne({
      where: { form_id },
      include: [
        {
          model: Process,
        },
        {
          model: User,
          as: "approver",
        }
      ],
    });

    if (!formData) {
      return res.status(404).json({ error: true, message: "Form not found" });
    }

    // Sequelize → Plain JS object
    const formJson = formData.toJSON();

    const reportData = formJson;
    // Render HTML using EJS template
    req.app.render("ahu_report", { reportData }, (err, html) => {
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

const { form_id } = req.params;
const { fromDate, toDate } = req.body;

if (!form_id) {
  return res.status(400).json({ error: true, message: "Form Id Required" });
}

      let recordWhere = {};

      if (fromDate && toDate) {
        // fromDate, toDate expected in 'YYYY/MM/DD'
        const [fy, fm, fd] = fromDate.split("/"); 
        const [ty, tm, td] = toDate.split("/");
        

        // create Date objects
        const from = new Date(fy, fm - 1, fd); // monthIndex = month - 1
        const to = new Date(ty, tm - 1, td);
        recordWhere.date = {
          [Op.between]: [from, to],
        };
      }

    const formData = await ahuOperationForm.findOne({
      where: { form_id },
      include: [
        {
          model: ahuOperationRecord,
          where: recordWhere, // directly use literal or undefined
          required: false,
          separate: true,
          // order: [["date", "ASC"], ["time", "ASC"]],
        },
        { model: Process },
      ],
    });


    if (!formData) {
      return res.status(404).json({ error: true, message: "Form not found" });
    }

    // Sequelize → Plain JS object
    const formJson = formData.toJSON();

    const reportData = formJson;
    const safeParse = (data) => {
      try {
        return typeof data === "string" ? JSON.parse(data) : data;
      } catch {
        return null;
      }
    };

    reportData.reviewerData = safeParse(reportData.reviewerData);
    reportData.description = removeHtmlTags(reportData.description);
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
      req.app.render("effectiveAHUReport", { reportData }, (err, html) => {
        if (err) return reject(err);
        resolve(html);
      });
    });

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const logoPath = path.join(__dirname, "../public/medicef_logo.png.png");
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
        top: "130px",
        right: "15px",
        bottom: "50px",
        left: "15px",
      },
    });

    // Close the browser
    await browser.close();
    const uniqueId = uuidv4();

    const filePath = path.resolve("public", `AHU_Elog_Report_${uniqueId}.pdf`);
    fs.writeFileSync(filePath, pdf);

    res.status(200).json({ filename: `AHU_Elog_Report_${uniqueId}.pdf` });
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
    req.app.render("effectiveAHUReport", { reportData }, (err, html) => {
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
    const reportData = req.body.reportData;
    const formId = req.params.form_id;

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

    const data = reportData?.temprature_record?.map((record) => ({
      unique_id: record?.unique_id || "",
      time: record?.time || "",
      date: record?.date || "",
      min_temprature_record: record?.min_temprature_record || "",
      max_temprature_record: record?.max_temprature_record || "",
      humidity_record: record?.humidity_record || "",
      remarks: record?.remarks || "",
      done_by: record?.done_by || "",
      reviewed_by: record?.reviewed_by || "",
      approved_by: record?.approved_by ||"",
      supporting_docs: record?.supporting_docs || "",
    }));

    const arrayData = [...data, ...blankRows];
    // Render HTML using EJS template
    const html = await new Promise((resolve, reject) => {
      req.app.render("blankTPReport", { arrayData }, (err, html) => {
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
        top: "145px",
        // right: "50px",
        bottom: "50px",
        // left: "50px",
      },
    });

    // Close the browser
    await browser.close();

    const filePath = path.resolve("public", `TP_Elog_Report_${formId}.pdf`);
    fs.writeFileSync(filePath, pdf);

    res.status(200).json({ filename: `TP_Elog_Report_${formId}.pdf` });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res
      .status(500)
      .json({ error: true, message: `Error generating PDF: ${error.message}` });
  }
};
