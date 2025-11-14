// backend/src/routes/prakriti.routes.js
const express = require("express");
const { analyze } = require("../controllers/prakriti.controller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// You can add `protect` if you want only logged-in users to analyze
router.post("/analyze", analyze);

module.exports = router;
