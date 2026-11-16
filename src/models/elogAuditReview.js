
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const ElogAuditReview = sequelize.define(
  "ElogAuditReview",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    process_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    reviewer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    reviewer_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    reviewer_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    // Date in Asia/Kolkata calendar
    reviewed_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    reviewed_audit_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    last_audit_trail_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "elog_audit_reviews",
    timestamps: true,
    updatedAt: false,

    indexes: [
      {
        name: "unique_daily_audit_review",
        unique: true,
        fields: [
          "form_id",
          "process_id",
          "reviewer_id",
          "reviewed_date",
        ],
      },
      {
        name: "idx_audit_review_record",
        fields: ["form_id", "process_id"],
      },
    ],
  }
);

module.exports = ElogAuditReview;
