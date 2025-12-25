const express = require("express");
const router = express.Router();
const controller = require("../../controllers/health-profile-analysis/healthController");
const protect = require("../../middleware/authMiddleware");

// 🔐 Predict using logged-in user's latest profile
router.get("/predict/me", protect, controller.predictMyProfile);

module.exports = router;
