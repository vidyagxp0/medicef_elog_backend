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

const areaFoggingForm = require("../models/areaFoggingForm");
const areaFoggingRecord = require("../models/areaFoggingRecord");
const areaFoggingAuditTrail = require("../models/areaFoggingAuditTrail");

const filterCleaningForm = require("../models/filterCleaningForm");
const filterCleaningAuditTrail = require("../models/filterCleaningAuditTrail");
const filterCleaningRecord = require("../models/filterCleaningRecord");

const mediaConsumptionForm = require("../models/mediaConsumptionForm");
const mediaConsumptionAuditTrail = require("../models/mediaConsumptionAuditTrail");
const mediaConsumptionRecord = require("../models/mediaConsumptionRecord");

const DisinfectantStockForm = require("../models/disinfectantStockForm");
const DisinfectantStockRecords = require("../models/disinfectantStockRecords");
const DisinfectantStockAuditTrail = require("../models/disinfectantStockAuditTrail");

const LabAssaySampleForm = require("../models/labAssaySampleForm");
const LabAssaySampleRecord = require("../models/labAssaySampleRecord");
const LabAssaySampleAuditTrail = require("../models/labAssaySampleAuditTrail");

const MicrobialLimitTestForm = require("../models/microbialLimitTestForm");
const MicrobialLimitTestRecords = require("../models/microbialLimitTestRecords");
const MicrobialLimitTestAuditTrail = require("../models/microbialLimitTestAuditTrail");

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
  9: {
    form: areaFoggingForm,
    record: areaFoggingRecord,
    audit: areaFoggingAuditTrail,
    approverAlias: "approver",
  },
  10: {
    form: filterCleaningForm,
    record: filterCleaningRecord,
    audit: filterCleaningAuditTrail,
    approverAlias: "approver",
  },
  11: {
    form: mediaConsumptionForm,
    record: mediaConsumptionRecord,
    audit: mediaConsumptionAuditTrail,
    approverAlias: "approver",
  },
  12: {
    form: DisinfectantStockForm,
    record: DisinfectantStockRecords,
    audit: DisinfectantStockAuditTrail,
    approverAlias: "approver",
  },
  13: {
    form: LabAssaySampleForm,
    record: LabAssaySampleRecord,
    audit: LabAssaySampleAuditTrail,
    approverAlias: "approver",
  },
  14: {
    form: MicrobialLimitTestForm,
    record: MicrobialLimitTestRecords,
    audit: MicrobialLimitTestAuditTrail,
    approverAlias: "approver",
  },
};
