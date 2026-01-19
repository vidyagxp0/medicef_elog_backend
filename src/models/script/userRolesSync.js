const { sequelize } = require("../../config/db");
const { DataTypes } = require("sequelize");
const Role = require("../../models/roles");
const Department = require("../../models/departments");
const User = require("../../models/users");
const Process = require("../../models/processes");
const RoleGroup = require("../../models/userRoles");
const UserRole = require("../../models/userRoles");

const rolesArray1 = [
  // Quality Assurance
  { label: "Quality Assurance-Differential Pressure Record-Initiator", value: 1 },
  { label: "Quality Assurance-Temperature & Relative Humidity Record-Initiator", value: 2 },
  { label: "Quality Assurance-Equipment Usage Record-Initiator", value: 3 },
  { label: "Quality Assurance-Area Cleaning Record-Initiator", value: 4 },

  // Quality Control
  { label: "Quality Control-Differential Pressure Record-Initiator", value: 5 },
  { label: "Quality Control-Temperature & Relative Humidity Record-Initiator", value: 6 },
  { label: "Quality Control-Equipment Usage Record-Initiator", value: 7 },
  { label: "Quality Control-Area Cleaning Record-Initiator", value: 8 },

  // Production
  { label: "Production-Differential Pressure Record-Initiator", value: 9 },
  { label: "Production-Temperature & Relative Humidity Record-Initiator", value: 10 },
  { label: "Production-Equipment Usage Record-Initiator", value: 11 },
  { label: "Production-Area Cleaning Record-Initiator", value: 12 },

  // Warehouse
  { label: "Warehouse-Differential Pressure Record-Initiator", value: 13 },
  { label: "Warehouse-Temperature & Relative Humidity Record-Initiator", value: 14 },
  { label: "Warehouse-Equipment Usage Record-Initiator", value: 15 },
  { label: "Warehouse-Area Cleaning Record-Initiator", value: 16 },

  // Engineering
  { label: "Engineering-Differential Pressure Record-Initiator", value: 17 },
  { label: "Engineering-Temperature & Relative Humidity Record-Initiator", value: 18 },
  { label: "Engineering-Equipment Usage Record-Initiator", value: 19 },
  { label: "Engineering-Area Cleaning Record-Initiator", value: 20 },

  // Human Resources
  { label: "Human Resources-Differential Pressure Record-Initiator", value: 21 },
  { label: "Human Resources-Temperature & Relative Humidity Record-Initiator", value: 22 },
  { label: "Human Resources-Equipment Usage Record-Initiator", value: 23 },
  { label: "Human Resources-Area Cleaning Record-Initiator", value: 24 },

  // Information Technology
  { label: "Information Technology-Differential Pressure Record-Initiator", value: 25 },
  { label: "Information Technology-Temperature & Relative Humidity Record-Initiator", value: 26 },
  { label: "Information Technology-Equipment Usage Record-Initiator", value: 27 },
  { label: "Information Technology-Area Cleaning Record-Initiator", value: 28 },

  // Accounts
  { label: "Accounts-Differential Pressure Record-Initiator", value: 29 },
  { label: "Accounts-Temperature & Relative Humidity Record-Initiator", value: 30 },
  { label: "Accounts-Equipment Usage Record-Initiator", value: 31 },
  { label: "Accounts-Area Cleaning Record-Initiator", value: 32 },

  // PPIC
  { label: "Production Planning and Inventory Control-Differential Pressure Record-Initiator", value: 33 },
  { label: "Production Planning and Inventory Control-Temperature & Relative Humidity Record-Initiator", value: 34 },
  { label: "Production Planning and Inventory Control-Equipment Usage Record-Initiator", value: 35 },
  { label: "Production Planning and Inventory Control-Area Cleaning Record-Initiator", value: 36 },

  // Regulatory Affairs
  { label: "Regulatory Affairs-Differential Pressure Record-Initiator", value: 37 },
  { label: "Regulatory Affairs-Temperature & Relative Humidity Record-Initiator", value: 38 },
  { label: "Regulatory Affairs-Equipment Usage Record-Initiator", value: 39 },
  { label: "Regulatory Affairs-Area Cleaning Record-Initiator", value: 40 },
];

const rolesArray2 = [
  // Quality Assurance
  { label: "Quality Assurance-Differential Pressure Record-Reviewer", value: 41 },
  { label: "Quality Assurance-Temperature & Relative Humidity Record-Reviewer", value: 42 },
  { label: "Quality Assurance-Equipment Usage Record-Reviewer", value: 43 },
  { label: "Quality Assurance-Area Cleaning Record-Reviewer", value: 44 },

  // Quality Control
  { label: "Quality Control-Differential Pressure Record-Reviewer", value: 45 },
  { label: "Quality Control-Temperature & Relative Humidity Record-Reviewer", value: 46 },
  { label: "Quality Control-Equipment Usage Record-Reviewer", value: 47 },
  { label: "Quality Control-Area Cleaning Record-Reviewer", value: 48 },

  // Production
  { label: "Production-Differential Pressure Record-Reviewer", value: 49 },
  { label: "Production-Temperature & Relative Humidity Record-Reviewer", value: 50 },
  { label: "Production-Equipment Usage Record-Reviewer", value: 51 },
  { label: "Production-Area Cleaning Record-Reviewer", value: 52 },

  // Warehouse
  { label: "Warehouse-Differential Pressure Record-Reviewer", value: 53 },
  { label: "Warehouse-Temperature & Relative Humidity Record-Reviewer", value: 54 },
  { label: "Warehouse-Equipment Usage Record-Reviewer", value: 55 },
  { label: "Warehouse-Area Cleaning Record-Reviewer", value: 56 },

  // Engineering
  { label: "Engineering-Differential Pressure Record-Reviewer", value: 57 },
  { label: "Engineering-Temperature & Relative Humidity Record-Reviewer", value: 58 },
  { label: "Engineering-Equipment Usage Record-Reviewer", value: 59 },
  { label: "Engineering-Area Cleaning Record-Reviewer", value: 60 },

  // Human Resources
  { label: "Human Resources-Differential Pressure Record-Reviewer", value: 61 },
  { label: "Human Resources-Temperature & Relative Humidity Record-Reviewer", value: 62 },
  { label: "Human Resources-Equipment Usage Record-Reviewer", value: 63 },
  { label: "Human Resources-Area Cleaning Record-Reviewer", value: 64 },

  // Information Technology
  { label: "Information Technology-Differential Pressure Record-Reviewer", value: 65 },
  { label: "Information Technology-Temperature & Relative Humidity Record-Reviewer", value: 66 },
  { label: "Information Technology-Equipment Usage Record-Reviewer", value: 67 },
  { label: "Information Technology-Area Cleaning Record-Reviewer", value: 68 },

  // Accounts
  { label: "Accounts-Differential Pressure Record-Reviewer", value: 69 },
  { label: "Accounts-Temperature & Relative Humidity Record-Reviewer", value: 70 },
  { label: "Accounts-Equipment Usage Record-Reviewer", value: 71 },
  { label: "Accounts-Area Cleaning Record-Reviewer", value: 72 },

  // PPIC
  { label: "Production Planning and Inventory Control-Differential Pressure Record-Reviewer", value: 73 },
  { label: "Production Planning and Inventory Control-Temperature & Relative Humidity Record-Reviewer", value: 74 },
  { label: "Production Planning and Inventory Control-Equipment Usage Record-Reviewer", value: 75 },
  { label: "Production Planning and Inventory Control-Area Cleaning Record-Reviewer", value: 76 },

  // Regulatory Affairs
  { label: "Regulatory Affairs-Differential Pressure Record-Reviewer", value: 77 },
  { label: "Regulatory Affairs-Temperature & Relative Humidity Record-Reviewer", value: 78 },
  { label: "Regulatory Affairs-Equipment Usage Record-Reviewer", value: 79 },
  { label: "Regulatory Affairs-Area Cleaning Record-Reviewer", value: 80 },
];


const rolesArray3 = [
  // Quality Assurance
  { label: "Quality Assurance-Differential Pressure Record-Approver", value: 81 },
  { label: "Quality Assurance-Temperature & Relative Humidity Record-Approver", value: 82 },
  { label: "Quality Assurance-Equipment Usage Record-Approver", value: 83 },
  { label: "Quality Assurance-Area Cleaning Record-Approver", value: 84 },

  // Quality Control
  { label: "Quality Control-Differential Pressure Record-Approver", value: 85 },
  { label: "Quality Control-Temperature & Relative Humidity Record-Approver", value: 86 },
  { label: "Quality Control-Equipment Usage Record-Approver", value: 87 },
  { label: "Quality Control-Area Cleaning Record-Approver", value: 88 },

  // Production
  { label: "Production-Differential Pressure Record-Approver", value: 89 },
  { label: "Production-Temperature & Relative Humidity Record-Approver", value: 90 },
  { label: "Production-Equipment Usage Record-Approver", value: 91 },
  { label: "Production-Area Cleaning Record-Approver", value: 92 },

  // Warehouse
  { label: "Warehouse-Differential Pressure Record-Approver", value: 93 },
  { label: "Warehouse-Temperature & Relative Humidity Record-Approver", value: 94 },
  { label: "Warehouse-Equipment Usage Record-Approver", value: 95 },
  { label: "Warehouse-Area Cleaning Record-Approver", value: 96 },

  // Engineering
  { label: "Engineering-Differential Pressure Record-Approver", value: 97 },
  { label: "Engineering-Temperature & Relative Humidity Record-Approver", value: 98 },
  { label: "Engineering-Equipment Usage Record-Approver", value: 99 },
  { label: "Engineering-Area Cleaning Record-Approver", value: 100 },

  // Human Resources
  { label: "Human Resources-Differential Pressure Record-Approver", value: 101 },
  { label: "Human Resources-Temperature & Relative Humidity Record-Approver", value: 102 },
  { label: "Human Resources-Equipment Usage Record-Approver", value: 103 },
  { label: "Human Resources-Area Cleaning Record-Approver", value: 104 },

  // Information Technology
  { label: "Information Technology-Differential Pressure Record-Approver", value: 105 },
  { label: "Information Technology-Temperature & Relative Humidity Record-Approver", value: 106 },
  { label: "Information Technology-Equipment Usage Record-Approver", value: 107 },
  { label: "Information Technology-Area Cleaning Record-Approver", value: 108 },

  // Accounts
  { label: "Accounts-Differential Pressure Record-Approver", value: 109 },
  { label: "Accounts-Temperature & Relative Humidity Record-Approver", value: 110 },
  { label: "Accounts-Equipment Usage Record-Approver", value: 111 },
  { label: "Accounts-Area Cleaning Record-Approver", value: 112 },

  // PPIC
  { label: "Production Planning and Inventory Control-Differential Pressure Record-Approver", value: 113 },
  { label: "Production Planning and Inventory Control-Temperature & Relative Humidity Record-Approver", value: 114 },
  { label: "Production Planning and Inventory Control-Equipment Usage Record-Approver", value: 115 },
  { label: "Production Planning and Inventory Control-Area Cleaning Record-Approver", value: 116 },

  // Regulatory Affairs
  { label: "Regulatory Affairs-Differential Pressure Record-Approver", value: 117 },
  { label: "Regulatory Affairs-Temperature & Relative Humidity Record-Approver", value: 118 },
  { label: "Regulatory Affairs-Equipment Usage Record-Approver", value: 119 },
  { label: "Regulatory Affairs-Area Cleaning Record-Approver", value: 120 },
];

const rolesArray4 = [
  // Quality Assurance
  { label: "Quality Assurance-Differential Pressure Record-Fullpermission", value: 121 },
  { label: "Quality Assurance-Temperature & Relative Humidity Record-Fullpermission", value: 122 },
  { label: "Quality Assurance-Equipment Usage Record-Fullpermission", value: 123 },
  { label: "Quality Assurance-Area Cleaning Record-Fullpermission", value: 124 },

  // Quality Control
  { label: "Quality Control-Differential Pressure Record-Fullpermission", value: 125 },
  { label: "Quality Control-Temperature & Relative Humidity Record-Fullpermission", value: 126 },
  { label: "Quality Control-Equipment Usage Record-Fullpermission", value: 127 },
  { label: "Quality Control-Area Cleaning Record-Fullpermission", value: 128 },

  // Production
  { label: "Production-Differential Pressure Record-Fullpermission", value: 129 },
  { label: "Production-Temperature & Relative Humidity Record-Fullpermission", value: 130 },
  { label: "Production-Equipment Usage Record-Fullpermission", value: 131 },
  { label: "Production-Area Cleaning Record-Fullpermission", value: 132 },

  // Warehouse
  { label: "Warehouse-Differential Pressure Record-Fullpermission", value: 133 },
  { label: "Warehouse-Temperature & Relative Humidity Record-Fullpermission", value: 134 },
  { label: "Warehouse-Equipment Usage Record-Fullpermission", value: 135 },
  { label: "Warehouse-Area Cleaning Record-Fullpermission", value: 136 },

  // Engineering
  { label: "Engineering-Differential Pressure Record-Fullpermission", value: 137 },
  { label: "Engineering-Temperature & Relative Humidity Record-Fullpermission", value: 138 },
  { label: "Engineering-Equipment Usage Record-Fullpermission", value: 139 },
  { label: "Engineering-Area Cleaning Record-Fullpermission", value: 140 },

  // Human Resources
  { label: "Human Resources-Differential Pressure Record-Fullpermission", value: 141 },
  { label: "Human Resources-Temperature & Relative Humidity Record-Fullpermission", value: 142 },
  { label: "Human Resources-Equipment Usage Record-Fullpermission", value: 143 },
  { label: "Human Resources-Area Cleaning Record-Fullpermission", value: 144 },

  // Information Technology
  { label: "Information Technology-Differential Pressure Record-Fullpermission", value: 145 },
  { label: "Information Technology-Temperature & Relative Humidity Record-Fullpermission", value: 146 },
  { label: "Information Technology-Equipment Usage Record-Fullpermission", value: 147 },
  { label: "Information Technology-Area Cleaning Record-Fullpermission", value: 148 },

  // Accounts
  { label: "Accounts-Differential Pressure Record-Fullpermission", value: 149 },
  { label: "Accounts-Temperature & Relative Humidity Record-Fullpermission", value: 150 },
  { label: "Accounts-Equipment Usage Record-Fullpermission", value: 151 },
  { label: "Accounts-Area Cleaning Record-Fullpermission", value: 152 },

  // PPIC
  { label: "Production Planning and Inventory Control-Differential Pressure Record-Fullpermission", value: 153 },
  { label: "Production Planning and Inventory Control-Temperature & Relative Humidity Record-Fullpermission", value: 154 },
  { label: "Production Planning and Inventory Control-Equipment Usage Record-Fullpermission", value: 155 },
  { label: "Production Planning and Inventory Control-Area Cleaning Record-Fullpermission", value: 156 },

  // Regulatory Affairs
  { label: "Regulatory Affairs-Differential Pressure Record-Fullpermission", value: 157 },
  { label: "Regulatory Affairs-Temperature & Relative Humidity Record-Fullpermission", value: 158 },
  { label: "Regulatory Affairs-Equipment Usage Record-Fullpermission", value: 159 },
  { label: "Regulatory Affairs-Area Cleaning Record-Fullpermission", value: 160 },
];


    const processInitiatorRoles = async (rolesArray, initiatorUser) => {
    try {
      await sequelize.transaction(async (transaction) => {
        for (const role of rolesArray) {
          // Split label into components
          const [departmentLabel, processLabel, roleName] = role.label.split("-");

          // Fetch department, process, and role details
          const department = await Department.findOne({
            where: { departmentName: departmentLabel },
            transaction,
          });
          const process = await Process.findOne({
            where: { process: processLabel },
            transaction,
          });
          const roleEntity = await Role.findOne({
            where: { role: roleName },
            transaction,
          });

          if (!department || !process || !roleEntity) {
            throw new Error(`Invalid role configuration: ${role.label}`);
          }

          // Create UserRole
          await UserRole.create(
            {
              user_id: initiatorUser.user_id,
              department_id: department.department_id,
              process_id: process.process_id,
              role_id: roleEntity.role_id,
              roleGroup_id: role.value, // Assuming value corresponds to roleGroup_id
            },
            { transaction }
          );
        }
      });
    } catch (error) {
      console.error("Error processing roles:", error.message);
      throw error;
    }
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

      if (!initiatorUser) {
        throw new Error("Initiator user not found");
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