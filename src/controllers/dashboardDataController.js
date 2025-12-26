const User = require("../models/users");
const DifferentialPressureForm = require("../models/differentialPressureForm");
const DifferentialPressureRecord = require("../models/differentialPressureRecords");
const TempratureProcessRecord = require("../models/tempratureProcessRecords");
const TempratureProcessForm = require("../models/tempratureProcessForm");
const processFormRegistry = require("../utils/processFormRegistry");
const formRegistry = require("../utils/formModelRegistry");

const Process = require("../models/processes");
const Department = require("../models/departments");
const { Op } = require("sequelize");
const WorkflowState = require("../models/workflowState");

// exports.GetAllElogs = async (req, res) => {
//   try {
//     //https://worldtimeapi.org/api/timezone/Asia/Kolkata
//     //equipment
//     //record number
//     //department
//     // area name
//     //description
//     // date of creation
//     const seacrhParams = req.params;
//     // Fetch differential pressure records
//         const differentialPressureElogs = await DifferentialPressureForm.findAll({
//           include: [
//             {
//               model: Process,
//               attributes: ["process_id", "process"], // Process column ka correct naam
//             },
//             {
//               model: User,
//               as: "approver",
//               attributes: ["user_id", "name"],
//             },
//           ],
//           order: [["form_id", "DESC"]],
//         });

//     // Fetch temperature process records
//     const tempratureProcessElogs = await TempratureProcessForm.findAll({
//       // include:[{
//       //   model:Process,
//       //   attributes:["process_id" , "Process"]
//       // }],
//       order: [["form_id", "DESC"]],
//     });

//     // Return combined response
//     res.json({
//       error: false,
//       differentialPressureElogs,
//       tempratureProcessElogs,
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: true,
//       message: error.message,
//     });
//   }
// };

// ----------------- Build dynamic filters -----------------
const buildFilters = (query) => {
  const where = {};

  if (query.department_id) {
    where.department_id = query.department_id;
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.from && query.to) {
    where.createdAt = {
      [Op.between]: [query.from, query.to],
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
        // where: filters,
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
        process_name: process.process,
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
        where:{
          workflow_state_id:"4"
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
        process_name: process.process,
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


