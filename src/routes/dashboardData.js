const express = require("express");
const router = express.Router();
const Auth = require("../middlewares/authentication");
const dashboardDataController = require("../controllers/dashboardDataController");

router.get("/get-all", Auth.checkUserJwtToken, dashboardDataController.GetAllElogs);
router.get("/get-all-effective", Auth.checkUserJwtToken, dashboardDataController.GetAllEffectiveElogs);
router.get("/get-processes", dashboardDataController.getAllProcesses);
router.get('/get-departments', dashboardDataController.getAllDepartments);
router.get('/get-server-time', dashboardDataController.getServerTime);



module.exports = router;
