const { sequelize } = require("../../config/db");
const { DataTypes } = require("sequelize");
const Role = require("../../models/roles");
const Department = require("../../models/departments");
const User = require("../../models/users");
const Process = require("../../models/processes");
const RoleGroup = require("../../models/userRoles");
const UserRole = require("../../models/userRoles");

const rolesArray1 = [
  { label: "Quality Assurance-Differential Pressure-Initiator", value: 1 },
  { label: "Quality Assurance-Temperature Record-Initiator", value: 2 },
  { label: "Quality Assurance-Equipment Usage-Initiator", value: 3 },

  { label: "Quality Control-Differential Pressure-Initiator", value: 4 },
  { label: "Quality Control-Temperature Record-Initiator", value: 5 },
  { label: "Quality Control-Equipment Usage-Initiator", value: 6 },

  { label: "Production-Differential Pressure-Initiator", value: 7 },
  { label: "Production-Temperature Record-Initiator", value: 8 },
  { label: "Production-Equipment Usage-Initiator", value: 9 },

  { label: "Warehouse-Differential Pressure-Initiator", value: 10 },
  { label: "Warehouse-Temperature Record-Initiator", value: 11 },
  { label: "Warehouse-Equipment Usage-Initiator", value: 12 },

  { label: "Engineering-Differential Pressure-Initiator", value: 13 },
  { label: "Engineering-Temperature Record-Initiator", value: 14 },
  { label: "Engineering-Equipment Usage-Initiator", value: 15 },

  { label: "Human Resources-Differential Pressure-Initiator", value: 16 },
  { label: "Human Resources-Temperature Record-Initiator", value: 17 },
  { label: "Human Resources-Equipment Usage-Initiator", value: 18 },

  { label: "Information Technology-Differential Pressure-Initiator", value: 19 },
  { label: "Information Technology-Temperature Record-Initiator", value: 20 },
  { label: "Information Technology-Equipment Usage-Initiator", value: 21 },

  { label: "Accounts-Differential Pressure-Initiator", value: 22 },
  { label: "Accounts-Temperature Record-Initiator", value: 23 },
  { label: "Accounts-Equipment Usage-Initiator", value: 24 },

  { label: "Production Planning and Inventory Control-Differential Pressure-Initiator", value: 25 },
  { label: "Production Planning and Inventory Control-Temperature Record-Initiator", value: 26 },
  { label: "Production Planning and Inventory Control-Equipment Usage-Initiator", value: 27 },

  { label: "Regulatory Affairs-Differential Pressure-Initiator", value: 28 },
  { label: "Regulatory Affairs-Temperature Record-Initiator", value: 29 },
  { label: "Regulatory Affairs-Equipment Usage-Initiator", value: 30 },
];

const rolesArray2 = [
  { label: "Quality Assurance-Differential Pressure-Reviewer", value: 31 },
  { label: "Quality Assurance-Temperature Record-Reviewer", value: 32 },
  { label: "Quality Assurance-Equipment Usage-Reviewer", value: 33 },

  { label: "Quality Control-Differential Pressure-Reviewer", value: 34 },
  { label: "Quality Control-Temperature Record-Reviewer", value: 35 },
  { label: "Quality Control-Equipment Usage-Reviewer", value: 36 },

  { label: "Production-Differential Pressure-Reviewer", value: 37 },
  { label: "Production-Temperature Record-Reviewer", value: 38 },
  { label: "Production-Equipment Usage-Reviewer", value: 39 },

  { label: "Warehouse-Differential Pressure-Reviewer", value: 40 },
  { label: "Warehouse-Temperature Record-Reviewer", value: 41 },
  { label: "Warehouse-Equipment Usage-Reviewer", value: 42 },

  { label: "Engineering-Differential Pressure-Reviewer", value: 43 },
  { label: "Engineering-Temperature Record-Reviewer", value: 44 },
  { label: "Engineering-Equipment Usage-Reviewer", value: 45 },

  { label: "Human Resources-Differential Pressure-Reviewer", value: 46 },
  { label: "Human Resources-Temperature Record-Reviewer", value: 47 },
  { label: "Human Resources-Equipment Usage-Reviewer", value: 48 },

  { label: "Information Technology-Differential Pressure-Reviewer", value: 49 },
  { label: "Information Technology-Temperature Record-Reviewer", value: 50 },
  { label: "Information Technology-Equipment Usage-Reviewer", value: 51 },

  { label: "Accounts-Differential Pressure-Reviewer", value: 52 },
  { label: "Accounts-Temperature Record-Reviewer", value: 53 },
  { label: "Accounts-Equipment Usage-Reviewer", value: 54 },

  { label: "Production Planning and Inventory Control-Differential Pressure-Reviewer", value: 55 },
  { label: "Production Planning and Inventory Control-Temperature Record-Reviewer", value: 56 },
  { label: "Production Planning and Inventory Control-Equipment Usage-Reviewer", value: 57 },

  { label: "Regulatory Affairs-Differential Pressure-Reviewer", value: 58 },
  { label: "Regulatory Affairs-Temperature Record-Reviewer", value: 59 },
  { label: "Regulatory Affairs-Equipment Usage-Reviewer", value: 60 },
];

const rolesArray3 = [
  { label: "Quality Assurance-Differential Pressure-Approver", value: 61 },
  { label: "Quality Assurance-Temperature Record-Approver", value: 62 },
  { label: "Quality Assurance-Equipment Usage-Approver", value: 63 },

  { label: "Quality Control-Differential Pressure-Approver", value: 64 },
  { label: "Quality Control-Temperature Record-Approver", value: 65 },
  { label: "Quality Control-Equipment Usage-Approver", value: 66 },

  { label: "Production-Differential Pressure-Approver", value: 67 },
  { label: "Production-Temperature Record-Approver", value: 68 },
  { label: "Production-Equipment Usage-Approver", value: 69 },

  { label: "Warehouse-Differential Pressure-Approver", value: 70 },
  { label: "Warehouse-Temperature Record-Approver", value: 71 },
  { label: "Warehouse-Equipment Usage-Approver", value: 72 },

  { label: "Engineering-Differential Pressure-Approver", value: 73 },
  { label: "Engineering-Temperature Record-Approver", value: 74 },
  { label: "Engineering-Equipment Usage-Approver", value: 75 },

  { label: "Human Resources-Differential Pressure-Approver", value: 76 },
  { label: "Human Resources-Temperature Record-Approver", value: 77 },
  { label: "Human Resources-Equipment Usage-Approver", value: 78 },

  { label: "Information Technology-Differential Pressure-Approver", value: 79 },
  { label: "Information Technology-Temperature Record-Approver", value: 80 },
  { label: "Information Technology-Equipment Usage-Approver", value: 81 },

  { label: "Accounts-Differential Pressure-Approver", value: 82 },
  { label: "Accounts-Temperature Record-Approver", value: 83 },
  { label: "Accounts-Equipment Usage-Approver", value: 84 },

  { label: "Production Planning and Inventory Control-Differential Pressure-Approver", value: 85 },
  { label: "Production Planning and Inventory Control-Temperature Record-Approver", value: 86 },
  { label: "Production Planning and Inventory Control-Equipment Usage-Approver", value: 87 },

  { label: "Regulatory Affairs-Differential Pressure-Approver", value: 88 },
  { label: "Regulatory Affairs-Temperature Record-Approver", value: 89 },
  { label: "Regulatory Affairs-Equipment Usage-Approver", value: 90 },
];

const rolesArray4 = [
  { label: "Quality Assurance-Differential Pressure-Fullpermission", value: 91 },
  { label: "Quality Assurance-Temperature Record-Fullpermission", value: 92 },
  { label: "Quality Assurance-Equipment Usage-Fullpermission", value: 93 },

  { label: "Quality Control-Differential Pressure-Fullpermission", value: 94 },
  { label: "Quality Control-Temperature Record-Fullpermission", value: 95 },
  { label: "Quality Control-Equipment Usage-Fullpermission", value: 96 },

  { label: "Production-Differential Pressure-Fullpermission", value: 97 },
  { label: "Production-Temperature Record-Fullpermission", value: 98 },
  { label: "Production-Equipment Usage-Fullpermission", value: 99 },

  { label: "Warehouse-Differential Pressure-Fullpermission", value: 100 },
  { label: "Warehouse-Temperature Record-Fullpermission", value: 101 },
  { label: "Warehouse-Equipment Usage-Fullpermission", value: 102 },

  { label: "Engineering-Differential Pressure-Fullpermission", value: 103 },
  { label: "Engineering-Temperature Record-Fullpermission", value: 104 },
  { label: "Engineering-Equipment Usage-Fullpermission", value: 105 },

  { label: "Human Resources-Differential Pressure-Fullpermission", value: 106 },
  { label: "Human Resources-Temperature Record-Fullpermission", value: 107 },
  { label: "Human Resources-Equipment Usage-Fullpermission", value: 108 },

  { label: "Information Technology-Differential Pressure-Fullpermission", value: 109 },
  { label: "Information Technology-Temperature Record-Fullpermission", value: 110 },
  { label: "Information Technology-Equipment Usage-Fullpermission", value: 111 },

  { label: "Accounts-Differential Pressure-Fullpermission", value: 112 },
  { label: "Accounts-Temperature Record-Fullpermission", value: 113 },
  { label: "Accounts-Equipment Usage-Fullpermission", value: 114 },

  { label: "Production Planning and Inventory Control-Differential Pressure-Fullpermission", value: 115 },
  { label: "Production Planning and Inventory Control-Temperature Record-Fullpermission", value: 116 },
  { label: "Production Planning and Inventory Control-Equipment Usage-Fullpermission", value: 117 },

  { label: "Regulatory Affairs-Differential Pressure-Fullpermission", value: 118 },
  { label: "Regulatory Affairs-Temperature Record-Fullpermission", value: 119 },
  { label: "Regulatory Affairs-Equipment Usage-Fullpermission", value: 120 },
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