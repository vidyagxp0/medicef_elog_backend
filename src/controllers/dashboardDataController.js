const User = require("../models/users");
const processFormRegistry = require("../utils/processFormRegistry");
const formRegistry = require("../utils/formModelRegistry");

const Process = require("../models/processes");
const Department = require("../models/departments");
const { Op } = require("sequelize");
const WorkflowState = require("../models/workflowState");
const formModelRegistry = require("../utils/formModelRegistry");
const UserRole = require("../models/userRoles");
const auditFieldMap = require("../utils/auditFieldMap");

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const getUserById = async (user_id) => {
  const user = await User.findOne({ where: { user_id, isActive: true } });
  return user;
};
// ----------------- Build dynamic filters -----------------
const buildFilters = (query) => {
  const where = {};

  if (query.area_name ) {
    where.area_name = query.area_name;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.departmentName) {
    where.departmentName = query.departmentName;
  }
  // if (query.process) {
  //   where.process = query.process;
  // }

  if (query.from && query.to) {
    where.date_of_initiation = {
      [Op.between]: [
        new Date(query.from + "T00:00:00"),
        new Date(query.to + "T23:59:59")
      ]
    };
  }

  if (query.search) {
    where[Op.or] = [
      { equipment_name: { [Op.like]: `%${query.search}%` } },
      { description: { [Op.like]: `%${query.search}%` } },
    ];
  }

  return where;
};
exports.GetAllElogs = async (req, res) => {
  try {
    // Fetch all processes
    const processes = await Process.findAll();
    let response = [];

    for (const process of processes) {
      const FormModel = processFormRegistry[process.process_id];
      if (!FormModel) continue; // Agar model registry me na ho toh skip

      // Apply filters
      const filters = buildFilters(req.query);

      const records = await FormModel.findAll({
        where: filters,
        include: [
          {
            model: WorkflowState,
            as: "workflow_state"
          },
          {
            model: User,
            as: "approver",
            attributes: ["user_id", "name"],
            required: false,
          },
        ],
        order: [["form_id", "DESC"]],
      });

      response.push({
        process_id: process.process_id,
        process: process.process,
        data: records,
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

    const registry = formRegistry[process_id];
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
    });``
    if(!elogData){
      return res.json({
        error: true,
        message:"No data Found"
      })
    }

    return res.json({
      error: false,
      message:"Data fetch Successfully",
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
      const FormModel = processFormRegistry[process.process_id];
      if (!FormModel) continue; // Agar model registry me na ho toh skip

      // Apply filters
      const filters = buildFilters(req.query);

      const records = await FormModel.findAll({
        // where: filters,
        where: {
          ...filters,              // 🔹 dynamic filters
          workflow_state_id: 4     // 🔹 fixed condition
        },
        include: [
          {
            model: WorkflowState,
            as: "workflow_state"
          },
          {
            model: User,
            as: "approver",
            attributes: ["user_id", "name"],
            required: false,
          },
        ],
        order: [["form_id", "DESC"]],
      });

      response.push({
        process_id: process.process_id,
        process: process.process,
        data: records,
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

    const registry = formRegistry[process_id];
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
      ((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7
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
    if(!role_id,!department_id,!process_id){
      return res.status(400).json({
        error:true,
        message:"please provide all details"
      })
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
  const { form_id,process_id, type } = req.params;
  const userId = req.user.userId
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
        where:{form_id},
      })
      const departmentName = FormData.departmentName

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
          new_value: formatAuditValue(data.new_value),
          previous_value: formatAuditValue(data.previous_value),

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
      departmentName:departmentName
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
        "header",
        { reportData: data, logoDataUri: logoDataUri },
        (err, html) => {
          if (err) return reject(err);
          resolve(html);
        }
      );
    });

    const footerHtml = await new Promise((resolve, reject) => {
      req.app.render(
        "footer",
        { userName: user?.name, date: formattedDate },
        (err, html) => {
          if (err) return reject(err);
          resolve(html);
        }
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
      landscape:true,
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: headerHtml,
      footerTemplate: footerHtml,
      margin: {
      top: "180px",
      bottom: "60px",
      left: "40px",
      right: "40px"
      },
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${type}_Audit_Report.pdf`
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



