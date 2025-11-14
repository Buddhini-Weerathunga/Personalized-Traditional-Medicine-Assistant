// backend/src/controllers/prakriti.controller.js
const PrakritiReport = require("../models/PrakritiReport");
const { analyzePrakriti } = require("../services/pythonService");

async function analyze(req, res, next) {
  try {
    const { imageBase64, meta } = req.body;

    if (!imageBase64) {
      res.status(400);
      throw new Error("imageBase64 is required");
    }

    // Call python ML service
    const mlResult = await analyzePrakriti(imageBase64);

    const dominant = mlResult.dominant_dosha || mlResult.dosha || "Unknown";

    const report = await PrakritiReport.create({
      user: req.user ? req.user._id : null,
      dominantDosha: dominant,
      ruleBasedResult: mlResult.rule_based || mlResult,
      modelBasedResult: mlResult.model_based || null,
      meta: meta || {},
    });

    res.json({
      message: "Prakriti analysis completed",
      report,
      mlResult,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { analyze };
