const User = require("../models/users");
const DifferentialPressureForm = require("../models/differentialPressureForm");
const DifferentialPressureRecord = require("../models/differentialPressureRecords");
const TempratureProcessRecord = require("../models/tempratureProcessRecords");
const TempratureProcessForm = require("../models/tempratureProcessForm");
const Process = require("../models/processes");
const Department = require("../models/departments");
const { Op } = require("sequelize");

exports.GetAllElogs = async (req, res) => {
  try {
    //https://worldtimeapi.org/api/timezone/Asia/Kolkata
    //equipment
    //record numbber
    //department
    // area name
    //description
    //created by 
    // date of creation
    const seacrhParams = req.params;
    // Fetch differential pressure records
    const differentialPressureElogs = await DifferentialPressureForm.findAll({
      order: [["form_id", "DESC"]],
    });

    // Fetch temperature process records
    const tempratureProcessElogs = await TempratureProcessForm.findAll({
      order: [["form_id", "DESC"]],
    });

    // Return combined response
    res.json({
      error: false,
      differentialPressureElogs,
      tempratureProcessElogs,
    });
  } catch (error) {
    res.status(400).json({
      error: true,
      message: error.message,
    });
  }
};
exports.GetAllEffectiveElogs = async (req, res) => {
  try {
    //https://worldtimeapi.org/api/timezone/Asia/Kolkata
    //equipment
    //record numbber
    //department
    // area name
    //description
    //created by 
    // date of creation
    const seacrhParams = req.params;
    // Fetch differential pressure records
    const differentialPressureElogs = await DifferentialPressureForm.findAll({
      where:{
        status: "Closed"
      },
      include: [
        { model: DifferentialPressureRecord },
        // reviewer ko uske ander hi json me daaal diya 
        // { model: User, as: "reviewer", attributes: ["user_id", "name"] },
        { model: User, as: "approver", attributes: ["user_id", "name"] },
      ],
      order: [["form_id", "DESC"]],
    });

    // Fetch temperature process records
    const tempratureProcessElogs = await TempratureProcessForm.findAll({
      where:{
        status: "Closed"
      },
      include: [
        { model: TempratureProcessRecord },
        // { model: User, as: "tpreviewer", attributes: ["user_id", "name"] },
        { model: User, as: "tpapprover", attributes: ["user_id", "name"] },
      ],
      order: [["form_id", "DESC"]],
    });

    // Return combined response
    res.json({
      error: false,
      differentialPressureElogs,
      tempratureProcessElogs,
    });
  } catch (error) {
    res.status(400).json({
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


