const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const Role = sequelize.define("Role", {
  role_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

// User.belongsToMany(Project, { through: UserProject });
// Project.belongsToMany(User, { through: UserProject });

Role.addHook('afterSync', async () => {
    try {
        const rolesCount = await Role.count();
        if (rolesCount === 0) {
            await Role.bulkCreate([
                { role: 'Initiator' },
                { role: 'Reviewer' },
                { role: 'Approver' },
                { role: 'Viewonly' },
                { role: 'Fullpermission' },
                { role: 'Mailonly' }
            ]);
            console.log('Roles created');
        } else {
            console.log('Roles already exist');
        }
    } catch (error) {
        console.error('Error creating roles:', error);
    }
});


module.exports = Role;
