// utils/formModelRegistry.js
const DifferentialPressureForm = require("../models/differentialPressureForm");
const EquipmentUsageForm = require("../models/EquipmentUsageForm");
const TempratureProcessForm = require("../models/tempratureProcessForm");

module.exports = {
  1: DifferentialPressureForm,   // process_id = 1
  2: TempratureProcessForm,      // process_id = 2
  3: EquipmentUsageForm,      // process_id = 2

};
