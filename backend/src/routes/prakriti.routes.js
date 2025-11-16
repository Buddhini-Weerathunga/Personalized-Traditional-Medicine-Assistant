// backend/src/routes/prakriti.routes.js
const express = require("express");
const axios = require("axios");
const { analyze } = require("../controllers/prakriti.controller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Image-based analysis (your existing route)
router.post("/analyze", analyze);

// ----------------------------------------------
// NEW — Feature-based analysis (no image)
// POST /api/prakriti/analyze-features
// ----------------------------------------------
router.post("/analyze-features", async (req, res) => {
  try {
    const pythonResponse = await axios.post(
      "http://127.0.0.1:8001/analyze-features",
      req.body
    );

    return res.json(pythonResponse.data);
  } catch (err) {
    console.error("Error calling python ML service:", err.message);

    if (err.response) {
      console.error("Python error data:", err.response.data);
      return res.status(500).json({
        message: "Python ML service error",
        detail: err.response.data,
      });
    }

    return res.status(500).json({
      message: "Could not reach python ML service",
      detail: err.message,
    });
  }
});

module.exports = router;
