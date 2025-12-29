// backend/src/models/ChatHistory.js
const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // allow anonymous
    },
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      default: "user",
    },
    message: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatHistory", chatHistorySchema);
