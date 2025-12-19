const User = require("../models/users");
const UserRole = require("../models/userRoles");
const config = require("../config/config.json");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Role = require("../models/roles");
const Process = require("../models/processes");
const Site = require("../models/sites");
const RoleGroup = require("../models/roleGroups");
const EffectiveRoleGroup = require("../models/effectiveRoleGroup");
const { sequelize } = require("../config/db");
const { getFileUrl } = require("../middlewares/authentication");

//register user
exports.signup = async (req, res) => {
  const { password, email, name, rolesArray, age, gender } = req.body;

  // Check if required fields are provided
  if (!password || !email || !name || !rolesArray) {
    return res.status(400).json({
      error: true,
      message: "Please provide proper user details!",
    });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email: email, isActive: true },
    });
    if (existingUser) {
      return res.status(400).json({
        error: true,
        message: "User already registered!",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(password, salt);

    // Create the user
    const newUser = await User.create(
      {
        name: name,
        email: email,
        password: hashpass,
        age: age,
        gender: gender,
        profile_pic: getFileUrl(req?.file),
      },
      { transaction }
    );

    // Process roles array
    for (const role of rolesArray) {
      const singleRole = role.label.split("-");
      const roleId = await Role.findOne({ where: { role: singleRole[2] } });
      const roleGroup = await RoleGroup.findOne({
        where: { roleGroup: role.label },
      });
      const processId = await Process.findOne({
        where: { process: singleRole[1] },
      });
      const siteId = await Site.findOne({ where: { site: singleRole[0] } });

      await UserRole.create(
        {
          user_id: newUser.user_id,
          site_id: siteId.site_id,
          process_id: processId.process_id,
          role_id: roleId.role_id,
          roleGroup_id: roleGroup.roleGroup_id,
        },
        { transaction }
      );
    }

    // Commit the transaction
    await transaction.commit();

    return res.status(200).json({
      error: false,
      message: "User Registered",
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    return res.status(500).json({
      error: true,
      message: `Error during registration: ${error.message}`,
    });
  }
};

//Update user
exports.editUser = async (req, res) => {
  // Check if request body is empty
  if (!req.body && !req.files) {
    return res.status(400).json({
      error: true,
      message: "Please provide details to update!",
    });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Update user details
    const userdetails = {
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      gender: req.body.gender,
      profile_pic: getFileUrl(req?.file),
    };

    await User.update(userdetails, {
      where: { user_id: req.params.id },
      transaction,
    });

    // Delete existing UserRole entries
    await UserRole.destroy({
      where: { user_id: req.params.id },
      transaction,
    });

    // Process roles array
    const rolesArray = req.body.rolesArray;
    for (const role of rolesArray) {
      const singleRole = role.label.split("-");
      const roleId = await Role.findOne({
        where: { role: singleRole[2] },
        transaction,
      });
      const processId = await Process.findOne({
        where: { process: singleRole[1] },
        transaction,
      });
      const siteId = await Site.findOne({
        where: { site: singleRole[0] },
        transaction,
      });
      const roleGroup = await RoleGroup.findOne({
        where: { roleGroup: role.label },
        transaction,
      });

      await UserRole.create(
        {
          user_id: req.params.id,
          site_id: siteId.site_id,
          process_id: processId.process_id,
          role_id: roleId.role_id,
          roleGroup_id: roleGroup.roleGroup_id,
        },
        { transaction }
      );
    }

    // Commit the transaction
    await transaction.commit();

    return res.status(200).json({
      error: false,
      message: "User Details Updated",
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await transaction.rollback();

    return res.status(500).json({
      error: true,
      message: `Error during update: ${error.message}`,
    });
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne(
      { where: { user_id: req.params.id, isActive: true } },
      { transaction }
    );
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    await User.update(
      { isActive: false },
      {
        where: {
          user_id: req.params.id,
        },
      }
    );

    await transaction.commit();
    res.json({
      error: false,
      message: "User deleted successfully",
    });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({
      error: true,
      message: err.message,
    });
  }
};

//get all users
exports.getAllUsers = async (req, res) => {
  User.findAll({
    where: {
      isActive: true,
    },
  })
    .then((result) => {
      res.status(200).json({
        error: false,
        response: result,
      });
    })
    .catch((e) => {
      res.status(400).json({
        error: true,
        response: e.message,
      });
    });
};

// get a single user
exports.getAUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { user_id: req.params.id, isActive: true },
      include: [
        {
          model: UserRole,
          include: [
            {
              model: RoleGroup,
              attributes: ["roleGroup", "roleGroup_id"], // Select roleGroup and roleGroup_id attributes
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const formattedUser = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      profile_pic: user.profile_pic,
      roles: user.UserRoles.map((userRole) => ({
        label: userRole.RoleGroup.roleGroup,
        value: userRole.RoleGroup.roleGroup_id,
      })),
    };

    res.status(200).json(formattedUser);
  } catch (error) {
    console.error("Error fetching user with role groups:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUserPermissions = async (req, res) => {
  UserRole.findAll({
    where: {
      user_id: req.params.id,
    },
    include: [
      {
        model: RoleGroup,
      },
    ],
  })
    .then((result) => {
      res.json({
        error: false,
        message: result,
      });
    })
    .catch((error) => {
      console.log(error);
      
      res.status(400).json({
        error: true,
        message: error,
      });
    });
};
exports.getUserRoles = async (req, res) => {
  UserRole.findAll({
    where: {
      user_id: req.params.id,
    },
    attributes: { exclude: ["createdAt", "updatedAt"] },
  })
    .then((result) => {
      res.json({
        error: false,
        message: result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: true,
        message: error.message,
      });
    });
};

exports.getAllRoleGroups = async (req, res) => {
  RoleGroup.findAll()
    .then((result) => {
      res.status(200).json({
        error: false,
        response: result,
      });
    })
    .catch((e) => {
      res.status(400).json({
        error: true,
        response: e.message,
      });
    });
};

// user login
exports.Userlogin = async (req, res) => {
  const { email, password } = req.body;
  User.findOne({
    where: {
      email: email.toLowerCase(),
      isActive: true,
    },
    raw: true,
  })
    .then((data) => {
      bcrypt.compare(password, data.password, async (_err, result) => {
        if (!result) {
          res.status(400).json({
            error: true,
            message: "Invalid Password!",
          });
        } else {
          const token = jwt.sign(
            { userId: data.user_id },
            config.development.JWT_SECRET,
            { expiresIn: "24h" }
          );
          if (token) {
            res.status(200).json({
              error: false,
              token: token,
            });
          } else {
            res.status(400).json({
              error: true,
              message: "Some unknown error",
            });
          }
        }
      });
    })
    .catch((e) => {
      res.status(401).json({
        error: false,
        message: "Couldn't find User!",
      });
    });
};

exports.Adminlogin = async (req, res) => {
  const { email, password } = req.body;
  if (email.toLowerCase() !== "admin@vidyagxp.com") {
    res.status(401).json({
      error: false,
      message: "Couldn't find User!",
    });
  } else {
    if (password !== "Amit@121") {
      res.status(400).json({
        error: false,
        message: "Incorrect Password!",
      });
    } else {
      const token = jwt.sign(
        { user: "Admin" },
        config.development.JWT_ADMIN_SECRET,
        {
          expiresIn: "24h",
        }
      );
      if (token) {
        res.status(200).json({
          error: false,
          token: token,
        });
      } else {
        res.status(400).json({
          error: true,
          message: "Some unknown error",
        });
      }
    }
  }
};

exports.resetPassword = async (req, res) => {
  let { user_id, current_password, new_password, confirm_new_password } =
    req.body;

  // Validate input data
  if (!user_id || !current_password || !new_password || !confirm_new_password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (new_password !== confirm_new_password) {
    return res
      .status(400)
      .json({ message: "New password and confirm new password do not match" });
  }

  try {
    // Find the user by ID
    const user = await User.findOne({
      where: { user_id: user_id, isActive: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    // Update the user's password
    await User.update(
      { password: hashedPassword },
      { where: { user_id: user_id } }
    );

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.getAllEffectiveRoleGroups = async (req, res) => {
  await EffectiveRoleGroup.findAll()
    .then((result) => {
      res.status(200).json({
        error: false,
        response: result,
      });
    })
    .catch((e) => {
      res.status(500).json({
        error: true,
        response: e.message,
      });
    });
};
