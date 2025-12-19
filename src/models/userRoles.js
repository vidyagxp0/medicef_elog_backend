const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const Role = require("./roles");
const Site = require("./sites");
const User = require("./users");
const Process = require("./processes");
const RoleGroup = require("./roleGroups");

const UserRole = sequelize.define("UserRole", {
  userRole_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Role,
      key: "role_id",
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  site_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Site,
      key: "site_id",
    },
  },
  process_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Process,
      key: "process_id",
    },
  },
  roleGroup_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: RoleGroup,
      key: "roleGroup_id",
    },
  },
});

UserRole.belongsTo(User, { foreignKey: "user_id" });
UserRole.belongsTo(Role, { foreignKey: "role_id" });
UserRole.belongsTo(Site, { foreignKey: "site_id" });
UserRole.belongsTo(Process, { foreignKey: "process_id" });
UserRole.belongsTo(RoleGroup, { foreignKey: "roleGroup_id" });

User.hasMany(UserRole, { foreignKey: "user_id" });
Role.hasMany(UserRole, { foreignKey: "role_id" });
Site.hasMany(UserRole, { foreignKey: "site_id" });
Process.hasMany(UserRole, { foreignKey: "process_id" });
RoleGroup.hasMany(UserRole, { foreignKey: "roleGroup_id" });

  const rolesArray1 = [
    { label: "Medicef-Differential Pressure Record-Initiator", value: 1 },
    { label: "Medicef-Temperature Records-Initiator", value: 2 },
  ];
  const rolesArray2 = [
    { label: "Medicef-Differential Pressure Record-Reviewer", value: 3},
    { label: "Medicef-Temperature Records-Reviewer", value: 4 },

  ];
  const rolesArray3 = [
    { label: "Medicef-Differential Pressure Record-Approver", value: 5 },
    { label: "Medicef-Temperature Records-Approver", value: 6},
  ];
  const rolesArray4 = [
    { label: "Medicef-Differential Pressure Record-Fullpermission", value: 7 },
    { label: "Medicef-Temperature Records-Fullpermission", value: 8 },
  ];
































  // const rolesArray1 = [
  //   { label: "India-Differential Pressure Record-Initiator", value: 1 },
  //   { label: "India-Loaded Quantity-Initiator", value: 3 },
  //   { label: "India-Temperature Records-Initiator", value: 2 },
  //   { label: "India-Operation Of Sterilizer-Initiator", value: 4 },
  //   { label: "India-Media Record-Initiator", value: 5 },
  //   { label: "India-Dispensing Of Materials-Initiator", value: 6 },
  //   { label: "Malaysia-Differential Pressure Record-Initiator", value: 7 },
  //   { label: "Malaysia-Temperature Records-Initiator", value: 8 },
  //   { label: "Malaysia-Loaded Quantity-Initiator", value: 9 },
  //   { label: "Malaysia-Media Record-Initiator", value: 11 },
  //   { label: "Malaysia-Operation Of Sterilizer-Initiator", value: 10 },
  //   { label: "Malaysia-Dispensing Of Materials-Initiator", value: 12 },
  //   { label: "EMEA-Differential Pressure Record-Initiator", value: 13 },
  //   { label: "EMEA-Temperature Records-Initiator", value: 14 },
  //   { label: "EMEA-Loaded Quantity-Initiator", value: 15 },
  //   { label: "EMEA-Operation Of Sterilizer-Initiator", value: 16 },
  //   { label: "EMEA-Media Record-Initiator", value: 17 },
  //   { label: "EMEA-Dispensing Of Materials-Initiator", value: 18 },
  //   { label: "EU-Differential Pressure Record-Initiator", value: 19 },
  //   { label: "EU-Temperature Records-Initiator", value: 20 },
  //   { label: "EU-Loaded Quantity-Initiator", value: 21 },
  //   { label: "EU-Operation Of Sterilizer-Initiator", value: 22 },
  //   { label: "EU-Media Record-Initiator", value: 23 },
  //   { label: "EU-Dispensing Of Materials-Initiator", value: 24 },
  // ];
  // const rolesArray2 = [
  //   { label: "India-Differential Pressure Record-Reviewer", value: 25 },
  //   { label: "India-Loaded Quantity-Reviewer", value: 26 },
  //   { label: "India-Temperature Records-Reviewer", value: 27 },
  //   { label: "India-Operation Of Sterilizer-Reviewer", value: 28 },
  //   { label: "India-Media Record-Reviewer", value: 29 },
  //   { label: "India-Dispensing Of Materials-Reviewer", value: 30 },
  //   { label: "Malaysia-Differential Pressure Record-Reviewer", value: 31 },
  //   { label: "Malaysia-Temperature Records-Reviewer", value: 32 },
  //   { label: "Malaysia-Loaded Quantity-Reviewer", value: 33 },
  //   { label: "Malaysia-Media Record-Reviewer", value: 34 },
  //   { label: "Malaysia-Operation Of Sterilizer-Reviewer", value: 35 },
  //   { label: "Malaysia-Dispensing Of Materials-Reviewer", value: 36 },
  //   { label: "EMEA-Differential Pressure Record-Reviewer", value: 37 },
  //   { label: "EMEA-Temperature Records-Reviewer", value: 38 },
  //   { label: "EMEA-Loaded Quantity-Reviewer", value: 39 },
  //   { label: "EMEA-Operation Of Sterilizer-Reviewer", value: 40 },
  //   { label: "EMEA-Media Record-Reviewer", value: 41 },
  //   { label: "EMEA-Dispensing Of Materials-Reviewer", value: 42 },
  //   { label: "EU-Differential Pressure Record-Reviewer", value: 43 },
  //   { label: "EU-Temperature Records-Reviewer", value: 44 },
  //   { label: "EU-Loaded Quantity-Reviewer", value: 45 },
  //   { label: "EU-Operation Of Sterilizer-Reviewer", value: 46 },
  //   { label: "EU-Media Record-Reviewer", value: 47 },
  //   { label: "EU-Dispensing Of Materials-Reviewer", value: 48 },
  // ];
  // const rolesArray3 = [
  //   { label: "India-Differential Pressure Record-Approver", value: 49 },
  //   { label: "India-Loaded Quantity-Approver", value: 50 },
  //   { label: "India-Temperature Records-Approver", value: 51 },
  //   { label: "India-Operation Of Sterilizer-Approver", value: 52 },
  //   { label: "India-Media Record-Approver", value: 53 },
  //   { label: "India-Dispensing Of Materials-Approver", value: 54 },
  //   { label: "Malaysia-Differential Pressure Record-Approver", value: 55 },
  //   { label: "Malaysia-Temperature Records-Approver", value: 56 },
  //   { label: "Malaysia-Loaded Quantity-Approver", value: 57 },
  //   { label: "Malaysia-Media Record-Approver", value: 58 },
  //   { label: "Malaysia-Operation Of Sterilizer-Approver", value: 59 },
  //   { label: "Malaysia-Dispensing Of Materials-Approver", value: 60 },
  //   { label: "EMEA-Differential Pressure Record-Approver", value: 61 },
  //   { label: "EMEA-Temperature Records-Approver", value: 62 },
  //   { label: "EMEA-Loaded Quantity-Approver", value: 63 },
  //   { label: "EMEA-Operation Of Sterilizer-Approver", value: 64 },
  //   { label: "EMEA-Media Record-Approver", value: 65 },
  //   { label: "EMEA-Dispensing Of Materials-Approver", value: 66 },
  //   { label: "EU-Differential Pressure Record-Approver", value: 67 },
  //   { label: "EU-Temperature Records-Approver", value: 68 },
  //   { label: "EU-Loaded Quantity-Approver", value: 69 },
  //   { label: "EU-Operation Of Sterilizer-Approver", value: 70 },
  //   { label: "EU-Media Record-Approver", value: 71 },
  //   { label: "EU-Dispensing Of Materials-Approver", value: 72 },
  // ];
  // const rolesArray4 = [
  //   { label: "India-Differential Pressure Record-Fullpermission", value: 97 },
  //   { label: "India-Loaded Quantity-Fullpermission", value: 98 },
  //   { label: "India-Temperature Records-Fullpermission", value: 99 },
  //   { label: "India-Operation Of Sterilizer-Fullpermission", value: 100 },
  //   { label: "India-Media Record-Fullpermission", value: 101 },
  //   { label: "India-Dispensing Of Materials-Fullpermission", value: 102 },
  //   { label: "Malaysia-Differential Pressure Record-Fullpermission", value: 103 },
  //   { label: "Malaysia-Temperature Records-Fullpermission", value: 104 },
  //   { label: "Malaysia-Loaded Quantity-Fullpermission", value: 105 },
  //   { label: "Malaysia-Media Record-Fullpermission", value: 106 },
  //   { label: "Malaysia-Operation Of Sterilizer-Fullpermission", value: 107 },
  //   { label: "Malaysia-Dispensing Of Materials-Fullpermission", value: 108 },
  //   { label: "EMEA-Differential Pressure Record-Fullpermission", value: 109 },
  //   { label: "EMEA-Temperature Records-Fullpermission", value: 110 },
  //   { label: "EMEA-Loaded Quantity-Fullpermission", value: 111 },
  //   { label: "EMEA-Operation Of Sterilizer-Fullpermission", value: 112 },
  //   { label: "EMEA-Media Record-Fullpermission", value: 113 },
  //   { label: "EMEA-Dispensing Of Materials-Fullpermission", value: 114 },
  //   { label: "EU-Differential Pressure Record-Fullpermission", value: 115 },
  //   { label: "EU-Temperature Records-Fullpermission", value: 116 },
  //   { label: "EU-Loaded Quantity-Fullpermission", value: 117 },
  //   { label: "EU-Operation Of Sterilizer-Fullpermission", value: 118 },
  //   { label: "EU-Media Record-Fullpermission", value: 119 },
  //   { label: "EU-Dispensing Of Materials-Fullpermission", value: 120 },
  // ];


 User.addHook("afterSync", async () => {
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

  const processInitiatorRoles = async (rolesArray, initiatorUser) => {
    try {
      await sequelize.transaction(async (transaction) => {
        for (const role of rolesArray) {
          // Split label into components
          const [siteLabel, processLabel, roleName] = role.label.split("-");

          // Fetch site, process, and role details
          const site = await Site.findOne({
            where: { site: siteLabel },
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

          if (!site || !process || !roleEntity) {
            throw new Error(`Invalid role configuration: ${role.label}`);
          }

          // Create UserRole
          await UserRole.create(
            {
              user_id: initiatorUser.user_id,
              site_id: site.site_id,
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
   try {
     const userRoleCount = await UserRole.count();
     if (userRoleCount === 0) {
       await assignInitiatorRoles();
     } else {
       console.log("User roles already assigned.");
     }
   } catch (error) {
     console.error("Error in afterSync hook:", error.message);
   }
});
// Call the function

module.exports = UserRole;
