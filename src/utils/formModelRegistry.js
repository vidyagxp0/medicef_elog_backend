// utils/formModelRegistry.js
const DifferentialPressureForm = require("../models/differentialPressureForm");
const DifferentialPressureRecord = require("../models/differentialPressureRecords");

const TempratureProcessForm = require("../models/tempratureProcessForm");
const TempratureProcessRecord = require("../models/tempratureProcessRecords");

module.exports = {
  1: {
    form: DifferentialPressureForm,
    record: DifferentialPressureRecord,
    approverAlias: "approver",
  },
//   2: {
//     form: TempratureProcessForm,
//     record: TempratureProcessRecord,
//     approverAlias: "tpapprover",
//   },
};
