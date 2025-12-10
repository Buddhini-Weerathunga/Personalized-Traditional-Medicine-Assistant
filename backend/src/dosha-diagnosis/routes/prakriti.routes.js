// backend/src/dosha-diagnosis/routes/prakriti.routes.js

const express = require("express");
const router = express.Router();

const { analyzePrakriti } = require("../services/pythonService");

/**
 * POST /api/prakriti/analyze
 * Body: { image_base64: "<BASE64_STRING>" }
 */
router.post("/analyze", async (req, res, next) => {
  try {
    const { image_base64 } = req.body;

    if (!image_base64) {
      res.status(400);
      return next(new Error("image_base64 field is required"));
    }

    // Call Python ML service
    const result = await analyzePrakriti(image_base64);

    // Send result back to frontend
    return res.json(result);
  } catch (err) {
    console.error("Error in /api/prakriti/analyze:", err.message);
    return next(err);
  }
});

module.exports = router;
