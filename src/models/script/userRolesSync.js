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
