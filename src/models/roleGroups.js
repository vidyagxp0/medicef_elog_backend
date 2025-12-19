const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const Role = require("./roles");
const Site = require("./sites");
const Process = require("./processes");

const RoleGroup = sequelize.define("RoleGroup", {
  roleGroup_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  roleGroup: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

RoleGroup.addHook("afterSync", async () => {
  try {
    const roles = await Role.findAll();
    const sites = await Site.findAll();
    const processes = await Process.findAll();

    for (const role of roles) {
      for (const site of sites) {
        for (const process of processes) {
          const roleGroupName = `${site.site}-${process.process}-${role.role}`;
          const existingRoleGroup = await RoleGroup.findOne({
            where: { roleGroup: roleGroupName },
          });

          if (!existingRoleGroup) {
            await RoleGroup.create({
              roleGroup: roleGroupName,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error creating role groups:", error);
  }
});

module.exports = RoleGroup;
