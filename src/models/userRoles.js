const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const Role = require("./roles");
const Department = require("./departments");
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
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Department,
      key: "department_id",
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
UserRole.belongsTo(Department, { foreignKey: "department_id" });
UserRole.belongsTo(Process, { foreignKey: "process_id" });
UserRole.belongsTo(RoleGroup, { foreignKey: "roleGroup_id" });

User.hasMany(UserRole, { foreignKey: "user_id" });
Role.hasMany(UserRole, { foreignKey: "role_id" });
Department.hasMany(UserRole, { foreignKey: "department_id" });
Process.hasMany(UserRole, { foreignKey: "process_id" });
RoleGroup.hasMany(UserRole, { foreignKey: "roleGroup_id" });

module.exports = UserRole;
