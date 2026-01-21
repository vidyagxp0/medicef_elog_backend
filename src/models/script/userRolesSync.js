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
  { label: "Quality Assurance-DP Monitoring Across Filters-Initiator", value: 5 },
  { label: "Quality Assurance-Operation of Air Handling Unit-Initiator", value: 6 },
  { label: "Quality Assurance-Instrument Usage Record-Initiator", value: 7 },

  // Quality Control
  { label: "Quality Control-Differential Pressure Record-Initiator", value: 8 },
  { label: "Quality Control-Temperature & Relative Humidity Record-Initiator", value: 9 },
  { label: "Quality Control-Equipment Usage Record-Initiator", value: 10 },
  { label: "Quality Control-Area Cleaning Record-Initiator", value: 11 },
  { label: "Quality Control-DP Monitoring Across Filters-Initiator", value: 12 },
  { label: "Quality Control-Operation of Air Handling Unit-Initiator", value: 13 },
  { label: "Quality Control-Instrument Usage Record-Initiator", value: 14 },

  // Production
  { label: "Production-Differential Pressure Record-Initiator", value: 15 },
  { label: "Production-Temperature & Relative Humidity Record-Initiator", value: 16 },
  { label: "Production-Equipment Usage Record-Initiator", value: 17 },
  { label: "Production-Area Cleaning Record-Initiator", value: 18 },
  { label: "Production-DP Monitoring Across Filters-Initiator", value: 19 },
  { label: "Production-Operation of Air Handling Unit-Initiator", value: 20 },
  { label: "Production-Instrument Usage Record-Initiator", value: 21 },

  // Warehouse
  { label: "Warehouse-Differential Pressure Record-Initiator", value: 22 },
  { label: "Warehouse-Temperature & Relative Humidity Record-Initiator", value: 23 },
  { label: "Warehouse-Equipment Usage Record-Initiator", value: 24 },
  { label: "Warehouse-Area Cleaning Record-Initiator", value: 25 },
  { label: "Warehouse-DP Monitoring Across Filters-Initiator", value: 26 },
  { label: "Warehouse-Operation of Air Handling Unit-Initiator", value: 27 },
  { label: "Warehouse-Instrument Usage Record-Initiator", value: 28 },

  // Engineering
  { label: "Engineering-Differential Pressure Record-Initiator", value: 29 },
  { label: "Engineering-Temperature & Relative Humidity Record-Initiator", value: 30 },
  { label: "Engineering-Equipment Usage Record-Initiator", value: 31 },
  { label: "Engineering-Area Cleaning Record-Initiator", value: 32 },
  { label: "Engineering-DP Monitoring Across Filters-Initiator", value: 33 },
  { label: "Engineering-Operation of Air Handling Unit-Initiator", value: 34 },
  { label: "Engineering-Instrument Usage Record-Initiator", value: 35 },

  // Human Resources
  { label: "Human Resources-Differential Pressure Record-Initiator", value: 36 },
  { label: "Human Resources-Temperature & Relative Humidity Record-Initiator", value: 37 },
  { label: "Human Resources-Equipment Usage Record-Initiator", value: 38 },
  { label: "Human Resources-Area Cleaning Record-Initiator", value: 39 },
  { label: "Human Resources-DP Monitoring Across Filters-Initiator", value: 40 },
  { label: "Human Resources-Operation of Air Handling Unit-Initiator", value: 41 },
  { label: "Human Resources-Instrument Usage Record-Initiator", value: 42 },

  // Information Technology
  { label: "Information Technology-Differential Pressure Record-Initiator", value: 43 },
  { label: "Information Technology-Temperature & Relative Humidity Record-Initiator", value: 44 },
  { label: "Information Technology-Equipment Usage Record-Initiator", value: 45 },
  { label: "Information Technology-Area Cleaning Record-Initiator", value: 46 },
  { label: "Information Technology-DP Monitoring Across Filters-Initiator", value: 47 },
  { label: "Information Technology-Operation of Air Handling Unit-Initiator", value: 48 },
  { label: "Information Technology-Instrument Usage Record-Initiator", value: 49 },

  // Accounts
  { label: "Accounts-Differential Pressure Record-Initiator", value: 50 },
  { label: "Accounts-Temperature & Relative Humidity Record-Initiator", value: 51 },
  { label: "Accounts-Equipment Usage Record-Initiator", value: 52 },
  { label: "Accounts-Area Cleaning Record-Initiator", value: 53 },
  { label: "Accounts-DP Monitoring Across Filters-Initiator", value: 54 },
  { label: "Accounts-Operation of Air Handling Unit-Initiator", value: 55 },
  { label: "Accounts-Instrument Usage Record-Initiator", value: 56 },

  // PPIC
  { label: "Production Planning and Inventory Control-Differential Pressure Record-Initiator", value: 57 },
  { label: "Production Planning and Inventory Control-Temperature & Relative Humidity Record-Initiator", value: 58 },
  { label: "Production Planning and Inventory Control-Equipment Usage Record-Initiator", value: 59 },
  { label: "Production Planning and Inventory Control-Area Cleaning Record-Initiator", value: 60 },
  { label: "Production Planning and Inventory Control-DP Monitoring Across Filters-Initiator", value: 61 },
  { label: "Production Planning and Inventory Control-Operation of Air Handling Unit-Initiator", value: 62 },
  { label: "Production Planning and Inventory Control-Instrument Usage Record-Initiator", value: 63 },

  // Regulatory Affairs
  { label: "Regulatory Affairs-Differential Pressure Record-Initiator", value: 64 },
  { label: "Regulatory Affairs-Temperature & Relative Humidity Record-Initiator", value: 65 },
  { label: "Regulatory Affairs-Equipment Usage Record-Initiator", value: 66 },
  { label: "Regulatory Affairs-Area Cleaning Record-Initiator", value: 67 },
  { label: "Regulatory Affairs-DP Monitoring Across Filters-Initiator", value: 68 },
  { label: "Regulatory Affairs-Operation of Air Handling Unit-Initiator", value: 69 },
  { label: "Regulatory Affairs-Instrument Usage Record-Initiator", value: 70 },
];

const rolesArray2 = [
  // Quality Assurance
  { label: "Quality Assurance-Differential Pressure Record-Reviewer", value: 61 },
  { label: "Quality Assurance-Temperature & Relative Humidity Record-Reviewer", value: 62 },
  { label: "Quality Assurance-Equipment Usage Record-Reviewer", value: 63 },
  { label: "Quality Assurance-Area Cleaning Record-Reviewer", value: 64 },
  { label: "Quality Assurance-DP Monitoring Across Filters-Reviewer", value: 65 },
  { label: "Quality Assurance-Operation of Air Handling Unit-Reviewer", value: 66 },
  { label: "Quality Assurance-Instrument Usage Record-Reviewer", value: 121 },

  // Quality Control
  { label: "Quality Control-Differential Pressure Record-Reviewer", value: 67 },
  { label: "Quality Control-Temperature & Relative Humidity Record-Reviewer", value: 68 },
  { label: "Quality Control-Equipment Usage Record-Reviewer", value: 69 },
  { label: "Quality Control-Area Cleaning Record-Reviewer", value: 70 },
  { label: "Quality Control-DP Monitoring Across Filters-Reviewer", value: 71 },
  { label: "Quality Control-Operation of Air Handling Unit-Reviewer", value: 72 },
  { label: "Quality Control-Instrument Usage Record-Reviewer", value: 122 },

  // Production
  { label: "Production-Differential Pressure Record-Reviewer", value: 73 },
  { label: "Production-Temperature & Relative Humidity Record-Reviewer", value: 74 },
  { label: "Production-Equipment Usage Record-Reviewer", value: 75 },
  { label: "Production-Area Cleaning Record-Reviewer", value: 76 },
  { label: "Production-DP Monitoring Across Filters-Reviewer", value: 77 },
  { label: "Production-Operation of Air Handling Unit-Reviewer", value: 78 },
  { label: "Production-Instrument Usage Record-Reviewer", value: 123 },

  // Warehouse
  { label: "Warehouse-Differential Pressure Record-Reviewer", value: 79 },
  { label: "Warehouse-Temperature & Relative Humidity Record-Reviewer", value: 80 },
  { label: "Warehouse-Equipment Usage Record-Reviewer", value: 81 },
  { label: "Warehouse-Area Cleaning Record-Reviewer", value: 82 },
  { label: "Warehouse-DP Monitoring Across Filters-Reviewer", value: 83 },
  { label: "Warehouse-Operation of Air Handling Unit-Reviewer", value: 84 },
  { label: "Warehouse-Instrument Usage Record-Reviewer", value: 124 },

  // Engineering
  { label: "Engineering-Differential Pressure Record-Reviewer", value: 85 },
  { label: "Engineering-Temperature & Relative Humidity Record-Reviewer", value: 86 },
  { label: "Engineering-Equipment Usage Record-Reviewer", value: 87 },
  { label: "Engineering-Area Cleaning Record-Reviewer", value: 88 },
  { label: "Engineering-DP Monitoring Across Filters-Reviewer", value: 89 },
  { label: "Engineering-Operation of Air Handling Unit-Reviewer", value: 90 },
  { label: "Engineering-Instrument Usage Record-Reviewer", value: 125 },

  // Human Resources
  { label: "Human Resources-Differential Pressure Record-Reviewer", value: 91 },
  { label: "Human Resources-Temperature & Relative Humidity Record-Reviewer", value: 92 },
  { label: "Human Resources-Equipment Usage Record-Reviewer", value: 93 },
  { label: "Human Resources-Area Cleaning Record-Reviewer", value: 94 },
  { label: "Human Resources-DP Monitoring Across Filters-Reviewer", value: 95 },
  { label: "Human Resources-Operation of Air Handling Unit-Reviewer", value: 96 },
  { label: "Human Resources-Instrument Usage Record-Reviewer", value: 126 },

  // Information Technology
  { label: "Information Technology-Differential Pressure Record-Reviewer", value: 97 },
  { label: "Information Technology-Temperature & Relative Humidity Record-Reviewer", value: 98 },
  { label: "Information Technology-Equipment Usage Record-Reviewer", value: 99 },
  { label: "Information Technology-Area Cleaning Record-Reviewer", value: 100 },
  { label: "Information Technology-DP Monitoring Across Filters-Reviewer", value: 101 },
  { label: "Information Technology-Operation of Air Handling Unit-Reviewer", value: 102 },
  { label: "Information Technology-Instrument Usage Record-Reviewer", value: 127 },

  // Accounts
  { label: "Accounts-Differential Pressure Record-Reviewer", value: 103 },
  { label: "Accounts-Temperature & Relative Humidity Record-Reviewer", value: 104 },
  { label: "Accounts-Equipment Usage Record-Reviewer", value: 105 },
  { label: "Accounts-Area Cleaning Record-Reviewer", value: 106 },
  { label: "Accounts-DP Monitoring Across Filters-Reviewer", value: 107 },
  { label: "Accounts-Operation of Air Handling Unit-Reviewer", value: 108 },
  { label: "Accounts-Instrument Usage Record-Reviewer", value: 128 },

  // PPIC
  { label: "Production Planning and Inventory Control-Differential Pressure Record-Reviewer", value: 109 },
  { label: "Production Planning and Inventory Control-Temperature & Relative Humidity Record-Reviewer", value: 110 },
  { label: "Production Planning and Inventory Control-Equipment Usage Record-Reviewer", value: 111 },
  { label: "Production Planning and Inventory Control-Area Cleaning Record-Reviewer", value: 112 },
  { label: "Production Planning and Inventory Control-DP Monitoring Across Filters-Reviewer", value: 113 },
  { label: "Production Planning and Inventory Control-Operation of Air Handling Unit-Reviewer", value: 114 },
  { label: "Production Planning and Inventory Control-Instrument Usage Record-Reviewer", value: 129 },

  // Regulatory Affairs
  { label: "Regulatory Affairs-Differential Pressure Record-Reviewer", value: 115 },
  { label: "Regulatory Affairs-Temperature & Relative Humidity Record-Reviewer", value: 116 },
  { label: "Regulatory Affairs-Equipment Usage Record-Reviewer", value: 117 },
  { label: "Regulatory Affairs-Area Cleaning Record-Reviewer", value: 118 },
  { label: "Regulatory Affairs-DP Monitoring Across Filters-Reviewer", value: 119 },
  { label: "Regulatory Affairs-Operation of Air Handling Unit-Reviewer", value: 120 },
  { label: "Regulatory Affairs-Instrument Usage Record-Reviewer", value: 130 },
];

const rolesArray3 = [
  // Quality Assurance
  { label: "Quality Assurance-Differential Pressure Record-Approver", value: 121 },
  { label: "Quality Assurance-Temperature & Relative Humidity Record-Approver", value: 122 },
  { label: "Quality Assurance-Equipment Usage Record-Approver", value: 123 },
  { label: "Quality Assurance-Area Cleaning Record-Approver", value: 124 },
  { label: "Quality Assurance-DP Monitoring Across Filters-Approver", value: 125 },
  { label: "Quality Assurance-Operation of Air Handling Unit-Approver", value: 126 },
  { label: "Quality Assurance-Instrument Usage Record-Approver", value: 241 },

  // Quality Control
  { label: "Quality Control-Differential Pressure Record-Approver", value: 127 },
  { label: "Quality Control-Temperature & Relative Humidity Record-Approver", value: 128 },
  { label: "Quality Control-Equipment Usage Record-Approver", value: 129 },
  { label: "Quality Control-Area Cleaning Record-Approver", value: 130 },
  { label: "Quality Control-DP Monitoring Across Filters-Approver", value: 131 },
  { label: "Quality Control-Operation of Air Handling Unit-Approver", value: 132 },
  { label: "Quality Control-Instrument Usage Record-Approver", value: 242 },

  // Production
  { label: "Production-Differential Pressure Record-Approver", value: 133 },
  { label: "Production-Temperature & Relative Humidity Record-Approver", value: 134 },
  { label: "Production-Equipment Usage Record-Approver", value: 135 },
  { label: "Production-Area Cleaning Record-Approver", value: 136 },
  { label: "Production-DP Monitoring Across Filters-Approver", value: 137 },
  { label: "Production-Operation of Air Handling Unit-Approver", value: 138 },
  { label: "Production-Instrument Usage Record-Approver", value: 243 },

  // Warehouse
  { label: "Warehouse-Differential Pressure Record-Approver", value: 139 },
  { label: "Warehouse-Temperature & Relative Humidity Record-Approver", value: 140 },
  { label: "Warehouse-Equipment Usage Record-Approver", value: 141 },
  { label: "Warehouse-Area Cleaning Record-Approver", value: 142 },
  { label: "Warehouse-DP Monitoring Across Filters-Approver", value: 143 },
  { label: "Warehouse-Operation of Air Handling Unit-Approver", value: 144 },
  { label: "Warehouse-Instrument Usage Record-Approver", value: 244 },

  // Engineering
  { label: "Engineering-Differential Pressure Record-Approver", value: 145 },
  { label: "Engineering-Temperature & Relative Humidity Record-Approver", value: 146 },
  { label: "Engineering-Equipment Usage Record-Approver", value: 147 },
  { label: "Engineering-Area Cleaning Record-Approver", value: 148 },
  { label: "Engineering-DP Monitoring Across Filters-Approver", value: 149 },
  { label: "Engineering-Operation of Air Handling Unit-Approver", value: 150 },
  { label: "Engineering-Instrument Usage Record-Approver", value: 245 },

  // Human Resources
  { label: "Human Resources-Differential Pressure Record-Approver", value: 151 },
  { label: "Human Resources-Temperature & Relative Humidity Record-Approver", value: 152 },
  { label: "Human Resources-Equipment Usage Record-Approver", value: 153 },
  { label: "Human Resources-Area Cleaning Record-Approver", value: 154 },
  { label: "Human Resources-DP Monitoring Across Filters-Approver", value: 155 },
  { label: "Human Resources-Operation of Air Handling Unit-Approver", value: 156 },
  { label: "Human Resources-Instrument Usage Record-Approver", value: 246 },

  // Information Technology
  { label: "Information Technology-Differential Pressure Record-Approver", value: 157 },
  { label: "Information Technology-Temperature & Relative Humidity Record-Approver", value: 158 },
  { label: "Information Technology-Equipment Usage Record-Approver", value: 159 },
  { label: "Information Technology-Area Cleaning Record-Approver", value: 160 },
  { label: "Information Technology-DP Monitoring Across Filters-Approver", value: 161 },
  { label: "Information Technology-Operation of Air Handling Unit-Approver", value: 162 },
  { label: "Information Technology-Instrument Usage Record-Approver", value: 247 },

  // Accounts
  { label: "Accounts-Differential Pressure Record-Approver", value: 163 },
  { label: "Accounts-Temperature & Relative Humidity Record-Approver", value: 164 },
  { label: "Accounts-Equipment Usage Record-Approver", value: 165 },
  { label: "Accounts-Area Cleaning Record-Approver", value: 166 },
  { label: "Accounts-DP Monitoring Across Filters-Approver", value: 167 },
  { label: "Accounts-Operation of Air Handling Unit-Approver", value: 168 },
  { label: "Accounts-Instrument Usage Record-Approver", value: 248 },

  // PPIC
  { label: "Production Planning and Inventory Control-Differential Pressure Record-Approver", value: 169 },
  { label: "Production Planning and Inventory Control-Temperature & Relative Humidity Record-Approver", value: 170 },
  { label: "Production Planning and Inventory Control-Equipment Usage Record-Approver", value: 171 },
  { label: "Production Planning and Inventory Control-Area Cleaning Record-Approver", value: 172 },
  { label: "Production Planning and Inventory Control-DP Monitoring Across Filters-Approver", value: 173 },
  { label: "Production Planning and Inventory Control-Operation of Air Handling Unit-Approver", value: 174 },
  { label: "Production Planning and Inventory Control-Instrument Usage Record-Approver", value: 249 },

  // Regulatory Affairs
  { label: "Regulatory Affairs-Differential Pressure Record-Approver", value: 175 },
  { label: "Regulatory Affairs-Temperature & Relative Humidity Record-Approver", value: 176 },
  { label: "Regulatory Affairs-Equipment Usage Record-Approver", value: 177 },
  { label: "Regulatory Affairs-Area Cleaning Record-Approver", value: 178 },
  { label: "Regulatory Affairs-DP Monitoring Across Filters-Approver", value: 179 },
  { label: "Regulatory Affairs-Operation of Air Handling Unit-Approver", value: 180 },
  { label: "Regulatory Affairs-Instrument Usage Record-Approver", value: 250 },
];
const rolesArray4 = [
  // Quality Assurance
  { label: "Quality Assurance-Differential Pressure Record-Fullpermission", value: 181 },
  { label: "Quality Assurance-Temperature & Relative Humidity Record-Fullpermission", value: 182 },
  { label: "Quality Assurance-Equipment Usage Record-Fullpermission", value: 183 },
  { label: "Quality Assurance-Area Cleaning Record-Fullpermission", value: 184 },
  { label: "Quality Assurance-DP Monitoring Across Filters-Fullpermission", value: 185 },
  { label: "Quality Assurance-Operation of Air Handling Unit-Fullpermission", value: 186 },
  { label: "Quality Assurance-Instrument Usage Record-Fullpermission", value: 251 },

  // Quality Control
  { label: "Quality Control-Differential Pressure Record-Fullpermission", value: 187 },
  { label: "Quality Control-Temperature & Relative Humidity Record-Fullpermission", value: 188 },
  { label: "Quality Control-Equipment Usage Record-Fullpermission", value: 189 },
  { label: "Quality Control-Area Cleaning Record-Fullpermission", value: 190 },
  { label: "Quality Control-DP Monitoring Across Filters-Fullpermission", value: 191 },
  { label: "Quality Control-Operation of Air Handling Unit-Fullpermission", value: 192 },
  { label: "Quality Control-Instrument Usage Record-Fullpermission", value: 252 },

  // Production
  { label: "Production-Differential Pressure Record-Fullpermission", value: 193 },
  { label: "Production-Temperature & Relative Humidity Record-Fullpermission", value: 194 },
  { label: "Production-Equipment Usage Record-Fullpermission", value: 195 },
  { label: "Production-Area Cleaning Record-Fullpermission", value: 196 },
  { label: "Production-DP Monitoring Across Filters-Fullpermission", value: 197 },
  { label: "Production-Operation of Air Handling Unit-Fullpermission", value: 198 },
  { label: "Production-Instrument Usage Record-Fullpermission", value: 253 },

  // Warehouse
  { label: "Warehouse-Differential Pressure Record-Fullpermission", value: 199 },
  { label: "Warehouse-Temperature & Relative Humidity Record-Fullpermission", value: 200 },
  { label: "Warehouse-Equipment Usage Record-Fullpermission", value: 201 },
  { label: "Warehouse-Area Cleaning Record-Fullpermission", value: 202 },
  { label: "Warehouse-DP Monitoring Across Filters-Fullpermission", value: 203 },
  { label: "Warehouse-Operation of Air Handling Unit-Fullpermission", value: 204 },
  { label: "Warehouse-Instrument Usage Record-Fullpermission", value: 254 },

  // Engineering
  { label: "Engineering-Differential Pressure Record-Fullpermission", value: 205 },
  { label: "Engineering-Temperature & Relative Humidity Record-Fullpermission", value: 206 },
  { label: "Engineering-Equipment Usage Record-Fullpermission", value: 207 },
  { label: "Engineering-Area Cleaning Record-Fullpermission", value: 208 },
  { label: "Engineering-DP Monitoring Across Filters-Fullpermission", value: 209 },
  { label: "Engineering-Operation of Air Handling Unit-Fullpermission", value: 210 },
  { label: "Engineering-Instrument Usage Record-Fullpermission", value: 255 },

  // Human Resources
  { label: "Human Resources-Differential Pressure Record-Fullpermission", value: 211 },
  { label: "Human Resources-Temperature & Relative Humidity Record-Fullpermission", value: 212 },
  { label: "Human Resources-Equipment Usage Record-Fullpermission", value: 213 },
  { label: "Human Resources-Area Cleaning Record-Fullpermission", value: 214 },
  { label: "Human Resources-DP Monitoring Across Filters-Fullpermission", value: 215 },
  { label: "Human Resources-Operation of Air Handling Unit-Fullpermission", value: 216 },
  { label: "Human Resources-Instrument Usage Record-Fullpermission", value: 256 },

  // Information Technology
  { label: "Information Technology-Differential Pressure Record-Fullpermission", value: 217 },
  { label: "Information Technology-Temperature & Relative Humidity Record-Fullpermission", value: 218 },
  { label: "Information Technology-Equipment Usage Record-Fullpermission", value: 219 },
  { label: "Information Technology-Area Cleaning Record-Fullpermission", value: 220 },
  { label: "Information Technology-DP Monitoring Across Filters-Fullpermission", value: 221 },
  { label: "Information Technology-Operation of Air Handling Unit-Fullpermission", value: 222 },
  { label: "Information Technology-Instrument Usage Record-Fullpermission", value: 257 },

  // Accounts
  { label: "Accounts-Differential Pressure Record-Fullpermission", value: 223 },
  { label: "Accounts-Temperature & Relative Humidity Record-Fullpermission", value: 224 },
  { label: "Accounts-Equipment Usage Record-Fullpermission", value: 225 },
  { label: "Accounts-Area Cleaning Record-Fullpermission", value: 226 },
  { label: "Accounts-DP Monitoring Across Filters-Fullpermission", value: 227 },
  { label: "Accounts-Operation of Air Handling Unit-Fullpermission", value: 228 },
  { label: "Accounts-Instrument Usage Record-Fullpermission", value: 258 },

  // PPIC
  { label: "Production Planning and Inventory Control-Differential Pressure Record-Fullpermission", value: 229 },
  { label: "Production Planning and Inventory Control-Temperature & Relative Humidity Record-Fullpermission", value: 230 },
  { label: "Production Planning and Inventory Control-Equipment Usage Record-Fullpermission", value: 231 },
  { label: "Production Planning and Inventory Control-Area Cleaning Record-Fullpermission", value: 232 },
  { label: "Production Planning and Inventory Control-DP Monitoring Across Filters-Fullpermission", value: 233 },
  { label: "Production Planning and Inventory Control-Operation of Air Handling Unit-Fullpermission", value: 234 },
  { label: "Production Planning and Inventory Control-Instrument Usage Record-Fullpermission", value: 259 },

  // Regulatory Affairs
  { label: "Regulatory Affairs-Differential Pressure Record-Fullpermission", value: 235 },
  { label: "Regulatory Affairs-Temperature & Relative Humidity Record-Fullpermission", value: 236 },
  { label: "Regulatory Affairs-Equipment Usage Record-Fullpermission", value: 237 },
  { label: "Regulatory Affairs-Area Cleaning Record-Fullpermission", value: 238 },
  { label: "Regulatory Affairs-DP Monitoring Across Filters-Fullpermission", value: 239 },
  { label: "Regulatory Affairs-Operation of Air Handling Unit-Fullpermission", value: 240 },
  { label: "Regulatory Affairs-Instrument Usage Record-Fullpermission", value: 260 },
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