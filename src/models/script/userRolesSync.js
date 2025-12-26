const { sequelize } = require("../../config/db");
const { DataTypes } = require("sequelize");
const Role = require("../../models/roles");
const Department = require("../../models/departments");
const User = require("../../models/users");
const Process = require("../../models/processes");
const RoleGroup = require("../../models/userRoles");
const UserRole = require("../../models/userRoles");

  const rolesArray1 = [
    { label: "Quality Assurance-Differential Pressure Record-Initiator", value: 1 },
    { label: "Quality Assurance-Temperature Records-Initiator", value: 2 },
    { label: "Quality Control-Differential Pressure Record-Initiator", value: 3 },
    { label: "Quality Control-Temperature Records-Initiator", value: 4 },
    { label: "Production-Differential Pressure Record-Initiator", value: 5 },
    { label: "Production-Temperature Records-Initiator", value: 6 },
    { label: "Warehouse-Differential Pressure Record-Initiator", value: 7 },
    { label: "Warehouse-Temperature Records-Initiator", value: 8 },
    { label: "Engineering-Differential Pressure Record-Initiator", value: 9 },
    { label: "Engineering-Temperature Records-Initiator", value: 10 },
    { label: "Human Resources-Differential Pressure Record-Initiator", value: 11 },
    { label: "Human Resources-Temperature Records-Initiator", value: 12 },
    { label: "Information Technology-Differential Pressure Record-Initiator", value: 13 },
    { label: "Information Technology-Temperature Records-Initiator", value: 14 },
    { label: "Accounts-Differential Pressure Record-Initiator", value: 5 },
    { label: "Accounts-Temperature Records-Initiator", value: 16 },
    { label: "Production Planning and Inventory Control-Differential Pressure Record-Initiator", value: 17 },
    { label: "Production Planning and Inventory Control-Temperature Records-Initiator", value: 18 },
    { label: "Regulatory Affairs-Differential Pressure Record-Initiator", value: 19 },
    { label: "Regulatory Affairs-Temperature Records-Initiator", value: 20 },
  ];

  const rolesArray2 = [
    { label: "Quality Assurance-Differential Pressure Record-Reviewer", value: 21 },
    { label: "Quality Assurance-Temperature Records-Reviewer", value: 22 },
    { label: "Quality Control-Differential Pressure Record-Reviewer", value: 23 },
    { label: "Quality Control-Temperature Records-Reviewer", value: 24 },
    { label: "Production-Differential Pressure Record-Reviewer", value: 25 },
    { label: "Production-Temperature Records-Reviewer", value: 26 },
    { label: "Warehouse-Differential Pressure Record-Reviewer", value: 27 },
    { label: "Warehouse-Temperature Records-Reviewer", value: 28 },
    { label: "Engineering-Differential Pressure Record-Reviewer", value: 29 },
    { label: "Engineering-Temperature Records-Reviewer", value: 30 },
    { label: "Human Resources-Differential Pressure Record-Reviewer", value: 31 },
    { label: "Human Resources-Temperature Records-Reviewer", value: 32 },
    { label: "Information Technology-Differential Pressure Record-Reviewer", value: 33 },
    { label: "Information Technology-Temperature Records-Reviewer", value: 34 },
    { label: "Accounts-Differential Pressure Record-Reviewer", value: 35 },
    { label: "Accounts-Temperature Records-Reviewer", value: 36 },
    { label: "Production Planning and Inventory Control-Differential Pressure Record-Reviewer", value: 37 },
    { label: "Production Planning and Inventory Control-Temperature Records-Reviewer", value: 38 },
    { label: "Regulatory Affairs-Differential Pressure Record-Reviewer", value: 39 },
    { label: "Regulatory Affairs-Temperature Records-Reviewer", value: 40 },
  ];
  const rolesArray3 = [
    { label: "Quality Assurance-Differential Pressure Record-Approver", value: 41 },
    { label: "Quality Assurance-Temperature Records-Approver", value: 42 },
    { label: "Quality Control-Differential Pressure Record-Approver", value: 43 },
    { label: "Quality Control-Temperature Records-Approver", value: 44 },
    { label: "Production-Differential Pressure Record-Approver", value: 45 },
    { label: "Production-Temperature Records-Approver", value: 46 },
    { label: "Warehouse-Differential Pressure Record-Approver", value: 47 },
    { label: "Warehouse-Temperature Records-Approver", value: 48 },
    { label: "Engineering-Differential Pressure Record-Approver", value: 49 },
    { label: "Engineering-Temperature Records-Approver", value: 50 },
    { label: "Human Resources-Differential Pressure Record-Approver", value: 51 },
    { label: "Human Resources-Temperature Records-Approver", value: 52 },
    { label: "Information Technology-Differential Pressure Record-Approver", value: 53 },
    { label: "Information Technology-Temperature Records-Approver", value: 54 },
    { label: "Accounts-Differential Pressure Record-Approver", value: 55 },
    { label: "Accounts-Temperature Records-Approver", value: 56 },
    { label: "Production Planning and Inventory Control-Differential Pressure Record-Approver", value: 57 },
    { label: "Production Planning and Inventory Control-Temperature Records-Approver", value: 58 },
    { label: "Regulatory Affairs-Differential Pressure Record-Approver", value: 59 }, 
    { label: "Regulatory Affairs-Temperature Records-Approver", value: 60 },
       
  ];
  const rolesArray4 = [
    { label: "Quality Assurance-Differential Pressure Record-Fullpermission", value: 61 },
    { label: "Quality Assurance-Temperature Records-Fullpermission", value: 62 },
    { label: "Quality Control-Differential Pressure Record-Fullpermission", value: 63 },
    { label: "Quality Control-Temperature Records-Fullpermission", value: 64 },
    { label: "Production-Differential Pressure Record-Fullpermission", value: 65 },
    { label: "Production-Temperature Records-Fullpermission", value: 66 },
    { label: "Warehouse-Differential Pressure Record-Fullpermission", value: 67 },
    { label: "Warehouse-Temperature Records-Fullpermission", value: 68 },
    { label: "Engineering-Differential Pressure Record-Fullpermission", value: 69 },
    { label: "Engineering-Temperature Records-Fullpermission", value: 70 },
    { label: "Human Resources-Differential Pressure Record-Fullpermission", value: 71 },
    { label: "Human Resources-Temperature Records-Fullpermission", value: 72 },
    { label: "Information Technology-Differential Pressure Record-Fullpermission", value: 73 },
    { label: "Information Technology-Temperature Records-Fullpermission", value: 74 },
    { label: "Accounts-Differential Pressure Record-Fullpermission", value: 75 },
    { label: "Accounts-Temperature Records-Fullpermission", value: 76 },
    { label: "Production Planning and Inventory Control-Differential Pressure Record-Fullpermission", value: 77 },
    { label: "Production Planning and Inventory Control-Temperature Records-Fullpermission", value: 78 },
    { label: "Regulatory Affairs-Differential Pressure Record-Fullpermission", value: 79 },  
    { label: "Regulatory Affairs-Temperature Records-Fullpermission", value: 80 },
      
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