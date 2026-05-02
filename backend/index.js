// backend/index.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDB = require("./src/config/db");
const voiceRoutes = require("./src/routes/health-profile-analysis/voice");

// 🧠 Dosha / Prakriti routes
const chatRoutes = require("./src/dosha-diagnosis/routes/chat.routes");
const prakritiRoutes = require("./src/dosha-diagnosis/routes/prakriti.routes");
const prakritiReportRoutes = require("./src/dosha-diagnosis/routes/prakritiReport.routes");

// 🌿 Plant Identification routes
const plantRoutes = require("./src/routes/plant-identification/plantRoutes");

// ⚙️ Main auth & user routes (your existing ones)
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/userRoutes");

// 🧘 Yoga routes - ADD THIS LINE
const yogaRoutes = require("./src/routes/yoga");

// 🛑 Error handlers (from dosha-diagnosis)
const {
  notFound,
  errorHandler,
} = require("./src/dosha-diagnosis/middleware/errorHandler");

dotenv.config();

const app = express();

// ---------- MIDDLEWARE ----------
app.use(
  cors({
    origin: /localhost:3000|127\.0\.0\.1:3000/,
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ---------- DB ----------
connectDB();

// Routes
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/user", require("./src/routes/userRoutes"));
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

// 🧘 ADD YOGA ROUTES HERE - IMPORTANT: Place this before error handlers
app.use("/api/yoga", yogaRoutes);
// ---------- PLANT IDENTIFICATION ROUTES ----------
app.use("/api/plant-identification", plantRoutes);

// ---------- HEALTH CHECK ----------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend API running" });
});

// ---------- EXISTING APP ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// ---------- DOSHA / PRAKRITI ROUTES ----------
app.use("/api/chat", chatRoutes);
app.use("/api/prakriti", prakritiRoutes);

// 👇 New prescription/history routes
app.use("/api/prakritiReports", prakritiReportRoutes);

// ---------- ERROR HANDLERS ----------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// TEST ENDPOINT - Add this temporarily
app.post('/api/yoga/test-analyze', (req, res) => {
  console.log('✅ TEST ENDPOINT HIT');
  console.log('Request body:', req.body);
  
  // Always return success for testing
  res.json({
    success: true,
    corrections: [],
    feedback: {
      postureAccuracy: 85,
      alignmentScore: 90,
      suggestions: ['Test mode: backend is working!'],
      validJointsCount: 8
    },
    score: 87
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});