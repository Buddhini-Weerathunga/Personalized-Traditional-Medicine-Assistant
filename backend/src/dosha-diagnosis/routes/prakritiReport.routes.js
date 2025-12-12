// backend/src/dosha-diagnosis/routes/prakritiReport.routes.js

const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createPrakritiReport,
  getMyPrakritiReports,
  getPrakritiReportById,
  updatePrakritiReport,
  deletePrakritiReport,
} = require("../controllers/prakritiReport.controller");

// POST /api/prakritiReports/reports   (save new prescription)
router.post("/reports", protect, createPrakritiReport);

// GET /api/prakritiReports/reports    (list all prescriptions)
router.get("/reports", protect, getMyPrakritiReports);

// GET /api/prakritiReports/reports/:id    (single prescription for detail page)
router.get("/reports/:id", protect, getPrakritiReportById);

// PUT /api/prakritiReports/reports/:id    (update notes, etc.)
router.put("/reports/:id", protect, updatePrakritiReport);

// DELETE /api/prakritiReports/reports/:id (delete one prescription)
router.delete("/reports/:id", protect, deletePrakritiReport);

module.exports = router;
