const express = require("express");
const router = express.Router();
// 🔐 Auth middleware (adjust path if needed)
const auth = require("../../middleware/authMiddleware");
const {
  saveOrUpdatePatientInput,
} = require("../../controllers/health-profile-analysis/patientInputController");

router.post("/", auth, saveOrUpdatePatientInput);

module.exports = router;
