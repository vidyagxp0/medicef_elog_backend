const express = require("express");
const { connectToDB } = require("./config/db");
const config = require("./config/config.json");
const http = require("http");
const userRoutes = require("./routes/users");
const differentialPressureRoutes = require("./routes/differentialPressure");
const tempratureRecordRoutes = require("./routes/tempratureRecords");
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
app.use("/site", siteRoutes);
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
