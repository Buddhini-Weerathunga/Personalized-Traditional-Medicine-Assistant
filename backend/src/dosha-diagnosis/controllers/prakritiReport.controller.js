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

// GET /api/prakritiReports/reports
exports.getMyPrakritiReports = async (req, res) => {
  try {
    const userId = req.user._id;

    const reports = await PrakritiReport.find({ user: userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      reports,
    });
  } catch (err) {
    console.error("Error fetching prakriti reports:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching prakriti reports",
      error: err.message,
    });
  }
};

// GET /api/prakritiReports/reports/:id
exports.getPrakritiReportById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const report = await PrakritiReport.findOne({ _id: id, user: userId });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (err) {
    console.error("Error fetching single prakriti report:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching prakriti report",
      error: err.message,
    });
  }
};

// PUT /api/prakritiReports/reports/:id
exports.updatePrakritiReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    // For now we allow updating any fields the frontend sends (mainly "recommendations")
    const updates = req.body;

    const report = await PrakritiReport.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: updates },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (err) {
    console.error("Error updating prakriti report:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating prakriti report",
      error: err.message,
    });
  }
};

// DELETE /api/prakritiReports/reports/:id
exports.deletePrakritiReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const deleted = await PrakritiReport.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting prakriti report:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting prakriti report",
      error: err.message,
    });
  }
};
