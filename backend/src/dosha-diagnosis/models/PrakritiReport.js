// backend/src/models/PrakritiReport.js
const mongoose = require("mongoose");

const prakritiReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    dominantDosha: {
      type: String,
      enum: ["Vata", "Pitta", "Kapha", "Mixed", "Unknown"],
      default: "Unknown",
    },
    ruleBasedResult: {
      type: Object, // raw JSON from python-ml-service rule-based logic
    },
    modelBasedResult: {
      type: Object, // raw JSON from ML model
    },
    meta: {
      type: Object, // age, gender, notes, etc.
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PrakritiReport", prakritiReportSchema);
