// backend/src/dosha-diagnosis/models/PrakritiReport.js
const mongoose = require("mongoose");

const PrakritiReportSchema = new mongoose.Schema(
  {
    // Which user this report belongs to
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ------------ OLD FIELDS (from your previous design) ------------
    // If you still use them from /analyze (image-based)
    faceImageUrl: {
      type: String,
    },
    faceFeatures: {
      type: Object,
    },
    modelBasedResult: {
      type: Object,
    },
    ruleBasedResult: {
      type: Object,
    },
    combinedResult: {
      type: Object,
    },

    // ------------ NEW FIELDS (for frontend-computed prakriti) ------------
    // Final combined prakriti scores (0–1 or percentages)
    vataScore: {
      type: Number, // store 0–1 OR 0–100 (you decide; frontend must be consistent)
    },
    pittaScore: {
      type: Number,
    },
    kaphaScore: {
      type: Number,
    },
    dominantDosha: {
      type: String, // "Vata" | "Pitta" | "Kapha"
    },

    // Optional: store generated recommendations (diet, lifestyle, notes)
    recommendations: {
      type: Object,
    },

    // Optional: raw region-level ML outputs from frontend
    capturedRegions: {
      type: Object, // e.g. { face: {...}, eyes: {...}, mouth: {...}, ... }
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("PrakritiReport", PrakritiReportSchema);
