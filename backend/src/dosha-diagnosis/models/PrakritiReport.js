// backend/src/dosha-diagnosis/models/PrakritiReport.js
const mongoose = require("mongoose");

const prakritiReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vataScore: { type: Number, required: true },
    pittaScore: { type: Number, required: true },
    kaphaScore: { type: Number, required: true },
    dominantDosha: {
      type: String,
      required: true,
      enum: ["Vata", "Pitta", "Kapha", "Not enough data"],
      default: "Not enough data",
    },
    recommendations: { type: Object, default: {} },
    capturedRegions: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PrakritiReport", prakritiReportSchema);
