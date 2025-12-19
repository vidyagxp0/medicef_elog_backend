const Department = require("../models/departments");

exports.getAllDepartments = async (req, res) => {
  Department.findAll()
    .then((result) => {
      res.json({
        error: false,
        message: result,
      });
    })
    .catch((e) => {
      res.status(400).json({
        error: true,
        message: "Couldn't get departments! " + e,
      });
    });
};
