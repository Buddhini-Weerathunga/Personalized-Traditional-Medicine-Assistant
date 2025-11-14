// backend/src/config/db.js
const mongoose = require("mongoose");
const { logger } = require("../utils/logger");

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined in .env");
  }

  try {
    await mongoose.connect(uri);
    logger.info("✅ Connected to MongoDB");
  } catch (error) {
    logger.error("❌ MongoDB connection error");
    logger.error(error.message);
    throw error;
  }
}

module.exports = { connectDB };
