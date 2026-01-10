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
const vidyagxpFeedback = require("./config/vidyagxp_feedback");
const dashboardData = require("./routes/dashboardData");
const workFLow = require("./routes/workflow");

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
