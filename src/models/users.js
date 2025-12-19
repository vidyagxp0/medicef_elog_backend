const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt")

const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [8, 255], // Minimum and maximum allowed length
        msg: "Password must be at least 8 characters long",
      },
    },
  },
  age: {
    type: DataTypes.INTEGER,
  },
  gender: {
    type: DataTypes.STRING,
  },
  profile_pic: {
    type: DataTypes.STRING,
  },
  isActive: {
    type: DataTypes.STRING,
    defaultValue: true
  },
});


User.addHook("afterSync", async () => {
  try {
    const processesCount = await User.count();
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash("Amit@121", salt);
    if (processesCount === 0) {
      await User.bulkCreate([
        { name: "Admin", email: "admin@vidyagxp.com", password: hashpass },
        { name: "Amit", email: "amit@vidyagxp.com", password: hashpass },
        {
          name: "Initiator",
          email: "initiator@vidyagxp.com",
          password: hashpass,
        },
        {
          name: "Reviewer",
          email: "reviewer@vidyagxp.com",
          password: hashpass,
        },
        {
          name: "Approver",
          email: "approver@vidyagxp.com",
          password: hashpass,
        },
        {
          name: "Full Permission",
          email: "fullpermission@vidyagxp.com",
          password: hashpass,
        },
      ]);
      console.log("Admin User created");
    } else {
      console.log("Admin User already exist");
    }
  } catch (error) {
    console.error("Error creating Admin User:", error);
  }
});



// User.belongsToMany(Project, { through: UserProject });
// Project.belongsToMany(User, { through: UserProject });




module.exports = User;
