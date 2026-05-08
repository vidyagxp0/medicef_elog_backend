// utils/formModelRegistry.js

// Differential Pressure
const DifferentialPressureAuditTrail = require("../models/differentialPressureAuditTrail");
const DifferentialPressureForm = require("../models/differentialPressureForm");
const DifferentialPressureRecord = require("../models/differentialPressureRecords");

// Equipment Usage
const EquipmentUsageAuditTrail = require("../models/EquipmentUsageAuditTrail");
const EquipmentUsageForm = require("../models/EquipmentUsageForm");
const EquipmentUsageRecord = require("../models/EquipmentUsageRecords");

// Temperature & Relative Humidity
const TemperatureRecordsAuditTrail = require("../models/temperatureRecordsAuditTrail");
const TempratureProcessForm = require("../models/tempratureProcessForm");
const TempratureProcessRecord = require("../models/tempratureProcessRecords");

// Area Cleaning
const AreaCleaningAuditTrail = require("../models/areaCleaningAuditTrail");
const AreaCleaningForm = require("../models/areaCleaningForm");
const AreaCleaningRecord = require("../models/areaCleaningRecord");

// DP Monitoring Across Filters
const dpMonitoringAuditTrail = require("../models/dpMonitoringAuditTrail");
const dpMonitoringForm = require("../models/dpMonitoringForm");
const dpMonitoringRecord = require("../models/dpMonitoringRecord");

// Operation of Air Handling Unit
const AhuOperationAuditTrail = require("../models/ahuOperationAuditTrail");
const AhuOperationForm = require("../models/ahuOperationForm");
const AhuOperationRecord = require("../models/ahuOperationRecord");

// Instrument Usage
const instrumentUsageForm = require("../models/instrumentUsageForm");
const instrumentUsageRecord = require("../models/instrumentUsageRecord");
const instrumentUsageAuditTrail = require("../models/instrumentUsageAuditTrail");

// Fogging Solution Preparation
const foggingSolutionForm = require("../models/FoggingSolutionForm");
const foggingSolutionRecord = require("../models/FoggingSolutionRecord");
const foggingSolutionAuditTrail = require("../models/FoggingSolutionAuditTrail");

// Area Fogging
const areaFoggingForm = require("../models/areaFoggingForm");
const areaFoggingRecord = require("../models/areaFoggingRecord");
const areaFoggingAuditTrail = require("../models/areaFoggingAuditTrail");

// Filter Cleaning
const filterCleaningForm = require("../models/filterCleaningForm");
const filterCleaningAuditTrail = require("../models/filterCleaningAuditTrail");
const filterCleaningRecord = require("../models/filterCleaningRecord");

// Media Consumption
const mediaConsumptionForm = require("../models/mediaConsumptionForm");
const mediaConsumptionAuditTrail = require("../models/mediaConsumptionAuditTrail");
const mediaConsumptionRecord = require("../models/mediaConsumptionRecord");

// Disinfectant Stock
const DisinfectantStockForm = require("../models/disinfectantStockForm");
const DisinfectantStockRecords = require("../models/disinfectantStockRecords");
const DisinfectantStockAuditTrail = require("../models/disinfectantStockAuditTrail");

// Lactic Acid Bacillus Assay Sample
const LabAssaySampleForm = require("../models/labAssaySampleForm");
const LabAssaySampleRecord = require("../models/labAssaySampleRecord");
const LabAssaySampleAuditTrail = require("../models/labAssaySampleAuditTrail");

// Microbial Limit Test Sample
const MicrobialLimitRecord = require("../models/microbialLimitRecord");
const MicrobialAuditTrail = require("../models/microbialAuditTrail");
const MicrobialLimitForm = require("../models/microbialLimitForm");

// Dispensing Record
const DispensingForm = require("../models/dispensingForm");
const DispensingRecord = require("../models/dispensingRecord");
const DispensingAuditTrail = require("../models/dispensingAuditTrail");

// Cold Chamber Cleaning
const ColdChamberForm = require("../models/coldChamberForm");
const ColdChamberRecord = require("../models/coldChamberRecord");
const ColdChamberAuditTrail = require("../models/coldChamberAuditTrail");

// Returned Finished Goods Register
const ReturnedFinishedForm = require("../models/returnedFinishedForm");
const ReturnedFinishedRecord = require("../models/returnedFinishedRecord");
const ReturnedFinishedAuditTrail = require("../models/returnedFinishedAuditTrail");

// Dispensing Booth Activity
const DispensingBoothForm = require("../models/dispensingBoothForm");
const DispensingBoothRecord = require("../models/dispensingBoothRecord");
const DispensingBoothAuditTrail = require("../models/dispensingBoothAuditTrail");

// Autoclave Sterelization
const AutoclaveSterelizationForm = require("../models/autoclaveSterelizationForm");
const AutoclaveSterelizationRecord = require("../models/autoclaveSterelizationRecord");
const AutoclaveSterelizationAuditTrail = require("../models/autoclaveSterelizationAuditTrail");

// Drain Cleaning
const DrainCleaningForm = require("../models/drainCleaningForm");
const DrainCleaningRecord = require("../models/drainCleaningRecord");
const DrainCleaningAuditTrail = require("../models/drainCleaningAuditTrail");

// Breakdown / Maintenance
const BreakdownMaintenanceForm = require("../models/breakdownMaintenanceForm");
const BreakdownMaintenanceRecord = require("../models/breakdownMaintenanceRecord");
const BreakdownMaintenanceAuditTrail = require("../models/breakdownMaintenanceAuditTrail");

// Cleaning & Disinfectant Solution
const CleaningAndDisinfectantForm = require("../models/cleaningAndDisinfectantForm");
const CleaningAndDisinfectantRecord = require("../models/cleaningAndDisinfectantRecord");
const CleaningAndDisinfectantAuditTrail = require("../models/cleaningAndDisinfectantAuditTrail");


// Daily Calibration
const DailyCalibrationForm = require("../models/dailyVerificationForm");
const DailyCalibrationRecord = require("../models/dailyVerificationRecord");
const DailyCalibrationAuditTrail = require("../models/dailyVerificationAuditTrail");

// Balance Uses Log Book
// const BalanceUsesLogForm = require("../models/balanceUsesLogForm");
// const BalanceUsesLogRecord = require("../models/balanceUsesLogRecord");
// const BalanceUsesLogAuditTrail = require("../models/balanceUsesLogAuditTrail");

// Daily Verification
const DailyVerificationForm = require("../models/dailyVerificationForm");
const DailyVerificationRecord = require("../models/dailyVerificationRecord");
const DailyVerificationAuditTrail = require("../models/dailyVerificationAuditTrail");

// Monthly Calibration
// const MonthlyCalibrationForm = require("../models/monthlyCalibrationForm");
// const MonthlyCalibrationRecord = require("../models/monthlyCalibrationRecord");
// const MonthlyCalibrationAuditTrail = require("../models/monthlyCalibrationAuditTrail");

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
    form: MicrobialLimitForm,
    record: MicrobialLimitRecord,
    audit: MicrobialAuditTrail,
    approverAlias: "approver",
  },
  15: {
    form: DispensingForm,
    record: DispensingRecord,
    audit: DispensingAuditTrail,
    approverAlias: "approver",
  },
  16: {
    form: ColdChamberForm,
    record: ColdChamberRecord,
    audit: ColdChamberAuditTrail,
    approverAlias: "approver",
  },
  17: {
    form: ReturnedFinishedForm,
    record: ReturnedFinishedRecord,
    audit: ReturnedFinishedAuditTrail,
    approverAlias: "approver",
  },
  18: {
    form: DispensingBoothForm,
    record: DispensingBoothRecord,
    audit: DispensingBoothAuditTrail,
    approverAlias: "approver",
  },
  19: {
    form: AutoclaveSterelizationForm,
    record: AutoclaveSterelizationRecord,
    audit: AutoclaveSterelizationAuditTrail,
    approverAlias: "approver",
  },
  20: {
  form: DrainCleaningForm,
  record: DrainCleaningRecord,
  audit: DrainCleaningAuditTrail,
  approverAlias: "approver",
},

21: {
  form: BreakdownMaintenanceForm,
  record: BreakdownMaintenanceRecord,
  audit: BreakdownMaintenanceAuditTrail,
  approverAlias: "approver",
},

22: {
  form: CleaningAndDisinfectantForm,
  record: CleaningAndDisinfectantRecord,
  audit: CleaningAndDisinfectantAuditTrail,
  approverAlias: "approver",
},

// 23: {
//   form: DailyCalibrationForm,
//   record: DailyCalibrationRecord,
//   audit: DailyCalibrationAuditTrail,
//   approverAlias: "approver",
// },

// 24: {
//   form: BalanceUsesLogForm,
//   record: BalanceUsesLogRecord,
//   audit: BalanceUsesLogAuditTrail,
//   approverAlias: "approver",
// },

23: {
  form: DailyVerificationForm,
  record: DailyVerificationRecord,  
  audit: DailyVerificationAuditTrail,
  approverAlias: "approver",
},

// 26: {
//   form: MonthlyCalibrationForm,
//   record: MonthlyCalibrationRecord,
//   audit: MonthlyCalibrationAuditTrail,
//   approverAlias: "approver",
// },

};
