// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Protected routes
router.get("/profile", authMiddleware, getProfile);

module.exports = router;