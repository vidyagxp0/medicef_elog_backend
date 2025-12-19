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
                { process_id: 1, process: 'Differential Pressure Record' },
                { process_id: 2,process: 'Temperature Records' },
                // { process_id: 3,process: 'Equipment Usage' },
                // { process: 'Operation Of Sterilizer' },
                // { process: 'Media Record' },
                // { process: 'Dispensing Of Materials' },
                // { process_id: 7,process: 'Analytical Balance' },
                // { process_id: 8,process: 'Karl Fischer' },
                // { process_id: 9,process: 'HPLC' },
                // { process_id: 10,process: 'pH Meter Op/Cal' },
                // { process_id: 11,process: 'UV Vis Calib'},
                // { process_id: 12,process: 'SDS PAGE'},
                // { process_id: 13,process: 'Gel Doc iGene'},
                // { process_id: 14,process: 'UV/White Light Transilluminator'},
                // { process_id: 15,process: 'VO Calibration'},
              
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
