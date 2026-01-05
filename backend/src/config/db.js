// db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.log("⚠️ Server will continue running without database - some features may not work");
    // Don't exit - allow server to continue for features that don't need DB
    // process.exit(1);
  }
};

module.exports = connectDB;
