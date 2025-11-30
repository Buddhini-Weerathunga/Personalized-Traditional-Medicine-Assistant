// src/routes/auth.js
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  refreshToken,
} = require("../controllers/userController");
const rateLimiter = require("../middleware/rateLimiter");

// Public routes
router.post("/register", rateLimiter, register);
router.post("/login", rateLimiter, login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

module.exports = router;