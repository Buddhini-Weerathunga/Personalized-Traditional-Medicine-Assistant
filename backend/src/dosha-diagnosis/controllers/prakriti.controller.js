// backend/src/controllers/prakriti.controller.js
const PrakritiReport = require("../models/PrakritiReport");
const { analyzePrakriti } = require("../services/pythonService");

/**
 * POST /api/prakriti/analyze
 * Body: { imageBase64: string, meta?: object }
 */
async function analyze(req, res, next) {
  try {
    const { imageBase64, meta } = req.body;

    if (!imageBase64) {
      res.status(400);
      throw new Error("imageBase64 is required");
    }

    // Call Python ML service
    const mlResult = await analyzePrakriti(imageBase64);

    // Derive dominant dosha from python result
    let dominantDosha = "Unknown";
    if (mlResult && mlResult.dominant_dosha) {
      const d = mlResult.dominant_dosha.toLowerCase();
      if (d.includes("vata")) dominantDosha = "Vata";
      else if (d.includes("pitta")) dominantDosha = "Pitta";
      else if (d.includes("kapha")) dominantDosha = "Kapha";
      else if (d.includes("mixed")) dominantDosha = "Mixed";
    }

    const userId = req.user ? req.user._id : null;

    const report = await PrakritiReport.create({
      user: userId,
      dominantDosha,
      ruleBasedResult: mlResult.rule_based || mlResult.rule_based_result || {},
      modelBasedResult:
        mlResult.model_based || mlResult.model_based_result || {},
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
