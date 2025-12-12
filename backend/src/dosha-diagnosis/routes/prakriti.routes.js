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
      throw new Error("image_base64 field is required");
    }

    const result = await analyzePrakriti(image_base64);
    return res.json(result);
  } catch (err) {
    console.error("Error in /api/prakriti/analyze:", err);
    return next(err);
  }
});

module.exports = router;
