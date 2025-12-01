// backend/src/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const {notFound,errorHandler,} = require("./dosha-diagnosis/middleware/errorHandler");

// ✅ Correct route paths
const authRoutes = require("./dosha-diagnosis/routes/auth.routes");
const chatRoutes = require("./dosha-diagnosis/routes/chat.routes");
const prakritiRoutes = require("./dosha-diagnosis/routes/prakriti.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend API running" });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/prakriti", prakritiRoutes);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
