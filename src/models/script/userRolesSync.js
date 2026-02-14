const { sequelize } = require("../../config/db");
const { DataTypes } = require("sequelize");
const Role = require("../../models/roles");
const Department = require("../../models/departments");
const User = require("../../models/users");
const Process = require("../../models/processes");
const RoleGroup = require("../../models/roleGroups");
const UserRole = require("../../models/userRoles");

const rolesArray1 = [
  // Quality Assurance
  {
    label: "Quality Assurance-Differential Pressure Record-Initiator",
     },
  {
    label: "Quality Assurance-Temperature & Relative Humidity Record-Initiator",
     },
  { label: "Quality Assurance-Equipment Usage Record-Initiator", },
  { label: "Quality Assurance-Area Cleaning Record-Initiator", },
  {
    label: "Quality Assurance-DP Monitoring Across Filters Record-Initiator",
     },
  {
    label: "Quality Assurance-Operation of Air Handling Unit Record-Initiator",
     },
  { label: "Quality Assurance-Instrument Usage Record-Initiator",},
  { label: "Quality Assurance-Disinfectant Stock Record-Initiator",},
  { label: "Quality Assurance-Lactic Acid Bacillus Assay Sample Record-Initiator",},
  { label: "Quality Assurance-Microbial Limit Test Sample Record-Initiator",},
  { label: "Quality Assurance-Fogging Solution Preparation Record-Initiator", },
  { label: "Quality Assurance-Area Fogging Record-Initiator", },
  { label: "Quality Assurance-Filter Cleaning Record-Initiator", },
  { label: "Quality Assurance-Media Consumption Record-Initiator", },
  { label: "Quality Assurance-Dispensing Record-Initiator", },
{ label: "Quality Assurance-Cold Chamber Cleaning Record-Initiator", },
{ label: "Quality Assurance-Returned Finished Goods Register Record-Initiator", },
{ label: "Quality Assurance-Dispensing Booth Activity Record-Initiator", },
{ label: "Quality Assurance-Autoclave Sterelization Record-Initiator", },
{ label: "Quality Assurance-Drain cleaning and sanitization Record-Initiator" },
{ label: "Quality Assurance-Breakdown / Maintenance Work Order Record-Initiator" },
{ label: "Quality Assurance-Cleaning and Disinfectant solution preparation distribution and destruction Record-Initiator" },



  // Quality Control
  { label: "Quality Control-Differential Pressure Record-Initiator",} ,
  {
    label: "Quality Control-Temperature & Relative Humidity Record-Initiator",
     },
  { label: "Quality Control-Equipment Usage Record-Initiator" },
  { label: "Quality Control-Area Cleaning Record-Initiator"},
  {
    label: "Quality Control-DP Monitoring Across Filters Record-Initiator",
      },
  {
    label: "Quality Control-Operation of Air Handling Unit Record-Initiator",
      },
  { label: "Quality Control-Instrument Usage Record-Initiator",} ,
  { label: "Quality Control-Disinfectant Stock Record-Initiator",} ,
  { label: "Quality Control-Lactic Acid Bacillus Assay Sample Record-Initiator",} ,
  { label: "Quality Control-Microbial Limit Test Sample Record-Initiator",} ,
  { label: "Quality Control-Fogging Solution Preparation Record-Initiator", },
  { label: "Quality Control-Area Fogging Record-Initiator", },
  { label: "Quality Control-Filter Cleaning Record-Initiator", },
  { label: "Quality Control-Media Consumption Record-Initiator", },
  { label: "Quality Control-Dispensing Record-Initiator" },
{ label: "Quality Control-Cold Chamber Cleaning Record-Initiator" },
{ label: "Quality Control-Returned Finished Goods Register Record-Initiator" },
{ label: "Quality Control-Dispensing Booth Activity Record-Initiator" },
{ label: "Quality Control-Autoclave Sterelization Record-Initiator" },
{ label: "Quality Control-Drain cleaning and sanitization Record-Initiator" },
{ label: "Quality Control-Breakdown / Maintenance Work Order Record-Initiator" },
{ label: "Quality Control-Cleaning and Disinfectant solution preparation distribution and destruction Record-Initiator" },



  // Production
  { label: "Production-Differential Pressure Record-Initiator", },
  {
    label: "Production-Temperature & Relative Humidity Record-Initiator",
      },
  { label: "Production-Equipment Usage Record-Initiator", },
  { label: "Production-Area Cleaning Record-Initiator", },
  { label: "Production-DP Monitoring Across Filters Record-Initiator",} ,
  { label: "Production-Operation of Air Handling Unit Record-Initiator",} ,
  { label: "Production-Instrument Usage Record-Initiator", },
  { label: "Production-Disinfectant Stock Record-Initiator", },
  { label: "Production-Lactic Acid Bacillus Assay Sample Record-Initiator", },
  { label: "Production-Microbial Limit Test Sample Record-Initiator", },
  { label: "Production-Fogging Solution Preparation Record-Initiator", },
  { label: "Production-Area Fogging Record-Initiator", },
  { label: "Production-Filter Cleaning Record-Initiator", },
  { label: "Production-Media Consumption Record-Initiator", },
  { label: "Production-Dispensing Record-Initiator" },
{ label: "Production-Cold Chamber Cleaning Record-Initiator" },
{ label: "Production-Returned Finished Goods Register Record-Initiator" },
{ label: "Production-Dispensing Booth Activity Record-Initiator" },
{ label: "Production-Autoclave Sterelization Record-Initiator" },
{ label: "Production-Drain cleaning and sanitization Record-Initiator" },
{ label: "Production-Breakdown / Maintenance Work Order Record-Initiator" },
{ label: "Production-Cleaning and Disinfectant solution preparation distribution and destruction Record-Initiator" },



  // Warehouse
  { label: "Warehouse-Differential Pressure Record-Initiator", },
  {
    label: "Warehouse-Temperature & Relative Humidity Record-Initiator",
      },
  { label: "Warehouse-Equipment Usage Record-Initiator", },
  { label: "Warehouse-Area Cleaning Record-Initiator", },
  { label: "Warehouse-DP Monitoring Across Filters Record-Initiator", },
  { label: "Warehouse-Operation of Air Handling Unit Record-Initiator", },
  { label: "Warehouse-Instrument Usage Record-Initiator", },
  { label: "Warehouse-Disinfectant Stock Record-Initiator", },
  { label: "Warehouse-Lactic Acid Bacillus Assay Sample Record-Initiator", },
  { label: "Warehouse-Microbial Limit Test Sample Record-Initiator", },
  { label: "Warehouse-Fogging Solution Preparation Record-Initiator", },
  { label: "Warehouse-Area Fogging Record-Initiator", },
  { label: "Warehouse-Filter Cleaning Record-Initiator", },
  { label: "Warehouse-Media Consumption Record-Initiator", },
  { label: "Warehouse-Dispensing Record-Initiator" },
{ label: "Warehouse-Cold Chamber Cleaning Record-Initiator" },
{ label: "Warehouse-Returned Finished Goods Register Record-Initiator" },
{ label: "Warehouse-Dispensing Booth Activity Record-Initiator" },
{ label: "Warehouse-Autoclave Sterelization Record-Initiator" },
{ label: "Warehouse-Drain cleaning and sanitization Record-Initiator" },
{ label: "Warehouse-Breakdown / Maintenance Work Order Record-Initiator" },
{ label: "Warehouse-Cleaning and Disinfectant solution preparation distribution and destruction Record-Initiator" },



  // Engineering
  { label: "Engineering-Differential Pressure Record-Initiator", },
  {
    label: "Engineering-Temperature & Relative Humidity Record-Initiator",
      },
  { label: "Engineering-Equipment Usage Record-Initiator", },
  { label: "Engineering-Area Cleaning Record-Initiator", },
  { label: "Engineering-DP Monitoring Across Filters Record-Initiator", },
  { label: "Engineering-Operation of Air Handling Unit Record-Initiator", },
  { label: "Engineering-Instrument Usage Record-Initiator", },
  { label: "Engineering-Disinfectant Stock Record-Initiator", },
  { label: "Engineering-Lactic Acid Bacillus Assay Sample Record-Initiator", },
  { label: "Engineering-Microbial Limit Test Sample Record-Initiator", },
  { label: "Engineering-Fogging Solution Preparation Record-Initiator", },
  { label: "Engineering-Area Fogging Record-Initiator", },
  { label: "Engineering-Filter Cleaning Record-Initiator", },
  { label: "Engineering-Media Consumption Record-Initiator", },
  { label: "Engineering-Dispensing Record-Initiator" },
{ label: "Engineering-Cold Chamber Cleaning Record-Initiator" },
{ label: "Engineering-Returned Finished Goods Register Record-Initiator" },
{ label: "Engineering-Dispensing Booth Activity Record-Initiator" },
{ label: "Engineering-Autoclave Sterelization Record-Initiator" },
{ label: "Engineering-Drain cleaning and sanitization Record-Initiator" },
{ label: "Engineering-Breakdown / Maintenance Work Order Record-Initiator" },
{ label: "Engineering-Cleaning and Disinfectant solution preparation distribution and destruction Record-Initiator" },



  // Human Resources
  {
    label: "Human Resources-Differential Pressure Record-Initiator",
      },
  {
    label: "Human Resources-Temperature & Relative Humidity Record-Initiator",
      },
  { label: "Human Resources-Equipment Usage Record-Initiator",} ,
  { label: "Human Resources-Area Cleaning Record-Initiator",} ,
  {
    label: "Human Resources-DP Monitoring Across Filters Record-Initiator",
      },
  {
    label: "Human Resources-Operation of Air Handling Unit Record-Initiator",
      },
  { label: "Human Resources-Instrument Usage Record-Initiator", },
  { label: "Human Resources-Disinfectant Stock Record-Initiator", },
  { label: "Human Resources-Lactic Acid Bacillus Assay Sample Record-Initiator", },
  { label: "Human Resources-Microbial Limit Test Sample Record-Initiator", },
  { label: "Human Resources-Fogging Solution Preparation Record-Initiator", },
  { label: "Human Resources-Area Fogging Record-Initiator", },
  { label: "Human Resources-Filter Cleaning Record-Initiator", },
  { label: "Human Resources-Media Consumption Record-Initiator", },
  { label: "Human Resources-Dispensing Record-Initiator" },
{ label: "Human Resources-Cold Chamber Cleaning Record-Initiator" },
{ label: "Human Resources-Returned Finished Goods Register Record-Initiator" },
{ label: "Human Resources-Dispensing Booth Activity Record-Initiator" },
{ label: "Human Resources-Autoclave Sterelization Record-Initiator" },
{ label: "Human Resources-Drain cleaning and sanitization Record-Initiator" },
{ label: "Human Resources-Breakdown / Maintenance Work Order Record-Initiator" },
{ label: "Human Resources-Cleaning and Disinfectant solution preparation distribution and destruction Record-Initiator" },



  // Information Technology
  {
    label: "Information Technology-Differential Pressure Record-Initiator",
      },
  {
    label:
      "Information Technology-Temperature & Relative Humidity Record-Initiator",
      },
  {
    label: "Information Technology-Equipment Usage Record-Initiator",
      },
  { label: "Information Technology-Area Cleaning Record-Initiator",} ,
  {
    label: "Information Technology-DP Monitoring Across Filters Record-Initiator",
      },
  {
    label: "Information Technology-Operation of Air Handling Unit Record-Initiator",
      },
  {
    label: "Information Technology-Instrument Usage Record-Initiator",
      },
  {
    label: "Information Technology-Disinfectant Stock Record-Initiator",
      },
  {
    label: "Information Technology-Lactic Acid Bacillus Assay Sample Record-Initiator",
      },
  {
    label: "Information Technology-Microbial Limit Test Sample Record-Initiator",
      },
  { label: "Information Technology-Fogging Solution Preparation Record-Initiator", },
  { label: "Information Technology-Area Fogging Record-Initiator", },
  { label: "Information Technology-Filter Cleaning Record-Initiator", },
  { label: "Information Technology-Media Consumption Record-Initiator", },
  { label: "Information Technology-Dispensing Record-Initiator" },
{ label: "Information Technology-Cold Chamber Cleaning Record-Initiator" },
{ label: "Information Technology-Returned Finished Goods Register Record-Initiator" },
{ label: "Information Technology-Dispensing Booth Activity Record-Initiator" },
{ label: "Information Technology-Autoclave Sterelization Record-Initiator" },
{ label: "Information Technology-Drain cleaning and sanitization Record-Initiator" },
{ label: "Information Technology-Breakdown / Maintenance Work Order Record-Initiator" },
{ label: "Information Technology-Cleaning and Disinfectant solution preparation distribution and destruction Record-Initiator" },



  // Accounts
  { label: "Accounts-Differential Pressure Record-Initiator",  },
  {
    label: "Accounts-Temperature & Relative Humidity Record-Initiator",
      },
  { label: "Accounts-Equipment Usage Record-Initiator", },
  { label: "Accounts-Area Cleaning Record-Initiator", },
  { label: "Accounts-DP Monitoring Across Filters Record-Initiator", },
  { label: "Accounts-Operation of Air Handling Unit Record-Initiator", },
  { label: "Accounts-Instrument Usage Record-Initiator", },
  { label: "Accounts-Disinfectant Stock Record-Initiator", },
  { label: "Accounts-Lactic Acid Bacillus Assay Sample Record-Initiator", },
  { label: "Accounts-Microbial Limit Test Sample Record-Initiator", },
  { label: "Accounts-Fogging Solution Preparation Record-Initiator", },
  { label: "Accounts-Area Fogging Record-Initiator", },
  { label: "Accounts-Filter Cleaning Record-Initiator", },
  { label: "Accounts-Media Consumption Record-Initiator", },
  { label: "Accounts-Dispensing Record-Initiator" },
{ label: "Accounts-Cold Chamber Cleaning Record-Initiator" },
{ label: "Accounts-Returned Finished Goods Register Record-Initiator" },
{ label: "Accounts-Dispensing Booth Activity Record-Initiator" },
{ label: "Accounts-Autoclave Sterelization Record-Initiator" },
{ label: "Accounts-Drain cleaning and sanitization Record-Initiator" },
{ label: "Accounts-Breakdown / Maintenance Work Order Record-Initiator" },
{ label: "Accounts-Cleaning and Disinfectant solution preparation distribution and destruction Record-Initiator" },

      
  // PPIC
  {
    label:
      "Production Planning and Inventory Control-Differential Pressure Record-Initiator",
      },
  {
    label:
      "Production Planning and Inventory Control-Temperature & Relative Humidity Record-Initiator",
      },
  {
    label:
      "Production Planning and Inventory Control-Equipment Usage Record-Initiator",
      },
  {
    label:
      "Production Planning and Inventory Control-Area Cleaning Record-Initiator",
      },
  {
    label:
      "Production Planning and Inventory Control-DP Monitoring Across Filters Record-Initiator",
      },
  {
    label:
      "Production Planning and Inventory Control-Operation of Air Handling Unit Record-Initiator",
      },
  {
    label:
      "Production Planning and Inventory Control-Instrument Usage Record-Initiator",
      },
  {
    label:
      "Production Planning and Inventory Control-Disinfectant Stock Record-Initiator",
      },
  {
    label:
      "Production Planning and Inventory Control-Lactic Acid Bacillus Assay Sample Record-Initiator",
      },
  {
    label:
      "Production Planning and Inventory Control-Microbial Limit Test Sample Record-Initiator",
      },
  { label: "Production Planning and Inventory Control-Fogging Solution Preparation Record-Initiator", },
  { label: "Production Planning and Inventory Control-Area Fogging Record-Initiator", },
  { label: "Production Planning and Inventory Control-Filter Cleaning Record-Initiator", },
  { label: "Production Planning and Inventory Control-Media Consumption Record-Initiator", },
  { label: "Production Planning and Inventory Control-Dispensing Record-Initiator" },
{ label: "Production Planning and Inventory Control-Cold Chamber Cleaning Record-Initiator" },
{ label: "Production Planning and Inventory Control-Returned Finished Goods Register Record-Initiator" },
{ label: "Production Planning and Inventory Control-Dispensing Booth Activity Record-Initiator" },
{ label: "Production Planning and Inventory Control-Autoclave Sterelization Record-Initiator" },
{ label: "Production Planning and Inventory Control-Drain cleaning and sanitization Record-Initiator" },
{ label: "Production Planning and Inventory Control-Breakdown / Maintenance Work Order Record-Initiator" },
{ label: "Production Planning and Inventory Control-Cleaning and Disinfectant solution preparation distribution and destruction Record-Initiator" },



  // Regulatory Affairs
  {
    label: "Regulatory Affairs-Differential Pressure Record-Initiator",
      },
  {
    label:
      "Regulatory Affairs-Temperature & Relative Humidity Record-Initiator",
      },
  { label: "Regulatory Affairs-Equipment Usage Record-Initiator", },
  { label: "Regulatory Affairs-Area Cleaning Record-Initiator", },
  {
    label: "Regulatory Affairs-DP Monitoring Across Filters Record-Initiator",
      },
  {
    label: "Regulatory Affairs-Operation of Air Handling Unit Record-Initiator",
      },
  { label: "Regulatory Affairs-Instrument Usage Record-Initiator", },
  { label: "Regulatory Affairs-Disinfectant Stock Record-Initiator", },
  { label: "Regulatory Affairs-Lactic Acid Bacillus Assay Sample Record-Initiator", },
  { label: "Regulatory Affairs-Microbial Limit Test Sample Record-Initiator", },
  { label: "Regulatory Affairs-Fogging Solution Preparation Record-Initiator", },
  { label: "Regulatory Affairs-Area Fogging Record-Initiator", },
  { label: "Regulatory Affairs-Filter Cleaning Record-Initiator", },
  { label: "Regulatory Affairs-Media Consumption Record-Initiator", },
  { label: "Regulatory Affairs-Dispensing Record-Initiator" },
{ label: "Regulatory Affairs-Cold Chamber Cleaning Record-Initiator" },
{ label: "Regulatory Affairs-Returned Finished Goods Register Record-Initiator" },
{ label: "Regulatory Affairs-Dispensing Booth Activity Record-Initiator" },
{ label: "Regulatory Affairs-Autoclave Sterelization Record-Initiator" },
{ label: "Regulatory Affairs-Drain cleaning and sanitization Record-Initiator" },
{ label: "Regulatory Affairs-Breakdown / Maintenance Work Order Record-Initiator" },
{ label: "Regulatory Affairs-Cleaning and Disinfectant solution preparation distribution and destruction Record-Initiator" },


];

const rolesArray2 = [
  // Quality Assurance
  {
    label: "Quality Assurance-Differential Pressure Record-Reviewer",
      },
  {
    label: "Quality Assurance-Temperature & Relative Humidity Record-Reviewer",
      },
  { label: "Quality Assurance-Equipment Usage Record-Reviewer", },
  { label: "Quality Assurance-Area Cleaning Record-Reviewer", },
  {
    label: "Quality Assurance-DP Monitoring Across Filters Record-Reviewer",
      },
  {
    label: "Quality Assurance-Operation of Air Handling Unit Record-Reviewer",
      },
  { label: "Quality Assurance-Instrument Usage Record-Reviewer", },
  { label: "Quality Assurance-Disinfectant Stock Record-Reviewer", },
  { label: "Quality Assurance-Lactic Acid Bacillus Assay Sample Record-Reviewer", },
  { label: "Quality Assurance-Microbial Limit Test Sample Record-Reviewer", },
  { label: "Quality Assurance-Fogging Solution Preparation Record-Reviewer", },
  { label: "Quality Assurance-Area Fogging Record-Reviewer", },
  { label: "Quality Assurance-Filter Cleaning Record-Reviewer", },
  { label: "Quality Assurance-Media Consumption Record-Reviewer", },
  { label: "Quality Assurance-Dispensing Record-Reviewer" },
{ label: "Quality Assurance-Cold Chamber Cleaning Record-Reviewer" },
{ label: "Quality Assurance-Returned Finished Goods Register Record-Reviewer" },
{ label: "Quality Assurance-Dispensing Booth Activity Record-Reviewer" },
{ label: "Quality Assurance-Autoclave Sterelization Record-Reviewer" },
{ label: "Quality Assurance-Drain cleaning and sanitization Record-Reviewer" },
{ label: "Quality Assurance-Breakdown / Maintenance Work Order Record-Reviewer" },
{ label: "Quality Assurance-Cleaning and Disinfectant solution preparation distribution and destruction Record-Reviewer" },



  // Quality Control
  { label: "Quality Control-Differential Pressure Record-Reviewer",} ,
  {
    label: "Quality Control-Temperature & Relative Humidity Record-Reviewer",
      },
  { label: "Quality Control-Equipment Usage Record-Reviewer", },
  { label: "Quality Control-Area Cleaning Record-Reviewer", },
  { label: "Quality Control-DP Monitoring Across Filters Record-Reviewer", },
  {
    label: "Quality Control-Operation of Air Handling Unit Record-Reviewer",
      },
  { label: "Quality Control-Instrument Usage Record-Reviewer", },
  { label: "Quality Control-Disinfectant Stock Record-Reviewer", },
  { label: "Quality Control-Lactic Acid Bacillus Assay Sample Record-Reviewer", },
  { label: "Quality Control-Microbial Limit Test Sample Record-Reviewer", },
  { label: "Quality Control-Fogging Solution Preparation Record-Reviewer", },
  { label: "Quality Control-Area Fogging Record-Reviewer", },
  { label: "Quality Control-Filter Cleaning Record-Reviewer", },
  { label: "Quality Control-Media Consumption Record-Reviewer", },
  { label: "Quality Control-Dispensing Record-Reviewer" },
{ label: "Quality Control-Cold Chamber Cleaning Record-Reviewer" },
{ label: "Quality Control-Returned Finished Goods Register Record-Reviewer" },
{ label: "Quality Control-Dispensing Booth Activity Record-Reviewer" },
{ label: "Quality Control-Autoclave Sterelization Record-Reviewer" },
{ label: "Quality Control-Drain cleaning and sanitization Record-Reviewer" },
{ label: "Quality Control-Breakdown / Maintenance Work Order Record-Reviewer" },
{ label: "Quality Control-Cleaning and Disinfectant solution preparation distribution and destruction Record-Reviewer" },



  // Production
  { label: "Production-Differential Pressure Record-Reviewer", },
  {
    label: "Production-Temperature & Relative Humidity Record-Reviewer",
      },
  { label: "Production-Equipment Usage Record-Reviewer", },
  { label: "Production-Area Cleaning Record-Reviewer", },
  { label: "Production-DP Monitoring Across Filters Record-Reviewer", },
  { label: "Production-Operation of Air Handling Unit Record-Reviewer", },
  { label: "Production-Instrument Usage Record-Reviewer", },
  { label: "Production-Disinfectant Stock Record-Reviewer", },
  { label: "Production-Lactic Acid Bacillus Assay Sample Record-Reviewer", },
  { label: "Production-Microbial Limit Test Sample Record-Reviewer", },
  { label: "Production-Fogging Solution Preparation Record-Reviewer", },
  { label: "Production-Area Fogging Record-Reviewer", },
  { label: "Production-Filter Cleaning Record-Reviewer", },
  { label: "Production-Media Consumption Record-Reviewer", },
  { label: "Production-Dispensing Record-Reviewer" },
{ label: "Production-Cold Chamber Cleaning Record-Reviewer" },
{ label: "Production-Returned Finished Goods Register Record-Reviewer" },
{ label: "Production-Dispensing Booth Activity Record-Reviewer" },
{ label: "Production-Autoclave Sterelization Record-Reviewer" },
{ label: "Production-Drain cleaning and sanitization Record-Reviewer" },
{ label: "Production-Breakdown / Maintenance Work Order Record-Reviewer" },
{ label: "Production-Cleaning and Disinfectant solution preparation distribution and destruction Record-Reviewer" },



  // Warehouse
  { label: "Warehouse-Differential Pressure Record-Reviewer", },
  {
    label: "Warehouse-Temperature & Relative Humidity Record-Reviewer",
      },
  { label: "Warehouse-Equipment Usage Record-Reviewer", },
  { label: "Warehouse-Area Cleaning Record-Reviewer", },
  { label: "Warehouse-DP Monitoring Across Filters Record-Reviewer", },
  { label: "Warehouse-Operation of Air Handling Unit Record-Reviewer", },
  { label: "Warehouse-Instrument Usage Record-Reviewer", },
  { label: "Warehouse-Disinfectant Stock Record-Reviewer", },
  { label: "Warehouse-Lactic Acid Bacillus Assay Sample Record-Reviewer", },
  { label: "Warehouse-Microbial Limit Test Sample Record-Reviewer", },
  { label: "Warehouse-Fogging Solution Preparation Record-Reviewer", },
  { label: "Warehouse-Area Fogging Record-Reviewer", },
  { label: "Warehouse-Filter Cleaning Record-Reviewer", },
  { label: "Warehouse-Media Consumption Record-Reviewer", },
  { label: "Warehouse-Dispensing Record-Reviewer" },
{ label: "Warehouse-Cold Chamber Cleaning Record-Reviewer" },
{ label: "Warehouse-Returned Finished Goods Register Record-Reviewer" },
{ label: "Warehouse-Dispensing Booth Activity Record-Reviewer" },
{ label: "Warehouse-Autoclave Sterelization Record-Reviewer" },
{ label: "Warehouse-Drain cleaning and sanitization Record-Reviewer" },
{ label: "Warehouse-Breakdown / Maintenance Work Order Record-Reviewer" },
{ label: "Warehouse-Cleaning and Disinfectant solution preparation distribution and destruction Record-Reviewer" },



  // Engineering
  { label: "Engineering-Differential Pressure Record-Reviewer", },
  {
    label: "Engineering-Temperature & Relative Humidity Record-Reviewer",
      },
  { label: "Engineering-Equipment Usage Record-Reviewer", },
  { label: "Engineering-Area Cleaning Record-Reviewer", },
  { label: "Engineering-DP Monitoring Across Filters Record-Reviewer", },
  { label: "Engineering-Operation of Air Handling Unit Record-Reviewer", },
  { label: "Engineering-Instrument Usage Record-Reviewer", },
  { label: "Engineering-Disinfectant Stock Record-Reviewer", },
  { label: "Engineering-Lactic Acid Bacillus Assay Sample Record-Reviewer", },
  { label: "Engineering-Microbial Limit Test Sample Record-Reviewer", },
  { label: "Engineering-Fogging Solution Preparation Record-Reviewer", },
  { label: "Engineering-Area Fogging Record-Reviewer", },
  { label: "Engineering-Filter Cleaning Record-Reviewer", },
  { label: "Engineering-Media Consumption Record-Reviewer", },
  { label: "Engineering-Dispensing Record-Reviewer" },
{ label: "Engineering-Cold Chamber Cleaning Record-Reviewer" },
{ label: "Engineering-Returned Finished Goods Register Record-Reviewer" },
{ label: "Engineering-Dispensing Booth Activity Record-Reviewer" },
{ label: "Engineering-Autoclave Sterelization Record-Reviewer" },
{ label: "Engineering-Drain cleaning and sanitization Record-Reviewer" },
{ label: "Engineering-Breakdown / Maintenance Work Order Record-Reviewer" },
{ label: "Engineering-Cleaning and Disinfectant solution preparation distribution and destruction Record-Reviewer" },



  // Human Resources
  { label: "Human Resources-Differential Pressure Record-Reviewer", },
  {
    label: "Human Resources-Temperature & Relative Humidity Record-Reviewer",
      },
  { label: "Human Resources-Equipment Usage Record-Reviewer", },
  { label: "Human Resources-Area Cleaning Record-Reviewer", },
  { label: "Human Resources-DP Monitoring Across Filters Record-Reviewer", },
  {
    label: "Human Resources-Operation of Air Handling Unit Record-Reviewer",
      },
  { label: "Human Resources-Instrument Usage Record-Reviewer", },
  { label: "Human Resources-Disinfectant Stock Record-Reviewer", },
  { label: "Human Resources-Lactic Acid Bacillus Assay Sample Record-Reviewer", },
  { label: "Human Resources-Microbial Limit Test Sample Record-Reviewer", },
  { label: "Human Resources-Fogging Solution Preparation Record-Reviewer", },
  { label: "Human Resources-Area Fogging Record-Reviewer", },
  { label: "Human Resources-Filter Cleaning Record-Reviewer", },
  { label: "Human Resources-Media Consumption Record-Reviewer", },
  { label: "Human Resources-Dispensing Record-Reviewer" },
{ label: "Human Resources-Cold Chamber Cleaning Record-Reviewer" },
{ label: "Human Resources-Returned Finished Goods Register Record-Reviewer" },
{ label: "Human Resources-Dispensing Booth Activity Record-Reviewer" },
{ label: "Human Resources-Autoclave Sterelization Record-Reviewer" },
{ label: "Human Resources-Drain cleaning and sanitization Record-Reviewer" },
{ label: "Human Resources-Breakdown / Maintenance Work Order Record-Reviewer" },
{ label: "Human Resources-Cleaning and Disinfectant solution preparation distribution and destruction Record-Reviewer" },



  // Information Technology
  {
    label: "Information Technology-Differential Pressure Record-Reviewer",
      },
  {
    label:
      "Information Technology-Temperature & Relative Humidity Record-Reviewer",
      },
  {
    label: "Information Technology-Equipment Usage Record-Reviewer",
      },
  { label: "Information Technology-Area Cleaning Record-Reviewer", },
  {
    label: "Information Technology-DP Monitoring Across Filters Record-Reviewer",
    
  },
  {
    label: "Information Technology-Operation of Air Handling Unit Record-Reviewer",
    
  },
  {
    label: "Information Technology-Instrument Usage Record-Reviewer",
    
  },
  {
    label: "Information Technology-Disinfectant Stock Record-Reviewer",
    
  },
  {
    label: "Information Technology-Lactic Acid Bacillus Assay Sample Record-Reviewer",
    
  },
  {
    label: "Information Technology-Microbial Limit Test Sample Record-Reviewer",
    
  },
  { label: "Information Technology-Fogging Solution Preparation Record-Reviewer", },
  { label: "Information Technology-Area Fogging Record-Reviewer", },
  { label: "Information Technology-Filter Cleaning Record-Reviewer", },
  { label: "Information Technology-Media Consumption Record-Reviewer", },
  { label: "Information Technology-Dispensing Record-Reviewer" },
{ label: "Information Technology-Cold Chamber Cleaning Record-Reviewer" },
{ label: "Information Technology-Returned Finished Goods Register Record-Reviewer" },
{ label: "Information Technology-Dispensing Booth Activity Record-Reviewer" },
{ label: "Information Technology-Autoclave Sterelization Record-Reviewer" },
{ label: "Information Technology-Drain cleaning and sanitization Record-Reviewer" },
{ label: "Information Technology-Breakdown / Maintenance Work Order Record-Reviewer" },
{ label: "Information Technology-Cleaning and Disinfectant solution preparation distribution and destruction Record-Reviewer" },



  // Accounts
  { label: "Accounts-Differential Pressure Record-Reviewer", },
  {
    label: "Accounts-Temperature & Relative Humidity Record-Reviewer",
    
  },
  { label: "Accounts-Equipment Usage Record-Reviewer", },
  { label: "Accounts-Area Cleaning Record-Reviewer", },
  { label: "Accounts-DP Monitoring Across Filters Record-Reviewer", },
  { label: "Accounts-Operation of Air Handling Unit Record-Reviewer", },
  { label: "Accounts-Instrument Usage Record-Reviewer", },
  { label: "Accounts-Disinfectant Stock Record-Reviewer", },
  { label: "Accounts-Lactic Acid Bacillus Assay Sample Record-Reviewer", },
  { label: "Accounts-Microbial Limit Test Sample Record-Reviewer", },
  { label: "Accounts-Fogging Solution Preparation Record-Reviewer", },
  { label: "Accounts-Area Fogging Record-Reviewer", },
  { label: "Accounts-Filter Cleaning Record-Reviewer", },
  { label: "Accounts-Media Consumption Record-Reviewer", },
  { label: "Accounts-Dispensing Record-Reviewer" },
{ label: "Accounts-Cold Chamber Cleaning Record-Reviewer" },
{ label: "Accounts-Returned Finished Goods Register Record-Reviewer" },
{ label: "Accounts-Dispensing Booth Activity Record-Reviewer" },
{ label: "Accounts-Autoclave Sterelization Record-Reviewer" },
{ label: "Accounts-Drain cleaning and sanitization Record-Reviewer" },
{ label: "Accounts-Breakdown / Maintenance Work Order Record-Reviewer" },
{ label: "Accounts-Cleaning and Disinfectant solution preparation distribution and destruction Record-Reviewer" },


  // PPIC
  {
    label:
      "Production Planning and Inventory Control-Differential Pressure Record-Reviewer",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Temperature & Relative Humidity Record-Reviewer",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Equipment Usage Record-Reviewer",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Area Cleaning Record-Reviewer",
    
  },
  {
    label:
      "Production Planning and Inventory Control-DP Monitoring Across Filters Record-Reviewer",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Operation of Air Handling Unit Record-Reviewer",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Instrument Usage Record-Reviewer",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Disinfectant Stock Record-Reviewer",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Lactic Acid Bacillus Assay Sample Record-Reviewer",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Microbial Limit Test Sample Record-Reviewer",
    
    
  },
  { label: "Production Planning and Inventory Control-Fogging Solution Preparation Record-Reviewer", },
  { label: "Production Planning and Inventory Control-Area Fogging Record-Reviewer", },
  { label: "Production Planning and Inventory Control-Filter Cleaning Record-Reviewer", },
  { label: "Production Planning and Inventory Control-Media Consumption Record-Reviewer", },
  { label: "Production Planning and Inventory Control-Dispensing Record-Reviewer" },
{ label: "Production Planning and Inventory Control-Cold Chamber Cleaning Record-Reviewer" },
{ label: "Production Planning and Inventory Control-Returned Finished Goods Register Record-Reviewer" },
{ label: "Production Planning and Inventory Control-Dispensing Booth Activity Record-Reviewer" },
{ label: "Production Planning and Inventory Control-Autoclave Sterelization Record-Reviewer" },
{ label: "Production Planning and Inventory Control-Drain cleaning and sanitization Record-Reviewer" },
{ label: "Production Planning and Inventory Control-Breakdown / Maintenance Work Order Record-Reviewer" },
{ label: "Production Planning and Inventory Control-Cleaning and Disinfectant solution preparation distribution and destruction Record-Reviewer" },



  // Regulatory Affairs
  {
    label: "Regulatory Affairs-Differential Pressure Record-Reviewer",
    
  },
  {
    label: "Regulatory Affairs-Temperature & Relative Humidity Record-Reviewer",
    
  },
  { label: "Regulatory Affairs-Equipment Usage Record-Reviewer", },
  { label: "Regulatory Affairs-Area Cleaning Record-Reviewer", },
  {
    label: "Regulatory Affairs-DP Monitoring Across Filters Record-Reviewer",
    
  },
  {
    label: "Regulatory Affairs-Operation of Air Handling Unit Record-Reviewer",
    
  },
  { label: "Regulatory Affairs-Instrument Usage Record-Reviewer", },
  { label: "Regulatory Affairs-Disinfectant Stock Record-Reviewer", },
  { label: "Regulatory Affairs-Lactic Acid Bacillus Assay Sample Record-Reviewer", },
  { label: "Regulatory Affairs-Microbial Limit Test Sample Record-Reviewer", },
  { label: "Regulatory Affairs-Fogging Solution Preparation Record-Reviewer", },
  { label: "Regulatory Affairs-Area Fogging Record-Reviewer", },
  { label: "Regulatory Affairs-Filter Cleaning Record-Reviewer", },
  { label: "Regulatory Affairs-Media Consumption Record-Reviewer", },
  { label: "Regulatory Affairs-Dispensing Record-Reviewer" },
{ label: "Regulatory Affairs-Cold Chamber Cleaning Record-Reviewer" },
{ label: "Regulatory Affairs-Returned Finished Goods Register Record-Reviewer" },
{ label: "Regulatory Affairs-Dispensing Booth Activity Record-Reviewer" },
{ label: "Regulatory Affairs-Autoclave Sterelization Record-Reviewer" },
{ label: "Regulatory Affairs-Drain cleaning and sanitization Record-Reviewer" },
{ label: "Regulatory Affairs-Breakdown / Maintenance Work Order Record-Reviewer" },
{ label: "Regulatory Affairs-Cleaning and Disinfectant solution preparation distribution and destruction Record-Reviewer" },

];

const rolesArray3 = [
  // Quality Assurance
  {
    label: "Quality Assurance-Differential Pressure Record-Approver",
    
  },
  {
    label: "Quality Assurance-Temperature & Relative Humidity Record-Approver",
    
  },
  { label: "Quality Assurance-Equipment Usage Record-Approver", },
  { label: "Quality Assurance-Area Cleaning Record-Approver", },
  {
    label: "Quality Assurance-DP Monitoring Across Filters Record-Approver",
    
  },
  {
    label: "Quality Assurance-Operation of Air Handling Unit Record-Approver",
    
  },
  { label: "Quality Assurance-Instrument Usage Record-Approver", },
  { label: "Quality Assurance-Disinfectant Stock Record-Approver", },
  { label: "Quality Assurance-Lactic Acid Bacillus Assay Sample Record-Approver", },
  { label: "Quality Assurance-Microbial Limit Test Sample Record-Approver", },
    { label: "Quality Assurance-Fogging Solution Preparation Record-Approver", },
  { label: "Quality Assurance-Area Fogging Record-Approver", },
  { label: "Quality Assurance-Filter Cleaning Record-Approver", },
  { label: "Quality Assurance-Media Consumption Record-Approver", },
  { label: "Quality Assurance-Dispensing Record-Approver" },
{ label: "Quality Assurance-Cold Chamber Cleaning Record-Approver" },
{ label: "Quality Assurance-Returned Finished Goods Register Record-Approver" },
{ label: "Quality Assurance-Dispensing Booth Activity Record-Approver" },
{ label: "Quality Assurance-Autoclave Sterelization Record-Approver" },
{ label: "Quality Assurance-Drain cleaning and sanitization Record-Approver" },
{ label: "Quality Assurance-Breakdown / Maintenance Work Order Record-Approver" },
{ label: "Quality Assurance-Cleaning and Disinfectant solution preparation distribution and destruction Record-Approver" },



  // Quality Control
  {
    label: "Quality Control-Differential Pressure Record-Approver",
    
  },
  {
    label: "Quality Control-Temperature & Relative Humidity Record-Approver",
    
  },
  { label: "Quality Control-Equipment Usage Record-Approver", },
  { label: "Quality Control-Area Cleaning Record-Approver", },
  {
    label: "Quality Control-DP Monitoring Across Filters Record-Approver",
    
  },
  {
    label: "Quality Control-Operation of Air Handling Unit Record-Approver",
    
  },
  { label: "Quality Control-Instrument Usage Record-Approver", },
  { label: "Quality Control-Disinfectant Stock Record-Approver", },
  { label: "Quality Control-Lactic Acid Bacillus Assay Sample Record-Approver", },
  { label: "Quality Control-Microbial Limit Test Sample Record-Approver", },
    { label: "Quality Control-Fogging Solution Preparation Record-Approver", },
  { label: "Quality Control-Area Fogging Record-Approver", },
  { label: "Quality Control-Filter Cleaning Record-Approver", },
  { label: "Quality Control-Media Consumption Record-Approver", },
  { label: "Quality Control-Dispensing Record-Approver" },
{ label: "Quality Control-Cold Chamber Cleaning Record-Approver" },
{ label: "Quality Control-Returned Finished Goods Register Record-Approver" },
{ label: "Quality Control-Dispensing Booth Activity Record-Approver" },
{ label: "Quality Control-Autoclave Sterelization Record-Approver" },
{ label: "Quality Control-Drain cleaning and sanitization Record-Approver" },
{ label: "Quality Control-Breakdown / Maintenance Work Order Record-Approver" },
{ label: "Quality Control-Cleaning and Disinfectant solution preparation distribution and destruction Record-Approver" },



  // Production
  { label: "Production-Differential Pressure Record-Approver", },
  {
    label: "Production-Temperature & Relative Humidity Record-Approver",
    
  },
  { label: "Production-Equipment Usage Record-Approver", },
  { label: "Production-Area Cleaning Record-Approver", },
  { label: "Production-DP Monitoring Across Filters Record-Approver", },
  { label: "Production-Operation of Air Handling Unit Record-Approver", },
  { label: "Production-Instrument Usage Record-Approver", },
  { label: "Production-Disinfectant Stock Record-Approver", },
  { label: "Production-Lactic Acid Bacillus Assay Sample Record-Approver", },
  { label: "Production-Microbial Limit Test Sample Record-Approver", },
    { label: "Production-Fogging Solution Preparation Record-Approver", },
  { label: "Production-Area Fogging Record-Approver", },
  { label: "Production-Filter Cleaning Record-Approver", },
  { label: "Production-Media Consumption Record-Approver", },
  { label: "Production-Dispensing Record-Approver" },
{ label: "Production-Cold Chamber Cleaning Record-Approver" },
{ label: "Production-Returned Finished Goods Register Record-Approver" },
{ label: "Production-Dispensing Booth Activity Record-Approver" },
{ label: "Production-Autoclave Sterelization Record-Approver" },
{ label: "Production-Drain cleaning and sanitization Record-Approver" },
{ label: "Production-Breakdown / Maintenance Work Order Record-Approver" },
{ label: "Production-Cleaning and Disinfectant solution preparation distribution and destruction Record-Approver" },


  // Warehouse
  { label: "Warehouse-Differential Pressure Record-Approver", },
  {
    label: "Warehouse-Temperature & Relative Humidity Record-Approver",
    
  },
  { label: "Warehouse-Equipment Usage Record-Approver", },
  { label: "Warehouse-Area Cleaning Record-Approver", },
  { label: "Warehouse-DP Monitoring Across Filters Record-Approver", },
  { label: "Warehouse-Operation of Air Handling Unit Record-Approver", },
  { label: "Warehouse-Instrument Usage Record-Approver", },
  { label: "Warehouse-Disinfectant Stock Record-Approver", },
  { label: "Warehouse-Lactic Acid Bacillus Assay Sample Record-Approver", },
  { label: "Warehouse-Microbial Limit Test Sample Record-Approver", },
    { label: "Warehouse-Fogging Solution Preparation Record-Approver", },
  { label: "Warehouse-Area Fogging Record-Approver", },
  { label: "Warehouse-Filter Cleaning Record-Approver", },
  { label: "Warehouse-Media Consumption Record-Approver", },
  { label: "Warehouse-Dispensing Record-Approver" },
{ label: "Warehouse-Cold Chamber Cleaning Record-Approver" },
{ label: "Warehouse-Returned Finished Goods Register Record-Approver" },
{ label: "Warehouse-Dispensing Booth Activity Record-Approver" },
{ label: "Warehouse-Autoclave Sterelization Record-Approver" },
{ label: "Warehouse-Drain cleaning and sanitization Record-Approver" },
{ label: "Warehouse-Breakdown / Maintenance Work Order Record-Approver" },
{ label: "Warehouse-Cleaning and Disinfectant solution preparation distribution and destruction Record-Approver" },



  // Engineering
  { label: "Engineering-Differential Pressure Record-Approver", },
  {
    label: "Engineering-Temperature & Relative Humidity Record-Approver",
    
  },
  { label: "Engineering-Equipment Usage Record-Approver", },
  { label: "Engineering-Area Cleaning Record-Approver", },
  { label: "Engineering-DP Monitoring Across Filters Record-Approver", },
  { label: "Engineering-Operation of Air Handling Unit Record-Approver", },
  { label: "Engineering-Instrument Usage Record-Approver", },
  { label: "Engineering-Disinfectant Stock Record-Approver", },
  { label: "Engineering-Lactic Acid Bacillus Assay Sample Record-Approver", },
  { label: "Engineering-Microbial Limit Test Sample Record-Approver", },
    { label: "Engineering-Fogging Solution Preparation Record-Approver", },
  { label: "Engineering-Area Fogging Record-Approver", },
  { label: "Engineering-Filter Cleaning Record-Approver", },
  { label: "Engineering-Media Consumption Record-Approver", },
  { label: "Engineering-Dispensing Record-Approver" },
{ label: "Engineering-Cold Chamber Cleaning Record-Approver" },
{ label: "Engineering-Returned Finished Goods Register Record-Approver" },
{ label: "Engineering-Dispensing Booth Activity Record-Approver" },
{ label: "Engineering-Autoclave Sterelization Record-Approver" },
{ label: "Engineering-Drain cleaning and sanitization Record-Approver" },
{ label: "Engineering-Breakdown / Maintenance Work Order Record-Approver" },
{ label: "Engineering-Cleaning and Disinfectant solution preparation distribution and destruction Record-Approver" },



  // Human Resources
  {
    label: "Human Resources-Differential Pressure Record-Approver",
    
  },
  {
    label: "Human Resources-Temperature & Relative Humidity Record-Approver",
    
  },
  { label: "Human Resources-Equipment Usage Record-Approver", },
  { label: "Human Resources-Area Cleaning Record-Approver", },
  {
    label: "Human Resources-DP Monitoring Across Filters Record-Approver",
    
  },
  {
    label: "Human Resources-Operation of Air Handling Unit Record-Approver",
    
  },
  { label: "Human Resources-Instrument Usage Record-Approver", },
  { label: "Human Resources-Disinfectant Stock Record-Approver", },
  { label: "Human Resources-Lactic Acid Bacillus Assay Sample Record-Approver", },
  { label: "Human Resources-Microbial Limit Test Sample Record-Approver", },
    { label: "Human Resources-Fogging Solution Preparation Record-Approver", },
  { label: "Human Resources-Area Fogging Record-Approver", },
  { label: "Human Resources-Filter Cleaning Record-Approver", },
  { label: "Human Resources-Media Consumption Record-Approver", },
  { label: "Human Resources-Dispensing Record-Approver" },
{ label: "Human Resources-Cold Chamber Cleaning Record-Approver" },
{ label: "Human Resources-Returned Finished Goods Register Record-Approver" },
{ label: "Human Resources-Dispensing Booth Activity Record-Approver" },
{ label: "Human Resources-Autoclave Sterelization Record-Approver" },
{ label: "Human Resources-Drain cleaning and sanitization Record-Approver" },
{ label: "Human Resources-Breakdown / Maintenance Work Order Record-Approver" },
{ label: "Human Resources-Cleaning and Disinfectant solution preparation distribution and destruction Record-Approver" },



  // Information Technology
  {
    label: "Information Technology-Differential Pressure Record-Approver",
    
  },
  {
    label:
      "Information Technology-Temperature & Relative Humidity Record-Approver",
    
  },
  {
    label: "Information Technology-Equipment Usage Record-Approver",
    
  },
  { label: "Information Technology-Area Cleaning Record-Approver", },
  {
    label: "Information Technology-DP Monitoring Across Filters Record-Approver",
    
  },
  {
    label: "Information Technology-Operation of Air Handling Unit Record-Approver",
    
  },
  {
    label: "Information Technology-Instrument Usage Record-Approver",
    
  },
  {
    label: "Information Technology-Disinfectant Stock Record-Approver",
    
  },
  {
    label: "Information Technology-Lactic Acid Bacillus Assay Sample Record-Approver",
    
  },
  {
    label: "Information Technology-Microbial Limit Test Sample Record-Approver",
    
  },
    { label: "Information Technology-Fogging Solution Preparation Record-Approver", },
  { label: "Information Technology-Area Fogging Record-Approver", },
  { label: "Information Technology-Filter Cleaning Record-Approver", },
  { label: "Information Technology-Media Consumption Record-Approver", },
  { label: "Information Technology-Dispensing Record-Approver" },
{ label: "Information Technology-Cold Chamber Cleaning Record-Approver" },
{ label: "Information Technology-Returned Finished Goods Register Record-Approver" },
{ label: "Information Technology-Dispensing Booth Activity Record-Approver" },
{ label: "Information Technology-Autoclave Sterelization Record-Approver" },
{ label: "Information Technology-Drain cleaning and sanitization Record-Approver" },
{ label: "Information Technology-Breakdown / Maintenance Work Order Record-Approver" },
{ label: "Information Technology-Cleaning and Disinfectant solution preparation distribution and destruction Record-Approver" },



  // Accounts
  { label: "Accounts-Differential Pressure Record-Approver", },
  {
    label: "Accounts-Temperature & Relative Humidity Record-Approver",
    
  },
  { label: "Accounts-Equipment Usage Record-Approver", },
  { label: "Accounts-Area Cleaning Record-Approver", },
  { label: "Accounts-DP Monitoring Across Filters Record-Approver", },
  { label: "Accounts-Operation of Air Handling Unit Record-Approver", },
  { label: "Accounts-Instrument Usage Record-Approver", },
  { label: "Accounts-Disinfectant Stock Record-Approver", },
  { label: "Accounts-Lactic Acid Bacillus Assay Sample Record-Approver", },
  { label: "Accounts-Microbial Limit Test Sample Record-Approver", },
    { label: "Accounts-Fogging Solution Preparation Record-Approver", },
  { label: "Accounts-Area Fogging Record-Approver", },
  { label: "Accounts-Filter Cleaning Record-Approver", },
  { label: "Accounts-Media Consumption Record-Approver", },
  { label: "Accounts-Dispensing Record-Approver" },
{ label: "Accounts-Cold Chamber Cleaning Record-Approver" },
{ label: "Accounts-Returned Finished Goods Register Record-Approver" },
{ label: "Accounts-Dispensing Booth Activity Record-Approver" },
{ label: "Accounts-Autoclave Sterelization Record-Approver" },
{ label: "Accounts-Drain cleaning and sanitization Record-Approver" },
{ label: "Accounts-Breakdown / Maintenance Work Order Record-Approver" },
{ label: "Accounts-Cleaning and Disinfectant solution preparation distribution and destruction Record-Approver" },


  // PPIC
  {
    label:
      "Production Planning and Inventory Control-Differential Pressure Record-Approver",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Temperature & Relative Humidity Record-Approver",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Equipment Usage Record-Approver",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Area Cleaning Record-Approver",
    
  },
  {
    label:
      "Production Planning and Inventory Control-DP Monitoring Across Filters Record-Approver",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Operation of Air Handling Unit Record-Approver",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Instrument Usage Record-Approver",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Disinfectant Stock Record-Approver",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Lactic Acid Bacillus Assay Sample Record-Approver",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Microbial Limit Test Sample Record-Approver",
    
  },
    { label: "Production Planning and Inventory Control-Fogging Solution Preparation Record-Approver", },
  { label: "Production Planning and Inventory Control-Area Fogging Record-Approver", },
  { label: "Production Planning and Inventory Control-Filter Cleaning Record-Approver", },
  { label: "Production Planning and Inventory Control-Media Consumption Record-Approver", },
  { label: "Production Planning and Inventory Control-Dispensing Record-Approver" },
{ label: "Production Planning and Inventory Control-Cold Chamber Cleaning Record-Approver" },
{ label: "Production Planning and Inventory Control-Returned Finished Goods Register Record-Approver" },
{ label: "Production Planning and Inventory Control-Dispensing Booth Activity Record-Approver" },
{ label: "Production Planning and Inventory Control-Autoclave Sterelization Record-Approver" },
{ label: "Production Planning and Inventory Control-Drain cleaning and sanitization Record-Approver" },
{ label: "Production Planning and Inventory Control-Breakdown / Maintenance Work Order Record-Approver" },
{ label: "Production Planning and Inventory Control-Cleaning and Disinfectant solution preparation distribution and destruction Record-Approver" },



  // Regulatory Affairs
  {
    label: "Regulatory Affairs-Differential Pressure Record-Approver",
    
  },
  {
    label: "Regulatory Affairs-Temperature & Relative Humidity Record-Approver",
    
  },
  { label: "Regulatory Affairs-Equipment Usage Record-Approver", },
  { label: "Regulatory Affairs-Area Cleaning Record-Approver", },
  {
    label: "Regulatory Affairs-DP Monitoring Across Filters Record-Approver",
    
  },
  {
    label: "Regulatory Affairs-Operation of Air Handling Unit Record-Approver",
    
  },
  { label: "Regulatory Affairs-Instrument Usage Record-Approver", },
  { label: "Regulatory Affairs-Disinfectant Stock Record-Approver", },
  { label: "Regulatory Affairs-Lactic Acid Bacillus Assay Sample Record-Approver", },
  { label: "Regulatory Affairs-Microbial Limit Test Sample Record-Approver", },
    { label: "Regulatory Affairs-Fogging Solution Preparation Record-Approver", },
  { label: "Regulatory Affairs-Area Fogging Record-Approver", },
  { label: "Regulatory Affairs-Filter Cleaning Record-Approver", },
  { label: "Regulatory Affairs-Media Consumption Record-Approver", },
  { label: "Regulatory Affairs-Dispensing Record-Approver" },
{ label: "Regulatory Affairs-Cold Chamber Cleaning Record-Approver" },
{ label: "Regulatory Affairs-Returned Finished Goods Register Record-Approver" },
{ label: "Regulatory Affairs-Dispensing Booth Activity Record-Approver" },
{ label: "Regulatory Affairs-Autoclave Sterelization Record-Approver" },
{ label: "Regulatory Affairs-Drain cleaning and sanitization Record-Approver" },
{ label: "Regulatory Affairs-Breakdown / Maintenance Work Order Record-Approver" },
{ label: "Regulatory Affairs-Cleaning and Disinfectant solution preparation distribution and destruction Record-Approver" },


];

const rolesArray4 = [
  // Quality Assurance
  {
    label: "Quality Assurance-Differential Pressure Record-Fullpermission",
    
  },
  {
    label:
      "Quality Assurance-Temperature & Relative Humidity Record-Fullpermission",
    
  },
  {
    label: "Quality Assurance-Equipment Usage Record-Fullpermission",
    
  },
  {
    label: "Quality Assurance-Area Cleaning Record-Fullpermission",
    
  },
  {
    label: "Quality Assurance-DP Monitoring Across Filters Record-Fullpermission",
    
  },
  {
    label: "Quality Assurance-Operation of Air Handling Unit Record-Fullpermission",
    
  },
  {
    label: "Quality Assurance-Instrument Usage Record-Fullpermission",
    
  },
    {
    label: "Quality Assurance-Disinfectant Stock Record-Fullpermission",
    
  },
  {
    label: "Quality Assurance-Lactic Acid Bacillus Assay Sample Record-Fullpermission",
    
  },
  {
    label: "Quality Assurance-Microbial Limit Test Sample Record-Fullpermission",
    
  },
    { label: "Quality Assurance-Fogging Solution Preparation Record-Fullpermission", },
  { label: "Quality Assurance-Area Fogging Record-Fullpermission", },
  { label: "Quality Assurance-Filter Cleaning Record-Fullpermission", },
  { label: "Quality Assurance-Media Consumption Record-Fullpermission", },
  { label: "Quality Assurance-Dispensing Record-Fullpermission" },
{ label: "Quality Assurance-Cold Chamber Cleaning Record-Fullpermission" },
{ label: "Quality Assurance-Returned Finished Goods Register Record-Fullpermission" },
{ label: "Quality Assurance-Dispensing Booth Activity Record-Fullpermission" },
{ label: "Quality Assurance-Autoclave Sterelization Record-Fullpermission" },
{ label: "Quality Assurance-Drain cleaning and sanitization Record-Fullpermission" },
{ label: "Quality Assurance-Breakdown / Maintenance Work Order Record-Fullpermission" },
{ label: "Quality Assurance-Cleaning and Disinfectant solution preparation distribution and destruction Record-Fullpermission" },



  // Quality Control
  {
    label: "Quality Control-Differential Pressure Record-Fullpermission",
    
  },
  {
    label:
      "Quality Control-Temperature & Relative Humidity Record-Fullpermission",
    
  },
  {
    label: "Quality Control-Equipment Usage Record-Fullpermission",
    
  },
  { label: "Quality Control-Area Cleaning Record-Fullpermission", },
  {
    label: "Quality Control-DP Monitoring Across Filters Record-Fullpermission",
    
  },
  {
    label: "Quality Control-Operation of Air Handling Unit Record-Fullpermission",
    
  },
  {
    label: "Quality Control-Instrument Usage Record-Fullpermission",
    
  },
  {
    label: "Quality Control-Disinfectant Stock Record-Fullpermission",
    
  },
  {
    label: "Quality Control-Lactic Acid Bacillus Assay Sample Record-Fullpermission",
    
  },
  {
    label: "Quality Control-Microbial Limit Test Sample Record-Fullpermission",
    
  },
  { label: "Quality Control-Fogging Solution Preparation Record-Fullpermission", },
  { label: "Quality Control-Area Fogging Record-Fullpermission", },
  { label: "Quality Control-Filter Cleaning Record-Fullpermission", },
  { label: "Quality Control-Media Consumption Record-Fullpermission", },
  { label: "Quality Control-Dispensing Record-Fullpermission" },
{ label: "Quality Control-Cold Chamber Cleaning Record-Fullpermission" },
{ label: "Quality Control-Returned Finished Goods Register Record-Fullpermission" },
{ label: "Quality Control-Dispensing Booth Activity Record-Fullpermission" },
{ label: "Quality Control-Autoclave Sterelization Record-Fullpermission" },
{ label: "Quality Control-Drain cleaning and sanitization Record-Fullpermission" },
{ label: "Quality Control-Breakdown / Maintenance Work Order Record-Fullpermission" },
{ label: "Quality Control-Cleaning and Disinfectant solution preparation distribution and destruction Record-Fullpermission" },


  // Production
  {
    label: "Production-Differential Pressure Record-Fullpermission",
    
  },
  {
    label: "Production-Temperature & Relative Humidity Record-Fullpermission",
    
  },
  { label: "Production-Equipment Usage Record-Fullpermission", },
  { label: "Production-Area Cleaning Record-Fullpermission", },
  {
    label: "Production-DP Monitoring Across Filters Record-Fullpermission",
    
  },
  {
    label: "Production-Operation of Air Handling Unit Record-Fullpermission",
    
  },
  { label: "Production-Instrument Usage Record-Fullpermission", },
  {
    label: "Production-Disinfectant Stock Record-Fullpermission",
    
  },
  {
    label: "Production-Lactic Acid Bacillus Assay Sample Record-Fullpermission",
    
  },
  {
    label: "Production-Microbial Limit Test Sample Record-Fullpermission",
    
  },
    { label: "Production-Fogging Solution Preparation Record-Fullpermission", },
  { label: "Production-Area Fogging Record-Fullpermission", },
  { label: "Production-Filter Cleaning Record-Fullpermission", },
  { label: "Production-Media Consumption Record-Fullpermission", },
  { label: "Production-Dispensing Record-Fullpermission" },
{ label: "Production-Cold Chamber Cleaning Record-Fullpermission" },
{ label: "Production-Returned Finished Goods Register Record-Fullpermission" },
{ label: "Production-Dispensing Booth Activity Record-Fullpermission" },
{ label: "Production-Autoclave Sterelization Record-Fullpermission" },
{ label: "Production-Drain cleaning and sanitization Record-Fullpermission" },
{ label: "Production-Breakdown / Maintenance Work Order Record-Fullpermission" },
{ label: "Production-Cleaning and Disinfectant solution preparation distribution and destruction Record-Fullpermission" },



  // Warehouse
  {
    label: "Warehouse-Differential Pressure Record-Fullpermission",
    
  },
  {
    label: "Warehouse-Temperature & Relative Humidity Record-Fullpermission",
    
  },
  { label: "Warehouse-Equipment Usage Record-Fullpermission", },
  { label: "Warehouse-Area Cleaning Record-Fullpermission", },
  {
    label: "Warehouse-DP Monitoring Across Filters Record-Fullpermission",
    
  },
  {
    label: "Warehouse-Operation of Air Handling Unit Record-Fullpermission",
    
  },
  { label: "Warehouse-Instrument Usage Record-Fullpermission", },
  {
    label: "Warehouse-Disinfectant Stock Record-Fullpermission",
    
  },
  {
    label: "Warehouse-Lactic Acid Bacillus Assay Sample Record-Fullpermission",
    
  },
  {
    label: "Warehouse-Microbial Limit Test Sample Record-Fullpermission",
    
  },
    { label: "Warehouse-Fogging Solution Preparation Record-Fullpermission", },
  { label: "Warehouse-Area Fogging Record-Fullpermission", },
  { label: "Warehouse-Filter Cleaning Record-Fullpermission", },
  { label: "Warehouse-Media Consumption Record-Fullpermission", },
  { label: "Warehouse-Dispensing Record-Fullpermission" },
{ label: "Warehouse-Cold Chamber Cleaning Record-Fullpermission" },
{ label: "Warehouse-Returned Finished Goods Register Record-Fullpermission" },
{ label: "Warehouse-Dispensing Booth Activity Record-Fullpermission" },
{ label: "Warehouse-Autoclave Sterelization Record-Fullpermission" },
{ label: "Warehouse-Drain cleaning and sanitization Record-Fullpermission" },
{ label: "Warehouse-Breakdown / Maintenance Work Order Record-Fullpermission" },
{ label: "Warehouse-Cleaning and Disinfectant solution preparation distribution and destruction Record-Fullpermission" },



  // Engineering
  {
    label: "Engineering-Differential Pressure Record-Fullpermission",
    
  },
  {
    label: "Engineering-Temperature & Relative Humidity Record-Fullpermission",
    
  },
  { label: "Engineering-Equipment Usage Record-Fullpermission", },
  { label: "Engineering-Area Cleaning Record-Fullpermission", },
  {
    label: "Engineering-DP Monitoring Across Filters Record-Fullpermission",
    
  },
  {
    label: "Engineering-Operation of Air Handling Unit Record-Fullpermission",
    
  },
  { label: "Engineering-Instrument Usage Record-Fullpermission", },
  {
    label: "Engineering-Disinfectant Stock Record-Fullpermission",
    
  },
  {
    label: "Engineering-Lactic Acid Bacillus Assay Sample Record-Fullpermission",
    
  },
  {
    label: "Engineering-Microbial Limit Test Sample Record-Fullpermission",
    
  },
    { label: "Engineering-Fogging Solution Preparation Record-Fullpermission", },
  { label: "Engineering-Area Fogging Record-Fullpermission", },
  { label: "Engineering-Filter Cleaning Record-Fullpermission", },
  { label: "Engineering-Media Consumption Record-Fullpermission", },
  { label: "Engineering-Dispensing Record-Fullpermission" },
{ label: "Engineering-Cold Chamber Cleaning Record-Fullpermission" },
{ label: "Engineering-Returned Finished Goods Register Record-Fullpermission" },
{ label: "Engineering-Dispensing Booth Activity Record-Fullpermission" },
{ label: "Engineering-Autoclave Sterelization Record-Fullpermission" },
{ label: "Engineering-Drain cleaning and sanitization Record-Fullpermission" },
{ label: "Engineering-Breakdown / Maintenance Work Order Record-Fullpermission" },
{ label: "Engineering-Cleaning and Disinfectant solution preparation distribution and destruction Record-Fullpermission" },



  // Human Resources
  {
    label: "Human Resources-Differential Pressure Record-Fullpermission",
    
  },
  {
    label:
      "Human Resources-Temperature & Relative Humidity Record-Fullpermission",
    
  },
  {
    label: "Human Resources-Equipment Usage Record-Fullpermission",
    
  },
  { label: "Human Resources-Area Cleaning Record-Fullpermission", },
  {
    label: "Human Resources-DP Monitoring Across Filters Record-Fullpermission",
    
  },
  {
    label: "Human Resources-Operation of Air Handling Unit Record-Fullpermission",
    
  },
  {
    label: "Human Resources-Instrument Usage Record-Fullpermission",
    
  },
  {
    label: "Human Resources-Disinfectant Stock Record-Fullpermission",
    
  },
  {
    label: "Human Resources-Lactic Acid Bacillus Assay Sample Record-Fullpermission",
    
  },
  {
    label: "Human Resources-Microbial Limit Test Sample Record-Fullpermission",
    
  },
    { label: "Human Resources-Fogging Solution Preparation Record-Fullpermission", },
  { label: "Human Resources-Area Fogging Record-Fullpermission", },
  { label: "Human Resources-Filter Cleaning Record-Fullpermission", },
  { label: "Human Resources-Media Consumption Record-Fullpermission", },
  { label: "Human Resources-Dispensing Record-Fullpermission" },
{ label: "Human Resources-Cold Chamber Cleaning Record-Fullpermission" },
{ label: "Human Resources-Returned Finished Goods Register Record-Fullpermission" },
{ label: "Human Resources-Dispensing Booth Activity Record-Fullpermission" },
{ label: "Human Resources-Autoclave Sterelization Record-Fullpermission" },
{ label: "Human Resources-Drain cleaning and sanitization Record-Fullpermission" },
{ label: "Human Resources-Breakdown / Maintenance Work Order Record-Fullpermission" },
{ label: "Human Resources-Cleaning and Disinfectant solution preparation distribution and destruction Record-Fullpermission" },



  // Information Technology
  {
    label: "Information Technology-Differential Pressure Record-Fullpermission",
    
  },
  {
    label:
      "Information Technology-Temperature & Relative Humidity Record-Fullpermission",
    
  },
  {
    label: "Information Technology-Equipment Usage Record-Fullpermission",
    
  },
  {
    label: "Information Technology-Area Cleaning Record-Fullpermission",
    
  },
  {
    label: "Information Technology-DP Monitoring Across Filters Record-Fullpermission",
    
  },
  {
    label:
      "Information Technology-Operation of Air Handling Unit Record-Fullpermission",
    
  },
  {
    label: "Information Technology-Instrument Usage Record-Fullpermission",
    
  },
  {
    label: "Information Technology-Disinfectant Stock Record-Fullpermission",
    
  },
  {
    label: "Information Technology-Lactic Acid Bacillus Assay Sample Record-Fullpermission",
    
  },
  {
    label: "Information Technology-Microbial Limit Test Sample Record-Fullpermission",
    
  },
    { label: "Information Technology-Fogging Solution Preparation Record-Fullpermission", },
  { label: "Information Technology-Area Fogging Record-Fullpermission", },
  { label: "Information Technology-Filter Cleaning Record-Fullpermission", },
  { label: "Information Technology-Media Consumption Record-Fullpermission", },
  { label: "Information Technology-Dispensing Record-Fullpermission" },
{ label: "Information Technology-Cold Chamber Cleaning Record-Fullpermission" },
{ label: "Information Technology-Returned Finished Goods Register Record-Fullpermission" },
{ label: "Information Technology-Dispensing Booth Activity Record-Fullpermission" },
{ label: "Information Technology-Autoclave Sterelization Record-Fullpermission" },
{ label: "Information Technology-Drain cleaning and sanitization Record-Fullpermission" },
{ label: "Information Technology-Breakdown / Maintenance Work Order Record-Fullpermission" },
{ label: "Information Technology-Cleaning and Disinfectant solution preparation distribution and destruction Record-Fullpermission" },



  // Accounts
  { label: "Accounts-Differential Pressure Record-Fullpermission", },
  {
    label: "Accounts-Temperature & Relative Humidity Record-Fullpermission",
    
  },
  { label: "Accounts-Equipment Usage Record-Fullpermission", },
  { label: "Accounts-Area Cleaning Record-Fullpermission", },
  { label: "Accounts-DP Monitoring Across Filters Record-Fullpermission", },
  {
    label: "Accounts-Operation of Air Handling Unit Record-Fullpermission",
    
  },
  { label: "Accounts-Instrument Usage Record-Fullpermission", },
  {
    label: "Accounts-Disinfectant Stock Record-Fullpermission",
    
  },
  {
    label: "Accounts-Lactic Acid Bacillus Assay Sample Record-Fullpermission",
    
  },
  {
    label: "Accounts-Microbial Limit Test Sample Record-Fullpermission",
    
  },
    { label: "Accounts-Fogging Solution Preparation Record-Fullpermission", },
  { label: "Accounts-Area Fogging Record-Fullpermission", },
  { label: "Accounts-Filter Cleaning Record-Fullpermission", },
  { label: "Accounts-Media Consumption Record-Fullpermission", },
  { label: "Accounts-Dispensing Record-Fullpermission" },
{ label: "Accounts-Cold Chamber Cleaning Record-Fullpermission" },
{ label: "Accounts-Returned Finished Goods Register Record-Fullpermission" },
{ label: "Accounts-Dispensing Booth Activity Record-Fullpermission" },
{ label: "Accounts-Autoclave Sterelization Record-Fullpermission" },
{ label: "Accounts-Drain cleaning and sanitization Record-Fullpermission" },
{ label: "Accounts-Breakdown / Maintenance Work Order Record-Fullpermission" },
{ label: "Accounts-Cleaning and Disinfectant solution preparation distribution and destruction Record-Fullpermission" },



  // PPIC
  {
    label:
      "Production Planning and Inventory Control-Differential Pressure Record-Fullpermission",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Temperature & Relative Humidity Record-Fullpermission",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Equipment Usage Record-Fullpermission",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Area Cleaning Record-Fullpermission",
    
  },
  {
    label:
      "Production Planning and Inventory Control-DP Monitoring Across Filters Record-Fullpermission",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Operation of Air Handling Unit Record-Fullpermission",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Instrument Usage Record-Fullpermission",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Disinfectant Stock Record-Fullpermission",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Lactic Acid Bacillus Assay Sample Record-Fullpermission",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Microbial Limit Test Sample Record-Fullpermission",
    
  },
    { label: "Production Planning and Inventory Control-Fogging Solution Preparation Record-Fullpermission", },
  { label: "Production Planning and Inventory Control-Area Fogging Record-Fullpermission", },
  { label: "Production Planning and Inventory Control-Filter Cleaning Record-Fullpermission", },
  { label: "Production Planning and Inventory Control-Media Consumption Record-Fullpermission", },
  { label: "Production Planning and Inventory Control-Dispensing Record-Fullpermission" },
{ label: "Production Planning and Inventory Control-Cold Chamber Cleaning Record-Fullpermission" },
{ label: "Production Planning and Inventory Control-Returned Finished Goods Register Record-Fullpermission" },
{ label: "Production Planning and Inventory Control-Dispensing Booth Activity Record-Fullpermission" },
{ label: "Production Planning and Inventory Control-Autoclave Sterelization Record-Fullpermission" },
{ label: "Production Planning and Inventory Control-Drain cleaning and sanitization Record-Fullpermission" },
{ label: "Production Planning and Inventory Control-Breakdown / Maintenance Work Order Record-Fullpermission" },
{ label: "Production Planning and Inventory Control-Cleaning and Disinfectant solution preparation distribution and destruction Record-Fullpermission" },



  // Regulatory Affairs
  {
    label: "Regulatory Affairs-Differential Pressure Record-Fullpermission",
    
  },
  {
    label:
      "Regulatory Affairs-Temperature & Relative Humidity Record-Fullpermission",
    
  },
  {
    label: "Regulatory Affairs-Equipment Usage Record-Fullpermission",
    
  },
  {
    label: "Regulatory Affairs-Area Cleaning Record-Fullpermission",
    
  },
  {
    label: "Regulatory Affairs-DP Monitoring Across Filters Record-Fullpermission",
    
  },
  {
    label: "Regulatory Affairs-Operation of Air Handling Unit Record-Fullpermission",
    
  },
  {
    label: "Regulatory Affairs-Instrument Usage Record-Fullpermission",
    
  },
  {
    label: "Regulatory Affairs-Disinfectant Stock Record-Fullpermission",
    
  },
  {
    label: "Regulatory Affairs-Lactic Acid Bacillus Assay Sample Record-Fullpermission",
    
  },
  {
    label: "Regulatory Affairs-Microbial Limit Test Sample Record-Fullpermission",
    
  },
    { label: "Regulatory Affairs-Fogging Solution Preparation Record-Fullpermission", },
  { label: "Regulatory Affairs-Area Fogging Record-Fullpermission", },
  { label: "Regulatory Affairs-Filter Cleaning Record-Fullpermission", },
  { label: "Regulatory Affairs-Media Consumption Record-Fullpermission", },
  { label: "Regulatory Affairs-Dispensing Record-Fullpermission" },
{ label: "Regulatory Affairs-Cold Chamber Cleaning Record-Fullpermission" },
{ label: "Regulatory Affairs-Returned Finished Goods Register Record-Fullpermission" },
{ label: "Regulatory Affairs-Dispensing Booth Activity Record-Fullpermission" },
{ label: "Regulatory Affairs-Autoclave Sterelization Record-Fullpermission" },
{ label: "Regulatory Affairs-Drain cleaning and sanitization Record-Fullpermission" },
{ label: "Regulatory Affairs-Breakdown / Maintenance Work Order Record-Fullpermission" },
{ label: "Regulatory Affairs-Cleaning and Disinfectant solution preparation distribution and destruction Record-Fullpermission" },



];

const processInitiatorRoles = async (rolesArray, user) => {
  if (!user) return;

  await sequelize.transaction(async (transaction) => {
    console.log(`Assigning roles to ${user.email}`);

    // 🔹 Preload masters once
    const departments = await Department.findAll({ transaction });
    const processes = await Process.findAll({ transaction });
    const roles = await Role.findAll({ transaction });
    const roleGroups = await RoleGroup.findAll({ transaction });

    const deptMap = Object.fromEntries(
      departments.map((d) => [d.departmentName, d]),
    );
    const processMap = Object.fromEntries(processes.map((p) => [p.process, p]));
    const roleMap = Object.fromEntries(roles.map((r) => [r.role, r]));
    const roleGroupMap = Object.fromEntries(
      roleGroups.map((rg) => [rg.roleGroup, rg]),
    );

    for (const item of rolesArray) {
      // ✅ Safe split (first and last only)
      const firstDash = item.label.indexOf("-");
      const lastDash = item.label.lastIndexOf("-");

      const departmentLabel = item.label.substring(0, firstDash);
      const processLabel = item.label.substring(firstDash + 1, lastDash);
      const roleName = item.label.substring(lastDash + 1);

      const department = deptMap[departmentLabel];
      const process = processMap[processLabel];
      const roleEntity = roleMap[roleName];
      const roleGroup = roleGroupMap[item.label];

      if (!department || !process || !roleEntity || !roleGroup) {
        console.error(`❌ Invalid mapping for: ${item.label}`);
        continue; // skip bad ones, don’t kill whole transaction
      }

      await UserRole.findOrCreate({
        where: {
          user_id: user.user_id,
          roleGroup_id: roleGroup.roleGroup_id,
        },
        defaults: {
          user_id: user.user_id,
          department_id: department.department_id,
          process_id: process.process_id,
          role_id: roleEntity.role_id,
          roleGroup_id: roleGroup.roleGroup_id,
        },
        transaction,
      });
    }
  });
};

const assignInitiatorRoles = async () => {
  try {
    const initiatorUser = await User.findOne({
      where: { email: "initiator@vidyagxp.com" },
    });
    const reviewerUser = await User.findOne({
      where: { email: "reviewer@vidyagxp.com" },
    });
    const approverUser = await User.findOne({
      where: { email: "approver@vidyagxp.com" },
    });
    const fullPermissionUser = await User.findOne({
      where: { email: "fullpermission@vidyagxp.com" },
    });

    if (
      !initiatorUser ||
      !reviewerUser ||
      !approverUser ||
      !fullPermissionUser
    ) {
      throw new Error("One or more system users not found");
    }

    await processInitiatorRoles(rolesArray1, initiatorUser);
    await processInitiatorRoles(rolesArray2, reviewerUser);
    await processInitiatorRoles(rolesArray3, approverUser);
    await processInitiatorRoles(rolesArray4, fullPermissionUser);

    console.log("Roles assigned successfully.");
  } catch (error) {
    console.error("Error assigning roles:", error.message);
  }
};

const userRolesSync = async () => {
  try {
    const count = await UserRole.count();

    if (count === 0) {
      await assignInitiatorRoles();
      console.log("User roles seeded successfully");
    } else {
      console.log("User roles already exist");
    }
  } catch (error) {
    console.error("User role sync failed:", error.message);
  }
};

module.exports = userRolesSync;
