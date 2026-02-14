const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

const { sequelize, connectToDB } = require("./config/db");
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
    // contentSecurityPolicy: {
    //   directives: {
    //     defaultSrc: ["*"],
    //     frameAncestors: ["self"],
    //   },
    // },
        contentSecurityPolicy: false,
    // crossOriginResourcePolicy: true,
        crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
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
app.use("/workflow", workFLow);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ------------------ SERVER START ------------------
const startServer = async () => {
  try {
    await connectToDB();
    console.log("DB connected");

    await sequelize.sync({ alter: false });
    console.log("Tables synchronized");

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

startServer();
