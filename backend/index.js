// backend/index.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./src/config/db");

// 🧠 Dosha / Prakriti routes
const chatRoutes = require("./src/dosha-diagnosis/routes/chat.routes");
const prakritiRoutes = require("./src/dosha-diagnosis/routes/prakriti.routes");
const prakritiReportRoutes = require("./src/dosha-diagnosis/routes/prakritiReport.routes");

// ⚙️ Main auth & user routes (your existing ones)
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/userRoutes");

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
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ---------- DB ----------
connectDB();

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
// Full URL: POST http://localhost:5000/api/prakritiReports/reports
app.use("/api/prakritiReports", prakritiReportRoutes);

// ---------- ERROR HANDLERS ----------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
