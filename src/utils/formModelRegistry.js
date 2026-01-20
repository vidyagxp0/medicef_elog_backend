// utils/formModelRegistry.js
const DifferentialPressureAuditTrail = require("../models/differentialPressureAuditTrail");
const DifferentialPressureForm = require("../models/differentialPressureForm");
const DifferentialPressureRecord = require("../models/differentialPressureRecords");

const EquipmentUsageAuditTrail = require("../models/EquipmentUsageAuditTrail");
const EquipmentUsageForm = require("../models/EquipmentUsageForm");
const EquipmentUsageRecord = require("../models/EquipmentUsageRecords");

const TemperatureRecordsAuditTrail = require("../models/temperatureRecordsAuditTrail");
const TempratureProcessForm = require("../models/tempratureProcessForm");
const TempratureProcessRecord = require("../models/tempratureProcessRecords");

const AreaCleaningAuditTrail = require("../models/areaCleaningAuditTrail");
const AreaCleaningForm = require("../models/areaCleaningForm");
const AreaCleaningRecord = require("../models/areaCleaningRecord");

const dpMonitoringAuditTrail = require("../models/dpMonitoringAuditTrail");
const dpMonitoringForm = require("../models/dpMonitoringForm");
const dpMonitoringRecord = require("../models/dpMonitoringRecord");

module.exports = {
  1: {
    form: DifferentialPressureForm,
    record: DifferentialPressureRecord,
    audit:DifferentialPressureAuditTrail,
    approverAlias: "approver",
  },
  2: {
    form: TempratureProcessForm,
    record: TempratureProcessRecord,
    audit: TemperatureRecordsAuditTrail,
    approverAlias: "approver",
  },
  3: {
    form: EquipmentUsageForm,
    record: EquipmentUsageRecord,
    audit: EquipmentUsageAuditTrail,
    approverAlias: "approver",
  },
  4: {
    form: AreaCleaningForm,
    record: AreaCleaningRecord,
    audit: AreaCleaningAuditTrail,
    approverAlias: "approver",
  },
  5: {
    form: dpMonitoringForm,
    record: dpMonitoringRecord,
    audit: dpMonitoringAuditTrail,
    approverAlias: "approver",
  },
};
