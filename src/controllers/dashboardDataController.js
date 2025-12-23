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
      include: [
        { model: DifferentialPressureRecord },
        { model: User, as: "reviewer", attributes: ["user_id", "name"] },
        { model: User, as: "approver", attributes: ["user_id", "name"] },
      ],
      order: [["form_id", "DESC"]],
    });

    // Fetch temperature process records
    const tempratureProcessElogs = await TempratureProcessForm.findAll({
      include: [
        { model: TempratureProcessRecord },
        { model: User, as: "tpreviewer", attributes: ["user_id", "name"] },
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


