const express = require('express');
const router = express.Router();
const Department = require("../controllers/department");
const Auth = require("../middlewares/authentication")


router.get('/get-departments', Department.getAllDepartments);

module.exports = router;