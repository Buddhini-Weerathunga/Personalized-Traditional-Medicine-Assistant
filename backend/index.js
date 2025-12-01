<<<<<<< HEAD
// backend/index.js
// Load environment variables FIRST
require("dotenv").config();
=======
// index.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");
>>>>>>> origin/main


const http = require("http");
const app = require("./src/app");
const { loadEnv } = require("./src/config/env");
const { connectDB } = require("./src/config/db");
const { logger } = require("./src/utils/logger");
const axios = require("axios");

<<<<<<< HEAD
// Load environment variables
loadEnv();

// PORT fallback: if 5000 is busy -> use next available port
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    const server = http.createServer(app);

    server.listen(PORT, () => {
      logger.info(`🚀 Backend running on http://localhost:${PORT}`);
    });

    // Handle port already in use
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        logger.error(`❌ PORT ${PORT} is already in use!`);
        logger.error(
          "➡ Try closing the existing process or change PORT in .env"
        );
        process.exit(1);
      } else {
        throw err;
      }
    });
  } catch (err) {
    logger.error("❌ Server startup failed:");
    logger.error(err.message);
    process.exit(1);
  }
}

startServer();
=======
// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Connect MongoDB
connectDB();

// Routes
app.use("/api/auth", require("./src/routes/auth"));
app.use("/api/user", require("./src/routes/userRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
>>>>>>> origin/main
