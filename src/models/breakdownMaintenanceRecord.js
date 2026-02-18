const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const BreakdownMaintenanceForm = require("./breakdownMaintenanceForm");

const BreakdownMaintenanceRecord = sequelize.define(
  "BreakdownMaintenanceRecord",
  {
    record_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: BreakdownMaintenanceForm,
        key: "form_id",
      },
    },

    from_department: {
      type: DataTypes.STRING,
    },
    requested_by: {
      type: DataTypes.STRING,
    },
    request_date: {
      type: DataTypes.DATEONLY,
    },
    request_time: {
      type: DataTypes.TIME,
    },

    equipment_system_area_name: {
      type: DataTypes.STRING,
    },
    area_id_no: {
      type: DataTypes.STRING,
    },

    type_of_work_electrical: {
      type: DataTypes.BOOLEAN,
    },
    type_of_work_mechanical: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    type_of_work_civil: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    type_of_work_other: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    description_of_job: {
      type: DataTypes.TEXT,
    },

    user_dept_sign_date: {
      type: DataTypes.STRING,
    },

    request_received_by: {
      type: DataTypes.STRING,
    },
    request_received_date: {
      type: DataTypes.DATEONLY,
    },
    request_received_time: {
      type: DataTypes.TIME,
    },
    request_received_sign: {
      type: DataTypes.STRING,
    },
    change_control_required: {
      type: DataTypes.BOOLEAN,
    },
    change_control_no: {
      type: DataTypes.STRING,
    },

    summary_of_work_done: {
      type: DataTypes.TEXT,
    },

    work_completed_by: {
      type: DataTypes.STRING,
    },
    work_completed_date: {
      type: DataTypes.DATEONLY,
    },
    work_completed_time: {
      type: DataTypes.TIME,
    },
    work_completed_sign: {
      type: DataTypes.STRING,
    },

    qa_comments: {
      type: DataTypes.TEXT,
    },
    affects_critical_process: {
      type: DataTypes.BOOLEAN,
    },
    qa_sign_date: {
      type: DataTypes.STRING,
    },

    equipment_available_for_use: {
      type: DataTypes.BOOLEAN,
    },
    acceptance_user_sign_date: {
      type: DataTypes.STRING,
    },
    checked_by_engineering_sign_date: {
      type: DataTypes.STRING,
    },
    verified_by_head_engineering_sign_date: {
      type: DataTypes.STRING,
    },
  },
);

BreakdownMaintenanceRecord.belongsTo(BreakdownMaintenanceForm, {
  foreignKey: "form_id",
});
BreakdownMaintenanceForm.hasMany(BreakdownMaintenanceRecord, {
  foreignKey: "form_id",
});

module.exports = BreakdownMaintenanceRecord;
