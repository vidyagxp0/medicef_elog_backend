const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

const Site = sequelize.define("Site", {
  site_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  site: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

// User.belongsToMany(Project, { through: UserProject });
// Project.belongsToMany(User, { through: UserProject });


// isme UI ke hisab se site_id ko static diya hai id base pr
Site.addHook('afterSync', async () => {
    try {
        const sitesCount = await Site.count();
        if (sitesCount === 0) {
            await Site.bulkCreate([
                // { site: 'India' },
                // { site: 'Malaysia' },
                // { site: 'EMEA' },
                // { site: 'EU' },
                
                {site_id:5, site: 'Medicef'},
                // { site_id:6, site : "AR&D"}
            ]);
            console.log('Sites created');
        } else {
            console.log('Sites already exist');
        }
    } catch (error) {
        console.error('Error creating sites:', error);
    }
});


module.exports = Site;
