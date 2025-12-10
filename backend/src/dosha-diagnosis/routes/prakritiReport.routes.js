// backend/src/dosha-diagnosis/routes/prakritiReport.routes.js

const express = require("express");
const router = express.Router();

// Get the protect middleware function
const { protect } = require("../middleware/authMiddleware");

const {
  createPrakritiReport,
  getMyPrakritiReports,
} = require("../controllers/prakritiReport.controller");

// POST /api/prakritiReports/reports
router.post("/reports", protect, createPrakritiReport);

// GET /api/prakritiReports/reports
router.get("/reports", protect, getMyPrakritiReports);

module.exports = router;
