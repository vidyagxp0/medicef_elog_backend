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
  { label: "Quality Assurance-DP Monitoring across Filters-Initiator", value: 5 },
  { label: "Quality Assurance-Operation of Air Handling Unit-Initiator", value: 6 },

  // Quality Control
  { label: "Quality Control-Differential Pressure Record-Initiator", value: 7 },
  { label: "Quality Control-Temperature & Relative Humidity Record-Initiator", value: 8 },
  { label: "Quality Control-Equipment Usage Record-Initiator", value: 9 },
  { label: "Quality Control-Area Cleaning Record-Initiator", value: 10 },
  { label: "Quality Control-DP Monitoring across Filters-Initiator", value: 11 },
  { label: "Quality Control-Operation of Air Handling Unit-Initiator", value: 12 },

  // Production
  { label: "Production-Differential Pressure Record-Initiator", value: 13 },
  { label: "Production-Temperature & Relative Humidity Record-Initiator", value: 14 },
  { label: "Production-Equipment Usage Record-Initiator", value: 15 },
  { label: "Production-Area Cleaning Record-Initiator", value: 16 },
  { label: "Production-DP Monitoring across Filters-Initiator", value: 17 },
  { label: "Production-Operation of Air Handling Unit-Initiator", value: 18 },

  // Warehouse
  { label: "Warehouse-Differential Pressure Record-Initiator", value: 19 },
  { label: "Warehouse-Temperature & Relative Humidity Record-Initiator", value: 20 },
  { label: "Warehouse-Equipment Usage Record-Initiator", value: 21 },
  { label: "Warehouse-Area Cleaning Record-Initiator", value: 22 },
  { label: "Warehouse-DP Monitoring across Filters-Initiator", value: 23 },
  { label: "Warehouse-Operation of Air Handling Unit-Initiator", value: 24 },

  // Engineering
  { label: "Engineering-Differential Pressure Record-Initiator", value: 25 },
  { label: "Engineering-Temperature & Relative Humidity Record-Initiator", value: 26 },
  { label: "Engineering-Equipment Usage Record-Initiator", value: 27 },
  { label: "Engineering-Area Cleaning Record-Initiator", value: 28 },
  { label: "Engineering-DP Monitoring across Filters-Initiator", value: 29 },
  { label: "Engineering-Operation of Air Handling Unit-Initiator", value: 30 },

  // Human Resources
  { label: "Human Resources-Differential Pressure Record-Initiator", value: 31 },
  { label: "Human Resources-Temperature & Relative Humidity Record-Initiator", value: 32 },
  { label: "Human Resources-Equipment Usage Record-Initiator", value: 33 },
  { label: "Human Resources-Area Cleaning Record-Initiator", value: 34 },
  { label: "Human Resources-DP Monitoring across Filters-Initiator", value: 35 },
  { label: "Human Resources-Operation of Air Handling Unit-Initiator", value: 36 },

  // Information Technology
  { label: "Information Technology-Differential Pressure Record-Initiator", value: 37 },
  { label: "Information Technology-Temperature & Relative Humidity Record-Initiator", value: 38 },
  { label: "Information Technology-Equipment Usage Record-Initiator", value: 39 },
  { label: "Information Technology-Area Cleaning Record-Initiator", value: 40 },
  { label: "Information Technology-DP Monitoring across Filters-Initiator", value: 41 },
  { label: "Information Technology-Operation of Air Handling Unit-Initiator", value: 42 },

  // Accounts
  { label: "Accounts-Differential Pressure Record-Initiator", value: 43 },
  { label: "Accounts-Temperature & Relative Humidity Record-Initiator", value: 44 },
  { label: "Accounts-Equipment Usage Record-Initiator", value: 45 },
  { label: "Accounts-Area Cleaning Record-Initiator", value: 46 },
  { label: "Accounts-DP Monitoring across Filters-Initiator", value: 47 },
  { label: "Accounts-Operation of Air Handling Unit-Initiator", value: 48 },

  // PPIC
  { label: "Production Planning and Inventory Control-Differential Pressure Record-Initiator", value: 49 },
  { label: "Production Planning and Inventory Control-Temperature & Relative Humidity Record-Initiator", value: 50 },
  { label: "Production Planning and Inventory Control-Equipment Usage Record-Initiator", value: 51 },
  { label: "Production Planning and Inventory Control-Area Cleaning Record-Initiator", value: 52 },
  { label: "Production Planning and Inventory Control-DP Monitoring across Filters-Initiator", value: 53 },
  { label: "Production Planning and Inventory Control-Operation of Air Handling Unit-Initiator", value: 54 },

  // Regulatory Affairs
  { label: "Regulatory Affairs-Differential Pressure Record-Initiator", value: 55 },
  { label: "Regulatory Affairs-Temperature & Relative Humidity Record-Initiator", value: 56 },
  { label: "Regulatory Affairs-Equipment Usage Record-Initiator", value: 57 },
  { label: "Regulatory Affairs-Area Cleaning Record-Initiator", value: 58 },
  { label: "Regulatory Affairs-DP Monitoring across Filters-Initiator", value: 59 },
  { label: "Regulatory Affairs-Operation of Air Handling Unit-Initiator", value: 60 },
];

const rolesArray2 = [
  // Quality Assurance
  { label: "Quality Assurance-Differential Pressure Record-Reviewer", value: 61 },
  { label: "Quality Assurance-Temperature & Relative Humidity Record-Reviewer", value: 62 },
  { label: "Quality Assurance-Equipment Usage Record-Reviewer", value: 63 },
  { label: "Quality Assurance-Area Cleaning Record-Reviewer", value: 64 },
  { label: "Quality Assurance-DP Monitoring across Filters-Reviewer", value: 65 },
  { label: "Quality Assurance-Operation of Air Handling Unit-Reviewer", value: 66 },

  // Quality Control
  { label: "Quality Control-Differential Pressure Record-Reviewer", value: 67 },
  { label: "Quality Control-Temperature & Relative Humidity Record-Reviewer", value: 68 },
  { label: "Quality Control-Equipment Usage Record-Reviewer", value: 69 },
  { label: "Quality Control-Area Cleaning Record-Reviewer", value: 70 },
  { label: "Quality Control-DP Monitoring across Filters-Reviewer", value: 71 },
  { label: "Quality Control-Operation of Air Handling Unit-Reviewer", value: 72 },

  // Production
  { label: "Production-Differential Pressure Record-Reviewer", value: 73 },
  { label: "Production-Temperature & Relative Humidity Record-Reviewer", value: 74 },
  { label: "Production-Equipment Usage Record-Reviewer", value: 75 },
  { label: "Production-Area Cleaning Record-Reviewer", value: 76 },
  { label: "Production-DP Monitoring across Filters-Reviewer", value: 77 },
  { label: "Production-Operation of Air Handling Unit-Reviewer", value: 78 },

  // Warehouse
  { label: "Warehouse-Differential Pressure Record-Reviewer", value: 79 },
  { label: "Warehouse-Temperature & Relative Humidity Record-Reviewer", value: 80 },
  { label: "Warehouse-Equipment Usage Record-Reviewer", value: 81 },
  { label: "Warehouse-Area Cleaning Record-Reviewer", value: 82 },
  { label: "Warehouse-DP Monitoring across Filters-Reviewer", value: 83 },
  { label: "Warehouse-Operation of Air Handling Unit-Reviewer", value: 84 },

  // Engineering
  { label: "Engineering-Differential Pressure Record-Reviewer", value: 85 },
  { label: "Engineering-Temperature & Relative Humidity Record-Reviewer", value: 86 },
  { label: "Engineering-Equipment Usage Record-Reviewer", value: 87 },
  { label: "Engineering-Area Cleaning Record-Reviewer", value: 88 },
  { label: "Engineering-DP Monitoring across Filters-Reviewer", value: 89 },
  { label: "Engineering-Operation of Air Handling Unit-Reviewer", value: 90 },

  // Human Resources
  { label: "Human Resources-Differential Pressure Record-Reviewer", value: 91 },
  { label: "Human Resources-Temperature & Relative Humidity Record-Reviewer", value: 92 },
  { label: "Human Resources-Equipment Usage Record-Reviewer", value: 93 },
  { label: "Human Resources-Area Cleaning Record-Reviewer", value: 94 },
  { label: "Human Resources-DP Monitoring across Filters-Reviewer", value: 95 },
  { label: "Human Resources-Operation of Air Handling Unit-Reviewer", value: 96 },

  // Information Technology
  { label: "Information Technology-Differential Pressure Record-Reviewer", value: 97 },
  { label: "Information Technology-Temperature & Relative Humidity Record-Reviewer", value: 98 },
  { label: "Information Technology-Equipment Usage Record-Reviewer", value: 99 },
  { label: "Information Technology-Area Cleaning Record-Reviewer", value: 100 },
  { label: "Information Technology-DP Monitoring across Filters-Reviewer", value: 101 },
  { label: "Information Technology-Operation of Air Handling Unit-Reviewer", value: 102 },

  // Accounts
  { label: "Accounts-Differential Pressure Record-Reviewer", value: 103 },
  { label: "Accounts-Temperature & Relative Humidity Record-Reviewer", value: 104 },
  { label: "Accounts-Equipment Usage Record-Reviewer", value: 105 },
  { label: "Accounts-Area Cleaning Record-Reviewer", value: 106 },
  { label: "Accounts-DP Monitoring across Filters-Reviewer", value: 107 },
  { label: "Accounts-Operation of Air Handling Unit-Reviewer", value: 108 },

  // PPIC
  { label: "Production Planning and Inventory Control-Differential Pressure Record-Reviewer", value: 109 },
  { label: "Production Planning and Inventory Control-Temperature & Relative Humidity Record-Reviewer", value: 110 },
  { label: "Production Planning and Inventory Control-Equipment Usage Record-Reviewer", value: 111 },
  { label: "Production Planning and Inventory Control-Area Cleaning Record-Reviewer", value: 112 },
  { label: "Production Planning and Inventory Control-DP Monitoring across Filters-Reviewer", value: 113 },
  { label: "Production Planning and Inventory Control-Operation of Air Handling Unit-Reviewer", value: 114 },

  // Regulatory Affairs
  { label: "Regulatory Affairs-Differential Pressure Record-Reviewer", value: 115 },
  { label: "Regulatory Affairs-Temperature & Relative Humidity Record-Reviewer", value: 116 },
  { label: "Regulatory Affairs-Equipment Usage Record-Reviewer", value: 117 },
  { label: "Regulatory Affairs-Area Cleaning Record-Reviewer", value: 118 },
  { label: "Regulatory Affairs-DP Monitoring across Filters-Reviewer", value: 119 },
  { label: "Regulatory Affairs-Operation of Air Handling Unit-Reviewer", value: 120 },
];

const rolesArray3 = [
  // Quality Assurance
  { label: "Quality Assurance-Differential Pressure Record-Approver", value: 121 },
  { label: "Quality Assurance-Temperature & Relative Humidity Record-Approver", value: 122 },
  { label: "Quality Assurance-Equipment Usage Record-Approver", value: 123 },
  { label: "Quality Assurance-Area Cleaning Record-Approver", value: 124 },
  { label: "Quality Assurance-DP Monitoring across Filters-Approver", value: 125 },
  { label: "Quality Assurance-Operation of Air Handling Unit-Approver", value: 126 },

  // Quality Control
  { label: "Quality Control-Differential Pressure Record-Approver", value: 127 },
  { label: "Quality Control-Temperature & Relative Humidity Record-Approver", value: 128 },
  { label: "Quality Control-Equipment Usage Record-Approver", value: 129 },
  { label: "Quality Control-Area Cleaning Record-Approver", value: 130 },
  { label: "Quality Control-DP Monitoring across Filters-Approver", value: 131 },
  { label: "Quality Control-Operation of Air Handling Unit-Approver", value: 132 },

  // Production
  { label: "Production-Differential Pressure Record-Approver", value: 133 },
  { label: "Production-Temperature & Relative Humidity Record-Approver", value: 134 },
  { label: "Production-Equipment Usage Record-Approver", value: 135 },
  { label: "Production-Area Cleaning Record-Approver", value: 136 },
  { label: "Production-DP Monitoring across Filters-Approver", value: 137 },
  { label: "Production-Operation of Air Handling Unit-Approver", value: 138 },

  // Warehouse
  { label: "Warehouse-Differential Pressure Record-Approver", value: 139 },
  { label: "Warehouse-Temperature & Relative Humidity Record-Approver", value: 140 },
  { label: "Warehouse-Equipment Usage Record-Approver", value: 141 },
  { label: "Warehouse-Area Cleaning Record-Approver", value: 142 },
  { label: "Warehouse-DP Monitoring across Filters-Approver", value: 143 },
  { label: "Warehouse-Operation of Air Handling Unit-Approver", value: 144 },

  // Engineering
  { label: "Engineering-Differential Pressure Record-Approver", value: 145 },
  { label: "Engineering-Temperature & Relative Humidity Record-Approver", value: 146 },
  { label: "Engineering-Equipment Usage Record-Approver", value: 147 },
  { label: "Engineering-Area Cleaning Record-Approver", value: 148 },
  { label: "Engineering-DP Monitoring across Filters-Approver", value: 149 },
  { label: "Engineering-Operation of Air Handling Unit-Approver", value: 150 },

  // Human Resources
  { label: "Human Resources-Differential Pressure Record-Approver", value: 151 },
  { label: "Human Resources-Temperature & Relative Humidity Record-Approver", value: 152 },
  { label: "Human Resources-Equipment Usage Record-Approver", value: 153 },
  { label: "Human Resources-Area Cleaning Record-Approver", value: 154 },
  { label: "Human Resources-DP Monitoring across Filters-Approver", value: 155 },
  { label: "Human Resources-Operation of Air Handling Unit-Approver", value: 156 },

  // Information Technology
  { label: "Information Technology-Differential Pressure Record-Approver", value: 157 },
  { label: "Information Technology-Temperature & Relative Humidity Record-Approver", value: 158 },
  { label: "Information Technology-Equipment Usage Record-Approver", value: 159 },
  { label: "Information Technology-Area Cleaning Record-Approver", value: 160 },
  { label: "Information Technology-DP Monitoring across Filters-Approver", value: 161 },
  { label: "Information Technology-Operation of Air Handling Unit-Approver", value: 162 },

  // Accounts
  { label: "Accounts-Differential Pressure Record-Approver", value: 163 },
  { label: "Accounts-Temperature & Relative Humidity Record-Approver", value: 164 },
  { label: "Accounts-Equipment Usage Record-Approver", value: 165 },
  { label: "Accounts-Area Cleaning Record-Approver", value: 166 },
  { label: "Accounts-DP Monitoring across Filters-Approver", value: 167 },
  { label: "Accounts-Operation of Air Handling Unit-Approver", value: 168 },

  // PPIC
  { label: "Production Planning and Inventory Control-Differential Pressure Record-Approver", value: 169 },
  { label: "Production Planning and Inventory Control-Temperature & Relative Humidity Record-Approver", value: 170 },
  { label: "Production Planning and Inventory Control-Equipment Usage Record-Approver", value: 171 },
  { label: "Production Planning and Inventory Control-Area Cleaning Record-Approver", value: 172 },
  { label: "Production Planning and Inventory Control-DP Monitoring across Filters-Approver", value: 173 },
  { label: "Production Planning and Inventory Control-Operation of Air Handling Unit-Approver", value: 174 },

  // Regulatory Affairs
  { label: "Regulatory Affairs-Differential Pressure Record-Approver", value: 175 },
  { label: "Regulatory Affairs-Temperature & Relative Humidity Record-Approver", value: 176 },
  { label: "Regulatory Affairs-Equipment Usage Record-Approver", value: 177 },
  { label: "Regulatory Affairs-Area Cleaning Record-Approver", value: 178 },
  { label: "Regulatory Affairs-DP Monitoring across Filters-Approver", value: 179 },
  { label: "Regulatory Affairs-Operation of Air Handling Unit-Approver", value: 180 },
];

const rolesArray4 = [
  // Quality Assurance
  { label: "Quality Assurance-Differential Pressure Record-Fullpermission", value: 181 },
  { label: "Quality Assurance-Temperature & Relative Humidity Record-Fullpermission", value: 182 },
  { label: "Quality Assurance-Equipment Usage Record-Fullpermission", value: 183 },
  { label: "Quality Assurance-Area Cleaning Record-Fullpermission", value: 184 },
  { label: "Quality Assurance-DP Monitoring across Filters-Fullpermission", value: 185 },
  { label: "Quality Assurance-Operation of Air Handling Unit-Fullpermission", value: 186 },

  // Quality Control
  { label: "Quality Control-Differential Pressure Record-Fullpermission", value: 187 },
  { label: "Quality Control-Temperature & Relative Humidity Record-Fullpermission", value: 188 },
  { label: "Quality Control-Equipment Usage Record-Fullpermission", value: 189 },
  { label: "Quality Control-Area Cleaning Record-Fullpermission", value: 190 },
  { label: "Quality Control-DP Monitoring across Filters-Fullpermission", value: 191 },
  { label: "Quality Control-Operation of Air Handling Unit-Fullpermission", value: 192 },

  // Production
  { label: "Production-Differential Pressure Record-Fullpermission", value: 193 },
  { label: "Production-Temperature & Relative Humidity Record-Fullpermission", value: 194 },
  { label: "Production-Equipment Usage Record-Fullpermission", value: 195 },
  { label: "Production-Area Cleaning Record-Fullpermission", value: 196 },
  { label: "Production-DP Monitoring across Filters-Fullpermission", value: 197 },
  { label: "Production-Operation of Air Handling Unit-Fullpermission", value: 198 },

  // Warehouse
  { label: "Warehouse-Differential Pressure Record-Fullpermission", value: 199 },
  { label: "Warehouse-Temperature & Relative Humidity Record-Fullpermission", value: 200 },
  { label: "Warehouse-Equipment Usage Record-Fullpermission", value: 201 },
  { label: "Warehouse-Area Cleaning Record-Fullpermission", value: 202 },
  { label: "Warehouse-DP Monitoring across Filters-Fullpermission", value: 203 },
  { label: "Warehouse-Operation of Air Handling Unit-Fullpermission", value: 204 },

  // Engineering
  { label: "Engineering-Differential Pressure Record-Fullpermission", value: 205 },
  { label: "Engineering-Temperature & Relative Humidity Record-Fullpermission", value: 206 },
  { label: "Engineering-Equipment Usage Record-Fullpermission", value: 207 },
  { label: "Engineering-Area Cleaning Record-Fullpermission", value: 208 },
  { label: "Engineering-DP Monitoring across Filters-Fullpermission", value: 209 },
  { label: "Engineering-Operation of Air Handling Unit-Fullpermission", value: 210 },

  // Human Resources
  { label: "Human Resources-Differential Pressure Record-Fullpermission", value: 211 },
  { label: "Human Resources-Temperature & Relative Humidity Record-Fullpermission", value: 212 },
  { label: "Human Resources-Equipment Usage Record-Fullpermission", value: 213 },
  { label: "Human Resources-Area Cleaning Record-Fullpermission", value: 214 },
  { label: "Human Resources-DP Monitoring across Filters-Fullpermission", value: 215 },
  { label: "Human Resources-Operation of Air Handling Unit-Fullpermission", value: 216 },

  // Information Technology
  { label: "Information Technology-Differential Pressure Record-Fullpermission", value: 217 },
  { label: "Information Technology-Temperature & Relative Humidity Record-Fullpermission", value: 218 },
  { label: "Information Technology-Equipment Usage Record-Fullpermission", value: 219 },
  { label: "Information Technology-Area Cleaning Record-Fullpermission", value: 220 },
  { label: "Information Technology-DP Monitoring across Filters-Fullpermission", value: 221 },
  { label: "Information Technology-Operation of Air Handling Unit-Fullpermission", value: 222 },

  // Accounts
  { label: "Accounts-Differential Pressure Record-Fullpermission", value: 223 },
  { label: "Accounts-Temperature & Relative Humidity Record-Fullpermission", value: 224 },
  { label: "Accounts-Equipment Usage Record-Fullpermission", value: 225 },
  { label: "Accounts-Area Cleaning Record-Fullpermission", value: 226 },
  { label: "Accounts-DP Monitoring across Filters-Fullpermission", value: 227 },
  { label: "Accounts-Operation of Air Handling Unit-Fullpermission", value: 228 },

  // PPIC
  { label: "Production Planning and Inventory Control-Differential Pressure Record-Fullpermission", value: 229 },
  { label: "Production Planning and Inventory Control-Temperature & Relative Humidity Record-Fullpermission", value: 230 },
  { label: "Production Planning and Inventory Control-Equipment Usage Record-Fullpermission", value: 231 },
  { label: "Production Planning and Inventory Control-Area Cleaning Record-Fullpermission", value: 232 },
  { label: "Production Planning and Inventory Control-DP Monitoring across Filters-Fullpermission", value: 233 },
  { label: "Production Planning and Inventory Control-Operation of Air Handling Unit-Fullpermission", value: 234 },

  // Regulatory Affairs
  { label: "Regulatory Affairs-Differential Pressure Record-Fullpermission", value: 235 },
  { label: "Regulatory Affairs-Temperature & Relative Humidity Record-Fullpermission", value: 236 },
  { label: "Regulatory Affairs-Equipment Usage Record-Fullpermission", value: 237 },
  { label: "Regulatory Affairs-Area Cleaning Record-Fullpermission", value: 238 },
  { label: "Regulatory Affairs-DP Monitoring across Filters-Fullpermission", value: 239 },
  { label: "Regulatory Affairs-Operation of Air Handling Unit-Fullpermission", value: 240 },
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