const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const Department = sequelize.define("Department", {
  department_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  departmentName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

Department.addHook('afterSync', async () => {
    try {
        const departmentCount = await Department.count();
        if (departmentCount === 0) {
            await Department.bulkCreate([
                { departmentName: 'Quality Assurance', code: 'QA' },
                { departmentName: 'Quality Control', code: 'QC' },
                { departmentName: 'Production', code: 'PR' },
                { departmentName: 'Warehouse', code: 'WH' },
                { departmentName: 'Engineering', code: 'EN' },
                { departmentName: 'Human Resources', code: 'HR' },
                { departmentName: 'Information Technology', code: 'IT' },
                { departmentName: 'Accounts', code: 'AC' },
                { departmentName: 'Production Planning and Inventory Control', code: 'PPIC' },
                { departmentName: 'Regulatory Affairs', code: 'RA' },
            ]);
            console.log('Department created');
        } else {
            console.log('Department already exist');
        }
    } catch (error) {
        console.error('Error creating departments:', error);
    }
});


module.exports = Department;
