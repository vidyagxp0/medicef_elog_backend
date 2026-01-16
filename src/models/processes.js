const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const Process = sequelize.define("Process", {
  process_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  process: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

// User.belongsToMany(Project, { through: UserProject });
// Project.belongsToMany(User, { through: UserProject });

// isme UI ke hisab se process_id ko static diya hai id base pr
Process.addHook('afterSync', async () => {
    try {
        const processesCount = await Process.count();
        if (processesCount === 0) {
            await Process.bulkCreate([
                {  process: 'Differential Pressure Record' },
                { process: 'Temperature & Relative humidity Record' },
                { process: 'Equipment Usage' },
            ]);
            console.log('Processes created');
        } else {
            console.log('Processes already exist');
        }
    } catch (error) {
        console.error('Error creating processes:', error);
    }
});


module.exports = Process;
