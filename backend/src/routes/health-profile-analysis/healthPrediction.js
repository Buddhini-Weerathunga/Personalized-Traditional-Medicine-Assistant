const express = require("express");
const router = express.Router();

// 🔐 Auth middleware (adjust path if needed)
const auth = require("../../middleware/authMiddleware");

// 🎯 Controller
const {
  analyzeHealthProfile
} = require("../../controllers/health-profile-analysis/healthController");

// 🔮 ML prediction route
// POST /api/health/predict
router.post("/predict", auth, analyzeHealthProfile);

module.exports = router;
