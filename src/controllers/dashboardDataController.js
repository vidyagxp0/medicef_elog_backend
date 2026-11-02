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

const getDepartmentsForUser = async (userId) => {
  const departmentIds = new Set();

  const userRoles = await UserRole.findAll({
    where: {
      user_id: userId
    },
    raw: true
  });
  userRoles.forEach(ur => {
    if (ur.department_id) {
      departmentIds.add(ur.department_id);
    }
  });

  return Array.from(departmentIds);
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

  let filters = {};
  if (query.filters) {
    try {
      filters = typeof query.filters === "string" ? JSON.parse(query.filters) : query.filters;
    } catch (err) {
      console.error("Invalid filters JSON");
    }
  }

  const statusVal = query.status || filters.status;
  const deptVal = query.departmentName || filters.departmentName;
  const fromDateVal = query.fromDate || filters.fromDate || filters.date?.from;
  const toDateVal = query.toDate || filters.toDate || filters.date?.to;
  const searchVal = query.search || filters.search;
  const equipInstVal = query.equipInstId || filters.equipInstId;

  if (statusVal) {
    where.status = statusVal;
  }

  if (deptVal) {
    where.departmentName = deptVal;
  }

  if (fromDateVal && toDateVal) {
    where.date_of_initiation = {
      [Op.between]: [
        new Date(fromDateVal + "T00:00:00"),
        new Date(toDateVal + "T23:59:59"),
      ],
    };
  }

  if (equipInstVal && config && config.type === "form") {
    where[config.field] = equipInstVal;
  }

  if (searchVal) {
    const searchPattern = `%${searchVal}%`;
    const orConditions = [
      { area_name: { [Op.like]: searchPattern } },
      { description: { [Op.like]: searchPattern } },
    ];

    if (config) {
      if (config.type === "form") {
        orConditions.push({
          [config.field]: { [Op.like]: searchPattern },
        });
      } else if (config.type === "record") {
        orConditions.push({
          [`$${config.association}.${config.field}$`]: {
            [Op.like]: searchPattern,
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
    const userId = req.user.userId;
    const allowedDeptIds = await getDepartmentsForUser(userId);

    // Fetch all processes
    
    let filtersObj = {};
    if (req.query.filters) {
      try {
        filtersObj = typeof req.query.filters === "string" ? JSON.parse(req.query.filters) : req.query.filters;
      } catch (err) {}
    }

    const targetProcessId = req.query.process_id || filtersObj.process_id || filtersObj.recordType;
    const page = parseInt(req.query.page || filtersObj.page || 1, 10);
    const limit = parseInt(req.query.limit || filtersObj.limit || 10, 10);
    const targetEquipInstId = req.query.equipInstId || filtersObj.equipInstId;

    const allProcesses = await Process.findAll();
    const processes = targetProcessId
      ? allProcesses.filter((p) => Number(p.process_id) === Number(targetProcessId))
      : allProcesses;
    let response = [];

    for (const process of processes) {
      const registry = formModelRegistry[process.process_id];

      if (!registry || !registry.form) continue;

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
          department_id: {
            [Op.in]: allowedDeptIds,
          },
        },
        include: includeModels,
        order: [["form_id", "DESC"]],
      });

      let mappedRecords = records.map((record) => {
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

      
      if (targetEquipInstId) {
        const targetLower = String(targetEquipInstId).trim().toLowerCase();
        mappedRecords = mappedRecords.filter((r) => {
          const eqStr = r.equipmentID ? String(r.equipmentID).trim().toLowerCase() : "";
          const instStr = r.instrumentID ? String(r.instrumentID).trim().toLowerCase() : "";
          return eqStr === targetLower || instStr === targetLower || eqStr.includes(targetLower) || instStr.includes(targetLower);
        });
      }

      for (const record of mappedRecords) {
        response.push({
          process_id: process.process_id,
          process: process.process,
          data: [record],
          date_of_initiation: record.date_of_initiation,
        });
      }
    }

    response.sort((a, b) => {
      const dateA = a.date_of_initiation ? new Date(a.date_of_initiation).getTime() : 0;
      const dateB = b.date_of_initiation ? new Date(b.date_of_initiation).getTime() : 0;
      return dateB - dateA;
    });

    const totalRecords = response.length;
    const startIndex = (page - 1) * limit;
    const paginatedData = response.slice(startIndex, startIndex + limit);

    res.json({
      error: false,
      data: paginatedData,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      page,
      limit,
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
    const userId = req.user.userId;
    const allowedDeptIds = await getDepartmentsForUser(userId);

    // Fetch all processes
    
    let filtersObj = {};
    if (req.query.filters) {
      try {
        filtersObj = typeof req.query.filters === "string" ? JSON.parse(req.query.filters) : req.query.filters;
      } catch (err) {}
    }

    const targetProcessId = req.query.process_id || filtersObj.process_id || filtersObj.recordType;
    const page = parseInt(req.query.page || filtersObj.page || 1, 10);
    const limit = parseInt(req.query.limit || filtersObj.limit || 10, 10);
    const targetEquipInstId = req.query.equipInstId || filtersObj.equipInstId;

    const allProcesses = await Process.findAll();
    const processes = targetProcessId
      ? allProcesses.filter((p) => Number(p.process_id) === Number(targetProcessId))
      : allProcesses;
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
      if (FormModel.rawAttributes && FormModel.rawAttributes.fiscal_year) {
        formAttributes.push("fiscal_year");
      }

      const records = await FormModel.findAll({
        attributes: formAttributes,
        where: {
          ...filters,
          workflow_state_id: 4, // fixed condition for effective elogs
          department_id: {
            [Op.in]: allowedDeptIds,
          },
        },
        include: includeModels,
        order: [["form_id", "DESC"]],
      });

      let mappedRecords = records.map((record) => {
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
          fiscal_year: record.fiscal_year || null,
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

      
      if (targetEquipInstId) {
        const targetLower = String(targetEquipInstId).trim().toLowerCase();
        mappedRecords = mappedRecords.filter((r) => {
          const eqStr = r.equipmentID ? String(r.equipmentID).trim().toLowerCase() : "";
          const instStr = r.instrumentID ? String(r.instrumentID).trim().toLowerCase() : "";
          return eqStr === targetLower || instStr === targetLower || eqStr.includes(targetLower) || instStr.includes(targetLower);
        });
      }

      for (const record of mappedRecords) {
        response.push({
          process_id: process.process_id,
          process: process.process,
          data: [record],
          date_of_initiation: record.date_of_initiation,
        });
      }
    }

    response.sort((a, b) => {
      const dateA = a.date_of_initiation ? new Date(a.date_of_initiation).getTime() : 0;
      const dateB = b.date_of_initiation ? new Date(b.date_of_initiation).getTime() : 0;
      return dateB - dateA;
    });

    const totalRecords = response.length;
    const startIndex = (page - 1) * limit;
    const paginatedData = response.slice(startIndex, startIndex + limit);

    res.json({
      error: false,
      data: paginatedData,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      page,
      limit,
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

exports.GetEquipmentAndInstruments = async (req, res) => {
  try {
    const userId = req.user.userId;
    const allowedDeptIds = await getDepartmentsForUser(userId);
    const equipments = new Set();
    const instruments = new Set();

    const promises = Object.keys(SEARCHABLE_FIELDS).map(async (processId) => {
      const config = SEARCHABLE_FIELDS[processId];
      const registry = formModelRegistry[processId];
      if (!registry) return;

      if (config.type === "form") {
        if (!registry.form) return;
        const records = await registry.form.findAll({
          attributes: [[sequelize.fn('DISTINCT', sequelize.col(config.field)), 'value']],
          where: {
            department_id: { [Op.in]: allowedDeptIds }
          },
          raw: true
        });
        records.forEach(r => {
          const val = r.value;
          const valStr = val ? String(val).trim() : "";
          if (valStr !== "") {
            if (config.targetKey === "equipmentID") equipments.add(valStr);
            else instruments.add(valStr);
          }
        });
      } else if (config.type === "record") {
        if (!registry.form || !registry.record) return;
        const forms = await registry.form.findAll({
          where: {
            department_id: { [Op.in]: allowedDeptIds }
          },
          include: [{
            model: registry.record,
            as: config.association,
            attributes: [config.field],
            required: true
          }],
          raw: true
        });
        forms.forEach(f => {
          const key = Object.keys(f).find(k => k.toLowerCase().endsWith(config.field.toLowerCase()));
          const val = key ? f[key] : null;
          const valStr = val ? String(val).trim() : "";
          if (valStr !== "") {
            if (config.targetKey === "equipmentID") equipments.add(valStr);
            else instruments.add(valStr);
          }
        });
      }
    });

    await Promise.all(promises);

    return res.json({
      error: false,
      data: {
        equipments: Array.from(equipments).sort(),
        instruments: Array.from(instruments).sort()
      }
    });
  } catch (error) {
    console.error("Error fetching equipment and instruments:", error);
    return res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

exports.getProcessAnalytics = async (req, res) => {
  try {
    const { process_id } = req.params;
    const { month, year } = req.query;

    if (!process_id) {
      return res.status(400).json({ error: true, message: "Process ID is required" });
    }

    const registry = formModelRegistry[process_id];
    if (!registry) {
      return res.status(400).json({ error: true, message: "Invalid or unregistered process ID" });
    }

    const formWhere = {};
    if (year && month) {
      const fromDate = new Date(year, month - 1, 1);
      const toDate = new Date(year, month, 0, 23, 59, 59);
      formWhere.date_of_initiation = {
        [Op.between]: [fromDate, toDate]
      };
    }

    const forms = await registry.form.findAll({
      where: formWhere,
      include: registry.record ? [{ model: registry.record, required: false }] : [],
    });

    const statusCounts = {
      "Initiated": 0,
      "Under Review": 0,
      "Under Approval": 0,
      "Approved": 0
    };
    let totalForms = 0;
    
    forms.forEach(f => {
      totalForms++;
      const s = f.status || "Initiated";
      if (statusCounts[s] !== undefined) {
        statusCounts[s]++;
      } else {
        statusCounts[s] = (statusCounts[s] || 0) + 1;
      }
    });

    let totalRecords = 0;
    let filledRecordsCount = 0;
    let complianceRate = 0;
    const specificData = {};

    if (registry.record) {
      const allRecords = [];
      forms.forEach(f => {
        const plainForm = f.toJSON();
        const recordsKey = Object.keys(plainForm).find(key => Array.isArray(plainForm[key]));
        if (recordsKey && plainForm[recordsKey]) {
          allRecords.push(...plainForm[recordsKey]);
        }
      });

      totalRecords = allRecords.length;
      const processIdNum = parseInt(process_id, 10);

      if (processIdNum === 20) {
        const cleaningAgentCounts = { T: 0, NA: 0 };
        const disinfectantCounts = { D: 0, S: 0, NA: 0 };
        const sanitizerCounts = { SHC: 0, NA: 0 };
        const drainCleanedCounts = { "√": 0, NA: 0 };

        allRecords.forEach(r => {
          if (r.status) {
            filledRecordsCount++;
            const status = String(r.status).trim();
            const rowId = parseInt(r.row_id, 10);
            if (rowId === 2) {
              if (cleaningAgentCounts[status] !== undefined) cleaningAgentCounts[status]++;
            } else if (rowId === 3) {
              if (disinfectantCounts[status] !== undefined) disinfectantCounts[status]++;
            } else if (rowId === 4) {
              if (sanitizerCounts[status] !== undefined) sanitizerCounts[status]++;
            } else if (rowId >= 6 && rowId <= 15) {
              if (drainCleanedCounts[status] !== undefined) drainCleanedCounts[status]++;
            }
          }
        });

        specificData.type = "drain-cleaning";
        specificData.cleaningAgentCounts = cleaningAgentCounts;
        specificData.disinfectantCounts = disinfectantCounts;
        specificData.sanitizerCounts = sanitizerCounts;
        specificData.drainCleanedCounts = drainCleanedCounts;

      } else if (processIdNum === 1 || processIdNum === 2 || processIdNum === 5) {
        const readings = [];
        let limitViolations = 0;

        allRecords.forEach(r => {
          const keys = Object.keys(r);
          const valKey = keys.find(k => k.toLowerCase().includes("reading") || k.toLowerCase().includes("pressure") || k.toLowerCase().includes("value"));
          const val = valKey ? parseFloat(r[valKey]) : null;

          if (val !== null && !isNaN(val)) {
            filledRecordsCount++;
            readings.push(val);

            const parentForm = forms.find(form => form.form_id === r.form_id);
            if (parentForm) {
              const uLimit = parseFloat(parentForm.upperActionLimit || parentForm.upperAcceptanceCriteria);
              const lLimit = parseFloat(parentForm.lowerActionLimit || parentForm.lowerAcceptanceCriteria);
              if (!isNaN(uLimit) && val > uLimit) limitViolations++;
              if (!isNaN(lLimit) && val < lLimit) limitViolations++;
            }
          }
        });

        const numReadings = readings.length;
        const minVal = numReadings > 0 ? Math.min(...readings) : 0;
        const maxVal = numReadings > 0 ? Math.max(...readings) : 0;
        const avgVal = numReadings > 0 ? (readings.reduce((a, b) => a + b, 0) / numReadings) : 0;

        specificData.type = "numerical";
        specificData.stats = {
          min: parseFloat(minVal.toFixed(2)),
          max: parseFloat(maxVal.toFixed(2)),
          avg: parseFloat(avgVal.toFixed(2)),
          limitViolations
        };
        
        const dailyTrends = Array.from({ length: 31 }, (_, i) => ({ day: i + 1, sum: 0, count: 0 }));
        allRecords.forEach(r => {
          const keys = Object.keys(r);
          const valKey = keys.find(k => k.toLowerCase().includes("reading") || k.toLowerCase().includes("pressure") || k.toLowerCase().includes("value"));
          const val = valKey ? parseFloat(r[valKey]) : null;
          const day = parseInt(r.day || r.date_day, 10);
          
          if (val !== null && !isNaN(val) && day >= 1 && day <= 31) {
            dailyTrends[day - 1].sum += val;
            dailyTrends[day - 1].count += 1;
          }
        });

        specificData.trends = dailyTrends.map(t => ({
          day: t.day,
          value: t.count > 0 ? parseFloat((t.sum / t.count).toFixed(2)) : null
        }));

      } else {
        allRecords.forEach(r => {
          if (r.status) {
            filledRecordsCount++;
          }
        });
        specificData.type = "generic";
      }

      complianceRate = totalRecords > 0 ? Math.round((filledRecordsCount / totalRecords) * 100) : 0;
    }

    return res.status(200).json({
      error: false,
      data: {
        process_id: parseInt(process_id, 10),
        totalForms,
        statusCounts,
        complianceRate,
        totalRecords,
        filledRecordsCount,
        specificData
      }
    });

  } catch (error) {
    console.error("Error generating process analytics:", error);
    return res.status(500).json({
      error: true,
      message: error.message
    });
  }
};

