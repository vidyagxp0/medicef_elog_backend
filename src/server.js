const express = require("express");
const { connectToDB } = require("./config/db");
const config = require("./config/config.json");
const http = require("http");
const userRoutes = require("./routes/users");
const differentialPressureRoutes = require("./routes/differentialPressure");
const tempratureRecordRoutes = require("./routes/tempratureRecords");
const equipmentUsageRoutes = require("./routes/equipmentUsage");
const mediaRecordRoutes = require("./routes/mediaRecord");
const dispensingOfMaterialRoutes = require("./routes/dispensingOfMaterial");
const operationOfSterlizerRoutes = require("./routes/operationOfSterlizer");
const analyticalBalanceRoutes = require("./routes/AnalyticalBalance")
const opAndCalParamterRoute = require("./routes/OpAndCalProcessRoute")
const OpAndCalUvVisRoute = require("./routes/OpAndCalUvVisRoute")
const sdsPage = require("./routes/sdsPageRoute")
const igeneProcess = require("./routes/gelDocIGeneRoute")
const whiteLightTransilliminator = require("./routes/uvWhiteLightRoute")
const voCalibProcess = require("./routes/voCalibProcessRoute")
const karlFischerRoutes = require("./routes/karlFischer")
const hplcRoutes = require("./routes/hplcRoutes")
const vidyagxpFeedback = require("./config/vidyagxp_feedback");
const siteRoutes = require("./routes/sites");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

const app = express();
const server = http.createServer(app);

const pdfsFolder = path.resolve("public");

app.use("/public", express.static(pdfsFolder));

app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["*"],
        frameAncestors: ["self"], // Allow iframe embedding from any source
      },
    },
    crossOriginResourcePolicy: true,
    crossOriginEmbedderPolicy: true,
  })
);

// Remove 'X-Frame-Options' header
app.use((req, res, next) => {
  res.removeHeader("X-Frame-Options");
  next();
});

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoutes);
app.use("/feedback", vidyagxpFeedback);
app.use("/differential-pressure", differentialPressureRoutes);
app.use("/temprature-record", tempratureRecordRoutes);
app.use("/equipment-usage", equipmentUsageRoutes);
app.use("/operation-sterlizer", operationOfSterlizerRoutes);
app.use("/media-record", mediaRecordRoutes);
app.use("/dispensing-material", dispensingOfMaterialRoutes);
app.use("/site", siteRoutes);
app.use("/analytical-balance",analyticalBalanceRoutes);
app.use("/op-and-calParameter",opAndCalParamterRoute);
app.use("/uv-vis-calib",OpAndCalUvVisRoute);
app.use("/sds-page",sdsPage);
app.use("/gel-doc-igene",igeneProcess);
app.use("/uv-wl-transi",whiteLightTransilliminator);
app.use("/vo-cal",voCalibProcess);
app.use("/karl-fischer",karlFischerRoutes);
app.use("/hplc",hplcRoutes)
app.use(express.static(path.join(__dirname, "documents")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

server.listen(config.development.PORT, "0.0.0.0", async () => {
  connectToDB()
    .then(() => {
      console.log("Server is running at port: " + config.development.PORT);
    })
    .catch((e) => {
      console.log("Error in database connection", e);
    });
});
