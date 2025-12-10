// backend/src/dosha-diagnosis/controllers/prakritiReport.controller.js
const PrakritiReport = require("../models/PrakritiReport");

// POST /api/prakritiReports/reports
exports.createPrakritiReport = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      vataScore,
      pittaScore,
      kaphaScore,
      dominantDosha,
      recommendations,
      capturedRegions,
    } = req.body;

    if (
      typeof vataScore !== "number" ||
      typeof pittaScore !== "number" ||
      typeof kaphaScore !== "number"
    ) {
      return res.status(400).json({
        success: false,
        message: "vataScore, pittaScore, kaphaScore must be numbers",
      });
    }

    const report = await PrakritiReport.create({
      user: userId,
      vataScore,
      pittaScore,
      kaphaScore,
      dominantDosha: dominantDosha || "Not enough data",
      recommendations: recommendations || {},
      capturedRegions: capturedRegions || {},
    });

    return res.status(201).json({
      success: true,
      report,
    });
  } catch (err) {
    console.error("Error creating prakriti report:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while saving prakriti report",
      error: err.message,
    });
  }
};
