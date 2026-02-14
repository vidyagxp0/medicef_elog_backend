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
                { process: 'Differential Pressure Record' },
                { process: 'Temperature & Relative Humidity Record' },
                { process: 'Equipment Usage Record' },
                { process: 'Area Cleaning Record' },
                { process: `DP Monitoring Across Filters Record`},
                { process: `Operation of Air Handling Unit Record`},
                { process: `Instrument Usage Record`},
                { process: `Fogging Solution Preparation Record`},
                { process: `Area Fogging Record`},
                { process: `Filter Cleaning Record`},
                { process: `Media Consumption Record`},
                { process: `Disinfectant Stock Record`},
                { process: `Lactic Acid Bacillus Assay Sample Record`},
                { process: `Microbial Limit Test Sample Record`},
                { process: `Dispensing Record`},
                { process: `Cold Chamber Cleaning Record`},
                { process: `Returned Finished Goods Register Record`},
                { process: `Dispensing Booth Activity Record`},
                { process: `Autoclave Sterelization Record`},
                { process: `Drain cleaning and sanitization Record`},
                { process: `Breakdown / Maintenance Work Order Record`},
                { process: `Cleaning and Disinfectant solution preparation distribution and destruction Record`},

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
