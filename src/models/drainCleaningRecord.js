const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");
const DrainCleaningForm = require("./drainCleaningForm");

// const DrainCleaningRecord = sequelize.define(
//   "DrainCleaningRecord",
//   {
//     record_id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     form_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: DrainCleaningForm,
//         key: 'form_id',
//       }
//     },
//     unique_id: {
//       type: DataTypes.STRING,
//     },
//     date: {
//       type: DataTypes.STRING,
//     },
//     time: {
//       type: DataTypes.STRING,
//     },
//     cleaning_agent: {
//       type: DataTypes.STRING,
//     },
//     disinfectant_used: {
//       type: DataTypes.STRING,
//     },
//     sanitizer_used: {
//       type: DataTypes.STRING,
//     },
//     drain_id: {
//       type: DataTypes.STRING,
//     },

//     done_by: {
//       type: DataTypes.STRING,
//     },
//     checked_by: {
//       type: DataTypes.STRING,
//     },
//     reviewed_by: {
//       type: DataTypes.STRING,
//     },
//     verified_by: {
//       type: DataTypes.STRING,
//     },
//     remarks: {
//       type: DataTypes.STRING,
//     },
//   }
// );

const DrainCleaningRecord = sequelize.define("DrainCleaningRecord", {
  record_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  form_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: DrainCleaningForm,
      key: "form_id",
    },
  },
  unique_id: {
    type: DataTypes.STRING,
  },
  by: {
    type: DataTypes.STRING,
  },
  checked: {
    type: DataTypes.BOOLEAN,
  },
  day: {
    type: DataTypes.INTEGER,
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  month_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
  },
  row_id: {
    type: DataTypes.INTEGER,
  },
  row_label: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
  time: {
    type: DataTypes.DATE,
  },

  done_by: {
    type: DataTypes.STRING,
  },
  checked_by: {
    type: DataTypes.STRING,
  },
  reviewed_by: {
    type: DataTypes.STRING,
  },
  verified_by: {
    type: DataTypes.STRING,
  },
  remarks: {
    type: DataTypes.STRING,
  },
});
DrainCleaningRecord.belongsTo(DrainCleaningForm, { foreignKey: "form_id" });
DrainCleaningForm.hasMany(DrainCleaningRecord, { foreignKey: "form_id" });

module.exports = DrainCleaningRecord;
