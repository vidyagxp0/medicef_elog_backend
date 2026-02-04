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

const AhuOperationAuditTrail = require("../models/ahuOperationAuditTrail");
const AhuOperationForm = require("../models/ahuOperationForm");
const AhuOperationRecord = require("../models/ahuOperationRecord");

const instrumentUsageForm = require("../models/instrumentUsageForm");
const instrumentUsageRecord = require("../models/instrumentUsageRecord");
const instrumentUsageAuditTrail = require("../models/instrumentUsageAuditTrail");
const foggingSolutionForm = require("../models/FoggingSolutionForm");
const foggingSolutionRecord = require("../models/FoggingSolutionRecord");
const foggingSolutionAuditTrail = require("../models/FoggingSolutionAuditTrail");

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
  6: {
    form: AhuOperationForm,
    record: AhuOperationRecord,
    audit: AhuOperationAuditTrail,
    approverAlias: "approver",
  },
  7: {
    form: instrumentUsageForm,
    record: instrumentUsageRecord,
    audit: instrumentUsageAuditTrail,
    approverAlias: "approver",
  },
  8: {
    form: foggingSolutionForm,
    record: foggingSolutionRecord,
    audit: foggingSolutionAuditTrail,
    approverAlias: "approver",
  },
};
