process.env.PUPPETEER_EXECUTABLE_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

const { sequelize, connectToDB } = require("./config/db");
const { DataTypes } = require("sequelize");
const initWorkflowTransitions = require("./models/script/initWorkflowTransitions");
const inituserRolesSync  = require("./models/script/userRolesSync");

const config = require("./config/config.json");

const userRoutes = require("./routes/users");
const differentialPressureRoutes = require("./routes/differentialPressure");
const tempratureRecordRoutes = require("./routes/tempratureRecords");
const equipmentUsageRoutes = require("./routes/equipmentUsage");
const areaCleaningRoutes = require("./routes/areaCleaning");
const dpMonitoringRoutes = require("./routes/dpMonitoring");
const vidyagxpFeedback = require("./config/vidyagxp_feedback");
const dashboardData = require("./routes/dashboardData");
const ahuOperation = require("./routes/ahuOperation");
const instrumentUsageRoutes = require("./routes/instrumentUsage");
const foggingSolutionRoutes = require("./routes/foggingSolution");
const areaFoggingRoutes = require("./routes/areaFogging");
const filterCleaningRoutes = require("./routes/filterCleaning");
const mediaConsumptionRoutes = require("./routes/mediaConsumption");
const disinfectantStockRoutes = require("./routes/disinfectantStock");
const labAssaySampleRoutes = require("./routes/LabAssaySample");
const microbialLimitTestRoutes = require("./routes/microbialLimitTest");
const dispensingRecordRoutes = require("./routes/dispensing");
const coldChamberRoutes = require("./routes/coldChamber");
const returnedFinishedRoutes = require("./routes/returnedFinished");
const dispensingBoothRoutes = require("./routes/dispensingBooth");
const autoclaveSterelizationRoutes = require("./routes/autoclaveSterelization");
const drainCleaningFormRoutes = require("./routes/drainCleaning");
const breakdownMaintenanceRoutes = require("./routes/breakdownMaintenance");
const cleaningAndDisinfectantRoutes = require("./routes/cleaningAndDisinfectant");
const dailyVerificationRoutes = require("./routes/dailyVerification");
const dailyCalibrationRoutes = require("./routes/dailyCalibration");
const balanceUsesRoutes = require("./routes/balanceUses");
// const monthlyCalibrationRoutes = require("./routes/monthlyCalibration");

const workFLow = require("./routes/workflow");
const DispensingRecord = require("./models/dispensingRecord");

const app = express();
const server = http.createServer(app);

// ------------------ MIDDLEWARE ------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  helmet({
    frameguard: false,
    contentSecurityPolicy: {
      directives: {
        frameAncestors: [
          "'self'",
          "https://elogmedicef-dev.vidyagxp.com",
          "*",
        ]
      }
    }
  })
);

app.use(
  "/profile_pics",
  express.static("profile_pics", {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

app.use((req, res, next) => {
  res.removeHeader("X-Frame-Options");
  next();
});

// ------------------ STATIC ------------------
app.use("/public", express.static(path.resolve("public")));
app.use(express.static(path.join(__dirname, "documents")));

// ------------------ ROUTES ------------------
app.use("/user", userRoutes);
app.use("/feedback", vidyagxpFeedback);
app.use("/differential-pressure", differentialPressureRoutes);
app.use("/dashboard-data", dashboardData);
app.use("/temprature-record", tempratureRecordRoutes);
app.use("/equipment-usage", equipmentUsageRoutes);
app.use("/area-cleaning", areaCleaningRoutes);
app.use("/dp-monitoring", dpMonitoringRoutes);
app.use("/ahu-operation", ahuOperation);
app.use("/instrument-usage", instrumentUsageRoutes);
app.use("/fogging-solution", foggingSolutionRoutes);
app.use("/area-fogging", areaFoggingRoutes);
app.use("/filter-cleaning", filterCleaningRoutes);
app.use("/media-consumption", mediaConsumptionRoutes);
app.use("/disinfectant-stock", disinfectantStockRoutes);
app.use("/lab-assay-sample", labAssaySampleRoutes);
app.use("/microbial-limit", microbialLimitTestRoutes);
app.use("/dispensing-record", dispensingRecordRoutes);
app.use("/cold-chamber", coldChamberRoutes);
app.use("/returned-finished", returnedFinishedRoutes);
app.use("/dispensing-booth", dispensingBoothRoutes);
app.use("/autoclave-sterelization", autoclaveSterelizationRoutes);
app.use("/drain-cleaning", drainCleaningFormRoutes);
app.use("/breakdown-maintenance", breakdownMaintenanceRoutes);
app.use("/cleaning-disinfectant", cleaningAndDisinfectantRoutes);
app.use("/daily-calibration", dailyCalibrationRoutes);
 app.use("/balance-uses", balanceUsesRoutes);
app.use("/daily-verification", dailyVerificationRoutes);
// app.use("/monthly-calibration", monthlyCalibrationRoutes);
app.use("/workflow", workFLow);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const ensureDrainCleaningColumns = async () => {
  try {
    const queryInterface = sequelize.getQueryInterface();
    const { DataTypes } = require("sequelize");
    try {
      const formDesc = await queryInterface.describeTable("DrainCleaningForms");
      if (formDesc && !formDesc.fiscal_year) {
        await queryInterface.addColumn("DrainCleaningForms", "fiscal_year", {
          type: DataTypes.STRING,
          allowNull: true,
        });
        console.log("Added fiscal_year column to DrainCleaningForms");
      }
    } catch (e) {}

    try {
      const recordDesc = await queryInterface.describeTable("DrainCleaningRecords");
      if (recordDesc && !recordDesc.month) {
        await queryInterface.addColumn("DrainCleaningRecords", "month", {
          type: DataTypes.INTEGER,
          allowNull: true,
        });
        console.log("Added month column to DrainCleaningRecords");
      }
      if (recordDesc && !recordDesc.year) {
        await queryInterface.addColumn("DrainCleaningRecords", "year", {
          type: DataTypes.INTEGER,
          allowNull: true,
        });
        console.log("Added year column to DrainCleaningRecords");
      }
      if (recordDesc && !recordDesc.month_name) {
        await queryInterface.addColumn("DrainCleaningRecords", "month_name", {
          type: DataTypes.STRING,
          allowNull: true,
        });
        console.log("Added month_name column to DrainCleaningRecords");
      }
    } catch (e) {}
  } catch (err) {
    console.error("Migration check error for DrainCleaning:", err.message);
  }
};

const ensureDispensingBoothLimitDataColumn = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const formDescription = await queryInterface.describeTable(
    "DispensingBoothForms",
  );

  if (!formDescription.limitData) {
    await queryInterface.addColumn("DispensingBoothForms", "limitData", {
      type: DataTypes.JSON,
      allowNull: true,
    });
    console.log("Added limitData column to DispensingBoothForms");
  }
};

const ensureDailyVerificationStandardWeightLimitColumns = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const formDescription = await queryInterface.describeTable(
    "DailyVerificationForms",
  );
  const columns = [
    "standardWeightW1Min",
    "standardWeightW1Max",
    "standardWeightW2Min",
    "standardWeightW2Max",
    "standardWeightW3Min",
    "standardWeightW3Max",
  ];

  for (const column of columns) {
    if (!formDescription[column]) {
      await queryInterface.addColumn("DailyVerificationForms", column, {
        type: DataTypes.STRING,
        allowNull: true,
      });
      console.log(`Added ${column} column to DailyVerificationForms`);
    }
  }
};

// const ensureUserPasswordPolicyColumns = async () => {
//   try {
//     const queryInterface = sequelize.getQueryInterface();

//     const userDescription = await queryInterface.describeTable("Users");

//     const columns = [
//       {
//         name: "password_changed_at",
//         definition: {
//           type: DataTypes.DATE,
//           allowNull: true,
//         },
//       },
//       {
//         name: "password_expires_at",
//         definition: {
//           type: DataTypes.DATE,
//           allowNull: true,
//         },
//       },
//       {
//         name: "must_change_password",
//         definition: {
//           type: DataTypes.BOOLEAN,
//           defaultValue: false,
//           allowNull: false,
//         },
//       },
//       {
//         name: "failed_login_attempts",
//         definition: {
//           type: DataTypes.INTEGER,
//           defaultValue: 0,
//           allowNull: false,
//         },
//       },
//       {
//         name: "locked_until",
//         definition: {
//           type: DataTypes.DATE,
//           allowNull: true,
//         },
//       },
//     ];

//     for (const column of columns) {
//       if (!userDescription[column.name]) {
//         await queryInterface.addColumn(
//           "Users",
//           column.name,
//           column.definition
//         );

//         console.log(
//           `Added ${column.name} column to Users`
//         );
//       }
//     }
//   } catch (error) {
//     console.error(
//       "User password policy migration error:",
//       error.message
//     );
//   }
// };

// ------------------ SERVER START ------------------

const ensureUserPasswordPolicyColumns = async () => {
  try {
    const queryInterface = sequelize.getQueryInterface();

    const userDescription = await queryInterface.describeTable("Users");

    const columns = [
      {
        name: "password_changed_at",
        definition: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        name: "password_expires_at",
        definition: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        name: "must_change_password",
        definition: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
      },
      {
        name: "failed_login_attempts",
        definition: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
      },
      {
        name: "locked_until",
        definition: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
    ];

    // ----------------------------------------------------
    // 1. Ensure password policy columns exist
    // ----------------------------------------------------
    for (const column of columns) {
      if (!userDescription[column.name]) {
        await queryInterface.addColumn(
          "Users",
          column.name,
          column.definition
        );

        console.log(`Added ${column.name} column to Users`);
      }
    }

    // ----------------------------------------------------
    // 2. One-time initialization for EXISTING users
    // ----------------------------------------------------
    //
    // We create a small migration marker so this UPDATE
    // never runs again after the initial rollout.
    //
    // ----------------------------------------------------

    const migrationTable = "SystemMigrations";

    const tableExists = await queryInterface
      .showAllTables()
      .then((tables) =>
        tables.some(
          (table) =>
            String(table).toLowerCase() ===
            migrationTable.toLowerCase()
        )
      );

    if (!tableExists) {
      await queryInterface.createTable(migrationTable, {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },

        migration_name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },

        executed_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      });

      console.log(`Created ${migrationTable} table`);
    }

    const [migrationRows] = await sequelize.query(
      `
        SELECT id
        FROM ${migrationTable}
        WHERE migration_name = 'initial_user_password_change_required'
        LIMIT 1
      `
    );

    // ----------------------------------------------------
    // 3. Run only once
    // ----------------------------------------------------
    if (migrationRows.length === 0) {
      await sequelize.transaction(async (transaction) => {
        await sequelize.query(
          `
            UPDATE Users
            SET must_change_password = true
            WHERE isActive = true
          `,
          {
            transaction,
          }
        );

        await sequelize.query(
          `
            INSERT INTO ${migrationTable}
              (migration_name, executed_at)
            VALUES
              (
                'initial_user_password_change_required',
                CURRENT_TIMESTAMP
              )
          `,
          {
            transaction,
          }
        );
      });

      console.log(
        "Initial password change requirement applied to existing users."
      );
    } else {
      console.log(
        "Initial user password migration already completed."
      );
    }
  } catch (error) {
    console.error(
      "User password policy migration error:",
      error.message
    );
  }
};

const startServer = async () => {
  try {
    await connectToDB();
    console.log("DB connected");

    await sequelize.sync({ alter: false });
    console.log("Tables synchronized");
    await ensureUserPasswordPolicyColumns();
    await ensureDispensingBoothLimitDataColumn();
    await ensureDailyVerificationStandardWeightLimitColumns();
    await ensureDrainCleaningColumns();
    await initWorkflowTransitions();
    await inituserRolesSync()

    server.listen(config.development.PORT, "0.0.0.0", () => {
      console.log(
        "Server is running at port: " + config.development.PORT
      );
    });
  } catch (error) {
    console.error("Server Connection failed:", error);
    process.exit(1);
  }
};

// ------------------ GLOBAL ERROR HANDLERS ------------------
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Promise Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception caught:", error);
});

startServer();
