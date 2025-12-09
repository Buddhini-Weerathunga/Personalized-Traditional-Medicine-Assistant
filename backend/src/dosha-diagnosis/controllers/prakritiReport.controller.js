// backend/controllers/prakritiReport.controller.js
const PrakritiReport = require("../models/PrakritiReport"); // adjust path

// POST /api/prakriti/reports
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

    const report = await PrakritiReport.create({
      user: userId,
      vataScore,
      pittaScore,
      kaphaScore,
      dominantDosha,
      recommendations: recommendations || {},
      capturedRegions: capturedRegions || {},
    });

    return res.status(201).json({ report });
  } catch (err) {
    console.error("createPrakritiReport error:", err);
    return res.status(500).json({ message: "Failed to create report" });
  }
};

// GET /api/prakriti/reports
exports.getMyPrakritiReports = async (req, res) => {
  try {
    const userId = req.user._id;

    const reports = await PrakritiReport.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ reports });
  } catch (err) {
    console.error("getMyPrakritiReports error:", err);
    return res.status(500).json({ message: "Failed to fetch reports" });
  }
};

// GET /api/prakriti/reports/:id
exports.getPrakritiReportById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const report = await PrakritiReport.findOne({
      _id: id,
      user: userId,
    }).lean();
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.json({ report });
  } catch (err) {
    console.error("getPrakritiReportById error:", err);
    return res.status(500).json({ message: "Failed to fetch report" });
  }
};

// PUT /api/prakriti/reports/:id
exports.updatePrakritiReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { recommendations } = req.body; // we mainly allow editing recommendations/notes

    const report = await PrakritiReport.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: { recommendations: recommendations || {} } },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.json({ report });
  } catch (err) {
    console.error("updatePrakritiReport error:", err);
    return res.status(500).json({ message: "Failed to update report" });
  }
};

// DELETE /api/prakriti/reports/:id
exports.deletePrakritiReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const report = await PrakritiReport.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.json({ message: "Report deleted" });
  } catch (err) {
    console.error("deletePrakritiReport error:", err);
    return res.status(500).json({ message: "Failed to delete report" });
  }
};
