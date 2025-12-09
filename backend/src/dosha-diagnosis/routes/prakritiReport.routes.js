// backend/routes/prakritiReport.routes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createPrakritiReport,
  getMyPrakritiReports,
  getPrakritiReportById,
  updatePrakritiReport,
  deletePrakritiReport,
} = require("../controllers/prakritiReport.controller");

// POST /api/prakriti/reports  -> save one report
router.post("/reports", auth, createPrakritiReport);

// GET /api/prakriti/reports   -> list all my reports
router.get("/reports", auth, getMyPrakritiReports);

// GET /api/prakriti/reports/:id -> get one report
router.get("/reports/:id", auth, getPrakritiReportById);

// PUT /api/prakriti/reports/:id -> update (e.g. recommendations/notes)
router.put("/reports/:id", auth, updatePrakritiReport);

// DELETE /api/prakriti/reports/:id -> delete one
router.delete("/reports/:id", auth, deletePrakritiReport);

module.exports = router;
