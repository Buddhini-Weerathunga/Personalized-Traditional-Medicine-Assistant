<<<<<<< HEAD
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
=======
// db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // stop server if DB fails
  }
};

module.exports = connectDB;
>>>>>>> origin/main
