const jwt = require("jsonwebtoken");
const config = require("../config/config.json");
const UserRole = require("../models/userRoles");

function checkAdminJwtToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error: true,
      message: "Unauthorized User",
    });
  }
  jwt.verify(token, config.development.JWT_ADMIN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized User",
      });
    }
    req.user = decoded;
    next();
  });
}

function checkUserJwtToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error: true,
      message: "Unauthorized User",
    });
  }

  jwt.verify(token, config.development.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized User",
      });
    }
    req.user = decoded;
    next();
  });
}

function hasAccess(userRoles, department_id, processId, roleId) {
  return userRoles.some(
    (role) =>
      (role.role_id === 4 && // Grant access if role_id is 4 (full permissions)
        role.department_id === department_id &&
        role.process_id === processId) ||
      (role.department_id === department_id &&
        role.process_id === processId &&
        role.role_id === roleId)
  );
}

function authorizeUserRole(processId, roleId) {
  return async (req, res, next) => {
    const userRoles = await UserRole.findAll({
      where: {
        user_id: req.user.userId,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!req.body.department_id) {
      return res
        .status(400)
        .json({ error: true, message: "Please provide a department ID." });
    }
    if (hasAccess(userRoles, Number(req.body?.department_id), processId, roleId)) {
      next(); // User has access, proceed to the next middleware or route handler
    } else {
      res
        .status(403)
        .json({ message: "Forbidden: You do not have required permissions." });
    }
  };
}

const getFileUrl = (file) => {
  if (file?.filename) {
    return `http://localhost:1000/profile_pics/${file?.filename}`;
  }
};

const getElogDocsUrl = (file) => {
  if (file && typeof file === "object" && !file.filename) {
    const firstValue = Object.values(file)[0];
    if (firstValue?.filename) {
      const url = `http://localhost:1000/elog_docs/${firstValue.filename}`;
      return url;
    }
  }

  if (file?.filename) {
    const url = `http://localhost:1000/elog_docs/${file.filename}`;
    return url;
  }

  return null;
};

module.exports.getFileUrl = getFileUrl;
module.exports.getElogDocsUrl = getElogDocsUrl;
module.exports.checkUserJwtToken = checkUserJwtToken;
module.exports.checkAdminJwtToken = checkAdminJwtToken;
module.exports.authorizeUserRole = authorizeUserRole;
