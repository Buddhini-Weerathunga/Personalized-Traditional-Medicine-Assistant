// backend/index.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const connectDB = require("./src/config/db");
const voiceRoutes = require("./src/routes/health-profile-analysis/voice");

// 🧠 Dosha / Prakriti routes
const chatRoutes = require("./src/dosha-diagnosis/routes/chat.routes");
const prakritiRoutes = require("./src/dosha-diagnosis/routes/prakriti.routes");
const prakritiReportRoutes = require("./src/dosha-diagnosis/routes/prakritiReport.routes");

// ⚙️ Main auth & user routes
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/userRoutes");

// 🛑 Error handlers
const {
  notFound,
  errorHandler,
} = require("./src/dosha-diagnosis/middleware/errorHandler");

dotenv.config();

const app = express();

// ---------- MIDDLEWARE ----------
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ---------- DB ----------
connectDB();

// ---------- HEALTH PROFILE ROUTES ----------
app.use("/api/voice", voiceRoutes);
app.use(
  "/api/my-profile",
  require("./src/routes/health-profile-analysis/healthProfile")
);
app.use(
  "/api/health-prediction",
  require("./src/routes/health-profile-analysis/healthPrediction")
);

app.use("/api/patient-input", require("./src/routes/health-profile-analysis/patientInput"));
app.use("/api/prakriti", require("./src/routes/health-profile-analysis/prakritiGet"));



// ---------- HEALTH CHECK ----------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend API running" });
});

// ---------- AUTH & USER ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// ---------- DOSHA / PRAKRITI ROUTES ----------
app.use("/api/chat", chatRoutes);
app.use("/api/prakriti", prakritiRoutes);

// 👇 Prescription / history routes
// Full URL: POST http://localhost:5000/api/prakritiReports/reports
app.use("/api/prakritiReports", prakritiReportRoutes);

// ---------- ERROR HANDLERS ----------
app.use(notFound);
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});


