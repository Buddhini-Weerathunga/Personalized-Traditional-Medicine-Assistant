// backend/index.js
const http = require("http");
const app = require("./src/app");
const { loadEnv } = require("./src/config/env");
const { connectDB } = require("./src/config/db");
const { logger } = require("./src/utils/logger");
const axios = require("axios");

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
