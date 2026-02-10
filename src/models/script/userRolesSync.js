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
    label: "Quality Assurance-DP Monitoring Across Filters-Initiator",
     },
  {
    label: "Quality Assurance-Operation of Air Handling Unit-Initiator",
     },
  { label: "Quality Assurance-Instrument Usage Record-Initiator",},
  { label: "Quality Assurance-Disinfectant Stock Record-Initiator",},
  { label: "Quality Assurance-Lactic Acid Bacillus Assay Sample-Initiator",},
  { label: "Quality Assurance-Microbial Limit Test Sample-Initiator",},

  // Quality Control
  { label: "Quality Control-Differential Pressure Record-Initiator",} ,
  {
    label: "Quality Control-Temperature & Relative Humidity Record-Initiator",
     },
  { label: "Quality Control-Equipment Usage Record-Initiator" },
  { label: "Quality Control-Area Cleaning Record-Initiator"},
  {
    label: "Quality Control-DP Monitoring Across Filters-Initiator",
      },
  {
    label: "Quality Control-Operation of Air Handling Unit-Initiator",
      },
  { label: "Quality Control-Instrument Usage Record-Initiator",} ,
  { label: "Quality Control-Disinfectant Stock Record-Initiator",} ,
  { label: "Quality Control-Lactic Acid Bacillus Assay Sample-Initiator",} ,
  { label: "Quality Control-Microbial Limit Test Sample-Initiator",} ,

  // Production
  { label: "Production-Differential Pressure Record-Initiator", },
  {
    label: "Production-Temperature & Relative Humidity Record-Initiator",
      },
  { label: "Production-Equipment Usage Record-Initiator", },
  { label: "Production-Area Cleaning Record-Initiator", },
  { label: "Production-DP Monitoring Across Filters-Initiator",} ,
  { label: "Production-Operation of Air Handling Unit-Initiator",} ,
  { label: "Production-Instrument Usage Record-Initiator", },
  { label: "Production-Disinfectant Stock Record-Initiator", },
  { label: "Production-Lactic Acid Bacillus Assay Sample-Initiator", },
  { label: "Production-Microbial Limit Test Sample-Initiator", },

  // Warehouse
  { label: "Warehouse-Differential Pressure Record-Initiator", },
  {
    label: "Warehouse-Temperature & Relative Humidity Record-Initiator",
      },
  { label: "Warehouse-Equipment Usage Record-Initiator", },
  { label: "Warehouse-Area Cleaning Record-Initiator", },
  { label: "Warehouse-DP Monitoring Across Filters-Initiator", },
  { label: "Warehouse-Operation of Air Handling Unit-Initiator", },
  { label: "Warehouse-Instrument Usage Record-Initiator", },
  { label: "Warehouse-Disinfectant Stock Record-Initiator", },
  { label: "Warehouse-Lactic Acid Bacillus Assay Sample-Initiator", },
  { label: "Warehouse-Microbial Limit Test Sample-Initiator", },

  // Engineering
  { label: "Engineering-Differential Pressure Record-Initiator", },
  {
    label: "Engineering-Temperature & Relative Humidity Record-Initiator",
      },
  { label: "Engineering-Equipment Usage Record-Initiator", },
  { label: "Engineering-Area Cleaning Record-Initiator", },
  { label: "Engineering-DP Monitoring Across Filters-Initiator", },
  { label: "Engineering-Operation of Air Handling Unit-Initiator", },
  { label: "Engineering-Instrument Usage Record-Initiator", },
  { label: "Engineering-Disinfectant Stock Record-Initiator", },
  { label: "Engineering-Lactic Acid Bacillus Assay Sample-Initiator", },
  { label: "Engineering-Microbial Limit Test Sample-Initiator", },

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
    label: "Human Resources-DP Monitoring Across Filters-Initiator",
      },
  {
    label: "Human Resources-Operation of Air Handling Unit-Initiator",
      },
  { label: "Human Resources-Instrument Usage Record-Initiator", },
  { label: "Human Resources-Disinfectant Stock Record-Initiator", },
  { label: "Human Resources-Lactic Acid Bacillus Assay Sample-Initiator", },
  { label: "Human Resources-Microbial Limit Test Sample-Initiator", },

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
    label: "Information Technology-DP Monitoring Across Filters-Initiator",
      },
  {
    label: "Information Technology-Operation of Air Handling Unit-Initiator",
      },
  {
    label: "Information Technology-Instrument Usage Record-Initiator",
      },
  {
    label: "Information Technology-Disinfectant Stock Record-Initiator",
      },
  {
    label: "Information Technology-Lactic Acid Bacillus Assay Sample-Initiator",
      },
  {
    label: "Information Technology-Microbial Limit Test Sample-Initiator",
      },

  // Accounts
  { label: "Accounts-Differential Pressure Record-Initiator",  },
  {
    label: "Accounts-Temperature & Relative Humidity Record-Initiator",
      },
  { label: "Accounts-Equipment Usage Record-Initiator", },
  { label: "Accounts-Area Cleaning Record-Initiator", },
  { label: "Accounts-DP Monitoring Across Filters-Initiator", },
  { label: "Accounts-Operation of Air Handling Unit-Initiator", },
  { label: "Accounts-Instrument Usage Record-Initiator", },
  { label: "Accounts-Disinfectant Stock Record-Initiator", },
  { label: "Accounts-Lactic Acid Bacillus Assay Sample-Initiator", },
  { label: "Accounts-Microbial Limit Test Sample-Initiator", },
      
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
      "Production Planning and Inventory Control-DP Monitoring Across Filters-Initiator",
      },
  {
    label:
      "Production Planning and Inventory Control-Operation of Air Handling Unit-Initiator",
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
      "Production Planning and Inventory Control-Lactic Acid Bacillus Assay Sample-Initiator",
      },
  {
    label:
      "Production Planning and Inventory Control-Microbial Limit Test Sample-Initiator",
      },

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
    label: "Regulatory Affairs-DP Monitoring Across Filters-Initiator",
      },
  {
    label: "Regulatory Affairs-Operation of Air Handling Unit-Initiator",
      },
  { label: "Regulatory Affairs-Instrument Usage Record-Initiator", },
  { label: "Regulatory Affairs-Disinfectant Stock Record-Initiator", },
  { label: "Regulatory Affairs-Lactic Acid Bacillus Assay Sample-Initiator", },
  { label: "Regulatory Affairs-Microbial Limit Test Sample-Initiator", },
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
    label: "Quality Assurance-DP Monitoring Across Filters-Reviewer",
      },
  {
    label: "Quality Assurance-Operation of Air Handling Unit-Reviewer",
      },
  { label: "Quality Assurance-Instrument Usage Record-Reviewer", },
  { label: "Quality Assurance-Disinfectant Stock Record-Reviewer", },
  { label: "Quality Assurance-Lactic Acid Bacillus Assay Sample-Reviewer", },
  { label: "Quality Assurance-Microbial Limit Test Sample-Reviewer", },

  // Quality Control
  { label: "Quality Control-Differential Pressure Record-Reviewer",} ,
  {
    label: "Quality Control-Temperature & Relative Humidity Record-Reviewer",
      },
  { label: "Quality Control-Equipment Usage Record-Reviewer", },
  { label: "Quality Control-Area Cleaning Record-Reviewer", },
  { label: "Quality Control-DP Monitoring Across Filters-Reviewer", },
  {
    label: "Quality Control-Operation of Air Handling Unit-Reviewer",
      },
  { label: "Quality Control-Instrument Usage Record-Reviewer", },
  { label: "Quality Control-Disinfectant Stock Record-Reviewer", },
  { label: "Quality Control-Lactic Acid Bacillus Assay Sample-Reviewer", },
  { label: "Quality Control-Microbial Limit Test Sample-Reviewer", },

  // Production
  { label: "Production-Differential Pressure Record-Reviewer", },
  {
    label: "Production-Temperature & Relative Humidity Record-Reviewer",
      },
  { label: "Production-Equipment Usage Record-Reviewer", },
  { label: "Production-Area Cleaning Record-Reviewer", },
  { label: "Production-DP Monitoring Across Filters-Reviewer", },
  { label: "Production-Operation of Air Handling Unit-Reviewer", },
  { label: "Production-Instrument Usage Record-Reviewer", },
  { label: "Production-Disinfectant Stock Record-Reviewer", },
  { label: "Production-Lactic Acid Bacillus Assay Sample-Reviewer", },
  { label: "Production-Microbial Limit Test Sample-Reviewer", },

  // Warehouse
  { label: "Warehouse-Differential Pressure Record-Reviewer", },
  {
    label: "Warehouse-Temperature & Relative Humidity Record-Reviewer",
      },
  { label: "Warehouse-Equipment Usage Record-Reviewer", },
  { label: "Warehouse-Area Cleaning Record-Reviewer", },
  { label: "Warehouse-DP Monitoring Across Filters-Reviewer", },
  { label: "Warehouse-Operation of Air Handling Unit-Reviewer", },
  { label: "Warehouse-Instrument Usage Record-Reviewer", },
  { label: "Warehouse-Disinfectant Stock Record-Reviewer", },
  { label: "Warehouse-Lactic Acid Bacillus Assay Sample-Reviewer", },
  { label: "Warehouse-Microbial Limit Test Sample-Reviewer", },

  // Engineering
  { label: "Engineering-Differential Pressure Record-Reviewer", },
  {
    label: "Engineering-Temperature & Relative Humidity Record-Reviewer",
      },
  { label: "Engineering-Equipment Usage Record-Reviewer", },
  { label: "Engineering-Area Cleaning Record-Reviewer", },
  { label: "Engineering-DP Monitoring Across Filters-Reviewer", },
  { label: "Engineering-Operation of Air Handling Unit-Reviewer", },
  { label: "Engineering-Instrument Usage Record-Reviewer", },
  { label: "Engineering-Disinfectant Stock Record-Reviewer", },
  { label: "Engineering-Lactic Acid Bacillus Assay Sample-Reviewer", },
  { label: "Engineering-Microbial Limit Test Sample-Reviewer", },

  // Human Resources
  { label: "Human Resources-Differential Pressure Record-Reviewer", },
  {
    label: "Human Resources-Temperature & Relative Humidity Record-Reviewer",
      },
  { label: "Human Resources-Equipment Usage Record-Reviewer", },
  { label: "Human Resources-Area Cleaning Record-Reviewer", },
  { label: "Human Resources-DP Monitoring Across Filters-Reviewer", },
  {
    label: "Human Resources-Operation of Air Handling Unit-Reviewer",
      },
  { label: "Human Resources-Instrument Usage Record-Reviewer", },
  { label: "Human Resources-Disinfectant Stock Record-Reviewer", },
  { label: "Human Resources-Lactic Acid Bacillus Assay Sample-Reviewer", },
  { label: "Human Resources-Microbial Limit Test Sample-Reviewer", },

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
    label: "Information Technology-DP Monitoring Across Filters-Reviewer",
    
  },
  {
    label: "Information Technology-Operation of Air Handling Unit-Reviewer",
    
  },
  {
    label: "Information Technology-Instrument Usage Record-Reviewer",
    
  },
  {
    label: "Information Technology-Disinfectant Stock Record-Reviewer",
    
  },
  {
    label: "Information Technology-Lactic Acid Bacillus Assay Sample-Reviewer",
    
  },
  {
    label: "Information Technology-Microbial Limit Test Sample-Reviewer",
    
  },

  // Accounts
  { label: "Accounts-Differential Pressure Record-Reviewer", },
  {
    label: "Accounts-Temperature & Relative Humidity Record-Reviewer",
    
  },
  { label: "Accounts-Equipment Usage Record-Reviewer", },
  { label: "Accounts-Area Cleaning Record-Reviewer", },
  { label: "Accounts-DP Monitoring Across Filters-Reviewer", },
  { label: "Accounts-Operation of Air Handling Unit-Reviewer", },
  { label: "Accounts-Instrument Usage Record-Reviewer", },
  { label: "Accounts-Disinfectant Stock Record-Reviewer", },
  { label: "Accounts-Lactic Acid Bacillus Assay Sample-Reviewer", },
  { label: "Accounts-Microbial Limit Test Sample-Reviewer", },

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
      "Production Planning and Inventory Control-DP Monitoring Across Filters-Reviewer",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Operation of Air Handling Unit-Reviewer",
    
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
      "Production Planning and Inventory Control-Lactic Acid Bacillus Assay Sample-Reviewer",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Microbial Limit Test Sample-Reviewer",
    
    
  },

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
    label: "Regulatory Affairs-DP Monitoring Across Filters-Reviewer",
    
  },
  {
    label: "Regulatory Affairs-Operation of Air Handling Unit-Reviewer",
    
  },
  { label: "Regulatory Affairs-Instrument Usage Record-Reviewer", },
  { label: "Regulatory Affairs-Disinfectant Stock Record-Reviewer", },
  { label: "Regulatory Affairs-Lactic Acid Bacillus Assay Sample-Reviewer", },
  { label: "Regulatory Affairs-Microbial Limit Test Sample-Reviewer", },
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
    label: "Quality Assurance-DP Monitoring Across Filters-Approver",
    
  },
  {
    label: "Quality Assurance-Operation of Air Handling Unit-Approver",
    
  },
  { label: "Quality Assurance-Instrument Usage Record-Approver", },
  { label: "Quality Assurance-Disinfectant Stock Record-Approver", },
  { label: "Quality Assurance-Lactic Acid Bacillus Assay Sample-Approver", },
  { label: "Quality Assurance-Microbial Limit Test Sample-Approver", },

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
    label: "Quality Control-DP Monitoring Across Filters-Approver",
    
  },
  {
    label: "Quality Control-Operation of Air Handling Unit-Approver",
    
  },
  { label: "Quality Control-Instrument Usage Record-Approver", },
  { label: "Quality Control-Disinfectant Stock Record-Approver", },
  { label: "Quality Control-Lactic Acid Bacillus Assay Sample-Approver", },
  { label: "Quality Control-Microbial Limit Test Sample-Approver", },

  // Production
  { label: "Production-Differential Pressure Record-Approver", },
  {
    label: "Production-Temperature & Relative Humidity Record-Approver",
    
  },
  { label: "Production-Equipment Usage Record-Approver", },
  { label: "Production-Area Cleaning Record-Approver", },
  { label: "Production-DP Monitoring Across Filters-Approver", },
  { label: "Production-Operation of Air Handling Unit-Approver", },
  { label: "Production-Instrument Usage Record-Approver", },
  { label: "Production-Disinfectant Stock Record-Approver", },
  { label: "Production-Lactic Acid Bacillus Assay Sample-Approver", },
  { label: "Production-Microbial Limit Test Sample-Approver", },

  // Warehouse
  { label: "Warehouse-Differential Pressure Record-Approver", },
  {
    label: "Warehouse-Temperature & Relative Humidity Record-Approver",
    
  },
  { label: "Warehouse-Equipment Usage Record-Approver", },
  { label: "Warehouse-Area Cleaning Record-Approver", },
  { label: "Warehouse-DP Monitoring Across Filters-Approver", },
  { label: "Warehouse-Operation of Air Handling Unit-Approver", },
  { label: "Warehouse-Instrument Usage Record-Approver", },
  { label: "Warehouse-Disinfectant Stock Record-Approver", },
  { label: "Warehouse-Lactic Acid Bacillus Assay Sample-Approver", },
  { label: "Warehouse-Microbial Limit Test Sample-Approver", },

  // Engineering
  { label: "Engineering-Differential Pressure Record-Approver", },
  {
    label: "Engineering-Temperature & Relative Humidity Record-Approver",
    
  },
  { label: "Engineering-Equipment Usage Record-Approver", },
  { label: "Engineering-Area Cleaning Record-Approver", },
  { label: "Engineering-DP Monitoring Across Filters-Approver", },
  { label: "Engineering-Operation of Air Handling Unit-Approver", },
  { label: "Engineering-Instrument Usage Record-Approver", },
  { label: "Engineering-Disinfectant Stock Record-Approver", },
  { label: "Engineering-Lactic Acid Bacillus Assay Sample-Approver", },
  { label: "Engineering-Microbial Limit Test Sample-Approver", },

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
    label: "Human Resources-DP Monitoring Across Filters-Approver",
    
  },
  {
    label: "Human Resources-Operation of Air Handling Unit-Approver",
    
  },
  { label: "Human Resources-Instrument Usage Record-Approver", },
  { label: "Human Resources-Disinfectant Stock Record-Approver", },
  { label: "Human Resources-Lactic Acid Bacillus Assay Sample-Approver", },
  { label: "Human Resources-Microbial Limit Test Sample-Approver", },

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
    label: "Information Technology-DP Monitoring Across Filters-Approver",
    
  },
  {
    label: "Information Technology-Operation of Air Handling Unit-Approver",
    
  },
  {
    label: "Information Technology-Instrument Usage Record-Approver",
    
  },
  {
    label: "Information Technology-Disinfectant Stock Record-Approver",
    
  },
  {
    label: "Information Technology-Lactic Acid Bacillus Assay Sample-Approver",
    
  },
  {
    label: "Information Technology-Microbial Limit Test Sample-Approver",
    
  },

  // Accounts
  { label: "Accounts-Differential Pressure Record-Approver", },
  {
    label: "Accounts-Temperature & Relative Humidity Record-Approver",
    
  },
  { label: "Accounts-Equipment Usage Record-Approver", },
  { label: "Accounts-Area Cleaning Record-Approver", },
  { label: "Accounts-DP Monitoring Across Filters-Approver", },
  { label: "Accounts-Operation of Air Handling Unit-Approver", },
  { label: "Accounts-Instrument Usage Record-Approver", },
  { label: "Accounts-Disinfectant Stock Record-Approver", },
  { label: "Accounts-Lactic Acid Bacillus Assay Sample-Approver", },
  { label: "Accounts-Microbial Limit Test Sample-Approver", },

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
      "Production Planning and Inventory Control-DP Monitoring Across Filters-Approver",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Operation of Air Handling Unit-Approver",
    
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
      "Production Planning and Inventory Control-Lactic Acid Bacillus Assay Sample-Approver",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Microbial Limit Test Sample-Approver",
    
  },

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
    label: "Regulatory Affairs-DP Monitoring Across Filters-Approver",
    
  },
  {
    label: "Regulatory Affairs-Operation of Air Handling Unit-Approver",
    
  },
  { label: "Regulatory Affairs-Instrument Usage Record-Approver", },
  { label: "Regulatory Affairs-Disinfectant Stock Record-Approver", },
  { label: "Regulatory Affairs-Lactic Acid Bacillus Assay Sample-Approver", },
  { label: "Regulatory Affairs-Microbial Limit Test Sample-Approver", },
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
    label: "Quality Assurance-DP Monitoring Across Filters-Fullpermission",
    
  },
  {
    label: "Quality Assurance-Operation of Air Handling Unit-Fullpermission",
    
  },
  {
    label: "Quality Assurance-Instrument Usage Record-Fullpermission",
    
  },
    {
    label: "Quality Assurance-Disinfectant Stock Record-Fullpermission",
    
  },
  {
    label: "Quality Assurance-Lactic Acid Bacillus Assay Sample-Fullpermission",
    
  },
  {
    label: "Quality Assurance-Microbial Limit Test Sample-Fullpermission",
    
  },

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
    label: "Quality Control-DP Monitoring Across Filters-Fullpermission",
    
  },
  {
    label: "Quality Control-Operation of Air Handling Unit-Fullpermission",
    
  },
  {
    label: "Quality Control-Instrument Usage Record-Fullpermission",
    
  },
  {
    label: "Quality Control-Disinfectant Stock Record-Fullpermission",
    
  },
  {
    label: "Quality Control-Lactic Acid Bacillus Assay Sample-Fullpermission",
    
  },
  {
    label: "Quality Control-Microbial Limit Test Sample-Fullpermission",
    
  },


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
    label: "Production-DP Monitoring Across Filters-Fullpermission",
    
  },
  {
    label: "Production-Operation of Air Handling Unit-Fullpermission",
    
  },
  { label: "Production-Instrument Usage Record-Fullpermission", },
  {
    label: "Production-Disinfectant Stock Record-Fullpermission",
    
  },
  {
    label: "Production-Lactic Acid Bacillus Assay Sample-Fullpermission",
    
  },
  {
    label: "Production-Microbial Limit Test Sample-Fullpermission",
    
  },

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
    label: "Warehouse-DP Monitoring Across Filters-Fullpermission",
    
  },
  {
    label: "Warehouse-Operation of Air Handling Unit-Fullpermission",
    
  },
  { label: "Warehouse-Instrument Usage Record-Fullpermission", },
  {
    label: "Warehouse-Disinfectant Stock Record-Fullpermission",
    
  },
  {
    label: "Warehouse-Lactic Acid Bacillus Assay Sample-Fullpermission",
    
  },
  {
    label: "Warehouse-Microbial Limit Test Sample-Fullpermission",
    
  },

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
    label: "Engineering-DP Monitoring Across Filters-Fullpermission",
    
  },
  {
    label: "Engineering-Operation of Air Handling Unit-Fullpermission",
    
  },
  { label: "Engineering-Instrument Usage Record-Fullpermission", },
  {
    label: "Engineering-Disinfectant Stock Record-Fullpermission",
    
  },
  {
    label: "Engineering-Lactic Acid Bacillus Assay Sample-Fullpermission",
    
  },
  {
    label: "Engineering-Microbial Limit Test Sample-Fullpermission",
    
  },

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
    label: "Human Resources-DP Monitoring Across Filters-Fullpermission",
    
  },
  {
    label: "Human Resources-Operation of Air Handling Unit-Fullpermission",
    
  },
  {
    label: "Human Resources-Instrument Usage Record-Fullpermission",
    
  },
  {
    label: "Human Resources-Disinfectant Stock Record-Fullpermission",
    
  },
  {
    label: "Human Resources-Lactic Acid Bacillus Assay Sample-Fullpermission",
    
  },
  {
    label: "Human Resources-Microbial Limit Test Sample-Fullpermission",
    
  },

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
    label: "Information Technology-DP Monitoring Across Filters-Fullpermission",
    
  },
  {
    label:
      "Information Technology-Operation of Air Handling Unit-Fullpermission",
    
  },
  {
    label: "Information Technology-Instrument Usage Record-Fullpermission",
    
  },
  {
    label: "Information Technology-Disinfectant Stock Record-Fullpermission",
    
  },
  {
    label: "Information Technology-Lactic Acid Bacillus Assay Sample-Fullpermission",
    
  },
  {
    label: "Information Technology-Microbial Limit Test Sample-Fullpermission",
    
  },

  // Accounts
  { label: "Accounts-Differential Pressure Record-Fullpermission", },
  {
    label: "Accounts-Temperature & Relative Humidity Record-Fullpermission",
    
  },
  { label: "Accounts-Equipment Usage Record-Fullpermission", },
  { label: "Accounts-Area Cleaning Record-Fullpermission", },
  { label: "Accounts-DP Monitoring Across Filters-Fullpermission", },
  {
    label: "Accounts-Operation of Air Handling Unit-Fullpermission",
    
  },
  { label: "Accounts-Instrument Usage Record-Fullpermission", },
  {
    label: "Accounts-Disinfectant Stock Record-Fullpermission",
    
  },
  {
    label: "Accounts-Lactic Acid Bacillus Assay Sample-Fullpermission",
    
  },
  {
    label: "Accounts-Microbial Limit Test Sample-Fullpermission",
    
  },

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
      "Production Planning and Inventory Control-DP Monitoring Across Filters-Fullpermission",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Operation of Air Handling Unit-Fullpermission",
    
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
      "Production Planning and Inventory Control-Lactic Acid Bacillus Assay Sample-Fullpermission",
    
  },
  {
    label:
      "Production Planning and Inventory Control-Microbial Limit Test Sample-Fullpermission",
    
  },

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
    label: "Regulatory Affairs-DP Monitoring Across Filters-Fullpermission",
    
  },
  {
    label: "Regulatory Affairs-Operation of Air Handling Unit-Fullpermission",
    
  },
  {
    label: "Regulatory Affairs-Instrument Usage Record-Fullpermission",
    
  },
  {
    label: "Regulatory Affairs-Disinfectant Stock Record-Fullpermission",
    
  },
  {
    label: "Regulatory Affairs-Lactic Acid Bacillus Assay Sample-Fullpermission",
    
  },
  {
    label: "Regulatory Affairs-Microbial Limit Test Sample-Fullpermission",
    
  },

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
