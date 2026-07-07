const User = require("../models/users");
const formModelRegistry = require("../utils/formModelRegistry");

const Process = require("../models/processes");
const Department = require("../models/departments");
const { Op } = require("sequelize");
const WorkflowState = require("../models/workflowState");
const UserRole = require("../models/userRoles");
const auditFieldMap = require("../utils/auditFieldMap");

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { sequelize } = require("../config/db");
const { getElogDocsUrl } = require("../middlewares/authentication");

const getUserById = async (user_id) => {
  const user = await User.findOne({ where: { user_id, isActive: true } });
  return user;
};

const SEARCHABLE_FIELDS = {
  1: { type: "form", field: "instrument_id_no", targetKey: "instrumentID" },
  2: { type: "form", field: "instrument_id_no", targetKey: "instrumentID" },
  3: { type: "form", field: "equipmentID", targetKey: "equipmentID" },
  5: {
    type: "record",
    association: "DPMonitoringRecords",
    field: "equipmentId",
    targetKey: "equipmentID",
  },
  6: {
    type: "record",
    association: "AhuOperationRecords",
    field: "equipmentId",
    targetKey: "equipmentID",
  },
  7: { type: "form", field: "instrumentID", targetKey: "instrumentID" },
  10: {
    type: "record",
    association: "filterCleaningRecords",
    field: "equipmentID",
    targetKey: "equipmentID",
  },
  16: { type: "form", field: "equipmentID", targetKey: "equipmentID" },
  18: { type: "form", field: "dispensingBoothID", targetKey: "equipmentID" },
  23: { type: "form", field: "balanceIdNo", targetKey: "instrumentID" },
  24: { type: "form", field: "identificationNo", targetKey: "instrumentID" },
  25: { type: "form", field: "instrumentID", targetKey: "instrumentID" },
};

// ----------------- Build dynamic filters -----------------
const buildFilters = (query, config) => {
  const where = {};

  //  Parse filters JSON
  let filters = {};
  if (query.filters) {
    try {
      filters = JSON.parse(query.filters);
    } catch (err) {
      console.error("Invalid filters JSON");
    }
  }

  // Status
  if (filters.status) {
    where.status = filters.status;
  }

  // Department
  if (filters.departmentName) {
    where.departmentName = filters.departmentName;
  }

  //  Date range
  if (filters.date?.from && filters.date?.to) {
    where.date_of_initiation = {
      [Op.between]: [
        new Date(filters.date.from + "T00:00:00"),
        new Date(filters.date.to + "T23:59:59"),
      ],
    };
  }

  //  Search (area_name + description + equipment/instrument ID)
  if (filters.search) {
    const orConditions = [
      { area_name: { [Op.like]: `%${filters.search}%` } },
      { description: { [Op.like]: `%${filters.search}%` } },
    ];

    if (config) {
      if (config.type === "form") {
        orConditions.push({
          [config.field]: { [Op.like]: `%${filters.search}%` },
        });
      } else if (config.type === "record") {
        orConditions.push({
          [`$${config.association}.${config.field}$`]: {
            [Op.like]: `%${filters.search}%`,
          },
        });
      }
    }

    where[Op.or] = orConditions;
  }

  return where;
};

exports.GetAllElogs = async (req, res) => {
  try {
    // Fetch all processes
    const processes = await Process.findAll();
    let response = [];

    for (const process of processes) {
      const registry = formModelRegistry[process.process_id];

      if (!registry || !registry.form) continue; // registry ya form na ho toh skip

      const FormModel = registry.form;
      const approverAlias = registry.approverAlias || "approver";
      const config = SEARCHABLE_FIELDS[process.process_id];

      // Define include models
      const includeModels = [
        {
          model: WorkflowState,
          as: "workflow_state",
          attributes: ["id", "code", "name"],
        },
        {
          model: User,
          as: approverAlias,
          attributes: ["user_id", "name"],
          required: false,
        },
      ];

      if (config && config.type === "record") {
        includeModels.push({
          model: registry.record,
          as: config.association,
          attributes: [config.field],
          required: false,
        });
      }

      // Apply filters
      const filters = buildFilters(req.query, config);

      // Define form attributes to select (only required dashboard columns)
      const formAttributes = [
        "form_id",
        "process_id",
        "initiator_name",
        "date_of_initiation",
        "description",
        "status",
        "departmentName",
        "area_name",
        "workflow_state_id",
      ];
      if (config && config.type === "form") {
        formAttributes.push(config.field);
      }

      const records = await FormModel.findAll({
        attributes: formAttributes,
        where: filters,
        include: includeModels,
        order: [["form_id", "DESC"]],
      });

      const mappedRecords = records.map((record) => {
        let equipmentVal = null;
        let instrumentVal = null;

        if (config) {
          if (config.type === "form") {
            const val = record[config.field];
            if (config.targetKey === "equipmentID") equipmentVal = val;
            else instrumentVal = val;
          } else if (config.type === "record") {
            const associatedRecords = record[config.association] || [];
            if (associatedRecords.length > 0) {
              const val = associatedRecords[0][config.field];
              if (config.targetKey === "equipmentID") equipmentVal = val;
              else instrumentVal = val;
            }
          }
        }

        return {
          form_id: record.form_id,
          process_id: record.process_id,
          initiator_name: record.initiator_name,
          date_of_initiation: record.date_of_initiation,
          description: record.description,
          status: record.status,
          departmentName: record.departmentName,
          area_name: record.area_name,
          equipmentID: equipmentVal,
          instrumentID: instrumentVal,
          workflow_state: record.workflow_state
            ? {
                code: record.workflow_state.code,
                name: record.workflow_state.name,
              }
            : null,
        };
      });

      response.push({
        process_id: process.process_id,
        process: process.process,
        data: mappedRecords,
      });
    }

    res.json({
      error: false,
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
};
exports.GetElogById = async (req, res) => {
  try {
    const { form_id, process_id } = req.params;

    if (!form_id || !process_id) {
      return res.status(400).json({
        error: true,
        message: "form_id and process_id are required",
      });
    }

    const registry = formModelRegistry[process_id];
    if (!registry) {
      return res.status(400).json({
        error: true,
        message: "Invalid process_id",
      });
    }

    const { form, record, approverAlias } = registry;

    const elogData = await form.findAll({
      where: {
        form_id,
        process_id,
      },
      include: [
        { model: record },
        { model: Process, attributes: ["process_id", "process"] },
        { model: User, as: approverAlias, attributes: ["user_id", "name"] },
      ],
      order: [["form_id", "DESC"]],
    });
    if (!elogData) {
      return res.json({
        error: true,
        message: "No data Found",
      });
    }

    return res.json({
      error: false,
      message: "Data fetch Successfully",
      data: elogData,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
exports.GetAllEffectiveElogs = async (req, res) => {
  try {
    // Fetch all processes
    const processes = await Process.findAll();
    let response = [];

    for (const process of processes) {
      const registry = formModelRegistry[process.process_id];

      if (!registry || !registry.form) continue; // registry ya form na ho toh skip

      const FormModel = registry.form;
      const approverAlias = registry.approverAlias || "approver";
      const config = SEARCHABLE_FIELDS[process.process_id];

      // Define include models
      const includeModels = [
        {
          model: WorkflowState,
          as: "workflow_state",
          attributes: ["id", "code", "name"],
        },
        {
          model: User,
          as: approverAlias,
          attributes: ["user_id", "name"],
          required: false,
        },
      ];

      if (config && config.type === "record") {
        includeModels.push({
          model: registry.record,
          as: config.association,
          attributes: [config.field],
          required: false,
        });
      }

      // Apply filters
      const filters = buildFilters(req.query, config);

      // Define form attributes to select (only required dashboard columns)
      const formAttributes = [
        "form_id",
        "process_id",
        "initiator_name",
        "date_of_initiation",
        "description",
        "status",
        "departmentName",
        "area_name",
        "workflow_state_id",
      ];
      if (config && config.type === "form") {
        formAttributes.push(config.field);
      }

      const records = await FormModel.findAll({
        attributes: formAttributes,
        where: {
          ...filters,
          workflow_state_id: 4, // fixed condition for effective elogs
        },
        include: includeModels,
        order: [["form_id", "DESC"]],
      });

      const mappedRecords = records.map((record) => {
        let equipmentVal = null;
        let instrumentVal = null;

        if (config) {
          if (config.type === "form") {
            const val = record[config.field];
            if (config.targetKey === "equipmentID") equipmentVal = val;
            else instrumentVal = val;
          } else if (config.type === "record") {
            const associatedRecords = record[config.association] || [];
            if (associatedRecords.length > 0) {
              const val = associatedRecords[0][config.field];
              if (config.targetKey === "equipmentID") equipmentVal = val;
              else instrumentVal = val;
            }
          }
        }

        return {
          form_id: record.form_id,
          process_id: record.process_id,
          initiator_name: record.initiator_name,
          date_of_initiation: record.date_of_initiation,
          description: record.description,
          status: record.status,
          departmentName: record.departmentName,
          area_name: record.area_name,
          equipmentID: equipmentVal,
          instrumentID: instrumentVal,
          workflow_state: record.workflow_state
            ? {
                code: record.workflow_state.code,
                name: record.workflow_state.name,
              }
            : null,
        };
      });

      response.push({
        process_id: process.process_id,
        process: process.process,
        data: mappedRecords,
      });
    }

    res.json({
      error: false,
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
};
exports.GetEffectiveElogsById = async (req, res) => {
  try {
    const { form_id, process_id } = req.params;

    if (!form_id || !process_id) {
      return res.status(400).json({
        error: true,
        message: "form_id and process_id are required",
      });
    }

    const registry = formModelRegistry[process_id];
    if (!registry) {
      return res.status(400).json({
        error: true,
        message: "Invalid process_id",
      });
    }

    const { form, record, approverAlias } = registry;

    const elogData = await form.findAll({
      where: {
        form_id,
        process_id,
        workflow_state_id: "4",
      },
      include: [
        { model: record },
        { model: Process, attributes: ["process_id", "process"] },
        { model: User, as: approverAlias, attributes: ["user_id", "name"] },
      ],
      order: [["form_id", "DESC"]],
    });

    return res.json({
      error: false,
      data: elogData,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
exports.getAllProcesses = async (req, res) => {
  try {
    const { process } = req.query; // query parameter

    const whereCondition = {};

    if (process) {
      whereCondition.process = {
        [Op.like]: `%${process}%`,
      };
    }

    const result = await Process.findAll({
      where: whereCondition,
      order: [["process_id", "ASC"]],
    });

    res.status(200).json({
      error: false,
      message: "Processes fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal server error while fetching processes",
      errorDetails: error.message,
    });
  }
};
exports.getAllDepartments = async (req, res) => {
  try {
    const { departmentName } = req.query;

    const whereCondition = {};

    // agar departmentName query me aaya
    if (departmentName) {
      whereCondition.departmentName = {
        [Op.like]: `%${departmentName}%`,
      };
    }

    const result = await Department.findAll({
      where: whereCondition,
      order: [["department_id", "ASC"]],
    });

    res.status(200).json({
      error: false,
      message: "Departments fetched successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal server error",
      errorDetails: error.message,
    });
  }
};
exports.getServerTime = async (req, res) => {
  try {
    const now = new Date();

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // week number calculation
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(
      ((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7,
    );

    res.status(200).json({
      error: false,
      message: "Server time fetched successfully",
      data: {
        fullDateTime: now.toISOString(),
        timestamp: now.getTime(),

        year: now.getFullYear(),
        month: now.getMonth() + 1,
        monthName: months[now.getMonth()],

        day: now.getDate(),
        dayName: days[now.getDay()],

        weekNumber: weekNumber,

        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds(),

        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Failed to fetch server time",
      errorDetails: error.message,
    });
  }
};
exports.GetUserOnBasisOfRoleGroup = async (req, res) => {
  const { role_id, department_id, process_id } = req.body;

  try {
    if ((!role_id, !department_id, !process_id)) {
      return res.status(400).json({
        error: true,
        message: "please provide all details",
      });
    }
    const selectedUsers = await UserRole.findAll({
      where: {
        [Op.or]: [
          {
            role_id: role_id,
            process_id: process_id,
            department_id: department_id,
          },
          {
            role_id: 4,
            process_id: process_id,
            department_id: department_id,
          },
        ],
      },
      include: [
        {
          model: User,
          where: { isActive: true },
        },
      ],
    });

    return res.status(200).json({
      error: false,
      message: "Users fetched successfully",
      data: selectedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);

    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// Common Audit section

exports.GetElogAuditTrail = async (req, res) => {
  try {
    const { process_id, form_id } = req.params;

    const registry = formModelRegistry[process_id];
    if (!registry || !registry.audit) {
      return res.status(400).json({
        error: true,
        message: "Audit trail not configured for this process",
      });
    }

    const AuditModel = registry.audit;

    const auditTrail = await AuditModel.findAll({
      where: { form_id },
      include: [
        {
          model: User,
          as: "changedByUser",
          attributes: ["user_id", "name", "email"],
        },
      ],
      order: [["auditTrail_id", "ASC"]],
    });

    const response = auditTrail.map((row) => {
      const data = row.toJSON();

      return {
        ...data,

        //  yahin pe field_name replace
        field_name:
          auditFieldMap[data.field_name] ||
          data.field_name
            .replace(/_/g, " ")
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase()),
      };
    });

    return res.json({
      error: false,
      data: response,
    });
  } catch (error) {
    console.error("GetElogAuditTrail Error:", error);
    return res.status(400).json({
      error: true,
      message: error.message,
    });
  }
};

//function to make pdf friendly json
function formatAuditValue(value) {
  if (!value) return "N/A";

  if (typeof value !== "string") {
    return JSON.stringify(value);
  }

  // try JSON parse
  try {
    const parsed = JSON.parse(value);

    // Array case
    if (Array.isArray(parsed)) {
      return parsed
        .map((item, index) => {
          if (typeof item === "object" && item !== null) {
            return Object.entries(item)
              .filter(([key]) => !key.toLowerCase().includes("active"))
              .map(([key, val]) => `${key}: ${val}`)
              .join(", ");
          }
          return item;
        })
        .join(" | ");
    }

    // Object case
    if (typeof parsed === "object") {
      return Object.entries(parsed)
        .filter(([key]) => !key.toLowerCase().includes("active"))
        .map(([key, val]) => `${key}: ${val}`)
        .join(", ");
    }

    return parsed;
  } catch (e) {
    // normal string
    return value;
  }
}

exports.generateAuditPdfbyId = async (req, res) => {
  const { form_id, process_id, type } = req.params;
  const userId = req.user.userId;
  const date = new Date();
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  let browser;

  const user = await getUserById(userId);

  try {
    const registry = formModelRegistry[process_id];
    if (!registry || !registry.audit) {
      return res.status(400).json({
        error: true,
        message: "Audit trail not configured for this process",
      });
    }

    const AuditModel = registry.audit;
    const Form = registry.form;
    const FormData = await Form.findOne({
      where: { form_id },
    });
    const departmentName = FormData.departmentName;

    const auditTrail = await AuditModel.findAll({
      where: { form_id },
      include: [
        {
          model: User,
          as: "changedByUser",
          attributes: ["user_id", "name", "email"],
        },
      ],
      order: [["auditTrail_id", "ASC"]],
    });

    const stripHtml = (value) => {
      if (value === null || value === undefined) return "";

      // If not string, convert safely
      if (typeof value !== "string") {
        return JSON.stringify(value);
      }

      return value.replace(/<[^>]*>/g, "");
    };

    const response = auditTrail.map((row) => {
      const data = row.toJSON();

      return {
        ...data,
        new_value: stripHtml(formatAuditValue(data.new_value)),
        previous_value: stripHtml(formatAuditValue(data.previous_value)),

        field_name:
          auditFieldMap[data.field_name] ||
          data.field_name
            .replace(/_/g, " ")
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase()),
      };
    });

    const logoPath = path.join(__dirname, "../public/medicef_logo.png.png");
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");
    const logoDataUri = `data:image/png;base64,${logoBase64}`;
    const data = {
      title: `${type.replace(/([A-Z])/g, " $1")} Audit Report`,
      form_id: form_id,
      status: "status",
      auditTrail: response,
      departmentName: departmentName,
    };

    // Render audit report content using EJS
    const htmlContent = await new Promise((resolve, reject) => {
      req.app.render("auditReport", { reportData: data }, (err, html) => {
        if (err) reject(err);
        resolve(html);
      });
    });

    const headerHtml = await new Promise((resolve, reject) => {
      req.app.render(
        "auditHeader",
        { reportData: data, logoDataUri: logoDataUri },
        (err, html) => {
          if (err) return reject(err);
          resolve(html);
        },
      );
    });

    const footerHtml = await new Promise((resolve, reject) => {
      req.app.render(
        "footer",
        { userName: user?.name, date: formattedDate },
        (err, html) => {
          if (err) return reject(err);
          resolve(html);
        },
      );
    });

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      // executablePath: '/usr/bin/chromium-browser',
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: headerHtml,
      footerTemplate: footerHtml,
      margin: {
        top: "180px",
        bottom: "60px",
        left: "40px",
        right: "40px",
      },
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${type}_Audit_Report.pdf`,
    );
    res.setHeader("Content-Type", "application/pdf");
    res.end(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res
      .status(500)
      .json({ error: true, message: "Error generating PDF", error });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

exports.deleteAttachment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { form_id, process_id } = req.params;
    const { fieldName } = req.body;
    const user = req.user;

    if (!form_id || !process_id || !fieldName) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "form_id, process_id and fieldName are required",
      });
    }

    const registry = formModelRegistry[process_id];
    if (!registry || !registry.form || !registry.audit) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Invalid process_id",
      });
    }

    const FormModel = registry.form;
    const AuditModel = registry.audit;

    const formData = await FormModel.findByPk(form_id, { transaction });
    if (!formData) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: "Form not found",
      });
    }

    const previousValue = formData[fieldName];
    if (!previousValue) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Attachment already deleted",
      });
    }

    const previousStatus = formData.status || "";

    await FormModel.update(
      { [fieldName]: null },
      { where: { form_id: form_id }, transaction },
    );

    await AuditModel.create(
      {
        form_id: form_id,
        changed_by: user.userId,
        field_name: auditFieldMap[fieldName] || fieldName,
        previous_value: previousValue,
        new_value: "null",
        previous_status: previousStatus,
        new_status: previousStatus,
        declaration: null,
        action: "Delete Attachment",
      },
      { transaction },
    );

    await transaction.commit();

    return res.status(200).json({
      error: false,
      message: "Attachment deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error:", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.addAttachment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { form_id, process_id } = req.params;
    const { fieldName } = req.body;
    const user = req.user;

    const file = req.file || req.files;

    if (!form_id || !process_id || !fieldName || !file) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "form_id, process_id, fieldName and file are required",
      });
    }

    const attachmentPath = getElogDocsUrl(file);
    if (!attachmentPath) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Invalid file object",
      });
    }

    const registry = formModelRegistry[process_id];
    if (!registry || !registry.form || !registry.audit) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Invalid process_id",
      });
    }

    const FormModel = registry.form;
    const AuditModel = registry.audit;

    const formData = await FormModel.findByPk(form_id, { transaction });
    if (!formData) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: "Form not found",
      });
    }

    const previousValue = formData[fieldName];
    const previousStatus = formData.status || "";

    await FormModel.update(
      { [fieldName]: attachmentPath },
      { where: { form_id: form_id }, transaction },
    );

    await AuditModel.create(
      {
        form_id: form_id,
        changed_by: user.userId,
        field_name: auditFieldMap[fieldName] || fieldName,
        previous_value: previousValue || null,
        new_value: attachmentPath,
        previous_status: previousStatus,
        new_status: previousStatus,
        declaration: "Attachment",
        action: "Add Attachment",
      },
      { transaction },
    );

    await transaction.commit();

    return res.status(200).json({
      error: false,
      message: "Attachment added successfully",
      data: {
        attachmentPath,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error:", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

//Delete Record by ID

exports.deleteRecordById = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { form_id, process_id, record_id } = req.params;
    const user = req.user;

    if (!form_id || !process_id || !record_id) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "form_id, process_id and record_id are required",
      });
    }

    const registry = formModelRegistry[process_id];
    if (!registry || !registry.record) {
      await transaction.rollback();
      return res.status(400).json({
        error: true,
        message: "Invalid process_id",
      });
    }

    const RecordModel = registry.record;

    // Find record using ALL conditions
    const record = await RecordModel.findOne({
      where: {
        record_id,
        form_id,
      },
      transaction,
    });

    if (!record) {
      await transaction.rollback();
      return res.status(404).json({
        error: true,
        message: "Record not found",
      });
    }

    if (record.reviewed_by && record.reviewed_by.trim() !== "") {
      await transaction.rollback();
      return res.status(403).json({
        error: true,
        message: "Checked record cannot be deleted",
      });
    }

    await record.destroy({ transaction });

    await transaction.commit();

    return res.status(200).json({
      error: false,
      message: "Record deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting record:", error);

    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
