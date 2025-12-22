const { sequelize } = require("../config/db");
const { DataTypes, Sequelize } = require("sequelize");
const Department = require("./departments");
const User = require("./users");

const DifferentialPressureForm = sequelize.define("DifferentialPressureForm", {
  form_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Department,
      key: "department_id",
    },
  },
  initiator_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  initiator_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date_of_initiation: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  date_of_review: {
    type: DataTypes.DATE,
  },
  date_of_approval: {
    type: DataTypes.DATE,
  },
  description: {
    type: DataTypes.JSON,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stage: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  department: {
    type: DataTypes.STRING,
  },
  compression_area: {
    type: DataTypes.STRING,
  },
  limit: {
    type: DataTypes.STRING,
  },
  reviewer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  approver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "user_id",
    },
  },
  reviewComment: {
    type: DataTypes.STRING,
  },
  approverComment: {
    type: DataTypes.STRING,
  },
  initiatorComment: {
    allowNull:true,
    type: DataTypes.STRING,
  },
  initiatorAttachment: {
    type: DataTypes.STRING,
  },
  reviewerAttachment: {
    type: DataTypes.STRING,
  },
  approverAttachment: {
    type: DataTypes.STRING,
  },
  additionalAttachment: {
    type: DataTypes.STRING,
  },
  additionalInfo: {
    type: DataTypes.STRING,
  },
  area_name: {
    type: DataTypes.STRING,
  },
  acceptance_criteria: {
    type: DataTypes.STRING,
  },
  instrument_id_no: {
    type: DataTypes.STRING,
  },
  differential_pressure: {
    type: DataTypes.STRING,
  },

});

DifferentialPressureForm.belongsTo(Department, { foreignKey: "department_id" });
Department.hasMany(DifferentialPressureForm, { foreignKey: "department_id" });

DifferentialPressureForm.belongsTo(User, { foreignKey: "initiator_id" });
User.hasMany(DifferentialPressureForm, { foreignKey: "initiator_id" });

DifferentialPressureForm.belongsTo(User, {
  foreignKey: "reviewer_id",
  as: "reviewer",
});
User.hasMany(DifferentialPressureForm, {
  foreignKey: "reviewer_id",
  as: "reviewer",
});

DifferentialPressureForm.belongsTo(User, {
  foreignKey: "approver_id",
  as: "approver",
});
User.hasMany(DifferentialPressureForm, {
  foreignKey: "approver_id",
  as: "approver",
});

module.exports = DifferentialPressureForm;
